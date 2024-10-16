import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { PeriodoAtendimentoService } from './periodoAtendimento.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import {
  createPeriodoAtendimentoResponse,
  CreatePeriodoAtendimentoDto,
} from './periodoAtendimento.dto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de manutenção de periodos de atendimentos')
@Controller('periodo-atendimentos')
@UseGuards(JwtGuard)
export class PeriodoAtendimentoController {
  constructor(private readonly vagaService: PeriodoAtendimentoService) {}

  @ApiOperation({
    summary: 'Cria um novo periodo de atendimentos',
    description:
      'Cria um novo período de atendimentos para os colaboradores colocarem suas disponibilidades.',
  })
  @ApiResponse({
    status: 201,
    description: 'Novo periodo de atendimentos registrado!',
  })
  @ApiResponse({ status: 403, description: 'Permissões insuficientes' })
  @Post()
  async createPrograma(
    @Request() req,
    @Body() createPeriodoAtendimentoDto: CreatePeriodoAtendimentoDto,
  ): Promise<createPeriodoAtendimentoResponse> {
    const idUsuario = req.user.id;
    try {
      return this.vagaService.createPeriodoAtendimento(
        idUsuario,
        createPeriodoAtendimentoDto,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
