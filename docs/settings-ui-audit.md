# Settings Module UI Audit (23/11/2025)

## 1. Phạm vi & phương pháp
- Bao quát toàn bộ `features/settings/*` gồm Appearance, Store Info, Payment, Pricing, Sales, Customers, Inventory, Complaints, Warranty, Tasks, Penalties, Departments, Taxes và các placeholder Import/Export.
- Kiểm tra 4 tiêu chí chính theo `docs/DEVELOPMENT-GUIDELINES-V2.md`: `PageHeader` (title/subtitle/actions), control `h-9` chuẩn shadcn, placeholder/card thống nhất, và thành phần bảng/form dùng chung.
- Đối chiếu thực tế với `components/ui/*`, `components/shared/data-table`, `contexts/page-header-context.tsx` để xác định điểm lệch.

## 2. Phát hiện chính
| Hạng mục | Triệu chứng hiện tại | Hệ quả | Giải pháp đề xuất |
| --- | --- | --- | --- |
| Page header thiếu metadata | `appearance/page.tsx`, `pricing/page.tsx`, `customers/page.tsx` chỉ gọi `usePageHeader({ actions })` nhưng bỏ `title/subtitle`. | Breadcrumb hiển thị đúng nhưng nội dung chính rỗng, khó định hướng & không theo template. | Bổ sung `title`, `subtitle`, và `docLink` (nếu có) cho tất cả page; chuẩn hóa tại factory `registerSettingsPageHeader()`.
| Chiều cao action không đồng nhất | Các nút trong `store-info`, `payment/receipt-types`, `provinces`, `departments` dùng size mặc định (`h-8`, icon lệch). | UI không khớp shadcn, khó căn hàng với form input `h-9`. | Tạo helper `settingsAction()` trả về `<Button size="sm" className="h-9 px-4">`; migrate toàn bộ action bar.
| Placeholder/cards tùy biến | Placeholder import/export, workflow template, system log tự dựng card rời rạc, icon khác nhau. | Trải nghiệm rời rạc, không có CTA rõ. | Tạo component `SettingsPlaceholder` (icon + title + description + primary CTA optional) đặt trong `components/settings/SettingsPlaceholder.tsx`.
| Bảng dữ liệu phân mảnh | Một số trang dùng `SettingsTable`, số khác dùng `ResponsiveDataTable` hoặc table thuần (`payment/methods`, `penalties`, `taxes`). | Không có sorting/responsive nhất quán, thiếu empty state chung. | Chuẩn hóa sang `components/shared/data-table` với cấu hình column re-usable; chỉ giữ table thuần cho danh sách <4 cột.
| File upload/import không chuẩn | `inventory/settings/import`, `customers/settings` dùng `<input type="file">` thô; `payment-settings` có button + hidden input khác pattern. | Không có trạng thái hover/focus, icon và text không đồng bộ, khó mở rộng drag/drop. | Dùng `components/ui/file-upload-trigger.tsx` (mới) + dialog preview chung cho mọi import; 23/11 đã xóa toàn bộ shim `file-upload.tsx`/`file-upload-staging.tsx` để bắt buộc dùng uploader mới.
| Mega form không chia section | Complaints/Warranty/Tasks settings nhồi >15 field vào một card, không có `FormFieldset` hoặc mô tả. | Khó đọc, không tận dụng `ScrollArea`, khó map sang API. | Tách theo group + dùng component chung `SettingsFormSection` (title, description, optional badge). | 
| Provinces/Departments drag UI lệch theme | DnD trong `departments/page.tsx` dùng border màu xám cũ, không có card padding shadcn. | Không đồng bộ với phần khác, hover state thiếu. | ✅ 23/11: Bọc item bằng `SortableCard` + drop-zone card, đồng bộ token màu.

## 3. Giải pháp chi tiết
1. **PageHeader preset**
   - Tạo helper `useSettingsPageHeader({ title, subtitle, actions, docLink })` gọi `usePageHeader` nội bộ và áp dụng icon Gear mặc định.
   - Áp dụng lần lượt cho tất cả page trong `features/settings/*` (ưu tiên trang chính: Appearance, Store Info, Payment, Pricing, Sales, Customers, Inventory, Complaints, Warranty, Tasks).
2. **Action bar & button height**
   - Đã tạo wrapper `components/settings/SettingsActionButton.tsx` (23/11) để ép `h-9 px-4` và `gap-2` cho mọi action.
   - Kiểm tra mọi `<Button>` nằm trong header/split card, đảm bảo icon dùng `Lucide` size 16.
3. **Placeholder component**
    - Đã tạo `components/settings/SettingsPlaceholder.tsx` (23/11) để hiển thị icon + mô tả + CTA thống nhất.
    - API mẫu:
     ```tsx
     <SettingsPlaceholder
       icon={Inbox}
       title="Chưa có kết nối"
       description="Kết nối đối tác vận chuyển để đồng bộ trạng thái."
       action={<Button>Thêm đối tác</Button>}
     />
     ```
    - Đã áp dụng cho `settings/other`, `settings/system/system-logs`, `settings/system/import-export-logs`, `settings/templates/print-templates`, `settings/taxes`.
