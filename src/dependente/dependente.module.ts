import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DependenteService } from './dependente.service';
import { DependenteController } from './dependente.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [DependenteController],
  providers: [PrismaService, AuthService, DependenteService],
})
export class DependenteModule {}
