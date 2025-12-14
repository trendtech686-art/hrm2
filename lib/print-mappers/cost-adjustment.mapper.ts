/**
 * Cost Adjustment Mapper - Phiếu điều chỉnh giá vốn
 * Đồng bộ với variables/phieu-dieu-chinh-gia-von.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatDate,
  formatTime,
  formatCurrency,
  getStoreData,
  StoreSettings
} from './types';

export interface CostAdjustmentForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  confirmedDate?: string | Date;
  cancelledDate?: string | Date;
  createdBy?: string;
  createdByName?: string;
  confirmedBy?: string;
  confirmedByName?: string;
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
    oldPrice: number;
    newPrice: number;
    difference: number;
    onHand: number;
    totalDifference: number;
    reason?: string;
    brand?: string;
    category?: string;
    variantOptions?: string;
  }>;
  
  // Tổng
  totalItems?: number;
  totalDifference?: number;
  totalIncrease?: number;
  totalDecrease?: number;
  
  note?: string;
}

export function mapCostAdjustmentToPrintData(adjustment: CostAdjustmentForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': adjustment.location?.name || storeSettings.name || '',
    '{location_address}': adjustment.location?.address || storeSettings.address || '',
    '{location_province}': adjustment.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU ĐIỀU CHỈNH ===
    '{code}': adjustment.code,
    '{adjustment_code}': adjustment.code,
    '{created_on}': formatDate(adjustment.createdAt),
    '{created_on_time}': formatTime(adjustment.createdAt),
    '{modified_on}': formatDate(adjustment.modifiedAt),
    '{confirmed_on}': formatDate(adjustment.confirmedDate),
    '{cancelled_on}': formatDate(adjustment.cancelledDate),
    '{account_name}': adjustment.createdByName || adjustment.createdBy || '',
    '{confirmed_by}': adjustment.confirmedByName || adjustment.confirmedBy || '',
    '{status}': adjustment.status || '',
    '{reason}': adjustment.reason || '',
    
    // === TỔNG ===
    '{total_items}': adjustment.totalItems?.toString() || '0',
    '{total_difference}': formatCurrency(adjustment.totalDifference),
    '{total_increase}': formatCurrency(adjustment.totalIncrease),
    '{total_decrease}': formatCurrency(adjustment.totalDecrease),
    
    '{note}': adjustment.note || '',
  };
}

export function mapCostAdjustmentLineItems(items: CostAdjustmentForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_variant_code}': item.variantCode || '',
    '{line_product_name}': item.productName,
    '{line_variant_name}': item.variantName || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_old_price}': formatCurrency(item.oldPrice),
    '{line_new_price}': formatCurrency(item.newPrice),
    '{line_difference}': formatCurrency(item.difference),
    '{line_on_hand}': item.onHand.toString(),
    '{line_total_difference}': formatCurrency(item.totalDifference),
    '{line_reason}': item.reason || '',
    '{line_brand}': item.brand || '',
    '{line_category}': item.category || '',
    '{line_variant_options}': item.variantOptions || '',
  }));
}
