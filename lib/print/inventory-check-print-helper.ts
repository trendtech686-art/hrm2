/**
 * Inventory Check Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu kiểm kho
 */

import type { InventoryCheck, InventoryCheckItem } from '../../features/inventory-checks/types';
import type { Branch } from '../../features/settings/branches/types';
import type { Employee } from '../../features/employees/types';
import { 
  InventoryCheckForPrint, 
  mapInventoryCheckToPrintData, 
  mapInventoryCheckLineItems,
} from '../print-mappers/inventory-check.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

/**
 * Chuyển đổi InventoryCheck entity sang InventoryCheckForPrint
 */
export function convertInventoryCheckForPrint(
  check: InventoryCheck,
  options: {
    branch?: Branch | null;
    creator?: Employee | null;
    creatorName?: string;
  } = {}
): InventoryCheckForPrint {
  const { branch, creator, creatorName } = options;

  // Tính tổng
  const totalQuantity = check.items.reduce((sum, item) => sum + item.actualQuantity, 0);
  const totalSurplus = check.items.reduce((sum, item) => item.difference > 0 ? sum + item.difference : sum, 0);
  const totalShortage = check.items.reduce((sum, item) => item.difference < 0 ? sum + Math.abs(item.difference) : sum, 0);

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'draft': 'Nháp',
    'balanced': 'Đã cân bằng',
    'cancelled': 'Đã hủy',
  };

  // Map lý do sang tiếng Việt
  const reasonMap: Record<string, string> = {
    'other': 'Khác',
    'damaged': 'Hư hỏng',
    'wear': 'Hao mòn',
    'return': 'Trả hàng',
    'transfer': 'Chuyển hàng',
    'production': 'Sản xuất',
  };

  return {
    // Thông tin cơ bản
    code: check.id,
    createdAt: check.createdAt,
    adjustedOn: check.balancedAt,
    createdBy: creator?.fullName || creatorName,
    status: statusMap[check.status] || check.status,
    reason: check.cancelledReason,
    
    // Thông tin chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : {
      name: check.branchName,
    },
    
    // Danh sách sản phẩm
    items: check.items.map(item => ({
      variantCode: item.productId,
      productName: item.productName,
      unit: item.unit || 'Cái',
      stockQuantity: item.systemQuantity,
      afterQuantity: item.actualQuantity,
      changeQuantity: item.difference,
      reason: item.reason ? reasonMap[item.reason] || item.reason : undefined,
      note: item.note,
    })),
    
    // Tổng
    totalQuantity,
    totalSurplus,
    totalShortage,
    
    note: check.note,
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
  mapInventoryCheckToPrintData,
  mapInventoryCheckLineItems,
};
