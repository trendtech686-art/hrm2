# Đánh giá & nâng cấp module Sales-Returns (29/11/2025)

## 1. Phạm vi rà soát
- `features/sales-returns/types.ts`: cấu trúc SalesReturn, ReturnLineItem, liên kết receipts/payments.
- `features/sales-returns/store.ts`: `addWithSideEffects`, tạo đơn đổi, hoàn tiền/thu thêm, cập nhật tồn kho, confirm receipt.
- UI: `page.tsx`, `columns.tsx`, `detail-page.tsx`, `form-page.tsx`, `components/sales-return-workflow-card.tsx` (workflow nội bộ).
- Liên đới: `features/orders/store.ts`, `products/store.ts`, cashbook/finance helpers.

## 2. Đánh giá theo yêu cầu logic (Mục B)
### 1) Sales return CRUD với dual-ID
- `useSalesReturnStore` dựa trên `createCrudStore` nên tự động sinh `systemId`/`id`, nhưng `addWithSideEffects` luôn đẩy `id: asBusinessId('')` → hệ thống **không cho phép nhập mã tự chọn** từ form (thiếu input và kiểm tra uniqueness ở tầng store).
- API `update`/`remove` vẫn là mặc định, chưa có guard theo trạng thái (`isReceived`, đã tạo vouchers…) nên caller có thể vô tình sửa `items`, `finalAmount`, thậm chí `orderSystemId` dù đã phát sinh chứng từ.
- Flow mới (`subtasks`, workflow) không được lưu vào `SalesReturn` nên detail page chỉ render card rỗng.
**Kiến nghị**: mở field nhập mã phiếu (nếu cần) kèm check tại store, đồng thời khoá các field nhạy cảm khi phiếu đã nhận hàng/đã tạo chứng từ; lưu luôn `workflowSubtasks` cùng audit (ngày giờ hoàn tất).

### 2) Return items tracking
- `ReturnLineItem` chỉ chứa `product`, `returnQuantity`, `unitPrice`, thiếu các metadata: tình trạng hàng, lý do chi tiết, ảnh, số seri…; không có `receivedQuantity` để ghi nhận thiếu hụt khi kiểm tra.
- Form tính `returnableQuantity` nhưng không lưu vào store → không thể đối chiếu “đã trả bao nhiêu/được phép bao nhiêu”.
- Không có trạng thái kiểm định (pending QC, approved reject). `isReceived` là boolean duy nhất, không đủ để mô tả vòng đời trả hàng thực tế.
**Kiến nghị**: mở rộng `ReturnLineItem` (condition, qualityStatus, receivedQuantity, inspectionNote, attachments) và lưu `returnableQuantity` để báo cáo.

### 3) Exchange items / đơn đổi hàng mới
- `addWithSideEffects` tạo đơn mới qua `addOrder`, nhưng đặt `grandTotal = finalAmount` khi khách phải trả thêm. Điều này khiến doanh thu đơn đổi bị ghi nhận sai (chỉ bằng phần chênh lệch thay vì toàn bộ giá trị hàng đổi), đồng thời stock-out/thuế dựa vào grandTotal sẽ lệch.
- `paymentStatus` của đơn đổi so sánh tổng thanh toán với `grandTotalNew` (giá trị hàng đổi). Nếu khách chỉ trả phần chênh lệch 1 triệu cho đơn 3 triệu, hệ thống vẫn báo “Chưa thanh toán” vì 1 < 3. Không có cơ chế ghi nhận rằng phần còn lại đã được bù trừ từ hàng trả.
- Khi `finalAmount < 0` (phải hoàn tiền), đơn đổi vẫn bị đánh dấu `paymentStatus: 'Chưa thanh toán'` dù thực tế khách không còn nợ. Không có ghi nhận nào về việc dùng “credit” từ phiếu trả để bù trừ.
**Kiến nghị**: luôn lưu `grandTotal = grandTotalNew`; thêm trường `appliedReturnValue`/`creditUsed` để biểu diễn phần được khấu trừ; tính `paymentStatus` dựa trên `finalAmount` sau bù trừ; với trường hợp credit đủ, set `paymentStatus = 'Thanh toán toàn bộ'` và không bắt khách thanh toán thêm.

