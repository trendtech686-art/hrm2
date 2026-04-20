-- AlterTable: Add VAT name column to pkgx_products
ALTER TABLE "pkgx_products" ADD COLUMN IF NOT EXISTS "vat" TEXT;
