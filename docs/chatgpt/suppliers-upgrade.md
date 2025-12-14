# Rà soát module Suppliers (29/11/2025)

## 1. Kiến trúc & hiện trạng
- Tất cả dữ liệu nhà cung cấp nằm trong `useSupplierStore` (`features/suppliers/store.ts`) – kế thừa `createCrudStore` với `persistKey: "hrm-suppliers"`. CRUD, cập nhật trạng thái, bulk delete đều chỉ thao tác `localStorage`, không có API/backend hay đồng bộ đa người dùng.
- Danh sách (`features/suppliers/page.tsx`) dựng trên `ResponsiveDataTable` nhưng vẫn tự xử lý search/pagination bằng Fuse + state cục bộ. Bộ lọc, column-visibility lưu thẳng `localStorage` giống Customers, nên dễ lệch khi chuyển sang server pagination.
- Form nhập (`features/suppliers/supplier-form.tsx`) dùng RHF + Zod riêng lẻ. Người dùng phải gõ tay `id` (mặc dù comment ghi auto), `accountManager` là chuỗi tên nhân viên chọn từ `useEmployeeStore` thay vì khóa ngoại. Không có validation trùng MST, số điện thoại hay liên kết với Settings.
- `QuickAddSupplierDialog` tạo supplier ngay từ modal khác nhưng bỏ qua schema, dựng địa chỉ text tự do bằng `useProvinceStore`, thậm chí gọi `asBusinessId("")` → sinh `id` rỗng rồi phó mặc `createCrudStore` tự điền.
- Trang chi tiết (`features/suppliers/detail-page.tsx`) cố dựng ledger bằng cách lấy dữ liệu từ các store `purchase-orders`, `payments`, `purchase-returns` – tất cả cũng là client store – nên "Lịch sử công nợ" thực chất chỉ là phép cộng trừ giả lập, không có bảng ledger thực.
- Không có Prisma schema cho Supplier, SupplierContact, SupplierAddress, Ledger... nên cũng không thể tích hợp thật với Purchase Orders / Cashbook / Payments.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Nhận xét |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `Supplier` chỉ có ~15 field, không có `accountManagerId`, `statusHistory`, `leadTime`, `documents`. Zod schema chỉ dùng cho form chính, Quick Add/Detail bỏ qua. Không có kiểm tra trùng MST/SĐT, không enforce quan hệ Settings. |
| UI/UX | ⚠️ Một phần | Data table có mobile card, nhưng Quick Add không đồng bộ với form chính, không cho phép nhập nhiều đại diện/địa chỉ. Form vẫn bắt nhập mã thủ công. Không có trạng thái tải/ lỗi khi gọi API (vì chưa có API). |
| Performance | ⚠️ Một phần | Fuse chạy hai nơi (store + page). Fuse ở store được khởi tạo một lần và không re-index khi data đổi → search stale. Tất cả dữ liệu load vào memory, không phân trang server hay debounce rõ ràng. |
| Database Ready | ❌ | Không tồn tại schema bảng Supplier/SupplierLedger/SupplierAttachment. Dữ liệu seed trong `features/suppliers/data.ts`. Không có khóa ngoại tới Employees, Provinces, Purchase Orders. |
| API Ready | ❌ | Không có route Next.js (chỉ có store). `QuickAdd`/Form đều gọi trực tiếp store. Không thể tích hợp với Purchase Orders, Payments hay Cashbook thực. |
| Liên kết module | ⚠️ Thiếu | Detail page đọc các store khác nhưng không có contract event khi Purchase Order/Phiếu chi thay đổi. `currentDebt` chỉ là số treo, không sync ngược. |

