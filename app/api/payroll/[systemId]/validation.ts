import { z } from 'zod'

const payrollItemSchema = z.object({
  employeeId: z.string(),
  employeeName: z.string().optional(),
  employeeCode: z.string().optional(),
  baseSalary: z.number().optional(),
  netSalary: z.number().optional(),
  notes: z.string().optional().nullable(),
})

export const updatePayrollSchema = z.object({
  status: z.enum(['draft', 'pending', 'paid', 'cancelled']).optional(),
  paidAt: z.string().optional().nullable(),
  items: z.array(payrollItemSchema).optional(),
})

export type UpdatePayrollInput = z.infer<typeof updatePayrollSchema>
