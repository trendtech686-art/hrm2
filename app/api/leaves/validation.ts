/**
 * API Validation Schemas for Leaves
 */
import { z } from 'zod'

// Query params for listing
export const listLeavesSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  employeeId: z.string().optional(),
  status: z.string().optional(),
  includeDeleted: z.string().optional().transform(v => v === 'true'),
})

// Status mapping from Vietnamese to enum
const statusMap: Record<string, string> = {
  'Chờ duyệt': 'PENDING',
  'Đã duyệt': 'APPROVED',
  'Đã từ chối': 'REJECTED',
  'Từ chối': 'REJECTED',
  'Đã hủy': 'CANCELLED',
};

// Create leave schema
export const createLeaveSchema = z.object({
  systemId: z.string().optional(),
  id: z.string().optional(),
  employeeId: z.string().min(1, 'Employee ID là bắt buộc'),
  leaveType: z.string().optional().default('ANNUAL'),
  leaveTypeName: z.string().optional(),
  leaveTypeSystemId: z.string().optional(),
  leaveTypeId: z.string().optional(),
  leaveTypeIsPaid: z.boolean().optional().default(true),
  leaveTypeRequiresAttachment: z.boolean().optional().default(false),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  totalDays: z.number().optional().default(1),
  numberOfDays: z.number().optional().default(1),
  reason: z.string().optional(),
  status: z.string().optional().default('PENDING').transform(s => statusMap[s] || s),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
  rejectedBy: z.string().optional(),
  rejectedAt: z.string().optional(),
  rejectionReason: z.string().optional(),
})

// Update leave schema
export const updateLeaveSchema = createLeaveSchema.partial()

export type ListLeavesInput = z.infer<typeof listLeavesSchema>
export type CreateLeaveInput = z.infer<typeof createLeaveSchema>
export type UpdateLeaveInput = z.infer<typeof updateLeaveSchema>
