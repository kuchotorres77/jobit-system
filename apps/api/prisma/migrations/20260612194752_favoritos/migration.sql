-- CreateTable
CREATE TABLE "favoritos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prestadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favoritos_userId_prestadorId_key" ON "favoritos"("userId", "prestadorId");

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "prestadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
