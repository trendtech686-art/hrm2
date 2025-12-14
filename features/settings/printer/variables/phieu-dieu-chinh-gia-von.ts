import { TemplateVariable } from '../types';

export const PHIEU_DIEU_CHINH_GIA_VON_VARIABLES: TemplateVariable[] = [
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
  { key: '{created_on}', label: 'Ngày lập', group: 'Thông tin phiếu' },
  { key: '{created_on_time}', label: 'Thời gian lập', group: 'Thông tin phiếu' },
  { key: '{confirmed_on}', label: 'Ngày xác nhận', group: 'Thông tin phiếu' },
  { key: '{cancelled_on}', label: 'Ngày hủy', group: 'Thông tin phiếu' },
  { key: '{status}', label: 'Trạng thái', group: 'Thông tin phiếu' },
  { key: '{reason}', label: 'Lý do điều chỉnh', group: 'Thông tin phiếu' },
  { key: '{note}', label: 'Ghi chú', group: 'Thông tin phiếu' },
  
  // Thông tin chi nhánh
  { key: '{location_name}', label: 'Tên chi nhánh', group: 'Chi nhánh' },
  { key: '{location_address}', label: 'Địa chỉ chi nhánh', group: 'Chi nhánh' },
  { key: '{location_province}', label: 'Tỉnh/Thành phố', group: 'Chi nhánh' },
  
  // Người lập/xác nhận
  { key: '{account_name}', label: 'Người lập phiếu', group: 'Người lập' },
  { key: '{confirmed_by}', label: 'Người xác nhận', group: 'Người lập' },
  
  // Thông tin dòng (line items)
  { key: '{line_stt}', label: 'STT', group: 'Chi tiết sản phẩm' },
  { key: '{line_variant_code}', label: 'Mã SP', group: 'Chi tiết sản phẩm' },
  { key: '{line_product_name}', label: 'Tên sản phẩm', group: 'Chi tiết sản phẩm' },
  { key: '{line_variant_name}', label: 'Tên phiên bản', group: 'Chi tiết sản phẩm' },
  { key: '{line_variant_barcode}', label: 'Mã vạch', group: 'Chi tiết sản phẩm' },
  { key: '{line_unit}', label: 'Đơn vị tính', group: 'Chi tiết sản phẩm' },
  { key: '{line_old_price}', label: 'Giá vốn cũ', group: 'Chi tiết sản phẩm' },
  { key: '{line_new_price}', label: 'Giá vốn mới', group: 'Chi tiết sản phẩm' },
  { key: '{line_difference}', label: 'Chênh lệch', group: 'Chi tiết sản phẩm' },
  { key: '{line_on_hand}', label: 'Tồn kho', group: 'Chi tiết sản phẩm' },
  { key: '{line_total_difference}', label: 'Tổng chênh lệch', group: 'Chi tiết sản phẩm' },
  { key: '{line_reason}', label: 'Lý do (dòng)', group: 'Chi tiết sản phẩm' },
  { key: '{line_brand}', label: 'Thương hiệu', group: 'Chi tiết sản phẩm' },
  { key: '{line_category}', label: 'Danh mục', group: 'Chi tiết sản phẩm' },
  
  // Tổng cộng
  { key: '{total_items}', label: 'Tổng số sản phẩm', group: 'Tổng cộng' },
  { key: '{total_difference}', label: 'Tổng chênh lệch', group: 'Tổng cộng' },
  { key: '{total_increase}', label: 'Tổng tăng giá vốn', group: 'Tổng cộng' },
  { key: '{total_decrease}', label: 'Tổng giảm giá vốn', group: 'Tổng cộng' },
];
