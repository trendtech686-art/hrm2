# 📦 STOCK-TRANSFERS UPGRADE PLAN V2

> Tài liệu rà soát và nâng cấp chức năng Chuyển kho (Stock Transfers)
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
- Tạo phiếu chuyển kho giữa các chi nhánh
- Quản lý trạng thái: pending → transferring → completed/cancelled
- Xác nhận xuất kho (từ chi nhánh chuyển)
- Xác nhận nhận kho (tại chi nhánh nhận)
- Tracking hàng đang về (inTransitByBranch)
- Hủy phiếu với rollback inventory
- Tích hợp với Products, Stock History

### Mục tiêu nâng cấp
- Migration từ Zustand → **Prisma + PostgreSQL**
- Real-time tracking
- Multi-approver workflow
- Cost allocation
- Mobile scanning support
- VPS deployment ready

---

## 📊 PHÂN TÍCH HIỆN TRẠNG

### A. FILE STRUCTURE

```
features/stock-transfers/
├── types.ts             ✅ Good (clear state machine)
├── store.ts             ✅ Excellent logic
├── page.tsx             ✅ Good (responsive, filters)
├── form-page.tsx        ✅ Good
├── edit-page.tsx        ✅ Good
├── detail-page.tsx      ✅ Good
├── columns.tsx          ✅ Good
├── data.ts              ✅ Mock data
├── stock-transfer-card.tsx ✅ Good
└── components/
    └── stock-transfer-workflow-card.tsx ✅ Good
```

### B. TYPE DEFINITIONS (types.ts)

**✅ Điểm mạnh:**
```typescript
export type StockTransferStatus = 
  | 'pending'       // Chờ chuyển (vừa tạo, chưa ảnh hưởng tồn kho)
  | 'transferring'  // Đang chuyển (đã xuất kho, hàng trên đường)
  | 'completed'     // Hoàn thành (đã nhận hàng)
  | 'cancelled'     // Đã hủy

export interface StockTransfer {
  systemId: SystemId;
  id: BusinessId; // PCK001
  referenceCode?: string; // Mã tham chiếu ngoài
  
  // Chi nhánh chuyển/nhận
  fromBranchSystemId: SystemId;
  fromBranchName: string;
  toBranchSystemId: SystemId;
  toBranchName: string;
  
  status: StockTransferStatus;
  items: StockTransferItem[];
  
  // Workflow tracking
  createdDate: string;
  createdBySystemId: SystemId;
  createdByName: string;
  
  transferredDate?: string;
  transferredBySystemId?: SystemId;
  transferredByName?: string;
  
  receivedDate?: string;
  receivedBySystemId?: SystemId;
  receivedByName?: string;
  
  cancelledDate?: string;
  cancelledBySystemId?: SystemId;
  cancelledByName?: string;
  cancelReason?: string;
  
  note?: string;
}

export interface StockTransferItem {
  productSystemId: SystemId;
  productId: BusinessId;
  productName: string;
  quantity: number;
  receivedQuantity?: number; // Số lượng thực nhận
  note?: string;
}
```

**⚠️ Cần cải thiện:**
- Thiếu cost tracking (transfer cost, transportation fee)
- Thiếu approval workflow (chỉ có creator/receiver)
- Thiếu tracking số (shipment/vehicle info)
- `receivedQuantity` chỉ có ở item level - nên có status cho từng item

### C. STORE LOGIC (store.ts)

**✅ Logic workflow hoàn hảo:**

1. **add()** - Create transfer:
   - Status = 'pending'
   - Chưa ảnh hưởng inventory

2. **confirmTransfer()** - Xuất kho:
   ```typescript
   // Pending → Transferring
   // - Giảm inventoryByBranch (chi nhánh chuyển)
   // - Tăng inTransitByBranch (chi nhánh nhận)
   // - Ghi stock history
   ```

