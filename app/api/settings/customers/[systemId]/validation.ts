import { z } from 'zod'

export const updateCustomerSettingSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  orderIndex: z.number().optional(),
  updatedBy: z.string().optional(),
}).passthrough()

export const deleteCustomerSettingSchema = z.object({
  hard: z.boolean().optional(),
})

export type UpdateCustomerSettingInput = z.infer<typeof updateCustomerSettingSchema>
