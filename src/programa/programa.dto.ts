import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgramaDto {
  @ApiProperty({ example: 'Jovens conectados' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Program para jovens interessados em tecnologia',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'Ciência da Computação' })
  @IsNotEmpty()
  course: number | string;

  @ApiProperty({ example: 'Jovens de 15 a 18 anos' })
  @IsNotEmpty()
  @IsString()
  targetAudience: string;
}

export class UpdateProgramaDto {
  @ApiProperty({ example: 'Culinária Nordestina' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Course de culinaria focado na gastronomia nordestina',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Adultos de 25 a 40 anos' })
  @IsOptional()
  @IsString()
  targetAudience?: string;
}

export class CursoProgramaDto {
  @ApiProperty({ example: 'Psicologia' })
  @IsNotEmpty()
  course: number | string;
}
