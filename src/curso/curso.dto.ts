import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCursoDto {
  @ApiProperty({ example: 'Ciência da Computação' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'Descrição do curso' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  coordenador: string;

  @ApiProperty({ example: 'Campus da Asa Sul' })
  @IsString()
  @IsNotEmpty()
  campus: string;
}

export class UpdateCursoDto {
  @ApiProperty({ example: 'Direito' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ example: 'Descrição atualizada do curso' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ example: 'Maria Oliveira' })
  @IsOptional()
  @IsString()
  coordenador?: string;

  @ApiProperty({ example: 'Campus Norte' })
  @IsOptional()
  @IsString()
  campus?: string;
}
