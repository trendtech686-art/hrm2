# 🚀 Hướng Dẫn Tối Ưu Compile & Load Performance

> **Mục tiêu**: Giảm thời gian compile trong development và tăng tốc độ load cho production.

---

## 📊 Tiêu Chí Đánh Giá

| Metric | Mục tiêu | Cách đo |
|--------|----------|---------|
| First Load JS | < 100KB | `next build` output |
| Per-page JS | < 50KB | `@next/bundle-analyzer` |
| Total bundle | < 500KB gzipped | Bundle analyzer |
| Dev compile time | < 3s (hot reload) | Terminal output |
| Cold start compile | < 30s | `time npm run dev` |

---

## 1. Code Splitting & Lazy Loading

### ❌ Anti-pattern
```tsx
// Import tất cả cùng lúc - tăng bundle size
import { HeavyChart, HeavyTable, HeavyEditor } from '@/components/heavy';
import * as XLSX from 'xlsx';
```

### ✅ Best Practice
```tsx
import dynamic from 'next/dynamic';

// Dynamic import - chỉ load khi cần
const HeavyChart = dynamic(() => import('@/components/heavy/chart'), {
  loading: () => <Skeleton className="h-[400px]" />,
  ssr: false // Tắt SSR cho component client-only
});

// Lazy load libraries nặng
const parseExcel = async (file: File) => {
  const XLSX = await import('xlsx');
  return XLSX.read(file, { type: 'binary' });
};
```

### Khi nào dùng Dynamic Import?
- Component > 50KB
- Component chỉ hiện khi user tương tác (modal, dialog, drawer)
- Third-party libraries nặng (charts, editors, XLSX, PDF)
- Component không cần SEO (client-only features)

---

## 2. Import Optimization

### ❌ Anti-pattern
```tsx
// Import toàn bộ library
import { format, parse, addDays, subDays, isAfter, isBefore } from 'date-fns';
import _ from 'lodash';
import * as Icons from 'lucide-react';
```

### ✅ Best Practice
```tsx
// Import chỉ function cần dùng (tree-shakeable)
import format from 'date-fns/format';
import parse from 'date-fns/parse';

// Lodash - dùng lodash-es hoặc import riêng
import debounce from 'lodash/debounce';

// Icons - import trực tiếp
import { Search, Plus, Trash } from 'lucide-react';
```

---

## 3. Barrel Files - Tránh Re-export Lớn

### ❌ Anti-pattern
```tsx
// features/index.ts - re-export 50+ modules
export * from './orders';
export * from './products';
export * from './customers';
export * from './employees';
// ... 46 more exports

// Usage - kéo toàn bộ bundle dù chỉ cần 1 function
import { useOrderStore } from '@/features';
```

### ✅ Best Practice
```tsx
// Import trực tiếp từ source module
import { useOrderStore } from '@/features/orders/store';
import { ProductCard } from '@/features/products/components/ProductCard';

// Nếu cần barrel file, chỉ export types (zero runtime cost)
// features/orders/index.ts
export type { Order, OrderStatus } from './types';
```

---

## 4. Store Splitting Pattern

### ❌ Anti-pattern
```tsx
// Một store file 2000+ lines
// features/orders/store.ts (2000 lines)
export const useOrderStore = create<OrderStore>((set, get) => ({
  // 50+ methods...
}));
```

### ✅ Best Practice (Đã áp dụng cho orders)
```
features/orders/store/
├── index.ts           # Main export, combines slices (72 lines)
├── base-store.ts      # Core CRUD, migrations (207 lines)
├── helpers.ts         # Constants, utilities (275 lines)
├── payment-slice.ts   # Payment methods (189 lines)
├── cancellation-slice.ts  # Cancel/refund (157 lines)
├── packaging-slice.ts # Packaging logic (305 lines)
├── delivery-slice.ts  # Delivery operations (399 lines)
└── ghtk-slice.ts      # GHTK integration (367 lines)
```

