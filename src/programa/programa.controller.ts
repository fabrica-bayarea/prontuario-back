import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProgramaService } from './programa.service';
import { Programa } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import {
  CreateProgramaDto,
  CursoProgramaDto,
  UpdateProgramaDto,
} from './programa.dto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de manutenção de Programas')
@Controller('programas')
@UseGuards(JwtGuard)
export class ProgramaController {
  constructor(private readonly programaService: ProgramaService) {}

  @ApiOperation({
    summary: 'Cadastra um novo Programa',
    description: 'Cadastra um novo Programa e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Permissões insuficientes' })
  @Post()
  async createPrograma(
    @Request() req,
    @Body() createProgramaDto: CreateProgramaDto,
  ): Promise<Programa> {
    const idUsuario = req.user.id;
    try {
      return this.programaService.createPrograma(idUsuario, createProgramaDto);
    } catch (error) {
      console.log(error);
    }
  }

  @ApiOperation({
    summary: 'Operação de listagem de Programas',
    description: 'Retorna a lista atualizada de todos os Programas',
  })
  @ApiResponse({ status: 200, description: 'Programas listados com sucesso' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get()
  async getAllProgramas(): Promise<Programa[]> {
    return this.programaService.getAllProgramas();
  }

  @ApiOperation({
    summary: 'Operação de listagem de Programa por ID',
    description: 'Retorna um Programa pelo ID passado no parâmetro',
  })
  @ApiResponse({ status: 200, description: 'Programa listado com sucesso' })
  @ApiResponse({ status: 404, description: 'Programa não encontrado' })
  @Get('/byid/:id')
  async getProgramaById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Programa> {
    return this.programaService.getProgramaById(id);
  }

  @ApiOperation({
    summary: 'Operação de listagem de Programas por NOME',
    description: 'Filtra Programas com base em pesquisa de nome',
  })
  @ApiResponse({ status: 200, description: 'Programas listados com sucesso' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('pesquisar')
  async getProgramaByName(@Query('nome') nome: string): Promise<Programa[]> {
    return this.programaService.filterProgramasByName(nome);
  }

  @ApiOperation({
    summary: 'Operação de atualização de Programa do banco de dados por ID',
    description: 'Atualiza um Programa pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 204, description: 'Programa atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Programa não encontrado' })
  @Put(':id')
  async updatePrograma(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProgramaDto: UpdateProgramaDto,
  ): Promise<Programa> {
    const idUsuario = req.user.id;
    return this.programaService.updatePrograma(
      idUsuario,
      id,
      updateProgramaDto,
    );
  }

  @ApiOperation({
    summary:
      'Operação de inserção de um Curso relacionado a um Programa em banco de dados por ID',
    description:
      'Atualiza um Programa, atrelando a ele um Curso, pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 204, description: 'Programa atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Programa não encontrado' })
  @Patch('/adicionar/:id')
  async adicionarCursoPrograma(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() cursoProgramaDto: CursoProgramaDto,
  ): Promise<Programa> {
    const idUsuario = req.user.id;
    return this.programaService.adicionarCursoPrograma(
      idUsuario,
      id,
      cursoProgramaDto,
    );
  }

  @ApiOperation({
    summary:
      'Operação de remoção de um Curso relacionado a um Programa do banco de dados por ID',
    description:
      'Remove um Curso atrelado a um Programa do banco de dados pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 204, description: 'Curso removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  @Patch('/remover/:id')
  async removerCursoPrograma(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() cursoProgramaDto: CursoProgramaDto,
  ): Promise<Programa> {
    const idUsuario = req.user.id;
    return this.programaService.removerCursoPrograma(
      idUsuario,
      id,
      cursoProgramaDto,
    );
  }

  @ApiOperation({
    summary: 'Operação de remoção de um Programa do banco de dados por ID',
    description:
      'Remove um Programa do banco de dados pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 204, description: 'Programa removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Programa não encontrado' })
  @Delete(':id')
  async deletePrograma(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Programa> {
    const idUsuario = req.user.id;
    return this.programaService.deletePrograma(idUsuario, id);
  }
}
