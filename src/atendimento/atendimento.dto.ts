import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type AtendimentoResponse = {
  atendimento: {
    id: number;
    data: Date;
    beneficiario: {
      id: number;
      nome: string;
      cpf: string;
      email: string;
      telefone: string;
    };
    programa: {
      id: number;
      nome: string;
    };
    usuario: {
      id: number;
      nome: string;
      email: string;
    };
  };
};

export class CreateAtendimentoDto {
  @ApiProperty({ example: '20/07/2024' })
  @IsDateString()
  data: Date;

  @ApiProperty({ example: '597.444.356-54' })
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  cpfBeneficiario: string;

  @ApiProperty({ example: 'Jovens Tecnológicos' })
  @IsString()
  @IsNotEmpty()
  nomePrograma: string;
}

export class GetAtendimentoByCpfDto {
  @ApiProperty({ example: '597.444.356-54' })
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  cpfBeneficiario: string;
}

export class AtendimentoFilterDto {
  @ApiProperty({ example: '20/07/2024' })
  @IsDateString()
  dataInicio: Date;

  @ApiProperty({ example: '20/07/2025' })
  @IsDateString()
  dataFim: Date;
}

export class UpdateDataAtendimentoDto {
  @ApiProperty({ example: '10/04/2024' })
  @IsDateString()
  novaData: string;
}
