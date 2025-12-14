import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu bảo hành
 * Đồng bộ với: variables/phieu-bao-hanh.ts và templates/warranty.ts
 */
export const WARRANTY_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN PHIẾU BẢO HÀNH ===
  '{warranty_code}': 'BH000111',
  '{warranty_card_code}': 'BH000111',
  '{created_on}': '05/12/2025',
  '{modified_on}': '05/12/2025',
  '{status}': 'Đang xử lý',
  '{claim_status}': 'Chờ duyệt',

  // === THÔNG TIN KHÁCH HÀNG ===
  '{customer_name}': 'Trần Thị B',
  '{customer_code}': 'KH000456',
  '{customer_phone_number}': '0987 654 321',
  '{customer_address}': '789 Nguyễn Tri Phương, Đà Nẵng',
  '{customer_address1}': '789 Nguyễn Tri Phương, Đà Nẵng',
  '{customer_group}': 'Khách thường',

  // === THÔNG TIN ĐƠN HÀNG ===
  '{order_code}': 'DH000100',

  // === THÔNG TIN SẢN PHẨM BẢO HÀNH ===
  '{product_name}': 'Điện thoại Samsung Galaxy S24 Ultra',
  '{serial_number}': 'IMEI: 352456789012345',
  '{warranty_duration}': '24 tháng',
  '{warranty_expired_on}': '05/12/2027',

  // === THÔNG TIN SẢN PHẨM LINE ===
  '{line_stt}': '1',
  '{line_product_name}': 'Điện thoại Samsung Galaxy S24 Ultra',
  '{line_variant}': '256GB - Titan Black',
  '{line_variant_name}': '256GB - Titan Black',
  '{line_variant_sku}': 'SS-S24U-256-BLK',
  '{line_variant_barcode}': '8806094598483',
  '{serials}': 'IMEI: 352456789012345',
  '{term_name}': '24 tháng',
  '{term_number}': '24',
  '{warranty_period_days}': '730',
  '{start_date}': '05/12/2025',
  '{end_date}': '05/12/2027',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{account_name}': 'Trần Văn B',
};
