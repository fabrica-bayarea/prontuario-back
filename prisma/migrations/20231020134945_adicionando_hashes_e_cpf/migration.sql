/*
  Warnings:

  - Added the required column `cpf` to the `Beneficiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Beneficiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Beneficiario" ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "hash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "hash" TEXT NOT NULL;
