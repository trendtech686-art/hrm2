# Rà soát module Sales-Returns (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Store & persistence**: `useSalesReturnStore` (`features/sales-returns/store.ts`) kế thừa `createCrudStore` với `persistKey: "hrm-sales-returns"`, tức toàn bộ phiếu trả, đơn đổi, chứng từ liên kết được lưu trong `localStorage`. Hàm `addWithSideEffects` thực thi toàn bộ nghiệp vụ ngay trên client: định dạng dữ liệu, tạo phiếu thu/chi, tạo order mới, cập nhật tồn kho, cập nhật công nợ và lịch sử kho.
- **Luồng tạo phiếu**: `SalesReturnFormPage` (`form-page.tsx`, ~1.100 dòng) điều khiển mọi tính toán: so sánh giá trị trả/đổi, validate thanh toán/hoàn tiền, tự động bắn API GHTK khi chọn giao đơn đổi qua đối tác (token lấy từ `loadShippingConfig()` trên client). Form cũng tạo workflow, tags, shipping info nhưng không mapping vào `SalesReturn` type.
- **Trang danh sách**: `SalesReturnsPage` (`page.tsx`) dựng `ResponsiveDataTable`, filter bằng Fuse.js và lưu column-visibility vào `localStorage`. Không có pagination phía server, không role-based action; người dùng click hàng để vào chi tiết.
- **Trang chi tiết**: `SalesReturnDetailPage` (`detail-page.tsx`) đọc store trực tiếp, hiển thị bảng hàng trả/hàng đổi, thông tin khách và chứng từ. `SalesReturnWorkflowCard` render checklist nhưng state chỉ sống trong component (`useState`) → reload là mất.
- **Workflow component**: `components/sales-return-workflow-card.tsx` lấy template từ `getWorkflowTemplate('sales-returns')` và gọi `onSubtasksChange`, nhưng vì `SalesReturn` type không chứa trường `subtasks`, mọi thay đổi không được lưu trữ.
- **Side-effects sau khi tạo**:
  - Nếu có hàng đổi, `addWithSideEffects` tự gọi `useOrderStore.add` để tạo **đơn bán mới** trong browser, set status/delivery/payment dựa trên `finalAmount` và `deliveryMethod`.
  - Tạo chứng từ tài chính bằng `createPaymentDocument`/`createReceiptDocument` (client-side) rồi patch ngược `paymentVoucherSystemIds` / `receiptVoucherSystemIds`.
  - `isReceived` quyết định cập nhật tồn kho ngay lập tức thông qua `useProductStore.updateInventory` và ghi `stock-history` (đều ở local state). Trường hợp chưa nhận, người dùng phải gọi `confirmReceipt` thủ công nhưng UI chưa có entry.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Ghi chú |
| --- | --- | --- |
| Types & Validation | ⚠️ Thiếu | `SalesReturn` thiếu `subtasks`, `tags`, `workflowTemplateId`, `state` cho shipping/GHTK. Không có schema chia sẻ (Zod/Prisma). Form validate manual bằng `alert`/`if` nên khó tái sử dụng. |
| UI/UX | ⚠️ Một phần | Form rất dài (shipping, hoàn tiền, workflow) nhưng không có autosave, không chống race condition khi double-submit (dù có flag `isSubmitting`). Chi tiết chỉ đọc state, không có action “Xác nhận nhận hàng” hay log lịch sử.
| Performance | ⚠️ Một phần | Danh sách tải toàn bộ `returns` vào bộ nhớ, search client, export client. Form load toàn bộ đơn hàng + sản phẩm để chọn hàng đổi → nghẽn khi dataset lớn.
| Database Ready | ❌ | Chưa có bảng `sales_returns`, `sales_return_items`, `sales_return_payments/refunds`, `sales_return_workflows`, `sales_return_exchange_orders`. Không lưu quan hệ chuẩn tới `orders`, `customers`, `payments`, `shipments`.
| API Ready | ❌ | Không có endpoint chính thức. Việc tạo phiếu/đơn đổi/phiếu thu-chi/stock history đều chạy trong trình duyệt → không thể triển khai đa người dùng hoặc kiểm soát quyền.
| Liên kết module | ⚠️ Lỏng lẻo | Có gọi sang Order/Product/Customer/Finance store nhưng chỉ trong cùng trình duyệt. Không có cơ chế đảm bảo đồng bộ với Inventory Checks, Complaints hay Warranty. `confirmReceipt` không gắn vào UI nên tồn kho “treo” khi chọn "Chưa nhận hàng".

