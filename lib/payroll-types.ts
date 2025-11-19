import type { BusinessId, DualIDEntity, SystemId } from './id-types.ts';

export const PAYROLL_BATCH_STATUSES = ['draft', 'reviewed', 'locked'] as const;
export type PayrollBatchStatus = typeof PAYROLL_BATCH_STATUSES[number];

export type PayrollComponentCategory = 'earning' | 'deduction' | 'contribution';
export type PayrollCalculationType = 'fixed' | 'formula';

export type AuditMetadata = {
  createdAt: string;
  createdBy?: SystemId;
  updatedAt: string;
  updatedBy?: SystemId;
};

export type PayrollComponent = AuditMetadata & DualIDEntity & {
  name: string;
  code?: string;
  category: PayrollComponentCategory;
  calculationType: PayrollCalculationType;
  amount?: number;
  formula?: string;
  taxable: boolean;
  partOfSocialInsurance: boolean;
  applicableDepartmentSystemIds: SystemId[];
  applicableEmployeeSystemIds?: SystemId[];
  isDefault: boolean;
  description?: string;
  sortOrder: number;
};

export type PayrollTemplate = AuditMetadata & DualIDEntity & {
  name: string;
  code?: string;
  description?: string;
  componentSystemIds: SystemId[];
  isDefault: boolean;
};

export type PayrollTotals = {
  earnings: number;
  deductions: number;
  contributions: number;
  taxableIncome: number;
  socialInsuranceBase: number;
  netPay: number;
};

export type PayrollComponentEntry = {
  componentSystemId: SystemId;
  componentId: BusinessId;
  label: string;
  category: PayrollComponentCategory;
  calculationType: PayrollCalculationType;
  amount: number;
  formula?: string;
  metadata?: Record<string, unknown>;
};

export type Payslip = AuditMetadata & DualIDEntity & {
  batchSystemId: SystemId;
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  departmentSystemId?: SystemId;
  periodMonthKey: string; // yyyy-MM
  attendanceSnapshotSystemId?: SystemId;
  components: PayrollComponentEntry[];
  totals: PayrollTotals;
  lockedAt?: string;
  lockedBy?: SystemId;
};

export type PayrollPeriod = {
  monthKey: string; // yyyy-MM
  startDate: string; // ISO date
  endDate: string; // ISO date
};

export type PayrollBatch = AuditMetadata & DualIDEntity & {
  title: string;
  status: PayrollBatchStatus;
  templateSystemId?: SystemId;
  payPeriod: PayrollPeriod;
  payrollDate: string; // ISO date when payout happens
  referenceAttendanceMonthKeys: string[];
  payslipSystemIds: SystemId[];
  totalGross: number;
  totalNet: number;
  reviewedAt?: string;
  reviewedBy?: SystemId;
  lockedAt?: string;
  lockedBy?: SystemId;
  notes?: string;
};

export type PayrollAuditAction = 'run' | 'recalculate' | 'review' | 'lock' | 'unlock' | 'export';

export type PayrollAuditLog = DualIDEntity & {
  batchSystemId: SystemId;
  action: PayrollAuditAction;
  actorSystemId: SystemId;
  actorDisplayName?: string;
  payload?: Record<string, unknown>;
  createdAt: string;
};
