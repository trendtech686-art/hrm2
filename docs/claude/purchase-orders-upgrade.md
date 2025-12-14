# Purchase-Orders Module - Phân tích nâng cấp lên Prisma/PostgreSQL

**Ngày tạo:** 29/11/2025  
**Module:** `features/purchase-orders/`  
**Độ ưu tiên:** ⭐⭐⭐⭐⭐ (Cao - Module trọng tâm quản lý mua hàng)

---

## 1. Tổng quan Module

### Mục đích
Module quản lý **đơn mua hàng từ nhà cung cấp**, bao gồm:
- Tạo và theo dõi đơn đặt hàng
- Quản lý nhập kho qua **Inventory-Receipts** (phiếu nhập kho)
- Xử lý hoàn trả qua **Purchase-Returns** (phiếu trả hàng)
- Tracking thanh toán và công nợ NCC
- Tự động cập nhật trạng thái dựa trên delivery + payment

### Vai trò trong hệ thống
- **Upstream:** Suppliers (nhà cung cấp), Products (sản phẩm), Branches (chi nhánh)
- **Downstream:** Inventory-Receipts (nhập kho), Purchase-Returns (trả hàng), Payments/Receipts (thu chi), Cashbook (sổ quỹ)
- **Related:** Employees (người tạo đơn), Settings (loại phiếu thu/chi)

---

## 2. Phân tích trạng thái hiện tại

### Cấu trúc thư mục
```
features/purchase-orders/
├── types.ts                    # 6 enum types, PurchaseOrder, LineItem, Payment
├── store.ts                    # 492 dòng - logic tự động sync statuses
├── payment-utils.ts            # Link payments/receipts với PO
├── data.ts                     # Mock data
├── columns.tsx                 # DataTable columns
├── page.tsx                    # Danh sách PO
├── form-page.tsx               # Tạo/sửa PO
├── detail-page.tsx             # Chi tiết PO + history
├── purchase-order-card.tsx     # Card component
└── components/
    ├── bulk-product-selector-dialog.tsx
    ├── employee-combobox.tsx
    ├── order-info-card.tsx
    ├── order-notes-card.tsx
    ├── order-summary-card.tsx
    ├── price-selector.tsx
    ├── product-combobox-virtual.tsx
    ├── product-selection-card.tsx
    ├── supplier-combobox.tsx
    ├── supplier-selection-card.tsx
    └── tax-selector.tsx
```

### Types hiện tại
```typescript
// 6 Status Types (Multi-status tracking)
PurchaseOrderStatus: "Đặt hàng" | "Đang giao dịch" | "Hoàn thành" | "Đã hủy" | "Kết thúc" | "Đã trả hàng"
DeliveryStatus: "Chưa nhập" | "Đã nhập một phần" | "Đã nhập"
PaymentStatus: "Chưa thanh toán" | "Thanh toán một phần" | "Đã thanh toán"
PurchaseOrderReturnStatus: "Chưa hoàn trả" | "Hoàn hàng một phần" | "Hoàn hàng toàn bộ"
PurchaseOrderRefundStatus: "Chưa hoàn tiền" | "Hoàn tiền một phần" | "Hoàn tiền toàn bộ"

// Core Entity
PurchaseOrder {
  systemId: string;
  id: string; // PO001, PO002...
  supplierSystemId: string;
  supplierName: string;
  branchSystemId: string;
  branchName: string;
  orderDate: string; // YYYY-MM-DD
  deliveryDate?: string; // YYYY-MM-DD HH:mm (tự động set khi nhập kho lần đầu)
  buyerSystemId: string; // Người mua hàng
  buyer: string;
  creatorSystemId: string;
  creatorName: string;
  status: PurchaseOrderStatus; // Trạng thái chính
  deliveryStatus: DeliveryStatus; // Trạng thái giao hàng
  paymentStatus: PaymentStatus; // Trạng thái thanh toán
  returnStatus?: PurchaseOrderReturnStatus;
  refundStatus?: PurchaseOrderRefundStatus;
  lineItems: PurchaseOrderLineItem[];
  subtotal: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  shippingFee: number;
  tax: number;
  grandTotal: number;
  payments: PurchaseOrderPayment[]; // DEPRECATED - nên dùng Payments module
  inventoryReceiptIds?: string[];
  notes?: string;
  reference?: string;
  activityHistory?: HistoryEntry[];
}

PurchaseOrderLineItem {
  productSystemId: string;
  productId: string; // SKU
  productName: string;
  sku?: string;
  unit?: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number; // Giá mua vào
  discount: number;
  discountType: 'percentage' | 'fixed';
  taxRate: number; // VAT rate (8 for 8%)
  note?: string;
}

PurchaseOrderPayment {
  systemId: string;
  id: string;
  method: string;
  amount: number;
  paymentDate: string; // ISO string
  reference?: string;
  payerName: string;
}
```

### Store methods hiện tại
```typescript
// Base CRUD (từ createCrudStore)
- add, addMultiple, update, remove, findById

// Custom methods
- addPayment(purchaseOrderId, payment) // DEPRECATED
- updatePaymentStatusForPoIds(poIds[]) // Sync payment status từ Payments module
- processInventoryReceipt(poSystemId) // Update deliveryStatus khi có phiếu nhập kho
- processReturn(poId, isFullReturn, refundStatus, returnId, creator) // Update returnStatus
- syncAllPurchaseOrderStatuses() // Sync tất cả PO statuses
- finishOrder(systemId, userId, userName) // Kết thúc đơn
- cancelOrder(systemId, userId, userName) // Hủy đơn + tạo phiếu thu hoàn tiền
- bulkCancel(systemIds[], userId, userName)
- printPurchaseOrders(systemIds[]) // TODO
```

---

## 3. Business Logic quan trọng

