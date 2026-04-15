/**
 * Zod validation schemas for price-adjustments module
 */
import { z } from 'zod';

// Item schema
export const priceAdjustmentItemSchema = z.object({
  productId: z.string().min(1, 'Mã sản phẩm không được để trống'),
  productSystemId: z.string().optional(),
  productName: z.string().optional(),
  productImage: z.string().optional(),
  oldPrice: z.number().min(0, 'Giá cũ phải >= 0'),
  newPrice: z.number().min(0, 'Giá mới phải >= 0'),
  adjustmentAmount: z.number().optional(),
  adjustmentPercent: z.number().optional(),
  note: z.string().optional(),
});

// Create schema
export const createPriceAdjustmentSchema = z.object({
  pricingPolicyId: z.string().optional(),
  pricingPolicySystemId: z.string().optional(),
  pricingPolicyName: z.string().optional(),
  adjustmentDate: z.union([z.string().min(1, 'Ngày điều chỉnh không được để trống'), z.date()]),
  effectiveDate: z.union([z.string(), z.date()]).optional(),
  expiryDate: z.union([z.string(), z.date()]).optional(),
  type: z.enum(['INCREASE', 'DECREASE', 'SET']),
  reason: z.string().optional(),
  description: z.string().optional(),
  createdBy: z.string().optional(),
  createdByName: z.string().optional(),
  items: z.array(priceAdjustmentItemSchema).optional(),
});

// Update schema
export const updatePriceAdjustmentSchema = z.object({
  systemId: z.string().min(1, 'Mã điều chỉnh không được để trống'),
  adjustmentDate: z.union([z.string(), z.date()]).optional(),
  effectiveDate: z.union([z.string(), z.date()]).optional(),
  expiryDate: z.union([z.string(), z.date()]).optional(),
  type: z.enum(['INCREASE', 'DECREASE', 'SET']).optional(),
  reason: z.string().optional(),
  description: z.string().optional(),
  updatedBy: z.string().optional(),
});

// Types
export type PriceAdjustmentItemInput = z.infer<typeof priceAdjustmentItemSchema>;
export type CreatePriceAdjustmentInput = z.infer<typeof createPriceAdjustmentSchema>;
export type UpdatePriceAdjustmentInput = z.infer<typeof updatePriceAdjustmentSchema>;
