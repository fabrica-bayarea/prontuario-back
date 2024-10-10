import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ProfileController],
  providers: [PrismaService, ProfileService],
})
export class ProfileModule {}
