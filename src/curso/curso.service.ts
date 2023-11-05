import {
  Injectable,
  NotFoundException,
  ForbiddenException,
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
      throw new ForbiddenException(
        'You do not have permission to create a Curso.',
      );
    }

    return this.prisma.curso.create({
      data: {
        nome: createCursoDto.nome,
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
      throw new ForbiddenException(
        'You do not have permission to update a Curso.',
      );
    }

    const curso = await this.prisma.curso.findUnique({
      where: { id },
    });

    if (!curso) {
      throw new NotFoundException(`Curso with ID ${id} not found`);
    }

    return this.prisma.curso.update({
      where: { id },
      data: {
        nome: updateCursoDto.nome,
      },
    });
  }

  async getCursoById(id: number): Promise<Curso> {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
    });

    if (!curso) {
      throw new NotFoundException(`Curso with ID ${id} not found`);
    }

    return curso;
  }

  async getAllCursos(): Promise<Curso[]> {
    return this.prisma.curso.findMany();
  }

  async deleteCurso(idUsuario: number, id: number): Promise<Curso> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException(
        'You do not have permission to delete a Curso.',
      );
    }

    const curso = await this.prisma.curso.findUnique({
      where: { id },
    });

    if (!curso) {
      throw new NotFoundException(`Curso with ID ${id} not found`);
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
        },
      },
    });
    return cursos;
  }
}
