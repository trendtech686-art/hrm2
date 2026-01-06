import { z } from 'zod';

// =============================================
// WORK SHIFT SCHEMAS
// =============================================

export const createWorkShiftSchema = z.object({
  id: z.string().min(1, 'Mã ca làm việc không được để trống'),
  name: z.string().min(1, 'Tên ca làm việc không được để trống'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Giờ bắt đầu không hợp lệ (HH:mm)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Giờ kết thúc không hợp lệ (HH:mm)'),
  breakMinutes: z.number().min(0, 'Thời gian nghỉ không được âm').optional(),
  description: z.string().optional(),
  applicableDepartmentSystemIds: z.array(z.string()).default([]),
});

export const updateWorkShiftSchema = createWorkShiftSchema.partial();

export const workShiftFilterSchema = z.object({
  search: z.string().optional(),
  departmentSystemId: z.string().optional(),
});

export type CreateWorkShiftInput = z.infer<typeof createWorkShiftSchema>;
export type UpdateWorkShiftInput = z.infer<typeof updateWorkShiftSchema>;
export type WorkShiftFilter = z.infer<typeof workShiftFilterSchema>;

// =============================================
// LEAVE TYPE SCHEMAS
// =============================================

export const createLeaveTypeSchema = z.object({
  id: z.string().min(1, 'Mã loại nghỉ phép không được để trống'),
  name: z.string().min(1, 'Tên loại nghỉ phép không được để trống'),
  numberOfDays: z.number().min(0, 'Số ngày nghỉ phải lớn hơn hoặc bằng 0'),
  isPaid: z.boolean().default(true),
  requiresAttachment: z.boolean().default(false),
  applicableGender: z.enum(['All', 'Male', 'Female']).default('All'),
  applicableDepartmentSystemIds: z.array(z.string()).default([]),
});

export const updateLeaveTypeSchema = createLeaveTypeSchema.partial();

export const leaveTypeFilterSchema = z.object({
  search: z.string().optional(),
  isPaid: z.boolean().optional(),
  applicableGender: z.enum(['All', 'Male', 'Female']).optional(),
});

export type CreateLeaveTypeInput = z.infer<typeof createLeaveTypeSchema>;
export type UpdateLeaveTypeInput = z.infer<typeof updateLeaveTypeSchema>;
export type LeaveTypeFilter = z.infer<typeof leaveTypeFilterSchema>;

// =============================================
// SALARY COMPONENT SCHEMAS
// =============================================

export const salaryComponentCategorySchema = z.enum(['earning', 'deduction', 'contribution']);

export const createSalaryComponentSchema = z.object({
  id: z.string().min(1, 'Mã thành phần lương không được để trống'),
  name: z.string().min(1, 'Tên thành phần lương không được để trống'),
  description: z.string().optional(),
  category: salaryComponentCategorySchema,
  type: z.enum(['fixed', 'formula']),
  amount: z.number().min(0, 'Số tiền phải lớn hơn hoặc bằng 0').optional(),
  formula: z.string().optional(),
  taxable: z.boolean().default(false),
  partOfSocialInsurance: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
  applicableDepartmentSystemIds: z.array(z.string()).default([]),
});

export const updateSalaryComponentSchema = createSalaryComponentSchema.partial();

export const salaryComponentFilterSchema = z.object({
  search: z.string().optional(),
  category: salaryComponentCategorySchema.optional(),
  type: z.enum(['fixed', 'formula']).optional(),
  isActive: z.boolean().optional(),
});

export type CreateSalaryComponentInput = z.infer<typeof createSalaryComponentSchema>;
export type UpdateSalaryComponentInput = z.infer<typeof updateSalaryComponentSchema>;
export type SalaryComponentFilter = z.infer<typeof salaryComponentFilterSchema>;

// =============================================
// TAX BRACKET SCHEMAS
// =============================================

export const taxBracketSchema = z.object({
  fromAmount: z.number().min(0, 'Mức thu nhập từ phải lớn hơn hoặc bằng 0'),
  toAmount: z.number().nullable(),
  rate: z.number().min(0, 'Thuế suất phải lớn hơn hoặc bằng 0').max(100, 'Thuế suất không được vượt quá 100%'),
});

export type TaxBracketInput = z.infer<typeof taxBracketSchema>;

// =============================================
// TAX SETTINGS SCHEMAS
// =============================================

export const taxSettingsSchema = z.object({
  personalDeduction: z.number().min(0, 'Giảm trừ cá nhân phải lớn hơn hoặc bằng 0'),
  dependentDeduction: z.number().min(0, 'Giảm trừ người phụ thuộc phải lớn hơn hoặc bằng 0'),
  taxBrackets: z.array(taxBracketSchema),
});

export type TaxSettingsInput = z.infer<typeof taxSettingsSchema>;

// =============================================
// INSURANCE RATES SCHEMAS
// =============================================

export const insuranceRatesSchema = z.object({
  socialInsurance: z.object({
    employeeRate: z.number().min(0).max(100, 'Tỷ lệ không được vượt quá 100%'),
    employerRate: z.number().min(0).max(100, 'Tỷ lệ không được vượt quá 100%'),
  }),
  healthInsurance: z.object({
    employeeRate: z.number().min(0).max(100, 'Tỷ lệ không được vượt quá 100%'),
    employerRate: z.number().min(0).max(100, 'Tỷ lệ không được vượt quá 100%'),
  }),
  unemploymentInsurance: z.object({
    employeeRate: z.number().min(0).max(100, 'Tỷ lệ không được vượt quá 100%'),
    employerRate: z.number().min(0).max(100, 'Tỷ lệ không được vượt quá 100%'),
  }),
  insuranceSalaryCap: z.number().min(0, 'Mức trần bảo hiểm phải lớn hơn hoặc bằng 0'),
  baseSalaryReference: z.number().min(0, 'Mức lương cơ sở phải lớn hơn hoặc bằng 0'),
});

export type InsuranceRatesInput = z.infer<typeof insuranceRatesSchema>;

// =============================================
// MINIMUM WAGE SCHEMAS
// =============================================

export const minimumWageByRegionSchema = z.object({
  region1: z.number().min(0, 'Lương tối thiểu vùng 1 phải lớn hơn hoặc bằng 0'),
  region2: z.number().min(0, 'Lương tối thiểu vùng 2 phải lớn hơn hoặc bằng 0'),
  region3: z.number().min(0, 'Lương tối thiểu vùng 3 phải lớn hơn hoặc bằng 0'),
  region4: z.number().min(0, 'Lương tối thiểu vùng 4 phải lớn hơn hoặc bằng 0'),
});

export type MinimumWageByRegionInput = z.infer<typeof minimumWageByRegionSchema>;

// =============================================
// LATE PENALTY TIER SCHEMAS
// =============================================

export const latePenaltyTierSchema = z.object({
  fromMinutes: z.number().int().min(0, 'Số phút bắt đầu phải lớn hơn hoặc bằng 0'),
  toMinutes: z.number().int().nullable(),
  amount: z.number().min(0, 'Số tiền phạt phải lớn hơn hoặc bằng 0'),
});

export type LatePenaltyTierInput = z.infer<typeof latePenaltyTierSchema>;

// =============================================
// EMPLOYEE SETTINGS SCHEMAS
// =============================================

export const employeeSettingsSchema = z.object({
  workStartTime: z.string().regex(/^\d{2}:\d{2}$/, 'Giờ bắt đầu làm việc không hợp lệ (HH:mm)'),
  workEndTime: z.string().regex(/^\d{2}:\d{2}$/, 'Giờ kết thúc làm việc không hợp lệ (HH:mm)'),
  lunchBreakDuration: z.number().min(0, 'Thời gian nghỉ trưa phải lớn hơn hoặc bằng 0'),
  lunchBreakStart: z.string().regex(/^\d{2}:\d{2}$/, 'Giờ bắt đầu nghỉ trưa không hợp lệ (HH:mm)'),
  lunchBreakEnd: z.string().regex(/^\d{2}:\d{2}$/, 'Giờ kết thúc nghỉ trưa không hợp lệ (HH:mm)'),
  workingDays: z.array(z.number().int().min(0).max(6)),
  workShifts: z.array(createWorkShiftSchema).optional(),
  otHourlyRate: z.number().min(0, 'Hệ số tăng ca phải lớn hơn hoặc bằng 0'),
  otRateWeekend: z.number().min(0, 'Hệ số tăng ca cuối tuần phải lớn hơn hoặc bằng 0'),
  otRateHoliday: z.number().min(0, 'Hệ số tăng ca ngày lễ phải lớn hơn hoặc bằng 0'),
  allowedLateMinutes: z.number().int().min(0, 'Số phút trễ cho phép phải lớn hơn hoặc bằng 0'),
  latePenaltyTiers: z.array(latePenaltyTierSchema).optional(),
  earlyLeavePenaltyTiers: z.array(latePenaltyTierSchema).optional(),
  leaveTypes: z.array(createLeaveTypeSchema).optional(),
  baseAnnualLeaveDays: z.number().min(0, 'Số ngày phép năm cơ bản phải lớn hơn hoặc bằng 0'),
  annualLeaveSeniorityBonus: z.object({
    years: z.number().int().min(0),
    additionalDays: z.number().min(0),
  }).optional(),
  allowRollover: z.boolean().default(false),
  rolloverExpirationDate: z.string().optional(),
  salaryComponents: z.array(createSalaryComponentSchema).optional(),
  payrollCycle: z.enum(['monthly', 'weekly', 'bi-weekly']).default('monthly'),
  payday: z.number().int().min(1).max(31),
});

export const updateEmployeeSettingsSchema = employeeSettingsSchema.partial();

export type EmployeeSettingsInput = z.infer<typeof employeeSettingsSchema>;
export type UpdateEmployeeSettingsInput = z.infer<typeof updateEmployeeSettingsSchema>;
