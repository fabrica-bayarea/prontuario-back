import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { AtendimentoService } from './atendimento.service';
import {
  AtendimentoResponse,
  CreateAtendimentoDto,
  GetAtendimentoByCpfDto,
} from './atendimento.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de manutenção de Atendimentos')
@Controller('atendimentos')
@UseGuards(JwtGuard)
export class AtendimentoController {
  constructor(private readonly atendimentoService: AtendimentoService) {}

  @ApiOperation({
    summary: 'Cadastra um novo Atendimento',
    description: 'Cadastra um novo Atendimento e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Atendimento criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Permissões insuficientes' })
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

  @ApiOperation({
    summary: 'Operação de listagem de Atendimentos',
    description: 'Retorna a lista atualizada de todos os Atendimentos',
  })
  @ApiResponse({
    status: 200,
    description: 'Atendimentos listados com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get()
  async getAllAtendimentos(): Promise<AtendimentoResponse[]> {
    return this.atendimentoService.getAllAtendimentos();
  }

  @ApiOperation({
    summary: 'Operação de listagem de Atendimentos por CPF',
    description:
      'Retorna a lista atualizada de todos os Atendimentos associados a um CPF',
  })
  @ApiResponse({
    status: 200,
    description: 'Atendimentos listados com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Atendimentos não encontrados' })
  @Get()
  async getAtendimentosByCpf(
    @Body() dto: GetAtendimentoByCpfDto,
  ): Promise<AtendimentoResponse[]> {
    return this.atendimentoService.getAtendimentosByBeneficiarioCpf(dto);
  }

  @ApiOperation({
    summary: 'Operação de remoção de um Atendimento do banco de dados por ID',
    description:
      'Remove um Atendimento do banco de dados pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 204, description: 'Atendimento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Atendimento não encontrado' })
  @Delete(':id')
  async deleteAtendimentoById(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.atendimentoService.deleteAtendimentoById(id);
  }
}
