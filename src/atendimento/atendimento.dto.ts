import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type StatusEnum =
  | 'AGENDADO'
  | 'REALIZADO'
  | 'CANCELADO'
  | 'NAOCOMPARECEU';

export const statusEnum: StatusEnum[] = [
  'AGENDADO',
  'REALIZADO',
  'CANCELADO',
  'NAOCOMPARECEU',
];

export type AtendimentoResponse = {
  atendimento: {
    id: number;
    status: StatusEnum;
    observacao: string;
    beneficiario: {
      id: number;
      nome: string;
      cpf: string;
      email: string;
      telefone: string;
    };
    vaga: {
      id: number;
      dataHoraInicio: Date;
      dataHoraFim: Date;
      colaborador: {
        id: number;
        nome: string;
        cpf: string;
        email: string;
        telefone: string;
        matricula: string;
      };
      periodoAtendimento: {
        id: number;
        programa: {
          id: number;
          nome: string;
          descricao: string;
        };
      };
    };
  };
};

export class CreateAtendimentoDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  vaga_id: number;

  @ApiProperty({ example: 'Jovens conectados' })
  @IsString()
  @IsNotEmpty()
  observacao: string;
}

export class GetAtendimentoByCpfDto {
  @ApiProperty({ example: '597.444.356-54' })
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  cpf_beneficiario: string;
}
