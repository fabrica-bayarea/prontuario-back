/*
  Warnings:

  - You are about to drop the column `data` on the `Atendimento` table. All the data in the column will be lost.
  - You are about to drop the column `programaId` on the `Atendimento` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Atendimento` table. All the data in the column will be lost.
  - You are about to drop the column `turno` on the `Curso` table. All the data in the column will be lost.
  - You are about to alter the column `nome` on the `Curso` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `coordenador` on the `Curso` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to drop the column `horario` on the `Programa` table. All the data in the column will be lost.
  - You are about to drop the column `inicio` on the `Programa` table. All the data in the column will be lost.
  - You are about to drop the column `publicoAlvo` on the `Programa` table. All the data in the column will be lost.
  - You are about to drop the column `termino` on the `Programa` table. All the data in the column will be lost.
  - You are about to alter the column `nome` on the `Programa` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `descricao` on the `Programa` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `nome` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(360)`.
  - You are about to alter the column `telefone` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(14)`.
  - You are about to alter the column `cep` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(9)`.
  - You are about to alter the column `cidade` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `endereco` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `sobrenome` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `cpf` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(14)`.
  - You are about to drop the `_CursoToPrograma` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `periodoAtendimentoId` to the `Atendimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vagaId` to the `Atendimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campus` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publico_alvo` to the `Programa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genero` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nascimento` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Made the column `telefone` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AGENDADO', 'REALIZADO', 'CANCELADO', 'NAOCOMPARECEU');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO');

-- CreateEnum
CREATE TYPE "Parentesco" AS ENUM ('PAI', 'MAE', 'IRMAO', 'IRMA', 'FILHO', 'FILHA', 'OUTRO');

-- AlterEnum
ALTER TYPE "TipoUsuario" ADD VALUE 'COLABORADOR';

-- DropForeignKey
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_programaId_fkey";

-- DropForeignKey
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "_CursoToPrograma" DROP CONSTRAINT "_CursoToPrograma_A_fkey";

-- DropForeignKey
ALTER TABLE "_CursoToPrograma" DROP CONSTRAINT "_CursoToPrograma_B_fkey";

-- DropIndex
DROP INDEX "Usuario_telefone_key";

-- AlterTable
ALTER TABLE "Atendimento" DROP COLUMN "data",
DROP COLUMN "programaId",
DROP COLUMN "usuarioId",
ADD COLUMN     "observacao" VARCHAR(800),
ADD COLUMN     "periodoAtendimentoId" INTEGER NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'AGENDADO',
ADD COLUMN     "vagaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "turno",
ADD COLUMN     "campus" VARCHAR(150) NOT NULL,
ADD COLUMN     "descricao" VARCHAR(500) NOT NULL,
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "coordenador" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "Programa" DROP COLUMN "horario",
DROP COLUMN "inicio",
DROP COLUMN "publicoAlvo",
DROP COLUMN "termino",
ADD COLUMN     "publico_alvo" VARCHAR(100) NOT NULL,
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "descricao" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "genero" "Genero" NOT NULL,
ADD COLUMN     "matricula" VARCHAR(15),
ADD COLUMN     "nascimento" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(360),
ALTER COLUMN "telefone" SET NOT NULL,
ALTER COLUMN "telefone" SET DATA TYPE CHAR(14),
ALTER COLUMN "cep" SET DATA TYPE CHAR(9),
ALTER COLUMN "cidade" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "endereco" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "sobrenome" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "cpf" SET DATA TYPE CHAR(14);

-- DropTable
DROP TABLE "_CursoToPrograma";

-- DropEnum
DROP TYPE "Turnos";

-- CreateTable
CREATE TABLE "Periodo_Atendimento" (
    "id" SERIAL NOT NULL,
    "programaId" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3) NOT NULL,
    "horario_inicio" CHAR(5) NOT NULL,
    "horario_fim" CHAR(5) NOT NULL,
    "dias_da_semana" INTEGER NOT NULL,

    CONSTRAINT "Periodo_Atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaga" (
    "id" SERIAL NOT NULL,
    "colaboradorId" INTEGER NOT NULL,
    "periodoAtendimentoId" INTEGER NOT NULL,
    "data_hora_inicio" TIMESTAMP(3) NOT NULL,
    "data_hora_fim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependente" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "sobrenome" VARCHAR(200) NOT NULL,
    "cpf" CHAR(14) NOT NULL,
    "nascimento" TIMESTAMP(3) NOT NULL,
    "genero" "Genero" NOT NULL,
    "parentesco" "Parentesco" NOT NULL,
    "necessidade_especial" VARCHAR(500),
    "email" VARCHAR(360) NOT NULL,
    "telefone" CHAR(14) NOT NULL,

    CONSTRAINT "Dependente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UsuarioCurso" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CursoPrograma" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UsuarioPrograma" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Dependente_cpf_key" ON "Dependente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Dependente_email_key" ON "Dependente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UsuarioCurso_AB_unique" ON "_UsuarioCurso"("A", "B");

-- CreateIndex
CREATE INDEX "_UsuarioCurso_B_index" ON "_UsuarioCurso"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CursoPrograma_AB_unique" ON "_CursoPrograma"("A", "B");

-- CreateIndex
CREATE INDEX "_CursoPrograma_B_index" ON "_CursoPrograma"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UsuarioPrograma_AB_unique" ON "_UsuarioPrograma"("A", "B");

-- CreateIndex
CREATE INDEX "_UsuarioPrograma_B_index" ON "_UsuarioPrograma"("B");

-- AddForeignKey
ALTER TABLE "Periodo_Atendimento" ADD CONSTRAINT "Periodo_Atendimento_programaId_fkey" FOREIGN KEY ("programaId") REFERENCES "Programa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_periodoAtendimentoId_fkey" FOREIGN KEY ("periodoAtendimentoId") REFERENCES "Periodo_Atendimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_periodoAtendimentoId_fkey" FOREIGN KEY ("periodoAtendimentoId") REFERENCES "Periodo_Atendimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependente" ADD CONSTRAINT "Dependente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioCurso" ADD CONSTRAINT "_UsuarioCurso_A_fkey" FOREIGN KEY ("A") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioCurso" ADD CONSTRAINT "_UsuarioCurso_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoPrograma" ADD CONSTRAINT "_CursoPrograma_A_fkey" FOREIGN KEY ("A") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoPrograma" ADD CONSTRAINT "_CursoPrograma_B_fkey" FOREIGN KEY ("B") REFERENCES "Programa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioPrograma" ADD CONSTRAINT "_UsuarioPrograma_A_fkey" FOREIGN KEY ("A") REFERENCES "Programa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioPrograma" ADD CONSTRAINT "_UsuarioPrograma_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
