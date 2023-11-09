import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { AtendimentoService } from './atendimento.service';
import {
  AtendimentoFilterDto,
  AtendimentoResponse,
  CreateAtendimentoDto,
  GetAtendimentoByCpfDto,
  UpdateDataAtendimentoDto,
} from './atendimento.dto';

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

  @Get()
  async getAllAtendimentos(): Promise<AtendimentoResponse[]> {
    return this.atendimentoService.getAllAtendimentos();
  }

  @Get()
  async getAtendimentosByCpf(
    @Body() dto: GetAtendimentoByCpfDto,
  ): Promise<AtendimentoResponse[]> {
    return this.atendimentoService.getAtendimentosByBeneficiarioCpf(dto);
  }

  @Get('by-date')
  async getAtendimentosByDate(
    @Body() dto: AtendimentoFilterDto,
  ): Promise<AtendimentoResponse[]> {
    return this.atendimentoService.getAtendimentosByDateRange(dto);
  }

  @Delete(':id')
  async deleteAtendimentoById(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.atendimentoService.deleteAtendimentoById(id);
  }

  @Patch('update-date/:id')
  async updateAtendimentoDate(
    @Param('id', ParseIntPipe) atendimentoId: number,
    @Body() dto: UpdateDataAtendimentoDto,
  ): Promise<AtendimentoResponse> {
    return this.atendimentoService.updateAtendimentoDate(atendimentoId, dto);
  }
}
