-- CreateTable
CREATE TABLE "AltAccount" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "belongsTo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AltAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AltAccount_username_key" ON "AltAccount"("username");
