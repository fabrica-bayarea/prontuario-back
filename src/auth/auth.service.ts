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
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(
    idUsuario: number,
    userType: 'ADMINISTRATOR' | 'REGISTRAR' | 'COLLABORATOR' | 'BENEFICIARY',
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: idUsuario,
      userType,
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
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email: dto.email }, { cpf: dto.cpf }],
          },
        });

        if (existingUser) {
          throw new ForbiddenException('Credenciais tomadas');
        }

        const hasAdmin = await prisma.user.findUnique({
          where: { id: 1 },
        });

        const dadosUsuario: any = {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          cpf: dto.cpf,
          userType: !hasAdmin ? 'ADMINISTRATOR' : 'BENEFICIARY',
          city: dto.city,
          cep: dto.cep,
          address: dto.address,
          birthDate: new Date(dto.birthDate),
          gender: dto.gender,
          hash: hash,
          registration: dto.registration,
        };

        if (dto.phone) {
          dadosUsuario.phone = dto.phone;
        }

        const user = await prisma.user.create({
          data: dadosUsuario,
        });

        delete user.hash;

        const { access_token } = await this.signToken(user.id, user.userType);
        return {
          access_token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            cpf: user.cpf,
            email: user.email,
            userType: user.userType,
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
  ): Promise<{ access_token: string; user: any } | never> {
    if (!dto.cpf && !dto.email) {
      throw new BadRequestException('É necessário fornecer CPF ou email.');
    }

    let user: User;

    if (dto.cpf) {
      user = await this.prisma.user.findUnique({
        where: { cpf: dto.cpf },
      });
    } else if (dto.email) {
      user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
    }

    if (!user) throw new ForbiddenException('Credenciais inválidas');

    const senhaCorreta = await argon.verify(user.hash, dto.senha);

    if (!senhaCorreta) throw new ForbiddenException('Credenciais incorretas');

    const isActive = await this.isActive(user.id);

    if (!isActive) throw new ForbiddenException('User desativado');

    const { access_token } = await this.signToken(user.id, user.userType);
    const response = {
      access_token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        cpf: user.cpf,
        email: user.email,
        userType: user.userType,
      },
    };
    return response;
  }

  async updatePassword(
    idUser: number,
    passwordDto: updatePasswordDto,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
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
    await this.prisma.user.update({
      where: {
        id: idUser,
      },
      data: {
        hash: newHash,
      },
    });

    const { access_token } = await this.signToken(user.id, user.userType);

    const response = {
      access_token,
    };
    return response;
  }

  async disableUser(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { active: false },
    });
  }

  async isAdministrator(idUsuario: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: idUsuario },
    });

    return user?.userType === 'ADMINISTRATOR';
  }

  async isBeneficiario(idUsuario: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: idUsuario },
    });

    return user?.userType === 'BENEFICIARY';
  }

  async isColaborador(idUsuario: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: idUsuario },
    });

    return user?.userType === 'COLLABORATOR';
  }

  async isCadastrador(idUsuario: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: idUsuario },
    });

    return user?.userType === 'REGISTRAR';
  }

  async isActive(idUsuario: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: idUsuario },
    });

    return user?.active;
  }
}
