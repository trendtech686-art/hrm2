/**
 * Preview data for Phiếu hướng dẫn đóng gói (phieu-huong-dan-dong-goi)
 * Dữ liệu mẫu cho Phiếu hướng dẫn đóng gói hàng
 */
import { SHARED_PREVIEW_DATA } from './_shared.preview';

export const PHIEU_HUONG_DAN_DONG_GOI_PREVIEW: Record<string, string> = {
  ...SHARED_PREVIEW_DATA,

  // Thông tin phiếu hướng dẫn đóng gói
  created_on: '05/12/2024',
  list_order_code: 'DH-001234, DH-001235, DH-001236',
  account_phone: '0901 234 567',
  created_on_time: '08:30',
  account_email: 'nhanvien@company.com',

  // Thông tin giỏ hàng
  line_stt: '1',
  line_variant_sku: 'ATN-001-WH-XL',
  line_variant_barcode: '8936012345678',
  line_unit: 'Cái',
  note_of_store: 'Đóng gói cẩn thận, hàng dễ vỡ',
  line_variant_qrcode: '[QR Code]',
  line_brand: 'Fashion Brand',
  line_image: '[Ảnh sản phẩm]',
  composite_details: 'Áo thun x1, Quần jean x1',
  line_product_name: 'Áo thun nam cao cấp',
  line_variant_name: 'Trắng / XL',
  line_variant_options: 'Trắng / XL',
  line_quantity: '10',
  bin_location: 'Kệ A1-01',
  line_category: 'Áo thun',
  line_product_description: 'Áo thun nam chất liệu cotton 100%',
  lineitem_note: 'Kiểm tra kỹ size trước khi đóng gói',

  // Tổng giá trị
  total: '3,500,000',
  total_product_quantity: '15',
  order_note: 'Giao hàng trước 17h, gọi trước khi giao',
};
