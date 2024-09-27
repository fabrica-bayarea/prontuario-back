/*
  Warnings:

  - Added the required column `coordenador` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turno` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Programa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horario` to the `Programa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inicio` to the `Programa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicoAlvo` to the `Programa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termino` to the `Programa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sobrenome` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Turnos" AS ENUM ('Matutino', 'Vespertino', 'Noturno', 'Integral');

-- AlterTable
ALTER TABLE "Curso" ADD COLUMN     "coordenador" TEXT NOT NULL,
ADD COLUMN     "turno" "Turnos" NOT NULL;

-- AlterTable
ALTER TABLE "Programa" ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "horario" TEXT NOT NULL,
ADD COLUMN     "inicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "publicoAlvo" TEXT NOT NULL,
ADD COLUMN     "termino" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "sobrenome" TEXT NOT NULL;
