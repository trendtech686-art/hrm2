# HRM2 — Kế hoạch thống nhất UI: Stats Bar + Bộ lọc nâng cao

> Ngày tạo: 2026-04-06  
> Cập nhật: 2026-04-07 (Phase 8 DONE — Sapo-inspired filter UX)  
> Mục tiêu: Thống nhất 100% giao diện danh sách trên toàn hệ thống

---

## 1. Tiến độ tổng quan

| Phase | Scope | Trạng thái | Ghi chú |
|-------|-------|:----------:|---------|
| **Phase 0** | Shared components | ✅ DONE | StatsBar, AdvancedFilterPanel (draft state), useFilterPresets |
| **Phase 1** | Convert 3 StatsCardGrid → StatsBar | ✅ DONE | receipts, purchase-returns, po-statistics |
| **Phase 2** | Đồng nhất vị trí StatsBar (6 pages) | ✅ DONE | employees, shipments, complaints, tasks, stock-transfers, warranty |
| **Phase 3** | Refactor AdvancedFilterPanel + useFilterPresets | ✅ DONE | Draft state, DB-persisted presets |
| **Phase 4** | Apply bộ lọc cho 10 modules | ✅ DONE | employees → receipts (xem mục 3) |
| **Phase 5** | Core Sales: orders, customers, products | ✅ DONE | ToggleGroup pages — thêm [+ Bộ lọc] giữ nguyên inline filters |
| **Phase 6** | Ops: suppliers, inventory-checks, reconciliation | ✅ DONE | 3 modules |
| **Phase 7** | Minor: leaves, cashbook, sales-returns, cost-adjustments, packaging, ordered-products | ✅ DONE | 6 modules |
| **Phase 8** | Sapo-inspired UX: Quick Date, Filter Tags, Preset Tabs, Update Preset, Groups, Search | ✅ DONE | 6 enhancements, 22 modules |
| **Dead code** | Xóa StatsCardGrid/StatsCardGridSkeleton | ✅ DONE | 0 consumers |

**Tổng: 22/22 modules có AdvancedFilterPanel (100%)**

### 1.1. Stats Component — 2 pattern còn lại (đã thống nhất)

| Pattern | Pages | Click filter? | Vị trí |
|---------|-------|:-------------:|--------|
| **ToggleGroup** (workflow cards) | orders, customers, products | ✅ Có | Trên toolbar |
| **StatsBar** | suppliers, employees, payments, shipments, complaints, tasks, stock-transfers, inventory-checks, reconciliation, warranty, receipts, purchase-returns, purchase-orders | ❌ Không | ✅ Trên cùng (đồng nhất) |
| ~~**StatsCardGrid**~~ | — | — | ❌ **ĐÃ XÓA** (dead code) |

### 1.2. Bộ lọc — Hiện trạng

| Thành phần | Tình trạng |
|-----------|-----------|
| PageFilters (search + inline) | ✅ Có ở hầu hết pages |
| DataTableFacetedFilter | ✅ ~15 pages |
| DataTableDateFilter | ✅ ~18 pages |
| Branch Select | ✅ ~23 pages |
| **AdvancedFilterPanel** | ✅ **10 modules** (Sheet bên phải, draft state, 8 filter types) |
| **useFilterPresets** | ✅ **10 modules** (DB-persisted qua UserPreference) |
| ~~FilterPresetBar~~ | Không cần riêng — chức năng đã tích hợp vào AdvancedFilterPanel |

---

## 2. Modules đã tích hợp AdvancedFilterPanel (Phase 4 — ✅ DONE)

