import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInBeneficiarioDto,
  SignInUsuarioDto,
  SignUpBeneficiarioDto,
  SignUpUsuarioDto,
} from './dto/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de manutenção de Usuários')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Cadastra um novo Usuário',
    description: 'Cria um novo usuário e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @Post('signup/usuario')
  signUpUsuario(@Body() dto: SignUpUsuarioDto) {
    return this.authService.signUpUsuario(dto);
  }

  @ApiOperation({
    summary: 'Login de Usuário',
    description:
      'Autentica um usuário, e, caso encontrado em banco de dados, permite o acesso desse usuário',
  })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin/usuario')
  signInUsuario(@Body() dto: SignInUsuarioDto) {
    return this.authService.signInUsuario(dto);
  }

  @ApiOperation({
    summary: 'Cadastra um novo Beneficiário',
    description:
      'Cria um novo usuário "Beneficiário" e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @Post('signup/beneficiario')
  signUpBeneficiario(@Body() dto: SignUpBeneficiarioDto) {
    return this.authService.signUpBeneficiario(dto);
  }

  @ApiOperation({
    summary: 'Loga um Beneficiário',
    description:
      'Autentica um usuário "Beneficiário", e, caso encontrado em banco de dados, permite o acesso desse usuário',
  })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin/beneficiario')
  signInBeneficiario(@Body() dto: SignInBeneficiarioDto) {
    return this.authService.signInBeneficiario(dto);
  }
}