4. **Data table consolidation**
   - Đã chuyển `payment/methods/page-content.tsx`, `receipt-types/page-content.tsx`, tab `inventory/ProductTypesTabContent`, toàn bộ `customers/page.tsx` (5 tab), Penalties list **và bảng phường/xã (2 cấp & 3 cấp) trong `provinces/page.tsx`** sang `ResponsiveDataTable`/`SettingsResponsiveTable`; bổ sung hook `useSettingsDataTable` để quản lý pagination/sorting/column state + mobile card mặc định.
   - Dọn các wrapper cũ (`features/settings/customers/settings-responsive-table.tsx`) và hợp nhất cấu hình column; trang Taxes hiện vẫn là placeholder nên chưa có bảng để migrate.
5. **File import pattern**
   - Component chung `SettingsImport` gồm: hướng dẫn 3 bước, button chọn file (drag/drop optional), hiển thị file đã chọn + nút Clear, CTA Upload.
   - Áp dụng cho `inventory/import`, `customers/import`, `pricing/bulk-upload`, `sales/offline-sync`.
6. **Legacy uploader cleanup (23/11)**
   - Dọn hoàn toàn `components/ui/file-upload.tsx` và `file-upload-staging.tsx`; chuyển `UploadedFile` type sang `lib/file-upload-api.ts`.
   - Kiểm tra và xoá mọi import cũ (`EmployeeForm`, `EmployeeFormPage`, `FilePreview`) để đảm bảo chỉ dùng `NewDocumentsUpload`/SettingsImport.
7. **Mega form re-structure**
   - Extract `SettingsFormSection` (title, description, optional badge) và `SettingsFormGrid` (2 columns) vào `components/settings/forms/`.
   - Complaints, Warranty, Tasks settings dùng chung store + persist; tách logic persist ra `settingsConfigStore.ts` để tái sử dụng khi có backend.
8. **DnD visual refresh**
   - Viết `SortableCard` component (Card + drag handle + description) dùng trong Departments/KPI/Provinces reorder.
   - Departments: Bọc toàn bộ cột/trạng thái trong `Card`, tạo `DropZone` mới với token `border-border`, helper text và highlight `isOver`, đồng thời dùng `SortableCard` cho từng nhân viên.
   - Provinces: Dùng `SortableCard` cho danh sách tỉnh/thành, bổ sung hướng dẫn kéo thả với icon `GripVertical` ngay trong header card để người dùng biết cách sắp xếp.

## 4. TODO hành động
| # | Hạng mục | File liên quan | Trách nhiệm | Trạng thái |
| --- | --- | --- | --- | --- |
| 1 | Thêm helper `useSettingsPageHeader` + migrate 12 trang chính | `features/settings/**/*.tsx`, `contexts/page-header-context.tsx`, `components/layout/page-header.tsx` | FE | Hoàn thành (23/11) |
| 2 | Chuẩn hóa button `h-9` cho mọi action/header | `components/settings/SettingsActionButton.tsx`, `features/settings/**/*` (Buttons trong header/card) | FE | Hoàn thành (23/11) |
| 3 | Tạo `SettingsPlaceholder` + thay thế placeholder legacy | `components/settings/SettingsPlaceholder.tsx`, `features/settings/other`, `features/settings/system/*`, `features/settings/templates/print-templates`, `features/settings/taxes` | FE | Hoàn thành (23/11) |
| 4 | Hợp nhất bảng dữ liệu dùng `ResponsiveDataTable` | `features/settings/payment`, `pricing`, `penalties`, `taxes`, `provinces` | FE | Hoàn thành (23/11 – Payment Methods + Receipt Types + Product Types + Customers + Penalties + Provinces ✅) |
| 5 | Chuẩn file import component | `components/settings/SettingsImport.tsx`, các trang import/bulk upload | FE | Chưa làm |
| 6 | Refactor Complaints/Warranty/Tasks settings form sections | `features/settings/complaints/page.tsx`, `warranty/page.tsx`, `tasks/page.tsx` | FE | Hoàn thành (23/11) |
| 7 | Làm mới UI drag & drop Departments/Provinces | `features/settings/departments/page.tsx`, `provinces/page.tsx` | FE | Hoàn thành (23/11) |
| 8 | Dọn legacy file upload + shim tạm | `components/ui/file-upload.tsx`, `components/ui/file-upload-staging.tsx`, `features/**/*` đang import uploader cũ | FE | Hoàn thành (23/11) |
| 9 | Viết guideline mini cho Settings trong `docs/DEVELOPMENT-GUIDELINES-V2.md` | `docs/DEVELOPMENT-GUIDELINES-V2.md` | Docs | Chưa làm |

## 5. Ghi chú triển khai
- Ưu tiên làm helper + component trước, sau đó mở PRs nhỏ cho từng nhóm trang để dễ review.
- Khi migrate bảng, viết test Storybook hoặc screenshot regression để đảm bảo responsive 2 cột vẫn hoạt động.
- Các trang placeholder nên chuẩn bị sẵn props `onCreate`, `onConnect` để khi có backend chỉ cần truyền handler.
