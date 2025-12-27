# 📚 Hướng dẫn Router, Breadcrumb & Page Header System (Updated 2025)

## 🎯 Tổng quan hệ thống

Hệ thống routing được thiết kế với 3 layer chính:

### **Layer 1: Route Definitions** (`lib/route-definitions.tsx`)
- 87 routes với metadata đầy đủ
- **KHÔNG lazy loading** - tất cả 72 pages đều direct import
- Metadata: title, description, breadcrumb cho mỗi route

### **Layer 2: Breadcrumb System** (`lib/breadcrumb-system.ts`)
- Auto-generate breadcrumb từ URL path
- Smart context injection (tên nhân viên, mã đơn hàng, etc.)
- PATH_PATTERNS mapping cho 85+ routes

### **Layer 3: Page Header Context** (`contexts/page-header-context.tsx`)
- Global state cho page header (title, actions, breadcrumb)
- Hook `usePageHeader()` để override từ component
- Automatic cleanup khi unmount

---

## 📁 1. Router System Architecture

### File Structure

```
lib/
├── router.ts                   # Route paths constants (ROUTES)
├── route-definitions.tsx       # Route config + components (NO LAZY)
├── breadcrumb-system.ts        # Breadcrumb generator
└── router-provider.tsx         # React Router setup

contexts/
└── page-header-context.tsx     # Page header state

hooks/
├── use-route-meta.ts          # Get route metadata
└── use-route-prefetch.ts      # Prefetch (disabled, legacy)
```

---

## 🔀 2. Route Definitions (lib/route-definitions.tsx)

### Current State (sau khi bỏ lazy loading)

