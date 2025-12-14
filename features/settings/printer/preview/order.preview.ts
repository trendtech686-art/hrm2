import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Đơn bán hàng
 * Đồng bộ với: variables/don-ban-hang.ts (~150 từ khóa)
 */
export const ORDER_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN ĐƠN HÀNG ===
  '{order_code}': 'DH000123',
  '{order_qr_code}': '<img src="https://placehold.co/100x100?text=QR" alt="QR" style="width:100px;height:100px"/>',
  '{bar_code(code)}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
  '{created_on}': '05/12/2025',
  '{created_on_time}': '10:30',
  '{created_on_text}': 'Ngày 05 tháng 12 năm 2025',
  '{modified_on}': '05/12/2025',
  '{modified_on_time}': '14:20',
  '{issued_on}': '05/12/2025',
  '{issued_on_time}': '10:30',
  '{issued_on_text}': 'Ngày 05 tháng 12 năm 2025',
  '{shipped_on}': '06/12/2025',
  '{ship_on_min}': '06/12/2025',
  '{ship_on_max}': '08/12/2025',
  '{source}': 'Website',
  '{channel}': 'Online',
  '{reference}': 'REF-2025-001',
  '{bar_code(reference_number)}': '<img src="https://placehold.co/150x50?text=REF-CODE" alt="Ref Barcode" style="height:50px"/>',
  '{tag}': 'VIP, Ưu tiên',
  '{currency_name}': 'VND',
  '{tax_treatment}': 'Giá đã bao gồm thuế',
  '{price_list_name}': 'Bảng giá lẻ',
  '{expected_payment_method}': 'COD',
  '{expected_delivery_type}': 'Giao hàng nhanh',
  '{weight_g}': '500',
  '{weight_kg}': '0.5',

  // === TRẠNG THÁI ===
  '{order_status}': 'Đang giao dịch',
  '{payment_status}': 'Chưa thanh toán',
  '{fulfillment_status}': 'Chờ đóng gói',
  '{packed_status}': 'Chưa đóng gói',
  '{return_status}': 'Không trả',

  // === THÔNG TIN KHÁCH HÀNG ===
  '{customer_name}': 'Nguyễn Văn A',
  '{customer_code}': 'KH00456',
  '{customer_phone_number}': '0912 345 678',
  '{customer_phone_number_hide}': '0912 *** 678',
  '{customer_email}': 'nguyenvana@email.com',
  '{customer_group}': 'Khách VIP',
  '{customer_card}': 'Thẻ Vàng',
  '{customer_contact}': 'Nguyễn Văn A',
  '{customer_contact_phone_number}': '0912 345 678',
  '{customer_contact_phone_number_hide}': '0912 *** 678',
  '{customer_tax_number}': '0123456789',
  '{billing_address}': '456 Lê Duẩn, Đà Nẵng',
  '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
  '{shipping_address:full_name}': 'Nguyễn Văn A',
  '{shipping_address:phone_number}': '0912 345 678',
  '{shipping_address:phone_number_hide}': '0912 *** 678',

  // === ĐIỂM TÍCH LŨY ===
  '{customer_point}': '1,500',
  '{customer_point_used}': '100',
  '{customer_point_new}': '50',
  '{customer_point_before_create_invoice}': '1,550',
  '{customer_point_after_create_invoice}': '1,500',

  // === NỢ KHÁCH HÀNG ===
  '{customer_debt}': '2,000,000',
  '{customer_debt_text}': 'Hai triệu đồng',
  '{customer_debt_prev}': '1,000,000',
  '{customer_debt_prev_text}': 'Một triệu đồng',
  '{debt_before_create_invoice}': '1,000,000',
  '{debt_before_create_invoice_text}': 'Một triệu đồng',
  '{debt_after_create_invoice}': '2,000,000',
  '{debt_after_create_invoice_text}': 'Hai triệu đồng',
  '{total_amount_and_debt_before_create_invoice}': '1,990,000',
  '{total_amount_and_debt_before_create_invoice_text}': 'Một triệu chín trăm chín mươi nghìn đồng',

  // === THÔNG TIN SẢN PHẨM (LINE ITEMS) ===
  '{line_stt}': '1',
  '{line_product_name}': 'Áo thun Polo nam',
  '{line_variant}': 'Size L - Màu xanh',
  '{line_variant_code}': 'ATP-L-XANH',
  '{line_variant_barcode}': '8935123456789',
  '{line_variant_barcode_image}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
  '{line_variant_options}': 'Size: L, Màu: Xanh',
  '{line_image}': '<img src="https://placehold.co/60x60?text=SP" alt="Product" style="width:60px;height:60px"/>',
  '{line_unit}': 'Cái',
  '{line_quantity}': '2',
  '{line_price}': '250,000',
  '{line_price_after_discount}': '237,500',
  '{line_price_discount}': '237,500',
  '{line_discount_rate}': '5%',
  '{line_discount_amount}': '25,000',
  '{line_tax_rate}': '10%',
  '{line_tax_amount}': '47,500',
  '{line_tax_included}': 'Có',
  '{line_tax_exclude}': '225,000',
  '{line_amount}': '475,000',
  '{line_amount_none_discount}': '500,000',
  '{line_note}': 'Size vừa vặn',
  '{line_brand}': 'TrendTech',
  '{line_category}': 'Áo thun nam',
  '{line_product_description}': 'Áo thun Polo nam cao cấp, chất liệu cotton 100%',
  '{line_promotion_or_loyalty}': 'Hàng KM',
  '{line_weight_g}': '250',
  '{line_weight_kg}': '0.25',

  // === LINE ITEMS - BẢO HÀNH ===
  '{term_name}': '12 tháng',
  '{term_number}': '12',
  '{term_name_combo}': '6 tháng',
  '{term_number_combo}': '6',

  // === LINE ITEMS - LÔ HÀNG ===
  '{lots_number_code1}': 'LOT2025001',
  '{lots_number_code2}': 'LOT2025001 - 2',
  '{lots_number_code3}': 'LOT2025001 - 01/12/2025 - 01/12/2026',
  '{lots_number_code4}': 'LOT2025001 - 01/12/2025 - 01/12/2026 - 2',
  '{lots_number_combo}': 'LOT-COMBO-001',

  // === LINE ITEMS - KHÁC ===
  '{composite_details}': 'Áo x1, Quần x1',
  '{packsizes}': 'Thùng 10 cái',
  '{bin_location}': 'Kệ A1-01',
  '{serials}': 'SN001, SN002',
  '{total_line_item_discount}': '25,000',

  // === TỔNG GIÁ TRỊ ===
  '{total_quantity}': '3',
  '{total}': '950,000',
  '{total_none_discount}': '1,000,000',
  '{total_discount}': '50,000',
  '{product_discount}': '25,000',
  '{order_discount}': '25,000',
  '{order_discount_rate}': '2.5%',
  '{order_discount_value}': '25,000',
  '{discount_details}': 'CK sản phẩm: 25,000; CK đơn hàng: 25,000',
  '{total_tax}': '90,000',
  '{total_extra_tax}': '15,000',
  '{total_tax_included_line}': '75,000',
  '{total_amount_before_tax}': '900,000',
  '{total_amount_after_tax}': '990,000',
  '{delivery_fee}': '0',
  '{total_amount}': '990,000',
  '{total_text}': 'Chín trăm chín mươi nghìn đồng',
  '{total_remain}': '990,000',
  '{total_remain_text}': 'Chín trăm chín mươi nghìn đồng',

  // === THANH TOÁN ===
  '{payment_name}': 'Tiền mặt',
  '{payments}': 'Tiền mặt: 990,000',
  '{payment_qr}': '<img src="https://placehold.co/120x120?text=QR-PAY" alt="QR Payment" style="width:120px;height:120px"/>',
  '{payment_customer}': '1,000,000',
  '{money_return}': '10,000',

  // === KHUYẾN MẠI ===
  '{promotion_name}': 'Khuyến mãi cuối năm',
  '{promotion_code}': 'CUOINAM2025',

  // === GHI CHÚ ===
  '{order_note}': 'Giao hàng trước 5h chiều',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{account_name}': 'Trần Văn B',
};
