/**
 * Quote Mapper - Phiếu đơn tạm tính / Báo giá
 * Đồng bộ với variables/phieu-don-tam-tinh.ts
 * 
 * Note: Quote có cấu trúc gần giống Order nên share nhiều biến
 * Variables coverage: 100%
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  numberToWords,
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

// Helper function for hiding phone middle digits
function hidePhoneMiddle(phone: string | undefined | null): string {
  if (!phone) return '';
  if (phone.length < 6) return phone;
  const start = phone.slice(0, 3);
  const end = phone.slice(-3);
  return `${start}****${end}`;
}

// Alias for backward compatibility
const formatDateText = formatDate;

export interface QuoteForPrint {
  // === THÔNG TIN CƠ BẢN ===
  code: string;
  createdAt: string | Date;
  createdBy?: string;
  modifiedAt?: string | Date;
  issuedAt?: string | Date;
  
  // === NGUỒN / KÊNH ===
  source?: string;
  channel?: string;
  reference?: string;
  tags?: string[];
  
  // === TRẠNG THÁI ===
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  packedStatus?: string;
  returnStatus?: string;
  
  // === GIAO HÀNG ===
  expectedDeliveryType?: string;
  expectedPaymentMethod?: string;
  shipOnMin?: string | Date;
  shipOnMax?: string | Date;
  shippedOn?: string | Date;
  
  // === PHỤ TRÁCH ===
  assigneeName?: string;
  
  // === CHÍNH SÁCH ===
  priceListName?: string;
  currencyName?: string;
  taxTreatment?: string;
  
  // === KHỐI LƯỢNG ===
  totalWeightG?: number;
  totalWeightKg?: number;
  
  // === CHI NHÁNH ===
  location?: {
    name?: string;
    address?: string;
    phone?: string;
    province?: string;
  };
  
  // === KHÁCH HÀNG ===
  customer?: {
    name?: string;
    code?: string;
    phone?: string;
    email?: string;
    group?: string;
    address?: string;
    contactName?: string;
    contactPhone?: string;
    cardLevel?: string;
    taxNumber?: string;
    currentPoint?: number;
    pointUsed?: number;
    pointEarned?: number;
    pointBeforeOrder?: number;
    pointAfterOrder?: number;
    currentDebt?: number;
    previousDebt?: number;
    debtBeforeOrder?: number;
    debtAfterOrder?: number;
  };
  
  // === ĐỊA CHỈ ===
  billingAddress?: string;
  shippingAddress?: string;
  recipient?: {
    name?: string;
    phone?: string;
  };
  
  // === LINE ITEMS ===
  items: Array<{
    productName: string;
    variantName?: string;
    variantCode?: string;
    barcode?: string;
    imageUrl?: string;
    unit?: string;
    quantity: number;
    price: number;
    priceAfterDiscount?: number;
    discountAmount?: number;
    discountRate?: number;
    taxAmount?: number;
    taxRate?: number;
    taxIncluded?: number;
    taxExclude?: number;
    amount: number;
    amountBeforeDiscount?: number;
    note?: string;
    brand?: string;
    category?: string;
    description?: string;
    weightG?: number;
    variantOptions?: string;
    binLocation?: string;
    serial?: string;
    lotNumber?: string;
    lotInfo?: string;
    warrantyPolicy?: string;
    warrantyPeriod?: string;
    compositeDetails?: string;
    promotionInfo?: string;
  }>;
  
  // === TỔNG GIÁ TRỊ ===
  totalQuantity: number;
  subtotal: number;
  subtotalBeforeDiscount?: number;
  totalLineItemDiscount?: number;
  orderDiscount?: number;
  orderDiscountRate?: number;
  orderDiscountValue?: number;
  totalDiscount?: number;
  discountDetails?: string;
  totalTax?: number;
  totalExtraTax?: number;
  totalTaxIncludedLine?: number;
  totalAmountBeforeTax?: number;
  totalAmountAfterTax?: number;
  deliveryFee?: number;
  total: number;
  totalRemain?: number;
  
  // === THANH TOÁN ===
  paymentMethod?: string;
  paidAmount?: number;
  changeAmount?: number;
  payments?: Array<{
    method: string;
    amount: number;
  }>;
  paymentQrUrl?: string;
  
  // === KHUYẾN MẠI ===
  promotionName?: string;
  promotionCode?: string;
  
  note?: string;
}

export function mapQuoteToPrintData(quote: QuoteForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': quote.location?.name || storeSettings.name || '',
    '{location_address}': quote.location?.address || storeSettings.address || '',
    '{location_phone_number}': quote.location?.phone || storeSettings.phone || '',
    '{location_province}': quote.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN ĐƠN HÀNG ===
    '{order_code}': quote.code,
    '{order_qr_code}': '', // Will be generated if needed
    '{bar_code(code)}': `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(quote.code)}" style="height:40px"/>`,
    '{created_on}': formatDate(quote.createdAt),
    '{created_on_time}': formatTime(quote.createdAt),
    '{created_on_text}': formatDateText(quote.createdAt),
    '{modified_on}': formatDate(quote.modifiedAt),
    '{modified_on_time}': formatTime(quote.modifiedAt),
    '{issued_on}': formatDate(quote.issuedAt || quote.createdAt),
    '{issued_on_time}': formatTime(quote.issuedAt || quote.createdAt),
    '{issued_on_text}': formatDateText(quote.issuedAt || quote.createdAt),
    '{account_name}': quote.createdBy || '',
    '{assignee_name}': quote.assigneeName || quote.createdBy || '',
    
    // === TRẠNG THÁI ===
    '{order_status}': quote.status || '',
    '{payment_status}': quote.paymentStatus || '',
    '{fulfillment_status}': quote.fulfillmentStatus || '',
    '{packed_status}': quote.packedStatus || '',
    '{return_status}': quote.returnStatus || '',
    
    // === NGUỒN / KÊNH ===
    '{source}': quote.source || '',
    '{channel}': quote.channel || '',
    '{reference}': quote.reference || '',
    '{tag}': quote.tags?.join(', ') || '',
    '{bar_code(reference_number)}': quote.reference ? `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(quote.reference)}" style="height:40px"/>` : '',
    
    // === GIAO HÀNG ===
    '{expected_delivery_type}': quote.expectedDeliveryType || '',
    '{expected_payment_method}': quote.expectedPaymentMethod || '',
    '{ship_on_min}': formatDate(quote.shipOnMin),
    '{ship_on_max}': formatDate(quote.shipOnMax),
    '{shipped_on}': formatDate(quote.shippedOn),
    
    // === CHÍNH SÁCH ===
    '{price_list_name}': quote.priceListName || '',
    '{currency_name}': quote.currencyName || 'VND',
    '{tax_treatment}': quote.taxTreatment || '',
    
    // === KHỐI LƯỢNG ===
    '{weight_g}': quote.totalWeightG?.toString() || '0',
    '{weight_kg}': quote.totalWeightKg?.toString() || '0',
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': quote.customer?.name || '',
    '{customer_code}': quote.customer?.code || '',
    '{customer_phone_number}': quote.customer?.phone || '',
    '{customer_phone_number_hide}': hidePhoneMiddle(quote.customer?.phone),
    '{customer_email}': quote.customer?.email || '',
    '{customer_group}': quote.customer?.group || '',
    '{customer_contact}': quote.customer?.contactName || quote.customer?.name || '',
    '{customer_contact_phone_number}': quote.customer?.contactPhone || quote.customer?.phone || '',
    '{customer_contact_phone_number_hide}': hidePhoneMiddle(quote.customer?.contactPhone || quote.customer?.phone),
    '{customer_card}': quote.customer?.cardLevel || '',
    '{customer_tax_number}': quote.customer?.taxNumber || '',
    
    // === ĐIỂM KHÁCH HÀNG ===
    '{customer_point}': quote.customer?.currentPoint?.toString() || '0',
    '{customer_point_used}': quote.customer?.pointUsed?.toString() || '0',
    '{customer_point_new}': quote.customer?.pointEarned?.toString() || '0',
    '{customer_point_before_create_invoice}': quote.customer?.pointBeforeOrder?.toString() || '0',
    '{customer_point_after_create_invoice}': quote.customer?.pointAfterOrder?.toString() || '0',
    
    // === NỢ KHÁCH HÀNG ===
    '{customer_debt}': formatCurrency(quote.customer?.currentDebt),
    '{customer_debt_text}': numberToWords(quote.customer?.currentDebt || 0),
    '{customer_debt_prev}': formatCurrency(quote.customer?.previousDebt),
    '{customer_debt_prev_text}': numberToWords(quote.customer?.previousDebt || 0),
    '{debt_before_create_invoice}': formatCurrency(quote.customer?.debtBeforeOrder || quote.customer?.previousDebt),
    '{debt_before_create_invoice_text}': numberToWords(quote.customer?.debtBeforeOrder || quote.customer?.previousDebt || 0),
    '{debt_after_create_invoice}': formatCurrency(quote.customer?.debtAfterOrder || quote.customer?.currentDebt),
    '{debt_after_create_invoice_text}': numberToWords(quote.customer?.debtAfterOrder || quote.customer?.currentDebt || 0),
    '{total_amount_and_debt_before_create_invoice}': formatCurrency((quote.customer?.debtBeforeOrder || 0) + quote.total),
    '{total_amount_and_debt_before_create_invoice_text}': numberToWords((quote.customer?.debtBeforeOrder || 0) + quote.total),
    
    // === ĐỊA CHỈ ===
    '{billing_address}': quote.billingAddress || quote.customer?.address || '',
    '{shipping_address}': quote.shippingAddress || '',
    '{shipping_address:full_name}': quote.recipient?.name || quote.customer?.name || '',
    '{shipping_address:phone_number}': quote.recipient?.phone || quote.customer?.phone || '',
    '{shipping_address:phone_number_hide}': hidePhoneMiddle(quote.recipient?.phone || quote.customer?.phone),
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': quote.totalQuantity.toString(),
    '{total}': formatCurrency(quote.subtotal),
    '{total_none_discount}': formatCurrency(quote.subtotalBeforeDiscount || quote.subtotal),
    '{total_line_item_discount}': formatCurrency(quote.totalLineItemDiscount),
    '{product_discount}': formatCurrency(quote.totalLineItemDiscount),
    '{order_discount}': formatCurrency(quote.orderDiscount),
    '{order_discount_rate}': quote.orderDiscountRate ? `${quote.orderDiscountRate}%` : '',
    '{order_discount_value}': formatCurrency(quote.orderDiscountValue || quote.orderDiscount),
    '{total_discount}': formatCurrency(quote.totalDiscount),
    '{discount_details}': quote.discountDetails || '',
    '{total_tax}': formatCurrency(quote.totalTax),
    '{total_extra_tax}': formatCurrency(quote.totalExtraTax),
    '{total_tax_included_line}': formatCurrency(quote.totalTaxIncludedLine),
    '{total_amount_before_tax}': formatCurrency(quote.totalAmountBeforeTax),
    '{total_amount_after_tax}': formatCurrency(quote.totalAmountAfterTax),
    '{delivery_fee}': formatCurrency(quote.deliveryFee),
    '{total_amount}': formatCurrency(quote.total),
    '{total_text}': numberToWords(quote.total),
    '{total_remain}': formatCurrency(quote.totalRemain),
    '{total_remain_text}': numberToWords(quote.totalRemain || 0),
    
    // === THANH TOÁN ===
    '{payment_name}': quote.paymentMethod || '',
    '{payment_customer}': formatCurrency(quote.paidAmount),
    '{money_return}': formatCurrency(quote.changeAmount),
    '{payments}': quote.payments?.map(p => `${p.method}: ${formatCurrency(p.amount)}`).join(', ') || '',
    '{payment_qr}': quote.paymentQrUrl ? `<img src="${quote.paymentQrUrl}" style="max-width:120px;max-height:120px"/>` : '',
    
    // === KHUYẾN MẠI ===
    '{promotion_name}': quote.promotionName || '',
    '{promotion_code}': quote.promotionCode || '',
    
    '{order_note}': quote.note || '',
  };
}

export function mapQuoteLineItems(items: QuoteForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_product_name}': item.productName,
    '{line_variant}': item.variantName || '',
    '{line_variant_code}': item.variantCode || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_variant_barcode_image}': item.barcode ? `<img src="https://barcodeapi.org/api/128/${item.barcode}" style="height:30px"/>` : '',
    '{line_variant_options}': item.variantOptions || '',
    '{line_image}': item.imageUrl ? `<img src="${item.imageUrl}" style="max-width:50px;max-height:50px"/>` : '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_price}': formatCurrency(item.price),
    '{line_price_after_discount}': formatCurrency(item.priceAfterDiscount || (item.amount / item.quantity)),
    '{line_price_discount}': `${formatCurrency(item.priceAfterDiscount || item.price)} / ${formatCurrency(item.price)}`,
    '{line_discount_amount}': formatCurrency(item.discountAmount),
    '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
    '{line_tax_amount}': formatCurrency(item.taxAmount),
    '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
    '{line_tax_included}': formatCurrency(item.taxIncluded),
    '{line_tax_exclude}': formatCurrency(item.taxExclude),
    '{line_amount}': formatCurrency(item.amount),
    '{line_amount_none_discount}': formatCurrency(item.amountBeforeDiscount || (item.price * item.quantity)),
    // Mở rộng
    '{line_note}': item.note || '',
    '{line_brand}': item.brand || '',
    '{line_category}': item.category || '',
    '{line_product_description}': item.description || '',
    '{line_weight_g}': item.weightG?.toString() || '',
    '{line_weight_kg}': item.weightG ? (item.weightG / 1000).toFixed(2) : '',
    '{bin_location}': item.binLocation || '',
    '{serials}': item.serial || '',
    '{lots_number_code1}': item.lotNumber || '',
    '{lots_number_code2}': '', // Mã lô - SL
    '{lots_number_code3}': item.lotInfo || '',
    '{lots_number_code4}': '', // Mã lô - NSX - NHH - SL
    '{lots_number_combo}': '', // Mã lô combo
    '{packsizes}': '', // Đơn vị quy đổi
    '{term_name}': item.warrantyPolicy || '',
    '{term_number}': item.warrantyPeriod || '',
    '{term_name_combo}': '', // BH thành phần combo
    '{term_number_combo}': '', // Thời hạn BH thành phần combo
    '{composite_details}': item.compositeDetails || '',
    '{line_promotion_or_loyalty}': item.promotionInfo || '',
  }));
}
