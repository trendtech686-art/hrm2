/**
 * Zod validation schemas for leaves module
 */
import { z } from 'zod';
import { systemIdSchema } from '@/lib/id-types';

// Status enum
export const leaveStatusSchema = z.enum([
  'Chờ duyệt',
  'Đã duyệt',
  'Từ chối',
  'Đã hủy'
]);

// Leave type enum
export const leaveTypeSchema = z.enum([
  'Nghỉ phép năm',
  'Nghỉ ốm',
  'Nghỉ thai sản',
  'Nghỉ việc riêng',
  'Nghỉ không lương',
  'Nghỉ lễ',
  'Khác'
]);

// Create leave schema (server action validation - accepts various input formats)
export const createLeaveSchema = z.object({
  employeeSystemId: z.string().min(1, 'Mã nhân viên không được để trống'),
  employeeId: z.string().optional(),
  employeeName: z.string().optional(),
  department: z.string().optional(),
  leaveType: z.string().min(1, 'Loại phép không được để trống'),
  leaveTypeName: z.string().optional(),
  leaveTypeSystemId: z.string().optional(),
  leaveTypeId: z.string().optional(),
  leaveTypeIsPaid: z.boolean().optional(),
  leaveTypeRequiresAttachment: z.boolean().optional(),
  startDate: z.union([z.string().min(1, 'Ngày bắt đầu không được để trống'), z.date()]),
  endDate: z.union([z.string().min(1, 'Ngày kết thúc không được để trống'), z.date()]),
  totalDays: z.number().min(0.5, 'Số ngày nghỉ tối thiểu 0.5').optional(),
  numberOfDays: z.number().optional(),
  reason: z.string().min(1, 'Lý do nghỉ không được để trống'),
  status: z.string().optional(),
  attachments: z.array(z.string()).optional(),
}).refine(data => {
  const start = typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate;
  const end = typeof data.endDate === 'string' ? new Date(data.endDate) : data.endDate;
  return end >= start;
}, {
  message: 'Ngày kết thúc phải >= ngày bắt đầu',
  path: ['endDate'],
});

// Update leave schema
export const updateLeaveSchema = createLeaveSchema.partial().extend({
  status: leaveStatusSchema.optional(),
});

// Approve/Reject schema
export const approveLeaveSchema = z.object({
  approverSystemId: systemIdSchema,
  approverName: z.string().optional(),
  notes: z.string().optional(),
});

export const rejectLeaveSchema = approveLeaveSchema.extend({
  rejectionReason: z.string().min(1, 'Lý do từ chối không được để trống'),
});

// Filter schema
export const leaveFiltersSchema = z.object({
  employeeSystemId: z.string().optional(),
  department: z.string().optional(),
  leaveType: leaveTypeSchema.optional(),
  status: leaveStatusSchema.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type LeaveStatus = z.infer<typeof leaveStatusSchema>;
export type LeaveType = z.infer<typeof leaveTypeSchema>;
export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type UpdateLeaveInput = z.infer<typeof updateLeaveSchema>;
export type ApproveLeaveInput = z.infer<typeof approveLeaveSchema>;
export type RejectLeaveInput = z.infer<typeof rejectLeaveSchema>;
export type LeaveFilters = z.infer<typeof leaveFiltersSchema>;
