import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Curso } from '@prisma/client';
import { CreateCursoDto, UpdateCursoDto } from './curso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CursoService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createCurso(
    idUsuario: number,
    createCursoDto: CreateCursoDto,
  ): Promise<Curso> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const repetido = await this.prisma.curso.findUnique({
      where: { nome: createCursoDto.nome },
    });

    if (repetido) {
      throw new BadRequestException('nome do curso deve ser único');
    }

    return this.prisma.curso.create({
      data: {
        nome: createCursoDto.nome,
        turno: createCursoDto.turno,
        coordenador: createCursoDto.coordenador,
      },
    });
  }

  async updateCurso(
    idUsuario: number,
    id: number,
    updateCursoDto: UpdateCursoDto,
  ): Promise<Curso> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const curso = await this.prisma.curso.findUnique({
      where: { id },
    });

    if (!curso) {
      throw new NotFoundException(`curso com ID ${id} não encontrado`);
    }

    return this.prisma.curso.update({
      where: { id },
      data: {
        nome: updateCursoDto.nome,
        turno: updateCursoDto.turno,
        coordenador: updateCursoDto.coordenador,
      },
    });
  }

  async getCursoById(id: number): Promise<Curso> {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
    });

    if (!curso) {
      throw new NotFoundException(`curso com ID ${id} não encontrado`);
    }

    return curso;
  }

  async getAllCursos(): Promise<Curso[]> {
    return this.prisma.curso.findMany({ include: { programas: true } });
  }

  async deleteCurso(idUsuario: number, id: number): Promise<Curso> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const curso = await this.prisma.curso.findUnique({
      where: { id },
    });

    if (!curso) {
      throw new NotFoundException(`curso com ID ${id} não encontrado`);
    }

    return this.prisma.curso.delete({
      where: { id },
    });
  }

  async filterCursosByName(name: string): Promise<Curso[]> {
    const cursos = await this.prisma.curso.findMany({
      where: {
        nome: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
    return cursos;
  }
}
