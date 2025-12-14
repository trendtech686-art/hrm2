# 🛒 ORDERS MODULE - PHÂN TÍCH & ĐỀ XUẤT NÂNG CẤP

> **Ngày rà soát**: 29/11/2025  
> **Module**: Orders (Quản lý đơn hàng)  
> **Trạng thái**: ✅ Đang thực hiện  
> **Mục tiêu**: Nâng cấp lên shadcn + mobile-first + Prisma/PostgreSQL + Next.js
> **⚠️ Lưu ý**: Đây là **module phức tạp và quan trọng nhất** trong hệ thống

---

## 📋 MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Phân tích hiện trạng](#2-phân-tích-hiện-trạng)
3. [Đánh giá logic nghiệp vụ](#3-đánh-giá-logic-nghiệp-vụ)
4. [Phân tích liên kết module](#4-phân-tích-liên-kết-module)
5. [Prisma Schema](#5-prisma-schema)
6. [API Routes (Next.js)](#6-api-routes-nextjs)
7. [React Query Hooks](#7-react-query-hooks)
8. [UI Components](#8-ui-components)
9. [Kế hoạch triển khai](#9-kế-hoạch-triển-khai)
10. [Checklist](#10-checklist)

---

## 1. TỔNG QUAN

### 1.1. Vai trò của module
Orders là **module trung tâm** của hệ thống HRM2, kết nối hầu hết các module khác và quản lý toàn bộ quy trình bán hàng.

### 1.2. Tính năng chính
- ✅ CRUD đơn hàng với dual-ID (systemId/businessId)
- ✅ **Multi-Status Tracking** (6 trạng thái song song)
  - Main Status (Đặt hàng → Hoàn thành / Hủy)
  - Payment Status (Chưa thanh toán → Thanh toán toàn bộ)
  - Delivery Status (Chờ đóng gói → Đã giao hàng)
  - Print Status (Đã in / Chưa in)
  - StockOut Status (Chưa xuất kho / Xuất kho toàn bộ)
  - Return Status (Chưa trả → Trả toàn bộ)
- ✅ **Line Items** (chi tiết sản phẩm với discount)
- ✅ **Packaging System** (lịch sử đóng gói)
- ✅ **Shipment Integration** (GHTK webhooks)
- ✅ **Payment Tracking** (multiple payments)
- ✅ **Stock Management** (commit → dispatch → delivery)
- ✅ **Combo Product Support**
- ✅ **Exchange Orders** (linked to Sales-Returns)
- ✅ **Service Fees** (lắp đặt, bảo hành)
- ✅ **Promotions & Vouchers**

---

## 2. PHÂN TÍCH HIỆN TRẠNG

### 2.1. Cấu trúc files

```
features/orders/
├── types.ts                    ✅ Order, LineItem, Packaging types
├── store.ts                    ✅ Zustand store với stock operations (1513 lines!)
├── data.ts                     ✅ Initial data
├── columns.tsx                 ✅ DataTable columns
├── page.tsx                    ✅ Main list page
├── order-detail-page.tsx       ✅ Detail view với tabs
├── order-form-page.tsx         ✅ Create/Edit form
├── order-card.tsx              ✅ Card component (mobile)
├── order-search-api.ts         ✅ Search API
├── shipping-partners-config.ts ✅ Shipping config
├── hooks/                      ✅ Custom hooks
├── components/                 ✅ 20+ components
│   ├── line-items-table.tsx
│   ├── customer-selector.tsx
│   ├── payment-info.tsx
│   ├── packaging-info.tsx
│   ├── shipping-integration.tsx
│   ├── order-workflow-card.tsx
│   └── shipping/              ✅ Shipping components
└── utils/                      ⚠️ Empty folder
```

### 2.2. Đánh giá code quality

#### ✅ Điểm mạnh
1. **Complete Features**: Đầy đủ tính năng cho bán hàng
2. **Multi-Status**: Quản lý đa trạng thái song song
3. **Stock Integration**: Tích hợp chặt chẽ với inventory
4. **Combo Support**: Xử lý combo products đúng cách
5. **Shipment Integration**: GHTK webhooks implemented
6. **Payment Tracking**: Multi-payment support
7. **Comprehensive Components**: 20+ UI components

#### ⚠️ Điểm cần cải thiện
1. **Store File**: 1513 lines - cần tách nhỏ
2. **Validation**: Chưa có Zod schemas đầy đủ
3. **Database**: Chưa có Prisma schema
4. **API**: Chưa có API routes (Next.js)
5. **React Query**: Chưa implement
6. **State Machine**: Chưa có formal state machine
7. **Refund Flow**: Chưa có proper refund workflow
8. **Order Cancellation**: Logic phức tạp, cần simplify

---

## 3. ĐÁNH GIÁ LOGIC NGHIỆP VỤ

### 3.1. Multi-Status System

#### A. Main Status (OrderMainStatus)
```typescript
'Đặt hàng'       // Order created
'Đang giao dịch' // Processing
'Hoàn thành'     // Completed (delivered + paid)
'Đã hủy'         // Cancelled
```

#### B. Payment Status (OrderPaymentStatus)
```typescript
'Chưa thanh toán'        // Not paid
'Thanh toán 1 phần'      // Partially paid
'Thanh toán toàn bộ'     // Fully paid
```

#### C. Delivery Status (OrderDeliveryStatus)
```typescript
'Chờ đóng gói'     // Awaiting packaging
'Đã đóng gói'      // Packaged
'Chờ lấy hàng'     // Awaiting pickup (by carrier)
'Đang giao hàng'   // In transit
'Đã giao hàng'     // Delivered
'Chờ giao lại'     // Retry delivery
'Đã hủy'           // Cancelled
```

#### D. Stock Out Status (OrderStockOutStatus)
```typescript
'Chưa xuất kho'        // Not dispatched
'Xuất kho toàn bộ'     // Fully dispatched
```

#### E. Return Status (OrderReturnStatus)
```typescript
'Chưa trả hàng'           // No returns
'Trả hàng một phần'       // Partial return
'Trả hàng toàn bộ'        // Full return
```

#### F. Print Status (OrderPrintStatus)
```typescript
'Đã in'    // Printed
'Chưa in'  // Not printed
```

### 3.2. Line Items

```typescript
type LineItem = {
  productSystemId: SystemId;
  productId: BusinessId;        // SKU
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
};

Total = (unitPrice * quantity) - discount
```

### 3.3. Packaging System

```typescript
type Packaging = {
  systemId: SystemId;
  id: BusinessId;              // FUN07302
  
  // Dates
  requestDate: string;
  confirmDate?: string;
  cancelDate?: string;
  deliveredDate?: string;
  
  // Employees
  requestingEmployeeId: SystemId;
  confirmingEmployeeId?: SystemId;
  assignedEmployeeId?: SystemId;
  
  // Status
  status: PackagingStatus;     // 'Chờ đóng gói' | 'Đã đóng gói' | 'Hủy đóng gói'
  printStatus: OrderPrintStatus;
  
  // Delivery
  deliveryMethod?: OrderDeliveryMethod;
  deliveryStatus?: OrderDeliveryStatus;
  
  // Carrier (GHTK)
  carrier?: string;
  service?: string;
  trackingCode?: string;
  partnerStatus?: string;
  shippingFeeToPartner?: number;
  codAmount?: number;
  
  // GHTK Specific
  ghtkStatusId?: number;
  ghtkReasonCode?: string;
  ghtkTrackingId?: string;
  ghtkWebhookHistory?: Array<...>;
  
  // Other
  weight?: number;
  dimensions?: string;
  noteToShipper?: string;
};

Packaging History:
- Order có thể có nhiều lần packaging
- Track toàn bộ lịch sử đóng gói, giao hàng
```

### 3.4. Payment Tracking

```typescript
type OrderPayment = {
  systemId: SystemId;          // Voucher systemId
  id: BusinessId;              // PT000001
  date: string;
  method: string;              // Tiền mặt, Chuyển khoản
  amount: number;
  createdBy: SystemId;
  description: string;
  linkedWarrantySystemId?: SystemId; // Link to warranty
};

Payment Flow:
- Multiple payments per order
- Track paidAmount vs grandTotal
- Auto-update Customer debt
- Link to Cashbook receipts
```

### 3.5. Stock Management Flow

#### A. Commit Stock (Khi tạo order)
```typescript
Order created
→ processLineItemStock(lineItem, branch, 'commit', quantity)
→ Product.committedByBranch[branch] += quantity

For Combo:
→ Commit stock cho từng SP con
→ Product.committedByBranch[branch] += (comboQty * childQty)
```

#### B. Dispatch Stock (Khi xuất kho)
```typescript
Order dispatched
→ processLineItemStock(lineItem, branch, 'dispatch', quantity)
→ Product.inventoryByBranch[branch] -= quantity
→ Product.committedByBranch[branch] -= quantity
→ Product.inTransitByBranch[branch] += quantity
→ Order.stockOutStatus = 'Xuất kho toàn bộ'
→ Order.dispatchedDate = now
```

#### C. Complete Delivery (Khi giao hàng thành công)
```typescript
Order delivered
→ processLineItemStock(lineItem, branch, 'complete', quantity)
→ Product.inTransitByBranch[branch] -= quantity
→ Order.deliveryStatus = 'Đã giao hàng'
```

#### D. Return Stock (Khi hủy order hoặc delivery failed)
```typescript
Order cancelled / Delivery failed
→ processLineItemStock(lineItem, branch, 'return', quantity)
→ Product.inTransitByBranch[branch] -= quantity
→ Product.inventoryByBranch[branch] += quantity
```

#### E. Uncommit Stock (Khi hủy order chưa xuất kho)
```typescript
Order cancelled (before dispatch)
→ processLineItemStock(lineItem, branch, 'uncommit', quantity)
→ Product.committedByBranch[branch] -= quantity
```

### 3.6. GHTK Webhook Integration

```typescript
type GHTKWebhookPayload = {
  label_id: string;            // GHTK tracking code
  partner_id: string;          // Our order ID
  status_id: number;           // -1, 1-21, 123, etc.
  action_time: string;
  reason_code?: string;        // 100-144
  reason?: string;
  weight?: number;             // Actual weight (kg)
  fee?: number;                // Actual fee (VND)
  pick_money?: number;         // COD amount
};

Status Mapping:
- status_id: -1  → Hủy đơn hàng
- status_id: 1   → Chờ lấy hàng
- status_id: 2   → Đã lấy hàng
- status_id: 3   → Đã nhập kho
- status_id: 5   → Đang giao hàng
- status_id: 6   → Đã giao hàng thành công
- status_id: 7-9 → Delivery failed (retry)
- status_id: 13  → Hoàn hàng
```

### 3.7. Exchange Orders

```typescript
Exchange Order Flow:
1. Customer returns items → Create SalesReturn
2. Create new Order with linkedSalesReturnSystemId
3. Order.linkedSalesReturnValue = returned item value
4. Grand Total display = newOrderTotal - returnedValue
5. Customer only pays difference
```

### 3.8. Service Fees

```typescript
type ServiceFee = {
  id: string;
  name: string;                // "Lắp đặt", "Bảo hành mở rộng"
  amount: number;
};

serviceFees?: ServiceFee[];

Grand Total = subtotal + shippingFee + tax + serviceFees - discounts
```

### 3.9. Discounts & Promotions

```typescript
// Line item discount
LineItem.discount
LineItem.discountType: 'percentage' | 'fixed'

// Order discount (toàn đơn)
Order.orderDiscount
Order.orderDiscountType: 'percentage' | 'fixed'
Order.orderDiscountReason: string

// Voucher
Order.voucherCode: string
Order.voucherAmount: number

Calculation:
subtotal = sum(lineItems.total)
totalAfterOrderDiscount = subtotal - orderDiscount
totalAfterVoucher = totalAfterOrderDiscount - voucherAmount
grandTotal = totalAfterVoucher + shippingFee + tax + serviceFees
```

---

## 4. PHÂN TÍCH LIÊN KẾT MODULE

### 4.1. Customers
```typescript
Order.customerSystemId → Customer.systemId

Flow:
- Order created → Customer.incrementOrderStats(orderValue)
- Order paid → Customer.updateDebt(-amount)
- Order cancelled → Customer.decrementOrderStats(orderValue)
- Delivery failed → Customer.incrementFailedDeliveryStats()
```

### 4.2. Products
```typescript
Order.lineItems[].productSystemId → Product.systemId

Stock Flow:
- Order created → commitStock()
- Order dispatched → dispatchStock()
- Order delivered → completeDelivery()
- Order cancelled → uncommitStock() or returnStock()

Combo Handling:
- Auto expand combo to child products
- Commit/dispatch child products
```

### 4.3. Employees
```typescript
Order.salespersonSystemId → Employee.systemId
Order.createdBy → Employee.systemId
Packaging.requestingEmployeeId → Employee.systemId
Packaging.confirmingEmployeeId → Employee.systemId
```

### 4.4. Branches
```typescript
Order.branchSystemId → Branch.systemId
- Stock operations use branch systemId
```

### 4.5. Cashbook
```typescript
OrderPayment.systemId → Receipt.systemId

Flow:
- Order payment → Create Receipt
- Order refund → Create Payment
- Link to Customer debt
```

### 4.6. Sales-Returns
```typescript
Order.linkedSalesReturnSystemId → SalesReturn.systemId
SalesReturn.exchangeOrderSystemId → Order.systemId

Flow:
- Customer returns items → Create SalesReturn
- Customer wants exchange → Create new Order
- Link Order ↔ SalesReturn
```

### 4.7. Warranty
```typescript
OrderPayment.linkedWarrantySystemId → Warranty.systemId

Flow:
- Customer buys with warranty deduction
- Payment linked to warranty ticket
```

### 4.8. Settings
```typescript
Order.deliveryMethod → Settings
Order.expectedPaymentMethod → Settings
Packaging.carrier → ShippingPartner settings
```

---

## 5. PRISMA SCHEMA

```prisma
// ═══════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════

enum OrderMainStatus {
  PENDING          // "Đặt hàng"
  PROCESSING       // "Đang giao dịch"
  COMPLETED        // "Hoàn thành"
  CANCELLED        // "Đã hủy"
}

enum OrderPaymentStatus {
  UNPAID           // "Chưa thanh toán"
  PARTIAL          // "Thanh toán 1 phần"
  PAID             // "Thanh toán toàn bộ"
}

enum OrderDeliveryStatus {
  PENDING_PACKAGING    // "Chờ đóng gói"
  PACKAGED             // "Đã đóng gói"
  AWAITING_PICKUP      // "Chờ lấy hàng"
  IN_TRANSIT           // "Đang giao hàng"
  DELIVERED            // "Đã giao hàng"
  RETRY_DELIVERY       // "Chờ giao lại"
  CANCELLED            // "Đã hủy"
}

enum OrderPrintStatus {
  PRINTED
  NOT_PRINTED
}

enum OrderStockOutStatus {
  NOT_DISPATCHED       // "Chưa xuất kho"
  FULLY_DISPATCHED     // "Xuất kho toàn bộ"
}

enum OrderReturnStatus {
  NO_RETURN            // "Chưa trả hàng"
  PARTIAL_RETURN       // "Trả hàng một phần"
  FULL_RETURN          // "Trả hàng toàn bộ"
}

enum OrderDeliveryMethod {
  STORE_PICKUP         // "Nhận tại cửa hàng"
  DELIVERY_SERVICE     // "Dịch vụ giao hàng"
}

model Order {
  // IDs
  systemId            String                @id @default(cuid())
  id                  String                @unique // DH0001
  
  // Customer & Branch
  customerId          String
  customer            Customer              @relation(fields: [customerId], references: [systemId])
  
  branchId            String
  branch              Branch                @relation(fields: [branchId], references: [systemId])
  
  salespersonId       String
  salesperson         Employee              @relation("OrderSalesperson", fields: [salespersonId], references: [systemId])
  
  // Dates
  orderDate           DateTime
  expectedDeliveryDate DateTime?
  approvedDate        DateTime?
  completedDate       DateTime?
  cancelledDate       DateTime?
  dispatchedDate      DateTime?
  
  // Addresses
  shippingAddress     String?               @db.Text
  billingAddress      String?               @db.Text
  
  // External References
  referenceUrl        String?
  externalReference   String?
  
  // Exchange Order (linked to Sales Return)
  linkedSalesReturnId String?
  linkedSalesReturn   SalesReturn?          @relation("ExchangeOrder", fields: [linkedSalesReturnId], references: [systemId])
  linkedSalesReturnValue Decimal?           @db.Decimal(18, 2)
  
  // Status Fields
  mainStatus          OrderMainStatus       @default(PENDING)
  paymentStatus       OrderPaymentStatus    @default(UNPAID)
  deliveryStatus      OrderDeliveryStatus   @default(PENDING_PACKAGING)
  printStatus         OrderPrintStatus      @default(NOT_PRINTED)
  stockOutStatus      OrderStockOutStatus   @default(NOT_DISPATCHED)
  returnStatus        OrderReturnStatus     @default(NO_RETURN)
  
  // Delivery
  deliveryMethod      OrderDeliveryMethod
  cancellationReason  String?               @db.Text
  
  dispatchedById      String?
  dispatchedBy        Employee?             @relation("OrderDispatcher", fields: [dispatchedById], references: [systemId])
  
  // COD
  codAmount           Decimal               @default(0) @db.Decimal(18, 2)
  
  // Financial
  subtotal            Decimal               @db.Decimal(18, 2)
  shippingFee         Decimal               @default(0) @db.Decimal(18, 2)
  tax                 Decimal               @default(0) @db.Decimal(18, 2)
  
  // Discounts
  orderDiscount       Decimal?              @db.Decimal(18, 2)
  orderDiscountType   String?               // 'percentage' | 'fixed'
  orderDiscountReason String?
  voucherCode         String?
  voucherAmount       Decimal?              @db.Decimal(18, 2)
  
  // Totals
  grandTotal          Decimal               @db.Decimal(18, 2)
  paidAmount          Decimal               @default(0) @db.Decimal(18, 2)
  
  // Service Fees (JSON)
  serviceFees         Json?                 // Array<{id, name, amount}>
  
  // Payment Method
  expectedPaymentMethod String?
  
  // Notes & Tags
  notes               String?               @db.Text
  tags                String[]
  
  // Source
  source              String?
  
  // Audit
  createdAt           DateTime              @default(now())
  updatedAt           DateTime              @updatedAt
  
  createdById         String?
  createdBy           Employee?             @relation("OrderCreatedBy", fields: [createdById], references: [systemId])
  
  updatedById         String?
  updatedBy           Employee?             @relation("OrderUpdatedBy", fields: [updatedById], references: [systemId])
  
  // Relations
  lineItems           OrderItem[]
  payments            OrderPayment[]
  packagings          Packaging[]
  salesReturns        SalesReturn[]
  debtTransactions    DebtTransaction[]
  
  @@index([id])
  @@index([customerId])
  @@index([branchId])
  @@index([salespersonId])
  @@index([orderDate])
  @@index([mainStatus])
  @@index([paymentStatus])
  @@index([deliveryStatus])
  @@index([createdAt])
  @@map("orders")
}

// ═══════════════════════════════════════════════════════════════
// ORDER ITEMS (Line Items)
// ═══════════════════════════════════════════════════════════════
model OrderItem {
  id              String    @id @default(cuid())
  
  orderId         String
  order           Order     @relation(fields: [orderId], references: [systemId], onDelete: Cascade)
  
  productId       String
  product         Product   @relation(fields: [productId], references: [systemId])
  
  quantity        Int
  unitPrice       Decimal   @db.Decimal(18, 2)
  discount        Decimal   @default(0) @db.Decimal(18, 2)
  discountType    String    @default("fixed") // 'percentage' | 'fixed'
  
  // Virtual: total = (unitPrice * quantity) - discount
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}

// ═══════════════════════════════════════════════════════════════
// ORDER PAYMENTS
// ═══════════════════════════════════════════════════════════════
model OrderPayment {
  systemId            String    @id @default(cuid())
  id                  String    @unique // PT000001
  
  orderId             String
  order               Order     @relation(fields: [orderId], references: [systemId])
  
  // Receipt link (from Cashbook)
  receiptId           String?
  receipt             Receipt?  @relation(fields: [receiptId], references: [systemId])
  
  date                DateTime
  method              String
  amount              Decimal   @db.Decimal(18, 2)
  description         String?   @db.Text
  
  // Warranty link (for warranty deduction payments)
  linkedWarrantyId    String?
  linkedWarranty      Warranty? @relation(fields: [linkedWarrantyId], references: [systemId])
  
  createdById         String
  createdBy           Employee  @relation(fields: [createdById], references: [systemId])
  
  createdAt           DateTime  @default(now())
  
  @@index([orderId])
  @@index([date])
  @@map("order_payments")
}

// ═══════════════════════════════════════════════════════════════
// PACKAGING
// ═══════════════════════════════════════════════════════════════
enum PackagingStatus {
  PENDING          // "Chờ đóng gói"
  PACKAGED         // "Đã đóng gói"
  CANCELLED        // "Hủy đóng gói"
}

model Packaging {
  systemId            String            @id @default(cuid())
  id                  String            @unique // FUN07302
  
  orderId             String
  order               Order             @relation(fields: [orderId], references: [systemId])
  
  // Dates
  requestDate         DateTime
  confirmDate         DateTime?
  cancelDate          DateTime?
  deliveredDate       DateTime?
  
  // Employees
  requestingEmployeeId String
  requestingEmployee   Employee         @relation("PackagingRequester", fields: [requestingEmployeeId], references: [systemId])
  
  confirmingEmployeeId String?
  confirmingEmployee   Employee?        @relation("PackagingConfirmer", fields: [confirmingEmployeeId], references: [systemId])
  
  cancelingEmployeeId  String?
  cancelingEmployee    Employee?        @relation("PackagingCanceler", fields: [cancelingEmployeeId], references: [systemId])
  
  assignedEmployeeId   String?
  assignedEmployee     Employee?        @relation("PackagingAssignee", fields: [assignedEmployeeId], references: [systemId])
  
  // Status
  status              PackagingStatus
  printStatus         OrderPrintStatus  @default(NOT_PRINTED)
  cancelReason        String?           @db.Text
  notes               String?           @db.Text
  
  // Delivery
  deliveryMethod      OrderDeliveryMethod?
  deliveryStatus      OrderDeliveryStatus?
  
  // Carrier Info
  carrier             String?
  service             String?
  trackingCode        String?
  partnerStatus       String?
  shippingFeeToPartner Decimal?         @db.Decimal(18, 2)
  codAmount           Decimal?          @db.Decimal(18, 2)
  payer               String?           // 'Người gửi' | 'Người nhận'
  reconciliationStatus String?          // 'Chưa đối soát' | 'Đã đối soát'
  
  // General Shipment
  weight              Decimal?          @db.Decimal(10, 3) // grams
  dimensions          String?
  noteToShipper       String?
  
  // GHTK Specific
  ghtkStatusId        Int?
  ghtkReasonCode      String?
  ghtkReasonText      String?
  ghtkTrackingId      String?
  estimatedPickTime   DateTime?
  estimatedDeliverTime DateTime?
  lastSyncedAt        DateTime?
  actualWeight        Decimal?          @db.Decimal(10, 3) // kg
  actualFee           Decimal?          @db.Decimal(18, 2)
  ghtkWebhookHistory  Json?             // Array of webhook events
  
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt
  
  @@index([orderId])
  @@index([trackingCode])
  @@index([status])
  @@map("packagings")
}
```

---

## 6. API ROUTES (NEXT.JS)

### 6.1. Order CRUD

```typescript
// app/api/orders/route.ts
GET    /api/orders              // List with filters, pagination
POST   /api/orders              // Create new order

// app/api/orders/[systemId]/route.ts
GET    /api/orders/:systemId    // Get by ID
PATCH  /api/orders/:systemId    // Update
DELETE /api/orders/:systemId    // Cancel order
```

### 6.2. Order Operations

```typescript
// Stock operations
POST /api/orders/:systemId/dispatch
POST /api/orders/:systemId/complete-delivery
POST /api/orders/:systemId/cancel-delivery

// Payment
POST /api/orders/:systemId/payments
{
  method: string,
  amount: number,
  linkedWarrantySystemId?: string
}

// Packaging
POST /api/orders/:systemId/packagings
PATCH /api/orders/:systemId/packagings/:packagingId
{
  status: 'PACKAGED' | 'CANCELLED',
  cancelReason?: string
}

// Status updates
PATCH /api/orders/:systemId/status
{
  mainStatus?: OrderMainStatus,
  deliveryStatus?: OrderDeliveryStatus,
  ...
}
```

### 6.3. GHTK Integration

```typescript
// Create shipment
POST /api/orders/:systemId/shipments/ghtk
{
  carrier: 'GHTK',
  service: 'Nhanh',
  ...
}

// Webhook receiver
POST /api/webhooks/ghtk
{
  label_id: string,
  partner_id: string,
  status_id: number,
  ...
}

// Sync status
POST /api/orders/:systemId/shipments/:packagingId/sync
```

### 6.4. Exchange Orders

```typescript
// Create exchange order
POST /api/orders/exchange
{
  salesReturnSystemId: string,
  newLineItems: [...],
  ...
}
```

---

## 7. REACT QUERY HOOKS

### 7.1. Query Hooks

```typescript
export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => fetchOrders(filters),
  });
}

export function useOrder(systemId: string) {
  return useQuery({
    queryKey: ['orders', systemId],
    queryFn: () => fetchOrder(systemId),
    enabled: !!systemId,
  });
}
```

### 7.2. Mutation Hooks

```typescript
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrderInput) => createOrder(data),
    onSuccess: (order) => {
      // Update customer stats
      // Commit stock
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Tạo đơn hàng thành công');
    },
  });
}

export function useDispatchOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (systemId: string) => dispatchOrder(systemId),
    onSuccess: (_, systemId) => {
      // Dispatch stock
      queryClient.invalidateQueries({ queryKey: ['orders', systemId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ systemId, reason }: CancelOrderInput) => 
      cancelOrder(systemId, reason),
    onSuccess: (_, { systemId }) => {
      // Uncommit/return stock
      // Refund payments
      // Update customer stats
      queryClient.invalidateQueries({ queryKey: ['orders', systemId] });
    },
  });
}
```

---

## 8. UI COMPONENTS

### 8.1. Order Form (Create/Edit)

```typescript
// Đã có sẵn, cần refactor:
- order-form-page.tsx (phức tạp)
- customer-selector.tsx
- line-items-table.tsx
- product-search.tsx
- payment-info.tsx
- shipping-integration.tsx
```

### 8.2. Order Detail Page

```typescript
// Đã có sẵn với tabs:
- order-detail-page.tsx
- order-workflow-card.tsx
- packaging-info.tsx
- shipping-tracking-tab.tsx
```

---

## 9. KẾ HOẠCH TRIỂN KHAI

### Phase 1: Database & Schema (Tuần 1-2)
- [ ] Tạo Prisma schema cho Orders
- [ ] Tạo schema cho OrderItems
- [ ] Tạo schema cho OrderPayments
- [ ] Tạo schema cho Packagings
- [ ] Tạo migration
- [ ] Seed data

### Phase 2: API Routes (Tuần 3-4)
- [ ] CRUD endpoints
- [ ] Stock operation endpoints
- [ ] Payment endpoints
- [ ] Packaging endpoints
- [ ] GHTK webhook endpoint
- [ ] Exchange order endpoint

### Phase 3: React Query (Tuần 5-6)
- [ ] Query hooks
- [ ] Mutation hooks
- [ ] Optimistic updates
- [ ] Real-time sync

### Phase 4: Refactor Store (Tuần 7-8)
- [ ] Tách store.ts thành nhiều files nhỏ
- [ ] Extract stock operations
- [ ] Extract payment operations
- [ ] Extract packaging operations

### Phase 5: UI Refactor (Tuần 9-10)
- [ ] Refactor order-form-page
- [ ] Refactor order-detail-page
- [ ] Mobile-first components
- [ ] Loading states
- [ ] Error handling

### Phase 6: Testing & Deployment (Tuần 11-12)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing
- [ ] UAT
- [ ] Production deployment

---

## 10. CHECKLIST

### ✅ Code Quality
- [x] Types đầy đủ
- [ ] Validation với Zod schemas
- [x] Store với business logic (nhưng quá dài)
- [ ] No TypeScript errors
- [ ] ESLint passed
- [ ] Store refactored (< 500 lines per file)

### ✅ Business Logic
- [x] Multi-status tracking
- [x] Stock management
- [x] Combo support
- [x] Payment tracking
- [x] Packaging system
- [x] GHTK integration
- [x] Exchange orders
- [ ] State machine
- [ ] Proper refund workflow

### ⏳ Database
- [ ] Prisma schema
- [ ] Relations mapped
- [ ] Indexes optimized
- [ ] Migration scripts

### ⏳ API
- [ ] CRUD endpoints
- [ ] Stock operations
- [ ] Payment operations
- [ ] Packaging operations
- [ ] GHTK webhook
- [ ] Exchange orders

### ⏳ React Query
- [ ] Query hooks
- [ ] Mutation hooks
- [ ] Optimistic updates
- [ ] Real-time sync

### ✅ UI/UX
- [x] Responsive design
- [x] Mobile-first
- [x] shadcn/ui components
- [ ] Loading states
- [ ] Error boundaries

### ⏳ Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

---

**Tài liệu tạo**: 29/11/2025  
**Phiên bản**: 1.0  
**Trạng thái**: ✅ Hoàn thành phân tích  
**⚠️ Lưu ý**: Module này **CỰC KỲ PHỨC TẠP**, cần 12 tuần để nâng cấp hoàn chỉnh
