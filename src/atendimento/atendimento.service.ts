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
    const beneficiario = await this.prisma.user.findUnique({
      where: { id: idUsuario },
    });

    if (!beneficiario) {
      throw new ForbiddenException('credenciais inválidas');
    }

    const slot = await this.prisma.slot.findUnique({
      where: { id: dto.vaga_id },
    });

    if (!slot) {
      throw new NotFoundException(
        `Disponibilidade do colaborador com id ${dto.vaga_id} não encontrado`,
      );
    }

    const colaborador = await this.prisma.user.findUnique({
      where: { id: slot.collaboratorId },
    });

    const appointment = await this.prisma.appointment.create({
      data: {
        Beneficiary: { connect: { id: beneficiario.id } },
        Slot: { connect: { id: dto.vaga_id } },
        AppointmentPeriod: {
          connect: { id: slot.appointmentPeriodId },
        },
        status: 'SCHEDULED',
        observation: dto.observation,
      },
    });

    const periodoAtendimento = await this.prisma.appointmentPeriod.findUnique({
      where: { id: slot.appointmentPeriodId },
    });

    if (!periodoAtendimento) {
      throw new NotFoundException(
        `Período de appointment com id ${slot.appointmentPeriodId} não encontrado`,
      );
    }

    const program = await this.prisma.program.findUnique({
      where: { id: periodoAtendimento.programId },
    });

    if (!program) {
      throw new NotFoundException(
        `Program com id ${periodoAtendimento.programId} não encontrado`,
      );
    }

    const response: AtendimentoResponse = {
      appointment: {
        id: appointment.id,
        status: 'SCHEDULED',
        observation: appointment.observation,
        beneficiario: {
          id: beneficiario.id,
          firstName: beneficiario.firstName,
          cpf: beneficiario.cpf,
          email: beneficiario.cpf,
          phone: beneficiario.phone,
        },
        slot: {
          id: slot.id,
          startDateTime: slot.startDateTime,
          endDateTime: slot.endDateTime,
          colaborador: {
            id: colaborador.id,
            firstName: colaborador.firstName,
            cpf: colaborador.cpf,
            email: colaborador.email,
            phone: colaborador.phone,
            registration: colaborador.registration,
          },
          AppointmentPeriod: {
            id: slot.appointmentPeriodId,
            program: {
              id: program.id,
              name: program.name,
              description: program.description,
            },
          },
        },
      },
    };

    return response;
  }

  async getAllAtendimentos(): Promise<AtendimentoResponse[]> {
    const atendimentos = await this.prisma.appointment.findMany({
      include: {
        Beneficiary: true,
        Slot: {
          include: {
            Collaborator: true,
            AppointmentPeriod: {
              include: {
                Program: true,
              },
            },
          },
        },
      },
    });

    return atendimentos.map(appointment => ({
      appointment: {
        id: appointment.id,
        status: appointment.status,
        observation: appointment.observation,
        beneficiario: {
          id: appointment.Beneficiary.id,
          firstName: appointment.Beneficiary.firstName,
          cpf: appointment.Beneficiary.cpf,
          email: appointment.Beneficiary.cpf,
          phone: appointment.Beneficiary.phone,
        },
        slot: {
          id: appointment.Slot.id,
          startDateTime: appointment.Slot.startDateTime,
          endDateTime: appointment.Slot.endDateTime,
          colaborador: {
            id: appointment.Slot.Collaborator.id,
            firstName: appointment.Slot.Collaborator.firstName,
            cpf: appointment.Slot.Collaborator.cpf,
            email: appointment.Slot.Collaborator.email,
            phone: appointment.Slot.Collaborator.phone,
            registration: appointment.Slot.Collaborator.registration,
          },
          AppointmentPeriod: {
            id: appointment.Slot.appointmentPeriodId,
            program: {
              id: appointment.Slot.AppointmentPeriod.Program.id,
              name: appointment.Slot.AppointmentPeriod.Program.name,
              description:
                appointment.Slot.AppointmentPeriod.Program.description,
            },
          },
        },
      },
    }));
  }

  async getAtendimentosByBeneficiarioCpf(
    dto: GetAtendimentoByCpfDto,
  ): Promise<AtendimentoResponse[]> {
    const beneficiario = await this.prisma.user.findUnique({
      where: { cpf: dto.cpf_beneficiario },
    });

    if (!beneficiario) {
      throw new NotFoundException(
        `beneficiário com CPF ${dto.cpf_beneficiario} não encontrado`,
      );
    }

    const atendimentos = await this.prisma.appointment.findMany({
      where: { beneficiaryId: beneficiario.id },
      include: {
        Beneficiary: true,
        Slot: {
          include: {
            Collaborator: true,
            AppointmentPeriod: {
              include: {
                Program: true,
              },
            },
          },
        },
      },
    });

    return atendimentos.map(appointment => ({
      appointment: {
        id: appointment.id,
        status: appointment.status,
        observation: appointment.observation,
        beneficiario: {
          id: appointment.Beneficiary.id,
          firstName: appointment.Beneficiary.firstName,
          cpf: appointment.Beneficiary.cpf,
          email: appointment.Beneficiary.cpf,
          phone: appointment.Beneficiary.phone,
        },
        slot: {
          id: appointment.Slot.id,
          startDateTime: appointment.Slot.startDateTime,
          endDateTime: appointment.Slot.endDateTime,
          colaborador: {
            id: appointment.Slot.Collaborator.id,
            firstName: appointment.Slot.Collaborator.firstName,
            cpf: appointment.Slot.Collaborator.cpf,
            email: appointment.Slot.Collaborator.email,
            phone: appointment.Slot.Collaborator.phone,
            registration: appointment.Slot.Collaborator.registration,
          },
          AppointmentPeriod: {
            id: appointment.Slot.appointmentPeriodId,
            program: {
              id: appointment.Slot.AppointmentPeriod.Program.id,
              name: appointment.Slot.AppointmentPeriod.Program.name,
              description:
                appointment.Slot.AppointmentPeriod.Program.description,
            },
          },
        },
      },
    }));
  }

  async deleteAtendimentoById(atendimentoId: number): Promise<void | never> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: atendimentoId },
    });

    if (!appointment) {
      throw new NotFoundException(
        `appointment com ID ${atendimentoId} não encontrado`,
      );
    }

    await this.prisma.appointment.delete({
      where: { id: atendimentoId },
    });
  }
}
