import { TemplateVariable } from '../types';

export const PHIEU_KIEM_HANG_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_email}', label: 'Email cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{location_address}', label: 'Địa chỉ chi nhánh', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_province}', label: 'Tỉnh thành (cửa hàng)', group: 'Thông tin cửa hàng' },
  { key: '{location_name}', label: 'Tên chi nhánh', group: 'Thông tin cửa hàng' },
  { key: '{location_province}', label: 'Tỉnh thành (chi nhánh)', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },
  // Thông tin đơn kiểm
  { key: '{code}', label: 'Mã code', group: 'Thông tin đơn kiểm' },
  { key: '{modified_on}', label: 'Ngày cập nhật', group: 'Thông tin đơn kiểm' },
  { key: '{note}', label: 'Ghi chú', group: 'Thông tin đơn kiểm' },
  { key: '{modified_on_time}', label: 'Thời gian cập nhật', group: 'Thông tin đơn kiểm' },
  { key: '{adjusted_on_time}', label: 'Thời gian kiểm hàng', group: 'Thông tin đơn kiểm' },
  { key: '{created_on}', label: 'Ngày tạo', group: 'Thông tin đơn kiểm' },
  { key: '{reason}', label: 'Lý do', group: 'Thông tin đơn kiểm' },
  { key: '{adjusted_on}', label: 'Ngày kiểm hàng', group: 'Thông tin đơn kiểm' },
  { key: '{created_on_time}', label: 'Thời gian tạo', group: 'Thông tin đơn kiểm' },
  { key: '{status}', label: 'Trạng thái kiểm hàng', group: 'Thông tin đơn kiểm' },
  // Thông tin giỏ hàng
  { key: '{line_stt}', label: 'STT', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant_code}', label: 'Mã phiên bản sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_after_quantity}', label: 'Số lượng sau kiểm', group: 'Thông tin giỏ hàng' },
  { key: '{line_stock_quantity}', label: 'Tồn kho', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant_barcode}', label: 'Mã Barcode', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant_options}', label: 'Thuộc tính sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_brand}', label: 'Thương hiệu sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_product_name}', label: 'Tên sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_variant_name}', label: 'Tên phiên bản sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_change_quantity}', label: 'Số lượng chênh lệch', group: 'Thông tin giỏ hàng' },
  { key: '{line_reason}', label: 'Lý do từng mặt hàng', group: 'Thông tin giỏ hàng' },
  { key: '{line_category}', label: 'Loại sản phẩm', group: 'Thông tin giỏ hàng' },
  { key: '{line_unit}', label: 'Đơn vị tính', group: 'Thông tin giỏ hàng' },
  // Tổng giá trị
  { key: '{total}', label: 'Tổng số lượng', group: 'Tổng giá trị' },

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  { key: '{account_name}', label: 'Người tạo', group: 'Thông tin khác' },
  { key: '{inventory_code}', label: 'Mã phiếu kiểm kho', group: 'Thông tin kiểm kho' },
  { key: '{inventory_status}', label: 'Trạng thái kiểm kho', group: 'Thông tin kiểm kho' },
  { key: '{line_difference}', label: 'Chênh lệch', group: 'Chi tiết sản phẩm' },
  { key: '{line_note}', label: 'Ghi chú sản phẩm', group: 'Chi tiết sản phẩm' },
  { key: '{line_on_hand}', label: 'Tồn kho hiện tại', group: 'Chi tiết sản phẩm' },
  { key: '{line_real_quantity}', label: 'Số lượng thực tế', group: 'Chi tiết sản phẩm' },
  { key: '{line_variant}', label: 'Phiên bản sản phẩm', group: 'Chi tiết sản phẩm' },
  { key: '{total_items}', label: 'Tổng số mặt hàng', group: 'Tổng kết' },
  { key: '{total_shortage}', label: 'Tổng thiếu', group: 'Tổng kết' },
  { key: '{total_surplus}', label: 'Tổng thừa', group: 'Tổng kết' },
];

