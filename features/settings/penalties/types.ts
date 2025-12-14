import type { BusinessId, SystemId } from '@/lib/id-types';
import type { HistoryEntry } from '@/lib/activity-history-helper';

export type PenaltyStatus = 'Chưa thanh toán' | 'Đã thanh toán' | 'Đã hủy';
export type PenaltyCategory = 'complaint' | 'attendance' | 'performance' | 'other';

export type Penalty = {
  systemId: SystemId;
  id: BusinessId;
  employeeSystemId: SystemId;
  employeeName: string;
  reason: string;
  amount: number;
  issueDate: string; // YYYY-MM-DD
  status: PenaltyStatus;
  issuerName: string; // Employee Name of the issuer
  issuerSystemId?: SystemId; // Employee SystemId of the issuer
  
  // Linked entities
  linkedComplaintSystemId?: SystemId; // Link to Complaint (if penalty from complaint)
  linkedOrderSystemId?: SystemId; // Link to Order (if applicable)
  
  // Penalty type
  penaltyTypeSystemId?: SystemId; // Link to PenaltyType settings
  penaltyTypeName?: string; // Cached name
  category?: PenaltyCategory;
  
  // Payroll integration
  deductedInPayrollId?: string; // ID of payroll where this was deducted
  deductedAt?: string; // Date when deducted from salary
  
  // Audit
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  activityHistory?: HistoryEntry[];
};

// =============================================
// PENALTY TYPE - Settings for penalty categories
// =============================================

export type PenaltyType = {
  systemId: SystemId;
  id: BusinessId;
  name: string; // VD: "Làm hỏng hàng khách", "Đi làm trễ"
  description?: string;
  defaultAmount: number; // Mức phạt mặc định
  category: PenaltyCategory;
  isActive: boolean;
  order: number; // For sorting in UI
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// =============================================
// CONSTANTS
// =============================================

export const penaltyStatusLabels: Record<PenaltyStatus, string> = {
  'Chưa thanh toán': 'Chưa thanh toán',
  'Đã thanh toán': 'Đã thanh toán',
  'Đã hủy': 'Đã hủy',
};

export const penaltyStatusColors: Record<PenaltyStatus, string> = {
  'Chưa thanh toán': 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  'Đã thanh toán': 'bg-green-500/10 text-green-700 border-green-200',
  'Đã hủy': 'bg-gray-500/10 text-gray-700 border-gray-200',
};

export const penaltyCategoryLabels: Record<PenaltyCategory, string> = {
  complaint: 'Khiếu nại',
  attendance: 'Chấm công',
  performance: 'Hiệu suất',
  other: 'Khác',
};

export const penaltyCategoryColors: Record<PenaltyCategory, string> = {
  complaint: 'bg-red-500/10 text-red-700 border-red-200',
  attendance: 'bg-orange-500/10 text-orange-700 border-orange-200',
  performance: 'bg-blue-500/10 text-blue-700 border-blue-200',
  other: 'bg-gray-500/10 text-gray-700 border-gray-200',
};
