import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu nhập kho
 * Đồng bộ với: variables/phieu-nhap-kho.ts và templates/stock-in.ts
 */
export const STOCK_IN_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN PHIẾU NHẬP KHO ===
  '{stock_in_code}': 'NK000999',
  '{receipt_code}': 'NK000999',
  '{purchase_order_code}': 'PO000555',
  '{created_on}': '05/12/2025',
  '{modified_on}': '05/12/2025',
  '{received_on}': '05/12/2025',
  '{received_on_time}': '10:00',
  '{stock_in_status}': 'Đã nhập',
  '{reference}': 'REF-NK-001',
  '{note}': 'Nhập hàng đợt 1 tháng 12',

  // === THÔNG TIN NHÀ CUNG CẤP ===
  '{supplier_name}': 'Công ty May Mặc Việt',
  '{supplier_code}': 'NCC001',
  '{supplier_phone}': '0236 3333 444',
  '{supplier_phone_number}': '0236 3333 444',
  '{supplier_email}': 'contact@maymacviet.vn',
  '{supplier_address}': 'KCN Hòa Khánh, Đà Nẵng',
  '{supplier_debt}': '15,000,000',
  '{supplier_debt_text}': 'Mười lăm triệu đồng',
  '{supplier_debt_prev}': '0',
  '{supplier_debt_prev_text}': 'Không đồng',

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
  '{line_quantity}': '100',
  '{line_price}': '150,000',
  '{line_discount_rate}': '0%',
  '{line_discount_amount}': '0',
  '{line_tax_rate}': '10%',
  '{line_tax}': 'VAT 10%',
  '{line_tax_amount}': '1,500,000',
  '{line_amount}': '16,500,000',
  '{line_total}': '16,500,000',
  '{bin_location}': 'Kệ A1-01',
  '{serials}': 'SN001 - SN100',

  // === TỔNG GIÁ TRỊ ===
  '{total_quantity}': '100',
  '{total}': '15,000,000',
  '{total_tax}': '1,500,000',
  '{total_discounts}': '0',
  '{total_discount}': '0',
  '{total_price}': '16,500,000',
  '{total_order}': '16,500,000',
  '{total_amount}': '16,500,000',
  '{total_amount_text}': 'Mười sáu triệu năm trăm nghìn đồng',
  '{total_text}': 'Mười sáu triệu năm trăm nghìn đồng',
  '{total_landed_costs}': '500,000',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{order_supplier_code}': 'PO000456',
  '{account_name}': 'Trần Văn B',
  '{line_ordered_quantity}': '10',
  '{line_received_quantity}': '10',
  '{discount}': '50,000',
  '{tax_vat}': '10%',
  '{paid}': '1,000,000',
  '{remaining}': '500,000',
};
