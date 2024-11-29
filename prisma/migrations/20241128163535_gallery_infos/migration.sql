-- AlterTable
ALTER TABLE "GalleryItem" ADD COLUMN     "builder" TEXT NOT NULL DEFAULT 'Inconnu',
ADD COLUMN     "coords" TEXT NOT NULL DEFAULT 'Inconnu',
ALTER COLUMN "author" SET DEFAULT 'Inconnu';
