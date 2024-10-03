import { PrismaService } from "src/prisma/prisma.service";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [ProfileController],
    providers: [PrismaService, ProfileService],
  })
  export class ProfileModule {}