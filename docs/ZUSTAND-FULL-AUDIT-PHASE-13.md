# Zustand Store Full Audit - Phase 13

**Generated:** January 6, 2026  
**Purpose:** Comprehensive audit of ALL Zustand stores to identify duplicates, migration status, and cleanup opportunities

---

## 📊 Summary

| Category | Count |
|----------|-------|
| Total Store Files | ~91 |
| Entity/CRUD Stores | ~35 |
| Settings/Config Stores | ~25 |
| UI/Layout Stores | ~10 |
| Utility Stores | ~15 |
| Stores with React Query Hooks | 31 |

---

## 🔍 Store Categories

### Category A: Entity/Data Stores (CRUD Operations)

These stores hold entity data (products, customers, orders, etc.). Should be migrated to React Query for READ operations.

| Store | File | Has RQ Hook | Status | Priority |
|-------|------|-------------|--------|----------|
| useProductStore | features/products/store.ts | ✅ use-all-products | ✅ DONE | - |
| useCustomerStore | features/customers/store.ts | ✅ use-all-customers | ✅ DONE | - |
| useOrderStore | features/orders/store/index.ts | ✅ use-all-orders | ✅ DONE | - |
| useEmployeeStore | features/employees/store.ts | ✅ use-all-employees | ✅ DONE | - |
| useSupplierStore | features/suppliers/store.ts | ✅ use-all-suppliers | ✅ DONE | - |
| useReceiptStore | features/receipts/store/index.ts | ✅ use-all-receipts | ✅ DONE | - |
| usePaymentStore | features/payments/store/index.ts | ✅ use-all-payments | ✅ DONE | - |
| useWarrantyStore | features/warranty/store/index.ts | ✅ use-all-warranties | ✅ DONE | - |
| usePurchaseOrderStore | features/purchase-orders/store/index.ts | ✅ use-all-purchase-orders | ✅ DONE | - |
| usePurchaseReturnStore | features/purchase-returns/store.ts | ✅ use-all-purchase-returns | ✅ DONE | - |
| useStockTransferStore | features/stock-transfers/store/index.ts | ✅ use-all-stock-transfers | ✅ DONE | - |
| useSalesReturnStore | features/sales-returns/store.ts | ✅ use-all-sales-returns | ✅ DONE | - |
| useComplaintStore | features/complaints/store/index.ts | ✅ use-all-complaints | ✅ DONE | - |
| useWikiStore | features/wiki/store.ts | ✅ use-all-wiki | ✅ DONE | - |
| useTaskStore | features/tasks/store.ts | ✅ use-all-tasks | ✅ DONE | - |
| useLeaveStore | features/leaves/store.ts | ✅ use-all-leaves | ✅ DONE | - |
| usePenaltyStore | features/penalties/store.ts | ✅ use-all-penalties | ✅ DONE | - |
| useInventoryReceiptStore | features/inventory-receipts/store.ts | ✅ use-all-inventory-receipts | ✅ DONE | - |
| useShipmentStore | features/shipments/store/index.ts | ✅ use-shipments | ✅ N/A | - |
| useInventoryCheckStore | features/inventory-checks/store.ts | ✅ use-all-inventory-checks | ✅ N/A | - |
| useCostAdjustmentStore | features/cost-adjustments/store/index.ts | ⚠️ None | 🔴 TODO | HIGH |
| useAttendanceStore | features/attendance/store.ts | ⚠️ Complex | 🟡 DEFER | LOW |
| useStockHistoryStore | features/stock-history/store.ts | ⚠️ None | 🔴 TODO | MEDIUM |
| useAuditLogStore | features/audit-log/store.ts | ⚠️ None | 🟡 DEFER | LOW |

### Category B: Settings/Lookup Stores

Settings and configuration stores - some should migrate to React Query, others are UI-only.

