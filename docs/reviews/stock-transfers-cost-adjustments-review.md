# Hướng dẫn Hoàn thiện Stock Transfers & Cost Adjustments Modules

> **Ngày tạo:** 27/11/2025  
> **Cập nhật lần cuối:** 27/11/2025  
> **Người thực hiện:** AI Assistant  
> **Phạm vi:** `features/stock-transfers`, `features/cost-adjustments`  
> **Tài liệu tham chiếu:** 
> - `DEVELOPMENT-GUIDELINES-V2.md`
> - `copy-employee-features-guide.md` (Reference: Employees module)

---

## Tổng quan

Tài liệu này hướng dẫn cách nâng cấp hai module **Chuyển kho (Stock Transfers)** và **Điều chỉnh giá vốn (Cost Adjustments)** để đạt chuẩn như module **Employees** - reference implementation của hệ thống.

### So sánh hiện trạng với Employees (Reference)

| Tính năng | Employees ✅ | Stock Transfers | Cost Adjustments |
|-----------|--------------|-----------------|------------------|
| Breadcrumb System (MODULES) | ✅ Đầy đủ 4 actions | ✅ **HOÀN THÀNH** | ✅ **HOÀN THÀNH** |
| PATH_PATTERNS | ✅ Đầy đủ | ✅ **HOÀN THÀNH** | ✅ **HOÀN THÀNH** |
| ResponsiveDataTable | ✅ | ✅ **HOÀN THÀNH** | ✅ **HOÀN THÀNH** |
| Mobile Card | ✅ MobileEmployeeCard | ✅ **StockTransferCard** | ✅ **CostAdjustmentCard** |
| PageToolbar | ✅ | ✅ **HOÀN THÀNH** | ✅ **HOÀN THÀNH** |
| PageFilters | ✅ | ✅ **HOÀN THÀNH** | ✅ **HOÀN THÀNH** |
| Column Customizer | ✅ | ✅ **HOÀN THÀNH** | ✅ **HOÀN THÀNH** |
| Fuse.js Search | ✅ | ✅ **HOÀN THÀNH** | ✅ **HOÀN THÀNH** |
| DataTableFacetedFilter | ✅ | ✅ **HOÀN THÀNH** | ✅ **HOÀN THÀNH** |
| Export Excel | ✅ | ✅ **HOÀN THÀNH** | ✅ **HOÀN THÀNH** |
| Import Excel | ✅ | ❌ Không (tùy chọn) | ❌ Không (tùy chọn) |
| Bulk Actions | ✅ | ❌ Không (tùy chọn) | ❌ Không (tùy chọn) |
| Button height `h-9` | ✅ | ✅ **HOÀN THÀNH** | ✅ **HOÀN THÀNH** |

---

## ✅ ĐÃ HOÀN THÀNH - TẤT CẢ CÁC PHASE

### Phase 1: Breadcrumb System ✅

**File đã sửa:** `d:\hrm2\lib\breadcrumb-system.ts`

**Đã thêm MODULES.INVENTORY.sections:**
- ✅ `STOCK_TRANSFERS` với 4 actions: list, detail, edit, new
- ✅ `COST_ADJUSTMENTS` với 4 actions: list, detail, edit, new

**Đã thêm PATH_PATTERNS:**
- ✅ `/stock-transfers` → list
- ✅ `/stock-transfers/new` → new
- ✅ `/stock-transfers/:systemId` → detail
- ✅ `/stock-transfers/:systemId/edit` → edit
- ✅ `/cost-adjustments` → list
- ✅ `/cost-adjustments/new` → new
- ✅ `/cost-adjustments/:systemId` → detail
- ✅ `/cost-adjustments/:systemId/edit` → edit

### Phase 2: Button Heights ✅

**Files đã sửa:** `d:\hrm2\features\cost-adjustments\detail-page.tsx`

