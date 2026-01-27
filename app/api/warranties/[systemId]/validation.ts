import { z } from 'zod'

export const updateWarrantySchema = z.object({
  issueDescription: z.string().optional(),
  notes: z.string().optional().nullable(),
  status: z.enum(['RECEIVED', 'PENDING', 'PROCESSING', 'WAITING_PARTS', 'COMPLETED', 'RETURNED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  solution: z.string().optional().nullable(),
  diagnosis: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
})

export type UpdateWarrantyInput = z.infer<typeof updateWarrantySchema>
