-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);
INSERT INTO "new_SiteSetting" ("id", "key", "value") SELECT "id", "key", "value" FROM "SiteSetting";
DROP TABLE "SiteSetting";
ALTER TABLE "new_SiteSetting" RENAME TO "SiteSetting";
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
