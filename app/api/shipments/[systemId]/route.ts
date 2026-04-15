import { prisma } from '@/lib/prisma'
import { ShipmentStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateShipmentSchema } from './validation'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

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

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'shipment',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật lô vận chuyển`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] shipment update failed', e))
    return apiSuccess(shipment)
  } catch (error) {
    logError('Error fetching shipment', error)
    return apiError('Không thể tải vận đơn', 500)
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

    // ✅ Notify order salesperson about shipment update
    const orderSalespersonId = (shipment.order as { salespersonId?: string })?.salespersonId
    if (body.status && orderSalespersonId && orderSalespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'shipment',
        title: 'Cập nhật vận đơn',
        message: `Vận đơn ${shipment.id || systemId} đã chuyển trạng thái ${body.status}`,
        link: `/shipments/${systemId}`,
        recipientId: orderSalespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
        settingsKey: 'order:status',
      }).catch(e => logError('[Shipments PUT] notification failed', e))
    }

    return apiSuccess(shipment)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Vận đơn không tồn tại', 404)
    }
    logError('Error updating shipment', error)
    return apiError('Không thể cập nhật vận đơn', 500)
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

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'shipment',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa lô vận chuyển`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] shipment delete failed', e))
    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Vận đơn không tồn tại', 404)
    }
    logError('Error deleting shipment', error)
    return apiError('Không thể xóa vận đơn', 500)
  }
}
