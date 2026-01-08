/**
 * API Validation Schemas for Users
 */
import { z } from 'zod'

// Query params for listing
export const listUsersSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  role: z.string().optional(),
})

// Create user schema
export const createUserSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  role: z.string().optional().default('USER'),
  isActive: z.boolean().optional().default(true),
  employeeId: z.string().optional(),
})

// Update user schema
export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  employeeId: z.string().optional(),
})

export type ListUsersInput = z.infer<typeof listUsersSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
