'use server'

/**
 * Server Actions for Warranty Management
 * 
 * These are server-side functions that can be called directly from Client Components.
 * They use Prisma transactions for atomic operations.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 */

import { prisma } from '@/lib/prisma'
import { requireActionPermission } from '@/lib/api-utils'
import { revalidatePath } from '@/lib/revalidation'
import { generateSubEntityId } from '@/lib/id-utils'
import type { WarrantyStatus } from '@/lib/types/prisma-extended'
import type { ActionResult } from '@/types/action-result'
import { createWarrantySchema, updateWarrantySchema } from '@/features/warranty/validation'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getSessionUserName } from '@/lib/get-user-name'
import { notifyWarrantyStatusChanged } from '@/lib/warranty-notifications'

// ====================================
// HELPERS
// ====================================

/** Serialize Prisma Decimal fields to plain numbers for Client Components */
function serializeWarranty<T extends Record<string, unknown>>(warranty: T): T {
  return {
    ...warranty,
    partsCost: warranty.partsCost != null ? Number(warranty.partsCost) : 0,
    laborCost: warranty.laborCost != null ? Number(warranty.laborCost) : 0,
    totalCost: warranty.totalCost != null ? Number(warranty.totalCost) : 0,
    shippingFee: warranty.shippingFee != null ? Number(warranty.shippingFee) : 0,
  }
}

// ====================================
// TYPES
// ====================================

export type CancelWarrantyInput = {
  systemId: string
  reason: string
  cancelVouchers?: boolean
}

export type UpdateStatusInput = {
  systemId: string
  newStatus: WarrantyStatus
  note?: string
}

export type CompleteWarrantyInput = {
  systemId: string
  note?: string
}

export type ReopenWarrantyInput = {
  systemId: string
  reason?: string
}

// ====================================
// CANCEL WARRANTY
// ====================================

/**
 * Cancel a warranty ticket with all related operations in a transaction
 * - Updates warranty status to CANCELLED
 * - Cancels related vouchers (payments/receipts)
 * - Creates history record
 */
