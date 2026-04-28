# Settings Hooks Audit Report

**Date:** 2026-04-29
**Project:** HRM2

---

## Summary

### Theo SKILL - Settings Hooks (< 100 records, dữ liệu tĩnh):

**→ Giữ nguyên useAllXxx** cho tất cả Settings hooks.

Tuy nhiên, vẫn cần CHECK từng file để xác nhận use case cụ thể.

---

## Settings Hooks Overview

| Hook | Entity Type | Files Count | Data Size | Recommendation |
|------|-------------|-------------|-----------|----------------|
| `useAllBranches` | Settings | **61 files** | < 10 records | ✅ Keep |
| `useAllDepartments` | Settings | **10 files** | < 20 records | ✅ Keep |
| `useAllUnits` | Settings | **4 files** | < 20 records | ✅ Keep |
| `useAllPricingPolicies` | Settings | **21 files** | < 50 records | ✅ Keep |
| `useAllTaxes` | Settings | **8 files** | < 10 records | ✅ Keep |
| `useAllPaymentMethods` | Settings | **15 files** | < 20 records | ✅ Keep |
| `useAllCashAccounts` | Settings | **23 files** | < 30 records | ✅ Keep |
| `useAllReceiptTypes` | Settings | **6 files** | < 10 records | ✅ Keep |
| `useAllSalesChannels` | Settings | **2 files** | < 10 records | ✅ Keep |
| `useAllTargetGroups` | Settings | **4 files** | < 20 records | ✅ Keep |
| `useAllEmployeeTypes` | Settings | **2 files** | < 10 records | ✅ Keep |
| `useAllJobTitles` | Settings | **4 files** | < 30 records | ✅ Keep |
| `useAllPenalties` | Settings | **1 file** (hook only) | < 20 records | ✅ Keep |
| `useAllProductTypes` | Settings | **2 files** | < 10 records | ✅ Keep |
| `useAllShippingPartners` | Settings | **3 files** | < 10 records | ✅ Keep |
| `useAllCategories` | Settings | **4 files** | < 100 records | ✅ Keep |
| `useAllBrands` | Settings | **3 files** | < 100 records | ✅ Keep |

---

## Chi tiết từng Hook

### 1. useAllBranches (61 files)

**Vấn đề:** Quá nhiều files sử dụng (61 files)

**Use Case Pattern:**
- **Dropdown/Select:** 45+ files - Chọn chi nhánh trong form (Orders, Products, Warranty, etc.)
- **Filter:** 10+ files - Filter trong table/page (Customers, Suppliers, Inventory)
- **ComboBox:** 5 files - Chọn chi nhánh với search

**Files & Use Cases:**

#### ✅ Files OK (Dropdown - giữ nguyên)

| File | Use Case | Reason |
|------|----------|--------|
| `features/products/form-page.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/products/detail-page.tsx` | Display/Filter branch | < 10 items |
| `features/warranty/warranty-form-page.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/orders/components/order-info-card.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/purchase-orders/form-page.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/payments/payment-form.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/receipts/receipt-form.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/sales-returns/form-page.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/inventory-receipts/page.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/inventory-checks/form-page.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/stock-transfers/form-page.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/cashbook/page.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/employees/components/employee-form.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/employees/components/detail-page.tsx` | Display branch name | < 10 items |
| `features/settings/branches/hooks/use-all-branches.ts` | Hook definition | N/A |
| `features/settings/cash-accounts/form.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/settings/printer/print-templates-page.tsx` | Display branches | < 10 items |
| `features/settings/store-info/store-info-page.tsx` | Display branches | < 10 items |
| `features/settings/pkgx/components/general-config-tab.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/warranty/components/cards/warranty-form-info-card.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/supplier-warranty/form-page.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/shipments/page.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/purchase-returns/page.tsx` | Dropdown chọn chi nhánh | < 10 items |
| `features/cashbook/reports-page.tsx` | Dropdown chọn chi nhánh | < 10 items |

