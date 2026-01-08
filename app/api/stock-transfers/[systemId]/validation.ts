import { z } from 'zod'

export const updateStockTransferSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED']).optional(),
  notes: z.string().optional().nullable(),
  updatedBy: z.string().optional(),
})

export const deleteStockTransferSchema = z.object({
  hard: z.boolean().optional(),
})

export type UpdateStockTransferInput = z.infer<typeof updateStockTransferSchema>
