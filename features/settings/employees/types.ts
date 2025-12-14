import type { SystemId, BusinessId } from '@/lib/id-types';

type AuditFields = {
  createdAt?: string;
  createdBy?: SystemId;
  updatedAt?: string;
  updatedBy?: SystemId;
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

export type SalaryComponentCategory = 'earning' | 'deduction' | 'contribution';

export type SalaryComponent = AuditFields & {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string;
  category: SalaryComponentCategory;
  type: 'fixed' | 'formula';
  amount?: number;
  formula?: string;
  taxable: boolean;
  partOfSocialInsurance: boolean;
  isActive: boolean;
  sortOrder: number;
  applicableDepartmentSystemIds: SystemId[];
};

// =============================================
// INSURANCE SETTINGS - Cài đặt bảo hiểm
// =============================================

export type InsuranceRates = {
  // Tỷ lệ BHXH
  socialInsurance: {
    employeeRate: number;  // NV đóng (mặc định 8%)
    employerRate: number;  // DN đóng (mặc định 17.5%)
  };
  // Tỷ lệ BHYT
  healthInsurance: {
    employeeRate: number;  // NV đóng (mặc định 1.5%)
    employerRate: number;  // DN đóng (mặc định 3%)
  };
  // Tỷ lệ BHTN
  unemploymentInsurance: {
    employeeRate: number;  // NV đóng (mặc định 1%)
    employerRate: number;  // DN đóng (mặc định 1%)
  };
  // Trần đóng bảo hiểm (20 x lương cơ sở)
  insuranceSalaryCap: number;  // Mặc định 46,800,000 (20 x 2,340,000)
  // Lương cơ sở (để tính trần)
  baseSalaryReference: number; // Mặc định 2,340,000 (từ 1/7/2024)
};

// =============================================
// TAX SETTINGS - Cài đặt thuế TNCN
// =============================================

export type TaxBracket = {
  fromAmount: number;      // Từ số tiền
  toAmount: number | null; // Đến số tiền (null = không giới hạn)
  rate: number;            // Tỷ lệ thuế (%)
};

export type TaxSettings = {
  // Giảm trừ gia cảnh
  personalDeduction: number;      // Giảm trừ bản thân (mặc định 11,000,000)
  dependentDeduction: number;     // Giảm trừ mỗi người phụ thuộc (mặc định 4,400,000)
  // Biểu thuế lũy tiến từng phần
  taxBrackets: TaxBracket[];
};

// =============================================
// MINIMUM WAGE SETTINGS - Lương tối thiểu vùng
// =============================================

export type MinimumWageByRegion = {
  region1: number;  // Vùng I (mặc định 4,960,000 từ 1/7/2024)
  region2: number;  // Vùng II (mặc định 4,410,000)
  region3: number;  // Vùng III (mặc định 3,860,000)
  region4: number;  // Vùng IV (mặc định 3,450,000)
};

// =============================================
// PENALTY TIERS - Các mức phạt theo thời gian
// =============================================
export type LatePenaltyTier = {
  fromMinutes: number; // Từ bao nhiêu phút
  toMinutes: number | null; // Đến bao nhiêu phút (null = không giới hạn)
  amount: number; // Số tiền phạt (VNĐ)
};

export type EmployeeSettings = {
  // Work Schedule & Attendance
  workStartTime: string;
  workEndTime: string;
  lunchBreakDuration: number;
  lunchBreakStart: string; // Giờ bắt đầu nghỉ trưa (VD: '12:00')
  lunchBreakEnd: string;   // Giờ kết thúc nghỉ trưa (VD: '13:30')
  workingDays: number[]; // 0=Sunday, 1=Monday, ...
  workShifts: WorkShift[];
  otHourlyRate: number;    // Tiền làm thêm mỗi giờ ngày thường (VNĐ) - VD: 25000
  otRateWeekend: number;   // Hệ số làm thêm cuối tuần (VD: 1.5)
  otRateHoliday: number;   // Hệ số làm thêm ngày lễ (VD: 2, 3)
  allowedLateMinutes: number;
  latePenaltyTiers: LatePenaltyTier[]; // Các mức phạt đi trễ theo thời gian
  earlyLeavePenaltyTiers: LatePenaltyTier[]; // Các mức phạt về sớm theo thời gian

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
  payday: number;
  payrollLockDate: number;
  
  // Insurance Settings - Cài đặt bảo hiểm (Luật BHXH 2024)
  insuranceRates: InsuranceRates;
  
  // Tax Settings - Cài đặt thuế TNCN (Luật thuế TNCN)
  taxSettings: TaxSettings;
  
  // Minimum Wage - Lương tối thiểu vùng (NĐ 74/2024/NĐ-CP)
  minimumWage: MinimumWageByRegion;
  
  // Số ngày công chuẩn trong tháng
  standardWorkDays: number; // Mặc định 26
  
  // Phụ cấp ăn trưa theo ngày công
  mealAllowancePerDay: number; // Mặc định 30,000đ/ngày
};
