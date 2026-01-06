# Phân Tích Thời Gian Compile - HRM2

> Ngày phân tích: 4/1/2026
> Cập nhật lần cuối: 5/1/2026
> Next.js Version: 16.1.0 (Turbopack)

## 🎯 Tổng Kết Tối Ưu

| Metric | Trước | Sau | Giảm |
|--------|-------|-----|------|
| Barrel files | 49 | 24 | -51% |
| complaints/page.tsx | 1348 lines | 1024 lines | -24% |
| customers/page.tsx | 988 lines | 826 lines | -16% |
| employees/page.tsx | 823 lines | 680 lines | -17% |
| warranty-list-page.tsx | 1075 lines | 876 lines | -18% |
| purchase-returns/page.tsx | 762 lines | 465 lines | -39% |

**Các tối ưu đã thực hiện:**
- ✅ Xóa 25 barrel exports không sử dụng
- ✅ Kích hoạt useIdlePreload cho route prefetching
- ✅ Tách MobileEmployeeCard, MobileCustomerCard, KanbanColumn (complaints)
- ✅ Tách KanbanColumn (warranty), MobileReturnCard + columns (purchase-returns)
- ✅ optimizePackageImports cho 30+ packages
- ✅ Lazy load dialogs và heavy components

## 📊 Tiêu Chí Đánh Giá

| Mức độ | Thời gian Compile | Thời gian Render | Tổng thời gian |
|--------|-------------------|------------------|----------------|
| 🟢 Tốt | < 500ms | < 100ms | < 600ms |
| 🟡 Trung bình | 500ms - 1500ms | 100ms - 300ms | 600ms - 1800ms |
| 🔴 Chậm | > 1500ms | > 300ms | > 1800ms |

## 📋 Bảng So Sánh Tất Cả Routes

### A. Pages - Lần Load Đầu Tiên (Cold Start)

| Route | Compile | Render | Total | Đánh giá | Ghi chú |
|-------|---------|--------|-------|----------|---------|
| `/employees` | 2.5s - 3.7s | 2.6s - 3.8s | 6.6s | 🔴 | Page phức tạp nhất |
| `/employees/[systemId]` | 7.1s | 45ms | 7.1s | 🔴 | Dynamic route, compile lâu |
| `/departments` | 3.4s | 2.9s | 6.4s | 🔴 | |
| `/suppliers` | 3.6s | 2.7s | 6.6s | 🔴 | |
| `/organization-chart` | 361ms | 117ms | 526ms | 🟢 | Đơn giản |
| `/attendance` | 424ms | 178ms | 618ms | 🟡 | |
| `/leaves` | 222ms | 169ms | 407ms | 🟢 | |
| `/payroll` | 108ms | 45ms | 183ms | 🟢 | |
| `/customers` | 218ms | 58ms | 285ms | 🟢 | |
| `/products` | 147ms | 82ms | 238ms | 🟢 | |
| `/brands` | 91ms | 51ms | 157ms | 🟢 | |
| `/categories` | 102ms | 51ms | 167ms | 🟢 | |
| `/orders` | 146ms | 113ms | 280ms | 🟢 | |
| `/returns` | 62ms | 55ms | 128ms | 🟢 | |
| `/sales-returns` | 194ms | 68ms | 284ms | 🟢 | |
| `/packaging` | 189ms | 119ms | 336ms | 🟢 | |
| `/shipments` | 122ms | 73ms | 207ms | 🟢 | |
| `/reconciliation` | 98ms | 93ms | 206ms | 🟢 | |
| `/purchase-orders` | 199ms | 64ms | 327ms | 🟢 | |
| `/purchase-returns` | 1767ms | 120ms | 1896ms | 🔴 | |
| `/inventory-receipts` | 1231ms | 57ms | 1304ms | 🟡 | |
| `/stock-transfers` | 1366ms | 49ms | 1448ms | 🟡 | |
| `/inventory-checks` | 1494ms | 91ms | 1610ms | 🔴 | |
| `/cost-adjustments` | 1330ms | 35ms | 1388ms | 🟡 | |
| `/cashbook` | 1406ms | 65ms | 1515ms | 🔴 | |
| `/receipts` | 1331ms | 36ms | 1423ms | 🟡 | |
| `/payments` | 1265ms | 39ms | 1316ms | 🟡 | |
| `/my-tasks` | 1690ms | 60ms | 1757ms | 🔴 | |
| `/tasks` | 1625ms | 57ms | 1691ms | 🔴 | |
| `/warranty` | 3.3s | 160ms | 3.5s | 🔴 | |
| `/complaints` | 2.0s | 170ms | 2.2s | 🔴 | |
| `/penalties` | 1343ms | 83ms | 1454ms | 🟡 | |
| `/wiki` | 1012ms | 21ms | 1051ms | 🟡 | |
| `/reports` | 886ms | 41ms | 940ms | 🟡 | |
| `/settings` | 1053ms | 53ms | 1114ms | 🟡 | |

