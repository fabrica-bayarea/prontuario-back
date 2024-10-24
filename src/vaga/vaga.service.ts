import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateVagaDto, VagaResponse } from './vaga.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class VagaService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createDisponibilidadeAtendimento(
    idUsuario: number,
    createVagaDto: CreateVagaDto,
  ): Promise<VagaResponse> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    const isColaborador = await this.authService.isColaborador(idUsuario);

    if (!isAdministrator && !isColaborador) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const periodoAtendimento = await this.prisma.appointmentPeriod.findUnique({
      where: {
        id: createVagaDto.appointmentPeriodId,
      },
    });

    const colaborador = await this.prisma.user.findUnique({
      where: {
        id: idUsuario,
      },
    });

    if (!colaborador) {
      throw new NotFoundException(
        `colaborador com id ${idUsuario} não encontrado`,
      );
    }

    const slot = await this.prisma.slot.create({
      data: {
        startDateTime: new Date(createVagaDto.startDateTime),
        endDateTime: new Date(createVagaDto.endDateTime),
        collaboratorId: colaborador.id,
        appointmentPeriodId: periodoAtendimento.id,
      },
    });

    const program = await this.prisma.program.findUnique({
      where: {
        id: periodoAtendimento.programId,
      },
    });

    const response: VagaResponse = {
      slot: {
        id: slot.id,
        startDateTime: slot.startDateTime,
        endDateTime: slot.endDateTime,
        colaborador: {
          id: colaborador.id,
          firstName: colaborador.firstName,
        },
        appointmentPeriod: {
          id: periodoAtendimento.id,
          startDate: periodoAtendimento.startDate,
          endDate: periodoAtendimento.endDate,
          startTime: periodoAtendimento.startTime,
          endTime: periodoAtendimento.endTime,
          program: {
            id: program.id,
            name: program.name,
          },
        },
      },
    };

    return response;
  }
}
