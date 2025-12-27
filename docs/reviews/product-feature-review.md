# Đánh giá & Kiểm tra Chức năng Sản phẩm
**Ngày:** 26 tháng 11 năm 2025
**Người đánh giá:** GitHub Copilot

## 1. Tóm tắt điều hành
Module Quản lý Sản phẩm (`features/products`) là một thành phần hoàn thiện và giàu tính năng của hệ thống HRM. Nó hỗ trợ quản lý trọn vòng đời của nhiều loại sản phẩm khác nhau (Hàng hóa, Dịch vụ, Sản phẩm số, Combo) với sự tích hợp sâu vào các module Kho, Giá cả và Nhà cung cấp. Các cập nhật gần đây đã tinh chỉnh mô hình dữ liệu để phù hợp với các yêu cầu kinh doanh cụ thể (ID PKGX, logic Theo dõi tồn kho) và cải thiện UI/UX cho cả người dùng máy tính và thiết bị di động.

## 2. Kiến trúc tính năng

### Các thành phần chính
| Thành phần | File | Mô tả |
|-----------|------|-------------|
| **Xem danh sách** | `page.tsx` | Bảng dữ liệu phản hồi (responsive) với bộ lọc nâng cao, thao tác hàng loạt và chế độ xem thẻ tối ưu cho di động. |
| **Form Thêm/Sửa** | `product-form-complete.tsx` | Form đa tab xử lý thông tin cơ bản, hình ảnh, giá cả, kho, vận chuyển và SEO. Sử dụng `react-hook-form` + `zod`. |
| **Xem chi tiết** | `detail-page.tsx` | Dashboard toàn diện hiển thị thống kê sản phẩm, tồn kho theo chi nhánh, lịch sử kho và lịch sử giá. |
| **State Store** | `store.ts` | Zustand store có tính năng lưu trữ (`hrm-products`), xử lý các hoạt động CRUD và kho (cam kết, xuất kho). |
| **Xác thực** | `validation.ts` | Zod schemas đảm bảo tính toàn vẹn dữ liệu, bao gồm logic phức tạp cho sản phẩm Combo. |

### Cấu trúc File
```
features/products/
├── components/         # Các thành phần phụ (Dialogs, Badges)
├── hooks/              # Custom hooks (useProductsQuery)
├── page.tsx            # Màn hình Danh sách chính
├── product-form-complete.tsx # Form chính
├── detail-page.tsx     # Màn hình Chi tiết
├── store.ts            # Quản lý trạng thái (State Management)
├── types.ts            # Định nghĩa TypeScript
├── validation.ts       # Zod Schemas
└── ... (utils, importers, services)
```

## 3. Phân tích Mô hình Dữ liệu & Xác thực

### Loại dữ liệu cốt lõi (`Product`)
Mô hình dữ liệu mạnh mẽ và có khả năng mở rộng. Các trường chính bao gồm:
- **Định danh**: `systemId` (nội bộ), `id` (SKU - hiện có thể chỉnh sửa), `pkgxId` (Mới: ID bên ngoài).
- **Phân loại**: `type`, `categorySystemId`, `productTypeSystemId`, `tags`.
- **Giá cả**: `costPrice`, `prices` (Theo chính sách), `lastPurchasePrice` (Mới), `minPrice`.
- **Kho**: `inventoryByBranch`, `committedByBranch`, `inTransitByBranch`.
- **Cấu hình**: `isStockTracked` (Mặc định: true).

### Cập nhật Schema gần đây
- **ID PKGX**: Đã thêm dưới dạng số nguyên dương tùy chọn (`pkgxId`).
- **Theo dõi tồn kho**: `isStockTracked` mặc định là `true`.
- **Giá cả**: Đã xóa `suggestedRetailPrice`; Thêm `lastPurchasePrice`.

## 4. Phân tích UI/UX

### Xem danh sách (`page.tsx`)
- **Độ phản hồi**: Tự động chuyển đổi giữa chế độ xem Bảng (Desktop) và Thẻ (Mobile).
- **Logic Thanh công cụ**: Nút "Tùy chọn bảng" được ẩn thông minh trên Desktop (nơi đã có thanh công cụ riêng) và hiển thị trên Mobile, giảm bớt sự lộn xộn.
- **Bộ lọc**: Lọc mạnh mẽ theo Ngày, Trạng thái, Loại và Danh mục.

