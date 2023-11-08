import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}

export class UpdateCursoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}
