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
        descricao: createCursoDto.descricao,
        coordenador: createCursoDto.coordenador,
        campus: createCursoDto.campus,
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
        descricao: updateCursoDto.descricao,
        coordenador: updateCursoDto.coordenador,
        campus: updateCursoDto.campus,
      },
    });
  }

  async getCursoById(id: number): Promise<Curso> {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        programas: true,
      },
    });

    if (!curso) {
      throw new NotFoundException(`curso com ID ${id} não encontrado`);
    }

    return curso;
  }

  async getAllCursos(take: string, skip: string, filter: string): Promise<Curso[]> {
    const takeNumber = parseInt(take);
    const skipNumber = parseInt(skip);
    const page = skipNumber * takeNumber;
    return this.prisma.curso.findMany({
      skip: page,
      take: takeNumber,
      where:{
        nome:{
          contains: filter
        },
      },
      orderBy: {
        nome: 'asc'
      },
      include: {
        programas: true,
      },
    });
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
