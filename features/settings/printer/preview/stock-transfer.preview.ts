import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu chuyển kho
 * Đồng bộ với: variables/phieu-chuyen-hang.ts và templates/stock-transfer.ts
 */
export const STOCK_TRANSFER_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN PHIẾU CHUYỂN HÀNG ===
  '{transfer_code}': 'CK000333',
  '{order_code}': 'CK000333',
  '{created_on}': '05/12/2025',
  '{created_on_time}': '08:00',
  '{modified_on}': '05/12/2025',
  '{modified_on_time}': '09:30',
  '{shipped_on}': '05/12/2025',
  '{shipped_on_time}': '09:00',
  '{received_on}': '05/12/2025',
  '{received_on_time}': '14:00',
  '{status}': 'Đã nhận',
  '{reference}': 'REF-CK-001',
  '{note}': 'Chuyển hàng bổ sung cho chi nhánh',
  '{weight_g}': '5000',
  '{weight_kg}': '5',

  // === THÔNG TIN CHI NHÁNH ===
  '{source_location_name}': 'Kho Tổng - Trụ sở chính',
  '{source_location_address}': '123 Nguyễn Văn Linh, Đà Nẵng',
  '{target_location_name}': 'Kho Chi nhánh 1 - Hải Châu',
  '{destination_location_name}': 'Kho Chi nhánh 1 - Hải Châu',
  '{destination_location_address}': '456 Lê Duẩn, Đà Nẵng',

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
  '{line_quantity}': '50',
  '{line_price}': '150,000',
  '{line_amount}': '7,500,000',
  '{line_weight_g}': '250',
  '{line_weight_kg}': '0.25',
  '{line_variant_image}': '<img src="https://placehold.co/60x60?text=SP" alt="Product" style="width:60px;height:60px"/>',
  '{serials}': 'SN001, SN002, SN003',
  '{lots_number_code1}': 'LOT2025001',
  '{lots_number_code2}': 'LOT2025001 - 50',
  '{lots_number_code3}': 'LOT2025001 - 01/12/2025 - 01/12/2026',
  '{lots_number_code4}': 'LOT2025001 - 01/12/2025 - 01/12/2026 - 50',

  // === THÔNG TIN GIỎ HÀNG ===
  '{receipt_quantity}': '50',
  '{change_quantity}': '0',
  '{line_amount_received}': '7,500,000',

  // === TỔNG GIÁ TRỊ ===
  '{total_quantity}': '50',
  '{total_amount_transfer}': '7,500,000',
  '{total_fee_amount}': '100,000',
  '{total_receipt_quantity}': '50',
  '{total_amount_receipt}': '7,500,000',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{account_name}': 'Trần Văn B',
};
