import { prisma } from '@/lib/prisma'
import { Prisma, ShipmentStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createShipmentSchema } from './validation'

// GET /api/shipments - List all shipments
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const deliveryStatus = searchParams.get('deliveryStatus')
    const orderId = searchParams.get('orderId')
    const branchId = searchParams.get('branchId')
    const carrier = searchParams.get('carrier')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    const where: Prisma.ShipmentWhereInput = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { trackingNumber: { contains: search, mode: 'insensitive' } },
        { recipientName: { contains: search, mode: 'insensitive' } },
        { recipientPhone: { contains: search, mode: 'insensitive' } },
        { carrier: { contains: search, mode: 'insensitive' } },
      ]
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
      where.order = { branchId }
    }

    if (carrier && carrier !== 'all') {
      where.carrier = carrier
    }

    // Build orderBy
    let orderBy: Prisma.ShipmentOrderByWithRelationInput = { createdAt: sortOrder }
    if (sortBy === 'createdAt') {
      orderBy = { createdAt: sortOrder }
    } else if (sortBy === 'trackingNumber') {
      orderBy = { trackingNumber: sortOrder }
    } else if (sortBy === 'deliveryStatus') {
      orderBy = { deliveryStatus: sortOrder }
    } else if (sortBy === 'carrier') {
      orderBy = { carrier: sortOrder }
    }

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
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
                  email: true,
                  addresses: true,
                },
              },
            },
          },
        },
      }),
      prisma.shipment.count({ where }),
    ])

    // Transform to ShipmentView format
    const transformedShipments = shipments.map(shipment => {
      const order = shipment.order
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

      return {
        ...shipment,
        customerName: order?.customerName || '-',
        customerPhone: customer?.phone || '-',
        customerAddress: shippingAddress,
        customerEmail: customer?.email || '-',
        branchName: order?.branchName || '-',
        packagingDate: packaging?.confirmDate?.toISOString() || undefined,
        totalProductQuantity: order?.lineItems?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        customerDue: (typeof order?.grandTotal === 'number' ? order.grandTotal : Number(order?.grandTotal) || 0) - totalPaid,
        creatorEmployeeName: packaging?.requestingEmployeeName || '-',
        dispatchEmployeeName: order?.dispatchedByEmployeeName,
        cancelingEmployeeName: packaging?.cancelingEmployeeName,
        // ✅ Include packaging fields for shipment view
        deliveryStatus: packaging?.deliveryStatus,
        shippingFeeToPartner: packaging?.shippingFeeToPartner ? Number(packaging.shippingFeeToPartner) : undefined,
        codAmount: packaging?.codAmount ? Number(packaging.codAmount) : undefined,
        reconciliationStatus: packaging?.reconciliationStatus,
        payer: packaging?.payer,
        partnerStatus: packaging?.partnerStatus,
        // Transform dates
        createdAt: shipment.createdAt?.toISOString(),
        dispatchedAt: shipment.dispatchedAt?.toISOString(),
        deliveredAt: shipment.deliveredAt?.toISOString(),
        cancelledAt: shipment.cancelledAt?.toISOString(),
        // Remove nested order to reduce payload
        order: undefined,
      }
    })

    return apiPaginated(transformedShipments, { page, limit, total })
  } catch (error) {
    console.error('Error fetching shipments:', error)
    return apiError('Failed to fetch shipments', 500)
  }
}

// POST /api/shipments - Create new shipment
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createShipmentSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
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
      include: {
        order: true,
      },
    })

    return apiSuccess(shipment, 201)
  } catch (error) {
    console.error('Error creating shipment:', error)
    return apiError('Failed to create shipment', 500)
  }
}
