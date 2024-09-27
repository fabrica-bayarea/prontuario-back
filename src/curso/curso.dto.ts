import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCursoDto {
  @ApiProperty({ example: 'Ciência da Computação' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'Matutino, Vespertino, Nortuno ou Integral' })
  @IsString()
  @IsNotEmpty()
  turno: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  coordenador: string;
}

export class UpdateCursoDto {
  @ApiProperty({ example: 'Direito' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'Matutino, Vespertino, Nortuno ou Integral' })
  @IsString()
  @IsNotEmpty()
  turno: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  coordenador: string;
}
