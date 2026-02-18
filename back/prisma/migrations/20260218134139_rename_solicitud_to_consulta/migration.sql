/*
  Warnings:

  - You are about to drop the `solicitudes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "solicitudes";

-- CreateTable
CREATE TABLE "consultas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "mensaje" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);
