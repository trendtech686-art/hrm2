import { prisma } from '@/lib/prisma'
import { Prisma, ShipmentStatus } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { validateBody, validateQuery, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'

import { z } from 'zod'
import { createShipmentSchema } from './validation'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { buildSearchWhere } from '@/lib/search/build-search-where'

const listQuerySchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  deliveryStatus: z.string().optional(),
  orderId: z.string().optional(),
  branchId: z.string().optional(),
  carrier: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
})

// GET /api/shipments - List all shipments
export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const validation = await validateQuery(searchParams, listQuerySchema)
  if (!validation.success) return apiError(validation.error, 400)
  const { page, limit, skip } = parsePagination(searchParams)
  let { search, status, deliveryStatus, orderId, branchId, carrier, sortBy, sortOrder } = validation.data
  search = search || ''
  sortBy = sortBy || 'createdAt'
  sortOrder = (sortOrder || 'desc') as 'asc' | 'desc'

  const where: Prisma.ShipmentWhereInput = {}

  const conditions: Prisma.ShipmentWhereInput[] = []

  const searchWhere = buildSearchWhere<Prisma.ShipmentWhereInput>(search, [
    'id',
    'trackingNumber',
    'recipientName',
    'recipientPhone',
    'carrier',
  ])
  if (searchWhere) {
    conditions.push(searchWhere)
  }

  if (status && status !== 'all') {
    where.status = status as ShipmentStatus
  }

  if (deliveryStatus && deliveryStatus !== 'all') {
    where.deliveryStatus = deliveryStatus
  }

  if (orderId) {
    where.orderId = orderId
  }

  if (branchId && branchId !== 'all') {
    conditions.push({
      OR: [
        { order: { branchId } },
        { warranty: { branchSystemId: branchId } },
      ],
    })
  }

  if (carrier && carrier !== 'all') {
    where.carrier = carrier
  }

  if (conditions.length > 0) {
    if (where.AND) {
      const existing = Array.isArray(where.AND) ? where.AND : [where.AND]
      where.AND = [...existing, ...conditions]
    } else {
      where.AND = conditions
    }
  }

  // Build orderBy
  const sortDirection = (sortOrder || 'desc') === 'asc' ? 'asc' as const : 'desc' as const;
  let orderBy: Prisma.ShipmentOrderByWithRelationInput = { createdAt: sortDirection }
  if (sortBy === 'createdAt') {
    orderBy = { createdAt: sortDirection }
  } else if (sortBy === 'trackingNumber') {
    orderBy = { trackingNumber: sortDirection }
  } else if (sortBy === 'deliveryStatus') {
    orderBy = { deliveryStatus: sortDirection }
  } else if (sortBy === 'carrier') {
    orderBy = { carrier: sortDirection }
  }

  const [shipments, total] = await Promise.all([
    prisma.shipment.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        order: {
          select: {
            systemId: true,
            id: true,
            branchId: true,
            branchName: true,
            customerId: true,
            customerName: true,
            grandTotal: true,
            lineItems: {
              select: { quantity: true },
            },
            payments: {
              select: { amount: true },
            },
            packagings: {
              select: {
                systemId: true,
                requestDate: true,
                confirmDate: true,
                requestingEmployeeName: true,
                cancelingEmployeeName: true,
                deliveryStatus: true,
                shippingFeeToPartner: true,
                codAmount: true,
                reconciliationStatus: true,
                payer: true,
                partnerStatus: true,
              },
            },
            dispatchedByEmployeeName: true,
            customer: {
              select: {
                systemId: true,
                id: true,
                name: true,
                phone: true,
                addresses: true,
              },
            },
          },
        },
        warranty: {
          select: {
            systemId: true,
            id: true,
            supplierName: true,
            branchName: true,
          },
        },
      },
    }),
    prisma.shipment.count({ where }),
  ])

  // Transform to ShipmentView format
  const transformedShipments = shipments.map(shipment => {
    const order = shipment.order
    const warranty = shipment.warranty
    const customer = order?.customer
    const packaging = order?.packagings?.find(p => p.systemId === shipment.packagingSystemId)
    const totalPaid = order?.payments?.reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : Number(p.amount) || 0), 0) || 0
    
    // Extract shipping address from addresses JSON
    let shippingAddress = ''
    if (customer?.addresses) {
      try {
        const addresses = customer.addresses as Array<{ street?: string; ward?: string; province?: string; type?: string }> | null
        const shipping = addresses?.find(a => a.type === 'shipping') || addresses?.[0]
        if (shipping) {
          shippingAddress = [shipping.street, shipping.ward, shipping.province].filter(Boolean).join(', ')
        }
      } catch {
        shippingAddress = ''
      }
    }

    // Reference ID: order ID or warranty ID
    const referenceId = order?.id || warranty?.id || '-'
    const referenceType = warranty ? 'WARRANTY' : 'ORDER'

    return {
      ...shipment,
      customerName: order?.customerName || (warranty ? warranty.supplierName : '-'),
      customerPhone: customer?.phone || '-',
      customerAddress: shippingAddress,
      branchName: order?.branchName || warranty?.branchName || '-',
      packagingDate:
        packaging?.confirmDate?.toISOString()
        || packaging?.requestDate?.toISOString()
        || undefined,
      totalProductQuantity: order?.lineItems?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      customerDue: (typeof order?.grandTotal === 'number' ? order.grandTotal : Number(order?.grandTotal) || 0) - totalPaid,
      creatorEmployeeName: packaging?.requestingEmployeeName || '-',
      dispatchEmployeeName: order?.dispatchedByEmployeeName,
      cancelingEmployeeName: packaging?.cancelingEmployeeName,
      // Packaging fields
      deliveryStatus: packaging?.deliveryStatus,
      shippingFeeToPartner: packaging?.shippingFeeToPartner ? Number(packaging.shippingFeeToPartner) : undefined,
      codAmount: packaging?.codAmount ? Number(packaging.codAmount) : undefined,
      reconciliationStatus: packaging?.reconciliationStatus,
      payer: packaging?.payer,
      partnerStatus: packaging?.partnerStatus,
      // Reference info
      referenceId,
      referenceType,
      // Transform dates
      createdAt: shipment.createdAt?.toISOString(),
      dispatchedAt: shipment.dispatchedAt?.toISOString(),
      deliveredAt: shipment.deliveredAt?.toISOString(),
      cancelledAt: shipment.cancelledAt?.toISOString(),
      // Remove nested relations to reduce payload
      order: undefined,
      warranty: undefined,
    }
  })

  return apiPaginated(transformedShipments, { page, limit, total })
}, {
  rateLimit: { max: 60, windowMs: 60_000 }
})

