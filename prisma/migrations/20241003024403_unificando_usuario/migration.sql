/*
  Warnings:

  - You are about to drop the `Beneficiario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TipoUsuario" ADD VALUE 'BENEFICIARIO';

-- DropForeignKey
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_beneficiarioId_fkey";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "cpf" TEXT NOT NULL;

-- DropTable
DROP TABLE "Beneficiario";

-- DropEnum
DROP TYPE "TipoBeneficiario";

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_beneficiarioId_fkey" FOREIGN KEY ("beneficiarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
