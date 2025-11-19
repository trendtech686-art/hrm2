# Roadmap Liên Thông Nhân Viên – Chấm Công – Lương

> **Cập nhật:** 16/11/2025  
> **Phạm vi:** Phase 1–4 cho các module Employees, Attendance, Employee Settings và Payroll (mới)

## 1. Mục tiêu tổng
- Đồng bộ dữ liệu nhân viên, chấm công, lương, cài đặt theo Dual ID (`systemId` cho query/URL, `id` để hiển thị).
- Chuẩn hóa UI theo `docs/DEVELOPMENT-GUIDELINES-V2.md` (shadcn/ui, `className="h-9"`, tiếng Việt, breadcrumb chuẩn, badge dưới title).
- Chuẩn bị nền tảng cho backend RBAC/NestJS: mọi store có `createdBy/updatedBy`, `systemId` ổn định, sẵn sàng thay thế localStorage bằng API.
- Xây payroll engine có thể khóa/ký duyệt từng kỳ lương, xuất báo cáo và hỗ trợ audit.

## 2. Nguyên tắc thực thi
1. **Dual ID bắt buộc:** URL, foreign key, find/delete dùng `systemId`; chỉ hiển thị dùng business `id`.  
2. **UI/UX thống nhất:** shadcn components, Lucide icons, tailwind spacing chuẩn, text 100% tiếng Việt.  
3. **Page header:** dùng `usePageHeader`, breadcrumb “Trang chủ > …”, badge dưới title, actions memoized.  
4. **Persist & Audit:** dùng `persist(createJSONStorage())`, thêm `createdAt/createdBy` khi sinh dữ liệu mới, log sự kiện quan trọng bằng `safe-logger`.  
5. **Testing:** Sau mỗi phase chạy `npm run build`, tự rà checklist trong `docs/DEVELOPMENT-GUIDELINES-V2.md`.

## 3. Timeline tổng quan
| Giai đoạn | Thời lượng ước tính | Trọng tâm | Phụ thuộc |
|-----------|---------------------|-----------|-----------|
| Phase 1 | 1 – 1.5 tuần | Chuẩn hóa attendance + employee settings + payroll types | Không |
| Phase 2 | 1 tuần | Liên kết nhân viên ↔ chấm công ↔ cài đặt | Hoàn tất Phase 1 |
| Phase 3 | 2 tuần | Module payroll core + engine tính lương | Snapshot từ Phase 2 |
| Phase 4 | 1 tuần | Approval, báo cáo, tài liệu vận hành | Payroll ổn định |

---

## 4. Phase 1 – Chuẩn hóa dữ liệu nền
**Goal:** Attendance, Employee Settings, Payroll types thống nhất `systemId`, có selector dùng chung.

### Deliverables
- `features/attendance/*` truy vấn bằng `employee.systemId`, import/export giữ `systemId` trong file Excel.  
- `useEmployeeSettingsStore` sinh `systemId` cho `workShifts`, `leaveTypes`, `salaryComponents` và expose helper (e.g. `getShiftBySystemId`).  
- Tạo `lib/payroll-types.ts` mô tả `PayrollComponent`, `PayrollTemplate`, `PayrollBatch`, `Payslip`, `PayrollAuditLog`.

### Checklist
1. **Attendance refactor**
   - `AttendanceDataRow` thêm `employeeSystemId`, bỏ phụ thuộc vào `id`.  
   - `useAttendanceStore` key = `${monthKey}:${employeeSystemId}`.  
   - `generateMockAttendance`/`recalculateSummary` đọc shifts & OT từ settings, tôn trọng ngày nghỉ.  
   - Import/export Excel ghi `systemId` ẩn, hiển thị `id` cho người dùng.  
2. **Employee settings**
   - Khi thêm leave type/salary component/work shift, tự tạo `{ systemId, id }` theo `store-factory`/`createSystemId`.  
   - Lưu `applicableDepartmentSystemIds`, `createdBy`.  
   - Tạo selector: `getLeaveTypes()`, `getSalaryComponents()`, `getDefaultPayrollWindow()`.  
3. **Payroll types**
   - File `lib/payroll-types.ts`: type + enum trạng thái batch (Draft/Reviewed/Locked).  
   - Stub store `usePayrollBatchStore` (chưa UI) để Phase 3 reuse.  
4. **QA**
   - Smoke test `features/attendance/page.tsx`.  
   - `npm run build`.  
   - Checklist UI (button height, tiếng Việt, breadcrumb) vẫn đạt.

