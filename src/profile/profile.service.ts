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

    if (!userProfile) {
      throw new Error(`Usuário com ID ${id} não encontrado.`);
    }

    const userData = {
      nome: userProfile.nome,
      sobrenome: userProfile.sobrenome,
      email: userProfile.email,
      telefone: userProfile.telefone,
      cep: userProfile.cep,
      cidade: userProfile.cidade,
      endereco: userProfile.endereco,
      nascimento: userProfile.nascimento,
      genero: userProfile.genero,
      cpf: userProfile.cpf,
      tipo: userProfile.tipo,
      matricula: userProfile.matricula,
    };

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
      genero: updateProfileDto.genero,
      matricula: updateProfileDto.matricula,
    };

    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: userData,
      select: {
        nome: true,
        sobrenome: true,
        email: true,
        telefone: true,
        cidade: true,
        endereco: true,
        cep: true,
        nascimento: true,
        genero: true,
        cpf: true,
        tipo: true,
        matricula: true,
      },
    });
    return updatedUser;
  }
}
