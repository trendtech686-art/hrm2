# Chiến lược Audit & Fix Settings — Toàn diện

> Phạm vi: 23 trang, 77+ tab. Mục tiêu: 0 dead code, 0 bug lưu, UI nhất quán.

---

## I. Phương pháp: "Checklist × Matrix"

### Mỗi tab settings thuộc 1 trong 3 loại:

| Loại | Mô tả | Checklist |
|------|--------|-----------|
| **FORM** | Key-value config (toggle, select, input) | 5 tiêu chí |
| **TABLE** | CRUD danh sách (thêm/sửa/xóa) | 8 tiêu chí |
| **MIXED** | Form + table kết hợp | Cả 2 checklist |

### Checklist FORM (5 tiêu chí):

| # | Tiêu chí | Cách kiểm |
|---|---------|-----------|
| F1 | **Lưu thành công** | Bấm Lưu → F5 → data vẫn còn |
| F2 | **Backend tiêu thụ** | Setting được đọc bởi API/cron/service (không dead code) |
| F3 | **Toast đúng chỗ** | Toast trong `onSuccess`, không premature |
| F4 | **Loading state** | Button disabled/loading khi đang save |
| F5 | **Error handling** | Network error → toast.error, không crash |

### Checklist TABLE (8 tiêu chí):

| # | Tiêu chí | Cách kiểm |
|---|---------|-----------|
| T1 | **Thêm mới** | Bấm Thêm → nhập data → lưu → hiển thị trong list |
| T2 | **Sửa** | Bấm Edit → sửa → lưu → list cập nhật |
| T3 | **Xóa đơn** | Bấm Xóa → confirm → item biến mất |
| T4 | **Xóa hàng loạt** | Tick nhiều → Xóa → tất cả biến mất |
| T5 | **Toggle active/default** | Bấm toggle → giá trị thay đổi ngay |
| T6 | **Persist sau F5** | F5 → data vẫn đúng |
| T7 | **Data tiêu thụ** | Items xuất hiện đúng nơi cần (dropdown, filter, business logic) |
| T8 | **Toast + Error** | Thành công/lỗi đều có feedback |

---

## II. Ma trận toàn bộ Settings (23 trang × 77+ tab)

### NHÓM 1: Cài đặt hệ thống (4 trang)

| Trang | Tab | Loại | Ưu tiên |
|-------|-----|------|---------|
| **Thông tin cửa hàng** | (chính) Store Info form | FORM | P0 |
| | Chi nhánh | TABLE | P0 |
| **Tỉnh thành** | (chính) 3-level selector | MIXED | P2 |
| **NV & Phân quyền** | Vai trò | TABLE | P0 |
| | Phân quyền | FORM | P0 |
| **Cài đặt nhân viên** | Chấm công & Thời gian | FORM | P1 |
| | Nghỉ phép | MIXED | P1 |
| | Lương & Phúc lợi | MIXED | P1 |
| | Mẫu bảng lương | TABLE | P1 |
| | Bảo hiểm & Thuế | FORM | P2 |
| | Loại phạt | TABLE | P1 |
| | Loại nhân viên | TABLE | P1 |
| | Chức vụ | TABLE | P2 |
| | Phòng ban | TABLE | P2 |

### NHÓM 2: Cài đặt kinh doanh (4 trang)

| Trang | Tab | Loại | Ưu tiên |
|-------|-----|------|---------|
| **Cấu hình bán hàng** | Quản lý bán hàng | FORM | P0 |
| | Kênh bán hàng | TABLE | P1 |
| **Cài đặt khách hàng** | Loại KH | TABLE | P1 |
| | Nhóm KH | TABLE | P1 |
| | Nguồn KH | TABLE | P1 |
| | Giai đoạn vòng đời | TABLE | P2 |
| | Hạn thanh toán | TABLE | P1 |
| | Xếp hạng tín dụng | TABLE | P2 |
| **Quản lý kho & SP** | Đơn vị tính | TABLE | P0 |
| | Loại sản phẩm | TABLE | P1 |
| | Công ty XNK | TABLE | P2 |
| | Điểm lưu kho | TABLE | P1 |
| | Khối lượng & Kích thước | FORM | P2 |
| | Bảo hành | FORM | P2 |
| | Cảnh báo tồn kho (SLA) | FORM | P1 |
| **Chính sách giá** | Chính sách giá | TABLE | P1 |
| | Thuế | TABLE | P1 |

### NHÓM 3: Cài đặt tài chính (1 trang)

| Trang | Tab | Loại | Ưu tiên |
|-------|-----|------|---------|
| **Cài đặt thanh toán** | Loại phiếu thu | TABLE | P0 |
| | Loại phiếu chi | TABLE | P0 |
| | Hình thức thanh toán | TABLE | P0 |
| | Tài khoản quỹ | TABLE | P1 |
| | Nhóm đối tượng | TABLE | P2 |

