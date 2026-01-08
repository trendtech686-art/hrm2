import { z } from 'zod'

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']).optional(),
  isActive: z.boolean().optional(),
  employeeId: z.string().optional().nullable(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
