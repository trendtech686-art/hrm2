# Rà soát module Employees (29/11/2025)

## 1. Kiến trúc & hiện trạng
- UI chính nằm tại `features/employees/page.tsx`: bảng dữ liệu lớn dùng `ResponsiveDataTable`, lọc nâng cao (branch/department/status), lưu cấu hình cột vào `localStorage`. Có thêm `trash-page.tsx`, `virtualized-page.tsx` và `page-tanstack-test.tsx` để thử nghiệm hiệu năng nhưng chưa áp dụng mặc định.
- State quản lý bởi `useEmployeeStore` (`features/employees/store.ts`). Store kế thừa `createCrudStore` → tự sinh `systemId/businessId`, soft delete, import/export và cache qua `localStorage`. Repository chỉ là in-memory (`repositories/in-memory-repository.ts`), chưa gắn với API/DB thật.
- Form nhập (`employee-form.tsx`, `employee-form-page.tsx`) dựa trên React Hook Form + schema `features/employees/validation.ts`. Hỗ trợ địa chỉ 2/3 cấp thông qua `EmployeeAddress` union (`features/employees/types.ts`).
- Role & permission tách riêng (`features/employees/roles.ts`, `permissions.ts`). `EmployeeAccountTab` cho phép đổi vai trò và đặt mật khẩu (hash client-side bằng `hashPassword`).
- Lưu hồ sơ lương qua `employee-comp-store.ts` (map employee ↔ work shift/salary component) và lưu tài liệu nhân viên qua `document-store.ts` (tích hợp giả lập `FileUploadAPI`).
- Tests hiện tại chỉ là smoke test render form (`features/employees/__tests__/employee-form-loop.test.tsx`).

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Nhận xét |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `Employee` type đầy đủ nhưng schema form đang dùng string cho `permanentAddress` thay vì object; thiếu validate liên quan dual-address, bank info theo chuẩn mới. |
| UI/UX | ⚠️ Một phần | Data table có toolbar responsive; tuy nhiên form dài >600 dòng, chưa có section collapse, chưa hỗ trợ mobile tốt. Chưa thấy skeleton/error boundary khi tải dữ liệu thật. |
| Hiệu năng | ⚠️ Một phần | Fuse search + memoization đã có, nhưng mọi thao tác vẫn đọc toàn bộ danh sách từ store (không phân trang server). Virtualized page chưa dùng. |
| Database Ready | ❌ | Không có Prisma schema cho `Employee`, `EmployeeDocument`, `EmployeePayrollProfile`. Seed hiện nằm trong file TS với lỗi `asSystemId(asSystemId(...))`. |
| API Ready | ❌ | Chưa có API routes, chưa có React Query hook. Store dựa vào `localStorage` → không đồng bộ nhiều user, không audit được. |

## 3. Đánh giá logic theo yêu cầu
1. **Employee CRUD với dual-ID**
   - `createCrudStore` auto tạo `systemId` (prefix `EMP`) & `businessId` (prefix `NV`). Form cho phép nhập thủ công nhưng chưa có bước check trùng phía server; chỉ dùng `validateUniqueId` client-side.
2. **Quản lý địa chỉ 2/3 cấp**
   - Type `EmployeeAddress` hỗ trợ 2/3 cấp, có helper `isTwoLevelAddress`. Nhưng form hiện tại vẫn lưu `permanentAddress` dạng string (`validation.ts`), chưa serialize/deserialise đúng cấu trúc => nguy cơ mất dữ liệu khi lưu DB.
3. **Role & Permission system**
   - Danh sách role cố định (`Admin/Manager/Sales/Warehouse`), mapping quyền chi tiết trong `permissions.ts`. Thiếu UI để chọn permission chi tiết từng nhân viên, chỉ gán role chung. Chưa tích hợp với các module khác (ví dụ Orders vẫn chưa kiểm tra role).
4. **Document management**
   - `document-store.ts` hỗ trợ staging file và upload qua `FileUploadAPI`, có cache theo employee. Lưu trữ metadata ở `localStorage` → không phù hợp thực tế, thiếu phân quyền truy cập/tải xuống.
5. **Compensation tracking**
   - `employee-comp-store.ts` chỉ lưu danh sách component IDs (tham chiếu `features/settings/employees`). Không có màn hình báo cáo/preview bảng lương, không sync vào Payroll module.
6. **Account linking (auth)**
   - `EmployeeAccountTab` gọi `useAuth` để kiểm tra role hiện tại, cho phép generate password client-side. Password lưu thẳng vào store (dù gọi `hashPassword`, vẫn chạy trên client). Chưa có liên kết với user table thực, chưa có refresh token/SSO.