### 3.1. Auto Status Calculation Logic
**Trạng thái chính (status) được tính tự động dựa trên deliveryStatus + paymentStatus:**

```
IF status = "Đã hủy" OR "Kết thúc" => Không tự động update
ELSE:
  IF deliveryStatus = "Đã nhập" AND paymentStatus = "Đã thanh toán"
    => status = "Hoàn thành"
  
  ELSE IF deliveryStatus = "Chưa nhập" AND paymentStatus = "Chưa thanh toán"
    => status = "Đặt hàng"
  
  ELSE => status = "Đang giao dịch"
```

### 3.2. Delivery Status Calculation
**Tính toán từ Inventory-Receipts:**

```javascript
// Từ store.processInventoryReceipt()
totalReceivedByProduct = {}
foreach lineItem {
  totalReceived = sum(inventoryReceipts.items[productSystemId].receivedQuantity)
  totalReceivedByProduct[productSystemId] = totalReceived
}

IF all items: totalReceived >= orderedQuantity
  => deliveryStatus = "Đã nhập"
ELSE IF any item: totalReceived > 0
  => deliveryStatus = "Đã nhập một phần"
ELSE
  => deliveryStatus = "Chưa nhập"

// Auto-set deliveryDate khi nhập kho lần đầu
IF old deliveryStatus = "Chưa nhập" AND new != "Chưa nhập"
  => deliveryDate = latestReceipt.receivedDate
```

### 3.3. Payment Status Calculation
**Tính toán từ Payments module:**

```javascript
// Từ payment-utils.ts
totalPaid = sum(allPayments where isPaymentLinkedToPurchaseOrder())

// Trừ đi giá trị hàng đã trả
totalReturnedValue = sum(allReturns where purchaseOrderSystemId === poSystemId)
actualDebt = po.grandTotal - totalReturnedValue

IF totalPaid >= actualDebt
  => paymentStatus = "Đã thanh toán"
ELSE IF totalPaid > 0
  => paymentStatus = "Thanh toán một phần"
ELSE
  => paymentStatus = "Chưa thanh toán"
```

### 3.4. Payment Linking Logic
**Liên kết thanh toán với PO qua nhiều cách:**

```javascript
// payment-utils.ts: isPaymentLinkedToPurchaseOrder()
1. payment.purchaseOrderSystemId === po.systemId (Direct link)
2. payment.originalDocumentId === po.systemId || po.id (Legacy)
3. payment.recipientTypeSystemId IN ['NHACUNGCAP', 'supplier'] 
   AND payment.recipientSystemId === po.supplierSystemId (Indirect via supplier)
```

### 3.5. Cancel Order with Refund
**Khi hủy đơn đã thanh toán:**

```javascript
// store.cancelOrder()
IF totalPaid > 0 {
  // Tạo phiếu thu (Receipt) hoàn tiền từ NCC
  Receipt {
    id: "PT-XXXXXX" (auto-generated)
    payerType: "Nhà cung cấp"
    payerSystemId: po.supplierSystemId
    amount: totalPaid
    description: "Nhận hoàn tiền từ NCC cho đơn hàng {po.id} bị hủy"
    paymentMethod: "Tiền mặt"
    accountSystemId: cashAccount (branch's cash account)
    paymentReceiptTypeSystemId: "Nhà cung cấp hoàn tiền" category
    purchaseOrderSystemId: po.systemId
    affectsDebt: true
  }
}
status = "Đã hủy"
```

### 3.6. Return Handling
**Xử lý hoàn trả hàng:**

```javascript
// store.processReturn()
IF isFullReturn
  => returnStatus = "Hoàn hàng toàn bộ"
ELSE
  => returnStatus = "Hoàn hàng một phần"

// QUAN TRỌNG: Không đè status chính, chỉ update returnStatus
// Auto-status logic sẽ tự tính lại dựa trên actualDebt (đã trừ returnValue)
```

### 3.7. Inventory Receipt Backfill
**Đồng bộ tự động khi khởi tạo:**

```javascript
// store.ts: runInventoryReceiptBackfill()
// Chạy khi:
// 1. Store khởi tạo lần đầu
// 2. Purchase-orders store update
// 3. Products store update

syncInventoryReceiptsWithPurchaseOrders({
  purchaseOrders: all POs,
  products: all Products
})
// => Tạo/sync inventory-receipts từ PO data
```

---

## 4. Module Links (Dependencies)

### Upstream Dependencies
```
Suppliers → supplierSystemId, supplierName
Products → lineItems[].productSystemId, productName, SKU
Branches → branchSystemId, branchName
Employees → buyerSystemId, creatorSystemId, buyer, creatorName
```

### Downstream Dependencies
```
Inventory-Receipts → purchaseOrderSystemId (phiếu nhập kho)
  - Trigger: processInventoryReceipt() update deliveryStatus
  - Auto-set: deliveryDate

Purchase-Returns → purchaseOrderSystemId (phiếu trả hàng)
  - Trigger: processReturn() update returnStatus
  - Impact: actualDebt = grandTotal - totalReturnedValue

Payments → purchaseOrderSystemId, supplierSystemId (chi tiền cho NCC)
  - Trigger: updatePaymentStatusForPoIds() update paymentStatus
  - Link via: recipientSystemId + recipientType = "Nhà cung cấp"

Receipts → purchaseOrderSystemId (thu tiền hoàn từ NCC)
  - Created by: cancelOrder() khi totalPaid > 0
  - payerType = "Nhà cung cấp"

Cashbook → Auto-create entries via Payments/Receipts
```

### Settings Dependencies
```
Receipt-Types → "Nhà cung cấp hoàn tiền" category (cho refund)
Payment-Types → paymentMethod options
```

---

## 5. Prisma Schema đề xuất

