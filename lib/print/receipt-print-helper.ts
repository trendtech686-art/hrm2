/**
 * Receipt Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu thu
 */

import type { Branch } from '@/lib/types/prisma-extended';
import type { Employee } from '@/lib/types/prisma-extended';
import { 
  ReceiptForPrint, 
  mapReceiptToPrintData, 
} from '../print-mappers/receipt.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Interface cho receipt - flexible để nhận nhiều type
interface ReceiptLike {
  systemId: string;
  id: string;
  payerType?: 'customer' | 'supplier' | 'other';
  payerTypeSystemId?: string;
  payerTypeName?: string;
  payerSystemId?: string;
  payerName: string;
  payerPhone?: string;
  payerAddress?: string;
  branchSystemId?: string;
  branchName?: string;
  groupName?: string;
  paymentReceiptTypeName?: string;
  description?: string;
  amount: number;
  paymentMethod?: string;
  paymentMethodName?: string;
  reference?: string;
  documentRootCode?: string;
  originalDocumentId?: string;
  counted?: boolean;
  issuedAt?: string;
  date?: string;
  createdAt?: string;
  createdBy?: string;
  createdByName?: string;
  note?: string;
  // Debt tracking
  customerDebtBefore?: number;
  customerDebtAfter?: number;
  supplierDebtBefore?: number;
  supplierDebtAfter?: number;
}

/**
 * Chuyển đổi Receipt/ReceiptVoucher entity sang ReceiptForPrint
 */
export function convertReceiptForPrint(
  receipt: ReceiptLike,
  options: {
    branch?: Branch | null;
    creator?: Employee | null;
  } = {}
): ReceiptForPrint {
  const { branch, creator } = options;

  // Map loại người nộp sang tiếng Việt
  const payerTypeMap: Record<string, string> = {
    'customer': 'Khách hàng',
    'supplier': 'Nhà cung cấp',
    'other': 'Khác',
  };

  return {
    // Thông tin cơ bản
    code: receipt.id,
    createdAt: receipt.createdAt || receipt.date,
    issuedAt: receipt.issuedAt,
    createdBy: creator?.fullName || receipt.createdByName,
    
    // Thông tin người nộp
    payerName: receipt.payerName,
    payerPhone: receipt.payerPhone,
    payerAddress: receipt.payerAddress,
    payerType: receipt.payerTypeName || (receipt.payerType ? (payerTypeMap[receipt.payerType] || receipt.payerType) : undefined),
    
    // Thông tin phiếu
    groupName: receipt.groupName || receipt.paymentReceiptTypeName,
    description: receipt.description,
    amount: receipt.amount,
    paymentMethod: receipt.paymentMethod || receipt.paymentMethodName,
    reference: receipt.reference,
    documentRootCode: receipt.documentRootCode || receipt.originalDocumentId,
    counted: receipt.counted,
    note: receipt.note,
    
    // Thông tin chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : receipt.branchName ? {
      name: receipt.branchName,
    } : undefined,
    
    // Nợ khách hàng
    customerDebtBefore: receipt.customerDebtBefore,
    customerDebtAfter: receipt.customerDebtAfter,
    customerDebt: receipt.customerDebtAfter,
    customerDebtPrev: receipt.customerDebtBefore,
    
    // Nợ nhà cung cấp
    supplierDebtBefore: receipt.supplierDebtBefore,
    supplierDebtAfter: receipt.supplierDebtAfter,
    supplierDebt: receipt.supplierDebtAfter,
    supplierDebtPrev: receipt.supplierDebtBefore,
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
  mapReceiptToPrintData,
};