### Form Thêm/Sửa (`product-form-complete.tsx`)
- **Bố cục**: Được tổ chức thành 6 tab (Cơ bản, Hình ảnh, Giá bán, Kho, Vận chuyển, SEO) để quản lý độ phức tạp.
- **Cải tiến Logic**:
    - **Sửa SKU**: Đã mở khóa để chỉnh sửa.
    - **Theo dõi tồn kho**: Checkbox bị ẩn khỏi UI để bắt buộc theo dõi theo mặc định, nhưng logic vẫn được giữ lại trong nền.
    - **Khởi tạo**: Đã sửa lỗi nghiêm trọng khi `watch` được gọi trước khi form khởi tạo.
- **Dọn dẹp trường**: Đã xóa "Giá bán lẻ đề xuất" để tinh gọn giao diện.

### Xem chi tiết (`detail-page.tsx`)
- **Dashboard**: Cung cấp cái nhìn "tổng quan" rõ ràng về mức tồn kho trên các chi nhánh.
- **Các tab Lịch sử**:
    1.  **Lịch sử Kho**: Theo dõi biến động kho (Nhập, Xuất, Đơn hàng).
    2.  **Lịch sử Giá nhập (Mới)**: Hiển thị dòng thời gian giá nhập (`lastPurchasePrice`) lấy từ Đơn nhập hàng.

## 5. Các thay đổi & Cải tiến gần đây (Nhật ký phiên làm việc)

| Tính năng/Sửa lỗi | Trạng thái | Chi tiết |
|-------------------|------------|----------|
| **ID PKGX** | ✅ Hoàn thành | Đã thêm trường `pkgxId` vào Type, Validation và Form. |
| **Tùy chọn bảng** | ✅ Hoàn thành | Đã sửa nút bị thừa trên header Desktop. |
| **Sửa SKU** | ✅ Hoàn thành | Cho phép chỉnh sửa trường SKU trong form. |
| **Theo dõi tồn kho** | ✅ Hoàn thành | Ẩn checkbox UI; mặc định là `true`. Logic vẫn giữ hiển thị các trường SLA. |
| **Các trường Giá** | ✅ Hoàn thành | Đã thêm `lastPurchasePrice`; Xóa `suggestedRetailPrice`. |
| **Lịch sử Giá** | ✅ Hoàn thành | Đã thêm tab riêng trong trang Chi tiết để hiển thị lịch sử giá nhập. |

## 6. Các điểm tích hợp
- **Kho**: Kết nối chặt chẽ với `inventory-receipts` cho lịch sử giá và cập nhật tồn kho.
- **Cài đặt**: Sử dụng `ProductType`, `ProductCategory`, `StorageLocation` từ các store cài đặt.
- **Nhà cung cấp**: Liên kết với `SupplierStore` để chọn nhà cung cấp chính.

## 7. Khuyến nghị
1.  **Logic Giá nhập gần nhất**: Hiện tại, `lastPurchasePrice` có thể chỉnh sửa trong form. Lý tưởng nhất, trường này nên được cập nhật tự động *chỉ* thông qua Đơn nhập hàng để đảm bảo độ chính xác dữ liệu, hoặc được dán nhãn rõ ràng là "Ghi đè thủ công".
2.  **Hiệu năng**: Mảng `products` trong `store.ts` được tải hoàn toàn vào bộ nhớ. Khi tập dữ liệu tăng lên (>1000 mục), hãy cân nhắc triển khai phân trang phía server (server-side pagination) hoặc ảo hóa (đã được xử lý một phần bởi `ResponsiveDataTable`).
3.  **Logic Combo**: Đảm bảo validation `comboItems` kiểm tra chặt chẽ các phụ thuộc vòng tròn nếu sau này cho phép combo lồng trong combo (hiện tại đang bị hạn chế).

## 8. Kết luận
Module Sản phẩm đang ở trạng thái ổn định và tốt. Các tùy chỉnh gần đây đã điều chỉnh hệ thống phù hợp với quy trình kinh doanh cụ thể (tích hợp PKGX, đơn giản hóa mô hình giá). Code được module hóa, định kiểu tốt (well-typed) và tuân theo các mẫu kiến trúc của dự án.
