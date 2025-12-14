import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu điều chỉnh giá vốn
 * Đồng bộ với: variables/phieu-dieu-chinh-gia-von.ts
 */
export const COST_ADJUSTMENT_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung (chỉ lấy thông tin cửa hàng)
  '{store_logo}': SHARED_PREVIEW_DATA['{store_logo}'],
  '{store_name}': SHARED_PREVIEW_DATA['{store_name}'],
  '{store_address}': SHARED_PREVIEW_DATA['{store_address}'],
  '{store_phone}': SHARED_PREVIEW_DATA['{store_phone}'] || '0909 123 456',
  '{account_name}': SHARED_PREVIEW_DATA['{account_name}'],
  '{print_date}': SHARED_PREVIEW_DATA['{print_date}'],
  '{print_time}': SHARED_PREVIEW_DATA['{print_time}'],

  // === THÔNG TIN PHIẾU ===
  '{adjustment_code}': 'DCGV000012',
  '{code}': 'DCGV000012',
  '{created_on}': '15/01/2025',
  '{created_on_time}': '09:30',
  '{confirmed_on}': '15/01/2025',
  '{cancelled_on}': '',
  '{status}': 'Đã xác nhận',
  '{reason}': 'Cập nhật giá nhập kho mới',
  '{note}': 'Điều chỉnh theo đợt nhập hàng T1/2025',

  // === THÔNG TIN CHI NHÁNH ===
  '{location_name}': 'Chi nhánh Quận 1',
  '{location_address}': '123 Nguyễn Huệ, Q.1, TP.HCM',
  '{location_province}': 'TP. Hồ Chí Minh',

  // === NGƯỜI XÁC NHẬN ===
  '{confirmed_by}': 'Trần Văn B',

  // === TỔNG CỘNG ===
  '{total_items}': '3',
  '{total_difference}': '850,000',
  '{total_increase}': '1,050,000',
  '{total_decrease}': '200,000',
};

/**
 * Dữ liệu mẫu line items cho preview
 */
export const COST_ADJUSTMENT_LINE_ITEMS_PREVIEW: Record<string, string>[] = [
  {
    '{line_stt}': '1',
    '{line_variant_code}': 'SP001',
    '{line_product_name}': 'Áo thun nam cotton',
    '{line_variant_name}': 'Đen - L',
    '{line_variant_barcode}': '8934567890123',
    '{line_unit}': 'Cái',
    '{line_old_price}': '120,000',
    '{line_new_price}': '150,000',
    '{line_difference}': '+30,000',
    '{line_on_hand}': '25',
    '{line_total_difference}': '750,000',
    '{line_reason}': 'Giá nhập tăng',
    '{line_brand}': 'Uniqlo',
    '{line_category}': 'Áo thun',
  },
  {
    '{line_stt}': '2',
    '{line_variant_code}': 'SP002',
    '{line_product_name}': 'Quần jean nam',
    '{line_variant_name}': 'Xanh đậm - 32',
    '{line_variant_barcode}': '8934567890456',
    '{line_unit}': 'Cái',
    '{line_old_price}': '350,000',
    '{line_new_price}': '380,000',
    '{line_difference}': '+30,000',
    '{line_on_hand}': '10',
    '{line_total_difference}': '300,000',
    '{line_reason}': 'Cập nhật giá mới',
    '{line_brand}': 'Levi\'s',
    '{line_category}': 'Quần jean',
  },
  {
    '{line_stt}': '3',
    '{line_variant_code}': 'SP003',
    '{line_product_name}': 'Áo khoác gió',
    '{line_variant_name}': 'Đỏ - XL',
    '{line_variant_barcode}': '8934567890789',
    '{line_unit}': 'Cái',
    '{line_old_price}': '450,000',
    '{line_new_price}': '430,000',
    '{line_difference}': '-20,000',
    '{line_on_hand}': '10',
    '{line_total_difference}': '-200,000',
    '{line_reason}': 'Điều chỉnh giảm',
    '{line_brand}': 'Nike',
    '{line_category}': 'Áo khoác',
  },
];
