import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

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
    userType: 'ADMINISTRADOR' | 'CADASTRADOR' | 'BENEFICIARIO';
  }): Promise<User> {
    if (
      !['ADMINISTRADOR', 'CADASTRADOR', 'BENEFICIARIO'].includes(
        payload.userType,
      )
    ) {
      throw new UnauthorizedException('Tipo de usuário inválido');
    }

    let user: User;
    try {
      switch (payload.userType) {
        case 'ADMINISTRADOR':
          user = await this.prisma.user.findUnique({
            where: {
              id: payload.sub,
            },
          });
          break;
        case 'CADASTRADOR':
          user = await this.prisma.user.findUnique({
            where: {
              id: payload.sub,
            },
          });
          break;
        case 'BENEFICIARIO':
          user = await this.prisma.user.findUnique({
            where: {
              id: payload.sub,
            },
          });
          break;
      }
    } catch (err) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!user || typeof user !== 'object') {
      throw new UnauthorizedException('Usuário inválido');
    }

    delete user.hash;
    return user;
  }
}
