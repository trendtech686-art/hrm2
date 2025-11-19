import type { BusinessId, DualIDEntity, SystemId } from '@/lib/id-types';

export type LeaveStatus = "Chờ duyệt" | "Đã duyệt" | "Đã từ chối";

export const LEAVE_TYPE_NAMES = [
  'Phép năm',
  'Nghỉ ốm',
  'Nghỉ kết hôn',
  'Nghỉ không lương',
  'Chế độ thai sản',
] as const;

export type LeaveTypeName = typeof LEAVE_TYPE_NAMES[number];

export interface LeaveRequest extends DualIDEntity {
  employeeSystemId: SystemId; // Internal FK to employees table
  employeeId: BusinessId; // Display ID (NV000001)
  employeeName: string;
  leaveTypeName: LeaveTypeName; // e.g., "Phép năm", "Nghỉ ốm"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  numberOfDays: number;
  reason: string;
  status: LeaveStatus;
  requestDate: string; // YYYY-MM-DD
}
