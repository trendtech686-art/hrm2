/**
 * Inventory Check Mapper - Phiếu kiểm kho
 * Đồng bộ với variables/phieu-kiem-hang.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

export interface InventoryCheckForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  adjustedOn?: string | Date;
  createdBy?: string;
  status?: string;
  reason?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
  };
  
  // Danh sách sản phẩm
  items: Array<{
    variantCode?: string;
    productName: string;
    variantName?: string;
    barcode?: string;
    unit?: string;
    stockQuantity: number;
    afterQuantity: number;
    changeQuantity: number;
    reason?: string;
    brand?: string;
    category?: string;
    variantOptions?: string;
    note?: string;
  }>;
  
  // Tổng
  totalQuantity?: number;
  totalSurplus?: number;
  totalShortage?: number;
  
  note?: string;
}

export function mapInventoryCheckToPrintData(check: InventoryCheckForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': check.location?.name || storeSettings.name || '',
    '{location_address}': check.location?.address || storeSettings.address || '',
    '{location_province}': check.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU KIỂM HÀNG ===
    '{code}': check.code,
    '{inventory_code}': check.code,
    '{created_on}': formatDate(check.createdAt),
    '{created_on_time}': formatTime(check.createdAt),
    '{modified_on}': formatDate(check.modifiedAt),
    '{modified_on_time}': formatTime(check.modifiedAt),
    '{adjusted_on}': formatDate(check.adjustedOn),
    '{adjusted_on_time}': formatTime(check.adjustedOn),
    '{account_name}': check.createdBy || '',
    '{status}': check.status || '',
    '{inventory_status}': check.status || '',
    '{reason}': check.reason || '',
    
    // === TỔNG ===
    '{total}': check.totalQuantity?.toString() || '0',
    '{total_items}': check.totalQuantity?.toString() || '0',
    '{total_surplus}': check.totalSurplus?.toString() || '0',
    '{total_shortage}': check.totalShortage?.toString() || '0',
    
    '{note}': check.note || '',
  };
}

export function mapInventoryCheckLineItems(items: InventoryCheckForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_variant_code}': item.variantCode || '',
    '{line_product_name}': item.productName,
    '{line_variant_name}': item.variantName || '',
    '{line_variant}': item.variantName || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_stock_quantity}': item.stockQuantity.toString(),
    '{line_on_hand}': item.stockQuantity.toString(),
    '{line_after_quantity}': item.afterQuantity.toString(),
    '{line_real_quantity}': item.afterQuantity.toString(),
    '{line_change_quantity}': item.changeQuantity.toString(),
    '{line_difference}': item.changeQuantity.toString(),
    '{line_reason}': item.reason || '',
    '{line_brand}': item.brand || '',
    '{line_category}': item.category || '',
    '{line_variant_options}': item.variantOptions || '',
    '{line_note}': item.note || '',
  }));
}