3. **confirmReceive()** - Nhập kho:
   ```typescript
   // Transferring → Completed
   // - Giảm inTransitByBranch (chi nhánh nhận)
   // - Tăng inventoryByBranch (chi nhánh nhận)
   // - Support partial receiving (receivedQuantity)
   // - Ghi stock history
   ```

4. **cancelTransfer()** - Hủy phiếu:
   ```typescript
   // Pending → Cancelled: Chỉ update status
   // Transferring → Cancelled: Rollback inventory
   //   - Giảm inTransitByBranch
   //   - Tăng inventoryByBranch (chi nhánh chuyển)
   ```

**✅ Điểm mạnh:**
- State machine rõ ràng
- Inventory tracking chính xác
- Rollback logic đúng
- Stock history integration

**⚠️ Thiếu:**
- Transaction handling
- Error handling
- Approval workflow
- Cost tracking

### D. UI COMPONENTS

**✅ page.tsx - Good:**
- Responsive data table
- Filters: fromBranch, toBranch, status, date
- Mobile card view
- Column customization
- Export support

**✅ form-page.tsx - Good:**
- Product selection with stock display
- Quantity validation
- Branch selection
- Reference code support

**✅ detail-page.tsx - Good:**
- Workflow timeline
- Item details
- Action buttons based on status
- Mobile-friendly

**⚠️ Thiếu:**
- Barcode scanning
- Batch operations
- Print templates
- Real-time tracking

---

## 💪 ĐÁNH GIÁ ĐIỂM MẠNH

### 1. State Machine Excellence
```
pending → transferring → completed
                      ↘ cancelled

✅ Clear transitions
✅ Proper inventory tracking at each stage
✅ Rollback support
```

### 2. Inventory Logic
```typescript
// ✅ 3-stage inventory flow
1. pending:       No inventory change
2. transferring:  From inventory → In transit
3. completed:     In transit → To inventory
4. cancelled:     Rollback if transferring
```

### 3. Data Integrity
- ✅ Dual-ID pattern
- ✅ Proper relations (branches, products, employees)
- ✅ Audit trail
- ✅ Stock history integration

### 4. Partial Receiving
```typescript
// ✅ Support partial receiving
const updatedItems = transfer.items.map(item => {
  const received = receivedItems?.find(r => r.productSystemId === item.productSystemId);
  return {
    ...item,
    receivedQuantity: received?.receivedQuantity ?? item.quantity,
  };
});
```

---

## ⚠️ VẤN ĐỀ CẦN KHẮC PHỤC

### 1. Missing Approval Workflow

**❌ Problem:** Chỉ có creator và receiver, không có approval
**✅ Solution:** Add multi-level approval
```typescript
type StockTransferStatus = 
  | 'draft'           // Phiếu nháp
  | 'pending'         // Chờ duyệt
  | 'approved'        // Đã duyệt
  | 'transferring'    // Đang chuyển
  | 'in_transit'      // Đang vận chuyển
  | 'arrived'         // Đã đến nơi
  | 'completed'       // Hoàn thành
  | 'cancelled'       // Đã hủy

// Workflow
draft → pending → approved → transferring → in_transit → arrived → completed
                          ↘ cancelled
```

### 2. No Cost Tracking

**❌ Problem:** Không track chi phí vận chuyển
**✅ Solution:** Add cost fields
```typescript
interface StockTransfer {
  // ... existing fields
  
  // ✅ Cost tracking
  transferCost: number;        // Chi phí vận chuyển
  packagingCost: number;       // Chi phí đóng gói
  insuranceCost: number;       // Chi phí bảo hiểm
  otherCosts: number;          // Chi phí khác
  totalCost: number;           // Tổng chi phí
  costAllocation: 'from' | 'to' | 'split'; // Ai chịu phí
}
```

### 3. No Tracking Info

