# HRM2 (erp-nextjs) — Claude Context

> Hệ thống ERP quản lý nhân sự, bán hàng, kho vận, tài chính.
> Giao tiếp với user bằng **tiếng Việt**.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5.8, React 19 |
| Database | PostgreSQL + Prisma 7 (multi-schema) |
| Auth | NextAuth v5 (JWT, Credentials) |
| State | TanStack React Query 5 + Zustand |
| UI | shadcn/ui (Radix) + Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Search | Meilisearch |
| Error Tracking | Sentry |
| Testing | Vitest |

## Project Structure

```
app/                    # Next.js App Router
  (authenticated)/      # Protected pages (orders, products, employees...)
  api/                  # API route handlers
  login/                # Public login
features/               # Feature modules (39 domains)
  [feature]/
    api/                # Fetch functions (NO cross-feature imports)
    components/         # React components
    hooks/              # React Query hooks
    types.ts            # Feature types
    validation.ts       # Zod schemas
components/
  ui/                   # shadcn/ui base components
  shared/               # Reusable app components
  layout/               # Layout (sidebar, header, page-header)
  mobile/               # Mobile-specific components
lib/                    # Core utilities
  api-handler.ts        # Centralized API wrapper (auth + rate limit + error)
  api-utils.ts          # Auth, validation, response helpers
  api-permission-map.ts # Route → permission mapping
  prisma.ts             # Prisma client singleton
  query-client.ts       # React Query config
hooks/                  # Shared React hooks
types/                  # Global type definitions
prisma/schema/          # Modularized Prisma schema by domain
generated/prisma/       # Auto-generated Prisma types
```

## Key Commands

```bash
npm run dev              # Dev server (Turbopack)
npm run build            # Production build
npm run lint:fix         # Fix lint
npm run typecheck:strict # Strict TS check
npm run test             # Vitest
npm run db:seed          # Seed database
```

## Architecture Rules

### 1. Feature Isolation
- `features/[feature]/api/` chỉ chứa fetch functions — **KHÔNG import từ feature khác**
- Cross-feature communication qua React Query cache hoặc API calls
- Mỗi feature tự chứa: api/, components/, hooks/, types.ts, validation.ts

### 2. API Route Pattern
```typescript
// app/api/[feature]/route.ts
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiPaginated } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export const GET = apiHandler(async (req, { session, params }) => {
  const data = await prisma.order.findMany()
  return apiSuccess(data)
})

// Options: { auth: false, permission: 'manage_orders', rateLimit: { max: 10 } }
```

### 3. React Query Hook Pattern
```typescript
// features/[feature]/hooks/use-[feature].ts
export const featureKeys = {
  all: ['feature'] as const,
  lists: () => [...featureKeys.all, 'list'] as const,
  list: (params) => [...featureKeys.lists(), params] as const,
  detail: (id: string) => [...featureKeys.all, 'detail', id] as const,
}

export function useFeature(params, initialData?) {
  return useQuery({
    queryKey: featureKeys.list(params),
    queryFn: () => fetchFeature(params),
    initialData,
  })
}
```

### 4. Authentication & Authorization
- **JWT-based** (stateless, no DB calls in middleware)
- `middleware.ts`: Checks permissions via `lib/api-permission-map.ts`
- Session: `session.user.role` + `session.user.employee.role`
- Permission check: `hasPermission(role, permission)` from `features/employees/permissions.ts`
- Server actions: Use `getSessionFromCookie()` (NOT `auth()` in Next.js 16)

### 5. Prisma Schema Organization
```
prisma/schema/
  000-base.prisma     # Generator + datasource + shared enums
  common/             # ActivityLog, TraceLog
  auth/               # User, Role
  hrm/                # Employee, Attendance, Leave, Payroll, Penalty
  sales/              # Order, Customer, Shipment
  inventory/          # Product, Stock, StockCheck
  finance/            # Payment, Cashbook, CostAdjustment
  procurement/        # Supplier, PurchaseOrder
  settings/           # SettingsData (metadata JSON pattern)
```

### 6. SettingsData Metadata Pattern
Extra fields (address, phone, taxCode, usageGuide...) stored in `metadata` JSON column:
```typescript
// Save: extract known fields → rest goes to metadata
const { name, code, ...extraFields } = body
await prisma.settingsData.create({
  data: { name, code, metadata: extraFields }
})

// Read: merge metadata back into response
const item = await prisma.settingsData.findUnique(...)
return apiSuccess({ ...item, ...(item.metadata as object) })
```

### 7. Print Template System
- Templates: `features/settings/printer/templates/[template-name].ts`
- Types: `features/settings/printer/types.ts` (TemplateType union, PaperSize)
- Registry: `features/settings/printer/templates/index.ts`
- Hook: `lib/use-print.ts` (print, printMultiple, printMixedDocuments)
- Template format: HTML string with `{variable}` placeholders

### 8. UI Conventions
- **Desktop → Mobile responsive**: `md:` breakpoint prefix
- **Touch targets**: `h-10 md:h-9` (40px mobile, 36px desktop)
- **Cards on mobile**: Flat `<div>` with `rounded-xl border border-border/50 bg-card p-4`
- **Section headers**: `text-xs font-medium text-muted-foreground uppercase tracking-wider`
- **Permission guards**: ALL edit buttons must check `can('edit_xxx')`
- **Shadcn imports**: `import { Button } from '@/components/ui/button'`

### 9. Toast Pattern
```typescript
// ✅ Correct: toast in onSuccess callback
mutate(data, {
  onSuccess: () => toast.success('Thành công'),
  onError: (err) => toast.error(err.message)
})

// ❌ Wrong: toast before mutation completes
mutate(data)
toast.success('Thành công')
```

### 10. Cache Invalidation
```typescript
// ✅ Correct: centralized invalidation
import { invalidateRelated } from '@/lib/query-invalidation-map'

onSuccess: () => {
  invalidateRelated(queryClient, 'orders')
}

// ❌ Wrong: hardcoded cross-module keys inline
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['orders'] })
  queryClient.invalidateQueries({ queryKey: ['customers'] })
  queryClient.invalidateQueries({ queryKey: ['activity-logs'] }) // handled globally
}
```

- `INVALIDATION_MAP` in `lib/query-invalidation-map.ts` defines cross-module deps
- `['activity-logs']` handled globally by `MutationCache` – never add inline
- KHÔNG dùng `refetchOnMount: false` — `staleTime` controls freshness

### 11. ID System
- `systemId`: UUID primary identifier
- `businessId`: Branded prefix (e.g., `ORD-2025-001`)
- Docs: `docs/MODULE-QUALITY-CRITERIA-V4.md`

## Common Imports

```typescript
// Auth
import { auth } from '@/auth'
import { getSessionFromCookie } from '@/lib/api-utils'

// Database
import { prisma } from '@/lib/prisma'
import type { Order, Product } from '@/generated/prisma'

// API
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiPaginated } from '@/lib/api-utils'

// React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateRelated } from '@/lib/query-invalidation-map'

// UI
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Forms
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Hooks
import { useBreakpoint } from '@/contexts/breakpoint-context'
```

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Decimal serialization error | `serializeDecimals()` from `lib/api-utils` |
| `auth()` breaks in server actions (Next.js 16) | Use `getSessionFromCookie()` |
| Circular imports | Keep `features/*/api/` isolated — no cross-feature imports |
| Turbopack compile blocks DB | `auth.ts` has retry logic (2 attempts, 1s delay) |
| Cache-only query returns undefined | Use `queryClient.ensureQueryData()` for on-demand fetch |
| Toast fires before mutation | Move toast into `{ onSuccess }` callback |
