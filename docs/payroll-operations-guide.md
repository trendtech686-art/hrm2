# Hướng dẫn vận hành Payroll HRM2

> **Áp dụng cho:** `features/payroll/*`
> **Cập nhật:** 19/11/2025

Tài liệu này mô tả quy trình vận hành module Payroll trên HRM2, bao gồm bước chuẩn bị dữ liệu, chạy bảng lương, duyệt/khóa batch, xuất báo cáo và checklist QA bắt buộc trước khi bàn giao.

---

## 1. Tổng quan quy trình

1. Khóa dữ liệu chấm công tháng liên quan trong `features/attendance/page.tsx` (dual ID theo `employee.systemId`).
2. Tạo batch mới tại `features/payroll/run-page.tsx` (wizard 3 bước, dùng `attendanceSnapshotService`).
3. Rà soát chi tiết batch trong `features/payroll/detail-page.tsx`, thêm ghi chú/audit nếu cần.
4. Duyệt 2 bước: **Đánh dấu đã duyệt** → **Khóa bảng lương** (AlertDialog ghi log qua `usePayrollBatchStore.updateBatchStatus`).
5. Xuất báo cáo & payslip CSV nếu cần gửi phòng ban/kế toán.
6. Lưu tài liệu QA + chạy `npm run build` để đảm bảo không có regression.

---

## 2. Chuẩn bị dữ liệu

| Hạng mục | Hành động | Ghi chú |
|----------|-----------|---------|
| Attendance | Khóa tháng (`useAttendanceStore.lockMonth`) trước khi chạy payroll | Batch đã khóa sẽ tự động đánh dấu tháng tham chiếu chỉ đọc |
| Template lương | Kiểm tra `features/payroll/template-page.tsx` để đảm bảo thành phần lương mặc định đúng phòng ban | Sử dụng `usePayrollTemplateStore` để gán component theo Dual ID |
| Hồ sơ nhân viên | Tab “Lương & chấm công” trên `employee-detail-page.tsx` phải có payroll profile | Lấy dữ liệu từ `useEmployeeCompStore`; cập nhật bank info trước ngày trả |

---

## 3. Chạy bảng lương (`run-page.tsx`)

1. **Bước 1 – Chọn kỳ:**
   - Chọn tháng chấm công đã khóa (multi-select) + ngày chi trả.
   - Kiểm tra trường “Nguồn attendance” hiển thị số record sẽ lấy snapshot.
2. **Bước 2 – Chọn nhân viên & template:**
   - Bộ lọc phòng ban, trạng thái làm việc; checkbox sử dụng template mặc định.
   - Wizard sẽ ghép cấu hình từ `useEmployeeCompStore` + attendance snapshot.
3. **Bước 3 – Preview & tạo batch:**
   - Xem tổng thu nhập/khấu trừ/đóng góp.
   - Nhấn “Tạo bảng lương” để lưu batch và phiếu lương (`createBatchWithResults`).

> 💡 **Lưu ý:** Tất cả button/inputs phải có `className="h-9"` và text tiếng Việt theo `docs/DEVELOPMENT-GUIDELINES-V2.md`.

---

## 4. Duyệt & khóa (`detail-page.tsx`)

| Trạng thái | Điều kiện chuyển | Hành động UI |
|------------|------------------|--------------|
| `draft` → `reviewed` | Batch mới tạo, dữ liệu đã rà soát | Nút “Đánh dấu đã duyệt” mở AlertDialog, cho phép nhập ghi chú nội bộ. |
| `reviewed` → `locked` | Đã duyệt, không còn chỉnh sửa | Nút “Khóa bảng lương” (variant destructive). Khóa xong sẽ gọi `useAttendanceStore.lockMonth` với các `referenceAttendanceMonthKeys`. |

- Mỗi thao tác ghi `PayrollAuditLog` với payload `{ note }` nếu có.
- Badge trạng thái trên page header dùng `PayrollStatusBadge` (đảm bảo đúng vị trí dưới title).
- AlertDialog text 100% tiếng Việt, tuân thủ UI guide.

---

## 5. Báo cáo & xuất file

Trên `PayrollDetailPage`:

