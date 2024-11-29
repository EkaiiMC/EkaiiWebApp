/*
  Warnings:

  - The `coords` column on the `GalleryItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GalleryItem" DROP COLUMN "coords",
ADD COLUMN     "coords" JSONB NOT NULL DEFAULT '{}';