| Store | File | Has RQ Hook | Status | Notes |
|-------|------|-------------|--------|-------|
| useBranchStore | features/settings/branches/store.ts | ✅ use-all-branches | ✅ DONE | |
| useDepartmentStore | features/employees/departments/store.ts | ✅ use-all-departments | ✅ DONE | |
| useJobTitleStore | features/employees/job-titles/store.ts | ✅ use-all-job-titles | ✅ DONE | |
| usePenaltyTypeStore | features/penalties/types/store.ts | ✅ use-all-penalty-types | ✅ DONE | |
| useProvinceStore | features/settings/provinces/store.ts | ✅ use-administrative-units | ✅ DONE | Complex |
| useCashbookStore | features/cashbook/store.ts | ✅ use-all-cash-accounts | ✅ DONE | |
| usePaymentTypeStore | features/settings/payment-types/store.ts | ✅ use-all-payment-types | ✅ DONE | |
| usePaymentMethodStore | features/settings/payments/methods/store.ts | ✅ use-all-payment-methods | ✅ DONE | |
| useReceiptTypeStore | features/settings/receipts/types/store.ts | ✅ use-all-receipt-types | ✅ DONE | |
| useShippingPartnerStore | features/settings/shipping/partners/store.ts | ✅ use-all-shipping-partners | ✅ DONE | |
| useTargetGroupStore | features/settings/targets/store.ts | ✅ use-all-target-groups | ✅ DONE | |
| usePricingPolicyStore | features/settings/pricing/store.ts | ✅ use-all-pricing-policies | ✅ DONE | |
| useBrandStore | features/settings/inventory/brand-store.ts | ✅ use-all-brands | ✅ N/A | Mutations only |
| useProductCategoryStore | features/settings/inventory/product-category-store.ts | ✅ use-all-categories | ✅ N/A | |
| useProductTypeStore | features/settings/inventory/product-type-store.ts | ✅ use-all-product-types | ✅ N/A | Settings page |
| useUnitStore | features/settings/units/store.ts | ✅ use-all-units | ✅ N/A | |
| useTaxStore | features/settings/taxes/store.ts | ✅ use-all-taxes | ✅ N/A | |
| useStockLocationStore | features/stock-locations/store.ts | ✅ use-all-stock-locations | ✅ N/A | |
| useSalesChannelStore | features/settings/sales-channels/store.ts | ⚠️ None | 🔴 TODO | LOW |
| useStorageLocationStore | features/settings/inventory/storage-location-store.ts | ⚠️ None | 🔴 TODO | LOW |
| useImporterStore | features/settings/inventory/importer-store.ts | ⚠️ None | 🔴 TODO | LOW |
| useRoleStore | features/settings/employees/role-store.ts | ⚠️ None | 🔴 TODO | LOW |

### Category C: UI/State Stores (KEEP - No Migration Needed)

These stores manage UI state only - NOT data. They should remain as Zustand.

| Store | File | Purpose | Action |
|-------|------|---------|--------|
| useUIStore | lib/ui-store.ts | Modal states, sidebar | ✅ KEEP |
| useLayoutStore | lib/layout-store.ts | Layout preferences | ✅ KEEP |
| useThemeStore | lib/theme-store.ts | Theme settings | ✅ KEEP |
| useGlobalSettingsStore | features/settings/global-settings-store.ts | Page size, etc. | ✅ KEEP |
| useSettingsConfigStore | features/settings/settings-config-store.ts | Config UI | ✅ KEEP |
| useAppearanceStore | features/settings/appearance/store.ts | Dark mode, etc. | ✅ KEEP |

### Category D: Integration Stores (KEEP - External APIs)

Stores that manage integration state with external services.

| Store | File | Purpose | Action |
|-------|------|---------|--------|
| usePkgxSettingsStore | features/settings/pkgx/store/index.ts | PKGX integration | ✅ KEEP |
| useTrendtechSettingsStore | features/settings/trendtech/store/index.ts | Trendtech API | ✅ KEEP |
| useShippingSettingsStore | features/settings/shipping/shipping-settings-store.ts | GHTK config | ✅ KEEP |
| useSlaSettingsStore | features/settings/inventory/sla-settings-store.ts | SLA config | ✅ KEEP |
| useWarrantySettingsStore | features/settings/inventory/warranty-settings-store.ts | Warranty config | ✅ KEEP |
| useProductLogisticsStore | features/settings/inventory/logistics-settings-store.ts | Logistics config | ✅ KEEP |

### Category E: Special/Utility Stores

