import { z } from 'zod';

// =============================================================================
// WARRANTY VALIDATION SCHEMAS
// =============================================================================

/**
 * Warranty Status
 */
export const warrantyStatusSchema = z.enum([
  'incomplete',
  'pending',
  'processed',
  'returned',
  'completed',
]);

export const warrantySettlementStatusSchema = z.enum([
  'unsettled',
  'partial',
  'settled',
]);

export const resolutionTypeSchema = z.enum([
  'replace',
  'refund',
  'repair',
  'advice',
]);

export const settlementTypeSchema = z.enum([
  'cash',
  'bank_transfer',
  'credit',
  'product',
]);

/**
 * Warranty Product Schema
 */
export const warrantyProductSchema = z.object({
  productSystemId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
  productName: z.string(),
  productSku: z.string().optional(),
  quantity: z.number().min(1, 'Số lượng phải >= 1'),
  unitPrice: z.number().min(0, 'Đơn giá phải >= 0'),
  warrantyReason: z.string().min(1, 'Vui lòng nhập lý do bảo hành'),
  resolutionType: resolutionTypeSchema.optional(),
  resolutionNote: z.string().optional(),
});

export type WarrantyProductInput = z.infer<typeof warrantyProductSchema>;

/**
 * Create Warranty Form Schema
 */
export const createWarrantySchema = z.object({
  // Order info
  orderSystemId: z.string().min(1, 'Vui lòng chọn đơn hàng'),
  
  // Customer info (auto-filled from order)
  customerSystemId: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  
  // Branch
  branchSystemId: z.string().min(1, 'Vui lòng chọn chi nhánh'),
  
  // Products
  products: z.array(warrantyProductSchema)
    .min(1, 'Vui lòng thêm ít nhất 1 sản phẩm'),
  
  // Notes
  description: z.string().max(2000).optional(),
  internalNote: z.string().max(1000).optional(),
  
  // Optional
  receivedBy: z.string().optional(),
  receivedDate: z.date().optional(),
});

export type CreateWarrantyInput = z.infer<typeof createWarrantySchema>;

/**
 * Update Warranty Schema
 */
export const updateWarrantySchema = z.object({
  description: z.string().max(2000).optional(),
  internalNote: z.string().max(1000).optional(),
  assigneeSystemId: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
});

export type UpdateWarrantyInput = z.infer<typeof updateWarrantySchema>;

/**
 * Process Warranty Schema (update resolution)
 */
export const processWarrantySchema = z.object({
  products: z.array(z.object({
    productSystemId: z.string(),
    resolutionType: resolutionTypeSchema,
    resolutionNote: z.string().optional(),
    replacementProductSystemId: z.string().optional(),
    refundAmount: z.number().min(0).optional(),
  })),
  processNote: z.string().max(2000).optional(),
});

export type ProcessWarrantyInput = z.infer<typeof processWarrantySchema>;

/**
 * Settlement Schema (thanh toán/hoàn tiền)
 */
export const warrantySettlementSchema = z.object({
  settlementType: settlementTypeSchema,
  amount: z.number().min(0, 'Số tiền phải >= 0'),
  note: z.string().max(500).optional(),
  
  // Bank transfer details
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAccountName: z.string().optional(),
  
  // Receipt info
  receiptNumber: z.string().optional(),
});

export type WarrantySettlementInput = z.infer<typeof warrantySettlementSchema>;

/**
 * Return Product Schema (trả hàng cho khách)
 */
export const returnWarrantySchema = z.object({
  returnedProducts: z.array(z.object({
    productSystemId: z.string(),
    quantity: z.number().min(1),
    condition: z.enum(['good', 'repaired', 'replaced']),
    note: z.string().optional(),
  })),
  returnNote: z.string().max(1000).optional(),
  returnedBy: z.string().optional(),
  returnedDate: z.date().optional(),
});

export type ReturnWarrantyInput = z.infer<typeof returnWarrantySchema>;

/**
 * Public Tracking Schema
 */
export const warrantyTrackingSchema = z.object({
  trackingCode: z.string()
    .min(8, 'Mã tra cứu phải có ít nhất 8 ký tự')
    .max(20, 'Mã tra cứu không được quá 20 ký tự'),
  phone: z.string()
    .regex(/^(0|\+84)[3-9][0-9]{8}$/, 'Số điện thoại không hợp lệ')
    .optional(),
});

export type WarrantyTrackingInput = z.infer<typeof warrantyTrackingSchema>;

/**
 * List Warranties Query Schema
 */
export const listWarrantiesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: warrantyStatusSchema.optional(),
  settlementStatus: warrantySettlementStatusSchema.optional(),
  branchSystemId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ListWarrantiesQuery = z.infer<typeof listWarrantiesQuerySchema>;

/**
 * Add Comment Schema
 */
export const addWarrantyCommentSchema = z.object({
  content: z.string()
    .min(1, 'Vui lòng nhập nội dung')
    .max(2000, 'Nội dung không được quá 2000 ký tự'),
  attachments: z.array(z.string()).optional(),
  isInternal: z.boolean().optional().default(false),
});

export type AddWarrantyCommentInput = z.infer<typeof addWarrantyCommentSchema>;
