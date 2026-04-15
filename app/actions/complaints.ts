'use server'

/**
 * Server Actions for Complaints Management (Khiếu nại)
 * 
 * SIMPLIFIED VERSION - Basic CRUD operations
 */

import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { generateSubEntityId } from '@/lib/id-utils'
import { requireActionPermission } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createComplaintSchema, updateComplaintSchema } from '@/features/complaints/validation'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getSessionUserName } from '@/lib/get-user-name'
import { notifyComplaintAssigned, notifyComplaintStatusChanged, notifyComplaintCreated } from '@/lib/complaint-notifications'

// Complaint type from Prisma (auto-inferred)
type Complaint = Awaited<ReturnType<typeof prisma.complaint.findFirst>>

// ====================================
// TYPES
// ====================================

// Image type for complaint
export type ComplaintImageInput = {
  id: string
  url: string
  uploadedBy?: string
  uploadedAt?: Date | string
  type?: 'initial' | 'evidence'
}

// Employee image type
export type EmployeeImageInput = {
  id: string
  url: string
  uploadedBy?: string
  uploadedAt?: Date | string
}

export type CreateComplaintInput = {
  orderId?: string
  orderSystemId?: string
  customerId?: string
  customerSystemId?: string
  customerName?: string
  customerPhone?: string
  type: string
  priority?: string
  description?: string
  subject?: string
  title?: string
  branchId?: string
  branchSystemId?: string
  branchName?: string
  assigneeId?: string
  assigneeSystemId?: string
  assigneeName?: string
  dueDate?: string | Date
  createdBy?: string
  // ⭐ NEW: Image fields
  images?: ComplaintImageInput[]
  employeeImages?: EmployeeImageInput[]
  affectedProducts?: unknown[]
  orderCode?: string
  orderValue?: number
  assignedTo?: string
  assignedAt?: Date | string
}

export type UpdateComplaintInput = {
  systemId: string
  type?: string
  priority?: string
  description?: string
  subject?: string
  title?: string
  status?: string
  assigneeId?: string
  assigneeSystemId?: string
  assigneeName?: string
  dueDate?: string | Date | null
  resolution?: string
  resolvedAt?: string | Date | null
  endedAt?: string | Date | null
  updatedBy?: string
  // ⭐ NEW: Image fields
  images?: ComplaintImageInput[]
  employeeImages?: EmployeeImageInput[]
  affectedProducts?: unknown[]
  orderCode?: string
  orderValue?: number
  // ⭐ NEW: Verification fields
  verification?: string | null
  isVerifiedCorrect?: boolean | null
  timeline?: unknown[]
}

// ====================================
// ACTIONS
// ====================================

/**
 * Map legacy status values to Prisma ComplaintStatus enum
 * Frontend uses: pending, investigating, resolved, cancelled, ended
 * Prisma uses: OPEN, IN_PROGRESS, RESOLVED, CLOSED
 */
function mapStatusToPrisma(status: string | undefined): 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | undefined {
  if (!status) return undefined;
  
  const statusMap: Record<string, 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'> = {
    // Legacy lowercase
    'pending': 'OPEN',
    'open': 'OPEN',
    'investigating': 'IN_PROGRESS',
    'in_progress': 'IN_PROGRESS',
    'resolved': 'RESOLVED',
    'cancelled': 'CLOSED',
    'ended': 'CLOSED',
    'closed': 'CLOSED',
    // Prisma uppercase (pass through)
    'OPEN': 'OPEN',
    'IN_PROGRESS': 'IN_PROGRESS',
    'RESOLVED': 'RESOLVED',
    'CLOSED': 'CLOSED',
  };
  
  return statusMap[status] || 'OPEN';
}

/**
 * Helper to serialize Prisma complaint for client (convert Decimal to Number)
 */
