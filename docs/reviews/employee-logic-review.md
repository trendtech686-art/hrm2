# Review Logic & UI Fields: Employees Module

> **Ngày review:** 20/11/2025
> **Phạm vi:** `features/employees` (Validation, Form Fields, Detail View)

## 1. Logic Validation (`validation.ts` vs `types.ts`)

Hiện tại đang có sự **lệch pha nghiêm trọng** giữa Schema Validation (`validation.ts`) và Type Definition (`types.ts`). Điều này sẽ gây lỗi khi submit form hoặc thiếu dữ liệu quan trọng.

| Field | Type Definition (`types.ts`) | Validation Schema (`validation.ts`) | Đánh giá |
| :--- | :--- | :--- | :--- |
| **contractType** | `"Không xác định" \| "Thử việc" \| "1 năm"...` | `"Thử việc" \| "Chính thức" \| "Hợp đồng"...` | ❌ **Lệch Value Enum**. Cần đồng bộ lại theo Type. |
| **department** | `"Kỹ thuật" \| "Nhân sự"...` | `string` (min 1) | ⚠️ Schema lỏng lẻo hơn Type. |
| **employeeType** | `"Chính thức" \| "Thử việc"...` | ❌ **Thiếu trong Schema**. |
| **baseSalary** | `number` | `basicSalary` (Sai tên field) | ❌ **Sai tên biến**. Type là `baseSalary`, Schema là `basicSalary`. |
| **allowances** | `positionAllowance`, `mealAllowance`... | `allowances` (Gộp chung) | ❌ **Thiếu chi tiết**. Schema đang gộp chung phụ cấp, trong khi Type tách lẻ. |
| **leaveTaken** | `number` | ❌ **Thiếu trong Schema**. |
| **managerId** | `SystemId` | `string` | ✅ Tạm ổn. |

**Kết luận:** Logic validation đang **không khớp** với cấu trúc dữ liệu thực tế. Cần viết lại `employeeFormSchema` để map chính xác 1-1 với `Employee` type.

---

## 2. Rà soát UI Fields (Form & Detail)

### 2.1. Trang Tạo/Sửa (`employee-form.tsx`)
*   **Thiếu các trường quan trọng:**
    *   `employeeType` (Loại nhân viên): Chưa thấy trong validation, khả năng cao chưa có trên UI.
    *   `contractNumber` (Số hợp đồng): Chưa thấy.
    *   `probationEndDate`, `contractStartDate`, `contractEndDate`: Chưa thấy validate date range logic.
    *   `socialInsuranceSalary` (Lương đóng BHXH): Chưa thấy.
    *   Các loại phụ cấp chi tiết (`positionAllowance`, `mealAllowance`...): Form đang dùng field chung `allowances` (sai logic).

### 2.2. Trang Chi tiết (`detail-page.tsx`)
*   **Thông tin hiển thị:**
    *   Đã hiển thị khá đầy đủ các nhóm thông tin chính (Cá nhân, Công việc, Lương).
    *   Tuy nhiên, do dữ liệu đầu vào (Form) đang thiếu/sai lệch, nên dữ liệu hiển thị ra có thể bị trống hoặc sai.

---

## 3. Đề xuất sửa lỗi (Action Plan)

### Bước 1: Đồng bộ Validation Schema (Ưu tiên cao nhất)
Sửa file `features/employees/validation.ts`:
1.  Đổi tên `basicSalary` -> `baseSalary`.
2.  Xóa `allowances` chung, thay bằng `positionAllowance`, `mealAllowance`, `otherAllowances`.
3.  Cập nhật Enum `contractType` cho khớp với `types.ts`.
4.  Thêm các field thiếu: `employeeType`, `contractNumber`, `socialInsuranceSalary`.

### Bước 2: Cập nhật Form UI (`employee-form.tsx`)
1.  Thêm các input cho các field mới thêm vào Schema.
2.  Sửa lại phần nhập lương thưởng để tách riêng các loại phụ cấp.
3.  Cập nhật `Select` option cho `contractType` và `department` để khớp với Type.

### Bước 3: Kiểm thử luồng CRUD
1.  Tạo nhân viên mới với đầy đủ thông tin (bao gồm cả lương, phụ cấp chi tiết).
2.  Kiểm tra xem dữ liệu lưu vào Store có đúng cấu trúc `Employee` type không.
3.  Mở trang chi tiết xem hiển thị có đúng không.
