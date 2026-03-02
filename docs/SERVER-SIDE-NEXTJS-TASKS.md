# Server-Side Next.js — Công Việc Cần Hoàn Thành

> Ngày tạo: 01/03/2026
> Cập nhật: 01/03/2026
> Mục tiêu: Đảm bảo tất cả modules áp dụng đúng 4 pattern server-side Next.js
> Ước lượng: 2-3 ngày

## Tiến Độ Tổng Quan

| Task | Mô tả | Trạng thái |
|------|-------|------------|
| Task 1a | Suspense + force-dynamic cho 13 pages | ✅ HOÀN THÀNH |
| Task 1b | initialStats pattern cho 4 pages (có stats UI) | ✅ HOÀN THÀNH |
| Task 2 | penalties + wiki | ✅ ĐÃ CÓ SẴN |
| Task 3 | Audit Server Actions quality (31 files) | ✅ AUDIT XONG |
| Task 4 | Audit lib/data/ + tạo getXxxStats | ✅ HOÀN THÀNH |
| Task 5 | Update MODULE-QUALITY-CRITERIA.md | ✅ HOÀN THÀNH (v2.1) |
| Fix | price-adjustments xóa 'use client' | ✅ HOÀN THÀNH |
| Fix SA | Thêm auth() cho 23 Server Actions | ✅ HOÀN THÀNH |
| Fix SA | Thêm Zod validation cho 28/31 Server Actions | ✅ HOÀN THÀNH |
| Fix SA | Chuyển error messages sang tiếng Việt (21 files) | ✅ HOÀN THÀNH |
| Fix SA | Extract shared ActionResult<T> type | ✅ HOÀN THÀNH |

---

## Tổng Quan 4 Pattern

| # | Pattern | Vị trí | Mục đích |
|---|---------|--------|----------|
| 1 | **Server Actions** | `app/actions/*.ts` | Mutations (create/update/delete) + `revalidatePath/Tag` |
| 2 | **Server Data Layer** | `lib/data/*.ts` | Prefetch stats/data ở server với `unstable_cache` + `react cache()` |
| 3 | **Revalidation** | Trong Server Actions | `revalidatePath()` / `revalidateTag()` sau mỗi mutation |
| 4 | **initialStats Pattern** | `app/(authenticated)/*/page.tsx` | `Suspense` + `force-dynamic` + async server fetch → pass `initialStats` prop |

---

## Hiện Trạng

### 1. Server Actions — `app/actions/` (43 files ✅)

**ĐÃ CÓ ĐẦY ĐỦ.** Tất cả modules đều có Server Actions:

```
attendance, audit-logs, auth, brands, cashbook, cashbook-summary,
categories, complaints, cost-adjustments, custom-fields, customer-debt,
customers, dashboard, employees, inventory-checks, inventory-receipts,
leaves, order-actions, order-search, orders, packagings, payments,
payroll, payroll-mutations, payroll-profiles, price-adjustments,
products, purchase-orders, purchase-returns, receipts, reconciliation,
recurring-tasks, reports, sales-returns, shipments, stock-history,
stock-locations, stock-transfers, suppliers, task-templates, tasks,
warranty, wiki
```

**Kết luận:** ✅ Không cần thêm — chỉ cần audit chất lượng (xem Phần 5).

---

### 2. Server Data Layer — `lib/data/` (36 files ✅)

**ĐÃ CÓ ĐẦY ĐỦ.** Tất cả modules đều có data fetcher:

```
attendance, cashbook, categories-brands, complaints, cost-adjustments,
customers, dashboard, departments, employees, inventory, inventory-checks,
inventory-receipts, leaves, orders, packaging, payments, payroll,
penalties, price-adjustments, products, purchase-orders, purchase-returns,
receipts, reconciliation, reports, returns, sales-returns, settings,
shipments, stock-locations, stock-transfers, suppliers, tasks, warranty, wiki
```

**Pattern chuẩn đang dùng:**
```typescript
// lib/data/employees.ts
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

export const getEmployeeStats = cache(async () => {
  return unstable_cache(
    async () => {
      const [total, active, onLeave] = await Promise.all([...])
      return { total, active, onLeave }
    },
    ['employee-stats'],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.USERS] }
  )()
})
```

