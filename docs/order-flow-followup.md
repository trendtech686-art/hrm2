# Order Flow Follow-up Checklist

- **Ngày cập nhật:** 23/11/2025
- **Phạm vi:** rà soát toàn bộ luồng đơn hàng từ khâu tạo → thanh toán → vận chuyển → hủy/hoàn → chứng từ.

## 1. Tạo đơn & cấu hình ban đầu
- `features/orders/order-form-page.tsx` vẫn còn placeholder `// TODO` cho logic khuyến mãi, nên chưa có chỗ nhập/áp dụng promotion → cần bổ sung module khuyến mãi hoặc ẩn nút liên quan.
- Các tab cấu hình hãng vận chuyển (GHN, J&T, ViettelPost, Shopee Express) chỉ hiển thị UI, chưa gọi API thực (comment TODO). Khi chuyển sang backend thật phải đi qua proxy bảo mật (`use-shipping-calculator` cũng ghi chú “Call via backend proxy server”). => không cần làm
- `shipping-integration.tsx` đã lấy được province/district/ward từ `customer.addresses` và `shippingAddress` form (Priority 1 & 2). Phần FIXME chỉ còn áp dụng cho dữ liệu legacy `shippingAddress_*`; nếu vẫn giữ seed cũ thì cần migration dọn dẹp để bỏ fallback này.
- Tạo đơn vẫn nhận dữ liệu `shippingConfig` từ local store; cần đảm bảo migration config mới (`loadShippingConfig`) chạy trước khi hiển thị form.

## 2. Thanh toán & công nợ
- `orders/store.ts` đã dùng `createReceiptDocument` và `createOrderRefundVoucher`, tuy nhiên các module khác (Warranty, Complaints, Purchase Orders) vẫn tự build phiếu thu/chi → đề xuất chuẩn hóa toàn hệ thống để tránh lệch metadata.
- Chưa có test e2e cho các tình huống: thanh toán nhiều lần, đổi phương thức giữa chừng, COD cập nhật sau khi giao thành công. Hiện mới có test rollback tồn (`order-stock-rollback.test.ts`).
- Debt của khách đang cập nhật ở `useCustomerStore.incrementOrderStats` khi đơn hoàn thành, nhưng chưa có đối soát với `payments.store` để khóa nợ khi phiếu thu bị hủy.

## 3. Vận chuyển & đóng gói
- Packaging workflow trong `orders/store.ts` được cập nhật khi hủy đơn, nhưng chưa có automation kiểm tra chu kỳ “Đặt hàng → Chờ đóng gói → Đã giao”. Cần tests hoặc storybook cho `packagings` và `deliveryStatus` (đặc biệt case pickup vs shipping partner).
- **[UPDATE 25/11]** Đã cập nhật UI `order-detail-page.tsx` để ép buộc quy trình tuần tự chuẩn Sapo: `Yêu cầu đóng gói` -> `Xác nhận đóng gói` -> `Chọn hình thức giao` -> `Xác nhận xuất kho` -> `Giao hàng`. Nút "Xác nhận xuất kho" chỉ hiện khi đã có phương thức giao hàng (để biết xuất đi đâu).
- API đồng bộ với hãng: `hooks/use-shipping-calculator.ts` và `components/orders/components/shipping-integration.tsx` đều để TODO cho việc gọi backend thực. Cần xây MCP/worker để gửi yêu cầu thay vì mock.
- COD: trường `codAmount` được set 0 khi tạo đơn đổi trả; cần confirm logic tính COD chuẩn (ví dụ: COD = grandTotal - paidAmount) trước khi đẩy hãng.

## 4. Hủy đơn, hoàn kho & chứng từ
- Luồng hủy đã hoàn kho cho trạng thái đã xuất, nhưng mới có test cho dispatch→cancel. Chưa có test cho các biến thể: đơn COD đã giao một phần, đơn có multiple packagings, hoặc đơn có sales return liên kết.
- Khi hủy một đơn đã có sales return (link `linkedSalesReturnSystemId`), cần bảo đảm không tạo thêm phiếu hoàn tiền trùng → hiện chưa có guard.
- Chưa có UI hiển thị danh sách phiếu chi hoàn tiền trực tiếp trong trang chi tiết đơn (chỉ gắn `order.payments`). Có thể bổ sung panel “Chứng từ liên quan”.

## 5. Đổi/Trả & đơn thay thế
- `sales-returns/store.ts` đã dùng helper mới nhưng exchange order creation chưa ràng buộc inventory/packaging workflow (ví dụ: không check tồn trước khi tạo line items mới). Nên tái sử dụng `useProductStore.ensureSufficientStock` giống order form.
- Cần thêm test cho trường hợp `finalAmount > 0` (thu thêm) và `< 0` (hoàn tiền nhiều chứng từ). Hiện chưa có unit test nào cho sales return.

## 6. Báo cáo & tìm kiếm
- `features/orders/order-search-api.ts` vẫn là stub (TODO “replace with actual API endpoint”). Khi lên backend thật phải chuyển sang fetch từ server thay vì filter client.
- Chưa có báo cáo tổng hợp “Đơn hủy sau xuất kho” hoặc “Đơn đổi trả” → nên bổ sung widgets trong dashboard để theo dõi lỗi quy trình.

## 7. Đề xuất hành động tiếp theo
1. **Hoàn thiện shipping layer:** triển khai proxy backend cho GHN/J&T/ViettelPost/Shopee Express, đồng bộ dữ liệu địa chỉ (customer + branch) để gỡ hai FIXME trong `shipping-integration.tsx`.
2. **Chuẩn hóa chứng từ toàn cục:** refactor Warranty/Complaints/Purchase Order payments sang `createReceiptDocument` / `createPaymentDocument`, đồng thời thêm backfill tương ứng nếu thiếu metadata.
3. **Bổ sung test flow:**
   - Order dispatch → partial payment → COD reconciliation.
   - Sales return với exchange order & nhiều phương thức thanh toán.
   - Cancel order khi đã liên kết sales return/packaging.
4. **UI hiển thị chứng từ liên quan:** dựng component chung (ví dụ `ExistingDocumentsViewer`) để show danh sách phiếu thu/chi của một đơn, giúp CS kiểm tra nhanh khi hủy.
5. **Tối ưu debt syncing:** đồng bộ `useCustomerStore.updateDebt` với mọi trường hợp hủy/hoàn, đồng thời theo dõi khi phiếu thu/chi bị cancel để cập nhật công nợ.
6. **Triển khai real search/reporting:** thay `order-search-api.ts` bằng gọi server, thêm dashboard cards cho tỷ lệ hủy, đổi/trả.

> ✅ File này dùng để theo dõi các hạng mục còn lại; cập nhật tiếp khi mỗi action item hoàn thành.
