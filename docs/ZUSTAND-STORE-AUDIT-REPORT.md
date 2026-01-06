# Zustand Store Audit Report

**Generated:** January 5, 2026  
**Last Updated:** January 5, 2026 (Phase 11 Completed)  
**Purpose:** Identify stores with READ-ONLY usages that can be migrated to React Query hooks

---

## Executive Summary

| Metric | Count |
|--------|-------|
| Total Zustand Stores Found | ~50 |
| Stores with React Query Hooks | 39 |
| Total Component Usages | 153+ |
| READ-ONLY Usages | ~45 |
| MUTATION Usages | ~80 |
| MIXED Usages | ~28 |
| `.getState()` Calls in Components | 100+ (VALID - sync access) |
| **✅ Stores Fully Migrated** | **31** |
| **⏳ Stores Pending Migration** | **9** |

---

## 📊 Store Migration Status Summary

### Legend:
- ✅ DONE = All read-only usages migrated to React Query
- 🔄 PARTIAL = Some usages migrated, some remain  
- ⏳ TODO = Has read-only usages but not migrated
- ⚠️ COMPLEX = Requires significant refactoring
- ✓ N/A = Store only has mutation usages (correct pattern)
- ❌ NEEDS HOOK = React Query hook doesn't exist yet

| Store Name | Total Usages | Read-Only | Mutations | Has RQ Hook | Migration Status |
|------------|--------------|-----------|-----------|-------------|------------------|
| **useShippingPartnerStore** | 6 | 6 | 0 | ✅ use-all-shipping-partners.ts | ✅ DONE (Phase 8) |
| **useCashbookStore** | 16 | 16 | 0 | ✅ use-all-cash-accounts.ts | ✅ DONE (Phase 8) |
| **usePaymentTypeStore** | 9 | 9 | 0 | ✅ use-all-payment-types.ts | ✅ DONE (Phase 8) |
| **usePaymentMethodStore** | 9 | 9 | 0 | ✅ use-all-payment-methods.ts | ✅ DONE (Phase 8) |
| **useReceiptTypeStore** | 4 | 4 | 0 | ✅ use-all-receipt-types.ts | ✅ DONE (Phase 8) |
| **useOrderStore** | 6 | 3 | 3 | ✅ use-all-orders.ts | ✅ DONE (Phase 8) |
| **useWarrantyStore** | 10 | 7 | 3 | ✅ use-all-warranties.ts | ✅ DONE (Phase 8) |
| **usePurchaseOrderStore** | 12 | 8 | 4 | ✅ use-all-purchase-orders.ts | ✅ DONE (Phase 8) |
| **useTargetGroupStore** | 2 | 2 | 0 | ✅ use-all-target-groups.ts | ✅ DONE (Phase 8) |
| **useProductStore** | 12 | 9 | 3 | ✅ use-all-products.ts | ✅ DONE (Phase 7) |
| **useBrandStore** | 4 | 0 | 4 | ✅ use-all-brands.ts | ✓ N/A (Mutations only) |
| **useCustomerStore** | 8 | 2 | 6 | ✅ use-all-customers.ts | ✅ DONE (Phase 8) |
| **useReceiptStore** | 5 | 5 | 0 | ✅ use-all-receipts.ts | ✅ DONE (Phase 7) |
| **usePaymentStore** | 5 | 5 | 0 | ✅ use-all-payments.ts | ✅ DONE (Phase 7) |
| **useBranchStore** | 3 | 3 | 0 | ✅ use-all-branches.ts | ✅ DONE (Phase 7) |
| **useWikiStore** | 5 | 1 | 4 | ✅ use-all-wiki.ts | ✅ DONE (Phase 9A) |
| **useTaskStore** | 12 | 2 | 10 | ✅ use-all-tasks.ts | ✅ DONE (Phase 9A) |
| **useStockTransferStore** | 8 | 2 | 6 | ✅ use-all-stock-transfers.ts | ✅ DONE (Phase 9A) |
| **useStockLocationStore** | 2 | 0 | 2 | ✅ use-all-stock-locations.ts | ✓ N/A (Settings page) |
| **useInventoryCheckStore** | 6 | 0 | 6 | ✅ use-all-inventory-checks.ts | ✓ N/A (Mixed usages) |
| **useComplaintStore** | 12 | 2 | 10 | ✅ use-all-complaints.ts | ✅ DONE (Phase 9A) |
| **useProvinceStore** | 16 | 12 | 4 | ✅ use-administrative-units.ts | ✅ DONE (Phase 11) |
| **useSupplierStore** | 6 | 0 | 6 | ✅ use-all-suppliers.ts | ✓ N/A (All mutations) |
| **useEmployeeStore** | 15 | 1 | 14 | ✅ use-all-employees.ts | ✅ DONE (Phase 9B) |
| **useSalesReturnStore** | 3 | 0 | 3 | ✅ use-all-sales-returns.ts | ✓ N/A (Mixed usages) |
| **useLeaveStore** | 8 | 3 | 5 | ✅ use-all-leaves.ts | ✅ DONE (Phase 9B) |
| **useAttendanceStore** | 10 | 0 | 10 | ⚠️ Complex selectors | ⚠️ COMPLEX |
| **useDepartmentStore** | 8 | 5 | 3 | ✅ use-all-departments.ts | ✅ DONE (Phase 9B) |
| **usePenaltyStore** | 12 | 1 | 11 | ✅ use-all-penalties.ts | ✅ DONE (Phase 9B) |
| **usePenaltyTypeStore** | 8 | 2 | 6 | ✅ use-all-penalty-types.ts | ✅ DONE (Phase 10A) |
| **useJobTitleStore** | 4 | 1 | 3 | ✅ use-all-job-titles.ts | ✅ DONE (Phase 9C) |
| **useTaxStore** | 5 | 0 | 5 | ✅ use-all-taxes.ts | ✓ N/A (Methods only) |
| **usePricingPolicyStore** | 4 | 1 | 3 | ✅ use-all-pricing-policies.ts | ✅ DONE (Phase 9C) |
| **useSalesChannelStore** | 2 | 0 | 2 | ⏳ TODO | ⏳ LOW PRIORITY |
| **useUnitStore** | 2 | 0 | 2 | ✅ use-all-units.ts | ✓ N/A (Settings page) |
| **useProductTypeStore** | 2 | 0 | 2 | ✅ use-all-product-types.ts | ✓ N/A (Settings page) |
| **useStorageLocationStore** | 2 | 0 | 2 | ⏳ TODO | ⏳ LOW PRIORITY |
| **useImporterStore** | 2 | 0 | 2 | ⏳ TODO | ⏳ LOW PRIORITY |
| **useProductCategoryStore** | 6 | 0 | 6 | ✅ use-all-categories.ts | ✓ N/A (All mutations) |
| **useEmployeeSettingsStore** | 8 | 0 | 8 | ⚠️ Complex selectors | ⚠️ COMPLEX |
| **useSlaSettingsStore** | 3 | 0 | 3 | ⏳ TODO | ⏳ LOW PRIORITY |
| **useProductLogisticsSettingsStore** | 3 | 0 | 3 | ⏳ TODO | ⏳ LOW PRIORITY |
| **useWarrantySettingsStore** | 2 | 0 | 2 | ⏳ TODO | ⏳ LOW PRIORITY |
| **useShippingSettingsStore** | 2 | 0 | 2 | ⏳ TODO | ⏳ LOW PRIORITY |
| **usePkgxSettingsStore** | 14 | 6 | 8 | ✅ Keep (UI+Integration) | ✓ N/A |
| **useTrendtechSettingsStore** | 8 | 3 | 5 | ✅ Keep (UI+Integration) | ✓ N/A |
| **useDocumentStore** | 4 | 0 | 4 | ⏳ TODO | ⏳ LOW PRIORITY |
| **useEmployeeCompStore** | 2 | 0 | 2 | ❌ None | ✓ N/A (Mutations only) |
| **usePayrollBatchStore** | 4 | 0 | 4 | ⏳ TODO | ⏳ LOW PRIORITY |
| **useStockHistoryStore** | 4 | 0 | 4 | ⏳ TODO | ⏳ LOW PRIORITY |
| **useShipmentStore** | 2 | 0 | 2 | ✅ use-shipments.ts | ✓ N/A |
| **useRoleStore** | 2 | 0 | 2 | ⏳ TODO | ⏳ LOW PRIORITY |
| **usePrintTemplateStore** | 2 | 0 | 2 | ⏳ TODO | ⏳ LOW PRIORITY |
| **useStoreInfoStore** | 2 | 0 | 2 | ⏳ TODO | ⏳ LOW PRIORITY |
| **usePurchaseReturnStore** | 4 | 3 | 1 | ✅ use-all-purchase-returns.ts | ✅ DONE (Phase 9D) |
| **useInventoryReceiptStore** | 5 | 3 | 2 | ✅ use-all-inventory-receipts.ts | ✅ DONE (Phase 9D) |