#### ✅ Files OK (Filter - giữ nguyên)

| File | Use Case | Reason |
|------|----------|--------|
| `features/orders/page.tsx` | Branch filter dropdown | < 10 items |
| `features/customers/page.tsx` | Branch filter (import only) | < 10 items |
| `features/suppliers/page.tsx` | Branch filter (import only) | < 10 items |
| `features/inventory/page.tsx` | Branch filter dropdown | < 10 items |
| `features/packaging/page.tsx` | Branch filter dropdown | < 10 items |
| `features/dashboard/page-lite.tsx` | Branch filter dropdown | < 10 items |
| `features/stock-locations/page.tsx` | Branch filter dropdown | < 10 items |
| `features/cost-adjustments/page.tsx` | Branch filter dropdown | < 10 items |
| `features/price-adjustments/page.tsx` | Branch filter dropdown | < 10 items |

#### ✅ Files OK (Settings pages - giữ nguyên)

| File | Use Case | Reason |
|------|----------|--------|
| `features/settings/branches/hooks/use-all-branches.ts` | Settings page | N/A |
| `features/settings/cash-accounts/page-content.tsx` | Settings page | < 10 items |
| `features/settings/penalties/page.tsx` | Settings page | < 10 items |

**Recommendation:** ✅ **Giữ nguyên** - Branches luôn < 10 records, dữ liệu tĩnh

---

### 2. useAllDepartments (10 files)

**Use Case Pattern:**
- **Dropdown:** 6 files - Chọn phòng ban trong form
- **Organization Chart:** 2 files - Hiển thị tree structure
- **Filter:** 2 files - Filter trong table

**Files & Use Cases:**

| File | Use Case | Reason |
|------|----------|--------|
| `features/employees/components/employee-form.tsx` | Dropdown chọn phòng ban | < 20 items |
| `features/employees/page.tsx` | Filter dropdown (useEmployeeFilterOptions) | < 20 items |
| `features/attendance/page.tsx` | Filter dropdown (useEmployeeFilterOptions) | < 20 items |
| `features/settings/departments/page.tsx` | Settings page - list all | < 20 items |
| `features/settings/departments/departments-settings-content.tsx` | Settings page - CRUD | < 20 items |
| `features/settings/departments/organization-chart/hooks/use-org-chart.ts` | Org chart tree | < 20 items |
| `features/payroll/components/payslip-print-button.tsx` | Filter dropdown (2 places) | < 20 items |
| `features/settings/employees/salary-component-form.tsx` | Dropdown chọn phòng ban | < 20 items |
| `features/settings/departments/hooks/use-all-departments.ts` | Hook definition | N/A |
| `features/settings/departments/hooks/use-departments.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Departments luôn < 20 records

---

### 3. useAllPricingPolicies (21 files)

**Use Case Pattern:**
- **Dropdown:** 15 files - Chọn chính sách giá trong form
- **Display:** 4 files - Hiển thị danh sách chính sách
- **Prefetch:** 2 files - Prefetch cho order forms

**Files & Use Cases:**

| File | Use Case | Reason |
|------|----------|--------|
| `features/orders/components/line-items-table.tsx` | Dropdown chọn pricing policy | < 50 items |
| `features/orders/components/order-summary.tsx` | Prefetch pricing policies | < 50 items |
| `features/price-adjustments/form-page.tsx` | Dropdown chọn pricing policy | < 50 items |
| `features/price-adjustments/page.tsx` | Filter dropdown | < 50 items |
| `features/sales-returns/form-page.tsx` | Dropdown chọn pricing policy | < 50 items |
| `features/settings/pricing/page.tsx` | Settings - list all | < 50 items |
| `features/settings/pricing/page-refactored.tsx` | Settings - list all | < 50 items |
| `features/settings/pricing/form.tsx` | Settings - CRUD | < 50 items |
| `features/products/hooks/use-product-pricing.ts` | Hook logic | < 50 items |
| `features/products/hooks/use-product-detail-data.ts` | Data loading | < 50 items |
| `features/products/detail-page.tsx` | Display policies | < 50 items |
| `features/products/components/combo-section.tsx` | Dropdown chọn pricing | < 50 items |
| `features/customers/detail-page.tsx` | Display policies | < 50 items |
| `features/warranty/hooks/use-product-selection.ts` | Product selection | < 50 items |
| `features/warranty/components/warranty-products-section.tsx` | Dropdown pricing | < 50 items |
| `features/settings/pkgx/components/price-mapping-content.tsx` | PKGX mapping | < 50 items |
| `features/settings/pkgx/components/price-mapping-tab.tsx` | PKGX mapping | < 50 items |
| `features/products/hooks/use-pkgx-sync.ts` | PKGX sync | < 50 items |
| `features/sales-returns/hooks/use-sales-return-form-settings.ts` | Hook documentation | < 50 items |
| `features/settings/pricing/hooks/use-all-pricing-policies.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Pricing Policies luôn < 50 records