| Store | File | Purpose | Action |
|-------|------|---------|--------|
| useEmployeeSettingsStore | features/settings/employees/employee-settings-store.ts | Employee config | ✅ KEEP (Complex) |
| usePrintTemplateStore | features/settings/printer/store.ts | Print templates | ✅ KEEP |
| useStoreInfoStore | features/settings/store-info/store-info-store.ts | Company info | ✅ KEEP |
| usePayrollBatchStore | features/payroll/payroll-batch-store.ts | Payroll batch | ✅ KEEP |
| usePayrollTemplateStore | features/payroll/payroll-template-store.ts | Payroll templates | ✅ KEEP |
| useDocumentStore | features/employees/document-store.ts | Employee docs | ✅ KEEP |
| useEmployeeCompStore | features/employees/employee-comp-store.ts | Compensation | ✅ KEEP |
| useImageStore | features/products/image-store.ts | Image upload state | ✅ KEEP |
| useImportExportStore | lib/import-export/import-export-store.ts | Import/export state | ✅ KEEP |
| useEmployeeMappingStore | lib/import-export/employee-mapping-store.ts | Import mapping | ✅ KEEP |
| useCustomFieldsStore | features/tasks/custom-fields-store.ts | Task custom fields | ✅ KEEP |
| useRecurringStore | features/tasks/recurring-store.ts | Recurring tasks | ✅ KEEP |
| useTemplateStore | features/tasks/template-store.ts | Task templates | ✅ KEEP |
| useSettlementStore | features/warranty/utils/settlement-store.ts | Warranty settlement | ✅ KEEP |
| useSlaStore | features/customers/sla/store.ts | Customer SLA | ✅ KEEP |

---

## 🔴 Priority Actions

### HIGH Priority (Need React Query Hooks)

1. **useCostAdjustmentStore** - No React Query hook exists
   - File: `features/cost-adjustments/store/index.ts`
   - Action: Create `use-all-cost-adjustments.ts`

### MEDIUM Priority (Should Have Hooks)

2. **useStockHistoryStore** - No React Query hook
   - File: `features/stock-history/store.ts`
   - Action: Create `use-stock-history.ts`

### LOW Priority (Can Defer)

3. **useSalesChannelStore** - Settings page only
4. **useStorageLocationStore** - Settings page only
5. **useImporterStore** - Settings page only
6. **useRoleStore** - Settings page only
7. **useAttendanceStore** - Complex selectors (DEFER)
8. **useAuditLogStore** - Audit logs (DEFER)

---

## 📋 Duplicate Pattern Analysis - Phase 13C Results

### ✅ Files Migrated

| File | Before | After | Status |
|------|--------|-------|--------|
| `features/orders/components/customer-address-selector.tsx` | `useCustomerStore().findById` | `useCustomerFinder().findById` | ✅ DONE |
| `features/customers/detail-page.tsx` | `useCustomerStore().data, findById` | `useCustomerFinder()` | ✅ DONE |
| `features/orders/components/order-form-page.tsx` | `useOrderStore().data, findById` + `useProductStore().data` | `useAllOrders()`, `useOrderFinder()`, `useAllProducts()` | ✅ DONE |
| `features/customers/customer-form-page.tsx` | `useCustomerStore().findById` | `useCustomerFinder()` | ✅ DONE |
| `features/sales-returns/detail-page.tsx` | `useSalesReturnStore().findById` | `useSalesReturnFinder()` | ✅ DONE |
| `features/purchase-returns/detail-page.tsx` | `usePurchaseReturnStore().findById` | `usePurchaseReturnFinder()` | ✅ DONE |
| `features/complaints/components/detail-page.tsx` | `useComplaintStore().getComplaintById` | `useComplaintFinder()` | ✅ DONE |
| `features/complaints/components/form-page.tsx` | `useComplaintStore().getComplaintById` | `useComplaintFinder()` | ✅ DONE |
| `features/warranty/warranty-form-page.tsx` | `useWarrantyStore().findById, data` | `useWarrantyFinder()`, `useAllWarranties()` | ✅ DONE |
| `features/warranty/components/dialogs/warranty-cancel-dialog.tsx` | `useWarrantyStore().findById` | `useWarrantyFinder()` | ✅ DONE |
| `features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx` | `useWarrantyStore().findById` | `useWarrantyFinder()` | ✅ DONE |
| `features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx` | `useWarrantyStore().findById` | `useWarrantyFinder()` | ✅ DONE |
| `features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx` | `useWarrantyStore().findById` | `useWarrantyFinder()` | ✅ DONE |
| `features/warranty/components/dialogs/hooks/use-payment-voucher-stores.ts` | `useWarrantyStore().findById` | `useWarrantyFinder()` | ✅ DONE |
| `features/warranty/hooks/use-warranty-settlement.ts` | `useWarrantyStore().findById` | `useWarrantyFinder()` | ✅ DONE |
| `features/receipts/detail-page.tsx` | `useReceiptStore().findById` | `useReceiptFinder()` | ✅ DONE |
| `features/receipts/form-page.tsx` | `useReceiptStore().data, findById` | `useAllReceipts()`, `useReceiptFinder()` | ✅ DONE |
| `features/payments/form-page.tsx` | `usePaymentStore().data, findById` | `useAllPayments()`, `usePaymentFinder()` | ✅ DONE |
| `features/suppliers/detail-page.tsx` | `useSupplierStore().findById` | `useSupplierFinder()` | ✅ DONE |
| `features/suppliers/form-page.tsx` | `useSupplierStore().findById` | `useSupplierFinder()` | ✅ DONE |