---

## ✅ Phase 9-11 Migration Summary (January 5, 2026)

### Total Files Migrated: ~33 files

| Phase | Stores Migrated | Files |
|-------|-----------------|-------|
| Phase 9A | Wiki, Task, StockTransfer, Complaint | 7 |
| Phase 9B | Employee, Leave, Department, Penalty | 8 |
| Phase 9C | JobTitle, PricingPolicy | 2 |
| Phase 9D | PurchaseReturn, InventoryReceipt | 6 |
| Phase 10A | PenaltyType | 2 |
| Phase 11 | Province (useProvinces, useWards2Level) | 8 |

### Phase 11 Files Migrated:
- `features/orders/components/shipping-integration.tsx` - useProvinces + useWards2Level
- `features/suppliers/components/quick-add-supplier-dialog.tsx` - useProvinces + useWards2Level
- `features/customers/customer-form.tsx` - useProvinces
- `features/employees/components/employee-form.tsx` - useProvinces
- `features/settings/branches/branch-form.tsx` - useProvinces (+ store for mutations)
- `features/settings/provinces/page.tsx` - useProvinces (+ store for mutations)
- `features/settings/provinces/form.tsx` - useProvinces
- `features/customers/components/address-bidirectional-converter.tsx` - useWards2Level

### Phase 12: .getState() Audit (Completed)
- **100+ calls** found across codebase
- **ALL VALID** - Used in utilities, services, import/export configs
- Pattern: Synchronous access in non-React code (correct Zustand usage)
- No changes needed

