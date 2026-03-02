# 🚀 Performance & Architecture Plan

> Mục tiêu: Load nhanh, mượt mà như các hệ thống lớn (Shopify, Notion, Linear)

---

## 📊 Vấn đề hiện tại

### 1. Data Fetching không tối ưu
```
❌ Hiện tại: Client Component → fetch() → Loading spinner → Render
✅ Chuẩn:   Server Component → Data có sẵn → Hydrate → Interactive
```

### 2. Không có Caching
- Mỗi request đều query database
- Settings load lại mỗi lần navigate
- Không có request deduplication

### 3. Pagination phía Client
```
❌ Hiện tại: Load ALL data → Filter/Sort trên client → Lag với data lớn
✅ Chuẩn:   Server Pagination → Load 50 items/page → Instant response
```

### 4. UI blocking
- Click button → Chờ API → Mới update UI
- Không có Optimistic Updates
- Full page loading thay vì Streaming

---

## 🎯 Kiến trúc đề xuất

```
┌─────────────────────────────────────────────────────────────────┐
│                    🚀 PERFORMANCE LAYERS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. UI LAYER - Instant Feel                                     │
│     ├─ Optimistic Updates (update UI trước, sync sau)          │
│     ├─ Skeleton Loading (không blank screen)                    │
│     ├─ Streaming/Suspense (load từng phần)                     │
│     └─ Virtual Lists (render 1000+ items mượt)                 │
│                                                                  │
│  2. DATA LAYER - Smart Fetching                                 │
│     ├─ Server Components (fetch on server, no waterfall)       │
│     ├─ React Query (client cache + background refetch)         │
│     ├─ Server Pagination (load từng page từ DB)                │
│     └─ Prefetching (load trước khi user click)                 │
│                                                                  │
│  3. CACHE LAYER - Reduce DB Hits                                │
│     ├─ Next.js Data Cache (unstable_cache)                     │
│     ├─ Request Memoization (React.cache)                       │
│     ├─ Redis (hot data: settings, sessions) [optional]         │
│     └─ CDN Edge Cache (static assets)                          │
│                                                                  │
│  4. DATABASE LAYER - Fast Queries                               │
│     ├─ Proper Indexes (composite indexes)                      │
│     ├─ Select only needed fields                               │
│     ├─ Connection Pooling (Prisma Accelerate)                  │
│     └─ Read Replicas [optional]                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc thư mục đề xuất

```
app/
├── actions/                    # Server Actions (mutations từ UI)
│   ├── orders.ts
│   └── ...
│
├── api/                        # API Routes (CHỈ cho external/webhooks)
│   ├── webhooks/              # GHTK, VNPay, etc.
│   ├── external/              # Public APIs cho partners
│   └── cron/                  # Scheduled jobs
│
lib/
├── services/                   # 🆕 Business Logic Layer
│   ├── order.service.ts
│   ├── inventory.service.ts
│   └── payment.service.ts
│
├── data/                       # 🆕 Cached Data Fetchers
│   ├── orders.ts              # getOrders, getOrder (cached)
│   ├── products.ts
│   └── settings.ts            # Heavy cache (5 min)
│
├── cache/                      # 🆕 Cache Utilities
│   ├── index.ts
│   └── keys.ts                # Cache key constants
│
repositories/                   # ✅ Giữ nguyên - Data Access
│   └── ...
│
features/                       # UI Components
├── orders/
│   ├── hooks/                 # React Query hooks
│   │   └── use-orders.ts
│   ├── components/
│   │   ├── orders-table.tsx   # Virtual list
│   │   └── order-form.tsx     # Optimistic submit
│   └── page.tsx               # Server Component
│
│   ❌ XÓA: api/ folder        # Không cần client fetch wrappers
```

---

## 🔧 Chi tiết Implementation

### 1. Server Components + Streaming

```typescript
// app/(authenticated)/orders/page.tsx
import { Suspense } from 'react';
import { OrdersTable } from '@/features/orders/components/orders-table';
import { OrdersSkeleton } from '@/features/orders/components/orders-skeleton';
import { getOrders } from '@/lib/data/orders';

