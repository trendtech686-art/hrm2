/**
 * Zod validation schemas for payroll module
 */
import { z } from 'zod';
import { systemIdSchema } from '@/lib/id-types';

// Batch status enum
export const payrollStatusSchema = z.enum([
  'draft',
  'calculating',
  'pending_approval',
  'approved',
  'paid',
  'cancelled'
]);

// Create payroll batch schema
export const createPayrollSchema = z.object({
  name: z.string().min(1, 'Tên đợt lương không được để trống'),
  month: z.number().int().min(1).max(12, 'Tháng phải từ 1-12'),
  year: z.number().int().min(2020).max(2100, 'Năm không hợp lệ'),
  branchSystemId: systemIdSchema.optional(),
  branchName: z.string().optional(),
  departmentFilter: z.string().optional(),
  templateSystemId: systemIdSchema.optional(),
  notes: z.string().optional(),
});

// Update payroll batch schema
export const updatePayrollSchema = createPayrollSchema.partial().extend({
  status: payrollStatusSchema.optional(),
});

// Payslip schema
export const createPayslipSchema = z.object({
  batchSystemId: systemIdSchema,
  employeeSystemId: systemIdSchema,
  employeeName: z.string().optional(),
  baseSalary: z.number().min(0, 'Lương cơ bản phải >= 0'),
  workDays: z.number().min(0),
  actualWorkDays: z.number().min(0),
  overtimeHours: z.number().min(0).optional(),
  overtimePay: z.number().min(0).optional(),
  allowances: z.number().min(0).optional(),
  bonuses: z.number().min(0).optional(),
  deductions: z.number().min(0).optional(),
  socialInsurance: z.number().min(0).optional(),
  healthInsurance: z.number().min(0).optional(),
  unemploymentInsurance: z.number().min(0).optional(),
  personalIncomeTax: z.number().min(0).optional(),
  netSalary: z.number().min(0),
  notes: z.string().optional(),
});

// Update payslip schema
export const updatePayslipSchema = createPayslipSchema.partial();

// Payroll template schema
export const createPayrollTemplateSchema = z.object({
  name: z.string().min(1, 'Tên mẫu không được để trống'),
  description: z.string().optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  socialInsuranceRate: z.number().min(0).max(100).optional(),
  healthInsuranceRate: z.number().min(0).max(100).optional(),
  unemploymentInsuranceRate: z.number().min(0).max(100).optional(),
  overtimeRate: z.number().min(1).optional(),
  weekendRate: z.number().min(1).optional(),
  holidayRate: z.number().min(1).optional(),
});

// Filter schemas
export const payrollFiltersSchema = z.object({
  month: z.number().optional(),
  year: z.number().optional(),
  branchSystemId: z.string().optional(),
  status: payrollStatusSchema.optional(),
  search: z.string().optional(),
});

export const payslipFiltersSchema = z.object({
  batchId: z.string().optional(),
  employeeSystemId: z.string().optional(),
  department: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type PayrollStatus = z.infer<typeof payrollStatusSchema>;
export type CreatePayrollInput = z.infer<typeof createPayrollSchema>;
export type UpdatePayrollInput = z.infer<typeof updatePayrollSchema>;
export type CreatePayslipInput = z.infer<typeof createPayslipSchema>;
export type UpdatePayslipInput = z.infer<typeof updatePayslipSchema>;
export type CreatePayrollTemplateInput = z.infer<typeof createPayrollTemplateSchema>;
export type PayrollFilters = z.infer<typeof payrollFiltersSchema>;
export type PayslipFilters = z.infer<typeof payslipFiltersSchema>;
