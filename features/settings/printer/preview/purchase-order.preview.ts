import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Đơn đặt hàng nhập
 * Đồng bộ với: variables/don-dat-hang-nhap.ts và templates/purchase-order.ts
 */
export const PURCHASE_ORDER_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN ĐƠN ĐẶT HÀNG NHẬP ===
  '{po_code}': 'PO000555',
  '{order_supplier_code}': 'PO000555',
  '{status}': 'Đang nhập hàng',
  '{po_status}': 'Đang nhập hàng',
  '{created_on}': '05/12/2025',
  '{due_on}': '10/12/2025',
  '{expected_date}': '10/12/2025',
  '{completed_on}': '',
  '{ended_on}': '',
  '{cancelled_on}': '',
  '{activated_account_name}': 'Trần Văn B',
  '{weight_g}': '25000',
  '{weight_kg}': '25',
  '{note}': 'Giao hàng trong tuần',
  '{tags}': 'Nhập gấp, Hàng mới',

  // === THÔNG TIN NHÀ CUNG CẤP ===
  '{supplier_name}': 'Công ty May Mặc Việt',
  '{supplier_code}': 'NCC001',
  '{supplier_phone}': '0236 3333 444',
  '{supplier_phone_number}': '0236 3333 444',
  '{supplier_email}': 'contact@maymacviet.vn',
  '{supplier_address}': 'KCN Hòa Khánh, Đà Nẵng',
  '{supplier_debt}': '15,000,000',
  '{supplier_debt_prev}': '0',
  '{supplier_debt_text}': 'Mười lăm triệu đồng',
  '{supplier_debt_prev_text}': 'Không đồng',

  // === THÔNG TIN SẢN PHẨM ===
  '{line_stt}': '1',
  '{line_title}': 'Áo thun Polo nam - Size L - Màu xanh',
  '{line_variant_code}': 'ATP-L-XANH',
  '{line_product_name}': 'Áo thun Polo nam',
  '{line_variant}': 'Size L - Màu xanh',
  '{line_variant_name}': 'Size L - Màu xanh',
  '{line_variant_barcode}': '8935123456789',
  '{line_category}': 'Áo thun nam',
  '{line_unit}': 'Cái',
  '{line_note}': 'Hàng chất lượng cao',
  '{line_quantity}': '100',
  '{line_received_quantity}': '50',
  '{line_price}': '150,000',
  '{line_price_after_discount}': '142,500',
  '{line_discount_rate}': '5%',
  '{line_discount_amount}': '750,000',
  '{line_tax_exclude}': '142,500',
  '{line_tax_included}': '156,750',
  '{line_tax_amount}': '1,425,000',
  '{line_amount}': '15,675,000',
  '{line_total}': '15,675,000',
  '{line_weight_g}': '250',
  '{line_weight_kg}': '0.25',

  // === TỔNG GIÁ TRỊ ===
  '{total_quantity}': '100',
  '{total_line_amount}': '15,000,000',
  '{total}': '15,000,000',
  '{total_discounts}': '750,000',
  '{total_discount}': '750,000',
  '{total_discounts_rate}': '5%',
  '{total_discounts_value}': '750,000',
  '{total_tax}': '1,425,000',
  '{total_tax_included_line}': '0',
  '{total_amount_before_tax}': '14,250,000',
  '{total_amount_after_tax}': '15,675,000',
  '{total_price}': '15,675,000',
  '{total_order}': '15,675,000',
  '{total_amount}': '15,675,000',
  '{total_line_amount_text}': 'Mười lăm triệu sáu trăm bảy mươi lăm nghìn đồng',
  '{total_amount_text}': 'Mười lăm triệu sáu trăm bảy mươi lăm nghìn đồng',
  '{total_text}': 'Mười lăm triệu sáu trăm bảy mươi lăm nghìn đồng',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{line_ordered_quantity}': '10',
  '{discount}': '50,000',
  '{tax_vat}': '10%',
  '{account_name}': 'Trần Văn B',
};
