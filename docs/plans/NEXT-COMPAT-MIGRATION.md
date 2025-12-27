# Next-Compat Migration Plan

> **Ngày tạo:** 27/12/2025  
> **Mục tiêu:** Xóa `lib/next-compat.tsx` và migrate sang native Next.js imports  
> **Trạng thái:** 🔄 In Progress

---

## Tổng quan

### Các imports cần migrate

| Import từ next-compat | Thay bằng | Số files | Status |
|----------------------|-----------|----------|--------|
| `Link` | `next/link` | ~20 | ⬜ |
| `useParams` | `next/navigation` | ~15 | ⬜ |
| `useLocation` | `usePathname` + `useSearchParams` | ~3 | ⬜ |
| `useSearchParamsWithSetter` | Move to `lib/hooks/` | ~3 | ⬜ |
| `Navigate` | `redirect()` or `useRouter` | 1 | ⬜ |
| `useNavigate` | Đã migrate → `useRouter` | 0 | ✅ |
| `NavigateFunction` type | `AppRouterInstance` | 1 | ⬜ |
| `* as ReactRouterDOM` | Refactor columns | 3 | ⬜ |
| `MemoryRouter, Routes, Route` | Jest mocking | 2 | ⬜ |

---

## Task 1: Migrate Link imports ⬜

### Pattern
```typescript
// ❌ Trước
import { Link } from '@/lib/next-compat';
<Link to="/path">Text</Link>

// ✅ Sau  
import Link from 'next/link';
<Link href="/path">Text</Link>
```

### Files cần migrate (~20 files)
| File | Status |
|------|--------|
| `features/orders/order-detail-page.tsx` | ⬜ |
| `features/orders/columns.tsx` | ⬜ |
| `features/stock-transfers/detail-page.tsx` | ⬜ |
| `features/stock-transfers/form-page.tsx` | ⬜ |
| `features/sales-returns/detail-page.tsx` | ⬜ |
| `features/sales-returns/columns.tsx` | ⬜ |
| `features/sales-returns/form-page.tsx` | ⬜ |
| `features/inventory-checks/detail-page.tsx` | ⬜ |
| `features/inventory-checks/form-page.tsx` | ⬜ |
| `features/inventory-receipts/detail-page.tsx` | ⬜ |
| `features/cost-adjustments/detail-page.tsx` | ⬜ |
| `features/purchase-returns/detail-page.tsx` | ⬜ |
| `features/customers/detail-page.tsx` | ⬜ |
| `features/customers/page.tsx` | ⬜ |
| `features/purchase-orders/detail-page.tsx` | ⬜ |
| `features/purchase-orders/columns.tsx` | ⬜ |
| `features/settings/penalties/detail-page.tsx` | ⬜ |
| `features/employees/detail-page.tsx` | ⬜ |
| `features/shipments/columns.tsx` | ⬜ |
| `features/shipments/detail-page.tsx` | ⬜ |
| `features/payments/detail-page.tsx` | ⬜ |
| `features/warranty/components/cards/warranty-summary-card.tsx` | ⬜ |
| `features/warranty/components/sections/warranty-transaction-item.tsx` | ⬜ |
| `features/reports/index-page.tsx` | ⬜ |

---

## Task 2: Migrate useParams imports ⬜

### Pattern
```typescript
// ❌ Trước
import { useParams } from '@/lib/next-compat';
const { systemId } = useParams<{ systemId: string }>();

// ✅ Sau (generic không cần thiết với Next.js)
import { useParams } from 'next/navigation';
const params = useParams();
const systemId = params.systemId as string;
```

### Files cần migrate (~15 files)
| File | Status |
|------|--------|
| `features/stock-transfers/detail-page.tsx` | ⬜ |
| `features/sales-returns/detail-page.tsx` | ⬜ |
| `features/sales-returns/form-page.tsx` | ⬜ |
| `features/inventory-checks/detail-page.tsx` | ⬜ |
| `features/inventory-checks/form-page.tsx` | ⬜ |
| `features/inventory-receipts/detail-page.tsx` | ⬜ |
| `features/purchase-returns/detail-page.tsx` | ⬜ |
| `features/purchase-orders/form-page.tsx` | ⬜ |
| `features/purchase-orders/detail-page.tsx` | ⬜ |
| `features/settings/penalties/detail-page.tsx` | ⬜ |
| `features/customers/customer-form-page.tsx` | ⬜ |
| `features/employees/employee-form-page.tsx` | ⬜ |
| `features/receipts/form-page.tsx` | ⬜ |
| `features/payments/form-page.tsx` | ⬜ |
| `features/payments/detail-page.tsx` | ⬜ |
| `features/shipments/detail-page.tsx` | ⬜ |
| `features/settings/departments/department-form-page.tsx` | ⬜ |
| `features/orders/order-form-page.tsx` | ⬜ |
| `features/complaints/detail-page.tsx` | ⬜ |
| `features/complaints/form-page.tsx` | ⬜ |
| `features/products/form-page.tsx` | ⬜ |
| `features/settings/shipping/partner-detail-page.tsx` | ⬜ |
| `features/warranty/warranty-tracking-page.tsx` | ⬜ |