## 4. Liên kết với module khác
- **Tasks / Leaves / Attendance / Payroll**: Type `Employee` có các trường hook (managerId, leaveTaken, shiftType...) nhưng chưa có API đảm bảo tham chiếu. Không có cơ chế cascade khi xóa nhân viên (ví dụ remove employee đang assigned task).
- **Orders / Customers**: `Employee` có thể dùng làm salesperson nhưng Orders module chưa đọc store này (chưa tìm thấy hook hay repo chung).
- **Settings**: Form chọn Branch (`useBranchStore`) và dùng Provinces store cho địa giới, nhưng đều là local store → cần đồng bộ qua DB.
- **Audit**: `createdBy/updatedBy` chỉ lưu systemId, không có log hiển thị bên ngoài.

## 5. Rủi ro & issue nổi bật
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Lưu toàn bộ dữ liệu nhân viên (kể cả password hash) trong `localStorage` client → mất an toàn, không đồng bộ, dễ mất dữ liệu. | `features/employees/store.ts`, `EmployeeAccountTab`. |
| 🔴 Cao | Seed data sai chuẩn (`systemId: asSystemId(asSystemId('EMP000001'))`) → khi migrate sang Prisma dễ sinh lỗi cast. | `features/employees/data.ts`. |
| 🔴 Cao | Chưa có backend/API/Prisma → không thể audit, phân quyền, hoặc tích hợp với module khác; không đáp ứng yêu cầu dual-ID thật sự. | Toàn bộ module chỉ dùng Zustand.
| 🟠 Trung bình | Form/validation không khớp với kiểu địa chỉ mới, nguy cơ mất thông tin khi submit. | `features/employees/validation.ts`. |
| 🟠 Trung bình | Quy trình xóa nhân viên không kiểm tra ràng buộc (Tasks, Orders, Payroll). | `features/employees/page.tsx` `confirmDelete`. |
| 🟡 Thấp | Tests hầu như không có (1 file render). Không có coverage cho store, permissions, document flow. | `features/employees/__tests__`. |

## 6. Đề xuất nâng cấp
1. **Thiết kế dữ liệu (Tuần 1)**
   - Viết Prisma schema cho `Employee`, `EmployeeAddress`, `EmployeeDocument`, `EmployeePayrollProfile`, `EmployeeRole`, `Permission`. Thêm FK đến `Branch`, `Department`, `User`.
   - Migration seed: convert `features/employees/data.ts` sang script `prisma/seed.ts`, chuẩn hóa ID và audit fields.
2. **API & Repository (Tuần 1-2)**
   - Tạo Next.js API route `/api/employees` (CRUD + bulk import/export). Bổ sung endpoint cho documents (upload S3) và payroll profile.
   - Viết repository mới dùng React Query (`repositories/employees.ts`) thay `localStorage`. `useEmployeeStore` chỉ giữ UI state (pagination/filter) và đọc data qua hook.
3. **Form & Validation (Tuần 2)**
   - Refactor form thành các section component: Personal, Employment, Compensation, Account. Đồng bộ schema để nhận `EmployeeAddress` object (Zod union) và map từ provinces store.
   - Thêm checking ràng buộc (VD: manager không thể thuộc nhân viên đã nghỉ, branch bắt buộc tồn tại).
4. **Role & Permission (Tuần 2-3)**
   - Thay role cố định bằng bảng `roles` + `role_permissions`. UI cho phép gán permission set cho từng nhân viên hoặc nhóm.
   - Khi cập nhật role, call API (server hash password). Bỏ lưu password ở client store.
5. **Liên kết module (Tuần 3)**
   - Trước khi delete employee, API kiểm tra Tasks/Leaves/Orders; nếu đang used → chặn hoặc chuyển giao auto.
   - Đồng bộ employee data sang Attendance/Payroll qua service layer (ví dụ `attendance/employee-service.ts`).
6. **Testing & Observability (Tuần 3-4)**
   - Vitest cho `createCrudStore`, permission guard, document-store logic.
   - Playwright/E2E: tạo nhân viên → upload tài liệu → gán role → verify hiển thị ở Tasks.

## 7. Việc cần làm ngay
- Khóa tính năng đổi mật khẩu trên client cho đến khi có API hashing server-side.
- Chuẩn bị đặc tả Prisma + mapping ID (dual ID, audit fields) để tái sử dụng trong modules ưu tiên (Tasks/Leaves/Attendance).
- Lập kế hoạch migration dữ liệu `localStorage` sang DB (xuất JSON → import vào Prisma seed).
- Sau Employees, chuyển sang rà soát module Products theo thứ tự ưu tiên đã thống nhất.
