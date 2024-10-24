import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type StatusEnum = 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';

export const statusEnum: StatusEnum[] = [
  'SCHEDULED',
  'COMPLETED',
  'CANCELED',
  'NO_SHOW',
];

export type AtendimentoResponse = {
  appointment: {
    id: number;
    status: StatusEnum;
    observation: string;
    beneficiario: {
      id: number;
      firstName: string;
      cpf: string;
      email: string;
      phone: string;
    };
    slot: {
      id: number;
      startDateTime: Date;
      endDateTime: Date;
      colaborador: {
        id: number;
        firstName: string;
        cpf: string;
        email: string;
        phone: string;
        registration: string;
      };
      AppointmentPeriod: {
        id: number;
        program: {
          id: number;
          name: string;
          description: string;
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
  observation: string;
}

export class GetAtendimentoByCpfDto {
  @ApiProperty({ example: '597.444.356-54' })
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  cpf_beneficiario: string;
}