| # | Module | File | Filter types | Presets key |
|---|--------|------|-------------|-------------|
| 1 | employees | `features/employees/page.tsx` | select (branch, department, position), multi-select (status) | `employees` |
| 2 | shipments | `features/shipments/page.tsx` | select (branch, carrier), multi-select (status), date-range | `shipments` |
| 3 | stock-transfers | `features/stock-transfers/page.tsx` | select (from-warehouse, to-warehouse), multi-select (status), date-range | `stock-transfers` |
| 4 | tasks | `features/tasks/page.tsx` | select (assignee, priority), multi-select (status), date-range | `tasks` |
| 5 | complaints | `features/complaints/page.tsx` | select (type, handler), multi-select (status, priority), date-range | `complaints` |
| 6 | warranty | `features/warranty/warranty-list-page.tsx` | select (supplier), multi-select (status), date-range | `warranty` |
| 7 | purchase-orders | `features/purchase-orders/page.tsx` | select (supplier, branch), multi-select (status), date-range | `purchase-orders` |
| 8 | purchase-returns | `features/purchase-returns/page.tsx` | select (supplier, branch), multi-select (status), date-range | `purchase-returns` |
| 9 | payments | `features/payments/page.tsx` | select (type, branch, customer), multi-select (status), date-range | `payments` |
| 10 | receipts | `features/receipts/components/receipts-content.tsx` | select (type, branch), multi-select (status), date-range | `receipts` |
| 11 | orders | `features/orders/page.tsx` | select (employee, branch), multi-select (status), date-range | `orders` |
| 12 | customers | `features/customers/page.tsx` | select (status, type, debtFilter), date-range | `customers` |
| 13 | products | `features/products/page.tsx` | select (status, type, category, combo, stockLevel, pkgx), date-range | `products` |
| 14 | suppliers | `features/suppliers/page.tsx` | multi-select (status), date-range | `suppliers` |
| 15 | inventory-checks | `features/inventory-checks/page.tsx` | multi-select (branch), date-range | `inventory-checks` |
| 16 | reconciliation | `features/reconciliation/page.tsx` | multi-select (carrier), date-range | `reconciliation` |
| 17 | leaves | `features/leaves/page.tsx` | date-range | `leaves` |
| 18 | cashbook | `features/cashbook/page.tsx` | select (branch, account), multi-select (type), date-range | `cashbook` |
| 19 | sales-returns | `features/sales-returns/page.tsx` | date-range | `sales-returns` |
| 20 | cost-adjustments | `features/cost-adjustments/page.tsx` | date-range | `cost-adjustments` |
| 21 | packaging | `features/packaging/page.tsx` | date-range | `packaging` |
| 22 | ordered-products | `features/ordered-products/page.tsx` | date-range | `ordered-products` |

---

## 3. Modules còn lại (Phase 6–7)

### Phase 6 — Operations
| Module | File | Quick Filters hiện tại | Advanced Filters cần thêm |
|--------|------|----------------------|--------------------------|
| suppliers | `features/suppliers/page.tsx` | Search | Trạng thái, Công nợ, Ngày tạo |
| inventory-checks | `features/inventory-checks/page.tsx` | Search, Trạng thái | Chi nhánh, Ngày |
| reconciliation | `features/reconciliation/page.tsx` | Search, Tabs | ĐTVC, Ngày |

### Phase 7 — Minor modules
| Module | File | Ghi chú |
|--------|------|---------|
| leaves | `features/leaves/page.tsx` | Status, Nhân viên, Ngày |
| cashbook | `features/cashbook/page.tsx` | Chi nhánh, Loại, Ngày |
| sales-returns | `features/sales-returns/page.tsx` | Chi nhánh, NV, Ngày |
| cost-adjustments | `features/cost-adjustments/page.tsx` | Trạng thái, Ngày |
| packaging | `features/packaging/page.tsx` | Trạng thái, Ngày |
| ordered-products | `features/ordered-products/page.tsx` | Chi nhánh, Ngày |

### Pages KHÔNG cần AdvancedFilterPanel
- `attendance` — calendar UI đặc thù
- `brands`, `categories`, `stock-locations` — settings pages, ít filter
- `supplier-warranty`, `wiki` — minimal UI

---

## 4. Dead code đã dọn

| Item | File | Ngày xóa | Lý do |
|------|------|----------|-------|
| `StatsCardGrid` | `components/shared/stats-card.tsx` | 2026-04-07 | 0 consumers sau Phase 1 convert |
| `StatsCardGridSkeleton` | `components/shared/stats-card.tsx` | 2026-04-07 | Cùng file, export đi kèm |
| Comment "for StatsCardGrid" | `features/inventory-checks/hooks/use-inventory-checks.ts` | 2026-04-07 | Reference cũ |

