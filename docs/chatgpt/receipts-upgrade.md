# Rà soát module Receipts (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Store**: `useReceiptStore` (`features/receipts/store.ts`) xây trên Zustand + `persist` với key `receipt-storage`. Dữ liệu seed nằm ở `features/receipts/data.ts`. Store nắm luôn counter sinh `systemId` (prefix `RECEIPT`) và `businessId` (prefix `PT`). Mọi thao tác (add, update, cancel, activityHistory) đều chạy trên client/localStorage, không gọi API.
- **Metadata backfill**: Khi hydrate, store chạy `backfillReceiptMetadata` để khớp `payerType`, `paymentMethod`, `cashAccount`, `receiptType` thông qua helper `pickTargetGroup`, `pickPaymentMethod`, `pickAccount`, `pickReceiptType`. Việc chuẩn hóa này chỉ diễn ra trên FE, không có backend để xác nhận.
- **Trang danh sách** (`features/receipts/page.tsx`): Đọc toàn bộ receipts từ store, dùng ResponsiveDataTable + Fuse search + filter (branch/status/type/customer/date) toàn client. Running balance được tính bằng cách cộng dồn số tiền sau khi sort. Cho phép hủy phiếu đơn/bulk bằng cách gọi trực tiếp `useReceiptStore.getState().cancel`. Không có pagination server, không integrate Cashbook/GL.
- **Form** (`receipt-form.tsx` + `form-page.tsx`): Form React Hook Form thuần client, submit gọi `add/update` trực tiếp. Không có validation schema chung, không kiểm tra trùng phiếu, không call backend. `createdBy` lấy từ context auth (nếu không có thì fallback `SYSTEM`).
- **Chi tiết** (`detail-page.tsx`): Render dữ liệu từ store, hiển thị badge trạng thái, link back. Nút hủy treo TODO (chưa thực hiện). Activity history chỉ xuất hiện nếu store update (ví dụ khi cancel). Không có audit log server hay event.
- **Liên kết module**: Receipt type cho phép `originalDocumentId`, `purchaseOrderSystemId`, `linkedOrderSystemId`… nhưng không enforce quan hệ – module khác (Orders, Purchase Orders, Cashbook) tự tạo phiếu thu bằng cách gọi store. Receipts cũng được Cashbook page đọc trực tiếp để tính số dư quỹ.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Nhận xét |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | Type `Receipt` khá đầy đủ (status, category, liên kết). Nhưng không có schema/backend, không validation form. Metadata mapping dựa trên client helper -> dễ sai khi cấu hình đổi. |
| UI/UX | ⚠️ Một phần | Danh sách có filter, mobile card; form bố cục ổn. Tuy nhiên detail page nút hủy chưa hoạt động, không có phân quyền hay log. Không hỗ trợ attachments, approval. |
| Performance | ⚠️ Một phần | Tất cả dữ liệu load vào memory, running balance tính mỗi render, Fuse search client -> dataset lớn sẽ chậm. Không pagination server, export client. |
| Database Ready | ❌ | Chưa có bảng `receipts`, `receipt_types`, `cash_ledger`, `receipt_activity`. ID quản lý client, không sequence. Không quan hệ FK với Orders/Purchase Orders/Cashbook. |
| API Ready | ❌ | Không có `/api/receipts`. Các hành động (tạo/hủy/import) hoàn toàn local -> không thể chạy multi-user/production. |
| Liên kết module | ⚠️ Thiếu | Receipts liên quan Cashbook/Orders/Customers nhưng chỉ thông qua store. Module khác tự ghi phiếu thu -> không transaction, không audit.

