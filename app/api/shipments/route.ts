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
    const orderId = searchParams.get('orderId')

    const where: Prisma.ShipmentWhereInput = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { trackingNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status as ShipmentStatus
    }

    if (orderId) {
      where.orderId = orderId
    }

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            include: {
              customer: {
                select: { id: true, name: true },
              },
            },
          },
        },
      }),
      prisma.shipment.count({ where }),
    ])

    return apiPaginated(shipments, { page, limit, total })
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
        ? parseInt(lastShipment.id.replace('SH', '')) 
        : 0
      body.id = `SH${String(lastNum + 1).padStart(6, '0')}`
    }

    const shipment = await prisma.shipment.create({
      data: {
        systemId: `SHIP${String(Date.now()).slice(-10).padStart(10, '0')}`,
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
