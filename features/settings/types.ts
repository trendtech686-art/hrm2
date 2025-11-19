import type { BusinessId, SystemId } from '@/lib/id-types';

type AuditFields = {
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
};

export type WorkShift = AuditFields & {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes?: number;
  description?: string;
  applicableDepartmentSystemIds: SystemId[];
};

export type LeaveType = AuditFields & {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  numberOfDays: number;
  isPaid: boolean;
  requiresAttachment: boolean;
  applicableGender: 'All' | 'Male' | 'Female';
  applicableDepartmentSystemIds: SystemId[];
};

export type SalaryComponent = AuditFields & {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  type: 'fixed' | 'formula';
  amount?: number;
  formula?: string;
  taxable: boolean;
  partOfSocialInsurance: boolean;
  applicableDepartmentSystemIds: SystemId[];
};

export type EmployeeSettings = {
  // Work Schedule & Attendance
  workStartTime: string;
  workEndTime: string;
  lunchBreakDuration: number;
  workingDays: number[]; // 0=Sunday, 1=Monday, ...
  workShifts: WorkShift[];
  otRateWeekday: number;
  otRateWeekend: number;
  otRateHoliday: number;
  allowedLateMinutes: number;
  latePolicyAction: 'deduct_salary' | 'log_violation' | 'notify_manager' | 'require_explanation';

  // Leave Management
  leaveTypes: LeaveType[];
  baseAnnualLeaveDays: number;
  annualLeaveSeniorityBonus: {
    years: number;
    additionalDays: number;
  };
  allowRollover: boolean;
  rolloverExpirationDate: string; // MM-DD format

  // Salary & Payroll
  salaryComponents: SalaryComponent[];
  payrollCycle: 'monthly' | 'weekly' | 'bi-weekly';
  payrollStartDate: number;
  payrollEndDate: number;
  payday: number;
  payrollLockDate: number;
};
