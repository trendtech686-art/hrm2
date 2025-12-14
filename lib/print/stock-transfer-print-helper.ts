/**
 * Stock Transfer Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu chuyển kho
 */

import type { StockTransfer, StockTransferItem } from '../../features/stock-transfers/types';
import type { Branch } from '../../features/settings/branches/types';
import type { Employee } from '../../features/employees/types';
import { 
  StockTransferForPrint, 
  mapStockTransferToPrintData, 
  mapStockTransferLineItems,
} from '../print-mappers/stock-transfer.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

/**
 * Chuyển đổi StockTransfer entity sang StockTransferForPrint
 */
export function convertStockTransferForPrint(
  transfer: StockTransfer,
  options: {
    fromBranch?: Branch | null;
    toBranch?: Branch | null;
    creator?: Employee | null;
  } = {}
): StockTransferForPrint {
  const { fromBranch, toBranch, creator } = options;

  // Tính tổng số lượng
  const totalQuantity = transfer.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalReceiptQuantity = transfer.items.reduce((sum, item) => sum + (item.receivedQuantity || 0), 0);

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'pending': 'Chờ chuyển',
    'transferring': 'Đang chuyển',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
  };

  return {
    // Thông tin cơ bản
    code: transfer.id,
    createdAt: transfer.createdDate,
    modifiedAt: transfer.updatedAt,
    shippedOn: transfer.transferredDate,
    receivedOn: transfer.receivedDate,
    createdBy: creator?.fullName || transfer.createdByName,
    status: statusMap[transfer.status] || transfer.status,
    reference: transfer.referenceCode,
    
    // Chi nhánh chuyển
    sourceLocationName: transfer.fromBranchName,
    sourceLocationAddress: fromBranch?.address,
    
    // Chi nhánh nhận
    destinationLocationName: transfer.toBranchName,
    destinationLocationAddress: toBranch?.address,
    
    // Danh sách sản phẩm
    items: transfer.items.map(item => ({
      variantCode: item.productId,
      productName: item.productName,
      unit: 'Cái',
      quantity: item.quantity,
      receiptQuantity: item.receivedQuantity,
      changeQuantity: (item.receivedQuantity || 0) - item.quantity,
    })),
    
    // Tổng
    totalQuantity,
    totalReceiptQuantity,
    
    note: transfer.note,
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
  mapStockTransferToPrintData,
  mapStockTransferLineItems,
};