### Complex Stores Deferred:
- **useAttendanceStore** - Uses selector pattern with composite keys
- **useEmployeeSettingsStore** - Settings config store with UI state

---

## 🔴 Priority Issues

### 1. Complex Stores Requiring Special Attention

| Store | Issue | Recommendation |
|-------|-------|----------------|
| **useProvinceStore** | Nested data (provinces→districts→wards) | Use useAddressData hook |
| **useAttendanceStore** | Composite keys, selector pattern | Keep as-is for now |
| **useEmployeeSettingsStore** | Config store with mutations | Keep as-is for now |

### 2. Low Priority Stores (Settings/Config)

These stores have very few usages (1-2) and are mostly in settings pages with mutations:
| **useStockHistoryStore** | MEDIUM | 4 usages, inventory tracking |
| **useSalesChannelStore** | LOW | 2 usages, settings |
| **useStorageLocationStore** | LOW | 2 usages, settings |
| **useImporterStore** | LOW | 2 usages, settings |
| **useSlaSettingsStore** | LOW | 3 usages, settings |
| **useRoleStore** | LOW | 2 usages, settings |

---

## 🟠 Anti-Patterns Found

### 1. `.getState()` Calls in Components (100+ occurrences)

**Pattern:** `useXxxStore.getState()` inside components/handlers

**Why it's problematic:** 
- Bypasses React's reactivity system
- Component won't re-render when state changes
- Makes testing difficult

**Files with most `.getState()` calls:**

| File | Store(s) Used | Count |
|------|---------------|-------|
| [lib/import-export/configs/order.config.ts](lib/import-export/configs/order.config.ts) | Customer, Product, Branch, Employee | 6 |
| [lib/import-export/address-lookup.ts](lib/import-export/address-lookup.ts) | Province | 4 |
| [lib/payroll-engine.ts](lib/payroll-engine.ts) | EmployeeSettings, Penalty | 6 |
| [features/warranty/public-warranty-api.ts](features/warranty/public-warranty-api.ts) | Warranty, Payment, Receipt, Order, Branch | 5 |
| [features/cashbook/page.tsx](features/cashbook/page.tsx) | Receipt, Payment | 5 |
| [hooks/api/sync/use-api-sync.ts](hooks/api/sync/use-api-sync.ts) | Multiple | 20+ |

**Recommendation:** 
- Move to React Query hooks for data fetching
- Use `useStore` hook inside components
- Use `.getState()` only in event handlers or non-React code

### 2. Direct `data` Property Access

**Pattern:** `const { data } = useXxxStore()`

**Files still using this pattern:**