```typescript
// ========================================
// === DIRECT IMPORTS (All 72 pages) ===
// ========================================

// Dashboard
import { DashboardPage } from '../features/dashboard/page';

// HRM Module (12 pages)
import { EmployeesPage } from '../features/employees/page';
import { EmployeeDetailPage } from '../features/employees/detail-page';
import { EmployeeFormPage } from '../features/employees/employee-form-page';
import { EmployeesTrashPage } from '../features/employees/trash-page';
import { DepartmentsPage } from '../features/departments/page';
import { PayrollPage } from '../features/payroll/page';
import { AttendancePage } from '../features/attendance/page';
import { LeavesPage } from '../features/leaves/page';
import { LeaveDetailPage } from '../features/leaves/detail-page';
import { KPIPage } from '../features/kpi/page';
import { HRMPage } from '../features/hrm/page';

// Sales Module (15 pages)
import { CustomersPage } from '../features/customers/page';
import { CustomerDetailPage } from '../features/customers/detail-page';
import { CustomerFormPage } from '../features/customers/form-page';
import { ProductsPage } from '../features/products/page';
import { ProductDetailPage } from '../features/products/detail-page';
import { ProductFormPage } from '../features/products/form-page';
import { OrdersPage } from '../features/orders/page';
import { OrderDetailPage } from '../features/orders/detail-page';
import { OrderFormPage } from '../features/orders/form-page';
import { SalesReturnsPage } from '../features/sales-returns/page';
import { SalesReturnDetailPage } from '../features/sales-returns/detail-page';
import { SalesReturnFormPage } from '../features/sales-returns/form-page';

// Procurement Module (10 pages)
import { SuppliersPage } from '../features/suppliers/page';
import { SupplierDetailPage } from '../features/suppliers/detail-page';
import { SupplierFormPage } from '../features/suppliers/form-page';
import { PurchaseOrdersPage } from '../features/purchase-orders/page';
import { PurchaseOrderDetailPage } from '../features/purchase-orders/detail-page';
import { PurchaseOrderFormPage } from '../features/purchase-orders/form-page';
import { PurchaseReturnsPage } from '../features/purchase-returns/page';
import { PurchaseReturnFormPage } from '../features/purchase-returns/form-page';
import { InventoryReceiptsPage } from '../features/inventory-receipts/page';

// Finance Module (8 pages)
import { CashbookPage } from '../features/cashbook/page';
import { ReceiptsPage } from '../features/receipts/page';
import { ReceiptFormPage } from '../features/receipts/form-page';
import { PaymentsPage } from '../features/payments/page';
import { PaymentFormPage } from '../features/payments/form-page';
import { VouchersPage } from '../features/vouchers/page';

// Internal Operations (10 pages)
import { PackagingPage } from '../features/packaging/page';
import { ShipmentsPage } from '../features/shipments/page';
import { ReconciliationPage } from '../features/reconciliation/page';
import { TasksWarrantyPage } from '../features/tasks-warranty/page';
import { TaskWarrantyDetailPage } from '../features/tasks-warranty/detail-page';
import { InternalTasksPage } from '../features/internal-tasks/page';
import { ComplaintsPage } from '../features/complaints/page';
import { ComplaintDetailPage } from '../features/complaints/detail-page';
import { PenaltiesPage } from '../features/penalties/page';
import { PenaltyDetailPage } from '../features/penalties/detail-page';
import { DutySchedulePage } from '../features/duty-schedule/page';

// Wiki (3 pages)
import { WikiPage } from '../features/wiki/page';
import { WikiFormPage } from '../features/wiki/form-page';
import { WikiDetailPage } from '../features/wiki/detail-page';

// Reports (2 pages)
import { SalesReportPage } from '../features/reports/sales-report/page';
import { InventoryReportPage } from '../features/reports/inventory-report/page';

// Settings (15 pages)
import { SettingsPage } from '../features/settings/page';
import { AppearancePage } from '../features/settings/appearance-page';
import { StoreInfoPage } from '../features/settings/store-info-page';
import { ProvincesPage } from '../features/provinces/page';
import { EmployeeSettingsPage } from '../features/employees/settings/employee-settings-page';
import { PricingSettingsPage } from '../features/pricing-settings/page';
import { PaymentSettingsPage } from '../features/settings/payment-settings-page';
import { InventorySettingsPage } from '../features/inventory-settings/page';
import { StockLocationsPage } from '../features/stock-locations/page';
import { ShippingPartnersPage } from '../features/shipping-partners/page';
import { SalesConfigPage } from '../features/settings/sales-config-page';
import { ImportExportHistoryPage } from '../features/shared/import-export-history-page';
import { PlaceholderPage } from '../components/layout/placeholder-page';
import { TestTrashPage } from '../features/employees/test-trash-page';
import { EmployeesTrashPage } from '../features/employees/trash-page';

// ========================================
// === ROUTE DEFINITIONS (87 routes) ===
// ========================================

export const routeDefinitions: AppRoute[] = [
  // Root redirect
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
    title: 'Home',
  },
  
  // Dashboard
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
    title: 'Dashboard',
    description: 'Tổng quan hệ thống',
    breadcrumb: [
      { label: 'Trang chủ', href: '/dashboard', isCurrent: true }
    ]
  },

  // === HRM MODULE (12 routes) ===
  {
    path: ROUTES.EMPLOYEES,
    element: <EmployeesPage />,
    title: 'Danh sách nhân viên',
    description: 'Quản lý thông tin nhân viên',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '', isCurrent: true }
    ]
  },
  {
    path: ROUTES.EMPLOYEES_DETAIL,
    element: <EmployeeDetailPage />,
    title: 'Chi tiết nhân viên',
    description: 'Xem thông tin chi tiết nhân viên',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
      { label: 'Chi tiết', href: '', isCurrent: true }
    ]
  },
  // ... 85+ more routes
];
```

### ⚠️ Key Changes từ trước đến nay:

