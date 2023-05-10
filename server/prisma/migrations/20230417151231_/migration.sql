/*
  Warnings:

  - You are about to drop the column `profilePic` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Seat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "journeyId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    CONSTRAINT "Seat_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Seat_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Seat" ("createdAt", "id", "journeyId", "seatNumber", "studentId", "updatedAt") SELECT "createdAt", "id", "journeyId", "seatNumber", "studentId", "updatedAt" FROM "Seat";
DROP TABLE "Seat";
ALTER TABLE "new_Seat" RENAME TO "Seat";
CREATE UNIQUE INDEX "Seat_studentId_journeyId_key" ON "Seat"("studentId", "journeyId");
CREATE TABLE "new_Journey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "destination" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Journey_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Journey" ("createdAt", "date", "destination", "driverId", "finished", "id", "section", "updatedAt") SELECT "createdAt", "date", "destination", "driverId", "finished", "id", "section", "updatedAt" FROM "Journey";
DROP TABLE "Journey";
ALTER TABLE "new_Journey" RENAME TO "Journey";
CREATE UNIQUE INDEX "Journey_driverId_destination_date_key" ON "Journey"("driverId", "destination", "date");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'student',
    "driverLicense" TEXT,
    "destination" TEXT
);
INSERT INTO "new_User" ("createdAt", "destination", "driverLicense", "email", "id", "name", "password", "role", "updatedAt") SELECT "createdAt", "destination", "driverLicense", "email", "id", "name", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