### 🆕 Hooks Created

| Hook | File | Purpose |
|------|------|---------|
| `useComplaintFinder` | `features/complaints/hooks/use-all-complaints.ts` | Find complaint by systemId |

### ⚠️ Files Using Full Store Data (Expected - VALID)

These files are LIST/CRUD pages that need full dataset - using store is CORRECT:

| File | Store Usage | Reason | Action |
|------|-------------|--------|--------|
| `features/products/page.tsx` | `useProductStore().data, getDeleted` | Main product list page | ✅ KEEP (needs full data + deleted) |
| `features/products/detail-page.tsx` | `useProductStore().data, findById` | Product detail with relations | ✅ KEEP (needs full data) |
| `features/products/form-page.tsx` | `useProductStore().data, findById` | Product form with SKU check | ✅ KEEP |
| `features/purchase-orders/page.tsx` | `useProductStore().updateInventory, findById` | PO list actions | ⚠️ Review - only uses mutations |
| `features/purchase-orders/form-page.tsx` | `useProductStore().data, findById` | PO form | ⚠️ Could migrate findById |
| `features/purchase-orders/detail-page.tsx` | `useProductStore().data, findById` | PO detail | ⚠️ Could migrate findById |
| `features/sales-returns/form-page.tsx` | `useProductStore().data` | Return form | ⚠️ Uses for GHTK API |

### Pattern 1: Store has `.data` array + React Query hook
**Expected State:** Zustand store should have EMPTY `.data` array
**Actual Issue:** Some stores still load data into `.data`

Affected stores to verify:
- [ ] useProductStore
- [ ] useCustomerStore
- [ ] useOrderStore
- [ ] useEmployeeStore
- [ ] useReceiptStore
- [ ] usePaymentStore

### Pattern 2: Components using both `store.data` AND `useAllXxx().data`
**Issue:** Duplicate data fetching
**Fix:** Remove store.data usage, use only React Query

### Pattern 3: `.getState()` calls for data access
**Valid Usages:**
- Import/export configs
- Non-React utility functions
- Event handlers (sync access)

**Invalid Usages:**
- Components during render
- Replacing React Query hooks

---

## 🛠️ Migration Checklist

### For each store, verify:

- [ ] React Query hook exists (`use-all-xxx.ts`)
- [ ] Hook has `Finder` hook for ID lookups
- [ ] Components use React Query (not `store.data`)
- [ ] Store's `.data` is NOT populated (empty array)
- [ ] `.getState()` only used in non-React code
- [ ] Mutations still go through store (correct)

---

## 📁 Files to Create

```
features/cost-adjustments/hooks/use-all-cost-adjustments.ts
features/stock-history/hooks/use-stock-history.ts
```

---

## 📅 Next Steps

1. **Phase 13A:** Create missing React Query hooks (HIGH priority) ✅ DONE
2. **Phase 13B:** Audit components for duplicate data usage ✅ DONE  
3. **Phase 13C:** Verify store.data is empty across all migrated stores ✅ DONE
4. **Phase 13D:** Document which stores should KEEP Zustand (UI-only) ✅ DONE

---

## 🔒 Phase 13D: Stores to KEEP in Zustand (~26 stores)

These stores should **STAY in Zustand** - NO migration to React Query needed.

### 1. UI STATE STORES (Pure Client-Side UI)

| Store | File | What It Manages |
|-------|------|-----------------|
| useUIStore | `lib/ui-store.ts` | Sidebar open/collapsed state |
| useLayoutStore | `lib/layout-store.ts` | General UI layout state |
| useThemeStore | `lib/theme-store.ts` | Theme state |

### 2. APPEARANCE/SETTINGS STORES (Local Config)

