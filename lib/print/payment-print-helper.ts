/**
 * Payment Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu chi
 */

import type { Branch } from '../../features/settings/branches/types';
import type { Employee } from '../../features/employees/types';
import { 
  PaymentForPrint, 
  mapPaymentToPrintData, 
} from '../print-mappers/payment.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Flexible interface for Payment entities
// Accepts both Payment from store and PaymentVoucher with different field names
interface PaymentLike {
  // Core identifiers
  systemId?: string;
  id?: string;  // BusinessId (PC-XXXXXX) for Payment
  code?: string; // For legacy compatibility
  
  // Recipient info - flexible naming
  recipientType?: 'customer' | 'supplier' | 'employee' | 'other' | string;
  recipientTypeName?: string;  // Cached type name
  recipientSystemId?: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientAddress?: string;
  
  // Branch info
  branchSystemId?: string;
  branchName?: string;
  
  // Payment details - flexible naming
  groupName?: string;
  description?: string;
  amount?: number;
  paymentMethod?: string;        // For PaymentVoucher
  paymentMethodName?: string;    // For Payment
  reference?: string;
  documentRootCode?: string;
  counted?: boolean;
  
  // Dates
  issuedAt?: string;
  createdAt?: string;
  date?: string;  // Payment uses date field
  
  // Creator info
  createdBy?: string;
  createdByName?: string;
  
  // Notes
  note?: string;
  
  // Debt tracking
  customerDebtBefore?: number;
  customerDebtAfter?: number;
  supplierDebtBefore?: number;
  supplierDebtAfter?: number;
  
  // Payment-specific extras
  paymentReceiptTypeName?: string;
  customerName?: string;
}

/**
 * Chuyển đổi PaymentLike entity sang PaymentForPrint
 * Accepts both Payment from store and PaymentVoucher
 */
export function convertPaymentForPrint(
  payment: PaymentLike,
  options: {
    branch?: Branch | null;
    creator?: Employee | null;
  } = {}
): PaymentForPrint {
  const { branch, creator } = options;

  // Map loại người nhận sang tiếng Việt
  const recipientTypeMap: Record<string, string> = {
    'customer': 'Khách hàng',
    'supplier': 'Nhà cung cấp',
    'employee': 'Nhân viên',
    'other': 'Khác',
  };

  // Determine recipient type - can come from different fields
  const recipientTypeValue = payment.recipientTypeName 
    || (payment.recipientType ? recipientTypeMap[payment.recipientType] || payment.recipientType : undefined);

  // Determine payment method - can come from different fields
  const paymentMethodValue = payment.paymentMethodName || payment.paymentMethod;

  // Determine code - can be id or code field
  const codeValue = payment.id || payment.code || '';

  // Determine date - can be createdAt or date field
  const dateValue = payment.createdAt || payment.date;

  return {
    // Thông tin cơ bản
    code: codeValue,
    createdAt: dateValue,
    issuedAt: payment.issuedAt,
    createdBy: creator?.fullName || payment.createdByName,
    
    // Thông tin người nhận
    recipientName: payment.recipientName || payment.customerName,
    recipientPhone: payment.recipientPhone,
    recipientAddress: payment.recipientAddress,
    recipientType: recipientTypeValue,
    
    // Thông tin phiếu
    groupName: payment.groupName || payment.paymentReceiptTypeName,
    description: payment.description,
    amount: payment.amount || 0,
    paymentMethod: paymentMethodValue,
    reference: payment.reference,
    documentRootCode: payment.documentRootCode,
    counted: payment.counted,
    note: payment.note,
    
    // Thông tin chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : payment.branchName ? {
      name: payment.branchName,
    } : undefined,
    
    // Nợ khách hàng
    customerDebtBefore: payment.customerDebtBefore,
    customerDebtAfter: payment.customerDebtAfter,
    customerDebt: payment.customerDebtAfter,
    customerDebtPrev: payment.customerDebtBefore,
    
    // Nợ nhà cung cấp
    supplierDebtBefore: payment.supplierDebtBefore,
    supplierDebtAfter: payment.supplierDebtAfter,
    supplierDebt: payment.supplierDebtAfter,
    supplierDebtPrev: payment.supplierDebtBefore,
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
  mapPaymentToPrintData,
};
