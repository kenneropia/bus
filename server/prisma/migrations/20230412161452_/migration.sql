-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Journey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "destination" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Journey_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Journey" ("createdAt", "date", "destination", "driverId", "finished", "id", "section", "updatedAt") SELECT "createdAt", "date", "destination", "driverId", "finished", "id", "section", "updatedAt" FROM "Journey";
DROP TABLE "Journey";
ALTER TABLE "new_Journey" RENAME TO "Journey";
CREATE UNIQUE INDEX "Journey_driverId_destination_date_key" ON "Journey"("driverId", "destination", "date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
