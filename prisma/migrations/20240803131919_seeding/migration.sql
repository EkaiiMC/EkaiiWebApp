/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `VoteSite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `VoteSite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VoteSite_title_key" ON "VoteSite"("title");

-- CreateIndex
CREATE UNIQUE INDEX "VoteSite_url_key" ON "VoteSite"("url");
