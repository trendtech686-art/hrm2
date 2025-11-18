export type WorkShift = {
  systemId: string;
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  departments: string[];
};

export type LeaveType = {
  systemId: string;
  id: string;
  name: string;
  numberOfDays: number;
  isPaid: boolean;
  requiresAttachment: boolean;
  applicableGender: 'All' | 'Male' | 'Female';
};

export type SalaryComponent = {
  systemId: string;
  id: string;
  name: string;
  type: 'fixed' | 'formula';
  amount?: number;
  formula?: string;
  taxable: boolean;
  partOfSocialInsurance: boolean;
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
