/**
 * Leave Mapper - Đơn nghỉ phép
 * Đồng bộ với variables/don-nghi-phep.ts
 */

import { 
  PrintData, 
  formatCurrency,
  numberToWords,
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings
} from './types';

export interface LeaveForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt?: string | Date;
  requestDate?: string | Date;
  createdBy?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
    phone?: string;
  };
  
  // Thông tin nhân viên
  employeeName: string;
  employeeCode?: string;
  employeePhone?: string;
  employeeEmail?: string;
  employeePosition?: string;
  department?: string;
  
  // Thông tin nghỉ phép
  leaveTypeName: string;
  leaveTypeIsPaid?: boolean;
  startDate: string | Date;
  endDate: string | Date;
  numberOfDays: number;
  reason: string;
  
  // Phê duyệt
  status?: string;
  approvedBy?: string;
  approvedAt?: string | Date;
  rejectedBy?: string;
  rejectedAt?: string | Date;
  rejectionReason?: string;
  
  note?: string;
}

export function mapLeaveToPrintData(leave: LeaveForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': leave.location?.name || storeSettings.name || '',
    '{location_address}': leave.location?.address || storeSettings.address || '',
    '{location_province}': leave.location?.province || '',
    '{location_phone}': leave.location?.phone || storeSettings.phone || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN ĐƠN NGHỈ PHÉP ===
    '{leave_code}': leave.code,
    '{created_on}': formatDate(leave.createdAt || leave.requestDate),
    '{created_on_time}': formatTime(leave.createdAt),
    '{request_date}': formatDate(leave.requestDate),
    '{account_name}': leave.createdBy || '',
    
    // === THÔNG TIN NHÂN VIÊN ===
    '{employee_name}': leave.employeeName,
    '{employee_code}': leave.employeeCode || '',
    '{employee_phone}': leave.employeePhone || '',
    '{employee_email}': leave.employeeEmail || '',
    '{employee_position}': leave.employeePosition || '',
    '{position_name}': leave.employeePosition || '',
    '{department_name}': leave.department || '',
    '{department}': leave.department || '',
    
    // === THÔNG TIN NGHỈ PHÉP ===
    '{leave_type}': leave.leaveTypeName,
    '{leave_type_name}': leave.leaveTypeName,
    '{leave_paid}': leave.leaveTypeIsPaid ? 'Có lương' : 'Không lương',
    '{start_date}': formatDate(leave.startDate),
    '{end_date}': formatDate(leave.endDate),
    '{date_range}': `${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`,
    '{number_of_days}': String(leave.numberOfDays),
    '{reason}': leave.reason,
    
    // === TRẠNG THÁI ===
    '{status}': leave.status || '',
    '{approved_by}': leave.approvedBy || '',
    '{approved_date}': formatDate(leave.approvedAt),
    '{rejected_by}': leave.rejectedBy || '',
    '{rejected_date}': formatDate(leave.rejectedAt),
    '{rejection_reason}': leave.rejectionReason || '',
    
    // === GHI CHÚ ===
    '{note}': leave.note || '',
  };
}
