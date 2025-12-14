import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu chi
 * Đồng bộ với: variables/phieu-chi.ts và templates/payment.ts
 */
export const PAYMENT_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN PHIẾU CHI ===
  '{payment_code}': 'PC000890',
  '{payment_voucher_code}': 'PC000890',
  '{created_on}': '05/12/2025',
  '{issued_on}': '05/12/2025',
  '{issued_on_time}': '14:00',
  '{counted}': 'Có',
  '{group_name}': 'Chi trả nhà cung cấp',
  '{reference}': 'PO000456',
  '{document_root_code}': 'PO000456',
  '{payment_method}': 'Chuyển khoản',
  '{payment_method_name}': 'Chuyển khoản',

  // === THÔNG TIN NGƯỜI NHẬN ===
  '{receiver_name}': 'Công ty Vận chuyển ABC',
  '{receiver_phone}': '0236 5555 666',
  '{receiver_address}': 'KCN Hòa Khánh, Đà Nẵng',
  '{object_name}': 'Công ty Vận chuyển ABC',
  '{object_phone_number}': '0236 5555 666',
  '{object_address}': 'KCN Hòa Khánh, Đà Nẵng',
  '{object_type}': 'Nhà cung cấp',
  '{supplier_name}': 'Công ty Vận chuyển ABC',
  '{supplier_code}': 'NCC002',
  '{supplier_phone_number}': '0236 5555 666',
  '{supplier_address}': 'KCN Hòa Khánh, Đà Nẵng',

  // === SỐ TIỀN ===
  '{amount}': '2,500,000',
  '{payment_amount}': '2,500,000',
  '{total_text}': 'Hai triệu năm trăm nghìn đồng chẵn',
  '{amount_text}': 'Hai triệu năm trăm nghìn đồng chẵn',

  // === LÝ DO ===
  '{reason}': 'Thanh toán phí vận chuyển',
  '{note}': 'Thanh toán phí vận chuyển tháng 11',

  // === NỢ KHÁCH HÀNG ===
  '{customer_debt}': '0',
  '{customer_debt_text}': 'Không đồng',
  '{customer_debt_prev}': '0',
  '{customer_debt_prev_text}': 'Không đồng',
  '{customer_debt_before_create_payment}': '0',
  '{customer_debt_before_create_payment_text}': 'Không đồng',
  '{customer_debt_after_create_payment}': '0',
  '{customer_debt_after_create_payment_text}': 'Không đồng',

  // === NỢ NHÀ CUNG CẤP ===
  '{supplier_debt}': '0',
  '{supplier_debt_text}': 'Không đồng',
  '{supplier_debt_prev}': '2,500,000',
  '{supplier_debt_prev_text}': 'Hai triệu năm trăm nghìn đồng',
  '{supplier_debt_before_create_payment}': '2,500,000',
  '{supplier_debt_before_create_payment_text}': 'Hai triệu năm trăm nghìn đồng',
  '{supplier_debt_after_create_payment}': '0',
  '{supplier_debt_after_create_payment_text}': 'Không đồng',
  '{debt_before}': '2,500,000',
  '{debt_after}': '0',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{payment_barcode}': '<img src="https://placehold.co/150x50?text=PC-BARCODE" alt="Barcode" style="height:50px"/>',
  '{description}': 'Thanh toán đơn hàng',
  '{account_name}': 'Trần Văn B',
};
