import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CursoController } from './curso.controller';
import { CursoService } from './curso.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [CursoController],
  providers: [PrismaService, AuthService, CursoService],
})
export class CursoModule {}
