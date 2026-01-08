/**
 * API Validation Schemas for Branches
 */
import { z } from 'zod'

// Query params for listing branches
export const listBranchesSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '50')),
  search: z.string().optional(),
  all: z.string().optional().transform(v => v === 'true'),
})

// Create branch schema
export const createBranchSchema = z.object({
  id: z.string().min(1, 'Mã chi nhánh là bắt buộc'),
  name: z.string().min(1, 'Tên chi nhánh là bắt buộc'),
  address: z.string().optional(),
  phone: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
})

// Update branch schema
export const updateBranchSchema = createBranchSchema.partial()

export type ListBranchesInput = z.infer<typeof listBranchesSchema>
export type CreateBranchInput = z.infer<typeof createBranchSchema>
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>
