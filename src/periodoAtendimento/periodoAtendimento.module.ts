import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PeriodoAtendimentoService } from './periodoAtendimento.service';
import { PeriodoAtendimentoController } from './periodoAtendimento.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PeriodoAtendimentoController],
  providers: [PrismaService, AuthService, PeriodoAtendimentoService],
})
export class PeriodoAtendimentoModule {}
