import type { BusinessId, DualIDEntity, SystemId } from './id-types';

export const PAYROLL_BATCH_STATUSES = ['draft', 'reviewed', 'locked', 'cancelled'] as const;
export type PayrollBatchStatus = typeof PAYROLL_BATCH_STATUSES[number];

export type PayrollComponentCategory = 'earning' | 'deduction' | 'contribution';
export type PayrollCalculationType = 'fixed' | 'formula';

export type AuditMetadata = {
  createdAt: string;
  createdBy?: SystemId | undefined;
  updatedAt: string;
  updatedBy?: SystemId | undefined;
};

export type PayrollComponent = AuditMetadata & DualIDEntity & {
  name: string;
  code?: string | undefined;
  category: PayrollComponentCategory;
  calculationType: PayrollCalculationType;
  amount?: number | undefined;
  formula?: string | undefined;
  taxable: boolean;
  partOfSocialInsurance: boolean;
  applicableDepartmentSystemIds: SystemId[];
  applicableEmployeeSystemIds?: SystemId[] | undefined;
  isDefault: boolean;
  description?: string | undefined;
  sortOrder: number;
};

export type PayrollTemplate = AuditMetadata & DualIDEntity & {
  name: string;
  code?: string | undefined;
  description?: string | undefined;
  componentSystemIds: SystemId[];
  isDefault: boolean;
};

export type PayrollTotals = {
  // Thông tin chấm công (từ attendance snapshot)
  workDays: number;                // Số ngày công thực tế
  standardWorkDays: number;        // Số ngày công chuẩn trong tháng
  leaveDays: number;               // Số ngày nghỉ phép
  absentDays: number;              // Số ngày vắng không phép
  otHours: number;                 // Tổng giờ làm thêm
  otHoursWeekday: number;          // Giờ OT ngày thường
  otHoursWeekend: number;          // Giờ OT cuối tuần
  otHoursHoliday: number;          // Giờ OT ngày lễ
  lateArrivals: number;            // Số lần đi trễ
  earlyDepartures: number;         // Số lần về sớm
  
  // Tổng thu nhập
  grossEarnings: number;          // Tổng các khoản thu nhập
  earnings: number;               // Alias cho grossEarnings (backward compatible)
  
  // Bảo hiểm - Phần người lao động đóng
  employeeSocialInsurance: number;      // BHXH NV đóng (8%)
  employeeHealthInsurance: number;      // BHYT NV đóng (1.5%)
  employeeUnemploymentInsurance: number; // BHTN NV đóng (1%)
  totalEmployeeInsurance: number;       // Tổng BH NV đóng (10.5%)
  
  // Bảo hiểm - Phần doanh nghiệp đóng (để báo cáo)
  employerSocialInsurance: number;      // BHXH DN đóng (17.5%)
  employerHealthInsurance: number;      // BHYT DN đóng (3%)
  employerUnemploymentInsurance: number; // BHTN DN đóng (1%)
  totalEmployerInsurance: number;       // Tổng BH DN đóng (21.5%)
  
  // Thu nhập chịu thuế & Thuế TNCN
  taxableIncome: number;          // Thu nhập chịu thuế (sau giảm trừ)
  personalIncomeTax: number;      // Thuế TNCN phải nộp
  
  // Các khoản khấu trừ khác
  penaltyDeductions: number;      // Từ phiếu phạt
  otherDeductions: number;        // Khấu trừ khác từ components
  
  // Tổng hợp
  deductions: number;             // Tổng khấu trừ (BH + Thuế + Phạt + Khác)
  contributions: number;          // Tổng đóng góp (từ components loại contribution)
  socialInsuranceBase: number;    // Mức lương đóng BHXH (có trần)
  netPay: number;                 // Thực lĩnh
  
  // Thông tin giảm trừ (để hiển thị chi tiết)
  personalDeduction: number;      // Giảm trừ bản thân
  dependentDeduction: number;     // Giảm trừ người phụ thuộc
  numberOfDependents: number;     // Số người phụ thuộc
};

export type PayrollComponentEntry = {
  componentSystemId: SystemId;
  componentId: BusinessId;
  label: string;
  category: PayrollComponentCategory;
  calculationType: PayrollCalculationType;
  amount: number;
  formula?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
};

export type Payslip = AuditMetadata & DualIDEntity & {
  batchSystemId: SystemId;
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  departmentSystemId?: SystemId | undefined;
  periodMonthKey: string; // yyyy-MM
  attendanceSnapshotSystemId?: SystemId | undefined;
  components: PayrollComponentEntry[];
  totals: PayrollTotals;
  // Linked penalties that were deducted
  deductedPenaltySystemIds?: SystemId[];
  lockedAt?: string | undefined;
  lockedBy?: SystemId | undefined;
};

export type PayrollPeriod = {
  monthKey: string; // yyyy-MM
  startDate: string; // ISO date
  endDate: string; // ISO date
};

export type PayrollBatch = AuditMetadata & DualIDEntity & {
  title: string;
  status: PayrollBatchStatus;
  templateSystemId?: SystemId | undefined;
  payPeriod: PayrollPeriod;
  payrollDate: string; // ISO date when payout happens
  referenceAttendanceMonthKeys: string[];
  payslipSystemIds: SystemId[];
  totalGross: number;
  totalNet: number;
  reviewedAt?: string | undefined;
  reviewedBy?: SystemId | undefined;
  lockedAt?: string | undefined;
  lockedBy?: SystemId | undefined;
  notes?: string | undefined;
};

export type PayrollAuditAction = 'run' | 'recalculate' | 'review' | 'lock' | 'unlock' | 'export';

export type PayrollAuditLog = DualIDEntity & {
  batchSystemId: SystemId;
  action: PayrollAuditAction;
  actorSystemId: SystemId;
  actorDisplayName?: string | undefined;
  payload?: Record<string, unknown> | undefined;
  createdAt: string;
};