| File | Store | Should Use |
|------|-------|------------|
| [wiki/page.tsx](features/wiki/page.tsx#L45) | useWikiStore | useAllWiki |
| [wiki/form-page.tsx](features/wiki/form-page.tsx#L29) | useWikiStore | useAllWiki |
| [tasks/components/dashboard-page.tsx](features/tasks/components/dashboard-page.tsx#L41) | useTaskStore | useAllTasks |
| [tasks/components/user-tasks-page.tsx](features/tasks/components/user-tasks-page.tsx#L22) | useTaskStore | useAllTasks |
| [stock-transfers/page.tsx](features/stock-transfers/page.tsx#L51) | useStockTransferStore | useAllStockTransfers |
| [products/detail-page.tsx](features/products/detail-page.tsx#L129) | useStockTransferStore | useAllStockTransfers |
| [employees/page.tsx](features/employees/page.tsx#L54) | useEmployeeStore | useAllEmployees |
| [employees/components/employee-form.tsx](features/employees/components/employee-form.tsx#L178) | useEmployeeStore | useAllEmployees |
| [customers/page.tsx](features/customers/page.tsx#L111) | useCustomerStore | useAllCustomers |
| [products/page.tsx](features/products/page.tsx#L105) | useProductStore | useAllProducts |
| [leaves/page.tsx](features/leaves/page.tsx#L38) | useLeaveStore | useAllLeaves |
| [inventory-checks/page.tsx](features/inventory-checks/page.tsx#L66) | useInventoryCheckStore | useAllInventoryChecks |
| [complaints/page.tsx](features/complaints/page.tsx#L76) | useComplaintStore | useAllComplaints |
| [suppliers/page.tsx](features/suppliers/page.tsx#L47) | useSupplierStore | useAllSuppliers |

### 3. `findById` Usages in Components

**Pattern:** `const { findById } = useXxxStore()`

| File | Store | Should Use |
|------|-------|------------|
| [wiki/detail-page.tsx](features/wiki/detail-page.tsx#L18) | useWikiStore | useWiki(id) |
| [warranty/hooks/use-warranty-settlement.ts](features/warranty/hooks/use-warranty-settlement.ts#L29) | useWarrantyStore | useWarranty(id) |
| [receipts/detail-page.tsx](features/receipts/detail-page.tsx#L45) | useReceiptStore | useReceipt(id) |
| [sales-returns/detail-page.tsx](features/sales-returns/detail-page.tsx#L63) | useSalesReturnStore | useSalesReturn(id) |
| [leaves/components/detail-page.tsx](features/leaves/components/detail-page.tsx#L29) | useLeaveStore | useLeave(id) |
| [employees/components/detail-page.tsx](features/employees/components/detail-page.tsx#L198) | useEmployeeStore | useEmployee(id) |
| [inventory-checks/detail-page.tsx](features/inventory-checks/detail-page.tsx#L58) | useInventoryCheckStore | useInventoryCheck(id) |
| [penalties/detail-page.tsx](features/settings/penalties/detail-page.tsx#L46) | usePenaltyStore | usePenalty(id) |
| [departments/department-form-page.tsx](features/settings/departments/department-form-page.tsx#L15) | useDepartmentStore | useDepartment(id) |

---

## 📋 Migration Action Items

### Phase 1: Create Missing React Query Hooks (HIGH Priority)

1. ⬜ `features/attendance/hooks/use-all-attendance.ts`
2. ⬜ `features/settings/penalties/hooks/use-all-penalty-types.ts`
3. ⬜ `features/settings/employees/hooks/use-employee-settings.ts`
4. ⬜ `features/payroll/hooks/use-payroll-batches.ts`
5. ⬜ `features/stock-history/hooks/use-stock-history.ts`
6. ⬜ `features/settings/sales-channels/hooks/use-all-sales-channels.ts`

### Phase 2: Migrate Read-Only Usages (MEDIUM Priority)

For each store with ⏳ TODO status:
1. Find all `{ data }` destructuring
2. Replace with `useAllXxx()` hook
3. Find all `{ findById }` usages
4. Replace with `useXxx(id)` hook
5. Remove store import if no mutations remain

### Phase 3: Refactor .getState() Calls (LOW Priority)

1. ⬜ Audit all `.getState()` calls
2. ⬜ Move to hooks where appropriate
3. ⬜ Document legitimate use cases (event handlers, non-React code)

---

## ✅ Correctly Implemented (Reference Examples)

These stores are correctly using React Query with Zustand only for UI state:

1. **useShipmentStore** - Only mutations, data via `useShipments()`
2. **usePkgxSettingsStore** - Integration/sync state (keep as-is)
3. **useTrendtechSettingsStore** - Integration/sync state (keep as-is)
4. **useAppearanceStore** - Pure UI state (keep as-is)

---

## 📝 Notes

### Complex Cases Requiring Special Attention

1. **useProvinceStore** - Has nested data structure (provinces → districts → wards), needs custom React Query implementation with `getWardsByProvinceId` selector pattern

2. **useAttendanceStore** - Uses composite keys (`${monthKey}:${employeeId}`), needs careful hook design for data access patterns

3. **usePayrollBatchStore** - Linked with attendance lock status, needs atomic operations

4. **useEmployeeSettingsStore** - JSON config pattern, may need form-specific hooks

---

*This audit should be re-run after each migration phase to track progress.*