function mapStatusFromPrisma(status: string, complaint: { cancelledAt?: Date | null; endedAt?: Date | null }): string {
  switch (status) {
    case 'OPEN': return 'pending';
    case 'IN_PROGRESS': return 'investigating';
    case 'RESOLVED': return 'resolved';
    case 'CLOSED':
      if (complaint.cancelledAt) return 'cancelled';
      if (complaint.endedAt) return 'ended';
      return 'cancelled'; // default fallback for CLOSED
    default: return status; // pass through unknown values
  }
}

function serializeComplaint(complaint: NonNullable<Complaint>) {
  return {
    ...complaint,
    status: mapStatusFromPrisma(complaint.status as string, complaint),
    orderValue: complaint.orderValue ? Number(complaint.orderValue) : null,
    assignedTo: complaint.assigneeId, // Map for frontend compatibility
    // ⭐ Map DB orderId to frontend orderSystemId for consistency
    orderSystemId: complaint.orderId,
    timeline: complaint.timeline || [],
    subtasks: complaint.subtasks ?? undefined,
  } as unknown as Complaint;
}

/**
 * Create a new complaint
 */
export async function createComplaintAction(
  input: CreateComplaintInput
): Promise<ActionResult<Complaint>> {
  const authResult = await requireActionPermission('create_complaints')
  if (!authResult.success) return authResult

  const validated = createComplaintSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const systemId = await generateIdWithPrefix('KN', tx)
      
      // Generate tracking code  
      const trackingCode = generateSubEntityId('TK')

      // ⭐ Extract image URLs for database storage
      const imageUrls = (input.images || [])
        .filter(img => img && img.url)
        .map(img => img.url)

      const complaint = await tx.complaint.create({
        data: {
          systemId,
          id: systemId,
          orderId: input.orderId || input.orderSystemId || null,
          customerId: input.customerId || input.customerSystemId || null,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          type: input.type,
          priority: (input.priority || 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
          description: input.description,
          title: input.subject || input.title || 'Khiếu nại',
          branchId: input.branchId,
          branchSystemId: input.branchSystemId,
          branchName: input.branchName,
          assigneeId: input.assigneeId || input.assignedTo || undefined,
          assigneeName: input.assigneeName || undefined,
          assignedAt: input.assignedAt ? new Date(input.assignedAt as string) : undefined,
          status: 'OPEN',
          publicTrackingCode: trackingCode,
          createdBy: input.createdBy,
          // ⭐ NEW: Save images
          images: imageUrls,
          employeeImages: input.employeeImages && input.employeeImages.length > 0 
            ? input.employeeImages 
            : undefined,
          orderCode: input.orderCode,
          orderValue: input.orderValue ? input.orderValue : undefined,
          affectedProducts: input.affectedProducts && input.affectedProducts.length > 0
            ? (input.affectedProducts as Prisma.InputJsonValue)
            : undefined,
        },
      })

      return complaint
    })

    revalidatePath('/complaints')

    // Activity log — Việt hóa type
    const createTypeLabels: Record<string, string> = {
      'wrong-product': 'Sai hàng', 'missing-items': 'Thiếu hàng',
      'wrong-packaging': 'Đóng gói sai', 'warehouse-defect': 'Lỗi kho',
      'product-condition': 'Tình trạng SP',
    }
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'complaint',
        entityId: result.systemId,
        action: `Tạo khiếu nại: ${result.id || result.systemId}`,
        actionType: 'create',
        note: `Loại: ${createTypeLabels[input.type] || input.type} | Khách: ${input.customerName || 'N/A'}`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] complaint create failed', e))

    // ✅ Email notification for assigned complaint
    if (result.assigneeId) {
      notifyComplaintCreated({
        systemId: result.systemId,
        title: result.title || result.systemId,
        id: result.id || result.systemId,
        assigneeId: result.assigneeId,
        creatorName: getSessionUserName(authResult.session),
      }).catch(e => logError('[Complaints createAction] email failed', e))
    }

    return { success: true, data: serializeComplaint(result) }
  } catch (error) {
    logError('Error creating complaint', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo khiếu nại',
    }
  }
}