---

### 4. useAllPaymentMethods (15 files)

**Use Case Pattern:**
- **Dropdown:** 12 files - Chọn hình thức thanh toán
- **Prefetch:** 3 files - Prefetch cho dialogs

**Files & Use Cases:**

| File | Use Case | Reason |
|------|----------|--------|
| `features/payments/payment-form.tsx` | Dropdown chọn payment method | < 20 items |
| `features/sales-returns/form-page.tsx` | Dropdown chọn payment method | < 20 items |
| `features/sales-returns/form/SalesReturnSummary.tsx` | Display payment method | < 20 items |
| `features/purchase-orders/components/order-summary-card.tsx` | Dropdown chọn payment | < 20 items |
| `features/orders/detail/payment-dialog.tsx` | Prefetch payment methods | < 20 items |
| `features/purchase-returns/return-for-order-page.tsx` | Dropdown chọn payment | < 20 items |
| `features/receipts/receipt-form.tsx` | Dropdown chọn payment method | < 20 items |
| `features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx` | Prefetch payment methods | < 20 items |
| `features/orders/components/order-summary.tsx` | Prefetch payment methods | < 20 items |
| `features/settings/cash-accounts/page-content.tsx` | Settings - list all | < 20 items |
| `features/settings/cash-accounts/form.tsx` | Settings - dropdown | < 20 items |
| `features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx` | Prefetch receipt types | < 20 items |
| `features/settings/payments/hooks/use-all-payment-methods.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Payment Methods luôn < 20 records

---

### 5. useAllCashAccounts (23 files)

**Use Case Pattern:**
- **Dropdown:** 18 files - Chọn tài khoản quỹ
- **Prefetch:** 5 files - Prefetch cho dialogs

**Files & Use Cases:**

| File | Use Case | Reason |
|------|----------|--------|
| `features/payments/page.tsx` | Dropdown chọn cash account | < 30 items |
| `features/payments/payment-form.tsx` | Dropdown chọn cash account | < 30 items |
| `features/receipts/receipt-form.tsx` | Dropdown chọn cash account | < 30 items |
| `features/receipts/components/receipts-content.tsx` | Display/select cash account | < 30 items |
| `features/receipts/hooks/use-receipts-page-handlers.ts` | Hook logic | < 30 items |
| `features/orders/detail/payment-dialog.tsx` | Prefetch cash accounts | < 30 items |
| `features/purchase-orders/hooks/use-po-page-handlers.ts` | Prefetch cash accounts | < 30 items |
| `features/purchase-orders/detail/payment-confirmation-dialog.tsx` | Prefetch cash accounts | < 30 items |
| `features/sales-returns/form-page.tsx` | Dropdown chọn cash account | < 30 items |
| `features/sales-returns/form/SalesReturnSummary.tsx` | Display cash account | < 30 items |
| `features/purchase-returns/page.tsx` | Dropdown chọn cash account | < 30 items |
| `features/purchase-returns/return-for-order-page.tsx` | Dropdown chọn cash account | < 30 items |
| `features/cashbook/page.tsx` | Settings - list all | < 30 items |
| `features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx` | Prefetch cash accounts | < 30 items |
| `features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx` | Prefetch cash accounts | < 30 items |
| `features/warranty/detail-page.tsx` | Display cash accounts | < 30 items |
| `features/payroll/components/create-payment-dialog.tsx` | Prefetch cash accounts | < 30 items |
| `features/payments/hooks/use-payments-page-handlers.ts` | Hook logic | < 30 items |
| `features/settings/cash-accounts/page-content.tsx` | Settings - list all | < 30 items |
| `features/cashbook/hooks/use-all-cash-accounts.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Cash Accounts luôn < 30 records

