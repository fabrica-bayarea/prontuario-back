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

@Controller('cursos')
@UseGuards(JwtGuard)
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post()
  async createCurso(
    @Request() req,
    @Body() createCursoDto: CreateCursoDto,
  ): Promise<Curso> {
    const idUsuario = req.user.id;
    return this.cursoService.createCurso(idUsuario, createCursoDto);
  }

  @Get()
  async getAllCursos(): Promise<Curso[]> {
    return this.cursoService.getAllCursos();
  }

  @Get('/byid/:id')
  async getCursoById(@Param('id', ParseIntPipe) id: number): Promise<Curso> {
    return this.cursoService.getCursoById(id);
  }

  @Get('pesquisar')
  async getCursoByName(@Query('nome') nome: string): Promise<Curso[]> {
    return this.cursoService.filterCursosByName(nome);
  }

  @Put(':id')
  async updateCurso(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCursoDto: UpdateCursoDto,
  ): Promise<Curso> {
    const idUsuario = req.user.id;
    return this.cursoService.updateCurso(idUsuario, id, updateCursoDto);
  }

  @Delete(':id')
  async deleteCurso(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Curso> {
    const idUsuario = req.user.id;
    return this.cursoService.deleteCurso(idUsuario, id);
  }
}
