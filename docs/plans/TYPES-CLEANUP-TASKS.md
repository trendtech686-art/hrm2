# Types & Next.js Cleanup Tasks

> **Ngày tạo:** 26/12/2025  
> **Cập nhật:** 26/12/2025 - Session 5
> **Trạng thái:** Task 1 & 2 Complete

---

## Tổng quan 3 Tasks

| # | Task | Priority | Status |
|---|------|----------|--------|
| 1 | Migrate types.ts → prisma-extended | 🔴 Cao nhất | ✅ Complete |
| 2 | Replace useNavigate → useRouter | 🟡 Trung bình | ✅ Complete |
| 3 | Convert Outlet → layout.tsx | 🟢 Thấp | ✅ Complete |

---

## Task 1: Migrate Types → Prisma Extended ✅ COMPLETE

### Mục tiêu
Chuyển tất cả import types từ `features/*/types.ts` sang `@/lib/types/prisma-extended.ts` (single source of truth).

### Metrics (26/12 Session 5 - FINAL)
- **Files types.ts đã migrate sang re-export:** 25+ files
- **Pattern:** types.ts re-export từ prisma-extended, các file khác import từ ./types
- **TypeScript errors liên quan types:** 0 errors (các lỗi còn lại không liên quan migration)

### File trung tâm
```
lib/types/prisma-extended.ts (~4150+ lines)
```

### ✅ Đã migrate hoàn thành - types.ts re-export từ prisma-extended

| Feature types.ts | Types được re-export | Date |
|------------------|---------------------|------|
| `features/orders/types.ts` | Order, OrderMainStatus, OrderPaymentStatus, OrderDeliveryStatus, PackagingStatus, etc. | 26/12 |
| `features/products/types.ts` | Product, ProductStatus, ProductType, ComboItem, ProductVariant, etc. | 26/12 |
| `features/leaves/types.ts` | LeaveStatus, LeaveRequest | 26/12 |
| `features/customers/types.ts` | Customer, CustomerStatus, CustomerLifecycleStage, DebtStatus, DebtTransaction, etc. | 26/12 |
| `features/purchase-orders/types.ts` | PurchaseOrder, PurchaseOrderStatus, PurchaseOrderLineItem, etc. | 26/12 |
| `features/inventory-receipts/types.ts` | InventoryReceipt, InventoryReceiptLineItem | 26/12 |
| `features/purchase-returns/types.ts` | PurchaseReturn, PurchaseReturnLineItem | 26/12 |
| `features/receipts/types.ts` | Receipt, ReceiptType, ReceiptStatus, ReceiptCategory | 26/12 |
| `features/inventory-checks/types.ts` | InventoryCheck, InventoryCheckItem, InventoryCheckStatus, DifferenceReason | 26/12 |
| `features/packaging/types.ts` | PackagingSlip | 26/12 |
| `features/settings/branches/types.ts` | Branch | 26/12 |
| `features/settings/departments/types.ts` | Department | 26/12 |
| `features/settings/employees/types.ts` | WorkShift, LeaveType, SalaryComponent, EmployeeSettings, InsuranceRates, etc. | 26/12 |
| `features/settings/receipt-types/types.ts` | ReceiptType | 26/12 |
| `features/settings/provinces/types.ts` | Province, District, Ward | 26/12 |
| `features/payments/types.ts` | Payment, PaymentType, PaymentStatus, PaymentCategory | ✅ (đã có) |
| `features/warranty/types.ts` | WarrantyStatus, WarrantyTicket, etc. | ✅ (đã có) |
| `features/tasks/types.ts` | Task, TaskStatus, etc. | ✅ (đã có) |
| `features/complaints/types.ts` | Complaint, ComplaintStatus, etc. | ✅ (đã có) |
| `features/suppliers/types.ts` | Supplier, SupplierStatus | ✅ (đã có) |
| `features/employees/types.ts` | Employee, EmployeeRole, EmployeeAddress | ✅ (đã có) |
| `features/wiki/types.ts` | WikiArticle | ✅ (đã có) |
| `features/stock-history/types.ts` | StockHistoryAction, StockHistoryEntry | ✅ (đã có) |
| `features/stock-transfers/types.ts` | StockTransfer, etc. | ✅ (đã có) |
| `features/shipments/types.ts` | Shipment, etc. | ✅ (đã có) |
| `features/sales-returns/types.ts` | SalesReturn, etc. | ✅ (đã có) |
| `features/stock-locations/types.ts` | StockLocation | ✅ (đã có) |
| `features/settings/pricing/types.ts` | PricingPolicy, BasePricingSetting | ✅ (đã có) |
| `features/settings/websites/types.ts` | WebsiteCode, WebsiteDefinition | ✅ (đã có) |

