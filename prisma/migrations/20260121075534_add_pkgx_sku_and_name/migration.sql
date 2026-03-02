/*
  Warnings:

  - A unique constraint covering the columns `[key,group]` on the table `settings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[packagingSystemId]` on the table `shipments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `wikis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `group` to the `settings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PrintStatus" AS ENUM ('PRINTED', 'NOT_PRINTED');

-- CreateEnum
CREATE TYPE "StockOutStatus" AS ENUM ('NOT_STOCKED_OUT', 'FULLY_STOCKED_OUT');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('NO_RETURN', 'PARTIAL_RETURN', 'FULL_RETURN');

-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('staging', 'permanent', 'deleted');

-- AlterEnum
ALTER TYPE "DeliveryMethod" ADD VALUE 'IN_STORE_PICKUP';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'CONFIRMED';
ALTER TYPE "OrderStatus" ADD VALUE 'PACKING';
ALTER TYPE "OrderStatus" ADD VALUE 'PACKED';
ALTER TYPE "OrderStatus" ADD VALUE 'READY_FOR_PICKUP';
ALTER TYPE "OrderStatus" ADD VALUE 'SHIPPING';
ALTER TYPE "OrderStatus" ADD VALUE 'DELIVERED';
ALTER TYPE "OrderStatus" ADD VALUE 'FAILED_DELIVERY';
ALTER TYPE "OrderStatus" ADD VALUE 'RETURNED';

-- DropIndex
DROP INDEX "packagings_orderId_key";

-- DropIndex
DROP INDEX "settings_key_key";

-- AlterTable
ALTER TABLE "attendance_records" ADD COLUMN     "absentDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "afternoonCheckIn" TIMESTAMP(3),
ADD COLUMN     "department" TEXT,
ADD COLUMN     "earlyDepartures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "employeeBusinessId" TEXT,
ADD COLUMN     "employeeSystemId" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "lateArrivals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "leaveDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "morningCheckOut" TIMESTAMP(3),
ADD COLUMN     "otHours" DECIMAL(5,2),
ADD COLUMN     "otHoursHoliday" DECIMAL(5,2),
ADD COLUMN     "otHoursWeekday" DECIMAL(5,2),
ADD COLUMN     "otHoursWeekend" DECIMAL(5,2),
ADD COLUMN     "overtimeCheckIn" TIMESTAMP(3),
ADD COLUMN     "overtimeCheckOut" TIMESTAMP(3),
ADD COLUMN     "workDays" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "entityName" TEXT;

-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "sortOrder" INTEGER DEFAULT 0,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "websiteSeo" JSONB;

-- AlterTable
ALTER TABLE "cash_accounts" ADD COLUMN     "accountHolder" TEXT,
ADD COLUMN     "accountType" VARCHAR(50) DEFAULT 'cash',
ADD COLUMN     "bankAccountNumber" TEXT,
ADD COLUMN     "bankBranch" TEXT,
ADD COLUMN     "bankCode" TEXT,
ADD COLUMN     "branchSystemId" TEXT,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "initialBalance" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "managedBy" TEXT,
ADD COLUMN     "maxBalance" DECIMAL(15,2),
ADD COLUMN     "minBalance" DECIMAL(15,2),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "color" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "level" INTEGER,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "path" TEXT,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "sortOrder" INTEGER DEFAULT 0,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "websiteSeo" JSONB;

-- AlterTable
ALTER TABLE "complaints" ADD COLUMN     "affectedProducts" JSONB,
ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "assigneeName" TEXT,
ADD COLUMN     "branchName" TEXT,
ADD COLUMN     "branchSystemId" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" TEXT,
ADD COLUMN     "cancelledPaymentsReceipts" JSONB,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "employeeImages" JSONB,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "endedBy" TEXT,
ADD COLUMN     "evidenceImages" TEXT[],
ADD COLUMN     "inventoryAdjustment" JSONB,
ADD COLUMN     "inventoryHistory" JSONB,
ADD COLUMN     "investigationNote" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerifiedCorrect" BOOLEAN,
ADD COLUMN     "orderCode" TEXT,
ADD COLUMN     "orderValue" DECIMAL(15,2),
ADD COLUMN     "proposedSolution" TEXT,
ADD COLUMN     "publicTrackingCode" TEXT,
ADD COLUMN     "resolutionNote" TEXT,
ADD COLUMN     "resolvedBy" TEXT,
ADD COLUMN     "responsibleUserId" TEXT,
ADD COLUMN     "subtasks" JSONB,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "timeline" JSONB,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "verification" TEXT NOT NULL DEFAULT 'pending-verification';

-- AlterTable
ALTER TABLE "cost_adjustment_items" ADD COLUMN     "adjustmentAmount" DECIMAL(15,2),
ADD COLUMN     "adjustmentPercent" DECIMAL(5,2),
ADD COLUMN     "productImage" TEXT,
ADD COLUMN     "productName" TEXT,
ADD COLUMN     "productSystemId" TEXT,
ADD COLUMN     "reason" TEXT;

-- AlterTable
ALTER TABLE "cost_adjustments" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledByName" TEXT,
ADD COLUMN     "cancelledBySystemId" TEXT,
ADD COLUMN     "cancelledDate" TIMESTAMP(3),
ADD COLUMN     "confirmedByName" TEXT,
ADD COLUMN     "confirmedBySystemId" TEXT,
ADD COLUMN     "confirmedDate" TIMESTAMP(3),
ADD COLUMN     "createdByName" TEXT,
ADD COLUMN     "createdBySystemId" TEXT,
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "referenceCode" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'manual';

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "allowCredit" BOOLEAN DEFAULT true,
ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "campaign" TEXT,
ADD COLUMN     "churnRisk" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "contacts" JSONB,
ADD COLUMN     "contract" JSONB,
ADD COLUMN     "creditRating" TEXT,
ADD COLUMN     "customerGroup" TEXT,
ADD COLUMN     "followUpAssigneeId" TEXT,
ADD COLUMN     "followUpReason" TEXT,
ADD COLUMN     "healthScore" INTEGER,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "lastContactDate" TIMESTAMP(3),
ADD COLUMN     "nextFollowUpDate" TIMESTAMP(3),
ADD COLUMN     "paymentTerms" TEXT,
ADD COLUMN     "referredBy" TEXT,
ADD COLUMN     "rfmScores" JSONB,
ADD COLUMN     "segment" TEXT,
ADD COLUMN     "social" JSONB,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "zaloPhone" TEXT;

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "certifications" JSONB,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "lastReviewDate" TIMESTAMP(3),
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "nextReviewDate" TIMESTAMP(3),
ADD COLUMN     "performanceRating" TEXT,
ADD COLUMN     "shiftType" TEXT,
ADD COLUMN     "skills" JSONB,
ADD COLUMN     "workingDaysPerWeek" INTEGER DEFAULT 5,
ADD COLUMN     "workingHoursPerDay" INTEGER DEFAULT 8;

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'staging';

-- AlterTable
ALTER TABLE "id_counters" ADD COLUMN     "businessPrefix" VARCHAR(50) DEFAULT '',
ADD COLUMN     "systemPrefix" VARCHAR(50) DEFAULT '';

-- AlterTable
ALTER TABLE "inventory_checks" ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "balancedAt" TIMESTAMP(3),
ADD COLUMN     "balancedBy" TEXT,
ADD COLUMN     "branchName" TEXT,
ADD COLUMN     "branchSystemId" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" TEXT,
ADD COLUMN     "cancelledReason" TEXT,
ADD COLUMN     "checkItems" JSONB;

-- AlterTable
ALTER TABLE "inventory_receipts" ADD COLUMN     "branchName" TEXT,
ADD COLUMN     "branchSystemId" TEXT,
ADD COLUMN     "purchaseOrderId" TEXT,
ADD COLUMN     "purchaseOrderSystemId" TEXT,
ADD COLUMN     "receiptItems" JSONB,
ADD COLUMN     "receivedDate" TIMESTAMP(3),
ADD COLUMN     "receiverName" TEXT,
ADD COLUMN     "receiverSystemId" TEXT,
ADD COLUMN     "supplierName" TEXT,
ADD COLUMN     "supplierSystemId" TEXT,
ADD COLUMN     "warehouseName" TEXT;

-- AlterTable
ALTER TABLE "job_titles" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "leaves" ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "employeeBusinessId" TEXT,
ADD COLUMN     "employeeName" TEXT,
ADD COLUMN     "employeeSystemId" TEXT,
ADD COLUMN     "leaveTypeId" TEXT,
ADD COLUMN     "leaveTypeIsPaid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "leaveTypeName" TEXT,
ADD COLUMN     "leaveTypeRequiresAttachment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leaveTypeSystemId" TEXT,
ADD COLUMN     "numberOfDays" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "order_line_items" ADD COLUMN     "taxId" TEXT;

-- AlterTable
ALTER TABLE "order_payments" ADD COLUMN     "linkedWarrantySystemId" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "assignedPackerId" TEXT,
ADD COLUMN     "assignedPackerName" TEXT,
ADD COLUMN     "cancellationMetadata" JSONB,
ADD COLUMN     "dispatchedByEmployeeId" TEXT,
ADD COLUMN     "dispatchedByEmployeeName" TEXT,
ADD COLUMN     "dispatchedDate" TIMESTAMP(3),
ADD COLUMN     "expectedPaymentMethod" TEXT,
ADD COLUMN     "linkedSalesReturnSystemId" TEXT,
ADD COLUMN     "linkedSalesReturnValue" DECIMAL(15,2),
ADD COLUMN     "orderDiscount" DECIMAL(15,2),
ADD COLUMN     "orderDiscountReason" TEXT,
ADD COLUMN     "orderDiscountType" "DiscountType",
ADD COLUMN     "printStatus" "PrintStatus" NOT NULL DEFAULT 'NOT_PRINTED',
ADD COLUMN     "referenceUrl" TEXT,
ADD COLUMN     "returnStatus" "ReturnStatus" NOT NULL DEFAULT 'NO_RETURN',
ADD COLUMN     "serviceFees" JSONB,
ADD COLUMN     "shippingInfo" JSONB,
ADD COLUMN     "sourceSalesReturnId" TEXT,
ADD COLUMN     "stockOutStatus" "StockOutStatus" NOT NULL DEFAULT 'NOT_STOCKED_OUT',
ADD COLUMN     "subtasks" JSONB,
ADD COLUMN     "voucherAmount" DECIMAL(15,2),
ADD COLUMN     "voucherCode" TEXT;

-- AlterTable
ALTER TABLE "packagings" ADD COLUMN     "actualFee" DECIMAL(15,2),
ADD COLUMN     "actualWeight" DECIMAL(10,3),
ADD COLUMN     "assignedEmployeeId" TEXT,
ADD COLUMN     "assignedEmployeeName" TEXT,
ADD COLUMN     "cancelDate" TIMESTAMP(3),
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelingEmployeeId" TEXT,
ADD COLUMN     "cancelingEmployeeName" TEXT,
ADD COLUMN     "carrier" TEXT,
ADD COLUMN     "codAmount" DECIMAL(15,2),
ADD COLUMN     "confirmDate" TIMESTAMP(3),
ADD COLUMN     "confirmingEmployeeId" TEXT,
ADD COLUMN     "confirmingEmployeeName" TEXT,
ADD COLUMN     "deliveredDate" TIMESTAMP(3),
ADD COLUMN     "deliveryMethod" "DeliveryMethod",
ADD COLUMN     "deliveryStatus" "DeliveryStatus",
ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "estimatedDeliverTime" TIMESTAMP(3),
ADD COLUMN     "estimatedPickTime" TIMESTAMP(3),
ADD COLUMN     "ghtkReasonCode" TEXT,
ADD COLUMN     "ghtkReasonText" TEXT,
ADD COLUMN     "ghtkStatusId" INTEGER,
ADD COLUMN     "ghtkTrackingId" TEXT,
ADD COLUMN     "ghtkWebhookHistory" JSONB,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "noteToShipper" TEXT,
ADD COLUMN     "partnerStatus" TEXT,
ADD COLUMN     "payer" TEXT,
ADD COLUMN     "printStatus" "PrintStatus" NOT NULL DEFAULT 'NOT_PRINTED',
ADD COLUMN     "reconciliationStatus" TEXT,
ADD COLUMN     "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "requestingEmployeeId" TEXT,
ADD COLUMN     "requestingEmployeeName" TEXT,
ADD COLUMN     "service" TEXT,
ADD COLUMN     "shippingFeeToPartner" DECIMAL(15,2),
ADD COLUMN     "trackingCode" TEXT,
ADD COLUMN     "weight" INTEGER;

-- AlterTable
ALTER TABLE "payment_methods" ADD COLUMN     "accountName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "code" VARCHAR(50) DEFAULT 'UNKNOWN',
ADD COLUMN     "color" TEXT,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" VARCHAR(50) DEFAULT 'other',
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "accountSystemId" TEXT,
ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "affectsDebt" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "branchName" TEXT,
ADD COLUMN     "branchSystemId" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "category" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerSystemId" TEXT,
ADD COLUMN     "linkedComplaintSystemId" TEXT,
ADD COLUMN     "linkedOrderSystemId" TEXT,
ADD COLUMN     "linkedPayrollBatchSystemId" TEXT,
ADD COLUMN     "linkedPayslipSystemId" TEXT,
ADD COLUMN     "linkedSalesReturnSystemId" TEXT,
ADD COLUMN     "linkedWarrantySystemId" TEXT,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "originalDocumentId" TEXT,
ADD COLUMN     "paymentMethodName" TEXT,
ADD COLUMN     "paymentMethodSystemId" TEXT,
ADD COLUMN     "paymentReceiptTypeName" TEXT,
ADD COLUMN     "paymentReceiptTypeSystemId" TEXT,
ADD COLUMN     "purchaseOrderBusinessId" TEXT,
ADD COLUMN     "purchaseOrderId" TEXT,
ADD COLUMN     "purchaseOrderSystemId" TEXT,
ADD COLUMN     "recipientName" TEXT,
ADD COLUMN     "recipientSystemId" TEXT,
ADD COLUMN     "recipientTypeName" TEXT,
ADD COLUMN     "recipientTypeSystemId" TEXT,
ADD COLUMN     "recognitionDate" TIMESTAMP(3),
ADD COLUMN     "runningBalance" DECIMAL(15,2),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'completed';

-- AlterTable
ALTER TABLE "penalties" ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "deductedAt" TIMESTAMP(3),
ADD COLUMN     "deductedInPayrollId" TEXT,
ADD COLUMN     "employeeName" TEXT,
ADD COLUMN     "issuerName" TEXT,
ADD COLUMN     "issuerSystemId" TEXT,
ADD COLUMN     "linkedComplaintSystemId" TEXT,
ADD COLUMN     "linkedOrderSystemId" TEXT,
ADD COLUMN     "penaltyTypeName" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Chưa thanh toán',
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "pricing_policies" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "categorySystemIds" TEXT[],
ADD COLUMN     "comboDiscount" DECIMAL(15,2),
ADD COLUMN     "comboItems" JSONB,
ADD COLUMN     "comboPricingType" TEXT,
ADD COLUMN     "committedByBranch" JSONB,
ADD COLUMN     "dimensions" JSONB,
ADD COLUMN     "discontinuedDate" TIMESTAMP(3),
ADD COLUMN     "hasVariants" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "importerAddress" TEXT,
ADD COLUMN     "importerName" TEXT,
ADD COLUMN     "importerSystemId" TEXT,
ADD COLUMN     "inTransitByBranch" JSONB,
ADD COLUMN     "inventoryByBranch" JSONB,
ADD COLUMN     "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNewArrival" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOnSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ktitle" TEXT,
ADD COLUMN     "lastPurchaseDate" TIMESTAMP(3),
ADD COLUMN     "lastPurchasePrice" DECIMAL(15,2),
ADD COLUMN     "lastSoldDate" TIMESTAMP(3),
ADD COLUMN     "launchedDate" TIMESTAMP(3),
ADD COLUMN     "nameVat" TEXT,
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "pkgxId" INTEGER,
ADD COLUMN     "pkgxName" TEXT,
ADD COLUMN     "pkgxSku" TEXT,
ADD COLUMN     "pkgxSlug" TEXT,
ADD COLUMN     "productTypeSystemId" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "sellerNote" TEXT,
ADD COLUMN     "seoPkgx" JSONB,
ADD COLUMN     "seoTrendtech" JSONB,
ADD COLUMN     "sku" VARCHAR(100) DEFAULT '',
ADD COLUMN     "storageLocationSystemId" TEXT,
ADD COLUMN     "subCategories" TEXT[],
ADD COLUMN     "subCategory" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "totalRevenue" DECIMAL(15,2),
ADD COLUMN     "trendtechId" INTEGER,
ADD COLUMN     "trendtechSlug" TEXT,
ADD COLUMN     "usageGuide" TEXT,
ADD COLUMN     "variantAttributes" JSONB,
ADD COLUMN     "variants" JSONB,
ADD COLUMN     "videoLinks" TEXT[],
ADD COLUMN     "warehouseLocation" TEXT;

-- AlterTable
ALTER TABLE "purchase_orders" ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "branchName" TEXT,
ADD COLUMN     "branchSystemId" TEXT,
ADD COLUMN     "buyer" TEXT,
ADD COLUMN     "buyerSystemId" TEXT,
ADD COLUMN     "creatorName" TEXT,
ADD COLUMN     "creatorSystemId" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deliveryDate" TIMESTAMP(3),
ADD COLUMN     "deliveryStatus" TEXT NOT NULL DEFAULT 'Chưa nhập',
ADD COLUMN     "discountType" TEXT,
ADD COLUMN     "grandTotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "inventoryReceiptIds" TEXT[],
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lineItems" JSONB,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'Chưa thanh toán',
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "refundStatus" TEXT,
ADD COLUMN     "returnStatus" TEXT,
ADD COLUMN     "shippingFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "supplierName" TEXT,
ADD COLUMN     "supplierSystemId" TEXT;

-- AlterTable
ALTER TABLE "purchase_returns" ADD COLUMN     "accountSystemId" TEXT,
ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "branchName" TEXT,
ADD COLUMN     "branchSystemId" TEXT,
ADD COLUMN     "creatorName" TEXT,
ADD COLUMN     "purchaseOrderBusinessId" TEXT,
ADD COLUMN     "purchaseOrderSystemId" TEXT,
ADD COLUMN     "refundAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "refundMethod" TEXT,
ADD COLUMN     "returnItems" JSONB,
ADD COLUMN     "supplierName" TEXT,
ADD COLUMN     "supplierSystemId" TEXT,
ADD COLUMN     "totalReturnValue" DECIMAL(15,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "receipts" ADD COLUMN     "accountSystemId" TEXT,
ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "affectsDebt" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "branchName" TEXT,
ADD COLUMN     "branchSystemId" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "category" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerSystemId" TEXT,
ADD COLUMN     "linkedComplaintSystemId" TEXT,
ADD COLUMN     "linkedOrderSystemId" TEXT,
ADD COLUMN     "linkedSalesReturnSystemId" TEXT,
ADD COLUMN     "linkedWarrantySystemId" TEXT,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "orderAllocations" JSONB,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "originalDocumentId" TEXT,
ADD COLUMN     "payerName" TEXT,
ADD COLUMN     "payerSystemId" TEXT,
ADD COLUMN     "payerTypeName" TEXT,
ADD COLUMN     "payerTypeSystemId" TEXT,
ADD COLUMN     "paymentMethodName" TEXT,
ADD COLUMN     "paymentMethodSystemId" TEXT,
ADD COLUMN     "paymentReceiptTypeName" TEXT,
ADD COLUMN     "paymentReceiptTypeSystemId" TEXT,
ADD COLUMN     "purchaseOrderId" TEXT,
ADD COLUMN     "purchaseOrderSystemId" TEXT,
ADD COLUMN     "recognitionDate" TIMESTAMP(3),
ADD COLUMN     "runningBalance" DECIMAL(15,2),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'completed';

-- AlterTable
ALTER TABLE "sales_returns" ADD COLUMN     "accountSystemId" TEXT,
ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "branchName" TEXT,
ADD COLUMN     "branchSystemId" TEXT,
ADD COLUMN     "configuration" JSONB,
ADD COLUMN     "creatorName" TEXT,
ADD COLUMN     "creatorSystemId" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerSystemId" TEXT,
ADD COLUMN     "deliveryMethod" TEXT,
ADD COLUMN     "discountNew" DECIMAL(15,2),
ADD COLUMN     "discountNewType" TEXT,
ADD COLUMN     "exchangeItems" JSONB,
ADD COLUMN     "exchangeOrderSystemId" TEXT,
ADD COLUMN     "finalAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "grandTotalNew" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "isReceived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "orderBusinessId" TEXT,
ADD COLUMN     "orderSystemId" TEXT,
ADD COLUMN     "packageInfo" JSONB,
ADD COLUMN     "paymentVoucherSystemId" TEXT,
ADD COLUMN     "paymentVoucherSystemIds" TEXT[],
ADD COLUMN     "payments" JSONB,
ADD COLUMN     "receiptVoucherSystemIds" TEXT[],
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "refundAmount" DECIMAL(15,2),
ADD COLUMN     "refundMethod" TEXT,
ADD COLUMN     "refunds" JSONB,
ADD COLUMN     "returnItems" JSONB,
ADD COLUMN     "shippingAddress" JSONB,
ADD COLUMN     "shippingFeeNew" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "shippingPartnerId" TEXT,
ADD COLUMN     "shippingServiceId" TEXT,
ADD COLUMN     "subtotalNew" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalReturnValue" DECIMAL(15,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "group" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shipments" ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "actualFee" DECIMAL(15,2),
ADD COLUMN     "actualWeight" DECIMAL(10,3),
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "deliveryStatus" TEXT,
ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "dispatchedAt" TIMESTAMP(3),
ADD COLUMN     "estimatedDeliverTime" TIMESTAMP(3),
ADD COLUMN     "estimatedPickTime" TIMESTAMP(3),
ADD COLUMN     "ghtkReasonCode" TEXT,
ADD COLUMN     "ghtkReasonText" TEXT,
ADD COLUMN     "ghtkStatusId" INTEGER,
ADD COLUMN     "ghtkTrackingId" TEXT,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "noteToShipper" TEXT,
ADD COLUMN     "orderBusinessId" TEXT,
ADD COLUMN     "orderSystemId" TEXT,
ADD COLUMN     "packagingSystemId" TEXT,
ADD COLUMN     "partnerStatus" TEXT,
ADD COLUMN     "payer" TEXT,
ADD COLUMN     "printStatus" TEXT NOT NULL DEFAULT 'Chưa in',
ADD COLUMN     "reconciliationStatus" TEXT,
ADD COLUMN     "service" TEXT,
ADD COLUMN     "shippingFeeToPartner" DECIMAL(15,2),
ADD COLUMN     "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "stock_locations" ADD COLUMN     "address" TEXT,
ADD COLUMN     "branchSystemId" TEXT,
ADD COLUMN     "code" VARCHAR(50) DEFAULT 'DEFAULT',
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "stock_transfers" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledByName" TEXT,
ADD COLUMN     "cancelledBySystemId" TEXT,
ADD COLUMN     "cancelledDate" TIMESTAMP(3),
ADD COLUMN     "createdByName" TEXT,
ADD COLUMN     "createdBySystemId" TEXT,
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fromBranchName" TEXT,
ADD COLUMN     "fromBranchSystemId" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "receivedByName" TEXT,
ADD COLUMN     "receivedBySystemId" TEXT,
ADD COLUMN     "referenceCode" TEXT,
ADD COLUMN     "toBranchName" TEXT,
ADD COLUMN     "toBranchSystemId" TEXT,
ADD COLUMN     "transferItems" JSONB,
ADD COLUMN     "transferredByName" TEXT,
ADD COLUMN     "transferredBySystemId" TEXT,
ADD COLUMN     "transferredDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "accountManager" TEXT,
ADD COLUMN     "activityHistory" JSONB,
ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "currentDebt" DECIMAL(15,2),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Đang Giao Dịch',
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "activities" JSONB,
ADD COLUMN     "actualHours" DECIMAL(6,2),
ADD COLUMN     "approvalHistory" JSONB,
ADD COLUMN     "approvalStatus" TEXT,
ADD COLUMN     "assigneeName" TEXT,
ADD COLUMN     "assignees" JSONB,
ADD COLUMN     "assignerId" TEXT,
ADD COLUMN     "assignerName" TEXT,
ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "comments" JSONB,
ADD COLUMN     "completedDate" TIMESTAMP(3),
ADD COLUMN     "completionEvidence" JSONB,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "estimatedHours" DECIMAL(6,2),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "requiresEvidence" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "subtasks" JSONB,
ADD COLUMN     "timerRunning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timerStartedAt" TIMESTAMP(3),
ADD COLUMN     "totalTrackedSeconds" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastLogin" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "warranties" ADD COLUMN     "branchName" TEXT,
ADD COLUMN     "branchSystemId" TEXT,
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "comments" JSONB,
ADD COLUMN     "createdBySystemId" TEXT,
ADD COLUMN     "customerAddress" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "employeeName" TEXT,
ADD COLUMN     "employeeSystemId" TEXT,
ADD COLUMN     "externalReference" TEXT,
ADD COLUMN     "history" JSONB,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "issueDescription" TEXT,
ADD COLUMN     "linkedOrderSystemId" TEXT,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "processedImages" TEXT[],
ADD COLUMN     "processingStartedAt" TIMESTAMP(3),
ADD COLUMN     "products" JSONB,
ADD COLUMN     "publicTrackingCode" TEXT,
ADD COLUMN     "receivedImages" TEXT[],
ADD COLUMN     "referenceUrl" TEXT,
ADD COLUMN     "settlement" JSONB,
ADD COLUMN     "settlementStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "shippingFee" DECIMAL(15,2),
ADD COLUMN     "statusReason" TEXT,
ADD COLUMN     "stockDeducted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subtasks" JSONB,
ADD COLUMN     "summary" JSONB,
ADD COLUMN     "trackingCode" TEXT,
ADD COLUMN     "updatedBySystemId" TEXT;

-- AlterTable
ALTER TABLE "wikis" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT;

-- CreateTable
CREATE TABLE "comments" (
    "systemId" VARCHAR(255) NOT NULL DEFAULT (gen_random_uuid())::character varying,
    "entityType" VARCHAR(100) NOT NULL,
    "entityId" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(255),
    "createdByName" VARCHAR(255),
    "updatedBy" VARCHAR(255),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "inventory" (
    "systemId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minQuantity" INTEGER NOT NULL DEFAULT 0,
    "maxQuantity" INTEGER,
    "reservedQty" INTEGER NOT NULL DEFAULT 0,
    "lastRestockDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "provinces" (
    "system_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT '2-level',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("system_id")
);

-- CreateTable
CREATE TABLE "districts" (
    "system_id" TEXT NOT NULL,
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT '3-level',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("system_id")
);

-- CreateTable
CREATE TABLE "wards" (
    "system_id" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,
    "province_name" TEXT,
    "district_id" INTEGER,
    "district_name" TEXT,
    "level" TEXT NOT NULL DEFAULT '3-level',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "wards_pkey" PRIMARY KEY ("system_id")
);

-- CreateTable
CREATE TABLE "complaint_type_settings" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "complaint_type_settings_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "customer_settings" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_settings_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "employee_type_settings" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "employee_type_settings_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "penalty_type_settings" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'other',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "penalty_type_settings_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "pkgx_categories" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isShow" INTEGER NOT NULL DEFAULT 1,
    "catDesc" TEXT,
    "longDesc" TEXT,
    "keywords" TEXT,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "catAlias" TEXT,
    "style" TEXT,
    "grade" INTEGER,
    "filterAttr" TEXT,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pkgx_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pkgx_brands" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "siteUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isShow" INTEGER NOT NULL DEFAULT 1,
    "keywords" TEXT,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pkgx_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pkgx_category_mappings" (
    "systemId" TEXT NOT NULL,
    "hrmCategoryId" TEXT NOT NULL,
    "hrmCategoryName" TEXT NOT NULL,
    "pkgxCategoryId" INTEGER NOT NULL,
    "pkgxCategoryName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "pkgx_category_mappings_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "pkgx_brand_mappings" (
    "systemId" TEXT NOT NULL,
    "hrmBrandId" TEXT NOT NULL,
    "hrmBrandName" TEXT NOT NULL,
    "pkgxBrandId" INTEGER NOT NULL,
    "pkgxBrandName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "pkgx_brand_mappings_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "pkgx_price_mappings" (
    "systemId" TEXT NOT NULL,
    "priceType" TEXT NOT NULL,
    "pricingPolicyId" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "pkgx_price_mappings_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "pkgx_sync_logs" (
    "systemId" TEXT NOT NULL,
    "syncType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "itemsTotal" INTEGER NOT NULL DEFAULT 0,
    "itemsSuccess" INTEGER NOT NULL DEFAULT 0,
    "itemsFailed" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "details" JSONB,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedBy" TEXT,

    CONSTRAINT "pkgx_sync_logs_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "pkgx_config" (
    "systemId" TEXT NOT NULL,
    "apiUrl" TEXT NOT NULL,
    "apiKey" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "autoSync" BOOLEAN NOT NULL DEFAULT false,
    "syncInterval" INTEGER NOT NULL DEFAULT 60,
    "lastSyncAt" TIMESTAMP(3),
    "connectionStatus" TEXT NOT NULL DEFAULT 'disconnected',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "pkgx_config_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "role_settings" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "role_settings_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "sales_channels" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isApplied" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_channels_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "settings_data" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "settings_data_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "shipping_partners" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "website" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isConnected" BOOLEAN NOT NULL DEFAULT false,
    "services" JSONB,
    "credentials" JSONB,
    "configuration" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "shipping_partners_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "taxes" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DECIMAL(5,2) NOT NULL,
    "description" TEXT,
    "isDefaultSale" BOOLEAN NOT NULL DEFAULT false,
    "isDefaultPurchase" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "taxes_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "units" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "units_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "ImportExportLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "performedBy" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "totalRecords" INTEGER NOT NULL,
    "successCount" INTEGER NOT NULL,
    "errorCount" INTEGER NOT NULL,
    "errors" TEXT,
    "filePath" TEXT,
    "fileName" TEXT,
    "notes" TEXT,
    "duplicateHandling" TEXT,
    "format" TEXT,
    "filters" TEXT,

    CONSTRAINT "ImportExportLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "systemId" VARCHAR(255) NOT NULL DEFAULT (gen_random_uuid())::character varying,
    "userId" VARCHAR(255) NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" JSONB NOT NULL DEFAULT '{}',
    "category" VARCHAR(100),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "active_timers" (
    "systemId" VARCHAR(255) NOT NULL DEFAULT (gen_random_uuid())::character varying,
    "userId" VARCHAR(255) NOT NULL,
    "taskId" VARCHAR(255) NOT NULL,
    "startTime" TIMESTAMP(6) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "active_timers_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "wiki_pages" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "wiki_pages_pkey" PRIMARY KEY ("systemId")
);

-- CreateIndex
CREATE INDEX "idx_comments_entity" ON "comments"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "inventory_locationId_idx" ON "inventory"("locationId");

-- CreateIndex
CREATE INDEX "inventory_productId_idx" ON "inventory"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_productId_locationId_key" ON "inventory"("productId", "locationId");

-- CreateIndex
CREATE INDEX "provinces_level_idx" ON "provinces"("level");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_business_id_level_key" ON "provinces"("business_id", "level");

-- CreateIndex
CREATE INDEX "districts_province_id_idx" ON "districts"("province_id");

-- CreateIndex
CREATE INDEX "districts_level_idx" ON "districts"("level");

-- CreateIndex
CREATE UNIQUE INDEX "districts_id_level_key" ON "districts"("id", "level");

-- CreateIndex
CREATE INDEX "wards_province_id_idx" ON "wards"("province_id");

-- CreateIndex
CREATE INDEX "wards_district_id_idx" ON "wards"("district_id");

-- CreateIndex
CREATE INDEX "wards_level_idx" ON "wards"("level");

-- CreateIndex
CREATE UNIQUE INDEX "wards_id_province_id_level_key" ON "wards"("id", "province_id", "level");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_type_settings_id_key" ON "complaint_type_settings"("id");

-- CreateIndex
CREATE INDEX "complaint_type_settings_isActive_idx" ON "complaint_type_settings"("isActive");

-- CreateIndex
CREATE INDEX "customer_settings_type_idx" ON "customer_settings"("type");

-- CreateIndex
CREATE UNIQUE INDEX "customer_settings_id_type_key" ON "customer_settings"("id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "employee_type_settings_id_key" ON "employee_type_settings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "penalty_type_settings_id_key" ON "penalty_type_settings"("id");

-- CreateIndex
CREATE INDEX "penalty_type_settings_isActive_idx" ON "penalty_type_settings"("isActive");

-- CreateIndex
CREATE INDEX "penalty_type_settings_category_idx" ON "penalty_type_settings"("category");

-- CreateIndex
CREATE UNIQUE INDEX "pkgx_category_mappings_hrmCategoryId_key" ON "pkgx_category_mappings"("hrmCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "pkgx_category_mappings_pkgxCategoryId_key" ON "pkgx_category_mappings"("pkgxCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "pkgx_brand_mappings_hrmBrandId_key" ON "pkgx_brand_mappings"("hrmBrandId");

-- CreateIndex
CREATE UNIQUE INDEX "pkgx_brand_mappings_pkgxBrandId_key" ON "pkgx_brand_mappings"("pkgxBrandId");

-- CreateIndex
CREATE UNIQUE INDEX "pkgx_price_mappings_priceType_key" ON "pkgx_price_mappings"("priceType");

-- CreateIndex
CREATE UNIQUE INDEX "role_settings_id_key" ON "role_settings"("id");

-- CreateIndex
CREATE INDEX "role_settings_isActive_idx" ON "role_settings"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "sales_channels_id_key" ON "sales_channels"("id");

-- CreateIndex
CREATE INDEX "settings_data_type_idx" ON "settings_data"("type");

-- CreateIndex
CREATE INDEX "settings_data_isActive_idx" ON "settings_data"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "settings_data_id_type_key" ON "settings_data"("id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_partners_id_key" ON "shipping_partners"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_partners_code_key" ON "shipping_partners"("code");

-- CreateIndex
CREATE UNIQUE INDEX "taxes_id_key" ON "taxes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "units_id_key" ON "units"("id");

-- CreateIndex
CREATE INDEX "ImportExportLog_userId_type_idx" ON "ImportExportLog"("userId", "type");

-- CreateIndex
CREATE INDEX "ImportExportLog_entityType_idx" ON "ImportExportLog"("entityType");

-- CreateIndex
CREATE INDEX "ImportExportLog_performedAt_idx" ON "ImportExportLog"("performedAt" DESC);

-- CreateIndex
CREATE INDEX "idx_user_preferences_user" ON "user_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key_key" ON "user_preferences"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "active_timers_userId_key" ON "active_timers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "wiki_pages_id_key" ON "wiki_pages"("id");

-- CreateIndex
CREATE INDEX "wiki_pages_category_idx" ON "wiki_pages"("category");

-- CreateIndex
CREATE INDEX "files_status_uploadedAt_idx" ON "files"("status", "uploadedAt");

-- CreateIndex
CREATE INDEX "files_sessionId_idx" ON "files"("sessionId");

-- CreateIndex
CREATE INDEX "penalties_status_idx" ON "penalties"("status");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_group_key" ON "settings"("key", "group");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_packagingSystemId_key" ON "shipments"("packagingSystemId");

-- CreateIndex
CREATE UNIQUE INDEX "wikis_slug_key" ON "wikis"("slug");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "stock_locations"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wikis" ADD CONSTRAINT "wikis_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "employees"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "employees"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packagings" ADD CONSTRAINT "packagings_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packagings" ADD CONSTRAINT "packagings_assignedEmployeeId_fkey" FOREIGN KEY ("assignedEmployeeId") REFERENCES "employees"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_packagingSystemId_fkey" FOREIGN KEY ("packagingSystemId") REFERENCES "packagings"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranties" ADD CONSTRAINT "warranties_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranties" ADD CONSTRAINT "warranties_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranties" ADD CONSTRAINT "warranties_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "departments"("systemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pkgx_category_mappings" ADD CONSTRAINT "pkgx_category_mappings_pkgxCategoryId_fkey" FOREIGN KEY ("pkgxCategoryId") REFERENCES "pkgx_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pkgx_brand_mappings" ADD CONSTRAINT "pkgx_brand_mappings_pkgxBrandId_fkey" FOREIGN KEY ("pkgxBrandId") REFERENCES "pkgx_brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
