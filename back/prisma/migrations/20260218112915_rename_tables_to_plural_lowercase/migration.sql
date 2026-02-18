/*
  Warnings:

  - You are about to drop the `Curso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DictadoCurso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inscripcion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DictadoCurso" DROP CONSTRAINT "DictadoCurso_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "Inscripcion" DROP CONSTRAINT "Inscripcion_dictadoCursoId_fkey";

-- DropTable
DROP TABLE "Curso";

-- DropTable
DROP TABLE "DictadoCurso";

-- DropTable
DROP TABLE "Inscripcion";

-- CreateTable
CREATE TABLE "cursos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "items" TEXT[],
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dictados_curso" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "horarioInicio" TEXT NOT NULL,
    "horarioFin" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "duracionEstimada" INTEGER NOT NULL,
    "diasSemana" TEXT[],
    "cupos" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dictados_curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "telefono" TEXT,
    "dictadoCursoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dictados_curso" ADD CONSTRAINT "dictados_curso_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_dictadoCursoId_fkey" FOREIGN KEY ("dictadoCursoId") REFERENCES "dictados_curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
