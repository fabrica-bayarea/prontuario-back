import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import {
  SignInUsuarioDto,
  SignUpUsuarioDto,
  SignInBeneficiarioDto,
  SignUpBeneficiarioDto,
} from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { Beneficiario } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(
    idUsuario: number,
    tipo: 'ADMINISTRADOR' | 'CADASTRADOR' | 'BENEFICIARIO',
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: idUsuario,
      tipo,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }

  async signUpUsuario(
    dto: SignUpUsuarioDto,
  ): Promise<{ access_token: string } | never> {
    const hash = await argon.hash(dto.senha);
    try {
      const dadosUsuario: any = {
        nome: dto.nome,
        email: dto.email,
        tipo: dto.tipo,
        hash: hash,
      };

      if (dto.telefone) {
        dadosUsuario.telefone = dto.telefone;
      }

      const usuario = await this.prisma.usuario.create({
        data: dadosUsuario,
      });

      delete usuario.hash;
      return this.signToken(usuario.id, usuario.tipo);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credenciais tomadas');
        }
      }
      throw err;
    }
  }

  async signUpBeneficiario(
    dto: SignUpBeneficiarioDto,
  ): Promise<{ access_token: string } | never> {
    const hash = await argon.hash(dto.senha);
    try {
      const dadosBeneficiario: any = {
        nome: dto.nome,
        cpf: dto.cpf,
        email: dto.email,
        telefone: dto.telefone,
        tipo: dto.tipo,
        hash: hash,
      };
      if (dto.telefone) {
        dadosBeneficiario.telefone = dto.telefone;
      }

      const beneficiario = await this.prisma.beneficiario.create({
        data: dadosBeneficiario,
      });

      delete beneficiario.hash;
      return this.signToken(beneficiario.id, beneficiario.tipo);
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
  ): Promise<{ access_token: string } | never> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (!usuario) throw new ForbiddenException('Credenciais inválidas');

    const senhaCorreta = await argon.verify(usuario.hash, dto.senha);

    if (!senhaCorreta) throw new ForbiddenException('Credenciais incorretas');
    return this.signToken(usuario.id, usuario.tipo);
  }

  async signInBeneficiario(
    dto: SignInBeneficiarioDto,
  ): Promise<{ access_token: string } | never> {
    if (!dto.cpf && !dto.email) {
      throw new BadRequestException('É necessário fornecer CPF ou email.');
    }

    let beneficiario: Beneficiario;

    if (dto.cpf) {
      beneficiario = await this.prisma.beneficiario.findUnique({
        where: { cpf: dto.cpf },
      });
    } else if (dto.email) {
      beneficiario = await this.prisma.beneficiario.findUnique({
        where: { email: dto.email },
      });
    }

    if (!beneficiario) {
      throw new ForbiddenException('Credenciais inválidas');
    }

    const senhaCorreta = await argon.verify(beneficiario.hash, dto.senha);

    if (!senhaCorreta) {
      throw new ForbiddenException('Credenciais incorretas');
    }

    return this.signToken(beneficiario.id, beneficiario.tipo);
  }

  async isAdministrator(idUsuario: number): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    return usuario?.tipo === 'ADMINISTRADOR';
  }

  async isCadastrador(idUsuario: number): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    return usuario?.tipo === 'CADASTRADOR';
  }
}
