import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  forgotPasswordDto,
  SignInUsuarioDto,
  SignUpUsuarioDto,
  updatePasswordDto,
} from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { Usuario } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { env } from 'process';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  async signToken(
    idUsuario: number,
    tipo: 'ADMINISTRADOR' | 'CADASTRADOR' | 'COLABORADOR' | 'BENEFICIARIO',
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: idUsuario,
      tipo,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '2h',
    });
    return { access_token: token };
  }

  async signUpUsuario(
    dto: SignUpUsuarioDto,
  ): Promise<{ access_token: string } | never> {
    const hash = await argon.hash(dto.senha);
    try {
      const response = await this.prisma.$transaction(async prisma => {
        const existingUser = await prisma.usuario.findFirst({
          where: {
            OR: [{ email: dto.email }, { cpf: dto.cpf }],
          },
        });

        if (existingUser) {
          throw new ForbiddenException('Credenciais tomadas');
        }

        const hasAdmin = await prisma.usuario.findUnique({
          where: { id: 1 },
        });

        const dadosUsuario: any = {
          nome: dto.nome,
          sobrenome: dto.sobrenome,
          email: dto.email,
          cpf: dto.cpf,
          tipo: !hasAdmin ? 'ADMINISTRADOR' : 'BENEFICIARIO',
          cidade: dto.cidade,
          cep: dto.cep,
          endereco: dto.endereco,
          nascimento: new Date(dto.nascimento),
          genero: dto.genero,
          hash: hash,
          matricula: dto.matricula,
        };

        if (dto.telefone) {
          dadosUsuario.telefone = dto.telefone;
        }

        const usuario = await prisma.usuario.create({
          data: dadosUsuario,
        });

        delete usuario.hash;

        const { access_token } = await this.signToken(usuario.id, usuario.tipo);
        return {
          access_token,
          usuario: {
            id: usuario.id,
            nome: usuario.nome,
            sobrenome: usuario.sobrenome,
            cpf: usuario.cpf,
            email: usuario.email,
            tipo: usuario.tipo,
          },
        };
      });

      return response;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credenciais tomadas');
        }
      }
      throw err;
    }
  }

  async signInUsuario(
    dto: SignInUsuarioDto,
  ): Promise<{ access_token: string; usuario: any } | never> {
    if (!dto.cpf && !dto.email) {
      throw new BadRequestException('É necessário fornecer CPF ou email.');
    }

    let usuario: Usuario;

    if (dto.cpf) {
      usuario = await this.prisma.usuario.findUnique({
        where: { cpf: dto.cpf },
      });
    } else if (dto.email) {
      usuario = await this.prisma.usuario.findUnique({
        where: { email: dto.email },
      });
    }

    if (!usuario) throw new ForbiddenException('Credenciais inválidas');

    const senhaCorreta = await argon.verify(usuario.hash, dto.senha);

    if (!senhaCorreta) throw new ForbiddenException('Credenciais incorretas');

    const isActive = await this.isActive(usuario.id);

    if (!isActive) throw new ForbiddenException('Usuario desativado');

    const { access_token } = await this.signToken(usuario.id, usuario.tipo);
    const response = {
      access_token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        cpf: usuario.cpf,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    };
    return response;
  }

  async updatePassword(
    idUser: number,
    passwordDto: updatePasswordDto,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.usuario.findUnique({
      where: { id: idUser },
    });

    await argon.hash(passwordDto.current_pass);
    if (!(await argon.verify(user.hash, passwordDto.current_pass))) {
      throw new BadRequestException('Incorrect password!');
    }

    const newHash = await argon.hash(passwordDto.new_pass);
    if (await argon.verify(user.hash, passwordDto.new_pass)) {
      throw new BadRequestException(
        'The new password cannot be the same as the old one!',
      );
    }

    if (!(passwordDto.new_pass === passwordDto.repeat_new_pass)) {
      throw new BadRequestException("The passwords don't match!");
    }
    await this.prisma.usuario.update({
      where: {
        id: idUser,
      },
      data: {
        hash: newHash,
      },
    });

    const { access_token } = await this.signToken(user.id, user.tipo);

    const response = {
      access_token,
    };
    return response;
  }

  async forgotPassword(forgotPasswordDto: forgotPasswordDto) {

    const userEmail = await this.prisma.usuario.findUnique({
      where: {
        email: forgotPasswordDto.email
      }
    });

    if (!userEmail) {
      throw new BadRequestException("User not found")
    }

    const transporter = nodemailer.createTransport({
      host: env.HOST,
      port: 465,
      auth: {
        user: env.EMAIL,
        pass: env.PASS
      },
    });

    const newPassword = crypto.randomInt(10000000).toString();

    await transporter.sendMail({
      from: "Administrador <demoemail.com>",
      to: forgotPasswordDto.email,
      subject: "Recuperação de senha",
      text: 'Olá, sua nova senha para acessar o sistema é: ' + newPassword,
      html: '<p>Olá, sua nova senha para acessar o sistema é: ' + newPassword + '</p>',
    });

    const newPasswordHash = await argon.hash(newPassword);

    await this.prisma.usuario.update({
      where: {
        email: forgotPasswordDto.email
      },
      data: {
        hash: newPasswordHash
      }
    })
  }

  async disableUser(id: number): Promise<void> {
    await this.prisma.usuario.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async isAdministrator(idUsuario: number): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    return usuario?.tipo === 'ADMINISTRADOR';
  }

  async isBeneficiario(idUsuario: number): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    return usuario?.tipo === 'BENEFICIARIO';
  }

  async isColaborador(idUsuario: number): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    return usuario?.tipo === 'COLABORADOR';
  }

  async isCadastrador(idUsuario: number): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    return usuario?.tipo === 'CADASTRADOR';
  }

  async isActive(idUsuario: number): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    return usuario?.ativo;
  }
}
