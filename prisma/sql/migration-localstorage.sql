-- Migration: Add tables for localStorage replacement
-- Date: 2025-01-XX

-- 1. Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    "systemId" VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    "userId" VARCHAR(255) NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" JSONB NOT NULL DEFAULT '{}',
    "category" VARCHAR(100),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("userId", "key")
);

-- 2. Create active_timers table
CREATE TABLE IF NOT EXISTS active_timers (
    "systemId" VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    "userId" VARCHAR(255) NOT NULL UNIQUE,
    "taskId" VARCHAR(255) NOT NULL,
    "startTime" TIMESTAMP NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 3. Create generic comments table
CREATE TABLE IF NOT EXISTS comments (
    "systemId" VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    "entityType" VARCHAR(100) NOT NULL,
    "entityId" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    "createdBy" VARCHAR(255),
    "createdByName" VARCHAR(255),
    "updatedBy" VARCHAR(255)
);

-- Create index for comments lookup
CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments ("entityType", "entityId");

-- Create index for user_preferences lookup
CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences ("userId");

-- Add default values to problematic columns
ALTER TABLE cash_accounts 
ADD COLUMN IF NOT EXISTS "accountType" VARCHAR(50) DEFAULT 'cash';

UPDATE cash_accounts SET "accountType" = 'cash' WHERE "accountType" IS NULL;

ALTER TABLE id_counters 
ADD COLUMN IF NOT EXISTS "businessPrefix" VARCHAR(50) DEFAULT '',
ADD COLUMN IF NOT EXISTS "systemPrefix" VARCHAR(50) DEFAULT '';

UPDATE id_counters SET "businessPrefix" = '' WHERE "businessPrefix" IS NULL;
UPDATE id_counters SET "systemPrefix" = '' WHERE "systemPrefix" IS NULL;

ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS "code" VARCHAR(50) DEFAULT 'UNKNOWN',
ADD COLUMN IF NOT EXISTS "type" VARCHAR(50) DEFAULT 'other';

UPDATE payment_methods SET "code" = 'UNKNOWN' WHERE "code" IS NULL;
UPDATE payment_methods SET "type" = 'other' WHERE "type" IS NULL;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS "sku" VARCHAR(100) DEFAULT '';

UPDATE products SET "sku" = '' WHERE "sku" IS NULL;
UPDATE products SET "minPrice" = 0 WHERE "minPrice" IS NULL;
UPDATE products SET "taxRate" = 0 WHERE "taxRate" IS NULL;

ALTER TABLE stock_locations 
ADD COLUMN IF NOT EXISTS "code" VARCHAR(50) DEFAULT 'DEFAULT';

UPDATE stock_locations SET "code" = 'DEFAULT' WHERE "code" IS NULL;

-- Verify tables created
SELECT 'user_preferences' as table_name, count(*) as count FROM user_preferences
UNION ALL
SELECT 'active_timers' as table_name, count(*) as count FROM active_timers
UNION ALL
SELECT 'comments' as table_name, count(*) as count FROM comments;
