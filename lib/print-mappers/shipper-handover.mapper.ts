/**
 * Shipper Handover Mapper - Phiếu bàn giao đơn cho shipper
 * Dùng cho vận chuyển - bàn giao đơn hàng cho đối tác giao hàng
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

/**
 * Interface cho Phiếu bàn giao đơn hàng cho shipper
 */
export interface ShipperHandoverForPrint {
  // === THÔNG TIN PHIẾU ===
  code: string;
  printedOn: string | Date;
  accountName?: string; // Người tạo phiếu
  
  // === THÔNG TIN HÃNG VẬN CHUYỂN ===
  shippingProviderName?: string;
  serviceName?: string;
  
  // === THÔNG TIN CHI NHÁNH ===
  location?: {
    name?: string;
    address?: string;
  };
  
  // === DANH SÁCH ĐƠN HÀNG BÀN GIAO ===
  orders: Array<{
    orderCode: string;
    shipmentCode?: string;
    shippingName?: string;
    shippingPhone?: string;
    shippingAddress?: string;
    city?: string;
    district?: string;
    cod?: number;
    freightPayer?: string;
    note?: string;
  }>;
  
  // === TỔNG KẾT ===
  quantity?: number;
  totalCod?: number;
  
  note?: string;
}

/**
 * Map ShipperHandoverForPrint sang PrintData
 */
export function mapShipperHandoverToPrintData(handover: ShipperHandoverForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': handover.location?.name || storeSettings.name || '',
    '{location_address}': handover.location?.address || storeSettings.address || '',
    
    // === THÔNG TIN PHIẾU BÀN GIAO ===
    '{hand_over_code}': handover.code,
    '{printed_on}': formatDate(handover.printedOn),
    '{current_account_name}': handover.accountName || '',
    '{account_name}': handover.accountName || '',
    
    // === THÔNG TIN VẬN CHUYỂN ===
    '{shipping_provider_name}': handover.shippingProviderName || '',
    '{service_name}': handover.serviceName || '',
    
    // === TỔNG GIÁ TRỊ ===
    '{total_cod}': formatCurrency(handover.totalCod),
    '{quantity}': handover.quantity?.toString() || handover.orders.length.toString(),
    
    '{note}': handover.note || '',
  };
}

/**
 * Map orders sang line items
 */
export function mapShipperHandoverLineItems(orders: ShipperHandoverForPrint['orders']): PrintLineItem[] {
  return orders.map((order, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{order_code}': order.orderCode,
    '{shipment_code}': order.shipmentCode || '',
    '{shipping_name}': order.shippingName || '',
    '{shipping_phone}': order.shippingPhone || '',
    '{shipping_phone_hide}': hidePhoneMiddle(order.shippingPhone || ''),
    '{shipping_address}': order.shippingAddress || '',
    '{city}': order.city || '',
    '{district}': order.district || '',
    '{cod}': formatCurrency(order.cod),
    '{freight_payer}': order.freightPayer || '',
    '{note}': order.note || '',
  }));
}
