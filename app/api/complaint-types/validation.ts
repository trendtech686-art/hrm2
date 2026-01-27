/**
 * API Validation Schemas for Complaint Types
 */
import { z } from 'zod'

// Query params for listing
export const listComplaintTypesSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '50')),
  search: z.string().optional(),
  all: z.string().optional().transform(v => v === 'true'),
})

// Create complaint type schema
export const createComplaintTypeSchema = z.object({
  id: z.string().min(1, 'Mã loại khiếu nại là bắt buộc'),
  name: z.string().min(1, 'Tên loại khiếu nại là bắt buộc'),
  description: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  isDefault: z.boolean().optional().default(false),
  sortOrder: z.number().optional().default(0),
})

// Update complaint type schema
export const updateComplaintTypeSchema = createComplaintTypeSchema.partial()

export type ListComplaintTypesInput = z.infer<typeof listComplaintTypesSchema>
export type CreateComplaintTypeInput = z.infer<typeof createComplaintTypeSchema>
export type UpdateComplaintTypeInput = z.infer<typeof updateComplaintTypeSchema>
