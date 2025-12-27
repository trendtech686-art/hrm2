# 🗑️ LocalStorage Removal Plan

> **Mục tiêu:** Xóa hoàn toàn localStorage, chuyển sang Database (PostgreSQL) làm source of truth duy nhất.
> **Cập nhật:** 21/12/2025
> **Trạng thái:** 🔄 ĐANG TIẾN HÀNH

## 📊 Trạng thái hiện tại

| Metric | Số lượng | Trạng thái |
|--------|----------|------------|
| localStorage usages | 132 | ❌ Cần xóa |
| Zustand stores với persistKey | 42 | ❌ Cần xóa |
| Files cần xử lý | 31 | ❌ Cần xử lý |

### ✅ Đã hoàn thành (từ nextjs-migration-plan):
- ✅ PostgreSQL + Prisma setup (54 models)
- ✅ API Routes (53 endpoints)
- ✅ NextAuth.js authentication
- ✅ ApiSyncProvider (8 entities: employees, customers, products, orders, suppliers, warranties, wiki, settings)
- ✅ TypeScript 0 errors
- ✅ Parallel API sync (Promise.all)

### ❌ Chưa hoàn thành:
- ❌ ApiSyncProvider chỉ sync 8/50+ entities
- ❌ 42 stores vẫn dùng `persistKey` → localStorage
- ❌ Store CRUD ghi cả API + localStorage
- ❌ 9 hooks dùng localStorage trực tiếp
- ❌ 5 sync libraries cache localStorage

---

## 🎯 Phase 0: Mở rộng ApiSyncProvider (QUAN TRỌNG NHẤT)

### Mục tiêu
Trước khi xóa localStorage, cần đảm bảo TẤT CẢ entities được sync từ database.

### Entities cần thêm vào ApiSyncProvider:

#### 0.1 Transaction Entities (HIGH PRIORITY)
| Entity | API Endpoint | Store |
|--------|--------------|-------|
| Leaves | `/api/leaves` | `useLeavesStore` |
| Attendance | `/api/attendance` | `useAttendanceStore` |
| PurchaseOrders | `/api/purchase-orders` | `usePurchaseOrderStore` |
| PurchaseReturns | `/api/purchase-returns` | `usePurchaseReturnStore` |
| SalesReturns | `/api/sales-returns` | `useSalesReturnStore` |
| InventoryReceipts | `/api/inventory-receipts` | `useInventoryReceiptStore` |
| InventoryChecks | `/api/inventory-checks` | `useInventoryCheckStore` |
| StockTransfers | `/api/stock-transfers` | `useStockTransferStore` |
| CostAdjustments | `/api/cost-adjustments` | `useCostAdjustmentStore` |

#### 0.2 Finance Entities
| Entity | API Endpoint | Store |
|--------|--------------|-------|
| Receipts | `/api/receipts` | `useReceiptStore` |
| Payments | `/api/payments` | `usePaymentStore` |
| Cashbook | `/api/cash-transactions` | `useCashbookStore` |

#### 0.3 Operations Entities
| Entity | API Endpoint | Store |
|--------|--------------|-------|
| Tasks | `/api/tasks` | `useTaskStore` |
| Complaints | `/api/complaints` | `useComplaintStore` |
| Shipments | `/api/shipments` | `useShipmentStore` |

#### 0.4 Settings Entities
| Entity | API Endpoint | Store |
|--------|--------------|-------|
| Branches | `/api/branches` | `useBranchStore` |
| Departments | `/api/departments` | `useDepartmentStore` |
| JobTitles | `/api/job-titles` | `useJobTitleStore` |
| StockLocations | `/api/stock-locations` | `useStockLocationStore` |
| Brands | `/api/brands` | `useBrandStore` |
| Categories | `/api/categories` | `useCategoryStore` |

---

## 🎯 Phase 1: Remove Zustand persistKey (42 stores)

### Mục tiêu
Xóa `persistKey` từ tất cả Zustand stores vì đã có `ApiSyncProvider` load data từ database.

### Files cần sửa

#### 1.1 Core Entity Stores
| File | persistKey | Priority |
|------|------------|----------|
| `features/customers/store.ts` | `hrm-customers` | HIGH |
| `features/employees/store.ts` | `hrm-employees` | HIGH |
| `features/orders/store.ts` | `hrm-orders` | HIGH |
| `features/products/store.ts` | `hrm-products` | HIGH |
| `features/suppliers/store.ts` | `hrm-suppliers` | HIGH |

