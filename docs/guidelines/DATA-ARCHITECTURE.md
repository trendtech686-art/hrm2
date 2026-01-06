# Kiến trúc Dữ liệu & Types

> **Tài liệu này mô tả quy tắc về cách tổ chức types, stores, và data trong dự án HRM2.**

## 📊 Sơ đồ Tổng quan

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRISMA SCHEMA                                   │
│                         (prisma/schema.prisma)                               │
│                    📦 Nguồn gốc định nghĩa dữ liệu                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ npx prisma generate
┌─────────────────────────────────────────────────────────────────────────────┐
│                        generated/prisma/index.ts                             │
│                    🤖 Auto-generated types từ Prisma                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ extend & re-export
┌─────────────────────────────────────────────────────────────────────────────┐
│                      lib/types/prisma-extended.ts                            │
│              🎯 SINGLE SOURCE OF TRUTH cho toàn bộ types                     │
│         (Prisma types + Custom types + Business logic types)                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ re-export
┌─────────────────────────────────────────────────────────────────────────────┐
│                      features/xxx/types.ts                                   │
│              📝 Re-export types cần thiết cho feature                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ import types
┌─────────────────────────────────────────────────────────────────────────────┐
│                      features/xxx/store.ts                                   │
│              🏪 Zustand store - State management                             │
│                    (data: [] - khởi tạo rỗng)                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ CRUD via API
┌─────────────────────────────────────────────────────────────────────────────┐
│                      features/xxx/api/route.ts                               │
│              🌐 API Routes - Giao tiếp với Database                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ Prisma Client
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE (PostgreSQL)                              │
│                         💾 Dữ liệu thực tế                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ Prisma Schema

**Đường dẫn:** `prisma/schema.prisma`

**Vai trò:** Định nghĩa cấu trúc database - là nguồn gốc của mọi type.

```prisma
model Product {
  id          String   @id @default(cuid())
  systemId    String   @unique
  name        String
  sku         String   @unique
  price       Decimal
  isActive    Boolean  @default(true)
  isDeleted   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  category    ProductCategory? @relation(fields: [categoryId], references: [id])
  categoryId  String?
}
```

**Quy tắc:**
- ✅ Mọi entity đều có `systemId` (unique identifier cho business logic)
- ✅ Mọi entity đều có `isDeleted` (soft delete)
- ✅ Mọi entity đều có `createdAt`, `updatedAt`
- ✅ Chạy `npx prisma generate` sau khi thay đổi schema

---

## 2️⃣ prisma-extended.ts

**Đường dẫn:** `lib/types/prisma-extended.ts`

**Vai trò:** Single Source of Truth cho toàn bộ TypeScript types.

```typescript
// Re-export Prisma generated types
export type { Product, Customer, Order } from '@prisma/client';

// Extended types với business logic
export type ProductWithRelations = Product & {
  category?: ProductCategory;
  brand?: Brand;
};

// Custom types không có trong Prisma
export type SystemId = string & { readonly __brand: 'SystemId' };
export type BusinessId = string & { readonly __brand: 'BusinessId' };

// Enums và constants
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
```

**Quy tắc:**
- ✅ Đây là nơi DUY NHẤT định nghĩa types
- ✅ Re-export từ Prisma generated types
- ✅ Extend types khi cần thêm relations hoặc computed fields
- ✅ Định nghĩa branded types (SystemId, BusinessId)
- ❌ KHÔNG import types từ nơi khác (trừ @prisma/client)

---

## 3️⃣ Feature types.ts

**Đường dẫn:** `features/xxx/types.ts`

**Vai trò:** Re-export types từ `prisma-extended` hoặc định nghĩa types riêng của feature.

### Trường hợp 1: Chỉ re-export (CÓ THỂ XÓA)

```typescript
// features/products/types.ts
// ⚠️ FILE NÀY CÓ THỂ XÓA - import trực tiếp từ prisma-extended
export type { Product, ProductCategory } from '@/lib/types/prisma-extended';
```

**→ Khuyến nghị:** Nếu feature chỉ re-export types, **XÓA file này** và import trực tiếp:

```typescript
// Thay vì: import { Product } from './types';
// Dùng:    import type { Product } from '@/lib/types/prisma-extended';
```

### Trường hợp 2: Có types riêng (GIỮ LẠI)

```typescript
// features/settings/tasks/types.ts
// ✅ GIỮ FILE NÀY - có types riêng không thuộc prisma-extended

export interface CardColorSettings {
  statusColors: { ... };
  priorityColors: { ... };
}

export interface SLASettings {
  enabled: boolean;
  // ...
}
```

**→ Khuyến nghị:** GIỮ file nếu có:
- Interface/type riêng của feature (form values, UI state, config)
- Types không phù hợp đưa vào `prisma-extended`

### Quy tắc types.ts

| Nội dung | Hành động |
|----------|-----------|
| Chỉ có `export type { X } from '@/lib/types/...'` | ❌ **XÓA FILE** |
| Có `export interface X { }` hoặc `export type X = { }` | ✅ **GIỮ FILE** |
| Mix cả 2 | ✅ Giữ file, bỏ các re-export không cần |

