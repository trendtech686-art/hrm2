/**
 * Purchase Order Mapper - Đơn nhập hàng
 * Đồng bộ với variables/don-nhap-hang.ts
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

export interface PurchaseOrderForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  receivedOn?: string | Date;
  completedOn?: string | Date;
  cancelledOn?: string | Date;
  dueOn?: string | Date;
  createdBy?: string;
  assigneeName?: string;
  activatedAccountName?: string;
  
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
  billingAddress?: string;
  
  // Nợ NCC
  supplierDebt?: number;
  supplierDebtPrev?: number;
  
  // Khối lượng
  totalWeightG?: number;
  totalWeightKg?: number;
  
  // Tags
  tags?: string[];
  reference?: string;
  
  // Danh sách sản phẩm
  items: Array<{
    variantCode?: string;
    productName: string;
    variantName?: string;
    title?: string;
    barcode?: string;
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
    brand?: string;
    category?: string;
    variantOptions?: string;
    weightG?: number;
    weightKg?: number;
    serial?: string;
    lotNumber?: string;
    lotInfo?: string;
    lotInfoExpiry?: string;
    lotInfoQty?: string;
    note?: string;
  }>;
  
  // Tổng giá trị
  totalQuantity: number;
  total: number;
  totalPrice?: number;
  totalDiscountsRate?: number;
  totalDiscountsValue?: number;
  totalDiscounts?: number;
  productDiscount?: number;
  totalTax?: number;
  totalExtraTax?: number;
  totalTaxIncludedLine?: number;
  totalAmountBeforeTax?: number;
  totalAmountAfterTax?: number;
  totalLandedCosts?: number;
  totalTransactionAmount?: number;
  totalAmountTransaction?: number;
  totalRemain?: number;
  payments?: string;
  
  note?: string;
}

export function mapPurchaseOrderToPrintData(po: PurchaseOrderForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': po.location?.name || storeSettings.name || '',
    '{location_address}': po.location?.address || storeSettings.address || '',
    '{location_province}': po.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN ĐƠN NHẬP ===
    '{purchase_order_code}': po.code,
    '{created_on}': formatDate(po.createdAt),
    '{created_on_time}': formatTime(po.createdAt),
    '{modified_on}': formatDate(po.modifiedAt),
    '{received_on}': formatDate(po.receivedOn),
    '{received_on_time}': formatTime(po.receivedOn),
    '{completed_on}': formatDate(po.completedOn || po.receivedOn),
    '{ended_on}': formatDate(po.completedOn || po.receivedOn),
    '{cancelled_on}': formatDate(po.cancelledOn),
    '{due_on}': formatDate(po.dueOn),
    '{due_on_time}': formatTime(po.dueOn),
    '{account_name}': po.createdBy || '',
    '{activated_account_name}': po.activatedAccountName || po.createdBy || '',
    '{assignee_name}': po.assigneeName || '',
    '{reference}': po.reference || '',
    '{tags}': po.tags?.join(', ') || '',
    
    // === TRẠNG THÁI ===
    '{status}': po.status || '',
    '{received_status}': po.receivedStatus || '',
    '{financial_status}': po.financialStatus || '',
    '{refund_status}': po.refundStatus || '',
    '{refund_transaction_status}': po.refundTransactionStatus || '',
    
    // === THÔNG TIN NHÀ CUNG CẤP ===
    '{supplier_name}': po.supplierName,
    '{supplier_code}': po.supplierCode || '',
    '{order_supplier_code}': po.supplierCode || '',
    '{supplier_phone}': po.supplierPhone || '',
    '{supplier_phone_number}': po.supplierPhone || '',
    '{supplier_email}': po.supplierEmail || '',
    '{supplier_address}': po.supplierAddress || '',
    '{billing_address}': po.billingAddress || '',
    
    // === NỢ NCC ===
    '{supplier_debt}': formatCurrency(po.supplierDebt),
    '{supplier_debt_text}': numberToWords(po.supplierDebt || 0),
    '{supplier_debt_prev}': formatCurrency(po.supplierDebtPrev),
    '{supplier_debt_prev_text}': numberToWords(po.supplierDebtPrev || 0),
    
    // === KHỐI LƯỢNG ===
    '{weight_g}': po.totalWeightG?.toString() || '0',
    '{weight_kg}': po.totalWeightKg?.toString() || '0',
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': po.totalQuantity.toString(),
    '{total}': formatCurrency(po.total),
    '{total_order}': formatCurrency(po.total),
    '{total_price}': formatCurrency(po.totalPrice || po.total),
    '{total_discounts_rate}': po.totalDiscountsRate ? `${po.totalDiscountsRate}%` : '',
    '{total_discounts_value}': formatCurrency(po.totalDiscountsValue),
    '{total_discounts}': formatCurrency(po.totalDiscounts),
    '{discount}': formatCurrency(po.totalDiscounts),
    '{product_discount}': formatCurrency(po.productDiscount),
    '{total_tax}': formatCurrency(po.totalTax),
    '{tax_vat}': formatCurrency(po.totalTax),
    '{total_extra_tax}': formatCurrency(po.totalExtraTax),
    '{total_tax_included_line}': formatCurrency(po.totalTaxIncludedLine),
    '{total_amount_before_tax}': formatCurrency(po.totalAmountBeforeTax),
    '{total_amount_after_tax}': formatCurrency(po.totalAmountAfterTax),
    '{total_landed_costs}': formatCurrency(po.totalLandedCosts),
    '{total_transaction_amount}': formatCurrency(po.totalTransactionAmount),
    '{total_amount_transaction}': formatCurrency(po.totalAmountTransaction),
    '{total_remain}': formatCurrency(po.totalRemain),
    '{total_amount_text}': numberToWords(po.totalPrice || po.total),
    '{payments}': po.payments || '',
    
    '{note}': po.note || '',
  };
}

export function mapPurchaseOrderLineItems(items: PurchaseOrderForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_title}': item.title || item.productName,
    '{line_product_name}': item.productName || item.title,
    '{line_variant_code}': item.variantCode || '',
    '{line_variant_name}': item.variantName || '',
    '{line_variant}': item.variantName || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_ordered_quantity}': item.quantity.toString(),
    '{line_received_quantity}': item.receivedQuantity?.toString() || '0',
    '{line_price}': formatCurrency(item.price),
    '{line_price_after_discount}': formatCurrency(item.priceAfterDiscount),
    '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
    '{line_discount_amount}': formatCurrency(item.discountAmount),
    '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
    '{line_tax_amount}': formatCurrency(item.taxAmount),
    '{line_tax}': item.taxType || '',
    '{line_tax_included}': formatCurrency(item.taxIncluded),
    '{line_tax_exclude}': formatCurrency(item.taxExclude),
    '{line_amount}': formatCurrency(item.amount),
    '{line_total}': formatCurrency(item.amount),
    '{total_line_amount}': formatCurrency(item.amount),
    '{total_line_amount_text}': numberToWords(item.amount),
    '{line_brand}': item.brand || '',
    '{line_category}': item.category || '',
    '{line_variant_options}': item.variantOptions || '',
    '{line_weight_g}': item.weightG?.toString() || '',
    '{line_weight_kg}': item.weightKg?.toString() || '',
    '{serials}': item.serial || '',
    '{lots_number_code1}': item.lotNumber || '',
    '{lots_number_code2}': item.lotInfoQty || '',
    '{lots_number_code3}': item.lotInfo || '',
    '{lots_number_code4}': item.lotInfoExpiry || '',
    '{line_note}': item.note || '',
  }));
}
