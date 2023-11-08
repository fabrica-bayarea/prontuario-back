/*
  Warnings:

  - You are about to drop the column `cursoId` on the `Programa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome]` on the table `Curso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Programa` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Programa" DROP CONSTRAINT "Programa_cursoId_fkey";

-- AlterTable
ALTER TABLE "Programa" DROP COLUMN "cursoId";

-- CreateTable
CREATE TABLE "_CursoToPrograma" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CursoToPrograma_AB_unique" ON "_CursoToPrograma"("A", "B");

-- CreateIndex
CREATE INDEX "_CursoToPrograma_B_index" ON "_CursoToPrograma"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_nome_key" ON "Curso"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Programa_nome_key" ON "Programa"("nome");

-- AddForeignKey
ALTER TABLE "_CursoToPrograma" ADD CONSTRAINT "_CursoToPrograma_A_fkey" FOREIGN KEY ("A") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToPrograma" ADD CONSTRAINT "_CursoToPrograma_B_fkey" FOREIGN KEY ("B") REFERENCES "Programa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
