import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DependenteModule } from './dependente/dependente.module';
import { PrismaModule } from './prisma/prisma.module';
import { CursoModule } from './curso/curso.module';
import { ProgramaModule } from './programa/programa.module';
import { PeriodoAtendimentoModule } from './periodoAtendimento/periodoAtendimento.module';
import { VagaModule } from './vaga/vaga.module';
import { AtendimentoModule } from './atendimento/atendimento.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    DependenteModule,
    CursoModule,
    ProgramaModule,
    PeriodoAtendimentoModule,
    VagaModule,
    AtendimentoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