---

## Task 3: Migrate useLocation ⬜

### Pattern
```typescript
// ❌ Trước
import { useLocation } from '@/lib/next-compat';
const location = useLocation();
// location.pathname, location.search

// ✅ Sau
import { usePathname, useSearchParams } from 'next/navigation';
const pathname = usePathname();
const searchParams = useSearchParams();
```

### Files cần migrate (~3 files)
| File | Status |
|------|--------|
| `features/orders/page.tsx` | ⬜ |
| `features/stock-transfers/detail-page.tsx` | ⬜ |
| `features/settings/use-settings-page-header.tsx` | ⬜ |

---

## Task 4: Move useSearchParamsWithSetter ⬜

### Tạo file mới
```typescript
// lib/hooks/use-search-params-setter.ts
'use client';
import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function useSearchParamsWithSetter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const setSearchParams = React.useCallback((
    updater: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)
  ) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    const newParams = typeof updater === 'function' ? updater(currentParams) : updater;
    const search = newParams.toString();
    router.push(search ? `${pathname}?${search}` : pathname);
  }, [searchParams, router, pathname]);
  
  return [searchParams, setSearchParams] as const;
}
```

### Files cần update (~3 files)
| File | Status |
|------|--------|
| `features/purchase-orders/form-page.tsx` | ⬜ |
| `features/orders/order-form-page.tsx` | ⬜ |
| `features/products/form-page.tsx` | ⬜ |

---

## Task 5: Migrate Navigate component ⬜

### Pattern
```typescript
// ❌ Trước
import { Navigate } from '@/lib/next-compat';
return <Navigate to="/path" replace />;

// ✅ Sau (dùng redirect trong Server Component hoặc useEffect)
import { redirect } from 'next/navigation';
// Server: redirect('/path');
// Client: useEffect(() => router.replace('/path'), []);
```

### Files cần migrate (1 file)
| File | Status |
|------|--------|
| `features/payroll/template-page-redirect.tsx` | ⬜ |

---

## Task 6: Migrate NavigateFunction type ⬜

### Pattern
```typescript
// ❌ Trước
import type { NavigateFunction } from '@/lib/next-compat';

// ✅ Sau
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
// Hoặc dùng ReturnType<typeof useRouter>
```

### Files cần migrate (1 file)
| File | Status |
|------|--------|
| `features/warranty/hooks/use-warranty-actions.ts` | ⬜ |

---

## Task 7: Refactor ReactRouterDOM imports ⬜

### Pattern
```typescript
// ❌ Trước
import * as ReactRouterDOM from '@/lib/next-compat';
// Sử dụng cho columns Link

// ✅ Sau - Import trực tiếp
import Link from 'next/link';
```

### Files cần migrate (3 files)
| File | Status |
|------|--------|
| `features/cost-adjustments/columns.tsx` | ⬜ |
| `features/tasks/columns.tsx` | ⬜ |
| `features/stock-history/columns.tsx` | ⬜ |

---

## Task 8: Update test files ⬜

### Pattern
```typescript
// ❌ Trước
import { MemoryRouter, Routes, Route } from '@/lib/next-compat';

// ✅ Sau - Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/test',
  useParams: () => ({}),
}));
```

### Files cần migrate (2 files)
| File | Status |
|------|--------|
| `features/payroll/__tests__/run-page.test.tsx` | ⬜ |
| `features/settings/sales/__tests__/sales-config-page.test.tsx` | ⬜ |

---

## Task 9: Xóa lib/next-compat.tsx ⬜

Sau khi hoàn thành tất cả tasks trên, xóa file `lib/next-compat.tsx`.

---

## Commands hữu ích

```powershell
# Tìm files còn dùng next-compat
grep -r "from '@/lib/next-compat'" features/ components/

# Đếm số files
grep -rl "from '@/lib/next-compat'" features/ | Measure-Object

# Type check
npx tsc --noEmit
```

---

## Log thay đổi

### 27/12/2025 - Session 1
- 📝 Tạo file migration plan này
- 📊 Audit: ~50 files cần migrate
