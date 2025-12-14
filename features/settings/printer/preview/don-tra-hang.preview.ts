/**
 * Preview data for Đơn trả hàng (don-tra-hang)
 * Dữ liệu mẫu cho Phiếu đơn trả hàng (khách trả)
 */
import { SHARED_PREVIEW_DATA } from './_shared.preview';

export const DON_TRA_HANG_PREVIEW: Record<string, string> = {
  ...SHARED_PREVIEW_DATA,

  // Thông tin cửa hàng (bổ sung)
  order_return_code: 'DTH-2024-001234',

  // Thông tin đơn hàng
  customer_name: 'Nguyễn Văn A',
  order_code: 'DH-2024-005678',
  modified_on: '05/12/2024',
  note: 'Khách đổi size áo',
  reason_return: 'Sản phẩm không đúng size',
  refund_status: 'Đã hoàn tiền',
  customer_phone_number: '0901 234 567',
  customer_group: 'Khách VIP',
  billing_address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
  created_on: '04/12/2024',
  received_on: '05/12/2024',
  reference: 'REF-TH-001234',
  status: 'Đã hoàn thành',

  // Thông tin giỏ hàng
  line_stt: '1',
  line_unit: 'Cái',
  line_variant_code: 'ATN-001-BL-L',
  line_quantity: '2',
  line_price: '350,000',
  line_brand: 'Fashion Brand',
  line_product_name: 'Áo thun nam basic',
  line_note: 'Trả do không vừa size',
  line_variant: 'Đen / L',
  line_amount: '700,000',
  serials: 'SN-TH001, SN-TH002',
  line_variant_options: 'Đen / L',

  // Tổng giá trị
  total_quantity: '2',
  total_amount: '700,000',
};
