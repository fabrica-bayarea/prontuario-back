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
import { Program } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import {
  CreateProgramaDto,
  CursoProgramaDto,
  UpdateProgramaDto,
} from './programa.dto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de manutenção de Programas')
@Controller('program')
@UseGuards(JwtGuard)
export class ProgramaController {
  constructor(private readonly programaService: ProgramaService) {}

  @ApiOperation({
    summary: 'Cadastra um novo Program',
    description: 'Cadastra um novo Program e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Course criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Permissões insuficientes' })
  @Post()
  async createPrograma(
    @Request() req,
    @Body() createProgramaDto: CreateProgramaDto,
  ): Promise<Program> {
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
  async getAllProgramas(): Promise<Program[]> {
    return this.programaService.getAllProgramas();
  }

  @ApiOperation({
    summary: 'Operação de listagem de Program por ID',
    description: 'Retorna um Program pelo ID passado no parâmetro',
  })
  @ApiResponse({ status: 200, description: 'Program listado com sucesso' })
  @ApiResponse({ status: 404, description: 'Program não encontrado' })
  @Get('/byid/:id')
  async getProgramaById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Program> {
    return this.programaService.getProgramaById(id);
  }

  @ApiOperation({
    summary: 'Operação de listagem de Programas por NOME',
    description: 'Filtra Programas com base em pesquisa de firstName',
  })
  @ApiResponse({ status: 200, description: 'Programas listados com sucesso' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('pesquisar')
  async getProgramaByName(
    @Query('firstName') firstName: string,
  ): Promise<Program[]> {
    return this.programaService.filterProgramasByName(firstName);
  }

  @ApiOperation({
    summary: 'Operação de atualização de Program do banco de dados por ID',
    description: 'Atualiza um Program pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 204, description: 'Program atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Program não encontrado' })
  @Put(':id')
  async updatePrograma(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProgramaDto: UpdateProgramaDto,
  ): Promise<Program> {
    const idUsuario = req.user.id;
    return this.programaService.updatePrograma(
      idUsuario,
      id,
      updateProgramaDto,
    );
  }

  @ApiOperation({
    summary: 'Operação de inscrever um beneficiário a um Program por ID',
    description:
      'Inscreve o usuário logado no program pelo ID do program passado por parâmetro',
  })
  @ApiResponse({ status: 200, description: 'Inscrito no program com sucesso!' })
  @ApiResponse({ status: 404, description: 'Program não encontrado' })
  @Patch('/adicionar-beneficiario/:id')
  async adicionarBeneficiarioPrograma(
    @Request() req,
    @Param('id', ParseIntPipe) idPrograma: number,
  ): Promise<Program> {
    const idUsuario = req.user.id;
    return this.programaService.adicionarBeneficiarioPrograma(
      idUsuario,
      idPrograma,
    );
  }

  @ApiOperation({
    summary: 'Operação de desinscrever um beneficiário de um Program por ID',
    description:
      'Desinscreve o usuário logado do program pelo ID do program passado por parâmetro',
  })
  @ApiResponse({
    status: 200,
    description: 'Desinscrito do program com sucesso!',
  })
  @ApiResponse({ status: 404, description: 'Program não encontrado' })
  @Patch('/remover-beneficiario/:id')
  async removerBeneficiarioPrograma(
    @Request() req,
    @Param('id', ParseIntPipe) idPrograma: number,
  ): Promise<Program> {
    const idUsuario = req.user.id;
    return this.programaService.removerBeneficiarioPrograma(
      idUsuario,
      idPrograma,
    );
  }

  @ApiOperation({
    summary:
      'Operação de inserção de um Course relacionado a um Program em banco de dados por ID',
    description:
      'Atualiza um Program, atrelando a ele um Course, pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 204, description: 'Program atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Program não encontrado' })
  @Patch('/adicionar-course/:id')
  async adicionarCursoPrograma(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() cursoProgramaDto: CursoProgramaDto,
  ): Promise<Program> {
    const idUsuario = req.user.id;
    return this.programaService.adicionarCursoPrograma(
      idUsuario,
      id,
      cursoProgramaDto,
    );
  }

  @ApiOperation({
    summary:
      'Operação de remoção de um Course relacionado a um Program do banco de dados por ID',
    description:
      'Remove um Course atrelado a um Program do banco de dados pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 204, description: 'Course removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Course não encontrado' })
  @Patch('/remover-course/:id')
  async removerCursoPrograma(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() cursoProgramaDto: CursoProgramaDto,
  ): Promise<Program> {
    const idUsuario = req.user.id;
    return this.programaService.removerCursoPrograma(
      idUsuario,
      id,
      cursoProgramaDto,
    );
  }

  @ApiOperation({
    summary: 'Operação de remoção de um Program do banco de dados por ID',
    description:
      'Remove um Program do banco de dados pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 204, description: 'Program removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Program não encontrado' })
  @Delete(':id')
  async deletePrograma(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Program> {
    const idUsuario = req.user.id;
    return this.programaService.deletePrograma(idUsuario, id);
  }
}
