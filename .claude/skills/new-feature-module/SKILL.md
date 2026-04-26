# Skill: Tạo Feature Module mới

## Khi nào dùng
User yêu cầu thêm module nghiệp vụ mới (VD: quản lý bảo hành, quản lý vận chuyển...).

## Cấu trúc cần tạo

```
features/[feature-name]/
  ├── api/
  │   └── [feature]-api.ts        # Fetch functions (isolated!)
  ├── components/
  │   ├── [feature]-card.tsx       # Card hiển thị trong list
  │   ├── [feature]-form.tsx       # Form tạo/sửa
  │   └── [feature]-detail-page.tsx
  ├── hooks/
  │   ├── use-[feature].ts         # React Query hooks (list, detail)
  │   └── use-[feature]-mutations.ts # Create/update/delete mutations
  ├── types.ts                     # Feature-specific types
  ├── validation.ts                # Zod schemas
  └── utils.ts                     # Feature utilities (optional)

app/(authenticated)/[feature-name]/
  ├── page.tsx                     # List page (server component → client)
  └── [systemId]/
      └── page.tsx                 # Detail page

app/api/[feature-name]/
  ├── route.ts                     # GET list + POST create
  └── [systemId]/
      └── route.ts                 # GET detail + PUT update + DELETE
```

## Các bước thực hiện

### 1. Prisma Schema (nếu cần model mới)
File: `prisma/schema/[domain]/[model].prisma`
```prisma
model FeatureName {
  id        Int      @id @default(autoincrement())
  systemId  String   @unique @default(uuid())
  // ... fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
Chạy: `npx prisma migrate dev --name add-feature-name`

### 2. Types
`features/[feature]/types.ts`
```typescript
import type { FeatureName } from '@/generated/prisma'

export type FeatureWithRelations = FeatureName & {
  // relations
}

export interface FeatureParams {
  page?: number
  limit?: number
  search?: string
  // filters
}
```

### 3. Validation
`features/[feature]/validation.ts`
```typescript
import { z } from 'zod'

export const createFeatureSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  // ... fields
})

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>
```

### 4. API Functions
`features/[feature]/api/[feature]-api.ts`
- **QUAN TRỌNG**: KHÔNG import từ feature khác
- Chỉ chứa fetch functions + type imports

### 5. React Query Hooks
`features/[feature]/hooks/use-[feature].ts`
- Query keys factory
- useQuery hooks
- useMutation hooks

### 6. API Routes
`app/api/[feature]/route.ts` — Dùng `apiHandler` wrapper

### 7. Pages
- List page: Server component fetch initial data → pass to client
- Detail page: Load by systemId

### 8. Navigation
- Thêm vào sidebar: `components/layout/sidebar.tsx`
- Thêm breadcrumb config nếu cần

### 9. Permissions
- `features/employees/permissions.ts`: Thêm permission mới
- `lib/api-permission-map.ts`: Map route → permission
- `middleware.ts`: Tự động enforce qua permission map

## Checklist
- [ ] Prisma model + migration
- [ ] Types + validation
- [ ] API fetch functions (isolated)
- [ ] React Query hooks
- [ ] API routes (apiHandler)
- [ ] Permission mapping
- [ ] List page + detail page
- [ ] Sidebar navigation
- [ ] Mobile responsive (card view)
- [ ] PWA-ready (xem bên dưới)

---

# PWA Readiness Checklist

Khi tạo feature mới, đảm bảo tuân thủ các quy tắc PWA sau:

## 1. Offline-first Data Fetching

```typescript
// ✅ Đúng: Dùng React Query với staleTime để cache dữ liệu
export function useOrders(params: OrderParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchOrders(params),
    staleTime: 1000 * 60 * 5, // 5 phút - dữ liệu valid trong 5 phút khi offline
  })
}

