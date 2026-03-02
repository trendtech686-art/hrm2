# Tiêu Chí Đánh Giá Chất Lượng Module

> Ngày tạo: 05/01/2026
> Cập nhật: 01/03/2026
> Phiên bản: 2.1
> Áp dụng cho: HRM2 Next.js 16 + Turbopack + Prisma 7

## 📋 Mục Lục

1. [Tiêu chí Feature Module](#1-tiêu-chí-feature-module)
2. [Tiêu chí Server-Side Data](#2-tiêu-chí-server-side-data)
3. [Tiêu chí API Routes](#3-tiêu-chí-api-routes)
4. [Tiêu chí Prisma/Database](#4-tiêu-chí-prismadatabase)
5. [Tiêu chí Hooks](#5-tiêu-chí-hooks)
6. [Tiêu chí Components](#6-tiêu-chí-components)
7. [Tiêu chí Types](#7-tiêu-chí-types)
8. [Tiêu chí Store (Zustand — chỉ cho UI State)](#8-tiêu-chí-store-zustand--chỉ-cho-ui-state)
9. [Tiêu chí App Infrastructure](#9-tiêu-chí-app-infrastructure)
10. [Tiêu chí Cấu Trúc Thư Mục](#10-tiêu-chí-cấu-trúc-thư-mục)
11. [Bảng Điểm Module](#11-bảng-điểm-module)
12. [Definition of Done](#12-definition-of-done)

---

## 1. Tiêu Chí Feature Module

### 1.1 Colocation & Granularity

| Tiêu chí | Mô tả | Ví dụ tốt | Ví dụ xấu |
|----------|-------|-----------|-----------|
| **Thin Page Pattern** | `page.tsx` chỉ điều phối, không chứa logic | `page.tsx` < 300 lines, import `getColumns()` từ file riêng | `page.tsx` > 800 lines với columns inline |
| **Component Atomicity** | Tách Dialog, Drawer, Complex Filter ra luồng render chính | `dynamic(() => import('./AddDialog'))` | Import trực tiếp tất cả dialogs |
| **Single Responsibility** | Mỗi file chỉ làm một việc | `employee-filters.tsx`, `employee-table.tsx` riêng biệt | `page.tsx` chứa cả filters, table, dialogs |
| **Direct Import** | Import trực tiếp, **KHÔNG barrel exports** | `import { Button } from '@/components/ui/button'` | `import { Button } from '@/components/ui'` |

> ⚠️ **Direct Import Rule** — Barrel files (`index.ts`) gây **chậm Turbopack compile**.
>
> ```typescript
> // ❌ Barrel import (chậm ~2s)
> import { Button, Input, Dialog } from '@/components/ui'
>
> // ✅ Direct import (nhanh ~200ms)
> import { Button } from '@/components/ui/button'
> import { Input } from '@/components/ui/input'
> import { Dialog } from '@/components/ui/dialog'
> ```

**Cấu trúc folder chuẩn:**
```
features/[module]/
├── api/                    # API handlers (client-side)
├── components/             # UI components riêng
├── hooks/                  # Custom hooks
│   ├── use-[module].ts          # React Query hook
│   └── use-[module]-actions.ts  # Action handlers
├── columns.tsx             # Table columns definition
├── types.ts                # TypeScript interfaces
├── validation.ts           # Zod schemas
└── page.tsx                # Entry point - thin wrapper
```

### 1.2 Server-First

| Tiêu chí | Mô tả |
|----------|-------|
| **Server Components cho Layout** | Không có `'use client'` ở layout |
| **Client Components ở "lá"** | Chỉ `'use client'` cho buttons, forms, interactive |
| **Minimize Client Bundle** | Dynamic imports, tree shaking |
| **Suspense Wrapper** | Wrap page content với `<Suspense fallback={<TableSkeleton />}>` |
| **force-dynamic** | `export const dynamic = 'force-dynamic'` cho pages có server data |
| **initialStats** | Server fetch stats → pass prop initialStats cho feature component |

**Pattern chuẩn — Advanced Page (BẮT BUỘC cho list pages có stats):**
```tsx
// app/(authenticated)/employees/page.tsx - Server Component
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { EmployeesPage } from '@/features/employees/page'
import { getEmployeeStats } from '@/lib/data/employees'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = { title: 'Nhân viên' }
export const dynamic = 'force-dynamic'

async function EmployeesPageWithData() {
  const initialStats = await getEmployeeStats()
  return <EmployeesPage initialStats={initialStats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <EmployeesPageWithData />
    </Suspense>
  )
}
```

**Pattern — Simple Page (cho pages không cần server stats):**
```tsx
// app/(authenticated)/brands/page.tsx
import type { Metadata } from 'next'
import { BrandsPage } from '@/features/brands/page'

export const metadata: Metadata = { title: 'Thương hiệu' }
export default function Page() { return <BrandsPage /> }
```

**Pattern — Detail Page (dùng `generateMetadata` cho dynamic title):**
```tsx
// app/(authenticated)/orders/[systemId]/page.tsx
import type { Metadata } from 'next'

type Props = { params: Promise<{ systemId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { systemId } = await params
  return { title: `Đơn hàng ${systemId}` }
}

export default async function Page({ params }: Props) {
  const { systemId } = await params
  return <OrderDetailPage systemId={systemId} />
}
```

### 1.3 Data Management

| Tiêu chí | Implementation |
|----------|----------------|
| **keepPreviousData** | `placeholderData: keepPreviousData` — tránh flicker |
| **gcTime** | `gcTime: 10 * 60 * 1000` (10 phút) |
| **Optimistic Updates** | `onMutate` với `setQueryData` — UI phản hồi < 50ms |
| **Stale Time** | `staleTime: 30_000` cho list, `60_000` cho detail |
| **fetchAllPages()** | Auto-pagination cho dropdown/select — **BẮT BUỘC** |

> 🚫 **TUYỆT ĐỐI KHÔNG HARDCODE LIMIT**
>
> | Tình huống | ❌ Sai | ✅ Đúng |
> |-----------|--------|--------|
> | Trang danh sách | `useTasks({ limit: 1000 })` | `useTasks({ page, limit: pageSize })` |
> | Dropdown/Select | `useAllEmployees({ limit: 500 })` | `fetchAllPages()` — auto-pagination |
> | Detail page | Load all → `.filter()` | `usePenaltiesByEmployee(id)` — server filter |
> | Thống kê | Load raw → tính client | Server-side aggregation |
>
> **Nguyên tắc:** `limit` hardcode trong hook/API → 🚫 CẤM. `limit` từ UI pagination → ✅ OK.

> 🎯 **fetchAllPages() — `lib/fetch-all-pages.ts`**
>
> ```typescript
> import { fetchAllPages } from '@/lib/fetch-all-pages'
>
> export function useAllEmployees(options?: { enabled?: boolean }) {
>   return useQuery({
>     queryKey: employeeKeys.all,
>     queryFn: () => fetchAllPages((page) => fetchEmployees({ page, limit: 100 })),
>     enabled: options?.enabled ?? true,
>     gcTime: 10 * 60 * 1000,
>     placeholderData: keepPreviousData,
>   })
> }
> ```

> 🎯 **Optimistic Updates (BẮT BUỘC cho xóa, toggle, cập nhật đơn giản)**
>
> | Hành động | Yêu cầu | Phản hồi UI |
> |-----------|---------|-------------|
> | Xóa item | ✅ Bắt buộc | < 50ms |
> | Toggle trạng thái | ✅ Bắt buộc | < 50ms |
> | Cập nhật đơn giản | ✅ Bắt buộc | < 50ms |
> | Tạo mới | ⚠️ Khuyến khích | < 100ms |

### 1.4 Column Layout (DB-Persisted — BẮT BUỘC)

> Column visibility, order, pinning **PHẢI** dùng `useColumnLayout()` (DB-persisted).
> **KHÔNG ĐƯỢC** dùng `useState` cho column visibility/order/pinning.
>
> ```typescript
> import { useColumnLayout } from '@/hooks/use-column-visibility'
>
> const [
>   { visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns },
>   { setVisibility, setOrder, setPinned },
>   isColumnLayoutLoading
> ] = useColumnLayout('module-key', { pinned: ['select', 'actions'] })
>
> <ResponsiveDataTable
>   columnVisibility={columnVisibility}
>   onColumnVisibilityChange={setVisibility}
>   columnOrder={columnOrder}
>   onColumnOrderChange={setOrder}
>   pinnedColumns={pinnedColumns}
>   onPinnedColumnsChange={setPinned}
>   isLoading={isLoading || isColumnLayoutLoading}
> />
> ```
>
> | ❌ Sai | ✅ Đúng |
> |--------|--------|
> | `useState({})` cho columnVisibility | `useColumnLayout('key')` |
> | `localStorage.getItem('columns')` | DB-persisted qua `useColumnLayout` |

### 1.5 Render Performance

| Kỹ thuật | Khi nào dùng |
|----------|--------------|
| **Table Virtualization** | Bảng > 100 rows |
| **useMemo** | Tính toán nặng, derived data |
| **useCallback** | Functions truyền vào child |
| **useDeferredValue** | Search input với filter nặng |
| **React.memo** | Component nhận props ít thay đổi |
| **isLoading prop** | DataTable hiện skeleton khi chưa có data |
| **Dynamic imports** | Dialog, Chart, heavy components |

---

## 2. Tiêu Chí Server-Side Data

### 2.1 Server Actions — `app/actions/*.ts` (BẮT BUỘC)

Mỗi module **PHẢI** có Server Action file cho mutations (create/update/delete).

| Tiêu chí | Mô tả |
|----------|-------|
| **`'use server'` directive** | Dòng đầu tiên của file |
| **`ActionResult<T>` return type** | Consistent `{ success, data?, error? }` |
| **`revalidatePath()`** | Gọi sau mỗi mutation thành công |
| **`revalidateTag()`** | Gọi khi cần invalidate cache `unstable_cache` |
| **Error handling** | Try-catch, trả Vietnamese error messages |
| **Zod validation** | Validate input trước khi mutate (khuyến khích) |

**Pattern chuẩn:**
```typescript
// app/actions/brands.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { revalidateTag } from 'next/cache'

export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export async function createBrandAction(
  input: CreateBrandInput
): Promise<ActionResult<Brand>> {
  try {
    const brand = await prisma.brand.create({ data: { ...input } })

    revalidatePath('/brands')           // Invalidate page cache
    revalidateTag('brands')             // Invalidate unstable_cache

    return { success: true, data: brand }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi tạo thương hiệu',
    }
  }
}
```

> ✅ Hiện tại: **43 Server Action files** đã có đầy đủ cho tất cả modules.

### 2.2 Server Data Layer — `lib/data/*.ts` (BẮT BUỘC)

Mỗi module **PHẢI** có data fetcher file cho server-side prefetch.

| Tiêu chí | Mô tả |
|----------|-------|
| **`unstable_cache`** | Từ `next/cache` — time-based + tag-based cache |
| **`cache` (React)** | Từ `react` — request memoization |
| **`CACHE_TTL`** | Từ `lib/cache.ts` — SHORT/MEDIUM/LONG/HOUR/DAY |
| **`CACHE_TAGS`** | Từ `lib/cache.ts` — module-specific cache tags |
| **`getXxxStats()`** | Export function cho page.tsx gọi |

**Pattern chuẩn:**
```typescript
// lib/data/employees.ts
import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache'

export const getEmployeeStats = cache(async () => {
  return unstable_cache(
    async () => {
      const [total, active, onLeave] = await Promise.all([
        prisma.employee.count({ where: { isDeleted: false } }),
        prisma.employee.count({ where: { isDeleted: false, employmentStatus: 'working' } }),
        prisma.employee.count({ where: { isDeleted: false, employmentStatus: 'on_leave' } }),
      ])
      return { total, active, onLeave }
    },
    ['employee-stats'],
    { revalidate: CACHE_TTL.SHORT / 1000, tags: [CACHE_TAGS.EMPLOYEES] }
  )()
})
```

> ✅ Hiện tại: **36 lib/data files** đã có.

### 2.3 Cache Invalidation — `revalidatePath` + `revalidateTag`

| Hàm | Vị trí gọi | Mục đích |
|-----|-----------|----------|
| `revalidatePath('/brands')` | `app/actions/*.ts` | Invalidate page route cache |
| `revalidateTag('brands')` | `app/actions/*.ts` hoặc `lib/services/*.ts` | Invalidate `unstable_cache` theo tag |

**Quy tắc:**
- Sau mỗi **mutation** (create/update/delete) → gọi cả `revalidatePath` + `revalidateTag`
- `revalidateTag` khớp với `tags` trong `unstable_cache` options của `lib/data/*.ts`
- Dùng `CACHE_TAGS` constants — **KHÔNG hardcode string**

### 2.4 Cache TTL Constants — `lib/cache.ts`

| TTL | Giá trị | Dùng cho |
|-----|---------|----------|
| `CACHE_TTL.SHORT` | 30s | Stats, dashboard, frequently changing |
| `CACHE_TTL.MEDIUM` | 5 min | List pages |
| `CACHE_TTL.LONG` | 30 min | Settings, reference data |
| `CACHE_TTL.HOUR` | 1 hour | Static lookups |
| `CACHE_TTL.DAY` | 24 hours | Rarely changing |

> ⚠️ `CACHE_TTL` giá trị là **milliseconds** (cho memory cache). Khi dùng với `unstable_cache`, cần chia 1000 cho `revalidate` option (seconds).

---

## 3. Tiêu Chí API Routes

### 3.1 Structure

```
app/api/[module]/
├── route.ts              # GET (list), POST (create)
├── [systemId]/route.ts   # GET (detail), PATCH (update), DELETE
├── bulk/route.ts         # POST (bulk operations)
└── export/route.ts       # GET (export data)
```

### 3.2 Response Format

```typescript
// Success
return apiSuccess(data)                            // { data }
return apiPaginated(data, total, page, pageSize)   // { data, pagination }
return apiError('Error message', 400)              // { error: { message } }
```

> 🇻🇳 **Lỗi tiếng Việt (BẮT BUỘC)**
>
> Error messages **PHẢI** bằng tiếng Việt. Xử lý Prisma errors:
> ```typescript
> // Trong try-catch của Server Action hoặc API route
> catch (error) {
>   if (error instanceof Prisma.PrismaClientKnownRequestError) {
>     if (error.code === 'P2002') return { success: false, error: 'Dữ liệu đã tồn tại' }
>     if (error.code === 'P2025') return { success: false, error: 'Không tìm thấy dữ liệu' }
>     if (error.code === 'P2003') return { success: false, error: 'Không thể xóa vì có dữ liệu liên quan' }
>   }
>   return { success: false, error: 'Đã xảy ra lỗi' }
> }
> ```

### 3.3 Security (BẮT BUỘC — 100% đã đạt)

| Tiêu chí | Implementation |
|----------|---------------|
| **Authentication** | `requireAuth()` ở mọi route |
| **Zod Validation** | `validateBody(request, schema)` ở POST/PUT |
| **Try-Catch** | Wrap toàn bộ logic |
| **Consistent Response** | `apiSuccess` / `apiPaginated` / `apiError` |

### 3.4 Performance

| Tiêu chí | Ngưỡng |
|----------|--------|
| Response Time | < 200ms (simple), < 500ms (complex) |
| No N+1 Queries | `include` / `select` hợp lý |
| Parallel Queries | `Promise.all([data, count])` |

---

## 4. Tiêu Chí Prisma/Database

### 4.1 Schema Design

| Tiêu chí | Mô tả |
|----------|-------|
| **Naming** | PascalCase models, camelCase fields |
| **Relations** | `@relation(fields: [...], references: [...])` rõ ràng |
| **Soft Delete** | `isDeleted Boolean @default(false)` |
| **Multi-file** | Tách schema theo domain: `prisma/schema/hrm/`, `sales/`, `inventory/` |

> 🔴 **QUY TẮC INDEX BẮT BUỘC**
>
> Mọi field trong `where` clause **BẮT BUỘC** phải có `@@index`.
>
> ```prisma
> model Employee {
>   status       String
>   departmentId String?
>   isDeleted    Boolean  @default(false)
>   createdAt    DateTime @default(now())
>
>   @@index([status])
>   @@index([departmentId])
>   @@index([isDeleted])
>   @@index([status, isDeleted])  // Composite
>   @@index([createdAt])          // Sorting
> }
> ```

### 4.2 Query Patterns

| Pattern | Khi nào dùng |
|---------|--------------|
| `select: {}` | Không cần tất cả fields |
| `include: { rel: { take: 10 } }` | Relations có thể lớn |
| `prisma.$transaction([])` | Multiple related operations |
| Cursor pagination | Large datasets |

---

## 5. Tiêu Chí Hooks

### 5.1 Naming Convention

| Prefix | Mục đích | Ví dụ |
|--------|----------|-------|
| `use[Entity]s` | Fetch list (paginated) | `useEmployees(params)` |
| `use[Entity]` | Fetch single | `useEmployee(id)` |
| `useAll[Entity]s` | Fetch ALL (dropdown) | `useAllEmployees({ enabled })` |
| `use[Entity]Mutations` | CRUD mutations | `useEmployeeMutations` |
| `use[Entity]sByEmployee` | Server-side filter | `usePenaltiesByEmployee(id)` |

### 5.2 React Query (BẮT BUỘC)

```typescript
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (params: Params) => [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
}

export function useEmployees(params: Params = {}) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => fetchEmployees(params),
    staleTime: 30_000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
```

> 🔒 **Server-Side Filtering (BẮT BUỘC cho Detail Pages)**
>
> | ❌ Anti-pattern | ✅ Đúng |
> |----------------|--------|
> | `usePenalties()` → `.filter(p => p.empId === id)` | `usePenaltiesByEmployee(id)` → API `?employeeSystemId=X` |
>
> Server đã có index → O(log n). Client filter = O(n) tăng dần theo thời gian.

---

## 6. Tiêu Chí Components

### 6.1 Categories

| Loại | Vị trí | Mục đích |
|------|--------|----------|
| **UI** | `components/ui/` (85 files) | shadcn/ui, không business logic |
| **Shared** | `components/shared/` (29 files) | Cross-feature: GenericExportDialog, BulkActionsToolbar |
| **Data Table** | `components/data-table/` (21 files) | ResponsiveDataTable, VirtualizedTable |
| **Feature** | `features/[module]/components/` | Module-specific: EmployeeCard, OrderForm |

### 6.2 Design Rules

| Tiêu chí | Mô tả |
|----------|-------|
| Props Interface | Export interface riêng |
| Composition | Ưu tiên composition over inheritance |
| React.memo | Cho components render thường xuyên |
| Lazy Loading | `dynamic(() => import(...))` cho Dialog, Chart |

---

## 7. Tiêu Chí Types

### 7.1 Organization

```
features/[module]/types.ts        # Module types (re-export từ prisma-extended)
features/[module]/validation.ts   # Zod schemas (source of truth cho forms)
lib/types/prisma-extended.ts      # Extended Prisma types (shared)
types/*.d.ts                      # Module augmentation (next-auth, react-table)
```

### 7.2 Rules

| Tiêu chí | Mô tả |
|----------|-------|
| **Infer from Zod** | `type Employee = z.infer<typeof employeeSchema>` |
| **No `any`** | Dùng `unknown` + type guards |
| **Discriminated Unions** | `type Status = 'pending' \| 'approved'` |

---

## 8. Tiêu Chí Store (Zustand — chỉ cho UI State)

> **Migration hoàn thành:** 49 entity stores → React Query. 10 UI stores giữ lại.

### 8.1 Khi Nào Dùng Gì

| Use Case | Zustand | React Query | useState |
|----------|---------|-------------|----------|
| Server data | ❌ | ✅ | ❌ |
| UI state (modal, view mode) | ✅ | ❌ | ✅ (local) |
| Column layout | ❌ | ❌ | ❌ → `useColumnLayout()` |
| Form state | ❌ | ❌ | ✅ (react-hook-form) |
| Theme, preferences | ✅ (persist) | ❌ | ❌ |

### 8.2 UI Stores (10 — giữ lại)

| Store | Mục đích |
|-------|----------|
| appearance | Theme, fonts, colors |
| printer | Template configs |
| complaints-settings | Card colors, SLA |
| tasks-settings | Card colors, SLA |
| global-page-size | User preference |
| card-colors, sla-settings, stock-alert, dimensions, sales-workflow | UI preferences |

---

## 9. Tiêu Chí App Infrastructure

### 9.1 Authentication — NextAuth v5 + Edge

| File | Runtime | Mục đích |
|------|---------|----------|
| `auth.config.ts` | **Edge** (middleware) | JWT callbacks, authorized check, pages config |
| `auth.ts` | **Node.js** | Credentials provider + Prisma lookup |
| `middleware.ts` | **Edge** | Route protection via `NextAuth(authConfig).auth` |

**Quy tắc:**
- `auth.config.ts` **KHÔNG import Prisma** (Edge runtime không hỗ trợ)
- `auth.ts` chứa providers + database logic
- Middleware matcher: exclude `api`, `_next/static`, `_next/image`, static files
- Server-side auth: `const session = await auth()` trong layout/page
- Client-side auth: `useSession()` từ NextAuthProvider

### 9.2 Providers — `app/providers.tsx`

```tsx
// 'use client' — wraps all client providers
<QueryClientProvider client={queryClient}>
  <NextAuthProvider>
    <ThemeProvider>
      <BreakpointProvider>
        <LegacyAuthProvider>
          <PageHeaderProvider>
            <RoutePrefetcher />  {/* useIdlePreload() */}
            {children}
            <Toaster />
          </PageHeaderProvider>
        </LegacyAuthProvider>
      </BreakpointProvider>
    </ThemeProvider>
  </NextAuthProvider>
</QueryClientProvider>
```

**Quy tắc:** Thêm provider mới → đặt trong `providers.tsx`, **KHÔNG** wrap ở layout.tsx.

### 9.3 Error Handling — 3 Layers

| File | Phạm vi | Khi nào trigger |
|------|---------|----------------|
| `app/error.tsx` | Root-level errors | Lỗi ở pages ngoài `(authenticated)` |
| `app/(authenticated)/error.tsx` | Authenticated route errors | Lỗi ở pages trong `(authenticated)` |
| `app/global-error.tsx` | **Entire app** (kể cả layout) | Lỗi ở root layout — dùng inline styles (không CSS) |
| `app/not-found.tsx` | 404 | Route không tồn tại |
| `app/loading.tsx` | Root loading | Spinner khi chuyển trang |
| `app/(authenticated)/loading.tsx` | Authenticated loading | Spinner trong authenticated layout |

**Quy tắc:**
- `error.tsx` và `global-error.tsx` **PHẢI** có `'use client'` directive
- `global-error.tsx` dùng **inline styles** (không import CSS — layout có thể crash)
- Tất cả error messages bằng **tiếng Việt**
- Error boundary cung cấp nút "Thử lại" (`reset()`) + "Về trang chủ"

### 9.4 Route Groups + Metadata Template

```tsx
// app/(authenticated)/layout.tsx — Server Component
export const metadata: Metadata = {
  title: {
    template: '%s | ERP System',  // Dynamic title template
    default: 'ERP System',
  },
}

export default async function AuthenticatedLayout({ children }) {
  const session = await auth()       // Server-side auth check
  if (!session?.user) redirect('/login')
  return <MainLayout>{children}</MainLayout>
}
```

**Quy tắc:** Mỗi page export `metadata: { title: 'Tên trang' }` → rendered thành `"Tên trang | ERP System"`.

### 9.5 Root Layout — Preload + Fonts

| Pattern | Mô tả |
|---------|-------|
| `await preloadSettings()` | Server-side preload settings vào cache trước khi render |
| `Inter({ subsets: ['latin', 'vietnamese'] })` | Font chuẩn cho tiếng Việt |
| `<html lang="vi">` | Locale tiếng Việt |
| `suppressHydrationWarning` | Cho ThemeProvider (dark mode) |

### 9.6 Instrumentation + Monitoring

| File | Mục đích |
|------|----------|
| `instrumentation.ts` | Server startup: Prisma `$connect()`, Sentry init |
| `sentry.server.config.ts` | Sentry cho Node.js runtime |
| `sentry.edge.config.ts` | Sentry cho Edge runtime |
| `sentry.client.config.ts` | Sentry cho browser |

### 9.7 SEO Files

| File | Mục đích |
|------|----------|
| `app/robots.ts` | `robots.txt` — block `/api/`, `/dashboard/` etc |
| `app/sitemap.ts` | `sitemap.xml` — dynamic route generation |

### 9.8 `next.config.ts` — Tối Ưu Quan Trọng

```typescript
experimental: {
  optimizePackageImports: [
    'lucide-react', 'recharts', '@tanstack/react-query',
    '@/components/ui', '@/components/shared', '@/components/data-table',
    '@/features/orders', '@/features/customers', '@/features/employees',
    // ... tất cả feature modules có barrel exports
  ],
  turbopackFileSystemCacheForDev: true,  // Persistent cache cho Turbopack
}
```

**Quy tắc:**
- Khi thêm barrel export mới → **PHẢI** thêm vào `optimizePackageImports`
- `serverExternalPackages`: Prisma 7 cần `['@prisma/client', 'prisma', '@prisma/adapter-pg', 'pg']`

### 9.9 Public Routes (không cần auth)

| Route | Mục đích |
|-------|----------|
| `/login` | Trang đăng nhập |
| `/complaint-tracking/[complaintId]` | Khách hàng tra cứu khiếu nại |
| `/warranty/tracking` | Khách hàng tra cứu bảo hành |
| `/api/auth/*` | NextAuth endpoints |
| `/api/health` | Health check |

---

## 10. Tiêu Chí Cấu Trúc Thư Mục

```
hrm2/
├── app/                    # Routing (THIN — 97% < 15 lines)
│   ├── (authenticated)/    # Route group — requires auth
│   ├── actions/            # Server Actions (43 files, 'use server')
│   ├── api/                # API Routes (GET/POST/PATCH/DELETE)
│   ├── complaint-tracking/ # Public — tra cứu khiếu nại
│   ├── login/              # Public — đăng nhập
│   ├── warranty/           # Public — tra cứu bảo hành
│   ├── error.tsx           # Root error boundary
│   ├── global-error.tsx    # Global error boundary (kể cả layout)
│   ├── not-found.tsx       # 404 page
│   ├── loading.tsx         # Root loading
│   ├── layout.tsx          # Root layout (preloadSettings, fonts)
│   ├── providers.tsx       # Client providers wrapper
│   ├── robots.ts           # SEO robots.txt
│   └── sitemap.ts          # SEO sitemap.xml
├── features/               # Business logic (MAIN)
├── components/             # Shared UI (ui/ + shared/ + data-table/ + layout/)
├── hooks/                  # Shared hooks (utility + re-exports)
├── contexts/               # Global contexts (auth, modal, breakpoint, page-header)
├── lib/                    # Utilities
│   ├── data/               # Server Data Layer (36 files — unstable_cache + react cache)
│   ├── services/           # Business services (order, inventory, customer-debt, activity-log)
│   ├── cache.ts            # CACHE_TTL + CACHE_TAGS constants
│   ├── api-utils.ts        # requireAuth, validateBody, apiSuccess, apiPaginated, apiError
│   ├── prisma.ts           # Prisma client singleton
│   ├── query-client.ts     # React Query global config
│   └── fetch-all-pages.ts  # Auto-pagination utility
├── repositories/           # Data Access Layer (legacy)
├── prisma/                 # Database schema (73 models, 13 domain folders)
├── types/                  # Global .d.ts declarations
├── generated/              # Prisma client
├── auth.ts                 # NextAuth config (Node.js runtime)
├── auth.config.ts          # NextAuth config (Edge runtime)
├── middleware.ts            # Route protection
├── instrumentation.ts       # Server startup hooks
└── scripts/                # Build/seed scripts
```

### 10.1 app/ — Page Patterns

**Advanced Page (list pages có stats):**
```tsx
// Suspense + force-dynamic + initialStats — xem Section 1.2
```

**Simple Page (< 15 lines):**
```tsx
import type { Metadata } from 'next'
import { BrandsPage } from '@/features/brands/page'
export const metadata: Metadata = { title: 'Thương hiệu' }
export default function Page() { return <BrandsPage /> }
```

### 10.2 Settings Pattern

```typescript
const { setPageHeader } = useSettingsPageHeader()
useTabActionRegistry('tab-key', { actions: [...] })
<SettingsVerticalTabs tabs={[...]} />
```

### 10.3 Global vs Local

| Thư mục | Chứa | KHÔNG chứa |
|---------|------|------------|
| `hooks/` | useDebounce, useColumnLayout, useFuseSearch | useEmployees, useOrders |
| `hooks/api/` | @deprecated adapters | New code |
| `components/shared/` | GenericExportDialog, BulkActionsToolbar | Module-specific |

---

## 11. Bảng Điểm Module

### Thang điểm: 30/30

| Tiêu chí | Max |
|----------|-----|
| Structure (Thin Page + correct pattern) | 5 |
| Data (RQ + useColumnLayout) | 5 |
| Server-Side (Server Action + lib/data + revalidate) | 5 |
| Performance (dynamic, memo, isLoading) | 5 |
| Types (Zod + validation.ts) | 5 |
| API (auth + validation + response) | 5 |

### 11.1 Feature Modules

| Module | Điểm | Module | Điểm |
|--------|------|--------|------|
| employees | **25/25** ⭐ | purchase-orders | **25/25** ⭐ |
| complaints | **25/25** ⭐ | sales-returns | **25/25** ⭐ |
| warranty | **25/25** ⭐ | shipments | **25/25** ⭐ |
| orders | **25/25** ⭐ | packaging | **25/25** ⭐ |
| tasks | **25/25** ⭐ | suppliers | **25/25** ⭐ |
| products | **25/25** ⭐ | wiki | **25/25** ⭐ |
| reports | **25/25** ⭐ | dashboard | **25/25** ⭐ |
| inventory-checks | **25/25** ⭐ | brands | **25/25** ⭐ |
| inventory-receipts | **25/25** ⭐ | categories | **25/25** ⭐ |
| stock-transfers | **25/25** ⭐ | stock-locations | **25/25** ⭐ |
| cost-adjustments | **25/25** ⭐ | audit-log | **25/25** ⭐ |
| purchase-returns | **25/25** ⭐ | stock-history | **25/25** ⭐ |
| cashbook | **25/25** ⭐ | shared | **25/25** ⭐ |
| payments | **25/25** ⭐ | auth | **22/25** |
| receipts | **25/25** ⭐ | | |
| reconciliation | **25/25** ⭐ | | |
| attendance | **25/25** ⭐ | | |
| leaves | **25/25** ⭐ | | |
| payroll | **25/25** ⭐ | | |
| customers | **25/25** ⭐ | | |

### 11.2 Settings Sub-modules

| Module | Điểm | Module | Điểm |
|--------|------|--------|------|
| departments | **20/25** | taxes | **15/25** |
| branches | **20/25** | target-groups | **15/25** |
| job-titles | **20/25** | receipt-types | **15/25** |
| units | **20/25** | provinces | **15/25** |
| payments/methods | **20/25** | appearance | **15/25** |
| pkgx | **20/25** | sales-channels | **15/25** |
| pricing | **20/25** | trendtech | **15/25** |
| inventory | **20/25** | shipping | **15/25** |
| customers | **20/25** | websites | **15/25** |
| cash-accounts | **20/25** | employees | **10/25** |
| penalties | **20/25** | store-info | **10/25** |
| system (logs) | **20/25** | sales | **10/25** |
| printer (templates) | **20/25** | complaints | **5/25** |
| | | warranty | **5/25** |
| | | tasks | **5/25** |
| | | other | **5/25** |
| | | px | **0/25** |
| | | previews | **0/25** |
| | | templates | **0/25** |

### 11.3 Global Areas

| Area | Score |
|------|-------|
| components/ (135 files) | **25/25** ⭐ |
| hooks/ (25 files) | **25/25** ⭐ |
| contexts/ (4 files) | **25/25** ⭐ |
| App pages (132) | **97%** ⭐ |
| API Routes (56) | **5/5** ⭐ |
| Prisma (73 models) | **21/25** — cần thêm index cho 39 models |

---

## 12. Definition of Done

| # | Tiêu chí | Bắt buộc |
|---|----------|----------|
| 1 | `page.tsx` < 300 lines (thin page) | ✅ |
| 2 | `columns.tsx` tách riêng | ✅ |
| 3 | Heavy components lazy loaded (`dynamic()`) | ✅ |
| 4 | React Query: `keepPreviousData` + `gcTime` | ✅ |
| 5 | `useColumnLayout()` cho column visibility/order/pin | ✅ |
| 6 | `isLoading` prop trên DataTable | ✅ |
| 7 | `fetchAllPages()` cho hooks cần ALL data | ✅ |
| 8 | Zod validation (`validation.ts`) | ✅ |
| 9 | Direct imports (không barrel) | ✅ |
| 10 | API: `requireAuth()` + `validateBody()` + `apiPaginated()` | ✅ |
| 11 | Server Action: `app/actions/*.ts` với `revalidatePath/Tag` | ✅ |
| 12 | Server Data: `lib/data/*.ts` với `getXxxStats()` | ✅ |
| 13 | List page: `Suspense` + `force-dynamic` + `initialStats` | ✅ |
| 14 | `export const metadata: Metadata` cho mỗi page | ✅ |
| 15 | Error boundaries (`error.tsx`) ở route group | ✅ |
| 16 | 0 TypeScript errors, 0 ESLint errors | ✅ |
| 17 | Điểm ≥ 25/30 | ✅ |

### Overall Health Score (v2.0)

| Category | Grade |
|----------|-------|
| Feature Modules (34) | **A+** ⭐ (avg 24.9/25) |
| Settings Sub-modules (32) | **C** (avg 13.5/25) |
| Global (components, hooks, contexts) | **A+** ⭐ |
| API Routes | **A+** ⭐ (100% auth + validation) |
| Stores | **A+** ⭐ (49 migrated, 10 UI kept) |
| App Pages | **A+** ⭐ (97% thin) |
| Prisma/DB | **B+** (84% — cần thêm indexes) |
| **OVERALL** | **A** |

### Remaining Improvements

| Priority | Task |
|----------|------|
| P1 | Settings: thêm `keepPreviousData` cho 12 sub-modules |
| P1 | Settings: refactor pages > 1000 lines (printer, complaints, warranty, tasks) |
| P2 | Prisma: thêm `@@index` cho 39 models chưa có |
| P2 | Types: thêm `validation.ts` cho 9 features còn thiếu |
| P3 | Settings/px, previews, templates: refactor hoặc remove |

---

*Phiên bản 2.1 — Cập nhật 01/03/2026*


