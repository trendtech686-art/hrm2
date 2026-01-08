/**
 * Re-export Payroll types from centralized prisma-extended.ts
 * This file exists for backwards compatibility during migration
 */
export {
  type PayrollStatus,
  type Payroll,
  type PayrollItem,
} from '@/lib/types/prisma-extended';

// Re-export validation types from Zod schemas
export type {
  CreatePayrollInput,
  UpdatePayrollInput,
  CreatePayslipInput,
  UpdatePayslipInput,
  CreatePayrollTemplateInput,
  PayrollFilters,
  PayslipFilters,
} from './validation';