export async function cancelWarrantyAction(
  input: CancelWarrantyInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_warranty')
  if (!authResult.success) return authResult
  const { session } = authResult

  const { systemId, reason, cancelVouchers = true } = input

  if (!reason.trim()) {
    return { success: false, error: 'Vui lòng nhập lý do hủy phiếu' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find warranty
      const warranty = await tx.warranty.findUnique({
        where: { systemId },
        include: {
          product: true,
        },
      })

      if (!warranty) {
        throw new Error('WARRANTY_NOT_FOUND')
      }

      // 2. Validate status
      if (warranty.status === 'CANCELLED') {
        throw new Error('ALREADY_CANCELLED')
      }

      const now = new Date()
      const userName = session.user?.name || session.user?.email || 'Unknown'

      // 3. Cancel related vouchers if requested
      let cancelledPayments = 0
      let cancelledReceipts = 0

      if (cancelVouchers) {
        // Cancel payments linked to this warranty
        const paymentsToCancel = await tx.payment.findMany({
          where: {
            linkedWarrantySystemId: systemId,
            status: { not: 'cancelled' },
          },
        })
        
        for (const payment of paymentsToCancel) {
          await tx.payment.update({
            where: { systemId: payment.systemId },
            data: {
              status: 'cancelled',
              cancelledAt: now,
              description: `[HỦY] ${reason}${payment.description ? ` | Gốc: ${payment.description}` : ''}`,
            },
          })
        }
        cancelledPayments = paymentsToCancel.length

        // Cancel receipts linked to this warranty
        const receiptsToCancel = await tx.receipt.findMany({
          where: {
            linkedWarrantySystemId: systemId,
            status: { not: 'cancelled' },
          },
        })
        
        for (const receipt of receiptsToCancel) {
          await tx.receipt.update({
            where: { systemId: receipt.systemId },
            data: {
              status: 'cancelled',
              cancelledAt: now,
              description: `[HỦY] ${reason}${receipt.description ? ` | Gốc: ${receipt.description}` : ''}`,
            },
          })
        }
        cancelledReceipts = receiptsToCancel.length
      }

      // 4. Create history entry
      const historyEntry = {
        systemId: generateSubEntityId('WH'),
        action: 'CANCEL',
        actionLabel: 'Đã hủy phiếu',
        entityType: 'status',
        performedBy: userName,
        performedAt: now.toISOString(),
        note: `Lý do: ${reason}${cancelledPayments || cancelledReceipts ? ` | Đã hủy ${cancelledPayments} phiếu chi, ${cancelledReceipts} phiếu thu` : ''}`,
      }

      // 5. Update warranty
      const existingHistory = warranty.history as unknown[] || []
      
      const updatedWarranty = await tx.warranty.update({
        where: { systemId },
        data: {
          status: 'CANCELLED',
          cancelledAt: now,
          cancelReason: reason,
          linkedOrderSystemId: null, // Unlink order
          history: [...existingHistory, historyEntry] as unknown as undefined,
          updatedAt: now,
          updatedBy: userName,
        },
      })

      return {
        warranty: serializeWarranty(updatedWarranty),
        cancelledPayments,
        cancelledReceipts,
      }
    })

    // Revalidate cache
    revalidatePath(`/warranty/${systemId}`)
    revalidatePath('/warranty')

    // Activity log
    const logUserName = getSessionUserName(authResult.session)
    const cancelTicketId = result.warranty?.id || systemId
    prisma.activityLog.create({
      data: {
        entityType: 'warranty',
        entityId: systemId,
        action: `Hủy phiếu bảo hành: ${cancelTicketId}`,
        actionType: 'update',
        note: `Lý do hủy: ${reason}${result.cancelledPayments || result.cancelledReceipts ? ` | Đã hủy ${result.cancelledPayments} phiếu chi, ${result.cancelledReceipts} phiếu thu` : ''}`,
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] warranty cancel failed', e))

    // ✅ Notify warranty assignee about cancellation
    if (result.warranty?.employeeSystemId && result.warranty.employeeSystemId !== session.user?.employeeId) {
      createNotification({
        type: 'warranty',
        title: 'Hủy phiếu bảo hành',
        message: `Phiếu bảo hành ${result.warranty.id || systemId} đã bị hủy. Lý do: ${reason}`,
        link: `/warranty/${systemId}`,
        recipientId: result.warranty.employeeSystemId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
        settingsKey: 'warranty:status',
      }).catch(e => logError('[Warranty cancelAction] notification failed', e))
    }

    // ✅ Email notification
    notifyWarrantyStatusChanged({
      systemId,
      title: result.warranty?.productName || systemId,
      id: result.warranty?.id || systemId,
      assigneeId: result.warranty?.employeeSystemId || null,
      creatorId: result.warranty?.createdBy || null,
      status: 'CANCELLED',
      oldStatus: 'RECEIVED',
    }).catch(e => logError('[Warranty cancelAction] email failed', e))

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    logError('cancelWarrantyAction error', error)

    if (error instanceof Error) {
      if (error.message === 'WARRANTY_NOT_FOUND') {
        return { success: false, error: 'Phiếu bảo hành không tồn tại' }
      }
      if (error.message === 'ALREADY_CANCELLED') {
        return { success: false, error: 'Phiếu bảo hành đã bị hủy' }
      }
    }

    return { success: false, error: 'Không thể hủy phiếu bảo hành' }
  }
}

// ====================================
// UPDATE WARRANTY STATUS
// ====================================

/**
 * Update warranty status with validation
 */
export async function updateWarrantyStatusAction(
  input: UpdateStatusInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_warranty')
  if (!authResult.success) return authResult
  const { session } = authResult

  const { systemId, newStatus, note } = input

  // Valid transitions map
  const validTransitions: Record<WarrantyStatus, WarrantyStatus[]> = {
    RECEIVED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['COMPLETED', 'CANCELLED'],
    COMPLETED: ['RETURNED', 'CANCELLED'],
    RETURNED: ['COMPLETED'], // Có thể mở lại về COMPLETED
    CANCELLED: ['RECEIVED'], // Can reopen
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const warranty = await tx.warranty.findUnique({
        where: { systemId },
      })

      if (!warranty) {
        throw new Error('WARRANTY_NOT_FOUND')
      }

      // Validate transition
      const currentStatus = warranty.status as WarrantyStatus
      const allowedStatuses = validTransitions[currentStatus]

      if (!allowedStatuses.includes(newStatus)) {
        throw new Error(`INVALID_TRANSITION:${currentStatus}:${newStatus}`)
      }

      const now = new Date()
      const userName = session.user?.name || session.user?.email || 'Unknown'

      // Build history entry
      const statusLabels: Record<WarrantyStatus, string> = {
        RECEIVED: 'Đã tiếp nhận',
        PROCESSING: 'Đang xử lý',
        COMPLETED: 'Đã xử lý',
        RETURNED: 'Đã trả',
        CANCELLED: 'Đã hủy',
      }

      const historyEntry = {
        systemId: generateSubEntityId('WH'),
        action: `STATUS_CHANGE_${newStatus}`,
        actionLabel: `Chuyển sang ${statusLabels[newStatus]}`,
        entityType: 'status',
        performedBy: userName,
        performedAt: now.toISOString(),
        note: note || undefined,
      }

      const existingHistory = warranty.history as unknown[] || []

      // Build update data based on new status
      const updateData: Record<string, unknown> = {
        status: newStatus,
        history: [...existingHistory, historyEntry],
        updatedAt: now,
        updatedBy: userName,
      }

      // Add timestamp fields based on status
      if (newStatus === 'PROCESSING' && !warranty.processingStartedAt) {
        updateData.processingStartedAt = now
      }
      // Clear completedAt when reopening from COMPLETED
      if (newStatus === 'PROCESSING' && warranty.status === 'COMPLETED' && warranty.completedAt) {
        updateData.completedAt = null
      }
      if (newStatus === 'COMPLETED') {
        updateData.processedAt = now
      }
      if (newStatus === 'RETURNED') {
        updateData.returnedAt = now
      }
      if (newStatus === 'CANCELLED') {
        updateData.cancelledAt = now
      }

      const updatedWarranty = await tx.warranty.update({
        where: { systemId },
        data: updateData as never,
      })

      return serializeWarranty(updatedWarranty)
    })

    revalidatePath(`/warranty/${systemId}`)
    revalidatePath('/warranty')

    // Activity log
    const logUserName = getSessionUserName(authResult.session)
    const statusLabelsForLog: Record<string, string> = {
      RECEIVED: 'Đã tiếp nhận',
      PROCESSING: 'Đang xử lý',
      COMPLETED: 'Đã xử lý',
      RETURNED: 'Đã trả hàng',
      CANCELLED: 'Đã hủy',
    }
    const statusTicketId = result?.id || systemId
    const statusLabel = statusLabelsForLog[newStatus] || newStatus
    prisma.activityLog.create({
      data: {
        entityType: 'warranty',
        entityId: systemId,
        action: `Đổi trạng thái bảo hành: ${statusTicketId} ${statusLabel}`,
        actionType: 'update',
        note: note || `Chuyển trạng thái sang ${statusLabel}`,
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] warranty status update failed', e))

    // ✅ Notify warranty assignee about status change
    if (result?.employeeSystemId && result.employeeSystemId !== session.user?.employeeId) {
      createNotification({
        type: 'warranty',
        title: 'Cập nhật bảo hành',
        message: `Phiếu bảo hành ${result.id || systemId} đã chuyển sang ${newStatus}`,
        link: `/warranty/${systemId}`,
        recipientId: result.employeeSystemId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
        settingsKey: 'warranty:status',
      }).catch(e => logError('[Warranty updateStatusAction] notification failed', e))
    }

    // ✅ Email notification
    notifyWarrantyStatusChanged({
      systemId,
      title: result?.productName || systemId,
      id: result?.id || systemId,
      assigneeId: result?.employeeSystemId || null,
      creatorId: result?.createdBy || null,
      status: newStatus,
      oldStatus: input.newStatus === newStatus ? '' : '',
    }).catch(e => logError('[Warranty updateStatusAction] email failed', e))

    return { success: true, data: result }
  } catch (error) {
    logError('updateWarrantyStatusAction error', error)

    if (error instanceof Error) {
      if (error.message === 'WARRANTY_NOT_FOUND') {
        return { success: false, error: 'Phiếu bảo hành không tồn tại' }
      }
      if (error.message.startsWith('INVALID_TRANSITION')) {
        const [, from, to] = error.message.split(':')
        return { success: false, error: `Không thể chuyển từ ${from} sang ${to}` }
      }
    }

    return { success: false, error: 'Không thể cập nhật trạng thái' }
  }
}

// ====================================
// COMPLETE WARRANTY (Final close)
// ====================================

/**
 * Complete/close a warranty ticket (after RETURNED status)
 */
export async function completeWarrantyAction(
  input: CompleteWarrantyInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_warranty')
  if (!authResult.success) return authResult
  const { session } = authResult

  const { systemId, note } = input

  try {
    const result = await prisma.$transaction(async (tx) => {
      const warranty = await tx.warranty.findUnique({
        where: { systemId },
      })

      if (!warranty) {
        throw new Error('WARRANTY_NOT_FOUND')
      }

      // Only allow completing from RETURNED status
      if (warranty.status !== 'RETURNED') {
        throw new Error('MUST_BE_RETURNED')
      }

      const now = new Date()
      const userName = session.user?.name || session.user?.email || 'Unknown'

      const historyEntry = {
        systemId: generateSubEntityId('WH'),
        action: 'COMPLETE',
        actionLabel: 'Hoàn tất phiếu bảo hành',
        entityType: 'status',
        performedBy: userName,
        performedAt: now.toISOString(),
        note: note || 'Phiếu bảo hành đã hoàn tất',
      }

      const existingHistory = warranty.history as unknown[] || []

      const updatedWarranty = await tx.warranty.update({
        where: { systemId },
        data: {
          status: 'COMPLETED',
          completedAt: now,
          history: [...existingHistory, historyEntry] as unknown as undefined,
          updatedAt: now,
          updatedBy: userName,
        },
      })

      return serializeWarranty(updatedWarranty)
    })

    revalidatePath(`/warranty/${systemId}`)
    revalidatePath('/warranty')

    // Activity log
    const logUserName = getSessionUserName(authResult.session)
    const completeTicketId = result?.id || systemId
    prisma.activityLog.create({
      data: {
        entityType: 'warranty',
        entityId: systemId,
        action: `Hoàn tất bảo hành: ${completeTicketId} Hoàn tất phiếu bảo hành`,
        actionType: 'update',
        note: note || `Kết thúc phiếu bảo hành ${completeTicketId}`,
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] warranty complete failed', e))

    return { success: true, data: result }
  } catch (error) {
    logError('completeWarrantyAction error', error)

    if (error instanceof Error) {
      if (error.message === 'WARRANTY_NOT_FOUND') {
        return { success: false, error: 'Phiếu bảo hành không tồn tại' }
      }
      if (error.message === 'MUST_BE_RETURNED') {
        return { success: false, error: 'Chỉ có thể kết thúc phiếu đã trả hàng' }
      }
    }

    return { success: false, error: 'Không thể kết thúc phiếu bảo hành' }
  }
}

// ====================================
// UPDATE RETURN METHOD
// ====================================

export type UpdateReturnMethodInput = {
  systemId: string
  method: 'direct' | 'order'
  linkedOrderSystemId?: string
  linkedOrderId?: string
}

/**
 * Update the return method on a RETURNED warranty ticket.
 * Handles direct pickup vs linked order atomically.
 */
export async function updateReturnMethodAction(
  input: UpdateReturnMethodInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_warranty')
  if (!authResult.success) return authResult
  const { session } = authResult

  const { systemId, method, linkedOrderSystemId, linkedOrderId } = input

  try {
    const result = await prisma.$transaction(async (tx) => {
      const warranty = await tx.warranty.findUnique({
        where: { systemId },
      })

      if (!warranty) {
        throw new Error('WARRANTY_NOT_FOUND')
      }

      if (warranty.status !== 'RETURNED') {
        throw new Error('MUST_BE_RETURNED')
      }

      const now = new Date()
      const userName = session.user?.name || session.user?.email || 'Unknown'

      const newMethod = method === 'order'
        ? `Giao qua đơn hàng ${linkedOrderId || ''}`
        : 'Khách lấy trực tiếp tại cửa hàng'

      const historyEntry = {
        systemId: generateSubEntityId('WH'),
        action: 'UPDATE_RETURN_METHOD',
        actionLabel: `Đã cập nhật phương thức trả hàng`,
        entityType: 'return_method',
        performedBy: userName,
        performedAt: now.toISOString(),
        note: `Đổi sang: ${newMethod}.`,
      }

      const existingHistory = warranty.history as unknown[] || []

      const updatedWarranty = await tx.warranty.update({
        where: { systemId },
        data: {
          linkedOrderSystemId: method === 'order' ? linkedOrderSystemId : null,
          history: [...existingHistory, historyEntry] as unknown as undefined,
          updatedAt: now,
          updatedBy: userName,
        },
      })

      return serializeWarranty(updatedWarranty)
    })

    revalidatePath(`/warranty/${systemId}`)
    revalidatePath('/warranty')

    // Activity log
    const logUserName = getSessionUserName(authResult.session)
    const returnMethodTicketId = result?.id || systemId
    const returnMethodNote = method === 'order' ? `Giao qua đơn hàng ${linkedOrderId || ''}` : 'Khách lấy trực tiếp tại cửa hàng'
    prisma.activityLog.create({
      data: {
        entityType: 'warranty',
        entityId: systemId,
        action: `Đổi phương thức trả hàng: ${returnMethodTicketId}`,
        actionType: 'update',
        note: `Phương thức trả hàng: ${returnMethodNote}`,
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] warranty return method failed', e))

    return { success: true, data: result }
  } catch (error) {
    logError('updateReturnMethodAction error', error)

    if (error instanceof Error) {
      if (error.message === 'WARRANTY_NOT_FOUND') {
        return { success: false, error: 'Phiếu bảo hành không tồn tại' }
      }
      if (error.message === 'MUST_BE_RETURNED') {
        return { success: false, error: 'Chỉ có thể cập nhật khi phiếu đã trả hàng' }
      }
    }

    return { success: false, error: 'Không thể cập nhật phương thức trả hàng' }
  }
}

// ====================================
// REOPEN WARRANTY
// ====================================

/**
 * Reopen a cancelled warranty
 */
export async function reopenWarrantyAction(
  input: ReopenWarrantyInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_warranty')
  if (!authResult.success) return authResult
  const { session } = authResult

  const { systemId, reason } = input

  try {
    const result = await prisma.$transaction(async (tx) => {
      const warranty = await tx.warranty.findUnique({
        where: { systemId },
      })

      if (!warranty) {
        throw new Error('WARRANTY_NOT_FOUND')
      }

      if (warranty.status !== 'CANCELLED') {
        throw new Error('NOT_CANCELLED')
      }

      const now = new Date()
      const userName = session.user?.name || session.user?.email || 'Unknown'

      const historyEntry = {
        systemId: generateSubEntityId('WH'),
        action: 'REOPEN',
        actionLabel: 'Mở lại phiếu bảo hành',
        entityType: 'status',
        performedBy: userName,
        performedAt: now.toISOString(),
        note: reason || 'Mở lại phiếu đã hủy',
      }

      const existingHistory = warranty.history as unknown[] || []

      const updatedWarranty = await tx.warranty.update({
        where: { systemId },
        data: {
          status: 'RECEIVED',
          cancelledAt: null,
          cancelReason: null,
          history: [...existingHistory, historyEntry] as unknown as undefined,
          updatedAt: now,
          updatedBy: userName,
        },
      })

      return serializeWarranty(updatedWarranty)
    })

    revalidatePath(`/warranty/${systemId}`)
    revalidatePath('/warranty')

    // Activity log
    const logUserName = getSessionUserName(authResult.session)
    const reopenTicketId = result?.id || systemId
    prisma.activityLog.create({
      data: {
        entityType: 'warranty',
        entityId: systemId,
        action: `Mở lại phiếu bảo hành: ${reopenTicketId}`,
        actionType: 'update',
        note: reason ? `Lý do mở lại: ${reason}` : `Mở lại phiếu bảo hành ${reopenTicketId} đã hủy`,
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] warranty reopen failed', e))

    // ✅ Notify warranty assignee about reopen
    if (result?.employeeSystemId && result.employeeSystemId !== session.user?.employeeId) {
      createNotification({
        type: 'warranty',
        title: 'Mở lại bảo hành',
        message: `Phiếu bảo hành ${result.id || systemId} đã được mở lại`,
        link: `/warranty/${systemId}`,
        recipientId: result.employeeSystemId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
        settingsKey: 'warranty:status',
      }).catch(e => logError('[Warranty reopenAction] notification failed', e))
    }

    // ✅ Email notification
    notifyWarrantyStatusChanged({
      systemId,
      title: result?.productName || systemId,
      id: result?.id || systemId,
      assigneeId: result?.employeeSystemId || null,
      creatorId: result?.createdBy || null,
      status: 'RECEIVED',
      oldStatus: 'CANCELLED',
    }).catch(e => logError('[Warranty reopenAction] email failed', e))

    return { success: true, data: result }
  } catch (error) {
    logError('reopenWarrantyAction error', error)

    if (error instanceof Error) {
      if (error.message === 'WARRANTY_NOT_FOUND') {
        return { success: false, error: 'Phiếu bảo hành không tồn tại' }
      }
      if (error.message === 'NOT_CANCELLED') {
        return { success: false, error: 'Chỉ có thể mở lại phiếu đã hủy' }
      }
    }

    return { success: false, error: 'Không thể mở lại phiếu bảo hành' }
  }
}

// ====================================
// CREATE WARRANTY
// ====================================

export type CreateWarrantyInput = {
  customerId: string
  customerName: string
  customerPhone: string
  orderId?: string
  productId?: string
  productName: string
  productSku?: string
  title: string
  branchId?: string
  branchSystemId?: string
  branchName?: string
  issueDescription?: string
  warrantyType?: string
  returnMethod?: string
  status?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  receivedDate?: string | Date
  createdBy?: string
}

export async function createWarrantyAction(
  input: CreateWarrantyInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('create_warranty')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = createWarrantySchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { generateIdWithPrefix } = await import('@/lib/id-generator')
    const systemId = await generateIdWithPrefix('WRT', prisma)
    const userName = session.user?.name || session.user?.email || 'Unknown'
    const now = new Date()

    const warranty = await prisma.warranty.create({
      data: {
        systemId,
        id: systemId,
        customerId: input.customerId,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        orderId: input.orderId,
        productId: input.productId,
        productName: input.productName,
        title: input.title,
        branchId: input.branchId,
        branchSystemId: input.branchSystemId,
        branchName: input.branchName,
        issueDescription: input.issueDescription,
        status: (input.status || 'RECEIVED') as WarrantyStatus,
        priority: input.priority || 'MEDIUM',
        receivedAt: input.receivedDate ? new Date(input.receivedDate) : now,
        createdAt: now,
        createdBy: input.createdBy || userName,
        updatedAt: now,
        updatedBy: userName,
        history: [{
          systemId: generateSubEntityId('WH'),
          action: 'CREATE',
          actionLabel: 'Tạo phiếu',
          entityType: 'status',
          performedBy: userName,
          performedAt: now.toISOString(),
        }],
      },
    })

    revalidatePath('/warranty')

    // Activity log
    const logUserName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'warranty',
        entityId: warranty.systemId,
        action: `Tạo phiếu bảo hành: ${warranty.id || warranty.systemId}`,
        actionType: 'create',
        note: `Tạo phiếu bảo hành cho khách ${input.customerName} | SP: ${input.productName}`,
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] warranty create failed', e))

    return { success: true, data: serializeWarranty(warranty) }
  } catch (error) {
    logError('createWarrantyAction error', error)
    return { success: false, error: 'Không thể tạo phiếu bảo hành' }
  }
}

// ====================================
// UPDATE WARRANTY
// ====================================

export type UpdateWarrantyInput = {
  systemId: string
  customerName?: string
  customerPhone?: string
  productName?: string
  productSku?: string
  issueDescription?: string
  warrantyType?: string
  returnMethod?: string
  priority?: string
  status?: string
  expectedDate?: string | Date | null
  note?: string
  updatedBy?: string
  subtasks?: unknown[]
}

export async function updateWarrantyAction(
  input: UpdateWarrantyInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_warranty')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = updateWarrantySchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...updateData } = input
    const userName = session.user?.name || session.user?.email || 'Unknown'
    const now = new Date()

    const existing = await prisma.warranty.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Phiếu bảo hành không tồn tại' }
    }

    // Build update data
    const data: Record<string, unknown> = {
      updatedAt: now,
      updatedBy: updateData.updatedBy || userName,
    }

    if (updateData.customerName !== undefined) data.customerName = updateData.customerName
    if (updateData.customerPhone !== undefined) data.customerPhone = updateData.customerPhone
    if (updateData.productName !== undefined) data.productName = updateData.productName
    if (updateData.productSku !== undefined) data.productSku = updateData.productSku
    if (updateData.issueDescription !== undefined) data.issueDescription = updateData.issueDescription
    if (updateData.warrantyType !== undefined) data.warrantyType = updateData.warrantyType
    if (updateData.returnMethod !== undefined) data.returnMethod = updateData.returnMethod
    if (updateData.priority !== undefined) data.priority = updateData.priority
    if (updateData.status !== undefined) data.status = updateData.status
    if (updateData.expectedDate !== undefined) {
      data.expectedDate = updateData.expectedDate ? new Date(updateData.expectedDate) : null
    }
    if (updateData.note !== undefined) data.notes = updateData.note
    if (updateData.subtasks !== undefined) data.subtasks = updateData.subtasks

    const warranty = await prisma.warranty.update({
      where: { systemId },
      data,
    })

    revalidatePath(`/warranty/${systemId}`)
    revalidatePath('/warranty')

    // Activity log — ghi rõ các trường đã thay đổi
    const logUserName = getSessionUserName(authResult.session)
    const updateTicketId = existing.id || systemId
    const changedFields: string[] = []
    if (updateData.customerName !== undefined) changedFields.push('tên khách hàng')
    if (updateData.customerPhone !== undefined) changedFields.push('SĐT khách')
    if (updateData.productName !== undefined) changedFields.push('tên sản phẩm')
    if (updateData.issueDescription !== undefined) changedFields.push('mô tả lỗi')
    if (updateData.priority !== undefined) changedFields.push('độ ưu tiên')
    if (updateData.status !== undefined) changedFields.push('trạng thái')
    if (updateData.expectedDate !== undefined) changedFields.push('ngày dự kiến')
    if (updateData.note !== undefined) changedFields.push('ghi chú')
    if (updateData.subtasks !== undefined) {
      // So sánh chi tiết subtask nào thay đổi
      type SubtaskItem = { id: string; title: string; completed?: boolean }
      const oldSubtasks = (existing.subtasks as SubtaskItem[] | null) || []
      const newSubtasks = (updateData.subtasks as SubtaskItem[]) || []
      const subtaskDetails: string[] = []
      for (const newSt of newSubtasks) {
        const oldSt = oldSubtasks.find(o => o.id === newSt.id)
        if (oldSt && !oldSt.completed && newSt.completed) {
          subtaskDetails.push(`✓ ${newSt.title}`)
        } else if (oldSt && oldSt.completed && !newSt.completed) {
          subtaskDetails.push(`✗ ${newSt.title}`)
        }
      }
      if (subtaskDetails.length > 0) {
        changedFields.push(`quy trình xử lý (${subtaskDetails.join(', ')})`)
      } else {
        changedFields.push('quy trình xử lý')
      }
    }
    if (updateData.warrantyType !== undefined) changedFields.push('loại bảo hành')
    if (updateData.returnMethod !== undefined) changedFields.push('phương thức trả hàng')
    const changesSummary = changedFields.length > 0 ? changedFields.join(', ') : 'thông tin bảo hành'
    prisma.activityLog.create({
      data: {
        entityType: 'warranty',
        entityId: systemId,
        action: `Cập nhật phiếu bảo hành: ${updateTicketId}`,
        actionType: 'update',
        note: `Cập nhật ${changesSummary}`,
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] warranty update failed', e))

    return { success: true, data: serializeWarranty(warranty) }
  } catch (error) {
    logError('updateWarrantyAction error', error)
    return { success: false, error: 'Không thể cập nhật phiếu bảo hành' }
  }
}

// ====================================
// DELETE WARRANTY
// ====================================

export async function deleteWarrantyAction(
  systemId: string
): Promise<ActionResult> {
  const authResult = await requireActionPermission('delete_warranty')
  if (!authResult.success) return authResult
  const { session } = authResult

  try {
    const existing = await prisma.warranty.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Phiếu bảo hành không tồn tại' }
    }

    // Soft delete - update isDeleted flag
    await prisma.warranty.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
        updatedBy: session.user?.name || session.user?.email || 'Unknown',
      },
    })

    revalidatePath('/warranty')

    // Activity log
    const logUserName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'warranty',
        entityId: systemId,
        action: `Xóa phiếu bảo hành: ${systemId}`,
        actionType: 'delete',
        note: `SP: ${existing.productName} | Khách: ${existing.customerName}`,
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] warranty delete failed', e))

    return { success: true }
  } catch (error) {
    logError('deleteWarrantyAction error', error)
    return { success: false, error: 'Không thể xóa phiếu bảo hành' }
  }
}
