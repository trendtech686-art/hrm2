import { z } from 'zod'

export const updateStockLocationSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
})

export type UpdateStockLocationInput = z.infer<typeof updateStockLocationSchema>
