/**
 * API Validation Schemas for Job Titles
 */
import { z } from 'zod'

// Query params for listing
export const listJobTitlesSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '50')),
  search: z.string().optional(),
  all: z.string().optional().transform(v => v === 'true'),
})

// Create job title schema
export const createJobTitleSchema = z.object({
  id: z.string().min(1, 'Mã chức danh là bắt buộc'),
  name: z.string().min(1, 'Tên chức danh là bắt buộc'),
  description: z.string().optional(),
})

// Update job title schema
export const updateJobTitleSchema = createJobTitleSchema.partial()

export type ListJobTitlesInput = z.infer<typeof listJobTitlesSchema>
export type CreateJobTitleInput = z.infer<typeof createJobTitleSchema>
export type UpdateJobTitleInput = z.infer<typeof updateJobTitleSchema>
