import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu giao hàng
 * Đồng bộ với: variables/phieu-giao-hang.ts và templates/delivery.ts
 */
export const DELIVERY_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN PHIẾU GIAO ===
  '{delivery_code}': 'GH000888',
  '{receipt_voucher_code}': 'GH000888',
  '{created_on}': '05/12/2025',
  '{created_on_time}': '14:00',
  '{issued_on}': '05/12/2025',
  '{issued_on_time}': '14:00',
  '{counted}': 'Có',
  '{group_name}': 'Giao hàng',
  '{reference}': 'DH000123',
  '{order_code}': 'DH000123',
  '{document_root_code}': 'DH000123',
  '{delivery_status}': 'Đang giao',
  '{status}': 'Đang giao',
  '{payment_method_name}': 'COD',

  // === THÔNG TIN KHÁCH HÀNG ===
  '{customer_name}': 'Nguyễn Văn A',
  '{customer_code}': 'KH000123',
  '{customer_phone_number}': '0912 345 678',
  '{customer_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
  '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
  '{customer_group}': 'Khách VIP',
  '{object_name}': 'Nguyễn Văn A',
  '{object_phone_number}': '0912 345 678',
  '{object_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
  '{object_type}': 'Khách hàng',

  // === THÔNG TIN SẢN PHẨM ===
  '{line_stt}': '1',
  '{line_variant_code}': 'ATP-L-XANH',
  '{line_product_name}': 'Áo thun Polo nam',
  '{line_variant}': 'Size L - Màu xanh',
  '{line_variant_name}': 'Size L - Màu xanh',
  '{line_unit}': 'Cái',
  '{line_quantity}': '2',
  '{line_price}': '250,000',
  '{line_total}': '500,000',
  '{line_amount}': '500,000',
  '{line_variant_barcode}': '8935123456789',
  '{line_brand}': 'TrendTech',
  '{line_category}': 'Áo thun nam',
  '{line_weight_g}': '250',
  '{line_weight_kg}': '0.25',
  '{line_variant_image}': '<img src="https://placehold.co/60x60?text=SP" alt="Product" style="width:60px;height:60px"/>',

  // === SỐ TIỀN ===
  '{amount}': '990,000',
  '{total_quantity}': '3',
  '{total_order}': '990,000',
  '{total_amount}': '990,000',
  '{cod}': '990,000',
  '{total_text}': 'Chín trăm chín mươi nghìn đồng',
  '{total_weight_g}': '750',
  '{total_weight_kg}': '0.75',

  // === NỢ KHÁCH HÀNG ===
  '{customer_debt}': '990,000',
  '{customer_debt_text}': 'Chín trăm chín mươi nghìn đồng',
  '{customer_debt_prev}': '0',
  '{customer_debt_prev_text}': 'Không đồng',
  '{customer_debt_before_create_receipt}': '0',
  '{customer_debt_before_create_receipt_text}': 'Không đồng',
  '{customer_debt_after_create_receipt}': '990,000',
  '{customer_debt_after_create_receipt_text}': 'Chín trăm chín mươi nghìn đồng',

  // === NỢ NHÀ CUNG CẤP ===
  '{supplier_debt}': '0',
  '{supplier_debt_text}': 'Không đồng',
  '{supplier_debt_prev}': '0',
  '{supplier_debt_prev_text}': 'Không đồng',
  '{supplier_debt_before_create_receipt}': '0',
  '{supplier_debt_before_create_receipt_text}': 'Không đồng',
  '{supplier_debt_after_create_receipt}': '0',
  '{supplier_debt_after_create_receipt_text}': 'Không đồng',

  // === NGƯỜI GỬI/NHẬN ===
  '{shipper_name}': 'Nguyễn Văn Shipper',
  '{shipper_phone_number}': '0909 888 777',

  // === GHI CHÚ ===
  '{note}': 'Giao giờ hành chính, gọi trước 30 phút',
  '{delivery_note}': 'Giao giờ hành chính, gọi trước 30 phút',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{shipment_barcode}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
  '{tracking_number}': 'VD123456789',
  '{carrier_name}': 'Giao Hàng Nhanh',
  '{receiver_name}': 'Nguyễn Văn A',
  '{receiver_phone}': '0912 345 678',
  '{total}': '500,000',
  '{delivery_fee}': '30,000',
  '{cod_amount}': '470,000',
};