### NHÓM 4: Cài đặt vận hành (7 trang)

| Trang | Tab | Loại | Ưu tiên |
|-------|-----|------|---------|
| **Thông báo** | Chung | FORM | P0 |
| | Công việc | FORM | P1 |
| | Khiếu nại | FORM | P1 |
| | Bảo hành | FORM | P1 |
| | Kinh doanh | FORM | P1 |
| | Kho & Mua hàng | FORM | P1 |
| | Nhân sự | FORM | P1 |
| | Hệ thống | FORM | P1 |
| **Website PKGX** | Cấu hình chung | FORM | P2 |
| | Mapping danh mục | FORM | P2 |
| | Mapping thương hiệu | FORM | P2 |
| | Mapping giá | FORM | P2 |
| | SP đã liên kết | TABLE | P2 |
| | Auto Sync | FORM | P2 |
| **Website Trendtech** | (6 tabs tương tự PKGX) | MIXED | P2 |
| **Vận chuyển** | Đối tác vận chuyển | TABLE | P1 |
| | Cấu hình chung | FORM | P1 |
| **Công việc** | SLA | FORM | P1 |
| | Mẫu phản hồi | TABLE | P1 |
| | Theo dõi công khai | FORM | P2 |
| | Màu sắc | FORM | P2 |
| | Loại công việc | TABLE | P1 |
| **Khiếu nại** | SLA | FORM | P1 |
| | Mẫu phản hồi | TABLE | P1 |
| | Theo dõi công khai | FORM | P2 |
| | Màu sắc | FORM | P2 |
| | Loại khiếu nại | TABLE | P1 |
| **Bảo hành** | SLA | FORM | P1 |
| | Mẫu phản hồi | TABLE | P1 |
| | Theo dõi công khai | FORM | P2 |
| | Màu sắc | FORM | P2 |
| | Loại bảo hành | TABLE | P1 |

### NHÓM 5: Hệ thống & Khác (4 trang)

| Trang | Tab | Loại | Ưu tiên |
|-------|-----|------|---------|
| **Mẫu in** | (chính) Template editor | MIXED | P1 |
| **Quy trình** | (chính) Workflow templates | TABLE | P2 |
| **Lịch sử nhập xuất** | (chính) Read-only log | — | — |
| **Nhật ký hệ thống** | (chính) Read-only log | — | — |
| **Giao diện** | (chính) Theme picker | FORM (UI-only) | P2 |
| **Cài đặt khác** | Chung | FORM | P1 |
| | Email SMTP | FORM | P0 |
| | Website | FORM | P2 |
| | Hệ thống | FORM | P2 |

---

## III. Bug đã xác nhận (cần fix)

### 🔴 Bugs thực tế (đã verify code)

| # | Trang/Tab | Bug | Mức độ |
|---|----------|-----|--------|
| 1 | **Loại phạt** (`penalties/page.tsx`) | Premature toast — 4 chỗ gọi `toast.success()` ngoài `onSuccess` | HIGH |
| 2 | **PKGX SP liên kết** (`pkgx/product-mapping-tab.tsx`) | Premature toast — 2 chỗ khi link/unlink product | HIGH |
| 3 | **PKGX SP liên kết** | Manual refetch thay vì `invalidateQueries` | MEDIUM |
| 4 | **Vận chuyển / Cấu hình chung** (`global-shipping-config.tsx`) | Manual `fetch()` + `loadShippingConfigAsync()` thay vì React Query mutation | MEDIUM |
| 5 | **Bảo hành / SLA tab** | UI (`use-warranty-time-tracking.ts`) dùng hardcoded SLA, không đọc DB | HIGH |

### ✅ False positives (KHÔNG phải bug)

| Item | Lý do không phải bug |
|------|---------------------|
| Server Action trong warranty/tasks/complaints/notifications | Write và Read cùng 1 table `Setting(key, group)`. Server action invalidate cache đúng. |
| `queryClient.invalidateQueries` thay vì `invalidateRelated` | Settings modules tự chứa, không cần cross-module invalidation. INVALIDATION_MAP không có entries cho settings. |
| `toast.info` trong complaints settings | Chỉ cho action RESET defaults, không phải save. Save operations dùng `toast.success` trong `onSuccess` đúng cách. |

---

## IV. Dead code còn lại (cần xử lý)

