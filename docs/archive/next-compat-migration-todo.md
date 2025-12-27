# Next.js Migration TODO - Loại bỏ next-compat.tsx

> **Ngày tạo:** 21/12/2024
> **Mục tiêu:** Thay thế dần `@/lib/next-compat` bằng native Next.js hooks (`useRouter`, `usePathname`, `useParams`, `useSearchParams` từ `next/navigation`)

## Migration Pattern

| Old (next-compat) | New (Next.js native) |
|-------------------|---------------------|
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `navigate(path)` | `router.push(path)` |
| `useLocation()` | `usePathname()` from `next/navigation` |
| `location.pathname` | `pathname` |
| `useParams()` | `useParams()` from `next/navigation` |
| `useSearchParams()` / `useSearchParamsWithSetter()` | `useSearchParams()` from `next/navigation` |
| `Link to="..."` | `Link href="..."` from `next/link` |
| `navigate: (path: string) => void` | `router: AppRouterInstance` |
| `NavigateFunction` type | `AppRouterInstance` from `next/dist/shared/lib/app-router-context.shared-runtime` |
| `MemoryRouter` (tests) | Cần mock hoặc viết lại tests |

---

## ✅ Đã Hoàn Thành

- [x] `features/products/page.tsx`
- [x] `features/products/columns.tsx`
- [x] `features/complaints/page.tsx`
- [x] `features/complaints/columns.tsx`
- [x] `features/customers/page.tsx`
- [x] `features/customers/columns.tsx`
- [x] `features/settings/page.tsx`
- [x] `features/settings/use-settings-page-header.tsx`
- [x] `features/orders/page.tsx`
- [x] `features/orders/columns.tsx`
- [x] `features/warranty/warranty-list-page.tsx`
- [x] `features/warranty/columns.tsx`
- [x] `features/suppliers/page.tsx`
- [x] `features/suppliers/columns.tsx`
- [x] `features/suppliers/supplier-card.tsx`
- [x] `features/dashboard/page.tsx`
- [x] `features/dashboard/debt-alert-widget.tsx`
- [x] `features/orders/order-card.tsx`
- [x] `features/orders/order-detail-page.tsx`
- [x] `features/orders/order-form-page.tsx`

---

## 📋 Chưa Hoàn Thành (150+ files)

### 🔴 Priority 1 - Core Pages (Dùng nhiều)

#### Dashboard
- [x] `features/dashboard/page.tsx`
- [x] `features/dashboard/debt-alert-widget.tsx`

#### Orders
- [x] `features/orders/order-detail-page.tsx` *(2 imports)*
- [x] `features/orders/order-form-page.tsx`
- [x] `features/orders/order-card.tsx`
- [x] `features/orders/components/customer-selector.tsx`
- [x] `features/orders/components/packaging-info.tsx`
- [x] `features/orders/components/partner-shipment-form.tsx`
- [x] `features/orders/components/product-search.tsx` *(unused import - removed)*
- [x] `features/orders/components/payment-info.tsx`
- [x] `features/orders/components/shipping-tracking-tab.tsx` *(unused import - removed)*
- [x] `features/orders/components/line-items-table.tsx` *(unused import - removed)*
- [x] `features/orders/components/shipping/shipping-partner-selector.tsx`
- [ ] `features/orders/components/packaging-info.tsx`
- [ ] `features/orders/components/partner-shipment-form.tsx`
- [ ] `features/orders/components/product-search.tsx`
- [ ] `features/orders/components/payment-info.tsx`
- [ ] `features/orders/components/shipping-tracking-tab.tsx`
- [ ] `features/orders/components/line-items-table.tsx`
- [x] `features/orders/components/shipping/shipping-partner-selector.tsx`

#### Products
- [x] `features/products/form-page.tsx`
- [x] `features/products/detail-page.tsx`
- [x] `features/products/trash-page.tsx`
- [x] `features/products/trash-columns.tsx`
- [x] `features/products/components/committed-stock-dialog.tsx`
- [x] `features/products/components/in-transit-stock-dialog.tsx`

#### Customers
- [x] `features/customers/customer-form-page.tsx`
- [x] `features/customers/detail-page.tsx` *(2 imports)*
- [x] `features/customers/trash-page.tsx`

#### Employees
- [x] `features/employees/page.tsx`
- [x] `features/employees/virtualized-page.tsx`
- [x] `features/employees/trash-page.tsx`
- [x] `features/employees/employee-form-page.tsx`
- [x] `features/employees/detail-page.tsx` *(2 imports)*
- [ ] `features/employees/page-tanstack-test.tsx`

