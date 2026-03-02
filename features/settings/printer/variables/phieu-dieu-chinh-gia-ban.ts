import { TemplateVariable } from '../types';

export const PHIEU_DIEU_CHINH_GIA_BAN_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },
  
  // Thông tin phiếu
  { key: '{adjustment_code}', label: 'Mã phiếu điều chỉnh', group: 'Thông tin phiếu' },
  { key: '{code}', label: 'Mã phiếu', group: 'Thông tin phiếu' },
  { key: '{pricing_policy}', label: 'Bảng giá', group: 'Thông tin phiếu' },
  { key: '{created_on}', label: 'Ngày lập', group: 'Thông tin phiếu' },
  { key: '{created_on_time}', label: 'Thời gian lập', group: 'Thông tin phiếu' },
  { key: '{confirmed_on}', label: 'Ngày xác nhận', group: 'Thông tin phiếu' },
  { key: '{cancelled_on}', label: 'Ngày hủy', group: 'Thông tin phiếu' },
  { key: '{status}', label: 'Trạng thái', group: 'Thông tin phiếu' },
  { key: '{reason}', label: 'Lý do điều chỉnh', group: 'Thông tin phiếu' },
  { key: '{note}', label: 'Ghi chú', group: 'Thông tin phiếu' },
  
  // Người lập/xác nhận
  { key: '{account_name}', label: 'Người lập phiếu', group: 'Người lập' },
  { key: '{confirmed_by}', label: 'Người xác nhận', group: 'Người lập' },
  
  // Thông tin dòng (line items)
  { key: '{line_stt}', label: 'STT', group: 'Chi tiết sản phẩm' },
  { key: '{line_product_code}', label: 'Mã SP', group: 'Chi tiết sản phẩm' },
  { key: '{line_product_name}', label: 'Tên sản phẩm', group: 'Chi tiết sản phẩm' },
  { key: '{line_old_price}', label: 'Giá cũ', group: 'Chi tiết sản phẩm' },
  { key: '{line_new_price}', label: 'Giá mới', group: 'Chi tiết sản phẩm' },
  { key: '{line_difference}', label: 'Chênh lệch', group: 'Chi tiết sản phẩm' },
  
  // Tổng cộng
  { key: '{total_items}', label: 'Tổng số sản phẩm', group: 'Tổng cộng' },
  { key: '{total_old_value}', label: 'Tổng giá cũ', group: 'Tổng cộng' },
  { key: '{total_new_value}', label: 'Tổng giá mới', group: 'Tổng cộng' },
  { key: '{total_difference}', label: 'Tổng chênh lệch', group: 'Tổng cộng' },
];
