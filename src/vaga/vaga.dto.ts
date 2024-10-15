import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString, IsNotEmpty } from 'class-validator';

export type VagaResponse = {
  vaga: {
    id: number;
    data_hora_inicio: Date;
    data_hora_fim: Date;
    colaborador: {
      id: number;
      nome: string;
    };
    periodoAtendimento: {
      id: number;
      data_inicio: Date;
      data_fim: Date;
      horario_inicio: string;
      horario_fim: string;
      programa: {
        id: number;
        nome: string;
      };
    };
  };
};

export class CreateVagaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  periodo_atendimento_id: number;

  @ApiProperty({ example: '2024-09-01T08:00:00' })
  @IsDateString()
  data_hora_inicio: Date;

  @ApiProperty({ example: '2024-09-01T17:00:00' })
  @IsDateString()
  data_hora_fim: Date;
}
