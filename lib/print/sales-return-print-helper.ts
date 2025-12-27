/**
 * Sales Return Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu trả hàng
 */

import type { SalesReturn, ReturnLineItem } from '../../features/sales-returns/store';
import type { Customer } from '@/lib/types/prisma-extended';
import type { Branch } from '@/lib/types/prisma-extended';
import type { Employee } from '@/lib/types/prisma-extended';
import type { Order } from '../../features/orders/store';
import { 
  SalesReturnForPrint, 
  mapSalesReturnToPrintData, 
  mapSalesReturnLineItems,
} from '../print-mappers/sales-return.mapper';
import type { StoreSettings } from '../print-service';
import { getGeneralSettingsSync } from '../settings-cache';

/**
 * Chuyển đổi SalesReturn entity sang SalesReturnForPrint
 */
export function convertSalesReturnForPrint(
  salesReturn: SalesReturn,
  options: {
    customer?: Customer | null;
    creator?: Employee | null;
    branch?: Branch | null;
    originalOrder?: Order | null;
  } = {}
): SalesReturnForPrint {
  const { customer, creator, branch, originalOrder } = options;

  // Tính tổng số lượng
  const totalQuantity = salesReturn.items.reduce((sum, item) => sum + item.returnQuantity, 0);

  // Format địa chỉ khách hàng
  const customerFirstAddress = customer?.addresses?.[0];
  const customerAddressString = customerFirstAddress 
    ? [customerFirstAddress.street, customerFirstAddress.ward, customerFirstAddress.district, customerFirstAddress.province].filter(Boolean).join(', ')
    : '';

  return {
    // Thông tin cơ bản
    code: salesReturn.id,
    orderReturnCode: salesReturn.id,
    createdAt: salesReturn.returnDate,
    createdBy: creator?.fullName || salesReturn.creatorName,
    
    // Trạng thái
    returnStatus: salesReturn.isReceived ? 'Đã nhận hàng' : 'Chưa nhận hàng',
    refundStatus: salesReturn.refundAmount && salesReturn.refundAmount > 0 ? 'Đã hoàn tiền' : 'Chưa hoàn',
    reason: salesReturn.reason,
    
    // Thông tin chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : undefined,
    
    // Thông tin đơn hàng gốc
    orderCode: salesReturn.orderId,
    
    // Thông tin khách hàng
    customerName: customer?.name || salesReturn.customerName,
    customerCode: customer?.id,
    customerPhone: customer?.phone,
    customerEmail: customer?.email,
    billingAddress: customerAddressString,
    customerDebt: customer?.currentDebt,
    
    // Thông tin giao hàng (từ original order nếu có)
    shippingAddress: typeof originalOrder?.shippingAddress === 'object' 
      ? [
          originalOrder.shippingAddress.street,
          originalOrder.shippingAddress.ward,
          originalOrder.shippingAddress.district,
          originalOrder.shippingAddress.province
        ].filter(Boolean).join(', ')
      : (originalOrder?.shippingAddress as string) || '',
    
    // Danh sách sản phẩm trả (map sang returnItems)
    returnItems: salesReturn.items.map(item => ({
      variantCode: item.productId,
      productName: item.productName,
      unit: 'Cái',
      quantity: item.returnQuantity,
      price: item.unitPrice,
      amount: item.totalValue,
      note: item.note,
    })),
    
    // Danh sách sản phẩm đổi (map sang items - sản phẩm mua mới)
    items: salesReturn.exchangeItems?.map(item => ({
      variantCode: item.productId,
      productName: item.productName,
      unit: 'Cái',
      quantity: item.quantity,
      price: item.unitPrice,
      amount: item.quantity * item.unitPrice,
    })) || [],
    
    // Tổng giá trị
    totalQuantity,
    returnTotalQuantity: totalQuantity,
    returnTotalAmount: salesReturn.totalReturnValue,
    totalOrderExchangeAmount: salesReturn.grandTotalNew,
    moneyReturn: salesReturn.finalAmount < 0 ? Math.abs(salesReturn.finalAmount) : 0,
    paymentCustomer: salesReturn.finalAmount > 0 ? salesReturn.finalAmount : 0,
    
    note: salesReturn.note || salesReturn.notes,
  };
}

/**
 * Lấy logo từ general-settings nếu storeInfo không có
 */
function getStoreLogo(storeInfoLogo?: string): string | undefined {
  if (storeInfoLogo) return storeInfoLogo;
  try {
    const settings = getGeneralSettingsSync();
    return settings.logoUrl || undefined;
  } catch (e) { /* ignore */ }
  return undefined;
}

/**
 * Tạo StoreSettings từ Branch
 */
export function createStoreSettingsFromBranch(
  branch?: Branch | null,
  storeInfo?: {
    companyName?: string;
    brandName?: string;
    hotline?: string;
    email?: string;
    website?: string;
    taxCode?: string;
    headquartersAddress?: string;
    province?: string;
    logo?: string;
  }
): StoreSettings {
  return {
    name: storeInfo?.companyName || storeInfo?.brandName || branch?.name || '',
    address: storeInfo?.headquartersAddress || branch?.address || '',
    phone: storeInfo?.hotline || branch?.phone || '',
    email: storeInfo?.email || '',
    website: storeInfo?.website,
    taxCode: storeInfo?.taxCode,
    province: storeInfo?.province || branch?.province,
    logo: getStoreLogo(storeInfo?.logo),
  };
}

// Re-export mappers
export {
  mapSalesReturnToPrintData,
  mapSalesReturnLineItems,
};
