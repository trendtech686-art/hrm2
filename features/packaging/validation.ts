/**
 * Zod validation schemas for packaging module
 */
import { z } from 'zod';
import type { BusinessId, SystemId } from '@/lib/id-types';

// Packaging status enum
export const packagingStatusSchema = z.enum([
  'pending',
  'picking',
  'packing',
  'packed',
  'ready_to_ship',
  'shipped',
  'cancelled'
]);

// Packaging priority enum
export const packagingPrioritySchema = z.enum([
  'low',
  'normal',
  'high',
  'urgent'
]);

// Packaging item schema
export const packagingItemSchema = z.object({
  orderItemSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  productSystemId: z.string() as z.ZodType<SystemId>,
  productBusinessId: z.string().optional() as z.ZodType<BusinessId | undefined>,
  productName: z.string().optional(),
  variantSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  variantName: z.string().optional(),
  quantity: z.number().int().positive('Số lượng phải lớn hơn 0'),
  pickedQuantity: z.number().int().min(0).default(0),
  packedQuantity: z.number().int().min(0).default(0),
  locationSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  locationName: z.string().optional(),
});

// Create packaging schema
export const createPackagingSchema = z.object({
  orderSystemId: z.string() as z.ZodType<SystemId>,
  orderBusinessId: z.string().optional() as z.ZodType<BusinessId | undefined>,
  customerName: z.string().optional(),
  branchSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  warehouseSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  priority: packagingPrioritySchema.default('normal'),
  dueDate: z.string().optional(),
  assignedToSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  assignedToName: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(packagingItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
});

// Update packaging schema
export const updatePackagingSchema = createPackagingSchema.partial().extend({
  status: packagingStatusSchema.optional(),
});

// Start picking schema
export const startPickingSchema = z.object({
  pickerSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  pickerName: z.string().optional(),
});

// Complete picking schema
export const completePickingSchema = z.object({
  pickedItems: z.array(z.object({
    itemIndex: z.number().int().min(0),
    pickedQuantity: z.number().int().min(0),
    notes: z.string().optional(),
  })),
});

// Complete packing schema
export const completePackingSchema = z.object({
  packageWeight: z.number().min(0).optional(),
  packageLength: z.number().min(0).optional(),
  packageWidth: z.number().min(0).optional(),
  packageHeight: z.number().min(0).optional(),
  packageType: z.string().optional(),
  trackingLabel: z.string().optional(),
  packerNote: z.string().optional(),
});

// Filter schema
export const packagingFiltersSchema = z.object({
  status: packagingStatusSchema.optional(),
  priority: packagingPrioritySchema.optional(),
  branchSystemId: z.string().optional(),
  warehouseSystemId: z.string().optional(),
  assignedToSystemId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type PackagingStatus = z.infer<typeof packagingStatusSchema>;
export type PackagingPriority = z.infer<typeof packagingPrioritySchema>;
export type PackagingItem = z.infer<typeof packagingItemSchema>;
export type CreatePackagingInput = z.infer<typeof createPackagingSchema>;
export type UpdatePackagingInput = z.infer<typeof updatePackagingSchema>;
export type StartPickingInput = z.infer<typeof startPickingSchema>;
export type CompletePickingInput = z.infer<typeof completePickingSchema>;
export type CompletePackingInput = z.infer<typeof completePackingSchema>;
export type PackagingFilters = z.infer<typeof packagingFiltersSchema>;
