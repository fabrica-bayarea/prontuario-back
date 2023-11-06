import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';
import {  ApiProperty } from '@nestjs/swagger';

export type TipoDeUsuario = 'ADMINISTRADOR' | 'CADASTRADOR';
export type TipoDeBeneficiario = 'BENEFICIARIO';

export const TiposDeUsuario: TipoDeUsuario[] = ['ADMINISTRADOR', 'CADASTRADOR'];
export const TiposDeBeneficiario: TipoDeBeneficiario[] = ['BENEFICIARIO'];

export class SignUpUsuarioDto {
  @ApiProperty({example: "Cleber Guimarães"})
  @IsNotEmpty({ message: 'nome não deve ser omitido' })
  @IsString({ message: 'nome deve ser uma string' })
  nome: string;

  @ApiProperty({example: "cleber.guimaraes@email.com"})
  @IsEmail({}, { message: 'email deve ser um email válido' })
  @IsString({ message: 'email deve ser uma string' })
  email: string;

  @ApiProperty({example: "+5561995435997"})
  @IsOptional()
  @IsString({ message: 'telefone deve ser uma string' })
  @IsPhoneNumber('BR', {
    message: 'telefone deve ter o formato <CODIGO_DO_PAIS><DDD>xxxxxxxx',
  })
  telefone: string;

  @ApiProperty({ enum: ['ADMINISTRADOR', 'CADASTRADOR'], example: "ADMINISTRADOR" })
  @IsEnum(TiposDeUsuario, {
    message: 'tipo deve ser ADMINISTRADOR ou CADASTRADOR',
  })
  tipo: TipoDeUsuario;

  @ApiProperty({example: "Senha123!"})
  @IsStrongPassword(
    {},
    {
      message:
        'senha deve conter no mínimo 8 caracteres, 1 letra mínuscula, 1 maíusucula, 1 número e 1 caractere especial',
    },
  )
  senha: string;
}

export class SignUpBeneficiarioDto {
  @ApiProperty({example: "Robson Paiva"})
  @IsNotEmpty({ message: 'nome não pode ser omitido' })
  @IsString({ message: 'nome deve ser uma string' })
  nome: string;

  @ApiProperty({example: "123.456.789-10"})
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  cpf: string;

  @ApiProperty({example: "rpaiva654@email.com"})
  @IsEmail({}, { message: 'email deve ser um email válido' })
  email: string;

  @ApiProperty({example: "+5511994532331"})
  @IsOptional()
  @IsPhoneNumber('BR', {
    message: 'telefone deve ter o formato <CODIGO_DO_PAIS><DDD>XXXXXXXX',
  })
  telefone: string;

  @ApiProperty({example: "BENEFICIARIO"})
  @IsEnum(TiposDeBeneficiario, { message: 'tipo deve ser BENEFICIARIO' })
  tipo: TipoDeBeneficiario;

  @ApiProperty({example: "Outrasenha321$"})
  @IsStrongPassword(
    {},
    {
      message:
        'senha deve conter no mínimo 8 caracteres, 1 letra mínuscula, 1 maíusucula, 1 número e 1 caractere especial',
    },
  )
  senha: string;
}

export class SignInUsuarioDto {
  @ApiProperty({example: "cleber.guimaraes@email.com"})
  @IsEmail({}, { message: 'email deve ser um email válido' })
  email: string;

  @ApiProperty({example: "Senha123!"})
  @IsNotEmpty({ message: 'senha não pode ser omitida' })
  @IsString({ message: 'senha deve ser uma string' })
  senha: string;
}

export class SignInBeneficiarioDto {
  @ApiProperty({example: "987.654.321-25"})
  @IsString()
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  @IsOptional()
  cpf?: string;

  @ApiProperty({example: "rpaiva654@email.com"})
  @IsEmail({}, { message: 'email deve ser um email válido' })
  @IsOptional()
  email?: string;

  @ApiProperty({example: "Outrasenha321$"})
  @IsNotEmpty({ message: 'senha não pode ser omitida' })
  @IsString({ message: 'senha deve ser uma string' })
  senha: string;
}
