/**
 * Migration: Cashbook unaccent extension + search optimization
 *
 * Mục đích:
 * 1. Tạo unaccent extension để search không phân biệt dấu tiếng Việt.
 *    Dùng trong WHERE: WHERE unaccent(description) ILIKE unaccent('%từ khóa%')
 * 2. Thêm GIN trgm indexes (pg_trgm đã được tạo ở migration trước).
 *
 * Lưu ý: ILIKE với unaccent không dùng index trực tiếp.
 * Nếu cần index, tạo functional index:
 *   CREATE INDEX ON receipts (unaccent(description) gin_trgm_ops);
 *   CREATE INDEX ON cash_transactions (unaccent(description) gin_trgm_ops);
 */

-- ============================================================
-- 1. unaccent extension cho search không dấu tiếng Việt
-- ============================================================
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ============================================================
-- 2. Functional trigram indexes cho unaccent + ILIKE search
--    Kết hợp unaccent + trgm: vừa không dấu vừa nhanh
-- ============================================================
CREATE INDEX CONCURRENTLY IF NOT EXISTS "receipts_description_unaccent_trgm_idx"
  ON "hrm"."receipts"
  USING gin (unaccent("description") gin_trgm_ops)
  WHERE "description" IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "receipts_payer_name_unaccent_trgm_idx"
  ON "hrm"."receipts"
  USING gin (unaccent("payerName") gin_trgm_ops)
  WHERE "payerName" IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "receipts_customer_name_unaccent_trgm_idx"
  ON "hrm"."receipts"
  USING gin (unaccent("customerName") gin_trgm_ops)
  WHERE "customerName" IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "cash_transactions_description_unaccent_trgm_idx"
  ON "hrm"."cash_transactions"
  USING gin (unaccent("description") gin_trgm_ops)
  WHERE "description" IS NOT NULL;
