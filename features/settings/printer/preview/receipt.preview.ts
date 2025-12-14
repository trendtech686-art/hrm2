import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu thu
 * Đồng bộ với: variables/phieu-thu.ts và templates/receipt.ts
 */
export const RECEIPT_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN PHIẾU THU ===
  '{receipt_code}': 'PT000567',
  '{receipt_voucher_code}': 'PT000567',
  '{created_on}': '05/12/2025',
  '{issued_on}': '05/12/2025',
  '{issued_on_time}': '10:30',
  '{counted}': 'Có',
  '{group_name}': 'Thu tiền bán hàng',
  '{reference}': 'DH000123',
  '{document_root_code}': 'DH000123',
  '{payment_method}': 'Tiền mặt',
  '{payment_method_name}': 'Tiền mặt',

  // === THÔNG TIN NGƯỜI NỘP ===
  '{payer_name}': 'Nguyễn Văn A',
  '{payer_phone}': '0912 345 678',
  '{payer_address}': '456 Lê Duẩn, Đà Nẵng',
  '{object_name}': 'Nguyễn Văn A',
  '{object_phone_number}': '0912 345 678',
  '{object_address}': '456 Lê Duẩn, Đà Nẵng',
  '{object_type}': 'Khách hàng',
  '{customer_name}': 'Nguyễn Văn A',
  '{customer_code}': 'KH000123',
  '{customer_phone_number}': '0912 345 678',
  '{customer_address}': '456 Lê Duẩn, Đà Nẵng',

  // === SỐ TIỀN ===
  '{amount}': '5,000,000',
  '{receipt_amount}': '5,000,000',
  '{total_text}': 'Năm triệu đồng chẵn',
  '{amount_text}': 'Năm triệu đồng chẵn',

  // === LÝ DO ===
  '{reason}': 'Thanh toán tiền hàng đợt 1',
  '{note}': 'Thanh toán tiền hàng đợt 1 - Đơn hàng DH000123',

  // === NỢ KHÁCH HÀNG ===
  '{customer_debt}': '2,000,000',
  '{customer_debt_text}': 'Hai triệu đồng',
  '{customer_debt_prev}': '7,000,000',
  '{customer_debt_prev_text}': 'Bảy triệu đồng',
  '{customer_debt_before_create_receipt}': '7,000,000',
  '{customer_debt_before_create_receipt_text}': 'Bảy triệu đồng',
  '{customer_debt_after_create_receipt}': '2,000,000',
  '{customer_debt_after_create_receipt_text}': 'Hai triệu đồng',
  '{debt_before}': '7,000,000',
  '{debt_after}': '2,000,000',

  // === NỢ NHÀ CUNG CẤP ===
  '{supplier_debt}': '0',
  '{supplier_debt_text}': 'Không đồng',
  '{supplier_debt_prev}': '0',
  '{supplier_debt_prev_text}': 'Không đồng',
  '{supplier_debt_before_create_receipt}': '0',
  '{supplier_debt_before_create_receipt_text}': 'Không đồng',
  '{supplier_debt_after_create_receipt}': '0',
  '{supplier_debt_after_create_receipt_text}': 'Không đồng',

  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
  '{receipt_barcode}': '<img src="https://placehold.co/150x50?text=PT-BARCODE" alt="Barcode" style="height:50px"/>',
  '{description}': 'Thanh toán đơn hàng',
  '{account_name}': 'Trần Văn B',
};
