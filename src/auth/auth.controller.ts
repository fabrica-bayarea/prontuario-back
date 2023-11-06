import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInBeneficiarioDto,
  SignInUsuarioDto,
  SignUpBeneficiarioDto,
  SignUpUsuarioDto,
} from './dto/auth.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Cadastro e Login')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Cadastra um novo Usuário' })
  @Post('signup/usuario')
  signUpUsuario(@Body() dto: SignUpUsuarioDto) {
    return this.authService.signUpUsuario(dto);
  }

  @ApiOperation({ summary: 'Loga um Usuário' })
  @HttpCode(HttpStatus.OK)
  @Post('signin/usuario')
  signInUsuario(@Body() dto: SignInUsuarioDto) {
    return this.authService.signInUsuario(dto);
  }

  @ApiOperation({ summary: 'Cadastra um novo Beneficiário' })
  @Post('signup/beneficiario')
  signUpBeneficiario(@Body() dto: SignUpBeneficiarioDto) {
    return this.authService.signUpBeneficiario(dto);
  }

  @ApiOperation({ summary: 'Loga um Beneficiário' })
  @HttpCode(HttpStatus.OK)
  @Post('signin/beneficiario')
  signInBeneficiario(@Body() dto: SignInBeneficiarioDto) {
    return this.authService.signInBeneficiario(dto);
  }
}
