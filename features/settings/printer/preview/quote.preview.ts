import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Báo giá
 * Đồng bộ với: variables/phieu-ban-giao.ts (quote) và templates/quote.ts
 */
export const QUOTE_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN BÁO GIÁ ===
  '{quote_code}': 'BG000777',
  '{hand_over_code}': 'BG000777',
  '{created_on}': '05/12/2025',
  '{printed_on}': '05/12/2025',
  '{valid_until}': '15/12/2025',
  '{quantity}': '2',
  '{current_account_name}': 'Trần Văn B',
  '{note}': 'Báo giá có hiệu lực trong 10 ngày kể từ ngày lập',

  // === THÔNG TIN KHÁCH HÀNG ===
  '{customer_name}': 'Nguyễn Văn A',
  '{customer_code}': 'KH000123',
  '{customer_phone_number}': '0912 345 678',
  '{customer_email}': 'nguyenvana@email.com',
  '{customer_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
  '{billing_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',

  // === THÔNG TIN SẢN PHẨM ===
  '{line_stt}': '1',
  '{line_variant_code}': 'ATP-L-XANH',
  '{line_product_name}': 'Áo thun Polo nam',
  '{line_variant}': 'Size L - Màu xanh',
  '{line_unit}': 'Cái',
  '{line_quantity}': '2',
  '{line_price}': '250,000',
  '{line_discount_amount}': '25,000',
  '{line_total}': '475,000',
  '{line_amount}': '475,000',

  // === THÔNG TIN GIAO HÀNG ===
  '{shipping_provider_name}': 'Giao hàng tiết kiệm',
  '{service_name}': 'Giao hàng nhanh',
  '{freight_payer}': 'Người nhận',
  '{total_freight_amount}': '50,000',
  '{total_cod}': '990,000',
  '{city}': 'Đà Nẵng',
  '{district}': 'Hải Châu',

  // === THÔNG TIN ĐƠN HÀNG ===
  '{order_code}': 'DH000123',
  '{shipment_code}': 'GHTK123456',
  '{shipping_name}': 'Nguyễn Văn A',
  '{shipping_phone}': '0912 345 678',
  '{shipping_phone_hide}': '0912 *** 678',
  '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng',
  '{cod}': '990,000',
  '{freight_amount}': '25,000',

  // === TỔNG GIÁ TRỊ ===
  '{total_quantity}': '3',
  '{total}': '950,000',
  '{total_discount}': '50,000',
  '{total_order}': '990,000',
  '{total_amount}': '990,000',
  '{total_text}': 'Chín trăm chín mươi nghìn đồng',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{created_on_time}': '14:30',
  '{issued_on}': '05/12/2025',
  '{account_name}': 'Trần Văn B',
  '{price_list_name}': 'Bảng giá lẻ',
  '{total_tax}': '50,000',
  '{order_note}': 'Khách VIP - ưu tiên giao',
};