**❌ Problem:** Không có thông tin vận chuyển
**✅ Solution:** Add shipment tracking
```typescript
interface StockTransfer {
  // ... existing fields
  
  // ✅ Shipment info
  vehicleNumber?: string;      // Biển số xe
  driverName?: string;         // Tên tài xế
  driverPhone?: string;        // SĐT tài xế
  estimatedArrival?: Date;     // Dự kiến đến
  actualArrival?: Date;        // Thực tế đến
  trackingNumber?: string;     // Mã vận đơn (nếu ship)
}
```

### 4. No Transaction Safety

**❌ Problem:** Không có transaction handling
**✅ Solution:** Use Prisma transactions
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Update transfer status
  await tx.stockTransfer.update({...});
  
  // 2. Update product inventory
  await tx.product.update({...});
  
  // 3. Create stock history
  await tx.stockHistory.create({...});
  
  // 4. Update branch inventory summary
  await tx.branch.update({...});
});
```

### 5. No Item-Level Status

**❌ Problem:** Chỉ có receivedQuantity, không có status từng item
**✅ Solution:** Add item status
```typescript
type TransferItemStatus = 
  | 'pending'     // Chờ xuất
  | 'packed'      // Đã đóng gói
  | 'shipped'     // Đã xuất kho
  | 'received'    // Đã nhận
  | 'damaged'     // Hư hỏng
  | 'missing'     // Thiếu hàng

interface StockTransferItem {
  // ... existing fields
  status: TransferItemStatus;
  damagedQuantity?: number;
  missingQuantity?: number;
  note?: string;
}
```

---

## 🗄️ PRISMA SCHEMA

```prisma
// ========================================
// ENUM DEFINITIONS
// ========================================

enum StockTransferStatus {
  DRAFT           // Phiếu nháp
  PENDING         // Chờ duyệt
  APPROVED        // Đã duyệt
  TRANSFERRING    // Đang xuất kho
  IN_TRANSIT      // Đang vận chuyển
  ARRIVED         // Đã đến nơi
  COMPLETED       // Hoàn thành
  CANCELLED       // Đã hủy
}

enum TransferItemStatus {
  PENDING         // Chờ xuất
  PACKED          // Đã đóng gói
  SHIPPED         // Đã xuất kho
  IN_TRANSIT      // Đang vận chuyển
  ARRIVED         // Đã đến nơi
  RECEIVED        // Đã nhận
  DAMAGED         // Hư hỏng
  MISSING         // Thiếu hàng
}

enum CostAllocation {
  FROM_BRANCH     // Chi nhánh chuyển chịu phí
  TO_BRANCH       // Chi nhánh nhận chịu phí
  SPLIT           // Chia đôi
  COMPANY         // Công ty chịu
}

// ========================================
// STOCK TRANSFER MODEL
// ========================================

