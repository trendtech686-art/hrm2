import { z } from 'zod'

export const updateWarrantySchema = z.object({
  issueDescription: z.string().optional(),
  notes: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  solution: z.string().optional().nullable(),
})

export type UpdateWarrantyInput = z.infer<typeof updateWarrantySchema>
