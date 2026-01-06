# Compile Time Optimization Audit

> Last Updated: January 3, 2026

## 📊 Overview

This document tracks the compile time optimization progress across all feature pages in the HRM2 project.

## ✅ Completed Optimizations

### List Pages (page.tsx) - Import/Export Dialogs

| Feature | Status | Dynamic Import | Before | After | Notes |
|---------|--------|----------------|--------|-------|-------|
| products | ✅ Done | Yes | 25s | 1.1s | Dialogs + Config + PKGX API |
| orders | ✅ Done | Yes | 5s | ~1s | 3 dialogs + 2 configs |
| purchase-orders | ✅ Done | Yes | 5s | ~1s | 2 dialogs + config |
| customers | ✅ Done | Yes | - | - | 2 dialogs + config |
| payments | ✅ Done | Yes | - | - | 2 dialogs + config |
| receipts | ✅ Done | Yes | - | - | 2 dialogs + config |
| employees | ✅ Done | Yes | - | - | 2 dialogs + config |
| brands | ✅ Done | Yes | - | - | 2 dialogs + config |
| categories | ✅ Done | Yes | - | - | 2 dialogs + config |
| suppliers | ✅ Done | Yes | - | - | 2 dialogs + config |
| inventory-checks | ✅ Done | Yes | - | - | 2 dialogs + config |
| inventory-receipts | ✅ Done | Yes | - | - | Export dialog + config |
| packaging | ✅ Done | Yes | - | - | Export dialog + config |
| shipments | ✅ Done | Yes | - | - | Export dialog + config |
| stock-transfers | ✅ Done | Yes | - | - | 2 dialogs + config |
| sales-returns | ✅ Done | Yes | - | - | Export dialog + config |
| purchase-returns | ✅ Done | Yes | - | - | Export dialog + config |
| reconciliation | ✅ Done | Yes | - | - | Export dialog + config |
| cost-adjustments | ✅ Done | Yes | - | - | 2 dialogs + config |
| leaves | ✅ Done | Yes | - | - | Basic optimization |

### Direct XLSX Imports - Lazy Loaded

| File | Status | Location | Notes |
|------|--------|----------|-------|
| attendance/page.tsx | ✅ Done | `handleExport` | Dynamic import in async handler |
| settings/provinces/page.tsx | ✅ Done | `handleImport`, `handleExport` | Both handlers async |
| employees/components/detail-page.tsx | ✅ Done | 5 export functions | Created `exportToExcel` helper |
| reports/business-activity/report-header-actions.tsx | ✅ Done | `handleExportExcel` | Async handler |
| attendance/components/attendance-import-dialog.tsx | ✅ Done | Template + Process file | Both handlers async |
| lib/import-export/attendance-parser.ts | ✅ Done | `parseAttendanceFile` | Lazy load XLSX |
| components/shared/generic-export-dialog-v2.tsx | ✅ Done | `handleExport` | Lazy load XLSX |
| components/shared/generic-import-dialog-v2.tsx | ✅ Done | `parseFileForPreview` | Lazy load XLSX |

### Recharts Dynamic Import (~200KB)

