import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto, UpdateProfileDto } from './profile.dto';
import { Program } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(id: number): Promise<ProfileDto> {
    const userProfile = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!userProfile) {
      throw new Error(`Usuário com ID ${id} não encontrado.`);
    }

    const userData = {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      phone: userProfile.phone,
      cep: userProfile.cep,
      city: userProfile.city,
      address: userProfile.address,
      birthDate: userProfile.birthDate,
      gender: userProfile.gender,
      cpf: userProfile.cpf,
      userType: userProfile.userType,
      registration: userProfile.registration,
    };

    return userData;
  }

  async updateUserProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UpdateProfileDto> {
    const userProfile = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!userProfile) {
      throw new Error(`Usuário com ID ${id} não encontrado.`);
    }

    const userData = {
      firstName: updateProfileDto.firstName,
      lastName: updateProfileDto.lastName,
      email: updateProfileDto.email,
      phone: updateProfileDto.phone,
      city: updateProfileDto.city,
      address: updateProfileDto.address,
      cep: updateProfileDto.cep,
      gender: updateProfileDto.gender,
      registration: updateProfileDto.registration,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: userData,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        address: true,
        cep: true,
        birthDate: true,
        gender: true,
        cpf: true,
        userType: true,
        registration: true,
      },
    });
    return updatedUser;
  }

  async getProgramsParticipate(id: number): Promise<Program[]> {
    const program = await this.prisma.user.findUnique({
      where: { id },
      include: {
        program: true,
      },
    });

    return program.program || [];
  }
}