| Aspect | Before | After (Current) |
|--------|--------|-----------------|
| **Lazy Loading** | `React.lazy()` cho 20 pages | ❌ REMOVED - All direct imports |
| **Load Time** | 2-3s delay | ✅ Instant (0s) |
| **Bundle Size** | Smaller chunks | Larger initial (~1.2MB) |
| **Prefetch** | useRoutePrefetch() active | Disabled (không cần nữa) |
| **Total Pages** | 72 pages | 72 pages (all direct) |

---

## 🍞 3. Breadcrumb System (lib/breadcrumb-system.ts)

### Architecture

```typescript
// 1. Module Definitions (MODULES object)
export const MODULES = {
  HRM: {
    key: 'hrm',
    name: 'HRM',
    sections: {
      EMPLOYEES: {
        key: 'employees',
        name: 'Nhân viên',
        list: { title: 'Danh sách nhân viên' },
        detail: { title: (name) => name ? `Hồ sơ ${name}` : 'Chi tiết' },
        edit: { title: (name) => name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa' },
        new: { title: 'Thêm nhân viên mới' }
      },
      // ... more sections
    }
  },
  SALES: { ... },
  PROCUREMENT: { ... },
  FINANCE: { ... },
  // ... 8 modules total
};

// 2. Path Patterns (PATH_PATTERNS object)
const PATH_PATTERNS = {
  '/employees': { module: 'HRM', section: 'EMPLOYEES', action: 'list' },
  '/employees/new': { module: 'HRM', section: 'EMPLOYEES', action: 'new' },
  '/employees/:id': { module: 'HRM', section: 'EMPLOYEES', action: 'detail' },
  '/employees/:id/edit': { module: 'HRM', section: 'EMPLOYEES', action: 'edit' },
  // ... 85+ patterns
};

// 3. Breadcrumb Generator
export function generateBreadcrumb(
  pathname: string, 
  context?: Record<string, any>
): BreadcrumbItem[] {
  // Match URL → PATH_PATTERNS
  // Extract module, section, action
  // Build breadcrumb array with context injection
}
```

### Breadcrumb Examples

#### Example 1: List Page (Automatic)
```typescript
// URL: /employees
// Result:
[
  { label: 'Trang chủ', href: '/dashboard' },
  { label: 'Nhân viên', href: '/employees', isCurrent: true }
]
```

#### Example 2: Detail Page (với context)
```typescript
// URL: /employees/NV027
// Context: { fullName: 'Bùi My' }
// Result:
[
  { label: 'Trang chủ', href: '/dashboard' },
  { label: 'Nhân viên', href: '/employees' },
  { label: 'Bùi My', href: '/employees/NV027', isParam: true, isCurrent: true }
]
```

#### Example 3: Edit Page (với context + clickable detail)
```typescript
// URL: /employees/NV027/edit
// Context: { fullName: 'Bùi My' }
// Result:
[
  { label: 'Trang chủ', href: '/dashboard' },
  { label: 'Nhân viên', href: '/employees' },
  { label: 'Bùi My', href: '/employees/NV027', isParam: true }, // ← Clickable!
  { label: 'Chỉnh sửa', href: '/employees/NV027/edit', isCurrent: true }
]
```

---

## 🎨 4. Page Header Context

### Usage Pattern

```typescript
import { usePageHeader } from '../../contexts/page-header-context';

function EmployeeDetailPage() {
  const { systemId } = useParams();
  const employee = useEmployeeStore().findById(systemId);

  // Override breadcrumb with dynamic context
  usePageHeader({
    title: employee ? `Chi tiết: ${employee.fullName}` : 'Chi tiết nhân viên',
    subtitle: employee ? `Mã: ${employee.id}` : undefined,
    breadcrumb: employee ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
      { label: employee.fullName, href: '', isCurrent: true }
    ] : undefined,
    actions: [
      <Button key="back" onClick={() => navigate('/employees')}>
        Quay lại
      </Button>,
      <Button key="edit" onClick={() => navigate(`/employees/${systemId}/edit`)}>
        Chỉnh sửa
      </Button>
    ]
  });

  return <div>...</div>;
}
```

