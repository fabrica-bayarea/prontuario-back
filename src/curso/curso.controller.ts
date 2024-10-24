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
import { Course } from '@prisma/client';
import { CreateCursoDto, UpdateCursoDto } from './curso.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de manutenção de Cursos')
@Controller('course')
@UseGuards(JwtGuard)
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @ApiOperation({
    summary: 'Cadastra um novo Course',
    description: 'Cria um novo Course e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Course criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Permissões insuficientes' })
  @Post()
  async createCurso(
    @Request() req,
    @Body() createCursoDto: CreateCursoDto,
  ): Promise<Course> {
    const idUsuario = req.user.id;
    return this.cursoService.createCurso(idUsuario, createCursoDto);
  }

  @ApiOperation({
    summary: 'Operação de listagem de Cursos',
    description: 'Retorna a lista atualizada de todos os Cursos',
  })
  @ApiResponse({ status: 200, description: 'Cursos listados com sucesso' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get()
  async getAllCursos(): Promise<Course[]> {
    return this.cursoService.getAllCursos();
  }

  @ApiOperation({
    summary: 'Operação de listagem de Course por ID',
    description: 'Retorna um Course pelo ID passado no parâmetro',
  })
  @ApiResponse({ status: 200, description: 'Course listado com sucesso' })
  @ApiResponse({ status: 404, description: 'Course não encontrado' })
  @Get('/byid/:id')
  async getCursoById(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    return this.cursoService.getCursoById(id);
  }

  @ApiOperation({
    summary: 'Operação de listagem de Cursos por NOME',
    description: 'Filtra Cursos com base em pesquisa de firstName',
  })
  @ApiResponse({ status: 200, description: 'Cursos listados com sucesso' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('pesquisar')
  async getCursoByName(
    @Query('firstName') firstName: string,
  ): Promise<Course[]> {
    return this.cursoService.filterCursosByName(firstName);
  }

  @ApiOperation({
    summary: 'Operação de atualização de Course do banco de dados por ID',
    description: 'Atualiza um Course pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 204, description: 'Course atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Course não encontrado' })
  @Put(':id')
  async updateCurso(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCursoDto: UpdateCursoDto,
  ): Promise<Course> {
    const idUsuario = req.user.id;
    return this.cursoService.updateCurso(idUsuario, id, updateCursoDto);
  }

  @ApiOperation({
    summary: 'Operação de remoção de Course do banco de dados por ID',
    description:
      'Remove um Course do banco de dados pelo ID passado por parâmetro',
  })
  @ApiResponse({ status: 204, description: 'Course removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Course não encontrado' })
  @Delete(':id')
  async deleteCurso(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Course> {
    const idUsuario = req.user.id;
    return this.cursoService.deleteCurso(idUsuario, id);
  }
}
