/**
 * Packing Request Mapper - Phiếu yêu cầu đóng gói (phieu-yeu-cau-dong-goi)
 * Đồng bộ với variables/phieu-yeu-cau-dong-goi.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatDate,
  formatTime,
  hidePhoneMiddle,
  getStoreData,
  StoreSettings
} from './types';

export interface PackingRequestForPrint {
  // Thông tin cơ bản
  code: string;
  orderCode?: string;
  packingRequestCode?: string;
  createdAt: string | Date;
  packedOn?: string | Date;
  cancelDate?: string | Date;
  deadline?: string | Date;
  priority?: string;
  
  // Nhân viên
  accountName?: string;
  packedProcessingAccountName?: string;
  cancelAccountName?: string;
  assigneeName?: string;
  assignedEmployee?: string;
  
  // Trạng thái
  status?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
  };
  
  // Thông tin khách hàng
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: string;
  
  // Thông tin vận chuyển
  carrierName?: string;
  serviceName?: string;
  cod?: number;
  
  // Ngày hẹn giao
  shipOnMin?: string | Date;
  shipOnMax?: string | Date;
  
  // Ghi chú
  orderNote?: string;
  packingNote?: string;
  specialRequest?: string;
  
  // Danh sách sản phẩm
  items: Array<{
    variantCode?: string;
    productName: string;
    variantName?: string;
    unit?: string;
    quantity: number;
    price?: number;
    discountRate?: number;
    discountAmount?: number;
    taxRate?: number;
    taxType?: string;
    amount?: number;
    lotNumber?: string;
    lotInfo?: string;
    lotInfoQty?: string;
    lotInfoExpiry?: string;
    note?: string;
    binLocation?: string;
  }>;
  
  // Tổng giá trị
  totalQuantity: number;
  totalTax?: number;
  fulfillmentDiscount?: number;
  total?: number;
  totalWeight?: number;
}

export function mapPackingRequestToPrintData(request: PackingRequestForPrint, storeSettings: StoreSettings): PrintData {
  const barcode = request.code 
    ? `https://barcodeapi.org/api/128/${encodeURIComponent(request.code)}`
    : '';
  const orderBarcode = request.orderCode 
    ? `https://barcodeapi.org/api/128/${encodeURIComponent(request.orderCode)}`
    : '';
    
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': request.location?.name || storeSettings.name || '',
    '{location_address}': request.location?.address || storeSettings.address || '',
    '{store_province}': storeSettings.province || '',
    '{location_province}': request.location?.province || '',
    
    // === THÔNG TIN PHIẾU YÊU CẦU ĐÓNG GÓI ===
    '{code}': request.code,
    '{packing_request_code}': request.packingRequestCode || request.code,
    '{bar_code(code)}': barcode,
    '{order_code}': request.orderCode || '',
    '{bar_code(order_code)}': orderBarcode,
    '{created_on}': formatDate(request.createdAt),
    '{created_on_time}': formatTime(request.createdAt),
    '{packed_on}': formatDate(request.packedOn),
    '{packed_on_time}': formatTime(request.packedOn),
    '{cancel_date}': formatDate(request.cancelDate),
    '{ship_on_min}': formatDate(request.shipOnMin),
    '{ship_on_max}': formatDate(request.shipOnMax),
    '{deadline}': formatDate(request.deadline),
    '{priority}': request.priority || '',
    
    // === NHÂN VIÊN ===
    '{account_name}': request.accountName || '',
    '{packed_processing_account_name}': request.packedProcessingAccountName || '',
    '{cancel_account_name}': request.cancelAccountName || '',
    '{assignee_name}': request.assigneeName || '',
    '{assigned_employee}': request.assignedEmployee || request.assigneeName || '',
    
    // === TRẠNG THÁI ===
    '{status}': request.status || '',
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': request.customerName || '',
    '{customer_phone_number}': request.customerPhone || '',
    '{customer_phone_number_hide}': hidePhoneMiddle(request.customerPhone || ''),
    '{customer_email}': request.customerEmail || '',
    '{shipping_address}': request.shippingAddress || '',
    
    // === THÔNG TIN VẬN CHUYỂN ===
    '{carrier_name}': request.carrierName || '',
    '{service_name}': request.serviceName || '',
    '{cod}': formatCurrency(request.cod),
    
    // === GHI CHÚ ===
    '{order_note}': request.orderNote || '',
    '{packing_note}': request.packingNote || '',
    '{special_request}': request.specialRequest || '',
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': request.totalQuantity.toString(),
    '{total_tax}': formatCurrency(request.totalTax),
    '{fulfillment_discount}': formatCurrency(request.fulfillmentDiscount),
    '{total}': formatCurrency(request.total),
    '{total_weight}': request.totalWeight?.toString() || '0',
  };
}

export function mapPackingRequestLineItems(items: PackingRequestForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_variant_code}': item.variantCode || '',
    '{line_product_name}': item.productName,
    '{line_variant}': item.variantName || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_price}': formatCurrency(item.price),
    '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
    '{line_discount_amount}': formatCurrency(item.discountAmount),
    '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
    '{line_tax}': item.taxType || '',
    '{line_amount}': formatCurrency(item.amount),
    '{lots_number_code1}': item.lotNumber || '',
    '{lots_number_code2}': item.lotInfoQty || '',
    '{lots_number_code3}': item.lotInfo || '',
    '{lots_number_code4}': item.lotInfoExpiry || '',
    '{line_note}': item.note || '',
    '{bin_location}': item.binLocation || '',
  }));
}