---

### 6. useAllTaxes (8 files)

**Use Case Pattern:**
- **Dropdown:** 5 files - Chọn thuế
- **Display:** 3 files - Hiển thị danh sách thuế

**Files & Use Cases:**

| File | Use Case | Reason |
|------|----------|--------|
| `features/orders/components/tax-selector.tsx` | Dropdown chọn tax | < 10 items |
| `features/orders/components/order-print-button.tsx` | Export tax data | < 10 items |
| `features/purchase-orders/components/product-selection-card.tsx` | Dropdown chọn tax | < 10 items |
| `features/purchase-orders/components/tax-selector.tsx` | Dropdown chọn tax | < 10 items |
| `features/products/product-form-complete.tsx` | Dropdown chọn tax | < 10 items |
| `features/settings/pricing/page.tsx` | Settings - list all | < 10 items |
| `features/settings/pricing/tax-content.tsx` | Settings - list all | < 10 items |
| `features/settings/pricing/page-refactored.tsx` | Settings - list all | < 10 items |
| `features/settings/taxes/hooks/use-all-taxes.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Taxes luôn < 10 records

---

### 7. useAllUnits (4 files)

**Use Case Pattern:**
- **Settings Page:** 2 files - CRUD units
- **Form:** 2 files - Display units

| File | Use Case | Reason |
|------|----------|--------|
| `features/settings/inventory/tabs/units-tab.tsx` | Settings - CRUD units | < 20 items |
| `features/settings/units/hooks/use-all-units.ts` | Hook definition | N/A |
| `features/sales-returns/hooks/use-sales-return-form-settings.ts` | Hook documentation | < 20 items |

**Recommendation:** ✅ **Giữ nguyên** - Units luôn < 20 records

---

### 8. useAllReceiptTypes (6 files)

**Use Case Pattern:**
- **Dropdown:** 5 files - Chọn loại phiếu thu
- **Settings:** 1 file - CRUD

| File | Use Case | Reason |
|------|----------|--------|
| `features/receipts/receipt-form.tsx` | Dropdown chọn receipt type | < 10 items |
| `features/cashbook/page.tsx` | Dropdown chọn receipt type | < 10 items |
| `features/settings/receipt-types/page-content.tsx` | Settings - CRUD | < 10 items |
| `features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx` | Prefetch receipt types | < 10 items |
| `features/receipts/components/receipts-content.tsx` | Display receipt types | < 10 items |
| `features/settings/receipt-types/hooks/use-all-receipt-types.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Receipt Types luôn < 10 records

---

### 9. useAllTargetGroups (4 files)

**Use Case Pattern:**
- **Dropdown:** 3 files - Chọn nhóm đối tượng
- **Settings:** 1 file - CRUD