model StockTransfer {
  // ✅ Primary Keys
  id                    String                    @id @default(cuid())
  systemId              String                    @unique @default(cuid())
  businessId            String                    @unique // PCK000001
  referenceCode         String?                   // Mã tham chiếu ngoài
  
  // ✅ Branches
  fromBranchId          String
  fromBranch            Branch                    @relation("TransfersFrom", fields: [fromBranchId], references: [id])
  toBranchId            String
  toBranch              Branch                    @relation("TransfersTo", fields: [toBranchId], references: [id])
  
  // ✅ Status & Priority
  status                StockTransferStatus       @default(DRAFT)
  priority              Int                       @default(0) // 0=Normal, 1=High, 2=Urgent
  
  // ✅ Items
  items                 StockTransferItem[]
  totalQuantity         Int                       @default(0)
  totalValue            Decimal                   @default(0) @db.Decimal(15, 2)
  
  // ✅ Cost Tracking
  transferCost          Decimal                   @default(0) @db.Decimal(15, 2)
  packagingCost         Decimal                   @default(0) @db.Decimal(15, 2)
  insuranceCost         Decimal                   @default(0) @db.Decimal(15, 2)
  otherCosts            Decimal                   @default(0) @db.Decimal(15, 2)
  totalCost             Decimal                   @default(0) @db.Decimal(15, 2)
  costAllocation        CostAllocation            @default(COMPANY)
  
  // ✅ Shipment Info
  vehicleNumber         String?                   // Biển số xe
  driverName            String?
  driverPhone           String?
  estimatedArrival      DateTime?
  actualArrival         DateTime?
  trackingNumber        String?                   // Mã vận đơn
  
  // ✅ Workflow Dates & People
  createdDate           DateTime                  @default(now())
  createdById           String
  createdBy             Employee                  @relation("TransferCreatedBy", fields: [createdById], references: [id])
  
  approvedDate          DateTime?
  approvedById          String?
  approvedBy            Employee?                 @relation("TransferApprovedBy", fields: [approvedById], references: [id])
  
  transferredDate       DateTime?                 // Ngày xuất kho
  transferredById       String?
  transferredBy         Employee?                 @relation("TransferTransferredBy", fields: [transferredById], references: [id])
  
  shippedDate           DateTime?                 // Ngày giao hàng
  shippedById           String?
  shippedBy             Employee?                 @relation("TransferShippedBy", fields: [shippedById], references: [id])
  
  arrivedDate           DateTime?                 // Ngày đến nơi
  
  receivedDate          DateTime?                 // Ngày nhận hàng
  receivedById          String?
  receivedBy            Employee?                 @relation("TransferReceivedBy", fields: [receivedById], references: [id])
  
  completedDate         DateTime?                 // Ngày hoàn thành
  completedById         String?
  completedBy           Employee?                 @relation("TransferCompletedBy", fields: [completedById], references: [id])
  
  cancelledDate         DateTime?
  cancelledById         String?
  cancelledBy           Employee?                 @relation("TransferCancelledBy", fields: [cancelledById], references: [id])
  cancelReason          String?
  
  // ✅ Notes
  note                  String?                   // Ghi chú chung
  fromBranchNote        String?                   // Ghi chú chi nhánh chuyển
  toBranchNote          String?                   // Ghi chú chi nhánh nhận
  
  // ✅ Attachments
  attachments           StockTransferAttachment[]
  
  // ✅ Audit Fields
  createdAt             DateTime                  @default(now())
  updatedAt             DateTime                  @updatedAt
  deletedAt             DateTime?
  isDeleted             Boolean                   @default(false)
  
  @@index([businessId])
  @@index([fromBranchId])
  @@index([toBranchId])
  @@index([status])
  @@index([createdDate])
  @@index([priority])
  @@index([isDeleted])
  @@map("stock_transfers")
}

// ========================================
// STOCK TRANSFER ITEM
// ========================================

model StockTransferItem {
  id                    String                @id @default(cuid())
  stockTransferId       String
  stockTransfer         StockTransfer         @relation(fields: [stockTransferId], references: [id], onDelete: Cascade)
  
  productId             String
  product               Product               @relation(fields: [productId], references: [id])
  
  // ✅ Quantities
  quantity              Int                   // Số lượng chuyển
  receivedQuantity      Int                   @default(0) // Số lượng thực nhận
  damagedQuantity       Int                   @default(0) // Số lượng hư hỏng
  missingQuantity       Int                   @default(0) // Số lượng thiếu
  
  // ✅ Status
  status                TransferItemStatus    @default(PENDING)
  
  // ✅ Value
  unitCost              Decimal               @db.Decimal(15, 2) // Giá vốn
  totalValue            Decimal               @db.Decimal(15, 2)
  
  // ✅ Tracking
  packedDate            DateTime?             // Ngày đóng gói
  packedById            String?
  packedBy              Employee?             @relation(fields: [packedById], references: [id])
  
  // ✅ Notes
  note                  String?
  fromBranchNote        String?               // Ghi chú từ chi nhánh chuyển
  toBranchNote          String?               // Ghi chú từ chi nhánh nhận
  damageNote            String?               // Lý do hư hỏng
  
  @@index([stockTransferId])
  @@index([productId])
  @@index([status])
  @@map("stock_transfer_items")
}

