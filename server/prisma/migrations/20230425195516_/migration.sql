/*
  Warnings:

  - A unique constraint covering the columns `[destination,date,section]` on the table `Journey` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Journey_driverId_destination_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "Journey_destination_date_section_key" ON "Journey"("destination", "date", "section");
