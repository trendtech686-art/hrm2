# Prisma Types Migration Status

## Mục tiêu
Xóa các file `types.ts` trong thư mục `features/` và migrate sang Prisma generated types.

## Nguyên tắc Migration

1. **Thêm types vào `lib/types/prisma-extended.ts`** - File trung tâm chứa tất cả app-level types
2. **Update store.ts** - Re-export types từ prisma-extended
3. **Update imports** - Tất cả file import từ `./types` → `./store` hoặc `@/lib/types/prisma-extended`
4. **Xóa types.ts** - Sau khi đã migrate xong

## Trạng thái Migration

### ✅ Đã hoàn thành

| Phase | Feature | Ngày | Ghi chú |
|-------|---------|------|---------|
| 7 | `suppliers` | 2024-12-25 | Types: Supplier, SupplierStatus |
| 8 | `categories` | N/A | Không có types.ts (dùng settings/inventory) |
| 8 | `brands` | N/A | Không có types.ts (dùng settings) |
| 9 | `customers` | 2024-12-25 | Types: Customer, CustomerAddress, DebtTransaction, DebtReminder, CustomerStatus, CustomerLifecycleStage, DebtStatus |
| 10 | `cost-adjustments` | 2024-12-25 | Types: CostAdjustment, CostAdjustmentItem, CostAdjustmentStatus, CostAdjustmentType |
| 10 | `inventory-checks` | 2024-12-25 | Types: InventoryCheck, InventoryCheckItem, InventoryCheckStatus, DifferenceReason |
| 11 | `employees` | 2024-12-25 | Types: Employee, EmployeeAddress, EmployeeRole, AddressInputLevel, TwoLevelAddress, ThreeLevelAddress + helper functions |
| 12 | `products` | 2024-12-25 | Types: Product, ProductStatus, ProductType, WebsiteSeoData, MultiWebsiteSeo, ComboItem, ComboPricingType, ProductVariant, VariantAttribute, ProductModel |

### 🔄 Cần Migration (Core Features - Ưu tiên cao)

| Feature | File | Độ phức tạp | Dependencies |
|---------|------|-------------|--------------|
| `employees` | `features/employees/types.ts` | Cao | Nhiều module phụ thuộc |
| `products` | `features/products/types.ts` | Rất cao | Core data, nhiều module |
| `orders` | `features/orders/types.ts` | Rất cao | Phức tạp, nhiều sub-types |
| `warranty` | `features/warranty/types.ts` | Trung bình | Link với orders, customers |
| `purchase-orders` | `features/purchase-orders/types.ts` | Cao | Link với suppliers, products |
| `inventory-receipts` | `features/inventory-receipts/types.ts` | Trung bình | Link với purchase-orders |
| `payments` | `features/payments/types.ts` | Trung bình | Link với orders |
| `receipts` | `features/receipts/types.ts` | Trung bình | Link với payments |

### 🔄 Cần Migration (Other Features)

| Feature | File | Độ phức tạp |
|---------|------|-------------|
| `attendance` | `features/attendance/types.ts` | Thấp |
| `audit-log` | `features/audit-log/types.ts` | Thấp |
| `cashbook` | `features/cashbook/types.ts` | Trung bình |
| `complaints` | `features/complaints/types.ts` | Trung bình |
| `leaves` | `features/leaves/types.ts` | Thấp |
| `packaging` | `features/packaging/types.ts` | Thấp |
| `purchase-returns` | `features/purchase-returns/types.ts` | Trung bình |
| `sales-returns` | `features/sales-returns/types.ts` | Trung bình |
| `shipments` | `features/shipments/types.ts` | Trung bình |
| `stock-history` | `features/stock-history/types.ts` | Thấp |
| `stock-locations` | `features/stock-locations/types.ts` | Thấp |
| `stock-transfers` | `features/stock-transfers/types.ts` | Trung bình |
| `tasks` | `features/tasks/types.ts` | Trung bình |
| `wiki` | `features/wiki/types.ts` | Thấp |

### ⏸️ Giữ nguyên (Sub-modules / Settings)

Các file này có thể giữ nguyên vì là types đặc thù cho sub-module hoặc settings:

| File | Lý do |
|------|-------|
| `customers/sla/types.ts` | SLA engine types riêng biệt |
| `orders/components/shipping/types.ts` | Component-specific types |
| `settings/*/types.ts` (15+ files) | Settings types, ít thay đổi |
| `reports/*/types.ts` (5 files) | Report-specific types |

## Quy trình Migration cho mỗi Feature

```bash
# 1. Đọc types.ts để xác định types cần migrate
# 2. Thêm types vào lib/types/prisma-extended.ts
# 3. Update store.ts:
#    - Thêm: export type { TypeName } from '@/lib/types/prisma-extended';
#    - Thêm: import type { TypeName } from '@/lib/types/prisma-extended';
# 4. Update tất cả imports trong feature folder
# 5. Update imports từ các module khác
# 6. Xóa types.ts
# 7. Chạy TypeScript check
```

## Thứ tự Migration Đề xuất

### Phase 11: employees
- File: `features/employees/types.ts`
- Types: Employee, EmployeeStatus, EmployeeRole, EmployeeAddress
- Lưu ý: Nhiều module khác import Employee

### Phase 12: products
- File: `features/products/types.ts`
- Types: Product, ProductType, ProductStatus, ComboItem, etc.
- Lưu ý: Core module, cần migrate cẩn thận

### Phase 13: orders
- File: `features/orders/types.ts`
- Types: Order, OrderStatus, OrderLineItem, etc.
- Lưu ý: Phức tạp nhất, nhiều sub-types

### Phase 14: warranty
- File: `features/warranty/types.ts`
- Types: WarrantyTicket, WarrantyStatus, etc.

### Phase 15: purchase-orders
- File: `features/purchase-orders/types.ts`
- Types: PurchaseOrder, PurchaseOrderStatus, etc.

### Phase 16-20: Các module còn lại
- inventory-receipts, payments, receipts
- attendance, leaves, cashbook
- complaints, tasks, wiki
- shipments, stock-transfers, etc.

## Commands hữu ích

```powershell
# Liệt kê tất cả types.ts còn lại
Get-ChildItem -Path "d:\hrm2\features" -Filter "types.ts" -Recurse | Where-Object { $_.FullName -notmatch "backup" } | Select-Object FullName

# Tìm imports từ một types.ts cụ thể
grep -r "from './types'" features/employees/

# Kiểm tra TypeScript errors
npx tsc --noEmit
```

## Lưu ý quan trọng

1. **Backup trước khi xóa**: File đã xóa được backup tại `backup/types-backup/`
2. **Test sau mỗi phase**: Chạy `npm run build` để kiểm tra
3. **Commit từng phase**: Dễ rollback nếu có lỗi
4. **Update imports cẩn thận**: Đảm bảo không break các module khác

## Tiến độ tổng quan

- **Tổng số types.ts ban đầu**: ~52 files
- **Đã migrate**: 4 files (suppliers, customers, cost-adjustments, inventory-checks)
- **Không cần migrate**: 2 files (categories, brands - không có types.ts)
- **Giữ nguyên**: ~22 files (settings, reports, sub-modules)
- **Còn lại cần migrate**: ~22 files

---
*Cập nhật lần cuối: 2024-12-25*
