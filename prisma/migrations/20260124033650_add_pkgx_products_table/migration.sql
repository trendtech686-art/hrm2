-- AlterTable
ALTER TABLE "pkgx_sync_logs" ADD COLUMN     "syncedByName" TEXT;

-- CreateTable
CREATE TABLE "pkgx_products" (
    "id" INTEGER NOT NULL,
    "goodsNumber" TEXT,
    "name" TEXT NOT NULL,
    "catId" INTEGER,
    "catName" TEXT,
    "brandId" INTEGER,
    "brandName" TEXT,
    "shopPrice" DECIMAL(15,2),
    "marketPrice" DECIMAL(15,2),
    "partnerPrice" DECIMAL(15,2),
    "acePrice" DECIMAL(15,2),
    "dealPrice" DECIMAL(15,2),
    "goodsNumber2" TEXT,
    "goodsWeight" DECIMAL(10,2),
    "goodsQuantity" INTEGER DEFAULT 0,
    "warnNumber" INTEGER DEFAULT 0,
    "goodsThumb" TEXT,
    "originalImg" TEXT,
    "goodsBrief" TEXT,
    "goodsDesc" TEXT,
    "isBest" INTEGER DEFAULT 0,
    "isNew" INTEGER DEFAULT 0,
    "isHot" INTEGER DEFAULT 0,
    "isHome" INTEGER DEFAULT 0,
    "isOnsale" INTEGER DEFAULT 0,
    "isReal" INTEGER DEFAULT 1,
    "keywords" TEXT,
    "ktitle" TEXT,
    "goodsAlias" TEXT,
    "lastUpdate" INTEGER,
    "hrmProductId" TEXT,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pkgx_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pkgx_products_goodsNumber_idx" ON "pkgx_products"("goodsNumber");

-- CreateIndex
CREATE INDEX "pkgx_products_catId_idx" ON "pkgx_products"("catId");

-- CreateIndex
CREATE INDEX "pkgx_products_brandId_idx" ON "pkgx_products"("brandId");

-- CreateIndex
CREATE INDEX "pkgx_products_hrmProductId_idx" ON "pkgx_products"("hrmProductId");