> `useAdvancedFilters` (`advanced-filter-panel.tsx` L603) — exported nhưng chưa có consumer. Giữ lại làm utility hook.

---

## 5. Thiết kế hệ thống

### 5.1. Layout chuẩn trang danh sách
```
┌─────────────────────────────────────────────────┐
│  Stats Bar / ToggleGroup (trên cùng)            │
├─────────────────────────────────────────────────┤
│  Toolbar: Cài đặt | Nhập | Xuất | Cột          │
├─────────────────────────────────────────────────┤
│  Search | Inline Filters | [+ Bộ lọc]          │
│  [Preset A ×] [Preset B ×]                     │
├─────────────────────────────────────────────────┤
│  Table / Cards                                  │
└─────────────────────────────────────────────────┘
```

### 5.2. AdvancedFilterPanel
- **File**: `components/shared/advanced-filter-panel.tsx` (~620 dòng)
- **8 filter types**: text, select, multi-select, date, date-range, number-range, boolean, tags
- **Internal draft state**: user chỉnh filter → nhấn "Áp dụng" mới commit
- **Preset UI tích hợp**: Lưu / Load / Xóa bộ lọc ngay trong panel
- **Sheet mở bên phải**, full-width trên mobile

### 5.3. useFilterPresets
- **File**: `hooks/use-filter-presets.ts`
- Wraps `useUserPreference<SavedFilterPreset[]>('filter-presets:${moduleKey}', [], 'filters')`
- Returns: `{ presets, savePreset(name, filters), deletePreset(id), isLoading }`
- Persisted trong DB qua UserPreference API

### 5.4. Integration pattern (code mẫu)
```tsx
// 1. Import
import { AdvancedFilterPanel, type FilterConfig } from '@/components/shared/advanced-filter-panel'
import { useFilterPresets } from '@/hooks/use-filter-presets'

// 2. Hook (trong component)
const { presets, savePreset, deletePreset } = useFilterPresets('module-key')

// 3. Config (PHẢI đặt SAU data hook calls để tránh TDZ)
const filterConfigs: FilterConfig[] = useMemo(() => [
  { key: 'branchId', label: 'Chi nhánh', type: 'select', options: branchOptions },
  { key: 'status', label: 'Trạng thái', type: 'multi-select', options: statusOptions },
  { key: 'dateRange', label: 'Ngày', type: 'date-range' },
], [branchOptions, statusOptions])

// 4. Panel values (map từ current filter state)
const panelValues = useMemo(() => ({
  branchId: filters.branchId,
  status: filters.status,
  dateRange: { from: filters.startDate, to: filters.endDate },
}), [filters])

// 5. Apply handler
const handlePanelApply = useCallback((values: Record<string, unknown>) => {
  setFilters(prev => ({ ...prev, ...values, page: 1 }))
}, [])

// 6. JSX (trong PageFilters)
<AdvancedFilterPanel
  configs={filterConfigs}
  values={panelValues}
  onApply={handlePanelApply}
  presets={presets}
  onSavePreset={savePreset}
  onDeletePreset={deletePreset}
/>
```

---

## 6. Quy tắc

1. **Mỗi phase ≤ 8 files** — refactor theo batch nhỏ
2. **Chạy `tsc --noEmit` + `eslint`** sau mỗi phase — 0 errors bắt buộc
3. **Dọn dead code TRƯỚC khi refactor** (unused imports, old components)
4. **filterConfigs đặt SAU data hooks** — tránh TDZ runtime error
5. **Mobile responsive** — Sheet full-width trên mobile
6. **Preset persistence** — qua UserPreference API, cache trong React Query
7. **KHÔNG tạo FilterPresetBar riêng** — chức năng đã tích hợp vào AdvancedFilterPanel

---

## 7. Verification checklist (per module)

