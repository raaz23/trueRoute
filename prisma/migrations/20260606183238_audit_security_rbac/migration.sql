-- CreateTable
CREATE TABLE "AdminRegionAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SUB_ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminRegionAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AdminRegionAssignment_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BusinessReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "userId" TEXT,
    "authorName" TEXT,
    "nationality" TEXT,
    "overallRating" INTEGER NOT NULL,
    "serviceQuality" INTEGER,
    "fairPricing" INTEGER,
    "cleanliness" INTEGER,
    "safety" INTEGER,
    "authenticity" INTEGER,
    "staffBehavior" INTEGER,
    "text" TEXT,
    "photoUrlsJson" TEXT,
    "videoUrl" TEXT,
    "reviewFingerprint" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "businessReply" TEXT,
    "repliedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BusinessReview_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BusinessReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_BusinessReview" ("approved", "authenticity", "authorName", "businessId", "businessReply", "cleanliness", "createdAt", "fairPricing", "id", "nationality", "overallRating", "photoUrlsJson", "repliedAt", "safety", "serviceQuality", "staffBehavior", "text", "userId", "videoUrl") SELECT "approved", "authenticity", "authorName", "businessId", "businessReply", "cleanliness", "createdAt", "fairPricing", "id", "nationality", "overallRating", "photoUrlsJson", "repliedAt", "safety", "serviceQuality", "staffBehavior", "text", "userId", "videoUrl" FROM "BusinessReview";
DROP TABLE "BusinessReview";
ALTER TABLE "new_BusinessReview" RENAME TO "BusinessReview";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "AdminRegionAssignment_userId_cityId_key" ON "AdminRegionAssignment"("userId", "cityId");