// POST /api/shipments - Create new shipment
export const POST = apiHandler(async (request, { session }) => {
  const result = await validateBody(request, createShipmentSchema)
  if (!result.success) return apiError(result.error, 400)

  const body = result.data

  // Generate business ID
  if (!body.id) {
    const lastShipment = await prisma.shipment.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    })
    const lastNum = lastShipment?.id 
      ? parseInt(lastShipment.id.replace('VC', '')) 
      : 0
    body.id = `VC${String(lastNum + 1).padStart(6, '0')}`
  }

  // Generate system ID
  const lastShipmentForSystemId = await prisma.shipment.findFirst({
    orderBy: { systemId: 'desc' },
    select: { systemId: true },
    where: { systemId: { startsWith: 'SHIPMENT' } },
  });
  const lastSystemNum = lastShipmentForSystemId?.systemId 
    ? parseInt(lastShipmentForSystemId.systemId.replace('SHIPMENT', '')) || 0
    : 0;
  const shipmentSystemId = `SHIPMENT${String(lastSystemNum + 1).padStart(6, '0')}`;

  const shipment = await prisma.shipment.create({
    data: {
      systemId: shipmentSystemId,
      id: body.id,
      orderId: body.orderId,
      carrier: body.carrier || '',
      trackingNumber: body.trackingNumber,
      shippingFee: body.shippingFee || 0,
      status: (body.status || 'PENDING') as ShipmentStatus,
      deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : null,
      recipientName: body.recipientName || '',
      recipientPhone: body.recipientPhone || '',
      recipientAddress: body.recipientAddress || '',
      notes: body.notes,
    },
    select: {
      systemId: true, id: true, orderId: true, carrier: true, trackingNumber: true,
      shippingFee: true, status: true, deliveredAt: true, recipientName: true,
      recipientPhone: true, recipientAddress: true, notes: true,
      createdAt: true, updatedAt: true,
    },
  })

  // Fetch salespersonId separately
  const order = await prisma.order.findUnique({
    where: { systemId: body.orderId },
    select: { salespersonId: true },
  })
  const salespersonId = order?.salespersonId

  // Notify order salesperson about new shipment
  if (session && salespersonId && salespersonId !== session.user?.employeeId) {
    createNotification({
      type: 'shipment',
      title: 'Vận đơn mới',
      message: `Vận đơn ${shipment.id || shipment.systemId} đã được tạo cho đơn hàng ${body.orderId}`,
      link: `/shipments/${shipment.systemId}`,
      recipientId: salespersonId,
      senderId: session.user?.employeeId,
      senderName: session.user?.name,
      settingsKey: 'order:shipment',
    }).catch(e => logError('[Shipments POST] notification failed', e))
  }

  return apiSuccess({ ...shipment, salespersonId }, 201)
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
})