| File | Status | Wrapper | Notes |
|------|--------|---------|-------|
| components/ui/chart.tsx | ✅ Done | dynamic-charts.tsx | Base chart components |
| features/dashboard/page.tsx | ✅ Done | - | Uses DynamicChartBar/Line/Pie |
| features/settings/previews/dashboard.tsx | ✅ Done | - | Uses DynamicChartBar |
| features/reports/business-activity/report-chart.tsx | ✅ Done | dynamic-report-chart.tsx | Report charts |
| features/reports/*/page.tsx (5 pages) | ✅ Done | - | Uses DynamicReportChart |
| features/cashbook/reports-page.tsx | ✅ Done | dynamic-reports-page.tsx | Entire page lazy loaded |

### Fuse.js Lazy Loading (~25KB)

All page files now use `useFuseFilter` hook from `hooks/use-fuse-search.ts` for lazy-loaded Fuse.js search.

| Feature | Status | Notes |
|---------|--------|-------|
| wiki/page.tsx | ✅ Done | useFuseFilter |
| warranty/warranty-list-page.tsx | ✅ Done | useFuseFilter |
| tasks/page.tsx | ✅ Done | useFuseFilter |
| receipts/page.tsx | ✅ Done | useFuseFilter |
| payments/page.tsx | ✅ Done | useFuseFilter |
| suppliers/page.tsx | ✅ Done | useFuseFilter |
| stock-transfers/page.tsx | ✅ Done | useFuseFilter |
| shipments/page.tsx | ✅ Done | useFuseFilter |
| sales-returns/page.tsx | ✅ Done | useFuseFilter |
| leaves/page.tsx | ✅ Done | useFuseFilter |
| settings/penalties/page.tsx | ✅ Done | useFuseFilter |
| settings/provinces/page.tsx | ✅ Done | useFuseFilter (3 instances) |
| reconciliation/page.tsx | ✅ Done | useFuseFilter |
| payroll/template-page.tsx | ✅ Done | useFuseFilter |
| settings/job-titles/page-content.tsx | ✅ Done | useFuseFilter |
| settings/employees/payroll-templates-settings-content.tsx | ✅ Done | useFuseFilter |
| purchase-returns/page.tsx | ✅ Done | useFuseFilter |
| reports/sales-report/page.tsx | ✅ Done | useFuseFilter |
| reports/customer-sla-report/page.tsx | ✅ Done | useFuseFilter |
| inventory-checks/page.tsx | ✅ Done | useFuseFilter |
| cost-adjustments/page.tsx | ✅ Done | useFuseFilter |
| brands/page.tsx | ✅ Done | useFuseFilter |
| complaints/page.tsx | ✅ Done | useFuseFilter |
| attendance/page.tsx | ✅ Done | useFuseFilter |
| cashbook/page.tsx | ✅ Done | useFuseFilter |
| employees/virtualized-page.tsx | ✅ Done | useFuseFilter |
| components/data-table/related-data-table.tsx | ✅ Done | useFuseFilter |

**Note:** Store files (products/store.ts, customers/store.ts, etc.) still use static Fuse.js import as it's needed at store initialization. This is acceptable since stores are loaded on-demand.

### @dnd-kit Dynamic Import (~50KB)

DataTableColumnCustomizer uses @dnd-kit for drag-and-drop column reordering. All pages now use lazy-loaded wrapper.

| File | Status | Notes |
|------|--------|-------|
| components/data-table/dynamic-column-customizer.tsx | ✅ Done | Wrapper component |
| components/data-table/data-table-actions.tsx | ✅ Done | Uses wrapper |
| components/layout/data-page-layout.tsx | ✅ Done | Uses wrapper |
| components/data-table/related-data-table.tsx | ✅ Done | Uses wrapper |
| features/stock-transfers/page.tsx | ✅ Done | Uses wrapper |
| features/suppliers/page.tsx | ✅ Done | Uses wrapper |
| features/leaves/page.tsx | ✅ Done | Uses wrapper |
| features/reconciliation/page.tsx | ✅ Done | Uses wrapper |
| features/customers/page.tsx | ✅ Done | Uses wrapper |
| features/sales-returns/page.tsx | ✅ Done | Uses wrapper |
| features/settings/penalties/page.tsx | ✅ Done | Uses wrapper |
| features/shipments/page.tsx | ✅ Done | Uses wrapper |
| features/warranty/warranty-list-page.tsx | ✅ Done | Uses wrapper |
| features/tasks/page.tsx | ✅ Done | Uses wrapper |
| features/payments/page.tsx | ✅ Done | Uses wrapper |
| features/payroll/components/payslip-data-table.tsx | ✅ Done | Uses wrapper |
| features/receipts/page.tsx | ✅ Done | Uses wrapper |
| features/purchase-orders/page.tsx | ✅ Done | Uses wrapper |
| features/products/page.tsx | ✅ Done | Uses wrapper |
| features/packaging/page.tsx | ✅ Done | Uses wrapper |
| features/inventory-checks/page.tsx | ✅ Done | Uses wrapper |
| features/orders/page.tsx | ✅ Done | Uses wrapper |
| features/attendance/page.tsx | ✅ Done | Uses wrapper |
| features/employees/page.tsx | ✅ Done | Uses wrapper |
| features/cost-adjustments/page.tsx | ✅ Done | Uses wrapper |
| features/categories/page.tsx | ✅ Done | Uses wrapper |
| features/brands/page.tsx | ✅ Done | Uses wrapper |
| features/complaints/page.tsx | ✅ Done | Uses wrapper |
| features/cashbook/page.tsx | ✅ Done | Uses wrapper |

---

## 🔴 Pending Optimizations

### List Pages Without Dynamic Import (Have Heavy Libraries)

| Feature | Imports | Fuse.js | Print Helper | Heavy Stores | Priority |
|---------|---------|---------|--------------|--------------|----------|
| cashbook | 37 | ✅ Lazy | - | - | Low |
| complaints | 39 | ✅ Lazy | ✅ | - | Medium |
| tasks | 26 | ✅ Lazy | - | - | Low |
| wiki | 12 | ✅ Lazy | - | - | Low |
| settings/penalties | 33 | ✅ Lazy | ✅ | - | Low |
| settings/departments | 27 | - | - | ✅ (2) | Low |
| reports/customer-sla-report | 15 | ✅ Lazy | - | - | Low |
| reports/inventory-report | 16 | ✅ Lazy | - | - | Low |
| reports/product-sla-report | 15 | ✅ Lazy | - | - | Low |
| reports/sales-report | 13 | ✅ Lazy | - | - | Low |

### Shared Components - XLSX Lazy Loaded

| File | Status | Functions | Notes |
|------|--------|-----------|-------|
| components/data-table/related-data-table.tsx | ✅ Done | `handleExportExcel` | Bulk action handler, Fuse.js lazy |
| components/data-table/data-table-export-dialog.tsx | ✅ Done | `handleExport` | Export dialog |
| components/data-table/data-table-import-dialog.tsx | ✅ Done | `parseFileForPreview`, `handleDownloadTemplate` | Import dialog |

### Detail Pages (High Import Count - Need Review)

| Feature | File | Imports | Print Helper | Priority |
|---------|------|---------|--------------|----------|
| orders | order-detail-page.tsx | 77 | - | 🔴 HIGH |
| orders/components | order-detail-page.tsx | 59 | - | 🔴 HIGH |
| products | detail-page.tsx | 53 | - | 🔴 HIGH |
| purchase-orders | detail-page.tsx | 51 | ✅ (5) | 🔴 HIGH |
| employees/components | detail-page.tsx | 50 | ✅ (4) | ✅ DONE (XLSX lazy) |
| customers | detail-page.tsx | 49 | - | 🟡 MEDIUM |
| orders/components | order-form-page.tsx | 48 | - | 🟡 MEDIUM |
| complaints/components | detail-page.tsx | 47 | ✅ | 🟡 MEDIUM |
| sales-returns | form-page.tsx | 45 | - | 🟡 MEDIUM |
| complaints/components | form-page.tsx | 40 | - | Low |
| warranty | warranty-detail-page.tsx | 38 | ✅ | Low |
| stock-transfers | detail-page.tsx (both) | 37 | ✅ | Low |
| sales-returns | detail-page.tsx | 35 | ✅ (3) | Low |
| cost-adjustments | detail-page.tsx | 34 | ✅ | Low |
| payroll | detail-page.tsx | 32 | ✅ (2) | Low |
| purchase-returns | detail-page.tsx | 32 | ✅ | Low |
| packaging | detail-page.tsx | 31 | ✅ | Low |
| shipments | detail-page.tsx | 31 | ✅ | Low |

---

## 🎯 Optimization Strategies

### 1. Dynamic Import for Heavy Components
```tsx
const HeavyComponent = dynamic(
  () => import("./heavy-component").then(mod => ({ default: mod.HeavyComponent })),
  { ssr: false }
);
```

### 2. Lazy Load Print Helpers
```tsx
const handlePrint = async () => {
  const { printOrder } = await import("../../lib/print/order-print-helper");
  printOrder(data);
};
```

### 3. Lazy Load XLSX Library (~500KB)
```tsx
// BAD - static import loads 500KB on every page visit
import * as XLSX from 'xlsx';

// GOOD - lazy load only when needed
const handleExport = async () => {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();
  // ...
};
```

### 4. Move Dialog Components to Wrapper Files
- Create `[feature]/components/[feature]-import-export-dialogs.tsx`
- Encapsulate GenericImportDialogV2, GenericExportDialogV2, and config
- Dynamic import the wrapper from page.tsx

### 4. Lazy Load Fuse.js Search
```tsx
const performSearch = async (items: T[], query: string) => {
  const Fuse = (await import("fuse.js")).default;
  const fuse = new Fuse(items, options);
  return fuse.search(query);
};
```

---

## 📈 Metrics

### Before Optimization
| Route | Cold Compile | Hot Compile |
|-------|-------------|-------------|
| /products | 25s | 5s |
| /orders | 5s | 2s |
| /purchase-orders | 5s | 2s |

### After Optimization
| Route | Cold Compile | Hot Compile | Improvement |
|-------|-------------|-------------|-------------|
| /products | 3.5s | 1.1s | **96% faster** |
| /orders | ~2s | ~1s | **80% faster** |
| /purchase-orders | ~2s | ~1s | **80% faster** |

---

## 📝 Implementation Checklist

### Phase 1: List Pages (COMPLETED ✅)
- [x] Products page - dynamic import dialogs + config
- [x] Orders page - dynamic import dialogs + configs
- [x] Purchase-orders page
- [x] Customers page
- [x] Payments page
- [x] Receipts page
- [x] Employees page
- [x] Brands page
- [x] Categories page
- [x] Suppliers page
- [x] Inventory-checks page
- [x] Inventory-receipts page
- [x] Packaging page
- [x] Shipments page
- [x] Stock-transfers page
- [x] Sales-returns page
- [x] Purchase-returns page
- [x] Reconciliation page
- [x] Cost-adjustments page

### Phase 2: Heavy Libraries Lazy Loading (COMPLETED ✅)
- [x] XLSX library (~500KB) - Lazy loaded in all export/import handlers
- [x] Recharts library (~200KB) - Dynamic import via wrapper components
- [x] Fuse.js library (~25KB) - useFuseFilter hook for all page searches
- [x] @dnd-kit library (~50KB) - DynamicDataTableColumnCustomizer wrapper

### Phase 3: Detail Pages (COMPLETED ✅)

| File | Optimizations | Status |
|------|---------------|--------|
| orders/order-detail-page.tsx | ShippingIntegration, ShippingTrackingTab, OrderWorkflowCard, ActivityHistory, Comments → dynamic; Print mappers → lazy | ✅ Done |
| products/detail-page.tsx | EcommerceTab, ActivityHistory, Comments → dynamic; Print mapper → lazy | ✅ Done |
| purchase-orders/detail-page.tsx | ActivityHistory, Comments → dynamic; 5 print helpers → lazy | ✅ Done |
| customers/detail-page.tsx | ActivityHistory, Comments → dynamic | ✅ Done |

**Components lazy loaded:**
- ActivityHistory, Comments - Used in detail pages, only shown in tabs
- ShippingIntegration, ShippingTrackingTab - Shipping-related (orders)
- OrderWorkflowCard - Workflow visualization (orders)
- EcommerceTab - E-commerce settings (products)

**Print helpers lazy loaded:**
- mapSalesReturnToPrintData, mapPaymentToPrintData (orders)
- mapProductToLabelPrintData (products)  
- mapPurchaseOrderToPrintData, mapStockInToPrintData, mapSupplierReturnToPrintData, mapPaymentToPrintData, mapReceiptToPrintData (purchase-orders)

---

## 📊 Bundle Size Savings (Estimated)

| Library | Size | Files Affected | Status |
|---------|------|----------------|--------|
| XLSX | ~500KB | 8 files | ✅ Lazy loaded |
| Recharts | ~200KB | 10+ files | ✅ Dynamic import |
| Fuse.js | ~25KB | 27+ files | ✅ useFuseFilter hook |
| @dnd-kit | ~50KB | 29 files | ✅ Dynamic wrapper |
| Import/Export configs | ~100KB | 20+ files | ✅ Bundled with dialogs |
| Print helpers | ~50KB | 4 detail pages | ✅ Lazy loaded |
| Heavy components | ~30KB | 4 detail pages | ✅ Dynamic import |

**Total Initial Bundle Reduction: ~955KB** (code-split, loaded on-demand)

---

## 🔧 Files Created for Optimization

### Import/Export Dialog Wrappers
```
features/
├── products/components/product-import-export-dialogs.tsx
├── orders/components/order-import-export-dialogs.tsx
├── purchase-orders/components/purchase-order-import-export-dialogs.tsx
├── customers/components/customer-import-export-dialogs.tsx
├── payments/components/payment-import-export-dialogs.tsx
├── receipts/components/receipt-import-export-dialogs.tsx
├── employees/components/employee-import-export-dialogs.tsx
├── brands/components/brand-import-export-dialogs.tsx
├── categories/components/category-import-export-dialogs.tsx
├── suppliers/components/supplier-import-export-dialogs.tsx
├── inventory-checks/components/inventory-check-import-export-dialogs.tsx
├── inventory-receipts/components/inventory-receipt-import-export-dialogs.tsx
├── packaging/components/packaging-import-export-dialogs.tsx
├── shipments/components/shipment-import-export-dialogs.tsx
├── stock-transfers/components/stock-transfer-import-export-dialogs.tsx
├── sales-returns/components/sales-return-import-export-dialogs.tsx
├── purchase-returns/components/purchase-return-import-export-dialogs.tsx
├── reconciliation/components/reconciliation-import-export-dialogs.tsx
└── cost-adjustments/components/cost-adjustment-import-export-dialogs.tsx
```

---

## 📌 Notes

1. **XLSX Library (~500KB)** - Main culprit for slow imports. Always lazy load.
2. **Fuse.js** - Used for client-side search. Can be lazy loaded when search is triggered.
3. **Print Helpers** - Can be lazy loaded when print button is clicked.
4. **Import/Export Configs (500-1200 lines)** - Should be bundled with dialog wrappers.

---

## 🚀 Next Steps

1. **Review top 5 detail pages** with highest imports for optimization opportunities
2. **Consider code splitting** for order-detail-page.tsx (77 imports!)
3. **Audit print helpers** usage and implement lazy loading
4. **Test production build** to verify bundle size improvements

---

## 🔬 Deep Analysis: High-Import Files

### orders/order-detail-page.tsx (77 imports, 3214 lines)

**Problem:** This file is a monolith that imports from many different features.

**Import Categories:**
| Category | Count | Examples |
|----------|-------|----------|
| UI Components | ~25 | Card, Button, Table, Dialog, Alert |
| Feature Stores | ~15 | useOrderStore, useCustomerStore, useWarrantyStore |
| Hooks | ~10 | useAllCustomers, useEmployeeFinder, useComments |
| Print/Mappers | ~5 | usePrint, mapSalesReturnToPrintData |
| Dialogs | ~6 | CancelShipmentDialog, DeliveryFailureDialog |
| Utils | ~10 | formatDate, cn, asSystemId |

**Optimization Opportunities:**
1. **Dynamic import dialogs** - CancelShipmentDialog, CancelPackagingDialog, DeliveryFailureDialog
2. **Lazy load print functions** - Only load when user clicks print
3. **Split into sub-components** - Break down 3214 lines into smaller files
4. **Move rarely-used stores** - useWarrantyStore, useComplaintStore only needed for specific views

**Recommended Actions:**
```tsx
// Before
import { CancelShipmentDialog } from './components/cancel-shipment-dialog';

// After - Dynamic import
const CancelShipmentDialog = dynamic(
  () => import('./components/cancel-shipment-dialog').then(m => ({ default: m.CancelShipmentDialog })),
  { ssr: false }
);
```

### products/detail-page.tsx (53 imports)

Similar pattern - can benefit from:
- Dynamic import for print dialogs
- Lazy loading PKGX-related components
- Splitting tabs into separate components

---

## 📊 Bundle Size Impact

### Estimated Savings from Dynamic Imports

| Library/Module | Size | Status |
|----------------|------|--------|
| XLSX (xlsx) | ~500KB | ✅ Lazy loaded in all pages |
| Recharts | ~200KB | ✅ Dynamic import via wrappers |
| Fuse.js | ~25KB | ✅ Lazy loaded via useFuseFilter hook |
| Print Helpers | ~50KB | ❌ Static in detail pages |
| Import/Export Configs | ~100KB total | ✅ Lazy loaded with dialogs |
| PKGX API Service | ~20KB | ✅ Lazy loaded in products |

**Total Estimated Savings:** ~825KB from initial bundle
