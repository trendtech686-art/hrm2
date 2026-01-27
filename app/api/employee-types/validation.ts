/**
 * API Validation Schemas for Employee Types
 */
import { z } from 'zod'

// Query params for listing
export const listEmployeeTypesSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '50')),
  search: z.string().optional(),
  all: z.string().optional().transform(v => v === 'true'),
})

// Create employee type schema
export const createEmployeeTypeSchema = z.object({
  id: z.string().min(1, 'Mã loại nhân viên là bắt buộc'),
  name: z.string().min(1, 'Tên loại nhân viên là bắt buộc'),
  description: z.string().optional(),
  isDefault: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

// Update employee type schema
export const updateEmployeeTypeSchema = createEmployeeTypeSchema.partial()

export type ListEmployeeTypesInput = z.infer<typeof listEmployeeTypesSchema>
export type CreateEmployeeTypeInput = z.infer<typeof createEmployeeTypeSchema>
export type UpdateEmployeeTypeInput = z.infer<typeof updateEmployeeTypeSchema>
