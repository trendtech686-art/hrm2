import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/orders - List all orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')
    const branchId = searchParams.get('branchId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { trackingCode: { contains: search } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (customerId) {
      where.customerId = customerId
    }

    if (branchId) {
      where.branchId = branchId
    }

    if (startDate || endDate) {
      where.orderDate = {}
      if (startDate) {
        where.orderDate.gte = new Date(startDate)
      }
      if (endDate) {
        where.orderDate.lte = new Date(endDate)
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { orderDate: 'desc' },
        include: {
          customer: {
            select: {
              systemId: true,
              id: true,
              name: true,
              phone: true,
            },
          },
          branch: {
            select: {
              systemId: true,
              id: true,
              name: true,
            },
          },
          lineItems: {
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
          payments: true,
        },
      }),
      prisma.order.count({ where }),
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
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID if not provided
    if (!body.id) {
      const lastOrder = await prisma.order.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastOrder?.id 
        ? parseInt(lastOrder.id.replace('DH', '')) 
        : 0
      body.id = `DH${String(lastNum + 1).padStart(6, '0')}`
    }

    // Get customer and branch info
    const [customer, branch] = await Promise.all([
      prisma.customer.findUnique({ where: { systemId: body.customerId } }),
      prisma.branch.findUnique({ where: { systemId: body.branchId } }),
    ])

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 400 }
      )
    }

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 400 }
      )
    }

    // Calculate totals from line items
    let subtotal = 0
    const lineItemsData = await Promise.all(
      body.lineItems.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { systemId: item.productSystemId },
        })
        
        if (!product) {
          throw new Error(`Product ${item.productSystemId} not found`)
        }

        const itemTotal = item.quantity * item.unitPrice - (item.discount || 0)
        subtotal += itemTotal

        return {
          productId: product.systemId,
          productSku: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          discountType: item.discountType,
          tax: item.tax || 0,
          total: itemTotal,
          note: item.note,
        }
      })
    )

    const tax = body.tax || 0
    const shippingFee = body.shippingFee || 0
    const discount = body.discount || 0
    const grandTotal = subtotal + tax + shippingFee - discount

    const order = await prisma.order.create({
      data: {
        systemId: `ORDER${String(Date.now()).slice(-10).padStart(10, '0')}`,
        id: body.id,
        customerId: body.customerId,
        customerName: customer.name,
        branchId: body.branchId,
        salespersonId: body.salespersonId,
        branchName: branch.name,
        salespersonName: body.salespersonName || 'N/A',
        orderDate: body.orderDate ? new Date(body.orderDate) : new Date(),
        expectedDeliveryDate: body.expectedDeliveryDate ? new Date(body.expectedDeliveryDate) : null,
        shippingAddress: body.shippingAddress,
        status: body.status || 'PENDING',
        paymentStatus: body.paymentStatus || 'UNPAID',
        deliveryMethod: body.deliveryMethod || 'SHIPPING',
        subtotal,
        shippingFee,
        tax,
        discount,
        grandTotal,
        notes: body.notes,
        source: body.source,
        createdBy: body.createdBy,
        lineItems: {
          create: lineItemsData,
        },
      },
      include: {
        customer: true,
        branch: true,
        lineItems: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Order ID already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
