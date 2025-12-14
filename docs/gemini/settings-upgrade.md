# ⚙️ RÀ SOÁT CHỨC NĂNG SETTINGS

> **Trạng thái**: ✅ Đã rà soát
> **Ngày rà soát**: 2025-11-29
> **Người thực hiện**: Gemini

---

## A. FILES ĐÃ KIỂM TRA

### 1. Structure
- `features/settings/`
  - `branches/`: Quản lý chi nhánh
  - `customers/`: Cấu hình khách hàng (Types, Groups, Sources, Ratings, Payment Terms, SLA)
  - `employees/`: Cấu hình nhân sự (Roles, Leave Types, Salary Components)
  - `inventory/`: Cấu hình kho (Categories, Brands, Units)
  - `store-info/`: Thông tin cửa hàng
  - `system/`: Cấu hình hệ thống

### 2. Key Files Analyzed
- `features/settings/branches/store.ts`: Sử dụng `createCrudStore` factory pattern.
- `features/settings/branches/types.ts`: Định nghĩa type chuẩn với `SystemId`, `BusinessId`.
- `features/settings/customers/validation.ts`: Sử dụng Zod schema cho validation.
- `features/settings/customers/*-store.ts`: Các store riêng biệt cho từng loại setting.

---

## B. ĐÁNH GIÁ LOGIC

### 1. Ưu điểm (Pros)
- **Architecture**: Sử dụng pattern `createCrudStore` giúp giảm boilerplate code cho các thao tác CRUD cơ bản.
- **Type Safety**: Sử dụng `SystemId` và `BusinessId` nhất quán, giúp tránh nhầm lẫn giữa các loại ID.
- **Validation**: Zod schema được định nghĩa rõ ràng, tách biệt logic validation khỏi UI.
- **Default Handling**: Logic xử lý `isDefault` (đảm bảo chỉ có 1 default) được xử lý tốt trong store (`setDefault` function).
- **Address Management**: Branch hỗ trợ cấu hình địa chỉ 3 cấp (Tỉnh/Huyện/Xã) hoặc 2 cấp, chuẩn bị tốt cho integration với đơn vị vận chuyển.

### 2. Cần cải thiện (Cons/Gaps)
- **Persistence**: Hiện tại dữ liệu đang lưu trong memory hoặc local storage (giả lập). Cần map sang Prisma models.
- **Dependencies**: Chưa có logic kiểm tra ràng buộc khi xóa (ví dụ: không cho xóa Branch nếu đang có Employee thuộc Branch đó).
- **Audit Trail**: Chưa thấy rõ cơ chế lưu log ai đã sửa cấu hình (createdBy/updatedBy có trong type nhưng cần đảm bảo được điền đúng).

---

## C. LIÊN KẾT (DEPENDENCIES)

Settings là Master Data, là nền tảng cho toàn bộ hệ thống:

| Setting Module | Used By Modules | Impact |
|----------------|-----------------|--------|
| **Branches** | Employees, Products, Orders, Stock-Transfers | Inventory tracking, User assignment |
| **Customer Types** | Customers | Segmentation, Reporting |
| **Payment Terms** | Customers, Orders | Debt tracking, Due dates |
| **Leave Types** | Leaves, Payroll | Salary calculation |
| **Roles** | Employees | Permission control |
| **Units** | Products | Stock counting |

---

## D. ĐỀ XUẤT NÂNG CẤP (NEXT STEPS)

### 1. Database (Prisma)
Cần tạo các bảng Master Data trong `schema.prisma`:
```prisma
model Branch {
  systemId    String   @id @default(uuid())
  id          String   @unique // BusinessId
  name        String
  address     String?
  isDefault   Boolean  @default(false)
  // ... relations
}

model CustomerType {
  systemId    String   @id @default(uuid())
  name        String
  // ...
}
// Tương tự cho các setting khác
```

### 2. Backend API
- Tạo API endpoints chuẩn RESTful: `GET /api/settings/branches`, `POST /api/settings/branches`, v.v.
- Implement logic `isDefault` transaction trong database (dùng `prisma.$transaction`).

### 3. UI/UX
- Thêm confirm dialog khi xóa setting đang được sử dụng (cần API check usage).
- Thêm tính năng Import/Export settings (JSON/Excel) để dễ dàng setup cho môi trường mới.

### 4. Role-based Access
- Chỉ Admin hoặc HR Manager mới được quyền truy cập `features/settings`.
- Phân quyền chi tiết hơn: Sales Manager được sửa Customer Settings, Warehouse Manager được sửa Inventory Settings.

---

## E. KẾT LUẬN

Module Settings đã được xây dựng tốt về mặt Frontend structure và Logic cơ bản. Việc cần làm tiếp theo là kết nối với Backend (Prisma/PostgreSQL) và bổ sung các ràng buộc toàn vẹn dữ liệu.
