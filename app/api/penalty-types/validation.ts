/**
 * API Validation Schemas for Penalty Types
 */
import { z } from 'zod'

// Query params for listing
export const listPenaltyTypesSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '50')),
  search: z.string().optional(),
  all: z.string().optional().transform(v => v === 'true'),
})

// Create penalty type schema
export const createPenaltyTypeSchema = z.object({
  id: z.string().min(1, 'Mã loại phạt là bắt buộc'),
  name: z.string().min(1, 'Tên loại phạt là bắt buộc'),
  description: z.string().optional(),
  defaultAmount: z.number().min(0).default(0),
  category: z.enum(['complaint', 'attendance', 'performance', 'other']).default('other'),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
})

// Update penalty type schema
export const updatePenaltyTypeSchema = createPenaltyTypeSchema.partial()

export type ListPenaltyTypesInput = z.infer<typeof listPenaltyTypesSchema>
export type CreatePenaltyTypeInput = z.infer<typeof createPenaltyTypeSchema>
export type UpdatePenaltyTypeInput = z.infer<typeof updatePenaltyTypeSchema>
