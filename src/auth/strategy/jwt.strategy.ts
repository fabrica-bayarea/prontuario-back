import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Beneficiario, Usuario } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    sub: number;
    tipo: 'ADMINISTRADOR' | 'CADASTRADOR' | 'BENEFICIARIO';
  }): Promise<Usuario | Beneficiario> {
    if (
      !['ADMINISTRADOR', 'CADASTRADOR', 'BENEFICIARIO'].includes(payload.tipo)
    ) {
      throw new UnauthorizedException('Tipo de usuário inválido');
    }

    let usuario: Usuario | Beneficiario;
    try {
      switch (payload.tipo) {
        case 'ADMINISTRADOR':
          usuario = await this.prisma.usuario.findUnique({
            where: {
              id: payload.sub,
            },
          });
          break;
        case 'CADASTRADOR':
          usuario = await this.prisma.usuario.findUnique({
            where: {
              id: payload.sub,
            },
          });
          break;
        case 'BENEFICIARIO':
          usuario = await this.prisma.beneficiario.findUnique({
            where: {
              id: payload.sub,
            },
          });
          break;
      }
    } catch (err) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!usuario || typeof usuario !== 'object') {
      throw new UnauthorizedException('Usuário inválido');
    }

    delete usuario.hash;
    return usuario;
  }
}