```prisma
// ============================================================
// PURCHASE ORDERS - Đơn mua hàng
// ============================================================

enum PurchaseOrderStatus {
  DAT_HANG           // "Đặt hàng"
  DANG_GIAO_DICH     // "Đang giao dịch"
  HOAN_THANH         // "Hoàn thành"
  DA_HUY             // "Đã hủy"
  KET_THUC           // "Kết thúc"
  DA_TRA_HANG        // "Đã trả hàng" (DEPRECATED - dùng returnStatus thay thế)
}

enum DeliveryStatus {
  CHUA_NHAP          // "Chưa nhập"
  DA_NHAP_MOT_PHAN   // "Đã nhập một phần"
  DA_NHAP            // "Đã nhập"
}

enum PaymentStatus {
  CHUA_THANH_TOAN        // "Chưa thanh toán"
  THANH_TOAN_MOT_PHAN    // "Thanh toán một phần"
  DA_THANH_TOAN          // "Đã thanh toán"
}

enum PurchaseReturnStatus {
  CHUA_HOAN_TRA       // "Chưa hoàn trả"
  HOAN_HANG_MOT_PHAN  // "Hoàn hàng một phần"
  HOAN_HANG_TOAN_BO   // "Hoàn hàng toàn bộ"
}

enum PurchaseRefundStatus {
  CHUA_HOAN_TIEN      // "Chưa hoàn tiền"
  HOAN_TIEN_MOT_PHAN  // "Hoàn tiền một phần"
  HOAN_TIEN_TOAN_BO   // "Hoàn tiền toàn bộ"
}

model PurchaseOrder {
  id                String   @id @default(cuid()) // systemId
  businessId        String   @unique // PO001, PO002...
  
  // Relations
  supplierId        String
  supplier          Supplier @relation(fields: [supplierId], references: [id], onDelete: Restrict)
  branchId          String
  branch            Branch   @relation(fields: [branchId], references: [id], onDelete: Restrict)
  buyerId           String   // Người mua hàng
  buyer             Employee @relation("PurchaseOrderBuyer", fields: [buyerId], references: [id], onDelete: Restrict)
  creatorId         String
  creator           Employee @relation("PurchaseOrderCreator", fields: [creatorId], references: [id], onDelete: Restrict)
  
  // Dates
  orderDate         DateTime @db.Date
  deliveryDate      DateTime? // Auto-set khi nhập kho lần đầu
  
  // Status tracking (4 parallel statuses)
  status            PurchaseOrderStatus   @default(DAT_HANG)
  deliveryStatus    DeliveryStatus        @default(CHUA_NHAP)
  paymentStatus     PaymentStatus         @default(CHUA_THANH_TOAN)
  returnStatus      PurchaseReturnStatus? // Optional
  refundStatus      PurchaseRefundStatus? // Optional
  
  // Line items
  lineItems         PurchaseOrderLineItem[]
  
  // Financial summary
  subtotal          Decimal  @db.Decimal(15, 2)
  discount          Decimal? @db.Decimal(15, 2)
  discountType      DiscountType?
  shippingFee       Decimal  @db.Decimal(15, 2) @default(0)
  tax               Decimal  @db.Decimal(15, 2) @default(0)
  grandTotal        Decimal  @db.Decimal(15, 2)
  
  // Additional info
  notes             String?  @db.Text
  reference         String?  // Số chứng từ tham chiếu
  
  // Related documents
  inventoryReceipts InventoryReceipt[]
  purchaseReturns   PurchaseReturn[]
  payments          Payment[]  @relation("PurchaseOrderPayments")
  receipts          Receipt[]  @relation("PurchaseOrderReceipts")
  
  // Activity history (JSON)
  activityHistory   Json?    // HistoryEntry[]
  
  // Audit trail
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  createdBy         String?
  updatedBy         String?
  deletedAt         DateTime? // Soft delete
  
  @@index([supplierId])
  @@index([branchId])
  @@index([buyerId])
  @@index([orderDate])
  @@index([status])
  @@index([deliveryStatus])
  @@index([paymentStatus])
  @@map("purchase_orders")
}

model PurchaseOrderLineItem {
  id                String   @id @default(cuid())
  
  purchaseOrderId   String
  purchaseOrder     PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
  
  productId         String
  product           Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  
  // Snapshot fields (cho báo cáo)
  productBusinessId String   // SKU
  productName       String
  sku               String?
  unit              String?
  imageUrl          String?
  
  // Quantities & pricing
  quantity          Decimal  @db.Decimal(15, 3)
  unitPrice         Decimal  @db.Decimal(15, 2) // Giá mua vào
  discount          Decimal  @db.Decimal(15, 2) @default(0)
  discountType      DiscountType @default(FIXED)
  taxRate           Decimal  @db.Decimal(5, 2) @default(0) // VAT rate (8 for 8%)
  
  note              String?  @db.Text
  
  @@index([purchaseOrderId])
  @@index([productId])
  @@map("purchase_order_line_items")
}

// ============================================================
// INVENTORY RECEIPTS - Phiếu nhập kho
// ============================================================

model InventoryReceipt {
  id                    String   @id @default(cuid())
  businessId            String   @unique // PNK001, PNK002...
  
  purchaseOrderId       String
  purchaseOrder         PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Restrict)
  
  supplierId            String
  supplier              Supplier @relation(fields: [supplierId], references: [id], onDelete: Restrict)
  
  branchId              String?
  branch                Branch?  @relation(fields: [branchId], references: [id], onDelete: SetNull)
  
  receiverId            String
  receiver              Employee @relation(fields: [receiverId], references: [id], onDelete: Restrict)
  
  receivedDate          DateTime
  warehouseName         String?
  notes                 String?  @db.Text
  
  items                 InventoryReceiptLineItem[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  createdBy             String?
  updatedBy             String?
  deletedAt             DateTime?
  
  @@index([purchaseOrderId])
  @@index([supplierId])
  @@index([receivedDate])
  @@map("inventory_receipts")
}

model InventoryReceiptLineItem {
  id                String   @id @default(cuid())
  
  inventoryReceiptId String
  inventoryReceipt  InventoryReceipt @relation(fields: [inventoryReceiptId], references: [id], onDelete: Cascade)
  
  productId         String
  product           Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  
  productBusinessId String
  productName       String
  
  orderedQuantity   Decimal  @db.Decimal(15, 3) // Số lượng đặt
  receivedQuantity  Decimal  @db.Decimal(15, 3) // Số lượng thực nhận
  unitPrice         Decimal  @db.Decimal(15, 2)
  
  @@index([inventoryReceiptId])
  @@index([productId])
  @@map("inventory_receipt_line_items")
}

// ============================================================
// PURCHASE RETURNS - Phiếu trả hàng cho NCC
// ============================================================

model PurchaseReturn {
  id                    String   @id @default(cuid())
  businessId            String   @unique // TH000001, TH000002...
  
  purchaseOrderId       String
  purchaseOrder         PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Restrict)
  
  supplierId            String
  supplier              Supplier @relation(fields: [supplierId], references: [id], onDelete: Restrict)
  
  branchId              String
  branch                Branch   @relation(fields: [branchId], references: [id], onDelete: Restrict)
  
  returnDate            DateTime @db.Date
  reason                String?  @db.Text // Lý do hoàn trả chung
  
  items                 PurchaseReturnLineItem[]
  
  totalReturnValue      Decimal  @db.Decimal(15, 2) // Tổng giá trị hàng trả
  refundAmount          Decimal  @db.Decimal(15, 2) @default(0) // Số tiền nhận lại
  refundMethod          String   // "Tiền mặt" | "Chuyển khoản"
  
  accountId             String?  // Tài khoản nhận tiền hoàn (nếu có)
  account               CashbookAccount? @relation(fields: [accountId], references: [id], onDelete: SetNull)
  
  creatorName           String   // Snapshot
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  createdBy             String?
  updatedBy             String?
  deletedAt             DateTime?
  
  @@index([purchaseOrderId])
  @@index([supplierId])
  @@index([returnDate])
  @@map("purchase_returns")
}

model PurchaseReturnLineItem {
  id                String   @id @default(cuid())
  
  purchaseReturnId  String
  purchaseReturn    PurchaseReturn @relation(fields: [purchaseReturnId], references: [id], onDelete: Cascade)
  
  productId         String
  product           Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  
  productBusinessId String
  productName       String
  
  orderedQuantity   Decimal  @db.Decimal(15, 3)
  returnQuantity    Decimal  @db.Decimal(15, 3)
  unitPrice         Decimal  @db.Decimal(15, 2)
  
  note              String?  @db.Text
  
  @@index([purchaseReturnId])
  @@index([productId])
  @@map("purchase_return_line_items")
}
```

