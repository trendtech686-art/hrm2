# HRM2 Migration Checklist - Tiêu chuẩn 100%

## 📋 Tổng quan

Tài liệu này liệt kê tất cả các vấn đề cần fix để đạt chuẩn 100% cho dự án HRM2.

**Thống kê:**
- 🔴 Data Fetching (Zustand → React Query): ~45 pages
- 🟡 CSS `border rounded-lg` thiếu `border-border`: ~55 files  
- 🟡 CSS `border-dashed` thiếu `border-border`: ~40 files
- 🟡 CSS `border-b/t/l/r` thiếu `border-border`: Nhiều files

---

## 🔴 1. DATA FETCHING: Zustand → React Query

### Vấn đề
- Các page dùng `findById` từ Zustand store không load data vì store rỗng khi chưa fetch từ API
- Cần chuyển sang dùng React Query hooks để fetch data trực tiếp từ API

### Các file cần migrate

#### ✅ ĐÃ FIX
- [x] `features/employees/components/employee-form-page.tsx` - Đã dùng `useEmployee()`

#### ❌ CẦN FIX (45 pages)

**Module Employees:**
- [ ] `features/employees/components/detail-page.tsx` - Dùng `useEmployee()` thay `findById`

**Module Customers:**
- [ ] `features/customers/customer-form-page.tsx` - Dùng `useCustomer()` thay `findById`
- [ ] `features/customers/detail-page.tsx` - Dùng `useCustomer()` thay `findById`

**Module Products:**
- [ ] `features/products/form-page.tsx` - Dùng `useProduct()` thay `findById`
- [ ] `features/products/detail-page.tsx` - Dùng `useProduct()` thay `findById`

**Module Orders:**
- [ ] `features/orders/components/order-form-page.tsx` - Dùng `useOrder()` thay `findById`
- [ ] `features/orders/components/order-detail-page.tsx` - Dùng `useOrder()` thay `findById`

**Module Suppliers:**
- [ ] `features/suppliers/form-page.tsx` - Dùng `useSupplier()` thay `findById`
- [ ] `features/suppliers/detail-page.tsx` - Dùng `useSupplier()` thay `findById`

**Module Tasks:**
- [ ] `features/tasks/components/task-form-page.tsx` - Dùng `useTask()` thay `findById`
- [ ] `features/tasks/components/detail-page.tsx` - Dùng `useTask()` thay `findById`

**Module Wiki:**
- [ ] `features/wiki/form-page.tsx` - Dùng `useWikiArticle()` thay `findById`
- [ ] `features/wiki/detail-page.tsx` - Dùng `useWikiArticle()` thay `findById`

**Module Warranty:**
- [ ] `features/warranty/warranty-form-page.tsx` - Dùng `useWarrantyTicket()` thay `findById`
- [ ] `features/warranty/warranty-detail-page.tsx` - Dùng `useWarrantyTicket()` thay `findById`

**Module Complaints:**
- [ ] `features/complaints/components/form-page.tsx` - Dùng `useComplaint()` thay `findById`
- [ ] `features/complaints/components/detail-page.tsx` - Dùng `useComplaint()` thay `findById`

**Module Inventory:**
- [ ] `features/inventory-checks/form-page.tsx` - Dùng hook thay `findById`
- [ ] `features/inventory-checks/detail-page.tsx` - Dùng hook thay `findById`
- [ ] `features/inventory-receipts/detail-page.tsx` - Dùng hook thay `findById`

**Module Stock Transfers:**
- [ ] `features/stock-transfers/detail-page.tsx` - Dùng hook thay `findById`
- [ ] `features/stock-transfers/components/edit-page.tsx` - Dùng hook thay `findById`
- [ ] `features/stock-transfers/components/detail-page.tsx` - Dùng hook thay `findById`

**Module Purchase:**
- [ ] `features/purchase-orders/form-page.tsx` - Dùng hook thay `findById`
- [ ] `features/purchase-orders/detail-page.tsx` - Dùng hook thay `findById`
- [ ] `features/purchase-returns/form-page.tsx` - Dùng hook thay `findById`
- [ ] `features/purchase-returns/detail-page.tsx` - Dùng hook thay `findById`

