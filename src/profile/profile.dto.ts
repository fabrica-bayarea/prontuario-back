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

export type TipoDeUsuario = 'MALE' | 'FEMALE' | 'OTHER';

export const TiposDeUsuario: TipoDeUsuario[] = ['MALE', 'FEMALE', 'OTHER'];

export class UpdateProfileDto {
  @ApiProperty({ example: 'Cleber' })
  @IsOptional()
  @IsString({ message: 'firstName deve ser uma string' })
  firstName?: string;

  @ApiProperty({ example: 'Guimarães' })
  @IsOptional()
  @IsString({ message: 'firstName deve ser uma string' })
  lastName?: string;

  @ApiProperty({ example: 'cleber.guimaraes@email.com' })
  @IsOptional()
  @IsString({ message: 'email deve ser uma string' })
  email?: string;

  @ApiProperty({ example: '+5561995435997' })
  @IsOptional()
  @IsString({ message: 'phone deve ser uma string' })
  @IsPhoneNumber('BR', {
    message: 'phone deve ter o formato <CODIGO_DO_PAIS><DDD>xxxxxxxx',
  })
  phone?: string;

  @ApiProperty({ example: 'brasilia' })
  @IsOptional()
  @IsString({ message: 'firstName da city deve ser uma string' })
  city?: string;

  @ApiProperty({ example: '00000-00' })
  @IsOptional()
  @IsString({ message: 'cep deve ser uma string' })
  cep?: string;

  @ApiProperty({ example: 'Rua Exemplo, casa 123, Bairro' })
  @IsOptional()
  @IsString({ message: 'endereço deve ser uma string' })
  address?: string;

  @ApiProperty({ example: '1999-09-01' })
  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @ApiProperty({ example: 'MALE' })
  @IsOptional()
  @IsEnum(TiposDeUsuario, {
    message: `gênero deve ser um dos valores: ${TiposDeUsuario.join(', ')}`,
  })
  gender?: TipoDeUsuario;

  @ApiProperty({ example: '2386101945' })
  @IsOptional()
  @IsString({ message: 'registration deve ser uma string' })
  registration?: string;
}

export class ProfileDto {
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

  @ApiProperty({ example: '1999-09-01' })
  @IsDateString()
  birthDate: Date;

  @ApiProperty({ example: 'MALE' })
  @IsEnum(TiposDeUsuario, {
    message: `gênero deve ser um dos valores: ${TiposDeUsuario.join(', ')}`,
  })
  gender: TipoDeUsuario;
}
