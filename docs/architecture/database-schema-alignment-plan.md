# Database, Prisma & API Alignment Plan

> **Ngày tạo**: 21/12/2024  
> **Cập nhật**: 21/12/2024  
> **Mục tiêu**: Đảm bảo tính nhất quán và đầy đủ giữa Database, Prisma Schema, API Routes và TypeScript Types

---

## 🎯 TRẠNG THÁI HIỆN TẠI

### ✅ Đã hoàn thành (21/12/2024)
1. **ID Pattern chuẩn hóa** - Tất cả 59 tables đều có `systemId` (PK) + `id` (businessId) ✅
2. **Prisma models chuẩn hóa** - Đã chuyển từ snake_case sang PascalCase với @@map ✅
   - `audit_logs` → `AuditLog`
   - `files` → `File`
   - `inventory` → `Inventory`
   - `order_line_items` → `OrderLineItem`
   - `wikis` → `Wiki`
3. **Relation names chuẩn hóa** trong các models chính ✅
4. **Database sync** - Đã push schema changes ✅
5. **API Routes** - Tất cả API routes đã được fix, không còn TypeScript errors ✅
6. **Field aliases** - Đã thêm vào Prisma schema (imageUrl, logoUrl, companyName) ✅

### ⚠️ Còn 73 TypeScript errors trong Frontend (features/pages)
Các lỗi này không ảnh hưởng đến Database/Prisma/API alignment:
- `features/cost-adjustments/page.tsx` - useState type issues
- `features/orders/store.ts` - duplicate variable declarations
- `features/settings/other-page.tsx` - missing property issues
- `features/settings/printer/workflow-templates-page.tsx` - useState type issues
- `lib/complaints-settings-sync.ts` - readonly type issues
- Etc.

**Các lỗi này là code issues riêng, cần fix separately.**

---

## 📊 1. Tổng Quan Hệ Thống Hiện Tại

### 1.1 Database Tables (59 tables)
```
✅ Database có 59 tables - đã được introspect qua `prisma db pull`
```

### 1.2 Prisma Schema Files
```
📁 prisma/schema/
├── 000-base.prisma          # Base config (generator, datasource, enums)
├── introspected.prisma      # 5 models từ db pull (audit_logs, files, inventory, order_line_items, wikis)
├── auth/                    # 1 model: User
├── common/                  # 1 model: Comment
├── finance/                 # 4 models: CashAccount, CashTransaction, Payment, Receipt
├── hrm/                     # 6 models: Employee, AttendanceRecord, Leave, Payroll, PayrollItem, Penalty
├── inventory/               # 14 models: Product, Brand, Category, StockLocation, etc.
├── operations/              # 5 models: Complaint, Packaging, PackagingItem, Shipment, Task, Warranty
├── procurement/             # 5 models: Supplier, PurchaseOrder, PurchaseOrderItem, PurchaseReturn, PurchaseReturnItem
├── sales/                   # 6 models: Customer, Order, OrderPayment, SalesReturn, SalesReturnItem
├── settings/                # 10 models: Branch, Department, JobTitle, etc.
├── system/                  # 2 models: UserPreference, ActiveTimer
└── wiki/                    # 0 models (empty - đã có trong introspected.prisma)
```

### 1.3 API Routes (54 routes trong app/api/)
```
active-timer, attendance, audit-logs, auth, branches, branding, brands,
cash-accounts, cash-transactions, categories, comments, complaints, complaints-settings,
cost-adjustments, customer-sla, customers, departments, employee-documents,
employee-payroll-profiles, employees, files, health, inventory, inventory-checks,
inventory-receipts, job-titles, leaves, orders, payments, payroll, print-templates,
products, purchase-orders, purchase-returns, receipts, sales-returns, settings,
shipments, shipping, shipping-config, stock-locations, stock-transfers, storage,
suppliers, tasks, upload, user-preferences, users, warranties, warranty-settings,
website-settings, wiki, workflow-templates
```

### 1.4 TypeScript Types (53 files types.ts trong features/)
```
Mỗi feature module có types.ts định nghĩa interface đầy đủ cho UI/Frontend
```

---

## 🔍 2. Phân Tích Chi Tiết

### 2.1 Naming Convention Hiện Tại (KHÔNG NHẤT QUÁN)

