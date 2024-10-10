import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto, UpdateProfileDto } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(id: number): Promise<ProfileDto> {
    const userProfile = await this.prisma.usuario.findUnique({
      where: { id: id },
    });

    const userData = {
      nome: userProfile.nome,
      sobrenome: userProfile.sobrenome,
      email: userProfile.email,
      telefone: userProfile.telefone,
      cidade: userProfile.cidade,
      cep: userProfile.cep,
      endereco: userProfile.endereco,
      tipo: userProfile.tipo,
    };

    if (!userProfile) {
      throw new Error(`Usuário com ID ${id} não encontrado.`);
    }
    return userData;
  }

  async updateUserProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UpdateProfileDto> {
    const userProfile = await this.prisma.usuario.findUnique({
      where: { id: id },
    });
    if (!userProfile) {
      throw new Error(`Usuário com ID ${id} não encontrado.`);
    }

    const userData = {
      nome: updateProfileDto.nome,
      sobrenome: updateProfileDto.sobrenome,
      email: updateProfileDto.email,
      telefone: updateProfileDto.telefone,
      cidade: updateProfileDto.cidade,
      endereco: updateProfileDto.endereco,
      cep: updateProfileDto.cep,
    };

    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: {
        nome: userData.nome,
        sobrenome: userData.sobrenome,
        email: userData.email,
        telefone: userData.telefone,
        cidade: userData.cidade,
        endereco: userData.endereco,
        cep: userData.cep,
      },
      select: {
        nome: true,
        sobrenome: true,
        email: true,
        telefone: true,
        cidade: true,
        endereco: true,
        cep: true,
      },
    });
    return updatedUser;
  }
}