### 4) Multiple payment/refund methods
- Form cho phép nhiều dòng thanh toán/hoàn tiền, nhưng validation chỉ chạy client-side, không có guard ở store → có thể ghi nhận refund < finalAmount hoặc > khả năng hoàn thực tế khi gọi API trực tiếp.
- `createPaymentDocument`/`createReceiptDocument` chạy tuần tự; nếu một dòng thất bại, các dòng trước đã tạo vẫn không rollback. Store cũng không lưu mapping giữa từng dòng `refunds[]` và `paymentVoucherSystemIds[]` → khó truy vết dòng nào tương ứng chứng từ nào.
**Kiến nghị**: validate tổng tiền tại store (server-side), gói tạo chứng từ theo transaction (hoặc tự rollback thủ công), lưu `refunds[i].voucherSystemId` / `payments[i].voucherSystemId` để trace.

### 5) Inventory receiving (`isReceived`)
- `addWithSideEffects` chỉ cập nhật tồn kho khi `isReceived = true`. Khi chọn “Chưa nhận hàng”, phải gọi `confirmReceipt`, nhưng UI (page/detail) **không có nút** nào kích hoạt chức năng này → trả hàng status sẽ mắc kẹt ở “Chưa nhận”.
- `confirmReceipt` không lưu `receivedBy`, `receivedDate` hay số lượng thực nhận theo từng dòng, nên audit thiếu thông tin.
- Không có bảng trung gian cho hàng đang chờ QC, cũng không ghi nhận lý do từ chối nhận.
**Kiến nghị**: bổ sung action “Xác nhận nhập kho” trên `detail-page.tsx`, lưu metadata người nhận + thời gian + chênh lệch số lượng; xem xét thêm trạng thái `pending_inspection`/`rejected`.

### 6) Linked vouchers (payment/receipt)
- `paymentVoucherSystemIds`/`receiptVoucherSystemIds` được cập nhật sau khi tạo chứng từ, nhưng detail page chỉ hiển thị 1 chứng từ đầu tiên (``relatedTransaction``). Nếu có nhiều đợt thanh toán/hoàn tiền, người dùng không thấy đầy đủ liên kết.
- Không có liên kết ngược: chứng từ cashbook không biết đây là phiếu trả nào ngoài mô tả text; thiếu API để mở phiếu từ chứng từ.
- Trường legacy (`refundMethod`, `paymentVoucherSystemId`) chưa được dọn, dễ gây hiểu lầm.
**Kiến nghị**: hiển thị danh sách toàn bộ vouchers trong detail page, build deep-link 2 chiều, và loại bỏ field legacy để tránh double source of truth.

## 3. Liên kết Modules (Mục C)
- **Products**: `getReturnStockItems` mở rộng combo → child products, nhưng chưa cập nhật `committedByBranch` hay `inTransitByBranch` (chỉ `inventoryByBranch`). Nếu đơn nhập lại kho nhưng đang chờ QC, thiếu cơ chế giữ tạm → dễ tạo chênh lệch so với `inventory-checks`.
- **Orders**: `updateOrder` chỉ đặt `returnStatus = 'Trả hàng toàn bộ/một phần'` dựa trên tổng quantity, không xét theo từng line item. Không có cập nhật `lineItems.returnedQuantity`, khiến việc khóa xuất kho cho các line đã trả về là bất khả thi.
- **Customers**: `incrementReturnStats` chỉ tăng tổng số lượng trả, chưa chạm tới các chỉ số khác (RFM, cảnh báo churn). Debt update (`creditAmount = totalReturnValue - grandTotalNew - refundAmount`) dễ âm sai khi có nhiều phương thức thanh toán.
- **Cashbook/Finance**: tạo receipts/payments dùng helpers chung, nhưng chưa đồng bộ với `cashbook` store (không thêm entry). Việc xóa/sửa phiếu trả cũng không hủy chứng từ liên quan → nguy cơ số liệu tài chính lệch.