---

## 6. API Routes đề xuất

### 6.1. Purchase Orders CRUD
```typescript
// GET /api/purchase-orders
GET /api/purchase-orders?
  supplierId={id}&
  branchId={id}&
  status={enum}&
  deliveryStatus={enum}&
  paymentStatus={enum}&
  startDate={YYYY-MM-DD}&
  endDate={YYYY-MM-DD}&
  search={keyword}&
  page={number}&
  limit={number}

Response: {
  data: PurchaseOrder[]
  meta: { total, page, limit, totalPages }
}

// GET /api/purchase-orders/:id
Response: PurchaseOrder & {
  supplier: Supplier
  branch: Branch
  buyer: Employee
  lineItems: (PurchaseOrderLineItem & { product: Product })[]
  inventoryReceipts: InventoryReceipt[]
  purchaseReturns: PurchaseReturn[]
  totalPaid: number
  totalReturned: number
  actualDebt: number
}

// POST /api/purchase-orders
Body: {
  supplierId: string
  branchId: string
  buyerId: string
  orderDate: string
  lineItems: {
    productId: string
    quantity: number
    unitPrice: number
    discount: number
    discountType: 'percentage' | 'fixed'
    taxRate: number
    note?: string
  }[]
  discount?: number
  discountType?: 'percentage' | 'fixed'
  shippingFee?: number
  notes?: string
  reference?: string
}

// PATCH /api/purchase-orders/:id
Body: Partial<PurchaseOrder>

// DELETE /api/purchase-orders/:id (soft delete)
```

### 6.2. Status Actions
```typescript
// POST /api/purchase-orders/:id/cancel
// Hủy đơn + tạo phiếu thu hoàn tiền (nếu đã thanh toán)
Body: {
  userId: string
  userName: string
}
Response: { success, receipt?: Receipt }

// POST /api/purchase-orders/:id/finish
// Kết thúc đơn (terminal state)
Body: {
  userId: string
  userName: string
}

// POST /api/purchase-orders/:id/reopen
// Mở lại đơn đã kết thúc (nếu cần)
```

### 6.3. Inventory Receipts Integration
```typescript
// POST /api/purchase-orders/:id/inventory-receipts
// Tạo phiếu nhập kho
Body: {
  receiverId: string
  receivedDate: string
  warehouseName?: string
  notes?: string
  items: {
    productId: string
    orderedQuantity: number
    receivedQuantity: number // <= orderedQuantity
  }[]
}
Response: InventoryReceipt
// Side effect: Update PO deliveryStatus, deliveryDate

// GET /api/purchase-orders/:id/inventory-receipts
Response: InventoryReceipt[]
```

### 6.4. Purchase Returns Integration
```typescript
// POST /api/purchase-orders/:id/purchase-returns
// Tạo phiếu trả hàng
Body: {
  returnDate: string
  reason?: string
  items: {
    productId: string
    returnQuantity: number
  }[]
  refundAmount: number
  refundMethod: string
  accountId?: string
}
Response: PurchaseReturn
// Side effect: Update PO returnStatus, refundStatus

// GET /api/purchase-orders/:id/purchase-returns
Response: PurchaseReturn[]
```

