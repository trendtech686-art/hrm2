/**
 * Preview data for Phiếu yêu cầu bảo hành (phieu-yeu-cau-bao-hanh)
 * Dữ liệu mẫu cho Phiếu yêu cầu bảo hành sản phẩm
 */
import { SHARED_PREVIEW_DATA } from './_shared.preview';

export const PHIEU_YEU_CAU_BAO_HANH_PREVIEW: Record<string, string> = {
  ...SHARED_PREVIEW_DATA,

  // Thông tin phiếu yêu cầu
  warranty_claim_card_code: 'YCBH-2024-001234',
  modified_on: '05/12/2024',
  created_on: '04/12/2024',
  reference: 'Khách hàng gọi hotline báo lỗi sản phẩm',
  customer_name: 'Nguyễn Văn A',
  customer_phone_number: '0901 234 567',
  customer_address1: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  customer_group: 'Khách VIP',
  tag: 'Bảo hành, Ưu tiên',

  // Thông tin sản phẩm
  line_stt: '1',
  line_product_name: 'Điện thoại Samsung Galaxy S24',
  line_variant_name: 'Đen / 256GB',
  line_variant_sku: 'SS-S24-BK-256',
  line_variant_barcode: '8936012345999',
  serials: 'IMEI-123456789012345',
  warranty_card_code: 'PBH-2024-005678',
  line_quantity: '1',
  line_type: 'Sửa chữa',
  line_received_on: '10/12/2024',
  line_status: 'Đang xử lý',
  line_expense_title: 'Phí kiểm tra',
  line_expense_amount: '100,000',
  line_expense_total_amount: '100,000',

  // Tổng giá trị
  total_quantity: '1',
  total_amount: '100,000',
};
