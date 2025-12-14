/**
 * Penalty Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu phạt
 */

import type { Branch } from '../../features/settings/branches/types';
import type { Employee } from '../../features/employees/types';
import { 
  PenaltyForPrint, 
  mapPenaltyToPrintData, 
} from '../print-mappers/penalty.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Interface cho penalty - flexible để nhận nhiều type
interface PenaltyLike {
  systemId: string;
  id: string;
  employeeSystemId?: string;
  employeeName: string;
  employeeCode?: string;
  employeeDepartment?: string;
  employeePosition?: string;
  branchSystemId?: string;
  branchName?: string;
  type?: string;
  category?: string;
  penaltyTypeSystemId?: string;
  penaltyTypeName?: string;
  amount: number;
  reason: string;
  description?: string;
  penaltyDate?: string;
  issueDate?: string;
  status?: string;
  createdAt?: string;
  createdBy?: string;
  createdByName?: string;
  issuerSystemId?: string;
  issuerName?: string;
  approvedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  note?: string;
}

/**
 * Chuyển đổi Penalty entity sang PenaltyForPrint
 */
export function convertPenaltyForPrint(
  penalty: PenaltyLike,
  options: {
    branch?: Branch | null;
    employee?: Employee | null;
    issuer?: Employee | null;
    creator?: Employee | null;
    approver?: Employee | null;
  } = {}
): PenaltyForPrint {
  const { branch, employee, issuer, creator, approver } = options;

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'draft': 'Nháp',
    'pending': 'Chờ duyệt',
    'approved': 'Đã duyệt',
    'executed': 'Đã thực hiện',
    'cancelled': 'Đã hủy',
  };

  const typeMap: Record<string, string> = {
    'late': 'Đi muộn',
    'absent': 'Vắng mặt',
    'violation': 'Vi phạm nội quy',
    'performance': 'Hiệu suất kém',
    'other': 'Khác',
  };

  return {
    // Thông tin cơ bản
    code: penalty.id,
    createdAt: penalty.createdAt,
    penaltyDate: penalty.penaltyDate || penalty.issueDate,
    createdBy: issuer?.fullName || creator?.fullName || penalty.issuerName || penalty.createdByName,
    approvedAt: penalty.approvedAt,
    approvedBy: approver?.fullName || penalty.approvedByName,
    
    // Trạng thái
    status: penalty.status ? (statusMap[penalty.status] || penalty.status) : undefined,
    penaltyType: penalty.penaltyTypeName || (penalty.type ? (typeMap[penalty.type] || penalty.type) : undefined),
    
    // Chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : penalty.branchName ? {
      name: penalty.branchName,
    } : undefined,
    
    // Nhân viên bị phạt
    employeeName: employee?.fullName || penalty.employeeName,
    employeeCode: employee?.id || penalty.employeeCode,
    department: employee?.department || penalty.employeeDepartment,
    employeePosition: employee?.jobTitle || penalty.employeePosition,
    
    // Nội dung phạt
    amount: penalty.amount,
    reason: penalty.reason,
    violationDescription: penalty.description,
    
    note: penalty.note,
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
  mapPenaltyToPrintData,
};