- ✅ Header actions: Thay `size="sm"` bằng `className="h-9"`
- ✅ Dialog buttons: Thêm `className="h-9"`

### Phase 3: Upgrade lên ResponsiveDataTable ✅

**Thay vì dùng RelatedDataTable, đã nâng cấp HOÀN TOÀN lên ResponsiveDataTable như Employees!**

**Files đã tạo mới:**
- ✅ `d:\hrm2\features\cost-adjustments\columns.tsx` - 14 columns đầy đủ
- ✅ `d:\hrm2\features\cost-adjustments\cost-adjustment-card.tsx` - Mobile card component
- ✅ `d:\hrm2\features\stock-transfers\stock-transfer-card.tsx` - Mobile card component

**Files đã sửa:**
- ✅ `d:\hrm2\features\stock-transfers\page.tsx` - Full ResponsiveDataTable pattern
- ✅ `d:\hrm2\features\cost-adjustments\page.tsx` - Full ResponsiveDataTable pattern

**Tính năng đã implement:**
- ✅ `ResponsiveDataTable` thay vì RelatedDataTable
- ✅ `PageToolbar` với Export + ColumnCustomizer
- ✅ `PageFilters` với Search + FacetedFilters
- ✅ Mobile card rendering với `renderMobileCard` prop
- ✅ Pagination, rowSelection, sorting, columnVisibility
- ✅ Column customization với localStorage persistence
- ✅ Fuse.js search
- ✅ `usePageHeader` hook pattern (không dùng useEffect)

---

## Tính năng tốt đã có

### Stock Transfers ✅
- ✅ **Workflow rõ ràng:** Pending → Transferring → Completed/Cancelled
- ✅ **Hiển thị tồn kho Trước/Sau** với màu sắc (đỏ giảm, xanh tăng)
- ✅ **ProductSelectionDialog** lọc theo chi nhánh
- ✅ **Xác nhận nhận hàng** với số lượng thực nhận
- ✅ **ActivityHistory** component với lịch sử đầy đủ
- ✅ **Thông tin xử lý** sidebar (Người tạo, Người chuyển, Người nhận)
- ✅ **ResponsiveDataTable** với đầy đủ tính năng
- ✅ **StockTransferCard** cho mobile rendering
- ✅ **Button heights h-9** đúng chuẩn

### Cost Adjustments ✅
- ✅ **Hiển thị chênh lệch giá** với màu sắc và icon (TrendingUp/TrendingDown)
- ✅ **Phần trăm thay đổi** được tính toán
- ✅ **CurrencyInput** component cho input giá
- ✅ **Validation:** Phải có ít nhất 1 sản phẩm thay đổi giá
- ✅ **ActivityHistory** component với lịch sử đầy đủ
- ✅ **Thông tin xử lý** sidebar (Người tạo, Người xác nhận)
- ✅ **ResponsiveDataTable** với đầy đủ tính năng
- ✅ **CostAdjustmentCard** cho mobile rendering
- ✅ **Dual ID System** đúng chuẩn

---

## Đánh giá theo Development Guidelines V2

### Dual ID System ✅

| Tiêu chí | Stock Transfers | Cost Adjustments | Chuẩn |
|----------|-----------------|------------------|-------|
| `systemId` cho queries | ✅ Đúng | ✅ Đúng | ✅ |
| `id` (Business ID) cho display | ✅ Đúng | ✅ Đúng | ✅ |
| URL dùng `systemId` | ✅ `/stock-transfers/${systemId}` | ✅ `/cost-adjustments/${systemId}` | ✅ |
| Foreign Keys dùng `systemId` | ✅ `fromBranchSystemId`, `productSystemId` | ✅ `productSystemId` | ✅ |

### UI Components ✅

| Tiêu chí | Stock Transfers | Cost Adjustments |
|----------|-----------------|------------------|
| shadcn/ui components | ✅ | ✅ |
| Tailwind CSS | ✅ | ✅ |
| Lucide React icons | ✅ | ✅ |
| Không dùng emoji | ✅ | ✅ |
| Không HTML thuần | ✅ | ✅ |

