/**
 * Packing Guide Mapper - Phiếu hướng dẫn đóng gói (phieu-huong-dan-dong-goi)
 * Đồng bộ với variables/phieu-huong-dan-dong-goi.ts
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

export interface PackingGuideForPrint {
  // Thông tin cơ bản
  createdAt: string | Date;
  listOrderCode?: string[];
  orderCode?: string;
  
  // Nhân viên
  accountName?: string;
  accountPhone?: string;
  accountEmail?: string;
  
  // Chi nhánh
  locationName?: string;
  
  // Thông tin khách hàng
  customerName?: string;
  customerPhoneNumber?: string;
  
  // Thông tin vận chuyển
  shippingAddress?: string;
  cod?: number;
  
  // Danh sách sản phẩm
  items: Array<{
    variantCode?: string;
    variantBarcode?: string;
    productName: string;
    variantName?: string;
    variantOptions?: string;
    variant?: string;
    unit?: string;
    quantity: number;
    brand?: string;
    category?: string;
    binLocation?: string;
    image?: string;
    variantQrCode?: string;
    compositeDetails?: string;
    productDescription?: string;
    note?: string;
    storeNote?: string;
  }>;
  
  // Tổng giá trị
  total?: number;
  totalProductQuantity?: number;
  totalQuantity?: number;
  
  orderNote?: string;
  packingNote?: string;
}

export function mapPackingGuideToPrintData(guide: PackingGuideForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN PHIẾU HƯỚNG DẪN ĐÓNG GÓI ===
    '{created_on}': formatDate(guide.createdAt),
    '{created_on_time}': formatTime(guide.createdAt),
    '{list_order_code}': guide.listOrderCode?.join(', ') || '',
    '{order_code}': guide.orderCode || guide.listOrderCode?.[0] || '',
    
    // === NHÂN VIÊN ===
    '{account_name}': guide.accountName || '',
    '{account_phone}': guide.accountPhone || '',
    '{account_email}': guide.accountEmail || '',
    
    // === CHI NHÁNH ===
    '{location_name}': guide.locationName || storeSettings.name || '',
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': guide.customerName || '',
    '{customer_phone_number}': guide.customerPhoneNumber || '',
    
    // === THÔNG TIN VẬN CHUYỂN ===
    '{shipping_address}': guide.shippingAddress || '',
    '{cod}': formatCurrency(guide.cod),
    
    // === TỔNG GIÁ TRỊ ===
    '{total}': formatCurrency(guide.total),
    '{total_product_quantity}': guide.totalProductQuantity?.toString() || '0',
    '{total_quantity}': guide.totalQuantity?.toString() || guide.totalProductQuantity?.toString() || '0',
    
    '{order_note}': guide.orderNote || '',
    '{packing_note}': guide.packingNote || '',
  };
}

export function mapPackingGuideLineItems(items: PackingGuideForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_variant_sku}': item.variantCode || '',
    '{line_variant_code}': item.variantCode || '',
    '{line_variant_barcode}': item.variantBarcode || '',
    '{line_product_name}': item.productName,
    '{line_variant_name}': item.variantName || '',
    '{line_variant}': item.variant || item.variantName || '',
    '{line_variant_options}': item.variantOptions || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_brand}': item.brand || '',
    '{line_category}': item.category || '',
    '{bin_location}': item.binLocation || '',
    '{line_image}': item.image || '',
    '{line_variant_qrcode}': item.variantQrCode 
      ? `https://quickchart.io/qr?text=${encodeURIComponent(item.variantQrCode)}&size=100`
      : '',
    '{composite_details}': item.compositeDetails || '',
    '{line_product_description}': item.productDescription || '',
    '{lineitem_note}': item.note || '',
    '{note_of_store}': item.storeNote || '',
    '{location_name}': '', // Will be set at item level if needed
  }));
}