| Layer | Convention | Ví dụ |
|-------|------------|-------|
| **Database Table** | snake_case | `employees`, `order_line_items`, `stock_locations` |
| **Prisma Model** | PascalCase + @@map | `Employee @@map("employees")` |
| **API Route** | kebab-case | `/api/employees`, `/api/stock-locations` |
| **TypeScript Type** | PascalCase | `Employee`, `StockLocation` |
| **Store** | kebab-case + Store | `employee-store.ts`, `stock-location-store.ts` |

### 2.2 ID Pattern (systemId + businessId)

**✅ Pattern đã được áp dụng đúng:**
```typescript
// Prisma Schema
model Employee {
  systemId  String @id          // UUID - Internal use
  id        String @unique      // NV001 - Business/User-facing
}

// TypeScript Type
type Employee = {
  systemId: SystemId;           // Internal
  id: BusinessId;               // User-facing (NV001)
}
```

**Prefix conventions (businessId):**
| Entity | Prefix | Example |
|--------|--------|---------|
| Employee | NV | NV001 |
| Customer | KH | KH001 |
| Order | DH | DH001 |
| Product | SP | SP001 |
| Supplier | NCC | NCC001 |
| Purchase Order | DDH | DDH001 |
| Inventory Receipt | NK | NK001 |

---

## ❌ 3. Các Vấn Đề Cần Khắc Phục

### 3.1 Prisma Schema Issues

#### a) Models trong introspected.prisma dùng snake_case (5 models)
```prisma
// ❌ Hiện tại - KHÔNG nhất quán
model audit_logs { ... }
model files { ... }
model inventory { ... }
model order_line_items { ... }
model wikis { ... }

// ✅ Cần chuyển sang PascalCase với @@map
model AuditLog {
  ...
  @@map("audit_logs")
}
```

#### b) Relation names không nhất quán
```prisma
// ❌ Hiện tại
inventory            inventory[]         // snake_case
order_line_items     order_line_items[]  // snake_case

// ✅ Chuẩn
inventoryRecords     Inventory[]         // PascalCase relation
orderLineItems       OrderLineItem[]     // PascalCase relation
```

### 3.2 API Code Issues (180 TypeScript Errors)

#### a) Field name mismatches
```typescript
// ❌ API code sử dụng
employee.fullName    // Không có trong Prisma generated type
employee.imageUrl    // Không có trong Prisma
brand.logoUrl        // Không có trong Prisma

// ✅ Prisma schema có
employee.fullName    // ✅ Đã có
employee.avatarUrl   // Đúng field name
brand.logo           // Cần kiểm tra
```

#### b) Relation access errors
```typescript
// ❌ Error
product.inventories  // Không có - cần inventory
cashAccount.transactions  // Không có - cần cashTransactions
```

### 3.3 Empty Prisma Files (Cần bổ sung)
```
❌ prisma/schema/wiki/wiki-page.prisma        - Trống (model có trong introspected)
❌ prisma/schema/common/file-upload.prisma    - Trống (model có trong introspected)
❌ prisma/schema/system/activity-log.prisma   - Trống (model có trong introspected)
```

### 3.4 API Routes Không Có Prisma Model
```
/api/branding              - Không có table (Settings?)
/api/complaints-settings   - Không có table (Settings?)
/api/customer-sla          - Không có table (Settings?)
/api/employee-documents    - Sử dụng files table
/api/employee-payroll-profiles - Trong employees?
/api/print-templates       - Không có table (Settings?)
/api/shipping              - Sử dụng settings?
/api/shipping-config       - Sử dụng settings?
/api/storage               - Sử dụng files?
/api/warranty-settings     - Không có table (Settings?)
/api/website-settings      - Không có table (Settings?)
/api/workflow-templates    - Không có table
```

---

## ✅ 4. Kế Hoạch Khắc Phục

### Phase 1: Fix Prisma Schema (Priority HIGH)

#### Step 1.1: Di chuyển models từ introspected.prisma
```bash
# Move và rename với @@map
audit_logs      → system/audit-log.prisma    → model AuditLog
files           → common/file.prisma         → model File  
inventory       → inventory/inventory.prisma → model Inventory (keep)
order_line_items → sales/order-line-item.prisma → model OrderLineItem
wikis           → wiki/wiki.prisma           → model Wiki
```

