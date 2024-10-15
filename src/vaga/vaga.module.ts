import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { VagaService } from './vaga.service';
import { VagaController } from './vaga.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [VagaController],
  providers: [PrismaService, AuthService, VagaService],
})
export class VagaModule {}
