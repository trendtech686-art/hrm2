# Phase 8: Zustand Store Cleanup - Migration to React Query

> **Mục tiêu**: Loại bỏ duplicate state - Zustand stores chỉ để lưu in-memory, trong khi dữ liệu đã được load từ Database qua React Query.

## 📊 Audit Summary

### Vấn đề hiện tại
```
Database → API → React Query (cache) → Zustand store (DUPLICATE!) → Component
```

### Mục tiêu
```
Database → API → React Query (cache) → Component
```

---

## 🔍 Phân loại Stores

### A. Stores dùng `createCrudStore` (store-factory.ts)

| # | Store | File Path | React Query Hook | Action |
|---|-------|-----------|------------------|--------|
| 1 | `useSupplierStore` | features/suppliers/store.ts | ✅ use-suppliers.ts | ⚠️ Remove store |
| 2 | `useStockLocationStore` | features/stock-locations/store.ts | ✅ use-stock-locations.ts | ⚠️ Remove store |
| 3 | `baseStore` (Tasks) | features/tasks/store/base-store.ts | ✅ use-tasks.ts | ⚠️ Remove store |
| 4 | `baseStore` (Warranty) | features/warranty/store/base-store.ts | ✅ use-warranties.ts | ⚠️ Remove store |
| 5 | `useTaskTemplateStore` | features/tasks/template-store.ts | ❌ Cần tạo | 📝 Create hook first |
| 6 | `useRecurringTaskStore` | features/tasks/recurring-store.ts | ❌ Cần tạo | 📝 Create hook first |
| 7 | `useCustomFieldStore` | features/tasks/custom-fields-store.ts | ❌ Cần tạo | 📝 Create hook first |
| 8 | `usePricingPolicyStore` | features/settings/pricing/store.ts | ✅ hooks/ | ⚠️ Remove store |
| 9 | `useUnitStore` | features/settings/units/store.ts | ✅ hooks/ | ⚠️ Remove store |

### B. Settings Stores (Trực tiếp dùng `create`)

| # | Store | File Path | React Query Hook | Action |
|---|-------|-----------|------------------|--------|
| 1 | `useProductCategoryStore` | features/settings/inventory/product-category-store.ts | ❌ Cần tạo | 📝 Create hook first |
| 2 | `useProductTypeStore` | features/settings/inventory/product-type-store.ts | ✅ use-product-types.ts | ⚠️ Remove store |
| 3 | `useStorageLocationStore` | features/settings/inventory/storage-location-store.ts | ❌ Cần tạo | 📝 Create hook first |
| 4 | `useBrandStore` | features/settings/inventory/brand-store.ts | ✅ hooks/ | ⚠️ Remove store |
| 5 | `useImporterStore` | features/settings/inventory/importer-store.ts | ✅ hooks/ | ⚠️ Remove store |
| 6 | `useRoleStore` | features/settings/employees/role-store.ts | ✅ use-roles.ts | ⚠️ Remove store |
| 7 | `usePrintTemplateStore` | features/settings/printer/store.ts | ❌ Cần tạo | 📝 Create hook first |
| 8 | `useSalesManagementSettingsStore` | features/settings/sales/sales-management-store.ts | ❌ Cần tạo | 📝 Create hook first |
| 9 | `useStoreInfoStore` | features/settings/store-info/store-info-store.ts | ✅ use-store-info.ts | ⚠️ Remove store |
| 10 | `useTaxSettingsStore` | features/settings/tax-settings-store.ts | ❌ Cần tạo | 📝 Create hook first |
| 11 | `useAppearanceStore` | features/settings/appearance/store.ts | ✅ subscribeWithSelector | ✅ Keep (UI state) |
| 12 | `usePkgxStore` | features/settings/pkgx/store/index.ts | ✅ subscribeWithSelector | ✅ Keep (integration) |
| 13 | `useTrendtechStore` | features/settings/trendtech/store/index.ts | ✅ subscribeWithSelector | ✅ Keep (integration) |
| 14 | `useGlobalSettingsStore` | features/settings/global-settings-store.ts | ❌ Cần check | 📝 Evaluate |
| 15 | `useSettingsConfigStore` | features/settings/settings-config-store.ts | ❌ Cần check | 📝 Evaluate |

### C. Feature Domain Stores