### 6.5. Payment Integration
```typescript
// POST /api/purchase-orders/:id/payments
// Ghi nhận thanh toán cho đơn
Body: {
  amount: number
  paymentDate: string
  method: string
  reference?: string
  accountId: string
}
Response: Payment
// Side effect: Update PO paymentStatus via webhook

// GET /api/purchase-orders/:id/payments
Response: Payment[]

// GET /api/purchase-orders/:id/financial-summary
Response: {
  grandTotal: number
  totalPaid: number
  totalReturned: number
  actualDebt: number
  paymentStatus: PaymentStatus
}
```

### 6.6. Sync Operations
```typescript
// POST /api/purchase-orders/sync-statuses
// Sync tất cả PO statuses (batch operation)
Body: {
  purchaseOrderIds?: string[] // Nếu empty => sync all
}
Response: { updated: number }

// POST /api/purchase-orders/:id/recalculate
// Tính lại tất cả statuses cho 1 PO
Response: PurchaseOrder
```

### 6.7. Bulk Operations
```typescript
// POST /api/purchase-orders/bulk-cancel
Body: {
  purchaseOrderIds: string[]
  userId: string
  userName: string
}
Response: { success: number, failed: number }

// POST /api/purchase-orders/bulk-print
Body: {
  purchaseOrderIds: string[]
}
Response: { pdfUrl: string }
```

---

## 7. React Query Hooks đề xuất

```typescript
// ============================================================
// queries/usePurchaseOrders.ts
// ============================================================

// List với filters
export const usePurchaseOrders = (params?: {
  supplierId?: string;
  branchId?: string;
  status?: PurchaseOrderStatus;
  deliveryStatus?: DeliveryStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['purchase-orders', params],
    queryFn: () => api.getPurchaseOrders(params),
  });
};

// Chi tiết PO với full relations
export const usePurchaseOrder = (id: string) => {
  return useQuery({
    queryKey: ['purchase-orders', id],
    queryFn: () => api.getPurchaseOrder(id),
    enabled: !!id,
  });
};

// Financial summary
export const usePurchaseOrderFinancials = (id: string) => {
  return useQuery({
    queryKey: ['purchase-orders', id, 'financials'],
    queryFn: () => api.getPurchaseOrderFinancials(id),
    enabled: !!id,
  });
};

// Inventory receipts của PO
export const usePurchaseOrderInventoryReceipts = (id: string) => {
  return useQuery({
    queryKey: ['purchase-orders', id, 'inventory-receipts'],
    queryFn: () => api.getPurchaseOrderInventoryReceipts(id),
    enabled: !!id,
  });
};

// Purchase returns của PO
export const usePurchaseOrderReturns = (id: string) => {
  return useQuery({
    queryKey: ['purchase-orders', id, 'returns'],
    queryFn: () => api.getPurchaseOrderReturns(id),
    enabled: !!id,
  });
};

// Payments của PO
export const usePurchaseOrderPayments = (id: string) => {
  return useQuery({
    queryKey: ['purchase-orders', id, 'payments'],
    queryFn: () => api.getPurchaseOrderPayments(id),
    enabled: !!id,
  });
};

// ============================================================
// mutations/usePurchaseOrderMutations.ts
// ============================================================

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePurchaseOrderDto) => 
      api.createPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success('Tạo đơn mua hàng thành công');
    },
  });
};

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseOrderDto }) =>
      api.updatePurchaseOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', id] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success('Cập nhật đơn mua hàng thành công');
    },
  });
};

export const useCancelPurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId, userName }: { 
      id: string; 
      userId: string; 
      userName: string;
    }) => api.cancelPurchaseOrder(id, userId, userName),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', id] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] }); // Có thể tạo phiếu thu
      toast.success('Hủy đơn mua hàng thành công');
    },
  });
};

export const useFinishPurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId, userName }: { 
      id: string; 
      userId: string; 
      userName: string;
    }) => api.finishPurchaseOrder(id, userId, userName),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', id] });
      toast.success('Kết thúc đơn mua hàng thành công');
    },
  });
};

export const useCreateInventoryReceipt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      purchaseOrderId, 
      data 
    }: { 
      purchaseOrderId: string; 
      data: CreateInventoryReceiptDto;
    }) => api.createInventoryReceipt(purchaseOrderId, data),
    onSuccess: (_, { purchaseOrderId }) => {
      queryClient.invalidateQueries({ 
        queryKey: ['purchase-orders', purchaseOrderId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['purchase-orders', purchaseOrderId, 'inventory-receipts'] 
      });
      queryClient.invalidateQueries({ queryKey: ['inventory-receipts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Update stock
      toast.success('Tạo phiếu nhập kho thành công');
    },
  });
};

export const useCreatePurchaseReturn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      purchaseOrderId, 
      data 
    }: { 
      purchaseOrderId: string; 
      data: CreatePurchaseReturnDto;
    }) => api.createPurchaseReturn(purchaseOrderId, data),
    onSuccess: (_, { purchaseOrderId }) => {
      queryClient.invalidateQueries({ 
        queryKey: ['purchase-orders', purchaseOrderId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['purchase-orders', purchaseOrderId, 'returns'] 
      });
      queryClient.invalidateQueries({ queryKey: ['purchase-returns'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Update stock
      toast.success('Tạo phiếu trả hàng thành công');
    },
  });
};

export const useRecalculatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.recalculatePurchaseOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', id] });
      toast.success('Đã tính lại trạng thái đơn hàng');
    },
  });
};

export const useBulkCancelPurchaseOrders = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      ids, 
      userId, 
      userName 
    }: { 
      ids: string[]; 
      userId: string; 
      userName: string;
    }) => api.bulkCancelPurchaseOrders(ids, userId, userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success('Hủy các đơn mua hàng thành công');
    },
  });
};
```

