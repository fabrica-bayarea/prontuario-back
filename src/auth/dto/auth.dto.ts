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

export type GeneroEnum = 'MALE' | 'FEMALE' | 'OTHER';

export const generoEnum: GeneroEnum[] = ['MALE', 'FEMALE', 'OTHER'];

export class SignUpUsuarioDto {
  @ApiProperty({ example: 'Cleber' })
  @IsNotEmpty({ message: 'firstName não deve ser omitido' })
  @IsString({ message: 'firstName deve ser uma string' })
  firstName: string;

  @ApiProperty({ example: 'Guimarães' })
  @IsNotEmpty({ message: 'lastName não deve ser omitido' })
  @IsString({ message: 'firstName deve ser uma string' })
  lastName: string;

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
  @IsString({ message: 'phone deve ser uma string' })
  @IsPhoneNumber('BR', {
    message: 'phone deve ter o formato <CODIGO_DO_PAIS><DDD>xxxxxxxx',
  })
  phone: string;

  @ApiProperty({ example: 'brasilia' })
  @IsString({ message: 'firstName da city deve ser uma string' })
  city: string;

  @ApiProperty({ example: '00000-00' })
  @IsString({ message: 'cep deve ser uma string' })
  cep: string;

  @ApiProperty({ example: 'Rua Exemplo, casa 123, Bairro' })
  @IsString({ message: 'endereço deve ser uma string' })
  address: string;

  @ApiProperty({ example: '2024-09-01T17:00:00' })
  @IsDateString()
  birthDate: Date;

  @ApiProperty({ example: 'MALE' })
  @IsEnum(generoEnum, {
    message: `Deve ser um dos seguintes dias da semana: ${generoEnum.join(
      ', ',
    )}`,
  })
  gender: GeneroEnum;

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
  @IsString({ message: 'registration deve ser uma string' })
  @IsOptional()
  registration?: string;
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
