import { z } from 'zod'

const purchaseOrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  discount: z.number().min(0).optional(),
  total: z.number().min(0).optional(),
})

export const updatePurchaseOrderSchema = z.object({
  systemId: z.string().optional(),
  supplierId: z.string().optional(),
  orderDate: z.string().optional(),
  expectedDate: z.string().optional().nullable(),
  receivedDate: z.string().optional().nullable(),
  deliveryDate: z.string().optional().nullable(),
  // Accept both uppercase and lowercase status, as well as Vietnamese
  status: z.string().optional(),
  deliveryStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
  // Cancel info
  cancelledBy: z.string().optional().nullable(),
  cancelledAt: z.string().optional().nullable(),
  // Complete info
  completedBy: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
  // Financial
  subtotal: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  total: z.number().min(0).optional(),
  grandTotal: z.number().min(0).optional(),
  shippingFee: z.number().min(0).optional(),
  // Other
  notes: z.string().optional().nullable(),
  items: z.array(purchaseOrderItemSchema).optional(),
})

export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>