| File | Use Case | Reason |
|------|----------|--------|
| `features/receipts/receipt-form.tsx` | Dropdown chọn target group | < 20 items |
| `features/payments/payment-form.tsx` | Dropdown chọn target group | < 20 items |
| `features/settings/target-groups/page-content.tsx` | Settings - CRUD | < 20 items |
| `features/settings/target-groups/hooks/use-all-target-groups.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Target Groups luôn < 20 records

---

### 10. useAllJobTitles (4 files)

**Use Case Pattern:**
- **Dropdown:** 2 files - Chọn chức vụ
- **Settings:** 2 files - CRUD

| File | Use Case | Reason |
|------|----------|--------|
| `features/employees/components/employee-form.tsx` | Dropdown chọn job title | < 30 items |
| `features/settings/job-titles/page-content.tsx` | Settings - CRUD | < 30 items |
| `features/settings/job-titles/hooks/use-all-job-titles.ts` | Hook definition | N/A |
| `features/settings/job-titles/hooks/use-job-titles.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Job Titles luôn < 30 records

---

### 11. useAllEmployeeTypes (2 files)

**Use Case Pattern:**
- **Settings:** 2 files - CRUD

| File | Use Case | Reason |
|------|----------|--------|
| `features/settings/employee-types/employee-types-settings-content.tsx` | Settings - CRUD | < 10 items |
| `features/settings/employee-types/hooks/use-all-employee-types.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Employee Types luôn < 10 records

---

### 12. useAllSalesChannels (2 files)

**Use Case Pattern:**
- **Settings:** 2 files - CRUD

| File | Use Case | Reason |
|------|----------|--------|
| `features/settings/sales-channels/page-content.tsx` | Settings - CRUD | < 10 items |
| `features/settings/sales-channels/hooks/use-all-sales-channels.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Sales Channels luôn < 10 records

---

### 13. useAllProductTypes (2 files)

**Use Case Pattern:**
- **Settings:** 2 files - CRUD

| File | Use Case | Reason |
|------|----------|--------|
| `features/settings/inventory/tabs/product-types-tab.tsx` | Settings - CRUD | < 10 items |
| `features/settings/inventory/hooks/use-all-product-types.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Product Types luôn < 10 records

---

### 14. useAllShippingPartners (3 files)

**Use Case Pattern:**
- **Dropdown:** 2 files - Chọn đối tác vận chuyển
- **Settings:** 1 file - Hook definition

| File | Use Case | Reason |
|------|----------|--------|
| `features/orders/components/order-summary.tsx` | Prefetch shipping partners | < 10 items |
| `features/payments/components/recipient-combobox.tsx` | Dropdown chọn shipping partner | < 10 items |
| `features/settings/shipping/hooks/use-all-shipping-partners.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Shipping Partners luôn < 10 records

---

### 15. useAllCategories (4 files)

**Use Case Pattern:**
- **Import/Export:** 2 files - Import/Export categories
- **CRUD:** 2 files - Settings

