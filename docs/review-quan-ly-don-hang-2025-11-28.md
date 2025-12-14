# Báo cáo rà soát chức năng quản lý đơn hàng (Cập nhật)

- **Ngày thực hiện:** 28/11/2025
- **Người thực hiện:** GitHub Copilot
- **Phạm vi:** `features/orders`, `features/products/store.ts`, `features/orders/order-form-page.tsx`

## Tóm tắt
Hệ thống quản lý đơn hàng hiện tại có logic xử lý trạng thái, tích hợp vận chuyển (GHTK) và thanh toán khá hoàn thiện. Các vấn đề nghiêm trọng từ đợt review trước (23/11) đã được khắc phục. Tuy nhiên, hệ thống hiện tại **cho phép bán âm kho** mà không có cảnh báo, đây là một quyết định nghiệp vụ cần được lưu ý hoặc cấu hình lại nếu cần kiểm soát chặt chẽ.

## Đánh giá chi tiết

### 1. Quản lý Tồn kho (Inventory Management)
- **Hiện trạng:**
  - Đã có cấu hình `allowNegativeOrder` (Cho phép bán âm) trong `features/settings/sales/sales-management-store.ts`.
  - Tuy nhiên, `order-form-page.tsx` và `store.ts` **chưa sử dụng** cấu hình này. Hệ thống hiện tại luôn cho phép bán âm kho bất kể cấu hình là bật hay tắt.
  - UI đã hiển thị cảnh báo "Không đủ" (màu đỏ) khi số lượng > tồn kho, nhưng không chặn hành động Lưu đơn.
- **Rủi ro:** Nếu cấu hình "Không cho phép bán âm" được bật, nhân viên vẫn có thể tạo đơn hàng âm kho, gây sai lệch quy trình.
- **Đề xuất:**
  - Kết nối `useSalesManagementSettingsStore` vào `order-form-page.tsx`.
  - Trong hàm `processSubmit`, kiểm tra `!settings.allowNegativeOrder` và `quantity > availableStock`. Nếu vi phạm -> Chặn submit và báo lỗi.

### 2. Quy trình Hủy đơn (Cancellation Workflow)
- **Hiện trạng:**
  - Logic `cancelOrder` trong `features/orders/store.ts` đã được xử lý tốt.
  - Đã xử lý: Uncommit stock, Return stock from transit (nếu đã xuất), Tạo phiếu chi hoàn tiền (nếu đã thu), Cập nhật công nợ.
  - **Điểm cộng:** Xử lý đúng cho cả sản phẩm thường và Combo (tách thành sản phẩm con để trả kho).
- **Lưu ý:** Việc tạo phiếu chi hoàn tiền (`createOrderRefundVoucher`) tự động có thể làm quỹ tiền mặt bị âm nếu không kiểm tra số dư thực tế.

### 3. Tích hợp Vận chuyển (Shipping Integration)
- **Hiện trạng:**
  - Tích hợp sâu với GHTK: Tạo đơn, Webhook cập nhật trạng thái, Hủy vận đơn.
  - Logic cập nhật tồn kho dựa trên trạng thái GHTK (Webhook) rất chi tiết và chính xác (ví dụ: GHTK lấy hàng -> Xuất kho; GHTK trả hàng -> Nhập kho lại).
  - Hỗ trợ đối soát COD (`confirmCodReconciliation`) tạo phiếu thu tự động.
- **Đánh giá:** Đây là điểm mạnh của module này.

### 4. Tạo đơn & Chỉnh sửa (Order Creation & Editing)
- **Hiện trạng:**
  - Form tạo đơn (`order-form-page.tsx`) đầy đủ chức năng cơ bản.
  - Đã có logic chặn sửa thông tin quan trọng (sản phẩm, số lượng) khi đơn đã đóng gói/xuất kho (`isMetadataOnlyMode`).
  - Tự động tạo công nợ (`addDebtTransaction`) khi tạo đơn.
- **Vấn đề:**
  - **Hardcoded Employee ID:** `NV00000001` đang được gán cứng trong `store.ts` (`getCurrentUser`). Điều này khiến lịch sử đơn hàng sai lệch người tạo.
  - **Giải pháp:** Cần thay thế bằng `useAuth().employee.systemId` hoặc lấy từ `useEmployeeStore` để ghi nhận đúng người đang đăng nhập.

### 5. Sản phẩm Combo
- **Hiện trạng:**
  - Logic xử lý Combo (`processLineItemStock`) hoạt động đúng nguyên tắc: Combo không có tồn kho vật lý, khi bán/xuất/trả sẽ tác động lên các sản phẩm con cấu thành.
## Các vấn đề tồn đọng & Khuyến nghị

| Mức độ | Vấn đề | Khuyến nghị | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Cao** | **Cấu hình bán âm kho chưa hoạt động** | Logic kiểm tra tồn kho chưa kết nối với `sales-management-store`. Cần cập nhật `order-form-page.tsx` để chặn submit nếu `allowNegativeOrder = false` và tồn kho không đủ. | **Đã khắc phục** |
| **Cao** | **Hardcoded User ID** | Thay thế `NV00000001` bằng `useAuth().employee.systemId` trong `store.ts` để ghi nhận đúng nhân viên tạo đơn. | **Đã khắc phục** |
| Thấp | Thiếu validate số dư quỹ khi hoàn tiền | Kiểm tra số dư `cashbook` trước khi tạo phiếu chi hoàn tiền tự động khi hủy đơn. | Chưa xử lý |
| Thấp | UI chưa hiển thị tồn kho realtime | Khi chọn sản phẩm, nên hiển thị tồn kho khả dụng của chi nhánh đang chọn để sale biết. | Chưa xử lý |

## Kết luận
Module Quản lý đơn hàng hoạt động ổn định về mặt logic trạng thái. Các vấn đề quan trọng như **Hardcoded User ID** và **Kết nối cấu hình bán âm kho** đã được khắc phục. Hệ thống hiện tại đã đảm bảo tính chính xác của dữ liệu người dùng và tuân thủ cấu hình bán hàng.
Module Quản lý đơn hàng hoạt động ổn định về mặt logic trạng thái và dòng tiền/hàng. Đã bổ sung lớp kiểm soát tồn kho (Validation) để tránh các lỗi nghiệp vụ bán hàng quá số lượng thực tế.
