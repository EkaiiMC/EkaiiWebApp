/*
  Warnings:

  - Added the required column `rank` to the `GalleryItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GalleryItem" ADD COLUMN     "rank" INTEGER NOT NULL;
