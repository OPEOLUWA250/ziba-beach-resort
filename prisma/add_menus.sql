-- Add Menu Category table
CREATE TABLE "MenuCategory" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  timing TEXT,
  note TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add MenuItem table
CREATE TABLE "MenuItem" (
  id TEXT PRIMARY KEY,
  "categoryId" TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  "priceNGN" DOUBLE PRECISION NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MenuCategory"(id) ON DELETE CASCADE,
  UNIQUE("categoryId", name)
);

-- Create indexes for menu queries
CREATE INDEX "MenuItem_categoryId_idx" ON "MenuItem"("categoryId");
CREATE INDEX "MenuItem_isActive_idx" ON "MenuItem"("isActive");
CREATE INDEX "MenuCategory_isActive_idx" ON "MenuCategory"("isActive");