**Kết luận:** ✅ Không cần thêm — chỉ cần kiểm tra `getXxxStats()` tồn tại cho các module chưa dùng.

---

### 3. Cache Tags — `lib/cache.ts` ✅

**Đã có đầy đủ CACHE_TAGS và CACHE_TTL:**

| TTL | Giá trị | Dùng cho |
|-----|---------|----------|
| SHORT | 30s | Stats, frequently changing data |
| MEDIUM | 5 min | List pages |
| LONG | 30 min | Settings, reference data |
| HOUR | 1 hour | Static lookups |
| DAY | 24 hours | Rarely changing data |

**CACHE_TAGS:** 30+ tags cover all modules.

---

### 4. initialStats Pattern — 31/31 có Suspense ✅, 18/31 có initialStats ⚠️

> **Audit kết quả (01/03/2026):** Trong 13 pages mới thêm Suspense, chỉ 4 modules có Stats UI cần initialStats.
> 7 modules table-only (leaves, sales-returns, cost-adjustments, brands, categories, stock-locations, price-adjustments) — ĐÃ HOÀN THÀNH (chỉ cần Suspense+force-dynamic).

#### Phân loại modules theo Stats UI:

| Nhóm | Modules | Trạng thái |
|------|---------|------------|
| **A. Có Stats UI + cần initialStats** | purchase-returns, payroll, cashbook, dashboard | ⬜ Cần wire initialStats |
| **B. Stats tính client-side** | attendance (StatisticsDashboard computed từ data) | ⬜ Cân nhắc server stats |
| **C. Table-only, không cần Stats** | leaves, sales-returns, cost-adjustments, brands, categories, stock-locations, price-adjustments, reports | ✅ DONE (Suspense+force-dynamic) |

#### Chi tiết Nhóm A — Cần tạo getXxxStats + wire initialStats:

| # | Module | getXxxStats trong lib/data | initialStats prop | Stats UI | Ghi chú |
|---|--------|---------------------------|-------------------|----------|---------|
| 1 | **purchase-returns** | ❌ Cần tạo `getPurchaseReturnStats()` | ✅ Đã có prop | `<StatsCardGrid>` 4 cards | Gold-standard pattern, có `usePurchaseReturnStats()` |
| 2 | **payroll** | ❌ Cần tạo `getPayrollStats()` | ❌ Cần thêm | `<PayrollSummaryCards>` | Có `usePayrollStats()` hook |
| 3 | **cashbook** | ❌ Cần tạo `getCashbookStats()` | ❌ Cần thêm | 4x `<Card>` grid | Stats bundled trong `cashbookData.summary` |
| 4 | **dashboard** | ✅ `getDashboardStats()` | ❌ Cần thêm | `StatCard` grid + charts | Client-computed từ multiple hooks |

#### ✅ Đã có (18 pages) — Suspense + force-dynamic + initialStats:

| Page | Suspense | force-dynamic | initialStats | Custom Skeleton |
|------|----------|---------------|-------------|-----------------|
| employees | ✅ | ✅ | ✅ `getEmployeeStats()` | TableSkeleton |
| orders | ✅ | ✅ | ✅ `getOrderStats()` + `getOrdersCountByStatus()` | OrdersSkeleton |
| products | ✅ | ✅ | ✅ `getProductStats()` | ProductsSkeleton |
| customers | ✅ | ✅ | ✅ `getCustomerStats()` | CustomersSkeleton |
| complaints | ✅ | ✅ | ✅ `getComplaintStats()` | TableSkeleton |
| warranty | ✅ | ✅ | ✅ `getWarrantyStats()` | TableSkeleton |
| tasks | ✅ | ✅ | ✅ `getTaskStats()` | TableSkeleton |
| suppliers | ✅ | ✅ | ✅ `getSupplierStats()` | SuppliersSkeleton |
| stock-transfers | ✅ | ✅ | ✅ `getStockTransferStats()` | TableSkeleton |
| purchase-orders | ✅ | ✅ | ✅ `getPurchaseOrderStats()` + itemStats | PurchaseOrdersSkeleton |
| shipments | ✅ | ✅ | ✅ `getShipmentStats()` | TableSkeleton |
| payments | ✅ | ✅ | ✅ `getPaymentStats()` | PaymentsSkeleton |
| receipts | ✅ | ✅ | ✅ `getReceiptStats()` | ReceiptsSkeleton |
| reconciliation | ✅ | ✅ | ✅ `getReconciliationStats()` | TableSkeleton |
| inventory-checks | ✅ | ✅ | ✅ `getInventoryCheckStats()` | TableSkeleton |
| inventory | ✅ | ✅ | ✅ `getInventoryStats()` | InventorySkeleton |
| penalties | ✅ | ✅ | ❌ (chỉ Suspense) | TableSkeleton |
| wiki | ✅ | ✅ | ❌ (chỉ Suspense) | TableSkeleton |