## 4. Đề xuất mở rộng (Mục D)
1. **Transfer request workflow** → trong bối cảnh Sales-Returns: cần workflow kiểm duyệt trả hàng (request → inspecting → approved → completed/rejected) thay vì boolean `isReceived`.
2. **Real-time tracking**: đồng bộ trạng thái với shipper/đơn đổi (theo dõi giao nhận hàng đổi, push notification cho khách).
3. **Partial receiving**: hỗ trợ nhiều đợt nhập lại kho, per-line `receivedQuantity`, xuất báo cáo chênh lệch theo lý do.
4. **Transfer cost allocation** tương đương: với sales-return nên có **Return cost allocation** (phí vận chuyển trả hàng, phí kiểm định) để phân bổ vào COGS hoặc chi phí dịch vụ; hiện chưa có bất kỳ trường chi phí nào.

## 5. TODO công việc cần làm
1. **Sửa luồng tạo đơn đổi**  
   - Ghi `grandTotal = grandTotalNew`, thêm `appliedReturnValue`, tính `paymentStatus` dựa trên `finalAmount`.  
   - Nếu `finalAmount <= 0`, đánh dấu `paymentStatus = 'Thanh toán toàn bộ'` và lưu credit sử dụng.
2. **Bổ sung action xác nhận nhận hàng**  
   - Thêm nút “Xác nhận nhập kho” & modal trên `detail-page.tsx` gọi `confirmReceipt`, lưu `receivedBy`, `receivedDate`, tùy chọn số lượng thực nhận.  
   - Mở `SalesReturn` schema với trường audit tương ứng.
3. **Lưu workflow/subtasks & item metadata**  
   - Thêm `workflowSubtasks` (Subtask[]) vào `SalesReturn`, đồng thời mở rộng `ReturnLineItem` (condition, reasonDetail, attachments, receivedQuantity).
4. **Guard và validation ở store**  
   - Xác thực tổng `refunds`/`payments` tại `addWithSideEffects`, rollback chứng từ khi tạo thất bại, map từng dòng tới voucher ID.  
   - Khoá `update` để không cho sửa `items`, `totalReturnValue` sau khi tạo.
5. **Hiển thị chứng từ & liên kết ngược**  
   - Detail page hiển thị danh sách `paymentVoucherSystemIds` + `receiptVoucherSystemIds`, có nút mở chứng từ.  
   - Bổ sung API trong cashbook để mở lại phiếu trả từ voucher (ghi `originalDocumentType = 'sales-return'`).

## 6. Đề xuất nâng cấp ưu tiên
1. **State machine cho Sales-Return**: `requested → awaiting_inspection → inspected → awaiting_finance → completed/cancelled`, tích hợp phân quyền (CSKH, kho, kế toán).
2. **Tích hợp hoàn/thu tiền tự động**: mapping trực tiếp tới `cashbook` entries, hỗ trợ auto-offset với công nợ khách hàng, hiển thị timeline tài chính.
3. **Portal khách hàng**: cho phép khách tự tạo yêu cầu trả hàng, theo dõi trạng thái, upload ảnh chứng minh (giảm tải CSKH).
4. **Analytics**: dashboard lý do trả hàng, tỉ lệ đổi sang đơn mới, giá trị hàng bị giảm giá trị sau kiểm định.
5. **Test coverage**: thêm Vitest cho `addWithSideEffects`, `confirmReceipt`, logic `maxRefundableAmount`, và integration test với order store để đảm bảo đơn đổi/returnStatus cập nhật đúng.
