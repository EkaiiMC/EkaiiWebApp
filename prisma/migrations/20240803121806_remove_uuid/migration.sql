/*
  Warnings:

  - You are about to drop the column `uuid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `VoteSite` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `VoteSite` table. All the data in the column will be lost.
  - Added the required column `verificationFunction` to the `VoteSite` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_uuid_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "uuid";

-- AlterTable
ALTER TABLE "VoteSite" DROP COLUMN "description",
DROP COLUMN "image",
ADD COLUMN     "verificationFunction" TEXT NOT NULL;
