/**
 * Stock In Mapper - Phiếu nhập kho
 * Đồng bộ với variables/phieu-nhap-kho.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatDate,
  formatTime,
  numberToWords,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

export interface StockInForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  receivedOn?: string | Date;
  createdBy?: string;
  purchaseOrderCode?: string;
  reference?: string;
  status?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
  };
  
  // Thông tin NCC
  supplierName?: string;
  supplierCode?: string;
  supplierPhone?: string;
  supplierEmail?: string;
  supplierDebt?: number;
  supplierDebtPrev?: number;
  
  // Danh sách sản phẩm
  items: Array<{
    variantCode?: string;
    productName: string;
    variantName?: string;
    barcode?: string;
    unit?: string;
    quantity: number;
    receivedQuantity?: number;
    price: number;
    discountRate?: number;
    discountAmount?: number;
    taxRate?: number;
    taxAmount?: number;
    taxType?: string;
    amount: number;
    brand?: string;
    category?: string;
    variantOptions?: string;
    binLocation?: string;
    serial?: string;
  }>;
  
  // Tổng giá trị
  totalQuantity: number;
  total: number;
  totalPrice?: number;
  totalDiscounts?: number;
  totalTax?: number;
  totalLandedCosts?: number;
  paid?: number;
  remaining?: number;
  
  note?: string;
}

export function mapStockInToPrintData(stockIn: StockInForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': stockIn.location?.name || storeSettings.name || '',
    '{location_address}': stockIn.location?.address || storeSettings.address || '',
    '{location_province}': stockIn.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU NHẬP KHO ===
    '{receipt_code}': stockIn.code,
    '{stock_in_code}': stockIn.code,
    '{purchase_order_code}': stockIn.purchaseOrderCode || '',
    '{order_supplier_code}': stockIn.purchaseOrderCode || '',
    '{created_on}': formatDate(stockIn.createdAt),
    '{modified_on}': formatDate(stockIn.modifiedAt),
    '{received_on}': formatDate(stockIn.receivedOn),
    '{received_on_time}': formatTime(stockIn.receivedOn),
    '{account_name}': stockIn.createdBy || '',
    '{reference}': stockIn.reference || '',
    '{stock_in_status}': stockIn.status || '',
    
    // === THÔNG TIN NHÀ CUNG CẤP ===
    '{supplier_name}': stockIn.supplierName || '',
    '{supplier_code}': stockIn.supplierCode || '',
    '{supplier_phone}': stockIn.supplierPhone || '',
    '{supplier_email}': stockIn.supplierEmail || '',
    '{supplier_debt}': formatCurrency(stockIn.supplierDebt),
    '{supplier_debt_text}': numberToWords(stockIn.supplierDebt || 0),
    '{supplier_debt_prev}': formatCurrency(stockIn.supplierDebtPrev),
    '{supplier_debt_prev_text}': numberToWords(stockIn.supplierDebtPrev || 0),
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': stockIn.totalQuantity.toString(),
    '{total}': formatCurrency(stockIn.total),
    '{total_order}': formatCurrency(stockIn.total),
    '{total_price}': formatCurrency(stockIn.totalPrice || stockIn.total),
    '{total_discounts}': formatCurrency(stockIn.totalDiscounts),
    '{discount}': formatCurrency(stockIn.totalDiscounts),
    '{total_tax}': formatCurrency(stockIn.totalTax),
    '{tax_vat}': formatCurrency(stockIn.totalTax),
    '{total_landed_costs}': formatCurrency(stockIn.totalLandedCosts),
    '{total_amount_text}': numberToWords(stockIn.totalPrice || stockIn.total),
    '{paid}': formatCurrency(stockIn.paid),
    '{remaining}': formatCurrency(stockIn.remaining),
    
    '{note}': stockIn.note || '',
  };
}

export function mapStockInLineItems(items: StockInForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_variant_code}': item.variantCode || '',
    '{line_product_name}': item.productName,
    '{line_variant_name}': item.variantName || '',
    '{line_variant}': item.variantName || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_ordered_quantity}': item.quantity.toString(),
    '{line_received_quantity}': item.receivedQuantity?.toString() || '0',
    '{line_price}': formatCurrency(item.price),
    '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
    '{line_discount_amount}': formatCurrency(item.discountAmount),
    '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
    '{line_tax_amount}': formatCurrency(item.taxAmount),
    '{line_tax}': item.taxType || '',
    '{line_amount}': formatCurrency(item.amount),
    '{line_total}': formatCurrency(item.amount),
    '{line_brand}': item.brand || '',
    '{line_category}': item.category || '',
    '{line_variant_options}': item.variantOptions || '',
    '{bin_location}': item.binLocation || '',
    '{serials}': item.serial || '',
  }));
}
