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
  type: z.enum(['cash', 'bank', 'CASH', 'BANK']).optional().default('cash'),
  initialBalance: z.number().optional().default(0),
  bankAccountNumber: z.string().optional(),
  bankBranch: z.string().optional(),
  bankName: z.string().optional(),
  bankCode: z.string().optional(),
  accountHolder: z.string().optional(),
  branchSystemId: z.string().optional(),
  minBalance: z.number().optional(),
  maxBalance: z.number().optional(),
  accountType: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  isDefault: z.boolean().optional().default(false),
})

// Update cash account schema
export const updateCashAccountSchema = createCashAccountSchema.partial()

export type ListCashAccountsInput = z.infer<typeof listCashAccountsSchema>
export type CreateCashAccountInput = z.infer<typeof createCashAccountSchema>
export type UpdateCashAccountInput = z.infer<typeof updateCashAccountSchema>
