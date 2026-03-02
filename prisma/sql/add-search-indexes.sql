-- Migration: Add trigram indexes for fast text search
-- Run this after enabling pg_trgm extension

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- GIN index for product name (trigram - supports ILIKE '%text%')
CREATE INDEX IF NOT EXISTS idx_products_name_trgm 
ON products USING GIN (name gin_trgm_ops);

-- GIN index for product id/sku
CREATE INDEX IF NOT EXISTS idx_products_id_trgm 
ON products USING GIN (id gin_trgm_ops);

-- GIN index for barcode
CREATE INDEX IF NOT EXISTS idx_products_barcode_trgm 
ON products USING GIN (barcode gin_trgm_ops);

-- Composite index for common filters
CREATE INDEX IF NOT EXISTS idx_products_status_deleted_created 
ON products (status, "isDeleted", "createdAt" DESC);

-- For orders
CREATE INDEX IF NOT EXISTS idx_orders_id_trgm 
ON orders USING GIN (id gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_orders_customer_name_trgm 
ON orders USING GIN ("customerName" gin_trgm_ops);

-- For customers
CREATE INDEX IF NOT EXISTS idx_customers_name_trgm 
ON customers USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_customers_phone_trgm 
ON customers USING GIN (phone gin_trgm_ops);

-- For employees
CREATE INDEX IF NOT EXISTS idx_employees_name_trgm 
ON employees USING GIN ("fullName" gin_trgm_ops);

-- Analyze tables to update statistics
ANALYZE products;
ANALYZE orders;
ANALYZE customers;
ANALYZE employees;
