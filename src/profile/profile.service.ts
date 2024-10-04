import { Injectable } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { UpdateCursoDto } from 'src/curso/curso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './profile.dto';

@Injectable()
export class ProfileService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async getUserProfile(id: number): Promise<Usuario> {
        const userProfile = await this.prisma.usuario.findUnique({
            where: { id: id }
        });

        if (!userProfile) {
            throw new Error(`Usuário com ID ${id} não encontrado.`);
        }
        return userProfile;
    }

    async updateUserProfile(
        id: number,
        updateProfileDto: UpdateProfileDto,
        ): Promise<Usuario> {
        const userProfile = await this.prisma.usuario.findUnique({
            where: { id: id }
        });
        if (!userProfile) {
            throw new Error(`Usuário com ID ${id} não encontrado.`);
        }
        return this.prisma.usuario.update({
            where: { id },
            data: {
                nome: updateProfileDto.nome,
                sobrenome: updateProfileDto.sobrenome,
                email: updateProfileDto.email,
                telefone: updateProfileDto.telefone,
                cidade: updateProfileDto.cidade,
                endereco: updateProfileDto.endereco,
                cep: updateProfileDto.cep,
                tipo: updateProfileDto.tipo,                
            }
        });
    }
}