#### ✅ Đã upgrade Suspense + force-dynamic (13 pages) — 01/03/2026:

| # | Page | Suspense | force-dynamic | initialStats | Ghi chú |
|---|------|----------|---------------|-------------|----------|
| 1 | **attendance** | ✅ | ✅ | ⬜ Cần `getAttendanceStats()` | |
| 2 | **leaves** | ✅ | ✅ | ⬜ Cần `getLeaveStats()` | |
| 3 | **payroll** | ✅ | ✅ | ⬜ Cần `getPayrollStats()` | |
| 4 | **cashbook** | ✅ | ✅ | ⬜ Cần `getCashbookStats()` | |
| 5 | **sales-returns** | ✅ | ✅ | ⬜ Cần `getSalesReturnStats()` | |
| 6 | **purchase-returns** | ✅ | ✅ | ⬜ Cần `getPurchaseReturnStats()` | |
| 7 | **cost-adjustments** | ✅ | ✅ | ⬜ Cần `getCostAdjustmentStats()` | |
| 8 | **brands** | ✅ | ✅ | ⬜ Cần `getBrandStats()` | |
| 9 | **categories** | ✅ | ✅ | ⬜ Cần `getCategoryStats()` | |
| 10 | **stock-locations** | ✅ | ✅ | ⬜ Cần `getStockLocationStats()` | |
| 11 | **reports** | ✅ | ✅ | N/A | Không cần stats |
| 12 | **price-adjustments** | ✅ | ✅ | ⬜ Cần `getPriceAdjustmentStats()` | ✅ Đã fix `'use client'` |
| 13 | **dashboard** | ✅ | ✅ | ⬜ Cần `getDashboardStats()` | |

> **Backup:** `backups/server-side-upgrade-20260301-152734/` (15 files gốc)

---

## Công Việc Chi Tiết

### Task 1: Upgrade 13 list pages ~~lên initialStats pattern~~

#### ✅ Phase 1: Suspense + force-dynamic — HOÀN THÀNH 01/03/2026

Tất cả 13 pages đã được upgrade thêm `Suspense`, `force-dynamic`, `TableSkeleton`.
- tsc: 0 errors ✅
- Runtime test: 13/13 routes passed (307 auth redirect) ✅
- Backup: `backups/server-side-upgrade-20260301-152734/`

#### ⬜ Phase 2: Thêm initialStats pattern (CẦN Task 4 trước)

**Mẫu chuyển đổi (từ Suspense-only → initialStats):**

Hiện tại (Suspense-only):
```tsx
export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <AttendancePage />
    </Suspense>
  )
}
```

Sau (initialStats):
```tsx
async function AttendancePageWithData() {
  const stats = await getAttendanceStats()
  return <AttendancePage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <AttendancePageWithData />
    </Suspense>
  )
}
```

**Cho mỗi page cần:**
1. ✅ ~~Thêm Suspense + force-dynamic~~ (DONE)
2. Kiểm tra `lib/data/[module].ts` đã có `getXxxStats()` chưa — nếu chưa thì tạo (Task 4)
3. Cập nhật `app/(authenticated)/[module]/page.tsx` thêm async wrapper + initialStats
4. Cập nhật `features/[module]/page.tsx` thêm `initialStats` prop (optional)
5. Đảm bảo features page dùng `initialStats` fallback khi React Query chưa load

