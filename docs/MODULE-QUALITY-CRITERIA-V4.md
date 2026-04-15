# Tiêu Chí Audit Module — V4

> **Phiên bản**: 4.0 — Tháng 04/2026
> **Stack**: Next.js 16, React 19, Prisma 7, TanStack React Query 5, Zustand (UI only)
> **Mục đích**: Đánh giá chất lượng từng module khi audit
> **Kiến trúc chi tiết**: `CLAUDE.md` · **Pattern chi tiết**: `.github/instructions/*.instructions.md`

---

## Mục Lục

1. [Chuẩn Bị Audit](#1-chuẩn-bị-audit)
2. [Audit Feature Module — 45 Điểm](#2-audit-feature-module--45-điểm)
3. [Audit Settings Module — 25 Điểm](#3-audit-settings-module--25-điểm)
4. [Mức Đánh Giá](#4-mức-đánh-giá)
5. [Quy Trình Audit](#5-quy-trình-audit)
6. [Checklist Nhanh](#6-checklist-nhanh)

**Phụ Lục**
- [A. Pattern Reference](#a-pattern-reference)
- [B. Module Inventory](#b-module-inventory)
- [C. Troubleshooting](#c-troubleshooting)

---

## 1. Chuẩn Bị Audit

### 1.1 Xác Định Loại Module

| Loại | Vị trí | Thang điểm |
|------|--------|-----------|
| **Feature module** | `features/[module]/` | 30 điểm (§2) |
| **Settings module** | `features/settings/[module]/` | 25 điểm (§3) |

### 1.2 Xác Định Mutation Pattern

Mở hooks file → xem `mutationFn` import từ đâu:

| Import từ | Pattern | Ví dụ |
|-----------|---------|-------|
| `@/app/actions/xxx` | **Standard SA** | orders, employees, customers |
| `features/xxx/api/` (fetch) | **API-First** | task-templates, recurring-tasks, settings |
| Cả hai | **Hybrid** | sales-returns, stock-transfers, payroll |

### 1.3 Nguyên Tắc Chung

Áp dụng mọi module — vi phạm bất kỳ = trừ điểm tại mục tương ứng:

| Nguyên tắc | Chi tiết |
|------------|---------|
| **Zustand = UI only** | Server data phải dùng React Query |
| **Direct imports** | `from '@/components/ui/button'` — không barrel |
| **Tiếng Việt** | Tất cả messages, labels, toast, activity log |
| **Auth trong Server Actions** | `getSessionFromCookie()` — KHÔNG `auth()` |

---

## 2. Audit Feature Module — 45 Điểm

> Mỗi mục = 1 điểm. Tổng 45 mục chia 9 nhóm.
> Nếu nhóm không áp dụng (VD: module không có activity log → bỏ §2.6 + §2.7, module API-First → bỏ §2.9) → tính trên tổng còn lại.

### 2.1 Cấu Trúc & Code Organization (5đ)

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | Feature directory đủ: `api/`, `hooks/`, `types.ts`, `validation.ts` | `features/[m]/` |
| 2 | `columns.tsx` tách riêng khỏi page | `features/[m]/columns.tsx` |
| 3 | Heavy components dùng `dynamic()` import | `features/[m]/page.tsx` — tìm Dialog, Drawer, Chart |
| 4 | Direct imports — không barrel exports | Grep `from '@/components/ui'` (không có `/component-name` cuối) |
| 5 | Hooks tách riêng — logic phức tạp extract ra custom hook | `features/[m]/hooks/` |

### 2.2 Hooks & Data Layer (5đ)

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | Query key factory: `xxxKeys = { all, lists, list, details, detail }` | `features/[m]/hooks/use-[m].ts` |
| 2 | `placeholderData: keepPreviousData` trong list queries | `use-[m].ts` — `useQuery` config |
| 3 | Optimistic updates: `onMutate` + rollback cho toggle/delete | Mutations trong hooks |
| 4 | `fetchAllPages()` cho dropdown hooks — không hardcode limit | `use-all-[m].ts` hoặc tương tự |
| 5 | `useColumnLayout()` cho column visibility/order/pinning | `features/[m]/page.tsx` |

### 2.3 API Routes (5đ)

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | Auth: `apiHandler()` hoặc `requireAuth()` | `app/api/[m]/route.ts` |
| 2 | Zod validation cho POST/PATCH input | `route.ts` hoặc `app/api/[m]/validation.ts` |
| 3 | Response format: `apiSuccess()` / `apiPaginated()` / `apiError()` | Tất cả route handlers |
| 4 | Partial update: conditional spread — không ghi đè toàn bộ | `[systemId]/route.ts` → PATCH |
| 5 | Error messages tiếng Việt | Catch blocks, validation messages |

### 2.4 Server-Side & Caching (5đ)

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | Server data: `unstable_cache` + `react cache` | `lib/data/[m].ts` |
| 2 | List page: `Suspense` + `force-dynamic` + `initialStats/Data` | `app/(authenticated)/[m]/page.tsx` |
| 3 | Server Actions: `requireActionPermission()` + `revalidatePath/Tag` | `app/actions/[m].ts` |
| 4 | Server Actions: `getSessionFromCookie()` — không `auth()` | `app/actions/[m].ts` |
| 5 | `export const metadata: Metadata` cho mỗi route page | `app/(authenticated)/[m]/page.tsx` |

### 2.5 UI & Permission (5đ)

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | Permission guards: `can('xxx')` cho edit/delete buttons | `page.tsx`, các components |
| 2 | Toast trong `onSuccess` callback — không toast trước mutation | Mutations hooks |
| 3 | `isLoading` prop trên DataTable / loading states | `page.tsx` |
| 4 | Responsive: `md:` breakpoint cho desktop/mobile | Components |
| 5 | 0 TypeScript errors, 0 ESLint errors | `npm run typecheck:strict` |

### 2.6 Activity Log — Format (5đ)

> Nếu module không có activity log (read-only modules) → bỏ §2.6 + §2.7, tính trên 25.

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | Action format tiếng Việt chi tiết: `'Cập nhật [entity]: [tên]: [fields]'` | Server Actions / API routes |
| 2 | Changes key tiếng Việt: `'Tên'`, `'Mô tả'` — không `'name'` | `changes` object |
| 3 | Boolean → text: `'Hoạt động'/'Ngừng'`, `'Có'/'Không'` — không `true/false` | `changes` values |
| 4 | Fire-and-forget: `.catch()` — không `await` — không block response | `createActivityLog(...)` calls |
| 5 | `createdBy = userName` (tên hiển thị người thao tác) — không user ID | `createdBy` field |

### 2.7 Activity Log — Coverage (5đ)

> Kiểm tra ĐỘ PHỦ — mọi thao tác người dùng đều phải được ghi log.

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | **Mọi mutation phải có log** — map tất cả operations (create, update, delete, restore, terminate, bulk, toggle) từ hooks → xác minh log tương ứng trong SA/API | So sánh `mutationFn` trong hooks với `createActivityLog` trong SA/API |
| 2 | **Update log phải có `changes` diff** — không chỉ note chung (VD: "Cập nhật nhân viên") — phải ghi rõ field nào thay đổi | API route PUT/PATCH + Server Actions update |
| 3 | **Bulk operations phải ghi log** — mỗi item hoặc summary (count + danh sách IDs/tên) | `bulk/route.ts`, batch handlers |
| 4 | **Side-effect operations phải ghi log riêng** — tạo/cập nhật User account, đổi mật khẩu, thay đổi liên quan entity khác | SA/API handlers có modify related entities |
| 5 | **Helper lấy tên nhất quán** — SA dùng `getSessionUserName()`, API dùng `getUserNameFromDb()` — không inline `session.user?.employee?.fullName` | Tất cả `createdBy` assignments |

### 2.8 Data Integrity (5đ)

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | **`apiHandler()` wrapper** cho API routes — không `requireAuth()` thủ công — đảm bảo rate limiting + error handling chuẩn + không leak error details ở production | `app/api/[m]/**/*.ts` |
| 2 | **`serializeDecimals()`** cho modules có Prisma Decimal fields (`baseSalary`, `shippingFee`, `totalCost`...) — tránh `BigInt serialization error` | SA return + API response |
| 3 | **`$transaction`** cho multi-step mutations (create entity + update related + generate ID) — tránh data inconsistency | SA/API handlers có nhiều `prisma.xxx` calls liên tiếp |
| 4 | **Soft delete consistency** — Model có `isDeleted` → đủ endpoints: list deleted, restore, permanent archive | `app/api/[m]/` + trash page |
| 5 | **URL state sync** — List page filters/pagination sync vào `searchParams` — tránh mất state khi navigate back | `features/[m]/page.tsx` — `useServerFilters` hoặc `useSearchParams` |

### 2.9 Server Action Safety (5đ)

> Áp dụng cho modules dùng **Standard SA** hoặc **Hybrid** pattern. Bỏ qua cho API-First modules.

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | **`safeParse()`** cho validation — không `schema.parse()` (throws uncaught → crash thay vì trả lỗi) | `app/actions/[m].ts` — tìm `.parse(` vs `.safeParse(` |
| 2 | **Mọi mutation SA phải có Zod validation** — không chỉ trust client-side validation | `app/actions/[m].ts` — create/update functions |
| 3 | **`ActionResult<T>`** return type nhất quán — `{ success: true, data }` hoặc `{ success: false, error }` | Return types của tất cả SA functions |
| 4 | **Revalidation đủ path** — `revalidatePath()` cho mọi path bị ảnh hưởng (list + detail + related entities) | SA sau mỗi mutation |
| 5 | **Catch blocks an toàn** — trả message tiếng Việt generic, không expose stack trace / Prisma error details | `catch(error)` blocks trong SA |

---

## 3. Audit Settings Module — 25 Điểm

> Mỗi mục = 1 điểm. Tổng 25 mục chia 5 nhóm.
> Settings dùng **API Routes + React Query** — KHÔNG Server Actions + Zustand.

### 3.1 API & Data (5đ)

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | API có auth: `apiHandler()` hoặc `requireAuth()` | `app/api/[m]/route.ts` |
| 2 | Partial update: conditional spread | `[systemId]/route.ts` → PATCH |
| 3 | Đọc existing TRƯỚC update (để so sánh diff cho activity log) | PATCH handler — `findUnique` trước `update` |
| 4 | Frontend extract `.data` từ `apiSuccess()` response | `features/settings/[m]/api/` hoặc hooks |
| 5 | Endpoint nhất quán: API layer + hooks cùng URL | So sánh `api/[m]-api.ts` và `hooks/use-[m].ts` |

### 3.2 Activity Log (5đ)

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | Action format tiếng Việt chi tiết | API route PATCH/POST/DELETE |
| 2 | Changes key tiếng Việt | `changes` object |
| 3 | Boolean → text | `changes` values |
| 4 | `.catch()` non-blocking — không `await` | `createActivityLog()` call |
| 5 | `createdBy = userName` — tên hiển thị | `createdBy` field |

### 3.3 Hooks & React Query (5đ)

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | Dùng React Query cho server data — không Zustand | `features/settings/[m]/hooks/` |
| 2 | Query key factory pattern | Hooks file |
| 3 | Optimistic updates cho toggle/status mutations | `onMutate` + rollback |
| 4 | `onSettled` invalidate root key (không chỉ list) | Mutations `onSettled` callback |
| 5 | `staleTime` + `gcTime` cấu hình hợp lý | `useQuery` config |

### 3.4 UI & UX (5đ)

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | Lịch sử = `SettingsHistoryContent` card dưới cùng — không phải tab riêng | Content component |
| 2 | Toast tiếng Việt trong `onSuccess` callback | Mutations hooks |
| 3 | Permission guard: `can('edit_settings')` cho edit/delete | Components |
| 4 | Settings page header đúng: `useSettingsPageHeader()` + breadcrumb | Content component |
| 5 | Switch toggle optimistic — UI phản hồi tức thì | Toggle components |

### 3.5 Code Quality (5đ)

| # | Tiêu chí | Kiểm tra tại |
|---|----------|-------------|
| 1 | Không dead server actions (`app/actions/settings/[m].ts` không ai import) | Grep imports |
| 2 | Không dead hooks/api files không ai import | Grep imports |
| 3 | Zod schemas cho validation | `validation.ts` |
| 4 | Direct imports — không barrel exports | Grep imports |
| 5 | 0 TypeScript / ESLint errors | `npm run typecheck:strict` |

---

## 4. Mức Đánh Giá

| Mức | Điểm | Hành động |
|-----|------|-----------|
| ⭐ **Excellent** | ≥ 90% | Không cần fix |
| **A Good** | 75–89% | Minor fixes |
| **B Acceptable** | 60–74% | Cần fix sớm |
| **C Needs Work** | 40–59% | Ưu tiên fix |
| **D Critical** | < 40% | Must fix ngay |

**Tính điểm:**
- Feature: `điểm / 45 × 100%` (bỏ nhóm không áp dụng ra khỏi tổng, VD: `/35` nếu bỏ Activity Log, `/40` nếu bỏ §2.9)
- Settings: `điểm / 25 × 100%`

**Ưu tiên fix theo mức độ:**
- 🔴 **Nghiêm trọng**: Security (auth missing), data loss risks
- 🟡 **Quan trọng**: Missing patterns (optimistic, validation), dead code
- 🟢 **Nhỏ**: UI polish, useColumnLayout, performance tuning

---

## 5. Quy Trình Audit

```
1. CHUẨN BỊ
   → Xác định loại module (§1.1) và mutation pattern (§1.2)
   → Copy checklist nhanh (§6)

2. ĐỌC CODE — theo thứ tự
   a. Entry: features/[m]/page.tsx (thin page? columns tách?)
   b. Hooks: features/[m]/hooks/ (React Query? optimistic? query keys?)
   c. API: features/[m]/api/ (fetch functions)
   d. Routes: app/api/[m]/ (auth? validation? response format?)
   e. Server Actions: app/actions/[m].ts (auth? revalidate? activity log?)
   f. Server Page: app/(authenticated)/[m]/page.tsx (Suspense? metadata?)
   g. Server Data: lib/data/[m].ts (cache?)

3. KIỂM TRA TỪNG MỤC
   → Feature: §2.1 → §2.9 (45 mục)
   → Settings: §3.1 → §3.5 (25 mục)
   → Ghi ✅/❌/N/A cho mỗi mục

4. KIỂM TRA KỸ THUẬT
   → get_errors cho các files chính
   → npm run typecheck:strict (nếu cần)

5. TỔNG HỢP
   → Tính điểm (§4)
   → Phân loại issues: 🔴 / 🟡 / 🟢
   → Đề xuất fix theo ưu tiên
```

---

## 6. Checklist Nhanh — Copy Khi Audit

### 6.1 Feature Module

```markdown
## Audit: [Tên Module]
**Loại**: Feature
**Pattern**: Standard SA / Hybrid / API-First
**Ngày**: DD/MM/YYYY

### 2.1 Cấu Trúc (5đ)
- [ ] Feature directory đủ files
- [ ] columns.tsx tách riêng
- [ ] Heavy components dùng dynamic()
- [ ] Direct imports (không barrel)
- [ ] Hooks tách riêng (custom hooks)

### 2.2 Hooks & Data (5đ)
- [ ] Query key factory
- [ ] keepPreviousData cho list
- [ ] Optimistic updates (toggle/delete)
- [ ] fetchAllPages() cho dropdown
- [ ] useColumnLayout()

### 2.3 API Routes (5đ)
- [ ] Auth (apiHandler/requireAuth)
- [ ] Zod validation
- [ ] Response format chuẩn
- [ ] Partial update
- [ ] Error messages tiếng Việt

### 2.4 Server-Side (5đ)
- [ ] lib/data/*.ts (unstable_cache)
- [ ] Suspense + force-dynamic + initialData
- [ ] requireActionPermission + revalidate
- [ ] getSessionFromCookie (không auth())
- [ ] export metadata

### 2.5 UI & Permission (5đ)
- [ ] Permission guards can('xxx')
- [ ] Toast trong onSuccess
- [ ] isLoading trên DataTable
- [ ] Responsive md:
- [ ] 0 TS/ESLint errors

### 2.6 Activity Log — Format (5đ)
- [ ] Action tiếng Việt chi tiết
- [ ] Changes key tiếng Việt
- [ ] Boolean → text
- [ ] .catch() non-blocking
- [ ] createdBy = userName

### 2.7 Activity Log — Coverage (5đ)
- [ ] Mọi mutation phải có log (map operations ↔ log calls)
- [ ] Update log có changes diff chi tiết
- [ ] Bulk operations có log
- [ ] Side-effect operations có log riêng
- [ ] Helper lấy tên nhất quán (không inline)

### 2.8 Data Integrity (5đ)
- [ ] apiHandler() wrapper (không requireAuth thủ công)
- [ ] serializeDecimals() cho Decimal fields
- [ ] $transaction cho multi-step mutations
- [ ] Soft delete consistency (isDeleted → đủ endpoints)
- [ ] URL state sync filters/pagination

### 2.9 Server Action Safety (5đ)
- [ ] safeParse() (không schema.parse())
- [ ] Mọi mutation SA có Zod validation
- [ ] ActionResult<T> return type nhất quán
- [ ] Revalidation đủ path
- [ ] Catch blocks an toàn (không expose error details)

### Kết Quả
- **Điểm**: ___/45 = ___%
- **Mức**: ___
- **Issues**:
  - 🔴: ___
  - 🟡: ___
  - 🟢: ___
```

### 6.2 Settings Module

```markdown
## Audit: [Tên Module] (Settings)
**Pattern**: CRUD Entity / Config
**Ngày**: DD/MM/YYYY

### 3.1 API & Data (5đ)
- [ ] Auth (apiHandler/requireAuth)
- [ ] Partial update
- [ ] Đọc existing trước update
- [ ] Frontend extract .data
- [ ] Endpoint nhất quán

### 3.2 Activity Log (5đ)
- [ ] Action tiếng Việt chi tiết
- [ ] Changes key tiếng Việt
- [ ] Boolean → text
- [ ] .catch() non-blocking
- [ ] createdBy = userName

### 3.3 Hooks & React Query (5đ)
- [ ] React Query (không Zustand cho data)
- [ ] Query key factory
- [ ] Optimistic updates (toggle)
- [ ] onSettled invalidate root key
- [ ] staleTime + gcTime

### 3.4 UI & UX (5đ)
- [ ] Lịch sử = card dưới cùng
- [ ] Toast tiếng Việt trong onSuccess
- [ ] Permission guard
- [ ] Settings page header
- [ ] Switch toggle optimistic

### 3.5 Code Quality (5đ)
- [ ] Không dead server actions
- [ ] Không dead hooks/api
- [ ] Zod schemas
- [ ] Không barrel exports
- [ ] 0 TS/ESLint errors

### Kết Quả
- **Điểm**: ___/25 = ___%
- **Mức**: ___
- **Issues**:
  - 🔴: ___
  - 🟡: ___
  - 🟢: ___
```

---

## Phụ Lục

### A. Pattern Reference

> Chi tiết đầy đủ xem `.github/instructions/*.instructions.md` và `CLAUDE.md`.

#### apiHandler() — API Route chuẩn

```typescript
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiPaginated } from '@/lib/api-utils'

export const GET = apiHandler(async (request, { session }) => {
  // Auth tự động, error handling tự động, rate limit tự động
  const data = await prisma.xxx.findMany()
  return apiSuccess(data)
})

export const POST = apiHandler(async (request, { session }) => {
  const validation = await validateBody(request, schema)
  if (!validation.success) return apiError(validation.error, 400)
  // ...
  return apiSuccess(created)
}, { permission: 'edit_xxx' })
```

Options: `{ auth?: boolean, permission?: Permission, rateLimit?: false | { max, windowMs } }`

#### Query Key Factory

```typescript
export const xxxKeys = {
  all: ['xxx'] as const,
  lists: () => [...xxxKeys.all, 'list'] as const,
  list: (params) => [...xxxKeys.lists(), params] as const,
  details: () => [...xxxKeys.all, 'detail'] as const,
  detail: (id: string) => [...xxxKeys.details(), id] as const,
}
```

#### Activity Log

```typescript
createActivityLog({
  entityType: 'xxx',
  entityId: systemId,
  action: 'Cập nhật [entity]: [tên]: [field1], [field2]',
  actionType: 'update',  // 'create' | 'update' | 'delete' | 'status'
  changes: {
    'Tên': { from: 'Cũ', to: 'Mới' },
    'Trạng thái': { from: 'Hoạt động', to: 'Ngừng' },
  },
  createdBy: userName,  // tên hiển thị, KHÔNG user ID
}).catch(e => console.error('Activity log failed:', e))
```

**Action format:**

| Hành động | Format |
|-----------|--------|
| Tạo mới | `Thêm [entity type]: [entity name]` |
| Cập nhật | `Cập nhật [entity type]: [entity name]: [field1], [field2]` |
| Xóa | `Xóa [entity type]: [entity name]` |
| Toggle | `Cập nhật [entity type]: [entity name]: Trạng thái` |

#### Server Component — List Page

```tsx
export const metadata: Metadata = { title: 'Tên trang' }
export const dynamic = 'force-dynamic'

async function PageWithData() {
  const initialStats = await getXxxStats()
  return <XxxPage initialStats={initialStats} />
}

export default function Page() {
  return <Suspense fallback={<TableSkeleton />}><PageWithData /></Suspense>
}
```

#### Optimistic Update — Delete

```typescript
const remove = useMutation({
  mutationFn: deleteXxxAction,
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: xxxKeys.lists() })
    const previous = queryClient.getQueriesData({ queryKey: xxxKeys.lists() })
    queryClient.setQueriesData({ queryKey: xxxKeys.lists() }, (old) => {
      // Filter out deleted item
    })
    return { previous }
  },
  onError: (_, __, ctx) => {
    ctx?.previous?.forEach(([key, data]) => queryClient.setQueryData(key, data))
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: xxxKeys.all }),
})
```

#### ✅/❌ So Sánh Nhanh

| Mục | ❌ Sai | ✅ Đúng |
|-----|--------|--------|
| Activity log | `await createActivityLog(...)` | `createActivityLog(...).catch(...)` |
| createdBy | `session.user?.id` | `userName` (tên hiển thị) |
| createdBy (inline) | `session.user?.employee?.fullName` | `getUserNameFromDb(session)` |
| Changes key | `{ name: ... }` | `{ 'Tên': ... }` |
| Boolean value | `true/false` | `'Hoạt động'/'Ngừng'` |
| Update log | `action: 'Cập nhật nhân viên'` (generic) | `action: 'Cập nhật nhân viên: Nguyễn A: Tên, SĐT'` + `changes` diff |
| Bulk log | Không có log | Log summary: `'Xóa 5 nhân viên: [tên1, tên2...]'` |
| Side-effect | Tạo User account không log | Log riêng: `'Tạo tài khoản đăng nhập cho: Nguyễn A'` |
| Toast | `mutate(); toast.success()` | `mutate(data, { onSuccess: () => toast.success() })` |
| Barrel import | `from '@/components/ui'` | `from '@/components/ui/button'` |
| Dropdown | `useXxx({ limit: 1000 })` | `fetchAllPages()` |
| Auth (SA) | `auth()` | `getSessionFromCookie()` |
| Server data | Zustand store | React Query `useQuery()` |
| API wrapper | `requireAuth()` thủ công | `apiHandler()` (rate limit + error) |
| Decimal fields | Return raw Prisma object | `serializeDecimals(data)` |
| Multi-step | Nhiều `prisma.xxx` tuần tự | `prisma.$transaction(...)` |
| URL filters | `useState` cho filter (mất khi back) | `useServerFilters` / `useSearchParams` |

#### Field Labels Chuẩn (Activity Log)

| Field DB | Label tiếng Việt | Giá trị hiển thị |
|----------|-----------------|-------------------|
| `name` | `Tên` | string |
| `description` | `Mô tả` | string |
| `isActive` | `Trạng thái` | `Hoạt động` / `Ngừng` |
| `isDefault` | `Mặc định` | `Có` / `Không` |
| `isApplied` | `Áp dụng` | `Có` / `Không` |
| `isPaid` | `Hưởng lương` | `Có` / `Không` |
| `taxable` | `Chịu thuế` | `Có` / `Không` |
| `numberOfDays` | `Số ngày` | number |
| `category` | `Danh mục` | string |

#### Settings — SettingsData Metadata Pattern

```typescript
// Save: tách known fields, phần còn lại → metadata JSON
const { name, code, ...extraFields } = body
await prisma.settingsData.create({
  data: { name, code, metadata: extraFields }
})

// Read: merge metadata trở lại response
const item = await prisma.settingsData.findUnique(...)
return apiSuccess({ ...item, ...(item.metadata as object) })
```

#### Settings — Page Layout

```tsx
function XxxSettingsContent() {
  useSettingsPageHeader({
    title: 'Tiêu đề',
    breadcrumb: [
      { label: 'Tên module', href: '/settings/xxx', isCurrent: true },
    ],
  })
  return (
    <>
      <SettingsVerticalTabs tabs={tabs}>
        <TabsContent value="tab1">...</TabsContent>
      </SettingsVerticalTabs>
      {/* Lịch sử LUÔN là card dưới cùng, KHÔNG phải tab */}
      <div className="mt-6">
        <SettingsHistoryContent entityTypes={['entity_type']} />
      </div>
    </>
  )
}
```

---

### B. Module Inventory

#### Feature Modules

| Ưu tiên | Module | Mutation Pattern | Ghi chú |
|---------|--------|-----------------|---------|
| 🔴 P0 | orders | SA + Hybrid | Core business |
| 🔴 P0 | products | Standard SA | Catalog |
| 🔴 P0 | customers | Standard SA | CRM |
| 🔴 P0 | employees | Standard SA | HRM core |
| 🔴 P0 | payments | Standard SA | Tài chính |
| 🔴 P0 | cashbook | Standard SA | Sổ quỹ |
| 🟡 P1 | inventory-checks | Standard SA | Kiểm kho |
| 🟡 P1 | inventory-receipts | Standard SA | Phiếu nhập |
| 🟡 P1 | stock-transfers | Hybrid | Multi-warehouse |
| 🟡 P1 | purchase-orders | Standard SA | Mua hàng |
| 🟡 P1 | purchase-returns | Standard SA | Trả hàng NCC |
| 🟡 P1 | sales-returns | Hybrid | Trả hàng KH |
| 🟡 P1 | suppliers | Standard SA | NCC |
| 🟡 P1 | shipments | Standard SA | Giao hàng |
| 🟡 P1 | warranty | Standard SA (special) | 3 hooks await SA |
| 🟡 P1 | complaints | Standard SA | Khiếu nại |
| 🟢 P2 | attendance | Standard SA | Chấm công |
| 🟢 P2 | leaves | Standard SA | Nghỉ phép |
| 🟢 P2 | payroll | Hybrid | Lương |
| 🟢 P2 | brands | Standard SA | Thương hiệu |
| 🟢 P2 | categories | Standard SA | Danh mục |
| 🟢 P2 | cost-adjustments | Standard SA | Điều chỉnh giá |
| 🟢 P2 | price-adjustments | SA via API wrapper | Đ/c giá bán |
| 🟢 P2 | receipts | Standard SA | Phiếu thu/chi |
| 🟢 P2 | reconciliation | SA via API wrapper | Đối soát |
| 🟢 P2 | packaging | Standard SA | Đóng gói |
| 🟢 P2 | tasks | Standard SA | Công việc |
| 🟢 P2 | wiki | Standard SA | KB nội bộ |
| ⚪ P3 | stock-locations | SA via API wrapper | Vị trí kho |
| ⚪ P3 | stock-history | SA via API wrapper | Lịch sử kho |
| ⚪ P3 | dashboard | Read-only | — |
| ⚪ P3 | reports | Read-only | — |
| ⚪ P3 | audit-log | Read-only | — |

#### Settings Submodules

| Ưu tiên | Module | Pattern | Ghi chú |
|---------|--------|---------|---------|
| 🔴 P0 | store-info | Config | Thông tin cửa hàng |
| 🔴 P0 | roles | CRUD Entity | Phân quyền |
| 🔴 P0 | taxes | CRUD Entity | Thuế |
| 🟡 P1 | departments | CRUD Entity | Phòng ban |
| 🟡 P1 | job-titles | CRUD Entity | Chức vụ |
| 🟡 P1 | employee-types | CRUD Entity | Loại NV |
| 🟡 P1 | branches | CRUD Entity | Chi nhánh |
| 🟡 P1 | units | CRUD Entity | Đơn vị tính |
| 🟡 P1 | penalty-types | CRUD Entity | Loại phạt |
| 🟡 P1 | penalties | CRUD Entity | Mức phạt |
| 🟡 P1 | provinces | CRUD Entity | Tỉnh/thành |
| 🟡 P1 | cash-accounts | CRUD Entity | TK tiền mặt |
| 🟡 P1 | receipt-types | CRUD Entity | Loại phiếu |
| 🟡 P1 | sales-channels | CRUD Entity | Kênh bán |
| 🟡 P1 | target-groups | CRUD Entity | Nhóm KH |
| 🟡 P1 | complaint-types | CRUD Entity | Loại KN |
| 🟡 P1 | payments | Config | Cấu hình TT |
| 🟡 P1 | shipping | Config | Cấu hình VC |
| 🟢 P2 | sales | Config | Cấu hình BH |
| 🟢 P2 | inventory | Config | Cấu hình kho |
| 🟢 P2 | employees | Config | Cấu hình NV |
| 🟢 P2 | customers | Config | Cấu hình KH |
| 🟢 P2 | complaints | Config | Cấu hình KN |
| 🟢 P2 | warranty | Config | Cấu hình BH |
| 🟢 P2 | tasks | Config | Cấu hình CV |
| 🟢 P2 | notifications | Config | Thông báo |
| 🟢 P2 | pricing | Config | Chính sách giá |
| 🟢 P2 | appearance | Zustand + DB sync | Giao diện |
| 🟢 P2 | printer | Zustand + templates | In ấn |
| ⚪ P3 | websites | Config | Web bán hàng |
| ⚪ P3 | trendtech / pkgx / px | Config | Tích hợp |
| ⚪ P3 | previews / templates / system | System | Hệ thống |

#### Audit Priority

| Level | Ý nghĩa | Thời điểm |
|-------|---------|-----------|
| 🔴 **P0** | Business-critical, dùng hàng ngày | Audit đầu tiên |
| 🟡 **P1** | Quan trọng, dùng thường xuyên | Audit sau P0 |
| 🟢 **P2** | Hỗ trợ, dùng không thường xuyên | Khi có thời gian |
| ⚪ **P3** | Hiếm dùng, read-only, system | Audit cuối cùng |

---

### C. Troubleshooting

| Lỗi | Fix |
|-----|-----|
| Decimal serialization error | `serializeDecimals()` từ `lib/api-utils` |
| `auth()` fails trong server actions | Dùng `getSessionFromCookie()` |
| Circular imports | Giữ `features/*/api/` isolated — không cross-import |
| Toast fires trước mutation | Move toast vào `{ onSuccess }` callback |
| Cache-only query returns undefined | `queryClient.ensureQueryData()` |
| Column visibility mất khi reload | Dùng `useColumnLayout()` (DB-persisted) |
| Switch toggle UI không refresh | `onSettled` invalidate ROOT key |
| Prisma field mới không nhận | `prisma generate` + restart dev |
| Settings lưu nhưng không áp dụng | Grep codebase xem ai đọc setting đó |

---

*Phiên bản 4.0 — Tháng 04/2026*
*Thay thế: MODULE-QUALITY-CRITERIA-V3.md, V2.1, SETTINGS-FIX-CHECKLIST.md, SETTINGS-MODULE-STANDARD.md*
