/**
 * Supplier Return Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu trả hàng nhà cung cấp
 */

import type { Branch } from '../../features/settings/branches/types';
import type { Employee } from '../../features/employees/types';
import { 
  SupplierReturnForPrint, 
  mapSupplierReturnToPrintData, 
  mapSupplierReturnLineItems,
} from '../print-mappers/supplier-return.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Interface cho supplier return item - flexible
interface SupplierReturnItemLike {
  productSystemId?: string;
  productId?: string;
  productName: string;
  quantity?: number;
  returnQuantity?: number;
  orderedQuantity?: number;
  unitPrice: number;
  amount?: number;
  reason?: string;
  note?: string;
}

// Interface cho supplier return - flexible (supports both SupplierReturn and PurchaseReturn)
interface SupplierReturnLike {
  systemId: string;
  id: string;
  purchaseOrderSystemId?: string;
  purchaseOrderId?: string;
  supplierSystemId?: string;
  supplierName: string;
  supplierPhone?: string;
  supplierEmail?: string;
  supplierAddress?: string;
  branchSystemId?: string;
  branchName?: string;
  status?: string;
  items: SupplierReturnItemLike[];
  totalQuantity?: number;
  totalAmount?: number;
  totalReturnValue?: number;
  refundAmount?: number;
  refundMethod?: string;
  returnDate?: string;
  reason?: string;
  createdAt?: string;
  createdBy?: string;
  createdByName?: string;
  creatorName?: string;
  note?: string;
  reference?: string;
}

/**
 * Chuyển đổi SupplierReturn/PurchaseReturn entity sang SupplierReturnForPrint
 */
export function convertSupplierReturnForPrint(
  supplierReturn: SupplierReturnLike,
  options: {
    branch?: Branch | null;
    creator?: Employee | null;
    supplier?: { id?: string; phone?: string; address?: string; email?: string } | null;
    purchaseOrder?: { id?: string } | null;
  } = {}
): SupplierReturnForPrint {
  const { branch, creator, supplier, purchaseOrder } = options;

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'draft': 'Nháp',
    'pending': 'Chờ xử lý',
    'approved': 'Đã duyệt',
    'shipped': 'Đã gửi',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
  };

  return {
    // Thông tin cơ bản
    code: supplierReturn.id,
    createdAt: supplierReturn.createdAt || supplierReturn.returnDate,
    createdBy: creator?.fullName || supplierReturn.creatorName || supplierReturn.createdByName,
    purchaseOrderCode: purchaseOrder?.id || supplierReturn.purchaseOrderId,
    reference: supplierReturn.reference || supplierReturn.reason,
    
    // Lý do
    reason: supplierReturn.reason,
    
    // Chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : {
      name: supplierReturn.branchName,
    },
    
    // Nhà cung cấp
    supplierName: supplierReturn.supplierName,
    supplierCode: supplier?.id || supplierReturn.supplierSystemId,
    supplierPhone: supplier?.phone || supplierReturn.supplierPhone,
    supplierEmail: supplier?.email || supplierReturn.supplierEmail,
    supplierAddress: supplier?.address || supplierReturn.supplierAddress,
    
    // Danh sách sản phẩm
    items: supplierReturn.items.map(item => {
      const qty = item.quantity ?? item.returnQuantity ?? 0;
      return {
        variantCode: item.productId || item.productSystemId,
        productName: item.productName,
        unit: 'Cái',
        quantity: qty,
        price: item.unitPrice,
        amount: item.amount ?? (item.unitPrice * qty),
        reason: item.reason,
        note: item.note,
      };
    }),
    
    // Tổng
    totalQuantity: supplierReturn.totalQuantity ?? supplierReturn.items.reduce((s, i) => s + (i.quantity ?? i.returnQuantity ?? 0), 0),
    totalAmount: supplierReturn.totalAmount ?? supplierReturn.totalReturnValue,
    
    // Thông tin hoàn tiền (nếu có)
    transactionRefundAmount: supplierReturn.refundAmount,
    transactionRefundMethodName: supplierReturn.refundMethod,
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
  mapSupplierReturnToPrintData,
  mapSupplierReturnLineItems,
};
