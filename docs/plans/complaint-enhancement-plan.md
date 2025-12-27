# Kế hoạch nâng cấp Quản lý Khiếu nại

## Tổng quan yêu cầu

Ngày: 03/12/2025

**Cập nhật tiến độ: 03/12/2025 (lần 4)**

---

## Phase 1: Bug Fixes & Quick Wins ✅ HOÀN THÀNH

### 1.1 Card "Sản phẩm bị ảnh hưởng" - UI giống Order Detail ✅ DONE
**File:** `features/complaints/form-page.tsx`

**Đã implement:**
- ✅ Thêm cột **Ảnh sản phẩm** (thumbnail) với `ProductThumbnailCell` component
- ✅ **Preview ảnh sản phẩm** khi click vào thumbnail (với `ImagePreviewDialog`)
- ✅ **Hiển thị giống Order Detail Page:**
  - Dòng 1: `Tên SP` + badge `COMBO` (nếu là combo)
  - Dòng 2: `Loại SP - Mã SP` + icon StickyNote + ghi chú đơn hàng (nếu có)
- ✅ Import `useProductStore`, `useProductTypeStore`, `useProductImage`
- ✅ Thêm `productTypeFallbackLabels` constant
- ✅ Thêm check `isCombo` để hiển thị badge COMBO

**Table structure:**
| Chọn | Ảnh | Tên sản phẩm | Đơn giá | Số lượng | Loại KN | Thừa | Thiếu | Hỏng | Tổng tiền | Ghi chú |

**Hoàn thành:** 03/12/2025

---

### 1.2 Bug: Loại "Khác" cho phép nhập cả 3 ô ✅ DONE
**File:** `features/complaints/form-page.tsx`

**Đã implement:**
- ✅ Khi chọn loại "Khác" (`other`) → cho phép điền cả 3 ô (Thừa, Thiếu, Hỏng)
- ✅ Logic mới cho disabled:
  ```typescript
  // Thừa: enable khi issueType = 'excess' HOẶC 'other'
  disabled={!isSelected || (affected?.issueType !== 'excess' && affected?.issueType !== 'other')}
  
  // Thiếu: enable khi issueType = 'missing' HOẶC 'other'
  disabled={!isSelected || (affected?.issueType !== 'missing' && affected?.issueType !== 'other')}
  
  // Hỏng: enable khi issueType = 'defective' HOẶC 'other'
  disabled={!isSelected || (affected?.issueType !== 'defective' && affected?.issueType !== 'other')}
  ```

**Hoàn thành:** 03/12/2025

---

### 1.3 Xóa nút "Checklist SLA khiếu nại" ✅ DONE
**File:** `features/complaints/form-page.tsx`

**Đã implement:**
- ✅ Xóa `docLink` khỏi `setPageHeader` call

**Hoàn thành:** 03/12/2025

---

### 1.4 Bug: Hình ảnh không load - phải F5 ⏳ CẦN ĐIỀU TRA
**File:** `features/complaints/form-page.tsx` hoặc component hình ảnh

**Vấn đề:**
- Hình ảnh có nhưng không hiển thị
- Phải refresh (F5) mới load được

**Nguyên nhân có thể:**
- Image URL không được parse đúng lúc render
- useEffect không trigger khi data thay đổi
- Lazy loading issue

**Giải pháp:**
- Kiểm tra component `NewDocumentsUpload` / `ExistingDocumentsViewer`
- Thêm key để force re-render khi images thay đổi
- Debug image loading lifecycle

**Độ phức tạp:** Trung bình (1-2 giờ)

---

## Phase 2: Công nợ Integration ✅ HOÀN THÀNH

### 2.1 Phiếu thu/chi từ khiếu nại hiển thị trong tab Công nợ khách hàng ✅ DONE
**Files:** 
- `features/customers/detail-page.tsx`

