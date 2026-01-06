import { z } from 'zod';

// =============================================
// PENALTY STATUS & CATEGORY
// =============================================

export const penaltyStatusSchema = z.enum(['Chưa thanh toán', 'Đã thanh toán', 'Đã hủy']);
export const penaltyCategorySchema = z.enum(['complaint', 'attendance', 'performance', 'other']);

// =============================================
// PENALTY TYPE SCHEMAS
// =============================================

export const createPenaltyTypeSchema = z.object({
  id: z.string().min(1, 'Mã loại phạt không được để trống'),
  name: z.string().min(1, 'Tên loại phạt không được để trống'),
  description: z.string().optional(),
  defaultAmount: z.number().min(0, 'Số tiền phạt mặc định phải lớn hơn hoặc bằng 0'),
  category: penaltyCategorySchema,
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const updatePenaltyTypeSchema = createPenaltyTypeSchema.partial();

export const penaltyTypeFilterSchema = z.object({
  search: z.string().optional(),
  category: penaltyCategorySchema.optional(),
  isActive: z.boolean().optional(),
});

export type CreatePenaltyTypeInput = z.infer<typeof createPenaltyTypeSchema>;
export type UpdatePenaltyTypeInput = z.infer<typeof updatePenaltyTypeSchema>;
export type PenaltyTypeFilter = z.infer<typeof penaltyTypeFilterSchema>;

// =============================================
// PENALTY SCHEMAS
// =============================================

export const createPenaltySchema = z.object({
  id: z.string().min(1, 'Mã phiếu phạt không được để trống'),
  employeeSystemId: z.string().min(1, 'Nhân viên không được để trống'),
  employeeName: z.string().min(1, 'Tên nhân viên không được để trống'),
  reason: z.string().min(1, 'Lý do phạt không được để trống'),
  amount: z.number().min(0, 'Số tiền phạt phải lớn hơn hoặc bằng 0'),
  issueDate: z.string().min(1, 'Ngày lập không được để trống'),
  status: penaltyStatusSchema.default('Chưa thanh toán'),
  issuerName: z.string().min(1, 'Tên người lập không được để trống'),
  issuerSystemId: z.string().optional(),
  linkedComplaintSystemId: z.string().optional(),
  linkedOrderSystemId: z.string().optional(),
  penaltyTypeSystemId: z.string().optional(),
  penaltyTypeName: z.string().optional(),
  category: penaltyCategorySchema.optional(),
});

export const updatePenaltySchema = createPenaltySchema.partial();

export const penaltyFilterSchema = z.object({
  search: z.string().optional(),
  employeeSystemId: z.string().optional(),
  status: penaltyStatusSchema.optional(),
  category: penaltyCategorySchema.optional(),
  penaltyTypeSystemId: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
});

export type CreatePenaltyInput = z.infer<typeof createPenaltySchema>;
export type UpdatePenaltyInput = z.infer<typeof updatePenaltySchema>;
export type PenaltyFilter = z.infer<typeof penaltyFilterSchema>;

// =============================================
// PENALTY STATUS UPDATE SCHEMA
// =============================================

export const updatePenaltyStatusSchema = z.object({
  status: penaltyStatusSchema,
  deductedInPayrollId: z.string().optional(),
  deductedAt: z.string().optional(),
});

export type UpdatePenaltyStatusInput = z.infer<typeof updatePenaltyStatusSchema>;

// =============================================
// BULK PENALTY SCHEMAS
// =============================================

export const bulkUpdatePenaltyStatusSchema = z.object({
  penaltySystemIds: z.array(z.string()).min(1, 'Phải chọn ít nhất một phiếu phạt'),
  status: penaltyStatusSchema,
});

export type BulkUpdatePenaltyStatusInput = z.infer<typeof bulkUpdatePenaltyStatusSchema>;
