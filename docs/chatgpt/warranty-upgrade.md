# Rà soát module Warranty (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Zustand + localStorage**: `features/warranty/store/index.ts` kế thừa `createCrudStore` với `persistKey: hrm-warranty-tickets`, seed dữ liệu từ `initial-data.ts`. Toàn bộ CRUD, workflow, tracking code, lịch sử, SLA, reminder đều thao tác trực tiếp trên state trình duyệt, không có API hay backend đảm bảo tính nhất quán/multi-user.
- **Store đa nhiệm**: cùng một store chịu trách nhiệm luôn việc commit/uncommit/dispatch/rollback tồn kho (`store/stock-management.ts`), record settlement (`utils/settlement-store.ts`), add history, gửi toast thông báo và kích hoạt “realtime” qua `localStorage`. Không có service layer hay giao dịch khi đụng tới kho, cashbook, đơn hàng.
- **Trang danh sách/chi tiết cồng kềnh**: `warranty-list-page.tsx` (~1k dòng) gom cả bảng, thẻ, bộ lọc, realtime polling; `warranty-detail-page.tsx` (~700 dòng) tải cùng lúc Orders/Payments/Receipts/Product store, quản lý 5+ dialog (return, cancel, reopen, reminder, template) và gọi trực tiếp các hook cập nhật kho – khó tách nhỏ, khó test.
- **Public tracking/“API” giả lập**: `public-warranty-api.ts` đơn giản lọc dữ liệu từ các store client (warranty, payments, receipts, orders, branches) rồi trả ra cho `warranty-tracking-page.tsx`. Không có xác thực, rate limit hay masking dữ liệu nhạy cảm; khách hàng chỉ cần đoán được `publicTrackingCode` là đọc được lịch sử nội bộ.
- **SLA/Reminder/Realtimes chạy cục bộ**: `warranty-sla-utils.ts`, `hooks/use-warranty-reminders.ts`, `use-realtime-updates.ts` lưu cấu hình trong `localStorage` và dùng `setInterval` ở phía client để “giám sát” → mỗi tab có thể cho kết quả khác nhau, không đảm bảo tuân thủ SLA thật.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Ghi chú |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `features/warranty/types.ts` giàu type nhưng không có schema Zod/Prisma; form & import chỉ kiểm tra thủ công. |
| UI/UX | ⚠️ Một phần | UI giàu card, timeline, tracking công khai; tuy nhiên file quá lớn, thiếu loading/error boundary thực, public page phụ thuộc store nội bộ nên refresh mất dữ liệu. |
| Performance | ⚠️ Một phần | Có virtual scroll nhưng mọi filter/search/sync đều client-side; detail page import toàn bộ store → bundle lớn, reminder chạy interval mỗi tab. |
| Database Ready | ❌ | Chưa có bảng `warranty_tickets`, `warranty_products`, `warranty_history`, `warranty_settlements`, `warranty_tracking`. Inventory/payment chỉ lưu ID trong metadata. |
| API Ready | ❌ | Không có route `/api/warranty`. “Public API” thực ra là function đọc Zustand; không có endpoint để tạo/assign/settle hay webhook trả hàng. |
| Liên kết module | ⚠️ Thiếu | Liên kết với Orders/Products/Cashbook/Cashbook chỉ tồn tại bằng cách import trực tiếp `useOrderStore`, `useProductStore`, `usePaymentStore`, `useReceiptStore`. Không có transaction, audit, event bus. |

## 3. Logic & liên kết đáng chú ý
1. **Quản lý kho hoàn toàn ở FE** (`store/stock-management.ts`): Khi tạo phiếu sẽ `commitWarrantyStock`, khi hoàn tất thì `deductWarrantyStock`, khi huỷ thì `rollbackWarrantyStock`. Tất cả đều gọi thẳng `useProductStore` và `useStockHistoryStore` → không có khóa cạnh tranh hay ghi nhận ledger server-side.
2. **Settlement & Cashbook** (`utils/settlement-store.ts`, `hooks/use-warranty-settlement.ts`): Các phương thức bù trừ chỉ là snapshot lưu trong ticket; việc tạo phiếu thu/chi thật vẫn phụ thuộc người dùng mở Payment/Receipt store và thêm tay. `handleCompleteTicket` chỉ đọc state của `usePaymentStore`/`useReceiptStore` để kiểm tra còn thiếu chứ không thể đảm bảo thanh toán thực sự tồn tại.
3. **Public tracking phơi bày dữ liệu** (`public-warranty-api.ts`, `warranty-tracking-page.tsx`): Endpoint giả lập trả về toàn bộ lịch sử thao tác, danh sách sản phẩm, phương thức bù trừ, thậm chí đơn hàng & phiếu thu/chi liên quan mà không ẩn thông tin nội bộ; khách có thể comment/tự xem mọi cập nhật nếu biết mã.
4. **Realtime/SLA/Reminder không tin cậy** (`use-realtime-updates.ts`, `warranty-sla-utils.ts`, `hooks/use-warranty-reminders.ts`): mọi cảnh báo quá hạn, nhắc việc, đồng bộ dữ liệu dựa vào `localStorage` và `toast`, không push được tới người dùng khác, không ghi log/audit.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Dữ liệu bảo hành, lịch sử, sản phẩm, settlement đều nằm trong Zustand/`localStorage`; refresh trình duyệt là mất, không thể chạy đa người dùng hay triển khai thật. | `features/warranty/store/base-store.ts`, `store/index.ts` |
| 🔴 Cao | Toàn bộ thao tác kho bảo hành chạy ngay trên FE: `commitWarrantyStock`, `deductWarrantyStock`, `rollbackWarrantyStock` gọi thẳng Product store, không lock, không transaction → dễ lệch tồn, không audit. | `features/warranty/store/stock-management.ts` |
| 🔴 Cao | Public tracking/“API” cho khách đọc toàn bộ ticket + phiếu thu/chi liên quan, chỉ cần đoán đúng `publicTrackingCode`, không có auth hay rate limit. | `features/warranty/public-warranty-api.ts`, `warranty-tracking-page.tsx` |
| 🟠 Trung bình | Settlement chỉ là snapshot trong ticket, không ràng buộc với Cashbook; `handleCompleteTicket` dựa vào state memory nên có thể “kết thúc” dù phiếu thu/chi chưa tạo hoặc đã bị xoá. | `features/warranty/hooks/use-warranty-actions.ts`, `utils/settlement-store.ts` |
| 🟠 Trung bình | SLA/reminder/realtime chỉ chạy tại client bằng `localStorage` và `setInterval`, không có job/server nên không thể đáp ứng SLA 2h/24h/48h thực tế. | `features/warranty/warranty-sla-utils.ts`, `hooks/use-warranty-reminders.ts`, `use-realtime-updates.ts` |
| 🟡 Thấp | Test hiện có chỉ là guard đảm bảo store có method/label → không phủ logic workflow, stock hay tracking. | `features/warranty/__tests__/warranty-store-guards.test.ts` |

