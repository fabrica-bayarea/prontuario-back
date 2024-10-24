import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { VagaService } from './vaga.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { VagaResponse, CreateVagaDto } from './vaga.dto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de manutenção de disponibilidades dos colaboradores')
@Controller('slot')
@UseGuards(JwtGuard)
export class VagaController {
  constructor(private readonly vagaService: VagaService) {}

  @ApiOperation({
    summary: 'Registra uma nova slot',
    description:
      'Collaborator registra disponibilidade para appointment em um período de appointment criando uma nova slot',
  })
  @ApiResponse({
    status: 201,
    description: 'disponibilidade da slot registrada com sucesso!',
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
