-- CreateTable
CREATE TABLE "votos_reviews" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votos_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "votos_reviews_reviewId_idx" ON "votos_reviews"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "votos_reviews_reviewId_userId_key" ON "votos_reviews"("reviewId", "userId");

-- AddForeignKey
ALTER TABLE "votos_reviews" ADD CONSTRAINT "votos_reviews_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votos_reviews" ADD CONSTRAINT "votos_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
