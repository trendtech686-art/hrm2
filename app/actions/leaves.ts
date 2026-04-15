'use server'

/**
 * Server Actions for Leave Management (Nghỉ phép)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { requireActionPermission, serializeDecimals } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createLeaveSchema, updateLeaveSchema } from '@/features/leaves/validation'
import { logError } from '@/lib/logger'

// Vietnamese name → Prisma LeaveType enum mapping
const LEAVE_TYPE_NAME_MAP: Record<string, string> = {
  'Nghỉ phép năm': 'ANNUAL',
  'Phép năm': 'ANNUAL',
  'Nghỉ ốm': 'SICK',
  'Nghỉ thai sản': 'MATERNITY',
  'Nghỉ việc riêng': 'PATERNITY',
  'Nghỉ không lương': 'UNPAID',
  'Nghỉ lễ': 'OTHER',
  'Khác': 'OTHER',
}

function resolveLeaveTypeEnum(value: string): string {
  // Already a valid enum value
  const validEnums = ['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'UNPAID', 'OTHER']
  if (validEnums.includes(value)) return value
  // Map from Vietnamese name
  return LEAVE_TYPE_NAME_MAP[value] || 'OTHER'
}

// Vietnamese status → Prisma LeaveStatus enum mapping
const LEAVE_STATUS_MAP: Record<string, string> = {
  'Chờ duyệt': 'PENDING',
  'Đã duyệt': 'APPROVED',
  'Đã từ chối': 'REJECTED',
  'Từ chối': 'REJECTED',
  'Đã hủy': 'CANCELLED',
}

function resolveLeaveStatusEnum(value: string): string {
  const validEnums = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']
  if (validEnums.includes(value)) return value
  return LEAVE_STATUS_MAP[value] || value
}

// Types
type Leave = NonNullable<Awaited<ReturnType<typeof prisma.leave.findFirst>>>

export type CreateLeaveInput = {
  employeeId: string
  employeeSystemId?: string
  employeeBusinessId?: string
  employeeName?: string
  leaveType: string
  leaveTypeSystemId?: string
  leaveTypeId?: string
  leaveTypeName?: string
  leaveTypeIsPaid?: boolean
  leaveTypeRequiresAttachment?: boolean
  startDate: string | Date
  endDate: string | Date
  totalDays?: number
  numberOfDays?: number
  reason?: string
  createdBy?: string
}

export type UpdateLeaveInput = {
  systemId: string
  leaveType?: string
  leaveTypeSystemId?: string
  leaveTypeId?: string
  leaveTypeName?: string
  startDate?: string | Date
  endDate?: string | Date
  totalDays?: number
  numberOfDays?: number
  reason?: string
  status?: string
  rejectionReason?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createLeaveAction(
  input: CreateLeaveInput
): Promise<ActionResult<Leave>> {
  const authResult = await requireActionPermission('create_leaves')
  if (!authResult.success) return authResult
  const validated = createLeaveSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const systemId = await generateIdWithPrefix('NP', prisma)

    // Calculate total days if not provided
    const startDate = new Date(input.startDate)
    const endDate = new Date(input.endDate)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    const leave = await prisma.leave.create({
      data: {
        systemId,
        id: systemId,
        employeeId: input.employeeId,
        employeeSystemId: input.employeeSystemId,
        employeeBusinessId: input.employeeBusinessId,
        employeeName: input.employeeName,
        leaveType: resolveLeaveTypeEnum(input.leaveType) as 'ANNUAL' | 'SICK' | 'UNPAID' | 'MATERNITY' | 'PATERNITY' | 'OTHER',
        leaveTypeSystemId: input.leaveTypeSystemId,
        leaveTypeId: input.leaveTypeId,
        leaveTypeName: input.leaveTypeName,
        leaveTypeIsPaid: input.leaveTypeIsPaid ?? true,
        leaveTypeRequiresAttachment: input.leaveTypeRequiresAttachment ?? false,
        startDate,
        endDate,
        totalDays: input.totalDays ?? diffDays,
        numberOfDays: input.numberOfDays ?? diffDays,
        reason: input.reason,
        status: 'PENDING',
        requestDate: new Date(),
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/leaves')
    return { success: true, data: serializeDecimals(leave) }
  } catch (error) {
    logError('Error creating leave', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo đơn nghỉ phép',
    }
  }
}

export async function updateLeaveAction(
  input: UpdateLeaveInput
): Promise<ActionResult<Leave>> {
  const authResult = await requireActionPermission('create_leaves')
  if (!authResult.success) return authResult
  const validated = updateLeaveSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const { systemId, ...data } = input

    const existing = await prisma.leave.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy đơn nghỉ phép' }
    }

    // Only allow updates for PENDING leaves
    if (existing.status !== 'PENDING' && !data.status) {
      return {
        success: false,
        error: 'Chỉ có thể chỉnh sửa đơn nghỉ phép đang chờ duyệt',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.leaveType !== undefined) updateData.leaveType = resolveLeaveTypeEnum(data.leaveType)
    if (data.leaveTypeSystemId !== undefined) updateData.leaveTypeSystemId = data.leaveTypeSystemId
    if (data.leaveTypeId !== undefined) updateData.leaveTypeId = data.leaveTypeId
    if (data.leaveTypeName !== undefined) updateData.leaveTypeName = data.leaveTypeName
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate)
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate)
    if (data.totalDays !== undefined) updateData.totalDays = data.totalDays
    if (data.numberOfDays !== undefined) updateData.numberOfDays = data.numberOfDays
    if (data.reason !== undefined) updateData.reason = data.reason
    if (data.status !== undefined) updateData.status = resolveLeaveStatusEnum(data.status)
    if (data.rejectionReason !== undefined) updateData.rejectionReason = data.rejectionReason
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const leave = await prisma.leave.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/leaves')
    revalidatePath(`/leaves/${systemId}`)
    return { success: true, data: serializeDecimals(leave) }
  } catch (error) {
    logError('Error updating leave', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật đơn nghỉ phép',
    }
  }
}

export async function deleteLeaveAction(
  systemId: string
): Promise<ActionResult<Leave>> {
  const authResult = await requireActionPermission('create_leaves')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.leave.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy đơn nghỉ phép' }
    }

    if (existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Chỉ có thể xóa đơn nghỉ phép đang chờ duyệt',
      }
    }

    const leave = await prisma.leave.delete({
      where: { systemId },
    })

    revalidatePath('/leaves')
    return { success: true, data: serializeDecimals(leave) }
  } catch (error) {
    logError('Error deleting leave', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa đơn nghỉ phép',
    }
  }
}

export async function getLeaveAction(
  systemId: string
): Promise<ActionResult<Leave>> {
  const authResult = await requireActionPermission('view_leaves')
  if (!authResult.success) return authResult
  try {
    const leave = await prisma.leave.findUnique({
      where: { systemId },
      include: { employee: true },
    })

    if (!leave) {
      return { success: false, error: 'Không tìm thấy đơn nghỉ phép' }
    }

    return { success: true, data: serializeDecimals(leave) }
  } catch (error) {
    logError('Error getting leave', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không tìm thấy đơn nghỉ phép',
    }
  }
}

export async function approveLeaveAction(
  systemId: string,
  approvedBy: string
): Promise<ActionResult<Leave>> {
  const authResult = await requireActionPermission('approve_leaves')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.leave.findUnique({
      where: { systemId },
      include: { employee: true },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy đơn nghỉ phép' }
    }

    if (existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Chỉ có thể duyệt đơn nghỉ phép đang chờ duyệt',
      }
    }

    // Deduct from employee annual leave balance if it's annual leave
    if (existing.leaveType === 'ANNUAL' && existing.employee) {
      const currentBalance = existing.employee.annualLeaveBalance ?? 0
      const daysToDeduct = Number(existing.numberOfDays ?? existing.totalDays ?? 0)

      if (currentBalance < daysToDeduct) {
        return {
          success: false,
          error: `Không đủ ngày phép năm (còn ${currentBalance}, cần ${daysToDeduct})`,
        }
      }

      await prisma.employee.update({
        where: { systemId: existing.employeeId! },
        data: { annualLeaveBalance: currentBalance - daysToDeduct },
      })
    }

    const leave = await prisma.leave.update({
      where: { systemId },
      data: {
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date(),
      },
    })

    revalidatePath('/leaves')
    revalidatePath(`/leaves/${systemId}`)
    return { success: true, data: serializeDecimals(leave) }
  } catch (error) {
    logError('Error approving leave', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể duyệt đơn nghỉ phép',
    }
  }
}

export async function rejectLeaveAction(
  systemId: string,
  rejectedBy: string,
  reason?: string
): Promise<ActionResult<Leave>> {
  const authResult = await requireActionPermission('approve_leaves')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.leave.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy đơn nghỉ phép' }
    }

    if (existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Chỉ có thể từ chối đơn nghỉ phép đang chờ duyệt',
      }
    }

    const leave = await prisma.leave.update({
      where: { systemId },
      data: {
        status: 'REJECTED',
        rejectedBy,
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    })

    revalidatePath('/leaves')
    revalidatePath(`/leaves/${systemId}`)
    return { success: true, data: serializeDecimals(leave) }
  } catch (error) {
    logError('Error rejecting leave', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể từ chối đơn nghỉ phép',
    }
  }
}

export async function cancelLeaveAction(
  systemId: string
): Promise<ActionResult<Leave>> {
  const authResult = await requireActionPermission('create_leaves')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.leave.findUnique({
      where: { systemId },
      include: { employee: true },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy đơn nghỉ phép' }
    }

    // If was approved, restore the leave balance
    if (existing.status === 'APPROVED' && existing.leaveType === 'ANNUAL' && existing.employee) {
      const currentBalance = existing.employee.annualLeaveBalance ?? 0
      const daysToRestore = Number(existing.numberOfDays ?? existing.totalDays ?? 0)

      await prisma.employee.update({
        where: { systemId: existing.employeeId! },
        data: { annualLeaveBalance: currentBalance + daysToRestore },
      })
    }

    const leave = await prisma.leave.update({
      where: { systemId },
      data: { status: 'CANCELLED' },
    })

    revalidatePath('/leaves')
    revalidatePath(`/leaves/${systemId}`)
    return { success: true, data: serializeDecimals(leave) }
  } catch (error) {
    logError('Error cancelling leave', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy đơn nghỉ phép',
    }
  }
}
