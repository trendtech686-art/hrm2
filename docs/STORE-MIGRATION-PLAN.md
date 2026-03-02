# Zustand to React Query Migration Plan

## 📊 Tổng quan

Dự án đã có **API routes** và **React Query hooks** cho hầu hết modules. Nhiều Zustand stores đã được đánh dấu `@deprecated` nhưng vẫn còn được import ở nhiều nơi.

**Mục tiêu:** Migrate tất cả usages từ Zustand stores sang React Query hooks.

## ✅ Đã hoàn thành (Session Jan 23, 2026)

### Employee Store migrations:
- [x] `features/settings/departments/page.tsx` - Dùng `useAllEmployees`, `useEmployeeMutations`
- [x] `features/settings/departments/organization-chart/hooks/use-org-chart.ts` - Dùng `useAllEmployees`, `useEmployeeMutations`
- [x] `features/employees/page-tanstack-test.tsx` - Dùng `useActiveEmployees`, `useEmployeeMutations`, `useDeletedEmployees`
- [x] `features/employees/virtualized-page.tsx` - Dùng `useAllEmployees`, `useEmployeeMutations`, `useTrashMutations`

### Product Store migrations:
- [x] `features/products/form-page.tsx` - Dùng `useProductMutations`
- [x] `features/sales-returns/form-page.tsx` - Dùng `useAllProducts`
- [x] `features/settings/pkgx/components/product-mapping-tab.tsx` - Dùng `useAllProducts`, `useProductMutations`
- [x] `features/settings/trendtech/components/product-mapping-tab.tsx` - Dùng `useAllProducts`
- [x] `features/purchase-orders/hooks/use-po-receive-workflow.ts` - Dùng `useProductFinder`, `useProductMutations.updateInventory`

### Purchase Order Store migrations:
- [x] `features/purchase-orders/hooks/use-po-cancel-workflow.ts` - Dùng `usePurchaseOrderMutations.cancel`
- [x] `features/purchase-orders/hooks/use-po-receive-workflow.ts` - Dùng `usePurchaseOrderMutations.processReceipt`

### Customer Store migrations:
- [x] `features/orders/components/customer-selector.tsx` - Dùng `useCustomerMutations`
- [x] `features/orders/components/customer-address-selector.tsx` - Dùng `useCustomerMutations`

### Payment Store migrations:
- [x] `features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx` - Dùng `usePaymentMutations`
- [x] `features/warranty/components/dialogs/hooks/use-payment-voucher-stores.ts` - Dùng `usePaymentMutations`
- [x] `features/payroll/components/create-payment-dialog.tsx` - Dùng `usePaymentMutations`

### Penalty Store migrations:
- [x] `features/settings/penalties/penalty-form-page.tsx` - Dùng `usePenaltyMutations`, `usePenaltyFinder`

### Order Store migrations:
- [x] `features/orders/hooks/use-all-orders.ts` - Dùng `useOrders` React Query

### Stores đã synced với DB:
- [x] `stock-history` - `loadFromAPI()` + `addEntry()` gọi POST API

### New API endpoints (Session Jan 24):
- [x] `POST /api/purchase-orders/[systemId]/cancel` - Cancel PO với history entry
- [x] `POST /api/purchase-orders/[systemId]/process-receipt` - Update PO status from receipts  
- [x] `PATCH /api/products/[systemId]/inventory` - Update product stock + StockHistory

---

## 🟡 Files sử dụng pattern `getState()` - KHÔNG CẦN MIGRATE

Các files này dùng `useXxxStore.getState()` để truy cập data ngoài React component (valid Zustand pattern):

- `features/categories/columns.tsx` - `useProductStore.getState()` for product count
- `features/brands/columns.tsx` - `useProductStore.getState()` for product count  
- `features/products/columns.tsx` - `useProductStore.getState()` for lookups
- `features/inventory-receipts/store.ts` - `useProductStore.getState()` for updateLastPurchasePrice
- All store slices in `features/orders/store/*.ts`, `features/purchase-orders/store/*.ts`

---

## 🔴 HIGH PRIORITY - CẦN MIGRATE
- `useInventoryReceiptStore`
- `useStockTransferStore`
- `useStockLocationStore`
- `useOrderStore`
- `usePurchaseOrderStore`
- `usePurchaseReturnStore`
- `useSalesReturnStore`
- `useCashbookStore`
- `useReceiptStore`
- `usePaymentStore`
- `useAttendanceStore`
- `useLeaveStore`
- `usePayrollBatchStore`
- `usePayrollTemplateStore`
- `useTaskStore`
- `useComplaintStore`
- `useShipmentStore`
- `useWikiStore`
- `useAuditLogStore`
- `useCostAdjustmentStore`

---

## 🔧 Pattern Migration

### Before (Zustand):
```typescript
import { useEmployeeStore } from '@/features/employees/store';

function MyComponent() {
  const { data: employees, findById, update } = useEmployeeStore();
  
  const employee = findById(systemId);
  // ...
}
```

### After (React Query):
```typescript
import { useAllEmployees, useEmployeeFinder, useEmployeeMutations } from '@/features/employees/hooks/use-employees';

function MyComponent() {
  const { data: employees } = useAllEmployees();
  const { findById } = useEmployeeFinder();
  const { update } = useEmployeeMutations();
  
  const employee = findById(systemId);
  // ...
}
```

---

## ⚠️ Special Cases

### 1. `getState()` pattern
Zustand cho phép gọi `useXxxStore.getState()` outside components. React Query không có pattern này.

**Solution:** 
- Tạo utility function riêng: `getEmployeeById(id)`
- Hoặc dùng `queryClient.getQueryData(['employees'])`

### 2. Store slices (orders, purchase-orders)
Các module như `orders/store` có nhiều slices (delivery-slice, payment-slice, etc.) đều import stores.

**Solution:**
- Migrate từng slice một
- Hoặc tạo wrapper hooks cho business logic

### 3. `use-api-sync.ts`
File này load tất cả stores khi app start. Cần refactor để dùng React Query prefetch thay vì Zustand.

---

## 📅 Execution Order

1. **Phase 1:** Update imports trong features (không thay đổi logic)
2. **Phase 2:** Refactor các slices dùng `getState()` pattern
3. **Phase 3:** Update `use-api-sync.ts` 
4. **Phase 4:** Remove deprecated store files
5. **Phase 5:** Test toàn bộ

---

## ✅ Progress Tracking

- [x] Audit tất cả stores
- [x] Tạo script detect usages
- [x] Tạo migration plan
- [ ] Update Employee imports
- [ ] Update Product imports
- [ ] Update StockHistory imports
- [ ] Update các imports khác
- [ ] Refactor use-api-sync.ts
- [ ] Remove deprecated stores
- [ ] Test toàn bộ