// ❌ Sai: Refetch liên tục khi offline
export function useOrders(params: OrderParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchOrders(params),
    refetchOnMount: true, // KHÔNG dùng - gây lỗi khi offline
  })
}
```

## 2. Image Optimization

```typescript
// ✅ Đúng: Dùng next/image cho PWA icons
import Image from 'next/image'

<Image
  src="/icon-192.png"
  alt="ERP Icon"
  width={192}
  height={192}
  priority // Load ngay lập tức
/>

// ❌ Sai: Dùng thẻ img thuần
<img src="/icon-192.png" alt="ERP Icon" />
```

## 3. Touch Targets

```typescript
// ✅ Đúng: Touch target tối thiểu 40px trên mobile
<Button className="h-10 md:h-9">...</Button>

// Input fields cũng cần touch-friendly
<Input className="h-10 md:h-9" />
```

## 4. Safe Area & Mobile Layout

```typescript
// ✅ Đúng: Hỗ trợ safe area cho iPhone notch/home indicator
<div className="pb-[env(safe-area-inset-bottom)]">
  ...
</div>

// Card trên mobile dùng flat div thay vì paper
<div className="rounded-xl border border-border/50 bg-card p-4">
  {/* Mobile-first card design */}
</div>
```

## 5. Offline Indicators

```typescript
// Khi feature có form submit, thêm offline queue indicator
import { OfflineQueueIndicator } from '@/components/pwa/offline-queue-indicator'

// Trong form component
<form>
  {/* form fields */}
</form>
<OfflineQueueIndicator />
```

## 6. API Route Offline Handling

```typescript
// ✅ API routes nên có retry logic cho offline scenarios
export const GET = apiHandler(async (req, { session }) => {
  try {
    const data = await prisma.order.findMany()
    return apiSuccess(data)
  } catch (error) {
    // Log error nhưng không throw để UI không crash
    console.error('Fetch error (may be offline):', error)
    return apiSuccess([]) // Return empty array thay vì error
  }
})
```

## 7. Lazy Loading với Skeleton

```typescript
// ✅ Đúng: Dùng skeleton cho better perceived performance
import { CardSkeleton } from '@/components/ui/card-skeleton'

export function OrderList({ initialData }) {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <OrderListContent />
    </Suspense>
  )
}
```

## 8. Route Segment Config

```typescript
// app/(authenticated)/orders/page.tsx
// Thêm dynamicParams và revalidate cho PWA

export const dynamic = 'force-dynamic' // Hoặc 'auto' tùy use case
export const revalidate = 60 // Revalidate mỗi 60s

export default async function OrdersPage() {
  // Server component fetch
}
```

## 9. Prisma Error Handling

```typescript
// ✅ Dùng serializeDecimals() cho decimal fields
import { serializeDecimals } from '@/lib/api-utils'

const orders = await prisma.order.findMany()
return apiSuccess(serializeDecimals(orders))
```

## Quick Reference: PWA File Locations

| File | Purpose |
|------|---------|
| `public/manifest.json` | PWA manifest (app metadata, icons, shortcuts) |
| `public/sw.js` | Service Worker (caching strategy) |
| `components/pwa/service-worker-register.tsx` | Register SW in browser |
| `components/pwa/pwa-install-prompt.tsx` | Install banner |
| `components/pwa/offline-queue-indicator.tsx` | Offline queue status |
| `components/pwa/notification-permission-prompt.tsx` | Push notification prompt |
| `app/api/pwa/preferences/route.ts` | Store PWA user preferences |

## Generate PWA Icons

```bash
# Tạo icons từ SVG source
npm run pwa:icons
```

## manifest.json Shortcuts

Khi thêm feature mới quan trọng, cân nhắc thêm shortcut vào `public/manifest.json`:

```json
{
  "shortcuts": [
    {
      "name": "Tên shortcut",
      "short_name": "Tên ngắn",
      "description": "Mô tả",
      "url": "/path-to-feature"
    }
  ]
}
```
