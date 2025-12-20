import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/purchase-orders - List all purchase orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const supplierId = searchParams.get('supplierId')

    const skip = (page - 1) * limit

    const where: any = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    const [orders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          supplier: true,
          items: {
            include: {
              product: {
                select: { systemId: true, id: true, name: true, imageUrl: true },
              },
            },
          },
          _count: { select: { items: true } },
        },
      }),
      prisma.purchaseOrder.count({ where }),
    ])

    return NextResponse.json({
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase orders' },
      { status: 500 }
    )
  }
}

// POST /api/purchase-orders - Create new purchase order
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID
    if (!body.id) {
      const lastOrder = await prisma.purchaseOrder.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastOrder?.id 
        ? parseInt(lastOrder.id.replace('PO', '')) 
        : 0
      body.id = `PO${String(lastNum + 1).padStart(6, '0')}`
    }

    const order = await prisma.purchaseOrder.create({
      data: {
        systemId: `PO${String(Date.now()).slice(-10).padStart(10, '0')}`,
        id: body.id,
        supplier: { connect: { systemId: body.supplierId } },
        orderDate: body.orderDate ? new Date(body.orderDate) : new Date(),
        expectedDate: body.expectedDate ? new Date(body.expectedDate) : null,
        status: body.status || 'DRAFT',
        subtotal: body.subtotal || 0,
        tax: body.tax || 0,
        discount: body.discount || 0,
        total: body.total || 0,
        notes: body.notes,
        items: {
          create: body.items?.map((item: any) => ({
            systemId: `POI${String(Date.now()).slice(-8)}${Math.random().toString(36).slice(2, 6)}`,
            id: `POI${String(Date.now()).slice(-6)}`,
            product: { connect: { systemId: item.productId } },
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            total: item.total,
          })) || [],
        },
      },
      include: {
        supplier: true,
        items: {
          include: { product: true },
        },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating purchase order:', error)
    return NextResponse.json(
      { error: 'Failed to create purchase order' },
      { status: 500 }
    )
  }
}
