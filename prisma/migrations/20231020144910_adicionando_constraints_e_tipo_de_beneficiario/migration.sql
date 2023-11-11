/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Beneficiario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telefone]` on the table `Beneficiario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telefone]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tipo` to the `Beneficiario` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Beneficiario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefone` on table `Beneficiario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Beneficiario" ADD COLUMN     "tipo" TEXT NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "telefone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiario_email_key" ON "Beneficiario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiario_telefone_key" ON "Beneficiario"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_telefone_key" ON "Usuario"("telefone");
