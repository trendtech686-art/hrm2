/**
 * Zod validation schemas for reconciliation module
 */
import { z } from 'zod';
import type { SystemId, BusinessId } from '@/lib/id-types';

// Status enum
export const reconciliationStatusSchema = z.enum([
  'pending',
  'reconciled',
  'discrepancy',
  'resolved'
]);

// Create reconciliation schema
export const createReconciliationSchema = z.object({
  orderSystemId: z.string() as z.ZodType<SystemId>,
  orderId: z.string() as z.ZodType<BusinessId>,
  shippingProvider: z.string().min(1, 'Nhà vận chuyển không được để trống'),
  trackingNumber: z.string().optional(),
  expectedAmount: z.number().min(0, 'Số tiền dự kiến phải >= 0'),
  actualAmount: z.number().min(0).optional(),
  codFee: z.number().min(0).optional(),
  shippingFee: z.number().min(0).optional(),
  status: reconciliationStatusSchema.default('pending'),
  notes: z.string().optional(),
  reconciledDate: z.string().optional(),
  reconciledBy: z.string().optional(),
});

// Update reconciliation schema
export const updateReconciliationSchema = createReconciliationSchema.partial();

// Mark as reconciled schema
export const markReconciledSchema = z.object({
  actualAmount: z.number().min(0, 'Số tiền thực nhận phải >= 0'),
  notes: z.string().optional(),
});

// Filter schema
export const reconciliationFiltersSchema = z.object({
  shippingProvider: z.string().optional(),
  status: reconciliationStatusSchema.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type ReconciliationStatus = z.infer<typeof reconciliationStatusSchema>;
export type CreateReconciliationInput = z.infer<typeof createReconciliationSchema>;
export type UpdateReconciliationInput = z.infer<typeof updateReconciliationSchema>;
export type MarkReconciledInput = z.infer<typeof markReconciledSchema>;
export type ReconciliationFilters = z.infer<typeof reconciliationFiltersSchema>;
