/**
 * API Validation Schemas for Payments
 */
import { z } from 'zod'

// Query params for listing
export const listPaymentsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  supplierId: z.string().optional(),
})

// Create payment schema
export const createPaymentSchema = z.object({
  id: z.string().optional(),
  supplierId: z.string().optional(),
  purchaseOrderId: z.string().optional(),
  branchId: z.string().optional(),
  amount: z.number().min(0, 'Số tiền phải >= 0'),
  method: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentDate: z.string().optional(),
  description: z.string().optional(),
})

// Update payment schema
export const updatePaymentSchema = createPaymentSchema.partial()

export type ListPaymentsInput = z.infer<typeof listPaymentsSchema>
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>