---

### 🟠 Priority 2 - Feature Pages

#### Complaints
- [ ] `features/complaints/form-page.tsx`
- [ ] `features/complaints/detail-page.tsx`
- [ ] `features/complaints/statistics-page.tsx`
- [ ] `features/complaints/public-tracking-page.tsx`
- [ ] `features/complaints/components/complaint-compensation-section.tsx`
- [ ] `features/complaints/components/complaint-affected-products.tsx`
- [ ] `features/complaints/components/complaint-order-info.tsx`
- [ ] `features/complaints/components/complaint-details-card.tsx`

#### Warranty
- [ ] `features/warranty/warranty-detail-page.tsx`
- [ ] `features/warranty/warranty-statistics-page.tsx`
- [ ] `features/warranty/warranty-tracking-page.tsx`
- [ ] `features/warranty/warranty-form-page.tsx`
- [ ] `features/warranty/warranty-card.tsx`
- [ ] `features/warranty/hooks/use-warranty-actions.ts`
- [ ] `features/warranty/components/warranty-products-detail-table.tsx`
- [ ] `features/warranty/components/sections/warranty-transaction-item.tsx`
- [ ] `features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx`
- [ ] `features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx`
- [ ] `features/warranty/components/cards/warranty-payment-history-card.tsx`
- [ ] `features/warranty/components/cards/warranty-summary-card.tsx`

#### Suppliers
- [ ] `features/suppliers/trash-page.tsx`
- [ ] `features/suppliers/trash-columns.tsx`
- [ ] `features/suppliers/form-page.tsx`
- [ ] `features/suppliers/detail-page.tsx`

#### Tasks
- [ ] `features/tasks/page.tsx`
- [ ] `features/tasks/columns.tsx`
- [ ] `features/tasks/detail-page.tsx`
- [ ] `features/tasks/task-form-page.tsx`
- [ ] `features/tasks/calendar-view.tsx`
- [ ] `features/tasks/recurring-page.tsx`
- [ ] `features/tasks/task-card.tsx`
- [ ] `features/tasks/templates-page.tsx`
- [ ] `features/tasks/user-tasks-page.tsx`

#### Purchase Orders
- [ ] `features/purchase-orders/page.tsx`
- [ ] `features/purchase-orders/columns.tsx`
- [ ] `features/purchase-orders/detail-page.tsx`
- [ ] `features/purchase-orders/form-page.tsx`
- [ ] `features/purchase-orders/components/product-selection-card.tsx`
- [ ] `features/purchase-orders/components/payment-item.tsx`

#### Purchase Returns
- [ ] `features/purchase-returns/page.tsx`
- [ ] `features/purchase-returns/form-page.tsx`
- [ ] `features/purchase-returns/detail-page.tsx`

#### Sales Returns
- [ ] `features/sales-returns/page.tsx`
- [ ] `features/sales-returns/form-page.tsx`
- [ ] `features/sales-returns/detail-page.tsx`
- [ ] `features/sales-returns/columns.tsx`

---

### 🟡 Priority 3 - Secondary Features

#### Inventory
- [ ] `features/inventory-receipts/page.tsx`
- [ ] `features/inventory-receipts/detail-page.tsx`
- [ ] `features/inventory-checks/page.tsx`
- [ ] `features/inventory-checks/detail-page.tsx`
- [ ] `features/inventory-checks/form-page.tsx`

#### Stock
- [ ] `features/stock-transfers/page.tsx`
- [ ] `features/stock-transfers/columns.tsx`
- [ ] `features/stock-transfers/stock-transfer-card.tsx`
- [ ] `features/stock-transfers/form-page.tsx`
- [ ] `features/stock-transfers/edit-page.tsx`
- [ ] `features/stock-transfers/detail-page.tsx`
- [ ] `features/stock-history/columns.tsx`

#### Shipments
- [ ] `features/shipments/page.tsx`
- [ ] `features/shipments/columns.tsx`
- [ ] `features/shipments/detail-page.tsx`

#### Packaging
- [ ] `features/packaging/page.tsx`
- [ ] `features/packaging/columns.tsx`
- [ ] `features/packaging/detail-page.tsx`

#### Payments & Receipts
- [ ] `features/payments/page.tsx`
- [ ] `features/payments/form-page.tsx`
- [ ] `features/payments/detail-page.tsx`
- [ ] `features/payments/payment-form.tsx`
- [ ] `features/receipts/page.tsx`
- [ ] `features/receipts/form-page.tsx`
- [ ] `features/receipts/detail-page.tsx`
- [ ] `features/receipts/receipt-form.tsx`

