import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCursoDto {
  @ApiProperty({ example: 'Ciência da Computação' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Descrição do course' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  coordinator: string;

  @ApiProperty({ example: 'Campus da Asa Sul' })
  @IsString()
  @IsNotEmpty()
  campus: string;
}

export class UpdateCursoDto {
  @ApiProperty({ example: 'Direito' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Descrição atualizada do course' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Maria Oliveira' })
  @IsOptional()
  @IsString()
  coordinator?: string;

  @ApiProperty({ example: 'Campus Norte' })
  @IsOptional()
  @IsString()
  campus?: string;
}
