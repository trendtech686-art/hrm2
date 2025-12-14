import { TemplateVariable } from '../types';

export const DON_TRA_HANG_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_email}', label: 'Email cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{location_name}', label: 'Tên chi nhánh', group: 'Thông tin cửa hàng' },
  { key: '{location_address}', label: 'Địa chỉ chi nhánh', group: 'Thông tin cửa hàng' },
  { key: '{order_return_code}', label: 'Mã đơn trả', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_province}', label: 'Tỉnh thành (cửa hàng)', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },
  { key: '{location_province}', label: 'Tỉnh thành (chi nhánh)', group: 'Thông tin cửa hàng' },
  // Thông tin đơn hàng
  { key: '{customer_name}', label: 'Tên khách hàng', group: 'Thông tin đơn hàng' },
  { key: '{order_code}', label: 'Mã đơn hàng', group: 'Thông tin đơn hàng' },
  { key: '{modified_on}', label: 'Ngày cập nhật', group: 'Thông tin đơn hàng' },
  { key: '{note}', label: 'Ghi chú', group: 'Thông tin đơn hàng' },
  { key: '{reason_return}', label: 'Lý do', group: 'Thông tin đơn hàng' },
  { key: '{refund_status}', label: 'Trạng thái hoàn tiền', group: 'Thông tin đơn hàng' },
  { key: '{customer_phone_number}', label: 'SĐT khách hàng', group: 'Thông tin đơn hàng' },
  { key: '{customer_group}', label: 'Nhóm khách hàng', group: 'Thông tin đơn hàng' },
  { key: '{billing_address}', label: 'Địa chỉ gửi hóa đơn', group: 'Thông tin đơn hàng' },
  { key: '{created_on}', label: 'Ngày tạo', group: 'Thông tin đơn hàng' },
  { key: '{received_on}', label: 'Ngày nhận', group: 'Thông tin đơn hàng' },
  { key: '{reference}', label: 'Tham chiếu', group: 'Thông tin đơn hàng' },
  { key: '{status}', label: 'Trạng thái đơn trả', group: 'Thông tin đơn hàng' },
  // Thông tin giỏ hàng
  { key: '{line_stt}', label: 'STT', group: 'Thông tin giỏ hàng' },
  { key: '{line_unit}', label: 'Đơn vị tính', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant_code}', label: 'Mã phiên bản', group: 'Thông tin giỏ hàng' },
  { key: '{line_quantity}', label: 'Số lượng sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_price}', label: 'Giá bán', group: 'Thông tin giỏ hàng' },
  { key: '{line_brand}', label: 'Thương hiệu sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_product_name}', label: 'Tên hàng', group: 'Thông tin giỏ hàng' },
  { key: '{line_note}', label: 'Ghi chú sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant}', label: 'Tên phiên bản', group: 'Thông tin giỏ hàng' },
  { key: '{line_amount}', label: 'Thành tiền', group: 'Thông tin giỏ hàng' },
  { key: '{serials}', label: 'Serial', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant_options}', label: 'Thuộc tính sản phẩm', group: 'Thông tin giỏ hàng' },
  // Tổng giá trị
  { key: '{total_quantity}', label: 'Tổng số lượng', group: 'Tổng giá trị' },
  { key: '{total_amount}', label: 'Tổng tiền trả khách', group: 'Tổng giá trị' },

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  { key: '{account_name}', label: 'Người tạo', group: 'Thông tin khác' },
  { key: '{created_on_time}', label: 'Giờ tạo', group: 'Thông tin khác' },
  { key: '{customer_code}', label: 'Mã khách hàng', group: 'Thông tin khách hàng' },
  { key: '{customer_email}', label: 'Email khách hàng', group: 'Thông tin khách hàng' },
  { key: '{reason}', label: 'Lý do', group: 'Thông tin khác' },
  { key: '{return_code}', label: 'Mã đơn trả hàng', group: 'Thông tin trả hàng' },
  { key: '{total_text}', label: 'Tổng tiền bằng chữ', group: 'Tổng kết' },
];

