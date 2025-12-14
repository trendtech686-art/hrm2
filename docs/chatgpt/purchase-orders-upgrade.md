# Rà soát module Purchase Orders (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Store**: `usePurchaseOrderStore` (`features/purchase-orders/store.ts`, ~600 dòng) extends `createCrudStore` với `persistKey: "hrm-purchase-orders"`. Toàn bộ business logic (thanh toán, cập nhật trạng thái giao hàng, sinh phiếu thu/chi khi hủy, đồng bộ phiếu nhập kho, tự tạo return) chạy trong browser và ghi trực tiếp sang các store khác (Inventory Receipts, Payments, Receipts, Cashbook, Purchase Returns, Products, Stock History). Không có backend/API, không có transaction.
- **Dữ liệu seed**: `features/purchase-orders/data.ts` khởi tạo order mẫu, sau đó store tự gán `systemId` theo index và chạy `runInventoryReceiptBackfill` mỗi khi hydrate để đồng bộ phiếu nhập kho dựa trên store khác.
- **Trang danh sách** (`features/purchase-orders/page.tsx`): DataTable client (Fuse search, pagination tại chỗ, column settings lưu `localStorage`). Có bulk action tự tạo phiếu chi, nhập kho hàng loạt, auto cancel -> tác động trực tiếp tới các store tài chính/kho và thay đổi tồn kho.
- **Form tạo/sửa** (`form-page.tsx`, ~1k dòng): Kết nối hơn 10 store để thực hiện tạo đơn, thêm sản phẩm, tạo phiếu nhập kho tức thì, cập nhật tồn kho, ghi stock history, tạo phiếu chi. Toàn bộ validation thủ công, không dùng schema chung. Cho phép sao chép đơn, auto điền, theo dõi `beforeunload`.
- **Trang chi tiết** (`detail-page.tsx`, ~1.5k dòng): Hiển thị timeline, supplier metrics, payment & receiving sections. Chứa tiếp logic nhận hàng, tạo phiếu nhập, cập nhật tồn kho, ghi lịch sử, tạo return khi hủy. Dialog thanh toán hiện chỉ hiển thị toast, **không ghi nhận payment** (không gọi `addPayment`) nhưng vẫn gọi `syncAllPurchaseOrderStatuses` → trạng thái không đổi.
- **Utility**: `payment-utils.ts` chỉ thao tác mảng payment/receipt có sẵn trong client store, không gọi API nào.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Nhận xét |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `PurchaseOrder` type tương đối đầy đủ (status, payment/delivery, activityHistory) nhưng chưa có schema chung FE/BE, không enforce referential integrity (supplier/branch/employee/product). Form validation rời rạc, import/export chưa có validator. |
| UI/UX | ⚠️ Một phần | List có thống kê, bulk actions, mobile card. Form nhiều tiện ích (copy, auto receive, sticky footer) nhưng file quá dài, logic chồng chéo, không có autosave, không có stepper/tách nhỏ. Detail page phức tạp, code duplication giữa page và store. |
| Performance | ⚠️ Một phần | Tất cả dữ liệu giữ trong memory, Fuse search trên toàn bộ dataset, watchers trong form chạy nhiều setState. Bulk receive/bulk pay xử lý mảng lớn ngay trên UI. Không pagination server, không caching. |
| Database Ready | ❌ | Chưa có Prisma schema cho PurchaseOrder, PurchaseOrderLineItem, PurchaseOrderPayment, PurchaseOrderReturnSummary, PurchaseOrderActivity... Không có bảng linking InventoryReceipts/Payments. |
| API Ready | ❌ | Không có `/api/purchase-orders`. Các hành động (tạo đơn, nhập kho, thanh toán, hủy) gọi trực tiếp other stores. Webhook/payment integration chưa tồn tại. |
| Liên kết module | ⚠️ Thiếu | Purchase Orders tự động can thiệp Products, Cashbook, Inventory Receipts, Stock History, Receipts, Purchase Returns thông qua Zustand -> không có event hoặc hợp đồng backend, không bảo đảm nhất quán đa người dùng. |

