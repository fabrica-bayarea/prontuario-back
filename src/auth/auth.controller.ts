import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInUsuarioDto,
  SignUpUsuarioDto,
  updatePasswordDto,
} from './dto/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from './guard/jwt.guard';

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
  @Post('signup/')
  signUpUsuario(@Body() dto: SignUpUsuarioDto) {
    return this.authService.signUpUsuario(dto);
  }

  @ApiOperation({
    summary: 'Login de Usuário',
    description:
      'Autentica um usuário, e, caso encontrado em banco de dados, permite o acesso desse usuário. Pode ser usado email ou cpf',
  })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin/')
  signInUsuario(@Body() dto: SignInUsuarioDto) {
    return this.authService.signInUsuario(dto);
  }

  @ApiOperation({
    summary: 'Atualiza a senha do usuário logado',
    description: 'Atualiza a senha do usuário e grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Senha atualizada com sucesso' })
  @ApiResponse({ status: 403, description: 'Senha inválida' })
  @Patch('reset-password/')
  @UseGuards(JwtGuard)
  resetPassword(
    @Request() req, 
    @Body() passwordDto: updatePasswordDto
  ) {
    const idUser = req.user.id;
    return this.authService.updatePassword(idUser, passwordDto);
  }
}
