/**
 * API Validation Schemas for Departments
 */
import { z } from 'zod'

// Query params for listing
export const listDepartmentsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '50')),
  search: z.string().optional(),
  all: z.string().optional().transform(v => v === 'true'),
})

// Create department schema
export const createDepartmentSchema = z.object({
  id: z.string().min(1, 'Mã phòng ban là bắt buộc'),
  name: z.string().min(1, 'Tên phòng ban là bắt buộc'),
  description: z.string().optional(),
  parentId: z.string().optional(),
})

// Update department schema
export const updateDepartmentSchema = createDepartmentSchema.partial()

export type ListDepartmentsInput = z.infer<typeof listDepartmentsSchema>
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>
