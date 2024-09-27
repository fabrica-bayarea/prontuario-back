import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type Turnos = 'Matutino' | 'Vespertino' | 'Noturno' | 'Integral';
const Turnos: Turnos[] = ['Matutino', 'Vespertino', 'Noturno', 'Integral'];
export class CreateCursoDto {
  @ApiProperty({ example: 'Ciência da Computação' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    enum: ['Matutino', 'Vespertino', 'Noturno', 'Integral'],
    example: 'Matutino',
  })
  @IsEnum(Turnos, {
    message: 'O turno deve ser Matutino, Vespertino, Noturno ou Integral',
  })
  turno: Turnos;

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

  @ApiProperty({
    enum: ['Matutino', 'Vespertino', 'Noturno', 'Integral'],
    example: 'Matutino',
  })
  @IsEnum(Turnos, {
    message: 'O turno deve ser Matutino, Vespertino, Noturno ou Integral',
  })
  turno: Turnos;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  coordenador: string;
}