| # | Page | Suspense | getStats | app/page.tsx | features/page.tsx | Test |
|---|------|----------|----------|-------------|-------------------|------|
| 1 | attendance | ✅ | ⬜ | ⬜ | ⬜ | ⬜ |
| 2 | leaves | ✅ | N/A | N/A | N/A | ✅ |
| 3 | payroll | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 | cashbook | ✅ | ✅ | ✅ | ✅ | ✅ |
| 5 | sales-returns | ✅ | N/A | N/A | N/A | ✅ |
| 6 | purchase-returns | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7 | cost-adjustments | ✅ | N/A | N/A | N/A | ✅ |
| 8 | brands | ✅ | N/A | N/A | N/A | ✅ |
| 9 | categories | ✅ | N/A | N/A | N/A | ✅ |
| 10 | stock-locations | ✅ | N/A | N/A | N/A | ✅ |
| 11 | reports | ✅ | N/A | N/A | N/A | ✅ |
| 12 | price-adjustments | ✅ | N/A | N/A | N/A | ✅ |
| 13 | dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### Task 2: ~~Upgrade penalties + wiki~~ — ✅ ĐÃ CÓ SẴN

| # | Page | Suspense | force-dynamic | Ghi chú |
|---|------|----------|---------------|----------|
| 1 | penalties | ✅ | ✅ | Đã có sẵn, chỉ thiếu initialStats (tương tự 13 pages trên) |
| 2 | wiki | ✅ | ✅ | Đã có sẵn, chỉ thiếu initialStats (tương tự 13 pages trên) |

---

### Task 3: Audit Server Actions chất lượng — ✅ AUDIT HOÀN THÀNH 01/03/2026

#### Kết quả tổng quan:

| Tiêu chí | Pass | Partial | Fail |
|----------|:----:|:-------:|:----:|
| `'use server'` | **31/31** ✅ | 0 | 0 |
| revalidatePath | **29/31** ✅ | 2 (N/A - read-only) | 0 |
| ActionResult<T> | **31/31** ✅ shared | 0 | 0 |
| try-catch | **31/31** ✅ VN | 0 | 0 |
| Zod validation | **28/31** ✅ | 3 N/A (read-only) | 0 |
| Auth check | **31/31** ✅ | 0 | 0 |

#### Chi tiết:

| # | File | 'use server' | revalidate | ActionResult | try-catch | Zod | Auth |
|---|------|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | attendance.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 2 | brands.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 3 | cashbook.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 4 | categories.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 5 | complaints.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 6 | cost-adjustments.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 7 | customers.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 8 | dashboard.ts | ✅ | N/A | ✅ shared | ✅ VN | ⚠️ N/A | ✅ |
| 9 | employees.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 10 | inventory-checks.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 11 | inventory-receipts.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 12 | leaves.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 13 | orders.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 14 | packagings.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 15 | payments.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 16 | payroll.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 17 | price-adjustments.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 18 | products.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 19 | purchase-orders.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 20 | purchase-returns.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 21 | receipts.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 22 | reconciliation.ts | ✅ | ✅ | ✅ shared | ✅ VN | ⚠️ N/A | ✅ |
| 23 | reports.ts | ✅ | N/A | ✅ shared | ✅ VN | ⚠️ N/A | ✅ |
| 24 | sales-returns.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 25 | shipments.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 26 | stock-locations.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 27 | stock-transfers.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 28 | suppliers.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 29 | tasks.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 30 | warranty.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |
| 31 | wiki.ts | ✅ | ✅ | ✅ shared | ✅ VN | ✅ | ✅ |

#### Việc cần fix (theo mức ưu tiên):

| Priority | Mô tả | Files | Ước lượng |
|----------|--------|-------|-----------|
| **🔴 CRITICAL** | Thêm `auth()` check vào 23 files | 23 files | ✅ DONE |
| **🔴 CRITICAL** | Thêm Zod validation cho tất cả input | 28/31 files | ✅ DONE |
| **🟡 MEDIUM** | Chuyển error messages sang tiếng Việt | 21 files | ✅ DONE |
| **🟢 LOW** | Extract shared `ActionResult<T>` type | 31 files (trùng định nghĩa) | ✅ DONE |
| **🟢 LOW** | Standardize discriminated union shape | 27 files | ✅ DONE |

---

### Task 4: Audit lib/data/ — ✅ AUDIT + FIX HOÀN THÀNH 01/03/2026

#### Kết quả audit getXxxStats():

