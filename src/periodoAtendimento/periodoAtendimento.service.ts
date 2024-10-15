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

    const programa = await this.prisma.programa.findUnique({
      where: {
        nome: dto.nome_programa,
      },
    });

    if (!programa) {
      throw new NotFoundException(
        `programa com nome ${dto.nome_programa} não encontrado`,
      );
    }

    const periodoAtendimentos = await this.prisma.periodo_Atendimento.create({
      data: {
        programaId: programa.id,
        data_inicio: new Date(dto.data_inicio),
        data_fim: new Date(dto.data_fim),
        horario_inicio: dto.horario_inicio,
        horario_fim: dto.horario_fim,
        dias_da_semana: this.convertDaysWeeks(dto.dias_da_semana) as number,
      },
    });

    const response: createPeriodoAtendimentoResponse = {
      periodo_atendimento: {
        id: periodoAtendimentos.id,
        data_inicio: periodoAtendimentos.data_inicio,
        data_fim: periodoAtendimentos.data_fim,
        horario_inicio: periodoAtendimentos.horario_inicio,
        horario_fim: periodoAtendimentos.horario_fim,
        dias_da_semana: this.convertDaysWeeks(
          periodoAtendimentos.dias_da_semana,
        ) as string[],
        programa: {
          id: programa.id,
          nome: programa.nome,
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
