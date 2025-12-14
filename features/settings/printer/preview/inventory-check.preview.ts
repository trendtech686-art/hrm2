import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu kiểm kho
 * Đồng bộ với: variables/phieu-kiem-hang.ts và templates/inventory-check.ts
 */
export const INVENTORY_CHECK_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN ĐƠN KIỂM ===
  '{inventory_code}': 'KK000222',
  '{code}': 'KK000222',
  '{created_on}': '05/12/2025',
  '{created_on_time}': '09:00',
  '{modified_on}': '05/12/2025',
  '{modified_on_time}': '10:30',
  '{adjusted_on}': '05/12/2025',
  '{adjusted_on_time}': '10:00',
  '{inventory_status}': 'Đã cân bằng',
  '{status}': 'Đã cân bằng',
  '{reason}': 'Kiểm kê định kỳ cuối tháng',
  '{note}': 'Kiểm kê toàn bộ kho hàng tháng 12/2025',

  // === THÔNG TIN KHO ===
  '{location_name}': 'Kho Tổng - Trụ sở chính',
  '{location_address}': '123 Nguyễn Văn Linh, Đà Nẵng',

  // === THÔNG TIN SẢN PHẨM ===
  '{line_stt}': '1',
  '{line_variant_code}': 'ATP-L-XANH',
  '{line_product_name}': 'Áo thun Polo nam',
  '{line_variant}': 'Size L - Màu xanh',
  '{line_variant_name}': 'Size L - Màu xanh',
  '{line_variant_barcode}': '8935123456789',
  '{line_variant_options}': 'Size: L, Màu: Xanh',
  '{line_brand}': 'TrendTech',
  '{line_category}': 'Áo thun nam',
  '{line_unit}': 'Cái',
  '{line_on_hand}': '100',
  '{line_stock_quantity}': '100',
  '{line_real_quantity}': '98',
  '{line_after_quantity}': '98',
  '{line_difference}': '-2',
  '{line_change_quantity}': '-2',
  '{line_note}': 'Hư hỏng do ẩm',
  '{line_reason}': 'Hư hỏng do ẩm',

  // === TỔNG KẾT ===
  '{total}': '98',
  '{total_items}': '15',
  '{total_surplus}': '3',
  '{total_shortage}': '5',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{account_name}': 'Trần Văn B',
};
