import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsDateString,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type GeneroEnum = 'MASCULINO' | 'FEMININO' | 'OUTRO';

export const generoEnum: GeneroEnum[] = ['MASCULINO', 'FEMININO', 'OUTRO'];

export type ParentescoEnum =
  | 'PAI'
  | 'MAE'
  | 'IRMAO'
  | 'IRMA'
  | 'FILHO'
  | 'FILHA'
  | 'OUTRO';

export const parentescoEnum: ParentescoEnum[] = [
  'PAI',
  'MAE',
  'IRMAO',
  'IRMA',
  'FILHO',
  'FILHA',
  'OUTRO',
];

export class createDependenteDto {
  @ApiProperty({ example: 'Cleber' })
  @IsNotEmpty({ message: 'nome não deve ser omitido' })
  @IsString({ message: 'nome deve ser uma string' })
  nome: string;

  @ApiProperty({ example: 'Guimarães' })
  @IsNotEmpty({ message: 'sobrenome não deve ser omitido' })
  @IsString({ message: 'nome deve ser uma string' })
  sobrenome: string;

  @ApiProperty({ example: 'cleber.guimaraes@email.com' })
  @IsEmail({}, { message: 'email deve ser um email válido' })
  @IsString({ message: 'email deve ser uma string' })
  email: string;

  @ApiProperty({ example: '123.456.789-10' })
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  cpf: string;

  @ApiProperty({ example: '+5561995435997' })
  @IsOptional()
  @IsString({ message: 'telefone deve ser uma string' })
  @IsPhoneNumber('BR', {
    message: 'telefone deve ter o formato <CODIGO_DO_PAIS><DDD>xxxxxxxx',
  })
  telefone: string;

  @ApiProperty({ example: '2024-09-01T17:00:00' })
  @IsDateString()
  nascimento: Date;

  @ApiProperty({ example: 'MASCULINO' })
  @IsEnum(generoEnum, {
    message: `Deve ser um dos seguintes dias da semana: ${generoEnum.join(', ')}`,
  })
  genero: GeneroEnum;

  @ApiProperty({ example: 'FILHO' })
  @IsEnum(parentescoEnum, {
    message: `Deve ser um dos tipos de parentesco: ${parentescoEnum.join(', ')}`,
  })
  parentesco: ParentescoEnum;

  @ApiProperty({ example: 'sindrome de tourette' })
  @IsString({ message: 'matricula deve ser uma string' })
  @IsOptional()
  necessidade_especial?: string;
}