## 3. Luồng nghiệp vụ đáng chú ý
1. **Tạo phiếu**: `add` sinh ID client, set `status` mặc định `completed`. Không check giới hạn tiền, không verify `payerSystemId`. `customerName/SystemId` auto copy từ payer.
2. **Hủy phiếu**: `cancel(systemId, reason)` chỉ đổi trạng thái sang `cancelled` và thêm history entry, không tạo chứng từ đảo, không ảnh hưởng debt hay Cashbook backend.
3. **Running balance**: Trang Receipts tính số dư bằng cách sort theo ngày rồi cộng dồn. Không sử dụng account initial balance, không cross-check Cashbook.
4. **Liên kết**: `originalDocumentId` chỉ lưu business ID (Orders, Complaints...). Không có logic `reconcileLinkedDocuments` nên nếu user nhập `PO0001` cũng không set `purchaseOrderSystemId`. Module khác (Orders/Sales) có thể chèn phiếu thu (ví dụ auto thu COD) bằng store -> rủi ro inconsistent.
5. **Import/Export**: DataTable export client; import dialog chưa có logic (placeholder).
6. **Auth/Audit**: `getCurrentUserSystemId` lấy employee để ghi history, nhưng nếu user chưa đăng nhập -> SYSTEM. Không log IP, không require approval khi hủy.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Phiếu thu, công nợ và dòng tiền vào hoàn toàn lưu localStorage → mất dữ liệu, không dùng được multi-user, không đạt chuẩn kế toán. | `useReceiptStore` (persist localStorage), `ReceiptsPage` |
| 🔴 Cao | Các module khác có thể tự tạo/hủy phiếu thu thông qua store ⇒ không kiểm soát quyền, không transaction, không audit. | `useReceiptStore` exposed globally; Cashbook/Orders/PO sử dụng trực tiếp |
| 🔴 Cao | Hủy phiếu chỉ set status, không sinh chứng từ đảo, không cập nhật sổ quỹ/debt, không require lý do/duyệt → dễ gian lận. | `store.ts` (`cancel`) + `ReceiptsPage` confirm |
| 🟠 Trung bình | Detail page có nút hủy chưa implement -> người dùng tưởng có thể hủy tại đây nhưng thực tế không chạy, gây nhầm lẫn. | `detail-page.tsx` (TODO comment) |
| 🟠 Trung bình | Running balance tính FE không dựa trên account initial balance, không phân chi nhánh -> số liệu không chính xác so với Cashbook. | `ReceiptsPage` (dataWithRunningBalance) |
| 🟡 Thấp | Metadata mapping (`pickAccount/pickReceiptType`) chạy mỗi lần hydrate; nếu config thay đổi hoặc helper trả về null -> dữ liệu không nhất quán. | `store.ts` (`ensureReceiptMetadata`) |

## 5. Đề xuất nâng cấp
1. **Backend hóa (Tuần 1-2)**
   - Thiết kế Prisma schema cho `receipts`, `receipt_types`, `cash_transactions`, `receipt_activity`. Ràng buộc `cash_accounts`, `branches`, `customers`, `orders`.
   - Xây APIs `GET/POST /api/receipts`, `PATCH /api/receipts/{id}`, `POST /api/receipts/{id}/cancel`, `POST /api/receipts/import`. Tính ledger/running balance phía server.
2. **Service & permission (Tuần 2)**
   - Service backend kiểm tra quyền, lock kỳ, enforce double-entry. Hủy phiếu yêu cầu lý do, ghi audit log và (nếu cần) tạo phiếu chi đối ứng.
   - Modules khác (Orders, Complaints, Purchase Orders) gọi API/event bus thay vì đụng trực tiếp store.
3. **FE refactor (Tuần 3)**
   - Thay Zustand data bằng React Query + API. Store chỉ giữ filters/pagination state.
   - Receipt form dùng schema Zod/Valibot chia sẻ backend. Validation: unique ID, amount >0, payer/branch/account phải hợp lệ.
4. **Cashbook integration (Tuần 3-4)**
   - Running balance hiển thị từ API `/cashbook/balances`. Bổ sung view ledger, khoá kỳ.
5. **Audit & UX**
   - Hoàn thiện nút hủy trên detail page (dialog lý do, call API). Thêm ActivityHistory server.
   - Hỗ trợ attachments (ảnh hóa đơn, chứng từ). Cho phép export server (PDF/Excel) kèm chữ ký số.
6. **Import/Export**
   - Import CSV qua backend với preview + validation. Export server-side, hỗ trợ lọc theo kỳ/chi nhánh.

## 6. Việc cần làm ngay
- Tạm ngưng ghi nhận phiếu thu thực tế trong môi trường này; backup JSON nếu cần. 
- Lên kế hoạch backend hóa Receipts đồng bộ với Cashbook/Payments (cùng sprint). 
- Rà soát các luồng Orders/Purchase Orders/... đang gọi `useReceiptStore` để chuẩn bị chuyển sang API.
- Sau khi hoàn thành review Receipts, ưu tiên tiếp theo: **Cash Accounts Settings?** (nếu chưa) hoặc theo danh sách anh đang theo dõi – vui lòng xác nhận bước tiếp theo.
