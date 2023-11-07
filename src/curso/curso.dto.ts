import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCursoDto {
  @ApiProperty({ example: 'Psicologia' })
  @IsString()
  @IsNotEmpty()
  nome: string;
}

export class UpdateCursoDto {
  @ApiProperty({ example: 'Direito' })
  @IsString()
  @IsNotEmpty()
  nome: string;
}
