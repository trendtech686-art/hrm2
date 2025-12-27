# Testing Checklist - HRM2 System

> Tài liệu liệt kê tất cả chức năng cần test trong hệ thống.
> 
> **Hướng dẫn:** Đánh dấu ✅ khi đã test OK, ❌ khi có lỗi, ⏳ khi đang test

---

## 1. Authentication (Xác thực)

### 1.1 Đăng nhập
- [ ] Đăng nhập với email/password hợp lệ
- [ ] Đăng nhập với email sai → hiển thị lỗi
- [ ] Đăng nhập với password sai → hiển thị lỗi
- [ ] Remember me hoạt động đúng
- [ ] Redirect về trang trước sau khi đăng nhập

### 1.2 Đăng xuất
- [ ] Đăng xuất thành công
- [ ] Clear session/token
- [ ] Redirect về trang login

### 1.3 Protected Routes
- [ ] Truy cập trang protected khi chưa đăng nhập → redirect login
- [ ] Truy cập trang theo role/permission

---

## 2. Dashboard

- [ ] Hiển thị thống kê tổng quan
- [ ] Các widget load data đúng
- [ ] Charts render đúng
- [ ] Quick actions hoạt động

---

## 3. Quản lý Khách hàng (Customers)

### 3.1 Danh sách
- [ ] Hiển thị danh sách khách hàng
- [ ] Phân trang hoạt động
- [ ] Tìm kiếm theo tên/SĐT/email
- [ ] Filter theo nhóm khách hàng
- [ ] Filter theo trạng thái
- [ ] Sort theo các cột
- [ ] Export Excel

### 3.2 Tạo mới
- [ ] Form validation (required fields)
- [ ] Tạo khách hàng thành công
- [ ] Hiển thị toast thông báo
- [ ] Redirect về danh sách

### 3.3 Chi tiết & Chỉnh sửa
- [ ] Xem chi tiết khách hàng
- [ ] Sửa thông tin cơ bản
- [ ] Sửa địa chỉ
- [ ] Xem lịch sử đơn hàng
- [ ] Xem công nợ

### 3.4 Xóa
- [ ] Xóa khách hàng (với confirm dialog)
- [ ] Không cho xóa nếu có đơn hàng liên quan

### 3.5 SLA Alerts
- [ ] Hiển thị SLA alerts đúng
- [ ] Nút "Đã xử lý" hoạt động (follow-up)
- [ ] Nút "Đã xử lý" hoạt động (re-engagement)
- [ ] Nút "Tạm ẩn" hoạt động
- [ ] Lịch sử xử lý SLA hiển thị đúng
- [ ] Badge "Đã xác nhận" hiển thị sau khi acknowledge

---

## 4. Quản lý Đơn hàng (Orders)

### 4.1 Danh sách
- [ ] Hiển thị danh sách đơn hàng
- [ ] Phân trang
- [ ] Tìm kiếm theo mã đơn/khách hàng
- [ ] Filter theo trạng thái
- [ ] Filter theo ngày
- [ ] Filter theo kênh bán hàng
- [ ] Export Excel

### 4.2 Tạo đơn hàng
- [ ] Chọn khách hàng
- [ ] Tạo khách hàng mới từ form đơn hàng
- [ ] Thêm sản phẩm vào đơn
- [ ] Tìm kiếm sản phẩm
- [ ] Cập nhật số lượng
- [ ] Xóa sản phẩm khỏi đơn
- [ ] Áp dụng chiết khấu (%)
- [ ] Áp dụng chiết khấu (số tiền)
- [ ] Tính thuế VAT đúng
- [ ] Tính tổng tiền đúng
- [ ] Chọn phương thức thanh toán
- [ ] Ghi chú đơn hàng
- [ ] Lưu đơn hàng thành công

### 4.3 Chi tiết đơn hàng
- [ ] Xem chi tiết đơn hàng
- [ ] Hiển thị sản phẩm với thuế
- [ ] Hiển thị tổng tiền đúng
- [ ] Cập nhật trạng thái đơn hàng
- [ ] In hóa đơn
- [ ] Xem lịch sử thay đổi

### 4.4 Hủy đơn
- [ ] Hủy đơn với lý do
- [ ] Hoàn trả tồn kho (nếu đã xuất)

---

## 5. Quản lý Sản phẩm (Products)

### 5.1 Danh sách
- [ ] Hiển thị danh sách sản phẩm
- [ ] Phân trang
- [ ] Tìm kiếm theo tên/SKU/barcode
- [ ] Filter theo danh mục
- [ ] Filter theo trạng thái
- [ ] Filter theo tồn kho (hết hàng, sắp hết)
- [ ] Export Excel
- [ ] Import Excel

