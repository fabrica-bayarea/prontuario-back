/*
  Warnings:

  - You are about to drop the `Beneficiario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Made the column `telefone` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "TipoUsuario" ADD VALUE 'BENEFICIARIO';

-- DropForeignKey
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_beneficiarioId_fkey";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "cpf" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "telefone" SET NOT NULL;

-- DropTable
DROP TABLE "Beneficiario";

-- DropEnum
DROP TYPE "TipoBeneficiario";

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_beneficiarioId_fkey" FOREIGN KEY ("beneficiarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
