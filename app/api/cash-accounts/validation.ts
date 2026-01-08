/**
 * API Validation Schemas for Cash Accounts
 */
import { z } from 'zod'

// Query params for listing
export const listCashAccountsSchema = z.object({
  all: z.string().optional().transform(v => v === 'true'),
})

// Create cash account schema
export const createCashAccountSchema = z.object({
  id: z.string().min(1, 'Mã quỹ là bắt buộc'),
  name: z.string().min(1, 'Tên quỹ là bắt buộc'),
  type: z.string().optional(),
  accountType: z.string().optional(),
  balance: z.number().optional(),
  currentBalance: z.number().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  isActive: z.boolean().optional().default(true),
})

// Update cash account schema
export const updateCashAccountSchema = createCashAccountSchema.partial()

export type ListCashAccountsInput = z.infer<typeof listCashAccountsSchema>
export type CreateCashAccountInput = z.infer<typeof createCashAccountSchema>
export type UpdateCashAccountInput = z.infer<typeof updateCashAccountSchema>
