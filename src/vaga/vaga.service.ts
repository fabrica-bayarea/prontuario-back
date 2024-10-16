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

    const periodoAtendimento = await this.prisma.periodo_Atendimento.findUnique(
      {
        where: {
          id: createVagaDto.periodo_atendimento_id,
        },
      },
    );

    const colaborador = await this.prisma.usuario.findUnique({
      where: {
        id: idUsuario,
      },
    });

    if (!colaborador) {
      throw new NotFoundException(
        `colaborador com id ${idUsuario} não encontrado`,
      );
    }

    const vaga = await this.prisma.vaga.create({
      data: {
        data_hora_inicio: new Date(createVagaDto.data_hora_inicio),
        data_hora_fim: new Date(createVagaDto.data_hora_fim),
        colaboradorId: colaborador.id,
        periodoAtendimentoId: periodoAtendimento.id,
      },
    });

    const programa = await this.prisma.programa.findUnique({
      where: {
        id: periodoAtendimento.programaId,
      },
    });

    const response: VagaResponse = {
      vaga: {
        id: vaga.id,
        data_hora_inicio: vaga.data_hora_inicio,
        data_hora_fim: vaga.data_hora_fim,
        colaborador: {
          id: colaborador.id,
          nome: colaborador.nome,
        },
        periodoAtendimento: {
          id: periodoAtendimento.id,
          data_inicio: periodoAtendimento.data_inicio,
          data_fim: periodoAtendimento.data_fim,
          horario_inicio: periodoAtendimento.horario_inicio,
          horario_fim: periodoAtendimento.horario_fim,
          programa: {
            id: programa.id,
            nome: programa.nome,
          },
        },
      },
    };

    return response;
  }
}
