import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateStockLocationSchema } from './validation'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/stock-locations/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const location = await prisma.stockLocation.findUnique({
      where: { systemId },
      include: {
        inventoryRecords: {
          take: 20,
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
        },
        _count: { select: { inventoryRecords: true } },
      },
    })

    if (!location) {
      return apiError('Kho không tồn tại', 404)
    }

    return apiSuccess(location)
  } catch (error) {
    console.error('Error fetching stock location:', error)
    return apiError('Failed to fetch stock location', 500)
  }
}

// PUT /api/stock-locations/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateStockLocationSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const location = await prisma.stockLocation.update({
      where: { systemId },
      data: {
        name: body.name,
        description: body.address || body.description,
        isActive: body.isActive,
      },
    })

    return apiSuccess(location)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Kho không tồn tại', 404)
    }
    console.error('Error updating stock location:', error)
    return apiError('Failed to update stock location', 500)
  }
}

// DELETE /api/stock-locations/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.stockLocation.update({
      where: { systemId },
      data: { isActive: false },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Kho không tồn tại', 404)
    }
    console.error('Error deleting stock location:', error)
    return apiError('Failed to delete stock location', 500)
  }
}