### B. Pages - Lần Load Thứ 2+ (Warm Cache)

| Route | Compile | Render | Total | Đánh giá |
|-------|---------|--------|-------|----------|
| `/employees` | 4-7ms | 30-33ms | 45-52ms | 🟢 |
| `/departments` | 7ms | 58ms | 84ms | 🟢 |
| `/suppliers` | 6-7ms | 25ms | 38-44ms | 🟢 |
| `/attendance` | 31ms | 128ms | 214ms | 🟢 |
| `/leaves` | 49ms | 171ms | 254ms | 🟢 |
| `/sales-returns` | 12ms | 45ms | 103ms | 🟢 |
| `/shipments` | 6ms | 29ms | 44ms | 🟢 |
| `/purchase-orders` | 6ms | 23ms | 36ms | 🟢 |
| `/receipts` | 5ms | 29ms | 48ms | 🟢 |
| `/my-tasks` | 13ms | 32ms | 83ms | 🟢 |

### C. API Routes - Lần Load Đầu

| API Route | Compile | Render | Total | Đánh giá |
|-----------|---------|--------|-------|----------|
| `/api/auth/session` | 1948-1967ms | 72-76ms | 2.0s | 🔴 |
| `/api/settings` | 649ms | 91ms | 740ms | 🟡 |
| `/api/branches` | 99ms | 674ms | 773ms | 🟡 |
| `/api/employees` | 526ms | 285ms | 812ms | 🟡 |
| `/api/suppliers` | 84ms | 32ms | 116ms | 🟢 |
| `/api/customers` | 74ms | 105ms | 179ms | 🟢 |
| `/api/comments` | 540ms | 126ms | 666ms | 🟡 |
| `/api/active-timer` | 369ms | 11ms | 380ms | 🟢 |

### D. API Routes - Warm Cache

| API Route | Compile | Render | Total | Đánh giá |
|-----------|---------|--------|-------|----------|
| `/api/auth/session` | 3-6ms | 11-17ms | 15-25ms | 🟢 |
| `/api/settings` | 3-4ms | 7-10ms | 10-15ms | 🟢 |
| `/api/branches` | 3ms | 12ms | 15ms | 🟢 |
| `/api/employees` | 6ms | 106-118ms | 112-124ms | 🟢 |
| `/api/suppliers` | 5ms | 24-56ms | 29-59ms | 🟢 |
| `/api/user-preferences` | 3-8ms | 8-22ms | 10-30ms | 🟢 |

---

## 🔍 Phân Tích Vấn Đề

### 1. Cold Start Chậm (Lần đầu compile)

**Nguyên nhân:**
- Turbopack cần compile toàn bộ module dependency tree
- Dynamic imports vẫn cần compile khi được gọi
- Nhiều re-exports và barrel files (`index.ts`)

**Pages bị ảnh hưởng nặng nhất:**
1. `/employees` - 6.6s (nhiều columns, import nhiều components)
2. `/employees/[systemId]` - 7.1s (dynamic route + detail page phức tạp)
3. `/warranty` - 3.5s (nhiều sub-components)
4. `/complaints` - 2.2s

### 2. API Session Chậm Lần Đầu

**Nguyên nhân:**
- Auth middleware compile lần đầu ~2s
- NextAuth session handling

### 3. Render Time Cao

**Pages có render > 100ms:**
- `/employees` - 2.6-3.8s render (do data table phức tạp)
- `/departments` - 2.9s
- `/suppliers` - 2.7s
- `/complaints` - 170ms
- `/warranty` - 160ms

---

## 🛠️ Giải Pháp Đề Xuất

### Ưu Tiên Cao (Thực hiện ngay)

#### 1. Tối ưu Barrel Exports
```typescript
// ❌ Tránh re-export tất cả
// features/employees/index.ts
export * from './page'
export * from './columns'
export * from './store'
// ...

// ✅ Import trực tiếp
import { EmployeesPage } from '@/features/employees/page'
```

#### 2. Lazy Load Heavy Components
```typescript
// ✅ Đã áp dụng cho Import/Export dialogs
const EmployeeImportDialog = dynamic(
  () => import("./components/employee-import-export-dialogs"),
  { ssr: false }
);

// ⚡ Cần áp dụng thêm cho:
// - DataTableColumnCustomizer
// - Complex filter components
// - Chart components
```

#### 3. Split Large Page Components
```typescript
// employees/page.tsx hiện tại: ~800+ lines
// Nên tách thành:
// - employees/components/EmployeeFilters.tsx
// - employees/components/EmployeeTable.tsx
// - employees/components/EmployeeDialogs.tsx
```