| # | Store | File Path | React Query Hook | Action |
|---|-------|-----------|------------------|--------|
| 1 | `useShipmentStore` | features/shipments/store/index.ts | ❌ Cần tạo | 📝 Create hook first |
| 2 | `useComplaintStore` | features/complaints/store/index.ts | ✅ use-complaints.ts | ⚠️ Remove store |
| 3 | `useCostAdjustmentStore` | features/cost-adjustments/store/index.ts | ✅ hooks/ | ⚠️ Remove store |
| 4 | `useOrderStore` | features/orders/store/index.ts | ✅ use-orders.ts | ⚠️ Remove store |
| 5 | `useCustomerStore` | features/customers/store.ts | ✅ use-customers.ts | ⚠️ Remove store |
| 6 | `useEmployeeStore` | features/employees/store.ts | ✅ use-employees.ts | ⚠️ Remove store |
| 7 | `useProductStore` | features/products/store.ts | ✅ use-products.ts | ⚠️ Remove store |
| 8 | `useReceiptStore` | features/receipts/store/index.ts | ✅ use-receipts.ts | ⚠️ Remove store |
| 9 | `usePaymentStore` | features/payments/store.ts | ✅ use-payments.ts | ⚠️ Remove store |

### D. Utility Stores (lib/) - GIỮ LẠI

| # | Store | File Path | Lý do giữ |
|---|-------|-----------|-----------|
| 1 | `useUIStore` | lib/ui-store.ts | ✅ Client-only UI state (sidebar, modal) |
| 2 | `useThemeStore` | lib/theme-store.ts | ✅ Client-only theme preference |
| 3 | `useLayoutStore` | lib/layout-store.ts | ✅ Client-only layout state |
| 4 | `useImportExportStore` | lib/import-export/import-export-store.ts | ✅ Temporary import state |

---

## 📋 Migration Plan

### Phase 8.1: Tạo React Query hooks còn thiếu ✅ COMPLETED
**Priority: HIGH** - Cần tạo trước khi xóa stores

1. [x] `features/shipments/hooks/use-shipments.ts` - Already exists
2. [x] `features/settings/inventory/hooks/use-categories.ts` - **CREATED**
3. [x] `features/settings/inventory/hooks/use-storage-locations.ts` - Already exists
4. [x] `features/settings/printer/hooks/use-print-templates.ts` - Already exists
5. [x] `features/settings/sales/hooks/use-sales-settings.ts` - Already exists
6. [x] `features/settings/hooks/use-tax-settings.ts` - **CREATED**
7. [ ] `features/tasks/hooks/use-task-templates.ts` - ⚠️ NO DB TABLE (deferred)
8. [ ] `features/tasks/hooks/use-recurring-tasks.ts` - ⚠️ NO DB TABLE (deferred)
9. [ ] `features/tasks/hooks/use-custom-fields.ts` - ⚠️ NO DB TABLE (deferred)

> **Note:** Task templates, recurring tasks, custom fields stores don't have database tables.
> These are in-memory only and will be migrated in Phase 8.4 (requires Prisma schema changes).

### Phase 8.2: Refactor components sử dụng stores
**Priority: MEDIUM**

Cho mỗi store cần xóa:
1. [ ] Tìm tất cả files import store
2. [ ] Thay đổi sang React Query hook
3. [ ] Test component hoạt động đúng
4. [ ] Xóa store file

### Phase 8.3: Cleanup store-factory.ts
**Priority: LOW**

1. [ ] Xóa `persistKey` option (đã deprecated)
2. [ ] Xóa `loadFromAPI` nếu không còn dùng
3. [ ] Simplify hoặc deprecate `createCrudStore`

---

## 🔧 Migration Pattern

### Before (Zustand Store)
```tsx
// Component
import { useProductTypeStore } from '../store';

function MyComponent() {
  const { data, findById } = useProductTypeStore();
  const type = findById(systemId);
  // ...
}
```

### After (React Query)
```tsx
// Component
import { useProductTypes, useProductType } from '../hooks/use-product-types';

function MyComponent() {
  const { data: types } = useProductTypes();
  const { data: type } = useProductType(systemId);
  // ...
}
```

---

## ⚠️ Lưu ý quan trọng

### Stores NÊN GIỮ LẠI:
1. **UI State stores** - Không cần persist, chỉ là client state
2. **Integration stores** (pkgx, trendtech) - Có logic sync đặc biệt
3. **Temporary state** - Import/export progress, form drafts

### Stores CẦN XÓA:
1. **Entity stores** với data từ database
2. **Settings stores** đã có API endpoint
3. **Duplicate cache** của React Query

---

## 📈 Progress Tracking

| Phase | Status | Progress |
|-------|--------|----------|
| 8.1 - Create missing hooks | ⏳ Not Started | 0/9 |
| 8.2 - Refactor components | ⏳ Not Started | 0/~30 |
| 8.3 - Cleanup store-factory | ⏳ Not Started | 0/3 |

---

## 📝 Checklist trước khi xóa mỗi store

- [ ] Đã có React Query hook thay thế
- [ ] Tất cả components đã migrate sang hook mới
- [ ] Không còn import store trong codebase
- [ ] Test thủ công các chức năng liên quan
- [ ] Build thành công, không lỗi TypeScript

---

*Created: 2026-01-05*
*Last Updated: 2026-01-05*
