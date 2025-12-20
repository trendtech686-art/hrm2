import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/shipments - List all shipments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const orderId = searchParams.get('orderId')

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { trackingNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
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

    return NextResponse.json({
      data: shipments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching shipments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipments' },
      { status: 500 }
    )
  }
}

// POST /api/shipments - Create new shipment
export async function POST(request: Request) {
  try {
    const body = await request.json()

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
        carrier: body.carrier,
        trackingNumber: body.trackingNumber,
        shippingFee: body.shippingFee || 0,
        status: body.status || 'PENDING',
        actualDelivery: body.deliveredAt ? new Date(body.deliveredAt) : null,
        recipientName: body.recipientName,
        recipientPhone: body.recipientPhone,
        recipientAddress: body.recipientAddress,
        notes: body.notes,
      },
      include: {
        order: true,
      },
    })

    return NextResponse.json(shipment, { status: 201 })
  } catch (error) {
    console.error('Error creating shipment:', error)
    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    )
  }
}
