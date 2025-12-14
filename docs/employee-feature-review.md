# Review & Upgrade Plan: Employees Module (`/employees`)

> **Ngày review:** 20/11/2025
> **Người thực hiện:** AI Assistant
> **Phạm vi:** `features/employees`

## 1. Hiện trạng (Current Status)

Module Quản lý Nhân viên hiện tại đã hoạt động ổn định trên nền tảng Vite + Mock Data. Cấu trúc code tuân thủ tốt các nguyên tắc cơ bản về Dual ID và Store management.

### ✅ Điểm tốt (Pros)
*   **Dual ID System:** Đã áp dụng triệt để `systemId` (cho logic/URL) và `id` (cho hiển thị).
    *   URL: `/employees/EMP000001` (Chuẩn).
    *   Display: "NV000001" (Chuẩn).
    *   Foreign Keys: `branchSystemId`, `managerId` dùng systemId.
*   **State Management:** Sử dụng `zustand` với `createCrudStore` giúp code gọn và dễ maintain.
*   **UI Components:** Sử dụng `shadcn/ui` (Card, Button, Badge, Tabs) và `lucide-react` icons.
*   **Ngôn ngữ:** 100% Tiếng Việt.

### ⚠️ Vấn đề cần cải thiện (Issues)
1.  **UI Consistency (Height Rule):**
    *   Một số Button trong `detail-page.tsx` (header actions) chưa có class `h-9`.
    *   Các input/filter trong `page.tsx` cần rà soát lại chiều cao chuẩn.
2.  **Breadcrumb System:**
    *   Logic tạo breadcrumb đang phân tán (lúc thì dùng `generateDetailBreadcrumb`, lúc thì hardcode trong `employee-form-page.tsx`).
    *   Cần chuẩn hóa về format: `Trang chủ > Nhân viên > [Tên/Mã]`.
3.  **Tính năng chưa hoàn thiện (Missing Features):**
    *   **Tasks (Công việc):** Code đang bị comment out (`// REMOVED: Internal task`). Cần quyết định bỏ hẳn hay khôi phục.
    *   **KPI:** Tab KPI chưa có nội dung thực tế.
    *   **Liên kết Bảo hành:** Chưa hiển thị lịch sử xử lý bảo hành của nhân viên.

---

## 2. Kế hoạch nâng cấp (Upgrade Roadmap)

### Giai đoạn 1: Chuẩn hóa UI & UX (Priority: High)
*Mục tiêu: Đảm bảo giao diện đồng nhất với Development Guidelines V2.*

- [ ] **Fix Button/Input Height:**
    - [ ] Review `features/employees/detail-page.tsx`: Thêm `className="h-9"` cho các nút "Quay lại", "Chỉnh sửa".
    - [ ] Review `features/employees/page.tsx`: Đảm bảo nút "Thêm mới", "Export" có `h-9`.
- [ ] **Standardize Breadcrumbs:**
    - [ ] Cập nhật `detail-page.tsx` để breadcrumb hiển thị đúng format: `Trang chủ > Nhân viên > [Họ tên]`.
    - [ ] Cập nhật `page.tsx` để breadcrumb là: `Trang chủ > Nhân viên`.
- [ ] **Page Header:**
    - [ ] Kiểm tra Badge trạng thái (Đang làm việc/Đã nghỉ) đã nằm đúng vị trí (dưới Title) chưa.

### Giai đoạn 2: Hoàn thiện dữ liệu & Logic (Priority: Medium)
*Mục tiêu: Lấp đầy các tính năng còn thiếu.*

- [ ] **Tab Công việc (Tasks):**
    - [ ] Quyết định: Nếu module `internal-tasks` chưa sẵn sàng, hãy ẩn Tab này đi thay vì để code comment.
    - [ ] Nếu giữ lại: Kết nối với store `tasks` (khi module Tasks hoàn thiện).
- [ ] **Tab KPI:**
    - [ ] Hiện tại đang trống. Cần thêm Mock Data cho KPI hoặc ẩn tab này đi nếu chưa làm Phase này.
- [ ] **Form Validation:**
    - [ ] Kiểm tra lại `employee-form.tsx` (zod schema) để đảm bảo các trường bắt buộc (Email, SĐT) validate đúng format VN.

### Giai đoạn 3: Chuẩn bị Migration (Priority: Low - Future)
*Mục tiêu: Sẵn sàng cho Next.js.*

- [ ] **Tách Component:**
    - [ ] Review `detail-page.tsx`: Các tab content (Personal, Work, Documents) nên tách thành file riêng biệt (đã làm tốt một phần, cần tiếp tục với `Payroll`, `Leaves`).
- [ ] **Type Safety:**
    - [ ] Đảm bảo không còn `any` trong file `detail-page.tsx` (đặc biệt là chỗ xử lý `employeeTasks`).

---

## 3. Todo List chi tiết

### Ngay lập tức (Immediate Actions)
1.  [ ] Mở `features/employees/detail-page.tsx` và thêm `className="h-9"` vào `headerActions`.
2.  [ ] Sửa lại logic Breadcrumb trong `detail-page.tsx` cho đúng chuẩn `Trang chủ > Entity > Name`.
3.  [ ] Ẩn/Xóa code comment liên quan đến `InternalTask` để code sạch sẽ.

### Tuần này
4.  [ ] Rà soát `features/employees/columns.tsx` để đảm bảo các nút action trong dropdown menu hoạt động đúng.
5.  [ ] Kiểm tra lại tính năng "Xóa vĩnh viễn" (Permanent Delete) trong `store.ts` xem đã được gọi ở UI chưa.
