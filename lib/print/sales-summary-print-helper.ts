/**
 * Sales Summary Print Helper
 * Helpers để chuẩn bị dữ liệu in cho báo cáo tổng kết bán hàng
 */

import type { Branch } from '../../features/settings/branches/types';
import type { Employee } from '../../features/employees/types';
import { 
  SalesSummaryForPrint, 
  mapSalesSummaryToPrintData,
  mapSalesSummaryOrdersFinished,
  mapSalesSummaryItemsFulfillment,
  mapSalesSummaryItemsReturn,
  mapSalesSummaryPaymentMethods,
} from '../print-mappers/sales-summary.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Interface cho sales summary item
interface SalesSummaryItem {
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
  discount?: number;
  netAmount: number;
}

// Interface cho payment summary
interface PaymentSummary {
  method: string;
  amount: number;
  count: number;
}

// Interface cho sales summary
interface SalesSummary {
  branchSystemId: string;
  branchName: string;
  reportDate: string;
  startDate: string;
  endDate: string;
  
  // Tổng quan
  totalOrders: number;
  totalItems: number;
  totalRevenue: number;
  totalDiscount: number;
  totalTax: number;
  netRevenue: number;
  
  // Chi tiết theo sản phẩm
  items?: SalesSummaryItem[];
  
  // Chi tiết theo phương thức thanh toán
  payments?: PaymentSummary[];
  
  // Chi tiết theo khách hàng
  totalCustomers?: number;
  newCustomers?: number;
  returningCustomers?: number;
  
  // So sánh
  previousPeriodRevenue?: number;
  revenueGrowth?: number;
  
  createdAt: string;
  createdBy?: string;
  createdByName?: string;
  note?: string;
}

/**
 * Chuyển đổi SalesSummary entity sang SalesSummaryForPrint
 */
export function convertSalesSummaryForPrint(
  summary: SalesSummary,
  options: {
    branch?: Branch | null;
    creator?: Employee | null;
  } = {}
): SalesSummaryForPrint {
  const { branch, creator } = options;

  return {
    // Thông tin cơ bản
    datePrint: summary.reportDate,
    timeFilter: `${summary.startDate} - ${summary.endDate}`,
    
    // Chi nhánh
    locationName: branch?.name || summary.branchName,
    accountName: creator?.fullName || summary.createdByName,
    
    // Tổng quan
    totalQuantityOrderFinished: summary.totalOrders,
    totalQuantityLineItemFulfillment: summary.totalItems,
    totalLineAmount: summary.totalRevenue,
    totalOrderPayment: summary.netRevenue,
    
    // Chi tiết đơn hàng (nếu có)
    ordersFinished: summary.items?.map((item, idx) => ({
      stt: idx + 1,
      orderCode: item.productId,
      amount: item.amount,
      discount: item.discount || 0,
      tax: 0,
      total: item.netAmount,
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
  mapSalesSummaryToPrintData,
  mapSalesSummaryOrdersFinished,
  mapSalesSummaryItemsFulfillment,
  mapSalesSummaryItemsReturn,
  mapSalesSummaryPaymentMethods,
};
