/**
 * API Validation Schemas for Receipts
 */
import { z } from 'zod'

// Query params for listing
export const listReceiptsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  customerId: z.string().optional(),
})

// Create receipt schema
export const createReceiptSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().optional(),
  orderId: z.string().optional(),
  branchId: z.string().optional(),
  amount: z.number().min(0, 'Số tiền phải >= 0'),
  method: z.string().optional(),
  paymentMethod: z.string().optional(),
  receiptDate: z.string().optional(),
  description: z.string().optional(),
})

// Update receipt schema
export const updateReceiptSchema = createReceiptSchema.partial()

export type ListReceiptsInput = z.infer<typeof listReceiptsSchema>
export type CreateReceiptInput = z.infer<typeof createReceiptSchema>
export type UpdateReceiptInput = z.infer<typeof updateReceiptSchema>
