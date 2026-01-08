import { z } from 'zod'

export const updateComplaintSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED']).optional(),
  assigneeId: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  resolution: z.string().optional().nullable(),
  resolvedAt: z.string().optional().nullable(),
})

export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>
