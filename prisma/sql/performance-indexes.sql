-- ============================================
-- Performance Indexes Optimization
-- ============================================
-- Run this migration to add composite indexes
-- for common query patterns
-- ============================================

-- ============================================
-- CUSTOMERS
-- ============================================

-- Search by name/phone (already indexed via @unique on phone)
CREATE INDEX IF NOT EXISTS "idx_customer_name_trgm" 
ON "Customer" USING gin (name gin_trgm_ops);

-- Filter customers with debt
CREATE INDEX IF NOT EXISTS "idx_customer_debt" 
ON "Customer" ("debtAmount") 
WHERE "debtAmount" > 0;

-- Customer group + active filter
CREATE INDEX IF NOT EXISTS "idx_customer_group_active" 
ON "Customer" ("customerGroupId", "isActive");

-- ============================================
-- PRODUCT INVENTORY
-- ============================================

-- Most common query: inventory by branch
CREATE INDEX IF NOT EXISTS "idx_product_inventory_branch_onhand" 
ON "product_inventory" ("branchId", "onHand");

-- Low stock alert query
CREATE INDEX IF NOT EXISTS "idx_product_inventory_low_stock" 
ON "product_inventory" ("onHand") 
WHERE "onHand" <= 10;

-- ============================================
-- STOCK HISTORY
-- ============================================

-- Filter by product + date range
CREATE INDEX IF NOT EXISTS "idx_stock_history_product_date" 
ON "StockHistory" ("productSystemId", "createdAt" DESC);

-- Filter by branch + type
CREATE INDEX IF NOT EXISTS "idx_stock_history_branch_type" 
ON "StockHistory" ("branchSystemId", "type");

-- ============================================
-- RECEIPTS (Cash book)
-- ============================================

-- Cash book query: branch + date range
CREATE INDEX IF NOT EXISTS "idx_receipt_branch_date" 
ON "Receipt" ("branchSystemId", "receiptDate" DESC);

-- Filter by type (income/expense)
CREATE INDEX IF NOT EXISTS "idx_receipt_type_date" 
ON "Receipt" ("type", "receiptDate" DESC);

-- ============================================
-- EMPLOYEES
-- ============================================

-- Filter by branch + active
CREATE INDEX IF NOT EXISTS "idx_employee_branch_active" 
ON "Employee" ("branchSystemId", "isActive");

-- Search by name
CREATE INDEX IF NOT EXISTS "idx_employee_name_trgm" 
ON "Employee" USING gin ("fullName" gin_trgm_ops);

-- ============================================
-- AUDIT LOGS
-- ============================================

-- Filter by entity + date
CREATE INDEX IF NOT EXISTS "idx_audit_log_entity_date" 
ON "AuditLog" ("entityType", "entityId", "createdAt" DESC);

-- Filter by user
CREATE INDEX IF NOT EXISTS "idx_audit_log_user_date" 
ON "AuditLog" ("userId", "createdAt" DESC);

-- ============================================
-- SETTINGS DATA
-- ============================================

-- Lookup by type (most common)
CREATE INDEX IF NOT EXISTS "idx_settings_type" 
ON "SettingsData" ("type");

-- ============================================
-- Enable pg_trgm extension for fuzzy search
-- ============================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- ANALYZE tables to update statistics
-- ============================================
ANALYZE "Customer";
ANALYZE "Product";
ANALYZE "product_inventory";
ANALYZE "Order";
ANALYZE "Receipt";
ANALYZE "Employee";
ANALYZE "StockHistory";
