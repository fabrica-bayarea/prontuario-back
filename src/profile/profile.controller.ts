import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { ProfileService } from "./profile.service"
import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards, Request, HttpCode } from "@nestjs/common";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { ProfileDto, UpdateProfileDto } from "./profile.dto";

@ApiTags('Operações de manutenção de perfil de usuário')
@Controller('profiles')
@UseGuards(JwtGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

@ApiOperation({
    summary: 'Operação de listagem de informações de usuário por ID',
    description: 'Retorna as informações de um usuário pelo ID passado no parâmetro',
  })
  @ApiResponse({ status: 200, description: 'Perfil carregado com sucesso' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  @Get()
  async getUserProfile(
    @Request() req,
  ): Promise<ProfileDto> {
    const idUser = req.user.id;
    return this.profileService.getUserProfile(idUser);
  }

  @ApiOperation({
    summary: 'Operação de atualização de perfil de usuário por ID',
    description: 'Atualiza um perfil de usuário pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  @Put()
  @HttpCode(200)
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto, 
  ): Promise<UpdateProfileDto>{
    const idUser = req.user.id;
    return this.profileService.updateUserProfile(idUser, updateProfileDto);
  }
}