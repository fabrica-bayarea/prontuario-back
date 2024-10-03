import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { ProfileService } from "./profile.service"
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { Usuario } from "@prisma/client";

@ApiTags('Operações de manutenção de perfil de usuário')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

@ApiOperation({
    summary: 'Operação de listagem de informações de usuário por ID',
    description: 'Retorna as informações de um usuário pelo ID passado no parâmetro',
  })
  @ApiResponse({ status: 200, description: 'Perfil carregado com sucesso' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  @Get('/byid/:id')
  async getUserProfile(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.profileService.getUserProfile(id);
  }

  @Get()
  async returnString(){
    return 'Hello Georges!'
  }
}