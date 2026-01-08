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

// Create leave schema
export const createLeaveSchema = z.object({
  employeeSystemId: systemIdSchema,
  employeeName: z.string().optional(),
  department: z.string().optional(),
  leaveType: leaveTypeSchema,
  startDate: z.string().min(1, 'Ngày bắt đầu không được để trống'),
  endDate: z.string().min(1, 'Ngày kết thúc không được để trống'),
  totalDays: z.number().min(0.5, 'Số ngày nghỉ tối thiểu 0.5'),
  reason: z.string().min(1, 'Lý do nghỉ không được để trống'),
  attachments: z.array(z.string()).optional(),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
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
