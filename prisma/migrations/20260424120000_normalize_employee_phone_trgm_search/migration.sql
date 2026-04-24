/**
 * Migration: Chuẩn hoá Employee.phone + thêm index unique + pg_trgm
 *
 * 1. Trim/whitespace: loại bỏ khoảng trắng thừa đầu/cuối.
 * 2. Loại ký tự lạ (chỉ giữ digits + leading +84):
 *    - Strip mọi ký tự không phải digit.
 *    - Nếu sau strip là 09xxxxxx (10 chữ số) → giữ nguyên.
 *    - Nếu là +84xxxxxxxxx (11 chữ số bắt đầu 84) → chuẩn hoá về 0xxxxxxxxx.
 * 3. Ghi đè phone bằng giá trị chuẩn hoá cho mọi bản ghi.
 * 4. Thêm index unique trên employees(phone) WHERE phone IS NOT NULL.
 * 5. Bật pg_trgm extension + GIN index trên các cột text lớn
 *    (dùng cho multi-token AND + ILIKE %x% queries).
 */

-- ============================================================
-- 1. pg_trgm extension (dùng cho search fallback)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- 2. Chuẩn hoá phone: strip whitespace + keep only digits
-- ============================================================
UPDATE "hrm"."employees"
SET "phone" = NULLIF(TRIM("phone"), '')
WHERE
  -- trim whitespace
  "phone" IS NOT NULL
  AND TRIM("phone") = '';

-- Normalize: keep only digits, then convert 84-prefix to 0
UPDATE "hrm"."employees"
SET "phone" =
  CASE
    WHEN regexp_replace(TRIM("phone"), '\D', '', 'g') SIMILAR TO '84\d{9,10}'
      THEN '0' || SUBSTRING(regexp_replace(TRIM("phone"), '\D', '', 'g') FROM 3)
    WHEN regexp_replace(TRIM("phone"), '\D', '', 'g') SIMILAR TO '0\d{9,10}'
      THEN SUBSTRING(regexp_replace(TRIM("phone"), '\D', '', 'g') FROM 1 FOR 10)
    ELSE NULL
  END
WHERE
  "phone" IS NOT NULL
  AND TRIM("phone") != ''
  AND "phone" != regexp_replace(TRIM("phone"), '\D', '', 'g');

-- ============================================================
-- 3. Chuyển empty string → NULL để unique constraint hoạt động
-- ============================================================
UPDATE "hrm"."employees"
SET "phone" = NULL
WHERE "phone" = '';

-- ============================================================
-- 4. Drop existing non-unique index (if any) + add unique index
-- ============================================================
-- Chỉ giữ unique index trên phone, NULL không bị ràng buộc
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS "employees_phone_unique_idx"
  ON "hrm"."employees" ("phone")
  WHERE "phone" IS NOT NULL;

-- ============================================================
-- 5. pg_trgm GIN indexes cho search (multi-token AND + ILIKE %x%)
-- ============================================================
CREATE INDEX CONCURRENTLY IF NOT EXISTS "orders_customer_name_trgm_idx"
  ON "hrm"."orders" USING gin ("customerName" gin_trgm_ops)
  WHERE "customerName" IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_name_trgm_idx"
  ON "hrm"."products" USING gin ("name" gin_trgm_ops)
  WHERE "name" IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_barcode_trgm_idx"
  ON "hrm"."products" USING gin ("barcode" gin_trgm_ops)
  WHERE "barcode" IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "warranties_tracking_code_trgm_idx"
  ON "hrm"."warranties" USING gin ("trackingCode" gin_trgm_ops)
  WHERE "trackingCode" IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "customers_name_trgm_idx"
  ON "hrm"."customers" USING gin ("name" gin_trgm_ops)
  WHERE "name" IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "customers_phone_trgm_idx"
  ON "hrm"."customers" USING gin ("phone" gin_trgm_ops)
  WHERE "phone" IS NOT NULL;