// ========================================
// ATTACHMENTS
// ========================================

model StockTransferAttachment {
  id                String          @id @default(cuid())
  stockTransferId   String
  stockTransfer     StockTransfer   @relation(fields: [stockTransferId], references: [id], onDelete: Cascade)
  
  fileName          String
  fileUrl           String
  fileSize          Int
  mimeType          String
  description       String?
  
  uploadedAt        DateTime        @default(now())
  uploadedById      String?
  uploadedBy        Employee?       @relation(fields: [uploadedById], references: [id])
  
  @@index([stockTransferId])
  @@map("stock_transfer_attachments")
}

// ========================================
// UPDATES TO EXISTING MODELS
// ========================================

// Add to Branch model:
model Branch {
  // ... existing fields
  
  // Transfers from this branch
  transfersFrom     StockTransfer[]  @relation("TransfersFrom")
  
  // Transfers to this branch
  transfersTo       StockTransfer[]  @relation("TransfersTo")
  
  // Statistics
  totalTransfersOut Int              @default(0)
  totalTransfersIn  Int              @default(0)
  totalTransferCost Decimal          @default(0) @db.Decimal(15, 2)
}

// Add to Product model:
model Product {
  // ... existing fields
  
  transferItems     StockTransferItem[]
  
  // Per-branch inventory (existing)
  inventoryByBranch Json // { "branch1": { inventory: 100, committed: 20, inTransit: 10 } }
}

// Add to Employee model:
model Employee {
  // ... existing fields
  
  createdTransfers      StockTransfer[] @relation("TransferCreatedBy")
  approvedTransfers     StockTransfer[] @relation("TransferApprovedBy")
  transferredTransfers  StockTransfer[] @relation("TransferTransferredBy")
  shippedTransfers      StockTransfer[] @relation("TransferShippedBy")
  receivedTransfers     StockTransfer[] @relation("TransferReceivedBy")
  completedTransfers    StockTransfer[] @relation("TransferCompletedBy")
  cancelledTransfers    StockTransfer[] @relation("TransferCancelledBy")
  packedItems           StockTransferItem[]
  uploadedAttachments   StockTransferAttachment[]
}
```

---

## 🧠 BUSINESS LOGIC

### Transfer Workflow

```typescript
// ========================================
// STATUS WORKFLOW
// ========================================

/*
  DRAFT → PENDING → APPROVED → TRANSFERRING → IN_TRANSIT → ARRIVED → COMPLETED
                             ↘ CANCELLED

  1. DRAFT: Employee creates, can edit
  2. PENDING: Submitted for approval
  3. APPROVED: Manager approved
  4. TRANSFERRING: Items packed, stock out from source
  5. IN_TRANSIT: Items shipped, tracking active
  6. ARRIVED: Items arrived at destination
  7. COMPLETED: Items received, stock in to destination
  8. CANCELLED: Transfer cancelled (can rollback if TRANSFERRING)
*/

class StockTransferStateMachine {
  canTransition(from: Status, to: Status): boolean {
    const allowed = {
      DRAFT: ['PENDING', 'CANCELLED'],
      PENDING: ['APPROVED', 'CANCELLED'],
      APPROVED: ['TRANSFERRING', 'CANCELLED'],
      TRANSFERRING: ['IN_TRANSIT', 'CANCELLED'],
      IN_TRANSIT: ['ARRIVED', 'CANCELLED'],
      ARRIVED: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    };
    return allowed[from]?.includes(to) ?? false;
  }
}

// ========================================
// TRANSFER CREATION
// ========================================

class StockTransferService {
  async create(dto: CreateStockTransferDto): Promise<StockTransfer> {
    return await prisma.$transaction(async (tx) => {
      // 1. Validate branches
      if (dto.fromBranchId === dto.toBranchId) {
        throw new Error('Cannot transfer to same branch');
      }
      
      // 2. Validate stock availability
      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });
        
        const fromBranchStock = product?.inventoryByBranch[dto.fromBranchId];
        if (!fromBranchStock || fromBranchStock.inventory < item.quantity) {
          throw new Error(`Insufficient stock for ${product?.name}`);
        }
      }
      
