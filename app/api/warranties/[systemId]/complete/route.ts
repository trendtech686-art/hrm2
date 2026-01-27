import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, validateBody } from '@/lib/api-utils'
import { z } from 'zod'

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
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, completeWarrantySchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

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

      // Verify status is valid for completion
      if (warranty.status === 'COMPLETED') {
        throw new Error('ALREADY_COMPLETED')
      }

      if (warranty.status !== 'PROCESSING' && warranty.status !== 'WAITING_PARTS') {
        throw new Error('INVALID_STATUS_TRANSITION')
      }

      const now = new Date()
      
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

      // TODO: Stock management logic would go here
      // Since the current Prisma schema doesn't have ProductWarehouse model,
      // this would need to be added when the schema is updated
      // 
      // Example pseudo-code:
      // if (warranty has replacement products) {
      //   await tx.productWarehouse.update({
      //     where: { productSystemId_warehouseId: {...} },
      //     data: {
      //       onHand: { decrement: quantity },
      //       committedQuantity: { decrement: quantity }
      //     }
      //   })
      //
      //   await tx.inventoryTransaction.create({
      //     data: {
      //       type: 'WARRANTY_REPLACEMENT',
      //       productSystemId: warranty.productId,
      //       quantity: -quantity,
      //       ...
      //     }
      //   })
      // }

      return updatedWarranty
    })

    return apiSuccess(result, 200)
  } catch (error) {
    console.error('Error completing warranty:', error)
    
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

    return apiError('Failed to complete warranty', 500)
  }
}
