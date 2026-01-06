import { z } from 'zod';

// Warranty Status Schema
export const createWarrantyStatusSchema = z.object({
  name: z.string().min(1, 'Tên trạng thái không được để trống'),
  code: z.string().min(1, 'Mã trạng thái không được để trống'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu không hợp lệ'),
  isFinal: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  sortOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateWarrantyStatusSchema = createWarrantyStatusSchema.partial();

// Warranty Settings Schema
export const warrantySettingsSchema = z.object({
  // Default values
  defaultWarrantyMonths: z.number().min(0).max(120).default(12),
  defaultExtendedMonths: z.number().min(0).max(60).default(0),
  
  // Notification settings
  notifyOnCreate: z.boolean().default(true),
  notifyOnStatusChange: z.boolean().default(true),
  notifyOnExpiring: z.boolean().default(true),
  expirationWarningDays: z.number().min(1).max(90).default(30),
  
  // SLA settings
  slaEnabled: z.boolean().default(false),
  slaResponseHours: z.number().min(0).optional(),
  slaResolutionHours: z.number().min(0).optional(),
  
  // Auto actions
  autoCloseAfterDays: z.number().min(0).optional(),
  requirePhotosOnCreate: z.boolean().default(false),
  requirePhotosOnComplete: z.boolean().default(false),
});

// Filter Schema
export const warrantyStatusFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isFinal: z.boolean().optional(),
});

// Types
export type CreateWarrantyStatusInput = z.infer<typeof createWarrantyStatusSchema>;
export type UpdateWarrantyStatusInput = z.infer<typeof updateWarrantyStatusSchema>;
export type WarrantySettings = z.infer<typeof warrantySettingsSchema>;
export type WarrantyStatusFilter = z.infer<typeof warrantyStatusFilterSchema>;
