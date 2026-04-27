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

const completeWarrantySchema = z.object({
  actualCost: z.number().nonnegative().optional(),
  completionNotes: z.string().optional(),
  technicianId: z.string().optional(),
})

/**
 * POST /api/warranties/[systemId]/complete
 * 
 * Complete warranty and deduct stock if replacement type
 * 
 * Flow:
 * 1. Verify warranty exists and is IN_PROGRESS
 * 2. If REPLACE type:
 *    - Deduct stock (finalize the committed stock)
 *    - Uncommit stock (reduce committedQuantity)
 *    - Create inventory transaction
 * 3. Update warranty status to COMPLETED
 * 4. Create warranty history
 */
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  const validation = await validateBody(request, completeWarrantySchema)
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

      // Verify status is valid for completion
      if (warranty.status === 'COMPLETED') {
        throw new Error('ALREADY_COMPLETED')
      }

      if (warranty.status !== 'PROCESSING' && warranty.status !== 'WAITING_PARTS') {
        throw new Error('INVALID_STATUS_TRANSITION')
      }

      const now = new Date()

      // Fetch warranty with replacement product info
      const warrantyWithReplacement = await tx.warranty.findUnique({
        where: { systemId },
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

      // Update warranty status
      const updatedWarranty = await tx.warranty.update({
        where: { systemId },
        data: {
          status: 'COMPLETED',
          completedAt: now,
          totalCost: body.actualCost ?? warranty.totalCost,
          notes: body.completionNotes
            ? (warranty.notes ? `${warranty.notes}\n\nCompletion: ${body.completionNotes}` : body.completionNotes)
            : warranty.notes,
          assigneeId: body.technicianId ?? warranty.assigneeId,
          stockDeducted: true,
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

      // ============================================================
      // STOCK DEDUCTION: Deduct replacement product from inventory
      // When warranty is completed with replacement, finalize the stock:
      // 1. Decrement onHand for the replacement product (deduct from available)
      // 2. Decrement committedQuantity (remove from reserved)
      // ============================================================
      if (warrantyWithReplacement?.replacementProductSystemId && warrantyWithReplacement?.replacementQuantity) {
        const replacementProductId = warrantyWithReplacement.replacementProductSystemId;
        const replacementQty = warrantyWithReplacement.replacementQuantity;
        const branchSystemId = warranty.branchSystemId || '';

        if (branchSystemId && replacementQty > 0) {
          // Get replacement product with current inventory
          const replacementProduct = await tx.product.findUnique({
            where: { systemId: replacementProductId },
            select: {
              systemId: true,
              id: true,
              name: true,
              inventoryByBranch: true,
              totalInventory: true,
              totalCommitted: true,
              totalAvailable: true,
            },
          });

          if (replacementProduct) {
            const branchInventory = (replacementProduct.inventoryByBranch as Record<string, number>) || {};
            const currentOnHand = branchInventory[branchSystemId] || 0;

            // Deduct from inventory
            const newOnHand = Math.max(0, currentOnHand - replacementQty);
            const newTotalInventory = (replacementProduct.totalInventory ?? 0) - replacementQty;
            const newTotalCommitted = Math.max(0, (replacementProduct.totalCommitted ?? 0) - replacementQty);
            const newTotalAvailable = newTotalInventory - newTotalCommitted;

            // Update product inventory
            await tx.product.update({
              where: { systemId: replacementProductId },
              data: {
                inventoryByBranch: {
                  ...branchInventory,
                  [branchSystemId]: newOnHand,
                },
                totalInventory: newTotalInventory,
                totalCommitted: newTotalCommitted,
                totalAvailable: newTotalAvailable,
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
        title: 'Bảo hành hoàn tất',
        message: `Phiếu bảo hành ${result.id || systemId} đã hoàn tất`,
        link: `/warranty/${systemId}`,
        recipientId: result.employeeSystemId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
        settingsKey: 'warranty:status',
      }).catch(e => logError('[Warranty Complete] notification failed', e));

      // Send email notification (non-blocking)
      notifyWarrantyStatusChanged({
        systemId,
        title: result.title,
        id: result.id,
        assigneeId: result.employeeSystemId,
        creatorId: result.createdBySystemId,
        status: 'COMPLETED',
        oldStatus: prevStatus,
      }).catch(e => logError('[Warranty Complete] email failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'warranty',
          entityId: systemId,
          action: 'completed',
          actionType: 'update',
          note: `Hoàn thành bảo hành`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] warranty completed failed', e))
    return apiSuccess(result, 200)
  } catch (error) {
    logError('Error completing warranty', error)
    
    if (error instanceof Error) {
      if (error.message === 'WARRANTY_NOT_FOUND') {
        return apiError('Phiếu bảo hành không tồn tại', 404)
      }
      if (error.message === 'INVALID_STATUS_TRANSITION') {
        return apiError('Không thể hoàn tất phiếu bảo hành ở trạng thái hiện tại', 400)
      }
      if (error.message === 'ALREADY_COMPLETED') {
        return apiError('Phiếu bảo hành đã được hoàn tất', 400)
      }
      if (error.message === 'INSUFFICIENT_STOCK') {
        return apiError('Không đủ hàng trong kho để thay thế', 400)
      }
    }

    return apiError('Không thể hoàn tất phiếu bảo hành', 500)
  }
}