**Đã implement:**
- ✅ Thêm `complaintRefundPaymentTransactions` để filter các payment có `linkedComplaintSystemId`
- ✅ Filter loại trừ các payment đã có trong `refundPaymentTransactions` (linkedSalesReturnSystemId)
- ✅ Hiển thị với `type: 'complaint-payment'` để phân biệt
- ✅ `displayAmount: -payment.amount` và `change: 0` (không ảnh hưởng công nợ)
- ✅ Cập nhật `debtColumns`:
  - Cột "Ghi chú": Thêm badge "Khiếu nại" cho complaint-payment
  - Cột "Giá trị thay đổi": Hiển thị "(tiền mặt)" cho cả sales-return và complaint refunds
  - Link đến `/payments/{id}` khi click

**Hoàn thành:** 03/12/2025

---

## Phase 3: Settings Loại phạt ✅ HOÀN THÀNH

### 3.1 Module Penalties - Types, Store, Data ✅ DONE
**Files:**
- `features/settings/penalties/types.ts`
- `features/settings/penalties/store.ts`
- `features/settings/penalties/data.ts`

**Đã implement:**
- ✅ Extended `Penalty` type với các field mới:
  ```typescript
  linkedComplaintSystemId?: SystemId;  // Link khiếu nại
  linkedOrderSystemId?: SystemId;      // Link đơn hàng
  penaltyTypeSystemId?: SystemId;      // Link loại phạt
  penaltyTypeName?: string;
  category?: PenaltyCategory;
  deductedInPayrollId?: string;
  deductedAt?: string;
  ```
- ✅ Thêm `PenaltyType` interface cho settings loại phạt
- ✅ Thêm `PenaltyCategory` type: `'complaint' | 'attendance' | 'performance' | 'other'`
- ✅ Thêm constants: `penaltyStatusLabels`, `penaltyStatusColors`, `penaltyCategoryLabels`, `penaltyCategoryColors`
- ✅ Thêm `usePenaltyTypeStore` trong store.ts
- ✅ Thêm `penaltyTypesData` seed data với 8 loại phạt mẫu:
  - Khiếu nại: Làm hỏng hàng khách, Giao hàng sai, Thái độ phục vụ
  - Chấm công: Đi trễ, Vắng không phép
  - Hiệu suất: Không đạt KPI, Vi phạm quy trình
  - Khác: Vi phạm nội quy

**Hoàn thành:** 03/12/2025

---

### 3.2 Penalty Types Settings Page ✅ DONE
**Files:**
- `features/settings/penalties/penalty-types-settings.tsx` (NEW)
- `lib/router.ts` - Thêm route `PENALTY_TYPES: '/settings/penalty-types'`
- `lib/route-definitions.tsx` - Import & thêm route definition
- `features/settings/page.tsx` - Thêm card "Loại phạt" trong basicSettings

**Đã implement:**
- ✅ Full CRUD settings component cho PenaltyTypes
- ✅ Table hiển thị: Tên loại, Phân loại (badge màu), Mức phạt mặc định, Trạng thái
- ✅ Add/Edit dialog với form:
  - Tên loại phạt
  - Mô tả
  - Mức phạt mặc định (CurrencyInput)
  - Phân loại (Select)
  - Kích hoạt (Switch)
- ✅ Delete confirmation dialog
- ✅ Helper functions: `loadPenaltyTypes()`, `getPenaltyTypeById()`
- ✅ Page header với breadcrumb
- ✅ Card navigation trong Settings page với badge "Mới"

**Route:** `/settings/penalty-types`

**Hoàn thành:** 03/12/2025

---

## Phase 4: Chi phí phát sinh & Phạt nhân viên (PENDING)

### 4.1 Logic xử lý khi chọn "Hoàn tiền"

**Flow mới:**

