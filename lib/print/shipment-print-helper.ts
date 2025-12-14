/**
 * Shipment Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu giao hàng và phiếu bàn giao
 */

import type { Branch } from '../../features/settings/branches/types';
import type { Employee } from '../../features/employees/types';
import type { Order } from '../../features/orders/types';
import { 
  DeliveryForPrint,
  mapDeliveryToPrintData, 
  mapDeliveryLineItems,
} from '../print-mappers/delivery.mapper';
import {
  ShipperHandoverForPrint,
  mapShipperHandoverToPrintData,
  mapShipperHandoverLineItems,
} from '../print-mappers/shipper-handover.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Re-export types with aliases for backward compatibility
export type HandoverForPrint = ShipperHandoverForPrint;
export const mapHandoverToPrintData = mapShipperHandoverToPrintData;
export const mapHandoverLineItems = mapShipperHandoverLineItems;

// Interface cho Shipment (flexible - accepts Shipment and ShipmentView)
interface ShipmentLike {
  systemId: string;
  id: string;
  orderSystemId?: string;
  orderId: string;
  trackingCode?: string;
  carrier?: string;
  carrierServiceName?: string;
  service?: string;
  deliveryStatus?: string;
  printStatus?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerEmail?: string;
  branchName?: string;
  codAmount?: number;
  shippingFee?: number;
  shippingFeeToPartner?: number;
  payer?: string;
  totalProductQuantity?: number;
  weight?: number;
  dimensions?: string;
  createdAt: string;
  createdBy?: string;
  createdByName?: string;
  creatorEmployeeName?: string;
  dispatchedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  noteToShipper?: string;
  note?: string;
  packagingSystemId?: string;
  packagingDate?: string;
  customerDue?: number;
}

// Interface cho Order (flexible)
interface OrderLike {
  lineItems: Array<{
    productId?: string;
    productName: string;
    variantName?: string;
    quantity: number;
    price?: number;
    unitPrice?: number;
    amount: number;
    unit?: string;
    sku?: string;
  }>;
  grandTotal?: number;
}

// Interface cho Customer (optional)
interface CustomerLike {
  name?: string;
  phone?: string;
  email?: string;
  shippingAddress_street?: string;
  shippingAddress_ward?: string;
  shippingAddress_province?: string;
}

/**
 * Chuyển đổi Shipment + Order sang DeliveryForPrint (phiếu giao hàng)
 */
export function convertShipmentToDeliveryForPrint(
  shipment: ShipmentLike,
  order: OrderLike,
  options: {
    customer?: CustomerLike | null;
    branch?: Branch | null;
    creator?: Employee | null;
  } = {}
): DeliveryForPrint {
  const { customer, branch, creator } = options;

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'pending': 'Chờ lấy hàng',
    'picked_up': 'Đã lấy hàng',
    'in_transit': 'Đang vận chuyển',
    'delivered': 'Đã giao hàng',
    'returned': 'Hoàn hàng',
    'cancelled': 'Đã hủy',
  };

  return {
    // Thông tin cơ bản
    code: shipment.id,
    orderCode: shipment.orderId,
    createdAt: shipment.createdAt,
    createdBy: creator?.fullName || shipment.creatorEmployeeName || shipment.createdByName,
    trackingCode: shipment.trackingCode,
    carrierName: shipment.carrier,
    deliveryStatus: shipment.deliveryStatus ? (statusMap[shipment.deliveryStatus] || shipment.deliveryStatus) : undefined,
    
    // Thông tin khách hàng
    customerName: shipment.customerName || customer?.name,
    customerPhone: shipment.customerPhone || customer?.phone,
    shippingAddress: shipment.customerAddress || customer?.shippingAddress_street,
    
    // Thông tin người nhận (có thể khác khách hàng)
    receiverName: shipment.customerName || customer?.name,
    receiverPhone: shipment.customerPhone || customer?.phone,
    
    // Danh sách sản phẩm
    items: order.lineItems.map(item => ({
      variantCode: item.productId || item.sku,
      productName: item.productName,
      variantName: item.variantName,
      unit: item.unit || 'Cái',
      quantity: item.quantity,
      price: item.price || item.unitPrice || 0,
      amount: item.amount,
    })),
    
    // Tổng giá trị
    totalQuantity: shipment.totalProductQuantity || order.lineItems.reduce((s, i) => s + i.quantity, 0),
    deliveryFee: shipment.shippingFee,
    codAmount: shipment.codAmount,
    totalAmount: order.grandTotal,
    
    note: shipment.note,
  };
}

/**
 * Chuyển đổi danh sách Shipment sang HandoverForPrint (phiếu bàn giao)
 */
export function convertShipmentsToHandoverForPrint(
  shipments: ShipmentLike[],
  options: {
    branch?: Branch | null;
    creator?: Employee | null;
  } = {}
): HandoverForPrint {
  const { branch, creator } = options;

  // Tạo mã phiếu bàn giao
  const now = new Date();
  const code = `BG${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

  // Lấy carrier từ shipment đầu tiên
  const carrier = shipments[0]?.carrier || '';
  
  // Tính tổng COD
  const totalCod = shipments.reduce((sum, s) => sum + (s.codAmount || 0), 0);

  return {
    // Thông tin cơ bản
    code,
    printedOn: now,
    accountName: creator?.fullName,
    
    // Thông tin hãng vận chuyển
    shippingProviderName: carrier,
    
    // Thông tin chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
    } : undefined,
    
    // Danh sách đơn hàng
    orders: shipments.map(s => ({
      orderCode: s.orderId,
      shipmentCode: s.id,
      shippingName: s.customerName,
      shippingPhone: s.customerPhone,
      shippingAddress: s.customerAddress,
      cod: s.codAmount,
      freightPayer: s.payer,
    })),
    
    // Tổng
    quantity: shipments.length,
    totalCod,
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
    hotline: storeInfo?.hotline || '',
    email: storeInfo?.email || generalSettings?.email || '',
    website: storeInfo?.website,
    taxCode: storeInfo?.taxCode,
    province: storeInfo?.province,
    logo: getStoreLogo(storeInfo?.logo),
  };
}

// Re-export mappers
export {
  mapDeliveryToPrintData,
  mapDeliveryLineItems,
};
