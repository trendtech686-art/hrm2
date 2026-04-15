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
