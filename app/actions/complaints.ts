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
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getSessionUserName } from '@/lib/get-user-name'
import { notifyComplaintAssigned, notifyComplaintStatusChanged, notifyComplaintCreated } from '@/lib/complaint-notifications'

// Complaint type from Prisma (auto-inferred)
type Complaint = Awaited<ReturnType<typeof prisma.complaint.findFirst>>

// ====================================
// TYPES
// ====================================

// Image type for complaint (stored as JSON in DB)
export type ComplaintImageInput = {
  id?: string
  url: string
  uploadedBy?: string
  uploadedAt?: Date | string
  type?: 'initial' | 'evidence'
}

// Employee image type
export type EmployeeImageInput = {
  id?: string
  url: string
  uploadedBy?: string
  uploadedAt?: Date | string
}

// Affected product input
export type AffectedProductInput = {
  productSystemId: string
  productId?: string
  productName: string
  unitPrice?: number
  quantityOrdered?: number
  quantityReceived?: number
  quantityMissing?: number
  quantityDefective?: number
  quantityExcess?: number
  issueType?: 'excess' | 'missing' | 'defective' | 'other'
  note?: string
  resolutionType?: 'refund' | 'replacement' | 'ignore'
  lineItemIndex?: number
}

export type CreateComplaintInput = {
  id?: string
  orderId?: string
  orderSystemId?: string
  customerId?: string
  customerSystemId?: string
  customerName?: string
  customerPhone?: string
  type: string
  priority?: string
  description?: string
  title?: string
  branchId?: string
  branchSystemId?: string
  branchName?: string
  assigneeId?: string
  assigneeSystemId?: string
  assigneeName?: string
  assignedTo?: string
  assignedAt?: Date | string
  createdBy?: string
  // ⭐ NEW: Image fields
  images?: ComplaintImageInput[]
  employeeImages?: EmployeeImageInput[]
  affectedProducts?: AffectedProductInput[]
  orderCode?: string
  orderValue?: number
  // ⭐ NEW: Verification fields
  verification?: string
  isVerifiedCorrect?: boolean
  // ⭐ NEW: Timeline
  timeline?: unknown[]
}

