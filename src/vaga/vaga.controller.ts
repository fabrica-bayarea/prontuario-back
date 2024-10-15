import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { VagaService } from './vaga.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { VagaResponse, CreateVagaDto } from './vaga.dto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de manutenção de disponibilidades dos colaboradores')
@Controller('vaga')
@UseGuards(JwtGuard)
export class VagaController {
  constructor(private readonly vagaService: VagaService) {}

  @ApiOperation({
    summary: 'Registra uma nova vaga',
    description:
      'Colaborador registra disponibilidade para atendimento em um período de atendimento criando uma nova vaga',
  })
  @ApiResponse({
    status: 201,
    description: 'disponibilidade da vaga registrada com sucesso!',
  })
  @ApiResponse({ status: 403, description: 'Permissões insuficientes' })
  @Post()
  async createPrograma(
    @Request() req,
    @Body() createVagaDto: CreateVagaDto,
  ): Promise<VagaResponse> {
    const idUsuario = req.user.id;
    try {
      return this.vagaService.createDisponibilidadeAtendimento(
        idUsuario,
        createVagaDto,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
