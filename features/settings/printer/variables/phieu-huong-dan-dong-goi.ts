import { TemplateVariable } from '../types';

export const PHIEU_HUONG_DAN_DONG_GOI_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_email}', label: 'Email cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },
  // Thông tin phiếu hướng dẫn đóng gói
  { key: '{created_on}', label: 'Ngày tạo', group: 'Thông tin phiếu hướng dẫn đóng gói' },
  { key: '{list_order_code}', label: 'Danh sách đơn hàng áp dụng', group: 'Thông tin phiếu hướng dẫn đóng gói' },
  { key: '{account_phone}', label: 'SĐT nhân viên phụ trách', group: 'Thông tin phiếu hướng dẫn đóng gói' },
  { key: '{created_on_time}', label: 'Thời gian tạo', group: 'Thông tin phiếu hướng dẫn đóng gói' },
  { key: '{account_name}', label: 'Tên nhân viên phụ trách', group: 'Thông tin phiếu hướng dẫn đóng gói' },
  { key: '{account_email}', label: 'Email nhân viên phụ trách', group: 'Thông tin phiếu hướng dẫn đóng gói' },
  // Thông tin giỏ hàng
  { key: '{line_stt}', label: 'STT', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant_sku}', label: 'Mã phiên bản sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant_barcode}', label: 'Mã vạch phiên bản sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_unit}', label: 'Đơn vị tính', group: 'Thông tin giỏ hàng' },
  { key: '{note_of_store}', label: 'Ghi chú', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant_qrcode}', label: 'Mã QR phiên bản sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_brand}', label: 'Thương hiệu sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_image}', label: 'Ảnh phiên bản sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{location_name}', label: 'Chi nhánh', group: 'Thông tin giỏ hàng' },
  { key: '{composite_details}', label: 'Thành phần combo', group: 'Thông tin giỏ hàng' },
  { key: '{line_product_name}', label: 'Tên sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant_name}', label: 'Tên phiên bản sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant_options}', label: 'Thuộc tính sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_quantity}', label: 'Số lượng sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{bin_location}', label: 'Điểm lưu kho', group: 'Thông tin giỏ hàng' },
  { key: '{line_category}', label: 'Loại sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_product_description}', label: 'Mô tả sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{lineitem_note}', label: 'Ghi chú sản phẩm', group: 'Thông tin giỏ hàng' },
  // Tổng giá trị
  { key: '{total}', label: 'Tổng tiền hàng', group: 'Tổng giá trị' },
  { key: '{total_product_quantity}', label: 'Tổng số mặt hàng', group: 'Tổng giá trị' },
  { key: '{order_note}', label: 'Ghi chú đơn hàng', group: 'Tổng giá trị' },

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  { key: '{cod}', label: 'Tiền thu hộ (COD)', group: 'Thông tin khác' },
  { key: '{customer_name}', label: 'Tên khách hàng', group: 'Thông tin khách hàng' },
  { key: '{customer_phone_number}', label: 'SĐT khách hàng', group: 'Thông tin khách hàng' },
  { key: '{line_variant_code}', label: 'Mã phiên bản', group: 'Chi tiết sản phẩm' },
  { key: '{line_variant}', label: 'Phiên bản sản phẩm', group: 'Chi tiết sản phẩm' },
  { key: '{order_code}', label: 'Mã đơn hàng', group: 'Thông tin đơn hàng' },
  { key: '{packing_note}', label: 'Ghi chú đóng gói', group: 'Thông tin đóng gói' },
  { key: '{shipping_address}', label: 'Địa chỉ giao hàng', group: 'Thông tin vận chuyển' },
  { key: '{total_quantity}', label: 'Tổng số lượng', group: 'Tổng kết' },
];

