import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { AtendimentoService } from './atendimento.service';
import { AtendimentoResponse, CreateAtendimentoDto } from './atendimento.dto';

@Controller('atendimentos')
@UseGuards(JwtGuard)
export class AtendimentoController {
  constructor(private readonly atendimentoService: AtendimentoService) {}

  @Post()
  async createAtendimento(
    @Request() req: any,
    @Body() dto: CreateAtendimentoDto,
  ): Promise<AtendimentoResponse | { message: string }> {
    const idUsuario = req.user.id;
    try {
      return this.atendimentoService.createAtendimento(idUsuario, dto);
    } catch (err) {
      return { message: JSON.stringify(err) };
    }
  }
}
