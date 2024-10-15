import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProgramaDto,
  CursoProgramaDto,
  UpdateProgramaDto,
} from './programa.dto';
import { Programa } from '@prisma/client';
import { isInt, isString } from 'class-validator';

@Injectable()
export class ProgramaService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createPrograma(
    idUsuario: number,
    createProgramaDto: CreateProgramaDto,
  ): Promise<Programa> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const { nome, curso, descricao, publico_alvo } = createProgramaDto;
    let exists: any;

    if (isString(curso)) {
      exists = await this.prisma.curso.findUnique({ where: { nome: curso } });

      if (!exists) {
        throw new BadRequestException('ID ou nome do curso incorreto.');
      }

      return await this.prisma.programa.create({
        data: {
          nome,
          descricao,
          publico_alvo,
          cursos: {
            connect: {
              id: exists.id,
            },
          },
        },
      });
    } else if (isInt(curso)) {
      exists = await this.prisma.curso.findUnique({ where: { id: curso } });

      if (!exists) {
        throw new BadRequestException('ID ou nome do curso incorreto.');
      }

      return await this.prisma.programa.create({
        data: {
          nome,
          descricao,
          publico_alvo,
          cursos: {
            connect: {
              id: exists.id,
            },
          },
        },
      });
    }
  }

  async getAllProgramas(): Promise<Programa[]> {
    return this.prisma.programa.findMany({
      include: { cursos: true },
    });
  }

  async getProgramaById(id: number): Promise<Programa> {
    const programa = await this.prisma.programa.findUnique({ where: { id } });

    if (!programa) {
      throw new NotFoundException(`programa com ID ${id} não encontrado`);
    }

    return programa;
  }

  async filterProgramasByName(name: string): Promise<Programa[]> {
    const programas = await this.prisma.programa.findMany({
      where: {
        nome: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    return programas;
  }

  async updatePrograma(
    idUsuario: number,
    id: number,
    updateProgramaDto: UpdateProgramaDto,
  ): Promise<Programa> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);
    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }
    const programa = await this.prisma.programa.findUnique({ where: { id } });
    if (!programa) {
      throw new NotFoundException(`programa com ID ${id} não encontrado`);
    }

    return await this.prisma.programa.update({
      where: { id },
      data: {
        nome: updateProgramaDto.nome,
        descricao: updateProgramaDto.descricao,
        publico_alvo: updateProgramaDto.publico_alvo,
      },
    });
  }

  async adicionarCursoPrograma(
    idUsuario: number,
    id: number,
    cursoProgramaDto: CursoProgramaDto,
  ): Promise<Programa> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);
    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }
    const programa = await this.prisma.programa.findUnique({ where: { id } });
    if (!programa) {
      throw new NotFoundException(`programa com ID ${id} não encontrado`);
    }

    const { curso } = cursoProgramaDto;
    let exists: any;

    if (isString(curso)) {
      exists = await this.prisma.curso.findUnique({ where: { nome: curso } });
      if (!exists) {
        throw new BadRequestException('ID ou nome do curso incorreto.');
      }
      return await this.prisma.programa.update({
        where: { id },
        data: { cursos: { connect: { nome: curso } } },
      });
    } else if (isInt(curso)) {
      exists = await this.prisma.curso.findUnique({ where: { id: curso } });
      if (!exists) {
        throw new BadRequestException('ID ou nome do curso incorreto.');
      }
      return await this.prisma.programa.update({
        where: { id },
        data: { cursos: { connect: { id: curso } } },
      });
    }
  }

  async removerCursoPrograma(
    idUsuario: number,
    id: number,
    cursoProgramaDto: CursoProgramaDto,
  ): Promise<Programa> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);
    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }
    const programa = await this.prisma.programa.findUnique({ where: { id } });
    if (!programa) {
      throw new NotFoundException(`programa com ID ${id} não encontrado`);
    }

    const { curso } = cursoProgramaDto;
    let exists: any;

    if (isString(curso)) {
      exists = await this.prisma.curso.findUnique({ where: { nome: curso } });
      if (!exists) {
        throw new BadRequestException('ID ou nome do curso incorreto.');
      }
      return await this.prisma.programa.update({
        where: { id },
        data: { cursos: { disconnect: { nome: curso } } },
      });
    } else if (isInt(curso)) {
      exists = await this.prisma.curso.findUnique({ where: { id: curso } });
      if (!exists) {
        throw new BadRequestException('ID ou nome do curso incorreto.');
      }
      return await this.prisma.programa.update({
        where: { id },
        data: { cursos: { disconnect: { id: curso } } },
      });
    }
  }

  async deletePrograma(idUsuario: number, id: number): Promise<Programa> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const programa = await this.prisma.programa.findUnique({
      where: { id },
    });

    if (!programa) {
      throw new NotFoundException(`programa com ID ${id} não encontrado`);
    }

    return await this.prisma.programa.delete({ where: { id } });
  }
}
