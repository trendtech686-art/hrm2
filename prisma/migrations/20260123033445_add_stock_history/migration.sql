-- CreateTable
CREATE TABLE "stock_history" (
    "systemId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "source" TEXT,
    "quantityChange" INTEGER NOT NULL DEFAULT 0,
    "newStockLevel" INTEGER NOT NULL DEFAULT 0,
    "documentId" TEXT,
    "documentType" TEXT,
    "employeeId" TEXT,
    "employeeName" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_history_pkey" PRIMARY KEY ("systemId")
);

-- CreateIndex
CREATE INDEX "stock_history_productId_idx" ON "stock_history"("productId");

-- CreateIndex
CREATE INDEX "stock_history_branchId_idx" ON "stock_history"("branchId");

-- CreateIndex
CREATE INDEX "stock_history_createdAt_idx" ON "stock_history"("createdAt");

-- AddForeignKey
ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("systemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;