```
┌─────────────────────────────────────────────────────────────┐
│                    XỬ LÝ BÙ TRỪ - HOÀN TIỀN                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Số tiền hoàn trả cho khách: [___________] VND    │   │
│  │    → Tạo PHIẾU CHI hoàn tiền khách                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 2. Chi phí phát sinh (nếu có): [___________] VND    │   │
│  │    Loại chi phí: [Phí ship trả khách ▼]             │   │
│  │    → Tạo PHIẾU CHI xử lý tình trạng                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 3. Quy trách nhiệm nhân viên:                       │   │
│  │    Nhân viên chịu trách nhiệm: [Nguyễn Văn A ▼]     │   │
│  │    → Tự động tạo PHIẾU PHẠT cho nhân viên           │   │
│  │    Mức phạt: [Lấy từ Settings] VND                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Yêu cầu Phiếu phạt (Module đã có)

**Existing module:** `features/settings/penalties/`
- `types.ts` ✅ Đã có (extended với fields mới)
- `store.ts` ✅ Đã có
- `data.ts` ✅ Đã có (seed data)
- `list-page.tsx` ✅ Đã có
- `detail-page.tsx` ✅ Đã có
- `form-page.tsx` ✅ Đã có

**Routes đã có:**
- `/penalties` - Danh sách phiếu phạt
- `/penalties/new` - Tạo phiếu phạt
- `/penalties/:systemId` - Chi tiết phiếu phạt
- `/penalties/:systemId/edit` - Sửa phiếu phạt

**Cần thêm:**
- Update form-page để chọn loại phạt từ PenaltyType
- Update list-page để filter theo category
- Update logic để liên kết với khiếu nại

### 4.3 Tích hợp với Bảng lương

**Logic:**
1. Khi tạo phiếu phạt từ khiếu nại → `status = 'pending'`
2. Khi tính lương tháng → Query các phiếu phạt `status = 'pending'` của NV
3. Trừ vào lương → Update `status = 'deducted'`, `deductedInPayrollId = payrollId`

---

## Phase 5: Tích hợp Khiếu nại → Phiếu phạt (PENDING)

| # | Task | File | Thời gian |
|---|------|------|-----------|
| 1 | Update dialog "Xử lý bù trừ" với NV chịu trách nhiệm | complaints/form-page.tsx | 2 giờ |
| 2 | Logic tạo phiếu phạt tự động từ khiếu nại | complaints/store.ts | 2 giờ |
| 3 | Logic tạo phiếu chi cho chi phí phát sinh | complaints/store.ts | 1 giờ |
| 4 | Testing & QA | - | 2 giờ |

---

## 5. Tổng kết tiến độ

| Phase | Trạng thái | Ngày hoàn thành |
|-------|------------|-----------------|
| Phase 1: Bug Fixes & Quick Wins | ✅ HOÀN THÀNH | 03/12/2025 |
| Phase 2: Công nợ Integration | ✅ HOÀN THÀNH | 03/12/2025 |
| Phase 3: Settings Loại phạt | ✅ HOÀN THÀNH | 03/12/2025 |
| Phase 4: Chi phí phát sinh & Phạt nhân viên | ⏳ PENDING | - |
| Phase 5: Tích hợp Khiếu nại → Phiếu phạt | ⏳ PENDING | - |

---

## 6. Ưu tiên triển khai còn lại

1. ~~**Cao nhất (P0):** Bug fixes (Phase 1)~~ ✅ DONE
2. ~~**Cao (P1):** Công nợ integration (Phase 2)~~ ✅ DONE
3. ~~**Trung bình (P2):** Settings loại phạt (Phase 3)~~ ✅ DONE
4. **Tiếp theo:** Update module Phiếu phạt (Phase 4)
5. **Cuối cùng:** Tích hợp Khiếu nại → Phiếu phạt (Phase 5)

---

## 7. Ghi chú kỹ thuật

### Dependencies:
- Module Phiếu phạt cần có Settings loại phạt trước
- Tích hợp bảng lương sẽ cần thêm field trong payroll module

### Migrations:
- Thêm `linkedPenaltySystemIds` vào Complaint type
- Thêm route `/penalties` vào router
- Thêm menu "Quản lý Phiếu phạt" vào sidebar

### Testing cần chú ý:
- Flow tạo khiếu nại → hoàn tiền → tạo phiếu chi → tạo phiếu phạt
- Hiển thị đúng trong tab Công nợ
- Trừ lương đúng khi tính bảng lương

---

**Người tạo:** AI Assistant  
**Ngày tạo:** 03/12/2025  
**Cập nhật lần cuối:** 03/12/2025  
**Trạng thái:** Phase 1-3 hoàn thành, đang chờ Phase 4-5
