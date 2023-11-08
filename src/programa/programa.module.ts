import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProgramaService } from './programa.service';
import { ProgramaController } from './programa.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ProgramaController],
  providers: [PrismaService, AuthService, ProgramaService],
})
export class ProgramaModule {}