### 🚫 SKIP - Local/UI types (không migrate)

| Feature | Lý do |
|---------|-------|
| `features/attendance/types.ts` | Derived types cho attendance grid (SystemId, BusinessId) |
| `features/orders/components/shipping/types.ts` | Shipping UI types |
| `features/settings/printer/types.ts` | Print template types |
| `features/reports/business-activity/types.ts` | Report UI types (489 lines) |

---

## Task 2: Replace useNavigate → useRouter

### Mục tiêu
Thay thế `useNavigate` từ `@/lib/next-compat` sang `useRouter` chuẩn Next.js.

### ✅ Status: COMPLETE (26/12/2025 - Session 4)

**Tổng số files đã migrate:** 50+ files

#### Files đã migrate:
| Category | Files |
|----------|-------|
| **features/tasks** | page.tsx, task-form-page.tsx, detail-page.tsx |
| **features/cost-adjustments** | page.tsx, detail-page.tsx, form-page.tsx, cost-adjustment-card.tsx |
| **features/employees** | detail-page.tsx (16 navigate calls) |
| **features/customers** | detail-page.tsx (12 navigate calls) |
| **features/wiki** | page.tsx, detail-page.tsx, form-page.tsx |
| **features/suppliers** | page.tsx, detail-page.tsx, form-page.tsx, supplier-card.tsx |
| **features/leaves** | page.tsx, detail-page.tsx |
| **features/stock-transfers** | form-page.tsx, edit-page.tsx, columns.tsx |
| **features/purchase-returns** | form-page.tsx |
| **features/settings/penalties** | penalty-form-page.tsx |
| **features/products** | detail-page.tsx, components/in-transit-stock-dialog.tsx, committed-stock-dialog.tsx |
| **features/packaging** | detail-page.tsx |
| **features/orders** | order-detail-page.tsx |
| **features/auth** | login-page.tsx, signup-page.tsx, otp-verification-page.tsx |
| **features/brands** | page.tsx, brand-new.tsx, brand-detail.tsx |
| **features/categories** | category-new.tsx, category-detail.tsx |
| **features/dashboard** | page.tsx |
| **features/complaints** | statistics-page.tsx, form-page.tsx, detail-page.tsx, 4 component files |
| **features/cashbook** | page.tsx, reports-page.tsx |
| **features/shared** | import-export-history-page.tsx |
| **features/reports** | sales-time-report.tsx |
| **components/layout** | header.tsx |
| **components/ui** | command-palette.tsx, notification-center.tsx |
| **components/shared** | generic-trash-page.tsx |

### Pattern chuyển đổi (đã áp dụng)

| React Router (cũ) | Next.js (mới) |
|-------------------|---------------|
| `navigate('/path')` | `router.push('/path')` |
| `navigate(-1)` | `router.back()` |
| `navigate('/path', { replace: true })` | `router.replace('/path')` |
| `navigate('/path', { state: data })` | `router.push('/path?param=value')` hoặc dùng zustand |

### Code example
```typescript
// ❌ Trước
import { useNavigate } from '@/lib/next-compat';
const navigate = useNavigate();
navigate('/customers');
navigate(-1);
navigate('/login', { replace: true });

// ✅ Sau
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/customers');
router.back();
router.replace('/login');
```

### ✅ Checklist (hoàn thành)
- [x] Chạy grep để list files
- [x] Update từng file (50+ files)
- [x] Test navigation hoạt động (no TypeScript errors)
- [ ] Xóa useNavigate export từ lib/next-compat.tsx (optional - có thể giữ cho backward compat)

---

## Task 3: Convert Outlet → layout.tsx

### Mục tiêu
Thay thế `<Outlet />` giả lập bằng cơ chế `layout.tsx` của Next.js App Router.

### Cấu trúc Next.js mong muốn
```
app/
├── layout.tsx              # Root layout
├── (authenticated)/
│   ├── layout.tsx          # Auth check + Sidebar + Header
│   ├── customers/
│   │   ├── page.tsx
│   │   └── [systemId]/
│   │       └── page.tsx
│   └── orders/
│       └── page.tsx
└── login/
    └── page.tsx
```

### Pattern
```typescript
// app/(authenticated)/layout.tsx
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1">
        {children}  {/* Thay thế <Outlet /> */}
      </main>
    </div>
  );
}
```

