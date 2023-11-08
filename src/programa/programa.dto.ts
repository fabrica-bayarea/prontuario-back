import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProgramaDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  curso: number | string;
}

export class UpdateProgramaDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  curso?: number | string;
}

export class CursoProgramaDto {
  @IsNotEmpty()
  curso: number | string;
}
