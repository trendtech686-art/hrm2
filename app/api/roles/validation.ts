/**
 * API Validation Schemas for Roles
 */
import { z } from 'zod'

// Query params for listing
export const listRolesSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '50')),
  search: z.string().optional(),
  all: z.string().optional().transform(v => v === 'true'),
})

// Create role schema
export const createRoleSchema = z.object({
  id: z.string().min(1, 'Mã vai trò là bắt buộc'),
  name: z.string().min(1, 'Tên vai trò là bắt buộc'),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([]),
  isSystem: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
})

// Update role schema
export const updateRoleSchema = createRoleSchema.partial()

export type ListRolesInput = z.infer<typeof listRolesSchema>
export type CreateRoleInput = z.infer<typeof createRoleSchema>
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>
