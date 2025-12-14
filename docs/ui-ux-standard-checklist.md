# Checklist Kiểm Tra Chuẩn UI/UX & Theme Consistency (Shadcn UI)

Tài liệu này là chuẩn chung để kiểm tra giao diện người dùng cho tất cả các module trong hệ thống, đảm bảo tính nhất quán với Shadcn UI và Theme Settings.

## 1. Cấu Trúc & Layout (Shadcn Standard)
- [ ] **Card Component:**
    - [ ] Sử dụng `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`.
    - [ ] **Quan trọng:** `CardTitle` mặc định render thẻ `<h3>`. Nếu cần thẻ khác (h4, div), hãy dùng `asChild` hoặc override nhưng phải giữ class `text-h3` (hoặc biến thể phù hợp).
- [ ] **Typography (Headings):**
    - [ ] **Không dùng** class cứng như `text-2xl`, `text-3xl`.
    - [ ] **Bắt buộc dùng** các class semantic: `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-h5`, `text-h6`.
    - [ ] Kiểm tra các tiêu đề trang, tiêu đề section, tiêu đề dialog.
- [ ] **Spacing & Sizing:**
    - [ ] Sử dụng Tailwind spacing scale (p-4, m-2, gap-4).
    - [ ] Container width chuẩn (max-w-screen-xl, container).

## 2. Tính Nhất Quán Theme (Theme Consistency)
*Kiểm tra xem module có phản hồi đúng với cài đặt trong Settings > Appearance không.*

- [ ] **Màu sắc (Colors):**
    - [ ] **Primary Color:** Nút bấm chính, active tab, link active, checkbox checked.
    - [ ] **Destructive Color:** Nút xóa, thông báo lỗi, badge trạng thái "Đã nghỉ việc/Hủy".
    - [ ] **Muted/Secondary:** Nút phụ, badge trạng thái "Tạm nghỉ/Chờ".
    - [ ] **Background/Card:** Nền trang và nền card phải tách biệt đúng theo theme (đặc biệt ở Dark mode).
- [ ] **Bo góc (Radius):**
    - [ ] Kiểm tra Button, Input, Card, Dialog, Dropdown Menu.
    - [ ] Tất cả phải tuân theo biến `--radius` (không hardcode `rounded-lg` nếu component gốc dùng biến).
- [ ] **Font chữ (Typography):**
    - [ ] Văn bản thường: Phải đổi theo Font Sans cài đặt.
    - [ ] Tiêu đề: Phải đổi theo Font Heading và Size cài đặt.

## 3. Form & Input
- [ ] **Layout:** Sử dụng `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`.
- [ ] **Validation:**
    - [ ] Hiển thị lỗi đỏ (`text-destructive`) ngay dưới trường nhập liệu.
    - [ ] Scroll tới lỗi đầu tiên khi submit fail.
- [ ] **Loading State:** Nút Submit phải có trạng thái loading (`disabled` + spinner).

## 4. Bảng Dữ Liệu (Data Table)
- [ ] **Cấu trúc:** Sử dụng `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell`.
- [ ] **Responsive:**
    - [ ] Desktop: Dạng bảng đầy đủ.
    - [ ] Mobile: Chuyển sang dạng Card view hoặc ẩn bớt cột không quan trọng.
- [ ] **Empty State:** Có thông báo/hình ảnh khi không có dữ liệu.

## 5. Các Thành Phần Khác
- [ ] **Dialog/Modal:**
    - [ ] Tiêu đề dùng `DialogTitle` (thường là H3/H4).
    - [ ] Nút đóng (X) hoạt động tốt.
    - [ ] Đóng khi click outside.
- [ ] **Toast:** Sử dụng `sonner` để thông báo kết quả hành động.
- [ ] **Charts:** Màu biểu đồ phải dùng biến CSS (`var(--chart-1)`, `var(--chart-2)`...) thay vì mã hex cứng.

## 6. Quy Trình Test Nhanh (Smoke Test)
1.  Mở module cần test (ví dụ: Nhân viên).
2.  Mở tab **Settings > Appearance**.
3.  Thực hiện các thay đổi cực đoan:
    -   Đổi màu Primary sang màu nổi bật (vd: Cam/Tím).
    -   Kéo Radius lên tối đa.
    -   Tăng kích thước Heading H3 lên rất lớn.
4.  Quay lại module cần test:
    -   Nút bấm có đổi màu không?
    -   Các góc có bo tròn hơn không?
    -   Tiêu đề Card có to lên không?
5. Nếu **CÓ** -> Đạt chuẩn. Nếu **KHÔNG** -> Cần fix code (tìm class hardcode và thay thế).

## 7. Kế Hoạch Triển Khai & Rà Soát (Implementation Plan)

Dưới đây là danh sách các module cần rà soát theo chuẩn trên. Đánh dấu [x] khi hoàn thành.

### 7.1. Core & System
- [x] **Auth:** Login, Register, Forgot Password.
- [x] **Dashboard:** Overview, Stats Cards, Charts.
- [x] **Settings:** Appearance, Profile, System Config.
- [x] **Audit Log:** System logs viewing.
- [x] **Wiki:** Documentation viewer.
- [x] **Shared Components:** Common UI elements used across modules.

### 7.2. HRM (Nhân Sự)
- [x] Employees: Danh sách, Chi tiết, Thêm/Sửa, Upload ảnh.
- [x] **Attendance:** Chấm công, Bảng công.
- [x] **Leaves:** Quản lý nghỉ phép, Duyệt đơn.
- [x] **Payroll:** Tính lương, Phiếu lương.
- [x] **Tasks:** Quản lý công việc, Giao việc.

### 7.3. CRM (Khách Hàng & Bán Hàng)
- [x] **Customers:** Quản lý khách hàng.
- [x] **Orders:** Đơn hàng, Tạo đơn, Chi tiết đơn.
- [x] **Complaints:** Khiếu nại khách hàng.
- [x] **Sales Returns:** Trả hàng bán.
- [x] **Warranty:** Bảo hành.

### 7.4. Inventory & Product (Kho & Sản Phẩm)
- [x] **Products:** Danh sách sản phẩm, Chi tiết.
- [x] **Inventory Checks:** Kiểm kho.
- [x] **Inventory Receipts:** Nhập kho.
- [x] **Stock History:** Lịch sử tồn kho.
- [x] **Stock Locations:** Vị trí kho.
- [x] **Stock Transfers:** Chuyển kho.
- [x] **Packaging:** Quy cách đóng gói.
- [x] **Shipments:** Vận chuyển.

### 7.5. Finance & Accounting (Tài Chính)
- [x] **Finance:** Tổng quan tài chính.
- [x] **Cashbook:** Sổ quỹ.
- [x] **Payments:** Phiếu chi.
- [x] **Receipts:** Phiếu thu.
- [x] **Reconciliation:** Đối soát.
- [x] **Cost Adjustments:** Điều chỉnh giá vốn.

### 7.6. Purchasing (Mua Hàng)
- [x] **Suppliers:** Nhà cung cấp.
- [x] **Purchase Orders:** Đơn mua hàng.
- [x] **Purchase Returns:** Trả hàng mua.

### 7.7. Reports (Báo Cáo)
- [x] **Reports:** Các báo cáo tổng hợp.
- [x] **Other Targets:** Các chỉ tiêu khác.

