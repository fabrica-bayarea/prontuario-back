import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { createDependenteDto } from './dependente.dto';
import { Dependente } from '@prisma/client';

@Injectable()
export class DependenteService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createDependente(
    idUser: number,
    dto: createDependenteDto,
  ): Promise<Dependente> {
    const dependente = await this.prisma.dependente.create({
      data: {
        nome: dto.nome,
        sobrenome: dto.sobrenome,
        nascimento: new Date(dto.nascimento),
        cpf: dto.cpf,
        email: dto.email,
        telefone: dto.telefone,
        genero: dto.genero,
        parentesco: dto.parentesco,
        necessidade_especial: dto.necessidade_especial,
        Usuario: {
          connect: { id: idUser },
        },
      },
    });
    return dependente;
  }
}
