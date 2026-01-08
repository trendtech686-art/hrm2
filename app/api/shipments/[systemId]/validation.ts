import { z } from 'zod'

export const updateShipmentSchema = z.object({
  carrier: z.string().optional(),
  trackingNumber: z.string().optional().nullable(),
  shippingFee: z.number().optional(),
  status: z.enum(['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'CANCELLED']).optional(),
  deliveredAt: z.string().optional().nullable(),
  recipientName: z.string().optional(),
  recipientPhone: z.string().optional(),
  recipientAddress: z.string().optional(),
  notes: z.string().optional().nullable(),
})

export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>