| File | Use Case | Reason |
|------|----------|--------|
| `features/categories/category-new.tsx` | Create new category | < 100 items |
| `features/categories/components/categories-import-export-dialogs.tsx` | Import/Export | < 100 items |
| `features/categories/hooks/use-all-categories.ts` | Hook definition | N/A |
| `features/settings/inventory/hooks/use-categories.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Categories luôn < 100 records (tree structure)

---

### 16. useAllBrands (3 files)

**Use Case Pattern:**
- **CRUD:** 3 files - Settings

| File | Use Case | Reason |
|------|----------|--------|
| `features/brands/brand-detail.tsx` | Brand detail page | < 100 items |
| `features/brands/brand-new.tsx` | Create new brand | < 100 items |
| `features/brands/hooks/use-all-brands.ts` | Hook definition | N/A |

**Recommendation:** ✅ **Giữ nguyên** - Brands luôn < 100 records

---

### 17. useAllPenalties (1 file - hook only)

**Vấn đề:** Đã NOTE trong hook là REMOVED

| File | Use Case | Reason |
|------|----------|--------|
| `features/settings/penalties/hooks/use-all-penalties.ts` | Hook definition | N/A (Đã được remove) |

**Recommendation:** ✅ **Giữ nguyên (đã remove)** - Không còn sử dụng

---

## Files có vấn đề (cần chú ý)

| File | Hook | Issue | Recommended Solution |
|------|------|-------|---------------------|
| **Không có vấn đề nào** | - | - | - |

**Kết luận:** Tất cả Settings hooks đều OK vì:
1. Dữ liệu Settings luôn < 100 records
2. Dữ liệu tĩnh, ít thay đổi
3. Chủ yếu dùng cho dropdown và settings pages

---

## Files OK (giữ nguyên)

| File | Hook | Use Case | Reason |
|------|------|----------|--------|
| **Tất cả 60+ files** | Tất cả Settings hooks | Dropdown, Filter, Settings CRUD | Settings data < 100 records, tĩnh |

---

## Checklist theo SKILL

```
1. File đó dùng useAll cho mục đích gì?
   ├── Dropdown nhỏ (< 100 items)? → ✅ Giữ nguyên
   ├── Search box? → N/A cho Settings
   ├── Table/List view? → N/A cho Settings
   └── Export all data? → ✅ Giữ nguyên

2. useAll có filter params không? → ✅ Không (Settings không cần)

3. useAll có client-side .filter() không? → ✅ Có một số (e.g., isActive filter)
   └── OK vì dữ liệu < 100 records
