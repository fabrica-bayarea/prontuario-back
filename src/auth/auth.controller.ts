import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInBeneficiarioDto, SignInUsuarioDto, SignUpBeneficiarioDto, SignUpUsuarioDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup/usuario')
  signUpUsuario(@Body() dto: SignUpUsuarioDto) {
    return this.authService.signUpUsuario(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin/usuario')
  signInUsuario(@Body() dto: SignInUsuarioDto) {
    return this.authService.signInUsuario(dto);
  }

  @Post('signup/beneficiario')
  signUpBeneficiario(@Body() dto: SignUpBeneficiarioDto){
    return this.authService.signUpBeneficiario(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin/beneficiario')
  signInBeneficiario(@Body() dto: SignInBeneficiarioDto){
    return this.authService.signInBeneficiario(dto);
  }
}
