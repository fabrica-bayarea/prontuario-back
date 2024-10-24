import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  createPeriodoAtendimentoResponse,
  CreatePeriodoAtendimentoDto,
} from './periodoAtendimento.dto';

@Injectable()
export class PeriodoAtendimentoService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createPeriodoAtendimento(
    idUsuario: number,
    dto: CreatePeriodoAtendimentoDto,
  ): Promise<createPeriodoAtendimentoResponse> {
    const isAdministrator = await this.authService.isAdministrator(idUsuario);

    if (!isAdministrator) {
      throw new ForbiddenException('permissões insuficientes.');
    }

    const program = await this.prisma.program.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (!program) {
      throw new NotFoundException(
        `program com firstName ${dto.name} não encontrado`,
      );
    }

    const periodoAtendimentos = await this.prisma.appointmentPeriod.create({
      data: {
        programId: program.id,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        startTime: dto.startTime,
        endTime: dto.endTime,
        daysOfWeek: this.convertDaysWeeks(dto.daysOfWeek) as number,
      },
    });

    const response: createPeriodoAtendimentoResponse = {
      periodo_atendimento: {
        id: periodoAtendimentos.id,
        startDate: periodoAtendimentos.startDate,
        endDate: periodoAtendimentos.endDate,
        startTime: periodoAtendimentos.startTime,
        endTime: periodoAtendimentos.endTime,
        daysOfWeek: this.convertDaysWeeks(
          periodoAtendimentos.daysOfWeek,
        ) as string[],
        program: {
          id: program.id,
          firstName: program.name,
        },
      },
    };

    return response;
  }

  convertDaysWeeks(bitmaskOrDays: number | string[]): number | string[] {
    const daysOfWeek = [
      { value: 64, name: 'SABADO' },
      { value: 32, name: 'SEXTA' },
      { value: 16, name: 'QUINTA' },
      { value: 8, name: 'QUARTA' },
      { value: 4, name: 'TERCA' },
      { value: 2, name: 'SEGUNDA' },
      { value: 1, name: 'DOMINGO' },
    ];

    if (typeof bitmaskOrDays === 'number') {
      return daysOfWeek
        .filter(day => (bitmaskOrDays & day.value) !== 0)
        .map(day => day.name);
    } else {
      return bitmaskOrDays.reduce((days, day) => {
        const foundDay = daysOfWeek.find(d => d.name === day.toUpperCase());
        return foundDay ? days | foundDay.value : days;
      }, 0);
    }
  }
}