## 3. Luồng đáng chú ý
1. **Tạo phiếu trả + đơn đổi** (`form-page.tsx` → `addWithSideEffects`):
   - Người dùng chọn đơn gốc, đánh dấu sản phẩm trả, thêm sản phẩm đổi, cấu hình thanh toán & vận chuyển.
   - Nếu chọn đối tác GHTK, client đọc token GHTK từ `localStorage` (`loadShippingConfig`) và gọi thẳng `GHTKService.createOrder` bằng fetch → lộ API key trên trình duyệt.
   - Sau khi submit, store: (a) tạo `SalesReturn`, (b) tạo order mới nếu có exchange items, (c) tạo phiếu thu/chi tuỳ dấu `finalAmount`, (d) tự cập nhật tồn kho nếu `isReceived = true`.
2. **Cập nhật tồn kho** (`store.ts`): `getReturnStockItems` tự “bung” combo thành sản phẩm con rồi gọi `useProductStore.updateInventory` + ghi `useStockHistoryStore.addEntry`. Không có transaction, không khoá dữ liệu, không ghi ledger server.
3. **Hoàn tiền/Thanh toán nhiều phương thức**: Form cho phép nhập nhiều dòng `refunds` / `payments` nhưng validations chỉ là `alert`. Nếu người dùng bypass, store vẫn tạo phiếu thu/chi với amount bất kỳ.
4. **Workflow checklist**: `SalesReturnWorkflowCard` tự điền template rồi `toast` khi tick nhưng không lưu. Chi tiết trang tạo state rỗng → checklist trông như mới mọi lúc.

## 4. Rủi ro & Issue chính
| Mức | Mô tả | File/Đoạn |
| --- | --- | --- |
| 🔴 Cao | Toàn bộ nghiệp vụ trả hàng (tạo phiếu, đơn đổi, cập nhật tồn kho, công nợ, phiếu thu/chi) chạy trong trình duyệt dựa trên `localStorage`. Người dùng có thể thao tác offline, không có audit/log server → không đáp ứng chuẩn kế toán/kho khi triển khai thật. | `features/sales-returns/store.ts` (`createCrudStore` + `addWithSideEffects`) |
| 🔴 Cao | API GHTK được gọi trực tiếp từ frontend bằng token lấy từ cấu hình cục bộ (`loadShippingConfig`). Token/partnerCode lộ cho bất kỳ ai mở DevTools; không thể giới hạn IP hay ghi log chuẩn. | `features/sales-returns/form-page.tsx` (khối "GHTK API") |
| 🔴 Cao | `updateInventory` và `addStockHistory` được gọi ngay khi `isReceived = true` mà không qua backend/ledger. Sai sót hoặc thao tác thử nghiệm lập tức làm lệch tồn các module khác vốn cũng đọc từ `localStorage`. | `features/sales-returns/store.ts` (khối `if (newReturn.isReceived) { ... updateInventory ... }`) |
| 🟠 Trung bình | Workflow/tags/subtasks chỉ tồn tại trong state form/chi tiết; type `SalesReturn` không lưu nên người dùng tưởng đã đánh dấu nhưng reload là mất → gây hiểu nhầm quy trình. | `components/sales-return-workflow-card.tsx`, `sales-returns/types.ts` |
| 🟠 Trung bình | Không có nút/luồng UI để gọi `confirmReceipt`, nên nếu chọn “Chưa nhận hàng” thì tồn kho không bao giờ cập nhật, checkbox ở chi tiết chỉ hiển thị trạng thái mà không có hành động. | `detail-page.tsx` (không có action), `store.ts` (`confirmReceipt` không được sử dụng) |
| 🟠 Trung bình | Đơn đổi được tạo ngay cả khi `finalAmount < 0` (công ty hoàn tiền). `grandTotal` của order mới = `grandTotalNew`, nhưng `payments` rỗng → đơn luôn ở trạng thái “Chưa thanh toán” dù thực tế khách không cần trả. Không có liên kết hai chiều để điều chỉnh sau này. | `store.ts` (tạo `newOrderPayload`) |
| 🟡 Thấp | Validation thanh toán chỉ dùng `alert` và phép trừ thủ công; không có schema, không chuẩn hoá rounding nên dễ sai lệch khi đổi đơn vị tiền tệ. | `form-page.tsx` (khối validate payments/refunds) |

