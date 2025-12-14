# Review Logic & Action Buttons - Chi tiết đơn hàng

Tài liệu này phân tích logic hiện tại của các nút chức năng trên trang chi tiết đơn hàng (`features/orders/order-detail-page.tsx`) và đối chiếu với logic xử lý dữ liệu (`features/orders/store.ts`).

## 1. Tổng quan các nút chức năng (Header Actions)

Dựa trên giao diện hiện tại, nhóm nút hành động phía trên cùng bên phải bao gồm:

| Nút chức năng | Trạng thái UI | Logic Backend (Store) | Đánh giá |
| :--- | :--- | :--- | :--- |
| **In** | `toast.info` (Chưa làm) | Chưa có | ⚠️ Cần ẩn hoặc implement tính năng in đơn hàng. |
| **Sao chép** | `toast.info` (Chưa làm) | Chưa có | ⚠️ Cần ẩn hoặc implement tính năng nhân bản đơn hàng. |
| **Xác nhận xuất kho** | `toast.info` (Chỉ hiện thông báo) | `dispatchFromWarehouse` (Đã có) | ❌ **Lỗi Logic**: Nút này chưa gọi hàm xử lý, dù backend đã sẵn sàng. |
| **Yêu cầu đóng gói** | Hoạt động (Mở dialog) | `requestPackaging` (Đã có) | ✅ **Ổn**: Đã kết nối đúng logic tạo yêu cầu đóng gói. |
| **Hủy đơn hàng** | Hoạt động (Mở dialog) | `cancelOrder` (Đã có) | ✅ **Ổn**: Xử lý hoàn tiền, trả kho và hủy vận đơn GHTK (nếu có). |
| **Sửa** | Hoạt động (Chuyển trang) | N/A | ✅ **Ổn**: Chuyển sang trang chỉnh sửa. |

## 2. Phân tích chi tiết & Vấn đề phát hiện

### 2.1. Vấn đề với các nút quy trình (Xuất kho, Đóng gói, Giao hàng)
Hiện tại, các nút trên Header đang bị "ngắt kết nối" với dữ liệu.
- **Logic thực tế**: Quy trình xử lý đơn hàng gắn liền với từng **Gói hàng (Packaging)** cụ thể. Một đơn hàng có thể có nhiều gói hàng.
- **Vấn đề**: Các nút trên Header là nút "chung", nhưng hành động `confirmPackaging` hay `dispatchFromWarehouse` lại yêu cầu `packagingSystemId` cụ thể.
- **Hệ quả**: Người dùng bấm nút trên Header nhưng không thấy điều gì xảy ra ngoài thông báo "Chức năng đang phát triển" hoặc thông báo text đơn giản, trong khi logic thực sự lại nằm ở các nút nhỏ bên dưới (trong phần "Đóng gói và Giao hàng").

### 2.2. Nút "Thanh toán" (Middle Section)
- **Trạng thái**: ✅ Hoạt động tốt.
- **Logic**: Gọi `addPayment` -> `createReceiptDocument` (Finance Helper) -> `ReceiptStore`.
- **Ưu điểm**: Tận dụng lại logic của module Phiếu thu, đảm bảo dữ liệu tài chính nhất quán.

### 2.3. Nút "Yêu cầu đóng gói" (Bottom Section)
- **Trạng thái**: ✅ Hoạt động tốt.
- **Lưu ý**: Nút này xuất hiện 2 lần (trên Header và dưới Card Đóng gói). Đây là thiết kế chấp nhận được để tăng tính tiện dụng (Accessibility).

## 3. Đề xuất cải thiện (Action Plan)

Để logic chặt chẽ và UX tốt hơn, em đề xuất các phương án sau:

### Phương án 1: Kết nối nút Header vào Gói hàng mặc định (Recommended)
Vì đa số đơn hàng chỉ có 1 gói hàng, ta có thể lập trình để các nút trên Header tự động tác động vào gói hàng mới nhất đang hoạt động.

1.  **Nút "Xác nhận đóng gói" (Header)**:
    *   *Logic mới*: Tìm gói hàng có trạng thái `Chờ đóng gói`. Nếu tìm thấy -> Gọi `confirmPackaging`. Nếu không -> Báo lỗi hoặc ẩn nút.
2.  **Nút "Xác nhận xuất kho" (Header)**:
    *   *Logic mới*: Tìm gói hàng có trạng thái `Đã đóng gói`. Nếu tìm thấy -> Gọi `dispatchFromWarehouse`.
3.  **Nút "Giao hàng" (Header)**:
    *   *Logic mới*: Nên đổi tên thành "Giao cho ĐVVC" hoặc ẩn đi nếu đã gộp vào quy trình xuất kho.

### Phương án 2: Ẩn các nút thừa trên Header
Nếu quy trình đóng gói/xuất kho quá phức tạp để xử lý bằng 1 nút chung, ta nên **ẩn** các nút "Xác nhận xuất kho", "Xác nhận đóng gói" trên Header đi, chỉ giữ lại nút "Yêu cầu đóng gói".
Người dùng sẽ thao tác trực tiếp tại khu vực "Đóng gói và Giao hàng" bên dưới để tránh nhầm lẫn.

### Phương án 3: Implement các nút còn thiếu
- **Nút "In"**: Tạo trang in đơn giản (hoặc PDF) lấy dữ liệu từ `order`.
- **Nút "Sao chép"**: Gọi hàm `add` của `OrderStore` với dữ liệu từ đơn hàng hiện tại (trừ ID, ngày tháng...).

## 4. Kết luận
Logic backend (`store.ts`) đã rất đầy đủ và xử lý tốt các nghiệp vụ kho/quỹ. Vấn đề duy nhất nằm ở việc **đấu nối (wiring)** các nút bấm trên giao diện Header vào các hàm này.

Em khuyến nghị thực hiện **Phương án 1** để các nút to, rõ ràng trên Header thực sự hoạt động, mang lại trải nghiệm mượt mà nhất cho người dùng.
