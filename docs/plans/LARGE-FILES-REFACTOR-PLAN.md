# Large Files Refactoring Plan

> Created: 31/12/2024
> Updated: 02/01/2026
> Status: ✅ Completed (except Task 8 gradual migration)

## 📊 Danh sách Files Cần Tách

### 🔴 HIGH PRIORITY (>3000 lines hoặc >150KB)

| # | File | Lines | Size | Status | Notes |
|---|------|-------|------|--------|-------|
| 1 | `features/settings/other-page.tsx` | 4,226 | 191KB | ✅ DONE | 8 tabs → 10 files trong `features/settings/other/` |
| 2 | `features/orders/components/order-detail-page.tsx` | 3,186→1,664 | 183KB | ✅ DONE | Giảm ~48%, 8 components tách vào `features/orders/detail/` |

### 🟡 MEDIUM PRIORITY (1500-3000 lines)

| # | File | Lines | Size | Status | Notes |
|---|------|-------|------|--------|-------|
| 3 | `features/employees/components/detail-page.tsx` | 2,001→1,569 | 112KB | ✅ DONE | Giảm 22%, tách vào `features/employees/detail/` |
| 4 | `features/sales-returns/form-page.tsx` | 1,992→1,019 | 106KB | ✅ DONE | Giảm 49%, tách vào `features/sales-returns/form/` |
| 5 | `features/employees/components/employee-form.tsx` | 1,794 | 102KB | ⏭️ SKIPPED | Complex StagingFile state - không tách được dễ dàng |
| 6 | `features/customers/detail-page.tsx` | 2,002→1,460 | 94KB | ✅ DONE | Giảm 27%, tách vào `features/customers/detail/` |
| 7 | `features/orders/store.ts` | 1,825 | 90KB | 🚧 IN PROGRESS | React Query hooks ready, gradual migration |
| 8 | `features/products/product-form-complete.tsx` | 2,028→603 | 87KB | ✅ DONE | Giảm 70%, tách vào `features/products/product-form/` |
| 9 | `features/settings/pkgx/components/product-mapping-tab.tsx` | 1,992→1,186 | 90KB | ✅ DONE | Giảm 40%, 7 files vào `product-mapping/` |
| 10 | `features/purchase-orders/detail-page.tsx` | 1,676→1,216 | 86KB | ✅ DONE | Giảm 27%, 5 files vào `detail/` |
| 11 | `features/settings/complaints/complaints-settings-page.tsx` | 1,730→1,368 | 69KB | ✅ DONE | Giảm 21%, types.ts + store.ts |
| 12 | `features/settings/tasks/tasks-settings-page.tsx` | 1,676→1,265 | 63KB | ✅ DONE | Giảm 25%, types.ts + store.ts |
| 13 | `features/products/page.tsx` | 1,620→1,054 | 60KB | ✅ DONE | Giảm 35%, components + hooks extracted |

### ⚪ SKIP (Data files - không cần tách)

| File | Lines | Reason |
|------|-------|--------|
| `provinces/wards-3level-data.ts` | 100,390 | Static data |
| `provinces/ward-old-to-new-mapping.ts` | 42,222 | Mapping data |
| `provinces/ward-district-data.ts` | 26,595 | Static data |
| `provinces/wards-2level-data.ts` | 26,604 | Static data |
| `provinces/districts-data.ts` | 3,765 | Static data |
| `lib/types/prisma-extended.ts` | 3,850 | Type definitions |

---

## 📋 TODO List

### Task 1: Tách `other-page.tsx` (4,226 lines) ✅ HOÀN THÀNH
- [x] 1.1 Tạo folder `features/settings/other/`
- [x] 1.2 Extract `GeneralTabContent` → `general-tab.tsx`
- [x] 1.3 Extract `SecurityTabContent` → `security-tab.tsx`
- [x] 1.4 Extract `MediaTabContent` → `media-tab.tsx`
- [x] 1.5 Extract `IntegrationTabContent` → `integration-tab.tsx`
- [x] 1.6 Extract `SystemTabContent` → `system-tab.tsx`
- [x] 1.7 Extract `NotificationTabContent` → `notification-tab.tsx`
- [x] 1.8 Extract `EmailTemplateTabContent` → `email-template-tab.tsx`
- [x] 1.9 Extract `WebsiteTabContent` → `website-tab.tsx`
- [x] 1.10 Create `index.tsx` với main OtherSettingsPage
- [x] 1.11 Create shared `types.ts` cho các tab
- [x] 1.12 Update imports trong app router