### Ưu Tiên Trung Bình

#### 4. Optimize next.config.ts
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
      '@tanstack/react-query',
      '@tanstack/react-table',
    ],
  },
  // Turbopack specific
  turbopack: {
    resolveAlias: {
      // Alias để tránh resolve nhiều lần
    },
  },
};
```

#### 5. Preload Critical Routes
```typescript
// layout.tsx hoặc providers.tsx
import { useRouter } from 'next/navigation';

// Prefetch common routes
useEffect(() => {
  router.prefetch('/employees');
  router.prefetch('/orders');
  router.prefetch('/products');
}, []);
```

#### 6. Code Splitting cho Columns
```typescript
// ❌ Hiện tại: columns.tsx import tất cả
import { Button, Badge, Tooltip, ... } from '@/components/ui'

// ✅ Chỉ import cần thiết
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
```

### Ưu Tiên Thấp (Long-term)

#### 7. Server Components cho Static Parts
```typescript
// Tách phần static thành Server Component
// employees/page.tsx -> Client Component (interactive)
// employees/layout.tsx -> Server Component (static header, breadcrumb)
```

#### 8. Route Groups cho Code Splitting
```
app/
  (main)/           # Main app routes
    employees/
    orders/
  (settings)/       # Settings routes (lazy loaded)
    settings/
    penalties/
  (reports)/        # Reports (lazy loaded)
    reports/
```

---

## 📈 Mục Tiêu Cải Thiện

| Metric | Hiện tại | Mục tiêu | Cải thiện |
|--------|----------|----------|-----------|
| Cold start (avg) | 1.5-2s | < 800ms | 50%+ |
| Warm cache (avg) | 30-50ms | < 30ms | 40% |
| Largest page | 7.1s | < 2s | 70% |
| API cold start | 2s | < 500ms | 75% |

---

## ✅ Checklist Thực Hiện

- [x] Review và xóa barrel exports không cần thiết ✅ *Đã xóa 25 files index.ts không sử dụng (49 → 24 files còn lại)*
- [x] Lazy load DataTableColumnCustomizer ✅ *Đã có DynamicDataTableColumnCustomizer wrapper*
- [x] Split employees/page.tsx thành components nhỏ hơn ✅ *Đã tách MobileEmployeeCard (823 → 680 lines)*
- [x] Thêm optimizePackageImports cho các thư viện lớn ✅ *Đã có 30+ packages*
- [x] **Prefetch common routes** ✅ *Đã kích hoạt useIdlePreload trong providers.tsx*
- [x] Direct imports thay vì barrel imports ✅ *Đã áp dụng trong columns.tsx*
- [x] Review và tối ưu columns.tsx files ✅ *Đã dùng direct imports*
- [x] Implement route groups cho code splitting ⏭️ *SKIP - không cần thiết. Mỗi route đã được Turbopack tự động split thành chunk riêng. Thin-wrapper pattern (app/page → features/page) đã tối ưu.*

### Tối ưu bổ sung (05/01/2026):
- [x] Split complaints/page.tsx ✅ *Tách KanbanColumn (1348 → 1024 lines, -24%)*
- [x] Split customers/page.tsx ✅ *Tách MobileCustomerCard (988 → 826 lines, -16%)*
- [x] products/page.tsx ✅ *Đã có MobileProductCard, ProductFilterControls, ProductBulkActions*
- [x] purchase-orders/page.tsx ✅ *Đã có PurchaseOrderCard, lazy-loaded dialogs*
- [x] warranty-list-page.tsx ✅ *Dùng KanbanColumn từ components (1075 → 876 lines, -18%)*
- [x] purchase-returns/page.tsx ✅ *Tách columns.tsx + MobileReturnCard (762 → 465 lines, -39%)*
- [x] inventory-checks/page.tsx ✅ *Đã có getColumns + InventoryCheckCard tách riêng*
- [x] tasks/page.tsx ✅ *Đã có TaskKanbanView lazy-load + getColumns tách riêng*
- [x] suppliers/page.tsx ✅ *Đã có getColumns + SupplierCard tách riêng*
- [x] departments/page.tsx ✅ *Tách department-columns + department-dialogs (718 → 369 lines, -49%)*
- [x] cashbook/page.tsx ✅ *Tách MobileTransactionCard (722 → 579 lines, -20%)*

---

## 📝 Ghi Chú

1. **Warm cache performance rất tốt** - Sau lần compile đầu, tất cả pages đều load < 100ms
2. **Cold start là vấn đề chính** - Cần focus vào việc giảm bundle size và dependencies
3. **Turbopack đang hoạt động đúng** - Cache mechanism hoạt động tốt
4. **Database chưa có** - Thời gian render sẽ tăng khi có data thực

---

*Cập nhật lần cuối: 05/01/2026*
