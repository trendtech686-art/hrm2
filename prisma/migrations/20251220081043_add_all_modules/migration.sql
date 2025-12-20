-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT', 'PENDING', 'CONFIRMED', 'RECEIVING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PurchaseReturnStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StockTransferStatus" AS ENUM ('DRAFT', 'PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InventoryCheckStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InventoryReceiptType" AS ENUM ('PURCHASE', 'TRANSFER_IN', 'RETURN', 'ADJUSTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "InventoryReceiptStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CostAdjustmentStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SalesReturnStatus" AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'PICKED', 'IN_TRANSIT', 'DELIVERING', 'DELIVERED', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PackagingStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CashAccountType" AS ENUM ('CASH', 'BANK', 'WALLET');

-- CreateEnum
CREATE TYPE "CashTransactionType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER_IN', 'TRANSFER_OUT');

-- CreateEnum
CREATE TYPE "ReceiptType" AS ENUM ('CUSTOMER_PAYMENT', 'OTHER_INCOME');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('SUPPLIER_PAYMENT', 'EMPLOYEE_PAYMENT', 'OPERATING_EXPENSE', 'OTHER_EXPENSE');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('DRAFT', 'PROCESSING', 'COMPLETED', 'PAID');

-- CreateEnum
CREATE TYPE "WarrantyStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'WAITING_PARTS', 'COMPLETED', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WarrantyPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ComplaintPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "suppliers" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "taxCode" TEXT,
    "contactPerson" TEXT,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalPurchased" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalDebt" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "branchId" TEXT,
    "employeeId" TEXT,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDate" TIMESTAMP(3),
    "receivedDate" TIMESTAMP(3),
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "paid" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "debt" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "systemId" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productSku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "receivedQty" INTEGER NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "discount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "purchase_returns" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "purchaseOrderId" TEXT,
    "branchId" TEXT,
    "employeeId" TEXT,
    "returnDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PurchaseReturnStatus" NOT NULL DEFAULT 'DRAFT',
    "reason" TEXT,
    "subtotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "purchase_returns_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "purchase_return_items" (
    "systemId" TEXT NOT NULL,
    "returnId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "total" DECIMAL(15,2) NOT NULL,
    "reason" TEXT,

    CONSTRAINT "purchase_return_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "stock_locations" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_locations_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "stock_transfers" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "fromBranchId" TEXT NOT NULL,
    "toBranchId" TEXT NOT NULL,
    "employeeId" TEXT,
    "transferDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedDate" TIMESTAMP(3),
    "status" "StockTransferStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "stock_transfers_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "stock_transfer_items" (
    "systemId" TEXT NOT NULL,
    "transferId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productSku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "receivedQty" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "stock_transfer_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "inventory_checks" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "employeeId" TEXT,
    "checkDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "InventoryCheckStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "inventory_checks_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "inventory_check_items" (
    "systemId" TEXT NOT NULL,
    "checkId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productSku" TEXT NOT NULL,
    "systemQty" INTEGER NOT NULL,
    "actualQty" INTEGER NOT NULL,
    "difference" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "inventory_check_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "inventory_receipts" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "type" "InventoryReceiptType" NOT NULL,
    "branchId" TEXT NOT NULL,
    "employeeId" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "receiptDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "InventoryReceiptStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "inventory_receipts_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "inventory_receipt_items" (
    "systemId" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productSku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(15,2) NOT NULL DEFAULT 0,

    CONSTRAINT "inventory_receipt_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "cost_adjustments" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "employeeId" TEXT,
    "adjustmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "CostAdjustmentStatus" NOT NULL DEFAULT 'DRAFT',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "cost_adjustments_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "cost_adjustment_items" (
    "systemId" TEXT NOT NULL,
    "adjustmentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "oldCost" DECIMAL(15,2) NOT NULL,
    "newCost" DECIMAL(15,2) NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "cost_adjustment_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "sales_returns" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT,
    "employeeId" TEXT,
    "branchId" TEXT,
    "returnDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SalesReturnStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "subtotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "refunded" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "sales_returns_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "sales_return_items" (
    "systemId" TEXT NOT NULL,
    "returnId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productSku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "total" DECIMAL(15,2) NOT NULL,
    "reason" TEXT,

    CONSTRAINT "sales_return_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "shipments" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "trackingCode" TEXT,
    "orderId" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "recipientName" TEXT,
    "recipientPhone" TEXT,
    "recipientAddress" TEXT,
    "shippingFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "codAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "insuranceFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "weight" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pickedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "returnedAt" TIMESTAMP(3),
    "notes" TEXT,
    "failReason" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "packagings" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "employeeId" TEXT,
    "packDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PackagingStatus" NOT NULL DEFAULT 'PENDING',
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "packedItems" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "packagings_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "packaging_items" (
    "systemId" TEXT NOT NULL,
    "packagingId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "requiredQty" INTEGER NOT NULL,
    "packedQty" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "packaging_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "cash_accounts" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CashAccountType" NOT NULL,
    "branchId" TEXT,
    "accountNumber" TEXT,
    "bankName" TEXT,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cash_accounts_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "cash_transactions" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "CashTransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "description" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "cash_transactions_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "receipts" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "type" "ReceiptType" NOT NULL,
    "customerId" TEXT,
    "branchId" TEXT NOT NULL,
    "employeeId" TEXT,
    "accountId" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "paymentMethod" TEXT,
    "receiptDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "payments" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "supplierId" TEXT,
    "employeeId" TEXT,
    "branchId" TEXT NOT NULL,
    "accountId" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "paymentMethod" TEXT,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "payrolls" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "branchId" TEXT,
    "status" "PayrollStatus" NOT NULL DEFAULT 'DRAFT',
    "totalEmployees" INTEGER NOT NULL DEFAULT 0,
    "totalGross" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalDeductions" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalNet" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "processedAt" TIMESTAMP(3),
    "processedBy" TEXT,
    "paidAt" TIMESTAMP(3),
    "paidBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "payrolls_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "payroll_items" (
    "systemId" TEXT NOT NULL,
    "payrollId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL,
    "workDays" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leaveDays" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "baseSalary" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "otPay" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "allowances" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "bonus" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "grossSalary" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "socialInsurance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "healthInsurance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "unemploymentIns" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "otherDeductions" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalDeductions" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "netSalary" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "payroll_items_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "penalties" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "penaltyTypeId" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "reason" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payrollItemId" TEXT,
    "isApplied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "penalties_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "warranties" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "productId" TEXT,
    "orderId" TEXT,
    "orderLineItemId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "productName" TEXT NOT NULL,
    "serialNumber" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "warrantyExpireDate" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "status" "WarrantyStatus" NOT NULL DEFAULT 'RECEIVED',
    "priority" "WarrantyPriority" NOT NULL DEFAULT 'MEDIUM',
    "assigneeId" TEXT,
    "branchId" TEXT,
    "diagnosis" TEXT,
    "solution" TEXT,
    "partsCost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "laborCost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "isUnderWarranty" BOOLEAN NOT NULL DEFAULT true,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "returnedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "warranties_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "complaints" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "orderId" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "customerEmail" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "ComplaintPriority" NOT NULL DEFAULT 'MEDIUM',
    "assigneeId" TEXT,
    "branchId" TEXT,
    "images" TEXT[],
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "wikis" (
    "systemId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wikis_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "settings" (
    "systemId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "id_counters" (
    "systemId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "currentValue" INTEGER NOT NULL DEFAULT 0,
    "padding" INTEGER NOT NULL DEFAULT 3,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "id_counters_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "files" (
    "systemId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "documentType" TEXT,
    "originalName" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "filesize" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,

    CONSTRAINT "files_pkey" PRIMARY KEY ("systemId")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "systemId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "userName" TEXT,
    "oldData" JSONB,
    "newData" JSONB,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("systemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_id_key" ON "suppliers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_id_key" ON "purchase_orders"("id");

-- CreateIndex
CREATE INDEX "purchase_orders_supplierId_idx" ON "purchase_orders"("supplierId");

-- CreateIndex
CREATE INDEX "purchase_orders_status_idx" ON "purchase_orders"("status");

-- CreateIndex
CREATE INDEX "purchase_orders_orderDate_idx" ON "purchase_orders"("orderDate");

-- CreateIndex
CREATE INDEX "purchase_order_items_purchaseOrderId_idx" ON "purchase_order_items"("purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_returns_id_key" ON "purchase_returns"("id");

-- CreateIndex
CREATE UNIQUE INDEX "stock_locations_id_key" ON "stock_locations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "stock_transfers_id_key" ON "stock_transfers"("id");

-- CreateIndex
CREATE INDEX "stock_transfers_fromBranchId_idx" ON "stock_transfers"("fromBranchId");

-- CreateIndex
CREATE INDEX "stock_transfers_toBranchId_idx" ON "stock_transfers"("toBranchId");

-- CreateIndex
CREATE INDEX "stock_transfers_status_idx" ON "stock_transfers"("status");

-- CreateIndex
CREATE INDEX "stock_transfer_items_transferId_idx" ON "stock_transfer_items"("transferId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_checks_id_key" ON "inventory_checks"("id");

-- CreateIndex
CREATE INDEX "inventory_checks_branchId_idx" ON "inventory_checks"("branchId");

-- CreateIndex
CREATE INDEX "inventory_checks_status_idx" ON "inventory_checks"("status");

-- CreateIndex
CREATE INDEX "inventory_check_items_checkId_idx" ON "inventory_check_items"("checkId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_receipts_id_key" ON "inventory_receipts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cost_adjustments_id_key" ON "cost_adjustments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_returns_id_key" ON "sales_returns"("id");

-- CreateIndex
CREATE INDEX "sales_returns_orderId_idx" ON "sales_returns"("orderId");

-- CreateIndex
CREATE INDEX "sales_returns_status_idx" ON "sales_returns"("status");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_id_key" ON "shipments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_trackingCode_key" ON "shipments"("trackingCode");

-- CreateIndex
CREATE INDEX "shipments_orderId_idx" ON "shipments"("orderId");

-- CreateIndex
CREATE INDEX "shipments_status_idx" ON "shipments"("status");

-- CreateIndex
CREATE INDEX "shipments_carrier_idx" ON "shipments"("carrier");

-- CreateIndex
CREATE UNIQUE INDEX "packagings_id_key" ON "packagings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "packagings_orderId_key" ON "packagings"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "cash_accounts_id_key" ON "cash_accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cash_transactions_id_key" ON "cash_transactions"("id");

-- CreateIndex
CREATE INDEX "cash_transactions_accountId_idx" ON "cash_transactions"("accountId");

-- CreateIndex
CREATE INDEX "cash_transactions_type_idx" ON "cash_transactions"("type");

-- CreateIndex
CREATE INDEX "cash_transactions_transactionDate_idx" ON "cash_transactions"("transactionDate");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_id_key" ON "receipts"("id");

-- CreateIndex
CREATE INDEX "receipts_customerId_idx" ON "receipts"("customerId");

-- CreateIndex
CREATE INDEX "receipts_type_idx" ON "receipts"("type");

-- CreateIndex
CREATE UNIQUE INDEX "payments_id_key" ON "payments"("id");

-- CreateIndex
CREATE INDEX "payments_supplierId_idx" ON "payments"("supplierId");

-- CreateIndex
CREATE INDEX "payments_type_idx" ON "payments"("type");

-- CreateIndex
CREATE UNIQUE INDEX "payrolls_id_key" ON "payrolls"("id");

-- CreateIndex
CREATE UNIQUE INDEX "payrolls_year_month_branchId_key" ON "payrolls"("year", "month", "branchId");

-- CreateIndex
CREATE INDEX "payroll_items_payrollId_idx" ON "payroll_items"("payrollId");

-- CreateIndex
CREATE INDEX "payroll_items_employeeId_idx" ON "payroll_items"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "penalties_id_key" ON "penalties"("id");

-- CreateIndex
CREATE INDEX "penalties_employeeId_idx" ON "penalties"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "warranties_id_key" ON "warranties"("id");

-- CreateIndex
CREATE INDEX "warranties_customerId_idx" ON "warranties"("customerId");

-- CreateIndex
CREATE INDEX "warranties_status_idx" ON "warranties"("status");

-- CreateIndex
CREATE UNIQUE INDEX "complaints_id_key" ON "complaints"("id");

-- CreateIndex
CREATE INDEX "complaints_customerId_idx" ON "complaints"("customerId");

-- CreateIndex
CREATE INDEX "complaints_status_idx" ON "complaints"("status");

-- CreateIndex
CREATE UNIQUE INDEX "wikis_id_key" ON "wikis"("id");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "id_counters_entityType_key" ON "id_counters"("entityType");

-- CreateIndex
CREATE INDEX "files_entityType_entityId_idx" ON "files"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_return_items" ADD CONSTRAINT "purchase_return_items_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "purchase_returns"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "stock_transfers"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_check_items" ADD CONSTRAINT "inventory_check_items_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "inventory_checks"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_receipt_items" ADD CONSTRAINT "inventory_receipt_items_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "inventory_receipts"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_adjustment_items" ADD CONSTRAINT "cost_adjustment_items_adjustmentId_fkey" FOREIGN KEY ("adjustmentId") REFERENCES "cost_adjustments"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_returns" ADD CONSTRAINT "sales_returns_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_return_items" ADD CONSTRAINT "sales_return_items_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "sales_returns"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packaging_items" ADD CONSTRAINT "packaging_items_packagingId_fkey" FOREIGN KEY ("packagingId") REFERENCES "packagings"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_transactions" ADD CONSTRAINT "cash_transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "cash_accounts"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "payrolls"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;
