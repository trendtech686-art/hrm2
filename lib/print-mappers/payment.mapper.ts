/**
 * Payment Mapper - Phiếu chi
 * Đồng bộ với variables/phieu-chi.ts
 */

import { 
  PrintData, 
  formatCurrency, 
  numberToWords, 
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings
} from './types';

// Helper function để tạo barcode image
function generateBarcodeImage(code: string | undefined, height = 50): string {
  if (!code) return '';
  return `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(code)}" style="height:${height}px" alt="barcode"/>`;
}

export interface PaymentForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  issuedAt?: string | Date;
  createdBy?: string;
  
  // Thông tin người nhận
  recipientName: string;
  recipientPhone?: string;
  recipientAddress?: string;
  recipientType?: string; // Loại người nhận (KH, NCC, Khác)
  
  // Thông tin phiếu
  groupName?: string; // Loại phiếu chi
  description?: string;
  amount: number;
  paymentMethod?: string;
  reference?: string;
  documentRootCode?: string; // Chứng từ gốc
  counted?: boolean; // Hạch toán KQKD
  note?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
  };
  
  // Nợ khách hàng
  customerDebtBefore?: number;
  customerDebtAfter?: number;
  customerDebt?: number;
  customerDebtPrev?: number;
  
  // Nợ nhà cung cấp
  supplierDebtBefore?: number;
  supplierDebtAfter?: number;
  supplierDebt?: number;
  supplierDebtPrev?: number;
}

export function mapPaymentToPrintData(payment: PaymentForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': payment.location?.name || storeSettings.name || '',
    '{location_address}': payment.location?.address || storeSettings.address || '',
    '{location_province}': payment.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU CHI ===
    '{payment_voucher_code}': payment.code,
    '{payment_barcode}': generateBarcodeImage(payment.code),
    '{created_on}': formatDate(payment.createdAt),
    '{issued_on}': formatDate(payment.issuedAt || payment.createdAt),
    '{issued_on_time}': formatTime(payment.issuedAt || payment.createdAt),
    '{account_name}': payment.createdBy || '',
    '{group_name}': payment.groupName || '',
    '{counted}': payment.counted ? 'Có' : 'Không',
    
    // === THÔNG TIN NGƯỜI NHẬN ===
    '{object_name}': payment.recipientName,
    '{object_phone_number}': payment.recipientPhone || '',
    '{object_address}': payment.recipientAddress || '',
    '{object_type}': payment.recipientType || '',
    
    // === GIÁ TRỊ ===
    '{amount}': formatCurrency(payment.amount),
    '{amount_text}': numberToWords(payment.amount),
    '{total_text}': numberToWords(payment.amount),
    '{payment_method_name}': payment.paymentMethod || 'Tiền mặt',
    '{payment_method}': payment.paymentMethod || 'Tiền mặt', // Alias for template compatibility
    '{reference}': payment.reference || '',
    '{document_root_code}': payment.documentRootCode || '',
    '{note}': payment.note || '',
    '{description}': payment.description || payment.note || '', // Map description for template
    
    // === NỢ KHÁCH HÀNG ===
    '{customer_debt}': formatCurrency(payment.customerDebt),
    '{customer_debt_text}': numberToWords(payment.customerDebt || 0),
    '{customer_debt_prev}': formatCurrency(payment.customerDebtPrev),
    '{customer_debt_prev_text}': numberToWords(payment.customerDebtPrev || 0),
    '{customer_debt_before_create_payment}': formatCurrency(payment.customerDebtBefore),
    '{customer_debt_before_create_payment_text}': numberToWords(payment.customerDebtBefore || 0),
    '{customer_debt_after_create_payment}': formatCurrency(payment.customerDebtAfter),
    '{customer_debt_after_create_payment_text}': numberToWords(payment.customerDebtAfter || 0),
    
    // === NỢ NHÀ CUNG CẤP ===
    '{supplier_debt}': formatCurrency(payment.supplierDebt),
    '{supplier_debt_text}': numberToWords(payment.supplierDebt || 0),
    '{supplier_debt_prev}': formatCurrency(payment.supplierDebtPrev),
    '{supplier_debt_prev_text}': numberToWords(payment.supplierDebtPrev || 0),
    '{supplier_debt_before_create_payment}': formatCurrency(payment.supplierDebtBefore),
    '{supplier_debt_before_create_payment_text}': numberToWords(payment.supplierDebtBefore || 0),
    '{supplier_debt_after_create_payment}': formatCurrency(payment.supplierDebtAfter),
    '{supplier_debt_after_create_payment_text}': numberToWords(payment.supplierDebtAfter || 0),
  };
}
