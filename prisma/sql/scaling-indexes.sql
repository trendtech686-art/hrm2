-- ============================================================
-- SCALING SQL: Indexes & Partitioning for Million-Scale Data
-- ============================================================
-- Target: 1M+ orders, 100K customers, 10K products
-- ============================================================

-- ========================
-- 1. ORDERS - Critical indexes for millions of records
-- ========================

-- Composite index for common queries (status + date range)
CREATE INDEX IF NOT EXISTS idx_orders_status_date 
ON orders (status, "orderDate" DESC);

-- Composite for customer history (paginated)
CREATE INDEX IF NOT EXISTS idx_orders_customer_date 
ON orders ("customerId", "orderDate" DESC);

-- Composite for branch reports
CREATE INDEX IF NOT EXISTS idx_orders_branch_date 
ON orders ("branchId", "orderDate" DESC);

-- Payment status tracking
CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
ON orders ("paymentStatus", "orderDate" DESC);

-- Delivery status tracking
CREATE INDEX IF NOT EXISTS idx_orders_delivery_status 
ON orders ("deliveryStatus", "orderDate" DESC);

-- For date range reports (monthly/yearly)
CREATE INDEX IF NOT EXISTS idx_orders_created_at 
ON orders ("createdAt" DESC);

-- Trigram for order ID search
CREATE INDEX IF NOT EXISTS idx_orders_id_trgm 
ON orders USING GIN (id gin_trgm_ops);

-- Customer name search
CREATE INDEX IF NOT EXISTS idx_orders_customer_name_trgm 
ON orders USING GIN ("customerName" gin_trgm_ops);

-- ========================
-- 2. ORDER LINE ITEMS - Heavy read table
-- ========================

CREATE INDEX IF NOT EXISTS idx_order_items_order 
ON order_line_items ("orderId");

CREATE INDEX IF NOT EXISTS idx_order_items_product 
ON order_line_items ("productId");

-- For product sales reports
CREATE INDEX IF NOT EXISTS idx_order_items_product_order 
ON order_line_items ("productId", "orderId");

-- ========================
-- 3. CUSTOMERS - 100K records
-- ========================

-- Composite for active customer list
CREATE INDEX IF NOT EXISTS idx_customers_deleted_created 
ON customers ("isDeleted", "createdAt" DESC);

-- Phone lookup (exact match - very common)
CREATE INDEX IF NOT EXISTS idx_customers_phone 
ON customers (phone);

-- Email lookup
CREATE INDEX IF NOT EXISTS idx_customers_email 
ON customers (email) WHERE email IS NOT NULL;

-- Trigram for fuzzy search
CREATE INDEX IF NOT EXISTS idx_customers_name_trgm 
ON customers USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_customers_phone_trgm 
ON customers USING GIN (phone gin_trgm_ops);

-- ========================
-- 4. PRODUCTS - 10K records (already optimized)
-- ========================

-- Ensure these exist
CREATE INDEX IF NOT EXISTS idx_products_deleted_status 
ON products ("isDeleted", status);

CREATE INDEX IF NOT EXISTS idx_products_brand 
ON products ("brandId") WHERE "brandId" IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_pkgx 
ON products ("pkgxId") WHERE "pkgxId" IS NOT NULL;

-- ========================
-- 5. STOCK HISTORY - Will grow with orders
-- ========================

CREATE INDEX IF NOT EXISTS idx_stock_history_product_date 
ON stock_history ("productId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_stock_history_branch_date 
ON stock_history ("branchId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_stock_history_action 
ON stock_history (action, "createdAt" DESC);

-- ========================
-- 6. PAYMENTS & RECEIPTS
-- ========================

CREATE INDEX IF NOT EXISTS idx_payments_date 
ON payments ("paymentDate" DESC);

CREATE INDEX IF NOT EXISTS idx_receipts_date 
ON receipts ("receiptDate" DESC);

CREATE INDEX IF NOT EXISTS idx_receipts_customer 
ON receipts ("customerId");

-- ========================
-- 7. TABLE PARTITIONING (Future - when > 1M orders)
-- ========================

-- Note: PostgreSQL table partitioning requires recreating tables
-- This is a migration script for when you need it

/*
-- Example: Partition orders by year-month
CREATE TABLE orders_partitioned (
  LIKE orders INCLUDING ALL
) PARTITION BY RANGE ("orderDate");

-- Create partitions
CREATE TABLE orders_2024_01 PARTITION OF orders_partitioned
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE orders_2024_02 PARTITION OF orders_partitioned
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- ... create more partitions

-- Then migrate data:
-- INSERT INTO orders_partitioned SELECT * FROM orders;
-- DROP TABLE orders;
-- ALTER TABLE orders_partitioned RENAME TO orders;
*/

-- ========================
-- 8. STATISTICS UPDATE
-- ========================

ANALYZE orders;
ANALYZE order_line_items;
ANALYZE customers;
ANALYZE products;
ANALYZE stock_history;
ANALYZE payments;
ANALYZE receipts;

-- ========================
-- 9. QUERY OPTIMIZATION SETTINGS (Run once)
-- ========================

-- These are PostgreSQL configuration hints
-- Actual values depend on your server RAM

/*
-- For 8GB RAM server:
ALTER SYSTEM SET shared_buffers = '2GB';
ALTER SYSTEM SET effective_cache_size = '6GB';
ALTER SYSTEM SET maintenance_work_mem = '512MB';
ALTER SYSTEM SET work_mem = '256MB';
ALTER SYSTEM SET random_page_cost = 1.1;  -- For SSD

-- Reload config:
SELECT pg_reload_conf();
*/