### API Reference

```typescript
interface PageHeaderConfig {
  title?: string;              // Page title
  subtitle?: string;           // Subtitle (mã code, trạng thái, etc.)
  breadcrumb?: BreadcrumbItem[]; // Override breadcrumb
  actions?: React.ReactNode[]; // Action buttons (Edit, Delete, etc.)
  context?: Record<string, any>; // Context data for breadcrumb
}

function usePageHeader(config: PageHeaderConfig): void;
```

---

## 📋 5. Best Practices

### ✅ DO

```typescript
// ✅ 1. Override breadcrumb cho detail/edit pages
usePageHeader({
  breadcrumb: [
    { label: 'Trang chủ', href: '/', isCurrent: false },
    { label: 'Nhân viên', href: '/employees', isCurrent: false },
    { label: employee.fullName, href: '', isCurrent: true }
  ]
});

// ✅ 2. Thêm actions vào header
usePageHeader({
  actions: [
    <Button key="back" onClick={() => navigate(-1)}>Quay lại</Button>,
    <Button key="save" onClick={handleSave}>Lưu</Button>
  ]
});

// ✅ 3. Dynamic title với context
usePageHeader({
  title: order ? `Đơn hàng ${order.code}` : 'Chi tiết đơn hàng',
  subtitle: order?.customerName
});
```

### ❌ DON'T

```typescript
// ❌ 1. Không dùng lazy loading (đã bỏ hết rồi)
const MyPage = React.lazy(() => import('./my-page'));

// ❌ 2. Không hardcode breadcrumb trong route-definitions
// Hãy dùng PATH_PATTERNS trong breadcrumb-system.ts

// ❌ 3. Không override breadcrumb cho list pages
// List pages tự động generate đúng rồi
```

---

## 🔧 6. Maintenance Guide

### Thêm route mới (Step-by-step)

**Step 1: Thêm path vào `lib/router.ts`**
```typescript
export const ROUTES = {
  // ... existing routes
  MY_NEW_PAGE: '/my-new-page',
  MY_NEW_PAGE_DETAIL: '/my-new-page/:id',
};
```

**Step 2: Thêm component import vào `lib/route-definitions.tsx`**
```typescript
// Direct import (NO lazy loading!)
import { MyNewPage } from '../features/my-feature/page';
import { MyNewDetailPage } from '../features/my-feature/detail-page';
```

**Step 3: Thêm route definition**
```typescript
export const routeDefinitions: AppRoute[] = [
  // ... existing routes
  {
    path: ROUTES.MY_NEW_PAGE,
    element: <MyNewPage />,
    title: 'My New Page',
    description: 'Description for my new page',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'My New Page', href: '', isCurrent: true }
    ]
  },
  {
    path: ROUTES.MY_NEW_PAGE_DETAIL,
    element: <MyNewDetailPage />,
    title: 'Chi tiết',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'My New Page', href: '/my-new-page', isCurrent: false },
      { label: 'Chi tiết', href: '', isCurrent: true }
    ]
  },
];
```

**Step 4: Thêm PATH_PATTERNS vào `lib/breadcrumb-system.ts`**
```typescript
const PATH_PATTERNS = {
  // ... existing patterns
  '/my-new-page': { module: 'MY_MODULE', section: 'MY_SECTION', action: 'list' },
  '/my-new-page/:id': { module: 'MY_MODULE', section: 'MY_SECTION', action: 'detail' },
};
```

**Step 5: (Optional) Thêm vào sidebar**
```typescript
// components/layout/sidebar.tsx
{
  title: 'My New Page',
  icon: <Icon />,
  href: '/my-new-page',
}
```

---

## 🚨 7. Common Issues & Solutions

### Issue 1: Breadcrumb không đúng

**Problem:** Breadcrumb hiển thị "Chi tiết" thay vì tên thực
```typescript
// Wrong result:
// Trang chủ > Nhân viên > Chi tiết
```