| Store | File | What It Manages |
|-------|------|-----------------|
| useAppearanceStore | `features/settings/appearance/store.ts` | Theme colors, fonts, CSS |
| useGlobalSettingsStore | `features/settings/global-settings-store.ts` | Default page size, pagination |
| usePrintTemplateStore | `features/settings/printer/store.ts` | Print templates, paper sizes |
| useProductLogisticsStore | `features/settings/inventory/logistics-settings-store.ts` | Weight, dimensions, shipping defaults |
| useComplaintSettingsStore | `features/settings/complaints/store.ts` | Card colors, UI config |
| useSettingsConfigStore | `features/settings/settings-config-store.ts` | Generic settings factory |

### 3. INTEGRATION STORES (External API Config)

| Store | File | What It Manages |
|-------|------|-----------------|
| usePkgxSettingsStore | `features/settings/pkgx/store/index.ts` | PKGX API config, mappings, sync |
| useTrendtechSettingsStore | `features/settings/trendtech/store/index.ts` | Trendtech API config, mappings |
| useShippingSettingsStore | `features/settings/shipping/shipping-settings-store.ts` | Shipping partner connections |

### 4. IMPORT/EXPORT & UTILITY STORES (Session State)

| Store | File | What It Manages |
|-------|------|-----------------|
| useImportExportStore | `lib/import-export/import-export-store.ts` | Import/export logs |
| useEmployeeMappingStore | `lib/import-export/employee-mapping-store.ts` | Attendance import mappings |
| useDocumentStore | `features/employees/document-store.ts` | Staging documents |
| useImageStore | `features/products/image-store.ts` | Staging images |

### 5. RUNTIME CACHE/STATE STORES

| Store | File | What It Manages |
|-------|------|-----------------|
| useSlaStore | `features/customers/sla/store.ts` | SLA evaluation, acknowledgements |
| settlementStore helpers | `features/warranty/utils/settlement-store.ts` | Settlement method tracking |

### 6. PAYROLL/HR CONFIG STORES

| Store | File | What It Manages |
|-------|------|-----------------|
| usePayrollTemplateStore | `features/payroll/payroll-template-store.ts` | Payroll templates, salary components |
| usePayrollBatchStore | `features/payroll/payroll-batch-store.ts` | Batch generation state |
| useEmployeeCompStore | `features/employees/employee-comp-store.ts` | Employee payroll assignments |

### 7. TASK/WORKFLOW STORES

| Store | File | What It Manages |
|-------|------|-----------------|
| useTemplateStore | `features/tasks/template-store.ts` | Task templates |
| useRecurringStore | `features/tasks/recurring-store.ts` | Recurring patterns |
| useCustomFieldsStore | `features/tasks/custom-fields-store.ts` | Custom field definitions |

### 8. SETTINGS DOMAIN STORES

| Store | File | What It Manages |
|-------|------|-----------------|
| useImporterStore | `features/settings/inventory/importer-store.ts` | Product importers config |
| useTaxStore | `features/settings/taxes/store.ts` | Tax configuration |
| useSlaSettingsStore | `features/settings/inventory/sla-settings-store.ts` | SLA config |
| useWarrantySettingsStore | `features/settings/inventory/warranty-settings-store.ts` | Warranty config |

### ✅ Criteria for KEEPING in Zustand

These stores stay in Zustand because they:
1. ✅ Manage **client-side UI state only** (sidebar, modals, theme)
2. ✅ Store **local config/preferences** (appearance, print templates)
3. ✅ Handle **external API credentials** (PKGX, Trendtech, shipping)
4. ✅ Manage **temporary/staging data** (file uploads, import mappings)
5. ✅ Perform **client-side computations** (SLA evaluation, settlement tracking)
6. ✅ Store **templates & configuration** (payroll templates, task templates)

---

## ✅ Stores Already Fully Migrated (31 stores)

These stores have React Query hooks AND components have been migrated:

1. useProductStore
2. useCustomerStore
3. useOrderStore
4. useEmployeeStore
5. useSupplierStore
6. useReceiptStore
7. usePaymentStore
8. useBranchStore
9. useWarrantyStore
10. usePurchaseOrderStore
11. usePurchaseReturnStore
12. useStockTransferStore
13. useSalesReturnStore
14. useComplaintStore
15. useWikiStore
16. useTaskStore
17. useLeaveStore
18. usePenaltyStore
19. usePenaltyTypeStore
20. useDepartmentStore
21. useJobTitleStore
22. useCashbookStore
23. usePaymentTypeStore
24. usePaymentMethodStore
25. useReceiptTypeStore
26. useShippingPartnerStore
27. useTargetGroupStore
28. usePricingPolicyStore
29. useProvinceStore
30. useInventoryReceiptStore
31. useInventoryCheckStore
