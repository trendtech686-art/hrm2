/**
 * Refund Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu xác nhận hoàn
 * 
 * Note: RefundConfirmationForPrint là phiếu xác nhận hoàn hàng từ vận chuyển
 * (nhiều đơn hàng), không phải refund tiền cho khách
 */

import type { Branch } from '@/lib/types/prisma-extended';
import type { Employee } from '@/lib/types/prisma-extended';
import { 
  RefundConfirmationForPrint, 
  mapRefundConfirmationToPrintData,
  mapRefundConfirmationLineItems,
} from '../print-mappers/refund-confirmation.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Interface cho shipment return (đơn hoàn hàng từ vận chuyển)
interface ShipmentReturn {
  orderCode: string;
  shipmentCode?: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  city?: string;
  district?: string;
  codAmount?: number;
  note?: string;
}

/**
 * Chuyển đổi danh sách ShipmentReturn sang RefundConfirmationForPrint
 */
export function convertRefundForPrint(
  shipmentReturns: ShipmentReturn[],
  options: {
    code?: string;
    branch?: Branch | null;
    creator?: Employee | null;
    shippingProvider?: string;
    serviceName?: string;
  } = {}
): RefundConfirmationForPrint {
  const { code, branch, creator, shippingProvider, serviceName } = options;
  
  const now = new Date();
  const generatedCode = code || `XNH${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

  const totalCod = shipmentReturns.reduce((sum, s) => sum + (s.codAmount || 0), 0);

  return {
    code: generatedCode,
    printedOn: now,
    accountName: creator?.fullName,
    
    location: branch ? {
      name: branch.name,
      address: branch.address,
    } : undefined,
    
    shippingProviderName: shippingProvider,
    serviceName,
    
    totalCod,
    quantity: shipmentReturns.length,
    
    orders: shipmentReturns.map(s => ({
      orderCode: s.orderCode,
      shipmentCode: s.shipmentCode,
      shippingName: s.customerName,
      shippingPhone: s.customerPhone,
      shippingAddress: s.customerAddress,
      city: s.city,
      district: s.district,
      cod: s.codAmount,
      note: s.note,
    })),
  };
}

/**
 * Tạo StoreSettings từ storeInfo
 */
export function createStoreSettings(storeInfo?: {
  companyName?: string;
  brandName?: string;
  hotline?: string;
  email?: string;
  website?: string;
  taxCode?: string;
  headquartersAddress?: string;
  province?: string;
  logo?: string;
}): StoreSettings {
  // Fallback lấy từ general-settings nếu storeInfo trống
  const generalSettings = getGeneralSettings();
  return {
    name: storeInfo?.companyName || storeInfo?.brandName || generalSettings?.companyName || '',
    address: storeInfo?.headquartersAddress || generalSettings?.companyAddress || '',
    phone: storeInfo?.hotline || generalSettings?.phoneNumber || '',
    email: storeInfo?.email || generalSettings?.email || '',
    website: storeInfo?.website,
    taxCode: storeInfo?.taxCode,
    province: storeInfo?.province,
    logo: getStoreLogo(storeInfo?.logo),
  };
}

// Re-export mappers
export {
  mapRefundConfirmationToPrintData,
  mapRefundConfirmationLineItems,
};
