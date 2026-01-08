/**
 * API Validation Schemas for Payroll
 */
import { z } from 'zod'

// Query params for listing
export const listPayrollSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  month: z.string().optional(),
  year: z.string().optional(),
  status: z.string().optional(),
  employeeId: z.string().optional(),
})

// Payroll item schema
export const payrollItemSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID là bắt buộc'),
  baseSalary: z.number().optional(),
  netSalary: z.number().optional(),
  notes: z.string().optional(),
})

// Create payroll schema
export const createPayrollSchema = z.object({
  id: z.string().optional(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  status: z.string().optional().default('DRAFT'),
  items: z.array(payrollItemSchema).optional(),
})

// Update payroll schema
export const updatePayrollSchema = createPayrollSchema.partial()

export type ListPayrollInput = z.infer<typeof listPayrollSchema>
export type CreatePayrollInput = z.infer<typeof createPayrollSchema>
export type UpdatePayrollInput = z.infer<typeof updatePayrollSchema>