---

## 4️⃣ Feature store.ts

**Đường dẫn:** `features/xxx/store.ts`

**Vai trò:** Zustand store - quản lý local state và business logic.

### Khi nào CẦN store.ts?

| Trường hợp | Cần store? |
|------------|------------|
| Feature có business logic phức tạp (tính toán, workflow) | ✅ CẦN |
| Cần optimistic updates (UI cập nhật trước khi API trả về) | ✅ CẦN |
| Cần offline support | ✅ CẦN |
| Cần share state giữa nhiều components | ✅ CẦN |
| Chỉ CRUD đơn giản, không có logic | ⚠️ CÓ THỂ BỎ |
| Data chỉ cần fetch và hiển thị | ⚠️ Dùng React Query là đủ |

### Khi nào KHÔNG cần store.ts?

Nếu feature chỉ:
- Fetch data từ API và hiển thị
- CRUD đơn giản không có business logic
- Không cần share state phức tạp

**→ Chỉ cần React Query hooks là đủ:**

```typescript
// features/xxx/hooks/use-products.ts
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(r => r.json()),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => fetch('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}
```

### Mẫu store.ts (khi cần)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/types/prisma-extended';

// ✅ Khởi tạo rỗng - data sẽ được load từ database
const initialData: Product[] = [];

interface ProductState {
  data: Product[];
  isLoading: boolean;
  error: string | null;
  
  // CRUD
  add: (item: Omit<Product, 'systemId'>) => void;
  update: (systemId: SystemId, item: Partial<Product>) => void;
  remove: (systemId: SystemId) => void;
  
  // Queries
  findById: (systemId: SystemId) => Product | undefined;
  getActive: () => Product[];
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      data: initialData,
      isLoading: false,
      error: null,
      
      add: (item) => { /* ... */ },
      update: (systemId, item) => { /* ... */ },
      remove: (systemId) => { /* ... */ },
      
      findById: (systemId) => get().data.find(p => p.systemId === systemId),
      getActive: () => get().data.filter(p => !p.isDeleted && p.isActive),
    }),
    { name: 'product-storage' }
  )
);
```

**Quy tắc:**
- ✅ `initialData` luôn là array rỗng `[]`
- ✅ Import types từ `@/lib/types/prisma-extended`
- ✅ Sử dụng `persist` middleware nếu cần cache
- ✅ Implement soft delete (set `isDeleted: true`)
- ❌ KHÔNG hardcode mock data
- ❌ KHÔNG import từ `./data.ts`

---

## 5️⃣ Feature data.ts - ❌ XÓA

**Trạng thái:** ❌ **XÓA FILE NÀY**

### ⚠️ HÀNH ĐỘNG YÊU CẦU

Nếu feature còn file `data.ts` với mock data, **XÓA NGAY**:

```bash
# Xóa file data.ts
rm features/xxx/data.ts

# Cập nhật store.ts - bỏ import và dùng empty array
# Trước:
import { data as initialData } from './data';

# Sau:
const initialData: Product[] = [];
```

### Lý do phải xóa

| Vấn đề | Hậu quả |
|--------|---------|
| Confuse data thật vs giả | Dev không biết data từ đâu |
| Schema thay đổi | Mock data bị outdated, gây lỗi |
| Bundle size | Mock data làm tăng kích thước bundle |
| Inconsistent | Data trong code khác data trong DB |

### Thay thế bằng

1. **Prisma Seed** - Cho development/testing:
   ```typescript
   // prisma/seed.ts
   import { PrismaClient } from '@prisma/client';
   const prisma = new PrismaClient();
   
   async function main() {
     await prisma.product.createMany({
       data: [
         { systemId: 'SP001', name: 'iPhone 15', price: 25000000 },
         { systemId: 'SP002', name: 'Samsung S24', price: 22000000 },
       ],
     });
   }
   
   main();
   ```
   
   ```bash
   npx prisma db seed
   ```

2. **Database thật** - Production data từ database

### Ngoại lệ duy nhất

Chỉ giữ `data.ts` nếu nó chứa **utility function** (không phải mock data):

```typescript
// ✅ OK - Đây là utility function, không phải mock data
// features/attendance/data.ts
export function generateAttendanceGrid(employees, year, month, settings) {
  // Tạo cấu trúc grid chấm công rỗng
  return employees.map(emp => ({
    employeeSystemId: emp.systemId,
    ...createEmptyDays(year, month, settings)
  }));
}
```

---

## 📁 Cấu trúc thư mục Feature

### Cấu trúc tối thiểu (Simple CRUD)

```
features/
└── products/
    ├── api/                    # API routes
    │   └── route.ts           # GET, POST /api/products
    ├── hooks/                 # React Query hooks
    │   └── use-products.ts
    ├── components/            # React components
    │   └── product-list.tsx
    └── page.tsx               # Main page