// Server Component - data fetch on server
export default async function OrdersPage({ searchParams }) {
  return (
    <div>
      <h1>Đơn hàng</h1>
      
      {/* Streaming - show skeleton while fetching */}
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersTableServer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function OrdersTableServer({ searchParams }) {
  // ✅ Server Pagination - chỉ load 50 items
  const { data, pagination } = await getOrders({
    page: searchParams.page || 1,
    limit: 50,
    ...searchParams,
  });
  
  return <OrdersTable initialData={data} pagination={pagination} />;
}
```

### 2. Server Pagination

```typescript
// lib/data/orders.ts
import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';

export const getOrders = unstable_cache(
  async (filters: OrderFilters) => {
    const { page = 1, limit = 50, status, search, branchId } = filters;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(branchId && { branchSystemId: branchId }),
      ...(search && {
        OR: [
          { id: { contains: search, mode: 'insensitive' } },
          { customerName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          // ✅ Chỉ select fields cần thiết
          systemId: true,
          id: true,
          customerName: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
  ['orders'],
  { revalidate: 30, tags: ['orders'] }
);
```

### 3. Cached Data Fetchers

```typescript
// lib/data/settings.ts
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

// Request-level memoization (same request = same data)
export const getSettingsByType = cache(async (type: string) => {
  return prisma.settingsData.findFirst({ where: { type } });
});

// Time-based cache (revalidate every 5 minutes)
export const getAllSettings = unstable_cache(
  async () => {
    return prisma.settingsData.findMany();
  },
  ['all-settings'],
  { revalidate: 300 } // 5 minutes
);

// Branches - rarely changes
export const getBranches = unstable_cache(
  async () => {
    return prisma.branch.findMany({ where: { isActive: true } });
  },
  ['branches'],
  { revalidate: 600 } // 10 minutes
);
```

### 4. Optimistic Updates

```typescript
// features/orders/hooks/use-update-order-status.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '@/app/actions/orders';
import { toast } from 'sonner';

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ systemId, status }) => updateOrderStatus(systemId, status),
    
    // 🚀 Update UI ngay lập tức
    onMutate: async ({ systemId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      
      const previous = queryClient.getQueryData(['orders']);
      
      // Optimistic update
      queryClient.setQueryData(['orders'], (old: any) => ({
        ...old,
        data: old.data.map((order: any) =>
          order.systemId === systemId ? { ...order, status } : order
        ),
      }));
      
      toast.success('Đang cập nhật...');
      return { previous };
    },
    
    // Rollback nếu lỗi
    onError: (err, variables, context) => {
      queryClient.setQueryData(['orders'], context?.previous);
      toast.error('Cập nhật thất bại: ' + err.message);
    },
    
    // Sync với server
    onSuccess: () => {
      toast.success('Cập nhật thành công!');
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
```

### 5. Virtual List cho Data lớn

```typescript
// features/orders/components/orders-table.tsx
'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function OrdersTable({ initialData, pagination }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: initialData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52, // row height
    overscan: 10, // render 10 extra rows
  });
  
  return (
    <div ref={parentRef} className="h-150 overflow-auto">
      <table className="w-full">
        <thead>...</thead>
        <tbody style={{ height: virtualizer.getTotalSize() }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const order = initialData[virtualRow.index];
            return (
              <tr
                key={order.systemId}
                style={{
                  position: 'absolute',
                  top: virtualRow.start,
                  height: virtualRow.size,
                }}
              >
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.totalAmount}</td>
                <td>{order.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Pagination controls */}
      <Pagination {...pagination} />
    </div>
  );
}
```

### 6. Prefetching Navigation

```typescript
// features/orders/components/order-row.tsx
'use client';

import { useRouter } from 'next/navigation';

export function OrderRow({ order }) {
  const router = useRouter();
  
  return (
    <tr
      className="cursor-pointer hover:bg-gray-50"
      // Prefetch khi hover - navigation instant!
      onMouseEnter={() => router.prefetch(`/orders/${order.systemId}`)}
      onClick={() => router.push(`/orders/${order.systemId}`)}
    >
      <td>{order.id}</td>
      <td>{order.customerName}</td>
      <td>{formatCurrency(order.totalAmount)}</td>
      <td><StatusBadge status={order.status} /></td>
    </tr>
  );
}
```

### 7. Service Layer (Business Logic)

```typescript
// lib/services/order.service.ts
import { orderRepository } from '@/repositories/order.repository';
import { inventoryService } from './inventory.service';
import { notificationService } from './notification.service';

export const orderService = {
  async createOrder(data: CreateOrderInput, userId: string) {
    // 1. Validate
    await this.validateOrder(data);
    
    // 2. Check & Reserve inventory
    await inventoryService.reserveStock(data.items, data.branchId);
    
    // 3. Create order
    const order = await orderRepository.create({
      ...data,
      createdBy: userId,
      status: 'pending',
    });
    
    // 4. Side effects
    await notificationService.notifyNewOrder(order);
    
    return order;
  },
  
  async cancelOrder(systemId: string, reason: string, userId: string) {
    const order = await orderRepository.findById(systemId);
    
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    if (order.status === 'shipped') {
      throw new Error('Không thể hủy đơn hàng đã giao');
    }
    
    // Release inventory
    await inventoryService.releaseStock(order.items, order.branchSystemId);
    
    return orderRepository.update(systemId, {
      status: 'cancelled',
      cancelReason: reason,
      cancelledBy: userId,
      cancelledAt: new Date(),
    });
  },
  
  async validateOrder(data: CreateOrderInput) {
    if (!data.items?.length) {
      throw new Error('Đơn hàng phải có ít nhất 1 sản phẩm');
    }
    // More validation...
  },
};
```

---

## 📋 Kế hoạch thực hiện

| Phase | Công việc | Impact | Effort | Priority | Trạng thái |
|-------|-----------|--------|--------|----------|------------|
| **1** | Server Pagination cho tất cả tables | ⭐⭐⭐⭐⭐ | 2 ngày | 🔴 Cao | ✅ Done |
| **2** | Server Components + Suspense/Streaming | ⭐⭐⭐⭐⭐ | 3 ngày | 🔴 Cao | ✅ Done |
| **3** | Cache Layer (`lib/data/`) | ⭐⭐⭐⭐ | 2 ngày | 🔴 Cao | ✅ Done |
| **4** | Optimistic Updates cho mutations | ⭐⭐⭐⭐ | 2 ngày | 🟡 Trung bình | ✅ Done |
| **5** | Virtual Lists cho tables lớn | ⭐⭐⭐ | 1 ngày | 🟡 Trung bình | ✅ Done |
| **6** | Prefetching navigation | ⭐⭐⭐ | 0.5 ngày | 🟢 Thấp | ✅ Done |
| **7** | Service Layer (code organization) | ⭐⭐ | 2 ngày | 🟢 Thấp | ✅ Done |
| **8** | Database indexes optimization | ⭐⭐⭐⭐ | 1 ngày | 🟡 Trung bình | ✅ Done |
| **9** | Preload settings in layout | ⭐⭐⭐ | 0.5 ngày | 🟡 Trung bình | ✅ Done |
| **10** | Example Server Component page | ⭐⭐⭐ | 1 ngày | 🟡 Trung bình | ✅ Done |
| **11** | React Query initialData optimization | ⭐⭐⭐⭐ | 1 ngày | 🟡 Trung bình | ✅ Done |

---

## 🆕 React Query + Server Components Hydration (Phase 11)

### Mục tiêu
Tối ưu trải nghiệm người dùng bằng cách:
- Server Components fetch data trước
- Truyền data như `initialData` cho React Query hooks
- **Không có loading spinner** khi lần đầu load trang
- React Query tự động revalidate trong background

### Pattern đã chuẩn hóa

```typescript
// 1. Server Component (app/(authenticated)/[feature]/page.tsx)
async function FeaturePageWithData() {
  const stats = await getFeatureStats();  // Server-side fetch (cached)
  return <FeaturePage initialStats={stats} />;
}

// 2. Client Component (features/[feature]/page.tsx)
export interface FeaturePageProps {
  initialStats?: FeatureStats;
}

export function FeaturePage({ initialStats }: FeaturePageProps) {
  // Hook tự động sử dụng initialData
  const { data: stats } = useFeatureStats(initialStats);
  // ✅ stats có ngay lập tức, không loading!
}

// 3. React Query Hook (features/[feature]/hooks/use-feature.ts)
export function useFeatureStats(initialData?: FeatureStats) {
  return useQuery({
    queryKey: featureKeys.stats(),
    queryFn: fetchFeatureStats,
    initialData,
    staleTime: initialData ? 60_000 : 0,  // Fresh cho 1 phút nếu có initialData
    gcTime: 5 * 60 * 1000,
  });
}
```

### Hooks đã cập nhật với `initialData` support:

| Hook | File | Stats Hook | List Hook |
|------|------|------------|-----------|
| Customers | `use-customers.ts` | ✅ `useCustomerStats(initialData)` | ✅ `useCustomers(params, initialData)` |
| Orders | `use-orders.ts` | ✅ `useOrderStats(initialData)` | ✅ `useOrders(params, initialData)` |
| Products | `use-products.ts` | ✅ `useProductStats(initialData)` | ✅ `useProducts(params, initialData)` |
| Suppliers | `use-suppliers.ts` | ✅ `useSupplierStats(initialData)` | ✅ `useSuppliers(params, initialData)` |
| Receipts | `use-receipts.ts` | ✅ `useReceiptStats(initialData)` | ✅ `useReceipts(params, initialData)` |
| Payments | `use-payments.ts` | ✅ `usePaymentStats(initialData)` | ✅ `usePayments(params, initialData)` |
| Purchase Orders | `use-purchase-orders.ts` | ✅ `usePurchaseOrderStats(initialData)` | ✅ `usePurchaseOrders(params, initialData)` |

### Utility Hook mới

```typescript
// hooks/use-hydration.ts
import { useHydrateQueryCache, STALE_TIMES, GC_TIMES } from '@/hooks/use-hydration';

// Pre-populate cache từ server data
useHydrateQueryCache(['my-key'], serverData);

// Recommended stale times
STALE_TIMES.REALTIME         // 0 - Data thay đổi liên tục
STALE_TIMES.WITH_INITIAL_DATA // 60_000 - Có server data
STALE_TIMES.REFERENCE_DATA    // 10 * 60_000 - Categories, units
STALE_TIMES.SETTINGS          // 30 * 60_000 - User preferences
```

### Cách sử dụng trong feature pages

**Để tận dụng initialData đầy đủ, cần thêm Stats Cards vào các feature pages:**

```tsx
// features/customers/page.tsx
export function CustomersPage({ initialStats }: CustomersPageProps) {
  // ✅ Truyền initialStats vào hook
  const { data: stats } = useCustomerStats(initialStats);
  
  return (
    <div>
      {/* Stats Cards - render ngay với initialStats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Tổng khách hàng" value={stats?.totalCustomers ?? 0} />
        <StatCard title="Khách có nợ" value={stats?.customersWithDebt ?? 0} />
        {/* ... */}
      </div>
      
      {/* Data table */}
      <CustomerTable />
    </div>
  );
}
```

---

## ✅ Đã Implementation (2026-02-20)

### Files đã tạo:

#### 1. Cache Layer (`lib/cache/`)
- `lib/cache/index.ts` - Cache utilities, keys, TTL constants
- `lib/cache/memory-cache.ts` - In-memory cache with TTL

#### 2. Data Fetchers (`lib/data/`)
- `lib/data/index.ts` - Re-export all fetchers
- `lib/data/orders.ts` - Server pagination + caching for Orders
- `lib/data/products.ts` - Server pagination + caching for Products
- `lib/data/inventory.ts` - Server pagination + caching for Inventory
- `lib/data/customers.ts` - Server pagination + caching for Customers
- `lib/data/settings.ts` - Heavy cached settings fetchers

#### 3. UI Components (`components/shared/`)
- `components/shared/pagination.tsx` - Server pagination UI
- `components/shared/table-skeleton.tsx` - Loading skeletons (Table, Card, Detail, Form)
- `components/shared/virtual-table.tsx` - Virtual list for 1000+ rows

#### 4. Hooks (`lib/hooks/`)
- `lib/hooks/index.ts` - Re-export all hooks
- `lib/hooks/use-optimistic-mutation.ts` - Optimistic updates hooks
- `lib/hooks/use-prefetch.ts` - Route prefetching hooks

#### 5. Database (`prisma/sql/`)
- `prisma/sql/performance-indexes.sql` - Performance indexes script

#### 6. Service Layer (`lib/services/`)
- `lib/services/index.ts` - Re-export all services
- `lib/services/order.service.ts` - Order business logic
- `lib/services/inventory.service.ts` - Inventory business logic

#### 7. Example Server Component (`features/orders-v2/`)
- `features/orders-v2/page.tsx` - Server Component with Suspense
- `features/orders-v2/orders-table-client.tsx` - Client interactivity
- `features/orders-v2/orders-toolbar.tsx` - Filters and search

#### 8. Layout Integration
- `app/layout.tsx` - Added `preloadSettings()` for faster loads

### Cách sử dụng:

```typescript
// 1. Import data fetchers
import { getOrders, getProducts, getBranches } from '@/lib/data';

// 2. Use in Server Component
export default async function OrdersPage({ searchParams }) {
  const { data, pagination } = await getOrders({
    page: searchParams.page || 1,
    limit: 50,
    status: searchParams.status,
  });
  
  return <OrdersTable data={data} pagination={pagination} />;
}

// 3. Use optimistic updates in mutations
import { useOptimisticStatusUpdate } from '@/lib/hooks/use-optimistic-mutation';

const updateStatus = useOptimisticStatusUpdate({
  queryKey: ['orders'],
  mutationFn: updateOrderStatus,
});

// 4. Use prefetching
import { usePrefetch } from '@/lib/hooks/use-prefetch';

const prefetch = usePrefetch();
<tr onMouseEnter={() => prefetch(`/orders/${id}`)}>
```

---

## 🔍 Checklist theo Feature

### Orders
- [x] Server Pagination - `lib/data/orders.ts`
- [x] Cached data fetcher - `getOrders`, `getOrderById`, `getOrderStats`
- [x] Server Component page - `features/orders-v2/page.tsx`
- [x] Optimistic updates - `orders-table-client.tsx`
- [x] Prefetch detail page - integrated in table row
- [x] Virtual list - `components/shared/virtual-table.tsx` (ready to use)

### Products  
- [x] Server Pagination - `lib/data/products.ts`
- [x] Cached data fetcher - `getProducts`, `getProductById`, `getLowStockProducts`
- [x] Server Component page - `app/(authenticated)/products/page.tsx` ✅
- [x] Virtual list - `components/shared/virtual-table.tsx` (ready to use)
- [x] Image lazy loading - đã áp dụng với `loading="lazy"`

### Inventory
- [x] Server Pagination - `lib/data/inventory.ts`
- [x] Cached data fetcher - `getInventory`, `getInventorySummary`
- [x] Service layer - `lib/services/inventory.service.ts`
- [x] Real-time updates - React Query với `refetchInterval`
- [x] Server Component page - `app/(authenticated)/inventory/page.tsx` ✅

### Settings
- [x] Heavy cache (10 minutes) - `lib/data/settings.ts`
- [x] Preload on app init - `preloadSettings()`
- [x] Integrated vào `app/layout.tsx`

### Customers
- [x] Server Pagination - `lib/data/customers.ts`
- [x] Cached data fetcher - `getCustomers`, `getCustomerStats`
- [x] Server Component page - `features/customers-v2/page.tsx`

### Reports
- [x] Server-side aggregation - `lib/data/reports.ts`
- [x] Chart data caching - Sales summary, by period
- [x] Top products/customers reports
- [x] Inventory report with aggregations

---

## 📊 Metrics mục tiêu

| Metric | Hiện tại | Mục tiêu |
|--------|----------|----------|
| First Contentful Paint | ~2-3s | < 1s |
| Time to Interactive | ~4-5s | < 2s |
| Table load (1000 items) | ~3-5s | < 500ms |
| Navigation between pages | ~1-2s | < 200ms |
| Mutation feedback | ~500ms-1s | Instant |

---

## 🛠️ Dependencies cần thêm

```bash
# Virtual list
npm install @tanstack/react-virtual

# React Query (nếu chưa có)
npm install @tanstack/react-query

# Date utilities (optimize)
npm install date-fns
```

---

## 📝 Notes

1. **Server Pagination** = Load data từng page từ database, KHÔNG load hết rồi filter client
2. **Optimistic Updates** = Update UI trước, đợi server confirm sau
3. **Virtual List** = Chỉ render rows visible trên màn hình, không render 1000 rows
4. **Prefetching** = Load data trước khi user click, navigation instant
5. **Cache** = Lưu data đã fetch, không query DB lại trong thời gian ngắn

---

*Document created: 2026-02-20*
*Last updated: 2026-02-20*
*Implementation completed: 2026-02-20*
*React Query initialData optimization: 2026-02-20*
*Phase 12 Stats Cards Integration: 2026-02-20 ✅ COMPLETE*

## 📂 Files Structure Created

```
lib/
├── cache/
│   ├── index.ts              # ✅ Cache utilities, keys, TTL
│   └── memory-cache.ts       # ✅ In-memory cache
│
├── data/
│   ├── index.ts              # ✅ Re-exports
│   ├── orders.ts             # ✅ Server pagination + cache
│   ├── products.ts           # ✅ Server pagination + cache
│   ├── inventory.ts          # ✅ Server pagination + cache
│   ├── customers.ts          # ✅ Server pagination + cache
│   ├── settings.ts           # ✅ Heavy cache (10 min)
│   └── reports.ts            # ✅ Sales & Inventory aggregation
│
├── hooks/
│   ├── index.ts                    # ✅ Re-exports
│   ├── use-optimistic-mutation.ts  # ✅ Optimistic updates
│   └── use-prefetch.ts             # ✅ Route prefetching
│
├── services/
│   ├── index.ts              # ✅ Re-exports
│   ├── order.service.ts      # ✅ Order business logic
│   └── inventory.service.ts  # ✅ Inventory business logic
│
components/
├── shared/
│   ├── pagination.tsx        # ✅ Server pagination UI
│   ├── table-skeleton.tsx    # ✅ Loading skeletons
│   └── virtual-table.tsx     # ✅ Virtual list component
│
features/
├── orders-v2/                # ✅ Example Server Component
│   ├── page.tsx              # Server Component + Suspense
│   ├── orders-table-client.tsx
│   └── orders-toolbar.tsx
│
├── products-v2/              # ✅ Products Server Component
│   ├── page.tsx              # Server Component + Suspense
│   ├── products-table-client.tsx  # Virtual table + optimistic
│   └── products-toolbar.tsx
│
├── inventory-v2/             # ✅ Inventory Server Component
│   ├── page.tsx              # Server Component + Summary cards
│   ├── inventory-table-client.tsx  # Quick stock adjustment
│   └── inventory-toolbar.tsx
│
├── customers-v2/             # ✅ Customers Server Component
│   ├── page.tsx              # Server Component + Stats cards
│   ├── customers-table-client.tsx  # Virtual table
│   └── customers-toolbar.tsx
│
prisma/
├── sql/
│   └── performance-indexes.sql  # ✅ DB indexes script
│
app/
├── layout.tsx                # ✅ Added preloadSettings()
│
└── (authenticated)/          # ✅ Routes đã thay thế
    ├── orders/page.tsx       # ✅ → features/orders-v2 (Server Component)
    ├── products/page.tsx     # ✅ → features/products-v2 (Server Component)
    ├── inventory/page.tsx    # ✅ → features/inventory-v2 (Server Component)
    └── customers/page.tsx    # ✅ → features/customers-v2 (Server Component)
```

## 🚀 Next Steps - ALL COMPLETED ✅

1. ~~**Route integration** - Tạo routes trong `app/(authenticated)/` link tới `*-v2` pages~~ ✅ DONE
2. ~~**Thay thế routes chính**~~ ✅ DONE - Đã thay thế trực tiếp
3. ~~**React Query initialData optimization**~~ ✅ DONE - 7 hooks đã cập nhật
4. ~~**Integrate initialData in feature pages**~~ ✅ DONE - Stats Cards đã thêm vào 7 feature pages
5. ~~**Migrate remaining features**~~ ✅ DONE - Warranties, Employees, Complaints, Stock Transfers, Inventory Checks
6. ~~**Real-time updates**~~ ✅ DONE - React Query với `refetchInterval` cho Dashboard
7. ~~**Dashboard optimization**~~ ✅ DONE - `features/dashboard/page-lite.tsx` với API aggregation

---

## ✅ Phase 12: Stats Cards Integration (COMPLETED 2026-02-20)

### Shared Component tạo mới:
- `components/shared/stats-card.tsx` - StatsCard, StatsCardSkeleton, StatsCardGrid, StatsCardGridSkeleton

### Feature Pages đã cập nhật:

| Page | File | Hook | Stats Cards |
|------|------|------|-------------|
| Customers | `features/customers/page.tsx` | `useCustomerStats(initialStats)` | Tổng KH, KH có nợ, Tổng nợ, KH mới tháng |
| Orders | `features/orders/page.tsx` | `useOrderStats(initialStats)` | Tổng đơn, Chờ XL, Hôm nay, Doanh thu |
| Products | `features/products/page.tsx` | `useProductStats(initialStats)` | Tổng SP, Đang bán, Hết hàng, Giá trị kho |
| Suppliers | `features/suppliers/page.tsx` | `useSupplierStats(initialStats)` | Tổng NCC, Đang GD, NCC nợ, Tổng nợ |
| Receipts | `features/receipts/components/receipts-content.tsx` | `useReceiptStats(initialStats)` | Tổng PT, Tổng thu, Hôm nay, Thu hôm nay |
| Payments | `features/payments/page.tsx` | `usePaymentStats(initialStats)` | Tổng PC, Tổng chi, Hôm nay, Chi hôm nay |
| Purchase Orders | `features/purchase-orders/components/po-statistics.tsx` | `usePOStats()` | Đặt hàng, Đã nhận, Trả lại, Tồn kho |

### Cách hoạt động:
```
Server Component (app/...)     →   Client Component (features/...)
     ↓                                      ↓
 getFeatureStats()                 useFeatureStats(initialStats)
     ↓                                      ↓
 initialStats prop              React Query với initialData
     ↓                                      ↓
 Pass to client              ⚡ Stats hiển thị NGAY, không loading!
```

---

## 🔗 Routes đã thay thế (PRODUCTION)

| Route | Server Component | initialData Props | Status |
|-------|------------------|-------------------|--------|
| `/orders` | ✅ Suspense wrapper | initialStats, initialCountByStatus | ✅ Live |
| `/products` | ✅ Suspense wrapper | initialLowStock, initialCountByStatus | ✅ Live |
| `/inventory` | ✅ Suspense wrapper | initialSummary | ✅ Live |
| `/customers` | ✅ Suspense wrapper | initialStats, initialGroups | ✅ Live |
| `/suppliers` | ✅ Suspense wrapper | initialStats | ✅ Live |
| `/receipts` | ✅ Suspense wrapper | initialStats | ✅ Live |
| `/payments` | ✅ Suspense wrapper | initialStats | ✅ Live |
| `/purchase-orders` | ✅ Suspense wrapper | initialStats | ✅ Live |

### React Query Hooks với initialData support (🆕 Phase 11)

| Hook | File | Hàm mới |
|------|------|---------|
| useCustomerStats | `features/customers/hooks/use-customers.ts` | `useCustomerStats(initialData?)` |
| useCustomerGroups | `features/customers/hooks/use-customers.ts` | `useCustomerGroups(initialData?)` |
| useOrderStats | `features/orders/hooks/use-orders.ts` | `useOrderStats(initialData?)` |
| useProductStats | `features/products/hooks/use-products.ts` | `useProductStats(initialData?)` |
| useSupplierStats | `features/suppliers/hooks/use-suppliers.ts` | `useSupplierStats(initialData?)` |
| useReceiptStats | `features/receipts/hooks/use-receipts.ts` | `useReceiptStats(initialData?)` |
| usePaymentStats | `features/payments/hooks/use-payments.ts` | `usePaymentStats(initialData?)` |
| usePurchaseOrderStats | `features/purchase-orders/hooks/use-purchase-orders.ts` | `usePurchaseOrderStats(initialData?)` |

### Utility Hook mới
- `hooks/use-hydration.ts` - `useHydrateQueryCache()`, `STALE_TIMES`, `GC_TIMES`

### Cấu trúc giữ lại:
- `features/orders/` - Giữ cho sub-routes: `/orders/new`, `/orders/[systemId]`
- `features/products/` - Giữ cho sub-routes: `/products/new`, `/products/[systemId]`, `/products/trash`
- `features/customers/` - Giữ cho sub-routes: `/customers/new`, `/customers/[systemId]`
- `features/*-v2/` - Server Component pages cho danh sách chính

### Loading states:
- `app/(authenticated)/orders/loading.tsx` ✅
- `app/(authenticated)/products/loading.tsx` ✅
- `app/(authenticated)/customers/loading.tsx` ✅
- `app/(authenticated)/inventory/loading.tsx` ✅

---

*Last updated: 2026-02-22*
*Status: 🟢 **ALL PHASES COMPLETE** - Production Ready*
*Final Review: 2026-02-22 - No missing tasks*