## 3. Luồng nghiệp vụ đáng chú ý
1. **Đồng bộ phiếu nhập kho**: `runInventoryReceiptBackfill` chạy ngay khi store hydrate, dựa trên dữ liệu hiện có của Inventory Receipts + Products. Không kiểm tra lock/version → có thể ghi đè, khó debug. 
2. **Thanh toán**: `addPayment` thêm bản ghi ngay trong order store và suy ra trạng thái dựa trên `sumPaymentsForPurchaseOrder`. Bulk payment trên list page tự tạo phiếu chi trong `payments` store bằng logic cố định (tài khoản bank, category). Không có cơ chế rollback hoặc audit server.
3. **Nhập kho**: Trang list + detail + form đều có thể tạo phiếu nhập (`addInventoryReceipt`) rồi cập nhật tồn kho + stock history trực tiếp trong client. Không có permission check/tách lớp domain.
4. **Hủy đơn**: Nếu đã nhập/đã thanh toán, store tự tạo purchase return + phiếu thu (cash-in) để ghi nhận tiền NCC trả lại. Tất cả thực thi local, không kiểm tra duplication.
5. **Copy & nhận hàng ngay khi tạo**: Form cho phép "Tạo & nhập hàng" -> tạo order, phiếu nhập, cập nhật tồn kho, ghi history, tạo phiếu chi, cập nhật trạng thái, tất cả trong một click và hoàn toàn client-side.
6. **Payment dialog ở detail page**: UI cho phép nhập thông tin thanh toán nhưng không ghi dữ liệu (không gọi store). Người dùng tưởng đã thanh toán nhưng trạng thái không đổi -> rủi ro nghiệp vụ.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Nghiệp vụ mua hàng (tạo đơn, nhập kho, thanh toán, hoàn tiền, trả hàng) hoạt động 100% trên client `localStorage` (`persistKey 'hrm-purchase-orders'`). Không đồng bộ đa người dùng, dễ mất dữ liệu. | `features/purchase-orders/store.ts` |
| 🔴 Cao | Store thao tác trực tiếp các store khác (Inventory Receipts, Payments, Receipts, Cashbook, Products, Stock History). Không có backend transaction nên mọi thao tác stock/cash có thể lệch so với trạng thái thực. | `store.ts`, `page.tsx`, `form-page.tsx`, `detail-page.tsx` |
| 🔴 Cao | Dialog thanh toán trên trang chi tiết không tạo phiếu chi/receipt nào. Người dùng nghĩ đã xác nhận nhưng hệ thống không ghi nhận -> rủi ro kế toán. | `detail-page.tsx` (`handlePaymentConfirmationSubmit` chỉ toast, không gọi `addPayment`) |
| 🟠 Trung bình | Nhiều nơi tạo phiếu nhập/return/phiếu chi/hủy đơn bằng copy logic riêng (list page, detail page, store). Dễ sai lệch vì thiếu service chung và thiếu kiểm soát quyền. | `page.tsx`, `detail-page.tsx`, `store.ts` |
| 🟠 Trung bình | Bulk action "Thanh toán" tự động tạo phiếu chi cho tất cả đơn đã chọn bằng cách truy cập `usePaymentStore` trực tiếp và gán tài khoản ngân hàng mặc định → rủi ro tạo chứng từ sai/thiếu xác nhận. | `page.tsx` (hàm `confirmBulkPay`) |
| 🟠 Trung bình | Form tạo đơn chứa logic nhập kho tức thì + tạo phiếu chi ngay trong component → khó test, khó tái sử dụng, không đảm bảo atomicity khi chuyển sang backend. | `form-page.tsx` |
| 🟡 Thấp | Không có API tìm kiếm/order detail -> các module khác không thể truy cập đơn mua hàng khi triển khai server. | Toàn bộ module không có gọi fetch/backend |

## 5. Đề xuất nâng cấp
1. **Thiết kế dữ liệu & API (Tuần 1-2)**
   - Prisma schema cho `PurchaseOrder`, `PurchaseOrderLineItem`, `PurchaseOrderPayment`, `PurchaseOrderDelivery`, `PurchaseOrderActivity`, `PurchaseReturn`. Liên kết `InventoryReceipt`, `Payment`, `Receipt`, `StockLedger` bằng foreign key. 
   - REST/Route Handler `/api/purchase-orders` (list, filters, pagination, search, CRUD), `/api/purchase-orders/{id}/receive`, `/api/purchase-orders/{id}/payments`, `/api/purchase-orders/{id}/cancel`, `/api/purchase-orders/{id}/returns`.
2. **Tách service domain (Tuần 2-3)**
   - Viết service backend xử lý: tạo đơn (kèm validation dual ID), thay đổi trạng thái theo workflow, nhập kho (gọi Inventory Receipt service), thanh toán (gọi Cashbook/Payment service), hoàn/hủy.
   - Event bus hoặc queue cho các module phụ thuộc (Stock, Cashbook, Supplier, Purchase Returns) để đảm bảo nhất quán.
3. **Refactor FE state (Tuần 3)**
   - `usePurchaseOrderStore` chỉ giữ UI state (filters, selection). Data fetch/mutations qua React Query hoặc Zustand async actions gọi API. Bỏ toàn bộ logic tạo phiếu/stock/payment khỏi client.
   - Viết hooks riêng `usePurchaseOrderActions`, `usePurchaseOrderReceiving`, `usePurchaseOrderPayments` để call API + optimistic update.
4. **Tách nhỏ UI (Tuần 3-4)**
   - Chia form thành các section component + hook logic (supplier hook, items hook, fees hook, payment hook). Thêm validation schema (Zod) tái sử dụng FE/BE. Loại bỏ log `console` dư.
   - Trang detail dùng dữ liệu server (stats, history) và action button gọi API; payment dialog phải ghi nhận phiếu chi thực sự.
5. **Quy trình nhập kho & thanh toán (Tuần 4)**
   - Flow nhập kho: form/chi tiết gọi `/api/inventory-receipts` -> backend tạo phiếu + update stock ledger. FE chỉ hiển thị result.
   - Flow thanh toán: dialog gọi `/api/payments` (có approval). Cho phép attach chứng từ, upload. Kết quả trả về Payment ID -> refresh order status.
6. **Kiểm thử & giám sát**
   - Viết unit test cho service backend (status transitions, payment/delivery sync). Vitest cho hooks FE (calc subtotal, discount). Playwright cho flow tạo đơn → nhập kho → thanh toán → hoàn hàng.

## 6. Việc cần làm ngay
- Cảnh báo team không sử dụng dialog thanh toán tại trang chi tiết cho tới khi có API/ghi nhận thực sự.
- Đồng bộ requirements để backend dựng schema + endpoint Purchase Orders trước khi migrate khỏi localStorage.
- Inventory/Cashbook team rà lại các luồng auto (bulk pay, bulk receive, cancel) để xác định contract sự kiện mới.
- Sau khi hoàn tất tài liệu này, chuyển sang module ưu tiên tiếp theo: **Cashbook** (theo danh sách review). Nếu cần ưu tiên khác vui lòng xác nhận.
