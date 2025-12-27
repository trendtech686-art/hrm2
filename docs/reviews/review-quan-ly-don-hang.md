# Báo cáo rà soát chức năng quản lý đơn hàng

- **Ngày thực hiện:** 23/11/2025
- **Ngữ cảnh:** Kiểm tra luồng đặt hàng, hủy đơn, thanh toán và tích hợp vận chuyển trong thư mục `features/orders`.

## Tóm tắt nhanh
Hệ thống đã bao phủ hầu hết nghiệp vụ bán hàng, nhưng còn nhiều lỗ hổng về hoàn kho, hoàn tiền và đối soát chứng từ. Các vấn đề dưới đây được sắp xếp theo mức độ ưu tiên.

## Phát hiện chi tiết

1. **Hủy đơn không trả lại tồn kho khi đã xuất kho**  
   - Vị trí: `features/orders/store.ts` hàm `cancelOrder`.  
   - Hiện tại hàm chỉ gọi `uncommitStock`, không kiểm tra `stockOutStatus` hay các `packagings`. Nếu đơn đã được `dispatchStock`, hàng nằm trong `inTransitByBranch` sẽ bị “kẹt” vĩnh viễn.  
   - **Rủi ro:** Báo cáo tồn kho và doanh thu sai lệch khi hủy đơn sau khi đã xuất kho.  
   - **Đề xuất:** Khi hủy, xác định trạng thái giao hàng. Nếu đã dispatch thì gọi `returnStockFromTransit` cho từng line item và đặt lại `deliveryStatus/stockOutStatus` tương ứng.
   - **Trạng thái:** ✅ ĐÃ KHẮC PHỤC (23/11/2025). `cancelOrder` hiện xác định các trạng thái giao hàng đã xuất kho, hoàn tồn bằng `returnStockFromTransit`, hủy toàn bộ `packagings` và đưa `deliveryStatus` về `Đã hủy`. Việc hoàn kho diễn ra song song với `uncommitStock` để bảo toàn cả hai sổ kho.
   - **Kiểm chứng:** `npm run typecheck:strict` đã chạy thành công sau chỉnh sửa.

2. **Lời hứa hoàn tiền tự động nhưng không tạo chứng từ**  
   - Vị trí: `features/orders/order-detail-page.tsx` (hộp thoại hủy đơn) + `store.ts` (hàm `cancelOrder`).  
   - UI thông báo “sẽ tạo phiếu chi hoàn tiền tự động” nếu đơn đã thu tiền, nhưng logic không tạo bất kỳ Payment/Receipt nào.  
   - **Rủi ro:** Người dùng tin rằng khách đã được hoàn tiền trong hệ thống trong khi thực tế không có chứng từ, dễ dẫn tới thiếu hụt tiền mặt.  
   - **Đề xuất:** Thực sự tạo voucher hoàn tiền (hoặc bỏ thông báo). Nếu tạo, cần liên kết với đơn bằng `originalDocumentId` và cập nhật lại `payments/paymentStatus`.
   - **Trạng thái:** ✅ ĐÃ KHẮC PHỤC (23/11/2025). `cancelOrder` mới thu thập các chứng từ đã thu tiền, tính lượng tiền cần hoàn, sau đó gọi helper `createOrderRefundVoucher` để phát sinh Payment chuẩn (gắn `originalDocumentId`, `linkedOrderSystemId`, cashbook, phương thức chi). Phiếu chi âm được đẩy lại vào `order.payments`, cập nhật `paidAmount` và đặt `paymentStatus` về `Chưa thanh toán` khi cần.
   - **Kiểm chứng:** Manual cancel path đã tạo được Payment trong `usePaymentStore`; typecheck OK.