#### 1.2 Transaction Stores
| File | persistKey | Priority |
|------|------------|----------|
| `features/inventory-checks/store.ts` | `inventory-checks` | MEDIUM |
| `features/inventory-receipts/store.ts` | `hrm-inventory-receipts` | MEDIUM |
| `features/leaves/store.ts` | `hrm-leaves` | MEDIUM |
| `features/purchase-orders/store.ts` | `hrm-purchase-orders` | MEDIUM |
| `features/purchase-returns/store.ts` | `hrm-purchase-returns` | MEDIUM |
| `features/sales-returns/store.ts` | `hrm-sales-returns` | MEDIUM |

#### 1.3 Settings Stores
| File | persistKey | Priority |
|------|------------|----------|
| `features/settings/branches/store.ts` | `hrm-branches` | MEDIUM |
| `features/settings/departments/store.ts` | `hrm-departments` | MEDIUM |
| `features/settings/job-titles/store.ts` | `hrm-job-titles` | MEDIUM |
| `features/settings/penalties/store.ts` | `hrm-penalties`, `hrm-penalty-types` | LOW |
| `features/settings/pricing/store.ts` | `hrm-pricing-policy-storage` | LOW |
| `features/settings/receipt-types/store.ts` | `hrm-receipt-types` | LOW |
| `features/settings/sales-channels/store.ts` | `hrm-sales-channel-storage` | LOW |
| `features/settings/shipping/store.ts` | `hrm-shipping-partners` | LOW |
| `features/settings/target-groups/store.ts` | `hrm-target-groups` | LOW |
| `features/settings/taxes/store.ts` | `hrm-taxes-storage` | LOW |
| `features/settings/units/store.ts` | `hrm-units` | LOW |

#### 1.4 Customer Settings Stores
| File | persistKey | Priority |
|------|------------|----------|
| `features/settings/customers/credit-ratings-store.ts` | `hrm-credit-ratings` | LOW |
| `features/settings/customers/customer-groups-store.ts` | `hrm-customer-groups` | LOW |
| `features/settings/customers/customer-sources-store.ts` | `hrm-customer-sources` | LOW |
| `features/settings/customers/customer-types-store.ts` | `hrm-customer-types` | LOW |
| `features/settings/customers/lifecycle-stages-store.ts` | `hrm-lifecycle-stages` | LOW |
| `features/settings/customers/payment-terms-store.ts` | `hrm-payment-terms` | LOW |
| `features/settings/customers/sla-settings-store.ts` | `hrm-customer-sla-settings` | LOW |

#### 1.5 Location Stores
| File | persistKey | Priority |
|------|------------|----------|
| `features/settings/provinces/store.ts` | `hrm-provinces`, `hrm-districts`, `hrm-wards` | LOW |
| `features/stock-locations/store.ts` | `hrm-stock-locations` | LOW |

#### 1.6 Task & Warranty Stores
| File | persistKey | Priority |
|------|------------|----------|
| `features/tasks/custom-fields-store.ts` | `hrm-custom-fields` | MEDIUM |
| `features/tasks/recurring-store.ts` | `hrm-recurring-tasks` | MEDIUM |
| `features/tasks/store.ts` | `hrm-internal-tasks` | MEDIUM |
| `features/tasks/template-store.ts` | `hrm-task-templates` | MEDIUM |
| `features/warranty/store/base-store.ts` | `hrm-warranty-tickets` | MEDIUM |

### Cách xử lý
```typescript
// TRƯỚC
const baseStore = createCrudStore<Customer>(initialData, 'customers', {
  businessIdField: 'id',
  persistKey: 'hrm-customers', // ❌ XÓA DÒNG NÀY
  getCurrentUser: () => asSystemId(getCurrentUserSystemId())
});

// SAU
const baseStore = createCrudStore<Customer>(initialData, 'customers', {
  businessIdField: 'id',
  // persistKey removed - data loaded from API via ApiSyncProvider
  getCurrentUser: () => asSystemId(getCurrentUserSystemId())
});
```

---

## 🎯 Phase 2: Migrate Hooks to Database-Only (9 files)

### 2.1 `hooks/use-column-visibility.ts` (7 usages)
**Hiện tại:** Cache column visibility trong localStorage
**Giải pháp:** Đã có API `/api/user-preferences` - sử dụng trực tiếp