- [ ] AdvancedFilterPanel imported + rendered trong PageFilters
- [ ] useFilterPresets hook gọi với đúng module key
- [ ] filterConfigs có đủ filter types cho module
- [ ] panelValues map đúng từ current filter state
- [ ] handlePanelApply reset page về 1
- [ ] StatsBar ở đúng vị trí (trên cùng)
- [ ] Không có dead imports
- [ ] `tsc --noEmit` → 0 errors
- [ ] `eslint` → 0 errors trên file đã sửa

---

## 8. Phase 8 — Sapo-inspired Filter UX Enhancements

> Học hỏi từ Sapo OmniAI: lưu bộ lọc dạng tab, bộ lọc ưu tiên, quick date, filter tags.
> Nguồn: `help.sapo.vn/luu-bo-loc-tai-man-danh-sach-don-hang`, `help.sapo.vn/cau-hinh-bo-loc-uu-tien-tai-man-xu-ly-don-hang`

### 8.1. So sánh Sapo vs HRM2

| Feature | Sapo | HRM2 hiện tại | Gap |
|---------|------|---------------|-----|
| Saved Presets hiển thị | Tab clickable ngoài danh sách | Nút trong Sheet panel | **THIẾU: tabs bên ngoài** |
| Active Filters hiển thị | Tags chi tiết, có x xóa | Badge count | **THIẾU: tags chi tiết** |
| Quick Date Ranges | Hôm nay / 7 ngày / 30 ngày / Tháng / Năm | Calendar picker thuần | **THIẾU** |
| Update existing preset | "Lưu vào bộ lọc đã có" | Chỉ save new + delete | **THIẾU** |
| Filter Groups | Nhóm theo category (Đơn hàng / Giao hàng / Thanh toán / Thời gian) | Flat list | **THIẾU** |
| Search within Filters | Ô tìm kiếm filter theo tên | Không | **THIẾU** |
| Pinned Filters | Ghim 📌 ra ngoài, max 15, drag-sort | Không | Phức tạp — bỏ qua |
| System default presets | Tab mặc định cho all users | Không | Tương lai |

### 8.2. Các enhancement sẽ triển khai

| # | Enhancement | Scope | Ưu tiên | Tác động |
|---|-------------|-------|---------|----------|
| **E1** | **Quick Date Ranges** | AdvancedFilterPanel `date-range` type | P0 | Cao — tất cả 22 modules |
| **E2** | **Active Filter Tags** | Export `ActiveFilterTags` component | P0 | Cao — hiện chi tiết filter đang active |
| **E3** | **Preset Tabs** | Export `PresetTabs` component | P0 | Cao — click tab = apply ngay |
| **E4** | **Update Existing Preset** | `useFilterPresets` + panel UI | P1 | Trung bình — ghi đè preset cũ |
| **E5** | **Filter Groups** | `FilterConfig.group` field + grouped render | P2 | Trung bình — cho module phức tạp |
| **E6** | **Search within Filters** | Ô tìm kiếm trong panel | P2 | Thấp — chỉ hữu ích khi >10 filters |

### 8.3. Implementation plan

#### E1: Quick Date Ranges (trong `date-range` filter type)
**File**: `components/shared/advanced-filter-panel.tsx`
- Thêm row nút nhanh phía trên 2 calendar pickers: `Hôm nay | 7 ngày | 30 ngày | Tháng này | Tháng trước | Tùy chọn`
- Click nút → auto-fill from/to
- "Tùy chọn" = hiện calendar pickers (hành vi hiện tại)
- Tất cả 22 modules tự động được hưởng (không sửa page nào)

#### E2: Active Filter Tags (component mới export từ panel)
**File**: `components/shared/advanced-filter-panel.tsx` (export thêm `ActiveFilterTags`)
- Hiển thị tags dạng Badge cho mỗi filter đang active
- Mỗi tag: `{label}: {value}` + nút x
- Click x → xóa 1 filter, gọi onRemove callback
- "Xóa tất cả" link khi có ≥2 active
- Render giữa PageFilters và Table
- 22 modules cần thêm `<ActiveFilterTags>` vào JSX

