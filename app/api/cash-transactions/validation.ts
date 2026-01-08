/**
 * API Validation Schemas for Cash Transactions
 */
import { z } from 'zod'

// Query params for listing
export const listCashTransactionsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  accountId: z.string().optional(),
  type: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

// Create cash transaction schema
export const createCashTransactionSchema = z.object({
  id: z.string().optional(),
  accountId: z.string().optional(),
  cashAccountId: z.string().optional(),
  type: z.string().optional(),
  transactionType: z.string().optional(),
  amount: z.number().min(0, 'Số tiền phải >= 0'),
  transactionDate: z.string().optional(),
  description: z.string().optional(),
  referenceId: z.string().optional(),
  referenceType: z.string().optional(),
})

// Update cash transaction schema
export const updateCashTransactionSchema = createCashTransactionSchema.partial()

export type ListCashTransactionsInput = z.infer<typeof listCashTransactionsSchema>
export type CreateCashTransactionInput = z.infer<typeof createCashTransactionSchema>
export type UpdateCashTransactionInput = z.infer<typeof updateCashTransactionSchema>
