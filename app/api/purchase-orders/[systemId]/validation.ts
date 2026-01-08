import { z } from 'zod'

const purchaseOrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  discount: z.number().min(0).optional(),
  total: z.number().min(0).optional(),
})

export const updatePurchaseOrderSchema = z.object({
  supplierId: z.string().optional(),
  orderDate: z.string().optional(),
  expectedDate: z.string().optional().nullable(),
  receivedDate: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'ORDERED', 'PARTIAL', 'RECEIVED', 'CANCELLED']).optional(),
  subtotal: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  total: z.number().min(0).optional(),
  notes: z.string().optional().nullable(),
  items: z.array(purchaseOrderItemSchema).optional(),
})

export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>
