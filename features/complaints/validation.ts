import { z } from 'zod';

// =============================================================================
// COMPLAINT VALIDATION SCHEMAS
// =============================================================================

/**
 * Complaint Types
 */
export const complaintTypeSchema = z.enum([
  'wrong-product',
  'missing-items',
  'wrong-packaging',
  'warehouse-defect',
  'product-condition',
]);

export const complaintStatusSchema = z.enum([
  'pending',
  'investigating',
  'resolved',
  'cancelled',
  'ended',
]);

export const complaintResolutionSchema = z.enum([
  'refund',
  'return-shipping',
  'advice-only',
  'replacement',
  'rejected',
]);

export const complaintVerificationSchema = z.enum([
  'verified-correct',
  'verified-incorrect',
  'pending-verification',
]);

// ✅ Match Prisma ComplaintPriority enum
export const complaintPrioritySchema = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);

/**
 * Complaint Image Schema
 */
export const complaintImageSchema = z.object({
  id: z.string(),
  url: z.string().min(1, 'URL ảnh không được để trống'),
  uploadedBy: z.string(),
  uploadedAt: z.date(),
  description: z.string().optional(),
  type: z.enum(['initial', 'evidence']),
});

/**
 * Create Complaint Form Schema
 * Used in form-page.tsx for creating new complaints
 */
export const createComplaintSchema = z.object({
  // Required fields
  orderSystemId: z.string().min(1, 'Vui lòng chọn đơn hàng'),
  type: complaintTypeSchema,
  description: z.string()
    .max(2000, 'Mô tả không được quá 2000 ký tự')
    .optional()
    .default(''),
  
  // Optional fields
  priority: complaintPrioritySchema.optional().default('MEDIUM'),
  images: z.array(complaintImageSchema).optional().default([]),
  
  // Customer info (usually auto-filled from order)
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  
  // Notes
  internalNote: z.string().max(1000).optional(),
});

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;

/**
 * Update Complaint Schema
 */
export const updateComplaintSchema = z.object({
  description: z.string()
    .min(10, 'Mô tả khiếu nại phải có ít nhất 10 ký tự')
    .max(2000, 'Mô tả không được quá 2000 ký tự')
    .optional(),
  priority: complaintPrioritySchema.optional(),
  assigneeSystemId: z.string().optional(),
  internalNote: z.string().max(1000).optional(),
});

export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>;

/**
 * Investigation Action Schema
 */
export const investigateComplaintSchema = z.object({
  verification: complaintVerificationSchema,
  investigationNote: z.string()
    .min(1, 'Vui lòng nhập kết quả điều tra')
    .max(2000, 'Ghi chú không được quá 2000 ký tự'),
  evidenceImages: z.array(z.string()).optional(),
});

export type InvestigateComplaintInput = z.infer<typeof investigateComplaintSchema>;

/**
 * Resolve Complaint Schema
 */
export const resolveComplaintSchema = z.object({
  resolution: complaintResolutionSchema,
  resolutionNote: z.string()
    .min(1, 'Vui lòng nhập phương án xử lý')
    .max(2000, 'Ghi chú không được quá 2000 ký tự'),
  compensationAmount: z.number().min(0).optional(),
  compensationItems: z.array(z.object({
    productSystemId: z.string(),
    productName: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
  })).optional(),
});

export type ResolveComplaintInput = z.infer<typeof resolveComplaintSchema>;

/**
 * Cancel Complaint Schema
 */
export const cancelComplaintSchema = z.object({
  reason: z.string()
    .min(1, 'Vui lòng nhập lý do hủy')
    .max(500, 'Lý do không được quá 500 ký tự'),
});

export type CancelComplaintInput = z.infer<typeof cancelComplaintSchema>;

/**
 * Public Tracking Schema
 */
export const publicTrackingSchema = z.object({
  trackingCode: z.string()
    .min(8, 'Mã tra cứu phải có ít nhất 8 ký tự')
    .max(20, 'Mã tra cứu không được quá 20 ký tự')
    .regex(/^[A-Z0-9]+$/, 'Mã tra cứu chỉ chứa chữ IN HOA và số'),
});

export type PublicTrackingInput = z.infer<typeof publicTrackingSchema>;

/**
 * Add Comment Schema
 */
export const addCommentSchema = z.object({
  content: z.string()
    .min(1, 'Vui lòng nhập nội dung bình luận')
    .max(2000, 'Nội dung không được quá 2000 ký tự'),
  attachments: z.array(z.string()).optional(),
  isInternal: z.boolean().optional().default(false),
});

export type AddCommentInput = z.infer<typeof addCommentSchema>;

/**
 * List Complaints Query Schema (for API)
 */
export const listComplaintsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: complaintStatusSchema.optional(),
  type: complaintTypeSchema.optional(),
  priority: complaintPrioritySchema.optional(),
  branchSystemId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'priority']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ListComplaintsQuery = z.infer<typeof listComplaintsQuerySchema>;