**Module Sales:**
- [ ] `features/sales-returns/form-page.tsx` - Dùng hook thay `findById`
- [ ] `features/sales-returns/detail-page.tsx` - Dùng hook thay `findById`

**Module Finance:**
- [ ] `features/payments/form-page.tsx` - Dùng hook thay `findById`
- [ ] `features/payments/detail-page.tsx` - Dùng hook thay `findById`
- [ ] `features/receipts/form-page.tsx` - Dùng hook thay `findById`
- [ ] `features/receipts/detail-page.tsx` - Dùng hook thay `findById`

**Module Settings:**
- [ ] `features/settings/penalties/penalty-form-page.tsx` - Dùng hook thay `findById`
- [ ] `features/settings/penalties/detail-page.tsx` - Dùng hook thay `findById`
- [ ] `features/settings/departments/department-form-page.tsx` - Dùng hook thay `findById`

**Module Other:**
- [ ] `features/leaves/components/detail-page.tsx` - Dùng hook thay `findById`
- [ ] `features/payroll/detail-page.tsx` - Dùng hook thay `findById`
- [ ] `features/shipments/detail-page.tsx` - Dùng hook thay `findById`
- [ ] `features/packaging/detail-page.tsx` - Dùng hook thay `findById`
- [ ] `features/cost-adjustments/detail-page.tsx` - Dùng hook thay `findById`
- [ ] `features/brands/brand-detail.tsx` - Dùng hook thay `findById`
- [ ] `features/categories/category-detail.tsx` - Dùng hook thay `findById`

### Pattern chuẩn sau khi migrate

```tsx
// ❌ SAI - Dùng Zustand store
const { findById, persistence } = useEmployeeStore();
const employee = findById(systemId);

// ✅ ĐÚNG - Dùng React Query
const { data: employee, isLoading } = useEmployee(systemId);
const { create, update } = useEmployeeMutations();
```

---

## 🟡 2. CSS BORDER: Thiếu `border-border`

### Vấn đề
- Dùng `border` class mà không có `border-border` sẽ không hiện border đúng màu theo theme

### Các file cần fix (~55 files)

#### ✅ ĐÃ FIX
- [x] `features/employees/components/employee-form.tsx` - Section địa chỉ
- [x] `features/employees/components/EmployeeAddressesTab.tsx`
- [x] `features/employees/components/employee-documents-tab.tsx`
- [x] `components/ui/new-documents-upload.tsx`

#### ❌ CẦN FIX - `border rounded-*` thiếu `border-border`

