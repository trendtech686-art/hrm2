import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Nhãn giao hàng
 * Đồng bộ với: variables/nhan-giao-hang.ts
 */
export const SHIPPING_LABEL_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN ĐƠN HÀNG ===
  '{order_code}': 'DH000123',
  '{order_qr_code}': '<img src="https://placehold.co/80x80?text=QR" alt="QR" style="width:80px;height:80px"/>',
  '{order_bar_code}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
  '{created_on}': '05/12/2025',
  '{created_on_time}': '10:00',
  '{modified_on}': '05/12/2025',
  '{modified_on_time}': '10:30',
  '{received_on}': '',
  '{received_on_time}': '',
  '{packed_on}': '05/12/2025',
  '{packed_on_time}': '10:15',
  '{shipped_on_time}': '',
  '{status}': 'Chờ giao',
  '{pushing_status}': 'Đã đẩy đơn',

  // === THÔNG TIN VẬN CHUYỂN ===
  '{tracking_number}': 'GHTK123456789',
  '{tracking_number_qr_code}': '<img src="https://placehold.co/80x80?text=QR-VD" alt="QR" style="width:80px;height:80px"/>',
  '{tracking_number_bar_code}': '<img src="https://placehold.co/150x50?text=VD-CODE" alt="Barcode" style="height:50px"/>',
  '{delivery_type}': 'Giao hàng nhanh',
  '{delivery_service_provider}': 'Giao hàng tiết kiệm',
  '{service_name}': 'Giao hàng nhanh',
  '{partner_type}': 'Đối tác vận chuyển',
  '{partner_phone_number}': '1900 636 636',
  '{packing_weight}': '0.5 kg',
  '{creator_name}': 'Trần Văn B',
  '{route_code_se}': 'DN-HC-001',
  '{sorting_code}': 'BC001',
  '{sorting_code_bar_code}': '<img src="https://placehold.co/150x50?text=BC001" alt="Barcode" style="height:50px"/>',

  // === VNPOST ===
  '{vnpost_crm_code}': 'CRM123456',
  '{vnpost_crm_bar_code}': '<img src="https://placehold.co/150x50?text=CRM" alt="Barcode" style="height:50px"/>',

  // === THÔNG TIN KHÁCH HÀNG ===
  '{customer_name}': 'NGUYỄN VĂN A',
  '{customer_phone_number}': '0912 345 678',
  '{customer_phone_number_hide}': '0912 *** 678',
  '{customer_email}': 'nguyenvana@email.com',
  '{receiver_name}': 'NGUYỄN VĂN A',
  '{receiver_phone}': '0912 345 678',
  '{receiver_phone_hide}': '0912 *** 678',
  '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng',
  '{billing_address}': '456 Lê Duẩn, Đà Nẵng',
  '{city}': 'Đà Nẵng',
  '{district}': 'Hải Châu',
  '{ship_on_min}': '06/12/2025',
  '{ship_on_max}': '08/12/2025',
  '{shipper_deposits}': '0',
  '{reason_cancel}': '',

  // === TỔNG GIÁ TRỊ ===
  '{total_quantity}': '3',
  '{total}': '950,000',
  '{total_tax}': '90,000',
  '{delivery_fee}': '30,000',
  '{cod_amount}': '990,000',
  '{total_amount}': '990,000',
  '{fulfillment_discount}': '50,000',
  '{freight_amount}': '25,000',
  '{shipment_note}': 'Hàng dễ vỡ - Xin nhẹ tay',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{shipment_barcode}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
  '{shipment_code}': 'VD123456789',
  '{total_weight_g}': '500',
  '{cod}': '470,000',
  '{note}': 'Gọi trước khi giao',
  '{shipment_qrcode}': '<img src="https://placehold.co/100x100?text=QR" alt="QR" style="width:100px"/>',
  '{total_weight_kg}': '0.5',
};
