import { Injectable } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async getUserProfile(id: number): Promise<Usuario> {
        const userProfile = await this.prisma.usuario.findUnique({
            where: { id: id }
        });
        console.log(userProfile)
        if (!userProfile) {
            throw new Error(`Usuário com ID ${id} não encontrado.`);
        }
        return userProfile;
    }
}