**Module Features:**
- [ ] `features/warranty/components/warranty-products-section.tsx:229`
- [ ] `features/warranty/components/sections/warranty-transaction-groups.tsx:54`
- [ ] `features/tasks/components/field-management-page.tsx:290`
- [ ] `features/shared/product-selection-dialog.tsx:392`
- [ ] `features/settings/websites/website-seo-fields.tsx:190`
- [ ] `features/settings/trendtech/components/log-tab.tsx:95`
- [ ] `features/settings/shipping/components/account-list.tsx:154`
- [ ] `features/settings/printer/print-templates-page.tsx:1328`
- [ ] `features/settings/pkgx/components/category-list-tab.tsx:91`
- [ ] `features/settings/pkgx/components/brand-list-tab.tsx:91`
- [ ] `features/settings/other/email-template-tab.tsx:504`
- [ ] `features/settings/penalties/penalty-types-settings-content.tsx:191`
- [ ] `features/settings/employees/employee-roles-page.tsx:320,481`
- [ ] `features/settings/employees/payroll-templates-settings-content.tsx:249`
- [ ] `features/settings/employees/employee-settings-page.tsx:255,330,458,510`
- [ ] `features/settings/complaints/complaints-settings-page.tsx:751`
- [ ] `features/sales-returns/form-page.tsx:833`
- [ ] `features/purchase-orders/components/bulk-product-selector-dialog.tsx:167`
- [ ] `features/purchase-returns/form-page.tsx:577`
- [ ] `features/purchase-returns/detail-page.tsx:273`
- [ ] `features/purchase-orders/components/product-selection-card.tsx:473`
- [ ] `features/purchase-orders/components/payment-item.tsx:40`
- [ ] `features/purchase-orders/detail-page.tsx:1102`
- [ ] `features/purchase-orders/detail/inventory-receipt-detail-view.tsx:25`
- [ ] `features/purchase-orders/detail/purchase-return-detail-view.tsx:69`
- [ ] `features/customers/components/alert-list-box.tsx:23`
- [ ] `features/customers/components/filter-list-box.tsx:19`
- [ ] `features/customers/components/sla-status-card.tsx:212,299,316`
- [ ] `features/orders/detail/return-history-tab.tsx:246,392`
- [ ] `features/orders/components/order-detail-page.tsx:1465,1481`
- [ ] `features/orders/components/packaging-info.tsx:420`
- [ ] `features/orders/components/payment-info.tsx:144`
- [ ] `features/orders/components/line-items-table.tsx:567`
- [ ] `features/orders/components/customer-address-selector.tsx:359,382,416`
- [ ] `features/orders/components/shipping/shipping-partner-card.tsx:51`
- [ ] `features/orders/components/shipping/shipping-partner-selector.tsx:319`
- [ ] `features/inventory-checks/form-page.tsx:687`
- [ ] `features/employees/components/employee-documents.tsx:318,388,458`
- [ ] `features/complaints/components/complaint-compensation-section.tsx:131`
- [ ] `features/complaints/components/complaint-verified-incorrect-section.tsx:58`
- [ ] `features/complaints/components/form-page.tsx:942`
- [ ] `features/complaints/components/public-tracking-page.tsx:543`
- [ ] `features/complaints/components/complaint-affected-products.tsx:53`

**Components:**
- [ ] `components/shared/read-only-products-table.tsx:193`

### Pattern chuẩn

```tsx
// ❌ SAI
<div className="border rounded-lg">

// ✅ ĐÚNG
<div className="border border-border rounded-lg">
```

---

## 🟡 3. CSS BORDER-B: Thiếu `border-border`

### Vấn đề
- Dùng `border-b` class mà không có `border-border`

#### ✅ ĐÃ FIX
- [x] `features/employees/components/employee-form.tsx` - Headers section

#### ❌ CẦN FIX

Tìm kiếm pattern: `border-b ` và kiểm tra có `border-border` chưa

### Pattern chuẩn

```tsx
// ❌ SAI
<h4 className="border-b pb-2">Title</h4>

// ✅ ĐÚNG  
<h4 className="border-b border-border pb-2">Title</h4>
```

---

## 🟢 4. React Query Hooks - Kiểm tra có sẵn

### Hooks đã có sẵn

| Module | Hook Single | Hook List | Hook Mutations |
|--------|-------------|-----------|----------------|
| Employees | ✅ `useEmployee()` | ✅ `useEmployees()` | ✅ `useEmployeeMutations()` |
| Customers | ✅ `useCustomer()` | ✅ `useCustomers()` | ✅ `useCustomerMutations()` |
| Products | ✅ `useProduct()` | ✅ `useProducts()` | ✅ `useProductMutations()` |
| Orders | ✅ `useOrder()` | ✅ `useOrders()` | ✅ `useOrderMutations()` |
| Suppliers | ✅ `useSupplier()` | ✅ `useSuppliers()` | ✅ `useSupplierMutations()` |
| Tasks | ✅ `useTaskById()` | ✅ `useTasks()` | ✅ `useTaskMutations()` |
| Wiki | ✅ `useWikiById()` | ✅ `useWikiArticles()` | ✅ `useWikiMutations()` |
| Warranty | ✅ `useWarranty()` | ✅ `useWarranties()` | ✅ `useWarrantyMutations()` |
| Complaints | ✅ `useComplaint()` | ✅ `useComplaints()` | ✅ `useComplaintMutations()` |
| Leaves | ✅ `useLeaveById()` | ✅ `useLeaves()` | ✅ `useLeaveMutations()` |
| Payments | ✅ `usePayment()` | ✅ `usePayments()` | ✅ `usePaymentMutations()` |
| Receipts | ✅ `useReceipt()` | ✅ `useReceipts()` | ✅ `useReceiptMutations()` |
| Purchase Orders | ✅ `usePurchaseOrder()` | ✅ `usePurchaseOrders()` | ✅ `usePurchaseOrderMutations()` |
| Purchase Returns | ✅ `usePurchaseReturn()` | ✅ `usePurchaseReturns()` | ✅ `usePurchaseReturnMutations()` |
| Sales Returns | ✅ `useSalesReturn()` | ✅ `useSalesReturns()` | ✅ `useSalesReturnMutations()` |
| Stock Transfers | ✅ `useStockTransfer()` | ✅ `useStockTransfers()` | ✅ `useStockTransferMutations()` |
| Inventory Checks | ✅ `useInventoryCheck()` | ✅ `useInventoryChecks()` | ✅ `useInventoryCheckMutations()` |

