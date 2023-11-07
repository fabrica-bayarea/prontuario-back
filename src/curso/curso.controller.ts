import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CursoService } from './curso.service';
import { Curso } from '@prisma/client';
import { CreateCursoDto, UpdateCursoDto } from './curso.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de manutenção de Cursos')
@Controller('cursos')
@UseGuards(JwtGuard)
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @ApiOperation({
    summary: 'Cadastra um novo Curso',
    description: 'Cria um novo Curso e o grava em banco de dados',
  })
  @Post()
  async createCurso(
    @Request() req,
    @Body() createCursoDto: CreateCursoDto,
  ): Promise<Curso> {
    const idUsuario = req.user.id;
    return this.cursoService.createCurso(idUsuario, createCursoDto);
  }

  @ApiOperation({
    summary: 'Operação de listagem de Cursos',
    description: 'Retorna a lista atualizada de todos os Cursos',
  })
  @Get()
  async getAllCursos(): Promise<Curso[]> {
    return this.cursoService.getAllCursos();
  }

  @ApiOperation({
    summary: 'Operação de listagem de Curso por ID',
    description: 'Retorna um Curso pelo ID passado no parâmetro',
  })
  @Get('/byid/:id')
  async getCursoById(@Param('id', ParseIntPipe) id: number): Promise<Curso> {
    return this.cursoService.getCursoById(id);
  }

  @ApiOperation({
    summary: 'Operação de listagem de Cursos por NOME',
    description: 'Filtra Cursos com base em pesquisa de nome',
  })
  @Get('pesquisar')
  async getCursoByName(@Query('nome') nome: string): Promise<Curso[]> {
    return this.cursoService.filterCursosByName(nome);
  }

  @ApiOperation({
    summary: 'Operação de atualização de Curso do banco de dados por ID',
    description: 'Atualiza um Curso pelo ID passado por parâmetro',
  })
  @Put(':id')
  async updateCurso(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCursoDto: UpdateCursoDto,
  ): Promise<Curso> {
    const idUsuario = req.user.id;
    return this.cursoService.updateCurso(idUsuario, id, updateCursoDto);
  }

  @ApiOperation({
    summary: 'Operação de remoção de Curso do banco de dados por ID',
    description:
      'Remove um Curso do banco de dados pelo ID passado por parâmetro',
  })
  @Delete(':id')
  async deleteCurso(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Curso> {
    const idUsuario = req.user.id;
    return this.cursoService.deleteCurso(idUsuario, id);
  }
}