1. **Bảng tổng hợp phòng ban:** hiển thị headcount, tổng earnings/deductions/contributions/net theo `departmentSystemId`.
2. **Xuất CSV phòng ban:** `bao-cao-phong-ban-<batchId>.csv` kèm meta (kỳ lương, ngày chi trả, tháng chấm công).
3. **Xuất danh sách phiếu lương:** `payslip-<batchId>.csv` phục vụ gửi từng nhân viên.
4. **Audit log:** mọi lần export ghi action `export` với payload `type` để truy vết.

> CSV sử dụng BOM (`\uFEFF`) để mở được bằng Excel tiếng Việt mà không lỗi font.

---

## 6. Checklist QA bắt buộc

### 6.1 Dữ liệu & Dual ID
- [ ] Tất cả truy vấn batch/payslip dùng `systemId` (không dùng business `id`).
- [ ] `departmentSystemId`, `employeeSystemId` luôn hiện diện trong dữ liệu xuất.
- [ ] Khi khóa batch, các tháng tham chiếu trong attendance được khóa đồng bộ.

### 6.2 UI/UX
- [ ] Page header, breadcrumb, badge đúng format theo `docs/DEVELOPMENT-GUIDELINES-V2.md`.
- [ ] Button/Input cao `h-9`, text tiếng Việt, sử dụng shadcn/ui.
- [ ] AlertDialog hiển thị mô tả rõ ràng, nút hành động có `className="h-9"`.

### 6.3 Chức năng
- [ ] Chạy thử `seedPayrollDemoData()` (file `features/payroll/__mocks__/seed.ts`) để tạo dữ liệu kiểm thử.
- [ ] Tạo batch demo → duyệt → khóa → export cả hai CSV, kiểm tra file mở được.
- [ ] Kiểm tra audit log hiển thị đúng thứ tự, có ghi chú nếu nhập tại dialog.
- [ ] Khi batch ở trạng thái `locked`, thử thay đổi chấm công tháng tham chiếu để đảm bảo bị khóa.

### 6.4 Build & Regression
- [ ] Chạy `npm run build` sau mỗi thay đổi.
- [ ] Rà dark mode + mobile responsiveness đối với list page & detail page.
- [ ] Kiểm tra cảnh báo chunk/dynamic import: ghi chú nếu phát sinh ngoài cảnh báo đã biết.

---

## 7. Công cụ hỗ trợ & tips

| Công cụ | Mục đích | Cách dùng |
|---------|----------|-----------|
| `seedPayrollDemoData()` | Sinh dữ liệu demo gồm attendance đã khóa + batch mẫu | Import từ `@/features/payroll/__mocks__/seed` và gọi trong console dev hoặc script tạm |
| `safe-logger` | Log các sự kiện quan trọng (khóa batch, lỗi tính lương) | Luôn log bằng tiếng Việt, tránh thông tin nhạy cảm |
| `useToast` | Thông báo người dùng khi đổi trạng thái/export | Text ngắn gọn, mô tả hành động và kết quả |

---

## 8. Lỗi thường gặp & cách xử lý

| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-------------|-----------|
| Không thấy nhân viên trong wizard | Profile chưa gắn template hoặc attendance tháng chưa có record | Kiểm tra `useEmployeeCompStore`, chạy lại snapshot |
| Không khóa được batch | Có payslip thiếu `departmentSystemId` hoặc attendance chưa khóa | Rà dữ liệu nhân viên, cập nhật department và khóa lại attendance trước khi lock |
| CSV lỗi font | Thiếu BOM khi tải | Đã khắc phục bằng `\uFEFF`; nếu vẫn lỗi, yêu cầu mở bằng Excel UTF-8 |
| Audit log không có ghi chú | Người dùng để trống textarea AlertDialog | Ghi chú là tùy chọn; nếu bắt buộc cần enforce validation ở tương lai |

---

## 9. Liên hệ & tài liệu liên quan
- `docs/payroll-roadmap.md`: theo dõi trạng thái từng phase.
- `docs/DEVELOPMENT-GUIDELINES-V2.md`: chuẩn UI/UX và Dual ID.
- `features/payroll/*`: source chính cho module payroll.
