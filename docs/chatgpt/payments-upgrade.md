# Rà soát module Payments (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Store**: `usePaymentStore` (`features/payments/store.ts`) sử dụng `zustand/persist` lưu vào `localStorage` (`payment-storage`). Dữ liệu seed lấy từ `features/payments/data.ts`. Store giữ luôn counters ID (`businessIdCounter`, `systemIdCounter`) trong memory, sinh `systemId` prefix `PAYMENT`, `businessId` `PC`. Toàn bộ nghiệp vụ (tạo, cập nhật, cancel, activityHistory) thực hiện client-side.
- **Metadata backfill**: Khi hydrate, store chạy `backfillPaymentMetadata` để đồng bộ `recipientType`, `paymentMethod`, `account`, `paymentType` bằng cách gọi helper `pickTargetGroup`, `pickPaymentMethod`, `pickAccount`, `pickPaymentType`. Loại mapping này cũng chạy mỗi lần add/update. Không có backend validate nên nếu config thay đổi, dữ liệu cũ không cập nhật.
- **Tính liên kết**: Payment có thể link `purchaseOrderSystemId`, `purchaseOrderId`, `customer`, `warranty`, `complaint`, `order`... nhưng logic `reconcileLinkedDocuments` chỉ đoán dựa trên prefix ID, không kiểm tra tồn tại thực sự. Không có API ghi nhận ledger hay debt.
- **Trang danh sách** (`features/payments/page.tsx`): đọc toàn bộ `payments` từ store, hiển thị table responsive, mobile card. Filter (branch/status/type/customer/date) đều client. Running balance tính bằng cách hợp nhất receipts + payments + account initial balance trên FE mỗi lần render. Cung cấp nút hủy phiếu đơn/bulk, export CSV, import stub.
- **Form** (`form-page.tsx` + `payment-form.tsx`): Form thuần React state, submit gọi `add/update` trực tiếp. Không có validation schema, không call API. `createdBy` set bằng current employee local.
- **Detail page**: render data từ store, cho phép bấm "Hủy phiếu chi" nhưng chưa implement confirm/tác động (chỉ log TODO). Activity history chỉ cập nhật khi cancel qua store.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Nhận xét |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | Type `Payment` rõ ràng (status, category, liên kết). Tuy nhiên không có schema backend hay validation form (Zod). Hệ thống mapping target group/method/account dựa trên client helper – dễ sai khi config thay đổi hoặc user nhập ID tùy ý. |
| UI/UX | ⚠️ Một phần | List + filters + mobile card, form có layout rõ. Nhưng detail page chưa hoàn chỉnh (nút hủy chưa hoạt động). Không có phân quyền hay approval, không có attachments/hóa đơn. |
| Performance | ⚠️ Một phần | Toàn bộ phiếu + phiếu thu load vào memory. Running balance, Fuse search, filter tính mỗi render; dataset lớn sẽ chậm. Không có pagination server, export client. |
| Database Ready | ❌ | Chưa có bảng `payments`, `payment_types`, `cash_ledger`, `payment_activity`. ID quản lý client, không sequence. Không có quan hệ FK tới Orders/Purchase Orders/Cashbook. |
| API Ready | ❌ | Không có `/api/payments`. Form/add/remove/cancel đều thao tác local. Các module khác (Orders, Purchase Orders) gọi store trực tiếp → không thể đồng bộ backend. |
| Liên kết module | ⚠️ Thiếu | Payment store dùng `pickAccount/pickPaymentMethod` (settings). Nhưng Orders/PO chèn phiếu chi bằng cách gọi `usePaymentStore.getState().add` (client). Không event/log server. Cashbook page đọc Payment store để tính quỹ, nên toàn bộ tài chính phụ thuộc local.

