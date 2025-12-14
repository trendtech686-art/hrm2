/**
 * Preview data for Phiếu yêu cầu đóng gói (phieu-yeu-cau-dong-goi)
 * Dữ liệu mẫu cho Phiếu yêu cầu đóng gói đơn hàng
 */
import { SHARED_PREVIEW_DATA } from './_shared.preview';

export const PHIEU_YEU_CAU_DONG_GOI_PREVIEW: Record<string, string> = {
  ...SHARED_PREVIEW_DATA,

  // Thông tin đóng gói
  code: 'DG-2024-001234',
  packed_processing_account_name: 'Nhân viên kho B',
  cancel_account_name: '',
  assignee_name: 'Nhân viên kho A',
  shipping_address: '789 Nguyễn Thị Thập, Quận 7, TP.HCM',
  customer_name: 'Nguyễn Văn A',
  customer_phone_number: '0901 234 567',
  customer_phone_number_hide: '0901 *** 567',
  customer_email: 'nguyenvana@email.com',
  status: 'Đang đóng gói',
  'bar_code(code)': '[Barcode DG-2024-001234]',
  created_on: '05/12/2024',
  created_on_time: '09:00',
  packed_on: '05/12/2024',
  packed_on_time: '10:30',
  cancel_date: '',
  ship_on_min: '06/12/2024',
  ship_on_max: '08/12/2024',
  order_code: 'DH-2024-005678',
  'bar_code(order_code)': '[Barcode DH-2024-005678]',
  order_note: 'Giao hàng trước 17h, gọi trước khi giao',

  // Thông tin giỏ hàng
  line_stt: '1',
  line_unit: 'Cái',
  line_discount_rate: '10',
  line_note: 'Kiểm tra kỹ chất lượng',
  line_quantity: '3',
  line_tax_rate: '10',
  line_variant: 'Trắng / XL',
  lots_number_code1: 'LOT-2024-001',
  lots_number_code2: 'LOT-2024-001 - 3',
  lots_number_code3: 'LOT-2024-001 - 01/12/2024 - 01/12/2025',
  lots_number_code4: 'LOT-2024-001 - 01/12/2024 - 01/12/2025 - 3',
  line_product_name: 'Áo thun nam cao cấp',
  line_tax: 'VAT 10%',
  line_discount_amount: '105,000',
  line_price: '350,000',
  line_amount: '945,000',
  line_variant_code: 'ATN-001-WH-XL',

  // Tổng giá trị
  total_quantity: '5',
  total_tax: '94,500',
  fulfillment_discount: '175,000',
  total: '1,750,000',
};
