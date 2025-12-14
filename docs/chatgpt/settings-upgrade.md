# Rà soát module Settings (29/11/2025)

## 1. Tổng quan hiện trạng
- `features/settings/page.tsx` đã nhóm 5 cụm cài đặt (basic/business/financial/operational/system), hỗ trợ tìm kiếm và bố cục mobile-first bằng `MobileSearchBar`. Navigation hoàn toàn client-side qua `react-router-dom`.
- Mỗi cụm con (vd. customers, branches, pricing, tasks, v.v.) dùng pattern: Vertical Tabs → bảng (`SimpleSettingsTable`/`SettingsTable`) → dialog form (`setting-form-dialog.tsx`, `branch-form.tsx`, ...). Toàn bộ CRUD chạy trên Zustand store.
- `lib/store-factory.ts` + `features/settings/settings-config-store.ts` tạo CRUD + persistence bằng `localStorage`, phát sinh `systemId`/`businessId`, đảm bảo seed data luôn có `SystemId`/audit fields.
- Liên kết mềm với module khác (Employees, Provinces, Tasks…) thể hiện trong form (vd. `branches/branch-form.tsx` cho chọn manager từ `useEmployeeStore`, lấy địa giới từ `useProvinceStore`). Tuy nhiên mới dừng ở layer UI/state, chưa có bảo toàn dữ liệu giữa modules.

## 2. Đối chiếu checklist
- **Code quality**: types & validation tương đối đầy đủ (`features/settings/customers/types.ts`, `validation.ts`). Tuy nhiên store chỉ soft-validate, chưa có error boundary khi `localStorage` lỗi, chưa có test.
- **UI/UX**: dùng shadcn/ui, responsive tốt (Card grid + vertical tabs). Chưa có loading skeleton/contextual empty states cho từng bảng, chưa có accessible focus management cho dialog dài như `branch-form.tsx`.
- **Performance**: nhiều file >400 dòng (`settings/customers/page.tsx`, `branches/branch-form.tsx`), thiếu tách nhỏ. Data render từ mảng in-memory, chưa có virtualization nhưng hiện data ít nên chấp nhận.
- **Database readiness**: chưa có bất kỳ Prisma schema/migration nào cho Settings. Các quan hệ (Branch ↔ Employee, Customer Settings ↔ Orders…) mới được comment mô tả, chưa enforce.
- **API readiness**: chưa có route Next.js hay React Query hook; mọi thao tác chỉ đổi state cục bộ, không gọi server.

## 3. Vấn đề & rủi ro chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Module phụ thuộc `localStorage` nên không đồng bộ multi-user, không phù hợp môi trường Next.js SSR/Prisma. | `lib/store-factory.ts`, mọi store trong `features/settings/**/store.ts` gọi `createCrudStore(..., persistKey)`. |
| 🔴 Cao | Thiếu Prisma schema & API, nên Settings không thể seed/đồng bộ với các module ưu tiên (Orders/Employees). | Toàn bộ thư mục `prisma/` vắng, không có route dưới `src/app/api/settings`. |
| 🟠 Trung bình | Form phức tạp (vd. `branches/branch-form.tsx` ~400 dòng) thiếu phân chia component nhỏ + kiểm soát hiệu năng (mỗi `watch` gây re-render lớn). | `features/settings/branches/branch-form.tsx`. |
| 🟠 Trung bình | Chưa có kiểm tra phụ thuộc khi xóa/tắt settings (vd. xóa Customer Group đang được Customers dùng). | Không có API/validate trong `features/settings/customers/page.tsx` phần `confirmDelete`. |
| 🟡 Thấp | UX thiếu trạng thái tải/lỗi riêng cho từng tab; toast thành công/thất bại chung chung. | `features/settings/customers/page.tsx` chỉ dùng `toast.success/error`. |

## 4. Đề xuất triển khai
1. **Chuẩn hóa dữ liệu (tuần 1)**
   - Thiết kế Prisma schema cho từng entity settings (ví dụ `Branch`, `CustomerType`, `PaymentTerm`, `TaskType`, ...). Bổ sung quan hệ FK (Employees, Provinces) và unique index trên `businessId`.
   - Viết migration + seed script (tận dụng data trong `features/settings/**/data.ts`).
2. **API & hook (tuần 1-2)**
   - Dựng router Next.js (`src/app/api/settings/[entity]/route.ts`) với CRUD + soft delete.
   - Viết React Query hooks tương ứng (`repositories/settings/branches.ts`), thay local stores = server state.
3. **Refactor UI (tuần 2-3)**
   - Chia nhỏ các form lớn thành section component, thêm skeleton + error boundary theo tab.
   - Chuẩn hóa `SettingsVerticalTabs` để nhận metadata từ server (số bản ghi, trạng thái đồng bộ, default flag...)
4. **Liên kết & bảo toàn dữ liệu (tuần 3)**
   - Khi disable/xóa `setting`, chạy check server-side xem có entity đang dùng; nếu có, chặn và hiển thị gợi ý.
   - Đối với các setting quan trọng (prefix, SLA), thêm audit log → `system/logs`.
5. **Tự động hóa & kiểm thử (tuần 3-4)**
   - Viết Vitest unit cho store logic (ID generation, default toggle).
   - Thêm e2e cho flow “Add branch → set default → sử dụng trong Orders”.

## 5. Việc cần làm kế tiếp
- Ưu tiên hóa danh sách entity Settings cần schema/API (bắt đầu với `branches`, `customers`, `inventory`, `payments`).
- Chốt chuẩn ID/prefix chung từ `ID_CONFIG` để viết migration chính xác.
- Lên kế hoạch thay thế gradual Zustand store bằng React Query (có thể giữ store để cache form tạm thời nhưng đọc/ghi qua API).
- Sau khi hoàn tất, cập nhật lại tài liệu hướng dẫn (docs/settings-upgrade v1.1) và checklist QA.