**Lợi ích:**
- Hot reload nhanh hơn (chỉ recompile slice thay đổi)
- Dễ maintain và test
- Code splitting tự động theo feature

---

## 5. Server Components (RSC)

### ✅ Mặc định là Server Component
```tsx
// app/orders/page.tsx - Server Component (không gửi JS xuống client)
export default async function OrdersPage() {
  const orders = await fetchOrders(); // Fetch trên server
  return <OrderList orders={orders} />;
}
```

### Chỉ 'use client' khi thực sự cần
```tsx
'use client'

import { useState } from 'react';

// Client Component - chỉ cho interactivity
export function OrderActions({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  // Event handlers, state, effects...
}
```

### Khi nào dùng Client Component?
- Cần `useState`, `useEffect`, `useContext`
- Cần event handlers (`onClick`, `onChange`)
- Cần browser APIs (`window`, `document`)
- Dùng third-party libraries chưa support RSC

---

## 6. TypeScript Optimization

### tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/ui/*": ["./components/ui/*"]
    },
    // ✅ Tăng tốc TypeScript compile
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    
    // ✅ Skip type checking node_modules
    "skipLibCheck": true,
    
    // ✅ Chỉ emit khi cần
    "noEmit": true
  },
  // ✅ Exclude folders không cần check
  "exclude": [
    "node_modules",
    ".next",
    "backup",
    "docs"
  ]
}
```

---

## 7. Next.js Configuration

### next.config.ts
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ✅ Turbopack - nhanh hơn 10x so với Webpack (Next.js 15+)
  // Chạy: next dev --turbo
  
  // ✅ Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // ✅ Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  
  // ✅ Modular imports for large libraries
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },
  
  // ✅ Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
```

---

## 8. Development Commands

```bash
# ✅ Dev với Turbopack (nhanh hơn 10x)
npm run dev -- --turbo
# hoặc thêm vào package.json:
# "dev": "next dev --turbo"

# ✅ Phân tích bundle size
npm install @next/bundle-analyzer
ANALYZE=true npm run build

# ✅ Kiểm tra TypeScript
npm run type-check
# hoặc: npx tsc --noEmit

# ✅ Build production
npm run build

# ✅ Đo thời gian build
time npm run build
```

---

## 9. Checklist Tối Ưu

### Code Quality
- [ ] Không có `import *` từ large libraries
- [ ] Components nặng dùng `dynamic()`
- [ ] Stores tách nhỏ theo feature
- [ ] Tránh barrel files lớn (re-export nhiều)
- [ ] Sử dụng Server Components khi có thể

### Assets
- [ ] Images dùng `next/image`
- [ ] Fonts dùng `next/font`
- [ ] Icons import trực tiếp (không `import *`)

### Configuration
- [ ] `tsconfig.json` có `incremental: true`
- [ ] `next.config.ts` có `modularizeImports`
- [ ] Dev dùng Turbopack (`next dev --turbo`)

### Monitoring
- [ ] Bundle analyzer chạy định kỳ
- [ ] First Load JS < 100KB per route
- [ ] Lighthouse Performance > 90

---

## 10. Các File/Folder Cần Ưu Tiên Tối Ưu

### Heavy Components (cần dynamic import)
```
components/data-table/data-table-import-dialog.tsx  # XLSX library
features/orders/components/shipping-integration.tsx  # Complex shipping
features/reports/                                    # Charts, heavy data
```

### Large Stores (cần split)
```
features/orders/store/     ✅ Đã split thành 8 slices
features/products/store.ts    # Cần review
features/customers/store.ts   # Cần review
```

### Barrel Files (cần tránh)
```
components/ui/index.ts     # Chỉ export types
features/index.ts          # Xóa hoặc chỉ export types
lib/index.ts               # Xóa hoặc chỉ export types
```

---

## 📈 Kết Quả Mong Đợi

| Trước | Sau | Cải thiện |
|-------|-----|-----------|
| Cold start: 45s | Cold start: 20s | -55% |
| Hot reload: 5s | Hot reload: 1s | -80% |
| First Load JS: 200KB | First Load JS: 80KB | -60% |
| Build time: 3min | Build time: 1min | -66% |