---

## 8. UI Components cần nâng cấp

### 8.1. Danh sách Purchase Orders
**File:** `page.tsx`

```typescript
// Hiện tại: Zustand store
const { data: purchaseOrders } = usePurchaseOrderStore();

// Nâng cấp: React Query với filters
const { data, isLoading } = usePurchaseOrders({
  supplierId: selectedSupplier,
  branchId: selectedBranch,
  status: statusFilter,
  deliveryStatus: deliveryFilter,
  paymentStatus: paymentFilter,
  startDate,
  endDate,
  search,
  page,
  limit: 20,
});

// Features cần giữ:
// - Multi-select với bulk actions (cancel, print)
// - Filters: supplier, branch, status, dates
// - Search: po.id, supplierName
// - DataTable với columns: id, supplier, orderDate, grandTotal, status badges
// - Status badges với color coding
```

### 8.2. Form tạo/sửa PO
**File:** `form-page.tsx`

```typescript
// Components cần tái sử dụng:
<SupplierCombobox /> // Select supplier
<ProductComboboxVirtual /> // Select products với virtualization
<BulkProductSelectorDialog /> // Chọn nhiều sản phẩm cùng lúc
<PriceSelector /> // Input unit price
<TaxSelector /> // Select VAT rate
<OrderSummaryCard /> // Tổng tiền, discount, shipping, tax

// React Query integration:
const createMutation = useCreatePurchaseOrder();
const updateMutation = useUpdatePurchaseOrder();

// Auto-calculate logic (giữ nguyên):
- Subtotal = sum(lineItems: quantity * unitPrice * (1 - discount))
- Tax = sum(lineItems: quantity * unitPrice * taxRate / 100)
- GrandTotal = subtotal - orderDiscount + shippingFee + tax
```

### 8.3. Chi tiết PO
**File:** `detail-page.tsx`

```typescript
// React Query:
const { data: po } = usePurchaseOrder(id);
const { data: financials } = usePurchaseOrderFinancials(id);
const { data: inventoryReceipts } = usePurchaseOrderInventoryReceipts(id);
const { data: returns } = usePurchaseOrderReturns(id);
const { data: payments } = usePurchaseOrderPayments(id);

// Components:
<OrderInfoCard /> // Thông tin chung: supplier, branch, dates
<OrderNotesCard /> // Ghi chú
<LineItemsTable /> // Bảng sản phẩm với progress (received/ordered)
<FinancialSummary /> // Grand total, total paid, debt
<StatusTimeline /> // Timeline 4 statuses
<InventoryReceiptsSection /> // Danh sách phiếu nhập kho
<PurchaseReturnsSection /> // Danh sách phiếu trả hàng
<PaymentsSection /> // Danh sách thanh toán
<ActivityHistory /> // Lịch sử thay đổi

// Actions:
- Tạo phiếu nhập kho (nếu deliveryStatus != "Đã nhập")
- Tạo phiếu trả hàng (nếu có inventory receipt)
- Ghi nhận thanh toán
- Hủy đơn (nếu status != terminal)
- Kết thúc đơn
- In đơn
```

### 8.4. Status Badges
**Tái sử dụng từ Orders module:**

```typescript
// PurchaseOrderStatus
<Badge variant="secondary">Đặt hàng</Badge>
<Badge variant="default">Đang giao dịch</Badge>
<Badge variant="success">Hoàn thành</Badge>
<Badge variant="destructive">Đã hủy</Badge>
<Badge variant="outline">Kết thúc</Badge>

// DeliveryStatus
<Badge variant="outline">Chưa nhập</Badge>
<Badge variant="warning">Đã nhập một phần</Badge>
<Badge variant="success">Đã nhập</Badge>

// PaymentStatus
<Badge variant="destructive">Chưa thanh toán</Badge>
<Badge variant="warning">Thanh toán một phần</Badge>
<Badge variant="success">Đã thanh toán</Badge>

// ReturnStatus
<Badge variant="outline">Chưa hoàn trả</Badge>
<Badge variant="warning">Hoàn hàng một phần</Badge>
<Badge variant="default">Hoàn hàng toàn bộ</Badge>
```

### 8.5. Inventory Receipt Dialog
**Component mới:**

```typescript
<CreateInventoryReceiptDialog
  purchaseOrder={po}
  onSuccess={() => {
    // Invalidate queries
  }}
/>

// Form fields:
- receiverId: Select employee
- receivedDate: DateTime picker
- warehouseName: Input (optional)
- items: Table với:
  - Product name (readonly)
  - Ordered quantity (readonly)
  - Already received (readonly)
  - Received quantity (input, max = ordered - alreadyReceived)
- notes: Textarea

// Validation:
- receivedQuantity <= (orderedQuantity - alreadyReceived)
- At least 1 item with receivedQuantity > 0
```

### 8.6. Purchase Return Dialog
**Component mới:**

```typescript
<CreatePurchaseReturnDialog
  purchaseOrder={po}
  onSuccess={() => {
    // Invalidate queries
  }}
/>

// Form fields:
- returnDate: Date picker
- reason: Textarea (lý do chung)
- items: Table với:
  - Product name (checkbox select)
  - Total received (readonly)
  - Already returned (readonly)
  - Return quantity (input, max = received - returned)
  - Note (input, lý do cụ thể)
- refundAmount: Number input
- refundMethod: Select ["Tiền mặt", "Chuyển khoản"]
- accountId: Select cash account (nếu refund > 0)

// Validation:
- returnQuantity <= (totalReceived - alreadyReturned)
- refundAmount <= totalReturnValue
```