**Solution:** Override breadcrumb trong component
```typescript
usePageHeader({
  breadcrumb: [
    { label: 'Trang chủ', href: '/', isCurrent: false },
    { label: 'Nhân viên', href: '/employees', isCurrent: false },
    { label: employee.fullName, href: '', isCurrent: true } // ← Add dynamic name
  ]
});
```

### Issue 2: Page load chậm

**Problem:** Trang bị delay 2-3s khi navigate

**Solution:** Đã fix - tất cả pages giờ dùng direct import
```typescript
// ❌ Old (slow):
const MyPage = React.lazy(() => import('./my-page'));

// ✅ New (instant):
import { MyPage } from './my-page';
```

### Issue 3: Route 404

**Problem:** Navigate tới route nhưng bị 404

**Checklist:**
1. ✅ Đã add path vào `lib/router.ts`?
2. ✅ Đã import component trong `lib/route-definitions.tsx`?
3. ✅ Đã add route definition với element?
4. ✅ Path có đúng format không? (slash đầu, params với `:`)

### Issue 4: Sidebar link sai URL

**Problem:** Click sidebar nhưng URL sai

**Example:** Sales Returns
```typescript
// ❌ Wrong: /sales-returns (old URL)
// ✅ Correct: /returns (current URL in route-definitions)

// Fix in sidebar.tsx:
{
  title: 'Trả hàng',
  href: '/returns', // ← Đúng URL
}
```

---

## 📊 8. System Statistics

### Current State (Updated 2025)

| Metric | Value |
|--------|-------|
| Total Routes | 87 |
| Total Pages | 72 |
| Lazy Loaded | 0 (removed all) |
| Direct Imports | 72 (100%) |
| Modules | 8 (HRM, Sales, Procurement, Finance, Inventory, Internal, Reports, Settings) |
| PATH_PATTERNS | 85+ |
| Load Time | Instant (0s) |
| Bundle Size | ~1.2MB initial |

### Module Breakdown

| Module | Routes | Pages |
|--------|--------|-------|
| HRM | 12 | 11 |
| Sales | 18 | 15 |
| Procurement | 12 | 10 |
| Finance | 8 | 6 |
| Internal Operations | 15 | 10 |
| Settings | 17 | 15 |
| Reports | 2 | 2 |
| Wiki | 3 | 3 |

---

## 🎓 9. Migration History

### v1 → v2 (Performance Optimization)

**Changes:**
1. ❌ Removed ALL lazy loading (72 pages)
2. ✅ Added direct imports for instant navigation
3. ❌ Disabled prefetch hooks (no longer needed)
4. ✅ Fixed sales returns URL: `/sales-returns` → `/returns`
5. ✅ Reorganized sidebar menu (removed duplicate items)
6. ✅ Added "Nhật ký hệ thống" to Settings page

**Impact:**
- Initial bundle: +400KB (~30% larger)
- Navigation speed: 2-3s → 0s (instant)
- User experience: ⭐⭐⭐ → ⭐⭐⭐⭐⭐

---

## 📖 10. References

### Key Files

- **lib/router.ts** - Route paths constants
- **lib/route-definitions.tsx** - Route config (87 routes, 72 pages)
- **lib/breadcrumb-system.ts** - Breadcrumb generator (MODULES, PATH_PATTERNS)
- **contexts/page-header-context.tsx** - Page header state
- **hooks/use-route-meta.ts** - Get route metadata
- **components/layout/sidebar.tsx** - Navigation menu

### Related Docs

- [Header Layout Guide](./header-layout-guide.md)
- [How to Add New Page](./how-to-add-new-page.md)
- [Route Prefetching Guide](./route-prefetching-guide.md) *(Legacy - disabled)*

---

**Last Updated:** October 25, 2025  
**Status:** ✅ Current & Accurate  
**Maintainer:** Development Team