#### Tiến độ (16/11/2025)
- [x] Refactor toàn bộ `features/attendance` dùng `employeeSystemId`: cập nhật `types.ts`, `data.ts`, `store.ts`, `columns.tsx`, `page.tsx`, dialog chấm công/import/bulk edit để mọi thao tác (sửa ô, bulk edit, import) tra cứu theo `systemId`.  
- [x] Đồng bộ import/export Excel: file export giữ mã hiển thị (`employeeId`), còn logic import map về `systemId`, đảm bảo chuẩn Dual ID và không lệ thuộc `id` có thể sửa.  
- [x] Đã chạy `npm run build` sau refactor, xác nhận không có lỗi mới (chỉ còn cảnh báo chunk lớn như trước).
- [x] Chuẩn hóa `useEmployeeSettingsStore`: sinh Dual ID auto cho work shifts/leave types/salary components, thêm metadata `createdAt/createdBy`, selector helper (`getShiftBySystemId`, `getLeaveTypes`, `getDefaultPayrollWindow`) và seed default shifts/leave/salary components.  
- [x] Hoàn tất `lib/payroll-types.ts` cùng stub `features/payroll/payroll-batch-store.ts` (CRUD batch + payslip + audit log, trạng thái Draft/Reviewed/Locked) để Phase 3 tái sử dụng.  
- [x] Build lại sau khi thêm store/settings mới (`npm run build`), vẫn pass với cảnh báo chunk tương tự trước đây.

---

## 5. Phase 2 – Liên kết nhân viên & cài đặt
**Goal:** Nhân viên nhìn thấy cấu hình lương/chấm công, store có mapping rõ ràng.

### Deliverables
- `employee-form` cho phép chọn shift, thành phần lương, tài khoản trả lương; validate `systemId`.  
- Tab “Lương & chấm công” trong `employee-detail-page.tsx` hiển thị cấu hình + snapshot attendance mới nhất.  
- Store `useEmployeeCompStore` lưu mapping nhân viên ↔ salary components ↔ bank account.  
- `attendanceSnapshotService` trả về dữ liệu đã khóa theo `monthKey + employeeSystemId`.

### Checklist
1. **Form & detail UI**
   - Thêm section “Thiết lập lương” ở `employee-form`.  
   - Tab mới: card salary components, card tình trạng chấm công (status badge).  
   - Breadcrumb/title giữ format (“Hồ sơ Nhân viên NV000001”).
2. **Stores**
   - `useEmployeeCompStore`: persist, expose `assignComponents`, `getPayrollProfile(systemId)`.  
   - Kết nối với settings (default components) nếu nhân viên không cấu hình riêng.  
3. **Snapshots**
   - Service đọc `useAttendanceStore`, chỉ lấy dữ liệu tháng đã khóa (hoặc manual lock).  
   - API chuẩn bị cho Phase 3: `getSnapshot({ monthKey, employeeSystemId })`.
4. **QA**
   - Test tạo/sửa nhân viên, verify data hiển thị tab mới.  
   - `npm run build`.

#### Tiến độ (17/11/2025)
- [x] Thêm `useEmployeeCompStore` persist với audit metadata, selector `getPayrollProfile`, normalize shift/component ID theo Dual ID.  
- [x] Mở rộng `employee-form.tsx` với tab "Lương & chấm công": chọn ca mặc định, checkbox thành phần lương từ settings, phương thức trả lương + copy ngân hàng, phát sinh `_payrollProfile` khi submit.  
- [x] `employee-detail-page.tsx` hiển thị tab mới: card thành phần lương, thông tin ngân hàng/cá nhân, snapshot OT/ngày công mới nhất.  
- [x] `attendanceSnapshotService` (lib) đọc `useAttendanceStore`, trả snapshot đã khóa theo `{ monthKey, employeeSystemId }`.  
- [x] Đã chạy `npm run build` (17/11) → pass, chỉ còn cảnh báo chunk/dynamic import giống hiện trạng trước.

---

## 6. Phase 3 – Payroll core
**Goal:** Tạo module payroll đầy đủ, engine tính lương, trạng thái batch.

### Deliverables
- Thư mục `features/payroll/` gồm: `list-page`, `run-page`, `detail-page`, `template-page`.  
- `lib/payroll-engine.ts` tính gross → deductions → net, ghi log.  
- `usePayrollBatchStore` hoàn chỉnh: CRUD batch, payslip, trạng thái.

