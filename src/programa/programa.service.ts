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
import { Program } from '@prisma/client';
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
  ): Promise<Program> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const { name, course, description, targetAudience } = createProgramaDto;
    let exists: any;

    if (isString(course)) {
      exists = await this.prisma.course.findUnique({ where: { name: course } });

      if (!exists) {
        throw new BadRequestException('ID ou name do course incorreto.');
      }

      return await this.prisma.program.create({
        data: {
          name,
          description,
          targetAudience,
          course: {
            connect: {
              id: exists.id,
            },
          },
        },
      });
    } else if (isInt(course)) {
      exists = await this.prisma.course.findUnique({ where: { id: course } });

      if (!exists) {
        throw new BadRequestException('ID ou name do course incorreto.');
      }

      return await this.prisma.program.create({
        data: {
          name,
          description,
          targetAudience,
          course: {
            connect: {
              id: exists.id,
            },
          },
        },
      });
    }
  }

  async getAllProgramas(): Promise<Program[]> {
    return this.prisma.program.findMany({
      include: { course: true },
    });
  }

  async getProgramaById(id: number): Promise<Program> {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: { appointmentPeriod: true },
    });

    if (!program) {
      throw new NotFoundException(`program com ID ${id} não encontrado`);
    }

    return program;
  }

  async filterProgramasByName(name: string): Promise<Program[]> {
    const program = await this.prisma.program.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    return program;
  }

  async updatePrograma(
    idUsuario: number,
    id: number,
    updateProgramaDto: UpdateProgramaDto,
  ): Promise<Program> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);
    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }
    const program = await this.prisma.program.findUnique({ where: { id } });
    if (!program) {
      throw new NotFoundException(`program com ID ${id} não encontrado`);
    }

    return await this.prisma.program.update({
      where: { id },
      data: {
        name: updateProgramaDto.name,
        description: updateProgramaDto.description,
        targetAudience: updateProgramaDto.targetAudience,
      },
    });
  }

  async deletePrograma(idUsuario: number, id: number): Promise<Program> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const program = await this.prisma.program.findUnique({
      where: { id },
    });

    if (!program) {
      throw new NotFoundException(`program com ID ${id} não encontrado`);
    }

    await this.prisma.program.update({
      where: { id },
      data: { user: { disconnect: [] } },
    });

    await this.prisma.appointment.deleteMany({
      where: {
        Slot: {
          AppointmentPeriod: {
            programId: id,
          },
        },
      },
    });

    await this.prisma.slot.deleteMany({
      where: {
        AppointmentPeriod: {
          programId: id,
        },
      },
    });

    await this.prisma.appointmentPeriod.deleteMany({
      where: { programId: id },
    });

    return await this.prisma.program.delete({ where: { id } });
  }

  async adicionarBeneficiarioPrograma(
    idUsuario: number,
    idPrograma: number,
  ): Promise<Program> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);
    const isBeneficiario = await this.authService.isBeneficiario(idUsuario);

    if (!isAdministrator && !isBeneficiario) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const program = await this.prisma.program.findUnique({
      where: { id: idPrograma },
    });
    if (!program) {
      throw new NotFoundException(
        `program com ID ${idPrograma} não encontrado`,
      );
    }

    return await this.prisma.program.update({
      where: { id: idPrograma },
      data: { user: { connect: { id: idUsuario } } },
    });
  }

  async removerBeneficiarioPrograma(
    idUsuario: number,
    idPrograma: number,
  ): Promise<Program> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);
    const isBeneficiario = await this.authService.isBeneficiario(idUsuario);

    if (!isAdministrator && !isBeneficiario) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const program = await this.prisma.program.findUnique({
      where: { id: idPrograma },
    });
    if (!program) {
      throw new NotFoundException(
        `program com ID ${idPrograma} não encontrado`,
      );
    }

    return await this.prisma.program.update({
      where: { id: idPrograma },
      data: { user: { disconnect: { id: idUsuario } } },
    });
  }

  async adicionarCursoPrograma(
    idUsuario: number,
    id: number,
    cursoProgramaDto: CursoProgramaDto,
  ): Promise<Program> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);
    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }
    const program = await this.prisma.program.findUnique({ where: { id } });
    if (!program) {
      throw new NotFoundException(`program com ID ${id} não encontrado`);
    }

    const { course } = cursoProgramaDto;
    let exists: any;

    if (isString(course)) {
      exists = await this.prisma.course.findUnique({ where: { name: course } });
      if (!exists) {
        throw new BadRequestException('ID ou name do course incorreto.');
      }
      return await this.prisma.program.update({
        where: { id },
        data: { course: { connect: { name: course } } },
      });
    } else if (isInt(course)) {
      exists = await this.prisma.course.findUnique({ where: { id: course } });
      if (!exists) {
        throw new BadRequestException('ID ou name do course incorreto.');
      }
      return await this.prisma.program.update({
        where: { id },
        data: { course: { connect: { id: course } } },
      });
    }
  }

  async removerCursoPrograma(
    idUsuario: number,
    id: number,
    cursoProgramaDto: CursoProgramaDto,
  ): Promise<Program> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);
    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }
    const program = await this.prisma.program.findUnique({ where: { id } });
    if (!program) {
      throw new NotFoundException(`program com ID ${id} não encontrado`);
    }

    const { course } = cursoProgramaDto;
    let exists: any;

    if (isString(course)) {
      exists = await this.prisma.course.findUnique({ where: { name: course } });
      if (!exists) {
        throw new BadRequestException('ID ou name do course incorreto.');
      }
      return await this.prisma.program.update({
        where: { id },
        data: { course: { disconnect: { name: course } } },
      });
    } else if (isInt(course)) {
      exists = await this.prisma.course.findUnique({ where: { id: course } });
      if (!exists) {
        throw new BadRequestException('ID ou name do course incorreto.');
      }
      return await this.prisma.program.update({
        where: { id },
        data: { course: { disconnect: { id: course } } },
      });
    }
  }
}
