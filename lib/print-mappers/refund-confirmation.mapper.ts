/**
 * Refund Confirmation Mapper - Phiếu xác nhận hoàn (phieu-xac-nhan-hoan)
 * Đồng bộ với variables/phieu-xac-nhan-hoan.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatDate,
  hidePhoneMiddle,
  getStoreData,
  StoreSettings
} from './types';

export interface RefundConfirmationForPrint {
  // Thông tin cơ bản
  code: string;
  printedOn: string | Date;
  accountName?: string;
  createdOn?: string | Date;
  createdOnTime?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
  };
  
  // Thông tin vận chuyển
  shippingProviderName?: string;
  serviceName?: string;
  
  // Tổng COD
  totalCod?: number;
  
  // Số lượng đơn
  quantity?: number;
  
  // Thông tin khách hàng
  customerName?: string;
  customerPhoneNumber?: string;
  
  // Thông tin ngân hàng
  bankName?: string;
  bankBranch?: string;
  bankAccount?: string;
  bankAccountName?: string;
  
  // Thông tin hoàn tiền
  refundCode?: string;
  refundAmount?: number;
  refundAmountText?: string;
  refundMethod?: string;
  refundReason?: string;
  refundStatus?: string;
  refundedOn?: string | Date;
  
  // Thông tin đơn trả hàng
  returnCode?: string;
  returnDate?: string | Date;
  orderDate?: string | Date;
  
  // Danh sách đơn hàng hoàn
  orders: Array<{
    orderCode: string;
    shipmentCode?: string;
    shippingName?: string;
    shippingPhone?: string;
    shippingAddress?: string;
    city?: string;
    district?: string;
    cod?: number;
    note?: string;
  }>;
  
  note?: string;
}

export function mapRefundConfirmationToPrintData(refund: RefundConfirmationForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': refund.location?.name || storeSettings.name || '',
    '{location_address}': refund.location?.address || storeSettings.address || '',
    
    // === THÔNG TIN PHIẾU XÁC NHẬN HOÀN ===
    '{hand_over_code}': refund.code,
    '{printed_on}': formatDate(refund.printedOn),
    '{current_account_name}': refund.accountName || '',
    '{account_name}': refund.accountName || '',
    '{created_on}': formatDate(refund.createdOn || refund.printedOn),
    '{created_on_time}': refund.createdOnTime || '',
    
    // === THÔNG TIN VẬN CHUYỂN ===
    '{shipping_provider_name}': refund.shippingProviderName || '',
    '{service_name}': refund.serviceName || '',
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': refund.customerName || '',
    '{customer_phone_number}': refund.customerPhoneNumber || '',
    
    // === THÔNG TIN NGÂN HÀNG ===
    '{bank_name}': refund.bankName || '',
    '{bank_branch}': refund.bankBranch || '',
    '{bank_account}': refund.bankAccount || '',
    '{bank_account_name}': refund.bankAccountName || '',
    
    // === THÔNG TIN HOÀN TIỀN ===
    '{refund_code}': refund.refundCode || refund.code,
    '{refund_amount}': formatCurrency(refund.refundAmount),
    '{refund_amount_text}': refund.refundAmountText || '',
    '{refund_method}': refund.refundMethod || '',
    '{refund_reason}': refund.refundReason || '',
    '{refund_status}': refund.refundStatus || '',
    '{refunded_on}': formatDate(refund.refundedOn),
    
    // === THÔNG TIN ĐƠN TRẢ HÀNG ===
    '{return_code}': refund.returnCode || '',
    '{return_date}': formatDate(refund.returnDate),
    '{order_date}': formatDate(refund.orderDate),
    
    // === TỔNG GIÁ TRỊ ===
    '{total_cod}': formatCurrency(refund.totalCod),
    '{quantity}': refund.quantity?.toString() || refund.orders.length.toString(),
    
    '{note}': refund.note || '',
  };
}

export function mapRefundConfirmationLineItems(orders: RefundConfirmationForPrint['orders']): PrintLineItem[] {
  return orders.map((order) => ({
    '{order_code}': order.orderCode,
    '{shipment_code}': order.shipmentCode || '',
    '{shipping_name}': order.shippingName || '',
    '{shipping_phone}': order.shippingPhone || '',
    '{shipping_phone_hide}': hidePhoneMiddle(order.shippingPhone || ''),
    '{shipping_address}': order.shippingAddress || '',
    '{city}': order.city || '',
    '{district}': order.district || '',
    '{cod}': formatCurrency(order.cod),
    '{note}': order.note || '',
  }));
}
