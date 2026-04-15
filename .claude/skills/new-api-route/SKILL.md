# Skill: Tạo API Route mới

## Khi nào dùng
User yêu cầu thêm API endpoint mới (CRUD, custom action, batch operation).

## Các bước thực hiện

### 1. Tạo route file
```
app/api/[feature]/route.ts           # GET list + POST create
app/api/[feature]/[systemId]/route.ts # GET detail + PUT update + DELETE
app/api/[feature]/[action]/route.ts   # Custom actions (batch-import, stats, export)
```

### 2. Sử dụng apiHandler wrapper
```typescript
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiPaginated } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { serializeDecimals } from '@/lib/api-utils'

// GET - List with pagination
export const GET = apiHandler(async (req, { session }) => {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 50

  const [data, total] = await Promise.all([
    prisma.model.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.model.count(),
  ])

  return apiPaginated(serializeDecimals(data), {
    page, limit, total, totalPages: Math.ceil(total / limit),
  })
})

// POST - Create
export const POST = apiHandler(async (req, { session }) => {
  const body = await req.json()
  // Validate with Zod schema
  const result = await prisma.model.create({ data: body })
  return apiSuccess(result, 201)
})
```

### 3. Thêm permission mapping (nếu cần)
File: `lib/api-permission-map.ts`
```typescript
// Thêm vào PERMISSION_MAP
'feature-name': { GET: 'view_feature', POST: 'manage_feature' },
'feature-name/[id]': { PUT: 'manage_feature', DELETE: 'manage_feature' },
```

### 4. Tạo fetch functions cho React Query
File: `features/[feature]/api/[feature]-api.ts`
```typescript
export async function fetchFeatures(params: FeatureParams) {
  const searchParams = new URLSearchParams()
  // ... build params
  const res = await fetch(`/api/features?${searchParams}`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}
```

### 5. Tạo React Query hook
File: `features/[feature]/hooks/use-[feature].ts`

## Checklist
- [ ] Route file tạo đúng path
- [ ] Dùng `apiHandler` wrapper (KHÔNG tự viết try/catch)
- [ ] Decimal fields qua `serializeDecimals()`
- [ ] Permission mapping nếu route cần bảo vệ
- [ ] Fetch function + React Query hook
- [ ] TypeScript types cho request/response
