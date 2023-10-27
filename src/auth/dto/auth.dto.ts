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
  @IsNotEmpty({ message: 'nome não deve ser omitido' })
  @IsString({ message: 'nome deve ser uma string' })
  nome: string;

  @IsEmail({}, { message: 'email deve ser um email válido' })
  @IsString({ message: 'email deve ser uma string' })
  email: string;

  @IsOptional()
  @IsString({ message: 'telefone deve ser uma string' })
  @IsPhoneNumber('BR', {
    message: 'telefone deve ter o formato <CODIGO_DO_PAIS><DDD>xxxxxxxx',
  })
  telefone: string;

  @IsEnum(TiposDeUsuario, {
    message: 'tipo deve ser ADMINISTRADOR ou CADASTRADOR',
  })
  tipo: TipoDeUsuario;

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
  @IsNotEmpty({ message: 'nome não pode ser omitido' })
  @IsString({ message: 'nome deve ser uma string' })
  nome: string;

  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  cpf: string;

  @IsEmail({}, { message: 'email deve ser um email válido' })
  email: string;

  @IsOptional()
  @IsPhoneNumber('BR', {
    message: 'telefone deve ter o formato <CODIGO_DO_PAIS><DDD>XXXXXXXX',
  })
  telefone: string;

  @IsEnum(TiposDeBeneficiario, { message: 'tipo deve ser BENEFICIARIO' })
  tipo: TipoDeBeneficiario;

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
  @IsEmail({}, { message: 'email deve ser um email válido' })
  email: string;

  @IsNotEmpty({ message: 'senha não pode ser omitida' })
  @IsString({ message: 'senha deve ser uma string' })
  senha: string;
}

export class SignInBeneficiarioDto {
  @IsString()
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  @IsOptional()
  cpf?: string;

  @IsEmail({}, { message: 'email deve ser um email válido' })
  @IsOptional()
  email?: string;

  @IsNotEmpty({ message: 'senha não pode ser omitida' })
  @IsString({ message: 'senha deve ser uma string' })
  senha: string;
}