### Task 2: Tách `order-detail-page.tsx` (~3,000 lines) ✅ HOÀN THÀNH
Đã tách được các components vào `features/orders/detail/`:
- [x] 2.1 Tạo folder `features/orders/detail/`
- [x] 2.2 Extract `types.ts` - helper functions và types
- [x] 2.3 Extract `StatusStepper` → `status-stepper.tsx`
- [x] 2.4 Extract `PaymentDialog` → `payment-dialog.tsx`
- [x] 2.5 Extract `CreateShipmentDialog` → `create-shipment-dialog.tsx`
- [x] 2.6 Extract `PackerSelectionDialog` → `packer-selection-dialog.tsx`
- [x] 2.7 Extract `OrderHistoryTab` → `order-history-tab.tsx`
- [x] 2.8 Extract `ProductInfoCard` → `product-info-card.tsx`
- [x] 2.9 Extract `ProductThumbnailCell` → `product-thumbnail-cell.tsx`
- [x] 2.10 Extract `ReturnHistoryTab` → `return-history-tab.tsx`
- [x] 2.11 Create `index.tsx` với re-exports
- [x] 2.12 Update main component để import từ detail/
- [x] 2.13 Clean up unused imports
**Kết quả: 3,186 lines → 1,664 lines (giảm ~48%)**

### Task 3: Tách `employees/detail-page.tsx` (2,001 lines) ✅ HOÀN THÀNH
- [x] 3.1 Tạo folder `features/employees/detail/`
- [x] 3.2 Extract `types.ts` - Types và helper functions
- [x] 3.3 Extract `EmployeeInfoTab` → `employee-info-tab.tsx`
- [x] 3.4 Extract `AttendanceTab` → `attendance-tab.tsx`
- [x] 3.5 Extract `PayrollTab` → `payroll-tab.tsx`
- [x] 3.6 Create `index.tsx` với re-exports
**Kết quả: 2,001 lines → 1,569 lines (giảm ~22%)**

### Task 4: Tách `sales-returns/form-page.tsx` (1,992 lines) ✅ HOÀN THÀNH
- [x] 4.1 Tạo folder `features/sales-returns/form/`
- [x] 4.2 Extract `types.ts` - FormLineItem, FormExchangeItem, FormValues, formatCurrency
- [x] 4.3 Extract `SalesReturnSummary` → `SalesReturnSummary.tsx` (779 lines)
- [x] 4.4 Extract `ReturnItemRow` + `ProductThumbnailCell` → `ReturnItemRow.tsx` (308 lines)
- [x] 4.5 Extract `ReturnTableFooter` → `ReturnTableFooter.tsx` (56 lines)
- [x] 4.6 Create `index.tsx` với re-exports
**Kết quả: 1,992 lines → 1,019 lines (giảm ~49%)**

### Task 5: Tách `product-form-complete.tsx` (2,028 lines) ✅ HOÀN THÀNH
- [x] 5.1 Tạo folder `features/products/product-form/`
- [x] 5.2 Extract `types.ts` - ProductFormCompleteValues, validateProductForm
- [x] 5.3 Extract Tab 1 → `BasicInfoTab.tsx` (basic info, website settings, combo, pricing)
- [x] 5.4 Extract Tab 2 → `ImagesTab.tsx` (thumbnail, gallery, video)
- [x] 5.5 Extract Tab 3 → `InventoryTab.tsx` (stock tracking, storage location)
- [x] 5.6 Extract Tab 4 → `LogisticsTab.tsx` (weight, dimensions)
- [x] 5.7 Extract Tab 5 → `LabelTab.tsx` (VAT name, origin, importer)
- [x] 5.8 Extract Tab 6-8 → `SeoDefaultTab.tsx`, `SeoPkgxTab.tsx`, `SeoTrendtechTab.tsx`
- [x] 5.9 Create `index.tsx` với re-exports
**Kết quả: 2,028 lines → 603 lines (giảm ~70%)**

### Task 6: Tách `employee-form.tsx` (1,794 lines) ⏭️ SKIPPED
- Skip do complex StagingFile type system và document state management quá phức tạp
- Các tabs share nhiều local state (documentFiles, documentSessions, filesToDelete)
- Type mismatch giữa StagingFile và UploadedFile làm refactor khó khăn

