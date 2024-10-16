import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
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

  @ApiProperty({ example: 'Jovens de 15 a 18 anos' })
  @IsNotEmpty()
  @IsString()
  publico_alvo: string;
}

export class UpdateProgramaDto {
  @ApiProperty({ example: 'Culinária Nordestina' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({
    example: 'Curso de culinaria focado na gastronomia nordestina',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ example: 'Adultos de 25 a 40 anos' })
  @IsOptional()
  @IsString()
  publico_alvo?: string;
}

export class CursoProgramaDto {
  @ApiProperty({ example: 'Psicologia' })
  @IsNotEmpty()
  curso: number | string;
}
