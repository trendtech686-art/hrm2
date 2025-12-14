# 🔄 SALES-RETURNS UPGRADE PLAN V2

> Tài liệu rà soát và nâng cấp chức năng Trả hàng bán (Sales Returns)
> Ngày tạo: 29/11/2025
> Trạng thái: Đang triển khai

---

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Phân tích hiện trạng](#phân-tích-hiện-trạng)
3. [Đánh giá điểm mạnh](#đánh-giá-điểm-mạnh)
4. [Vấn đề cần khắc phục](#vấn-đề-cần-khắc-phục)
5. [Prisma Schema](#prisma-schema)
6. [Business Logic](#business-logic)
7. [API Design](#api-design)
8. [React Query Hooks](#react-query-hooks)
9. [UI Components](#ui-components)
10. [Roadmap](#roadmap)

---

## 🎯 TỔNG QUAN

### Chức năng hiện tại
- Tạo phiếu trả hàng từ đơn hàng gốc
- Hỗ trợ đổi hàng (exchange) - tạo đơn mới tự động
- Quản lý thanh toán/hoàn tiền (multiple methods)
- Xác nhận nhận hàng trả về (isReceived)
- Tích hợp với Orders, Products, Customers, Cashbook
- Xử lý combo products (expand to children)
- Shipping integration cho đơn đổi

### Mục tiêu nâng cấp
- Migration từ Zustand → **Prisma + PostgreSQL**
- API-first architecture với **React Query**
- Workflow automation
- Mobile-optimized UI
- VPS deployment ready

---

## 📊 PHÂN TÍCH HIỆN TRẠNG

### A. FILE STRUCTURE

```
features/sales-returns/
├── types.ts             ✅ Good (comprehensive types)
├── store.ts             ⚠️ Complex logic, needs migration
├── page.tsx             ✅ Good (responsive, filters)
├── form-page.tsx        ⚠️ Missing (form in Orders)
├── detail-page.tsx      ✅ Good
├── columns.tsx          ✅ Good
├── data.ts              ✅ Mock data
└── components/
    └── sales-return-workflow-card.tsx ✅ Good
```

### B. TYPE DEFINITIONS (types.ts)

**✅ Điểm mạnh:**
```typescript
export type SalesReturn = {
  systemId: SystemId;
  id: BusinessId; // SR000001
  
  // Original Order Info
  orderSystemId: SystemId;
  orderId: BusinessId;
  customerSystemId: SystemId;
  branchSystemId: SystemId;
  
  // Return Items
  items: ReturnLineItem[];
  totalReturnValue: number;
  isReceived: boolean; // Inventory tracking
  
  // Exchange Items (new order)
  exchangeItems: LineItem[];
  exchangeOrderSystemId?: SystemId;
  subtotalNew: number;
  grandTotalNew: number;
  
  // Shipping for exchange
  deliveryMethod?: string;
  shippingPartnerId?: string;
  packageInfo?: any;
  
  // Financial Summary
  finalAmount: number; // + customer pays, - company refunds
  
  // Multiple payment/refund methods ✅
  refunds?: SalesReturnPayment[];
  payments?: SalesReturnPayment[];
  
  // Voucher links
  paymentVoucherSystemIds?: SystemId[]; // Refund vouchers
  receiptVoucherSystemIds?: SystemId[]; // Customer payment vouchers
  
  // Audit
  creatorSystemId: SystemId;
  createdAt?: string;
}
```

**⚠️ Cần cải thiện:**
- `reason` là string - nên dùng enum
- `shippingAddress`, `packageInfo`, `configuration` dùng `any`
- Thiếu status field (draft, processing, completed, cancelled)

### C. STORE LOGIC (store.ts)

**✅ Logic phức tạp nhưng hoàn chỉnh:**

1. **addWithSideEffects()** - Main function:
   - Tạo sales return
   - Tạo đơn đổi nếu có `exchangeItems`
   - Cập nhật customer debt
   - Tạo payment/receipt vouchers
   - Cập nhật inventory nếu `isReceived = true`
   - Xử lý combo products (expand to children)
   - Cập nhật return status của order gốc

2. **confirmReceipt()** - Inventory update:
   - Xác nhận nhận hàng trả về
   - Cập nhật tồn kho
   - Ghi stock history
   - Xử lý combo products

**❌ Vấn đề:**
- Side effects quá nhiều trong 1 function
- Không có transaction handling
- Error handling yếu
- Khó test và maintain

### D. UI (page.tsx)

**✅ Điểm mạnh:**
- Responsive với mobile card view
- Filters: branch, status
- Export support
- Column customization
- Mobile infinite scroll

**⚠️ Thiếu:**
- Form để tạo return (hiện tại tạo từ Orders)
- Batch operations
- Print support
- Status filters chi tiết

---

## 💪 ĐÁNH GIÁ ĐIỂM MẠNH

### 1. Business Logic Excellence
- ✅ **Exchange flow hoàn chỉnh:** Tự động tạo order mới với proper status
- ✅ **Multiple payment methods:** Hỗ trợ nhiều phương thức thanh toán/hoàn tiền
- ✅ **Inventory tracking:** Flag `isReceived` để quản lý nhận hàng
- ✅ **Combo handling:** Tự động expand combo thành child products
- ✅ **Financial integration:** Tự động tạo vouchers liên kết

### 2. Data Model
- ✅ Dual-ID pattern
- ✅ Comprehensive fields
- ✅ Proper relations
- ✅ Audit trail

### 3. Exchange Order Creation
```typescript
// ✅ Smart status based on delivery method
let finalMainStatus: 'Đặt hàng' | 'Đang giao dịch' = 'Đặt hàng';
let finalDeliveryStatus: string = 'Chờ đóng gói';

if (isPickup) {
  // Nhận tại cửa hàng
  finalMainStatus = 'Đang giao dịch';
  finalDeliveryStatus = 'Chờ đóng gói';
} else if (isShippingPartner) {
  // Giao hàng qua partner
  finalMainStatus = 'Đang giao dịch';
  finalDeliveryStatus = 'Chờ lấy hàng';
}
```

---

## ⚠️ VẤN ĐỀ CẦN KHẮC PHỤC

### 1. Architecture Issues

**❌ Problem:** Monolithic `addWithSideEffects()`
**✅ Solution:** Split into smaller services
```typescript
// Separate services
class SalesReturnService {
  async create(data: CreateSalesReturnDto): Promise<SalesReturn> { }
  async confirmReceipt(id: string): Promise<void> { }
}

class ExchangeOrderService {
  async createFromReturn(returnId: string): Promise<Order> { }
}

class ReturnFinancialService {
  async processRefunds(returnId: string): Promise<PaymentVoucher[]> { }
  async processPayments(returnId: string): Promise<ReceiptVoucher[]> { }
}

class ReturnInventoryService {
  async updateStock(returnId: string): Promise<void> { }
}
```

### 2. Missing Status Field

**❌ Problem:** Không có status field
**✅ Solution:** Add status workflow
```typescript
type SalesReturnStatus = 
  | 'draft'       // Phiếu nháp
  | 'pending'     // Chờ xử lý
  | 'approved'    // Đã duyệt
  | 'received'    // Đã nhận hàng
  | 'completed'   // Hoàn thành
  | 'cancelled'   // Đã hủy

// Status transitions
draft → pending → approved → received → completed
                          ↘ cancelled
```

### 3. Transaction Safety

**❌ Problem:** Không có transaction handling
**✅ Solution:** Use Prisma transactions
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Create sales return
  const salesReturn = await tx.salesReturn.create({ ... });
  
  // 2. Create exchange order if needed
  if (exchangeItems.length > 0) {
    const exchangeOrder = await tx.order.create({ ... });
    await tx.salesReturn.update({
      where: { id: salesReturn.id },
      data: { exchangeOrderId: exchangeOrder.id }
    });
  }
  
  // 3. Update inventory
  for (const item of items) {
    await tx.product.update({
      where: { id: item.productId },
      data: {
        inventoryByBranch: { /* update */ }
      }
    });
  }
  
  // 4. Create vouchers
  await tx.paymentVoucher.createMany({ ... });
  
  // 5. Update customer debt
  await tx.customer.update({ ... });
});
```

### 4. Form UX

**❌ Problem:** Tạo return từ Order detail - không intuitive
**✅ Solution:** Dedicated return form page
```
/sales-returns/new?orderId=DH0001
- Select return items from order
- Specify return reasons
- Add exchange items (optional)
- Choose payment/refund methods
- Preview before submit
```

---

## 🗄️ PRISMA SCHEMA

```prisma
// ========================================
// ENUM DEFINITIONS
// ========================================

enum SalesReturnStatus {
  DRAFT       // Phiếu nháp
  PENDING     // Chờ xử lý
  APPROVED    // Đã duyệt
  RECEIVED    // Đã nhận hàng
  COMPLETED   // Hoàn thành
  CANCELLED   // Đã hủy
}

enum ReturnReason {
  WRONG_PRODUCT      // Giao sai sản phẩm
  DAMAGED            // Hàng bị hỏng
  DEFECTIVE          // Hàng lỗi
  NOT_AS_DESCRIBED   // Không đúng mô tả
  CHANGE_OF_MIND     // Đổi ý
  SIZE_ISSUE         // Sai size
  COLOR_ISSUE        // Sai màu
  EXPIRED            // Hết hạn
  OTHER              // Lý do khác
}

// ========================================
// SALES RETURN MODEL
// ========================================

model SalesReturn {
  // ✅ Primary Keys
  id                    String              @id @default(cuid())
  systemId              String              @unique @default(cuid())
  businessId            String              @unique // SR000001
  referenceCode         String?             // External reference
  
  // ✅ Original Order
  orderId               String
  order                 Order               @relation("OrderReturns", fields: [orderId], references: [id])
  
  // ✅ Customer & Branch
  customerId            String
  customer              Customer            @relation(fields: [customerId], references: [id])
  branchId              String
  branch                Branch              @relation(fields: [branchId], references: [id])
  
  // ✅ Status & Dates
  status                SalesReturnStatus   @default(PENDING)
  returnDate            DateTime            @default(now())
  approvedDate          DateTime?
  receivedDate          DateTime?
  completedDate         DateTime?
  cancelledDate         DateTime?
  
  // ✅ Return Info
  reason                ReturnReason?
  reasonNote            String?             // Chi tiết lý do
  note                  String?             // Ghi chú ngắn
  notes                 String?             // Ghi chú chi tiết
  
  // ✅ Return Items
  items                 SalesReturnItem[]
  totalReturnValue      Decimal             @default(0) @db.Decimal(15, 2)
  totalReturnQuantity   Int                 @default(0)
  isReceived            Boolean             @default(false)
  
  // ✅ Exchange Order (if any)
  exchangeOrderId       String?             @unique
  exchangeOrder         Order?              @relation("OrderExchange", fields: [exchangeOrderId], references: [id])
  exchangeItems         SalesReturnExchangeItem[]
  subtotalNew           Decimal             @default(0) @db.Decimal(15, 2)
  shippingFeeNew        Decimal             @default(0) @db.Decimal(15, 2)
  discountNew           Decimal?            @db.Decimal(15, 2)
  discountNewType       DiscountType?
  grandTotalNew         Decimal             @default(0) @db.Decimal(15, 2)
  
  // ✅ Shipping Info (for exchange order)
  deliveryMethod        String?             // pickup, shipping
  shippingPartnerId     String?
  shippingPartner       ShippingPartner?    @relation(fields: [shippingPartnerId], references: [id])
  shippingServiceId     String?
  shippingAddress       Json?               // Address object
  packageInfo           Json?               // Weight, dimensions, tracking
  configuration         Json?               // Shipping config
  
  // ✅ Financial Summary
  finalAmount           Decimal             @default(0) @db.Decimal(15, 2)
  // Positive: customer pays difference
  // Negative: company refunds to customer
  
  // ✅ Payment/Refund Methods
  refunds               SalesReturnRefund[]
  payments              SalesReturnPayment[]
  
  // ✅ Voucher Links
  paymentVouchers       PaymentVoucher[]    // Company refunds
  receiptVouchers       ReceiptVoucher[]    // Customer payments
  
  // ✅ Workflow Tracking
  createdById           String
  createdBy             Employee            @relation("SalesReturnCreatedBy", fields: [createdById], references: [id])
  approvedById          String?
  approvedBy            Employee?           @relation("SalesReturnApprovedBy", fields: [approvedById], references: [id])
  receivedById          String?
  receivedBy            Employee?           @relation("SalesReturnReceivedBy", fields: [receivedById], references: [id])
  cancelledById         String?
  cancelledBy           Employee?           @relation("SalesReturnCancelledBy", fields: [cancelledById], references: [id])
  cancelReason          String?
  
  // ✅ Audit Fields
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
  deletedAt             DateTime?
  isDeleted             Boolean             @default(false)
  
  @@index([businessId])
  @@index([orderId])
  @@index([customerId])
  @@index([branchId])
  @@index([status])
  @@index([returnDate])
  @@index([isDeleted])
  @@map("sales_returns")
}

// ========================================
// SALES RETURN ITEM
// ========================================

model SalesReturnItem {
  id                String        @id @default(cuid())
  salesReturnId     String
  salesReturn       SalesReturn   @relation(fields: [salesReturnId], references: [id], onDelete: Cascade)
  
  productId         String
  product           Product       @relation(fields: [productId], references: [id])
  
  returnQuantity    Int
  unitPrice         Decimal       @db.Decimal(15, 2)
  totalValue        Decimal       @db.Decimal(15, 2)
  note              String?
  
  // Track which order line item this is from
  orderLineItemId   String?
  
  @@index([salesReturnId])
  @@index([productId])
  @@map("sales_return_items")
}

// ========================================
// SALES RETURN EXCHANGE ITEM
// ========================================

model SalesReturnExchangeItem {
  id                String        @id @default(cuid())
  salesReturnId     String
  salesReturn       SalesReturn   @relation(fields: [salesReturnId], references: [id], onDelete: Cascade)
  
  productId         String
  product           Product       @relation(fields: [productId], references: [id])
  
  quantity          Int
  unitPrice         Decimal       @db.Decimal(15, 2)
  discount          Decimal?      @db.Decimal(15, 2)
  discountType      DiscountType?
  totalPrice        Decimal       @db.Decimal(15, 2)
  note              String?
  
  @@index([salesReturnId])
  @@index([productId])
  @@map("sales_return_exchange_items")
}

// ========================================
// PAYMENT/REFUND RECORDS
// ========================================

model SalesReturnRefund {
  id                String        @id @default(cuid())
  salesReturnId     String
  salesReturn       SalesReturn   @relation(fields: [salesReturnId], references: [id], onDelete: Cascade)
  
  method            String        // Tiền mặt, Chuyển khoản, etc.
  accountId         String?
  account           CashAccount?  @relation(fields: [accountId], references: [id])
  amount            Decimal       @db.Decimal(15, 2)
  
  paymentVoucherId  String?       @unique
  paymentVoucher    PaymentVoucher? @relation(fields: [paymentVoucherId], references: [id])
  
  createdAt         DateTime      @default(now())
  
  @@index([salesReturnId])
  @@map("sales_return_refunds")
}

model SalesReturnPayment {
  id                String        @id @default(cuid())
  salesReturnId     String
  salesReturn       SalesReturn   @relation(fields: [salesReturnId], references: [id], onDelete: Cascade)
  
  method            String        // Tiền mặt, Chuyển khoản, etc.
  accountId         String?
  account           CashAccount?  @relation(fields: [accountId], references: [id])
  amount            Decimal       @db.Decimal(15, 2)
  
  receiptVoucherId  String?       @unique
  receiptVoucher    ReceiptVoucher? @relation(fields: [receiptVoucherId], references: [id])
  
  createdAt         DateTime      @default(now())
  
  @@index([salesReturnId])
  @@map("sales_return_payments")
}

// ========================================
// UPDATES TO EXISTING MODELS
// ========================================

// Add to Order model:
model Order {
  // ... existing fields
  
  // Returns linked to this order
  returns           SalesReturn[]   @relation("OrderReturns")
  
  // Exchange order from a return
  sourceReturn      SalesReturn?    @relation("OrderExchange")
  
  // Return status
  returnStatus      OrderReturnStatus @default(NO_RETURN)
}

enum OrderReturnStatus {
  NO_RETURN           // Chưa trả hàng
  PARTIAL_RETURN      // Trả hàng một phần
  FULL_RETURN         // Trả hàng toàn bộ
}

// Add to Product model:
model Product {
  // ... existing fields
  
  returnItems       SalesReturnItem[]
  exchangeItems     SalesReturnExchangeItem[]
}

// Add to Customer model:
model Customer {
  // ... existing fields
  
  salesReturns      SalesReturn[]
  
  // Statistics
  totalReturns      Int             @default(0)
  totalReturnValue  Decimal         @default(0) @db.Decimal(15, 2)
  returnRate        Decimal?        @db.Decimal(5, 2) // Percentage
}
```

---

## 🧠 BUSINESS LOGIC

### Return Process Flow

```typescript
// ========================================
// STATUS WORKFLOW
// ========================================

/*
  DRAFT → PENDING → APPROVED → RECEIVED → COMPLETED
                             ↘ CANCELLED

  1. DRAFT: Employee creates return, can edit
  2. PENDING: Submitted for approval
  3. APPROVED: Manager approved, waiting for items
  4. RECEIVED: Items received, inventory updated
  5. COMPLETED: Financial settlement done
  6. CANCELLED: Return cancelled (any stage before RECEIVED)
*/

class SalesReturnStateMachine {
  canTransition(from: Status, to: Status): boolean {
    const allowed = {
      DRAFT: ['PENDING', 'CANCELLED'],
      PENDING: ['APPROVED', 'CANCELLED'],
      APPROVED: ['RECEIVED', 'CANCELLED'],
      RECEIVED: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    };
    return allowed[from]?.includes(to) ?? false;
  }
}

// ========================================
// RETURN CREATION
// ========================================

class SalesReturnService {
  async create(dto: CreateSalesReturnDto): Promise<SalesReturn> {
    return await prisma.$transaction(async (tx) => {
      // 1. Validate original order
      const order = await tx.order.findUnique({
        where: { id: dto.orderId },
        include: { lineItems: true }
      });
      
      if (!order) throw new Error('Order not found');
      if (order.status === 'CANCELLED') throw new Error('Cannot return cancelled order');
      
      // 2. Validate return items
      await this.validateReturnItems(dto.items, order.lineItems);
      
      // 3. Create sales return
      const salesReturn = await tx.salesReturn.create({
        data: {
          businessId: await this.generateBusinessId(),
          orderId: order.id,
          customerId: order.customerId,
          branchId: dto.branchId,
          status: dto.submitForApproval ? 'PENDING' : 'DRAFT',
          reason: dto.reason,
          reasonNote: dto.reasonNote,
          note: dto.note,
          items: {
            create: dto.items.map(item => ({
              productId: item.productId,
              returnQuantity: item.quantity,
              unitPrice: item.unitPrice,
              totalValue: item.quantity * item.unitPrice,
              note: item.note,
            }))
          },
          totalReturnValue: dto.items.reduce((sum, item) => 
            sum + (item.quantity * item.unitPrice), 0
          ),
          totalReturnQuantity: dto.items.reduce((sum, item) => 
            sum + item.quantity, 0
          ),
          createdById: dto.createdById,
        },
        include: {
          items: { include: { product: true } },
          order: true,
          customer: true,
        }
      });
      
      // 4. Update order return status
      await this.updateOrderReturnStatus(tx, order.id);
      
      return salesReturn;
    });
  }
  
  // ========================================
  // APPROVAL
  // ========================================
  
  async approve(id: string, approverId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const salesReturn = await tx.salesReturn.findUnique({
        where: { id },
        include: { exchangeItems: true }
      });
      
      if (!salesReturn) throw new Error('Sales return not found');
      if (salesReturn.status !== 'PENDING') {
        throw new Error('Only PENDING returns can be approved');
      }
      
      // Update status
      await tx.salesReturn.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedById: approverId,
          approvedDate: new Date(),
        }
      });
      
      // Create exchange order if needed
      if (salesReturn.exchangeItems.length > 0) {
        await this.createExchangeOrder(tx, salesReturn);
      }
    });
  }
  
  // ========================================
  // RECEIVE ITEMS
  // ========================================
  
  async receiveItems(id: string, receiverId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const salesReturn = await tx.salesReturn.findUnique({
        where: { id },
        include: {
          items: { include: { product: true } },
          branch: true,
        }
      });
      
      if (!salesReturn) throw new Error('Sales return not found');
      if (salesReturn.status !== 'APPROVED') {
        throw new Error('Only APPROVED returns can be received');
      }
      
      // Update status
      await tx.salesReturn.update({
        where: { id },
        data: {
          status: 'RECEIVED',
          isReceived: true,
          receivedById: receiverId,
          receivedDate: new Date(),
        }
      });
      
      // Update inventory
      for (const item of salesReturn.items) {
        await this.updateInventory(tx, {
          productId: item.productId,
          branchId: salesReturn.branchId,
          quantity: item.returnQuantity,
          salesReturn,
        });
      }
      
      // Create stock history
      await this.createStockHistory(tx, salesReturn, receiverId);
    });
  }
  
  // ========================================
  // COMPLETE (FINANCIAL SETTLEMENT)
  // ========================================
  
  async complete(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const salesReturn = await tx.salesReturn.findUnique({
        where: { id },
        include: {
          refunds: true,
          payments: true,
        }
      });
      
      if (!salesReturn) throw new Error('Sales return not found');
      if (salesReturn.status !== 'RECEIVED') {
        throw new Error('Only RECEIVED returns can be completed');
      }
      
      // Process refunds
      if (salesReturn.finalAmount < 0) {
        await this.processRefunds(tx, salesReturn);
      }
      
      // Process payments
      if (salesReturn.finalAmount > 0) {
        await this.processPayments(tx, salesReturn);
      }
      
      // Update customer stats
      await this.updateCustomerStats(tx, salesReturn);
      
      // Update status
      await tx.salesReturn.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedDate: new Date(),
        }
      });
    });
  }
}
```

---

## 🔌 API DESIGN

```typescript
// app/api/sales-returns/route.ts
// GET  /api/sales-returns - List returns with filters
// POST /api/sales-returns - Create return

