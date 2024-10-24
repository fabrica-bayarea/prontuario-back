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
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    daysOfWeek: string[];
    program: {
      id: number;
      firstName: string;
    };
  };
};

export class CreatePeriodoAtendimentoDto {
  @ApiProperty({ example: 'Jovens conectados' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2024-09-01' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2024-09-01' })
  @IsDateString()
  endDate: Date;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ example: '["DOMINGO", "SEGUNDA", "TERCA"]' })
  @IsArray({ message: 'dias da semana deve ser um array.' })
  @IsIn(
    ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'],
    { each: true },
  )
  daysOfWeek: string[];
}
