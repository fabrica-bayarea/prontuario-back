import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CursoModule } from './curso/curso.module';
import { ProgramaModule } from './programa/programa.module';
import { AtendimentoModule } from './atendimento/atendimento.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CursoModule,
    ProgramaModule,
    AtendimentoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