/**
 * Update a complaint
 */
export async function updateComplaintAction(
  input: UpdateComplaintInput
): Promise<ActionResult<Complaint>> {
  const authResult = await requireActionPermission('edit_complaints')
  if (!authResult.success) return authResult

  const validated = updateComplaintSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.complaint.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy khiếu nại' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.type !== undefined) updateData.type = data.type
    if (data.priority !== undefined) updateData.priority = data.priority
    if (data.description !== undefined) updateData.description = data.description
    if (data.subject !== undefined) updateData.title = data.subject
    if (data.status !== undefined) updateData.status = mapStatusToPrisma(data.status)
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId
    if (data.assigneeName !== undefined) updateData.assigneeName = data.assigneeName
    if (data.resolution !== undefined) updateData.resolution = data.resolution
    if (data.resolvedAt !== undefined) {
      updateData.resolvedAt = data.resolvedAt ? new Date(data.resolvedAt) : null
    }
    if (data.endedAt !== undefined) {
      updateData.endedAt = data.endedAt ? new Date(data.endedAt) : null
    }
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy
    
    // ⭐ NEW: Handle images
    if (data.images !== undefined) {
      updateData.images = (data.images || [])
        .filter(img => img && img.url)
        .map(img => img.url)
    }
    if (data.employeeImages !== undefined) {
      updateData.employeeImages = data.employeeImages && data.employeeImages.length > 0 
        ? data.employeeImages 
        : null
    }
    if (data.affectedProducts !== undefined) {
      updateData.affectedProducts = data.affectedProducts && data.affectedProducts.length > 0
        ? data.affectedProducts
        : null
    }
    if (data.orderCode !== undefined) updateData.orderCode = data.orderCode
    if (data.orderValue !== undefined) updateData.orderValue = data.orderValue
    
    // ⭐ NEW: Handle verification fields
    if (data.verification !== undefined) updateData.verification = data.verification
    if (data.isVerifiedCorrect !== undefined) updateData.isVerifiedCorrect = data.isVerifiedCorrect
    if (data.timeline !== undefined) updateData.timeline = data.timeline

    const complaint = await prisma.complaint.update({
      where: { systemId },
      data: updateData,
    })

    // ✅ Notify assignee on status/assignment change
    const newAssignee = updateData.assigneeId as string | undefined
    if (newAssignee && newAssignee !== existing.assigneeId && newAssignee !== authResult.session.user?.employeeId) {
      createNotification({
        type: 'complaint',
        title: 'Giao khiếu nại',
        message: `Bạn được giao xử lý khiếu nại ${existing.id || systemId}`,
        link: `/complaint-tracking/${systemId}`,
        recipientId: newAssignee,
        senderId: authResult.session.user?.employeeId,
        senderName: authResult.session.user?.name,
        settingsKey: 'complaint:assigned',
      }).catch(e => logError('[Complaints updateAction] assignee notification failed', e))

      // ✅ Email notification for assignment
      notifyComplaintAssigned({
        systemId,
        title: existing.title || systemId,
        id: existing.id || systemId,
        assigneeId: newAssignee,
        assignerName: authResult.session.user?.name || null,
      }).catch(e => logError('[Complaints updateAction] assignee email failed', e))
    } else if (updateData.status && updateData.status !== existing.status && existing.assigneeId && existing.assigneeId !== authResult.session.user?.employeeId) {
      createNotification({
        type: 'complaint',
        title: 'Cập nhật khiếu nại',
        message: `Khiếu nại ${existing.id || systemId} đã chuyển trạng thái`,
        link: `/complaint-tracking/${systemId}`,
        recipientId: existing.assigneeId,
        senderId: authResult.session.user?.employeeId,
        senderName: authResult.session.user?.name,
        settingsKey: 'complaint:status',
      }).catch(e => logError('[Complaints updateAction] status notification failed', e))

      // ✅ Email notification for status change
      notifyComplaintStatusChanged({
        systemId,
        title: existing.title || systemId,
        id: existing.id || systemId,
        assigneeId: existing.assigneeId,
        creatorId: existing.createdBy || null,
        status: updateData.status as string,
        oldStatus: existing.status,
      }).catch(e => logError('[Complaints updateAction] status email failed', e))
    }

    revalidatePath('/complaints')
    revalidatePath(`/complaints/${systemId}`)

    // Activity log — ghi chi tiết các trường thay đổi
    const changedFields: string[] = []
    // Việt hóa type mapping
    const typeLabelsMap: Record<string, string> = {
      'wrong-product': 'Sai hàng', 'missing-items': 'Thiếu hàng',
      'wrong-packaging': 'Đóng gói sai', 'warehouse-defect': 'Lỗi kho',
      'product-condition': 'Tình trạng SP',
    }
    const priorityLabelsMap: Record<string, string> = {
      LOW: 'Thấp', MEDIUM: 'Trung bình', HIGH: 'Cao', CRITICAL: 'Khẩn cấp',
    }
    const statusLabelsMap: Record<string, string> = {
      pending: 'Chờ xử lý', investigating: 'Đang kiểm tra', resolved: 'Đã giải quyết',
      cancelled: 'Đã hủy', ended: 'Kết thúc',
      OPEN: 'Chờ xử lý', IN_PROGRESS: 'Đang kiểm tra', RESOLVED: 'Đã giải quyết', CLOSED: 'Kết thúc',
    }
    if (data.type !== undefined && data.type !== existing.type) {
      changedFields.push(`loại: ${typeLabelsMap[data.type] || data.type}`)
    }
    if (data.status !== undefined) {
      changedFields.push(`trạng thái → ${statusLabelsMap[data.status] || data.status}`)
    }
    if (data.priority !== undefined && data.priority !== existing.priority) {
      changedFields.push(`ưu tiên → ${priorityLabelsMap[data.priority] || data.priority}`)
    }
    if (data.assigneeId !== undefined && data.assigneeId !== existing.assigneeId) {
      changedFields.push(`người xử lý → ${data.assigneeName || data.assigneeId || 'Chưa giao'}`)
    }
    if (data.resolution !== undefined) changedFields.push(`kết quả xử lý`)
    if (data.subject !== undefined || data.title !== undefined) changedFields.push('tiêu đề')
    if (data.description !== undefined) changedFields.push('mô tả')
    if (data.images !== undefined) changedFields.push('hình ảnh khách hàng')
    if (data.employeeImages !== undefined) changedFields.push('hình ảnh nhân viên')
    if (data.affectedProducts !== undefined) changedFields.push('sản phẩm bị ảnh hưởng')
    if (data.verification !== undefined && data.verification !== null) {
      const verifyLabels: Record<string, string> = {
        'verified-correct': 'Lỗi thật', 'verified-incorrect': 'Không lỗi', 'pending-verification': 'Chờ xác minh',
      }
      changedFields.push(`xác minh → ${verifyLabels[data.verification] || data.verification}`)
    }
    if (data.timeline !== undefined) changedFields.push('quy trình xử lý')
    if (data.orderCode !== undefined) changedFields.push('mã đơn hàng')
    if (data.orderValue !== undefined) changedFields.push('giá trị đơn hàng')
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'complaint',
        entityId: systemId,
        action: `Cập nhật khiếu nại: ${existing.id || systemId}`,
        actionType: 'update',
        note: changedFields.length > 0 ? changedFields.join(', ') : 'Cập nhật thông tin',
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] complaint update failed', e))

    return { success: true, data: serializeComplaint(complaint) }
  } catch (error) {
    logError('Error updating complaint', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật khiếu nại',
    }
  }
}

