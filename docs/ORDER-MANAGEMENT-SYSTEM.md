# 📦 TÀI LIỆU HỆ THỐNG QUẢN LÝ ĐƠN HÀNG - ACME ERP

> **Phiên bản:** 1.0.0  
> **Ngày cập nhật:** 31/01/2026  
> **Stack:** Next.js 16 + Prisma 7 + PostgreSQL + React Query  
> **Tham khảo:** [Sapo Omni - Quản lý hợp kênh](https://help.sapo.vn/quan-ly-hop-kenh)

---

## 📑 MỤC LỤC

1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Kiến Trúc Database](#2-kiến-trúc-database)
3. [Các Trạng Thái Đơn Hàng](#3-các-trạng-thái-đơn-hàng)
4. [Quy Trình Xử Lý Đơn Hàng](#4-quy-trình-xử-lý-đơn-hàng)
5. [API Endpoints](#5-api-endpoints)
6. [So Sánh với Sapo](#6-so-sánh-với-sapo)
7. [Vấn Đề Performance](#7-vấn-đề-performance)
8. [Kế Hoạch Triển Khai](#8-kế-hoạch-triển-khai)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1 Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  features/orders/                                                            │
│  ├── components/        → UI Components (Form, Table, Cards)                │
│  ├── hooks/             → React Query hooks (useOrders, useOrder)           │
│  ├── api/               → API client functions                              │
│  └── types.ts           → TypeScript types                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                API LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  app/api/orders/                                                             │
│  ├── route.ts           → List + Create                                     │
│  ├── cursor/route.ts    → Cursor pagination (optimized)                     │
│  └── [systemId]/        → Single order operations                           │
│      ├── route.ts       → CRUD                                              │
│      ├── status/        → Status transitions                                │
│      ├── cancel/        → Cancellation                                      │
│      ├── payments/      → Payment management                                │
│      ├── packaging/     → Packaging workflow                                │
│      └── shipment/      → Shipment management                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                               DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  prisma/schema/                                                              │
│  ├── sales/             → Order, OrderPayment, Customer                     │
│  ├── operations/        → Packaging, Shipment                               │
│  └── introspected/      → OrderLineItem                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Các Models chính

| Model | SystemId Format | Business ID | Mục đích |
|-------|-----------------|-------------|----------|
| **Order** | `ORDER000001` | `DH000001` | Đơn hàng |
| **OrderLineItem** | `OLI000001-001` | - | Chi tiết đơn |
| **Packaging** | `PACKAGE000001` | `DG000001` | Phiếu đóng gói |
| **Shipment** | `SHIPMENT000001` | - | Vận đơn |
| **OrderPayment** | `PAYMENT000001` | `PT000001` | Thanh toán |

---

## 2. KIẾN TRÚC DATABASE

### 2.1 Order Schema

```prisma
model Order {
  // Identity
  systemId             String         @id          // ORDER000001
  id                   String         @unique      // DH000001
  
  // Customer & Branch
  customerId           String?
  customerName         String
  branchId             String
  branchName           String
  salespersonId        String
  salespersonName      String
  
  // Dates
  orderDate            DateTime       @default(now())
  expectedDeliveryDate DateTime?
  approvedDate         DateTime?
  completedDate        DateTime?
  cancelledDate        DateTime?
  dispatchedDate       DateTime?
  
  // Statuses
  status               OrderStatus    @default(PENDING)
  paymentStatus        PaymentStatus  @default(UNPAID)
  deliveryStatus       DeliveryStatus @default(PENDING_PACK)
  deliveryMethod       DeliveryMethod @default(SHIPPING)
  printStatus          PrintStatus    @default(NOT_PRINTED)
  stockOutStatus       StockOutStatus @default(NOT_STOCKED_OUT)
  returnStatus         ReturnStatus   @default(NO_RETURN)
  
  // Financial
  subtotal             Decimal
  shippingFee          Decimal        @default(0)
  tax                  Decimal        @default(0)
  discount             Decimal        @default(0)
  grandTotal           Decimal
  paidAmount           Decimal        @default(0)
  codAmount            Decimal        @default(0)
  
  // Relations
  lineItems            OrderLineItem[]
  payments             OrderPayment[]
  packagings           Packaging[]
  shipments            Shipment[]
  
  @@index([branchId])
  @@index([customerId])
  @@index([orderDate])
  @@index([status])
}
```

### 2.2 Packaging Schema

```prisma
model Packaging {
  systemId             String          @id          // PACKAGE000001
  id                   String          @unique      // DG000001
  orderId              String
  branchId             String
  
  // Status
  status               PackagingStatus @default(PENDING)
  deliveryStatus       DeliveryStatus?
  printStatus          PrintStatus     @default(NOT_PRINTED)
  
  // Dates
  packDate             DateTime        @default(now())
  requestDate          DateTime        @default(now())
  confirmDate          DateTime?
  cancelDate           DateTime?
  deliveredDate        DateTime?
  
  // Employees
  assignedEmployeeId   String?
  assignedEmployeeName String?
  confirmingEmployeeId String?
  
  // Carrier Info
  carrier              String?         // GHTK, GHN, etc.
  trackingCode         String?
  codAmount            Decimal?
  shippingFeeToPartner Decimal?
  
  // GHTK Integration
  ghtkTrackingId       String?
  ghtkStatusId         Int?
  estimatedDeliverTime DateTime?
  lastSyncedAt         DateTime?
  
  // Relations
  order                Order           @relation(...)
  items                PackagingItem[]
  shipment             Shipment?
}
```

---

## 3. CÁC TRẠNG THÁI ĐƠN HÀNG

### 3.1 OrderStatus (12 trạng thái)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ORDER STATUS FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────┐    ┌───────────┐    ┌────────────┐    ┌──────────┐          │
│   │ PENDING  │───▶│ CONFIRMED │───▶│ PROCESSING │───▶│ PACKING  │          │
│   │ Chờ xác  │    │ Đã xác    │    │ Đang xử    │    │ Đang     │          │
│   │ nhận     │    │ nhận      │    │ lý         │    │ đóng gói │          │
│   └────┬─────┘    └───────────┘    └────────────┘    └────┬─────┘          │
│        │                                                   │                │
│        │ [Có thể HỦY tại bất kỳ giai đoạn nào]            │                │
│        │                                                   ▼                │
│        │                                            ┌──────────┐            │
│        │                                            │  PACKED  │            │
│        │                                            │ Đã đóng  │            │
│        │                                            │ gói      │            │
│        │                                            └────┬─────┘            │
│        │                                                 │                  │
│        │                    ┌─────────────────┬──────────┴───────┐          │
│        │                    ▼                 ▼                  ▼          │
│        │         ┌─────────────────┐  ┌──────────────┐  ┌────────────┐      │
│        │         │ READY_FOR_      │  │   SHIPPING   │  │  PICKUP    │      │
│        │         │ PICKUP          │  │ Đang vận     │  │  Giao tự   │      │
│        │         │ Chờ nhận tại    │  │ chuyển       │  │  giao      │      │
│        │         │ cửa hàng        │  │              │  │            │      │
│        │         └────────┬────────┘  └──────┬───────┘  └────────────┘      │
│        │                  │                  │                              │
│        │                  │    ┌─────────────┼─────────────┐                │
│        │                  │    │             │             │                │
│        │                  ▼    ▼             ▼             ▼                │
│        │            ┌───────────────┐  ┌───────────┐  ┌─────────────┐       │
│        │            │   DELIVERED   │  │  FAILED_  │  │  CANCELLED  │       │
│        │            │ Đã giao hàng  │  │  DELIVERY │  │  Đã hủy     │       │
│        │            └───────┬───────┘  │ Giao thất │  └─────────────┘       │
│        │                    │          │ bại       │        ▲               │
│        │                    │          └─────┬─────┘        │               │
│        │                    │                │              │               │
│        │                    ▼                │ [retry]      │               │
│        │            ┌───────────────┐        └──────────────┘               │
│        │            │   COMPLETED   │                                       │
│        │            │ Hoàn thành    │                                       │
│        │            └───────┬───────┘                                       │
│        │                    │                                               │
│        │                    ▼                                               │
│        │            ┌───────────────┐                                       │
│        └───────────▶│   RETURNED    │◀──────────────────────────────────    │
│                     │ Hoàn hàng     │                                       │
│                     └───────────────┘                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Valid Status Transitions

```typescript
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING:          ['CONFIRMED', 'CANCELLED'],
  CONFIRMED:        ['PROCESSING', 'CANCELLED'],
  PROCESSING:       ['PACKING', 'CANCELLED'],
  PACKING:          ['PACKED', 'CANCELLED'],
  PACKED:           ['SHIPPING', 'READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['DELIVERED', 'COMPLETED', 'CANCELLED'],
  SHIPPING:         ['DELIVERED', 'FAILED_DELIVERY', 'CANCELLED'],
  DELIVERED:        ['COMPLETED', 'RETURNED'],
  COMPLETED:        ['RETURNED'],
  FAILED_DELIVERY:  ['SHIPPING', 'CANCELLED', 'RETURNED'],
  CANCELLED:        [],  // Terminal state
  RETURNED:         [],  // Terminal state
};
```

### 3.3 PaymentStatus

| Status | Điều kiện |
|--------|-----------|
| `UNPAID` | paidAmount = 0 |
| `PARTIAL` | 0 < paidAmount < grandTotal |
| `PAID` | paidAmount >= grandTotal |

### 3.4 DeliveryStatus

| Status | Mô tả |
|--------|-------|
| `PENDING_PACK` | Chờ đóng gói |
| `PACKED` | Đã đóng gói |
| `PENDING_SHIP` | Chờ gửi đi |
| `SHIPPING` | Đang vận chuyển |
| `DELIVERED` | Đã giao |
| `RESCHEDULED` | Đã lên lịch giao lại |
| `CANCELLED` | Đã hủy giao |

### 3.5 PackagingStatus

| Status | Mô tả |
|--------|-------|
| `PENDING` | Chờ đóng gói |
| `IN_PROGRESS` | Đang đóng gói |
| `COMPLETED` | Đã hoàn thành |
| `CANCELLED` | Đã hủy |

---

## 4. QUY TRÌNH XỬ LÝ ĐƠN HÀNG

### 4.1 Phase 1: Tạo Đơn Hàng

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  POST /api/orders                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Input:                                                                     │
│  {                                                                          │
│    customerId: "CUST000001",          // Khách hàng                        │
│    branchId: "BRANCH-HQ",             // Chi nhánh                         │
│    salespersonId: "EMP-ADMIN",        // Nhân viên bán hàng                │
│    deliveryMethod: "SHIPPING",        // SHIPPING | PICKUP | IN_STORE      │
│    lineItems: [                                                             │
│      {                                                                      │
│        productSystemId: "PROD000001",                                      │
│        quantity: 2,                                                         │
│        unitPrice: 1000000,                                                  │
│        discount: 50000                                                      │
│      }                                                                      │
│    ],                                                                       │
│    shippingAddress: {                 // Nếu SHIPPING                      │
│      recipientName: "Nguyễn Văn A",                                        │
│      phone: "0901234567",                                                   │
│      address: "123 ABC, Q1, HCM"                                           │
│    }                                                                        │
│  }                                                                          │
│                                                                             │
│  Actions:                                                                   │
│  1. Generate systemId (ORDER000XXX) + id (DH000XXX)                        │
│  2. Validate products exist and have stock                                 │
│  3. Create Order + LineItems trong transaction                             │
│  4. Reserve stock (commit inventory) - nếu có inventory management        │
│  5. [Optional] Auto-create Packaging nếu cấu hình                          │
│                                                                             │
│  Output:                                                                    │
│  - Order với status: PENDING                                               │
│  - paymentStatus: UNPAID                                                   │
│  - deliveryStatus: PENDING_PACK                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Phase 2: Xác Nhận Đơn

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PATCH /api/orders/[systemId]/status                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PENDING → CONFIRMED                                                        │
│  {                                                                          │
│    status: "CONFIRMED"                                                      │
│  }                                                                          │
│                                                                             │
│  Actions:                                                                   │
│  1. Validate current status = PENDING                                      │
│  2. Set approvedDate = now()                                               │
│  3. [Optional] Send notification to warehouse                              │
│                                                                             │
│  CONFIRMED → PROCESSING                                                     │
│  {                                                                          │
│    status: "PROCESSING"                                                     │
│  }                                                                          │
│                                                                             │
│  Actions:                                                                   │
│  1. Đơn hàng sẵn sàng để đóng gói                                          │
│  2. Có thể gán cho nhân viên xử lý                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Phase 3: Đóng Gói

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  POST /api/orders/[systemId]/packaging                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Tạo phiếu đóng gói:                                                       │
│  {                                                                          │
│    assignedEmployeeId: "EMP000002",   // Nhân viên đóng gói               │
│    deliveryMethod: "SHIPPING",                                             │
│    items: [                           // Sản phẩm cần đóng gói            │
│      { productSystemId: "PROD001", quantity: 2 }                           │
│    ]                                                                        │
│  }                                                                          │
│                                                                             │
│  Actions:                                                                   │
│  1. Create Packaging (status: PENDING)                                     │
│  2. Create PackagingItems                                                  │
│  3. Set order.status = PACKING                                             │
│  4. Set order.deliveryStatus = PENDING_PACK                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  POST /api/orders/[systemId]/packaging/[packagingId]/confirm                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Xác nhận đã đóng gói xong:                                                │
│                                                                             │
│  Actions:                                                                   │
│  1. Set packaging.status = COMPLETED                                       │
│  2. Set packaging.confirmDate = now()                                      │
│  3. Set order.status = PACKED                                              │
│  4. Set order.deliveryStatus = PACKED                                      │
│  5. Xuất kho (deduct stock) - nếu chưa làm trước đó                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Phase 4A: Giao Hàng Qua Đối Tác Vận Chuyển

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  POST /api/orders/[systemId]/packaging/[packagingId]/dispatch               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Gửi hàng đi (dispatch from warehouse):                                    │
│                                                                             │
│  Actions:                                                                   │
│  1. Set order.status = SHIPPING                                            │
│  2. Set order.dispatchedDate = now()                                       │
│  3. Set order.deliveryStatus = SHIPPING                                    │
│  4. [Optional] Create Shipment record                                      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  POST /api/orders/[systemId]/packaging/[packagingId]/ghtk                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Đẩy đơn sang GHTK:                                                        │
│  {                                                                          │
│    products: [...],                                                         │
│    order: {                                                                 │
│      pick_name: "Kho ABC",                                                 │
│      pick_address: "...",                                                  │
│      pick_province: "Hồ Chí Minh",                                         │
│      ...                                                                    │
│    }                                                                        │
│  }                                                                          │
│                                                                             │
│  Actions:                                                                   │
│  1. Call GHTK API: POST /services/shipment/order                           │
│  2. Save ghtkTrackingId, trackingCode                                      │
│  3. Update packaging with GHTK info                                        │
│  4. GHTK webhook sẽ auto-update status                                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  POST /api/orders/[systemId]/packaging/[packagingId]/complete-delivery      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Xác nhận đã giao thành công:                                              │
│                                                                             │
│  Actions:                                                                   │
│  1. Set order.status = DELIVERED                                           │
│  2. Set order.deliveryStatus = DELIVERED                                   │
│  3. Set packaging.deliveredDate = now()                                    │
│  4. Auto-complete nếu đã PAID                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.5 Phase 4B: Nhận Tại Cửa Hàng

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  POST /api/orders/[systemId]/packaging/[packagingId]/in-store-pickup        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Tạo yêu cầu nhận hàng tại cửa hàng:                                       │
│  {                                                                          │
│    requestorName: "Nguyễn Văn A",                                          │
│    requestorPhone: "0901234567"                                            │
│  }                                                                          │
│                                                                             │
│  Actions:                                                                   │
│  1. Set order.status = READY_FOR_PICKUP                                    │
│  2. Update packaging with requestor info                                   │
│  3. Wait for customer to pick up                                           │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  POST /api/orders/[systemId]/packaging/[packagingId]/confirm-pickup         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Xác nhận khách đã nhận hàng:                                              │
│                                                                             │
│  Actions:                                                                   │
│  1. Set order.status = DELIVERED                                           │
│  2. Set packaging.deliveredDate = now()                                    │
│  3. Auto-complete nếu đã PAID                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.6 Phase 5: Thanh Toán

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  POST /api/orders/[systemId]/payments                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Ghi nhận thanh toán:                                                       │
│  {                                                                          │
│    amount: 1500000,                                                         │
│    paymentMethod: "CASH",             // CASH | BANK_TRANSFER | COD        │
│    reference: "TK-2024-001",                                               │
│    receivedAt: "2024-01-31T10:00:00Z"                                      │
│  }                                                                          │
│                                                                             │
│  Actions:                                                                   │
│  1. Create OrderPayment record                                             │
│  2. Update order.paidAmount += amount                                      │
│  3. Update order.paymentStatus:                                            │
│     - paidAmount == 0        → UNPAID                                      │
│     - 0 < paidAmount < total → PARTIAL                                     │
│     - paidAmount >= total    → PAID                                        │
│  4. Auto-complete nếu DELIVERED + PAID:                                    │
│     order.status = COMPLETED                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.7 Exception Flows: Hủy Đơn

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  POST /api/orders/[systemId]/cancel                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Hủy đơn hàng:                                                              │
│  {                                                                          │
│    reason: "Khách hủy đơn",                                                │
│    restockItems: true                 // Hoàn lại tồn kho                  │
│  }                                                                          │
│                                                                             │
│  Allowed from:                                                              │
│  ✅ PENDING, CONFIRMED, PROCESSING, PACKING, PACKED                        │
│  ✅ READY_FOR_PICKUP, SHIPPING, FAILED_DELIVERY                            │
│                                                                             │
│  NOT allowed from:                                                          │
│  ❌ DELIVERED, COMPLETED, CANCELLED, RETURNED                              │
│                                                                             │
│  Actions:                                                                   │
│  1. Set order.status = CANCELLED                                           │
│  2. Set order.cancelledDate = now()                                        │
│  3. Set order.cancellationReason = reason                                  │
│  4. [If restockItems] Restore inventory                                    │
│  5. Cancel related Packaging/Shipment                                      │
│  6. [If GHTK] Call GHTK cancel API                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.8 Exception Flows: Giao Hàng Thất Bại

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  POST /api/orders/[systemId]/packaging/[packagingId]/failed-delivery        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Đánh dấu giao thất bại:                                                   │
│  {                                                                          │
│    reason: "Khách không có ở nhà"                                          │
│  }                                                                          │
│                                                                             │
│  Actions:                                                                   │
│  1. Set order.status = FAILED_DELIVERY                                     │
│  2. Set packaging.deliveryStatus = RESCHEDULED                             │
│  3. Record failure reason                                                  │
│                                                                             │
│  Next options:                                                              │
│  - Retry: FAILED_DELIVERY → SHIPPING (giao lại)                            │
│  - Cancel: FAILED_DELIVERY → CANCELLED                                     │
│  - Return: FAILED_DELIVERY → RETURNED                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. API ENDPOINTS

### 5.1 Main Routes

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/orders` | Danh sách đơn hàng (offset pagination) |
| POST | `/api/orders` | Tạo đơn hàng mới |
| GET | `/api/orders/cursor` | Danh sách đơn (cursor pagination - **recommended**) |

### 5.2 Single Order Routes

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/orders/[systemId]` | Chi tiết đơn hàng |
| PATCH | `/api/orders/[systemId]` | Cập nhật đơn hàng |
| PUT | `/api/orders/[systemId]` | Cập nhật đơn hàng (alias) |
| DELETE | `/api/orders/[systemId]` | Soft delete (hủy đơn) |

### 5.3 Status Routes

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| PATCH | `/api/orders/[systemId]/status` | Chuyển trạng thái |
| POST | `/api/orders/[systemId]/cancel` | Hủy đơn hàng |

### 5.4 Payment Routes

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/orders/[systemId]/payments` | Danh sách thanh toán |
| POST | `/api/orders/[systemId]/payments` | Thêm thanh toán |

### 5.5 Packaging Routes

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/orders/[systemId]/packaging` | Danh sách phiếu đóng gói |
| POST | `/api/orders/[systemId]/packaging` | Tạo phiếu đóng gói |
| POST | `.../packaging/[packagingId]/confirm` | Xác nhận đóng gói xong |
| POST | `.../packaging/[packagingId]/cancel` | Hủy đóng gói |
| POST | `.../packaging/[packagingId]/dispatch` | Gửi hàng đi |
| POST | `.../packaging/[packagingId]/complete-delivery` | Xác nhận giao thành công |
| POST | `.../packaging/[packagingId]/failed-delivery` | Giao thất bại |
| POST | `.../packaging/[packagingId]/cancel-delivery` | Hủy giao hàng |
| POST | `.../packaging/[packagingId]/in-store-pickup` | Tạo yêu cầu nhận tại CH |
| POST | `.../packaging/[packagingId]/confirm-pickup` | Xác nhận đã nhận hàng |

### 5.6 GHTK Routes

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `.../packaging/[packagingId]/ghtk` | Đẩy đơn sang GHTK |
| POST | `.../packaging/[packagingId]/ghtk/cancel` | Hủy đơn GHTK |
| POST | `.../packaging/[packagingId]/ghtk/sync` | Đồng bộ trạng thái từ GHTK |

### 5.7 Shipment Routes

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/orders/[systemId]/shipment` | Danh sách vận đơn |
| POST | `/api/orders/[systemId]/shipment` | Tạo vận đơn |
| POST | `.../shipment/[shipmentId]/sync` | Đồng bộ trạng thái |
| POST | `.../shipment/[shipmentId]/cancel` | Hủy vận đơn |

---

## 6. SO SÁNH VỚI SAPO

### 6.1 Tính năng Sapo Omni (tham khảo)

| Tính năng | Sapo | ACME ERP | Ghi chú |
|-----------|------|----------|---------|
| Tạo đơn hàng online | ✅ | ✅ | Đã có |
| Tạo đơn tại quầy (POS) | ✅ | ⚠️ Chưa có | Cần phát triển |
| Xem chi tiết & chỉnh sửa đơn | ✅ | ✅ | Đã có |
| Sao chép đơn hàng | ✅ | ❌ | Chưa có |
| Xuất file Excel | ✅ | ❌ | Chưa có |
| In đơn hàng/hóa đơn | ✅ | ⚠️ Một phần | Cần hoàn thiện |
| Thanh toán 1 phần | ✅ | ✅ | Đã có |
| Thanh toán nhiều PTTT | ✅ | ✅ | Đã có |
| Đóng gói đơn hàng | ✅ | ✅ | Đã có |
| Đóng gói độc lập | ✅ | ✅ | Đã có |
| Gán NV đóng gói | ✅ | ✅ | Đã có |
| Đẩy đơn vận chuyển | ✅ | ✅ (GHTK) | Chỉ có GHTK |
| In vận đơn/nhãn | ✅ | ⚠️ Một phần | Cần hoàn thiện |
| Đối soát COD | ✅ | ✅ | Đã có |
| Trả hàng/Đổi hàng | ✅ | ✅ | Đã có |
| Hóa đơn điện tử | ✅ | ❌ | Chưa có |

### 6.2 Đối tác vận chuyển Sapo hỗ trợ

| Đối tác | Sapo | ACME ERP |
|---------|------|----------|
| Sapo Express | ✅ | ❌ |
| Giao Hàng Nhanh (GHN) | ✅ | ❌ |
| Giao Hàng Tiết Kiệm (GHTK) | ✅ | ✅ |
| Viettel Post | ✅ | ❌ |
| Vietnam Post | ✅ | ❌ |
| J&T Express | ✅ | ❌ |
| Ninja Van | ✅ | ❌ |
| SPX Express | ✅ | ❌ |
| AhaMove | ✅ | ❌ |
| Grab Express | ✅ | ❌ |
| Best Express | ✅ | ❌ |

### 6.3 Quy trình đóng gói Sapo (tham khảo)

Theo tài liệu Sapo:
- [Tổng quan đóng gói đơn](https://help.sapo.vn/tong-quan-dong-goi-don)
- [Bật tính năng đóng gói độc lập](https://help.sapo.vn/bat-tinh-nang-dong-goi-doc-lap)
- [Gán nhiều đơn cho 1 NV đóng gói](https://help.sapo.vn/gan-nhieu-don-hang-cho-mot-nhan-vien-dong-goi)
- [Xác nhận đã thực hiện đóng gói](https://help.sapo.vn/xac-nhan-da-thuc-hien-dong-goi-don-hang)
- [Hủy đóng gói đơn hàng](https://help.sapo.vn/huy-dong-goi-don-hang)

---

## 7. VẤN ĐỀ PERFORMANCE

### 7.1 🔴 Vấn đề nghiêm trọng

#### N+1 Query trong Order Creation

**File:** `app/api/orders/route.ts`

```typescript
// ❌ HIỆN TẠI: Mỗi line item query 1 lần
const lineItemsData = await Promise.all(
  body.lineItems.map(async (item) => {
    const product = await tx.product.findUnique({ 
      where: { systemId: productKey } 
    });
    // ...
  })
);

// ✅ GIẢI PHÁP: Batch fetch tất cả products 1 lần
const productIds = body.lineItems.map(item => item.productSystemId);
const products = await tx.product.findMany({
  where: { systemId: { in: productIds } }
});
const productMap = new Map(products.map(p => [p.systemId, p]));
```

**Impact:** Đơn hàng 10 sản phẩm = 10 queries → Giảm 90% queries

#### Over-fetching trong List API

```typescript
// ❌ HIỆN TẠI: Include toàn bộ lineItems
include: {
  lineItems: { include: { product: true } },
  payments: true,
  packagings: true,
}

// ✅ GIẢI PHÁP: Chỉ include count
select: {
  systemId: true,
  id: true,
  customerName: true,
  grandTotal: true,
  status: true,
  _count: { select: { lineItems: true } },
}
```

### 7.2 🟡 Vấn đề trung bình

#### Thiếu Database Indexes

```prisma
// Thêm vào prisma/schema/sales/order.prisma

@@index([status, orderDate])      // Filter + Sort
@@index([paymentStatus])          // Filter
@@index([deliveryStatus])         // Filter
@@index([salespersonId])          // Filter
@@index([createdAt])              // Sort
```

#### Sequential ID Generation

```typescript
// ❌ HIỆN TẠI: MAX query + retry
for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  // Generate ID, Try insert, If conflict retry
}

// ✅ GIẢI PHÁP: PostgreSQL Sequence
// CREATE SEQUENCE order_id_seq START 1;
// SELECT nextval('order_id_seq');
```

### 7.3 🟢 Vấn đề nhỏ

- Duplicate status mapping code (cần extract to shared utility)
- Mixed Vietnamese/English error messages
- Deprecated Zustand store (migrating to React Query)

---

## 8. KẾ HOẠCH TRIỂN KHAI

### Phase 1: Performance Optimization (1-2 ngày)

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| Fix N+1 query trong order creation | 🔴 High | 2h | High |
| Thêm database indexes | 🔴 High | 1h | High |
| Chuyển list API sang cursor pagination | 🟡 Medium | 2h | Medium |

### Phase 2: Code Quality (1 tuần)

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| Extract shared status mapping utilities | 🟡 Medium | 2h | Medium |
| Chuẩn hóa error messages (Vietnamese) | 🟡 Medium | 4h | Low |
| Remove deprecated Zustand store | 🟢 Low | 4h | Low |
| Add optimistic updates cho mutations | 🟡 Medium | 8h | Medium |

### Phase 3: Feature Enhancement (2-4 tuần)

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| Thêm tính năng sao chép đơn hàng | 🟡 Medium | 4h | Medium |
| Xuất file Excel đơn hàng | 🟡 Medium | 8h | Medium |
| Hoàn thiện in đơn hàng/hóa đơn | 🟡 Medium | 8h | Medium |
| Batch operations (confirm/cancel nhiều đơn) | 🟡 Medium | 8h | Medium |

### Phase 4: Carrier Integration (1-2 tháng)

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| Tích hợp GHN (Giao Hàng Nhanh) | 🟢 Low | 16h | Medium |
| Tích hợp Viettel Post | 🟢 Low | 16h | Medium |
| Tích hợp J&T Express | 🟢 Low | 16h | Low |
| Multi-carrier selection UI | 🟢 Low | 8h | Medium |

### Phase 5: Advanced Features (2-3 tháng)

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| POS module (bán tại quầy) | 🟢 Low | 40h | High |
| Hóa đơn điện tử integration | 🟢 Low | 24h | Medium |
| PostgreSQL sequences cho ID | 🟢 Low | 4h | Medium |
| Materialized views cho dashboard | 🟢 Low | 8h | Medium |

---

## 📚 TÀI LIỆU THAM KHẢO

### Sapo Help Center
- [Tổng quan quản lý đơn hàng](https://help.sapo.vn/tong-quan-cac-tinh-nang-quan-ly-don-hang-2)
- [Tổng quan vận chuyển](https://help.sapo.vn/tong-quan-van-chuyen-1)
- [Tổng quan đóng gói đơn](https://help.sapo.vn/tong-quan-dong-goi-don)
- [Tạo và duyệt đơn hàng online](https://help.sapo.vn/tao-va-duyet-don-hang-online)
- [Đẩy đơn qua đối tác vận chuyển](https://help.sapo.vn/day-don-qua-don-vi-van-chuyen)
- [Xác nhận giao hàng thủ công](https://help.sapo.vn/xac-nhan-giao-hang-thu-cong-tren-phan-mem-quan-ly-ban-hang-sapo)
- [Kết nối đối tác GHTK](https://help.sapo.vn/ket-noi-doi-tac-ghtk)

### GHTK API Documentation
- [GHTK API Docs](https://docs.giaohangtietkiem.vn/)
- Webhook events for status updates

### Internal Documentation
- [prisma/schema/sales/order.prisma](../prisma/schema/sales/order.prisma)
- [prisma/schema/operations/packaging.prisma](../prisma/schema/operations/packaging.prisma)
- [app/api/orders/](../app/api/orders/)
- [features/orders/](../features/orders/)

---

> **Ghi chú:** Tài liệu này được cập nhật định kỳ khi có thay đổi về quy trình hoặc tính năng.
