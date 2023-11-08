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

@Controller('programas')
@UseGuards(JwtGuard)
export class ProgramaController {
  constructor(private readonly programaService: ProgramaService) {}

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

  @Get()
  async getAllProgramas(): Promise<Programa[]> {
    return this.programaService.getAllProgramas();
  }

  @Get('/byid/:id')
  async getProgramaById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Programa> {
    return this.programaService.getProgramaById(id);
  }

  @Get('pesquisar')
  async getProgramaByName(@Query('nome') nome: string): Promise<Programa[]> {
    return this.programaService.filterProgramasByName(nome);
  }

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

  @Delete(':id')
  async deletePrograma(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Programa> {
    const idUsuario = req.user.id;
    return this.programaService.deletePrograma(idUsuario, id);
  }
}
