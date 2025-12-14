import { TemplateVariable } from '../types';

export const PHIEU_BAO_HANH_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_email}', label: 'Email cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{location_name}', label: 'Tên chi nhánh', group: 'Thông tin cửa hàng' },
  { key: '{location_address}', label: 'Địa chỉ chi nhánh', group: 'Thông tin cửa hàng' },
  { key: '{store_province}', label: 'Tỉnh thành (cửa hàng)', group: 'Thông tin cửa hàng' },
  { key: '{location_province}', label: 'Tỉnh thành (chi nhánh)', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },
  // Thông tin phiếu bảo hành
  { key: '{account_name}', label: 'Tên nhân viên tạo', group: 'Thông tin phiếu bảo hành' },
  { key: '{warranty_card_code}', label: 'Mã phiếu bảo hành', group: 'Thông tin phiếu bảo hành' },
  { key: '{modified_on}', label: 'Ngày cập nhật', group: 'Thông tin phiếu bảo hành' },
  { key: '{created_on}', label: 'Ngày tạo', group: 'Thông tin phiếu bảo hành' },
  { key: '{status}', label: 'Trạng thái', group: 'Thông tin phiếu bảo hành' },
  { key: '{customer_name}', label: 'Tên khách hàng', group: 'Thông tin phiếu bảo hành' },
  { key: '{customer_phone_number}', label: 'SĐT khách hàng', group: 'Thông tin phiếu bảo hành' },
  { key: '{customer_address1}', label: 'Địa chỉ khách hàng', group: 'Thông tin phiếu bảo hành' },
  { key: '{customer_group}', label: 'Nhóm khách hàng', group: 'Thông tin phiếu bảo hành' },
  { key: '{order_code}', label: 'Mã đơn hàng', group: 'Thông tin phiếu bảo hành' },
  { key: '{claim_status}', label: 'Trạng thái yêu cầu', group: 'Thông tin phiếu bảo hành' },
  // Thông tin sản phẩm
  { key: '{line_stt}', label: 'STT', group: 'Thông tin sản phẩm' },
  { key: '{line_product_name}', label: 'Tên sản phẩm', group: 'Thông tin sản phẩm' },
  { key: '{line_variant_name}', label: 'Tên phiên bản sản phẩm', group: 'Thông tin sản phẩm' },
  { key: '{line_variant_sku}', label: 'Mã SKU', group: 'Thông tin sản phẩm' },
  { key: '{line_variant_barcode}', label: 'Mã Barcode', group: 'Thông tin sản phẩm' },
  { key: '{serials}', label: 'Mã serial', group: 'Thông tin sản phẩm' },
  { key: '{term_name}', label: 'Tên chính sách bảo hành', group: 'Thông tin sản phẩm' },
  { key: '{term_number}', label: 'Thời hạn bảo hành', group: 'Thông tin sản phẩm' },
  { key: '{warranty_period_days}', label: 'Thời hạn bảo hành quy ra ngày', group: 'Thông tin sản phẩm' },
  { key: '{start_date}', label: 'Ngày bắt đầu', group: 'Thông tin sản phẩm' },
  { key: '{end_date}', label: 'Ngày hết hạn', group: 'Thông tin sản phẩm' },

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  { key: '{customer_address}', label: 'Địa chỉ khách hàng', group: 'Thông tin khách hàng' },
  { key: '{product_name}', label: 'Tên sản phẩm', group: 'Thông tin khác' },
  { key: '{serial_number}', label: 'Số serial', group: 'Thông tin khác' },
  { key: '{warranty_code}', label: 'Mã phiếu bảo hành', group: 'Thông tin bảo hành' },
  { key: '{warranty_duration}', label: 'Thời hạn bảo hành', group: 'Thông tin bảo hành' },
  { key: '{warranty_expired_on}', label: 'Ngày hết bảo hành', group: 'Thông tin bảo hành' },
];