```typescript
// Xóa localStorage, chỉ dùng API
const [visibility, setVisibility] = useUserPreference('column-visibility', tableKey, {});
```

### 2.2 `hooks/use-settings-storage.ts` (5 usages)
**Hiện tại:** Generic hook cho settings với localStorage cache
**Giải pháp:** Chuyển sang dùng `/api/settings` API

### 2.3 `hooks/use-workflow-templates.ts` (3 usages)
**Hiện tại:** Workflow templates trong localStorage
**Giải pháp:** Đã có API `/api/workflow-templates`

### 2.4 `hooks/use-persistent-state.ts` (2 usages)
**Hiện tại:** Generic persistent state hook
**Giải pháp:** Remove hook, chuyển caller sang dùng specific API

### 2.5 `hooks/use-due-date-notifications.ts` (3 usages)
**Hiện tại:** Due date notification settings
**Giải pháp:** Chuyển sang `/api/user-preferences`

---

## 🎯 Phase 3: Migrate Sync Libraries (5 files)

### 3.1 `lib/settings-cache.ts` (3 usages)
**Hiện tại:** Cache general settings với localStorage fallback
**Giải pháp:** Xóa localStorage fallback, chỉ dùng in-memory cache + API

### 3.2 `lib/website-settings-sync.ts` (8 usages)
**Hiện tại:** Website settings với localStorage cache
**Giải pháp:** Xóa localStorage, chỉ dùng API `/api/website-settings`

### 3.3 `lib/warranty-settings-sync.ts` (16 usages)
**Hiện tại:** Warranty settings sync với localStorage
**Giải pháp:** Xóa localStorage, chỉ dùng API `/api/warranty-settings`

### 3.4 `lib/complaints-settings-sync.ts` (20 usages)
**Hiện tại:** Complaints settings sync với localStorage
**Giải pháp:** Xóa localStorage, chỉ dùng API `/api/complaints-settings`

### 3.5 `lib/active-timer-sync.ts` (5 usages)
**Hiện tại:** Active timer state trong localStorage
**Giải pháp:** Chuyển sang `/api/user-preferences` hoặc `/api/timers`

---

## 🎯 Phase 4: Cleanup Remaining Files (17 files)

### 4.1 Components
| File | Usages | Action |
|------|--------|--------|
| `components/Comments.tsx` | 4 | Xóa draft localStorage |
| `components/DatabaseComments.tsx` | 2 | Xóa localStorage fallback |
| `components/shared/print-options-dialog.tsx` | 2 | Chuyển sang user-preferences API |
| `components/shared/simple-print-options-dialog.tsx` | 2 | Chuyển sang user-preferences API |
| `components/settings/data-migration-tool.tsx` | 1 | Tool migration - giữ lại hoặc xóa |

### 4.2 Features
| File | Usages | Action |
|------|--------|--------|
| `features/auth/otp-verification-page.tsx` | 1 | Xóa - dùng NextAuth session |
| `features/complaints/use-realtime-updates.ts` | 4 | Chuyển sang server-side versioning |
| `features/warranty/use-realtime-updates.ts` | 4 | Chuyển sang server-side versioning |
| `features/customers/sla/ack-storage.ts` | 2 | Chuyển sang API |
| `features/customers/sla/sla-sync.ts` | 13 | Chuyển sang API |
| `features/customers/sla/store.ts` | 3 | Xóa localStorage tracking |
| `features/employees/virtualized-page.tsx` | 1 | Xóa debug code |
| `features/orders/components/shipping/service-config-form.tsx` | 3 | Chuyển sang API |
| `features/settings/appearance/store.ts` | 1 | Chuyển sang user-preferences |
| `features/settings/other-page.tsx` | 6 | Storage info - cập nhật logic |
| `features/tasks/types-filter.ts` | 3 | Dùng auth context thay vì localStorage |

### 4.3 Utils
| File | Usages | Action |
|------|--------|--------|
| `lib/print/payroll-print-helper.ts` | 1 | Dùng store thay vì localStorage |
| `lib/utils/shipping-config-migration.ts` | 3 | Migration tool - xóa sau khi migrate xong |

---

## 🎯 Phase 5: Update store-factory.ts

Sửa `lib/store-factory.ts` để không còn sử dụng `persist` middleware:

```typescript
// TRƯỚC
export function createCrudStore<T>(..., options?: { persistKey?: string }) {
  if (options?.persistKey) {
    return create(persist(...));
  }
  return create(...);
}

// SAU - Xóa hoàn toàn persist logic
export function createCrudStore<T>(...) {
  return create(...); // No persist
}
```

---

## 🎯 Phase 6: Refactor Large Files (>1000 lines)

### Mục tiêu
Tách các file lớn thành các module nhỏ hơn (<500 lines) để dễ maintain, test và review.

### Nguyên tắc tách file:
1. **Components**: Tách thành sub-components trong thư mục `components/`
2. **Hooks**: Tách logic thành custom hooks trong thư mục `hooks/`
3. **Utils**: Tách helper functions vào `utils/` hoặc `lib/`
4. **Types**: Tách types vào file `types.ts` riêng
5. **Constants**: Tách constants vào file `constants.ts`

### 6.1 Detail Pages (Priority: HIGH)
| File | Lines | Giải pháp |
|------|-------|-----------|
| `orders/order-detail-page.tsx` | 2972 | Tách: OrderHeader, OrderItems, OrderPayments, OrderShipping, OrderHistory |
| `customers/detail-page.tsx` | 1853 | Tách: CustomerInfo, CustomerOrders, CustomerDebt, CustomerSLA |
| `employees/detail-page.tsx` | 1828 | Tách: EmployeeInfo, EmployeeAttendance, EmployeeLeaves, EmployeePayroll |
| `purchase-orders/detail-page.tsx` | 1651 | Tách: POHeader, POItems, POReceiving, POPayments |
| `products/detail-page.tsx` | 1436 | Tách: ProductInfo, ProductInventory, ProductPricing, ProductHistory |

### 6.2 Form Pages (Priority: HIGH)
| File | Lines | Giải pháp |
|------|-------|-----------|
| `products/product-form-complete.tsx` | 2028 | Tách: BasicInfo, Pricing, Inventory, Variants, SEO tabs |
| `sales-returns/form-page.tsx` | 1907 | Tách: ReturnItems, ReturnReason, RefundSection |
| `employees/employee-form.tsx` | 1792 | Tách: PersonalInfo, Employment, Salary, Documents tabs |
| `complaints/form-page.tsx` | 1460 | Tách: ComplaintInfo, AssignSection, ResolutionSection |
| `customers/customer-form.tsx` | 1431 | Tách: BasicInfo, Addresses, Settings tabs |
| `orders/order-form-page.tsx` | 1293 | Tách: CustomerSection, ProductTable, PaymentSection, ShippingSection |

### 6.3 Store Files (Priority: MEDIUM)
| File | Lines | Giải pháp |
|------|-------|-----------|
| `orders/store.ts` | 1897 | Tách: order-actions.ts, order-helpers.ts, order-selectors.ts |

### 6.4 Settings Pages (Priority: MEDIUM)
| File | Lines | Giải pháp |
|------|-------|-----------|
| `settings/other-page.tsx` | 4156 | Tách thành nhiều tab components riêng |
| `complaints/complaints-settings-page.tsx` | 1571 | Tách: StatusSettings, CategorySettings, SLASettings |
| `tasks/tasks-settings-page.tsx` | 1529 | Tách: TypeSettings, PrioritySettings, CustomFields |
| `printer/print-templates-page.tsx` | 1364 | Tách: TemplateList, TemplateEditor, TemplatePreview |

### 6.5 Other Large Files (Priority: LOW)
| File | Lines | Giải pháp |
|------|-------|-----------|
| `pkgx/components/product-mapping-tab.tsx` | 1992 | Tách: MappingTable, MappingForm, MappingPreview |
| `products/page.tsx` | 1551 | Tách: ProductFilters, ProductActions, BulkOperations |
| `orders/components/shipping/service-config-form.tsx` | 1305 | Tách theo từng carrier: GHTKConfig, VNPostConfig, etc. |
| `lib/breadcrumb-system.ts` | 1300 | Tách: breadcrumb-config.ts, breadcrumb-utils.ts |

### ⚠️ Không cần tách (Data files)
| File | Lines | Lý do |
|------|-------|-------|
| `provinces/wards-3level-data.ts` | 100390 | Static data - OK |
| `provinces/ward-old-to-new-mapping.ts` | 42222 | Static mapping - OK |
| `provinces/wards-2level-data.ts` | 26604 | Static data - OK |
| `provinces/ward-district-data.ts` | 26595 | Static data - OK |
| `provinces/districts-data.ts` | 3765 | Static data - OK |