---

## 9. Implementation Plan (Các bước triển khai)

### Phase 1: Database Setup
1. ✅ Tạo Prisma schema cho PurchaseOrder, PurchaseOrderLineItem
2. ✅ Tạo schema cho InventoryReceipt, InventoryReceiptLineItem
3. ✅ Tạo schema cho PurchaseReturn, PurchaseReturnLineItem
4. ✅ Add relations với Supplier, Product, Branch, Employee
5. ✅ Generate migration
6. 🔄 Chạy migration

### Phase 2: Data Migration
1. ✅ Script migrate purchase-orders data từ localStorage
2. ✅ Migrate inventory-receipts data
3. ✅ Migrate purchase-returns data
4. ✅ Verify data integrity:
   - Check all foreign keys valid
   - Check status consistency
   - Check financial calculations

### Phase 3: API Routes (Priority Order)
1. **Purchase Orders CRUD** (Core)
   - GET /api/purchase-orders (list với filters)
   - GET /api/purchase-orders/:id (detail)
   - POST /api/purchase-orders (create)
   - PATCH /api/purchase-orders/:id (update)
   - DELETE /api/purchase-orders/:id (soft delete)

2. **Status Actions**
   - POST /api/purchase-orders/:id/cancel
   - POST /api/purchase-orders/:id/finish
   - POST /api/purchase-orders/:id/recalculate

3. **Inventory Receipts Integration**
   - POST /api/purchase-orders/:id/inventory-receipts
   - GET /api/purchase-orders/:id/inventory-receipts

4. **Purchase Returns Integration**
   - POST /api/purchase-orders/:id/purchase-returns
   - GET /api/purchase-orders/:id/purchase-returns

5. **Financial Endpoints**
   - GET /api/purchase-orders/:id/financial-summary
   - GET /api/purchase-orders/:id/payments

6. **Bulk Operations**
   - POST /api/purchase-orders/bulk-cancel
   - POST /api/purchase-orders/sync-statuses

### Phase 4: React Query Setup
1. ✅ Create queries/usePurchaseOrders.ts
2. ✅ Create mutations/usePurchaseOrderMutations.ts
3. ✅ Setup query keys structure
4. ✅ Add optimistic updates cho mutations

### Phase 5: UI Migration (Component-by-component)
1. **Danh sách PO** (page.tsx)
   - Replace Zustand với usePurchaseOrders()
   - Keep DataTable, filters, bulk actions
   - Add loading states

2. **Form tạo/sửa** (form-page.tsx)
   - Replace store.add/update với mutations
   - Keep calculation logic
   - Add validation feedback

3. **Chi tiết PO** (detail-page.tsx)
   - Replace store.findById với usePurchaseOrder()
   - Add InventoryReceiptsSection
   - Add PurchaseReturnsSection
   - Add PaymentsSection
   - Implement CreateInventoryReceiptDialog
   - Implement CreatePurchaseReturnDialog

4. **Reusable Components**
   - SupplierCombobox (fetch từ API)
   - ProductComboboxVirtual (fetch từ API)
   - EmployeeCombobox (fetch từ API)
   - Keep existing logic

### Phase 6: Business Logic Implementation
1. **Auto Status Calculation**
   - Implement webhook/observer pattern
   - Trigger recalculate khi:
     - Inventory receipt created/updated/deleted
     - Purchase return created/updated/deleted
     - Payment created/updated/deleted
   - Batch update statuses daily (cron job)

2. **Payment Linking Logic**
   - Implement isPaymentLinkedToPurchaseOrder() server-side
   - Auto-link payments when created
   - Update PO paymentStatus real-time

3. **Cancel Order with Refund**
   - Transaction: Cancel PO + Create Receipt
   - Validate: Cannot cancel if terminal status
   - Create activity history entry

4. **Inventory Integration**
   - Update Product stock khi inventory receipt created
   - Revert stock khi purchase return created
   - Handle multi-branch inventory correctly

### Phase 7: Testing
1. ✅ Unit tests cho API routes
2. ✅ Integration tests cho business logic:
   - Status auto-calculation
   - Payment linking
   - Cancel with refund flow
   - Inventory receipt → delivery status update
   - Purchase return → return status update
3. ✅ E2E tests cho critical flows:
   - Create PO → Receive goods → Pay → Complete
   - Create PO → Receive partial → Return → Refund
   - Create PO → Cancel with refund

### Phase 8: Performance Optimization
1. ✅ Add database indexes:
   - supplierId, branchId, status, dates
   - Composite index: (branchId, orderDate DESC)
2. ✅ Optimize queries:
   - Use `include` carefully
   - Add pagination
   - Cache frequently accessed data
3. ✅ Background jobs:
   - Daily status sync job
   - Monthly financial reconciliation

---

## 10. Checklist Migration

### Database & Schema
- [ ] Tạo Prisma models: PurchaseOrder, PurchaseOrderLineItem
- [ ] Tạo models: InventoryReceipt, InventoryReceiptLineItem
- [ ] Tạo models: PurchaseReturn, PurchaseReturnLineItem
- [ ] Add enums: PurchaseOrderStatus, DeliveryStatus, PaymentStatus, etc.
- [ ] Setup relations với Supplier, Product, Branch, Employee
- [ ] Generate và chạy migration
- [ ] Viết script migration data từ localStorage
- [ ] Verify data integrity sau migration

