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
  // Legacy fields
  customerId: z.string().optional(),
  orderId: z.string().optional(),
  branchId: z.string().optional(),
  method: z.string().optional(),
  paymentMethod: z.string().optional(),
  receiptDate: z.string().optional(),
  // New systemId-based fields
  branchSystemId: z.string().optional(),
  branchName: z.string().optional(),
  customerSystemId: z.string().optional(),
  customerName: z.string().optional(),
  payerTypeSystemId: z.string().optional(),
  payerTypeName: z.string().optional(),
  payerSystemId: z.string().optional(),
  payerName: z.string().optional(),
  paymentMethodSystemId: z.string().optional(),
  paymentMethodName: z.string().optional(),
  accountSystemId: z.string().optional(),
  paymentReceiptTypeSystemId: z.string().optional(),
  paymentReceiptTypeName: z.string().optional(),
  // Purchase order link (for supplier refund receipts)
  purchaseOrderSystemId: z.string().optional(),
  purchaseOrderId: z.string().optional(),
  // Common fields
  date: z.string().optional(),
  amount: z.number().min(0, 'Số tiền phải >= 0'),
  description: z.string().optional(),
  affectsDebt: z.boolean().optional(),
  affectsBusinessReport: z.boolean().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  createdBy: z.string().optional(),
})

// Update receipt schema
export const updateReceiptSchema = createReceiptSchema.partial()

export type ListReceiptsInput = z.infer<typeof listReceiptsSchema>
export type CreateReceiptInput = z.infer<typeof createReceiptSchema>
export type UpdateReceiptInput = z.infer<typeof updateReceiptSchema>