#### E3: Preset Tabs (component mới export từ panel)
**File**: `components/shared/advanced-filter-panel.tsx` (export thêm `PresetTabs`)
- Hiển thị saved presets dạng tabs ngang
- Click tab → apply preset ngay (không cần mở panel)
- Tab active có highlight
- Mỗi tab có nút x để xóa
- Hiển thị giữa toolbar/search bar và table
- 22 modules cần thêm `<PresetTabs>` vào JSX

#### E4: Update Existing Preset
**File**: `hooks/use-filter-presets.ts` + `components/shared/advanced-filter-panel.tsx`
- Thêm `updatePreset(id, filters)` vào hook
- Panel: dropdown "Lưu mới" / "Lưu vào bộ lọc đã có → [danh sách]"
- Không cần sửa page nào (logic trong shared component)

#### E5: Filter Groups
**File**: `components/shared/advanced-filter-panel.tsx`
- Thêm optional `group?: string` vào `FilterConfig`
- Panel render filters nhóm theo `group`, hiện label nhóm + Separator
- Filters không có group → nhóm "Khác"
- Modules phức tạp (orders, shipments, complaints) define groups trong filterConfigs
- Modules đơn giản — không cần sửa (backwards-compatible)

#### E6: Search within Filters
**File**: `components/shared/advanced-filter-panel.tsx`
- Input search ở đầu ScrollArea
- Lọc `filters` hiển thị theo `filter.label` match text
- Chỉ hiện khi `filters.length >= 5`
- Không cần sửa page nào

### 8.4. Thứ tự triển khai

| Step | Task | Files sửa | Risk |
|------|------|----------|------|
| 1 | E1: Quick Date Ranges | `advanced-filter-panel.tsx` | Thấp — chỉ sửa 1 file |
| 2 | E4: Update Existing Preset | `use-filter-presets.ts` + `advanced-filter-panel.tsx` | Thấp — 2 files |
| 3 | E6: Search within Filters | `advanced-filter-panel.tsx` | Thấp — 1 file |
| 4 | E5: Filter Groups | `advanced-filter-panel.tsx` | Thấp — backwards-compatible |
| 5 | E2+E3: ActiveFilterTags + PresetTabs | `advanced-filter-panel.tsx` export + 22 module pages | Cao — batch 22 files |
| 6 | Verify + update plan | `tsc` + `eslint` | — |

### 8.5. Layout chuẩn sau Phase 8
```
┌─────────────────────────────────────────────────┐
│  Stats Bar / ToggleGroup (trên cùng)            │
├─────────────────────────────────────────────────┤
│  Toolbar: Cài đặt | Nhập | Xuất | Cột          │
├─────────────────────────────────────────────────┤
│  Search | Inline Filters | [+ Bộ lọc]          │
├─────────────────────────────────────────────────┤
│  [Preset A ×] [Preset B ×] [Preset C ×]        │  ← E3: PresetTabs
├─────────────────────────────────────────────────┤
│  Trạng thái: Đang giao × | Ngày: 7 ngày ×  🗑  │  ← E2: ActiveFilterTags
├─────────────────────────────────────────────────┤
│  Table / Cards                                  │
└─────────────────────────────────────────────────┘

  ┌──── Sheet (bộ lọc nâng cao) ───────────────┐
  │  🔍 Tìm kiếm bộ lọc...        ← E6        │
  │  ──────────────────────────────              │
  │  📁 Bộ lọc đã lưu             ← existing   │
  │  [Preset A] [Preset B]                      │
  │  ──────────────────────────────              │
  │  📋 Thông tin đơn hàng         ← E5 Group  │
  │  │ Trạng thái: [multi-select]               │
  │  │ Nhân viên: [select]                      │
  │  ──────────────────────────────              │
  │  📅 Thời gian                  ← E5 Group  │
  │  │ [Hôm nay][7 ngày][30 ngày] ← E1 Quick  │
  │  │ [Tháng này][Tùy chọn]                   │
  │  │ Từ: [__/__/____] Đến: [__/__/____]      │
  │  ──────────────────────────────              │
  │  💾 Lưu mới / Lưu vào đã có   ← E4        │
  │  ──────────────────────────────              │
  │  [Xóa tất cả]     [Áp dụng (3)]            │
  └─────────────────────────────────────────────┘
```
