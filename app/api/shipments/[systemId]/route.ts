import { prisma } from '@/lib/prisma'
import { ShipmentStatus } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { validateBody, apiSuccess, apiError } from '@/lib/api-utils'
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

// GET /api/shipments/[systemId]
export const GET = apiHandler(async (_request, { params }) => {
  const { systemId } = await params

  const shipment = await prisma.shipment.findUnique({
    where: { systemId },
    select: {
      systemId: true, id: true, orderId: true, carrier: true, trackingNumber: true,
      shippingFee: true, status: true, deliveryStatus: true, deliveredAt: true,
      recipientName: true, recipientPhone: true, recipientAddress: true, notes: true,
      createdAt: true, updatedAt: true, dispatchedAt: true, cancelledAt: true,
      order: {
        select: {
          systemId: true, id: true, branchId: true, branchName: true,
          customerId: true, customerName: true, salespersonId: true,
          customer: {
            select: { systemId: true, id: true, name: true, phone: true, addresses: true },
          },
        },
      },
      warranty: {
        select: { systemId: true, id: true, supplierName: true, branchName: true },
      },
    },
  })

  if (!shipment) {
    return apiError('Vận đơn không tồn tại', 404)
  }

  return apiSuccess(shipment)
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
})

// PUT /api/shipments/[systemId]
export const PUT = apiHandler(async (request, { params, session }) => {
  const validation = await validateBody(request, updateShipmentSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

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
    select: {
      systemId: true, id: true, orderId: true, carrier: true, trackingNumber: true,
      shippingFee: true, status: true, deliveryStatus: true, deliveredAt: true,
      recipientName: true, recipientPhone: true, recipientAddress: true, notes: true,
      createdAt: true, updatedAt: true, dispatchedAt: true, cancelledAt: true,
      order: {
        select: { salespersonId: true },
      },
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

    if (session) {
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
  }

  // Notify order salesperson about shipment update
  const orderSalespersonId = shipment.order?.salespersonId
  if (body.status && orderSalespersonId && session && orderSalespersonId !== session.user?.employeeId) {
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
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
})

// DELETE /api/shipments/[systemId]
export const DELETE = apiHandler(async (_request, { params, session }) => {
  const { systemId } = await params

  await prisma.shipment.delete({
    where: { systemId },
  })

  // Log activity
  if (session) {
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
  }
  return apiSuccess({ success: true })
}, {
  rateLimit: { max: 20, windowMs: 60_000 }
})