      // 3. Create transfer
      const transfer = await tx.stockTransfer.create({
        data: {
          businessId: await this.generateBusinessId(),
          fromBranchId: dto.fromBranchId,
          toBranchId: dto.toBranchId,
          status: dto.submitForApproval ? 'PENDING' : 'DRAFT',
          priority: dto.priority || 0,
          note: dto.note,
          items: {
            create: dto.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitCost: item.unitCost,
              totalValue: item.quantity * item.unitCost,
              note: item.note,
            }))
          },
          totalQuantity: dto.items.reduce((sum, item) => sum + item.quantity, 0),
          totalValue: dto.items.reduce((sum, item) => 
            sum + (item.quantity * item.unitCost), 0
          ),
          createdById: dto.createdById,
        },
        include: {
          items: { include: { product: true } },
          fromBranch: true,
          toBranch: true,
        }
      });
      
      return transfer;
    });
  }
  
  // ========================================
  // APPROVAL
  // ========================================
  
  async approve(id: string, approverId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findUnique({
        where: { id },
        include: { items: true }
      });
      
      if (!transfer) throw new Error('Transfer not found');
      if (transfer.status !== 'PENDING') {
        throw new Error('Only PENDING transfers can be approved');
      }
      
      // Update status
      await tx.stockTransfer.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedById: approverId,
          approvedDate: new Date(),
        }
      });
    });
  }
  
  // ========================================
  // CONFIRM TRANSFER (Stock Out)
  // ========================================
  
  async confirmTransfer(id: string, transferredById: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findUnique({
        where: { id },
        include: {
          items: { include: { product: true } },
          fromBranch: true,
        }
      });
      
      if (!transfer) throw new Error('Transfer not found');
      if (transfer.status !== 'APPROVED') {
        throw new Error('Only APPROVED transfers can be transferred');
      }
      
      // Update status
      await tx.stockTransfer.update({
        where: { id },
        data: {
          status: 'TRANSFERRING',
          transferredById,
          transferredDate: new Date(),
        }
      });
      
      // Update inventory for each item
      for (const item of transfer.items) {
        const product = item.product;
        const branchInventory = product.inventoryByBranch[transfer.fromBranchId];
        
        // Decrease inventory at source
        // Increase inTransit at destination
        await tx.product.update({
          where: { id: item.productId },
          data: {
            inventoryByBranch: {
              ...product.inventoryByBranch,
              [transfer.fromBranchId]: {
                ...branchInventory,
                inventory: branchInventory.inventory - item.quantity,
              },
              [transfer.toBranchId]: {
                ...product.inventoryByBranch[transfer.toBranchId],
                inTransit: product.inventoryByBranch[transfer.toBranchId].inTransit + item.quantity,
              }
            }
          }
        });
        
        // Update item status
        await tx.stockTransferItem.update({
          where: { id: item.id },
          data: { status: 'SHIPPED' }
        });
        
        // Create stock history
        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            action: 'Xuất chuyển kho',
            quantityChange: -item.quantity,
            newStockLevel: branchInventory.inventory - item.quantity,
            documentId: transfer.businessId,
            branchId: transfer.fromBranchId,
            employeeId: transferredById,
            date: new Date(),
          }
        });
      }
    });
  }
  
  // ========================================
  // MARK IN TRANSIT
  // ========================================
  
  async markInTransit(
    id: string,
    shippedById: string,
    data: {
      vehicleNumber?: string;
      driverName?: string;
      driverPhone?: string;
      estimatedArrival?: Date;
    }
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findUnique({ where: { id } });
      
      if (!transfer) throw new Error('Transfer not found');
      if (transfer.status !== 'TRANSFERRING') {
        throw new Error('Only TRANSFERRING transfers can be shipped');
      }
      
      await tx.stockTransfer.update({
        where: { id },
        data: {
          status: 'IN_TRANSIT',
          shippedById,
          shippedDate: new Date(),
          vehicleNumber: data.vehicleNumber,
          driverName: data.driverName,
          driverPhone: data.driverPhone,
          estimatedArrival: data.estimatedArrival,
        }
      });
      
      // Update all items
      await tx.stockTransferItem.updateMany({
        where: { stockTransferId: id },
        data: { status: 'IN_TRANSIT' }
      });
    });
  }
  
  // ========================================
  // MARK ARRIVED
  // ========================================
  
  async markArrived(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findUnique({ where: { id } });
      
      if (!transfer) throw new Error('Transfer not found');
      if (transfer.status !== 'IN_TRANSIT') {
        throw new Error('Only IN_TRANSIT transfers can be marked as arrived');
      }
      
      await tx.stockTransfer.update({
        where: { id },
        data: {
          status: 'ARRIVED',
          arrivedDate: new Date(),
          actualArrival: new Date(),
        }
      });
      
      // Update all items
      await tx.stockTransferItem.updateMany({
        where: { stockTransferId: id },
        data: { status: 'ARRIVED' }
      });
    });
  }
  
  // ========================================
  // CONFIRM RECEIVE (Stock In)
  // ========================================
  
  async confirmReceive(
    id: string,
    receivedById: string,
    receivedItems?: Array<{
      itemId: string;
      receivedQuantity: number;
      damagedQuantity?: number;
      missingQuantity?: number;
      note?: string;
    }>
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findUnique({
        where: { id },
        include: {
          items: { include: { product: true } },
          toBranch: true,
        }
      });
      
      if (!transfer) throw new Error('Transfer not found');
      if (transfer.status !== 'ARRIVED') {
        throw new Error('Only ARRIVED transfers can be received');
      }
      
      // Update status
      await tx.stockTransfer.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          receivedById,
          receivedDate: new Date(),
          completedById: receivedById,
          completedDate: new Date(),
        }
      });
      
      // Process each item
      for (const item of transfer.items) {
        const receivedInfo = receivedItems?.find(r => r.itemId === item.id);
        const receivedQty = receivedInfo?.receivedQuantity ?? item.quantity;
        const damagedQty = receivedInfo?.damagedQuantity ?? 0;
        const missingQty = receivedInfo?.missingQuantity ?? 0;
        
        // Update item
        await tx.stockTransferItem.update({
          where: { id: item.id },
          data: {
            status: 'RECEIVED',
            receivedQuantity: receivedQty,
            damagedQuantity: damagedQty,
            missingQuantity: missingQty,
            toBranchNote: receivedInfo?.note,
          }
        });
        
        const product = item.product;
        const branchInventory = product.inventoryByBranch[transfer.toBranchId];
        
        // Decrease inTransit
        // Increase inventory at destination
        await tx.product.update({
          where: { id: item.productId },
          data: {
            inventoryByBranch: {
              ...product.inventoryByBranch,
              [transfer.toBranchId]: {
                ...branchInventory,
                inTransit: branchInventory.inTransit - item.quantity,
                inventory: branchInventory.inventory + receivedQty,
              }
            }
          }
        });
        
        // Create stock history
        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            action: 'Nhập chuyển kho',
            quantityChange: receivedQty,
            newStockLevel: branchInventory.inventory + receivedQty,
            documentId: transfer.businessId,
            branchId: transfer.toBranchId,
            employeeId: receivedById,
            date: new Date(),
          }
        });
      }
    });
  }
  
  // ========================================
  // CANCEL
  // ========================================
  
  async cancel(
    id: string,
    cancelledById: string,
    reason: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findUnique({
        where: { id },
        include: { items: { include: { product: true } } }
      });
      
      if (!transfer) throw new Error('Transfer not found');
      if (['COMPLETED', 'CANCELLED'].includes(transfer.status)) {
        throw new Error('Cannot cancel completed or already cancelled transfer');
      }
      
      // Rollback inventory if already transferred
      if (['TRANSFERRING', 'IN_TRANSIT', 'ARRIVED'].includes(transfer.status)) {
        for (const item of transfer.items) {
          const product = item.product;
          
          // Return stock to source
          // Remove from inTransit at destination
          await tx.product.update({
            where: { id: item.productId },
            data: {
              inventoryByBranch: {
                ...product.inventoryByBranch,
                [transfer.fromBranchId]: {
                  ...product.inventoryByBranch[transfer.fromBranchId],
                  inventory: product.inventoryByBranch[transfer.fromBranchId].inventory + item.quantity,
                },
                [transfer.toBranchId]: {
                  ...product.inventoryByBranch[transfer.toBranchId],
                  inTransit: product.inventoryByBranch[transfer.toBranchId].inTransit - item.quantity,
                }
              }
            }
          });
          
          // Create stock history
          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              action: 'Hủy chuyển kho',
              quantityChange: item.quantity,
              newStockLevel: product.inventoryByBranch[transfer.fromBranchId].inventory + item.quantity,
              documentId: transfer.businessId,
              branchId: transfer.fromBranchId,
              employeeId: cancelledById,
              date: new Date(),
            }
          });
        }
      }
      
      // Update status
      await tx.stockTransfer.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledById,
          cancelledDate: new Date(),
          cancelReason: reason,
        }
      });
    });
  }
}
```

---

## 🔌 API DESIGN

```typescript
// app/api/stock-transfers/route.ts
// GET  /api/stock-transfers - List transfers
// POST /api/stock-transfers - Create transfer

