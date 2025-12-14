# Rà soát module Orders (29/11/2025)

## 1. Kiến trúc & hiện trạng
- Store trung tâm `useOrderStore` (`features/orders/store.ts`, ~1.5k dòng) kế thừa `createCrudStore` với `persistKey: "hrm-orders"`. Tất cả CRUD, commit/uncommit tồn kho, tạo phiếu thu/chi, cập nhật debt khách, quản lý packaging, xử lý combo đều chạy trên client và lưu `localStorage`. Dữ liệu seed ở `features/orders/data.ts`.
- Trang danh sách (`features/orders/page.tsx`) dùng `ResponsiveDataTable` nhưng filter/search/pagination đều thực hiện client (Fuse). Column state lưu `localStorage`. `order-search-api.ts` giả lập API bằng cách lọc mảng rồi `setTimeout`.
- Form tạo/sửa (`features/orders/order-form-page.tsx`, ~1.2k dòng) chứa toàn bộ nghiệp vụ: chọn khách, sync địa chỉ, chọn sản phẩm, auto tạo product mới, áp giá theo Pricing Policy, tính phí dịch vụ, gọi cấu hình hãng vận chuyển (`shipping-partners-config.ts`, `GHTKService`). Không có validation schema chung; mọi logic hook trực tiếp vào hàng loạt store (products, customers, stock-history, settings, shipping, sales settings...).
- Trạng thái packaging/delivery lưu ngay trong bản ghi order (`packagings` array). Webhook GHTK chỉ được mô tả bằng type `GHTKWebhookPayload`; chưa có API thực sự nhận webhook.
- Khi hủy đơn `cancelOrder`, store sẽ hoàn ngược tồn kho combo/con, tạo phiếu chi hoàn tiền thông qua helper `createPaymentDocument`, xoá giao dịch công nợ khách – tất cả đều là thao tác client-side, không có backend hay transaction thực.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Nhận xét |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `Order` type khá đầy đủ (status, packaging, shipping, service fees, attachments) nhưng không có Prisma/schema backend, không enforce relation (customer/branch/employee). Order form không dùng Zod chung, import CSV cũng chỉ check thủ công. |
| UI/UX | ⚠️ Một phần | Data table có filter, mobile card, import/export; form cung cấp nhiều tiện ích (product search, service fees, shipping card) nhưng file quá dài, nhiều `useEffect` theo dõi state → khó bảo trì, không có autosave/stepper. Không có feedback khi gọi API thật vì chưa có API. |
| Performance | ⚠️ Một phần | Toàn bộ dataset giữ trong memory; store xử lý combo stock bằng cách lặp qua từng item trên client. Fuse search chạy cho mỗi render. Form watchers chạy liên tục (tính tổng, sync giá). Không có virtualization/log streaming. |
| Database Ready | ❌ | Chưa có Prisma schema cho Order, OrderLine, OrderPackaging, OrderPayment, OrderServiceFee, OrderShipmentLog... Không có bảng ledger để audit stock/finance. |
| API Ready | ❌ | Không có route `/api/orders`. `order-search-api.ts` chỉ giả lập. Shipping partner integration (GHTK/GHN/J&T) chưa có endpoint tạo đơn thực, webhook chưa implement. |
| Liên kết module | ⚠️ Thiếu | Store gọi trực tiếp các store khác (Products, Customers, Cashbook, Receipts, Sales Returns) nên luồng liên kết chỉ tồn tại trong trình duyệt. Không có contract hay event để modules khác (Warehouse, Cashbook, Warranty) theo dõi trên backend. |