### Checklist
1. **UI**
   - Page header cho từng trang (ví dụ “Danh sách bảng lương”).  
   - Bảng shadcn hiển thị batch, filters, actions (chạy mới, xem chi tiết).  
   - `run-page`: wizard chọn kỳ, nhân viên, preview payroll (use `attendanceSnapshotService`).  
   - `detail-page`: badge trạng thái, actions Duyệt/Khoá, table payslip, toast tiếng Việt.
2. **Engine & store**
   - Parser công thức: hỗ trợ biến `[LUONG_CO_BAN]`, `[CONG_CHUAN]`, `[OT_GIO]`, `[PHU_CAP_*]`.  
   - Tính BHXH, thuế TNCN theo setting taxable/partOfSocialInsurance.  
   - Batch states: `Draft → Reviewed → Locked`; lock lưu timestamp + `lockedBy`.  
3. **Integration**
   - Liên kết employee tab: nút “Xem bảng lương” → `/payroll/:batchSystemId`.  
   - Khi batch locked, attendance tháng tương ứng tự đánh dấu read-only.  
4. **QA**
   - Test chạy payroll mẫu, verify số liệu hiển thị.  
   - `npm run build` + regression (dual ID, button height, breadcrumb).

#### Kế hoạch chi tiết (16/11/2025)
- **UI & UX**
   - [x] `features/payroll/list-page.tsx`: danh sách batch + cards tổng quan, filter theo trạng thái/tháng, action "Chạy bảng lương".
   - [x] `features/payroll/run-page.tsx`: wizard 3 bước (chọn kỳ & nguồn attendance, chọn nhân viên & template, preview & xác nhận) sử dụng `attendanceSnapshotService` + cấu hình lương từ `useEmployeeCompStore`.
   - [x] `features/payroll/detail-page.tsx`: header chuẩn, badge trạng thái, actions `Duyệt`, `Khóa`, table payslip với subtotal và log timeline.
   - [x] `features/payroll/template-page.tsx`: CRUD template payroll (chọn component mặc định) kèm bộ lọc và dialog chỉnh sửa.
   - [x] Shared components: `PayrollStatusBadge`, `PayrollBatchFilters`, `PayrollSummaryCards`, `PayslipTable` để tái sử dụng giữa các page.
- **Engine & store**
   - [x] `lib/payroll-engine.ts`: build context attendance + profile, resolver công thức `[BIEN_SO]`, helpers tính thuế/BHXH, trả kết quả `components` + `totals` + log debug.
   - [x] Mở rộng `features/payroll/payroll-batch-store.ts`: selector `getBatches()`, `getPayslipsByBatch()`, `recalculateBatch()`, `deleteBatch()`, tự động audit + cập nhật tổng số.
   - [x] Thêm `features/payroll/payroll-template-store.ts`: persist template, generate Dual ID, expose `getDefaultTemplate()`, `assignComponentsFromTemplate()`.
- **Integration**
   - [x] Cập nhật `lib/router.ts` + `lib/route-definitions.tsx` thêm route Payroll (list/run/detail/templates) với breadcrumb tiếng Việt.
   - [x] `features/employees/detail-page.tsx`: nút "Xem bảng lương" (dùng `systemId`), section payroll dùng batch data nếu có.
   - [x] `features/attendance/store.ts`: thêm API khóa tháng cố định để Phase 3 gọi khi batch `locked`.
   - [x] Batch lock → gọi `useAttendanceStore.getState().lockMonth(monthKey)` + log qua `safe-logger`.
- **QA & tài liệu**
   - [x] Seed demo data: thêm script `features/payroll/__mocks__/seed.ts` (hàm `seedPayrollDemoData`) để tạo nhanh tháng demo, có thể import từ `@/features/payroll/__mocks__/seed` khi cần QA.
   - [x] Checklist UI (Dual ID, badge dưới title, button `h-9`) cho toàn bộ trang payroll + `npm run build` xác nhận không lỗi mới (còn cảnh báo chunk/dynamic import như hiện trạng).

