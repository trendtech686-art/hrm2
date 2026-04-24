import { prisma } from '@/lib/prisma'
import { ShipmentStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateShipmentSchema } from './validation'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

// Helper functions are at the bottom of the file
function normalizeValue(val: unknown): unknown {
  if (val == null) return null
  if (typeof val === 'string' && val.trim() === '') return null
  if (Array.isArray(val) && val.length === 0) return null
  if (typeof val === 'object' && val !== null && !('toNumber' in val) && !(val instanceof Date) && Object.keys(val).length === 0) return null
  
  if (typeof val === 'object' && val !== null && 'toNumber' in val) {
    return (val as { toNumber: () => number }).toNumber()
  }
  
  if (val instanceof Date) {
    return val.getTime()
  }
  
  return val
}

// Helper to compare values for change detection
function hasValueChanged(oldVal: unknown, newVal: unknown): boolean {
  const normalizedOld = normalizeValue(oldVal)
  const normalizedNew = normalizeValue(newVal)
  
  if (normalizedOld == null && normalizedNew == null) return false
  if (normalizedOld === 0 && normalizedNew === 0) return false
  if ((normalizedOld == null && normalizedNew === 0) || (normalizedOld === 0 && normalizedNew == null)) return false
  if (normalizedOld == null || normalizedNew == null) return true
  
  if (typeof normalizedOld === 'number' && typeof normalizedNew === 'number') {
    return normalizedOld !== normalizedNew
  }
  
  if (typeof normalizedOld === 'object' && typeof normalizedNew === 'object') {
    return JSON.stringify(normalizedOld) !== JSON.stringify(normalizedNew)
  }
  
  return normalizedOld !== normalizedNew
}

// Serialize a value for storage in the activity log
function serializeValue(val: unknown): unknown {
  if (val == null) return null
  if (typeof val === 'object' && val !== null && 'toNumber' in val) {
    return (val as { toNumber: () => number }).toNumber()
  }
  if (val instanceof Date) {
    return val.getTime()
  }
  if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
    return JSON.parse(JSON.stringify(val))
  }
  return val
}

// Helper to compute changes between old and new data
function computeChanges(
  existing: Record<string, unknown>,
  updateData: Record<string, unknown>
): Record<string, { from: unknown; to: unknown }> | null {
  const changes: Record<string, { from: unknown; to: unknown }> = {}
  
  const ignoreFields = ['updatedAt', 'updatedBy']
  
  for (const [key, newValue] of Object.entries(updateData)) {
    if (ignoreFields.includes(key)) continue
    
    const oldValue = existing[key]
    if (hasValueChanged(oldValue, newValue)) {
      changes[key] = { from: serializeValue(oldValue), to: serializeValue(newValue) }
    }
  }
  
  return Object.keys(changes).length > 0 ? changes : null
}

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

    // Fetch existing shipment for change tracking
    const existing = await prisma.shipment.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiError('Vận đơn không tồn tại', 404)
    }

    // Build update data
    const updateData: Record<string, unknown> = {
      carrier: body.carrier,
      trackingNumber: body.trackingNumber,
      shippingFee: body.shippingFee,
      status: body.status as ShipmentStatus | undefined,
      deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : undefined,
      recipientName: body.recipientName,
      recipientPhone: body.recipientPhone,
      recipientAddress: body.recipientAddress,
      notes: body.notes,
    }

    // Compute changes for activity log
    const changes = computeChanges(existing as unknown as Record<string, unknown>, updateData)

    const shipment = await prisma.shipment.update({
      where: { systemId },
      data: updateData,
      include: {
        order: true,
      },
    })

    // Fire-and-forget activity log if there are actual changes
    if (changes) {
      const fieldLabels: Record<string, string> = {
        carrier: 'Đơn vị vận chuyển',
        trackingNumber: 'Mã vận đơn',
        shippingFee: 'Phí vận chuyển',
        status: 'Trạng thái',
        deliveredAt: 'Ngày giao',
        recipientName: 'Người nhận',
        recipientPhone: 'SĐT người nhận',
        recipientAddress: 'Địa chỉ nhận',
        notes: 'Ghi chú',
      }
      const changedFieldNames = Object.keys(changes)
        .map(k => fieldLabels[k] || k)
        .slice(0, 5)
      const suffix = Object.keys(changes).length > 5 ? ` và ${Object.keys(changes).length - 5} trường khác` : ''
      const note = `Cập nhật lô vận chuyển: ${changedFieldNames.join(', ')}${suffix}`

      getUserNameFromDb(session.user?.id).then(userName =>
        prisma.activityLog.create({
          data: {
            entityType: 'shipment',
            entityId: systemId,
            action: 'updated',
            actionType: 'update',
            changes: JSON.parse(JSON.stringify(changes)),
            note,
            metadata: { userName },
            createdBy: userName,
          }
        })
      ).catch(e => logError('[ActivityLog] shipment update failed', e))
    }

    // Notify order salesperson about shipment update
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
