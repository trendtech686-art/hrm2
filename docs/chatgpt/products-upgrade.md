# Rà soát module Products (29/11/2025)

## 1. Kiến trúc & hiện trạng
- Danh sách sản phẩm (`features/products/page.tsx`) dùng Zustand store (`useProductStore`) kết hợp React Query giả lập (`useProductsQuery` gọi `fetchProductsPage` đọc từ store và sleep 120ms). Bộ lọc lưu xuống `localStorage`, có import/export CSV, trash view, sheet filter cho mobile.
- Form hoàn chỉnh (`product-form-complete.tsx`, ~1.4k dòng) kết hợp rất nhiều store settings (pricing, unit, supplier, branch, inventory categories, SLA). Hỗ trợ combo, upload ảnh (`image-store.ts`, `FileUploadAPI`). Validation dựa trên `productFormSchema` (Zod) nhưng field `inventory` chỉ là tổng số, không map tới `inventoryByBranch`.
- Store (`features/products/store.ts`): kế thừa `createCrudStore`, giữ toàn bộ dữ liệu + counters trong `localStorage`. Có API nội bộ cập nhật tồn kho (`updateInventory`, `commitStock`, `dispatchStock`, `inTransitByBranch`...), search Fuse, update `lastPurchasePrice`.
- Logic nâng cao: combo utils (`combo-utils.ts`), stock alert utils (`stock-alert-utils.ts`), importer (`product-importer.ts`) convert branch columns. Hooks cung cấp stock combo theo chi nhánh, giá theo pricing policy, v.v.
- Asset/images lưu qua `image-store.ts` (Zustand) & `FileUploadAPI` mock, chưa gắn storage thật.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Nhận xét |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `Product` type khá đầy đủ (dual ID, inventoryByBranch...). Nhưng Zod schema chưa bao phủ `inventoryByBranch`, `committedByBranch`, `inTransitByBranch`, `prices` theo policy (chỉ `record<string, number>` không kiểm prefix). Chưa validate quan hệ Settings (category/brand/unit). |
| UI/UX | ⚠️ Một phần | Table responsive, toolbar đầy đủ; form chia tab nhưng file quá dài, logic upload ảnh phức tạp, chưa có autosave / progressive loading. Combo section khó dùng trên mobile. |
| Performance | ⚠️ Một phần | Dataset nằm toàn bộ trong memory; filter & search dùng Fuse trên client nên ok với demo nhưng không scale. Form re-render nhiều (useWatch khắp nơi). Chưa có virtualization cho list lớn. |
| Database Ready | ❌ | Không có Prisma schema/relations cho Product, ProductPrice, InventoryStock, ProductImage... Dữ liệu seed trong `features/products/data.ts`. Các thao tác tồn kho không ghi log, không enforce FK (branch, supplier). |
| API Ready | ❌ | Chưa có route Next.js/API, all state nằm ở client `localStorage`. Không thể tích hợp với Orders/Purchase Orders thực, không có event stock-out.

## 3. Logic & liên kết
1. **Product CRUD với dual-ID**
   - `createCrudStore` sinh `systemId`/`id` (prefix `SP`?). `validateUniqueId` chỉ chạy client. Không có migration.
2. **Product types (physical/service/digital/combo)**
   - Type field + combo fields (`comboItems`, `comboPricingType`). `combo-utils` ngăn combo lồng combo và tính stock/giá. Tuy nhiên store vẫn cho combo có `inventoryByBranch`, mâu thuẫn rule "combo không có tồn kho".
3. **Multi-branch inventory**
   - `inventoryByBranch`, `committedByBranch`, `inTransitByBranch` cấu trúc record. Các hàm `updateInventory/commitStock/dispatchStock/returnStockFromTransit` chỉ sửa store, không ghi lịch sử, không trigger event sang modules (Orders/Purchase Orders/Stock Transfer). Không có kiểm tra âm tồn, race condition.
4. **Pricing policies**
   - `prices` map theo `PricingPolicy.systemId`. Hooks `useProductDefaultPrice/useProductPrices` dựa vào store settings. Thiếu enforce: nếu policy bị xoá/đổi ID, product vẫn giữ key cũ.
5. **Combo logic**
   - `combo-utils` tính stock/price, but UI cho phép set combo discount = price (fixed) – confusion. Chưa có sync commit stock child khi bán combo (Orders module chưa gọi helper).
6. **Stock alerts**
   - `stock-alert-utils.ts` đọc SLA settings default reorder/safety. Nhưng `useSlaSettingsStore` cũng là client store – không đồng bộ.