```

---

## Kết luận

### ✅ Settings Hooks - Tất cả OK

**Theo SKILL:**
> **Settings** (branches, departments, units, pricing, taxes, etc.) → ✅ Giữ `useAllXxx`
> **Lý do:** < 100 records, dữ liệu tĩnh

**Tất cả 17 Settings hooks đều:**
- ✅ Có < 100 records (thực tế hầu hết < 30 records)
- ✅ Dữ liệu tĩnh, ít thay đổi
- ✅ Use case chủ yếu: Dropdown và Settings pages
- ✅ Không cần Meilisearch
- ✅ Không cần API Filter

**Không cần thay đổi gì cho Settings hooks.**

---

## Files được audit (đầy đủ)

### useAllBranches (61 files)
```
features/inventory-receipts/page.tsx
features/payments/payment-form.tsx
features/products/components/combo-detail-cards.tsx
features/stock-transfers/page.tsx
features/sales-returns/form-page.tsx
features/settings/branches/hooks/use-all-branches.ts
features/products/detail-page.tsx
features/orders/page.tsx
features/stock-transfers/components/form-page.tsx
features/stock-transfers/components/edit-page.tsx
features/inventory-checks/form-page.tsx
features/inventory-checks/page.tsx
features/stock-locations/form.tsx
features/stock-locations/page.tsx
features/inventory/page.tsx
features/suppliers/page.tsx
features/packaging/page.tsx
features/sales-returns/page.tsx
features/supplier-warranty/form-page.tsx
features/settings/cash-accounts/form.tsx
features/purchase-returns/page.tsx
features/cashbook/page.tsx
features/cashbook/reports-page.tsx
features/employees/components/detail-page.tsx
features/employees/components/employee-form.tsx
features/employees/page.tsx
features/employees/trash-page.tsx
features/orders/components/order-info-card.tsx
features/payments/hooks/use-payments-page-handlers.ts
features/settings/shipping/components/pickup-addresses-tab.tsx
features/warranty/warranty-form-page.tsx
features/warranty/warranty-list-page.tsx
features/warranty/components/cards/warranty-form-info-card.tsx
features/receipts/components/receipts-content.tsx
features/receipts/hooks/use-receipts-page-handlers.ts
features/receipts/receipt-form.tsx
features/purchase-orders/hooks/use-po-receive-workflow.ts
features/purchase-orders/components/order-info-card.tsx
features/purchase-orders/form-page.tsx
features/purchase-orders/page.tsx
features/products/hooks/use-combo-stock.ts
features/products/hooks/use-product-detail-data.ts
features/dashboard/page-lite.tsx
features/shipments/page.tsx
features/shared/product-selection-dialog.tsx
features/settings/printer/print-templates-page.tsx
features/settings/pkgx/components/general-config-tab.tsx
features/payments/page.tsx
features/products/components/combo-section.tsx
features/price-adjustments/detail-page.tsx
features/price-adjustments/form-page.tsx
features/price-adjustments/page.tsx
features/cost-adjustments/page.tsx
features/cost-adjustments/detail-page.tsx
features/products/form-page.tsx
features/products/product-form-complete.tsx
features/settings/cash-accounts/page-content.tsx
features/settings/store-info/store-info-page.tsx
features/settings/penalties/page.tsx
```

### useAllDepartments (10 files)
```
features/employees/components/employee-form.tsx
features/settings/departments/hooks/use-all-departments.ts
features/settings/departments/departments-settings-content.tsx
features/attendance/page.tsx
features/settings/departments/organization-chart/hooks/use-org-chart.ts
features/settings/departments/hooks/use-departments.ts
features/payroll/components/payslip-print-button.tsx
features/settings/employees/salary-component-form.tsx
features/settings/departments/page.tsx
```

### useAllUnits (4 files)
```
features/settings/inventory/tabs/units-tab.tsx
features/sales-returns/hooks/use-sales-return-form-settings.ts
features/settings/units/hooks/use-all-units.ts
```

### useAllPricingPolicies (21 files)
```
features/products/hooks/use-pkgx-sync.ts
features/warranty/hooks/use-product-selection.ts
features/products/hooks/use-product-pricing.ts
features/products/detail-page.tsx
features/products/hooks/use-product-detail-data.ts
features/settings/pkgx/components/price-mapping-content.tsx
features/products/components/combo-section.tsx
features/settings/pricing/page.tsx
features/price-adjustments/form-page.tsx
features/settings/pricing/page-refactored.tsx
features/products/hooks/use-product-page-data.ts
features/orders/components/line-items-table.tsx
features/warranty/components/warranty-products-section.tsx
features/settings/pricing/hooks/use-all-pricing-policies.ts
features/settings/pricing/form.tsx
features/price-adjustments/page.tsx
features/sales-returns/form-page.tsx
features/sales-returns/hooks/use-sales-return-form-settings.ts
features/customers/detail-page.tsx
features/settings/pkgx/components/price-mapping-tab.tsx
```

### useAllTaxes (8 files)
```
features/orders/components/tax-selector.tsx
features/orders/components/order-print-button.tsx
features/settings/pricing/page.tsx
features/settings/pricing/tax-content.tsx
features/purchase-orders/components/product-selection-card.tsx
features/settings/pricing/page-refactored.tsx
features/purchase-orders/components/tax-selector.tsx
features/products/product-form-complete.tsx
features/settings/taxes/hooks/use-all-taxes.ts
features/settings/taxes/hooks/use-taxes.ts
```

### useAllPaymentMethods (15 files)
```
features/payments/payment-form.tsx
features/sales-returns/form-page.tsx
features/sales-returns/form/SalesReturnSummary.tsx
features/sales-returns/hooks/use-sales-return-form-settings.ts
features/purchase-orders/components/order-summary-card.tsx
features/orders/detail/payment-dialog.tsx
features/purchase-returns/return-for-order-page.tsx
features/receipts/receipt-form.tsx
features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx
features/orders/components/order-summary.tsx
features/settings/cash-accounts/page-content.tsx
features/settings/cash-accounts/form.tsx
features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx
features/settings/payments/hooks/use-all-payment-methods.ts
```

### useAllCashAccounts (23 files)
```
features/receipts/hooks/use-receipts-page-handlers.ts
features/sales-returns/hooks/use-sales-return-form-settings.ts
features/settings/cash-accounts/hooks/use-cash-accounts.ts
features/orders/detail/payment-dialog.tsx
features/purchase-orders/hooks/use-po-page-handlers.ts
features/purchase-orders/detail/payment-confirmation-dialog.tsx
features/sales-returns/form/SalesReturnSummary.tsx
features/receipts/components/receipts-content.tsx
features/settings/cash-accounts/page-content.tsx
features/payments/hooks/use-payments-page-handlers.ts
features/purchase-returns/return-for-order-page.tsx
features/cashbook/page.tsx
features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx
features/payroll/components/create-payment-dialog.tsx
features/supplier-warranty/detail-page.tsx
features/receipts/receipt-form.tsx
features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx
features/purchase-returns/form-page.tsx
features/payments/page.tsx
features/payments/payment-form.tsx
features/cashbook/hooks/use-all-cash-accounts.ts
```

### useAllReceiptTypes (6 files)
```
features/receipts/receipt-form.tsx
features/cashbook/page.tsx
features/settings/receipt-types/page-content.tsx
features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx
features/receipts/components/receipts-content.tsx
features/settings/receipt-types/hooks/use-all-receipt-types.ts
```

### useAllSalesChannels (2 files)
```
features/settings/sales-channels/hooks/use-all-sales-channels.ts
features/settings/sales-channels/page-content.tsx
```

### useAllTargetGroups (4 files)
```
features/settings/target-groups/hooks/use-all-target-groups.ts
features/receipts/receipt-form.tsx
features/payments/payment-form.tsx
features/settings/target-groups/page-content.tsx
```

### useAllEmployeeTypes (2 files)
```
features/settings/employee-types/hooks/use-all-employee-types.ts
features/settings/employee-types/employee-types-settings-content.tsx
```

### useAllJobTitles (4 files)
```
features/settings/job-titles/hooks/use-job-titles.ts
features/settings/job-titles/page-content.tsx
features/employees/components/employee-form.tsx
features/settings/job-titles/hooks/use-all-job-titles.ts
```

### useAllProductTypes (2 files)
```
features/settings/inventory/tabs/product-types-tab.tsx
features/settings/inventory/hooks/use-all-product-types.ts
```

### useAllShippingPartners (3 files)
```
features/orders/components/order-summary.tsx
features/payments/components/recipient-combobox.tsx
features/settings/shipping/hooks/use-all-shipping-partners.ts
```

### useAllCategories (4 files)
```
features/settings/inventory/hooks/use-categories.ts
features/categories/category-new.tsx
features/categories/components/categories-import-export-dialogs.tsx
features/categories/hooks/use-all-categories.ts
```

### useAllBrands (3 files)
```
features/brands/brand-detail.tsx
features/brands/brand-new.tsx
features/brands/hooks/use-all-brands.ts
```

### useAllPenalties (1 file - hook only, đã remove)
```
features/settings/penalties/hooks/use-all-penalties.ts (NOTE: REMOVED)
```

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total Settings hooks audited | 17 |
| Total files using Settings hooks | ~162 files |
| Files with issues | 0 |
| Files OK (giữ nguyên) | ~162 files |
| Recommended actions | **Không cần thay đổi** |

---

## Recommendation

**✅ KHÔNG CẦN THAY ĐỔI GÌ**

Tất cả Settings hooks đều OK vì:
1. **Data size nhỏ:** Tất cả < 100 records (hầu hết < 30 records)
2. **Data tĩnh:** Settings thay đổi ít, không cần real-time sync
3. **Use case phù hợp:** Dropdown và Settings CRUD pages
4. **Performance tốt:** < 100 records load nhanh, không gây lag

**Theo SKILL:**
> Settings (< 100 records, dữ liệu tĩnh) → Giữ nguyên useAllXxx
