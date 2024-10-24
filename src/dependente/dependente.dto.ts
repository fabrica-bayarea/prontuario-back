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

export type GeneroEnum = 'MALE' | 'FEMALE' | 'OTHER';

export const generoEnum: GeneroEnum[] = ['MALE', 'FEMALE', 'OTHER'];

export type ParentescoEnum =
  | 'FATHER'
  | 'MOTHER'
  | 'BROTHER'
  | 'SISTER'
  | 'SON'
  | 'DAUGHTER'
  | 'OTHER';

export const parentescoEnum: ParentescoEnum[] = [
  'FATHER',
  'MOTHER',
  'BROTHER',
  'SISTER',
  'SON',
  'DAUGHTER',
  'OTHER',
];

export class createDependenteDto {
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

  @ApiProperty({ example: 'SON' })
  @IsEnum(parentescoEnum, {
    message: `Deve ser um dos tipos de relationship: ${parentescoEnum.join(
      ', ',
    )}`,
  })
  relationship: ParentescoEnum;

  @ApiProperty({ example: 'sindrome de tourette' })
  @IsString({ message: 'registration deve ser uma string' })
  @IsOptional()
  specialNeeds?: string;
}