---

## 📋 Execution Checklist

### Phase 1: Remove persistKey
- [ ] Core Entity Stores (5 files)
- [ ] Transaction Stores (6 files)
- [ ] Settings Stores (11 files)
- [ ] Customer Settings Stores (7 files)
- [ ] Location Stores (2 files)
- [ ] Task & Warranty Stores (5 files)

### Phase 2: Migrate Hooks
- [ ] use-column-visibility.ts
- [ ] use-settings-storage.ts
- [ ] use-workflow-templates.ts
- [ ] use-persistent-state.ts
- [ ] use-due-date-notifications.ts

### Phase 3: Migrate Sync Libraries
- [ ] settings-cache.ts
- [ ] website-settings-sync.ts
- [ ] warranty-settings-sync.ts
- [ ] complaints-settings-sync.ts
- [ ] active-timer-sync.ts

### Phase 4: Cleanup Remaining
- [ ] Components (5 files)
- [ ] Features (11 files)
- [ ] Utils (2 files)

### Phase 5: Update Infrastructure
- [ ] store-factory.ts
- [ ] index.html (appearance theme script)
- [ ] app/layout.tsx (appearance theme)

### Phase 6: Refactor Large Files (>1000 lines)
- [ ] orders/order-detail-page.tsx (2972 lines)
- [ ] products/product-form-complete.tsx (2028 lines)
- [ ] pkgx/components/product-mapping-tab.tsx (1992 lines)
- [ ] sales-returns/form-page.tsx (1907 lines)
- [ ] orders/store.ts (1897 lines)
- [ ] customers/detail-page.tsx (1853 lines)
- [ ] employees/detail-page.tsx (1828 lines)
- [ ] employees/employee-form.tsx (1792 lines)
- [ ] purchase-orders/detail-page.tsx (1651 lines)
- [ ] complaints/complaints-settings-page.tsx (1571 lines)
- [ ] products/page.tsx (1551 lines)
- [ ] tasks/tasks-settings-page.tsx (1529 lines)
- [ ] complaints/form-page.tsx (1460 lines)
- [ ] products/detail-page.tsx (1436 lines)
- [ ] customers/customer-form.tsx (1431 lines)
- [ ] printer/print-templates-page.tsx (1364 lines)
- [ ] orders/components/shipping/service-config-form.tsx (1305 lines)
- [ ] lib/breadcrumb-system.ts (1300 lines)
- [ ] orders/order-form-page.tsx (1293 lines)

---

## ⚠️ Risks & Mitigations

### Risk 1: Data Loss
**Mitigation:** Chạy migration script trước khi xóa localStorage

### Risk 2: Performance
**Mitigation:** Đảm bảo API có caching layer, parallel loading

### Risk 3: Offline Support
**Mitigation:** Nếu cần offline, dùng IndexedDB hoặc Service Worker thay vì localStorage

---

## 🔄 Migration Script

Trước khi thực hiện, chạy script để migrate data từ localStorage sang database:

```bash
# 1. Backup localStorage data
npx ts-node scripts/backup-localstorage.ts

# 2. Migrate to database
npx ts-node scripts/migrate-localstorage-to-db.ts

# 3. Verify migration
npx ts-node scripts/verify-migration.ts

# 4. Remove localStorage code
# (manual code changes)

# 5. Clear localStorage
# (in browser devtools or via script)
```

---

## 📅 Timeline Estimate

| Phase | Files | Estimated Time |
|-------|-------|----------------|
| Phase 1 | 36 stores | 2-3 hours |
| Phase 2 | 5 hooks | 2-3 hours |
| Phase 3 | 5 sync libs | 2-3 hours |
| Phase 4 | 17 files | 3-4 hours |
| Phase 5 | 3 files | 1 hour |
| Phase 6 | 19 large files | 15-20 hours |
| **Total** | **85 files** | **25-34 hours** |

---

## ✅ Definition of Done

1. ✅ `npx ts-node scripts/check-localstorage-usage.ts` returns 0 usages
2. ✅ All Zustand stores load from API only
3. ✅ All user preferences stored in database
4. ✅ `localStorage` keyword not found in source code (except tests)
5. ✅ Application works correctly without localStorage
6. ✅ TypeScript compiles without errors
7. ✅ All tests pass
8. ✅ No file exceeds 1000 lines (except static data files)
