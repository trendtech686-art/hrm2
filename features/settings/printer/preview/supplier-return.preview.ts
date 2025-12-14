import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu trả hàng NCC
 * Đồng bộ với: variables/phieu-tra-hang-ncc.ts và templates/supplier-return.ts
 */
export const SUPPLIER_RETURN_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN PHIẾU HOÀN TRẢ ===
  '{return_supplier_code}': 'THNCC000111',
  '{refund_code}': 'THNCC000111',
  '{purchase_order_code}': 'PO000555',
  '{created_on}': '05/12/2025',
  '{modified_on}': '05/12/2025',
  '{reference}': 'REF-THNCC-001',
  '{reason_return}': 'Hàng lỗi từ nhà sản xuất - đường may không đạt chuẩn',
  '{note}': 'Hàng lỗi từ nhà sản xuất - đường may không đạt chuẩn',

  // === THÔNG TIN NHÀ CUNG CẤP ===
  '{supplier_name}': 'Công ty May Mặc Việt',
  '{supplier_code}': 'NCC001',
  '{supplier_address}': 'KCN Hòa Khánh, Đà Nẵng',
  '{supplier_address1}': 'KCN Hòa Khánh, Đà Nẵng',
  '{supplier_phone_number}': '0236 3333 444',
  '{supplier_email}': 'contact@maymacviet.vn',

  // === THÔNG TIN SẢN PHẨM ===
  '{line_stt}': '1',
  '{line_variant_code}': 'ATP-L-XANH',
  '{line_variant_sku}': 'ATP-L-XANH',
  '{line_product_name}': 'Áo thun Polo nam',
  '{line_variant}': 'Size L - Màu xanh (lỗi đường may)',
  '{line_variant_name}': 'Size L - Màu xanh (lỗi đường may)',
  '{line_variant_barcode}': '8935123456789',
  '{line_unit}': 'Cái',
  '{line_quantity}': '5',
  '{line_price}': '150,000',
  '{line_price_after_discount}': '150,000',
  '{line_discount_rate}': '0%',
  '{line_discount_amount}': '0',
  '{line_amount}': '750,000',
  '{line_total}': '750,000',
  '{line_amount_none_discount}': '750,000',
  '{tax_lines_rate}': '10%',
  '{serials}': 'SN001, SN002, SN003, SN004, SN005',
  '{lots_number_code1}': 'LOT2025001',
  '{lots_number_code2}': 'LOT2025001 - 5',
  '{lots_number_code3}': 'LOT2025001 - 01/12/2025 - 01/12/2026',
  '{lots_number_code4}': 'LOT2025001 - 01/12/2025 - 01/12/2026 - 5',

  // === TỔNG GIÁ TRỊ ===
  '{total_quantity}': '5',
  '{total_order}': '750,000',
  '{total_amount}': '750,000',
  '{total_tax}': '75,000',
  '{total_landed_costs}': '50,000',
  '{total_discounts}': '0',
  '{total_price}': '825,000',
  '{discrepancy_price}': '0',
  '{discrepancy_reason}': '',
  '{refunded}': '0',
  '{remaining}': '825,000',
  '{transaction_refund_amount}': '825,000',
  '{transaction_refund_method_name}': 'Chuyển khoản',
  '{transaction_refund_method_amount}': '825,000',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{account_name}': 'Trần Văn B',
};