### Data Table Pattern (như Employees) ✅

| Tiêu chí | Stock Transfers | Cost Adjustments |
|----------|-----------------|------------------|
| ResponsiveDataTable | ✅ | ✅ |
| PageToolbar | ✅ | ✅ |
| PageFilters | ✅ | ✅ |
| Mobile Card | ✅ StockTransferCard | ✅ CostAdjustmentCard |
| Column Customizer | ✅ | ✅ |
| localStorage persistence | ✅ | ✅ |
| Fuse.js search | ✅ | ✅ |
| DataTableFacetedFilter | ✅ | ✅ |
| Export Excel | ✅ | ✅ |

### Language ✅

| Tiêu chí | Stock Transfers | Cost Adjustments |
|----------|-----------------|------------------|
| UI tiếng Việt | ✅ 100% | ✅ 100% |
| Toast messages tiếng Việt | ✅ | ✅ |
| AlertDialog thay native confirm | ✅ | ✅ |

---

## Checklist đã hoàn thành

### Phase 1: Critical - ✅ HOÀN THÀNH
- [x] Thêm `STOCK_TRANSFERS` vào `MODULES.INVENTORY.sections` trong breadcrumb-system.ts
- [x] Thêm `COST_ADJUSTMENTS` vào `MODULES.INVENTORY.sections` trong breadcrumb-system.ts  
- [x] Thêm PATH_PATTERNS cho `/stock-transfers/*` (4 routes)
- [x] Thêm PATH_PATTERNS cho `/cost-adjustments/*` (4 routes)

### Phase 2: High - ✅ HOÀN THÀNH
- [x] cost-adjustments/page.tsx: Thêm `className="h-9"` cho header Button
- [x] cost-adjustments/detail-page.tsx: Thay `size="sm"` bằng `className="h-9"` cho header actions
- [x] cost-adjustments/detail-page.tsx: Thêm `className="h-9"` cho Dialog buttons

### Phase 3: Medium - ✅ HOÀN THÀNH
- [x] Đổi title thành "Danh sách điều chỉnh giá vốn"
- [x] Tạo file `cost-adjustments/columns.tsx` (14 columns đầy đủ)
- [x] Tạo file `cost-adjustments/cost-adjustment-card.tsx` (mobile card)
- [x] Tạo file `stock-transfers/stock-transfer-card.tsx` (mobile card)
- [x] Upgrade `stock-transfers/page.tsx` → ResponsiveDataTable pattern
- [x] Upgrade `cost-adjustments/page.tsx` → ResponsiveDataTable pattern

### Phase 4: Low (Backlog - Tùy chọn)
- [ ] Import từ Excel (nếu cần)
- [ ] Bulk Actions (nếu cần)

---

## Tổng kết

| Module | Guidelines V2 | So với Employees | Tổng |
|--------|---------------|------------------|------|
| **Stock Transfers** | 15/15 ✅ | 10/10 ✅ | **100%** |
| **Cost Adjustments** | 15/15 ✅ | 10/10 ✅ | **100%** |

### ✅ HOÀN THÀNH 100%

Cả 2 module đã được nâng cấp hoàn toàn theo pattern của Employees:

1. **Breadcrumb System**: ✅ MODULES + PATH_PATTERNS đầy đủ
2. **Button Heights**: ✅ Tất cả buttons đều có `h-9`
3. **ResponsiveDataTable**: ✅ Thay thế RelatedDataTable với đầy đủ tính năng:
   - PageToolbar với Export + ColumnCustomizer
   - PageFilters với Search + FacetedFilters  
   - Mobile card rendering
   - Pagination, selection, sorting
   - Column customization với localStorage
   - Fuse.js search

---

**Last Updated:** 27/11/2025  
**Version:** 4.0 - COMPLETED
