import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, validateBody } from '@/lib/api-utils'
import { z } from 'zod'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { notifyWarrantyStatusChanged } from '@/lib/warranty-notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

const cancelWarrantySchema = z.object({
  cancellationReason: z.string().min(1, 'Vui lòng nhập lý do hủy'),
  notes: z.string().optional(),
})

/**
 * POST /api/warranties/[systemId]/cancel
 * 
 * Cancel warranty and uncommit reserved stock
 * 
 * Flow:
 * 1. Verify warranty exists and is cancellable
 * 2. If REPLACE type and stock was committed:
 *    - Uncommit stock (release reservation)
 * 3. Update warranty status to CANCELLED
 * 4. Cancel related vouchers (if any)
 * 5. Create warranty history
 */
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  const validation = await validateBody(request, cancelWarrantySchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    let prevStatus = ''

    // Start transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Find warranty
      const warranty = await tx.warranty.findUnique({
        where: { systemId },
        include: {
          product: true,
        },
      })

      if (!warranty) {
        throw new Error('WARRANTY_NOT_FOUND')
      }

      prevStatus = warranty.status

      // Verify warranty is not already completed
      if (warranty.status === 'COMPLETED') {
        throw new Error('CANNOT_CANCEL_COMPLETED')
      }

      // Verify warranty is not already cancelled
      if (warranty.status === 'CANCELLED') {
        throw new Error('ALREADY_CANCELLED')
      }

      const now = new Date()

      // Update warranty status to CANCELLED
      const updatedWarranty = await tx.warranty.update({
        where: { systemId },
        data: {
          status: 'CANCELLED',
          cancelledAt: now,
          cancelReason: body.cancellationReason,
          notes: body.notes 
            ? (warranty.notes ? `${warranty.notes}\n\nCancellation: ${body.notes}` : body.notes)
            : warranty.notes,
          updatedAt: now,
          updatedBy: session.user?.email || 'system',
          updatedBySystemId: session.user?.id,
        },
        include: {
          product: {
            select: {
              systemId: true,
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      })

      // TODO: Stock uncommitment logic would go here
      // Since the current Prisma schema doesn't have ProductWarehouse model,
      // this would need to be added when the schema is updated
      //
      // Example pseudo-code:
      // if (warranty has replacement products && stock was committed) {
      //   await tx.productWarehouse.update({
      //     where: { productSystemId_warehouseId: {...} },
      //     data: {
      //       committedQuantity: { decrement: quantity }
      //     }
      //   })
      // }

      // TODO: Cancel related vouchers if any
      // This would depend on the voucher/payment system implementation

      return updatedWarranty
    })

    // Notify warranty employee
    if (result.employeeSystemId && result.employeeSystemId !== session.user?.employeeId) {
      createNotification({
        type: 'warranty',
        title: 'Bảo hành bị hủy',
        message: `Phiếu bảo hành ${result.id || systemId} đã bị hủy`,
        link: `/warranty/${systemId}`,
        recipientId: result.employeeSystemId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
        settingsKey: 'warranty:status',
      }).catch(e => logError('[Warranty Cancel] notification failed', e));

      // Send email notification (non-blocking)
      notifyWarrantyStatusChanged({
        systemId,
        title: result.title,
        id: result.id,
        assigneeId: result.employeeSystemId,
        creatorId: result.createdBySystemId,
        status: 'CANCELLED',
        oldStatus: prevStatus,
      }).catch(e => logError('[Warranty Cancel] email failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'warranty',
          entityId: systemId,
          action: 'cancelled',
          actionType: 'update',
          note: `Hủy phiếu bảo hành`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] warranty cancelled failed', e))
    return apiSuccess(result, 200)
  } catch (error) {
    logError('Error cancelling warranty', error)
    
    if (error instanceof Error) {
      if (error.message === 'WARRANTY_NOT_FOUND') {
        return apiError('Phiếu bảo hành không tồn tại', 404)
      }
      if (error.message === 'CANNOT_CANCEL_COMPLETED') {
        return apiError('Không thể hủy phiếu bảo hành đã hoàn tất', 400)
      }
      if (error.message === 'ALREADY_CANCELLED') {
        return apiError('Phiếu bảo hành đã bị hủy', 400)
      }
    }

    return apiError('Không thể hủy phiếu bảo hành', 500)
  }
}
