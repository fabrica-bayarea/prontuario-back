import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsDateString,
} from 'class-validator';

export type TipoDeUsuario = 'MASCULINO' | 'FEMININO' | 'OUTRO';

export const TiposDeUsuario: TipoDeUsuario[] = [
  'MASCULINO',
  'FEMININO',
  'OUTRO',
];

export class UpdateProfileDto {
  @ApiProperty({ example: 'Cleber' })
  @IsOptional()
  @IsString({ message: 'nome deve ser uma string' })
  nome?: string;

  @ApiProperty({ example: 'Guimarães' })
  @IsOptional()
  @IsString({ message: 'nome deve ser uma string' })
  sobrenome?: string;

  @ApiProperty({ example: 'cleber.guimaraes@email.com' })
  @IsOptional()
  @IsString({ message: 'email deve ser uma string' })
  email?: string;

  @ApiProperty({ example: '+5561995435997' })
  @IsOptional()
  @IsString({ message: 'telefone deve ser uma string' })
  @IsPhoneNumber('BR', {
    message: 'telefone deve ter o formato <CODIGO_DO_PAIS><DDD>xxxxxxxx',
  })
  telefone?: string;

  @ApiProperty({ example: 'brasilia' })
  @IsOptional()
  @IsString({ message: 'nome da cidade deve ser uma string' })
  cidade?: string;

  @ApiProperty({ example: '00000-00' })
  @IsOptional()
  @IsString({ message: 'cep deve ser uma string' })
  cep?: string;

  @ApiProperty({ example: 'Rua Exemplo, casa 123, Bairro' })
  @IsOptional()
  @IsString({ message: 'endereço deve ser uma string' })
  endereco?: string;

  @ApiProperty({ example: '1999-09-01' })
  @IsOptional()
  @IsDateString()
  nascimento?: Date;

  @ApiProperty({ example: 'MASCULINO' })
  @IsOptional()
  @IsEnum(TiposDeUsuario, {
    message: `gênero deve ser um dos valores: ${TiposDeUsuario.join(', ')}`,
  })
  genero?: TipoDeUsuario;

  @ApiProperty({ example: '2386101945' })
  @IsOptional()
  @IsString({ message: 'matricula deve ser uma string' })
  matricula?: string;
}

export class ProfileDto {
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

  @ApiProperty({ example: '+5561995435997' })
  @IsOptional()
  @IsString({ message: 'telefone deve ser uma string' })
  @IsPhoneNumber('BR', {
    message: 'telefone deve ter o formato <CODIGO_DO_PAIS><DDD>xxxxxxxx',
  })
  telefone: string;

  @ApiProperty({ example: 'brasilia' })
  @IsString({ message: 'nome da cidade deve ser uma string' })
  cidade: string;

  @ApiProperty({ example: '00000-00' })
  @IsString({ message: 'cep deve ser uma string' })
  cep: string;

  @ApiProperty({ example: 'Rua Exemplo, casa 123, Bairro' })
  @IsString({ message: 'endereço deve ser uma string' })
  endereco: string;

  @ApiProperty({ example: '1999-09-01' })
  @IsDateString()
  nascimento: Date;

  @ApiProperty({ example: 'MASCULINO' })
  @IsEnum(TiposDeUsuario, {
    message: `gênero deve ser um dos valores: ${TiposDeUsuario.join(', ')}`,
  })
  genero: TipoDeUsuario;
}
