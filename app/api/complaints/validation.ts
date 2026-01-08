/**
 * API Validation Schemas for Complaints
 */
import { z } from 'zod'

// Query params for listing complaints
export const listComplaintsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  customerId: z.string().optional(),
})

// Create complaint schema
export const createComplaintSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().optional(),
  orderId: z.string().optional(),
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional().default('MEDIUM'),
  status: z.string().optional().default('OPEN'),
  assigneeId: z.string().optional(),
  assignedTo: z.string().optional(),
})

// Update complaint schema
export const updateComplaintSchema = createComplaintSchema.partial()

export type ListComplaintsInput = z.infer<typeof listComplaintsSchema>
export type CreateComplaintInput = z.infer<typeof createComplaintSchema>
export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>