3. **Phiếu thu tạo từ đơn hàng thiếu dữ liệu bắt buộc**  
   - Vị trí: `features/orders/store.ts` hàm `addPayment`.  
   - Dữ liệu gửi vào `useReceiptStore.add` thiếu `payerTypeSystemId`, `paymentMethodSystemId`, `customerSystemId`… nên các phiếu thu mới không có metadata để hiển thị ở màn hình chứng từ hoặc tổng hợp công nợ.  
   - **Rủi ro:** UI “Phiếu thu” không thể hiện phương thức, đối tượng, hoặc bị lỗi khi lọc.  
   - **Đề xuất:** Trước khi gọi `addReceipt`, map đầy đủ thông tin từ `receiptTypes`, `payment methods`, `customer` và `cashbook accounts` theo `Receipt` interface.
   - **Trạng thái:** ✅ ĐÃ KHẮC PHỤC (23/11/2025). `addPayment` giờ bắt buộc lấy `receiptTypes`, `paymentMethod`, `customer target group` và `cashbook account`. `ReceiptInput` cung cấp đủ metadata (`payerTypeSystemId`, `paymentMethodSystemId`, `accountSystemId`, `customerSystemId`, `originalDocumentId` dạng `BusinessId`), đồng thời tạo `OrderPayment` từ chứng từ thực tế để đồng bộ thông tin.
   - **Kiểm chứng:** `npm run typecheck:strict` đảm bảo các trường bắt buộc khớp với interface `Receipt`.

4. **Công thức công nợ hiển thị bị sai dấu**  
   - Vị trí: `features/orders/order-detail-page.tsx`, phần “Đơn hàng chờ thanh toán”.  
   - `amountRemaining` được tính bằng `grandTotal + totalPaid`, trong khi `payments` đang lưu số dương. Kết quả: càng thu tiền thì “Còn phải trả” càng tăng.  
   - **Rủi ro:** Nhân viên thấy khách “còn nợ” dù thực tế đã thanh toán, dễ dẫn đến thu thừa tiền hoặc cập nhật sai trạng thái.  
   - **Đề xuất:** Sửa thành `grandTotal - totalPaid` (và trừ tiếp giá trị trả hàng nếu có). Cập nhật badge `paymentStatus` để dựa trên giá trị mới này.
   - **Trạng thái:** ✅ ĐÃ KHẮC PHỤC (23/11/2025). `order-detail-page.tsx` hiện tính `amountRemaining = (grandTotal - totalReturnedValue) - totalPaid` nên các khoản hoàn hàng hoặc hoàn tiền đều giảm nợ chính xác; phần “Đơn hàng chờ thanh toán” hiển thị đúng số nợ thực.
   - **Kiểm chứng:** `npm run typecheck:strict` và kiểm tra thủ công màn hình chi tiết đơn với dữ liệu có trả hàng để xác nhận công thức mới.

## Gợi ý tiếp theo
1. Viết test/tự động hóa để mô phỏng chuỗi: tạo đơn → dispatch → hủy, đảm bảo tồn kho quay lại đúng.  
2. Chuẩn hóa helper tạo chứng từ (cả thu và chi) để tái sử dụng giữa Orders, Returns, Warranty.  
3. Bổ sung migration kiểm tra các receipt đang thiếu metadata sau khi fix, tránh dữ liệu lịch sử bị “mồ côi”.
   - **Trạng thái:** ✅ ĐÃ THỰC HIỆN (23/11/2025). `features/receipts/store.ts` và `features/payments/store.ts` hiện chạy hàm `backfill*Metadata` sau khi hydrate để tự động bổ sung `payer/recipient target group`, phương thức thu/chi, tài khoản quỹ và liên kết khách hàng cho mọi chứng từ cũ thiếu trường bắt buộc. Các helper tái sử dụng lookup chung (`features/finance/document-lookups.ts`) nên không còn viết tay từng nơi.
   - **Kiểm chứng:** `npm run typecheck:strict` đã chạy lại thành công sau khi thêm migration; kiểm tra thủ công danh sách Phiếu thu/Phiếu chi có dữ liệu cũ cho thấy các dòng thiếu metadata đã được điền đầy đủ.
