# Báo cáo rà soát `useAllXxx` hooks - HRM2

> Generated: 2026-04-28
> Updated: 2026-04-28 (FINAL - 100% COMPLETE)
> Mục đích: Tối ưu load data - dùng Meilisearch cho entity tăng trưởng nhanh

---

## ✅ TỔNG KẾT - 100% COMPLETE

### Infrastructure Status

| Entity | API | Hooks | Fallback | Files Using | Status |
|--------|-----|-------|----------|-------------|--------|
| Products | ✅ | ✅ | ✅ | 9 | ✅ COMPLETE |
| Customers | ✅ | ✅ | ✅ | 5 | ✅ COMPLETE |
| Employees | ✅ | ✅ | ✅ | 26 | ✅ COMPLETE |
| Suppliers | ✅ | ✅ | ✅ | 6 | ✅ COMPLETE |
| Shipments | ✅ | ✅ | ✅ | 1 | ✅ COMPLETE |
| Warranties | ✅ | ✅ | ✅ | 0 | ✅ READY |

---

## CHI TIẾT HOÀN THÀNH

### Products ✅ COMPLETE (9 files)

**API:** `app/api/search/products/route.ts` + `lib/search/products-meilisearch-fallback-prisma.ts`
**Hooks:** `useMeiliProductSearch`, `useInfiniteMeiliProductSearch`, `useProductAutocomplete`

**Files:**
- `components/shared/product-search-combobox.tsx`
- `components/shared/unified-product-search.tsx`
- `components/shared/bulk-product-selector-dialog.tsx`
- `features/orders/page.tsx`
- `features/purchase-orders/components/bulk-product-selector-dialog.tsx`
- `features/purchase-orders/components/product-combobox-virtual.tsx`
- `features/settings/trendtech/components/product-mapping-tab.tsx`
- `features/shared/product-selection-dialog.tsx`
- `features/products/components/combo-product-search.tsx`

---

### Customers ✅ COMPLETE (5 files)

**API:** `app/api/search/customers/route.ts` + `lib/search/customers-prisma-fallback.ts`
**Hooks:** `useMeiliCustomerSearch`, `useInfiniteMeiliCustomerSearch`, `useCustomerAutocomplete`

**Files:**
- `features/orders/components/customer-selector.tsx`
- `features/orders/page.tsx`
- `features/shipments/page.tsx`
- `features/customers/page.tsx`
- `components/shared/unified-customer-search.tsx`

---

### Employees ✅ COMPLETE (26 files)

**API:** `app/api/search/employees/route.ts` + `lib/search/employees-prisma-fallback.ts`
**Hooks:** `useMeiliEmployeeSearch`, `useInfiniteMeiliEmployeeSearch`, `useEmployeeAutocomplete`

**Files:**
- `features/employees/page.tsx`
- `features/leaves/components/leave-form.tsx`
- `features/tasks/components/task-form-page.tsx`
- `features/tasks/components/templates-page.tsx`
- `features/tasks/components/detail-page.tsx`
- `features/tasks/components/recurring-page.tsx`
- `features/tasks/page.tsx`
- `features/payroll/components/payslip-print-button.tsx`
- `features/payroll/detail-page.tsx`
- `features/orders/page.tsx`
- `features/orders/components/order-form-page.tsx`
- `features/settings/penalties/page.tsx`
- `features/settings/penalties/form.tsx`
- `features/settings/branches/branch-form.tsx`
- `features/settings/store-info/store-info-page.tsx`
- `features/settings/departments/page.tsx`
- `features/settings/employees/employee-roles-page.tsx`
- `features/suppliers/supplier-form.tsx`
- `features/inventory-checks/form-page.tsx`
- `features/packaging/page.tsx`
- `features/attendance/page.tsx`
- `features/complaints/page.tsx`
- `features/complaints/components/detail-page.tsx`
- `features/wiki/form-page.tsx`
- `features/settings/departments/organization-chart/hooks/use-org-chart.ts`
- `features/payments/page.tsx`

---

### Suppliers ✅ COMPLETE (6 files)

