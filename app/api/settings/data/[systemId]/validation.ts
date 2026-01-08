import { z } from 'zod'

export const updateSettingsDataSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  updatedBy: z.string().optional(),
}).passthrough()

export const deleteSettingsDataSchema = z.object({
  hard: z.boolean().optional(),
})

export type UpdateSettingsDataInput = z.infer<typeof updateSettingsDataSchema>
