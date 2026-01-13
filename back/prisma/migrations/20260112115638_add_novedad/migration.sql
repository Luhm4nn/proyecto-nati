-- CreateTable
CREATE TABLE "novedades" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagenUrl" TEXT NOT NULL,
    "imagenPublicId" TEXT,

    CONSTRAINT "novedades_pkey" PRIMARY KEY ("id")
);
