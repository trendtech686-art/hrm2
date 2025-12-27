/**
 * Receipt Mapper - Phiếu thu
 * Đồng bộ với variables/phieu-thu.ts
 */

import { 
  PrintData, 
  formatCurrency, 
  numberToWords, 
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

export interface ReceiptForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  issuedAt?: string | Date;
  createdBy?: string;
  
  // Thông tin người nộp
  payerName: string;
  payerPhone?: string;
  payerAddress?: string;
  payerType?: string; // Loại người nộp (KH, NCC, Khác)
  
  // Thông tin phiếu
  groupName?: string; // Loại phiếu thu
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

export function mapReceiptToPrintData(receipt: ReceiptForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': receipt.location?.name || storeSettings.name || '',
    '{location_address}': receipt.location?.address || storeSettings.address || '',
    '{location_province}': receipt.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU THU ===
    '{receipt_voucher_code}': receipt.code,
    '{receipt_barcode}': `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(receipt.code)}" style="height:40px"/>`,
    '{created_on}': formatDate(receipt.createdAt),
    '{issued_on}': formatDate(receipt.issuedAt || receipt.createdAt),
    '{issued_on_time}': formatTime(receipt.issuedAt || receipt.createdAt),
    '{account_name}': receipt.createdBy || '',
    '{group_name}': receipt.groupName || '',
    '{counted}': receipt.counted ? 'Có' : 'Không',
    
    // === THÔNG TIN NGƯỜI NỘP ===
    '{object_name}': receipt.payerName,
    '{object_phone_number}': receipt.payerPhone || '',
    '{object_address}': receipt.payerAddress || '',
    '{object_type}': receipt.payerType || '',
    
    // === GIÁ TRỊ ===
    '{amount}': formatCurrency(receipt.amount),
    '{amount_text}': numberToWords(receipt.amount),
    '{total_text}': numberToWords(receipt.amount),
    '{payment_method_name}': receipt.paymentMethod || 'Tiền mặt',
    '{payment_method}': receipt.paymentMethod || 'Tiền mặt', // Alias for template compatibility
    '{reference}': receipt.reference || '',
    '{document_root_code}': receipt.documentRootCode || '',
    '{note}': receipt.note || '',
    '{description}': receipt.description || receipt.note || '', // Map description for template
    
    // === NỢ KHÁCH HÀNG ===
    '{customer_debt}': formatCurrency(receipt.customerDebt),
    '{customer_debt_text}': numberToWords(receipt.customerDebt || 0),
    '{customer_debt_prev}': formatCurrency(receipt.customerDebtPrev),
    '{customer_debt_prev_text}': numberToWords(receipt.customerDebtPrev || 0),
    '{customer_debt_before_create_receipt}': formatCurrency(receipt.customerDebtBefore),
    '{customer_debt_before_create_receipt_text}': numberToWords(receipt.customerDebtBefore || 0),
    '{customer_debt_after_create_receipt}': formatCurrency(receipt.customerDebtAfter),
    '{customer_debt_after_create_receipt_text}': numberToWords(receipt.customerDebtAfter || 0),
    
    // === NỢ NHÀ CUNG CẤP ===
    '{supplier_debt}': formatCurrency(receipt.supplierDebt),
    '{supplier_debt_text}': numberToWords(receipt.supplierDebt || 0),
    '{supplier_debt_prev}': formatCurrency(receipt.supplierDebtPrev),
    '{supplier_debt_prev_text}': numberToWords(receipt.supplierDebtPrev || 0),
    '{supplier_debt_before_create_receipt}': formatCurrency(receipt.supplierDebtBefore),
    '{supplier_debt_before_create_receipt_text}': numberToWords(receipt.supplierDebtBefore || 0),
    '{supplier_debt_after_create_receipt}': formatCurrency(receipt.supplierDebtAfter),
    '{supplier_debt_after_create_receipt_text}': numberToWords(receipt.supplierDebtAfter || 0),
  };
}
