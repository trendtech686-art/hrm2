import { prisma } from '@/lib/prisma'
import { WarrantyStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateWarrantySchema } from './validation'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/warranties/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const warranty = await prisma.warranty.findUnique({
      where: { systemId },
      include: {
        product: true,
        order: {
          select: { systemId: true, id: true, orderDate: true },
        },
      },
    })

    if (!warranty) {
      return apiError('Phiếu bảo hành không tồn tại', 404)
    }

    return apiSuccess(warranty)
  } catch (error) {
    console.error('Error fetching warranty:', error)
    return apiError('Failed to fetch warranty', 500)
  }
}

// PUT /api/warranties/[systemId] - Update warranty details
/**
 * Update warranty flow:
 * 1. Verify warranty exists
 * 2. Validate update data
 * 3. If changing type from REPLACE to REPAIR/REFUND, uncommit stock
 * 4. Update warranty record
 * 5. Create history entry
 */
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateWarrantySchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const warranty = await prisma.warranty.update({
      where: { systemId },
      data: {
        issueDescription: body.issueDescription,
        notes: body.notes,
        status: body.status as WarrantyStatus | undefined,
        priority: body.priority,
        solution: body.solution,
        diagnosis: body.diagnosis,
        assigneeId: body.assigneeId,
        updatedAt: new Date(),
        updatedBy: session.user?.email || 'system',
        updatedBySystemId: session.user?.id,
      },
      include: {
        product: {
          select: { systemId: true, id: true, name: true, imageUrl: true },
        },
        customers: {
          select: { systemId: true, id: true, name: true, phone: true },
        },
      },
    })

    // TODO: Handle stock adjustments if warranty type changes
    // This would require knowing the previous warranty type and new type
    // If changing from REPLACE to REPAIR/REFUND, uncommit stock

    return apiSuccess(warranty)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu bảo hành không tồn tại', 404)
    }
    console.error('Error updating warranty:', error)
    return apiError('Failed to update warranty', 500)
  }
}

// PATCH /api/warranties/[systemId] - Partial update warranty
export async function PATCH(request: Request, { params }: RouteParams) {
  return PUT(request, { params })
}

// DELETE /api/warranties/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.warranty.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu bảo hành không tồn tại', 404)
    }
    console.error('Error deleting warranty:', error)
    return apiError('Failed to delete warranty', 500)
  }
}