## 3. Logic & liên kết đáng chú ý
1. **Kho & combo**: `processLineItemStock` mở combo thành sản phẩm con và gọi `commitStock/uncommit/dispatch/returnStockFromTransit` của Product store, nhưng tất cả chỉ là mutation client → không đảm bảo tính nhất quán.
2. **Tài chính**: `addPayment`/`cancelOrder` tạo phiếu thu/phiếu chi thông qua helper `createReceiptDocument`/`createPaymentDocument` nhưng đây cũng là store client. Không có transaction/công nợ thực trên server.
3. **Packaging & delivery**: `packagings` lưu kèm tracking, trạng thái partner, COD... `shipping-partners-config.ts` định nghĩa danh sách hỗ trợ, `GHTKService` được gọi từ form nhưng chưa có backend signing/hmac, token cũng chưa được bảo mật.
4. **Order form**: Cho phép thêm product mới ngay trong đơn (tạo tồn kho ban đầu, ghi stock history). Đồng thời tự áp chính sách giá, voucher, phí dịch vụ, shipping COD, config partner. Toàn bộ logic nằm trong component, khó tái sử dụng/viết test.
5. **Import/Export**: Import CSV map trực tiếp sang store, auto `asBusinessId('')` nếu thiếu mã – dễ sinh đơn trùng/không hợp lệ vì không kiểm tra trùng ID hay validate line items.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Toàn bộ nghiệp vụ đơn hàng (stock, công nợ, phiếu thu/chi, shipping) chạy trên client `localStorage` (`persistKey 'hrm-orders'`). Không thể dùng multi-user hay môi trường thật, dễ mất dữ liệu. | `features/orders/store.ts` |
| 🔴 Cao | Store khổng lồ (1.5k dòng) ôm toàn bộ business logic và gọi thẳng các store khác ⇒ không có backend transaction, không thể audit, dễ sai khi refresh trang. | `features/orders/store.ts` |
| 🔴 Cao | Stock & dòng tiền bị thao túng từ trình duyệt: `commitStock`, `createReceiptDocument`, `useCustomerStore.removeDebtTransaction`... ⇒ không có đảm bảo nhất quán với Products/Cashbook/Customers. | `store.ts` (các hàm `add`, `cancelOrder`, `addPayment`) |
| 🟠 Trung bình | Shipping integration/GHTK webhook chỉ là mô phỏng. Không có endpoint nhận webhook, token lưu ở client, rủi ro bảo mật & chậm đồng bộ. | `types.ts` (`GHTKWebhookPayload`), `order-form-page.tsx`, `shipping-partners-config.ts` |
| 🟠 Trung bình | Order form ~1.2k dòng với hàng chục `useEffect` và custom hook -> khó bảo trì, không có unit test, dễ bug khi thay đổi pricing/partner. | `features/orders/order-form-page.tsx` |
| 🟠 Trung bình | Import CSV không validate line items, không check khách/branch tồn tại server → dễ sinh đơn lỗi với `lineItems: []`, `grandTotal` lệch. | `page.tsx` (`importConfig`) |
| 🟡 Thấp | `order-search-api.ts` chỉ lọc mảng tại client; UI khác sử dụng API này sẽ không hoạt động khi chuyển sang backend nếu không thay đổi. | `features/orders/order-search-api.ts` |

## 5. Đề xuất nâng cấp
1. **Thiết kế backend (Tuần 1-2)**
   - Prisma schema cho `Order`, `OrderLineItem`, `OrderPayment`, `OrderPackaging`, `OrderServiceFee`, `OrderShipmentLog`, `OrderTag`. Thiết kế quan hệ với `Customer`, `Employee`, `Branch`, `Product`, `SalesReturn`, `Cashbook`.
   - Seed dữ liệu seed file vào DB; tạo migration đảm bảo dual ID (systemId/businessId).
2. **API & service layer (Tuần 2-3)**
   - Xây REST/Route Handler `/api/orders` (list/filter/pagination/search/import/export) + `/api/orders/{id}/packagings`, `/api/orders/{id}/payments`, `/api/orders/{id}/stock`. Tách service xử lý Combo stock, payments, customer debt trên server.
   - Triển khai webhooks cho GHTK/GHN… (endpoint riêng, xác thực token) và background job đồng bộ trạng thái.
3. **Tách logic client (Tuần 3)**
   - Giảm tải `useOrderStore`: chỉ giữ UI state (filters, selections). Data dùng React Query. Các thao tác (cancel, addPayment, packaging) gọi API -> optimistic update.
   - Viết hook chuyên biệt `useOrderActions` để gọi mutation; ghi event (audit log) server-side.
4. **Refactor Order Form (Tuần 3-4)**
   - Chia thành nhiều components/hooks: `useOrderLineItems`, `useOrderPricing`, `useShippingIntegration`. Dùng schema Zod/Valibot chung (shared giữa FE/BE). Bỏ khả năng tự tạo product trong order hoặc chuyển thành modal riêng với quyền rõ ràng.
   - Thêm chế độ autosave draft + validation server (customer/branch/price list).
5. **Stock & Finance integration (Tuần 4)**
   - Chuẩn hóa API commit/dispatch stock, ghi `StockLedger`. Khi tạo order -> tạo `Reservation`; khi xuất kho -> update ledger. Thanh toán/hủy -> tạo chứng từ trong Cashbook API, đồng bộ debt Customer.
   - Thiết lập event bus (Orders → Warehouse, Cashbook, Warranty) hoặc ít nhất webhook server-side.
6. **Testing & monitoring**
   - Vitest cho stock helper, payment helper, shipping integration stub. Playwright flow: tạo đơn, xuất kho, tạo phiếu thu, nhận webhook shipping, hủy đơn.

## 6. Việc cần làm ngay
- Ngưng nhập liệu thật trên module Orders; export JSON backup trước khi migrate.
- Hoàn thiện đặc tả Prisma + API cho Orders (bao gồm packaging & shipping) để nhóm backend bắt tay ngay sau khi Customers/Suppliers hoàn tất.
- Rà soát các module phụ thuộc (Products, Customers, Cashbook, Receipts, Sales Returns, Shipping Settings) để xác định interface event/API mới.
- Sau Orders, tiếp tục thứ tự ưu tiên #7: **Purchase-Orders** theo bảng trong `docs/chatgpt/feature-review-prompts.md`.
