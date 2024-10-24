import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString, IsNotEmpty } from 'class-validator';

export type VagaResponse = {
  slot: {
    id: number;
    startDateTime: Date;
    endDateTime: Date;
    colaborador: {
      id: number;
      firstName: string;
    };
    appointmentPeriod: {
      id: number;
      startDate: Date;
      endDate: Date;
      startTime: string;
      endTime: string;
      program: {
        id: number;
        name: string;
      };
    };
  };
};

export class CreateVagaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  appointmentPeriodId: number;

  @ApiProperty({ example: '2024-09-01T08:00:00' })
  @IsDateString()
  startDateTime: Date;

  @ApiProperty({ example: '2024-09-01T17:00:00' })
  @IsDateString()
  endDateTime: Date;
}