/**
 * Delete a complaint
 */
export async function deleteComplaintAction(
  systemId: string
): Promise<ActionResult<Complaint>> {
  const authResult = await requireActionPermission('edit_complaints')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.complaint.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy khiếu nại' }
    }

    const complaint = await prisma.complaint.delete({
      where: { systemId },
    })

    revalidatePath('/complaints')

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'complaint',
        entityId: systemId,
        action: `Xóa khiếu nại: ${existing.id || systemId}`,
        actionType: 'delete',
        note: `Loại: ${existing.type} | Khách: ${existing.customerName || 'N/A'}`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] complaint delete failed', e))

    return { success: true, data: serializeComplaint(complaint) }
  } catch (error) {
    logError('Error deleting complaint', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa khiếu nại',
    }
  }
}

/**
 * Resolve a complaint
 */
export async function resolveComplaintAction(
  systemId: string,
  resolution: string,
  resolvedBy?: string
): Promise<ActionResult<Complaint>> {
  const authResult = await requireActionPermission('resolve_complaints')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.complaint.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy khiếu nại' }
    }

    const complaint = await prisma.complaint.update({
      where: { systemId },
      data: {
        status: 'RESOLVED',
        resolution,
        resolvedAt: new Date(),
        resolvedBy,
      },
    })

    revalidatePath('/complaints')
    revalidatePath(`/complaints/${systemId}`)

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'complaint',
        entityId: systemId,
        action: `Giải quyết khiếu nại: ${existing.id || systemId}`,
        actionType: 'update',
        note: `Kết quả: ${resolution.substring(0, 100)}`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] complaint resolve failed', e))

    // ✅ Email notification for resolution
    notifyComplaintStatusChanged({
      systemId,
      title: existing.title || systemId,
      id: existing.id || systemId,
      assigneeId: existing.assigneeId || null,
      creatorId: existing.createdBy || null,
      status: 'RESOLVED',
      oldStatus: existing.status,
    }).catch(e => logError('[Complaints resolveAction] email failed', e))

    return { success: true, data: serializeComplaint(complaint) }
  } catch (error) {
    logError('Error resolving complaint', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể giải quyết khiếu nại',
    }
  }
}