```

### Cấu trúc đầy đủ (Complex feature)

```
features/
└── products/
    ├── api/                    # API routes
    │   ├── route.ts           # GET, POST /api/products
    │   └── [id]/
    │       └── route.ts       # GET, PUT, DELETE /api/products/[id]
    ├── components/            # React components
    │   ├── product-form.tsx
    │   ├── product-list.tsx
    │   └── product-card.tsx
    ├── hooks/                 # Custom hooks
    │   ├── use-products.ts    # React Query hooks
    │   └── use-product-form.ts
    ├── types.ts               # ⚠️ Chỉ nếu có types riêng
    ├── store.ts               # ⚠️ Chỉ nếu có business logic phức tạp
    ├── page.tsx               # Main page component
    └── columns.tsx            # DataTable columns
```

### Tóm tắt: File nào cần/không cần?

| File | Khi nào cần? | Khi nào xóa? |
|------|-------------|--------------|
| `api/route.ts` | ✅ Luôn cần | - |
| `hooks/*.ts` | ✅ Luôn cần (React Query) | - |
| `components/*.tsx` | ✅ Luôn cần | - |
| `page.tsx` | ✅ Luôn cần | - |
| `types.ts` | Có types riêng của feature | Chỉ re-export → **XÓA** |
| `store.ts` | Business logic phức tạp | CRUD đơn giản → **XÓA** |
| `data.ts` | ❌ **KHÔNG BAO GIỜ** | ❌ **LUÔN XÓA** |

---

## 🔄 Luồng dữ liệu

### Đọc dữ liệu (Read)

```
1. Component mount
       │
       ▼
2. React Query useQuery()
       │
       ▼
3. Fetch API: GET /api/products
       │
       ▼
4. API route: prisma.product.findMany()
       │
       ▼
5. Database trả về data
       │
       ▼
6. React Query cache data
       │
       ▼
7. Component render với data
```

### Ghi dữ liệu (Write)

```
1. User submit form
       │
       ▼
2. React Query useMutation()
       │
       ▼
3. Fetch API: POST /api/products
       │
       ▼
4. API route: prisma.product.create()
       │
       ▼
5. Database lưu data
       │
       ▼
6. API trả về created item
       │
       ▼
7. React Query invalidate cache
       │
       ▼
8. Component re-render với data mới
```

---

## ✅ Checklist khi tạo Feature mới

- [ ] Định nghĩa model trong `prisma/schema.prisma`
- [ ] Chạy `npx prisma generate` và `npx prisma db push`
- [ ] Thêm types vào `lib/types/prisma-extended.ts` (nếu cần extend)
- [ ] Tạo `features/xxx/api/route.ts` cho CRUD
- [ ] Tạo React Query hooks trong `features/xxx/hooks/`
- [ ] Tạo components trong `features/xxx/components/`
- [ ] ⚠️ `features/xxx/types.ts` - CHỈ tạo nếu có types riêng
- [ ] ⚠️ `features/xxx/store.ts` - CHỈ tạo nếu có business logic phức tạp
- [ ] ❌ **KHÔNG tạo `features/xxx/data.ts`**

---

## ⚠️ Anti-patterns cần tránh

### ❌ Tạo file data.ts với mock data

```typescript
// ❌ XÓA FILE NÀY
// features/products/data.ts
export const data: Product[] = [
  { systemId: 'SP001', name: 'Test Product' }
];
```

### ❌ Import mock data vào store

```typescript
// ❌ SAI
import { data as initialData } from './data';

// ✅ ĐÚNG
const initialData: Product[] = [];
```

### ❌ Tạo types.ts chỉ để re-export

```typescript
// ❌ XÓA FILE NÀY nếu chỉ có re-export
// features/products/types.ts
export type { Product } from '@/lib/types/prisma-extended';

// ✅ Import trực tiếp thay vì tạo file
import type { Product } from '@/lib/types/prisma-extended';
```

### ❌ Định nghĩa type trùng lặp

```typescript
// ❌ SAI - Định nghĩa lại type đã có trong prisma-extended
export type Product = {
  systemId: string;
  name: string;
};

// ✅ ĐÚNG - Import từ prisma-extended
import type { Product } from '@/lib/types/prisma-extended';
```

### ❌ Tạo store cho CRUD đơn giản

```typescript
// ❌ KHÔNG CẦN store nếu chỉ là CRUD đơn giản
// Dùng React Query là đủ

// ✅ ĐÚNG
export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: fetchProducts });
}
```

---

## 📚 Tài liệu liên quan

- [ZUSTAND-TO-REACT-QUERY-MIGRATION.md](./ZUSTAND-TO-REACT-QUERY-MIGRATION.md)
- [TYPESCRIPT-STRICT-MIGRATION.md](./TYPESCRIPT-STRICT-MIGRATION.md)
- [NEXTJS-STANDARDS-MIGRATION.md](./NEXTJS-STANDARDS-MIGRATION.md)

---

*Cập nhật lần cuối: 2026-01-03*
