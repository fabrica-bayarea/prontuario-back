import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsDateString,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type GeneroEnum = 'MASCULINO' | 'FEMININO' | 'OUTRO';

export const generoEnum: GeneroEnum[] = ['MASCULINO', 'FEMININO', 'OUTRO'];

export class SignUpUsuarioDto {
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

  @ApiProperty({ example: 'brasilia' })
  @IsString({ message: 'nome da cidade deve ser uma string' })
  cidade: string;

  @ApiProperty({ example: '00000-00' })
  @IsString({ message: 'cep deve ser uma string' })
  cep: string;

  @ApiProperty({ example: 'Rua Exemplo, casa 123, Bairro' })
  @IsString({ message: 'endereço deve ser uma string' })
  endereco: string;

  @ApiProperty({ example: '2024-09-01T17:00:00' })
  @IsDateString()
  nascimento: Date;

  @ApiProperty({ example: 'MASCULINO' })
  @IsEnum(generoEnum, {
    message: `Deve ser um dos seguintes dias da semana: ${generoEnum.join(', ')}`,
  })
  genero: GeneroEnum;

  @ApiProperty({ example: 'Senha123!' })
  @IsStrongPassword(
    {},
    {
      message:
        'senha deve conter no mínimo 8 caracteres, 1 letra mínuscula, 1 maíusucula, 1 número e 1 caractere especial',
    },
  )
  senha: string;

  @ApiProperty({ example: '2386101945' })
  @IsString({ message: 'matricula deve ser uma string' })
  @IsOptional()
  matricula?: string;
}

export class SignInUsuarioDto {
  @IsString()
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  @IsOptional()
  cpf?: string;

  @ApiProperty({ example: 'cleber.guimaraes@email.com' })
  @IsEmail({}, { message: 'email deve ser um email válido' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Senha123!' })
  @IsNotEmpty({ message: 'senha não pode ser omitida' })
  @IsString({ message: 'senha deve ser uma string' })
  senha: string;
}
export class updatePasswordDto {
  @ApiProperty({ example: 'Senha123!' })
  @IsNotEmpty({ message: 'senha não pode ser omitida' })
  @IsString({ message: 'senha deve ser uma string' })
  current_pass: string;

  @ApiProperty({ example: 'Senha123!' })
  @IsNotEmpty({ message: 'senha não pode ser omitida' })
  @IsString({ message: 'senha deve ser uma string' })
  new_pass: string;

  @ApiProperty({ example: 'Senha123!' })
  @IsNotEmpty({ message: 'senha não pode ser omitida' })
  @IsString({ message: 'senha deve ser uma string' })
  repeat_new_pass: string;
}
