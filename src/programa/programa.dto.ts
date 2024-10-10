import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgramaDto {
  @ApiProperty({ example: 'Jovens conectados' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    example: 'Programa para jovens interessados em tecnologia',
  })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({ example: 'Ciência da Computação' })
  @IsNotEmpty()
  curso: number | string;

  @ApiProperty({ example: '2023-09-01T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  inicio: Date;

  @ApiProperty({ example: '2024-09-01T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  termino: Date;

  @ApiProperty({ example: 'Segunda a Sexta, 14h às 18h' })
  @IsNotEmpty()
  @IsString()
  horario: string;

  @ApiProperty({ example: 'Jovens de 15 a 18 anos' })
  @IsNotEmpty()
  @IsString()
  publicoAlvo: string;
}

export class UpdateProgramaDto {
  @ApiProperty({ example: 'Culinária Nordestina' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    example: 'Curso de culinaria focado na gastronomia nordestina',
  })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({ example: 'Gastronomia' })
  @IsNotEmpty()
  curso: number | string;

  @ApiProperty({ example: '2023-09-01T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  inicio: Date;

  @ApiProperty({ example: '2024-09-01T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  termino: Date;

  @ApiProperty({ example: 'Segunda a Sexta, 14h às 18h' })
  @IsNotEmpty()
  @IsString()
  horario: string;

  @ApiProperty({ example: 'Adultos de 25 a 40 anos' })
  @IsNotEmpty()
  @IsString()
  publicoAlvo: string;
}

export class CursoProgramaDto {
  @ApiProperty({ example: 'Psicologia' })
  @IsNotEmpty()
  curso: number | string;
}
