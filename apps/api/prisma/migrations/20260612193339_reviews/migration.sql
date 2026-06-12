-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "prestadorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_prestadorId_idx" ON "reviews"("prestadorId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_prestadorId_userId_key" ON "reviews"("prestadorId", "userId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "prestadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