// app/api/stock-transfers/[id]/route.ts
// GET    /api/stock-transfers/[id] - Get details
// PATCH  /api/stock-transfers/[id] - Update (draft only)
// DELETE /api/stock-transfers/[id] - Delete (draft only)

// app/api/stock-transfers/[id]/approve/route.ts
// POST /api/stock-transfers/[id]/approve - Approve

// app/api/stock-transfers/[id]/transfer/route.ts
// POST /api/stock-transfers/[id]/transfer - Confirm transfer (stock out)

// app/api/stock-transfers/[id]/ship/route.ts
// POST /api/stock-transfers/[id]/ship - Mark in transit

// app/api/stock-transfers/[id]/arrive/route.ts
// POST /api/stock-transfers/[id]/arrive - Mark arrived

// app/api/stock-transfers/[id]/receive/route.ts
// POST /api/stock-transfers/[id]/receive - Confirm receive (stock in)

// app/api/stock-transfers/[id]/cancel/route.ts
// POST /api/stock-transfers/[id]/cancel - Cancel transfer
```

---

## ⚛️ REACT QUERY HOOKS

```typescript
// lib/api/stock-transfers.ts

export const useStockTransfers = (filters?: StockTransferFilters) => {
  return useQuery({
    queryKey: ['stock-transfers', filters],
    queryFn: () => stockTransfersApi.getAll(filters),
  });
};

export const useStockTransfer = (id: string) => {
  return useQuery({
    queryKey: ['stock-transfers', id],
    queryFn: () => stockTransfersApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateStockTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stockTransfersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-transfers'] });
    },
  });
};

export const useApproveStockTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => 
      stockTransfersApi.approve(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stock-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['stock-transfers', variables.id] });
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
- [ ] Add workflow endpoints
- [ ] Add validation
- [ ] Write tests

### Phase 3: Service Layer (Week 3)
- [ ] Implement StockTransferService
- [ ] Add transaction handling
- [ ] Add cost tracking
- [ ] Add shipment tracking

### Phase 4: Frontend (Week 4)
- [ ] Improve form UX
- [ ] Add barcode scanning
- [ ] Add real-time tracking
- [ ] Add print templates

### Phase 5: Testing (Week 5)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing

---

**Ngày cập nhật:** 29/11/2025
**Trạng thái:** Đang triển khai
