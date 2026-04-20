-- AlterTable: Add missing price columns and fields to pkgx_products
ALTER TABLE "pkgx_products" ADD COLUMN IF NOT EXISTS "goodsSn" TEXT;
ALTER TABLE "pkgx_products" ADD COLUMN IF NOT EXISTS "addTime" INTEGER;
ALTER TABLE "pkgx_products" ADD COLUMN IF NOT EXISTS "price5Vat" DECIMAL(15,2);
ALTER TABLE "pkgx_products" ADD COLUMN IF NOT EXISTS "price12Novat" DECIMAL(15,2);
ALTER TABLE "pkgx_products" ADD COLUMN IF NOT EXISTS "price5Novat" DECIMAL(15,2);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "pkgx_products_goodsSn_idx" ON "pkgx_products"("goodsSn");
