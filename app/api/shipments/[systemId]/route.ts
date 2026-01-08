import { prisma } from '@/lib/prisma'
import { ShipmentStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateShipmentSchema } from './validation'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/shipments/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const shipment = await prisma.shipment.findUnique({
      where: { systemId },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
    })

    if (!shipment) {
      return apiError('Vận đơn không tồn tại', 404)
    }

    return apiSuccess(shipment)
  } catch (error) {
    console.error('Error fetching shipment:', error)
    return apiError('Failed to fetch shipment', 500)
  }
}

// PUT /api/shipments/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateShipmentSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const shipment = await prisma.shipment.update({
      where: { systemId },
      data: {
        carrier: body.carrier,
        trackingNumber: body.trackingNumber,
        shippingFee: body.shippingFee,
        status: body.status as ShipmentStatus | undefined,
        deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : undefined,
        recipientName: body.recipientName,
        recipientPhone: body.recipientPhone,
        recipientAddress: body.recipientAddress,
        notes: body.notes,
      },
      include: {
        order: true,
      },
    })

    return apiSuccess(shipment)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Vận đơn không tồn tại', 404)
    }
    console.error('Error updating shipment:', error)
    return apiError('Failed to update shipment', 500)
  }
}

// DELETE /api/shipments/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.shipment.delete({
      where: { systemId },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Vận đơn không tồn tại', 404)
    }
    console.error('Error deleting shipment:', error)
    return apiError('Failed to delete shipment', 500)
  }
}
