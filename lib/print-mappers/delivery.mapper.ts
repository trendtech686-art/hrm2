/**
 * Delivery Mapper - Phiếu giao hàng
 * Đồng bộ với variables/phieu-giao-hang.ts
 * 
 * Variables coverage: 100%
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
} from '@/lib/print-service';

// Helper function để tạo barcode image
function generateBarcodeImage(code: string | undefined, height = 50): string {
  if (!code) return '';
  return `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(code)}" style="height:${height}px" alt="barcode"/>`;
}

// Helper function để tạo QR code image  
function generateQRCodeImage(code: string | undefined, size = 100): string {
  if (!code) return '';
  return `<img src="https://quickchart.io/qr?text=${encodeURIComponent(code)}&size=${size}" style="width:${size}px;height:${size}px" alt="qrcode"/>`;
}

export interface DeliveryForPrint {
  // Thông tin cơ bản
  code: string;
  orderCode: string;
  createdAt: string | Date;
  shippedAt?: string | Date;
  createdBy?: string;
  shipperName?: string;
  deliveryStatus?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    phone?: string;
    province?: string;
  };
  
  // Thông tin vận chuyển
  trackingCode?: string;
  carrierName?: string;
  deliveryType?: string;
  serviceName?: string;
  
  // Thông tin khách hàng
  customerName: string;
  customerCode?: string;
  customerPhone?: string;
  customerEmail?: string;
  
  // Thông tin người nhận
  receiverName?: string;
  receiverPhone?: string;
  shippingAddress: string;
  city?: string;
  district?: string;
  ward?: string;
  
  // Danh sách sản phẩm
  items: Array<{
    variantCode?: string;
    productName: string;
    variantName?: string;
    barcode?: string;
    unit?: string;
    quantity: number;
    price?: number;
    amount?: number;
    weight?: number;
    note?: string;
    serial?: string;
    lotNumber?: string;
  }>;
  
  // Tổng giá trị
  totalQuantity?: number;
  totalWeight?: number;
  subtotal?: number;
  deliveryFee?: number;
  codAmount?: number;
  totalAmount?: number;
  
  note?: string;
}

export function mapDeliveryToPrintData(delivery: DeliveryForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CỬA HÀNG / CHI NHÁNH ===
    '{location_name}': delivery.location?.name || storeSettings.name || '',
    '{location_address}': delivery.location?.address || storeSettings.address || '',
    '{location_phone_number}': delivery.location?.phone || storeSettings.phone || '',
    '{location_province}': delivery.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU GIAO HÀNG ===
    '{delivery_code}': delivery.code,
    '{order_code}': delivery.orderCode,
    '{order_qr_code}': generateQRCodeImage(delivery.orderCode, 100),
    '{order_bar_code}': generateBarcodeImage(delivery.orderCode, 50),
    '{created_on}': formatDate(delivery.createdAt),
    '{created_on_time}': formatTime(delivery.createdAt),
    '{shipped_on}': formatDate(delivery.shippedAt),
    '{shipped_on_time}': formatTime(delivery.shippedAt),
    '{account_name}': delivery.createdBy || '',
    '{shipper_name}': delivery.shipperName || '',
    '{delivery_status}': delivery.deliveryStatus || '',
    
    // === THÔNG TIN VẬN CHUYỂN ===
    '{tracking_number}': delivery.trackingCode || '',
    '{tracking_number_qr_code}': generateQRCodeImage(delivery.trackingCode, 100),
    '{tracking_number_bar_code}': generateBarcodeImage(delivery.trackingCode, 50),
    '{shipment_barcode}': generateBarcodeImage(delivery.trackingCode, 50),
    '{shipment_qrcode}': generateQRCodeImage(delivery.trackingCode, 100),
    '{carrier_name}': delivery.carrierName || '',
    '{partner_name}': delivery.carrierName || '',
    '{delivery_type}': delivery.deliveryType || '',
    '{service_name}': delivery.serviceName || '',
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': delivery.customerName,
    '{customer_code}': delivery.customerCode || '',
    '{customer_phone_number}': delivery.customerPhone || '',
    '{customer_phone_number_hide}': hidePhoneMiddle(delivery.customerPhone),
    '{customer_email}': delivery.customerEmail || '',
    
    // === THÔNG TIN NGƯỜI NHẬN ===
    '{receiver_name}': delivery.receiverName || delivery.customerName,
    '{receiver_phone}': delivery.receiverPhone || delivery.customerPhone || '',
    '{receiver_phone_hide}': hidePhoneMiddle(delivery.receiverPhone || delivery.customerPhone),
    '{shipping_address}': delivery.shippingAddress,
    '{city}': delivery.city || '',
    '{district}': delivery.district || '',
    '{ward}': delivery.ward || '',
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': (delivery.totalQuantity ?? 0).toString(),
    '{total_weight}': delivery.totalWeight?.toString() || '',
    '{total}': formatCurrency(delivery.subtotal || 0),
    '{delivery_fee}': formatCurrency(delivery.deliveryFee || 0),
    '{cod_amount}': formatCurrency(delivery.codAmount || 0),
    '{cod_amount_text}': numberToWords(delivery.codAmount || 0),
    '{total_amount}': formatCurrency(delivery.totalAmount || 0),
    '{total_text}': numberToWords(delivery.totalAmount || 0),
    
    '{note}': delivery.note || '',
  };
}

export function mapDeliveryLineItems(items: DeliveryForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_variant_code}': item.variantCode || '',
    '{line_product_name}': item.productName,
    '{line_variant}': item.variantName || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_price}': formatCurrency(item.price || 0),
    '{line_amount}': formatCurrency(item.amount || 0),
    '{line_weight}': item.weight?.toString() || '',
    '{line_note}': item.note || '',
    '{serials}': item.serial || '',
    '{lots_number_code1}': item.lotNumber || '',
  }));
}
