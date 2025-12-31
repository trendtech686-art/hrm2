-- Administrative Units Tables
-- Provinces, Districts, Wards for Vietnam address system

-- Create provinces table (34 provinces)
CREATE TABLE IF NOT EXISTS "provinces" (
    "system_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("system_id")
);

-- Create districts table (~624 districts)
CREATE TABLE IF NOT EXISTS "districts" (
    "system_id" TEXT NOT NULL,
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("system_id")
);

-- Create wards table (~10,000+ wards)
CREATE TABLE IF NOT EXISTS "wards" (
    "system_id" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,
    "province_name" TEXT,
    "district_id" INTEGER,
    "district_name" TEXT,
    "level" TEXT NOT NULL DEFAULT '3-level',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "wards_pkey" PRIMARY KEY ("system_id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "provinces_business_id_key" ON "provinces"("business_id");
CREATE UNIQUE INDEX IF NOT EXISTS "districts_id_key" ON "districts"("id");
CREATE UNIQUE INDEX IF NOT EXISTS "wards_id_province_id_key" ON "wards"("id", "province_id");

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS "districts_province_id_idx" ON "districts"("province_id");
CREATE INDEX IF NOT EXISTS "wards_province_id_idx" ON "wards"("province_id");
CREATE INDEX IF NOT EXISTS "wards_district_id_idx" ON "wards"("district_id");
CREATE INDEX IF NOT EXISTS "wards_level_idx" ON "wards"("level");

-- Add foreign keys
ALTER TABLE "districts" 
    ADD CONSTRAINT "districts_province_id_fkey" 
    FOREIGN KEY ("province_id") REFERENCES "provinces"("business_id") 
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "wards" 
    ADD CONSTRAINT "wards_province_id_fkey" 
    FOREIGN KEY ("province_id") REFERENCES "provinces"("business_id") 
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "wards" 
    ADD CONSTRAINT "wards_district_id_fkey" 
    FOREIGN KEY ("district_id") REFERENCES "districts"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;
