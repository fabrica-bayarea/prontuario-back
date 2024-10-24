import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { createDependenteDto } from './dependente.dto';
import { Dependent } from '@prisma/client';

@Injectable()
export class DependenteService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createDependente(
    idUser: number,
    dto: createDependenteDto,
  ): Promise<Dependent> {
    const dependent = await this.prisma.dependent.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        birthDate: new Date(dto.birthDate),
        cpf: dto.cpf,
        email: dto.email,
        phone: dto.phone,
        gender: dto.gender,
        relationship: dto.relationship,
        specialNeeds: dto.specialNeeds,
        User: {
          connect: { id: idUser },
        },
      },
    });
    return dependent;
  }
}
