/**
 * API Validation Schemas for Auth
 */
import { z } from 'zod'

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
})

export type LoginInput = z.infer<typeof loginSchema>
