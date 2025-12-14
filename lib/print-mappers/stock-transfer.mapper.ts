/**
 * Stock Transfer Mapper - Phiếu chuyển kho
 * Đồng bộ với variables/phieu-chuyen-hang.ts
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

export interface StockTransferForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  shippedOn?: string | Date;
  receivedOn?: string | Date;
  createdBy?: string;
  status?: string;
  reference?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
  };
  
  // Chi nhánh chuyển
  sourceLocationName: string;
  sourceLocationAddress?: string;
  
  // Chi nhánh nhận
  destinationLocationName: string;
  destinationLocationAddress?: string;
  
  // Khối lượng
  totalWeightG?: number;
  totalWeightKg?: number;
  
  // Danh sách sản phẩm
  items: Array<{
    variantCode?: string;
    productName: string;
    variantName?: string;
    barcode?: string;
    imageUrl?: string;
    unit?: string;
    quantity: number;
    receiptQuantity?: number;
    changeQuantity?: number;
    price?: number;
    amount?: number;
    amountReceived?: number;
    weightG?: number;
    weightKg?: number;
    brand?: string;
    category?: string;
    variantOptions?: string;
    serial?: string;
    lotNumber?: string;
    lotInfo?: string;
    lotInfoExpiry?: string;
    lotInfoQty?: string;
  }>;
  
  // Tổng giá trị
  totalQuantity?: number;
  totalReceiptQuantity?: number;
  totalAmountTransfer?: number;
  totalAmountReceipt?: number;
  totalFeeAmount?: number;
  
  note?: string;
}

export function mapStockTransferToPrintData(transfer: StockTransferForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': transfer.location?.name || storeSettings.name || '',
    '{location_address}': transfer.location?.address || storeSettings.address || '',
    '{location_province}': transfer.location?.province || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU CHUYỂN HÀNG ===
    '{order_code}': transfer.code,
    '{transfer_code}': transfer.code,
    '{created_on}': formatDate(transfer.createdAt),
    '{created_on_time}': formatTime(transfer.createdAt),
    '{modified_on}': formatDate(transfer.modifiedAt),
    '{modified_on_time}': formatTime(transfer.modifiedAt),
    '{shipped_on}': formatDate(transfer.shippedOn),
    '{shipped_on_time}': formatTime(transfer.shippedOn),
    '{received_on}': formatDate(transfer.receivedOn),
    '{received_on_time}': formatTime(transfer.receivedOn),
    '{account_name}': transfer.createdBy || '',
    '{status}': transfer.status || '',
    '{reference}': transfer.reference || '',
    
    // === CHI NHÁNH CHUYỂN ===
    '{source_location_name}': transfer.sourceLocationName,
    '{source_location_address}': transfer.sourceLocationAddress || '',
    
    // === CHI NHÁNH NHẬN ===
    '{destination_location_name}': transfer.destinationLocationName,
    '{target_location_name}': transfer.destinationLocationName,
    '{destination_location_address}': transfer.destinationLocationAddress || '',
    
    // === KHỐI LƯỢNG ===
    '{weight_g}': transfer.totalWeightG?.toString() || '0',
    '{weight_kg}': transfer.totalWeightKg?.toString() || '0',
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': transfer.totalQuantity?.toString() || '0',
    '{total_receipt_quantity}': transfer.totalReceiptQuantity?.toString() || '0',
    '{total_amount_transfer}': formatCurrency(transfer.totalAmountTransfer),
    '{total_amount_receipt}': formatCurrency(transfer.totalAmountReceipt),
    '{total_fee_amount}': formatCurrency(transfer.totalFeeAmount),
    
    '{note}': transfer.note || '',
  };
}

export function mapStockTransferLineItems(items: StockTransferForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_variant_code}': item.variantCode || '',
    '{line_product_name}': item.productName,
    '{line_variant_name}': item.variantName || '',
    '{line_variant}': item.variantName || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_variant_image}': item.imageUrl ? `<img src="${item.imageUrl}" style="max-width:50px;max-height:50px"/>` : '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{receipt_quantity}': item.receiptQuantity?.toString() || '',
    '{change_quantity}': item.changeQuantity?.toString() || '',
    '{line_price}': formatCurrency(item.price),
    '{line_amount}': formatCurrency(item.amount),
    '{line_amount_received}': formatCurrency(item.amountReceived),
    '{line_weight_g}': item.weightG?.toString() || '',
    '{line_weight_kg}': item.weightKg?.toString() || '',
    '{line_brand}': item.brand || '',
    '{line_category}': item.category || '',
    '{line_variant_options}': item.variantOptions || '',
    '{serials}': item.serial || '',
    '{lots_number_code1}': item.lotNumber || '',
    '{lots_number_code2}': item.lotInfoQty || '',
    '{lots_number_code3}': item.lotInfo || '',
    '{lots_number_code4}': item.lotInfoExpiry || '',
  }));
}
