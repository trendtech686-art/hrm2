/**
 * Warranty Mapper - Phiếu bảo hành
 * Đồng bộ với variables/phieu-bao-hanh.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatDate,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

export interface WarrantyForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  createdBy?: string;
  status?: string;
  claimStatus?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
  };
  
  // Thông tin khách hàng
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  customerGroup?: string;
  
  // Thông tin đơn hàng liên quan
  orderCode?: string;
  
  // Thông tin sản phẩm bảo hành (đơn lẻ - backward compatibility)
  productName?: string;
  variantName?: string;
  variantSku?: string;
  barcode?: string;
  serialNumber?: string;
  warrantyPolicyName?: string;
  warrantyPeriod?: string;
  warrantyPeriodDays?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  
  // Danh sách sản phẩm (nhiều sản phẩm)
  items?: Array<{
    productName: string;
    variantName?: string;
    variantSku?: string;
    barcode?: string;
    serial?: string;
    warrantyPolicyName?: string;
    warrantyPeriod?: string;
    warrantyPeriodDays?: number;
    startDate?: string | Date;
    endDate?: string | Date;
  }>;
  
  issueDescription?: string;
  note?: string;
}

export function mapWarrantyToPrintData(warranty: WarrantyForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': warranty.location?.name || storeSettings.name || '',
    '{location_address}': warranty.location?.address || storeSettings.address || '',
    '{location_province}': warranty.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU BẢO HÀNH ===
    '{warranty_card_code}': warranty.code,
    '{warranty_code}': warranty.code,
    '{created_on}': formatDate(warranty.createdAt),
    '{modified_on}': formatDate(warranty.modifiedAt),
    '{account_name}': warranty.createdBy || '',
    '{status}': warranty.status || '',
    '{claim_status}': warranty.claimStatus || '',
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': warranty.customerName,
    '{customer_phone_number}': warranty.customerPhone || '',
    '{customer_address1}': warranty.customerAddress || '',
    '{customer_address}': warranty.customerAddress || '',
    '{customer_group}': warranty.customerGroup || '',
    
    // === THÔNG TIN ĐƠN HÀNG ===
    '{order_code}': warranty.orderCode || '',
    
    // === THÔNG TIN SẢN PHẨM (ĐƠN LẺ) ===
    '{line_product_name}': warranty.productName || '',
    '{product_name}': warranty.productName || '',
    '{line_variant_name}': warranty.variantName || '',
    '{line_variant_sku}': warranty.variantSku || '',
    '{line_variant_barcode}': warranty.barcode || '',
    '{serials}': warranty.serialNumber || '',
    '{serial_number}': warranty.serialNumber || '',
    '{term_name}': warranty.warrantyPolicyName || '',
    '{term_number}': warranty.warrantyPeriod || '',
    '{warranty_duration}': warranty.warrantyPeriod || '',
    '{warranty_period_days}': warranty.warrantyPeriodDays?.toString() || '',
    '{start_date}': formatDate(warranty.startDate),
    '{end_date}': formatDate(warranty.endDate),
    '{warranty_expired_on}': formatDate(warranty.endDate),
    
    '{issue_description}': warranty.issueDescription || '',
    '{warranty_note}': warranty.note || '',
  };
}

export function mapWarrantyLineItems(items: WarrantyForPrint['items']): PrintLineItem[] {
  if (!items) return [];
  
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_product_name}': item.productName,
    '{line_variant_name}': item.variantName || '',
    '{line_variant_sku}': item.variantSku || '',
    '{line_variant_barcode}': item.barcode || '',
    '{serials}': item.serial || '',
    '{term_name}': item.warrantyPolicyName || '',
    '{term_number}': item.warrantyPeriod || '',
    '{warranty_period_days}': item.warrantyPeriodDays?.toString() || '',
    '{start_date}': formatDate(item.startDate),
    '{end_date}': formatDate(item.endDate),
  }));
}