## 3. Logic & liên kết đáng chú ý
1. **Zustand store** (`features/suppliers/store.ts`): bọc `createCrudStore`, thêm `searchSuppliers`, `updateStatus`, `bulkDelete`. Tuy nhiên `searchSuppliers` dùng `Fuse` toàn cục không re-index; `bulkDelete` ghi thêm `deletedBy` dù type chưa định nghĩa.
2. **Trang danh sách** (`features/suppliers/page.tsx`): Tự lọc (Fuse), sort, paginate, mobile infinite scroll. Các thao tác bulk update/delete gọi trực tiếp store nên không có xác nhận server hay audit trail.
3. **SupplierForm** (`supplier-form.tsx`): chia 4 section (thông tin cơ bản/liên hệ/ngân hàng/công nợ) nhưng field `accountManager` lưu tên nhân viên, `currentDebt` chỉ chỉnh khi tạo mới. Không có phần upload chứng từ, SLA cam kết, thời gian thanh toán.
4. **Quick add dialog** (`components/quick-add-supplier-dialog.tsx`): bypass mọi schema, không nhập `accountManager`, `taxCode`, `bank`. Địa chỉ chỉ là text, không trả về structure 3 cấp, trong khi module Settings Provinces đã có data.
5. **Detail page** (`detail-page.tsx`): hiển thị debt ledger bằng cách hợp nhất PO, payment, purchase return store → chỉ phản ánh dữ liệu demo, không tương tác được với Cashbook thực.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Module chạy hoàn toàn bằng `localStorage` (`persistKey 'hrm-suppliers'`), không có API hay đồng bộ. Không thể dùng trên môi trường production/multi-user. | `features/suppliers/store.ts` |
| 🔴 Cao | Quick add và form chính không dùng chung schema; Quick add gọi `asBusinessId("")` rồi `add` trực tiếp → có thể sinh nhà cung cấp không có mã, không người phụ trách, không địa chỉ chuẩn. | `components/quick-add-supplier-dialog.tsx` |
| 🔴 Cao | Debt ledger chỉ là phép cộng từ các store client khác, không có bảng `SupplierLedger` hay liên kết thực với Cashbook/Purchase Orders → số "Công nợ" sai lệch khi user đổi tab/clear storage. | `detail-page.tsx` + `store.ts` |
| 🟠 Trung bình | `accountManager` lưu tên tự do; không có `accountManagerId` để ràng buộc Employees. Bulk update chỉ ghi `updatedBy` string, không enforce permission. | `types.ts`, `supplier-form.tsx` |
| 🟠 Trung bình | `searchSuppliers` dựng `Fuse` một lần và không cập nhật khi store thay đổi → kết quả search cũ, nhất là sau khi import/bulk update. | `store.ts` line khởi tạo `const fuse = new Fuse(...)` |
| 🟠 Trung bình | Form yêu cầu nhập mã NCC thủ công (`supplierFormSchema.id` `min(1)`), trái với kế hoạch auto generate dual ID. Không có logic kiểm tra trùng ID/MST. | `supplier-form.tsx` |
| 🟡 Thấp | `bulkDelete` set `deletedBy` nhưng type không có → lệch typings + dễ bỏ sót khi chuyển sang schema. Các hook trong `page.tsx` không dùng selector (`useSupplierStore()` trả toàn bộ state) làm mọi re-render đều tốn kém. | `store.ts`, `page.tsx` |

## 5. Đề xuất nâng cấp
1. **Thiết kế backend (Tuần 1-2)**
   - Prisma schema cho `Supplier`, `SupplierContact`, `SupplierAddress`, `SupplierLedger`, `SupplierDocument`. Ràng buộc FK tới `Employee`, `Province`, `PurchaseOrder`, `Payment`. Thêm enum `paymentTerm`, `rating`, `leadTime`.
   - Seed dữ liệu từ `features/suppliers/data.ts` sang DB thông qua script.
2. **API & service layer (Tuần 2)**
   - Xây REST/Route Handler `/api/suppliers` (list, detail, search, import/export) + `/api/suppliers/{id}/ledger`, `/api/suppliers/{id}/attachments`.
   - Khi Purchase Order được tạo/duyệt → gọi service cập nhật ledger & `currentDebt`. Cashbook/Phiếu chi cũng phải ghi giảm nợ qua API.
3. **Refactor front-end state (Tuần 3)**
   - Thay `useSupplierStore` bằng React Query dùng API thật. Store nội bộ chỉ giữ UI states (filters, dialog). Fuse search chuyển xuống API (query param) hoặc server-side search.
   - Quick add & form chính dùng chung schema (Zod shared). Remove yêu cầu nhập mã: front-end chỉ nhập data, server trả về `systemId/id`.
4. **Nâng cấp form & data model (Tuần 3)**
   - Tách `accountManager` thành `accountManagerId` + auto load tên. Cho phép lưu nhiều người liên hệ, nhiều tài khoản ngân hàng, rating, tags, thời hạn thanh toán (NET30...).
   - Chuẩn hóa địa chỉ: dùng cùng cấu trúc enhanced address như Customers để phục vụ logistics.
5. **Ledger & báo cáo (Tuần 4)**
   - Tạo bảng `SupplierLedger` + API phân trang/ lọc. Detail page chỉ render data từ API, có export chuẩn.
   - Gắn trigger khi PO, Purchase Return, Payment thay đổi để cập nhật ledger và gửi notification nếu vượt hạn mức công nợ nhà cung cấp.
6. **Testing & bảo trì**
   - Viết Vitest cho `searchSuppliers`, ledger builder, Quick Add validation. Playwright flow: tạo supplier → tạo PO → ghi nhận công nợ → thanh toán → kiểm tra ledger.

## 6. Việc cần làm ngay
- Khóa không cho chạy production với dữ liệu `localStorage`; xuất JSON backup trước khi migrate.
- Soạn tài liệu mapping giữa Supplier và các module (Purchase Orders, Payments, Cashbook) để thiết kế API đồng bộ công nợ.
- Viết đặc tả Prisma cho Supplier sau Settings/Customers để bước Orders kế tiếp có thể dựa vào supplier FK chuẩn.
- Sau khi hoàn thành Suppliers, tiếp tục ưu tiên #6: **Orders** theo bảng thứ tự trong `docs/chatgpt/feature-review-prompts.md`.