### 5.2 Tạo sản phẩm
- [ ] Form validation
- [ ] Upload hình ảnh
- [ ] Nhập thông tin cơ bản
- [ ] Thiết lập giá bán
- [ ] Thiết lập giá vốn
- [ ] Chọn đơn vị tính
- [ ] Chọn danh mục
- [ ] Chọn thuế
- [ ] Tạo biến thể (nếu có)
- [ ] Lưu sản phẩm thành công

### 5.3 Chi tiết & Chỉnh sửa
- [ ] Xem chi tiết sản phẩm
- [ ] Sửa thông tin
- [ ] Xem lịch sử tồn kho
- [ ] Xem lịch sử giá

### 5.4 Combo/Bộ sản phẩm
- [ ] Tạo combo
- [ ] Thêm sản phẩm vào combo
- [ ] Thiết lập giá combo
- [ ] Xem chi tiết combo

### 5.5 Xóa
- [ ] Xóa sản phẩm
- [ ] Không cho xóa nếu còn tồn kho

---

## 6. Quản lý Nhân viên (Employees)

### 6.1 Danh sách
- [ ] Hiển thị danh sách nhân viên
- [ ] Phân trang
- [ ] Tìm kiếm
- [ ] Filter theo phòng ban
- [ ] Filter theo chức vụ
- [ ] Filter theo trạng thái
- [ ] Export Excel

### 6.2 Tạo nhân viên
- [ ] Form validation
- [ ] Upload ảnh đại diện
- [ ] Nhập thông tin cá nhân
- [ ] Nhập thông tin liên hệ
- [ ] Nhập địa chỉ
- [ ] Chọn phòng ban
- [ ] Chọn chức vụ
- [ ] Thiết lập lương
- [ ] Lưu thành công

### 6.3 Chi tiết & Chỉnh sửa
- [ ] Xem chi tiết nhân viên
- [ ] Sửa thông tin
- [ ] Xem lịch sử chấm công
- [ ] Xem lịch sử lương

### 6.4 Xóa/Nghỉ việc
- [ ] Đánh dấu nghỉ việc
- [ ] Xóa nhân viên

---

## 7. Chấm công (Attendance)

- [ ] Xem bảng chấm công theo tháng
- [ ] Chấm công thủ công
- [ ] Import chấm công từ file
- [ ] Duyệt chấm công
- [ ] Tính công chuẩn

---

## 8. Nghỉ phép (Leaves)

- [ ] Tạo đơn xin nghỉ
- [ ] Xem danh sách đơn nghỉ
- [ ] Duyệt đơn nghỉ
- [ ] Từ chối đơn nghỉ
- [ ] Xem số ngày phép còn lại

---

## 9. Tính lương (Payroll)

- [ ] Tạo bảng lương tháng
- [ ] Tính lương tự động
- [ ] Thêm phụ cấp
- [ ] Thêm khấu trừ
- [ ] Xem chi tiết lương nhân viên
- [ ] Duyệt bảng lương
- [ ] Export bảng lương
- [ ] In phiếu lương

---

## 10. Quản lý Kho (Inventory)

### 10.1 Nhập kho
- [ ] Tạo phiếu nhập kho
- [ ] Chọn nhà cung cấp
- [ ] Thêm sản phẩm
- [ ] Nhập số lượng, giá nhập
- [ ] Duyệt phiếu nhập
- [ ] Cập nhật tồn kho sau duyệt

### 10.2 Xuất kho
- [ ] Tạo phiếu xuất kho
- [ ] Chọn lý do xuất
- [ ] Thêm sản phẩm
- [ ] Duyệt phiếu xuất

### 10.3 Chuyển kho
- [ ] Tạo phiếu chuyển kho
- [ ] Chọn kho nguồn/đích
- [ ] Thêm sản phẩm
- [ ] Duyệt chuyển kho

### 10.4 Kiểm kho
- [ ] Tạo phiếu kiểm kho
- [ ] Nhập số lượng thực tế
- [ ] Tính chênh lệch
- [ ] Cân bằng kho

### 10.5 Điều chỉnh giá vốn
- [ ] Tạo phiếu điều chỉnh
- [ ] Cập nhật giá vốn

---

## 11. Nhà cung cấp (Suppliers)

- [ ] Danh sách nhà cung cấp
- [ ] Tạo mới
- [ ] Chỉnh sửa
- [ ] Xóa
- [ ] Xem công nợ nhà cung cấp

---

## 12. Đơn mua hàng (Purchase Orders)

- [ ] Tạo đơn mua hàng
- [ ] Chọn nhà cung cấp
- [ ] Thêm sản phẩm
- [ ] Duyệt đơn mua
- [ ] Nhập kho từ đơn mua

---

## 13. Thu chi (Cashbook)

