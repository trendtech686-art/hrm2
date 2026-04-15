-- Normalize entityType casing to lowercase across all tables
-- 
-- Background: Code was writing PascalCase ('Payment', 'Payroll', 'Order', etc.)
-- but now standardized to lowercase ('payment', 'payroll', 'order', etc.)
-- This migration updates existing DB records to match.
--
-- Run with: psql -d <database> -f normalize-entity-type-casing.sql
-- Or via Prisma: npx prisma db execute --file prisma/sql/normalize-entity-type-casing.sql

BEGIN;

-- 1. AuditLog table
UPDATE "AuditLog" 
SET "entityType" = LOWER("entityType") 
WHERE "entityType" != LOWER("entityType");

-- 2. File table
UPDATE "File" 
SET "entityType" = LOWER("entityType") 
WHERE "entityType" != LOWER("entityType");

COMMIT;