## 5. Đề xuất nâng cấp
1. **Backend hoá Sales Return**
   - Thiết kế bảng chuẩn: `sales_returns`, `sales_return_items`, `sales_return_exchange_items`, `sales_return_payments`, `sales_return_refunds`, `sales_return_workflows`, `sales_return_shipping`. Mã phiếu sinh trên server, liên kết khoá ngoại tới `orders`, `customers`, `branches`, `employees`, `cash_accounts`, `shipping_partners`.
   - Endpoint chính: `POST /api/sales-returns` (transaction: tạo phiếu, cập nhật tồn, tạo chứng từ), `PATCH /api/sales-returns/:id/receive`, `POST /api/sales-returns/:id/exchange-order`, `POST /api/sales-returns/:id/refunds`...
   - Tách service cập nhật tồn kho dùng chung với Inventory Checks/Stock Transfers để đảm bảo double-entry & audit log.
2. **Refactor frontend**
   - `useSalesReturnStore` chỉ giữ UI state (filters, column prefs). Data fetch qua React Query từ API, hỗ trợ pagination server.
   - `SalesReturnFormPage` chia nhỏ thành hooks (pricing, payments, shipping) và dùng schema (Zod/react-hook-form resolver). Workflow/tags/subtasks map vào API và hiển thị lại ở detail.
   - Chi tiết trang thêm action "Xác nhận đã nhận hàng" (gọi API), hiển thị log tồn & chứng từ, link tới đơn đổi / phiếu thu chi.
3. **Bảo mật & tích hợp vận chuyển**
   - Dời lệnh gọi GHTK về backend (server ký token, log response). Frontend chỉ request `POST /api/shipping/ghtk/orders` với payload tối thiểu.
   - Mã hoá và quản lý credential trong vault (Azure Key Vault/Env). Không lưu token trong `localStorage`.
4. **Quy trình tài chính**
   - Tạo phiếu thu/chi thông qua API (ex: `/api/finance/receipts`), enforce quyền và trạng thái (draft/posted). Ghi liên kết `original_document_id`, `sales_return_id`, `sales_order_id` để đối soát.
   - Hỗ trợ hoàn tiền/thu thêm nhiều phương thức bằng bảng phụ (nhiều dòng). Validate total khớp `finalAmount` trên server.
5. **Workflow & Audit**
   - Bổ sung trường `workflow_template_id`, `subtasks`, `completed_by`, `completed_at`. Lưu comment/log timeline.
   - Soft delete/sửa phiếu phải qua audit log, cấm xoá cứng khỏi DB. Cho phép versioning khi chỉnh sửa phiếu.
6. **Trải nghiệm & Hiệu năng**
   - Server-side filter/sort/export (CSV/PDF). Hỗ trợ quick action "In phiếu" qua API render.
   - Form cung cấp autosave draft, resume sau khi reload. Cho phép import line items trả từ file hoặc barcode scan.

## 6. Việc cần làm ngay
- Cảnh báo đội vận hành không sử dụng chức năng trả hàng/đơn đổi trên môi trường production cho đến khi có backend; backup `localStorage` keys (`hrm-sales-returns`, `hrm-orders`, `hrm-products`) trước mỗi lần thử nghiệm.
- Khoá tạm hành động "Cập nhật tồn kho" (ép `isReceived` = false, ẩn nút nhận hàng) để tránh chỉnh tồn thật.
- Ngừng cấu hình/nhập token GHTK trong client; chuyển sang thử nghiệm bằng mock service.
- Lập đặc tả Prisma/API cho Sales Returns + Exchange Order + Refund/Payment trước khi tiếp tục ưu tiên khác.

## 7. Next step
Sau khi khoá phạm vi Sales Returns, ưu tiên kế tiếp nên là module **Complaints/Warranty** để đảm bảo luồng trả hàng, kiểm kho và khiếu nại dùng chung ledger tồn kho và quy trình chứng từ.
