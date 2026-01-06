import { z } from 'zod';

// Complaint Category Schema
export const createComplaintCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  slaResponseHours: z.number().min(0).optional(),
  slaResolutionHours: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
});

export const updateComplaintCategorySchema = createComplaintCategorySchema.partial();

// Complaint Status Schema
export const createComplaintStatusSchema = z.object({
  name: z.string().min(1, 'Tên trạng thái không được để trống'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu không hợp lệ'),
  isFinal: z.boolean().default(false),
  sortOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateComplaintStatusSchema = createComplaintStatusSchema.partial();

// Complaint Settings Schema
export const complaintSettingsSchema = z.object({
  autoAssignEnabled: z.boolean().default(false),
  defaultAssigneeId: z.string().optional(),
  notifyOnCreate: z.boolean().default(true),
  notifyOnUpdate: z.boolean().default(true),
  notifyOnResolve: z.boolean().default(true),
  escalationEnabled: z.boolean().default(false),
  escalationHours: z.number().min(1).optional(),
  escalationAssigneeId: z.string().optional(),
});

// Filter Schema
export const complaintCategoryFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

// Types
export type CreateComplaintCategoryInput = z.infer<typeof createComplaintCategorySchema>;
export type UpdateComplaintCategoryInput = z.infer<typeof updateComplaintCategorySchema>;
export type CreateComplaintStatusInput = z.infer<typeof createComplaintStatusSchema>;
export type UpdateComplaintStatusInput = z.infer<typeof updateComplaintStatusSchema>;
export type ComplaintSettings = z.infer<typeof complaintSettingsSchema>;
export type ComplaintCategoryFilter = z.infer<typeof complaintCategoryFilterSchema>;
