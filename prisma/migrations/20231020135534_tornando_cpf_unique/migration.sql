/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Beneficiario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Beneficiario_cpf_key" ON "Beneficiario"("cpf");