/**
 * Close a complaint
 */
export async function closeComplaintAction(
  systemId: string,
  closedBy?: string
): Promise<ActionResult<Complaint>> {
  const authResult = await requireActionPermission('edit_complaints')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.complaint.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy khiếu nại' }
    }

    const complaint = await prisma.complaint.update({
      where: { systemId },
      data: {
        status: 'CLOSED',
        endedAt: new Date(),
        endedBy: closedBy,
      },
    })

    // ✅ Notify assignee that complaint was closed
    if (existing.assigneeId && existing.assigneeId !== authResult.session.user?.employeeId) {
      createNotification({
        type: 'complaint',
        title: 'Đóng khiếu nại',
        message: `Khiếu nại ${existing.id || systemId} đã được đóng`,
        link: `/complaint-tracking/${systemId}`,
        recipientId: existing.assigneeId,
        senderId: authResult.session.user?.employeeId,
        senderName: authResult.session.user?.name,
        settingsKey: 'complaint:status',
      }).catch(e => logError('[Complaints closeAction] notification failed', e))

      // ✅ Email notification
      notifyComplaintStatusChanged({
        systemId,
        title: existing.title || systemId,
        id: existing.id || systemId,
        assigneeId: existing.assigneeId,
        creatorId: existing.createdBy || null,
        status: 'CLOSED',
        oldStatus: existing.status,
      }).catch(e => logError('[Complaints closeAction] email failed', e))
    }

    revalidatePath('/complaints')
    revalidatePath(`/complaints/${systemId}`)

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'complaint',
        entityId: systemId,
        action: `Đóng khiếu nại: ${existing.id || systemId}`,
        actionType: 'update',
        note: `Đóng bởi ${closedBy || userName}`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] complaint close failed', e))

    return { success: true, data: serializeComplaint(complaint) }
  } catch (error) {
    logError('Error closing complaint', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể đóng khiếu nại',
    }
  }
}
