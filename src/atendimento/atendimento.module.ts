import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AtendimentoService } from './atendimento.service';
import { AtendimentoController } from './atendimento.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AtendimentoController],
  providers: [PrismaService, AuthService, AtendimentoService],
})
export class AtendimentoModule {}
