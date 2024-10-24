import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Course } from '@prisma/client';
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
  ): Promise<Course> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const repetido = await this.prisma.course.findUnique({
      where: { name: createCursoDto.name },
    });

    if (repetido) {
      throw new BadRequestException('name do course deve ser único');
    }

    return this.prisma.course.create({
      data: {
        name: createCursoDto.name,
        description: createCursoDto.description,
        coordinator: createCursoDto.coordinator,
        campus: createCursoDto.campus,
      },
    });
  }

  async updateCurso(
    idUsuario: number,
    id: number,
    updateCursoDto: UpdateCursoDto,
  ): Promise<Course> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`course com ID ${id} não encontrado`);
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        name: updateCursoDto.name,
        description: updateCursoDto.description,
        coordinator: updateCursoDto.coordinator,
        campus: updateCursoDto.campus,
      },
    });
  }

  async getCursoById(id: number): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        program: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`course com ID ${id} não encontrado`);
    }

    return course;
  }

  async getAllCursos(): Promise<Course[]> {
    return this.prisma.course.findMany({
      include: {
        program: true,
      },
    });
  }

  async deleteCurso(idUsuario: number, id: number): Promise<Course> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`course com ID ${id} não encontrado`);
    }

    return this.prisma.course.delete({
      where: { id },
    });
  }

  async filterCursosByName(name: string): Promise<Course[]> {
    const course = await this.prisma.course.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
    return course;
  }
}
