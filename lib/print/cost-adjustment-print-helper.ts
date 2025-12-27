/**
 * Cost Adjustment Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu điều chỉnh giá vốn
 */

import type { CostAdjustment } from '@/lib/types/prisma-extended';
import type { Branch } from '@/lib/types/prisma-extended';
import type { EmployeeModel as Employee } from '@/generated/prisma/models/Employee';
import { 
  CostAdjustmentForPrint, 
  mapCostAdjustmentToPrintData, 
  mapCostAdjustmentLineItems,
} from '../print-mappers/cost-adjustment.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

/**
 * Chuyển đổi CostAdjustment entity sang CostAdjustmentForPrint
 */
export function convertCostAdjustmentForPrint(
  adjustment: CostAdjustment,
  options: {
    branch?: Branch | null;
    creator?: Employee | null;
    creatorName?: string;
  } = {}
): CostAdjustmentForPrint {
  const { branch, creator, creatorName } = options;

  // Tính tổng
  const totalItems = adjustment.items.length;
  const totalIncrease = adjustment.items.reduce((sum, item) => 
    item.adjustmentAmount > 0 ? sum + item.adjustmentAmount : sum, 0);
  const totalDecrease = adjustment.items.reduce((sum, item) => 
    item.adjustmentAmount < 0 ? sum + Math.abs(item.adjustmentAmount) : sum, 0);
  const totalDifference = adjustment.items.reduce((sum, item) => 
    sum + item.adjustmentAmount, 0);

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'draft': 'Nháp',
    'DRAFT': 'Nháp',
    'confirmed': 'Đã xác nhận',
    'CONFIRMED': 'Đã xác nhận',
    'cancelled': 'Đã hủy',
    'CANCELLED': 'Đã hủy',
  };

  return {
    // Thông tin cơ bản
    code: adjustment.id,
    createdAt: adjustment.createdDate,
    confirmedDate: adjustment.confirmedDate,
    cancelledDate: adjustment.cancelledDate,
    createdBy: adjustment.createdBySystemId,
    createdByName: creator?.fullName || creatorName || adjustment.createdByName,
    confirmedBy: adjustment.confirmedBySystemId,
    confirmedByName: adjustment.confirmedByName,
    status: statusMap[adjustment.status] || adjustment.status,
    reason: adjustment.reason,
    
    // Thông tin chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : undefined,
    
    // Danh sách sản phẩm - App fields: oldCostPrice, newCostPrice
    items: adjustment.items.map(item => ({
      variantCode: item.productId,
      productName: item.productName,
      unit: 'Cái',
      oldPrice: item.oldCostPrice,
      newPrice: item.newCostPrice,
      difference: item.adjustmentAmount,
      onHand: 0,
      totalDifference: item.adjustmentAmount,
      reason: item.reason || undefined,
    })),
    
    // Tổng
    totalItems,
    totalDifference,
    totalIncrease,
    totalDecrease,
    
    note: adjustment.note || undefined,
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
  mapCostAdjustmentToPrintData,
  mapCostAdjustmentLineItems,
};
