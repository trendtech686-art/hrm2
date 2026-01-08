import { prisma } from '@/lib/prisma'
import { Prisma, OrderStatus, PaymentStatus, DeliveryMethod, DiscountType } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createOrderSchema } from './validation'

// Interface for order line item input
interface OrderLineItemInput {
  productSystemId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountType?: string;
  tax?: number;
  note?: string;
}

// GET /api/orders - List all orders
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')
    const branchId = searchParams.get('branchId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: Prisma.OrderWhereInput = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { trackingCode: { contains: search } },
      ]
    }

    if (status) {
      where.status = status as OrderStatus
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

    return apiPaginated(orders, { page, limit, total })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return apiError('Failed to fetch orders', 500)
  }
}

// POST /api/orders - Create new order
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createOrderSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

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
      return apiError('Customer not found', 400)
    }

    if (!branch) {
      return apiError('Branch not found', 400)
    }

    if (!body.salespersonId) {
      return apiError('Salesperson ID is required', 400)
    }

    // Calculate totals from line items
    let subtotal = 0
    const lineItemsData = await Promise.all(
      body.lineItems.map(async (item: OrderLineItemInput) => {
        const product = await prisma.product.findUnique({
          where: { systemId: item.productSystemId },
        })
        
        if (!product) {
          throw new Error(`Product ${item.productSystemId} not found`)
        }

        const itemTotal = item.quantity * item.unitPrice - (item.discount || 0)
        subtotal += itemTotal

        return {
          systemId: `OLI${String(Date.now()).slice(-8)}${Math.random().toString(36).slice(2, 6)}`,
          productId: product.systemId,
          productSku: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          discountType: item.discountType as DiscountType | undefined,
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
        status: (body.status || 'PENDING') as OrderStatus,
        paymentStatus: (body.paymentStatus || 'UNPAID') as PaymentStatus,
        deliveryMethod: (body.deliveryMethod || 'SHIPPING') as DeliveryMethod,
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

    return apiSuccess(order, 201)
  } catch (error) {
    console.error('Error creating order:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Order ID already exists', 400)
    }

    const message = error instanceof Error ? error.message : 'Failed to create order'
    return apiError(message, 500)
  }
}