| # | Trang/Tab | Dead Fields | Hướng xử lý |
|---|----------|-------------|-------------|
| 1 | **Kho / Cảnh báo tồn kho** | 7 fields (slowMoving, deadStock, enableEmailAlerts, alertEmailRecipients, alertFrequency, showOnDashboard, dashboardAlertTypes) | **Ẩn UI** — không có backend consumer |
| 2 | **Store Info** | ward, district, note | **Giữ UI** — có thể dùng cho address đầy đủ trong tương lai |
| 3 | **Store Info** | registrationNumber | **Thêm print variable** `{store_registration_number}` |
| 4 | **Bảo hành / SLA** | UI hardcoded | **Refactor** `warranty-sla-utils.ts` đọc từ DB |
| 5 | **Cài đặt khác / Chung** | defaultRole, timezone, dateFormat, currency | **UI-only formatting** — chấp nhận |
| 6 | **Cài đặt khác / Chung** | OTP Login | **Chưa implement** — ẩn hoặc label "Sắp ra mắt" |
| 7 | **Cài đặt khác / Website** | Website settings, 301 Redirects | **Ẩn tab** hoặc label "Sắp ra mắt" |

---

## V. Chiến lược thực hiện — 4 Phase

### Phase A: Fix bugs đã xác nhận (1-2h)
**Scope**: 5 bugs thực tế đã verify
1. Fix premature toast trong penalties/page.tsx (4 chỗ)
2. Fix premature toast trong pkgx/product-mapping-tab.tsx (2 chỗ)
3. Fix manual refetch trong pkgx → dùng invalidateQueries
4. Fix manual fetch trong shipping/global-shipping-config.tsx → dùng React Query
5. Refactor warranty-sla-utils.ts → đọc SLA từ DB/React Query

### Phase B: Dọn dead code UI (30min)
**Scope**: Ẩn/label các fields dead
1. Ẩn 7 dead fields trong Inventory SLA tab
2. Ẩn hoặc label "Sắp ra mắt" cho OTP Login card
3. Ẩn hoặc label "Sắp ra mắt" cho Website tab trong "Cài đặt khác"
4. Thêm `{store_registration_number}` vào print-service.ts

### Phase C: Systematic QA — audit từng tab (4-8h)
**Scope**: Chạy checklist cho tất cả 77+ tab
**Cách làm**:

```
Với mỗi tab:
  1. Mở tab trên browser
  2. Test theo checklist (FORM hoặc TABLE)
  3. Ghi nhận: ✅ PASS hoặc ❌ FAIL + mô tả bug
  4. Nếu FAIL → tạo fix task
```

**Ưu tiên audit theo nhóm P0 → P1 → P2**:
- **P0** (12 tab): Store Info, Branches, Roles, Sales Management, Units, Receipt/Payment types, SMTP, General notifications
- **P1** (35 tab): Employee settings (9 tab), Customer settings (6 tab), Notifications (7 tab), Tasks/Complaints/Warranty (15 tab)
- **P2** (25 tab): Provinces, Insurance, PKGX, Trendtech, Website, Appearance, etc.

### Phase D: UI nhất quán (2-4h)
**Scope**: Sau khi fix xong bugs, chuẩn hóa UI pattern
1. Tất cả TABLE tabs dùng cùng layout: header + data-table + sheet/dialog form
2. Tất cả FORM tabs dùng cùng pattern: Card sections + Save/Reset buttons
3. Tất cả mutations dùng cùng pattern: `useMutation` + `onSuccess: toast.success` + `onError: toast.error`
4. Permission check nhất quán: kiểm `can('edit_settings')` trên tất cả edit buttons

---

## VI. Ưu tiên tổng thể

| Thứ tự | Phase | Effort | Impact |
|--------|-------|--------|--------|
| 1 | **Phase A**: Fix 5 bugs đã verify | 1-2h | Cao — sửa lỗi save/persist |
| 2 | **Phase B**: Dọn dead code UI | 30min | TB — tránh confuse user |
| 3 | **Phase C**: QA systematic (P0 trước) | 4-8h | Cao — phát hiện bug ẩn |
| 4 | **Phase D**: UI nhất quán | 2-4h | Thấp — polish |

**Tổng effort ước tính: 8-15h** (tùy số bug phát hiện ở Phase C)

---

## VII. Không cần lo lắng (đã verify OK)

| Item | Trạng thái |
|------|-----------|
| Server Action dùng cho write (warranty/tasks/complaints/notifications) | ✅ OK — cùng table, cache invalidate đúng |
| `queryClient.invalidateQueries` thay vì `invalidateRelated` cho settings | ✅ OK — settings tự chứa |
| Toast.info trong complaints settings | ✅ OK — chỉ cho reset defaults |
| Sales Management settings (6 fields) | ✅ 100% alive |
| Complaints SLA settings | ✅ 100% alive |
| Complaints + Task reminders | ✅ Cron đọc từ DB |
| Warranty reminders | ✅ Cron đọc từ DB |
| Customer SLA | ✅ Cron đọc từ DB |
| Password Rules | ✅ 6 endpoints enforce |
| File Size Limits | ✅ Upload routes enforce |
| 30+ notification toggles | ✅ All alive qua NOTIFICATION_SETTINGS_MAP |
| Store Info → Print | ✅ 14/18 fields alive |
| SMTP settings | ✅ lib/email.ts đọc |
| printCopies | ✅ use-order-print-handlers đọc |
