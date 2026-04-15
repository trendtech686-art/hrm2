# HRM2 — Copilot Instructions

> Hệ thống ERP quản lý nhân sự, bán hàng, kho vận, tài chính.
> **Giao tiếp bằng tiếng Việt.**

## Tech Stack
Next.js 16 (App Router, Turbopack) · TypeScript 5.8 · React 19 · PostgreSQL + Prisma 7 (multi-schema) · NextAuth v5 (JWT) · TanStack React Query 5 · Zustand (UI only) · shadcn/ui + Tailwind v4 · React Hook Form + Zod · Meilisearch · Sentry · Vitest

## Architecture Rules

1. **Feature isolation**: `features/[module]/api/` KHÔNG import từ feature khác
2. **Server Actions** cho mutations (32 active files), **API Routes** cho reads (~56 routes)
3. **Zustand chỉ cho UI state** — server data PHẢI dùng React Query
4. **Direct imports** — KHÔNG barrel exports (`import { Button } from '@/components/ui/button'`)
5. **Toast trong onSuccess** — KHÔNG toast trước khi mutation hoàn thành
6. **Server actions**: Dùng `getSessionFromCookie()` (KHÔNG `auth()` trong Next.js 16)

## Key Commands
```bash
npm run dev              # Dev server (Turbopack)
npm run build            # Production build
npm run lint:fix         # Fix lint
npm run typecheck:strict # Strict TS check
npm run test             # Vitest
```

## Mutation Patterns (auto-detect)
- **Standard (31 modules)**: hooks → `useMutation({ mutationFn: serverAction })` → `@/app/actions/xxx`
- **Hybrid (3)**: sales-returns, stock-transfers, payroll — API routes cho complex mutations
- **API-First (2)**: task-templates, recurring-tasks — KHÔNG dùng Server Actions
- **Settings**: API Routes + React Query (KHÔNG Server Actions + Zustand)

## Dead Code Warning
- `app/actions/settings/*.ts` — 33 files dead code (trừ `module-settings.ts`)
- 12 root dead actions: `audit-logs`, `auth`, `cashbook-summary`, `customer-debt`, `custom-fields`, `dashboard`, `order-search`, `payroll-mutations`, `payroll-profiles`, `recurring-tasks`, `reports`, `task-templates`

## Common Bug Fixes
| Lỗi | Fix |
|-----|-----|
| Decimal serialization | `serializeDecimals()` từ `lib/api-utils` |
| `auth()` fails in server actions | Dùng `getSessionFromCookie()` |
| Toast fires before mutation | Move toast vào `{ onSuccess }` callback |
| Cache-only query undefined | `queryClient.ensureQueryData()` |
| Cross-module cache stale | `invalidateRelated(queryClient, 'module')` từ `lib/query-invalidation-map` |

## Cache Invalidation
- **`invalidateRelated(queryClient, 'module-name')`** — chuẩn duy nhất cho tất cả mutations
- Cross-module deps centralized trong `INVALIDATION_MAP` (`lib/query-invalidation-map.ts`)
- KHÔNG hardcode `queryClient.invalidateQueries({ queryKey: ['other-module'] })` inline
- `['activity-logs']` handled globally bởi `MutationCache` — KHÔNG thêm vào map
- KHÔNG dùng `refetchOnMount: false` — `staleTime` kiểm soát freshness

## Khi review/audit code
Luôn kiểm tra theo `docs/MODULE-QUALITY-CRITERIA-V4.md`. Context đầy đủ: `CLAUDE.md`.

## Available Agents & Prompts
- `@code-reviewer` — review code theo V3 criteria
- `@settings-auditor` — audit settings module 15 điểm
- `@bug-fixer` — chẩn đoán + fix bugs
- `/audit-module [tên]` — audit 1 module cụ thể
- `/create-module [tên]` — tạo module mới chuẩn
- `/find-dead-code [scope]` — tìm dead code
