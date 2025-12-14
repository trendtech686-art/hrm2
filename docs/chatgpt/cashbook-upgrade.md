# Rà soát module Cashbook (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Tài khoản quỹ**: `useCashbookStore` (`features/cashbook/store.ts`) tạo từ `zustand/persist` với `persistKey: "hrm-cashbook-storage"`. Dữ liệu tài khoản khởi tạo ở `features/cashbook/data.ts` (3 tài khoản mẫu). Tăng ID hệ thống/Business ID hoàn toàn client-side bằng helper `findNextAvailableBusinessId`. Không có backend, không đồng bộ đa user.
- **Nguồn giao dịch**: Trang sổ quỹ không có store riêng mà lấy dữ liệu trực tiếp từ `useReceiptStore` + `usePaymentStore`. Hai store này cũng là Zustand + localStorage. `CashbookPage` hợp nhất chúng thành danh sách transaction (receipt/payment) rồi tự tính số dư đầu kỳ, tổng thu/chi, số dư cuối.
- **Sổ quỹ UI** (`features/cashbook/page.tsx`): DataTable client với Fuse search, filter branch/account, tính running balance trong bộ nhớ mỗi lần render. Toàn bộ thao tác (hủy phiếu, bulk cancel, xuất excel, nhập kho) gọi thẳng các store `useReceiptStore/usePaymentStore`. Không có API call hay việc gửi request server.
- **Báo cáo sổ quỹ** (`features/cashbook/reports-page.tsx`): Dashboard thu/chi dùng `recharts`, tính toán top khách hàng, phân bổ loại phiếu, xu hướng ngày… tất cả dựa trên dữ liệu hiện có trên client. Không có caching, không có pagination hoặc streaming.
- **Khả năng thao tác**: Người dùng có thể hủy phiếu ngay từ Cashbook (bulk) – code gọi `useReceiptStore.getState().cancel` hoặc `usePaymentStore.getState().cancel` trực tiếp. Không có logging/audit, không check quyền.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Nhận xét |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `CashAccount` type có nhiều field (branch, min/max balance, managedBy) nhưng không có schema backend, không enforce quan hệ với Branch/Employee. Không có validator cho thao tác thêm/sửa tài khoản hoặc khi đọc dữ liệu giao dịch. |
| UI/UX | ⚠️ Một phần | Trang sổ quỹ có bảng responsive, mobile card, thống kê đầu trang. Báo cáo có nhiều chart. Tuy nhiên hành động quan trọng (hủy phiếu, xem sổ) thiếu confirm nâng cao, không có phân quyền, không hiển thị audit log. |
| Performance | ⚠️ Một phần | Tất cả dữ liệu (receipts/payments) load vào memory, Fuse search trên toàn bộ dataset, running balance tính lại mỗi render. Recharts render toàn bộ điểm -> nhanh chóng nghẽn nếu >5k giao dịch. Không có pagination server hoặc lazy fetch. |
| Database Ready | ❌ | Chưa có bảng `cash_accounts`, `cash_transactions`, `cash_ledger`, `cashbook_audit`. Không có sequence ID chung, không lưu log hủy/chỉnh sửa. |
| API Ready | ❌ | Không có `/api/cashbook`, `/api/receipts`, `/api/payments`. Frontend chỉ đọc/ghi Zustand → không thể triển khai multi-user hoặc đồng bộ với ERP/bank. |
| Liên kết module | ⚠️ Thiếu | Cashbook phụ thuộc vào Receipts/Payments store, và các module khác (Orders, Purchase Orders, Customers) tự ý ghi phiếu bằng cách gọi store. Không có event bus hay transaction đảm bảo double-entry. |

