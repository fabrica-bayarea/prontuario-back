import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AtendimentoResponse,
  CreateAtendimentoDto,
  GetAtendimentoByCpfDto,
} from './atendimento.dto';

@Injectable()
export class AtendimentoService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createAtendimento(
    idUsuario: number,
    dto: CreateAtendimentoDto,
  ): Promise<AtendimentoResponse> {
    const beneficiario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    if (!beneficiario) {
      throw new ForbiddenException('credenciais inválidas');
    }

    const vaga = await this.prisma.vaga.findUnique({
      where: { id: dto.vaga_id },
    });

    if (!vaga) {
      throw new NotFoundException(
        `Disponibilidade do colaborador com id ${dto.vaga_id} não encontrado`,
      );
    }

    const colaborador = await this.prisma.usuario.findUnique({
      where: { id: vaga.colaboradorId },
    });

    const atendimento = await this.prisma.atendimento.create({
      data: {
        Beneficiario: { connect: { id: beneficiario.id } },
        Vaga: { connect: { id: dto.vaga_id } },
        Periodo_Atendimento: {
          connect: { id: vaga.periodoAtendimentoId },
        },
        status: 'AGENDADO',
        observacao: dto.observacao,
      },
    });

    const periodoAtendimento = await this.prisma.periodo_Atendimento.findUnique(
      {
        where: { id: vaga.colaboradorId },
      },
    );

    const programa = await this.prisma.programa.findUnique({
      where: { id: periodoAtendimento.programaId },
    });

    const response: AtendimentoResponse = {
      atendimento: {
        id: atendimento.id,
        status: 'AGENDADO',
        observacao: atendimento.observacao,
        beneficiario: {
          id: beneficiario.id,
          nome: beneficiario.nome,
          cpf: beneficiario.cpf,
          email: beneficiario.cpf,
          telefone: beneficiario.telefone,
        },
        vaga: {
          id: vaga.id,
          dataHoraInicio: vaga.data_hora_inicio,
          dataHoraFim: vaga.data_hora_fim,
          colaborador: {
            id: colaborador.id,
            nome: colaborador.nome,
            cpf: colaborador.cpf,
            email: colaborador.email,
            telefone: colaborador.telefone,
            matricula: colaborador.matricula,
          },
          periodoAtendimento: {
            id: vaga.periodoAtendimentoId,
            programa: {
              id: programa.id,
              nome: programa.nome,
              descricao: programa.descricao,
            },
          },
        },
      },
    };

    return response;
  }

  async getAllAtendimentos(): Promise<AtendimentoResponse[]> {
    const atendimentos = await this.prisma.atendimento.findMany({
      include: {
        Beneficiario: true,
        Vaga: {
          include: {
            Colaborador: true,
            Periodo_Atendimento: {
              include: {
                Programa: true,
              },
            },
          },
        },
      },
    });

    return atendimentos.map(atendimento => ({
      atendimento: {
        id: atendimento.id,
        status: atendimento.status,
        observacao: atendimento.observacao,
        beneficiario: {
          id: atendimento.Beneficiario.id,
          nome: atendimento.Beneficiario.nome,
          cpf: atendimento.Beneficiario.cpf,
          email: atendimento.Beneficiario.cpf,
          telefone: atendimento.Beneficiario.telefone,
        },
        vaga: {
          id: atendimento.Vaga.id,
          dataHoraInicio: atendimento.Vaga.data_hora_inicio,
          dataHoraFim: atendimento.Vaga.data_hora_fim,
          colaborador: {
            id: atendimento.Vaga.Colaborador.id,
            nome: atendimento.Vaga.Colaborador.nome,
            cpf: atendimento.Vaga.Colaborador.cpf,
            email: atendimento.Vaga.Colaborador.email,
            telefone: atendimento.Vaga.Colaborador.telefone,
            matricula: atendimento.Vaga.Colaborador.matricula,
          },
          periodoAtendimento: {
            id: atendimento.Vaga.periodoAtendimentoId,
            programa: {
              id: atendimento.Vaga.Periodo_Atendimento.Programa.id,
              nome: atendimento.Vaga.Periodo_Atendimento.Programa.nome,
              descricao:
                atendimento.Vaga.Periodo_Atendimento.Programa.descricao,
            },
          },
        },
      },
    }));
  }

  async getAtendimentosByBeneficiarioCpf(
    dto: GetAtendimentoByCpfDto,
  ): Promise<AtendimentoResponse[]> {
    const beneficiario = await this.prisma.usuario.findUnique({
      where: { cpf: dto.cpf_beneficiario },
    });

    if (!beneficiario) {
      throw new NotFoundException(
        `beneficiário com CPF ${dto.cpf_beneficiario} não encontrado`,
      );
    }

    const atendimentos = await this.prisma.atendimento.findMany({
      where: { beneficiarioId: beneficiario.id },
      include: {
        Beneficiario: true,
        Vaga: {
          include: {
            Colaborador: true,
            Periodo_Atendimento: {
              include: {
                Programa: true,
              },
            },
          },
        },
      },
    });

    return atendimentos.map(atendimento => ({
      atendimento: {
        id: atendimento.id,
        status: atendimento.status,
        observacao: atendimento.observacao,
        beneficiario: {
          id: atendimento.Beneficiario.id,
          nome: atendimento.Beneficiario.nome,
          cpf: atendimento.Beneficiario.cpf,
          email: atendimento.Beneficiario.cpf,
          telefone: atendimento.Beneficiario.telefone,
        },
        vaga: {
          id: atendimento.Vaga.id,
          dataHoraInicio: atendimento.Vaga.data_hora_inicio,
          dataHoraFim: atendimento.Vaga.data_hora_fim,
          colaborador: {
            id: atendimento.Vaga.Colaborador.id,
            nome: atendimento.Vaga.Colaborador.nome,
            cpf: atendimento.Vaga.Colaborador.cpf,
            email: atendimento.Vaga.Colaborador.email,
            telefone: atendimento.Vaga.Colaborador.telefone,
            matricula: atendimento.Vaga.Colaborador.matricula,
          },
          periodoAtendimento: {
            id: atendimento.Vaga.periodoAtendimentoId,
            programa: {
              id: atendimento.Vaga.Periodo_Atendimento.Programa.id,
              nome: atendimento.Vaga.Periodo_Atendimento.Programa.nome,
              descricao:
                atendimento.Vaga.Periodo_Atendimento.Programa.descricao,
            },
          },
        },
      },
    }));
  }

  async deleteAtendimentoById(atendimentoId: number): Promise<void | never> {
    const atendimento = await this.prisma.atendimento.findUnique({
      where: { id: atendimentoId },
    });

    if (!atendimento) {
      throw new NotFoundException(
        `atendimento com ID ${atendimentoId} não encontrado`,
      );
    }

    await this.prisma.atendimento.delete({
      where: { id: atendimentoId },
    });
  }
}
