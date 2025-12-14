import type { BusinessId, DualIDEntity, SystemId } from '@/lib/id-types';
import type { HistoryEntry } from '@/lib/activity-history-helper';

export type LeaveStatus = "Chờ duyệt" | "Đã duyệt" | "Đã từ chối";

export interface LeaveRequest extends DualIDEntity {
  employeeSystemId: SystemId; // Internal FK to employees table
  employeeId: BusinessId; // Display ID (NV000001)
  employeeName: string;
  leaveTypeSystemId?: SystemId;
  leaveTypeId?: BusinessId;
  leaveTypeName: string; // Sourced từ Employee Settings
  leaveTypeIsPaid?: boolean;
  leaveTypeRequiresAttachment?: boolean;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  numberOfDays: number;
  reason: string;
  status: LeaveStatus;
  requestDate: string; // YYYY-MM-DD
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  activityHistory?: HistoryEntry[];
}
