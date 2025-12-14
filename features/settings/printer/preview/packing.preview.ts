import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu đóng gói
 * Đồng bộ với: variables/phieu-dong-goi.ts và templates/packing.ts
 */
export const PACKING_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN GÓI HÀNG ===
  '{packing_code}': 'DG000123',
  '{order_code}': 'DH000123',
  '{created_on}': '05/12/2025',
  '{created_on_time}': '10:00',
  '{modified_on}': '05/12/2025',
  '{modified_on_time}': '10:30',
  '{packed_on}': '05/12/2025',
  '{packed_on_time}': '10:15',
  '{shipped_on}': '',
  '{shipped_on_time}': '',
  '{packing_status}': 'Đã đóng gói',
  '{fulfillment_status}': 'Đã đóng gói',
  '{package_note}': 'Gói kỹ, hàng dễ nhăn',
  '{order_note}': 'Giao hàng trước 5h chiều',
  '{note}': 'Gói kỹ, hàng dễ nhăn',

  // === THÔNG TIN KHÁCH HÀNG ===
  '{customer_name}': 'Nguyễn Văn A',
  '{customer_code}': 'KH000123',
  '{customer_phone_number}': '0912 345 678',
  '{customer_phone_number_hide}': '0912 *** 678',
  '{customer_email}': 'nguyenvana@email.com',
  '{customer_address}': '456 Lê Duẩn, Đà Nẵng',
  '{billing_address}': '456 Lê Duẩn, Đà Nẵng',
  '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng',

  // === THÔNG TIN SẢN PHẨM ===
  '{line_stt}': '1',
  '{line_variant_code}': 'ATP-L-XANH',
  '{line_product_name}': 'Áo thun Polo nam',
  '{line_variant}': 'Size L - Màu xanh',
  '{line_variant_barcode}': '8935123456789',
  '{line_variant_options}': 'Size: L, Màu: Xanh',
  '{line_product_category}': 'Áo thun nam',
  '{line_product_brand}': 'TrendTech',
  '{line_unit}': 'Cái',
  '{line_quantity}': '2',
  '{line_price}': '250,000',
  '{line_price_after_discount}': '237,500',
  '{line_discount_rate}': '5%',
  '{line_discount_amount}': '25,000',
  '{line_tax_rate}': '10%',
  '{line_tax}': 'VAT 10%',
  '{line_tax_amount}': '47,500',
  '{line_tax_included}': 'Có',
  '{line_tax_exclude}': '225,000',
  '{line_amount}': '475,000',
  '{line_total}': '475,000',
  '{line_note}': 'Size vừa vặn',
  '{line_composite_variant_code}': '',
  '{line_composite_variant_name}': '',
  '{line_composite_unit}': '',
  '{line_composite_quantity}': '',
  '{serials}': 'SN001, SN002',
  '{lots_number_code1}': 'LOT2025001',
  '{lots_number_code2}': 'LOT2025001 - 2',
  '{lots_number_code3}': 'LOT2025001 - 01/12/2025 - 01/12/2026',
  '{lots_number_code4}': 'LOT2025001 - 01/12/2025 - 01/12/2026 - 2',

  // === TỔNG GIÁ TRỊ ===
  '{total_quantity}': '3',
  '{total}': '950,000',
  '{total_tax}': '90,000',
  '{total_amount_before_tax}': '900,000',
  '{total_amount_after_tax}': '990,000',
  '{total_amount}': '990,000',
  '{total_order}': '990,000',
  '{fulfillment_discount}': '50,000',
  '{total_amount_text}': 'Chín trăm chín mươi nghìn đồng',
  '{total_extra_tax}': '15,000',
  '{total_tax_included_line}': '75,000',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{fulfillment_code}': 'FUL000123',
  '{assigned_employee}': 'Nguyễn Thị C',
  '{bin_location}': 'Kệ A1-02',
  '{cod}': '470,000',
  '{packing_note}': 'Đóng gói cẩn thận',
  '{account_name}': 'Trần Văn B',
};
