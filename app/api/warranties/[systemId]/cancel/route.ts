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
        select: {
          systemId: true,
          id: true,
          status: true,
          notes: true,
          employeeSystemId: true,
          branchSystemId: true,
          replacementProductSystemId: true,
          replacementQuantity: true,
          stockDeducted: true,
          createdBySystemId: true,
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
        select: {
          systemId: true,
          id: true,
          title: true,
          status: true,
          employeeSystemId: true,
          createdBySystemId: true,
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

      // Cancel related payments linked to this warranty
      await tx.payment.updateMany({
        where: {
          linkedWarrantySystemId: systemId,
          cancelledAt: null,
          status: { not: 'cancelled' },
        },
        data: {
          cancelledAt: now,
          status: 'cancelled',
        },
      });

      // Cancel related receipts linked to this warranty
      await tx.receipt.updateMany({
        where: {
          linkedWarrantySystemId: systemId,
          cancelledAt: null,
          status: { not: 'cancelled' },
        },
        data: {
          cancelledAt: now,
          status: 'cancelled',
        },
      });

      // ============================================================
      // STOCK UNCOMMITMENT: Release reserved stock when warranty is cancelled
      // Only uncommit if stock was committed (reserved) but not yet deducted
      // If stock was already deducted (COMPLETED), do not rollback
      // ============================================================
      if (warranty.replacementProductSystemId && warranty.replacementQuantity && !warranty.stockDeducted) {
        const replacementProductId = warranty.replacementProductSystemId;
        const replacementQty = warranty.replacementQuantity;
        const branchSystemId = warranty.branchSystemId || '';

        if (branchSystemId && replacementQty > 0) {
          // Get replacement product with current committed inventory
          const replacementProduct = await tx.product.findUnique({
            where: { systemId: replacementProductId },
            select: {
              systemId: true,
              id: true,
              name: true,
              inventoryByBranch: true,
              committedByBranch: true,
              totalCommitted: true,
              totalAvailable: true,
            },
          });

          if (replacementProduct) {
            // Release committed quantity
            const currentCommittedByBranch = (replacementProduct.committedByBranch as Record<string, number>) || {};
            const currentCommitted = currentCommittedByBranch[branchSystemId] || 0;
            const newCommitted = Math.max(0, currentCommitted - replacementQty);

            // Update product committed inventory
            await tx.product.update({
              where: { systemId: replacementProductId },
              data: {
                committedByBranch: {
                  ...currentCommittedByBranch,
                  [branchSystemId]: newCommitted,
                },
                totalCommitted: Math.max(0, (replacementProduct.totalCommitted ?? 0) - replacementQty),
                totalAvailable: (replacementProduct.totalAvailable ?? 0) + replacementQty,
              },
            });
          }
        }
      }

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