- [ ] Tạo phiếu thu
- [ ] Tạo phiếu chi
- [ ] Xem danh sách thu chi
- [ ] Filter theo ngày/loại
- [ ] Báo cáo thu chi

---

## 14. Thanh toán (Payments)

- [ ] Tạo phiếu thanh toán
- [ ] Liên kết với đơn hàng
- [ ] Xem lịch sử thanh toán

---

## 15. Khiếu nại (Complaints)

- [ ] Tạo khiếu nại
- [ ] Phân loại khiếu nại
- [ ] Gán người xử lý
- [ ] Cập nhật trạng thái
- [ ] Xem lịch sử xử lý
- [ ] Đóng khiếu nại

---

## 16. Bảo hành (Warranty)

- [ ] Tạo phiếu bảo hành
- [ ] Nhập thông tin sản phẩm bảo hành
- [ ] Cập nhật trạng thái
- [ ] Hoàn thành bảo hành

---

## 17. Công việc (Tasks)

- [ ] Tạo công việc
- [ ] Gán nhân viên
- [ ] Thiết lập deadline
- [ ] Thêm subtasks
- [ ] Cập nhật tiến độ
- [ ] Đánh dấu hoàn thành
- [ ] Xem timeline

---

## 18. Giao hàng (Shipments)

- [ ] Tạo phiếu giao hàng
- [ ] Liên kết với đơn hàng
- [ ] Cập nhật trạng thái giao
- [ ] Xác nhận giao thành công

---

## 19. Báo cáo (Reports)

### 19.1 Báo cáo bán hàng
- [ ] Doanh thu theo ngày/tháng
- [ ] Doanh thu theo sản phẩm
- [ ] Doanh thu theo khách hàng
- [ ] Doanh thu theo nhân viên
- [ ] Doanh thu theo kênh bán

### 19.2 Báo cáo tồn kho
- [ ] Tồn kho hiện tại
- [ ] Xuất nhập tồn
- [ ] Sản phẩm sắp hết hàng

### 19.3 Báo cáo công nợ
- [ ] Công nợ khách hàng
- [ ] Công nợ nhà cung cấp
- [ ] Tuổi nợ

### 19.4 Báo cáo SLA
- [ ] Danh sách khách hàng vi phạm SLA
- [ ] Thống kê theo loại SLA

---

## 20. Cài đặt (Settings)

### 20.1 Thông tin cửa hàng
- [ ] Cập nhật tên cửa hàng
- [ ] Cập nhật địa chỉ
- [ ] Cập nhật logo
- [ ] Cập nhật thông tin liên hệ

### 20.2 Chi nhánh
- [ ] Danh sách chi nhánh
- [ ] Tạo chi nhánh mới
- [ ] Chỉnh sửa chi nhánh
- [ ] Xóa chi nhánh

### 20.3 Phòng ban
- [ ] Danh sách phòng ban
- [ ] CRUD phòng ban

### 20.4 Chức vụ
- [ ] Danh sách chức vụ
- [ ] CRUD chức vụ

### 20.5 Thuế
- [ ] Danh sách thuế
- [ ] Tạo loại thuế mới
- [ ] Chỉnh sửa thuế

### 20.6 Đơn vị tính
- [ ] Danh sách đơn vị
- [ ] CRUD đơn vị

### 20.7 Kênh bán hàng
- [ ] Danh sách kênh
- [ ] CRUD kênh bán hàng

### 20.8 Phương thức thanh toán
- [ ] Danh sách PTTT
- [ ] CRUD PTTT

### 20.9 SLA Settings
- [ ] Cấu hình SLA follow-up
- [ ] Cấu hình SLA re-engagement
- [ ] Cấu hình cảnh báo

### 20.10 Giao diện
- [ ] Đổi theme (light/dark)
- [ ] Đổi ngôn ngữ

---

## 21. Chức năng chung

### 21.1 Responsive/Mobile
- [ ] Giao diện mobile hoạt động
- [ ] Menu mobile mở/đóng đúng
- [ ] Bảng dữ liệu scroll ngang

### 21.2 Performance
- [ ] Trang load < 3s
- [ ] Không có memory leak
- [ ] Không có infinite loop

### 21.3 UX
- [ ] Loading states hiển thị
- [ ] Error messages rõ ràng
- [ ] Toast notifications hoạt động
- [ ] Confirm dialogs cho destructive actions
- [ ] Keyboard navigation

### 21.4 Data Integrity
- [ ] Form validation client-side
- [ ] Không mất data khi refresh
- [ ] Optimistic updates hoạt động đúng

---

## Ghi chú Test

| Ngày | Người test | Ghi chú |
|------|-----------|---------|
|      |           |         |

---

## Bugs Found

| # | Module | Mô tả lỗi | Mức độ | Trạng thái |
|---|--------|-----------|--------|------------|
| 1 |        |           |        |            |