## 3. Luồng & hành vi đáng chú ý
1. **Tạo phiếu**: `add` sinh ID tại client, set `createdAt = now`, status luôn `completed`. Không check số dư tài khoản hay min/max balance.
2. **Cancel**: `cancel(systemId, reason)` chỉ đổi status thành `cancelled`, thêm history entry. Không tạo chứng từ đảo, không update Cashbook hay debt, không log server.
3. **Running balance**: Payments page tự tính `runningBalance` dựa trên receipts + payments + initialBalance -> logic phức tạp nhưng vẫn chỉ ở FE, không ghi ledger.
4. **Liên kết Purchase Order**: Bulk pay từ `purchase-orders/page.tsx` gọi `usePaymentStore.getState().add`, set `purchaseOrderSystemId`, `originalDocumentId`. Store cố suy luận prefix `PURCHASE`/`PO` để fill id/system id. Không verify.
5. **Import/Export**: DataTable import/export config nhưng import chưa định nghĩa mapping/validator, export chỉ dump state.
6. **Auth & audit**: `getCurrentUserSystemId` lấy employee hiện tại để ghi history khi cancel. Không guard khi user chưa đăng nhập (falls back SYSTEM). Không log IP/permission.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Phiếu chi, số dư quỹ và mọi thao tác cash-out chạy hoàn toàn trên localStorage. Không backend, không transaction, dễ mất dữ liệu và không dùng được trong môi trường thực. | `usePaymentStore` (persist -> localStorage), `PaymentsPage` |
| 🔴 Cao | Module khác (Orders/PO) có thể tự tạo/hủy phiếu chi bằng cách gọi store ⇒ không có kiểm soát, không audit server, không kiểm tra quyền/số dư. | `purchase-orders/page.tsx` (`confirmBulkPay`), `form-page.tsx` (create & pay) |
| 🔴 Cao | Hủy phiếu không yêu cầu xác nhận nghiệp vụ, chỉ set status, không tạo chứng từ đảo/không cập nhật nợ → rủi ro gian lận. | `usePaymentStore.cancel`, `PaymentsPage` confirm cancel |
| 🟠 Trung bình | `reconcileLinkedDocuments` suy luận PO ID bằng string prefix, có thể map nhầm, gây sai liên kết khi ID người dùng tùy chỉnh. | `store.ts` (`reconcileLinkedDocuments`) |
| 🟠 Trung bình | Running balance tính trên FE kết hợp receipts/payments -> khi data lớn rất chậm, và không phản ánh ledger thực (vì user có thể sửa store). | `payments/page.tsx` (khối `useMemo` running balance) |
| 🟡 Thấp | Detail page có nút hủy nhưng chưa thực thi, dễ gây nhầm lẫn. | `detail-page.tsx` (TODO) |

## 5. Đề xuất nâng cấp
1. **Backend & schema (Tuần 1-2)**
   - Thiết lập bảng `payments`, `payment_types`, `cash_transactions`, `payment_activity`. Sử dụng sequence/UUID server. Ràng buộc với `cash_accounts`, `branches`, `orders`, `purchase_orders`, `employees`.
   - Endpoint: `GET/POST /api/payments`, `PATCH /api/payments/{id}`, `POST /api/payments/{id}/cancel`, `POST /api/payments/import`. Tính ledger & running balance server-side.
2. **Service & permission (Tuần 2)**
   - Business service kiểm tra quyền, số dư quỹ, scenario approval (ví dụ phiếu > 50m cần duyệt). Khi cancel phải ghi audit + chứng từ đảo.
   - Module Orders/PO gọi API (hoặc queue) để tạo phiếu chi, không gọi store.
3. **Front-end refactor (Tuần 3)**
   - Thay Zustand data bằng React Query + API. Store chỉ giữ filter/pagination state.
   - Payment form sử dụng schema Zod dùng chung backend. Validate sum, enforce recipient group.
4. **Cashbook integration (Tuần 3-4)**
   - Running balance hiển thị từ API `/cashbook/balances`. Khóa kỳ (closing) và ngăn sửa phiếu thuộc kỳ đã khóa.
5. **Audit & attachments**
   - Ghi ActivityHistory server (user/time/reason). Cho phép upload hóa đơn/chứng từ.
   - Thêm confirm dialog/hộp nhập lý do khi hủy, log ID phiếu đảo nếu có.
6. **Import/Export nâng cao**
   - Import CSV/Excel qua backend, validate mapping, preview trước khi commit. Export server-side (có chữ ký số nếu cần).

## 6. Việc cần làm ngay
- Cảnh báo team không dùng Payments hiện tại cho dữ liệu thật; backup JSON nếu đã nhập demo.
- Lập kế hoạch backend hóa Payments + Cashbook chung (đã note ở tài liệu Cashbook). Sắp xếp sprint để dựng API trước khi chuyển Orders/PO sang backend.
- Triển khai confirm dialog & disable nút hủy trên detail page cho tới khi có API nhằm tránh user hiểu sai.
- Tiếp tục theo thứ tự ưu tiên: sau Payments chuyển sang module **Receipts** (phiếu thu). Nếu cần thay đổi ưu tiên, báo em để điều chỉnh.
