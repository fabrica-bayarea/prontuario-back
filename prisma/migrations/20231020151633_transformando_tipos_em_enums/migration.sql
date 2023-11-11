/*
  Warnings:

  - Changed the type of `tipo` on the `Beneficiario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tipo` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ADMINISTRADOR', 'CADASTRADOR');

-- CreateEnum
CREATE TYPE "TipoBeneficiario" AS ENUM ('BENEFICIARIO');

-- AlterTable
ALTER TABLE "Beneficiario" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoBeneficiario" NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoUsuario" NOT NULL;
