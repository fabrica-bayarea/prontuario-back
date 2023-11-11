import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgramaDto {
  @ApiProperty({ example: 'Jovens conectados' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ example: 'Ciência da Computação' })
  @IsNotEmpty()
  curso: number | string;
}

export class UpdateProgramaDto {
  @ApiProperty({ example: 'Culinária Nordestina' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ example: 'Gastronomia' })
  @IsNotEmpty()
  curso?: number | string;
}

export class CursoProgramaDto {
  @ApiProperty({ example: 'Psicologia' })
  @IsNotEmpty()
  curso: number | string;
}