### Task 7: Tách `customers/detail-page.tsx` (2,001 lines) ✅ HOÀN THÀNH
- [x] 7.1 Tạo folder `features/customers/detail/`
- [x] 7.2 Extract `types.tsx` - formatCurrency, column definitions, orderStatusVariants, createOrderColumnsWithReturns (590 lines)
- [x] 7.3 Extract `InfoTab.tsx` - thông tin cơ bản, phân loại, chỉ số KH (425 lines)
- [x] 7.4 Extract `BusinessTab.tsx` - thông tin doanh nghiệp, hợp đồng (110 lines)
- [x] 7.5 Extract `PaymentTab.tsx` - thanh toán & tín dụng (48 lines)
- [x] 7.6 Extract `ContactsTab.tsx` - danh sách liên hệ (65 lines)
- [x] 7.7 Create `index.ts` barrel export (6 lines)
- [x] 7.8 Refactor detail-page.tsx để sử dụng createOrderColumnsWithReturns()
**Kết quả: 2,002 lines → 1,460 lines (giảm ~27%)**
**Total extracted: 1,244 lines vào folder detail/**

### Task 8: Migrate `orders/store.ts` (1,825 lines) 🚧 IN PROGRESS
**Strategy**: Hybrid approach - React Query hooks đã sẵn sàng, dần migrate components

**Completed:**
- [x] 8.1 Create API layer `features/orders/api/order-actions-api.ts` (18 functions)
- [x] 8.2 Create React Query hooks:
  - `use-orders.ts` - Basic CRUD queries
  - `use-order-mutations.ts` - Create/Update/Delete mutations
  - `use-order-actions.ts` - Order workflow mutations (18 mutations)
- [x] 8.3 Create API routes in `/app/api/orders/` (19 routes total)
- [x] 8.4 Create wrapper hooks for backward compatibility:
  - `use-packaging-actions.ts` - Packaging workflow (confirm, cancel, dispatch, delivery)
  - `use-reconciliation-actions.ts` - COD reconciliation
  - `use-order-detail-actions.ts` - Complete order detail page actions

**Components Migrated:**
- [x] `features/packaging/page.tsx` - Uses `usePackagingActions()`
- [x] `features/packaging/detail-page.tsx` - Uses `usePackagingActions()`
- [x] `features/reconciliation/page.tsx` - Uses `useReconciliationActions()`
- [x] `features/shipments/detail-page.tsx` - Uses `usePackagingActions()`

**Pending Components (for gradual migration):**
- [ ] `features/orders/order-detail-page.tsx` - Can use `useOrderDetailActions()`
- [ ] `features/orders/components/order-detail-page.tsx`
- [ ] `features/orders/page.tsx`
- [ ] `features/orders/components/order-form-page.tsx`
- [ ] `features/sales-returns/store.ts`
- [ ] `features/warranty/*` - Multiple files
- [ ] Other 40+ files importing `useOrderStore`

**Notes:**
- Wrapper hooks sync to Zustand store for backward compatibility
- Components can gradually migrate without breaking existing code
- Full migration will take multiple sessions

### Task 9: Tách Settings Pages ✅ HOÀN THÀNH
- [x] 9.1 `pkgx/product-mapping-tab.tsx` (1,992→1,186 lines, -40%)
  - Created `product-mapping/types.ts`, `mobile-product-dropdown.tsx`, `product-detail-dialog.tsx`, `push-sync-dialog.tsx`, `unlink-dialog.tsx`, `bulk-unlink-dialog.tsx`, `index.ts`
- [x] 9.2 `complaints-settings-page.tsx` (1,730→1,368 lines, -21%)
  - Created `types.ts`, `store.ts`
- [x] 9.3 `tasks-settings-page.tsx` (1,676→1,265 lines, -25%)
  - Created `types.ts`, `store.ts`

### Task 10: Tách `purchase-orders/detail-page.tsx` (1,676 lines) ✅ HOÀN THÀNH
- [x] 10.1 Analyze structure and identify sections
- [x] 10.2 Create `detail/` folder and extract components:
  - `status-timeline.tsx` - StatusTimeline component (~45 lines)
  - `payment-confirmation-dialog.tsx` - PaymentConfirmationDialog + types (~160 lines)
  - `inventory-receipt-detail-view.tsx` - InventoryReceiptDetailView (~70 lines)
  - `purchase-return-detail-view.tsx` - PurchaseReturnDetailView (~110 lines)
  - `stock-history-tab.tsx` - StockHistoryTab (~155 lines)
  - `index.ts` - barrel exports
- [x] 10.3 Update main file to use extracted components
**Kết quả: 1,807 lines → 1,216 lines (giảm ~33%)**

### Task 11: Tách `products/page.tsx` (1,620 lines) ✅ HOÀN THÀNH
- [x] 11.1 Analyze structure and identify extractable components
- [x] 11.2 Extract components to `components/`:
  - `mobile-product-card.tsx` - MobileProductCard + status helpers
  - `product-filter-controls.tsx` - Filter controls component
  - `product-bulk-actions.tsx` - Bulk actions factory functions
- [x] 11.3 Extract hooks to `hooks/`:
  - `use-table-state-handlers.ts` - Table state handlers + constants
  - `use-product-import-handler.ts` - Import handler hook
- [x] 11.4 Update main file and barrel exports
**Kết quả: 1,620 lines → 1,054 lines (giảm ~35%)**

---

## 🎯 Execution Order

1. **Phase 1**: `other-page.tsx` (largest, most complex)
2. **Phase 2**: `order-detail-page.tsx` (high traffic page)
3. **Phase 3**: Employee pages (`detail-page.tsx`, `employee-form.tsx`)
4. **Phase 4**: Customer/Sales pages
5. **Phase 5**: Settings pages
6. **Phase 6**: Store migration (orders/store.ts)

---

## 📐 Guidelines for Splitting

### Naming Convention
```
features/{feature}/
├── components/
│   ├── {section}/
│   │   ├── index.tsx          # Re-export
│   │   ├── {Component}.tsx    # Main component
│   │   ├── {SubComponent}.tsx # Sub-components
│   │   └── types.ts           # Local types
│   └── ...
├── hooks/
│   └── use-{feature}.ts
├── types.ts                   # Shared types
└── page.tsx                   # Main page
```

### Component Size Guidelines
- **< 300 lines**: Ideal
- **300-500 lines**: Acceptable
- **500-800 lines**: Consider splitting
- **> 800 lines**: Must split

### What to Extract
1. **Tab contents** → Separate files
2. **Form sections** → Separate components
3. **Complex logic** → Custom hooks
4. **Types & interfaces** → `types.ts`
5. **Constants** → `constants.ts`
6. **Validation schemas** → `schema.ts`

---

## 📝 Progress Log

| Date | Task | Status | Notes |
|------|------|--------|-------|
| 31/12/2024 | Created plan | ✅ | Initial analysis |
| 31/12/2024 | Task 1: other-page.tsx | ✅ | 4,226 → 10 files |
| 31/12/2024 | Task 2: order-detail-page.tsx | ✅ | 3,186 → 1,664 lines |
| 02/01/2026 | Task 3: employees/detail-page.tsx | ✅ | 2,001 → 1,569 lines |
| 02/01/2026 | Task 4: sales-returns/form-page.tsx | ✅ | 1,992 → 1,019 lines |
| 02/01/2026 | Task 5: product-form-complete.tsx | ✅ | 2,028 → 603 lines |
| 02/01/2026 | Task 7: customers/detail-page.tsx | ✅ | 2,002 → 1,460 lines |
| 02/01/2026 | Task 8: orders/store.ts - API Layer | ✅ | 19 API routes + 18 API functions |
| 02/01/2026 | Task 8: orders/store.ts - Hooks | ✅ | 3 wrapper hooks + 19 mutations |
| 02/01/2026 | Task 8: Migrate packaging pages | ✅ | page.tsx + detail-page.tsx |
| 02/01/2026 | Task 8: Migrate reconciliation | ✅ | page.tsx |
| 02/01/2026 | Task 8: Migrate shipments | ✅ | detail-page.tsx |
| 02/01/2026 | Task 8: Migrate order-detail-page | ✅ | Migrated to useOrderDetailActions() |
| 02/01/2026 | Task 8: Migrate shipping-tracking-tab | ✅ | Now uses syncGHTKShipment from hook |
| 02/01/2026 | Task 9: Settings pages | ✅ | 3 files refactored |
| 02/01/2026 | Task 10: purchase-orders/detail-page | ✅ | 1,807 → 1,216 lines (-33%) |
| 02/01/2026 | Task 11: products/page.tsx | ✅ | 1,620 → 1,054 lines (-35%) |

---

## 🔗 Related Docs
- [ZUSTAND-TO-REACT-QUERY-MIGRATION.md](./ZUSTAND-TO-REACT-QUERY-MIGRATION.md)
- [COMPONENT-MIGRATION-GUIDE.md](../COMPONENT-MIGRATION-GUIDE.md)
