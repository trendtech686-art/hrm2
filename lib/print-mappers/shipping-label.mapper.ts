/**
 * Shipping Label Mapper - Nhãn giao hàng
 * Đồng bộ với variables/nhan-giao-hang.ts
 */

import { 
  PrintData, 
  formatCurrency,
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings,
  hidePhoneMiddle
} from './types';

// Helper function để tạo barcode image
function generateBarcodeImage(code: string | undefined, height = 50): string {
  if (!code) return '';
  // Sử dụng barcodeapi.org - CODE128 format
  return `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(code)}" style="height:${height}px" alt="barcode"/>`;
}

// Helper function để tạo QR code image  
function generateQRCodeImage(code: string | undefined, size = 100): string {
  if (!code) return '';
  // Sử dụng quickchart.io cho QR code
  return `<img src="https://quickchart.io/qr?text=${encodeURIComponent(code)}&size=${size}" style="width:${size}px;height:${size}px" alt="qrcode"/>`;
}

export interface ShippingLabelForPrint {
  // Thông tin đơn hàng
  orderCode: string;
  orderQrCode?: string;
  orderBarCode?: string;
  createdAt?: string | Date;
  modifiedAt?: string | Date;
  receivedOn?: string | Date;
  packedOn?: string | Date;
  shippedOn?: string | Date;
  createdBy?: string;
  creatorName?: string;
  status?: string;
  pushingStatus?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    phone?: string;
    province?: string;
  };
  
  // Thông tin khách hàng
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress: string;
  billingAddress?: string;
  city?: string;
  district?: string;
  
  // Thông tin người nhận
  receiverName?: string;
  receiverPhone?: string;
  
  // Thông tin vận chuyển
  trackingCode?: string;
  trackingQrCode?: string;
  trackingBarCode?: string;
  carrierName?: string;
  deliveryType?: string;
  serviceName?: string;
  partnerType?: string;
  partnerPhone?: string;
  
  // VNPost
  vnpostCrmCode?: string;
  vnpostCrmBarCode?: string;
  
  // Sapo Express
  routeCodeSe?: string;
  sortingCode?: string;
  sortingCodeBarCode?: string;
  
  // Ngày giao
  shipOnMin?: string | Date;
  shipOnMax?: string | Date;
  
  // Giá trị
  totalItems: number;
  total?: number;
  totalTax?: number;
  deliveryFee?: number;
  codAmount?: number;
  totalAmount?: number;
  fulfillmentDiscount?: number;
  freightAmount?: number;
  shipperDeposits?: number;
  packingWeight?: number;
  
  reasonCancel?: string;
  note?: string;
}

export function mapShippingLabelToPrintData(label: ShippingLabelForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': label.location?.name || storeSettings.name || '',
    '{location_address}': label.location?.address || storeSettings.address || '',
    '{location_phone_number}': label.location?.phone || storeSettings.phone || '',
    '{location_province}': label.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN ĐƠN HÀNG ===
    '{order_code}': label.orderCode,
    '{order_qr_code}': label.orderQrCode ? `<img src="${label.orderQrCode}" style="max-width:100px;max-height:100px"/>` : '',
    '{order_bar_code}': label.orderBarCode ? `<img src="${label.orderBarCode}" style="max-height:50px"/>` : '',
    '{created_on}': formatDate(label.createdAt),
    '{created_on_time}': formatTime(label.createdAt),
    '{modified_on}': formatDate(label.modifiedAt),
    '{modified_on_time}': formatTime(label.modifiedAt),
    '{received_on}': formatDate(label.receivedOn),
    '{received_on_time}': formatTime(label.receivedOn),
    '{packed_on}': formatDate(label.packedOn),
    '{packed_on_time}': formatTime(label.packedOn),
    '{shipped_on_time}': formatTime(label.shippedOn),
    '{account_name}': label.createdBy || '',
    '{creator_name}': label.creatorName || label.createdBy || '',
    '{status}': label.status || '',
    '{pushing_status}': label.pushingStatus || '',
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': label.customerName,
    '{customer_phone_number}': label.customerPhone || '',
    '{customer_phone_number_hide}': hidePhoneMiddle(label.customerPhone),
    '{customer_email}': label.customerEmail || '',
    '{shipping_address}': label.shippingAddress,
    '{billing_address}': label.billingAddress || '',
    '{city}': label.city || '',
    '{district}': label.district || '',
    
    // === THÔNG TIN NGƯỜI NHẬN ===
    '{receiver_name}': label.receiverName || label.customerName,
    '{receiver_phone}': label.receiverPhone || label.customerPhone || '',
    '{receiver_phone_hide}': hidePhoneMiddle(label.receiverPhone || label.customerPhone),
    
    // === THÔNG TIN VẬN CHUYỂN ===
    '{tracking_number}': label.trackingCode || '',
    '{shipment_code}': label.trackingCode || '',
    '{shipment_barcode}': generateBarcodeImage(label.trackingCode, 50),
    '{shipment_qrcode}': generateQRCodeImage(label.trackingCode, 100),
    '{tracking_number_qr_code}': label.trackingQrCode ? `<img src="${label.trackingQrCode}" style="max-width:100px;max-height:100px"/>` : generateQRCodeImage(label.trackingCode, 100),
    '{tracking_number_bar_code}': label.trackingBarCode ? `<img src="${label.trackingBarCode}" style="max-height:50px"/>` : generateBarcodeImage(label.trackingCode, 50),
    '{delivery_service_provider}': label.carrierName || '',
    '{partner_name}': label.carrierName || '',
    '{delivery_type}': label.deliveryType || '',
    '{service_name}': label.serviceName || '',
    '{partner_type}': label.partnerType || '',
    '{partner_phone_number}': label.partnerPhone || '',
    
    // === VNPOST ===
    '{vnpost_crm_code}': label.vnpostCrmCode || '',
    '{vnpost_crm_bar_code}': label.vnpostCrmBarCode ? `<img src="${label.vnpostCrmBarCode}" style="max-height:50px"/>` : '',
    
    // === SAPO EXPRESS ===
    '{route_code_se}': label.routeCodeSe || '',
    '{sorting_code}': label.sortingCode || '',
    '{sorting_code_bar_code}': label.sortingCodeBarCode ? `<img src="${label.sortingCodeBarCode}" style="max-height:50px"/>` : '',
    
    // === NGÀY GIAO ===
    '{ship_on_min}': formatDate(label.shipOnMin),
    '{ship_on_max}': formatDate(label.shipOnMax),
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': label.totalItems.toString(),
    '{total}': formatCurrency(label.total),
    '{total_tax}': formatCurrency(label.totalTax),
    '{delivery_fee}': formatCurrency(label.deliveryFee),
    '{cod_amount}': formatCurrency(label.codAmount),
    '{cod}': formatCurrency(label.codAmount), // Alias cho template
    '{total_amount}': formatCurrency(label.totalAmount),
    '{fulfillment_discount}': formatCurrency(label.fulfillmentDiscount),
    '{freight_amount}': formatCurrency(label.freightAmount),
    '{shipper_deposits}': formatCurrency(label.shipperDeposits),
    '{packing_weight}': label.packingWeight?.toString() || '',
    // Khối lượng - đổi đơn vị
    '{total_weight_g}': label.packingWeight ? Math.round(label.packingWeight * 1000).toString() : '0',
    '{total_weight_kg}': label.packingWeight?.toString() || '0',
    
    '{reason_cancel}': label.reasonCancel || '',
    '{shipment_note}': label.note || '',
    '{note}': label.note || '', // Alias cho template
  };
}
