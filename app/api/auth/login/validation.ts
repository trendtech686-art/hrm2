/**
 * API Validation Schemas for Auth
 */
import { z } from 'zod'

// Login schema — `email` có thể là email hoặc số điện thoại (identifier chung)
export const loginSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email hoặc số điện thoại'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
})

export type LoginInput = z.infer<typeof loginSchema>