// app/api/sales-returns/[id]/route.ts
// GET    /api/sales-returns/[id] - Get return details
// PATCH  /api/sales-returns/[id] - Update return (draft only)
// DELETE /api/sales-returns/[id] - Cancel return

// app/api/sales-returns/[id]/approve/route.ts
// POST /api/sales-returns/[id]/approve - Approve return

// app/api/sales-returns/[id]/receive/route.ts
// POST /api/sales-returns/[id]/receive - Receive items

// app/api/sales-returns/[id]/complete/route.ts
// POST /api/sales-returns/[id]/complete - Complete settlement

// app/api/sales-returns/[id]/cancel/route.ts
// POST /api/sales-returns/[id]/cancel - Cancel return
```

---

## ⚛️ REACT QUERY HOOKS

```typescript
// lib/api/sales-returns.ts

export const useSalesReturns = (filters?: SalesReturnFilters) => {
  return useQuery({
    queryKey: ['sales-returns', filters],
    queryFn: () => salesReturnsApi.getAll(filters),
  });
};

export const useSalesReturn = (id: string) => {
  return useQuery({
    queryKey: ['sales-returns', id],
    queryFn: () => salesReturnsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSalesReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: salesReturnsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-returns'] });
    },
  });
};

export const useApproveSalesReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => 
      salesReturnsApi.approve(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-returns'] });
      queryClient.invalidateQueries({ queryKey: ['sales-returns', variables.id] });
    },
  });
};
```

---

## 🗺️ ROADMAP

### Phase 1: Schema & Migration (Week 1)
- [ ] Design Prisma schema
- [ ] Create migrations
- [ ] Migrate existing data
- [ ] Test data integrity

### Phase 2: API Development (Week 2)
- [ ] Implement CRUD endpoints
- [ ] Add workflow endpoints (approve, receive, complete)
- [ ] Add validation
- [ ] Write tests

### Phase 3: Service Layer (Week 3)
- [ ] Implement SalesReturnService
- [ ] Implement ExchangeOrderService
- [ ] Implement FinancialService
- [ ] Implement InventoryService

### Phase 4: Frontend (Week 4)
- [ ] Create return form page
- [ ] Add status badges
- [ ] Improve workflow UI
- [ ] Add print templates

### Phase 5: Testing (Week 5)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing

---

**Ngày cập nhật:** 29/11/2025
**Trạng thái:** Đang triển khai