#### Tiến độ (18/11/2025)
- [x] Thiết kế engine & store: đã có `lib/payroll-engine.ts`, `payroll-template-store.ts`, `payroll-batch-store.ts` mở rộng audit + lock attendance.
- [x] Triển khai trang danh sách + run wizard: list page + wizard 3 bước chạy payroll engine, tạo batch trực tiếp từ preview.
- [x] Hoàn thiện trang chi tiết + templates: detail page hiển thị dữ liệu thật, cảnh báo trạng thái, bảng payslip và audit log; template page đã CRUD đầy đủ.
- [x] Kết nối employees/attendance + chạy build: tab Lương của nhân viên hiển thị lịch sử bảng lương kèm CTA “Xem bảng lương”, chạy `npm run build` (cảnh báo chunk/dynamic import như cũ).
- [x] Seed payroll demo: gọi `seedPayrollDemoData()` để sinh attendance locked + batch demo phục vụ kiểm thử (build lại sau khi thêm script, kết quả pass với cảnh báo chunk quen thuộc).
- [x] Rà soát checklist UI: bổ sung `useMemo` cho page header actions Run/Template, kiểm tra button/input `h-9`, breadcrumb & badge format; chạy `npm run build` (18/11) → pass với cảnh báo chunk/dynamic import sẵn có.

---

## 7. Phase 4 – Approval, báo cáo, tài liệu
**Goal:** Hoàn thiện quy trình và output.

### Deliverables
- Flow duyệt 2 bước (AlertDialog + lưu `PayrollAuditLog`).  
- Báo cáo tổng hợp (Excel/PDF) cho phòng ban, payslip cá nhân.  
- Dashboard nhanh trong `payroll-list` (cards tổng chi phí, batch chưa khóa).  
- Tài liệu vận hành + checklist QA cập nhật vào `docs/`.

### Checklist
1. **Approval flow**
   - Modal xác nhận, thu chữ ký số (placeholder).  
   - Audit log lưu `action`, `actorSystemId`, `timestamp`.  
2. **Reports**
   - Export payslip (nhân viên) và báo cáo tổng (theo department) sử dụng dữ liệu batch.  
   - Cho phép gửi mail sau khi xuất (hook future backend).  
3. **Dashboard**
   - Cards: Tổng chi phí kỳ hiện tại, Số batch chờ duyệt, Cảnh báo “Chưa khóa kỳ trước”.  
4. **Documentation & QA**
   - Viết hướng dẫn sử dụng payroll, checklist QA trong `docs/`.  
   - Build cuối + regression dark mode/mobile.

#### Tiến độ (19/11/2025)
- [x] Flow duyệt 2 bước: thêm `AlertDialog` xác nhận cho hành động “Đánh dấu đã duyệt” và “Khóa bảng lương” ngay trên `features/payroll/detail-page.tsx`, cho phép nhập ghi chú nội bộ và truyền xuống `usePayrollBatchStore.updateBatchStatus` để lưu audit log.
- [x] Báo cáo & export: trang chi tiết payroll có card “Báo cáo & xuất file” cho phép xem tổng hợp theo phòng ban, xuất CSV phòng ban và danh sách phiếu lương; mỗi lần xuất đều ghi `PayrollAuditLog` với payload `type`.
- [x] Dashboard nhanh: `features/payroll/list-page.tsx` bổ sung các cards “Tổng chi phí kỳ hiện tại”, “Batch cần duyệt”, “Chờ khóa” và cảnh báo “Chưa khóa kỳ trước” (nhấn mạnh kỳ nào chưa khóa bằng màu cảnh báo).
- [x] Tài liệu vận hành & QA: thêm `docs/payroll-operations-guide.md` mô tả quy trình chạy payroll, duyệt/khóa, export CSV và checklist QA (Dual ID, UI, functional, build regression).

---

## 8. Rủi ro & biện pháp
| Rủi ro | Biện pháp |
|--------|-----------|
| Dữ liệu cũ trong localStorage không có `systemId` mới | Viết script migrate hoặc reset store khi phát hiện record thiếu `systemId` |
| Sai lệch công thức payroll | Tạo bộ test input/output nhỏ, log chi tiết từng thành phần, cho phép manual override trước khi khóa |
| UI vi phạm guideline | Checklist bắt buộc trước khi merge, review theo `docs/DEVELOPMENT-GUIDELINES-V2.md` |
| Khóa attendance ảnh hưởng payroll | Hiển thị cảnh báo rõ ràng khi khóa tháng, cho phép clone dữ liệu sang batch mới |

---

## 9. Bước tiếp theo
1. Bắt đầu Phase 1: tạo nhánh refactor, phân công owner cho attendance vs settings.
2. Triển khai TODO tương ứng (xem bảng).  
3. Sau mỗi phase, cập nhật file này với trạng thái thực tế & ghi chú phát sinh.