---

## 📊 5. Tiêu chí đạt chuẩn 100%

### Data Layer
- [ ] Tất cả form/detail pages dùng React Query hooks
- [ ] Không còn `findById` từ Zustand store trong UI components
- [ ] Zustand chỉ dùng cho client-only state (cart, UI state, drafts)

### CSS/Styling
- [ ] Tất cả `border` class đi kèm `border-border`
- [ ] Tất cả `border-b`, `border-t`, `border-l`, `border-r` đi kèm `border-border`
- [ ] Không còn hardcoded colors (border-gray-200, etc.)

### TypeScript
- [ ] Không có TypeScript errors
- [ ] Strict mode enabled
- [ ] Proper typing cho API responses

### Performance
- [ ] Lazy loading cho heavy components
- [ ] Proper staleTime/gcTime trong React Query
- [ ] Optimistic updates cho mutations

### Code Quality
- [ ] No eslint warnings
- [ ] Consistent naming conventions
- [ ] Proper error handling

---

## 🚀 Ưu tiên migrate

### P0 - Critical (User-facing pages)
1. Employee form/detail
2. Customer form/detail
3. Order form/detail
4. Product form/detail

### P1 - High (Important business flows)
5. Warranty form/detail
6. Complaint form/detail
7. Task form/detail
8. Purchase order form/detail

### P2 - Medium
9. Suppliers
10. Inventory
11. Stock transfers
12. Finance (Payments, Receipts)

### P3 - Low
13. Settings pages
14. Wiki
15. Reports

---

## 📝 Cách migrate một page

### Bước 1: Tìm React Query hook tương ứng
```tsx
// Kiểm tra trong features/[module]/hooks/use-[module].ts
import { useEmployee, useEmployeeMutations } from '../hooks/use-employees';
```

### Bước 2: Thay thế store imports
```diff
- import { useEmployeeStore } from '../store';
+ import { useEmployee, useEmployeeMutations } from '../hooks/use-employees';
```

### Bước 3: Thay thế data fetching
```diff
- const { findById, persistence } = useEmployeeStore();
- const employee = findById(systemId);
+ const { data: employee, isLoading } = useEmployee(systemId);
+ const { create, update } = useEmployeeMutations();
```

### Bước 4: Thêm loading state
```tsx
if (isLoading) {
  return <LoadingSpinner />;
}
```

### Bước 5: Thay thế mutations
```diff
- await persistence.update(systemId, data);
+ await update.mutateAsync({ systemId, data });
```

---

## 📅 Timeline đề xuất

| Tuần | Tasks |
|------|-------|
| Week 1 | P0 - Employee, Customer, Order, Product |
| Week 2 | P1 - Warranty, Complaint, Task, PO |
| Week 3 | P2 - Suppliers, Inventory, Stock, Finance |
| Week 4 | P3 - Settings, Wiki, Reports |
| Week 5 | CSS fixes, Testing, Polish |

---

**Cập nhật lần cuối:** 2026-01-09