---

## 🔗 Tài Liệu Tham Khảo

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Turbopack](https://turbo.build/pack)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

---

## 📋 DANH SÁCH TẤT CẢ MODULES & TODO

### Ghi chú
- **Store Lines**: Số dòng trong file store.ts (> 300 = cần split)
- **Components**: Số file .tsx trong module
- **Priority**: 🔴 Cao | 🟡 Trung bình | 🟢 Thấp

---

### 🛒 SALES & ORDERS

| # | Module | Store Lines | Components | Priority | TODO |
|---|--------|-------------|------------|----------|------|
| 1 | **orders** | ✅ Split (8 slices) | 48 | ✅ Done | ✅ Đã split thành 8 slices |
| 2 | **sales-returns** | ✅ Split (6 slices) | 10 | ✅ Done | ✅ Đã split thành 6 slices |
| 3 | **customers** | ✅ Split (7 slices) | 24 | ✅ Done | ✅ Đã split thành 7 slices |
| 4 | **shipments** | ✅ Split (4 slices) | 4 | ✅ Done | ✅ Đã split thành 4 slices |
| 5 | **packaging** | 0 | 4 | 🟢 | ☐ Kiểm tra imports |
| 6 | **reconciliation** | 0 | 3 | 🟢 | ☐ Kiểm tra imports |

---

### 📦 INVENTORY & PRODUCTS

| # | Module | Store Lines | Components | Priority | TODO |
|---|--------|-------------|------------|----------|------|
| 7 | **products** | ✅ Split (6 slices) | 31 | ✅ Done | ✅ Đã split thành 6 slices |
| 8 | **inventory-receipts** | 208 | 3 | 🟡 | ☐ Review store |
| 9 | **inventory-checks** | 140 | 7 | 🟢 | ☐ Kiểm tra imports |
| 10 | **stock-transfers** | ✅ Split (4 slices) | 9 | ✅ Done | ✅ Đã split thành 4 slices |
| 11 | **stock-history** | 74 | 1 | 🟢 | ✅ OK |
| 12 | **stock-locations** | 6 | 3 | 🟢 | ✅ OK |
| 13 | **categories** | 0 | 7 | 🟢 | ☐ Kiểm tra imports |
| 14 | **brands** | 0 | 9 | 🟢 | ☐ Kiểm tra imports |

---

### 🛍️ PURCHASING

| # | Module | Store Lines | Components | Priority | TODO |
|---|--------|-------------|------------|----------|------|
| 15 | **purchase-orders** | ✅ Split (7 slices) | 23 | ✅ Done | ✅ Đã split thành 7 slices |
| 16 | **purchase-returns** | 160 | 5 | 🟢 | ☐ Kiểm tra imports |
| 17 | **suppliers** | 77 | 10 | 🟢 | ✅ OK |
| 18 | **cost-adjustments** | ✅ Split (6 slices) | 6 | ✅ Done | ✅ Đã split thành 6 slices |

---

### 💰 FINANCE & PAYMENTS

| # | Module | Store Lines | Components | Priority | TODO |
|---|--------|-------------|------------|----------|------|
| 19 | **payments** | ✅ Split (3 slices) | 7 | ✅ Done | ✅ Đã split thành 3 slices |
| 20 | **receipts** | ✅ Split (3 slices) | 7 | ✅ Done | ✅ Đã split thành 3 slices |
| 21 | **cashbook** | 60 | 3 | 🟢 | ✅ OK |
| 22 | **finance** | 0 | 0 | 🟢 | ✅ OK (helpers only) |

---

### 👥 HR & EMPLOYEES

| # | Module | Store Lines | Components | Priority | TODO |
|---|--------|-------------|------------|----------|------|
| 23 | **employees** | 189 | 23 | 🟡 | ☐ Dynamic import forms |
| 24 | **payroll** | 0 | 20 | 🟡 | ☐ Kiểm tra heavy components |
| 25 | **attendance** | 88 | 9 | 🟢 | ✅ OK |
| 26 | **leaves** | 75 | 4 | 🟢 | ✅ OK |

---

### 🔧 OPERATIONS

| # | Module | Store Lines | Components | Priority | TODO |
|---|--------|-------------|------------|----------|------|
| 27 | **complaints** | ✅ Split (8 slices) | 24 | ✅ Done | ✅ Đã split thành 8 slices |
| 28 | **warranty** | 1 | 31 | 🟡 | ☐ Dynamic import heavy components |
| 29 | **tasks** | ✅ Split (6 slices) | 20 | ✅ Done | ✅ Đã split thành 6 slices |
| 30 | **wiki** | 44 | 4 | 🟢 | ✅ OK |

---

### 📊 REPORTS & DASHBOARD

| # | Module | Store Lines | Components | Priority | TODO |
|---|--------|-------------|------------|----------|------|
| 31 | **dashboard** | 0 | 3 | ✅ | ✅ Uses DynamicReportChart |
| 32 | **reports** | 0 | 19 | ✅ | ✅ ReportChart dynamic (~200KB) |
| 33 | **audit-log** | 65 | 0 | 🟢 | ✅ OK |

---

### ⚙️ SETTINGS (136 components)

| # | Sub-module | Priority | TODO |
|---|------------|----------|------|
| 34 | branches | 🟢 | ☐ Kiểm tra imports |
| 35 | departments | 🟢 | ☐ Kiểm tra imports |
| 36 | job-titles | 🟢 | ☐ Kiểm tra imports |
| 37 | employees | 🟢 | ☐ Kiểm tra imports |
| 38 | customers | 🟢 | ☐ Kiểm tra imports |
| 39 | payments | 🟡 | ☐ Review store |
| 40 | cash-accounts | 🟢 | ☐ Kiểm tra imports |
| 41 | receipt-types | 🟢 | ☐ Kiểm tra imports |
| 42 | pricing | 🟡 | ☐ Review store |
| 43 | taxes | 🟢 | ☐ Kiểm tra imports |
| 44 | shipping | 🟡 | ☐ Review store |
| 45 | inventory | 🟢 | ☐ Kiểm tra imports |
| 46 | sales | 🟢 | ☐ Kiểm tra imports |
| 47 | sales-channels | 🟢 | ☐ Kiểm tra imports |
| 48 | complaints | 🟢 | ☐ Kiểm tra imports |
| 49 | warranty | 🟢 | ☐ Kiểm tra imports |
| 50 | tasks | 🟢 | ☐ Kiểm tra imports |
| 51 | templates | 🟡 | ☐ Review (print templates) |
| 52 | printer | 🟢 | ☐ Kiểm tra imports |
| 53 | store-info | 🟢 | ☐ Kiểm tra imports |
| 54 | system | 🟡 | ☐ Review system settings |
| 55 | appearance | 🟢 | ☐ Kiểm tra imports |
| 56 | units | 🟢 | ☐ Kiểm tra imports |
| 57 | provinces | 🟢 | ☐ Kiểm tra imports |
| 58 | websites | 🟢 | ☐ Kiểm tra imports |

---

### 🧩 SHARED COMPONENTS

| # | Folder | Files | Priority | TODO |
|---|--------|-------|----------|------|
| 59 | **components/ui** | 84 | 🟢 | ☐ Kiểm tra barrel exports |
| 60 | **components/shared** | 28 | 🟡 | ☐ Dynamic import heavy components |
| 61 | **components/data-table** | 19 | ✅ | ✅ XLSX lazy loaded |
| 62 | **components/layout** | 11 | 🟢 | ☐ Kiểm tra imports |
| 63 | **components/mobile** | 10 | 🟢 | ☐ Kiểm tra imports |
| 64 | **components/settings** | 11 | 🟢 | ☐ Kiểm tra imports |
| 65 | **components/providers** | 1 | 🟢 | ✅ OK |

---

### 📚 OTHER

| # | Module | Priority | TODO |
|---|--------|----------|------|
| 66 | **auth** | 🟢 | ☐ Kiểm tra imports |
| 67 | **shared** | 🟢 | ☐ Kiểm tra barrel exports |
| 68 | **other-targets** | 🟢 | ☐ Kiểm tra imports |

---

## 📊 TỔNG KẾT TODO

### Ưu Tiên Cao (🔴) - Cần xử lý ngay
| # | Module | Vấn đề | Giải pháp |
|---|--------|--------|-----------|
| 1 | ~~sales-returns~~ | ~~Store 472 lines~~ | ✅ Đã split thành 6 slices |
| 2 | ~~customers~~ | ~~Store 502 lines~~ | ✅ Đã split thành 7 slices |
| 3 | ~~products~~ | ~~Store 354 lines~~ | ✅ Đã split thành 6 slices |
| 4 | ~~purchase-orders~~ | ~~Store 449 lines~~ | ✅ Đã split thành 7 slices |
| 5 | ~~cost-adjustments~~ | ~~Store 443 lines~~ | ✅ Đã split thành 6 slices |
| 6 | ~~complaints~~ | ~~Store 619 lines~~ | ✅ Đã split thành 8 slices |
| 7 | ~~tasks~~ | ~~Store 478 lines~~ | ✅ Đã split thành 6 slices |
| 8 | ~~reports~~ | ~~19 heavy components~~ | ✅ ReportChart dynamic import |
| 9 | ~~data-table~~ | ~~XLSX import~~ | ✅ All XLSX now lazy loaded |

### Ưu Tiên Trung Bình (🟡) - Xử lý sau
- inventory-receipts (208 lines)
- employees (189 lines), payroll
- warranty
- settings/payments, pricing, shipping, templates, system

### Ưu Tiên Thấp (🟢) - Kiểm tra định kỳ
- Các module store < 200 lines
- Kiểm tra barrel imports
- Kiểm tra unused imports

---

## ✅ TIẾN ĐỘ HOÀN THÀNH

| Ngày | Module | Hành động | Kết quả |
|------|--------|-----------|---------|
| 2026-01-03 | orders | Split store thành 8 slices | ✅ Done |
| 2026-01-03 | Tất cả | Thay alert() → toast() | ✅ 28 files |
| 2026-01-03 | sales-returns | Split store thành 6 slices | ✅ Done |
| 2026-01-03 | customers | Split store thành 7 slices | ✅ Done |
| 2026-01-03 | products | Split store thành 6 slices | ✅ Done |
| 2026-01-03 | purchase-orders | Split store thành 7 slices | ✅ Done |
| 2026-01-04 | complaints | Split store thành 8 slices | ✅ Done |
| 2026-01-04 | tasks | Split store thành 6 slices | ✅ Done |
| 2026-01-04 | cost-adjustments | Split store thành 6 slices | ✅ Done |
| 2026-01-04 | settings/pkgx | Split store thành 7 slices | ✅ Done |
| 2026-01-04 | settings/trendtech | Split store thành 7 slices | ✅ Done |
| 2026-01-04 | shipments | Split store thành 4 slices | ✅ Done |
| 2026-01-04 | stock-transfers | Split store thành 4 slices | ✅ Done |
| 2026-01-04 | payments | Split store thành 3 slices | ✅ Done |
| 2026-01-04 | receipts | Split store thành 3 slices | ✅ Done |
| 2026-01-04 | attendance-parser | Lazy load XLSX (~500KB) | ✅ Done |
| 2026-01-04 | generic-export-dialog-v2 | Lazy load XLSX (~500KB) | ✅ Done |
| 2026-01-04 | generic-import-dialog-v2 | Lazy load XLSX (~500KB) | ✅ Done |
| 2026-01-04 | reports/ReportChart | Dynamic import recharts (~200KB) | ✅ Done |
| | | | |

---

*Cập nhật: 2026-01-04*
