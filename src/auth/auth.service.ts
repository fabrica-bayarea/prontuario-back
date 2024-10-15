import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  SignInUsuarioDto,
  SignUpUsuarioDto,
  updatePasswordDto,
} from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { Usuario } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

  async updatePassword(
    idUser: number,
    passwordDto: updatePasswordDto,
  ): Promise<{ access_token: string }> {

    const user = await this.prisma.usuario.findUnique({
      where: { id: idUser },
    });

    await argon.hash(passwordDto.currentPass);
    if (!(await argon.verify(user.hash, passwordDto.currentPass))){
      throw new BadRequestException('Incorrect password!')
    }
    
    const newHash = await argon.hash(passwordDto.newPass);
    if (await argon.verify(user.hash, passwordDto.newPass)) {
      throw new BadRequestException('The new password cannot be the same as the old one!');
    }

    if (!(passwordDto.newPass === passwordDto.repeatNewPass)){
      throw new BadRequestException("The passwords don't match!")
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
}