export type UpdateComplaintInput = {
  systemId: string
  type?: string
  priority?: string
  description?: string
  title?: string
  status?: string
  assigneeId?: string
  assigneeSystemId?: string
  assigneeName?: string
  assignedTo?: string
  dueDate?: string | Date | null
  resolution?: string
  resolvedAt?: string | Date | null
  resolvedBy?: string
  endedAt?: string | Date | null
  endedBy?: string
  cancelledAt?: string | Date | null
  cancelledBy?: string
  updatedBy?: string
  // ⭐ NEW: Order & Customer fields
  orderSystemId?: string
  orderCode?: string
  orderValue?: number
  branchSystemId?: string
  branchName?: string
  customerSystemId?: string
  customerName?: string
  customerPhone?: string
  // ⭐ NEW: Image fields
  images?: ComplaintImageInput[]
  employeeImages?: EmployeeImageInput[]
  affectedProducts?: AffectedProductInput[]
  // ⭐ NEW: Verification fields
  verification?: string | null
  isVerifiedCorrect?: boolean | null
  // ⭐ NEW: Resolution & Compensation fields
  resolutionNote?: string
  compensationAmount?: number | null
  incurredCost?: number | null
  penaltyAmount?: number | null
  compensationReason?: string | null
  inventoryAdjustment?: unknown
  // ⭐ NEW: Timeline for history
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

  try {
    const result = await prisma.$transaction(async (tx) => {
      const systemId = await generateIdWithPrefix('KN', tx)
      
      // Generate tracking code  
      const trackingCode = generateSubEntityId('TK')

      // ⭐ Process images - store full image objects as JSON
      const processedImages = (input.images || [])
        .filter(img => img && img.url)
        .map(img => ({
          id: img.id || generateSubEntityId('IMG'),
          url: img.url,
          uploadedBy: img.uploadedBy || authResult.session.user?.employeeId,
          uploadedAt: img.uploadedAt ? new Date(img.uploadedAt) : new Date(),
          type: img.type || 'initial',
        }))

      // ⭐ Process employee images
      const processedEmployeeImages = (input.employeeImages || [])
        .filter(img => img && img.url)
        .map(img => ({
          id: img.id || generateSubEntityId('IMG'),
          url: img.url,
          uploadedBy: img.uploadedBy || authResult.session.user?.employeeId,
          uploadedAt: img.uploadedAt ? new Date(img.uploadedAt) : new Date(),
        }))

      // ⭐ Process affected products
      const processedAffectedProducts = (input.affectedProducts || [])
        .filter(p => p && p.productSystemId)

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
          title: input.title || `Khiếu nại đơn ${input.orderCode || input.orderSystemId || ''}`,
          branchId: input.branchId,
          branchSystemId: input.branchSystemId,
          branchName: input.branchName,
          assigneeId: input.assigneeId || input.assignedTo || undefined,
          assigneeName: input.assigneeName || undefined,
          assignedAt: input.assignedAt ? new Date(input.assignedAt as string) : undefined,
          status: 'OPEN',
          publicTrackingCode: trackingCode,
          createdBy: input.createdBy || authResult.session.user?.employeeId,
          // ⭐ NEW: Save images as JSON array (cast to Prisma JSON type)
          images: processedImages.length > 0 ? processedImages as unknown as Prisma.InputJsonValue : undefined,
          employeeImages: processedEmployeeImages.length > 0 ? processedEmployeeImages as unknown as Prisma.InputJsonValue : undefined,
          orderCode: input.orderCode,
          orderValue: input.orderValue ? input.orderValue : undefined,
          affectedProducts: processedAffectedProducts.length > 0 ? processedAffectedProducts as unknown as Prisma.InputJsonValue : undefined,
          verification: input.verification || 'pending-verification',
          isVerifiedCorrect: input.isVerifiedCorrect,
          timeline: (input.timeline || []) as unknown as Prisma.InputJsonValue,
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
    if (data.title !== undefined) updateData.title = data.title
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
    
    // ⭐ NEW: Handle order & customer fields
    if (data.orderSystemId !== undefined) updateData.orderId = data.orderSystemId
    if (data.orderCode !== undefined) updateData.orderCode = data.orderCode
    if (data.orderValue !== undefined) updateData.orderValue = data.orderValue
    if (data.branchSystemId !== undefined) updateData.branchSystemId = data.branchSystemId
    if (data.branchName !== undefined) updateData.branchName = data.branchName
    if (data.customerSystemId !== undefined) updateData.customerId = data.customerSystemId
    if (data.customerName !== undefined) updateData.customerName = data.customerName
    if (data.customerPhone !== undefined) updateData.customerPhone = data.customerPhone
    
    // ⭐ NEW: Handle images
    if (data.images !== undefined) {
      const processedImages = (data.images || [])
        .filter(img => img && img.url)
        .map(img => ({
          id: img.id || generateSubEntityId('IMG'),
          url: img.url,
          uploadedBy: img.uploadedBy || authResult.session.user?.employeeId,
          uploadedAt: img.uploadedAt ? new Date(img.uploadedAt) : new Date(),
          type: img.type || 'initial',
        }))
      updateData.images = processedImages.length > 0 ? processedImages : null
    }
    if (data.employeeImages !== undefined) {
      const processedEmployeeImages = (data.employeeImages || [])
        .filter(img => img && img.url)
        .map(img => ({
          id: img.id || generateSubEntityId('IMG'),
          url: img.url,
          uploadedBy: img.uploadedBy || authResult.session.user?.employeeId,
          uploadedAt: img.uploadedAt ? new Date(img.uploadedAt) : new Date(),
        }))
      updateData.employeeImages = processedEmployeeImages.length > 0 ? processedEmployeeImages : null
    }
    if (data.affectedProducts !== undefined) {
      const processedAffectedProducts = (data.affectedProducts || [])
        .filter(p => p && p.productSystemId)
      updateData.affectedProducts = processedAffectedProducts.length > 0 
        ? processedAffectedProducts as unknown as Prisma.InputJsonValue 
        : null
    }
    
    // ⭐ NEW: Handle verification fields
    if (data.verification !== undefined) updateData.verification = data.verification
    if (data.isVerifiedCorrect !== undefined) updateData.isVerifiedCorrect = data.isVerifiedCorrect
    // ⭐ NEW: Handle resolution & compensation fields
    if (data.resolutionNote !== undefined) updateData.resolutionNote = data.resolutionNote
    if (data.compensationAmount !== undefined) updateData.compensationAmount = data.compensationAmount
    if (data.incurredCost !== undefined) updateData.incurredCost = data.incurredCost
    if (data.penaltyAmount !== undefined) updateData.penaltyAmount = data.penaltyAmount
    if (data.compensationReason !== undefined) updateData.compensationReason = data.compensationReason
    if (data.inventoryAdjustment !== undefined) updateData.inventoryAdjustment = data.inventoryAdjustment
    // ⭐ NEW: Handle cancelled fields
    if (data.cancelledAt !== undefined) updateData.cancelledAt = data.cancelledAt ? new Date(data.cancelledAt as string) : null
    if (data.cancelledBy !== undefined) updateData.cancelledBy = data.cancelledBy
    // ⭐ NEW: Handle resolvedBy field
    if (data.resolvedBy !== undefined) updateData.resolvedBy = data.resolvedBy
    if (data.endedBy !== undefined) updateData.endedBy = data.endedBy
    // ⭐ NEW: Timeline for history
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
    if (data.title !== undefined) changedFields.push('tiêu đề')
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
