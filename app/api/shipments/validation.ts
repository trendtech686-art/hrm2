/**
 * API Validation Schemas for Shipments
 */
import { z } from 'zod'

// Query params for listing shipments
export const listShipmentsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  orderId: z.string().optional(),
})

// Create shipment schema
export const createShipmentSchema = z.object({
  id: z.string().optional(),
  orderId: z.string().min(1, 'Order ID là bắt buộc'),
  carrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  shippingFee: z.number().optional().default(0),
  status: z.string().optional().default('PENDING'),
  deliveredAt: z.string().optional(),
  recipientName: z.string().optional(),
  recipientPhone: z.string().optional(),
  recipientAddress: z.string().optional(),
  notes: z.string().optional(),
})

// Update shipment schema
export const updateShipmentSchema = createShipmentSchema.partial()

export type ListShipmentsInput = z.infer<typeof listShipmentsSchema>
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>
export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>
