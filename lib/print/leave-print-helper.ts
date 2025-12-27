/**
 * Leave Print Helper
 * Helpers để chuẩn bị dữ liệu in cho đơn nghỉ phép
 */

import type { Branch } from '@/lib/types/prisma-extended';
import type { Employee } from '@/lib/types/prisma-extended';
import { 
  LeaveForPrint, 
  mapLeaveToPrintData, 
} from '../print-mappers/leave.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Interface cho leave - flexible để nhận nhiều type
interface LeaveLike {
  systemId: string;
  id: string;
  employeeSystemId?: string;
  employeeId?: string;
  employeeName: string;
  employeeCode?: string;
  employeeDepartment?: string;
  employeePosition?: string;
  branchSystemId?: string;
  branchName?: string;
  leaveTypeSystemId?: string;
  leaveTypeName: string;
  leaveTypeIsPaid?: boolean;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status?: string;
  requestDate?: string;
  createdAt?: string;
  createdBy?: string;
  createdByName?: string;
  approvedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectionReason?: string;
  note?: string;
}

/**
 * Chuyển đổi Leave entity sang LeaveForPrint
 */
export function convertLeaveForPrint(
  leave: LeaveLike,
  options: {
    branch?: Branch | null;
    employee?: Employee | null;
    creator?: Employee | null;
    approver?: Employee | null;
  } = {}
): LeaveForPrint {
  const { branch, employee, creator, approver } = options;

  return {
    // Thông tin cơ bản
    code: leave.id,
    createdAt: leave.createdAt,
    requestDate: leave.requestDate,
    createdBy: creator?.fullName || leave.createdByName,
    
    // Chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : leave.branchName ? {
      name: leave.branchName,
    } : undefined,
    
    // Nhân viên
    employeeName: employee?.fullName || leave.employeeName,
    employeeCode: employee?.id || leave.employeeId || leave.employeeCode,
    department: employee?.department || leave.employeeDepartment,
    employeePosition: employee?.jobTitle || leave.employeePosition,
    
    // Thông tin nghỉ phép
    leaveTypeName: leave.leaveTypeName,
    leaveTypeIsPaid: leave.leaveTypeIsPaid,
    startDate: leave.startDate,
    endDate: leave.endDate,
    numberOfDays: leave.numberOfDays,
    reason: leave.reason,
    
    // Trạng thái
    status: leave.status,
    approvedBy: approver?.fullName || leave.approvedByName,
    approvedAt: leave.approvedAt,
    rejectedBy: leave.rejectedByName,
    rejectedAt: leave.rejectedAt,
    rejectionReason: leave.rejectionReason,
    
    note: leave.note,
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
  mapLeaveToPrintData,
};