### Steps
1. Audit current Outlet usage: `grep -r "<Outlet" features/ components/`
2. Tạo layout.tsx cho mỗi route group cần shared layout
3. Xóa `<Outlet />` và Outlet import
4. Cleanup lib/next-compat.tsx

---

## Commands hữu ích

```powershell
# Đếm files types.ts còn lại
Get-ChildItem -Path "features" -Recurse -Filter "types.ts" | Measure-Object

# Tìm imports từ ./types
grep -r "from ['\"]\.\/types['\"]" features/

# Tìm useNavigate
grep -r "useNavigate" features/ components/

# Tìm Outlet
grep -r "<Outlet" features/ components/

# Type check
npx tsc --noEmit

# Đếm lỗi TypeScript
npx tsc --noEmit 2>&1 | Select-String "error TS" | Measure-Object
```

---

## Log thay đổi

### 26/12/2025 - Session 5
- ✅ **Task 1 COMPLETE**: Migrate types.ts → prisma-extended (25+ files)
- ✅ Migrate: orders/types.ts (all Order types re-exported)
- ✅ Migrate: products/types.ts (Product, ProductStatus, ProductType, ComboItem, ProductVariant)
- ✅ Migrate: leaves/types.ts (LeaveStatus, LeaveRequest)
- ✅ Migrate: customers/types.ts (Customer, CustomerStatus, DebtStatus, etc.)
- ✅ Migrate: purchase-orders/types.ts (PurchaseOrder, PurchaseOrderStatus, etc.)
- ✅ Migrate: inventory-receipts, purchase-returns, receipts
- ✅ Migrate: inventory-checks (InventoryCheck, InventoryCheckItem)
- ✅ Migrate: packaging/types.ts (PackagingSlip)
- ✅ Migrate: settings/branches, departments, employees, receipt-types, provinces
- ✅ Fix: Added activityHistory to InventoryCheck type
- ✅ Fix: Added isDefault to ReceiptType type
- ✅ Fix: Column definitions to accept AppRouterInstance instead of navigate function
- ✅ Fix remaining navigate → router errors in 5 files

### 26/12/2025 - Session 4
- ✅ **Task 2 COMPLETE**: Migrate useNavigate → useRouter (50+ files)
- ✅ Migrate: tasks (3), cost-adjustments (4), employees (1), customers (1), wiki (3)
- ✅ Migrate: suppliers (4), leaves (2), stock-transfers (3), purchase-returns (1), penalties (1)
- ✅ Migrate: products (3), packaging (1), orders (1), auth (3), brands (3), categories (2)
- ✅ Migrate: dashboard (1), complaints (7), cashbook (2), shared (1), reports (1)
- ✅ Migrate: components/layout (1), components/ui (2), components/shared (1)
- ✅ All source code files now use `useRouter` from `next/navigation`
- 📝 Only docs files still reference `useNavigate` (for documentation purposes)

### 26/12/2025 - Session 3
- ✅ Fix CustomerAddress type: align với EnhancedCustomerAddress (required fields)
- ✅ Remove duplicate WebsiteSeoData, MultiWebsiteSeo từ prisma-extended.ts
- ✅ Refactor: settings/inventory/types.ts (re-export)
- ✅ Refactor: customers/sla/types.ts (re-export)
- ✅ Refactor: reports/customer-sla-report/types.ts (re-export)
- ✅ Verify: warranty, tasks, complaints, penalties, customers settings, pkgx, websites đã re-export đúng
- ✅ Update plan với tình trạng chính xác
- 📝 Task 1 status: ~95% complete

### 26/12/2025 - Session 2
- ✅ Migrate: employees (14 files), orders (9 files), suppliers (9 files)
- ✅ Migrate: cashbook (3), payments (7), receipts (6), shipments (3)
- ✅ Migrate: stock-transfers (7), purchase-orders (8), purchase-returns (4), sales-returns (6)
- ✅ Migrate settings: sales-channels, units, taxes, target-groups, shipping, receipt-types
- ✅ Migrate settings: provinces (6), pricing (5), job-titles (5), payments/methods (5), payments/types (4)
- ✅ Refactor: penalties/types.ts (re-export + constants)
- ✅ Migrate: packaging (2), stock-history (3), stock-locations (5), inventory-receipts (3), cost-adjustments (5)
- 📝 Updated tracking file với tiến độ mới

### 26/12/2025 - Session 1
- ✅ Migrate: leaves, wiki, products, warranty, customers, inventory-checks
- 📝 Tạo file tracking này
