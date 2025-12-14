/**
 * Supplier Return Mapper - Phiếu trả hàng NCC
 * Đồng bộ với variables/phieu-tra-hang-ncc.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatDate,
  getStoreData,
  StoreSettings
} from './types';

export interface SupplierReturnForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  createdBy?: string;
  purchaseOrderCode?: string;
  reference?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
  };
  
  // Thông tin NCC
  supplierName: string;
  supplierCode?: string;
  supplierPhone?: string;
  supplierAddress?: string;
  supplierEmail?: string;
  
  // Danh sách sản phẩm
  items: Array<{
    variantCode?: string;
    variantSku?: string;
    productName: string;
    variantName?: string;
    barcode?: string;
    unit?: string;
    quantity: number;
    price: number;
    priceAfterDiscount?: number;
    discountRate?: number;
    discountAmount?: number;
    taxRate?: number;
    amount: number;
    amountNoneDiscount?: number;
    serial?: string;
    lotNumber?: string;
    lotInfo?: string;
    lotInfoQty?: string;
    lotInfoExpiry?: string;
  }>;
  
  // Tổng giá trị
  reason?: string;
  totalQuantity: number;
  totalAmount?: number;
  totalTax?: number;
  totalLandedCosts?: number;
  totalDiscounts?: number;
  totalPrice?: number;
  discrepancyPrice?: number;
  discrepancyReason?: string;
  transactionRefundAmount?: number;
  transactionRefundMethodName?: string;
  transactionRefundMethodAmount?: number;
  remaining?: number;
}

export function mapSupplierReturnToPrintData(ret: SupplierReturnForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': ret.location?.name || storeSettings.name || '',
    '{location_address}': ret.location?.address || storeSettings.address || '',
    '{location_province}': ret.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU HOÀN TRẢ ===
    '{refund_code}': ret.code,
    '{return_supplier_code}': ret.code,
    '{created_on}': formatDate(ret.createdAt),
    '{modified_on}': formatDate(ret.modifiedAt),
    '{account_name}': ret.createdBy || '',
    '{purchase_order_code}': ret.purchaseOrderCode || '',
    '{reference}': ret.reference || '',
    
    // === THÔNG TIN NHÀ CUNG CẤP ===
    '{supplier_name}': ret.supplierName,
    '{supplier_code}': ret.supplierCode || '',
    '{supplier_phone_number}': ret.supplierPhone || '',
    '{supplier_email}': ret.supplierEmail || '',
    '{supplier_address}': ret.supplierAddress || '',
    '{supplier_address1}': ret.supplierAddress || '',
    
    // === TỔNG GIÁ TRỊ ===
    '{note}': ret.reason || '',
    '{reason_return}': ret.reason || '',
    '{total_quantity}': ret.totalQuantity.toString(),
    '{total_amount}': formatCurrency(ret.totalAmount),
    '{total_order}': formatCurrency(ret.totalAmount),
    '{total_tax}': formatCurrency(ret.totalTax),
    '{total_landed_costs}': formatCurrency(ret.totalLandedCosts),
    '{total_discounts}': formatCurrency(ret.totalDiscounts),
    '{total_price}': formatCurrency(ret.totalPrice),
    '{discrepancy_price}': formatCurrency(ret.discrepancyPrice),
    '{discrepancy_reason}': ret.discrepancyReason || '',
    '{transaction_refund_amount}': formatCurrency(ret.transactionRefundAmount),
    '{refunded}': formatCurrency(ret.transactionRefundAmount),
    '{transaction_refund_method_name}': ret.transactionRefundMethodName || '',
    '{transaction_refund_method_amount}': formatCurrency(ret.transactionRefundMethodAmount),
    '{remaining}': formatCurrency(ret.remaining),
  };
}

export function mapSupplierReturnLineItems(items: SupplierReturnForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_variant_sku}': item.variantSku || item.variantCode || '',
    '{line_variant_code}': item.variantCode || '',
    '{line_product_name}': item.productName,
    '{line_variant_name}': item.variantName || '',
    '{line_variant}': item.variantName || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_price}': formatCurrency(item.price),
    '{line_price_after_discount}': formatCurrency(item.priceAfterDiscount),
    '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
    '{line_discount_amount}': formatCurrency(item.discountAmount),
    '{tax_lines_rate}': item.taxRate ? `${item.taxRate}%` : '',
    '{line_amount}': formatCurrency(item.amount),
    '{line_total}': formatCurrency(item.amount),
    '{line_amount_none_discount}': formatCurrency(item.amountNoneDiscount),
    '{serials}': item.serial || '',
    '{lots_number_code1}': item.lotNumber || '',
    '{lots_number_code2}': item.lotInfoQty || '',
    '{lots_number_code3}': item.lotInfo || '',
    '{lots_number_code4}': item.lotInfoExpiry || '',
  }));
}
