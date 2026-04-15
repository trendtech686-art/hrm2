# Tiêu Chuẩn Mobile UI — HRM2

> **Phiên bản**: 1.0 — Tháng 06/2025
> **Breakpoint**: `md:` (768px) — dưới 768px = mobile
> **Detection**: `useBreakpoint()` từ `@/contexts/breakpoint-context`

---

## 1. Mobile Card Pattern

### 1.1 Container Classes (Bắt buộc)
```
rounded-xl border border-border/50 bg-card p-4
active:scale-[0.98] transition-transform touch-manipulation cursor-pointer
```

### 1.2 Layout Structure
```tsx
<div className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.98] transition-transform touch-manipulation cursor-pointer">
  {/* Header: Avatar/Image + Info + Menu */}
  <div className="flex items-start gap-3">
    <Avatar className="h-11 w-11 shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm truncate">{name}</h3>
        <DropdownMenu> ... </DropdownMenu>
      </div>
      <span className="text-xs text-muted-foreground font-mono">{id}</span>
    </div>
  </div>

  {/* Footer: separators + metadata */}
  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
    <Badge variant={...} className="text-xs">{status}</Badge>
    <TouchButton variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full" />
  </div>
</div>
```

### 1.3 Quy Tắc Card
| Quy tắc | Chuẩn |
|---------|-------|
| Padding | `p-4` (16px) |
| Border radius | `rounded-xl` |
| Border | `border border-border/50` |
| Divider | `border-t border-border/50` với `mt-3 pt-3` |
| Press effect | `active:scale-[0.98]` |
| Text size | Tối thiểu `text-xs` (0.75rem), KHÔNG `text-[10px]` |
| Menu button | `h-8 w-8 p-0 -mr-2 -mt-1 shrink-0` |
| Card wrapper | Flat `<div>` — KHÔNG `<Card>/<CardContent>` |

---

## 2. List Page Pattern

### 2.1 Infinite Scroll (Bắt buộc trên mobile)
- KHÔNG hiện nút phân trang (Trước/Sau) trên mobile
- Dùng `mobileInfiniteScroll` prop trên `ResponsiveDataTable`
- Hiện text "Hiển thị X / Y kết quả" ở cuối danh sách
- Loading spinner khi đang tải thêm

### 2.2 Container Padding
```
space-y-3 px-1 pb-4
```

### 2.3 Empty State
- Dùng `<EmptyState>` component từ `@/components/mobile/empty-state`
- Có title / description / optional action button

### 2.4 FAB (Floating Action Button)
- Dùng `<FAB>` cho nút tạo mới trên mobile
- Vị trí: cố định góc phải dưới, trên bottom nav
- KHÔNG duplicate với button ở PageHeader

---

## 3. Touch Targets

| Element | Mobile | Desktop |
|---------|--------|---------|
| Button/Input height | `h-10` (40px) | `h-9` (36px) |
| Select text | `text-base` | `text-sm` |
| Dropdown items | `px-3 py-2.5` | `px-2 py-1.5` |
| Card padding | `p-4` | `p-6` |
| Popover width | `w-[calc(100vw-2rem)]` | `w-72` |

---

## 4. Typography

| Cấp | Class | Dùng cho |
|-----|-------|---------|
| Tiêu đề card | `text-sm font-semibold` | Tên KH, NV, SP |
| ID / mã | `text-xs text-muted-foreground font-mono` | Mã KH, mã SP |
| Metadata | `text-xs text-muted-foreground` | SĐT, ngày, chi nhánh |
| Badge | `text-xs` | Trạng thái |
| Section header | `text-xs font-medium text-muted-foreground uppercase tracking-wider` | Tiêu đề nhóm |
| Minimum | `text-xs` (0.75rem) | Không nhỏ hơn |

---

## 5. Navigation & Layout

### 5.1 Bottom Navigation
- Component: `MobileBottomNav` — luôn hiện ở dưới trên mobile
- 5 mục chính: Tổng quan, Đơn hàng, Sản phẩm, KH, Menu

### 5.2 PageHeader
- Actions (FAB, bell icon) render inline cùng hàng với tiêu đề
- Menu button (sidebar) ở bên trái

### 5.3 PageFilters
- Search bar full-width với optional `searchSuffix` (icon scan)
- Filter dropdowns responsive: `w-full sm:w-45`

---

## 6. Permission Guards
- ALL edit/delete buttons PHẢI check `can('edit_xxx')` / `can('delete_xxx')`
- Ẩn menu items thay vì disable

---

## 7. Checklist Audit (15 điểm)

| # | Tiêu chí | Điểm |
|---|----------|------|
| 1 | Card dùng `p-4 rounded-xl border-border/50` | 1 |
| 2 | Không `text-[10px]` hoặc nhỏ hơn `text-xs` | 1 |
| 3 | Divider dùng `border-t border-border/50` | 1 |
| 4 | Press effect `active:scale-[0.98]` | 1 |
| 5 | Infinite scroll (không pagination buttons) | 1 |
| 6 | Container có `px-1` padding | 1 |
| 7 | FAB cho tạo mới (không duplicate) | 1 |
| 8 | Menu button `h-8 w-8` touch target | 1 |
| 9 | Empty state component | 1 |
| 10 | Permission guards trên actions | 1 |
| 11 | Labels tiếng Việt | 1 |
| 12 | Touch targets ≥ 40px | 1 |
| 13 | Avatar/Image component | 1 |
| 14 | Status Badge hiển thị đúng | 1 |
| 15 | `useBreakpoint()` detection | 1 |

### Mức Đánh Giá
| Mức | Điểm | Ý nghĩa |
|-----|------|---------|
| ⭐⭐⭐ | 13-15 | Chuẩn mobile |
| ⭐⭐ | 9-12 | Cần cải thiện nhỏ |
| ⭐ | 5-8 | Cần refactor |
| ❌ | 0-4 | Chưa mobile-ready |

---

## 8. Files Tham Chiếu

| File | Mô tả |
|------|-------|
| `components/mobile/touch-button.tsx` | Button chuẩn mobile |
| `components/mobile/empty-state.tsx` | Empty state component |
| `components/mobile/skeleton.tsx` | Loading skeleton |
| `components/mobile/fab.tsx` | Floating Action Button |
| `components/mobile/mobile-bottom-nav.tsx` | Bottom navigation |
| `components/layout/page-header.tsx` | Page header với actions |
| `components/layout/page-filters.tsx` | Search + filters |
| `components/data-table/responsive-data-table.tsx` | Bảng responsive |
| `features/employees/components/mobile-employee-card.tsx` | Card mẫu chuẩn |