#### Payroll
- [ ] `features/payroll/list-page.tsx`
- [ ] `features/payroll/run-page.tsx`
- [ ] `features/payroll/detail-page.tsx`
- [ ] `features/payroll/template-page-redirect.tsx`
- [ ] `features/payroll/components/batch-card.tsx`
- [ ] `features/payroll/components/batch-mobile-card.tsx`
- [ ] `features/payroll/components/batch-columns.tsx`
- [ ] `features/payroll/components/payslip-columns.tsx`
- [ ] `features/payroll/components/payslip-data-table.tsx`

#### Leaves
- [ ] `features/leaves/page.tsx`
- [ ] `features/leaves/detail-page.tsx`

#### Categories & Brands
- [ ] `features/categories/page.tsx`
- [ ] `features/categories/category-new.tsx`
- [ ] `features/categories/category-detail.tsx`
- [ ] `features/brands/brand-new.tsx`

#### Cost Adjustments
- [ ] `features/cost-adjustments/columns.tsx`
- [ ] `features/cost-adjustments/cost-adjustment-card.tsx`
- [ ] `features/cost-adjustments/form-page.tsx`
- [ ] `features/cost-adjustments/detail-page.tsx`

#### Cashbook
- [ ] `features/cashbook/reports-page.tsx`

#### Reconciliation
- [ ] `features/reconciliation/columns.tsx`

---

### 🟢 Priority 4 - Settings & Reports

#### Settings
- [ ] `features/settings/system/id-counter-settings-page.tsx`
- [ ] `features/settings/shipping/partner-connections.tsx`
- [ ] `features/settings/shipping/partner-detail-page.tsx`
- [ ] `features/settings/penalties/page.tsx`
- [ ] `features/settings/penalties/detail-page.tsx`
- [ ] `features/settings/penalties/penalty-form-page.tsx`
- [ ] `features/settings/penalties/penalty-card.tsx`
- [ ] `features/settings/pkgx/components/product-mapping-tab.tsx`
- [ ] `features/settings/departments/page.tsx`
- [ ] `features/settings/departments/department-form-page.tsx`
- [ ] `features/settings/departments/organization-chart/page.tsx`
- [ ] `features/settings/employees/employee-settings-page.tsx`

#### Reports
- [ ] `features/reports/index-page.tsx`
- [ ] `features/reports/inventory-report/columns.tsx`
- [ ] `features/reports/product-sla-report/columns.tsx`
- [ ] `features/reports/customer-sla-report/columns.tsx`
- [ ] `features/reports/business-activity/pages/sales-time-report.tsx`

#### Wiki
- [ ] `wiki/page.tsx`
- [ ] `features/wiki/page.tsx`
- [ ] `features/wiki/form-page.tsx`
- [ ] `features/wiki/detail-page.tsx`

#### Shared
- [ ] `features/shared/import-export-history-page.tsx`

---

### ⚪ Priority 5 - Test Files (Cần refactor)

- [ ] `features/settings/sales/__tests__/sales-config-page.test.tsx` - Uses `MemoryRouter`
- [ ] `features/payroll/__tests__/run-page.test.tsx` - Uses `MemoryRouter`
- [ ] `features/employees/__tests__/employee-form-page-loop.test.tsx` - Uses `MemoryRouter`
- [ ] `features/customers/__tests__/customers-page-persistence.test.tsx` - Uses `MemoryRouter`
- [ ] `features/customers/__tests__/customers-page-loop.test.tsx` - Uses `MemoryRouter`

---

## 📝 Notes

1. **Type Import**: Khi component nhận `router` làm prop, dùng type:
   ```typescript
   import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
   ```

2. **Link Component**: Thay `to` bằng `href`:
   ```typescript
   // Old
   import { Link } from '@/lib/next-compat';
   <Link to="/path">...</Link>
   
   // New
   import Link from 'next/link';
   <Link href="/path">...</Link>
   ```

3. **useSearchParams**: Next.js `useSearchParams()` trả về `ReadonlyURLSearchParams`, không có setter. Nếu cần set, dùng `router.push()` với query string.

4. **Test Files**: Các file test dùng `MemoryRouter` cần được viết lại hoặc mock Next.js router.

---

## 📊 Progress Tracker

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Core Pages | ~35 | 15 | ~20 |
| Feature Pages | ~50 | 0 | ~50 |
| Secondary Features | ~40 | 0 | ~40 |
| Settings & Reports | ~20 | 0 | ~20 |
| Test Files | 5 | 0 | 5 |
| **Total** | **~150** | **15** | **~135** |

