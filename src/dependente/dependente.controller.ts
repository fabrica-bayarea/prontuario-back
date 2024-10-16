import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { DependenteService } from './dependente.service';
import { createDependenteDto } from './dependente.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Dependente } from '@prisma/client';

@ApiTags('Operações de manutenção de Dependentes')
@Controller('dependente')
@UseGuards(JwtGuard)
export class DependenteController {
  constructor(private authService: DependenteService) {}

  @ApiOperation({
    summary: 'Registra um novo dependente',
    description: 'Registra um novo dependente no usuario logado',
  })
  @ApiResponse({
    status: 201,
    description: 'Dependente cadastrado com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Json invalido' })
  @Post()
  signUpUsuario(
    @Request() req,
    @Body() dto: createDependenteDto,
  ): Promise<Dependente> {
    const idUser = req.user.id;
    return this.authService.createDependente(idUser, dto);
  }
}