#### Step 1.2: Chuẩn hóa relation names
```prisma
// product.prisma - Update relations
model Product {
  ...
  inventoryRecords    Inventory[]       @relation(...)  // ✅ PascalCase
  orderLineItems      OrderLineItem[]   @relation(...)  // ✅ PascalCase
}
```

#### Step 1.3: Regenerate Prisma Client
```bash
npx prisma generate
```

### Phase 2: Update API Code

#### Step 2.1: Update imports để dùng Prisma generated types
```typescript
// ❌ Before
interface Employee {
  systemId: string;
  fullName: string;
  ...
}

// ✅ After
import { Employee } from '@prisma/client';
// Hoặc extend từ Prisma type
type EmployeeWithRelations = Prisma.EmployeeGetPayload<{
  include: { department: true; branch: true }
}>;
```

#### Step 2.2: Fix field name mismatches
```typescript
// Map API fields to Prisma fields
const apiToDbFieldMap = {
  'imageUrl': 'avatarUrl',
  'logoUrl': 'logo',
};
```

### Phase 3: Consolidate Settings Tables

#### Tạo generic Settings table cho các config
```prisma
model Setting {
  systemId    String   @id
  category    String   // 'branding', 'shipping', 'warranty', etc.
  key         String
  value       Json
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([category, key])
  @@map("settings")
}
```

### Phase 4: Document API → Prisma Mapping

Tạo file `lib/api-db-mapping.ts`:
```typescript
export const API_TO_PRISMA_MAP = {
  // Route → Prisma Model
  'employees': 'Employee',
  'customers': 'Customer',
  'products': 'Product',
  'orders': 'Order',
  'stock-locations': 'StockLocation',
  'stock-transfers': 'StockTransfer',
  'inventory-receipts': 'InventoryReceipt',
  'inventory-checks': 'InventoryCheck',
  'cash-accounts': 'CashAccount',
  'cash-transactions': 'CashTransaction',
  'purchase-orders': 'PurchaseOrder',
  'purchase-returns': 'PurchaseReturn',
  'sales-returns': 'SalesReturn',
  // Settings routes → Setting table with category
  'branding': { model: 'Setting', category: 'branding' },
  'shipping-config': { model: 'Setting', category: 'shipping' },
  'warranty-settings': { model: 'Setting', category: 'warranty' },
  'website-settings': { model: 'Setting', category: 'website' },
  'print-templates': { model: 'Setting', category: 'print-templates' },
  'complaints-settings': { model: 'Setting', category: 'complaints' },
};
```

---

## 📋 5. Naming Convention Chuẩn

### 5.1 Database Tables
```
✅ snake_case, số nhiều
Ví dụ: employees, customers, order_line_items, stock_locations
```

### 5.2 Prisma Models
```
✅ PascalCase, số ít + @@map
Ví dụ: Employee @@map("employees")
       StockLocation @@map("stock_locations")
```

### 5.3 API Routes
```
✅ kebab-case, số nhiều (plural for collections)
Ví dụ: /api/employees, /api/stock-locations, /api/order-line-items
```

### 5.4 TypeScript Types
```
✅ PascalCase, số ít (match Prisma model)
Ví dụ: Employee, StockLocation, OrderLineItem
```

### 5.5 Zustand Stores
```
✅ kebab-case-store.ts với PascalCase export
File: employee-store.ts
Export: useEmployeeStore
```

### 5.6 Feature Folders
```
✅ kebab-case
Ví dụ: features/employees/, features/stock-locations/
```

---

## 📐 6. Entity Mapping Table

