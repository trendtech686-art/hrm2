# Tiêu Chí Đánh Giá Chất Lượng Module

> Ngày tạo: 05/01/2026
> Phiên bản: 1.0
> Áp dụng cho: HRM2 Next.js 16 + Turbopack

## 📋 Mục Lục

1. [Tiêu chí Feature Module](#1-tiêu-chí-feature-module)
2. [Tiêu chí API Routes](#2-tiêu-chí-api-routes)
3. [Tiêu chí Prisma/Database](#3-tiêu-chí-prismadatabase)
4. [Tiêu chí Hooks](#4-tiêu-chí-hooks)
5. [Tiêu chí Components](#5-tiêu-chí-components)
6. [Tiêu chí Types](#6-tiêu-chí-types)
7. [Tiêu chí Store (Zustand)](#7-tiêu-chí-store-zustand)
8. [Tiêu chí Cấu Trúc Thư Mục](#8-checklist-tổng-hợp)
9. [Danh Sách Modules & TODO](#9-danh-sách-modules--todo)
10. [Kế Hoạch Đánh Giá & Tối Ưu](#10-todo---kế-hoạch-đánh-giá--tối-ưu)

---

## 1. Tiêu Chí Feature Module

### 1.1 Colocation & Granularity (Tách biệt & Chi tiết)

> Module tốt là module mà khi nhìn vào folder, ta biết ngay nó làm gì và không bị phụ thuộc vòng (circular dependency).

| Tiêu chí | Mô tả | Ví dụ tốt | Ví dụ xấu |
|----------|-------|-----------|-----------|
| **Thin Page Pattern** | `page.tsx` chỉ đóng vai trò điều phối, không chứa logic xử lý dữ liệu hay định nghĩa columns | `page.tsx` < 300 lines, import `getColumns()` từ file riêng | `page.tsx` > 800 lines với columns inline |
| **Component Atomicity** | Tách các thành phần nặng (Dialog, Drawer, Complex Filter) ra khỏi luồng render chính | `dynamic(() => import('./AddDialog'))` | Import trực tiếp tất cả dialogs |
| **Single Responsibility** | Mỗi file chỉ làm một việc | `employee-filters.tsx`, `employee-table.tsx` riêng biệt | `page.tsx` chứa cả filters, table, dialogs |
| **Direct Import** | Import trực tiếp từ file gốc, **KHÔNG dùng barrel exports** (index.ts) | `import { Button } from '@/components/ui/button'` | `import { Button } from '@/components/ui'` |

> ⚠️ **QUAN TRỌNG - Direct Import Rule**
> 
> Barrel files (`index.ts` re-export tất cả) là nguyên nhân chính gây **chậm Turbopack compile**.
> 
> ```typescript
> // ❌ TRÁNH - Barrel import (compile chậm ~2s)
> import { Button, Input, Dialog } from '@/components/ui'
> 
> // ✅ ĐÚNG - Direct import (compile nhanh ~200ms)
> import { Button } from '@/components/ui/button'
> import { Input } from '@/components/ui/input'
> import { Dialog } from '@/components/ui/dialog'
> ```

**Cấu trúc folder chuẩn:**
```
features/[module]/
├── api/                    # API handlers (nếu cần client-side API)
├── components/             # UI components riêng của module
│   ├── [module]-card.tsx
│   ├── [module]-filters.tsx
│   └── [module]-dialogs.tsx
├── hooks/                  # Custom hooks
│   ├── use-[module].ts          # React Query hook
│   └── use-[module]-actions.ts  # Action handlers
├── columns.tsx             # Table columns definition
├── types.ts                # TypeScript interfaces
├── validation.ts           # Zod schemas
├── store.ts                # Zustand store (nếu cần local state)
└── page.tsx                # Entry point - thin wrapper
```

### 1.2 Server-First (Cân bằng Client/Server)

> Chìa khóa để fix "lag" khi chuyển từ React sang Next.js.

| Tiêu chí | Mô tả | Cách implement |
|----------|-------|----------------|
| **Server Components cho Layout** | Header, Breadcrumbs, phần tĩnh phải là Server Components | Không có `'use client'` ở layout |
| **Client Components ở "lá"** | Chỉ dùng `'use client'` cho buttons, forms, interactive parts | Wrap interactive phần trong Client Component riêng |
| **Minimize Client Bundle** | Giảm JS gửi xuống browser | Dynamic imports, tree shaking |

**Pattern đề xuất:**
```tsx
// app/(authenticated)/employees/page.tsx - Server Component (không có 'use client')
import { PageLayout } from '@/components/layout/page-layout';
import { EmployeesClientPage } from '@/features/employees/page';

export default function EmployeesPage() {
  return (
    <PageLayout 
      title="Danh sách nhân viên"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Nhân viên', href: '/employees' },
      ]}
    >
      <EmployeesClientPage /> {/* Client component */}
    </PageLayout>
  );
}
```

### 1.3 Data Management (Fetch & Cache)

| Tiêu chí | Mô tả | Implementation |
|----------|-------|----------------|
| **keepPreviousData** | Tránh flicker khi chuyển trang/filter | `placeholderData: keepPreviousData` |
| **Prefetching** | Tải trước data user sắp cần | `router.prefetch()`, `queryClient.prefetchQuery()` |
| **Optimistic Updates** | Cập nhật UI ngay trước khi API respond | `onMutate` với `setQueryData` |
| **Stale Time phù hợp** | Cân bằng freshness vs performance | `staleTime: 30_000` cho list, `60_000` cho detail |

> 🎯 **Ngưỡng Optimistic Updates (BẮT BUỘC)**
> 
> | Hành động | Yêu cầu | Thời gian UI phản hồi |
> |-----------|---------|----------------------|
> | **Xóa item** | ✅ Bắt buộc optimistic | < 50ms |
> | **Toggle trạng thái** | ✅ Bắt buộc optimistic | < 50ms |
> | **Cập nhật đơn giản** | ✅ Bắt buộc optimistic | < 50ms |
> | **Tạo mới** | ⚠️ Khuyến khích | < 100ms |
> | **Cập nhật phức tạp** | ⚠️ Tùy chọn | Chờ API |
> 
> Người dùng **PHẢI** thấy kết quả ngay lập tức, không đợi API response.

**Ví dụ Optimistic Update:**
```typescript
const deleteMutation = useMutation({
  mutationFn: deleteEmployee,
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: employeeKeys.lists() });
    const previous = queryClient.getQueryData(employeeKeys.lists());
    
    // Optimistic update
    queryClient.setQueryData(employeeKeys.lists(), (old) => 
      old?.filter(e => e.systemId !== id)
    );
    
    return { previous };
  },
  onError: (err, id, context) => {
    // Rollback on error
    queryClient.setQueryData(employeeKeys.lists(), context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
  },
});
```

### 1.4 Render Performance (Mượt UI)

| Tiêu chí | Mô tả | Ngưỡng chấp nhận |
|----------|-------|------------------|
| **Render Time** | Thời gian render component | < 100ms |
| **Re-render Count** | Số lần re-render không cần thiết | Tối thiểu |
| **Bundle Size** | Kích thước JS của module | < 50KB gzipped |

**Kỹ thuật tối ưu:**

| Kỹ thuật | Khi nào dùng | Ví dụ |
|----------|--------------|-------|
| **Table Virtualization** | Bảng > 100 rows | `@tanstack/react-virtual` |
| **useMemo** | Tính toán nặng, derived data | `useMemo(() => getColumns(), [deps])` |
| **useCallback** | Functions truyền vào child components | `useCallback((id) => handleDelete(id), [])` |
| **useDeferredValue** | Search input với filter nặng | `const deferredSearch = useDeferredValue(search)` |
| **React.memo** | Component nhận props ít thay đổi | `export default React.memo(TableRow)` |

### 1.5 Scannability (Dễ bảo trì)

| Tiêu chí | Mô tả | Yêu cầu |
|----------|-------|---------|
| **Schema Validation** | Validate cả Form và API Response | Zod schemas cho tất cả |
| **Clear Naming** | Tên file/function rõ nghĩa | `use-employee-mutations.ts` không phải `hooks.ts` |
| **Comments cho Logic phức tạp** | Giải thích WHY không phải WHAT | JSDoc cho public APIs |
| **No Magic Numbers** | Constants được đặt tên | `const PAGE_SIZE = 20` |

---

## 2. Tiêu Chí API Routes

### 2.1 Structure & Organization

```
app/api/[module]/
├── route.ts              # GET (list), POST (create)
├── [systemId]/
│   └── route.ts          # GET (detail), PATCH (update), DELETE
├── bulk/
│   └── route.ts          # POST (bulk operations)
└── export/
    └── route.ts          # GET (export data)
```

### 2.2 Response Format

| Tiêu chí | Mô tả | Ví dụ |
|----------|-------|-------|
| **Consistent Structure** | Cùng format cho tất cả endpoints | `{ data, pagination?, error? }` |
| **Proper Status Codes** | HTTP status codes đúng ngữ nghĩa | 200, 201, 400, 401, 404, 500 |
| **Error Messages** | Thông báo lỗi rõ ràng, không leak sensitive info | `{ error: { message, code } }` |
| **Pagination** | Có pagination cho list endpoints | `{ data, pagination: { page, limit, total } }` |
| **User-friendly Errors** | Thông báo lỗi tiếng Việt cho người dùng | Không trả raw Prisma errors |

> 🇻🇳 **QUY TẮC LỖI THÂN THIỆN (BẮT BUỘC)**
> 
> API **KHÔNG ĐƯỢC** trả về lỗi thuần của Prisma. Phải qua lớp catch để trả về thông báo tiếng Việt.
> 
> ```typescript
> // lib/api-error-handler.ts
> export function handlePrismaError(error: unknown): ApiError {
>   if (error instanceof Prisma.PrismaClientKnownRequestError) {
>     switch (error.code) {
>       case 'P2002': // Unique constraint
>         const field = (error.meta?.target as string[])?.[0];
>         return {
>           message: `${getFieldLabel(field)} đã tồn tại trong hệ thống`,
>           code: 'DUPLICATE_ENTRY',
>           status: 409,
>         };
>       case 'P2025': // Record not found
>         return {
>           message: 'Không tìm thấy dữ liệu',
>           code: 'NOT_FOUND',
>           status: 404,
>         };
>       case 'P2003': // Foreign key constraint
>         return {
>           message: 'Không thể xóa vì có dữ liệu liên quan',
>           code: 'FOREIGN_KEY_VIOLATION',
>           status: 400,
>         };
>       default:
>         return {
>           message: 'Đã xảy ra lỗi, vui lòng thử lại',
>           code: 'DATABASE_ERROR',
>           status: 500,
>         };
>     }
>   }
>   return {
>     message: 'Đã xảy ra lỗi không xác định',
>     code: 'INTERNAL_ERROR',
>     status: 500,
>   };
> }
> 
> // Sử dụng trong API route
> try {
>   // ... logic
> } catch (error) {
>   const apiError = handlePrismaError(error);
>   return NextResponse.json(
>     { error: { message: apiError.message, code: apiError.code } },
>     { status: apiError.status }
>   );
> }
> ```

**Response Schema chuẩn:**
```typescript
// Success Response
interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Response
interface ApiError {
  error: {
    message: string;
    code: string;
    details?: Record<string, string[]>; // Validation errors
  };
}
```

### 2.3 Performance

| Tiêu chí | Mô tả | Ngưỡng |
|----------|-------|--------|
| **Response Time** | Thời gian xử lý request | < 200ms (simple), < 500ms (complex) |
| **Query Optimization** | Không N+1 queries | Dùng `include` hợp lý |
| **Caching** | Cache khi phù hợp | `Cache-Control` headers |

### 2.4 Security

| Tiêu chí | Mô tả | Implementation |
|----------|-------|----------------|
| **Authentication** | Xác thực user | Check session ở mỗi route |
| **Authorization** | Phân quyền | Check permissions trước action |
| **Input Validation** | Validate tất cả inputs | Zod schemas |
| **Rate Limiting** | Chống abuse | Middleware rate limit |

**Ví dụ API Route chuẩn:**
```typescript
// app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { employeeListSchema } from '@/features/employees/validation';

export async function GET(request: NextRequest) {
  // 1. Authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
      { status: 401 }
    );
  }

  // 2. Parse & Validate query params
  const searchParams = request.nextUrl.searchParams;
  const params = employeeListSchema.safeParse({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    search: searchParams.get('search'),
  });

  if (!params.success) {
    return NextResponse.json(
      { error: { message: 'Invalid parameters', code: 'VALIDATION_ERROR', details: params.error.flatten() } },
      { status: 400 }
    );
  }

  // 3. Query with proper pagination
  const { page = 1, limit = 20, search } = params.data;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.employee.findMany({
      where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.employee.count({
      where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
    }),
  ]);

  // 4. Return consistent response
  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

---

## 3. Tiêu Chí Prisma/Database

### 3.1 Schema Design

| Tiêu chí | Mô tả | Ví dụ |
|----------|-------|-------|
| **Naming Convention** | PascalCase cho models, camelCase cho fields | `Employee`, `createdAt` |
| **Proper Relations** | Định nghĩa relations rõ ràng | `@relation(fields: [...], references: [...])` |
| **Indexes** | Index cho frequently queried fields | `@@index([status, createdAt])` |
| **Soft Delete** | Dùng `isDeleted` thay vì xóa thật | `isDeleted Boolean @default(false)` |

> 🔴 **QUY TẮC INDEX BẮT BUỘC**
> 
> Mọi field xuất hiện trong `where` clause của query **BẮT BUỘC** phải có `@@index` trong schema.
> 
> ```prisma
> model Employee {
>   id           String   @id
>   systemId     String   @unique
>   status       String   // 👈 Dùng trong where
>   departmentId String?  // 👈 Dùng trong where
>   isDeleted    Boolean  @default(false) // 👈 Dùng trong where
>   createdAt    DateTime @default(now())
>   
>   // ✅ BẮT BUỘC: Index cho các fields dùng trong where
>   @@index([status])
>   @@index([departmentId])
>   @@index([isDeleted])
>   @@index([status, isDeleted]) // Composite index cho query phổ biến
>   @@index([createdAt])         // Cho sorting
> }
> ```
> 
> **Cách kiểm tra:** Review tất cả API routes, tìm các `where` conditions, đảm bảo có index.

### 3.2 Query Patterns

| Pattern | Khi nào dùng | Ví dụ |
|---------|--------------|-------|
| **Select specific fields** | Khi không cần tất cả fields | `select: { id: true, name: true }` |
| **Include với limit** | Relations có thể lớn | `include: { orders: { take: 10 } }` |
| **Transaction** | Multiple related operations | `prisma.$transaction([...])` |
| **Raw Query** | Complex queries | `prisma.$queryRaw` |

### 3.3 Performance

| Tiêu chí | Mô tả | Cách kiểm tra |
|----------|-------|---------------|
| **No N+1** | Không query trong loop | Dùng `include` hoặc batch |
| **Proper Pagination** | Cursor-based cho large datasets | `cursor`, `take`, `skip` |
| **Connection Pooling** | Tái sử dụng connections | PrismaClient singleton |

**Ví dụ tránh N+1:**
```typescript
// ❌ N+1 Problem
const employees = await prisma.employee.findMany();
for (const emp of employees) {
  const department = await prisma.department.findUnique({ 
    where: { id: emp.departmentId } 
  });
}

// ✅ Proper include
const employees = await prisma.employee.findMany({
  include: { department: true }
});
```

---

## 4. Tiêu Chí Hooks

### 4.1 Naming Convention

| Prefix | Mục đích | Ví dụ |
|--------|----------|-------|
| `use[Entity]` | Fetch single/list | `useEmployee`, `useEmployees` |
| `use[Entity]Mutations` | CRUD mutations | `useEmployeeMutations` |
| `use[Entity]Actions` | UI actions/handlers | `useEmployeeActions` |
| `use[Feature]` | Feature-specific logic | `useEmployeeFilter` |

### 4.2 React Query Hooks

| Tiêu chí | Mô tả | Implementation |
|----------|-------|----------------|
| **Query Keys Factory** | Consistent query keys | `employeeKeys.list(params)` |
| **Proper Dependencies** | `enabled` khi cần | `enabled: !!id` |
| **Error Handling** | Handle errors gracefully | `onError` callback |
| **Loading States** | Expose loading states | `isLoading`, `isFetching` |

**Template cho React Query hooks:**
```typescript
// features/[module]/hooks/use-[module].ts

// Query Keys Factory
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (params: EmployeeParams) => [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
};

// List Hook
export function useEmployees(params: EmployeeParams = {}) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => fetchEmployees(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Detail Hook
export function useEmployee(id: string | null | undefined) {
  return useQuery({
    queryKey: employeeKeys.detail(id!),
    queryFn: () => fetchEmployee(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

// Mutations Hook
export function useEmployeeMutations(options?: MutationOptions) {
  const queryClient = useQueryClient();
  
  const create = useMutation({...});
  const update = useMutation({...});
  const remove = useMutation({...});
  
  return { create, update, remove };
}
```

### 4.3 Custom Hooks Best Practices

| Tiêu chí | Mô tả | Ví dụ |
|----------|-------|-------|
| **Single Purpose** | Một hook làm một việc | `useEmployeeFilter` chỉ xử lý filter |
| **Composable** | Có thể kết hợp với nhau | Hooks nhỏ compose thành hooks lớn |
| **Testable** | Dễ viết unit test | Pure logic, không side effects trực tiếp |
| **Documented** | JSDoc cho parameters và return | Mô tả rõ purpose và usage |

---

## 5. Tiêu Chí Components

### 5.1 Component Categories

| Loại | Vị trí | Mục đích | Ví dụ |
|------|--------|----------|-------|
| **UI Components** | `components/ui/` | Reusable, không business logic | Button, Input, Dialog |
| **Shared Components** | `components/shared/` | Cross-feature, có một ít logic | DataTable, PageHeader |
| **Feature Components** | `features/[module]/components/` | Business logic của module | EmployeeCard, EmployeeForm |

### 5.2 Component Design

| Tiêu chí | Mô tả | Implementation |
|----------|-------|----------------|
| **Props Interface** | Định nghĩa rõ ràng | Export interface riêng |
| **Default Props** | Có defaults hợp lý | Destructuring với defaults |
| **Composition** | Ưu tiên composition over inheritance | Children, render props |
| **Accessibility** | A11y compliant | ARIA attributes, keyboard nav |

**Template Component:**
```tsx
// features/employees/components/employee-card.tsx

export interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function EmployeeCard({ 
  employee, 
  onEdit, 
  onDelete,
  className 
}: EmployeeCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      {/* ... */}
    </Card>
  );
}

// Memoize nếu nhận callbacks
export default React.memo(EmployeeCard);
```

### 5.3 Performance

| Tiêu chí | Khi nào áp dụng | Cách implement |
|----------|-----------------|----------------|
| **React.memo** | Component nhận nhiều props, render thường xuyên | Wrap với `React.memo()` |
| **Lazy Loading** | Heavy components (Dialog, Charts) | `dynamic(() => import(...))` |
| **Code Splitting** | Chia nhỏ bundles | Dynamic imports |

---

## 6. Tiêu Chí Types

### 6.1 File Organization

```
types/
├── prisma-extended.ts    # Extended Prisma types
├── api.ts                # API request/response types
└── common.ts             # Shared utility types

features/[module]/
├── types.ts              # Module-specific types
└── validation.ts         # Zod schemas (source of truth)
```

### 6.2 Type Design

| Tiêu chí | Mô tả | Ví dụ |
|----------|-------|-------|
| **Infer from Zod** | Types derived từ schemas | `type Employee = z.infer<typeof employeeSchema>` |
| **Strict Types** | Không dùng `any` | `unknown` + type guards |
| **Discriminated Unions** | Cho variant types | `type Status = 'pending' \| 'approved'` |
| **Branded Types** | Cho IDs đặc biệt | `type SystemId = string & { __brand: 'SystemId' }` |

**Ví dụ types.ts:**
```typescript
// features/employees/types.ts
import { z } from 'zod';
import { employeeSchema, employeeFormSchema } from './validation';

// Infer từ Zod schemas
export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeFormData = z.infer<typeof employeeFormSchema>;

// API types
export interface EmployeeListParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  status?: EmployeeStatus;
}

export interface EmployeeListResponse {
  data: Employee[];
  pagination: Pagination;
}

// Enums/Unions
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave';

// UI specific types
export interface EmployeeTableRow extends Employee {
  isSelected?: boolean;
  isExpanded?: boolean;
}
```

### 6.3 Zod Schemas

| Tiêu chí | Mô tả | Ví dụ |
|----------|-------|-------|
| **Base Schema** | Schema gốc với tất cả fields | `employeeSchema` |
| **Form Schema** | Schema cho form (có thể khác) | `employeeFormSchema.omit({ id: true })` |
| **Partial Schema** | Cho update operations | `employeeSchema.partial()` |
| **API Schema** | Validate API responses | `employeeApiResponseSchema` |

---

## 7. Tiêu Chí Store (Zustand)

### 7.1 Khi Nào Dùng Store

| Use Case | Dùng Store | Dùng React Query | Dùng useState |
|----------|------------|------------------|---------------|
| Server data | ❌ | ✅ | ❌ |
| UI state (modal open) | ✅ | ❌ | ✅ (local) |
| Cross-component state | ✅ | ❌ | ❌ |
| Form state | ❌ | ❌ | ✅ (react-hook-form) |
| Filters/Pagination | ⚠️ URL params tốt hơn | ❌ | ✅ |

### 7.2 Store Design

| Tiêu chí | Mô tả | Ví dụ |
|----------|-------|-------|
| **Minimal State** | Chỉ store những gì cần thiết | Không store server data |
| **Derived State** | Dùng selectors | `const activeCount = useStore(s => s.items.filter(i => i.active).length)` |
| **Actions** | Grouped trong store | `actions: { add, update, remove }` |
| **Persistence** | Chỉ khi cần | `persist` middleware |

**Template Store:**
```typescript
// features/[module]/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // UI State
  selectedIds: string[];
  isFilterOpen: boolean;
  viewMode: 'table' | 'kanban';
  
  // Actions
  setSelectedIds: (ids: string[]) => void;
  toggleFilter: () => void;
  setViewMode: (mode: 'table' | 'kanban') => void;
  reset: () => void;
}

const initialState = {
  selectedIds: [],
  isFilterOpen: false,
  viewMode: 'table' as const,
};

export const useEmployeeUIStore = create<UIState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setSelectedIds: (ids) => set({ selectedIds: ids }),
      toggleFilter: () => set((s) => ({ isFilterOpen: !s.isFilterOpen })),
      setViewMode: (mode) => set({ viewMode: mode }),
      reset: () => set(initialState),
    }),
    {
      name: 'employee-ui',
      partialize: (state) => ({ viewMode: state.viewMode }), // Chỉ persist viewMode
    }
  )
);
```

### 7.3 Migration từ Store → React Query

| Trước (Zustand) | Sau (React Query) |
|-----------------|-------------------|
| `store.data` | `useQuery().data` |
| `store.isLoading` | `useQuery().isLoading` |
| `store.add(item)` | `useMutation().mutate(item)` |
| `store.update(id, data)` | `useMutation().mutate({ id, data })` |
| `store.delete(id)` | `useMutation().mutate(id)` |

---

## 8. Checklist Tổng Hợp

### 8.0 Tiêu Chí Cấu Trúc Thư Mục (Folder Structure)

> Cấu trúc thư mục chuẩn giúp tránh circular dependency và tối ưu compile time.

**Cấu trúc hiện tại của HRM2:**
```
hrm2/
├── app/                    # 🎯 Routing layer (THIN)
├── features/               # 🎯 Business logic (MAIN)
├── components/             # 🔄 Shared UI components
├── hooks/                  # 🔄 Shared hooks
├── contexts/               # ⚠️ Global contexts (hạn chế)
├── lib/                    # 🔧 Utilities & configs
├── repositories/           # 💾 Data Access Layer
├── prisma/                 # 💾 Database schema
├── types/                  # 📝 Shared types
├── generated/              # 🤖 Auto-generated code
├── scripts/                # 🔨 Build/seed scripts
└── public/                 # 📁 Static assets
```

#### 8.0.1 Thư mục `app/` và `features/` (Quan trọng nhất)

| Tiêu chí | Yêu cầu | Ví dụ |
|----------|---------|-------|
| **Thin Page Pattern** | `app/[route]/page.tsx` < 50 lines, chỉ import từ features | `export { EmployeesPage as default } from '@/features/employees/page'` |
| **Server-First Layout** | `layout.tsx` là Server Component | Không có `'use client'` trong layout |
| **Loading States** | Mỗi route có `loading.tsx` | Skeleton components |
| **Error Boundaries** | Mỗi route có `error.tsx` | Error recovery UI |

```tsx
// ✅ CHUẨN - app/(authenticated)/employees/page.tsx (< 50 lines)
import { EmployeesPage } from '@/features/employees/page';
export default EmployeesPage;

// hoặc với metadata
import { Metadata } from 'next';
import { EmployeesPage } from '@/features/employees/page';

export const metadata: Metadata = {
  title: 'Nhân viên | HRM2',
};

export default EmployeesPage;
```

#### 8.0.2 Thư mục `repositories/` và `prisma/`

| Tiêu chí | Yêu cầu | Lý do |
|----------|---------|-------|
| **Data Access Layer** | Tất cả Prisma queries trong `repositories/` | Tái sử dụng, dễ test |
| **Select Specific Fields** | Dùng `select` thay vì lấy toàn bộ | Giảm payload |
| **Prisma Singleton** | Một instance duy nhất | Tránh connection pool overflow |
| **No Prisma in Components** | Không import Prisma trong `features/` | Separation of concerns |

```typescript
// ✅ CHUẨN - repositories/employee-repository.ts
import { prisma } from '@/lib/prisma';

export const employeeRepository = {
  findMany: async (params: EmployeeQueryParams) => {
    return prisma.employee.findMany({
      where: { isDeleted: false, ...params.where },
      select: {  // 👈 Chỉ lấy fields cần thiết
        systemId: true,
        id: true,
        name: true,
        email: true,
        department: { select: { name: true } },
      },
      skip: params.skip,
      take: params.take,
    });
  },
  
  findById: async (systemId: string) => {
    return prisma.employee.findUnique({
      where: { systemId },
      include: { department: true, addresses: true },
    });
  },
};

// ✅ CHUẨN - lib/prisma.ts (Singleton)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### 8.0.3 Thư mục `components/`, `hooks/`, `contexts/` (Global vs Local)

> ⚠️ **Nguyên tắc: Global chỉ chứa SHARED, Local trong features/**

| Thư mục | Chứa gì | KHÔNG chứa |
|---------|---------|------------|
| `components/` | UI primitives (Button, Input, Dialog) | EmployeeCard, OrderForm |
| `components/ui/` | shadcn/ui components | Business components |
| `components/shared/` | DataTable, PageHeader | Module-specific components |
| `hooks/` | useDebounce, useMediaQuery, useFetch | useEmployees, useOrders |
| `contexts/` | ThemeContext, AuthContext | EmployeeContext, OrderContext |

```
// ✅ ĐÚNG - Cấu trúc phân chia
components/
├── ui/                 # shadcn/ui primitives
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── shared/             # Cross-feature components
│   ├── data-table/
│   ├── page-header.tsx
│   └── search-input.tsx
└── layout/             # App layout components
    ├── sidebar.tsx
    └── header.tsx

hooks/
├── use-debounce.ts     # ✅ Shared utility
├── use-media-query.ts  # ✅ Shared utility
└── use-local-storage.ts # ✅ Shared utility

features/employees/
├── hooks/
│   ├── use-employees.ts      # ✅ Module-specific
│   └── use-employee-form.ts  # ✅ Module-specific
└── components/
    ├── employee-card.tsx     # ✅ Module-specific
    └── employee-form.tsx     # ✅ Module-specific
```

> 🔴 **CẢNH BÁO: Context Lag**
> 
> Hạn chế dùng React Context cho dữ liệu lớn hoặc thay đổi thường xuyên.
> 
> | Use Case | Dùng Context | Dùng Zustand | Dùng React Query |
> |----------|--------------|--------------|------------------|
> | Theme (light/dark) | ✅ | ✅ | ❌ |
> | Auth session | ✅ | ✅ | ❌ |
> | Employee list | ❌ | ❌ | ✅ |
> | Cart items | ❌ | ✅ | ⚠️ |
> | Modal states | ⚠️ | ✅ | ❌ |

#### 8.0.4 Thư mục `lib/` và `scripts/`

| Thư mục | Mục đích | Ví dụ files |
|---------|----------|-------------|
| `lib/` | Utilities, configs, helpers | prisma.ts, utils.ts, date-utils.ts |
| `lib/` | Third-party configs | axios-instance.ts, query-client.ts |
| `scripts/` | Build-time scripts | seed.ts, migrate.ts, generate-types.ts |

```typescript
// ✅ CHUẨN - lib/utils.ts với Direct Import
import { clsx, type ClassValue } from 'clsx';  // ✅ Direct
import { twMerge } from 'tailwind-merge';       // ✅ Direct

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ❌ TRÁNH - Barrel import trong lib
import { format, parse, addDays } from 'date-fns';  // ❌ Barrel
// ✅ ĐÚNG
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
```

#### 8.0.5 Thư mục `generated/` và `types/`

| Thư mục | Quy tắc | Lý do |
|---------|---------|-------|
| `generated/` | **KHÔNG SỬA TAY** | Auto-generated từ Prisma/OpenAPI |
| `types/` | Chỉ shared types | Module types → `features/[module]/types.ts` |

```
types/
├── prisma-extended.ts    # Extended Prisma types (với relations)
├── api.ts                # API request/response interfaces
├── common.ts             # Pagination, SortOrder, etc.
└── index.ts              # ❌ KHÔNG CÓ - tránh barrel

features/employees/
├── types.ts              # ✅ Employee-specific types
└── validation.ts         # ✅ Zod schemas
```

#### 8.0.6 Checklist Cấu Trúc Thư Mục

e là
- [ ] **app/**
  - [ ] Mỗi `page.tsx` < 50 lines (chỉ re-export)
  - [ ] Có `loading.tsx` cho mỗi route
  - [ ] Có `error.tsx` cho error boundaries
  - [ ] Layout là Server Component

- [ ] **features/**
  - [ ] Mỗi module có `components/`, `hooks/`, `types.ts`
  - [ ] Không import từ module khác (trừ shared)
  - [ ] Business logic nằm trong hooks

- [ ] **components/**
  - [ ] Chỉ chứa UI primitives và shared
  - [ ] Không có business logic
  - [ ] Direct imports (không barrel)

- [ ] **hooks/**
  - [ ] Chỉ chứa shared utilities
  - [ ] Module hooks trong `features/[module]/hooks/`

- [ ] **repositories/**
  - [ ] Tất cả Prisma queries ở đây
  - [ ] Dùng `select` để optimize
  - [ ] Không có business logic

- [ ] **lib/**
  - [ ] Prisma singleton
  - [ ] Direct imports cho third-party

---

- [ ] **Structure**
  - [ ] Folder structure theo chuẩn
  - [ ] `page.tsx` < 400 lines (thin wrapper)
  - [ ] Columns tách riêng `columns.tsx`
  - [ ] Heavy components lazy loaded
  
- [ ] **Data**
  - [ ] React Query hooks trong `hooks/`
  - [ ] `placeholderData: keepPreviousData`
  - [ ] Query keys factory
  - [ ] Proper staleTime/gcTime
  
- [ ] **Performance**
  - [ ] `useMemo` cho columns
  - [ ] `useCallback` cho handlers
  - [ ] Virtualization cho long lists
  - [ ] Bundle size < 50KB
  
- [ ] **Types**
  - [ ] Zod schemas trong `validation.ts`
  - [ ] Types inferred từ Zod
  - [ ] Không dùng `any`

### API Route Checklist

- [ ] **Security**
  - [ ] Auth check
  - [ ] Input validation (Zod)
  - [ ] Proper error responses
  
- [ ] **Performance**
  - [ ] Response time < 500ms
  - [ ] Proper pagination
  - [ ] No N+1 queries
  
- [ ] **Structure**
  - [ ] Consistent response format
  - [ ] Proper HTTP status codes
  - [ ] Error handling

### Component Checklist

- [ ] **Design**
  - [ ] Props interface exported
  - [ ] Default props defined
  - [ ] Accessible (ARIA)
  
- [ ] **Performance**
  - [ ] `React.memo` khi cần
  - [ ] Không inline functions trong render
  - [ ] Proper key props cho lists

---

## 📊 Bảng Đánh Giá Nhanh

| Module | Structure | Data | Performance | Types | API | Score |
|--------|-----------|------|-------------|-------|-----|-------|
| employees | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 19/25 |
| complaints | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 19/25 |
| warranty | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 18/25 |
| orders | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 19/25 |

---

## 9. Danh Sách Modules & TODO

> Tổng cộng: **37 feature modules** + **40 settings sub-modules**

### 9.1 Feature Modules Chính

| # | Module | Đường dẫn | Độ phức tạp | Trạng thái |
|---|--------|-----------|-------------|------------|
| 1 | attendance | `features/attendance/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 2 | audit-log | `features/audit-log/` | 🟢 Simple | ⬜ Chưa đánh giá |
| 3 | auth | `features/auth/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 4 | brands | `features/brands/` | 🟢 Simple | ⬜ Chưa đánh giá |
| 5 | cashbook | `features/cashbook/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 6 | categories | `features/categories/` | 🟢 Simple | ⬜ Chưa đánh giá |
| 7 | **complaints** | `features/complaints/` | 🔴 Complex | ✅ Đã tối ưu |
| 8 | cost-adjustments | `features/cost-adjustments/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 9 | customers | `features/customers/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 10 | dashboard | `features/dashboard/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 11 | **employees** | `features/employees/` | 🔴 Complex | ✅ Đã tối ưu |
| 12 | finance | `features/finance/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 13 | inventory-checks | `features/inventory-checks/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 14 | inventory-receipts | `features/inventory-receipts/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 15 | leaves | `features/leaves/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 16 | **orders** | `features/orders/` | 🔴 Complex | ✅ Đã tối ưu |
| 17 | other-targets | `features/other-targets/` | 🟢 Simple | ⬜ Chưa đánh giá |
| 18 | packaging | `features/packaging/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 19 | payments | `features/payments/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 20 | payroll | `features/payroll/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 21 | products | `features/products/` | 🔴 Complex | ⬜ Chưa đánh giá |
| 22 | purchase-orders | `features/purchase-orders/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 23 | purchase-returns | `features/purchase-returns/` | 🟡 Medium | ✅ Đã tối ưu |
| 24 | receipts | `features/receipts/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 25 | reconciliation | `features/reconciliation/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 26 | reports | `features/reports/` | 🔴 Complex | ⬜ Chưa đánh giá |
| 27 | sales-returns | `features/sales-returns/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 28 | shared | `features/shared/` | 🟢 Utility | ⬜ Chưa đánh giá |
| 29 | shipments | `features/shipments/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 30 | stock-history | `features/stock-history/` | 🟢 Simple | ⬜ Chưa đánh giá |
| 31 | stock-locations | `features/stock-locations/` | 🟢 Simple | ⬜ Chưa đánh giá |
| 32 | stock-transfers | `features/stock-transfers/` | 🟡 Medium | ⬜ Chưa đánh giá |
| 33 | suppliers | `features/suppliers/` | 🟡 Medium | ✅ Đã tối ưu |
| 34 | tasks | `features/tasks/` | 🔴 Complex | ✅ Đã tối ưu |
| 35 | **warranty** | `features/warranty/` | 🔴 Complex | ✅ Đã tối ưu |
| 36 | wiki | `features/wiki/` | 🟡 Medium | ⬜ Chưa đánh giá |

### 9.2 Settings Sub-modules

| # | Sub-module | Đường dẫn | Trạng thái |
|---|------------|-----------|------------|
| 1 | appearance | `features/settings/appearance/` | ⬜ Chưa đánh giá |
| 2 | branches | `features/settings/branches/` | ⬜ Chưa đánh giá |
| 3 | cash-accounts | `features/settings/cash-accounts/` | ⬜ Chưa đánh giá |
| 4 | complaints | `features/settings/complaints/` | ⬜ Chưa đánh giá |
| 5 | customers | `features/settings/customers/` | ⬜ Chưa đánh giá |
| 6 | **departments** | `features/settings/departments/` | ✅ Đã tối ưu |
| 7 | employees | `features/settings/employees/` | ⬜ Chưa đánh giá |
| 8 | inventory | `features/settings/inventory/` | ⬜ Chưa đánh giá |
| 9 | job-titles | `features/settings/job-titles/` | ⬜ Chưa đánh giá |
| 10 | other | `features/settings/other/` | ⬜ Chưa đánh giá |
| 11 | payments | `features/settings/payments/` | ⬜ Chưa đánh giá |
| 12 | penalties | `features/settings/penalties/` | ⬜ Chưa đánh giá |
| 13 | pkgx | `features/settings/pkgx/` | ⬜ Chưa đánh giá |
| 14 | previews | `features/settings/previews/` | ⬜ Chưa đánh giá |
| 15 | pricing | `features/settings/pricing/` | ⬜ Chưa đánh giá |
| 16 | printer | `features/settings/printer/` | ⬜ Chưa đánh giá |
| 17 | provinces | `features/settings/provinces/` | ⬜ Chưa đánh giá |
| 18 | px | `features/settings/px/` | ⬜ Chưa đánh giá |
| 19 | receipt-types | `features/settings/receipt-types/` | ⬜ Chưa đánh giá |
| 20 | sales | `features/settings/sales/` | ⬜ Chưa đánh giá |
| 21 | sales-channels | `features/settings/sales-channels/` | ⬜ Chưa đánh giá |
| 22 | shipping | `features/settings/shipping/` | ⬜ Chưa đánh giá |
| 23 | store-info | `features/settings/store-info/` | ⬜ Chưa đánh giá |
| 24 | system | `features/settings/system/` | ⬜ Chưa đánh giá |
| 25 | target-groups | `features/settings/target-groups/` | ⬜ Chưa đánh giá |
| 26 | tasks | `features/settings/tasks/` | ⬜ Chưa đánh giá |
| 27 | taxes | `features/settings/taxes/` | ⬜ Chưa đánh giá |
| 28 | templates | `features/settings/templates/` | ⬜ Chưa đánh giá |
| 29 | trendtech | `features/settings/trendtech/` | ⬜ Chưa đánh giá |
| 30 | units | `features/settings/units/` | ⬜ Chưa đánh giá |
| 31 | warranty | `features/settings/warranty/` | ⬜ Chưa đánh giá |
| 32 | websites | `features/settings/websites/` | ⬜ Chưa đánh giá |

---

## 10. TODO - Kế Hoạch Đánh Giá & Tối Ưu

> **Phương pháp:** Đánh giá từng module theo 7 tiêu chí, ghi điểm, tối ưu nếu cần.

### 📋 Quy Trình Đánh Giá 1 Module

```
1. Kiểm tra Structure (Thin Page, Direct Import, Component Atomicity)
2. Kiểm tra Data (React Query hooks, keepPreviousData, Optimistic Updates)
3. Kiểm tra Performance (useMemo, useCallback, Virtualization)
4. Kiểm tra Types (Zod schemas, no `any`)
5. Kiểm tra API (Response format, Error handling, N+1)
6. Ghi điểm vào bảng đánh giá
7. Tạo PR fix nếu điểm < 15/25
```

---

### Phase 1: Complex Modules (🔴 Ưu tiên cao) - Tuần 1

> **Mục tiêu:** Hoàn thành 7 modules phức tạp nhất

#### 1.1 ✅ employees (ĐÃ HOÀN THÀNH)
- [x] Tách `columns.tsx` riêng
- [x] Tách `MobileEmployeeCard` 
- [x] Dynamic import dialogs
- [x] React Query hooks (`use-employees.ts`)
- [x] `keepPreviousData` ✅
- **Điểm: 19/25**

#### 1.2 ✅ complaints (ĐÃ HOÀN THÀNH)
- [x] Tách `KanbanColumn` component
- [x] Virtualization với `@tanstack/react-virtual`
- [x] React Query hooks
- [x] `keepPreviousData` ✅
- **Điểm: 19/25**

#### 1.3 ✅ warranty (ĐÃ HOÀN THÀNH)
- [x] Tách `KanbanColumn` từ shared
- [x] React Query hooks (`use-warranties.ts`)
- [x] `keepPreviousData` ✅
- **Điểm: 18/25**

#### 1.4 ✅ orders (ĐÃ HOÀN THÀNH)
- [x] Tách components
- [x] Lazy load dialogs
- [x] Optimistic updates cho order status
- [x] React Query hooks
- **Điểm: 19/25**

#### 1.5 ✅ tasks (ĐÃ HOÀN THÀNH)
- [x] Lazy load `TaskKanbanView`
- [x] Tách `columns.tsx`
- [x] Virtualization trong kanban
- **Điểm: 18/25**

#### 1.6 ✅ products (ĐÃ ĐÁNH GIÁ - 06/01/2026)
- [x] `page.tsx` 1115 lines - ⚠️ Quá dài nhưng có nhiều PKGX integration handlers
- [x] `columns.tsx` tách riêng (1078 lines) ✅
- [x] `detail-page.tsx` (1138 lines), `form-page.tsx` (281 lines)
- [x] React Query hooks: `use-products-query.ts` với `keepPreviousData` ✅
- [x] `use-products.ts` với query keys factory & mutations ✅
- [x] Combo handling: `combo-utils.ts`, `calculateComboStock()` ✅
- [x] Dynamic imports cho dialogs:
  - `PkgxBulkSyncConfirmDialog`, `PkgxLinkDialog` ✅
  - `ProductImportDialog`, `ProductExportDialog` ✅
  - `CommittedStockDialog`, `InTransitStockDialog` ✅
- [x] Zod validation: `validation.ts` (270 lines) ✅
- [x] useMemo/useCallback: 20+ instances ✅
- [x] Store pattern: Zustand slices (base, crud, inventory, search) ✅

**Điểm chấm:**
| Tiêu chí | Điểm | Ghi chú |
|----------|------|---------|
| Structure (Thin Page) | 3/5 | page.tsx > 400 lines do PKGX |
| Data (React Query) | 5/5 | Full hooks + keepPreviousData |
| Performance | 5/5 | Dynamic imports, useMemo |
| Types (Zod) | 4/5 | validation.ts comprehensive |
| API | 4/5 | products-api.ts, proper patterns |
| **TỔNG** | **21/25** | ⚠️ page.tsx cần refactor PKGX handlers ra file riêng |

#### 1.7 ✅ reports (ĐÃ ĐÁNH GIÁ - 06/01/2026)
- [x] Sub-reports structure: `sales-report/`, `inventory-report/`, `business-activity/`, `customer-sla-report/`, `product-sla-report/` ✅
- [x] `index-page.tsx` (288 lines) - Navigation hub ✅
- [x] React Query hooks: `use-reports.ts` với query keys factory ✅
- [x] Chart lazy loading: `DynamicReportChart` with next/dynamic ✅
- [x] API layer: `reports-api.ts` với typed interfaces ✅
- [x] Business activity pages: 6 sub-reports với proper structure ✅
- [x] Components tách riêng: `report-filters.tsx`, `report-chart.tsx`, `report-summary-cards.tsx` ✅
- [x] `sales-report/page.tsx` (180 lines) - Thin page ✅
- [x] `inventory-report/page.tsx` (265 lines) - Thin page ✅
- [x] useMemo cho reportData, columns, sorting ✅

**Điểm chấm:**
| Tiêu chí | Điểm | Ghi chú |
|----------|------|---------|
| Structure (Thin Page) | 5/5 | All pages < 300 lines |
| Data (React Query) | 4/5 | hooks có nhưng staleTime cố định |
| Performance | 5/5 | DynamicReportChart, useMemo |
| Types | 4/5 | types.ts trong sub-modules |
| API | 4/5 | reports-api.ts clean |
| **TỔNG** | **22/25** | Tốt! Consider thêm keepPreviousData |

---

### Phase 2: Medium Modules (🟡) - Tuần 2-3

> **Mục tiêu:** Hoàn thành 22 modules trung bình
> **Cập nhật:** 06/01/2026 - Đã đánh giá toàn bộ 22 modules

#### 2.1 Inventory Group (5 modules) ✅ HOÀN THÀNH

| # | Module | Lines | columns | hooks RQ | Dynamic Import | Điểm |
|---|--------|-------|---------|----------|----------------|------|
| 1 | ✅ inventory-checks | 657 | ✅ tách | ✅ keepPreviousData | ✅ Import/Export | 17/25 |
| 2 | ✅ inventory-receipts | 712 | ⚠️ inline | ✅ keepPreviousData | ✅ Export | 16/25 |
| 3 | ✅ stock-transfers | 548 | ✅ tách | ✅ keepPreviousData | ✅ Import/Export | 18/25 |
| 4 | ✅ cost-adjustments | 706 | ✅ tách | ✅ có hooks | ✅ Import/Export | 17/25 |
| 5 | ✅ purchase-returns | đã done | ✅ tách | ✅ có hooks | ✅ | 18/25 |

**Ghi chú:** inventory-receipts cần tách columns.tsx ra file riêng

#### 2.2 Finance Group (5 modules) ✅ HOÀN THÀNH

| # | Module | Lines | columns | hooks RQ | Dynamic Import | Điểm |
|---|--------|-------|---------|----------|----------------|------|
| 1 | ✅ cashbook | 624 | ✅ tách | ✅ use-all-receipts | ✅ reports-page | 17/25 |
| 2 | ✅ payments | 783 | ✅ tách | ✅ use-all-payments | ✅ Import/Export | 17/25 |
| 3 | ✅ receipts | 706 | ✅ tách | ✅ use-all-receipts | ✅ Import/Export | 17/25 |
| 4 | ✅ finance | N/A | N/A | N/A | N/A | N/A (helpers only) |
| 5 | ✅ reconciliation | 290 | ✅ tách | ✅ use-all-orders | ✅ Export | 19/25 |

**Ghi chú:** finance chỉ chứa helpers, không có UI page

#### 2.3 HR Group (4 modules) ✅ HOÀN THÀNH

| # | Module | Lines | columns | hooks RQ | Dynamic Import | Điểm |
|---|--------|-------|---------|----------|----------------|------|
| 1 | ✅ attendance | 854 | ✅ tách | ✅ use-all-leaves | ⚠️ thiếu Export | 16/25 |
| 2 | ✅ leaves | 428 | ✅ tách | ✅ store | ✅ LeaveForm | 18/25 |
| 3 | ✅ payroll | 641 | ✅ tách | ✅ store | ✅ PrintDialog | 17/25 |
| 4 | ✅ customers | 895 | ✅ tách | ✅ useCustomersQuery | ✅ Import/Export, BulkDialog | 19/25 |

**Ghi chú:** attendance > 800 lines, cần tách handlers; customers có SLA hooks tốt

#### 2.4 Sales Group (4 modules) ✅ HOÀN THÀNH

| # | Module | Lines | columns | hooks RQ | Dynamic Import | Điểm |
|---|--------|-------|---------|----------|----------------|------|
| 1 | ✅ purchase-orders | 1299 | ✅ tách | ✅ use-all-* | ⚠️ thiếu Export | 15/25 |
| 2 | ✅ sales-returns | 418 | ✅ tách | ✅ store | ✅ Export | 18/25 |
| 3 | ✅ shipments | 551 | ✅ tách | ✅ use-all-shipments | ✅ Export | 18/25 |
| 4 | ✅ packaging | 527 | ✅ tách | ✅ use-all-orders | ✅ Export | 18/25 |

**Ghi chú:** purchase-orders > 1000 lines, CẦN REFACTOR URGENTLY

#### 2.5 Other Medium (4 modules) ✅ HOÀN THÀNH

| # | Module | Lines | columns | hooks RQ | Điểm |
|---|--------|-------|---------|----------|------|
| 1 | ✅ suppliers | đã done | ✅ tách | ✅ có hooks | 18/25 |
| 2 | ✅ wiki | 135 | N/A (cards) | ✅ use-all-wiki | 19/25 |
| 3 | ✅ dashboard | 344 | N/A | ✅ use-all-* | 18/25 |
| 4 | ✅ auth | 168 | N/A | N/A | 17/25 |

**Ghi chú:**
- wiki: Clean structure, thin page ✅
- dashboard: DynamicChartBar/Line/Pie lazy loaded ✅
- auth: Simple form, uses next-auth properly ✅

---

### Phase 3: Simple Modules (🟢) - Tuần 4 ✅ HOÀN THÀNH

> **Mục tiêu:** Kiểm tra nhanh 7 modules đơn giản
> **Cập nhật:** 06/01/2026

| # | Module | Lines | columns | hooks RQ | Dynamic | Điểm |
|---|--------|-------|---------|----------|---------|------|
| 1 | ✅ brands | 724 | ✅ tách | ✅ keepPreviousData | ✅ Import/Export | 18/25 |
| 2 | ✅ categories | 886 | ✅ tách | ✅ keepPreviousData | ✅ Import/Export | 17/25 |
| 3 | ✅ audit-log | N/A (no page) | ✅ columns | ✅ useAuditLogs | N/A | 18/25 |
| 4 | ⬜ other-targets | EMPTY | - | - | - | N/A |
| 5 | ✅ stock-history | N/A (no page) | ✅ columns | ✅ store | N/A | 17/25 |
| 6 | ✅ stock-locations | 145 | ✅ tách | ✅ useColumnVisibility | N/A | 19/25 |
| 7 | ✅ shared | 511 | N/A | N/A | N/A | 18/25 |

**Ghi chú:**
- `brands`: PKGX integration, useShallow ✅
- `categories`: PKGX integration, tree support ✅  
- `audit-log`: Read-only API hooks, no UI page (embedded in other modules)
- `other-targets`: **EMPTY folder** - không có code
- `stock-history`: Store-based, columns tách riêng
- `stock-locations`: Clean thin page (145 lines) ✅
- `shared`: import-export-history-page.tsx, product-selection-dialog.tsx

**Điểm TB Phase 3: 17.8/25**

---

### Phase 4: Settings Sub-modules - Tuần 4 ✅ HOÀN THÀNH

> **Mục tiêu:** Kiểm tra 32 settings sub-modules
> **Cập nhật:** 06/01/2026

#### 4.1 Priority Settings (Dùng nhiều) ✅

| # | Module | hooks | store | types | Zod | Điểm |
|---|--------|-------|-------|-------|-----|------|
| 1 | ✅ departments | ✅ 2 files | ✅ | ✅ | ❌ | 18/25 |
| 2 | ✅ branches | ✅ 2 files | ✅ | ✅ | ❌ | 18/25 |
| 3 | ✅ job-titles | ✅ 2 files | ✅ | ✅ | ❌ | 18/25 |
| 4 | ✅ units | ✅ 2 files | ✅ | ✅ | ❌ | 18/25 |
| 5 | ✅ payments/types | ✅ 2 files | ✅ | ✅ | ❌ | 18/25 |

#### 4.2 Integration Settings (External APIs) ✅

| # | Module | hooks | store | types | Zod | Điểm |
|---|--------|-------|-------|-------|-----|------|
| 1 | ✅ pkgx | ✅ 6 files | ✅ store/ | ✅ | ✅ 3 files | **23/25** |
| 2 | ✅ trendtech | ✅ 1 file | ✅ store/ | ❌ | ❌ | 14/25 |
| 3 | ✅ shipping | ✅ 2 files | ✅ | ✅ | ❌ | 18/25 |
| 4 | ⚠️ px | ❌ (Excel only) | ❌ | ❌ | ❌ | 0/25 |

#### 4.3 Domain Settings ✅

| # | Module | hooks | store | types | Zod | Điểm |
|---|--------|-------|-------|-------|-----|------|
| 1 | ✅ pricing | ✅ 2 files | ✅ | ✅ | ✅ | **22/25** |
| 2 | ✅ inventory | ✅ 6 files | ⚠️ nhiều stores | ✅ | ❌ | 17/25 |
| 3 | ✅ taxes | ✅ 2 files | ✅ | ✅ | ❌ | 18/25 |
| 4 | ✅ customers | ✅ 2 files | ⚠️ 6 stores | ✅ | ✅ | **20/25** |
| 5 | ✅ employees | ✅ 1 file | ⚠️ 2 stores | ✅ | ❌ | 15/25 |
| 6 | ✅ penalties | ✅ 2 files | ✅ | ✅ | ❌ | 18/25 |
| 7 | ✅ target-groups | ✅ 2 files | ✅ | ✅ | ❌ | 18/25 |
| 8 | ✅ receipt-types | ✅ 2 files | ✅ | ✅ | ❌ | 18/25 |
| 9 | ✅ provinces | ✅ 3 files | ✅ | ✅ | ❌ | 18/25 |

#### 4.4 UI/System Settings ✅

| # | Module | hooks | store | types | Zod | Điểm |
|---|--------|-------|-------|-------|-----|------|
| 1 | ✅ appearance | ✅ 1 file | ✅ | ⚠️ themes | ❌ | 14/25 |
| 2 | ✅ printer | ✅ 1 file | ✅ | ✅ | ❌ | 17/25 |
| 3 | ✅ store-info | ✅ 1 file | ⚠️ | ❌ | ❌ | 12/25 |
| 4 | ⚠️ system | ❌ | ❌ | ❌ | ❌ | 5/25 |
| 5 | ⚠️ previews | ❌ | ❌ | ❌ | ❌ | 3/25 |
| 6 | ⚠️ templates | ❌ (empty) | ❌ | ❌ | ❌ | 0/25 |

#### 4.5 Other Settings ✅

| # | Module | hooks | store | types | Zod | Điểm |
|---|--------|-------|-------|-------|-----|------|
| 1 | ✅ sales | ✅ 1 file | ⚠️ | ❌ | ❌ | 12/25 |
| 2 | ✅ sales-channels | ✅ 1 file | ✅ | ✅ | ❌ | 17/25 |
| 3 | ⚠️ websites | ✅ 1 file | ❌ | ✅ | ❌ | 13/25 |
| 4 | ⚠️ complaints | ❌ | ✅ | ✅ | ❌ | 12/25 |
| 5 | ⚠️ warranty | ❌ | ❌ | ❌ | ❌ | 5/25 |
| 6 | ⚠️ tasks | ❌ | ✅ | ✅ | ❌ | 12/25 |
| 7 | ⚠️ cash-accounts | ✅ 1 file | ❌ | ❌ | ❌ | 10/25 |
| 8 | ⚠️ other | ❌ | ❌ | ✅ | ❌ | 8/25 |

#### 📊 Phase 4 Summary

| Tiêu chí | Đạt | Thiếu | Tỷ lệ |
|----------|-----|-------|-------|
| hooks folder | 25/32 | 7 | 78% |
| store.ts | 22/32 | 10 | 69% |
| types.ts | 23/32 | 9 | 72% |
| Zod validation | 4/32 | 28 | **12%** ⚠️ |

**Điểm TB Phase 4: 14.5/25**

**🏆 Top performers:** pkgx (23), pricing (22), customers (20)
**🔴 Need improvement:** px (0), templates (0), previews (3), system (5), warranty (5)

---

### Phase 5: Global Improvements - Tuần 5 ✅ HOÀN THÀNH (06/01/2026)

> **Mục tiêu:** Cải thiện các phần dùng chung

#### 5.1 Components Global ✅
- [x] Review `components/ui/` - **85 files** - Direct imports ✅ (all use `@/components/ui/xxx`)
- [x] Review `components/shared/` - **29 files** - Business components tái sử dụng
- [x] Review `components/data-table/` - **21 files** - Có tanstack + virtualized versions

**Chi tiết components/ui/ (85 files):**
| Category | Files | Status |
|----------|-------|--------|
| Form inputs | input, textarea, select, checkbox, radio-group, switch, slider | ✅ |
| Display | card, badge, avatar, skeleton, progress, spinner | ✅ |
| Overlay | dialog, drawer, sheet, popover, tooltip, dropdown-menu | ✅ |
| Navigation | tabs, accordion, navigation-menu, sidebar, menubar | ✅ |
| Custom | tiptap-editor, color-picker, date-picker, time-picker, currency-input | ✅ |
| Charts | chart, dynamic-charts | ✅ |
| Advanced | virtualized-combobox, autocomplete, command-palette | ✅ |

**Chi tiết components/shared/ (29 files):**
| File | Mục đích | Reusable |
|------|----------|----------|
| generic-export-dialog-v2.tsx | Export chung | ✅ |
| generic-import-dialog-v2.tsx | Import chung | ✅ |
| generic-trash-page.tsx | Trash page pattern | ✅ |
| bulk-actions-toolbar.tsx | Bulk selection actions | ✅ |
| product-search-combobox.tsx | Product search | ✅ |
| pkgx-mapping-dialog.tsx | PKGX integration | ✅ |
| documents-manager.tsx | File management | ✅ |
| activity-timeline.tsx | Activity history | ✅ |

**Chi tiết components/data-table/ (21 files):**
| File | Mục đích | Performance |
|------|----------|-------------|
| tanstack-data-table.tsx | Main table component | ✅ |
| tanstack-virtual-table.tsx | Virtualized for large datasets | ✅ |
| virtualized-data-table.tsx | Alternative virtualized | ✅ |
| responsive-data-table.tsx | Mobile responsive | ✅ |
| data-table-pagination.tsx | Pagination controls | ✅ |
| data-table-toolbar.tsx | Search/filter toolbar | ✅ |
| data-table-faceted-filter.tsx | Advanced filtering | ✅ |
| dynamic-column-customizer.tsx | Column visibility | ✅ |

#### 5.2 Hooks Global ✅
- [x] Review `hooks/` - **25 files** in root + `api/` subfolder
- [x] Di chuyển module-specific hooks vào features - ✅ Đã có pattern re-export

**Chi tiết hooks/ (25 files):**
| Hook | Purpose | Location Pattern |
|------|---------|------------------|
| use-branches.ts | **Re-export** từ features/settings/branches | ✅ Correct |
| use-settings.ts | Global settings management | ✅ Global utility |
| use-debounce.ts | Debounce utility | ✅ Global utility |
| use-column-visibility.ts | DataTable column toggle | ✅ Global utility |
| use-file-upload.ts | File upload logic | ✅ Global utility |
| use-image-upload.ts | Image upload logic | ✅ Global utility |
| use-fuse-search.ts | Fuse.js search | ✅ Global utility |
| use-print-options.ts | Print settings | ✅ Global utility |
| use-route-prefetch.ts | Navigation prefetch | ✅ Global utility |
| use-persistent-state.ts | Persist to localStorage | ✅ Global utility |

**Chi tiết hooks/api/ (adapters + sync):**
| Folder | Purpose | Files |
|--------|---------|-------|
| `adapters/` | Store-like API for migration | 4 adapters (employee, customer, product, order) |
| `sync/` | API sync provider | 1 file |
| Root | Entity CRUD hooks | 8 files (branches, customers, employees, entity, orders, paginated-data, products, suppliers) |

**⚠️ Findings:**
- `hooks/api/` có duplicate logic với `features/*/hooks/` - cần consolidate
- Pattern re-export tốt (use-branches.ts → features/settings/branches)
- Test page (`app/(authenticated)/test-api/page.tsx`) vẫn dùng hooks/api trực tiếp

#### 5.3 Contexts Global ✅
- [x] Review `contexts/` - **4 files** - Tất cả well-structured
- [x] Đánh giá migration sang Zustand - **KHÔNG CẦN** (contexts đủ nhẹ)

**Chi tiết contexts/ (4 files):**
| Context | Purpose | Lines | Performance |
|---------|---------|-------|-------------|
| auth-context.tsx | Authentication state | 190 | ✅ Cached user |
| modal-context.tsx | Modal stack management | 184 | ✅ z-index management |
| breakpoint-context.tsx | Responsive breakpoints | 114 | ✅ Debounced resize |
| page-header-context.tsx | Dynamic page headers | 249 | ✅ Auto breadcrumb |

**✅ Best Practices Found:**
- `auth-context.tsx`: Uses in-memory cache, không re-fetch mỗi render
- `breakpoint-context.tsx`: Single resize listener, debounced 150ms
- `modal-context.tsx`: Proper z-index stack management
- `page-header-context.tsx`: Auto-generates breadcrumbs from pathname

#### 5.4 Repositories ⬜ (Cần audit riêng)
- [ ] Review all repositories - `select` optimization
- [ ] Check N+1 queries
- [ ] Add missing indexes

#### 5.5 API Routes ⬜ (Cần audit riêng - Phase 6)
- [ ] Implement `handlePrismaError` helper
- [ ] Standardize response format
- [ ] Add missing validation

---

**📊 Phase 5 Summary:**

| Area | Total Files | Reviewed | Status | Score |
|------|-------------|----------|--------|-------|
| components/ui | 85 | 85 | ✅ | 20/25 |
| components/shared | 29 | 29 | ✅ | 22/25 |
| components/data-table | 21 | 21 | ✅ | 23/25 |
| hooks/ | 25 | 25 | ⚠️ | 18/25 |
| hooks/api/ | 13 | 13 | ⚠️ | 15/25 |
| contexts/ | 4 | 4 | ✅ | 24/25 |
| **Total** | **177** | **177** | | **Avg: 20.3/25** |

**🔴 Issues Found:**
1. `hooks/api/` duplicates logic with `features/*/hooks/` - consolidate needed
2. Missing Zod validation in some shared components
3. `test-api/page.tsx` should use feature hooks, not hooks/api directly

**🟢 Strengths:**
1. Direct imports pattern for UI components ✅
2. Re-export pattern for shared hooks ✅
3. Contexts properly optimized (caching, debounce) ✅
4. Data table has virtualization support ✅

---

### Phase 6: API Routes Audit - Tuần 5-6 ✅ HOÀN THÀNH (06/01/2026)

> **Mục tiêu:** Đảm bảo tất cả API routes tuân thủ tiêu chuẩn

#### 6.1 Tổng quan API Routes

**Tổng số:** 56 route folders trong `app/api/`

```
app/api/
├── auth/                   # Authentication ✅
├── employees/              # CRUD employees
├── orders/                 # CRUD orders  
├── products/               # CRUD products
├── customers/              # CRUD customers
├── complaints/             # CRUD complaints
├── warranties/             # CRUD warranty
├── tasks/                  # CRUD tasks
├── inventory-checks/       # Inventory management
├── inventory-receipts/     # Inventory receipts
├── stock-transfers/        # Stock transfers
├── purchase-orders/        # Purchase orders
├── sales-returns/          # Sales returns
├── payments/               # Payments
├── receipts/               # Receipts
├── attendance/             # Attendance
├── leaves/                 # Leaves
├── payroll/                # Payroll
├── settings/               # Settings
├── brands/                 # Brands
├── categories/             # Categories
└── ... (35+ more)
```

#### 6.2 Kết quả Audit 20 Major Routes

| Route | Auth | Zod | Try-Catch | Response | N+1 Safe | Score |
|-------|------|-----|-----------|----------|----------|-------|
| employees | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| orders | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| products | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| customers | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| complaints | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| warranties | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| tasks | ❌ | ❌ | ✅ | ⚠️ Raw array | ✅ | **2/5** |
| inventory-checks | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| inventory-receipts | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| stock-transfers | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| purchase-orders | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| sales-returns | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| payments | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| receipts | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| attendance | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| leaves | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| payroll | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| settings | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| brands | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |
| categories | ❌ | ❌ | ✅ | ✅ `{data}` | ✅ | **2/5** |

**Điểm trung bình: 2/5** 🔴

#### 6.3 Thống kê Chi tiết

| Criteria | Pass | Fail | Percentage |
|----------|------|------|------------|
| 🔴 Authentication (`auth()`) | 0 | 20 | **0%** |
| 🔴 Zod Validation | 0 | 20 | **0%** |
| ✅ Try-Catch Error Handling | 20 | 0 | **100%** |
| ✅ Standard Response Format | 19 | 1 | **95%** |
| ✅ No N+1 Queries | 20 | 0 | **100%** |

#### 6.4 Patterns Found

**✅ Positive Patterns:**
1. **Consistent try-catch** - All routes log errors to console
2. **Standard pagination** - `{data, total, page, pageSize, totalPages}`
3. **Promise.all** - Parallel queries for data + count
4. **Prisma include** - Avoids N+1 with relations
5. **P2002 handling** - Some routes handle unique constraint

**🔴 Critical Issues:**

1. **NO AUTHENTICATION (0%)**
   - Major security vulnerability
   - Only settings sub-routes (pkgx, shipping-config) use `auth()`
   - Main data routes completely unprotected

2. **NO ZOD VALIDATION (0%)**
   - All routes do `const body = await request.json()` without validation
   - Risk: Invalid data, runtime errors, injection vectors

3. **Manual validation only**
   - Some routes manually check required fields
   - No schema-based validation

#### 6.5 Action Items

- [ ] **🔴 CRITICAL: Add auth middleware** - Tất cả routes cần check session
- [ ] **🔴 CRITICAL: Add Zod schemas** - Mỗi entity cần validation schema
- [ ] **Tạo `lib/api-error-handler.ts`** - Helper xử lý lỗi Prisma → tiếng Việt
- [ ] **Tạo `lib/api-response.ts`** - Helper format response chuẩn
- [ ] **Fix tasks route** - Return `{data}` wrapper instead of raw array

#### 6.6 Recommended Implementation

**1. Auth Wrapper:**
```typescript
// lib/api-auth.ts
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function withAuth(handler: Function) {
  return async (request: Request) => {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return handler(request, session)
  }
}
```

**2. Zod Validation:**
```typescript
// features/employees/schemas/employee.schema.ts
import { z } from 'zod'

export const createEmployeeSchema = z.object({
  fullName: z.string().min(1, 'Tên không được để trống'),
  phone: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional(),
})
```

---

**📊 Phase 6 Summary:**
- **Total Routes:** 56 folders
- **Audited:** 20 major routes
- **Average Score:** 2/5 🔴
- **Critical Issues:** Authentication (0%), Zod Validation (0%)

---

### Phase 7: Hooks Audit - Tuần 6 ✅ HOÀN THÀNH (06/01/2026)

> **Mục tiêu:** Tổ chức lại hooks theo đúng tiêu chuẩn

#### 7.1 Global Hooks (`hooks/`) - 25 Files

| Category | Files | Uses React Query | Status |
|----------|-------|------------------|--------|
| **Utility** | use-debounce, use-fuse-search, use-persistent-state, use-route-prefetch | ❌ (correct) | ✅ Truly global |
| **Data (re-export)** | use-branches, use-branding | ✅ Re-exports | ✅ Good pattern |
| **Data (manual fetch)** | use-settings, use-system-settings, use-reminder-settings, etc. | ❌ Manual fetch | ⚠️ Should use RQ |
| **UI** | use-column-visibility, use-print-options, use-lazy-image | ❌ (correct) | ✅ UI state only |
| **Misplaced** | use-product-cache, use-workflow-templates | - | 🔴 Move to features |

**hooks/api/ (8 files) - Score: 95%**
| Hook | React Query | queryKeys Factory | Status |
|------|-------------|-------------------|--------|
| use-branches.ts | ✅ | ✅ `branchKeys` | ✅ |
| use-customers.ts | ✅ | ✅ `customerKeys` | ✅ |
| use-employees.ts | ✅ | ✅ `employeeKeys` | ✅ |
| use-entity.ts | ✅ | ✅ Generic factory | ✅ |
| use-orders.ts | ✅ | ✅ `orderKeys` | ✅ |
| use-paginated-data.ts | ✅ | ✅ Generic | ✅ |
| use-products.ts | ✅ | ✅ `productKeys` | ✅ |
| use-suppliers.ts | ✅ | ✅ `supplierKeys` | ✅ |

#### 7.2 Feature Hooks Audit

| Module | Hooks | React Query | queryKeys | Score |
|--------|-------|-------------|-----------|-------|
| **employees** | 2 | ✅ use-employees | ✅ employeeKeys | **95%** |
| **orders** | 10 | ✅ use-orders | ✅ orderKeys | **80%** |
| **products** | 9 | ✅ use-products | ✅ productKeys | **85%** |
| **customers** | 7 | ✅ use-customers | ✅ customerKeys | **85%** |
| **complaints** | 12 | ✅ use-complaints | ✅ complaintKeys | **70%** |
| **warranty** | 18 | ✅ use-warranties | ✅ warrantyKeys | **65%** |
| **tasks** | 2 | ✅ use-tasks | ✅ taskKeys | **95%** |

**Điểm trung bình: 78%**

#### 7.3 Issues Found

**🔴 Critical Issues:**

1. **Duplicate hook:**
   - `features/orders/hooks/use-debounce.ts` duplicates `hooks/use-debounce.ts`
   - **Action:** Delete duplicate, use global version

2. **Misplaced hooks:**
   - `hooks/use-product-cache.ts` → Should be in `features/products/hooks/`
   - `hooks/use-workflow-templates.ts` → Contains warranty-specific code

**🟡 Moderate Issues:**

3. **Missing React Query in data hooks:**
   - `hooks/use-settings.ts` - Manual fetch + useState
   - `hooks/use-system-settings.ts` - Manual fetch
   - `hooks/use-reminder-settings.ts` - Manual fetch
   - `hooks/use-init-integration-settings.ts` - Manual fetch

4. **Inline queryKeys (not using factory):**
   - `features/products/hooks/use-pkgx-sync.ts`
   - `features/customers/hooks/use-customer-sla.ts`

5. **Zustand store in hooks instead of React Query:**
   - `features/orders/hooks/use-orders-store.ts`
   - `features/warranty/hooks/use-warranty-actions.ts`

**🟢 Deprecated hook:**
   - `hooks/use-lazy-image.tsx` - Marked deprecated, verify no usage

#### 7.4 Compliance Summary

| Area | Score | Notes |
|------|-------|-------|
| Global hooks (hooks/) | 60% | Many data hooks don't use React Query |
| hooks/api/ | **95%** | Excellent queryKeys factory pattern |
| employees/hooks/ | **95%** | Excellent implementation |
| orders/hooks/ | 80% | Mixed patterns, has duplicate |
| products/hooks/ | 85% | Good core, some UI hooks |
| customers/hooks/ | 85% | Good core hooks |
| complaints/hooks/ | 70% | Good base, many handlers w/o RQ |
| warranty/hooks/ | 65% | Good base, many use Zustand |
| tasks/hooks/ | **95%** | Excellent implementation |

#### 7.5 Action Items

**Immediate:**
- [ ] Delete `features/orders/hooks/use-debounce.ts` (duplicate)
- [ ] Move `hooks/use-product-cache.ts` → `features/products/hooks/`
- [ ] Delete deprecated `hooks/use-lazy-image.tsx`

**Medium-term:**
- [ ] Migrate `use-settings.ts` to React Query
- [ ] Migrate `use-system-settings.ts` to React Query
- [ ] Add queryKeys factory to `use-pkgx-sync.ts`
- [ ] Add queryKeys factory to `use-customer-sla.ts`

**Long-term:**
- [ ] Migrate Zustand-based hooks to React Query
- [ ] Create shared hook generator for common patterns

---

**📊 Phase 7 Summary:**
- **Total Hooks Audited:** 70+ hooks
- **Global Score:** 60% (hooks/)
- **API Hooks Score:** 95% (hooks/api/)
- **Feature Hooks Average:** 78%
- **Issues Found:** 3 critical, 5 moderate, 1 minor

---

### Phase 8: Store (Zustand) Audit - Tuần 6

> **Mục tiêu:** Đảm bảo stores chỉ chứa UI state, server data dùng React Query

#### 8.1 Liệt kê tất cả Stores

| # | Store | Vị trí | Chứa gì | Action |
|---|-------|--------|---------|--------|
| 1 | ⬜ useEmployeeStore | features/employees/store.ts | data + UI | ⚠️ Migrate data → RQ |
| 2 | ⬜ useComplaintStore | features/complaints/store.ts | data + UI | ⚠️ Migrate data → RQ |
| 3 | ⬜ useWarrantyStore | features/warranty/store/store.ts | data + UI | ⚠️ Migrate data → RQ |
| 4 | ⬜ useOrderStore | features/orders/store/store.ts | data + UI | ⚠️ Migrate data → RQ |
| 5 | ⬜ useProductStore | features/products/store.ts | data + UI | ⚠️ Migrate data → RQ |
| 6 | ⬜ useCustomerStore | features/customers/store/*.ts | data + UI | ⚠️ Migrate data → RQ |
| 7 | ⬜ useUIStore | ? | UI only | ✅ Giữ nguyên |
| ... | ... | ... | ... | ... |

#### 8.2 Phân loại Store Content

| Content Type | Nên ở đâu | Ví dụ |
|--------------|-----------|-------|
| **Server data (list)** | React Query | employees, orders, products |
| **Server data (detail)** | React Query | employee detail, order detail |
| **UI state (modal)** | Zustand hoặc useState | isDialogOpen, selectedIds |
| **UI state (view mode)** | Zustand + persist | viewMode: 'table' \| 'kanban' |
| **Form state** | react-hook-form | form values, errors |
| **Filter state** | URL params hoặc useState | search, status filter |

#### 8.3 Kết quả Audit ✅ HOÀN THÀNH (06/01/2026)

**Tổng số: 68+ store files**

##### 8.3.1 Entity Stores (❌ Server Data - Need Migration)

| Category | Count | Examples | Score |
|----------|-------|----------|-------|
| **Core Business** | 4 | employees, orders, products, customers | 1/5 |
| **Transactional** | 10 | receipts, payments, shipments, inventory-* | 1/5 |
| **Supporting** | 6 | suppliers, warranty, complaints, tasks | 1-2/5 |
| **Settings** | 18 | branches, departments, job-titles, taxes, etc. | 1/5 |
| **Task-related** | 3 | templates, recurring, custom-fields | 1/5 |
| **TOTAL** | **49** | | **1.2/5 avg** |

##### 8.3.2 UI/Client State Stores (✅ Keep in Zustand)

| Store | Purpose | Score |
|-------|---------|-------|
| global-page-size | Page size preferences | 5/5 |
| appearance | Theme, font, colors | 5/5 |
| print-templates | Print config | 4/5 |
| card-colors | Task card colors | 5/5 |
| sla-settings | SLA thresholds | 4/5 |
| stock-alert | Low stock thresholds | 5/5 |
| dimensions | Default dimensions | 5/5 |
| sales-workflow | Sales workflow flags | 5/5 |
| **TOTAL: 10** | | **4.8/5 avg** |

##### 8.3.3 Integration Stores (⚠️ Mixed)

| Store | Content | Score | Action |
|-------|---------|-------|--------|
| pkgx/store | API config + sync logs | 2/5 | Partial migrate |
| trendtech/store | API config + sync logs | 2/5 | Partial migrate |

##### 8.3.4 Score Distribution

| Score | Count | % | Description |
|-------|-------|---|-------------|
| 5/5 | 10 | 15% | ✅ Pure UI - Keep |
| 4/5 | 4 | 6% | ✅ Mostly UI - Keep |
| 3/5 | 1 | 1% | ⚠️ Mixed - Review |
| 2/5 | 4 | 6% | ⚠️ Mostly server - Migrate |
| 1/5 | **49** | **72%** | ❌ Server data - Migrate |

#### 8.4 Best Practices Compliance

| Practice | Status | Notes |
|----------|--------|-------|
| Store Factory (`createCrudStore`) | ✅ | Consistent CRUD interface |
| Slice Pattern | ✅ | Complex stores use slices |
| TypeScript Types | ✅ | All stores properly typed |
| **No localStorage** | ✅ | **Removed - DB is source of truth** |
| Selectors | ⚠️ | Limited usage |
| API Sync | ⚠️ | `syncWithApi` helper exists but underutilized |

#### 8.5 Critical Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| 🔴 Server data in Zustand | Critical | 49 stores (72%) hold entity data |
| 🔴 No stale-while-revalidate | High | Missing cache invalidation |
| 🟡 No optimistic updates | Medium | Updates wait for API |
| 🟡 Coupled business logic | Medium | Stock/debt updates tightly coupled |
| 🟡 Missing error handling | Medium | Most actions don't handle failures |

#### 8.6 Migration Priority

**Priority 1: Core Business (High Traffic)**
1. orders/store → React Query
2. products/store → React Query  
3. customers/store → React Query
4. employees/store → React Query

**Priority 2: Transactional**
5. inventory-receipts, inventory-checks, stock-transfers
6. payments, receipts
7. purchase-orders, purchase-returns, sales-returns
8. shipments

**Priority 3: Supporting**
9. warranty, complaints, tasks
10. suppliers, wiki

**Priority 4: Settings**
11. All settings/*/store

#### 8.7 Action Items

- [ ] **Keep in Zustand (10 stores):** appearance, page-size, print-templates, card-colors, sla-settings, stock-alert, dimensions, sales-workflow
- [ ] **Migrate to React Query (49 stores):** All entity stores
- [ ] **Hybrid approach (2 stores):** pkgx, trendtech - keep config in Zustand, move sync data to RQ

---

**📊 Phase 8 Summary:**
- **Total Stores:** 68+ files
- **Need Migration:** 49 (72%) 🔴
- **Can Keep:** 10 (15%) ✅
- **Mixed:** 9 (13%) ⚠️
- **Persist Usage:** 0 ✅ (all removed)
- **Critical Issue:** Most stores hold server data that should use React Query

---

### Phase 9: Types Audit - Tuần 6 ✅ HOÀN THÀNH (06/01/2026)

> **Mục tiêu:** Tổ chức types theo chuẩn, Zod là source of truth

#### 9.1 Global Types (`types/` folder)

| File | Purpose | Status |
|------|---------|--------|
| next-auth.d.ts | Next-Auth module augmentation | ✅ Correct - global auth types |
| tanstack-react-table.d.ts | React Table module augmentation | ✅ Correct - global table types |

**Verdict:** Both files are appropriate `.d.ts` declarations.

#### 9.2 lib/types/ Analysis

| File | Lines | Types | Assessment |
|------|-------|-------|------------|
| **prisma-extended.ts** | **4175** | **200+** | 🔴 **MASSIVE** - needs splitting |
| shipping-configuration.ts | 170 | ~15 | ✅ OK |

**Critical Issue:** `lib/types/prisma-extended.ts` contains ALL feature types (4175 lines, 200+ types). This is a maintenance nightmare and causes slow imports.

#### 9.3 Feature Types Coverage

| Feature | types.ts | validation.ts | Infer from Zod | Status |
|---------|:--------:|:-------------:|:--------------:|--------|
| **employees** | ✅ Re-exports | ✅ | ✅ | ✅ Complete |
| **products** | ✅ Re-exports | ✅ | ✅ | ✅ Complete |
| **customers** | ✅ Re-exports | ✅ | ✅ | ✅ Complete |
| **leaves** | ✅ Re-exports | ✅ | ✅ | ✅ Complete |
| settings/pricing | ✅ | ✅ | ✅ | ✅ Complete |
| settings/customers | ✅ | ✅ | ✅ | ✅ Complete |
| **orders** | ✅ Re-exports | ❌ | ❌ | ⚠️ Missing validation |
| **complaints** | ✅ Re-exports | ❌ | ❌ | ⚠️ Missing validation |
| **warranty** | ✅ + constants | ❌ | ❌ | ⚠️ Missing validation |
| **tasks** | ✅ Re-exports | ❌ | ❌ | ⚠️ Missing validation |
| **suppliers** | ✅ Re-exports | ❌ | ❌ | ⚠️ Missing validation |
| inventory-checks | ✅ Re-exports | ❌ | ❌ | ⚠️ Missing validation |
| inventory-receipts | ✅ Re-exports | ❌ | ❌ | ⚠️ Missing validation |
| stock-transfers | ✅ Re-exports | ❌ | ❌ | ⚠️ Missing validation |
| purchase-orders | ✅ Re-exports | ❌ | ❌ | ⚠️ Missing validation |
| sales-returns | ✅ Re-exports | ❌ | ❌ | ⚠️ Missing validation |
| payments | ✅ + labels | ❌ | ❌ | ⚠️ Missing validation |
| receipts | ✅ + labels | ❌ | ❌ | ⚠️ Missing validation |
| shipments | ✅ Re-exports | ❌ | ❌ | ⚠️ Missing validation |
| attendance | ✅ Local types | ❌ | ❌ | ⚠️ Has own types |
| **payroll** | ❌ | ❌ | ❌ | ❌ No types file |
| **brands** | ❌ | ❌ | ❌ | ❌ No types file |
| **categories** | ❌ | ❌ | ❌ | ❌ No types file |

#### 9.4 Zod Validation Files (6 total)

| File | Schemas | Types Inferred |
|------|---------|----------------|
| products/validation.ts | `productFormSchema` | ✅ `ProductFormData` |
| employees/validation.ts | `employeeSchema` | ✅ `EmployeeFormData` |
| customers/validation.ts | `customerSchema` | ✅ `CustomerFormData` |
| settings/pricing/validation.ts | `pricingPolicySchema` | ✅ `PricingPolicyFormData` |
| settings/customers/validation.ts | 7 schemas | ✅ All inferred |
| leaves/validation.ts | `leaveRequestSchema` | ✅ `LeaveRequestFormData` |

#### 9.5 Issues Found

**🔴 Critical Issues:**

| Issue | Location | Impact |
|-------|----------|--------|
| Massive centralized type file | `prisma-extended.ts` (4175 lines) | Hard to maintain, slow imports |
| 15+ features missing validation | orders, complaints, warranty, tasks, etc. | Runtime errors, inconsistent data |
| 3 features missing types | payroll, brands, categories | Types scattered |

**🟡 Moderate Issues:**

| Issue | Location | Impact |
|-------|----------|--------|
| Duplicate attendance types | types.ts vs prisma-extended | Same types in 2 places |
| Deprecated types still present | `OrderV1Type`, `OrderV2Type` | Technical debt |
| Inconsistent naming | `WarrantyType` vs `WarrantyStatus` vs `WarrantyStatusValue` | No convention |
| Mixed status formats | Vietnamese vs English | Inconsistent API |

#### 9.6 Statistics

| Metric | Count |
|--------|-------|
| Global types files | 2 |
| Feature types files | 67 |
| Validation files | **6** |
| Types inferred from Zod | 12 |
| Types in prisma-extended | **200+** |
| Features missing validation | **15** 🔴 |
| Features missing types | 3 |

#### 9.7 Action Items

**Priority 1: Add Missing Validation (15 features)**
- [ ] orders/validation.ts
- [ ] complaints/validation.ts
- [ ] warranty/validation.ts
- [ ] tasks/validation.ts
- [ ] suppliers/validation.ts
- [ ] purchase-orders/validation.ts
- [ ] sales-returns/validation.ts
- [ ] shipments/validation.ts
- [ ] inventory-checks/validation.ts
- [ ] inventory-receipts/validation.ts
- [ ] stock-transfers/validation.ts
- [ ] payments/validation.ts
- [ ] receipts/validation.ts
- [ ] attendance/validation.ts
- [ ] payroll/validation.ts

**Priority 2: Split prisma-extended.ts**
- [ ] Move entity types to respective features
- [ ] Keep only common types in lib/types/common.ts

**Priority 3: Add Missing types.ts**
- [ ] payroll/types.ts
- [ ] brands/types.ts
- [ ] categories/types.ts

---

**📊 Phase 9 Summary:**
- **Global types:** 2 files ✅
- **Feature types:** 67 files (3 missing)
- **Validation files:** 6 (15 missing) 🔴
- **Zod coverage:** 29% (6/21 major features)
- **Critical Issue:** `prisma-extended.ts` has 4175 lines, 200+ types - needs splitting

---

### Phase 10: App Folder Audit - Tuần 7 ✅ HOÀN THÀNH (06/01/2026)

> **Mục tiêu:** Đảm bảo app/ chỉ là routing layer (Thin Page Pattern)

#### 10.1 Tổng quan App Routes

| Metric | Count |
|--------|-------|
| Total page.tsx files | **132** |
| Route folders | **40** |
| Loading.tsx files | 1 (root only) |
| Error.tsx files | 1 (root only) |

#### 10.2 Page Size Analysis

| Category | Lines | Count | % | Status |
|----------|-------|-------|---|--------|
| **Thin** (≤15) | 11-15 | **128** | **97%** | ✅ Excellent |
| **OK** (16-50) | - | 0 | 0% | |
| **Medium** (51-100) | - | 0 | 0% | |
| **Fat** (>100) | 115-202 | **4** | **3%** | ⚠️ Test pages |

**Fat Pages (test only):**
| Page | Lines | Purpose |
|------|-------|---------|
| test-upload/page.tsx | 202 | Test file upload |
| test-api/page.tsx | 115 | Test React Query API |

#### 10.3 Thin Page Pattern Compliance

**Sample Thin Page (11 lines):**
```tsx
import type { Metadata } from 'next'
import { EmployeesPage } from '@/features/employees/page'

export const metadata: Metadata = {
  title: 'Nhân viên',
  description: 'Quản lý thông tin nhân viên',
}

export default function Page() {
  return <EmployeesPage />
}
```

**✅ All 128 production pages follow this pattern!**

#### 10.4 Route Structure

| Route | Subfolders | Total Pages | Status |
|-------|------------|-------------|--------|
| employees | [systemId], [systemId]/edit, new | 4 | ✅ |
| orders | [systemId], [systemId]/edit, new | 4 | ✅ |
| products | [systemId], [systemId]/edit, new, trash | 5 | ✅ |
| customers | [systemId], [systemId]/edit, new | 4 | ✅ |
| complaints | [systemId], [systemId]/edit, new | 4 | ✅ |
| warranty | [systemId], [systemId]/edit, new, statistics | 6 | ✅ |
| tasks | [systemId], [systemId]/edit, new, calendar | 5 | ✅ |
| suppliers | [systemId], [systemId]/edit, new, trash | 5 | ✅ |
| settings | 22 subfolders | 24 | ✅ |
| ... (30+ more) | | | ✅ |

#### 10.5 Best Practices Compliance

| Practice | Status | Notes |
|----------|--------|-------|
| Thin Page Pattern | ✅ **97%** | Only test pages are exceptions |
| Metadata exports | ✅ 100% | All pages have metadata |
| Server Components | ✅ 100% | All route pages are Server Components |
| Feature delegation | ✅ 100% | All import from `@/features/*/page` |
| No business logic | ✅ 100% | No logic in app/ pages |

#### 10.6 Minor Issues (Not Critical)

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Missing loading.tsx | Individual routes | Add per-route loading.tsx |
| Missing error.tsx | Individual routes | Add per-route error.tsx |
| Test pages with logic | test-api, test-upload | Keep as-is (test only) |

---

**📊 Phase 10 Summary:**
- **Total Pages:** 132
- **Thin Pages:** 128 (97%) ✅
- **Fat Pages:** 4 (3%) - all test pages
- **Pattern Compliance:** 100% ✅
- **Grade:** **A+** - Excellent Thin Page Pattern implementation!

---

### Phase 11: Prisma/Database Audit - Tuần 7 ✅ HOÀN THÀNH

> **Mục tiêu:** Đảm bảo schema có đủ indexes, queries tối ưu
> **Kết quả:** 73 models, 71 indexes, đã audit xong

#### 11.1 Tổng Quan Schema

| Metric | Số lượng | Ghi chú |
|--------|----------|---------|
| **Total Models** | 73 | Multi-file schema |
| **Total Indexes** | 71 | @@index declarations |
| **Models với Index** | 34 | 47% có index |
| **Models không Index** | 39 | 53% cần review |
| **Schema Files** | 43 | prisma/schema/ folder |
| **Schema Folders** | 13 | auth, common, finance, hrm, inventory, operations, procurement, sales, settings, system, wiki |

#### 11.2 Models Có Index (34 models) ✅

| # | Model | Indexes | Status |
|---|-------|---------|--------|
| 1 | ✅ Order | branchId, customerId, orderDate, status | ✅ Good |
| 2 | ✅ Employee | branchId, departmentId, employmentStatus | ✅ Good |
| 3 | ✅ Product | brandId, isActive, createdAt | ✅ Good |
| 4 | ✅ Customer | phone, email, name | ✅ Good |
| 5 | ✅ AuditLog | entityType, createdAt | ✅ Good |
| 6 | ✅ Complaint | status, createdAt | ✅ Good |
| 7 | ✅ Warranty | status, createdAt | ✅ Good |
| 8 | ✅ Task | status, dueDate, assigneeId | ✅ Good |
| 9 | ✅ Payment | paymentDate, status | ✅ Good |
| 10 | ✅ Receipt | receiptDate, type | ✅ Good |
| 11 | ✅ Shipment | shipDate, status | ✅ Good |
| 12 | ✅ StockTransfer | transferDate, status | ✅ Good |
| 13 | ✅ PurchaseOrder | orderDate, status | ✅ Good |
| 14 | ✅ SalesReturn | returnDate, status | ✅ Good |
| 15 | ✅ Leave | startDate, status | ✅ Good |
| 16 | ✅ AttendanceRecord | date, employeeId | ✅ Good |
| 17 | ✅ CashTransaction | transactionDate, type | ✅ Good |
| 18 | ✅ InventoryCheck | checkDate, status | ✅ Good |
| 19 | ✅ WikiPage | createdAt, categoryId | ✅ Good |
| 20 | ✅ Comment | createdAt, entityType | ✅ Good |
| + | ... | 14 more models với indexes | ✅ Good |

#### 11.3 Models KHÔNG Có Index (39 models) - Cần Review

| # | Model | Thường query by | Cần thêm Index |
|---|-------|-----------------|----------------|
| 1 | 🔴 User | email, role | @@index([email]), @@index([role]) |
| 2 | 🔴 Branch | name, isActive | @@index([isActive]) |
| 3 | 🔴 Department | branchId, name | @@index([branchId]) |
| 4 | 🔴 Supplier | name, phone | @@index([name]) |
| 5 | 🔴 Category | parentId, name | @@index([parentId]) |
| 6 | 🔴 Brand | name, isActive | @@index([name]) |
| 7 | 🔴 StockLocation | branchId, type | @@index([branchId]) |
| 8 | 🔴 ProductInventory | productId, locationId | @@index([productId, locationId]) |
| 9 | 🔴 ProductPrice | productId | @@index([productId]) |
| 10 | 🔴 ProductCategory | productId, categoryId | @@index([productId]) |
| 11 | 🔴 OrderLineItem | orderId | @@index([orderId]) |
| 12 | 🔴 Packaging | status, createdAt | @@index([status]) |
| 13 | 🔴 Payroll | month, year | @@index([month, year]) |
| 14 | 🔴 CostAdjustment | adjustmentDate | @@index([adjustmentDate]) |
| 15 | 🔴 InventoryReceipt | receiptDate | @@index([receiptDate]) |
| + | ... | 24 more models | Need review |

#### 11.4 Query Patterns Analysis

| Pattern | Instances | Status |
|---------|-----------|--------|
| **`include: {}`** | 50+ | ✅ Sử dụng eager loading tốt |
| **`select: {}`** | 30+ | ✅ Có optimize với select |
| **`orderBy: { createdAt }`** | 30+ | ⚠️ Nhiều bảng thiếu index createdAt |
| **`skip + take`** | 20+ | ✅ Pagination implemented |
| **N+1 Queries** | 0 | ✅ Không phát hiện N+1 |

#### 11.5 API Routes Query Patterns

| Route | Patterns Used | N+1 Safe? |
|-------|---------------|-----------|
| /api/orders | include + select | ✅ |
| /api/employees | include + pagination | ✅ |
| /api/products | include nested | ✅ |
| /api/customers | include + count | ✅ |
| /api/warranties | include + select | ✅ |
| /api/tasks | include + select nested | ✅ |
| /api/shipments | include nested 2 levels | ✅ |
| /api/purchase-orders | include nested | ✅ |
| /api/sales-returns | include | ✅ |
| /api/suppliers | include + _count | ✅ |

#### 11.6 Điểm Đánh Giá Phase 11

| Tiêu chí | Max | Điểm | Ghi chú |
|----------|-----|------|---------|
| Schema Organization | 5 | **5** | Multi-file, well-organized |
| Index Coverage | 5 | **3** | 47% có index, cần thêm |
| Query Optimization | 5 | **4** | Dùng select, include tốt |
| N+1 Prevention | 5 | **5** | Không phát hiện N+1 |
| Pagination | 5 | **4** | skip+take OK, nên cursor |
| **TỔNG** | **25** | **21/25** | **84%** |

#### 11.7 Tasks - Improvements Needed

- [x] **Audit** tổng số models và indexes
- [x] **Check** N+1 queries trong API routes
- [x] **Review** select usage
- [ ] **TODO:** Thêm @@index cho 39 models còn thiếu
- [ ] **TODO:** Thêm @@index([createdAt]) cho bảng dùng orderBy createdAt
- [ ] **TODO:** Consider cursor-based pagination cho large datasets

#### 11.8 Summary

**✅ ĐIỂM MẠNH:**
- Schema organization tốt (multi-file, 13 folders)
- Không có N+1 queries trong API routes
- Sử dụng select optimization
- Eager loading với include proper
- Pagination implemented

**🔴 CẦN CẢI THIỆN:**
- 39/73 models (53%) chưa có index
- Nên thêm index cho createdAt trên các bảng có orderBy
- Consider cursor pagination thay skip+take

---

## 📊 Bảng Theo Dõi Tiến Độ

### Tổng Quan

| Phase | Nội dung | Tổng | Hoàn thành | Còn lại | % |
|-------|----------|------|------------|---------|---|
| Phase 1 | Complex Modules | 7 | **7** | 0 | **100%** |
| Phase 2 | Medium Modules | 22 | **22** | 0 | **100%** |
| Phase 3 | Simple Modules | 7 | **6** | 1 | **86%** |
| Phase 4 | Settings | 32 | **32** | 0 | **100%** |
| Phase 5 | Global Improvements | 5 | **5** | 0 | **100%** |
| Phase 6 | API Routes Audit | 20 | **20** | 0 | **100%** |
| Phase 7 | Hooks Audit | 70 | **70** | 0 | **100%** |
| Phase 8 | Store Audit | 68 | **68** | 0 | **100%** |
| Phase 9 | Types Audit | 73 | **73** | 0 | **100%** |
| Phase 10 | App Folder Audit | 132 | **132** | 0 | **100%** |
| Phase 11 | Prisma/DB Audit | 73 | **73** | 0 | **100%** |
| **TỔNG** | | **509** | **508** | **1** | **99.8%** |

### Điểm Trung Bình Theo Phase

| Phase | Modules đã đánh giá | Điểm TB |
|-------|---------------------|---------|
| Phase 1 | **7/7** | **20.3/25** ⬆️ |
| Phase 2 | **22/22** | **17.4/25** |
| Phase 3 | **6/7** | **17.8/25** |
| Phase 4 | **32/32** | **14.5/25** |
| Phase 5 | **177 files** | **20.3/25** |
| Phase 6 | **20 routes** | **2/5** 🔴 |
| Phase 7 | **70+ hooks** | **78%** |
| Phase 8 | **68 stores** | **28%** 🔴 |
| Phase 9 | **73 type files** | **29%** 🔴 |
| Phase 10 | **132 pages** | **97%** ✅ |
| Phase 11 | **73 models** | **21/25** (84%) ✅ |

---

## 🏁 FINAL SUMMARY - TẤT CẢ 11 PHASES ĐÃ HOÀN THÀNH

### Overall Health Score

| Category | Score | Grade |
|----------|-------|-------|
| **Feature Modules (P1-4)** | 17.3/25 | B (69%) |
| **Global Components (P5)** | 20.3/25 | B+ (81%) |
| **API Routes (P6)** | 2/5 | F (40%) 🔴 |
| **Hooks (P7)** | 78% | B (78%) |
| **Stores (P8)** | 28% | F (28%) 🔴 |
| **Types (P9)** | 29% | F (29%) 🔴 |
| **App Pages (P10)** | 97% | A+ (97%) ✅ |
| **Prisma/DB (P11)** | 84% | B+ (84%) |
| **OVERALL** | **53%** | **C** |

### 🔴 CRITICAL ISSUES (cần fix ngay)

| Issue | Impact | Priority |
|-------|--------|----------|
| **API Routes: 0% auth** | Security Risk | P0 - CRITICAL |
| **API Routes: 0% Zod** | Data Integrity | P0 - CRITICAL |
| **Stores: 72% cần migration** | Performance | P1 - HIGH |
| **Types: 9 features thiếu Zod** | Type Safety | P1 - HIGH | ⬇️ (was 15)
| **Prisma: 39 models thiếu index** | Query Performance | P2 - MEDIUM |

### ✅ STRENGTHS

| Area | Score | Note |
|------|-------|------|
| **Thin Page Pattern** | 97% | Excellent app folder structure |
| **React Query Usage** | 95% | hooks/api fully migrated |
| **N+1 Prevention** | 100% | No N+1 queries found |
| **Component Organization** | 81% | Well-structured components |
| **Prisma Schema** | 84% | Multi-file, well-organized |

### 📋 IMMEDIATE ACTION ITEMS

1. **[P0] Add auth() to ALL API routes** - 0% → 100%
2. **[P0] Add Zod validation to ALL API routes** - 0% → 100%
3. **[P1] Migrate 49 stores to React Query** - 28% → 100%
4. ~~**[P1] Add validation.ts to 15 features**~~ - ✅ Phase 1 done (6 → 12), còn 9
5. **[P2] Add @@index to 39 Prisma models** - 47% → 100%
6. **[P2] Refactor purchase-orders (1299 lines)**
7. **[P2] Refactor attendance (854 lines)**

---

### Phase 1 Chi Tiết (✅ HOÀN THÀNH + IMPROVED 06/01/2026)

| Module | Điểm | Structure | Data | Perf | Types | API | Cải thiện |
|--------|------|-----------|------|------|-------|-----|-----------|
| employees | 20/25 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Tách columns ra detail/columns/ |
| complaints | 20/25 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Thêm validation.ts |
| warranty | 19/25 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Thêm validation.ts |
| orders | 20/25 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Thêm validation.ts |
| tasks | 19/25 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Thêm validation.ts |
| products | 22/25 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Thêm column-helpers.tsx |
| reports | 23/25 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Thêm validation.ts |

**📝 Changes Made (06/01/2026):**
- ✅ `employees`: Tách 4 column files ra `detail/columns/` (payroll, attendance, penalty, leave)
- ✅ `complaints`: Tạo `validation.ts` với 9 Zod schemas
- ✅ `warranty`: Tạo `validation.ts` với 10 Zod schemas  
- ✅ `orders`: Tạo `validation.ts` với 9 Zod schemas
- ✅ `tasks`: Tạo `validation.ts` với 12 Zod schemas
- ✅ `products`: Tạo `column-helpers.tsx` - tách helpers từ columns.tsx (1066→950 lines)
- ✅ `reports`: Tạo `validation.ts` với 7 query schemas

**✅ VERIFIED (06/01/2026):**
- Tất cả 7 modules có `validation.ts` ✅
- Tất cả 6 modules có `types.ts` (reports không cần) ✅
- Tất cả 6 modules có `columns.tsx` (reports không cần) ✅
- Tất cả 7 modules có React Query hooks (`useQuery`, `queryKeys`) ✅
- Tất cả 7 modules có `api/` folder ✅
- Tất cả 6 modules có `components/` folder (reports minimal) ✅

**Điểm TB mới: 20.4/25** (tăng từ 19.4/25)

### Phase 2 Chi Tiết (✅ HOÀN THÀNH - 06/01/2026)

| Group | Modules | Điểm TB | Vấn đề |
|-------|---------|---------|--------|
| Inventory (5) | inventory-checks, inventory-receipts, stock-transfers, cost-adjustments, purchase-returns | 17.2/25 | inventory-receipts cần tách columns |
| Finance (4+1) | cashbook, payments, receipts, reconciliation (finance = helpers only) | 17.5/25 | OK |
| HR (4) | attendance, leaves, payroll, customers | 17.5/25 | attendance > 800 lines cần refactor |
| Sales (4) | purchase-orders, sales-returns, shipments, packaging | 17.3/25 | **purchase-orders > 1000 lines - URGENT** |
| Other (4) | suppliers, wiki, dashboard, auth | 18/25 | OK |

**🔴 REFACTOR PRIORITY:**
1. `purchase-orders/page.tsx` (1299 lines) - Cần tách handlers ra hooks riêng
2. `attendance/page.tsx` (854 lines) - Cần tách components
3. `inventory-receipts/page.tsx` (712 lines) - Cần tách columns.tsx

---

## 📅 Timeline Chi Tiết

```
Tuần 1 (06/01 - 12/01):
├── Thứ 2: products - Đánh giá & tối ưu
├── Thứ 3: reports - Đánh giá & tối ưu  
├── Thứ 4-5: Buffer cho Phase 1
└── Thứ 6: Review & document

Tuần 2 (13/01 - 19/01):
├── Thứ 2-3: Inventory Group (5 modules)
├── Thứ 4-5: Finance Group (5 modules)
└── Thứ 6: Review & document

Tuần 3 (20/01 - 26/01):
├── Thứ 2-3: HR Group (4 modules)
├── Thứ 4-5: Sales Group (4 modules) + Other (4 modules)
└── Thứ 6: Review & document

Tuần 4 (27/01 - 02/02):
├── Thứ 2: Simple modules (7 modules - nhanh)
├── Thứ 3-5: Settings sub-modules (32 modules)
└── Thứ 6: Review & document

Tuần 5 (03/02 - 09/02):
├── Thứ 2: Phase 5 - Global improvements
├── Thứ 3: Phase 6 - API Routes audit
├── Thứ 4: Phase 7 - Hooks audit
└── Thứ 5-6: Phase 8 - Store audit

Tuần 6 (10/02 - 16/02):
├── Thứ 2-3: Phase 9 - Types audit
├── Thứ 4-5: Phase 10 - App folder audit
└── Thứ 6: Phase 11 - Prisma/DB audit

Tuần 7 (17/02 - 23/02):
├── Thứ 2-3: Final fixes & refactoring
├── Thứ 4: Final review
└── Thứ 5-6: Documentation & handoff
```

---

## ✅ Definition of Done

Một module được coi là **HOÀN THÀNH** khi:

1. ✅ `page.tsx` < 400 lines
2. ✅ `columns.tsx` tách riêng (nếu có table)
3. ✅ Heavy components lazy loaded
4. ✅ React Query hooks với `keepPreviousData`
5. ✅ Zod validation cho forms
6. ✅ Direct imports (không barrel)
7. ✅ Điểm đánh giá ≥ 15/25
8. ✅ Không có TypeScript errors
9. ✅ Không có ESLint errors

---

*Cập nhật lần cuối: 05/01/2026*


