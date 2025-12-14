import { TemplateVariable } from '../types';

export const PHIEU_GIAO_HANG_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_email}', label: 'Email cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_province}', label: 'Tỉnh thành (cửa hàng)', group: 'Thông tin cửa hàng' },
  { key: '{location_name}', label: 'Tên chi nhánh', group: 'Thông tin cửa hàng' },
  { key: '{location_address}', label: 'Địa chỉ chi nhánh', group: 'Thông tin cửa hàng' },
  { key: '{location_phone_number}', label: 'SĐT chi nhánh', group: 'Thông tin cửa hàng' },
  { key: '{location_province}', label: 'Tỉnh thành (chi nhánh)', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },
  
  // Thông tin phiếu giao hàng
  { key: '{delivery_code}', label: 'Mã phiếu giao hàng', group: 'Thông tin phiếu giao hàng' },
  { key: '{order_code}', label: 'Mã đơn hàng', group: 'Thông tin phiếu giao hàng' },
  { key: '{order_qr_code}', label: 'Mã đơn hàng dạng QR', group: 'Thông tin phiếu giao hàng' },
  { key: '{order_bar_code}', label: 'Mã đơn hàng dạng mã vạch', group: 'Thông tin phiếu giao hàng' },
  { key: '{created_on}', label: 'Ngày tạo', group: 'Thông tin phiếu giao hàng' },
  { key: '{created_on_time}', label: 'Thời gian tạo', group: 'Thông tin phiếu giao hàng' },
  { key: '{shipped_on}', label: 'Ngày giao hàng', group: 'Thông tin phiếu giao hàng' },
  { key: '{shipped_on_time}', label: 'Thời gian giao hàng', group: 'Thông tin phiếu giao hàng' },
  { key: '{account_name}', label: 'Người tạo phiếu', group: 'Thông tin phiếu giao hàng' },
  { key: '{shipper_name}', label: 'Nhân viên giao hàng', group: 'Thông tin phiếu giao hàng' },
  { key: '{delivery_status}', label: 'Trạng thái giao hàng', group: 'Thông tin phiếu giao hàng' },
  { key: '{note}', label: 'Ghi chú', group: 'Thông tin phiếu giao hàng' },
  
  // Thông tin vận chuyển
  { key: '{tracking_number}', label: 'Mã vận đơn', group: 'Thông tin vận chuyển' },
  { key: '{tracking_number_qr_code}', label: 'Mã vận đơn dạng QR', group: 'Thông tin vận chuyển' },
  { key: '{tracking_number_bar_code}', label: 'Mã vận đơn dạng mã vạch', group: 'Thông tin vận chuyển' },
  { key: '{shipment_barcode}', label: 'Mã vạch vận đơn', group: 'Thông tin vận chuyển' },
  { key: '{shipment_qrcode}', label: 'QR code vận đơn', group: 'Thông tin vận chuyển' },
  { key: '{carrier_name}', label: 'Đối tác vận chuyển', group: 'Thông tin vận chuyển' },
  { key: '{partner_name}', label: 'Tên đối tác', group: 'Thông tin vận chuyển' },
  { key: '{delivery_type}', label: 'Phương thức vận chuyển', group: 'Thông tin vận chuyển' },
  { key: '{service_name}', label: 'Dịch vụ vận chuyển', group: 'Thông tin vận chuyển' },
  
  // Thông tin khách hàng / Người nhận
  { key: '{customer_name}', label: 'Tên khách hàng', group: 'Thông tin người nhận' },
  { key: '{customer_code}', label: 'Mã khách hàng', group: 'Thông tin người nhận' },
  { key: '{customer_phone_number}', label: 'SĐT khách hàng', group: 'Thông tin người nhận' },
  { key: '{customer_phone_number_hide}', label: 'SĐT khách hàng - ẩn 4 số giữa', group: 'Thông tin người nhận' },
  { key: '{customer_email}', label: 'Email khách hàng', group: 'Thông tin người nhận' },
  { key: '{receiver_name}', label: 'Tên người nhận', group: 'Thông tin người nhận' },
  { key: '{receiver_phone}', label: 'SĐT người nhận', group: 'Thông tin người nhận' },
  { key: '{receiver_phone_hide}', label: 'SĐT người nhận - ẩn 4 số giữa', group: 'Thông tin người nhận' },
  { key: '{shipping_address}', label: 'Địa chỉ giao hàng', group: 'Thông tin người nhận' },
  { key: '{city}', label: 'Tỉnh/Thành phố', group: 'Thông tin người nhận' },
  { key: '{district}', label: 'Quận/Huyện', group: 'Thông tin người nhận' },
  { key: '{ward}', label: 'Phường/Xã', group: 'Thông tin người nhận' },
  
  // Thông tin sản phẩm giao
  { key: '{line_stt}', label: 'STT', group: 'Thông tin sản phẩm' },
  { key: '{line_variant_code}', label: 'Mã phiên bản', group: 'Thông tin sản phẩm' },
  { key: '{line_product_name}', label: 'Tên sản phẩm', group: 'Thông tin sản phẩm' },
  { key: '{line_variant}', label: 'Tên phiên bản', group: 'Thông tin sản phẩm' },
  { key: '{line_variant_barcode}', label: 'Mã Barcode', group: 'Thông tin sản phẩm' },
  { key: '{line_unit}', label: 'Đơn vị tính', group: 'Thông tin sản phẩm' },
  { key: '{line_quantity}', label: 'Số lượng giao', group: 'Thông tin sản phẩm' },
  { key: '{line_price}', label: 'Đơn giá', group: 'Thông tin sản phẩm' },
  { key: '{line_amount}', label: 'Thành tiền', group: 'Thông tin sản phẩm' },
  { key: '{line_weight}', label: 'Khối lượng', group: 'Thông tin sản phẩm' },
  { key: '{line_note}', label: 'Ghi chú sản phẩm', group: 'Thông tin sản phẩm' },
  { key: '{serials}', label: 'Serial', group: 'Thông tin sản phẩm' },
  { key: '{lots_number_code1}', label: 'Mã lô', group: 'Thông tin sản phẩm' },
  
  // Tổng giá trị
  { key: '{total_quantity}', label: 'Tổng số lượng giao', group: 'Tổng giá trị' },
  { key: '{total_weight}', label: 'Tổng khối lượng', group: 'Tổng giá trị' },
  { key: '{total}', label: 'Tổng tiền hàng', group: 'Tổng giá trị' },
  { key: '{delivery_fee}', label: 'Phí giao hàng', group: 'Tổng giá trị' },
  { key: '{cod_amount}', label: 'Tiền thu hộ (COD)', group: 'Tổng giá trị' },
  { key: '{cod_amount_text}', label: 'Tiền thu hộ bằng chữ', group: 'Tổng giá trị' },
  { key: '{total_amount}', label: 'Tổng cộng', group: 'Tổng giá trị' },
  { key: '{total_text}', label: 'Tổng tiền bằng chữ', group: 'Tổng giá trị' },
];

