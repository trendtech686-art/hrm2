/**
 * Sales Return Mapper - Đơn đổi trả hàng
 * Đồng bộ với variables/don-doi-tra-hang.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatDate,
  formatTime,
  numberToWords,
  getStoreData,
  StoreSettings,
  hidePhoneMiddle
} from './types';

export interface SalesReturnForPrint {
  // Thông tin cơ bản
  code: string;
  orderReturnCode?: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  issuedAt?: string | Date;
  createdBy?: string;
  assigneeName?: string;
  
  // Trạng thái
  orderStatus?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  packedStatus?: string;
  returnStatus?: string;
  refundStatus?: string;
  reason?: string;
  
  // Nguồn / Kênh
  source?: string;
  channel?: string;
  reference?: string;
  tags?: string[];
  
  // Chính sách
  priceListName?: string;
  currencyName?: string;
  expectedDeliveryType?: string;
  expectedPaymentMethod?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
  };
  
  // Thông tin đơn hàng gốc
  orderCode: string;
  orderQrCode?: string;
  orderBarCode?: string;
  
  // Thông tin khách hàng
  customerName: string;
  customerCode?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerContact?: string;
  customerCard?: string;
  customerTaxNumber?: string;
  customerPoint?: number;
  customerDebt?: number;
  customerDebtPrev?: number;
  billingAddress?: string;
  shippingAddress?: string;
  shippingRecipient?: string;
  shippingRecipientPhone?: string;
  
  // Ngày giao
  shipOnMin?: string | Date;
  shipOnMax?: string | Date;
  
  // Danh sách sản phẩm mua
  items: Array<{
    variantCode?: string;
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
    taxAmount?: number;
    taxIncluded?: number;
    taxExclude?: number;
    amount: number;
    amountNoneDiscount?: number;
    brand?: string;
    category?: string;
    variantOptions?: string;
    promotionOrLoyalty?: string;
    serial?: string;
    lotNumber?: string;
    lotInfo?: string;
    lotInfoQty?: string;
    lotInfoExpiry?: string;
    note?: string;
  }>;
  
  // Danh sách sản phẩm trả
  returnItems?: Array<{
    variantCode?: string;
    productName: string;
    variantName?: string;
    unit?: string;
    quantity: number;
    price: number;
    amount: number;
    serial?: string;
    note?: string;
  }>;
  
  // Tổng giá trị
  totalQuantity?: number;
  returnTotalQuantity?: number;
  total?: number;
  totalNoneDiscount?: number;
  totalLineItemDiscount?: number;
  orderDiscount?: number;
  orderDiscountRate?: number;
  orderDiscountValue?: number;
  totalDiscount?: number;
  productDiscount?: number;
  totalTax?: number;
  totalExtraTax?: number;
  totalTaxIncludedLine?: number;
  totalAmountBeforeTax?: number;
  totalAmountAfterTax?: number;
  deliveryFee?: number;
  totalAmount?: number;
  returnTotalAmount?: number;
  totalOrderExchangeAmount?: number;
  orderExchangePaymentNote?: string;
  paymentCustomer?: number;
  moneyReturn?: number;
  totalRemain?: number;
  paymentName?: string;
  promotionName?: string;
  promotionCode?: string;
  
  note?: string;
}

export function mapSalesReturnToPrintData(ret: SalesReturnForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': ret.location?.name || storeSettings.name || '',
    '{location_address}': ret.location?.address || storeSettings.address || '',
    '{location_province}': ret.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN ĐƠN TRẢ ===
    '{order_return_code}': ret.orderReturnCode || ret.code,
    '{order_code}': ret.orderCode,
    '{order_qr_code}': ret.orderQrCode ? `<img src="${ret.orderQrCode}" style="max-width:100px;max-height:100px"/>` : '',
    '{bar_code(code)}': ret.orderBarCode ? `<img src="${ret.orderBarCode}" style="max-height:50px"/>` : '',
    '{created_on}': formatDate(ret.createdAt),
    '{created_on_time}': formatTime(ret.createdAt),
    '{modified_on}': formatDate(ret.modifiedAt),
    '{modified_on_time}': formatTime(ret.modifiedAt),
    '{issued_on}': formatDate(ret.issuedAt || ret.createdAt),
    '{issued_on_time}': formatTime(ret.issuedAt || ret.createdAt),
    '{account_name}': ret.createdBy || '',
    '{assignee_name}': ret.assigneeName || '',
    
    // === TRẠNG THÁI ===
    '{order_status}': ret.orderStatus || '',
    '{payment_status}': ret.paymentStatus || '',
    '{fulfillment_status}': ret.fulfillmentStatus || '',
    '{packed_status}': ret.packedStatus || '',
    '{return_status}': ret.returnStatus || '',
    
    // === NGUỒN / KÊNH ===
    '{source}': ret.source || '',
    '{channel}': ret.channel || '',
    '{reference}': ret.reference || '',
    '{bar_code(reference_number)}': '', // TODO: generate barcode
    '{tag}': ret.tags?.join(', ') || '',
    
    // === CHÍNH SÁCH ===
    '{price_list_name}': ret.priceListName || '',
    '{currency_name}': ret.currencyName || 'VND',
    '{expected_delivery_type}': ret.expectedDeliveryType || '',
    '{expected_payment_method}': ret.expectedPaymentMethod || '',
    
    // === NGÀY GIAO ===
    '{ship_on_min}': formatDate(ret.shipOnMin),
    '{ship_on_max}': formatDate(ret.shipOnMax),
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': ret.customerName,
    '{customer_code}': ret.customerCode || '',
    '{customer_phone_number}': ret.customerPhone || '',
    '{customer_email}': ret.customerEmail || '',
    '{customer_contact}': ret.customerContact || ret.customerName,
    '{customer_card}': ret.customerCard || '',
    '{customer_tax_number}': ret.customerTaxNumber || '',
    '{customer_point}': ret.customerPoint?.toString() || '0',
    '{customer_debt}': formatCurrency(ret.customerDebt),
    '{customer_debt_text}': numberToWords(ret.customerDebt || 0),
    '{customer_debt_prev}': formatCurrency(ret.customerDebtPrev),
    '{customer_debt_prev_text}': numberToWords(ret.customerDebtPrev || 0),
    '{billing_address}': ret.billingAddress || '',
    '{shipping_address}': ret.shippingAddress || '',
    '{shipping_address:full_name}': ret.shippingRecipient || ret.customerName,
    '{shipping_address:phone_number}': ret.shippingRecipientPhone || ret.customerPhone || '',
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': ret.totalQuantity?.toString() || '0',
    '{return_total_quantity}': ret.returnTotalQuantity?.toString() || '0',
    '{total}': formatCurrency(ret.total),
    '{total_none_discount}': formatCurrency(ret.totalNoneDiscount),
    '{total_line_item_discount}': formatCurrency(ret.totalLineItemDiscount),
    '{order_discount}': formatCurrency(ret.orderDiscount),
    '{order_discount_rate}': ret.orderDiscountRate ? `${ret.orderDiscountRate}%` : '',
    '{order_discount_value}': formatCurrency(ret.orderDiscountValue),
    '{total_discount}': formatCurrency(ret.totalDiscount),
    '{product_discount}': formatCurrency(ret.productDiscount),
    '{total_tax}': formatCurrency(ret.totalTax),
    '{total_extra_tax}': formatCurrency(ret.totalExtraTax),
    '{total_tax_included_line}': formatCurrency(ret.totalTaxIncludedLine),
    '{total_amount_before_tax}': formatCurrency(ret.totalAmountBeforeTax),
    '{total_amount_after_tax}': formatCurrency(ret.totalAmountAfterTax),
    '{delivery_fee}': formatCurrency(ret.deliveryFee),
    '{total_amount}': formatCurrency(ret.totalAmount),
    '{total_text}': numberToWords(ret.totalAmount || 0),
    '{return_total_amount}': formatCurrency(ret.returnTotalAmount),
    '{total_order_exchange_amount}': formatCurrency(ret.totalOrderExchangeAmount),
    '{order_exchange_payment_note}': ret.orderExchangePaymentNote || '',
    '{payment_customer}': formatCurrency(ret.paymentCustomer),
    '{money_return}': formatCurrency(ret.moneyReturn),
    '{total_remain}': formatCurrency(ret.totalRemain),
    '{payment_name}': ret.paymentName || '',
    '{promotion_name}': ret.promotionName || '',
    '{promotion_code}': ret.promotionCode || '',
    
    '{order_note}': ret.note || '',
    '{note}': ret.note || '',
    '{reason_return}': ret.reason || '',
    '{refund_status}': ret.refundStatus || '',
  };
}

export function mapSalesReturnLineItems(items: SalesReturnForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_variant_code}': item.variantCode || '',
    '{line_product_name}': item.productName,
    '{line_variant}': item.variantName || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_price}': formatCurrency(item.price),
    '{line_price_after_discount}': formatCurrency(item.priceAfterDiscount),
    '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
    '{line_discount_amount}': formatCurrency(item.discountAmount),
    '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
    '{line_tax_amount}': formatCurrency(item.taxAmount),
    '{line_tax_included}': formatCurrency(item.taxIncluded),
    '{line_tax_exclude}': formatCurrency(item.taxExclude),
    '{line_amount}': formatCurrency(item.amount),
    '{line_amount_none_discount}': formatCurrency(item.amountNoneDiscount),
    '{line_brand}': item.brand || '',
    '{line_category}': item.category || '',
    '{line_variant_options}': item.variantOptions || '',
    '{line_promotion_or_loyalty}': item.promotionOrLoyalty || '',
    '{serials}': item.serial || '',
    '{lots_number_code1}': item.lotNumber || '',
    '{lots_number_code2}': item.lotInfoQty || '',
    '{lots_number_code3}': item.lotInfo || '',
    '{lots_number_code4}': item.lotInfoExpiry || '',
    '{line_note}': item.note || '',
  }));
}

export function mapSalesReturnReturnLineItems(items: SalesReturnForPrint['returnItems']): PrintLineItem[] {
  if (!items) return [];
  
  return items.map((item, index) => ({
    '{return_line_stt}': (index + 1).toString(),
    '{return_line_variant_code}': item.variantCode || '',
    '{return_line_product_name}': item.productName,
    '{return_line_variant}': item.variantName || '',
    '{return_line_unit}': item.unit || 'Cái',
    '{return_line_quantity}': item.quantity.toString(),
    '{return_line_price}': formatCurrency(item.price),
    '{return_line_amount}': formatCurrency(item.amount),
    '{return_serials}': item.serial || '',
    '{return_line_note}': item.note || '',

    // Map to standard line item variables as well (for templates that use generic names)
    '{line_stt}': (index + 1).toString(),
    '{line_variant_code}': item.variantCode || '',
    '{line_product_name}': item.productName,
    '{line_variant}': item.variantName || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_price}': formatCurrency(item.price),
    '{line_total}': formatCurrency(item.amount), // Template uses line_total
    '{line_amount}': formatCurrency(item.amount),
    '{line_note}': item.note || '',
  }));
}