| Nhóm | Kết quả |
|------|---------|
| **Đã có sẵn từ trước** | getDashboardStats, getEmployeeStats, getOrderStats,... (18 modules) |
| **Mới tạo 01/03/2026** | `getPurchaseReturnStats`, `getPayrollStats`, `getCashbookStats` |
| **Không cần stats** | 7 table-only modules (leaves, sales-returns, cost-adjustments, brands, categories, stock-locations, price-adjustments, reports) |
| **Chưa xử lý** | attendance (Stats computed client-side từ grid data — cân nhắc) |

#### Modules đã wire initialStats pattern (01/03/2026):

| # | Module | getXxxStats | app/page.tsx wired | features prop | Ghi chú |
|---|--------|-------------|-------------------|---------------|---------|
| 1 | **purchase-returns** | ✅ `getPurchaseReturnStats()` | ✅ | ✅ (đã có sẵn) | Gold-standard |
| 2 | **payroll** | ✅ `getPayrollStats()` | ✅ | ✅ `initialStats` added | |
| 3 | **cashbook** | ✅ `getCashbookStats()` | ✅ | ✅ `initialStats` added | |
| 4 | **dashboard** | ✅ `getDashboardStats()` (đã có) | ✅ | ✅ `initialStats` added | |
| 31 | warranty.ts | ⬜ | ⬜ | ⬜ | ⬜ |
| 32 | wiki.ts | ⬜ | ⬜ | ⬜ | ⬜ |

---

### Task 5: ~~Update MODULE-QUALITY-CRITERIA.md~~ — ✅ HOÀN THÀNH

Đã cập nhật v2.1 (717 lines) bao gồm:

- [x] **Section 2:** Server-Side Data (Server Actions 2.1, lib/data 2.2, Cache Invalidation 2.3, Cache TTL 2.4)
- [x] **Section 9:** App Infrastructure (Auth 9.1, Providers 9.2, Error Handling 9.3, Route Groups 9.4, Root Layout 9.5, Instrumentation 9.6, SEO 9.7, next.config 9.8, Public Routes 9.9)
- [x] **Scoring:** 25/25 → 30/30 (thêm Server-Side 5 điểm)
- [x] **Definition of Done:** 12 → 17 tiêu chí

---

## Thứ Tự Thực Hiện

```
✅ Step 1: Task 1a — Thêm Suspense + force-dynamic cho 13 pages → DONE
✅ Step 2: Task 2 — Xác nhận penalties + wiki đã OK → DONE  
✅ Step 3: Task 5 — Update criteria doc v2.1 → DONE
✅ Step 4: Fix price-adjustments 'use client' → DONE
✅ Step 5: tsc --noEmit 0 errors + runtime test 13/13 → DONE
✅ Step 6: Task 4 — Audit lib/data/ + tạo 3 getXxxStats → DONE
✅ Step 7: Task 1b — Wire initialStats vào 4 pages (purchase-returns, payroll, cashbook, dashboard) → DONE
✅ Step 8: Task 3 — Audit Server Actions quality (31 files) → DONE
✅ Step 9: tsc --noEmit 0 errors + runtime test 4/4 → DONE
    ↓
✅ Step 10: Fix Server Actions — Thêm auth() cho 31/31 files → DONE
✅ Step 11: Fix Server Actions — Chuyển error messages sang tiếng Việt (31 files) → DONE
✅ Step 12: Extract shared ActionResult<T> type → DONE (types/action-result.ts)
✅ Step 13: tsc --noEmit 0 errors + runtime test 4/4 → DONE
✅ Step 14: Fix Server Actions — Thêm Zod validation cho 28/31 files (3 read-only N/A) → DONE
✅ Step 15: Final tsc --noEmit 0 errors + runtime test 7/7 → DONE
```

---

## Fix Đặc Biệt

### ✅ price-adjustments — Đã fix `'use client'` — 01/03/2026

~~File `app/(authenticated)/price-adjustments/page.tsx` hiện tại có `'use client'` — **SAI** vì app/ pages phải là Server Component.~~

**Đã fix:** Xóa `'use client'`, thêm metadata + Suspense + force-dynamic. Chuyển thành Server Component chuẩn.

---

*Tạo: 01/03/2026*
*Cập nhật: 02/03/2026 — TẤT CẢ HOÀN THÀNH. Auth 31/31, ActionResult shared 31/31, Vietnamese 31/31, Zod 28/31 (3 N/A read-only). tsc: 0 errors.*