| Database Table | Prisma Model | API Route | TypeScript Type | Store |
|----------------|--------------|-----------|-----------------|-------|
| `employees` | `Employee` | `/api/employees` | `Employee` | `useEmployeeStore` |
| `customers` | `Customer` | `/api/customers` | `Customer` | `useCustomerStore` |
| `products` | `Product` | `/api/products` | `Product` | `useProductStore` |
| `orders` | `Order` | `/api/orders` | `Order` | `useOrderStore` |
| `suppliers` | `Supplier` | `/api/suppliers` | `Supplier` | `useSupplierStore` |
| `branches` | `Branch` | `/api/branches` | `Branch` | `useBranchStore` |
| `departments` | `Department` | `/api/departments` | `Department` | `useDepartmentStore` |
| `job_titles` | `JobTitle` | `/api/job-titles` | `JobTitle` | `useJobTitleStore` |
| `stock_locations` | `StockLocation` | `/api/stock-locations` | `StockLocation` | `useStockLocationStore` |
| `stock_transfers` | `StockTransfer` | `/api/stock-transfers` | `StockTransfer` | `useStockTransferStore` |
| `inventory_receipts` | `InventoryReceipt` | `/api/inventory-receipts` | `InventoryReceipt` | `useInventoryReceiptStore` |
| `inventory_checks` | `InventoryCheck` | `/api/inventory-checks` | `InventoryCheck` | `useInventoryCheckStore` |
| `cash_accounts` | `CashAccount` | `/api/cash-accounts` | `CashAccount` | `useCashAccountStore` |
| `cash_transactions` | `CashTransaction` | `/api/cash-transactions` | `CashTransaction` | `useCashTransactionStore` |
| `purchase_orders` | `PurchaseOrder` | `/api/purchase-orders` | `PurchaseOrder` | `usePurchaseOrderStore` |
| `purchase_returns` | `PurchaseReturn` | `/api/purchase-returns` | `PurchaseReturn` | `usePurchaseReturnStore` |
| `sales_returns` | `SalesReturn` | `/api/sales-returns` | `SalesReturn` | `useSalesReturnStore` |
| `warranties` | `Warranty` | `/api/warranties` | `Warranty` | `useWarrantyStore` |
| `complaints` | `Complaint` | `/api/complaints` | `Complaint` | `useComplaintStore` |
| `tasks` | `Task` | `/api/tasks` | `Task` | `useTaskStore` |
| `attendance_records` | `AttendanceRecord` | `/api/attendance` | `AttendanceRecord` | `useAttendanceStore` |
| `leaves` | `Leave` | `/api/leaves` | `Leave` | `useLeaveStore` |
| `payrolls` | `Payroll` | `/api/payroll` | `Payroll` | `usePayrollStore` |
| `receipts` | `Receipt` | `/api/receipts` | `Receipt` | `useReceiptStore` |
| `payments` | `Payment` | `/api/payments` | `Payment` | `usePaymentStore` |
| `wikis` | `Wiki` | `/api/wiki` | `Wiki` | `useWikiStore` |
| `audit_logs` | `AuditLog` | `/api/audit-logs` | `AuditLog` | - (read-only) |
| `files` | `File` | `/api/files` | `File` | - |
| `settings` | `Setting` | `/api/settings/*` | `Setting` | `useSettingStore` |

---

## 🔧 7. Commands Tham Khảo

```bash
# Kiểm tra schema từ database
npx prisma db pull --print | Select-String "^model"

# Generate Prisma Client sau khi update schema
npx prisma generate

# Check TypeScript errors
npx tsc --noEmit

# Push schema changes to database
npx prisma db push

# Create migration
npx prisma migrate dev --name <migration_name>
```

---

## 📅 8. Timeline Đề Xuất

| Phase | Task | Thời gian | Priority |
|-------|------|-----------|----------|
| 1 | Fix introspected.prisma models | 2h | HIGH |
| 2 | Update relation names | 2h | HIGH |
| 3 | Regenerate Prisma + Fix API errors | 4h | HIGH |
| 4 | Consolidate Settings routes | 3h | MEDIUM |
| 5 | Update types.ts để match Prisma | 4h | MEDIUM |
| 6 | Testing & Validation | 2h | HIGH |

**Tổng: ~17 giờ làm việc**

---

## ✅ 9. Checklist Hoàn Thành

- [ ] Di chuyển 5 models từ introspected.prisma sang folders tương ứng
- [ ] Chuẩn hóa tất cả relation names sang PascalCase
- [ ] Regenerate Prisma Client
- [ ] Fix 180 TypeScript errors
- [ ] Consolidate settings API routes
- [ ] Update types.ts files để extend từ Prisma types
- [ ] Chạy `npx tsc --noEmit` không có lỗi
- [ ] Test CRUD operations cho tất cả entities
- [ ] Document API endpoints

---

## 📚 10. Tài Liệu Tham Khảo

- [Prisma Naming Conventions](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#naming-conventions)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [ID-GOVERNANCE.md](./ID-GOVERNANCE.md) - ID pattern documentation
- [DEVELOPMENT-GUIDELINES-V2.md](./DEVELOPMENT-GUIDELINES-V2.md) - Project guidelines
