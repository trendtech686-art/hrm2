import { z } from 'zod'

const payrollComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['earning', 'deduction', 'benefit']),
  calculationType: z.enum(['fixed', 'percentage', 'formula']),
  value: z.number().optional(),
  formula: z.string().optional(),
  taxable: z.boolean().default(true),
  isActive: z.boolean().default(true),
})

export const createPayrollTemplateSchema = z.object({
  systemId: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.string().optional(),
  components: z.array(payrollComponentSchema).optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

export const updatePayrollTemplateSchema = createPayrollTemplateSchema.partial()

export const bulkUpdatePayrollTemplatesSchema = z.object({
  templates: z.array(createPayrollTemplateSchema),
})

export type CreatePayrollTemplateInput = z.infer<typeof createPayrollTemplateSchema>
export type UpdatePayrollTemplateInput = z.infer<typeof updatePayrollTemplateSchema>
export type BulkUpdatePayrollTemplatesInput = z.infer<typeof bulkUpdatePayrollTemplatesSchema>
