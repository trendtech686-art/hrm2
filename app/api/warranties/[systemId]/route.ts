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

// PUT /api/warranties/[systemId]
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
        solution: body.solution,
      },
      include: {
        product: true,
      },
    })

    return apiSuccess(warranty)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu bảo hành không tồn tại', 404)
    }
    console.error('Error updating warranty:', error)
    return apiError('Failed to update warranty', 500)
  }
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
