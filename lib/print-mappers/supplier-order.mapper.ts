/**
 * Supplier Order Mapper - Đơn đặt hàng nhập (don-dat-hang-nhap)
 * Đồng bộ với variables/don-dat-hang-nhap.ts
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
} from './types';

export interface SupplierOrderForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedOn?: string | Date;
  receivedOn?: string | Date;
  dueOn?: string | Date;
  completedOn?: string | Date;
  endedOn?: string | Date;
  cancelledOn?: string | Date;
  
  reference?: string;
  billingAddress?: string;
  
  // Nhân viên
  createdBy?: string;
  assigneeName?: string;
  
  // Trạng thái
  status?: string;
  receivedStatus?: string;
  financialStatus?: string;
  refundStatus?: string;
  refundTransactionStatus?: string;
  
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
  supplierEmail?: string;
  supplierAddress?: string;
  
  // Nợ NCC
  supplierDebt?: number;
  supplierDebtPrev?: number;
  
  // Khối lượng
  totalWeightG?: number;
  totalWeightKg?: number;
  
  // Tags
  tags?: string[];
  
  // Danh sách sản phẩm
  items: Array<{
    variantCode?: string;
    productName: string;
    variantName?: string;
    variantOptions?: string;
    title?: string;
    barcode?: string;
    brand?: string;
    unit?: string;
    quantity: number;
    receivedQuantity?: number;
    price: number;
    priceAfterDiscount?: number;
    discountRate?: number;
    discountAmount?: number;
    taxRate?: number;
    taxAmount?: number;
    taxType?: string;
    taxIncluded?: number;
    taxExclude?: number;
    amount: number;
    category?: string;
    weightG?: number;
    weightKg?: number;
    note?: string;
    serials?: string[];
    lots?: string[];
  }>;
  
  // Tổng giá trị
  totalQuantity: number;
  totalPrice: number;
  totalLineAmount?: number;
  totalTax?: number;
  totalExtraTax?: number;
  totalDiscounts?: number;
  totalDiscountsRate?: number;
  totalDiscountsValue?: number;
  totalTaxIncludedLine?: number;
  totalAmountBeforeTax?: number;
  totalAmountAfterTax?: number;
  
  totalTransactionAmount?: number;
  totalRemain?: number;
  totalAmountTransaction?: number;
  totalLandedCosts?: number;
  productDiscount?: number;
  
  payments?: Array<{
    code: string;
    amount: number;
    method: string;
    date: string | Date;
  }>;
  
  note?: string;
}

export function mapSupplierOrderToPrintData(order: SupplierOrderForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': order.location?.name || storeSettings.name || '',
    '{location_address}': order.location?.address || storeSettings.address || '',
    '{location_province}': order.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN ĐƠN ĐẶT HÀNG NHẬP ===
    '{order_supplier_code}': order.code,
    '{purchase_order_code}': order.code,
    '{code}': order.code,
    '{status}': order.status || '',
    '{received_status}': order.receivedStatus || '',
    '{financial_status}': order.financialStatus || '',
    '{refund_status}': order.refundStatus || '',
    '{refund_transaction_status}': order.refundTransactionStatus || '',
    
    '{created_on}': formatDate(order.createdAt),
    '{created_on_time}': formatTime(order.createdAt),
    '{modified_on}': formatDate(order.modifiedOn),
    '{modified_on_time}': formatTime(order.modifiedOn),
    '{received_on}': formatDate(order.receivedOn),
    '{received_on_time}': formatTime(order.receivedOn),
    '{due_on}': formatDate(order.dueOn),
    '{due_on_time}': formatTime(order.dueOn),
    '{completed_on}': formatDate(order.completedOn),
    '{ended_on}': formatDate(order.endedOn),
    '{cancelled_on}': formatDate(order.cancelledOn),
    
    '{activated_account_name}': order.createdBy || '',
    '{account_name}': order.createdBy || '',
    '{assignee_name}': order.assigneeName || '',
    '{reference}': order.reference || '',
    '{billing_address}': order.billingAddress || '',
    
    // === THÔNG TIN NHÀ CUNG CẤP ===
    '{supplier_name}': order.supplierName,
    '{supplier_code}': order.supplierCode || '',
    '{supplier_phone}': order.supplierPhone || '',
    '{supplier_phone_number}': order.supplierPhone || '',
    '{supplier_email}': order.supplierEmail || '',
    '{supplier_address}': order.supplierAddress || '',
    
    // === NỢ NCC ===
    '{supplier_debt}': formatCurrency(order.supplierDebt),
    '{supplier_debt_text}': numberToWords(order.supplierDebt || 0),
    '{supplier_debt_prev}': formatCurrency(order.supplierDebtPrev),
    '{supplier_debt_prev_text}': numberToWords(order.supplierDebtPrev || 0),
    
    // === KHỐI LƯỢNG ===
    '{weight_g}': order.totalWeightG?.toString() || '0',
    '{weight_kg}': order.totalWeightKg?.toString() || '0',
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': order.totalQuantity.toString(),
    '{total_price}': formatCurrency(order.totalPrice),
    '{total}': formatCurrency(order.totalPrice),
    '{total_order}': formatCurrency(order.totalPrice),
    '{total_line_amount}': formatCurrency(order.totalLineAmount),
    '{total_line_amount_text}': numberToWords(order.totalLineAmount || 0),
    '{total_tax}': formatCurrency(order.totalTax),
    '{total_extra_tax}': formatCurrency(order.totalExtraTax),
    '{tax_vat}': formatCurrency(order.totalTax),
    '{total_discounts}': formatCurrency(order.totalDiscounts),
    '{discount}': formatCurrency(order.totalDiscounts),
    '{product_discount}': formatCurrency(order.productDiscount),
    '{total_discounts_rate}': order.totalDiscountsRate ? `${order.totalDiscountsRate}%` : '',
    '{total_discounts_value}': formatCurrency(order.totalDiscountsValue),
    '{total_tax_included_line}': formatCurrency(order.totalTaxIncludedLine),
    '{total_amount_before_tax}': formatCurrency(order.totalAmountBeforeTax),
    '{total_amount_after_tax}': formatCurrency(order.totalAmountAfterTax),
    '{total_amount_text}': numberToWords(order.totalPrice),
    
    '{total_transaction_amount}': formatCurrency(order.totalTransactionAmount),
    '{total_remain}': formatCurrency(order.totalRemain),
    '{total_amount_transaction}': formatCurrency(order.totalAmountTransaction),
    '{total_landed_costs}': formatCurrency(order.totalLandedCosts),
    
    '{payments}': order.payments?.map(p => `${formatDate(p.date)}: ${formatCurrency(p.amount)} (${p.method})`).join(', ') || '',
    
    '{note}': order.note || '',
    '{tags}': order.tags?.join(', ') || '',
  };
}

export function mapSupplierOrderLineItems(items: SupplierOrderForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_title}': item.title || item.productName,
    '{line_product_name}': item.productName,
    '{line_unit}': item.unit || 'Cái',
    '{line_note}': item.note || '',
    '{line_quantity}': item.quantity.toString(),
    '{line_ordered_quantity}': item.quantity.toString(),
    '{line_received_quantity}': item.receivedQuantity?.toString() || '0',
    '{line_variant_code}': item.variantCode || '',
    '{line_variant_name}': item.variantName || '',
    '{line_variant_options}': item.variantOptions || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_category}': item.category || '',
    '{line_brand}': item.brand || '',
    '{line_price}': formatCurrency(item.price),
    '{line_price_after_discount}': formatCurrency(item.priceAfterDiscount),
    '{line_discount_amount}': formatCurrency(item.discountAmount),
    '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
    '{line_amount}': formatCurrency(item.amount),
    '{line_total}': formatCurrency(item.amount),
    '{line_tax_exclude}': formatCurrency(item.taxExclude),
    '{line_tax_included}': formatCurrency(item.taxIncluded),
    '{line_tax_amount}': formatCurrency(item.taxAmount),
    '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
    '{line_tax}': item.taxType || '',
    '{line_weight_g}': item.weightG?.toString() || '',
    '{line_weight_kg}': item.weightKg?.toString() || '',
    '{serials}': item.serials?.join(', ') || '',
    '{lots_number_code1}': item.lots?.[0] || '',
    '{lots_number_code2}': item.lots?.[1] || '',
    '{lots_number_code3}': item.lots?.[2] || '',
    '{lots_number_code4}': item.lots?.[3] || '',
  }));
}
