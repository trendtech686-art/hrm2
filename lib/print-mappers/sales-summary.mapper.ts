/**
 * Sales Summary Mapper - Phiếu tổng kết bán hàng (phieu-tong-ket-ban-hang)
 * Đồng bộ với variables/phieu-tong-ket-ban-hang.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

export interface SalesSummaryForPrint {
  // Thông tin cơ bản
  datePrint: string | Date;
  timePrint?: string | Date;
  timeFilter?: string;
  sourceName?: string;
  createdOn?: string | Date;
  fromDate?: string | Date;
  toDate?: string | Date;
  period?: string;
  note?: string;
  
  // Thông tin chi nhánh
  locationName?: string;
  accountName?: string;
  
  // Tổng quan bán hàng
  totalQuantityOrderFinished?: number;
  totalQuantityLineItemFulfillment?: number;
  totalQuantityLineItemReturn?: number;
  totalLineAmount?: number;
  totalOrderPayment?: number;
  totalOrderReturnPayment?: number;
  totalRealReceipt?: number;
  
  // Tổng kết
  totalOrders?: number;
  totalRevenue?: number;
  salesRevenue?: number;
  deliveryRevenue?: number;
  totalDiscount?: number;
  totalTax?: number;
  totalReturns?: number;
  totalCollected?: number;
  
  // Thực thu theo hình thức
  realReceiptCash?: number;
  realReceiptTransfer?: number;
  realReceiptMpos?: number;
  realReceiptCod?: number;
  realReceiptOnline?: number;
  
  // Chi tiết thanh toán
  cashAmount?: number;
  cardAmount?: number;
  bankTransferAmount?: number;
  codAmount?: number;
  ewalletAmount?: number;
  
  // Nợ còn lại
  debt?: number;
  
  // Tổng thu
  receiptInDay?: number;
  receiptCash?: number;
  receiptTransfer?: number;
  receiptMpos?: number;
  receiptCod?: number;
  receiptOnline?: number;
  
  // Tổng chi
  paymentInDay?: number;
  paymentCash?: number;
  paymentTransfer?: number;
  paymentMpos?: number;
  
  // Chi tiết đơn hàng bán
  ordersFinished?: Array<{
    stt: number;
    orderCode: string;
    amount: number;
    discount: number;
    tax: number;
    total: number;
  }>;
  
  // Chi tiết hàng bán
  itemsFulfillment?: Array<{
    stt: number;
    sku: string;
    variantName: string;
    quantity: number;
    amount: number;
  }>;
  
  // Chi tiết hàng trả
  itemsReturn?: Array<{
    stt: number;
    sku: string;
    variantName: string;
    quantity: number;
    amount: number;
  }>;
  
  // Chi tiết thanh toán
  paymentMethods?: Array<{
    name: string;
    amount: number;
  }>;
  
  // Line items generic
  lineItems?: Array<{
    productName?: string;
    quantity?: number;
    amount?: number;
  }>;
}

export function mapSalesSummaryToPrintData(summary: SalesSummaryForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN ===
    '{location_name}': summary.locationName || storeSettings.name || '',
    '{account_name}': summary.accountName || '',
    '{date_print}': formatDate(summary.datePrint),
    '{time_print}': formatTime(summary.timePrint || summary.datePrint),
    '{time_filter}': summary.timeFilter || '',
    '{source_name}': summary.sourceName || '',
    '{created_on}': formatDate(summary.createdOn || summary.datePrint),
    '{from_date}': formatDate(summary.fromDate),
    '{to_date}': formatDate(summary.toDate),
    '{period}': summary.period || '',
    '{note}': summary.note || '',
    
    // === TỔNG QUAN BÁN HÀNG ===
    '{total_quantity_order_finished}': summary.totalQuantityOrderFinished?.toString() || '0',
    '{total_quantity_line_item_fulfillment}': summary.totalQuantityLineItemFulfillment?.toString() || '0',
    '{total_quantity_line_item_return}': summary.totalQuantityLineItemReturn?.toString() || '0',
    '{total_line_amount}': formatCurrency(summary.totalLineAmount),
    '{total_order_payment}': formatCurrency(summary.totalOrderPayment),
    '{total_order_return_payment}': formatCurrency(summary.totalOrderReturnPayment),
    '{total_real_receipt}': formatCurrency(summary.totalRealReceipt),
    
    // === TỔNG KẾT ===
    '{total_orders}': summary.totalOrders?.toString() || summary.totalQuantityOrderFinished?.toString() || '0',
    '{total_revenue}': formatCurrency(summary.totalRevenue || summary.totalLineAmount),
    '{sales_revenue}': formatCurrency(summary.salesRevenue || summary.totalLineAmount),
    '{delivery_revenue}': formatCurrency(summary.deliveryRevenue),
    '{total_discount}': formatCurrency(summary.totalDiscount),
    '{total_tax}': formatCurrency(summary.totalTax),
    '{total_returns}': formatCurrency(summary.totalReturns || summary.totalOrderReturnPayment),
    '{total_collected}': formatCurrency(summary.totalCollected || summary.totalRealReceipt),
    
    // === THỰC THU THEO HÌNH THỨC ===
    '{real_receipt_cash}': formatCurrency(summary.realReceiptCash),
    '{real_receipt_transfer}': formatCurrency(summary.realReceiptTransfer),
    '{real_receipt_mpos}': formatCurrency(summary.realReceiptMpos),
    '{real_receipt_cod}': formatCurrency(summary.realReceiptCod),
    '{real_receipt_online}': formatCurrency(summary.realReceiptOnline),
    
    // === CHI TIẾT THANH TOÁN ===
    '{cash_amount}': formatCurrency(summary.cashAmount || summary.realReceiptCash),
    '{card_amount}': formatCurrency(summary.cardAmount || summary.realReceiptMpos),
    '{bank_transfer_amount}': formatCurrency(summary.bankTransferAmount || summary.realReceiptTransfer),
    '{cod_amount}': formatCurrency(summary.codAmount || summary.realReceiptCod),
    '{ewallet_amount}': formatCurrency(summary.ewalletAmount || summary.realReceiptOnline),
    
    // === NỢ ===
    '{debt}': formatCurrency(summary.debt),
    
    // === TỔNG THU ===
    '{receipt_in_day}': formatCurrency(summary.receiptInDay),
    '{receipt_cash}': formatCurrency(summary.receiptCash),
    '{receipt_transfer}': formatCurrency(summary.receiptTransfer),
    '{receipt_mpos}': formatCurrency(summary.receiptMpos),
    '{receipt_cod}': formatCurrency(summary.receiptCod),
    '{receipt_online}': formatCurrency(summary.receiptOnline),
    
    // === TỔNG CHI ===
    '{payment_in_day}': formatCurrency(summary.paymentInDay),
    '{payment_cash}': formatCurrency(summary.paymentCash),
    '{payment_transfer}': formatCurrency(summary.paymentTransfer),
    '{payment_mpos}': formatCurrency(summary.paymentMpos),
  };
}

// Line items cho danh sách đơn hàng bán
export function mapSalesSummaryOrdersFinished(orders: SalesSummaryForPrint['ordersFinished']): PrintLineItem[] {
  if (!orders) return [];
  return orders.map((order) => ({
    '{stt_order_finish}': order.stt.toString(),
    '{order_code}': order.orderCode,
    '{amount_order_finished}': formatCurrency(order.amount),
    '{discount_order_finished}': formatCurrency(order.discount),
    '{tax_order_finished}': formatCurrency(order.tax),
    '{total_order_finished}': formatCurrency(order.total),
  }));
}

// Line items cho danh sách hàng bán
export function mapSalesSummaryItemsFulfillment(items: SalesSummaryForPrint['itemsFulfillment']): PrintLineItem[] {
  if (!items) return [];
  return items.map((item) => ({
    '{stt_item_fulfillment}': item.stt.toString(),
    '{sku_fulfillment}': item.sku,
    '{variant_name_fulfillment}': item.variantName,
    '{quantity_item_fulfilment}': item.quantity.toString(),
    '{amount_item_fulfilment}': formatCurrency(item.amount),
  }));
}

// Line items cho danh sách hàng trả
export function mapSalesSummaryItemsReturn(items: SalesSummaryForPrint['itemsReturn']): PrintLineItem[] {
  if (!items) return [];
  return items.map((item) => ({
    '{stt_item_return}': item.stt.toString(),
    '{sku_return}': item.sku,
    '{variant_name_return}': item.variantName,
    '{quantity_item_return}': item.quantity.toString(),
    '{amount_item_return}': formatCurrency(item.amount),
  }));
}

// Line items cho danh sách thanh toán
export function mapSalesSummaryPaymentMethods(methods: SalesSummaryForPrint['paymentMethods']): PrintLineItem[] {
  if (!methods) return [];
  return methods.map((method) => ({
    '{payment_method_name}': method.name,
    '{payment_method_amount}': formatCurrency(method.amount),
  }));
}

// Line items generic
export function mapSalesSummaryLineItems(items: SalesSummaryForPrint['lineItems']): PrintLineItem[] {
  if (!items) return [];
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_product_name}': item.productName || '',
    '{line_quantity}': item.quantity?.toString() || '0',
    '{line_amount}': formatCurrency(item.amount),
  }));
}
