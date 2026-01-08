/**
 * Zod validation schemas for shipments module
 */
import { z } from 'zod';
import { businessIdSchema, systemIdSchema } from '@/lib/id-types';

// Shipment status enum
export const shipmentStatusSchema = z.enum([
  'pending',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'failed',
  'returned',
  'cancelled'
]);

// Carrier enum
export const shipmentCarrierSchema = z.enum([
  'ghn',
  'ghtk',
  'viettel_post',
  'vnpost',
  'jnt',
  'best_express',
  'ninja_van',
  'grab_express',
  'ahamove',
  'lalamove',
  'self_delivery',
  'other'
]);

// Shipment item schema
export const shipmentItemSchema = z.object({
  orderItemSystemId: systemIdSchema.optional(),
  productSystemId: systemIdSchema,
  productBusinessId: businessIdSchema.optional(),
  productName: z.string().optional(),
  variantSystemId: systemIdSchema.optional(),
  variantName: z.string().optional(),
  quantity: z.number().int().positive('Số lượng phải lớn hơn 0'),
  weight: z.number().min(0).optional(),
});

// Create shipment schema
export const createShipmentSchema = z.object({
  orderSystemId: systemIdSchema,
  orderBusinessId: businessIdSchema.optional(),
  carrier: shipmentCarrierSchema,
  trackingNumber: z.string().optional(),
  estimatedDeliveryDate: z.string().optional(),
  
  // Sender info
  senderName: z.string().optional(),
  senderPhone: z.string().optional(),
  senderAddress: z.string().optional(),
  fromWarehouseSystemId: systemIdSchema.optional(),
  
  // Recipient info
  recipientName: z.string().min(1, 'Tên người nhận không được để trống'),
  recipientPhone: z.string().min(1, 'Số điện thoại người nhận không được để trống'),
  recipientAddress: z.string().min(1, 'Địa chỉ nhận hàng không được để trống'),
  recipientProvince: z.string().optional(),
  recipientDistrict: z.string().optional(),
  recipientWard: z.string().optional(),
  
  // Package info
  weight: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  
  // Cost info
  shippingFee: z.number().min(0).optional(),
  codAmount: z.number().min(0).optional(),
  insuranceValue: z.number().min(0).optional(),
  
  notes: z.string().optional(),
  items: z.array(shipmentItemSchema).optional(),
});

// Update shipment schema
export const updateShipmentSchema = createShipmentSchema.partial().extend({
  status: shipmentStatusSchema.optional(),
  actualDeliveryDate: z.string().optional(),
});

// Update tracking schema
export const updateTrackingSchema = z.object({
  status: shipmentStatusSchema,
  trackingNote: z.string().optional(),
  location: z.string().optional(),
  timestamp: z.date().optional(),
});

// Filter schema
export const shipmentFiltersSchema = z.object({
  status: shipmentStatusSchema.optional(),
  carrier: shipmentCarrierSchema.optional(),
  orderSystemId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type ShipmentStatus = z.infer<typeof shipmentStatusSchema>;
export type ShipmentCarrier = z.infer<typeof shipmentCarrierSchema>;
export type ShipmentItem = z.infer<typeof shipmentItemSchema>;
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>;
export type UpdateTrackingInput = z.infer<typeof updateTrackingSchema>;
export type ShipmentFilters = z.infer<typeof shipmentFiltersSchema>;