## 3. Luồng & liên kết đáng chú ý
1. **Tính số dư**: `CashbookPage` tính số dư đầu kỳ từ `initialBalance` của tài khoản + các transaction trước khoảng lọc → chạy mỗi render. Không ghi kết quả, không khoá kỳ.
2. **Huỷ phiếu**: Từ trang sổ quỹ có thể hủy 1 hoặc nhiều phiếu. Logic hủy chỉ set `status = 'cancelled'` trong store Receipts/Payments, không tạo chứng từ đảo/không ghi log.
3. **Báo cáo**: `CashbookReportsPage` tổng hợp thu/chi, top khách hàng, pie chart theo `paymentReceiptTypeName`… hoàn toàn client. Không hỗ trợ export server-side, không shield khỏi dữ liệu lớn.
4. **Tài khoản quỹ**: `useCashbookStore` giữ danh sách account trong localStorage, không có API để cập nhật, không validate unique, không sync branch/employee.
5. **Phụ thuộc chéo**: Các module như Orders/Purchase Orders khi tạo/hủy có thể tự `addPayment`/`addReceipt` (client). Không có cơ chế reconcile với sổ quỹ trung tâm.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Sổ quỹ và toàn bộ phiếu thu/chi chỉ lưu trong localStorage, không có backend → mất dữ liệu khi đổi máy, không hỗ trợ nhiều người dùng, không đáp ứng yêu cầu kế toán. | `features/cashbook/store.ts`, `features/cashbook/page.tsx` (đọc `useReceiptStore`, `usePaymentStore`) |
| 🔴 Cao | Người dùng có thể hủy phiếu thu/chi trực tiếp trên FE mà không cần quyền hay audit; thao tác chỉ đổi trạng thái trong bộ nhớ. Rủi ro gian lận và không thể truy vết. | `CashbookPage` (`confirmCancel`, `confirmBulkCancel`) |
| 🔴 Cao | Không có general ledger/double-entry: running balance được tính tạm thời mỗi lần render từ dữ liệu rò rỉ → dễ sai lệch, không khóa kỳ, không reconcile với bank. | `CashbookPage` (khối `useMemo` tính balance) |
| 🟠 Trung bình | Báo cáo thu chi lấy toàn bộ dữ liệu lên client và render chart; dataset lớn sẽ làm app đơ, không có phân trang/aggregation server. | `features/cashbook/reports-page.tsx` |
| 🟠 Trung bình | Không có API đồng bộ tài khoản quỹ với ngân hàng hoặc module khác. `CashAccount` metadata (min/max, managedBy) không được sử dụng → không cảnh báo số dư tối thiểu/tối đa. | `features/cashbook/store.ts`, `page.tsx` (không dùng min/max) |
| 🟡 Thấp | ID sinh client (BUSINESS_ID_PREFIX) không đồng bộ với các module khác → dễ trùng/khó migrate sang DB. | `useCashbookStore` (`getNextSystemId`, `ensureBusinessId`) |

## 5. Đề xuất nâng cấp
1. **Thiết kế backend (Tuần 1)**
   - Prisma schema cho `cash_accounts`, `cash_transactions`, `cash_ledger_entries`, `cashbook_audit_logs`. Ràng buộc foreign key tới `branches`, `employees`, `original_documents` (orders, purchase orders...).
   - Migration chuyển dữ liệu seed và thêm trường audit (createdBy, lockedAt, closingBalance).
2. **API & service layer (Tuần 1-2)**
   - REST/Route Handler: `GET/POST /api/cash-accounts`, `GET/POST /api/cash-transactions`, `POST /api/cash-transactions/{id}/cancel`, `POST /api/cashbook/close-period`. Service tính running balance server-side, lưu ledger, xuất excel server.
   - Webhook hoặc job để reconcile với bank (tối thiểu import sao kê CSV).
3. **Refactor FE state (Tuần 2-3)**
   - Thay `useCashbookStore` bằng React Query + cache server. Store chỉ giữ UI state (filters, selection).
   - Các module khác (Orders, Purchase Orders, Receipts, Payments) gọi API `POST /cash-transactions` thay vì đụng trực tiếp store.
4. **Quyền & audit (Tuần 3)**
   - Thêm phân quyền (view/create/cancel/export). Hủy phiếu phải ghi audit log + lý do, có thể yêu cầu phê duyệt.
   - Hiển thị lịch sử thao tác/hyperlink tới `cashbook_audit` trên UI detail phiếu.
5. **Báo cáo & hiệu năng (Tuần 3-4)**
   - Các chart/báo cáo gọi API aggregate (group by date, type) thay vì tính trên client. Hỗ trợ pagination/infinite scroll cho bảng. 
   - Áp dụng caching theo khoảng thời gian, cho phép export server-side (CSV/Excel/PDF) với chữ ký số.
6. **Cảnh báo số dư & workflow**
   - Sử dụng `minBalance/maxBalance` để bật alert, block giao dịch vượt hạn mức.
   - Cho phép khóa kỳ (closing). Sau khi khóa, các phiếu thuộc kỳ đó không được chỉnh sửa trừ khi mở khóa bằng quyền cao.

## 6. Việc cần làm ngay
- Thông báo đội vận hành không dựa vào Cashbook hiện tại cho dữ liệu thật; xuất JSON backup nếu đã có dữ liệu demo.
- Xác nhận yêu cầu nghiệp vụ (double-entry, integration với Cashbook/Bán hàng) để backend thiết kế schema trước sprint kế tiếp.
- Khoanh vùng module đang tự thêm phiếu (Orders, Purchase Orders, Customers...) để chuẩn bị chuyển sang API chung khi Cashbook backend hoàn thành.
- Ưu tiên tiếp theo theo danh sách review: **Payments** (kiểm tra module phiếu chi). Nếu cần ưu tiên khác, báo em để điều chỉnh.
