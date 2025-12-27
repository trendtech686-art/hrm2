/**
 * Penalty Mapper - Phiếu phạt
 * Đồng bộ với variables/phieu-phat.ts
 */

import { 
  PrintData, 
  formatCurrency,
  numberToWords,
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

export interface PenaltyForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
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
  
  // Thông tin vi phạm
  penaltyDate: string | Date;
  violationType?: string;
  violationDescription?: string;
  violationEvidence?: string;
  violationCount?: number;
  
  // Thông tin phạt
  penaltyType: string;
  penaltyLevel?: string;
  reason: string;
  amount: number;
  deductionMethod?: string;
  deductionPeriod?: string;
  
  // Phê duyệt
  status?: string;
  approvedBy?: string;
  approvedAt?: string | Date;
  rejectedBy?: string;
  rejectedAt?: string | Date;
  rejectionReason?: string;
  
  // Thông tin bổ sung
  witnessName?: string;
  witnessSignature?: string;
  employeeAcknowledgement?: boolean;
  employeeSignatureDate?: string | Date;
  
  note?: string;
}

export function mapPenaltyToPrintData(penalty: PenaltyForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': penalty.location?.name || storeSettings.name || '',
    '{location_address}': penalty.location?.address || storeSettings.address || '',
    '{location_province}': penalty.location?.province || '',
    '{location_phone}': penalty.location?.phone || storeSettings.phone || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU PHẠT ===
    '{penalty_code}': penalty.code,
    '{created_on}': formatDate(penalty.createdAt),
    '{created_on_time}': formatTime(penalty.createdAt),
    '{modified_on}': formatDate(penalty.modifiedAt),
    '{account_name}': penalty.createdBy || '',
    
    // === THÔNG TIN NHÂN VIÊN ===
    '{employee_name}': penalty.employeeName,
    '{employee_code}': penalty.employeeCode || '',
    '{employee_phone}': penalty.employeePhone || '',
    '{employee_email}': penalty.employeeEmail || '',
    '{employee_position}': penalty.employeePosition || '',
    '{position_name}': penalty.employeePosition || '',
    '{department_name}': penalty.department || '',
    '{department}': penalty.department || '',
    
    // === THÔNG TIN VI PHẠM ===
    '{penalty_date}': formatDate(penalty.penaltyDate),
    '{penalty_date_time}': formatTime(penalty.penaltyDate),
    '{violation_date}': formatDate(penalty.penaltyDate),
    '{violation_type}': penalty.violationType || '',
    '{violation_description}': penalty.violationDescription || '',
    '{violation_evidence}': penalty.violationEvidence || '',
    '{evidence}': penalty.violationEvidence || '',
    '{violation_count}': penalty.violationCount?.toString() || '',
    
    // === THÔNG TIN PHẠT ===
    '{penalty_type}': penalty.penaltyType,
    '{penalty_level}': penalty.penaltyLevel || '',
    '{penalty_reason}': penalty.reason,
    '{reason}': penalty.reason,
    '{penalty_amount}': formatCurrency(penalty.amount),
    '{amount}': formatCurrency(penalty.amount),
    '{penalty_amount_text}': numberToWords(penalty.amount),
    '{deduction_method}': penalty.deductionMethod || 'Trừ lương',
    '{deduction_period}': penalty.deductionPeriod || '',
    
    // === PHÊ DUYỆT ===
    '{status}': penalty.status || '',
    '{approved_by}': penalty.approvedBy || '',
    '{approved_on}': formatDate(penalty.approvedAt),
    '{approved_on_time}': formatTime(penalty.approvedAt),
    '{rejected_by}': penalty.rejectedBy || '',
    '{rejected_on}': formatDate(penalty.rejectedAt),
    '{rejection_reason}': penalty.rejectionReason || '',
    
    // === THÔNG TIN BỔ SUNG ===
    '{witness_name}': penalty.witnessName || '',
    '{witness_signature}': penalty.witnessSignature || '',
    '{employee_acknowledgement}': penalty.employeeAcknowledgement ? 'Đã xác nhận' : '',
    '{employee_signature_date}': formatDate(penalty.employeeSignatureDate),
    
    '{penalty_note}': penalty.note || '',
    '{note}': penalty.note || '',
  };
}