**API:** `app/api/search/suppliers/route.ts` + `lib/search/suppliers-prisma-fallback.ts`
**Hooks:** `useMeiliSupplierSearch`, `useInfiniteMeiliSupplierSearch`, `useSupplierAutocomplete`

**Files:**
- `features/inventory-receipts/page.tsx`
- `features/ordered-products/page.tsx`
- `features/purchase-orders/page.tsx`
- `features/supplier-warranty/page.tsx`
- `features/purchase-orders/components/supplier-combobox.tsx` ✅ **MIGRATED**
- `features/purchase-orders/form-page.tsx` (uses `useSupplier(id)` - correct)

---

### Shipments ✅ COMPLETE (1 file)

**API:** `app/api/search/shipments/route.ts` + `lib/search/shipments-prisma-fallback.ts`
**Hooks:** `useMeiliShipmentSearch`, `useInfiniteMeiliShipmentSearch`, `useShipmentAutocomplete`

**Files:**
- `features/shipments/page.tsx` ✅ **MIGRATED** (hybrid approach)

---

### Warranties ✅ READY (0 files - infrastructure sẵn sàng)

**API:** `app/api/search/warranties/route.ts` + `lib/search/warranties-prisma-fallback.ts`
**Hooks:** `useMeiliWarrantySearch`, `useInfiniteMeiliWarrantySearch`, `useWarrantyAutocomplete`

**Notes:**
- `useAllWarranties` gần như không được sử dụng trong codebase
- Các warranty components đang dùng `useWarranties(params)` - đúng approach
- Meilisearch phù hợp cho autocomplete, không cần cho list pages vì cần full data

---

## ĐÁNH GIÁ CHUẨN NEXT.JS

| Tiêu chí | Products | Customers | Employees | Suppliers | Shipments | Warranties |
|----------|----------|-----------|-----------|-----------|-----------|------------|
| Auth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Validation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Limit cap | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pagination | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sort | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Filter | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fallback | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Error handling | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Response format | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## CLEANUP ĐÃ THỰC HIỆN

Đã xóa unused imports từ `features/products/detail-page.tsx`:
- `useAllPurchaseOrders`
- `useAllInventoryReceipts`
- `useEmployeeFinder`
- `useAllWarranties`
- `useAllInventoryChecks`
- `useAllStockTransfers`

---

## CÁC FILES GIỮ NGUYÊN (CÓ LÝ DO)

| File | Lý do giữ nguyên |
|------|-------------------|
| `features/payroll/run-page.tsx` | Cần `baseSalary`, `numberOfDependents` cho payroll calculations - Meilisearch không có |
| `features/employees/hooks/use-all-employees.ts` | Internal helper hook |
| `features/employees/hooks/use-employee-finder.ts` | Cache helper |
| `features/products/hooks/use-all-products.ts` | Internal helper hook |
| `features/customers/hooks/use-all-customers.ts` | Internal helper hook |
| `features/suppliers/hooks/use-all-suppliers.ts` | Internal helper hook |
| `features/shipments/hooks/use-shipments.ts` | Fallback khi Meilisearch không có filter |

---

## ✅ KẾT LUẬN

### 100% COMPLETE ✅

| Component | Status | Files |
|----------|--------|-------|
| **Infrastructure** | ✅ | 6 APIs, 18 hooks, 6 fallbacks |
| **Products** | ✅ 100% | 9 files |
| **Customers** | ✅ 100% | 5 files |
| **Employees** | ✅ 100% | 26 files |
| **Suppliers** | ✅ 100% | 6 files |
| **Shipments** | ✅ 100% | 1 file |
| **Warranties** | ✅ Ready | Infrastructure sẵn sàng |

### Dead Code Cleanup
- ✅ Đã xóa unused imports từ `features/products/detail-page.tsx`
- Các helper hooks (`useAllXxx`) vẫn tồn tại nhưng không ảnh hưởng performance vì đã có cache strategy

### Khuyến nghị
**Dự án Meilisearch đã hoàn thành 100%.** Các helper hooks cũ có thể xóa dần khi có thời gian, nhưng không ảnh hưởng đến performance hiện tại.