7. **Image gallery & SEO**
   - `product-form-complete.tsx` upload `thumbnail` & `gallery`. File metadata giữ trong Zustand `image-store`. Chưa có API confirm/permanent storage.
8. **Importer**
   - `product-importer.ts` xử lý multi-branch columns. Tuy nhiên output set `inventory` + `inventoryByBranch` nhưng store `addMultiple` không merge `inventoryByBranch` => risk mismatch.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Dữ liệu sản phẩm, tồn kho, giá bán lưu trên client `localStorage` → không bảo mật, không multi-user, không audit. | `features/products/store.ts` (`persistKey: 'hrm-products'`). |
| 🔴 Cao | Logic tồn kho chỉ chạy client, không đảm bảo nhất quán với Orders/Purchase-Orders → dễ lệch stock. | `updateInventory/commitStock/dispatchStock` không gọi API/log. |
| 🔴 Cao | `product-form-complete.tsx` quá lớn, nhiều side-effect (upload ảnh, combo calc) => khó bảo trì, dễ lỗi. Chưa có unit test. | File ~1400 dòng. |
| 🟠 Trung bình | Zod schema không phản ánh `inventoryByBranch`, `pricing policies` -> dữ liệu import API sẽ thiếu, dễ sai khi triển khai server. | `validation.ts`. |
| 🟠 Trung bình | Combo: store vẫn cho `inventoryByBranch` & importer set inventory → vi phạm rule combo "không tồn kho". Chưa có enforce child stock deduction. | `product-importer.ts`, `Product` type comment. |
| 🟡 Thấp | Không có module test (chỉ `__tests__` rỗng). | `features/products/__tests__`.

## 5. Đề xuất nâng cấp
1. **Chuyển sang backend (Tuần 1-2)**
   - Thiết kế Prisma schema: `Product`, `ProductPrice`, `ProductInventory` (branch-level), `ProductComboItem`, `ProductImage`. Ràng buộc FK (branch, supplier, category, brand). Tách `ProductStockLedger` để ghi lịch sử nhập/xuất.
   - Viết migration & seed (dựa `features/products/data.ts`).
   - Dựng API `/api/products` (CRUD, bulk import/export). Endpoints riêng cho stock operations (`/inventory/commit`, `/inventory/dispatch`).
2. **Refactor state (Tuần 2)**
   - Thay `useProductStore` bằng React Query hook truy cập API. Store nội bộ chỉ giữ UI states (filters, drafts). Stock updates gọi mutation (optimistic update + invalidation).
   - Chuẩn hóa event: Orders → call `commitStock/dispatchStock` API; Purchase Orders → call `updateInventory`. Viết service layer chung.
3. **Form modularization (Tuần 2-3)**
   - Chia `product-form-complete.tsx` thành các section component + custom hook `useProductFormImages`. Tách combo logic ra hook/hocs.
   - Validation: cập nhật schema để chấp nhận `inventoryByBranch`, enforce `minPrice <= suggested <= price`, validate relation IDs (exists in settings). Kết hợp server-side validation.
4. **Combo stock integration (Tuần 3)**
   - Khi order combo, convert sang line item SP con (commit/dispatch). Chặn set `inventoryByBranch` khi `type=combo`. Auto-calc price & cost server-side.
5. **Stock alerts & forecasting (Tuần 3)**
   - Tách threshold config sang bảng `InventoryAlertSettings`. API trả alert list để hiển thị, enable background job để gửi cảnh báo.
6. **Images & assets (Tuần 3-4)**
   - Kết nối storage thực (S3/Spaces). `image-store` chỉ giữ trạng thái upload tạm thời; persisted metadata lưu DB (`ProductImage`).
7. **Testing & monitoring (Tuần 4)**
   - Vitest cho combo utilities, importer, stock helper. Playwright flow: tạo sản phẩm -> import -> tạo combo -> bán -> kiểm tra stock.

## 6. Việc cần làm ngay
- Ngưng sử dụng `persistKey 'hrm-products'` trên môi trường thật; tạm thời backup/export JSON trước khi migrate.
- Lên danh sách entity Settings phụ thuộc (category/brand/unit/pricing/supplier/branch) để chuẩn hóa ID trước khi viết Prisma.
- Xác định các luồng liên kết: Orders ↔ Products (stock out), Purchase Orders ↔ Products (stock in), Stock Transfers, Inventory Checks – cần contract API rõ.
- Sau Products, tiếp tục module Customers theo thứ tự ưu tiên.
