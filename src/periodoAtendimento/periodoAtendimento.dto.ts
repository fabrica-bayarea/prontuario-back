import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsIn,
} from 'class-validator';

export type createPeriodoAtendimentoResponse = {
  periodo_atendimento: {
    id: number;
    data_inicio: Date;
    data_fim: Date;
    horario_inicio: string;
    horario_fim: string;
    dias_da_semana: string[];
    programa: {
      id: number;
      nome: string;
    };
  };
};

export class CreatePeriodoAtendimentoDto {
  @ApiProperty({ example: 'Jovens conectados' })
  @IsString()
  @IsNotEmpty()
  nome_programa: string;

  @ApiProperty({ example: '2024-09-01' })
  @IsDateString()
  data_inicio: Date;

  @ApiProperty({ example: '2024-09-01' })
  @IsDateString()
  data_fim: Date;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @IsNotEmpty()
  horario_inicio: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  @IsNotEmpty()
  horario_fim: string;

  @ApiProperty({ example: '["DOMINGO", "SEGUNDA", "TERCA"]' })
  @IsArray({ message: 'dias da semana deve ser um array.' })
  @IsIn(
    ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'],
    { each: true },
  )
  dias_da_semana: string[];
}
