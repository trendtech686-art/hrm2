---
description: "Use when creating or editing API route handlers in app/api/. Covers auth patterns, response helpers, and apiHandler usage."
applyTo: "app/api/**/*.ts"
---
# API Route Pattern

## Standard Pattern
```typescript
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiPaginated } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export const GET = apiHandler(async (req, { session, params }) => {
  // ... logic
  return apiSuccess(data)
  // hoặc: return apiPaginated({ data, total, page, limit })
})

export const POST = apiHandler(async (req, { session }) => {
  const body = await req.json()
  // validate with Zod
  // ... logic
  return apiSuccess(data, 201)
}, { permission: 'edit_xxx' })
```

## Options
```typescript
apiHandler(fn, {
  auth: false,              // Public endpoint
  permission: 'manage_xxx', // Required permission
  rateLimit: { max: 10 },   // Rate limiting
})
```

## Rules
- Dùng `apiHandler()` cho routes MỚI (auto auth + rate limit + error handling)
- Routes cũ dùng `requireAuth()` — chấp nhận, migrate khi sửa file
- Response: `apiSuccess(data)`, `apiError('message', status)`, `apiPaginated({...})`
- Decimal fields: dùng `serializeDecimals()` từ `lib/api-utils`
- KHÔNG import từ `features/*/api/` — API routes là server-side