### API Routes
- [ ] GET /api/purchase-orders (list với filters)
- [ ] GET /api/purchase-orders/:id (detail full relations)
- [ ] POST /api/purchase-orders (create)
- [ ] PATCH /api/purchase-orders/:id (update)
- [ ] DELETE /api/purchase-orders/:id (soft delete)
- [ ] POST /api/purchase-orders/:id/cancel
- [ ] POST /api/purchase-orders/:id/finish
- [ ] POST /api/purchase-orders/:id/recalculate
- [ ] POST /api/purchase-orders/:id/inventory-receipts
- [ ] GET /api/purchase-orders/:id/inventory-receipts
- [ ] POST /api/purchase-orders/:id/purchase-returns
- [ ] GET /api/purchase-orders/:id/purchase-returns
- [ ] GET /api/purchase-orders/:id/financial-summary
- [ ] GET /api/purchase-orders/:id/payments
- [ ] POST /api/purchase-orders/bulk-cancel
- [ ] POST /api/purchase-orders/sync-statuses

### React Query
- [ ] Setup queries/usePurchaseOrders.ts
- [ ] Setup mutations/usePurchaseOrderMutations.ts
- [ ] Add useCreatePurchaseOrder mutation
- [ ] Add useUpdatePurchaseOrder mutation
- [ ] Add useCancelPurchaseOrder mutation
- [ ] Add useFinishPurchaseOrder mutation
- [ ] Add useCreateInventoryReceipt mutation
- [ ] Add useCreatePurchaseReturn mutation
- [ ] Add useRecalculatePurchaseOrder mutation
- [ ] Add useBulkCancelPurchaseOrders mutation
- [ ] Setup optimistic updates
- [ ] Add error handling với toast notifications

### UI Components
- [ ] Migrate page.tsx (list) sang React Query
- [ ] Migrate form-page.tsx sang mutations
- [ ] Migrate detail-page.tsx sang React Query
- [ ] Implement CreateInventoryReceiptDialog
- [ ] Implement CreatePurchaseReturnDialog
- [ ] Update SupplierCombobox fetch từ API
- [ ] Update ProductComboboxVirtual fetch từ API
- [ ] Update EmployeeCombobox fetch từ API
- [ ] Add loading skeletons cho tất cả components
- [ ] Add error boundaries

### Business Logic
- [ ] Implement auto status calculation logic server-side
- [ ] Setup webhook/observer cho inventory receipt changes
- [ ] Setup webhook/observer cho purchase return changes
- [ ] Setup webhook/observer cho payment changes
- [ ] Implement payment linking logic (isPaymentLinkedToPurchaseOrder)
- [ ] Implement cancel with refund transaction
- [ ] Implement inventory stock updates
- [ ] Add batch status sync cron job

### Testing
- [ ] Unit tests cho API routes
- [ ] Unit tests cho status calculation logic
- [ ] Unit tests cho payment linking logic
- [ ] Integration test: Create PO → Receive → Pay → Complete
- [ ] Integration test: Create PO → Cancel with refund
- [ ] Integration test: Create PO → Receive → Return → Refund
- [ ] E2E test: Full purchase flow
- [ ] E2E test: Partial receive and return flow
- [ ] Load test: Bulk operations với 1000+ POs

### Performance
- [ ] Add database indexes (supplierId, branchId, status, dates)
- [ ] Optimize queries với proper includes
- [ ] Add pagination cho list endpoints
- [ ] Setup caching strategy cho frequently accessed data
- [ ] Monitor query performance với Prisma metrics
- [ ] Setup background job cho daily status sync

### Documentation
- [ ] Update API documentation
- [ ] Document business rules cho status calculation
- [ ] Document payment linking logic
- [ ] Document inventory integration flow
- [ ] Add inline comments cho complex logic
- [ ] Create user guide cho new features

### Deployment
- [ ] Test migration script trên staging
- [ ] Backup production data trước migration
- [ ] Chạy migration trên production
- [ ] Verify data integrity post-migration
- [ ] Monitor error rates sau deployment
- [ ] Rollback plan nếu có issue

---

## Notes & Considerations

### 🚨 Critical Points
1. **Auto Status Logic phức tạp** - 4 statuses tự động tính toán:
   - Cần careful testing với edge cases
   - Consider using database triggers/functions
   - Add audit trail cho mọi status change

2. **Payment Linking** - Nhiều cách link payment với PO:
   - Direct link qua purchaseOrderSystemId (preferred)
   - Indirect qua supplierSystemId + recipientType
   - Need migration strategy cho legacy data

3. **Cancel with Refund** - Transaction phức tạp:
   - Must be atomic: Cancel PO + Create Receipt
   - Handle case: Account không tồn tại
   - Handle case: Receipt type "Nhà cung cấp hoàn tiền" không có

4. **Inventory Integration** - 2-way sync:
   - PO → Inventory Receipt → Update stock
   - Purchase Return → Revert stock
   - Handle race conditions

### ⚡ Performance Concerns
1. **syncAllPurchaseOrderStatuses()** - Có thể slow với nhiều POs:
   - Consider pagination trong sync job
   - Use batch updates (updateMany)
   - Run as background job, not on-demand

2. **Payment-utils linking** - Multiple DB queries:
   - Optimize với proper indexes
   - Consider caching payment-PO links
   - Use database views/materialized views

### 🎯 Migration Strategy
1. **Phase migration:**
   - Phase 1: Read-only (API + React Query, vẫn dùng Zustand cho write)
   - Phase 2: Write operations (mutations)
   - Phase 3: Remove Zustand store

2. **Data migration:**
   - Export localStorage data
   - Transform format (dates, IDs)
   - Import vào PostgreSQL
   - Verify với checksum

### 💡 Future Enhancements
1. **Purchase Order Templates** - Tạo đơn từ template
2. **Recurring Orders** - Đơn hàng định kỳ tự động
3. **Price History** - Track giá mua theo thời gian
4. **Supplier Performance** - Đánh giá NCC (delivery time, quality)
5. **Purchase Requisitions** - Quy trình yêu cầu mua hàng
6. **Budget Control** - Kiểm soát ngân sách mua hàng
7. **Multi-currency** - Hỗ trợ đa loại tiền tệ
