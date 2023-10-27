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

export type TipoDeUsuario = 'ADMINISTRADOR' | 'CADASTRADOR';
export type TipoDeBeneficiario = 'BENEFICIARIO';

export const TiposDeUsuario: TipoDeUsuario[] = ['ADMINISTRADOR', 'CADASTRADOR'];
export const TiposDeBeneficiario: TipoDeBeneficiario[] = ['BENEFICIARIO'];

export class SignUpUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('BR')
  telefone: string;

  @IsEnum(TiposDeUsuario)
  tipo: TipoDeUsuario;

  @IsString()
  @IsStrongPassword()
  senha: string;
}

export class SignUpBeneficiarioDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsString()
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/)
  cpf: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('BR')
  telefone: string;

  @IsEnum(TiposDeBeneficiario)
  tipo: TipoDeBeneficiario;

  @IsString()
  @IsStrongPassword()
  senha: string;
}

export class SignInUsuarioDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  senha: string;
}

export class SignInBeneficiarioDto {
  @IsString()
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'CPF deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  @IsOptional()
  cpf?: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsString()
  senha: string;
}
