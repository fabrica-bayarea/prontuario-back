import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AtendimentoResponse, CreateAtendimentoDto } from './atendimento.dto';

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

    const atendimento = await this.prisma.atendimento.create({
      data: {
        data: new Date(dto.data),
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
}