## 5. Đề xuất nâng cấp
1. **Thiết kế domain & Prisma**: Tạo schema cho `warranty_tickets`, `warranty_products`, `warranty_history`, `warranty_comments`, `warranty_settlements`, `warranty_tracking_codes`, `warranty_attachment`. Bổ sung index theo `order_system_id`, `customer_system_id`, `public_tracking_code`, `status`. Chuẩn hoá dual-ID và audit fields.
2. **Service/API layer**: Xây Route Handler `/api/warranty` với CRUD + filter, `/api/warranty/:id/history`, `/api/warranty/:id/settlement`, `/api/public/warranty/:trackingCode`. Toàn bộ thao tác (assign, upload hình, add product, đổi trạng thái, kết thúc) phải gọi service phía server (Prisma + transaction) và emit event cho kho/cashbook.
3. **Tích hợp kho chính thống**: Di chuyển logic `commit/dispatch/rollback` vào Warehouse service: khi pending → tạo reservation, khi completed → phát lệnh xuất, khi huỷ → release stock. Ghi `stock_ledgers` thay vì sửa trực tiếp Product store.
4. **Settlement chuẩn hoá Cashbook**: Thiết kế `WarrantySettlementService` gọi Cashbook API để tạo phiếu thu/chi, debt transaction, voucher. Khi phiếu bị huỷ/mở lại phải rollback qua API thay vì sửa state trong timeline.
5. **Bảo mật public portal**: `public-warranty-api.ts` cần chuyển thành API server-side, chỉ trả dữ liệu tối thiểu (ẩn thông tin nội bộ, nhân viên, ghi chú). Yêu cầu OTP/email xác thực hoặc token theo đơn hàng, triển khai rate limit + captcha nếu mở công khai.
6. **Nền tảng SLA & notification**: Di chuyển SLA/Reminder sang job worker (BullMQ/Temporal) chạy trên server, lưu cấu hình trong DB, gửi thông báo qua Notification Center + email/SMS thật. FE chỉ hiển thị trạng thái, không tự tính.
7. **Tách nhỏ UI + React Query**: Giữ `useWarrantyStore` làm UI store (filter, selections), còn dữ liệu dùng React Query gọi API. Chia nhỏ `warranty-detail-page.tsx` thành các section component với props rõ ràng, thêm skeleton/error boundary.
8. **Test & quan sát**: Viết unit test cho service (workflow transition, settlement, stock), contract test cho public API, e2e cho các luồng chính (tạo phiếu → xử lý → trả hàng → kết thúc). Log event quan trọng (status change, settlement) để Dashboard SLA sử dụng.

## 6. Việc cần làm ngay
- **Đóng module khỏi người dùng thật**: Backup `localStorage` (`hrm-warranty-tickets`, `warranty-version`, `warranty-notification-settings`) rồi khoá menu Warranty cho tới khi có backend.
- **Chốt schema + contract**: Song song với Complaints, cần đặc tả Prisma + API cho Warranty (bao gồm settlement & inventory event) để backend bắt đầu dựng, vì module này xếp #13 nhưng phụ thuộc mạnh vào Orders/Products/Cashbook.
- **Rà soát phụ thuộc**: Làm rõ interface với Orders (link đơn bảo hành), Products (reservation/dispatch), Cashbook (phiếu thu/chi), Notification (SLA) để tránh lặp lại pattern “import store”.
- **Kế hoạch migration**: Xác định cách import dữ liệu local cũ (nếu cần) vào DB mới, bao gồm ảnh, lịch sử, tracking code; chuẩn bị script chuyển timeline → bảng history.
