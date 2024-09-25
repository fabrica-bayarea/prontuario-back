import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AtendimentoFilterDto,
  AtendimentoResponse,
  CreateAtendimentoDto,
  GetAtendimentoByCpfDto,
  UpdateDataAtendimentoDto,
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
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });
    if (!usuario) {
      throw new ForbiddenException('credenciais inválidas');
    }

    const beneficiario = await this.prisma.beneficiario.findUnique({
      where: {
        cpf: dto.cpfBeneficiario,
      },
    });

    if (!beneficiario) {
      throw new NotFoundException(
        `beneficiário com CPF ${dto.cpfBeneficiario} não encontrado`,
      );
    }

    const programa = await this.prisma.programa.findUnique({
      where: {
        nome: dto.nomePrograma,
      },
    });

    if (!programa) {
      throw new NotFoundException(
        `programa com nome ${dto.nomePrograma} não encontrado`,
      );
    }

    const dataAgenda = new Date(dto.data);
    const dataAtual = new Date();

    if(dataAgenda.getTime() < dataAtual.getTime()){
      throw new BadRequestException(
        'Data inválida! Agende para uma data futura.',
      );
    }

    const atendimento = await this.prisma.atendimento.create({
      data: {
        data: dataAgenda,
        usuarioId: idUsuario,
        programaId: programa.id,
        beneficiarioId: beneficiario.id,
      },
    });

    const response: AtendimentoResponse = {
      atendimento: {
        id: atendimento.id,
        data: atendimento.data,
        beneficiario: {
          id: beneficiario.id,
          nome: beneficiario.nome,
          cpf: beneficiario.cpf,
          email: beneficiario.email,
          telefone: beneficiario.telefone,
        },
        programa: {
          id: programa.id,
          nome: programa.nome,
        },
        usuario: {
          id: idUsuario,
          nome: usuario.nome,
          email: usuario.email,
        },
      },
    };

    return response;
  }

  async getAllAtendimentos(): Promise<AtendimentoResponse[]> {
    const atendimentos = await this.prisma.atendimento.findMany({
      include: {
        beneficiario: true,
        programa: true,
        usuario: true,
      },
    });

    return atendimentos.map(atendimento => ({
      atendimento: {
        id: atendimento.id,
        data: atendimento.data,
        beneficiario: {
          id: atendimento.beneficiario.id,
          nome: atendimento.beneficiario.nome,
          cpf: atendimento.beneficiario.cpf,
          email: atendimento.beneficiario.email,
          telefone: atendimento.beneficiario.telefone,
        },
        programa: {
          id: atendimento.programa.id,
          nome: atendimento.programa.nome,
        },
        usuario: {
          id: atendimento.usuario.id,
          nome: atendimento.usuario.nome,
          email: atendimento.usuario.email,
        },
      },
    }));
  }

  async getAtendimentosByBeneficiarioCpf(
    dto: GetAtendimentoByCpfDto,
  ): Promise<AtendimentoResponse[]> {
    const beneficiario = await this.prisma.beneficiario.findUnique({
      where: { cpf: dto.cpfBeneficiario },
    });

    if (!beneficiario) {
      throw new NotFoundException(
        `beneficiário com CPF ${dto.cpfBeneficiario} não encontrado`,
      );
    }

    const atendimentos = await this.prisma.atendimento.findMany({
      where: { beneficiarioId: beneficiario.id },
      include: {
        beneficiario: true,
        programa: true,
        usuario: true,
      },
    });

    return atendimentos.map(atendimento => ({
      atendimento: {
        id: atendimento.id,
        data: atendimento.data,
        beneficiario: {
          id: atendimento.beneficiario.id,
          nome: atendimento.beneficiario.nome,
          cpf: atendimento.beneficiario.cpf,
          email: atendimento.beneficiario.email,
          telefone: atendimento.beneficiario.telefone,
        },
        programa: {
          id: atendimento.programa.id,
          nome: atendimento.programa.nome,
        },
        usuario: {
          id: atendimento.usuario.id,
          nome: atendimento.usuario.nome,
          email: atendimento.usuario.email,
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

  async getAtendimentosByDateRange(
    filter: AtendimentoFilterDto,
  ): Promise<AtendimentoResponse[]> {
    const { dataInicio, dataFim } = filter;

    const atendimentos = await this.prisma.atendimento.findMany({
      where: {
        data: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
      },
      include: {
        beneficiario: true,
        programa: true,
        usuario: true,
      },
    });

    return atendimentos.map(atendimento => ({
      atendimento: {
        id: atendimento.id,
        data: atendimento.data,
        beneficiario: {
          id: atendimento.beneficiario.id,
          nome: atendimento.beneficiario.nome,
          cpf: atendimento.beneficiario.cpf,
          email: atendimento.beneficiario.email,
          telefone: atendimento.beneficiario.telefone,
        },
        programa: {
          id: atendimento.programa.id,
          nome: atendimento.programa.nome,
        },
        usuario: {
          id: atendimento.usuario.id,
          nome: atendimento.usuario.nome,
          email: atendimento.usuario.email,
        },
      },
    }));
  }

  async updateAtendimentoDate(
    atendimentoId: number,
    dto: UpdateDataAtendimentoDto,
  ): Promise<AtendimentoResponse> {
    const atendimento = await this.prisma.atendimento.findUnique({
      where: { id: atendimentoId },
    });

    if (!atendimento) {
      throw new NotFoundException(
        `atendimento com ID ${atendimentoId} não encontrado`,
      );
    }

    const updatedAtendimento = await this.prisma.atendimento.update({
      where: { id: atendimentoId },
      data: { data: new Date(dto.novaData) },
      include: {
        beneficiario: true,
        programa: true,
        usuario: true,
      },
    });

    return {
      atendimento: {
        id: updatedAtendimento.id,
        data: updatedAtendimento.data,
        beneficiario: {
          id: updatedAtendimento.beneficiario.id,
          nome: updatedAtendimento.beneficiario.nome,
          cpf: updatedAtendimento.beneficiario.cpf,
          email: updatedAtendimento.beneficiario.email,
          telefone: updatedAtendimento.beneficiario.telefone,
        },
        programa: {
          id: updatedAtendimento.programa.id,
          nome: updatedAtendimento.programa.nome,
        },
        usuario: {
          id: updatedAtendimento.usuario.id,
          nome: updatedAtendimento.usuario.nome,
          email: updatedAtendimento.usuario.email,
        },
      },
    };
  }
}
