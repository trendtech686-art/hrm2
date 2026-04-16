-- CreateEnum
CREATE TYPE "SupplierWarrantyStatus" AS ENUM ('DRAFT', 'APPROVED', 'PACKED', 'EXPORTED', 'SENT', 'DELIVERED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PriceAdjustmentStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'DEPLETED', 'DISPOSED');

-- CreateEnum
CREATE TYPE "SerialStatus" AS ENUM ('IN_STOCK', 'SOLD', 'IN_WARRANTY', 'RETURNED', 'DAMAGED', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "ReconciliationSheetStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InventoryCheckStatus" ADD VALUE 'PENDING';
ALTER TYPE "InventoryCheckStatus" ADD VALUE 'BALANCED';

-- DropForeignKey
ALTER TABLE "attendance_records" DROP CONSTRAINT "attendance_records_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "leaves" DROP CONSTRAINT "leaves_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "order_line_items" DROP CONSTRAINT "order_line_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customerId_fkey";

-- DropForeignKey
ALTER TABLE "packagings" DROP CONSTRAINT "packagings_orderId_fkey";

-- DropForeignKey
ALTER TABLE "payroll_items" DROP CONSTRAINT "payroll_items_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_order_items" DROP CONSTRAINT "purchase_order_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_returns" DROP CONSTRAINT "purchase_returns_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_orderId_fkey";

-- DropIndex
DROP INDEX "customers_email_idx";

-- AlterTable
ALTER TABLE "ImportExportLog" ADD COLUMN     "branchId" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "currentChunk" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fileSize" INTEGER DEFAULT 0,
ADD COLUMN     "importData" TEXT,
ADD COLUMN     "importMode" TEXT,
ADD COLUMN     "insertedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "processedRecords" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skippedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "totalChunks" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "updatedCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "successCount" SET DEFAULT 0,
ALTER COLUMN "errorCount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "attendance_records" ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "addressLevel" TEXT;

-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "permanentlyDeletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "permanentlyDeletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "cost_adjustment_items" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "bankAccount",
DROP COLUMN "bankName",
DROP COLUMN "churnRisk",
DROP COLUMN "contract",
DROP COLUMN "email",
DROP COLUMN "healthScore",
DROP COLUMN "lifecycleStage",
DROP COLUMN "rfmScores",
DROP COLUMN "segment",
DROP COLUMN "updatedBy",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "businessProfiles" JSONB,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "district" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "permanentlyDeletedAt" TIMESTAMP(3),
ADD COLUMN     "pricingPolicyId" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "totalProductsBought" INTEGER DEFAULT 0,
ADD COLUMN     "ward" TEXT;

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "permanentlyDeletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "inventory_check_items" ADD COLUMN     "productSystemId" TEXT,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "unit" TEXT,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inventory_checks" DROP COLUMN "activityHistory";

-- AlterTable
ALTER TABLE "inventory_receipt_items" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "job_titles" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "leaves" DROP COLUMN "activityHistory",
ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order_line_items" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order_payments" ADD COLUMN     "linkedReceiptSystemId" TEXT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "activityHistory",
ADD COLUMN     "invoiceInfo" JSONB,
ALTER COLUMN "customerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "packaging_items" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "packagings" ADD COLUMN     "requestorId" TEXT,
ADD COLUMN     "requestorName" TEXT,
ADD COLUMN     "requestorPhone" TEXT,
ADD COLUMN     "sourceType" TEXT NOT NULL DEFAULT 'ORDER',
ADD COLUMN     "warrantyId" TEXT,
ALTER COLUMN "orderId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payment_methods" DROP COLUMN "accountName",
DROP COLUMN "accountNumber",
DROP COLUMN "bankName";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "activityHistory",
ADD COLUMN     "affectsBusinessReport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "orderAllocations" JSONB;

-- AlterTable
ALTER TABLE "payroll_items" ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "penalties" DROP COLUMN "activityHistory",
ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pkgx_products" ADD COLUMN     "addTime" INTEGER,
ADD COLUMN     "goodsSn" TEXT;

-- AlterTable
ALTER TABLE "product_inventory" ADD COLUMN     "inDelivery" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "activityHistory",
DROP COLUMN "lastSoldDate",
DROP COLUMN "minPrice",
DROP COLUMN "pkgxName",
DROP COLUMN "pkgxSlug",
DROP COLUMN "sellingPrice",
DROP COLUMN "seoTitle",
DROP COLUMN "taxRate",
DROP COLUMN "totalRevenue",
DROP COLUMN "trendtechSlug",
ADD COLUMN     "inDeliveryByBranch" JSONB,
ADD COLUMN     "inventoryUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "permanentlyDeletedAt" TIMESTAMP(3),
ADD COLUMN     "pkgxSyncedAt" TIMESTAMP(3),
ADD COLUMN     "totalAvailable" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCommitted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalInventory" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "purchase_order_items" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "purchase_orders" DROP COLUMN "activityHistory",
ALTER COLUMN "supplierId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "purchase_return_items" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "purchase_returns" DROP COLUMN "activityHistory",
ALTER COLUMN "supplierId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "receipts" DROP COLUMN "activityHistory",
ADD COLUMN     "affectsBusinessReport" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "sales_return_items" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sales_returns" DROP COLUMN "activityHistory";

-- AlterTable
ALTER TABLE "shipments" DROP COLUMN "activityHistory",
ADD COLUMN     "warrantyId" TEXT,
ALTER COLUMN "orderId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "stock_transfer_items" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "activityHistory",
ADD COLUMN     "addressData" JSONB,
ADD COLUMN     "permanentlyDeletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "blockedBy" TEXT[],
ADD COLUMN     "blocks" TEXT[],
ADD COLUMN     "boardId" TEXT;

-- AlterTable
ALTER TABLE "taxes" ADD COLUMN     "isDefaultExcelExport" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "wiki_pages";

-- DropEnum
DROP TYPE "CustomerLifecycle";

-- CreateTable
CREATE TABLE "attendance_locks" (
    "systemId" TEXT NOT NULL,
    "monthKey" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT true,
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedBy" TEXT,
    "unlockedAt" TIMESTAMP(3),
    "unlockedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_locks_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "price_adjustment_items" (
    "systemId" TEXT NOT NULL,
    "adjustmentId" TEXT NOT NULL,
    "productSystemId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT,
    "productImage" TEXT,
    "oldPrice" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "newPrice" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "adjustmentAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "adjustmentPercent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "note" TEXT,

    CONSTRAINT "price_adjustment_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "price_adjustments" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "employeeId" TEXT,
    "pricingPolicyId" TEXT NOT NULL,
    "pricingPolicyName" TEXT,
    "adjustmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PriceAdjustmentStatus" NOT NULL DEFAULT 'DRAFT',
    "type" TEXT NOT NULL DEFAULT 'manual',
    "reason" TEXT,
    "note" TEXT,
    "referenceCode" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBySystemId" TEXT,
    "createdByName" TEXT,
    "confirmedDate" TIMESTAMP(3),
    "confirmedBySystemId" TEXT,
    "confirmedByName" TEXT,
    "cancelledDate" TIMESTAMP(3),
    "cancelledBySystemId" TEXT,
    "cancelledByName" TEXT,
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "price_adjustments_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "product_batches" (
    "systemId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "manufactureDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "initialQty" INTEGER NOT NULL DEFAULT 0,
    "supplierName" TEXT,
    "notes" TEXT,
    "status" "BatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_batches_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "product_conversions" (
    "systemId" TEXT NOT NULL,
    "baseProductId" TEXT NOT NULL,
    "conversionUnit" TEXT NOT NULL,
    "conversionRate" INTEGER NOT NULL,
    "sku" TEXT,
    "barcode" TEXT,
    "name" TEXT,
    "sellingPrice" DECIMAL(15,2),
    "costPrice" DECIMAL(15,2),
    "weight" DECIMAL(10,2),
    "weightUnit" TEXT DEFAULT 'g',
    "thumbnailImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_conversions_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "product_serials" (
    "systemId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "status" "SerialStatus" NOT NULL DEFAULT 'IN_STOCK',
    "purchaseOrderId" TEXT,
    "orderId" TEXT,
    "warrantyId" TEXT,
    "customerId" TEXT,
    "supplierName" TEXT,
    "costPrice" DECIMAL(15,2),
    "soldPrice" DECIMAL(15,2),
    "soldDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_serials_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "reconciliation_sheets" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "branchId" TEXT,
    "status" "ReconciliationSheetStatus" NOT NULL DEFAULT 'DRAFT',
    "totalCodSystem" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalCodPartner" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalFeeSystem" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalFeePartner" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "codDifference" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "feeDifference" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdBy" TEXT,
    "createdByName" TEXT,
    "updatedBy" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "confirmedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reconciliation_sheets_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "reconciliation_sheet_items" (
    "systemId" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "packagingId" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderSystemId" TEXT NOT NULL,
    "customerName" TEXT,
    "codSystem" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "codPartner" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "codDifference" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "feeSystem" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "feePartner" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "feeDifference" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reconciliation_sheet_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "recurring_tasks" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assigneeSystemId" TEXT,
    "assignees" JSONB,
    "assignerId" TEXT,
    "assignerName" TEXT,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "estimatedHours" DECIMAL(6,2),
    "type" TEXT,
    "recurrencePattern" JSONB NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "durationDays" INTEGER NOT NULL DEFAULT 1,
    "createDaysBefore" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "createdTaskIds" JSONB,
    "lastCreatedDate" TIMESTAMP(3),
    "nextOccurrenceDate" TIMESTAMP(3),
    "occurrenceCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "templateId" TEXT,

    CONSTRAINT "recurring_tasks_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "task_templates" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "title" TEXT,
    "taskDescription" TEXT,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "estimatedHours" DECIMAL(6,2),
    "type" TEXT,
    "assigneeRoles" JSONB,
    "subtasks" JSONB,
    "checklistItems" JSONB,
    "customFields" JSONB,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "task_templates_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "task_boards" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_boards_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "supplier_warranties" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "supplierSystemId" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "branchSystemId" TEXT,
    "branchName" TEXT,
    "trackingNumber" TEXT,
    "sentDate" TIMESTAMP(3),
    "deliveryMethod" TEXT,
    "status" "SupplierWarrantyStatus" NOT NULL DEFAULT 'DRAFT',
    "subtasks" JSONB,
    "createdBySystemId" TEXT,
    "createdByName" TEXT,
    "assignedToSystemId" TEXT,
    "assignedToName" TEXT,
    "approvedBySystemId" TEXT,
    "approvedByName" TEXT,
    "confirmedBySystemId" TEXT,
    "confirmedByName" TEXT,
    "totalWarrantyCost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalReturnedItems" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT,
    "notes" TEXT,
    "confirmNotes" TEXT,
    "approvedAt" TIMESTAMP(3),
    "packedAt" TIMESTAMP(3),
    "exportedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "supplier_warranties_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "supplier_warranty_items" (
    "systemId" TEXT NOT NULL,
    "warrantyId" TEXT NOT NULL,
    "productSystemId" TEXT,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productImage" TEXT,
    "sentQuantity" INTEGER NOT NULL,
    "approvedQuantity" INTEGER NOT NULL DEFAULT 0,
    "returnedQuantity" INTEGER NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "warrantyCost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "itemNote" TEXT,
    "warrantyResult" TEXT,

    CONSTRAINT "supplier_warranty_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "promotions" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountType" "DiscountType" NOT NULL DEFAULT 'FIXED',
    "discountValue" DECIMAL(15,2) NOT NULL,
    "minOrderAmount" DECIMAL(15,2),
    "maxDiscount" DECIMAL(15,2),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "systemId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actionType" TEXT,
    "changes" JSONB,
    "metadata" JSONB,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "recipientId" TEXT NOT NULL,
    "senderId" TEXT,
    "senderName" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendance_locks_monthKey_key" ON "attendance_locks"("monthKey");

-- CreateIndex
CREATE INDEX "attendance_locks_monthKey_idx" ON "attendance_locks"("monthKey");

-- CreateIndex
CREATE UNIQUE INDEX "price_adjustments_id_key" ON "price_adjustments"("id");

-- CreateIndex
CREATE INDEX "product_batches_productId_idx" ON "product_batches"("productId");

-- CreateIndex
CREATE INDEX "product_batches_branchId_idx" ON "product_batches"("branchId");

-- CreateIndex
CREATE INDEX "product_batches_expiryDate_idx" ON "product_batches"("expiryDate");

-- CreateIndex
CREATE INDEX "product_batches_status_idx" ON "product_batches"("status");

-- CreateIndex
CREATE INDEX "product_batches_productId_branchId_idx" ON "product_batches"("productId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "product_batches_productId_branchId_batchNumber_key" ON "product_batches"("productId", "branchId", "batchNumber");

-- CreateIndex
CREATE UNIQUE INDEX "product_conversions_sku_key" ON "product_conversions"("sku");

-- CreateIndex
CREATE INDEX "product_conversions_baseProductId_idx" ON "product_conversions"("baseProductId");

-- CreateIndex
CREATE INDEX "product_conversions_sku_idx" ON "product_conversions"("sku");

-- CreateIndex
CREATE INDEX "product_conversions_barcode_idx" ON "product_conversions"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "product_serials_serialNumber_key" ON "product_serials"("serialNumber");

-- CreateIndex
CREATE INDEX "product_serials_productId_idx" ON "product_serials"("productId");

-- CreateIndex
CREATE INDEX "product_serials_branchId_idx" ON "product_serials"("branchId");

-- CreateIndex
CREATE INDEX "product_serials_status_idx" ON "product_serials"("status");

-- CreateIndex
CREATE INDEX "product_serials_orderId_idx" ON "product_serials"("orderId");

-- CreateIndex
CREATE INDEX "product_serials_purchaseOrderId_idx" ON "product_serials"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "product_serials_customerId_idx" ON "product_serials"("customerId");

-- CreateIndex
CREATE INDEX "product_serials_productId_branchId_status_idx" ON "product_serials"("productId", "branchId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "reconciliation_sheets_id_key" ON "reconciliation_sheets"("id");

-- CreateIndex
CREATE INDEX "reconciliation_sheets_carrier_idx" ON "reconciliation_sheets"("carrier");

-- CreateIndex
CREATE INDEX "reconciliation_sheets_status_idx" ON "reconciliation_sheets"("status");

-- CreateIndex
CREATE INDEX "reconciliation_sheets_createdAt_idx" ON "reconciliation_sheets"("createdAt");

-- CreateIndex
CREATE INDEX "reconciliation_sheet_items_sheetId_idx" ON "reconciliation_sheet_items"("sheetId");

-- CreateIndex
CREATE INDEX "reconciliation_sheet_items_packagingId_idx" ON "reconciliation_sheet_items"("packagingId");

-- CreateIndex
CREATE UNIQUE INDEX "reconciliation_sheet_items_sheetId_packagingId_key" ON "reconciliation_sheet_items"("sheetId", "packagingId");

-- CreateIndex
CREATE UNIQUE INDEX "recurring_tasks_id_key" ON "recurring_tasks"("id");

-- CreateIndex
CREATE INDEX "recurring_tasks_isActive_idx" ON "recurring_tasks"("isActive");

-- CreateIndex
CREATE INDEX "recurring_tasks_isPaused_idx" ON "recurring_tasks"("isPaused");

-- CreateIndex
CREATE INDEX "recurring_tasks_nextOccurrenceDate_idx" ON "recurring_tasks"("nextOccurrenceDate");

-- CreateIndex
CREATE UNIQUE INDEX "task_templates_id_key" ON "task_templates"("id");

-- CreateIndex
CREATE INDEX "task_templates_category_idx" ON "task_templates"("category");

-- CreateIndex
CREATE INDEX "task_templates_isActive_idx" ON "task_templates"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "task_boards_id_key" ON "task_boards"("id");

-- CreateIndex
CREATE INDEX "task_boards_isActive_isDeleted_idx" ON "task_boards"("isActive", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_warranties_id_key" ON "supplier_warranties"("id");

-- CreateIndex
CREATE INDEX "supplier_warranties_supplierSystemId_idx" ON "supplier_warranties"("supplierSystemId");

-- CreateIndex
CREATE INDEX "supplier_warranties_status_idx" ON "supplier_warranties"("status");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_id_key" ON "promotions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_code_key" ON "promotions"("code");

-- CreateIndex
CREATE INDEX "activity_logs_entityType_entityId_idx" ON "activity_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "activity_logs_entityType_createdAt_idx" ON "activity_logs"("entityType", "createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_createdBy_idx" ON "activity_logs"("createdBy");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");

-- CreateIndex
CREATE INDEX "notifications_recipientId_isRead_idx" ON "notifications"("recipientId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_recipientId_createdAt_idx" ON "notifications"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "ImportExportLog_status_idx" ON "ImportExportLog"("status");

-- CreateIndex
CREATE INDEX "inventory_check_items_productSystemId_idx" ON "inventory_check_items"("productSystemId");

-- CreateIndex
CREATE INDEX "orders_status_orderDate_idx" ON "orders"("status", "orderDate");

-- CreateIndex
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");

-- CreateIndex
CREATE INDEX "orders_deliveryStatus_idx" ON "orders"("deliveryStatus");

-- CreateIndex
CREATE INDEX "orders_salespersonId_idx" ON "orders"("salespersonId");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "packagings_warrantyId_idx" ON "packagings"("warrantyId");

-- CreateIndex
CREATE INDEX "payments_customerId_idx" ON "payments"("customerId");

-- CreateIndex
CREATE INDEX "pkgx_products_goodsSn_idx" ON "pkgx_products"("goodsSn");

-- CreateIndex
CREATE INDEX "products_isDeleted_idx" ON "products"("isDeleted");

-- CreateIndex
CREATE INDEX "products_createdAt_idx" ON "products"("createdAt");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_id_idx" ON "products"("id");

-- CreateIndex
CREATE INDEX "products_pkgxId_idx" ON "products"("pkgxId");

-- CreateIndex
CREATE INDEX "products_barcode_idx" ON "products"("barcode");

-- CreateIndex
CREATE INDEX "products_isDeleted_status_idx" ON "products"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "products_isDeleted_createdAt_idx" ON "products"("isDeleted", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "products_isDeleted_status_createdAt_idx" ON "products"("isDeleted", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "products_isDeleted_brandId_idx" ON "products"("isDeleted", "brandId");

-- CreateIndex
CREATE INDEX "products_type_idx" ON "products"("type");

-- CreateIndex
CREATE INDEX "products_totalInventory_idx" ON "products"("totalInventory");

-- CreateIndex
CREATE INDEX "products_isDeleted_totalInventory_idx" ON "products"("isDeleted", "totalInventory");

-- CreateIndex
CREATE INDEX "sales_returns_exchangeOrderSystemId_idx" ON "sales_returns"("exchangeOrderSystemId");

-- CreateIndex
CREATE INDEX "shipments_warrantyId_idx" ON "shipments"("warrantyId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_adjustment_items" ADD CONSTRAINT "price_adjustment_items_adjustmentId_fkey" FOREIGN KEY ("adjustmentId") REFERENCES "price_adjustments"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_conversions" ADD CONSTRAINT "product_conversions_baseProductId_fkey" FOREIGN KEY ("baseProductId") REFERENCES "products"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packagings" ADD CONSTRAINT "packagings_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packagings" ADD CONSTRAINT "packagings_warrantyId_fkey" FOREIGN KEY ("warrantyId") REFERENCES "supplier_warranties"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliation_sheets" ADD CONSTRAINT "reconciliation_sheets_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliation_sheet_items" ADD CONSTRAINT "reconciliation_sheet_items_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "reconciliation_sheets"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliation_sheet_items" ADD CONSTRAINT "reconciliation_sheet_items_packagingId_fkey" FOREIGN KEY ("packagingId") REFERENCES "packagings"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliation_sheet_items" ADD CONSTRAINT "reconciliation_sheet_items_orderSystemId_fkey" FOREIGN KEY ("orderSystemId") REFERENCES "orders"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_warrantyId_fkey" FOREIGN KEY ("warrantyId") REFERENCES "supplier_warranties"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_warranties" ADD CONSTRAINT "supplier_warranties_supplierSystemId_fkey" FOREIGN KEY ("supplierSystemId") REFERENCES "suppliers"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_warranty_items" ADD CONSTRAINT "supplier_warranty_items_warrantyId_fkey" FOREIGN KEY ("warrantyId") REFERENCES "supplier_warranties"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line_items" ADD CONSTRAINT "order_line_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_returns" ADD CONSTRAINT "sales_returns_exchangeOrderSystemId_fkey" FOREIGN KEY ("exchangeOrderSystemId") REFERENCES "orders"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "employees"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "employees"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;