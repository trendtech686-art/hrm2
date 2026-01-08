import { prisma } from '@/lib/prisma'
import { Prisma, PurchaseOrderStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createPurchaseOrderSchema } from './validation'

// Interface for purchase order item input
interface PurchaseOrderItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total?: number;
}

// GET /api/purchase-orders - List all purchase orders
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const supplierId = searchParams.get('supplierId')

    const where: Prisma.PurchaseOrderWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status as PurchaseOrderStatus
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

    return apiPaginated(orders, { page, limit, total })
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    return apiError('Failed to fetch purchase orders', 500)
  }
}

// POST /api/purchase-orders - Create new purchase order
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createPurchaseOrderSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

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
        status: (body.status || 'DRAFT') as PurchaseOrderStatus,
        subtotal: body.subtotal || 0,
        tax: body.tax || 0,
        discount: body.discount || 0,
        total: body.total || 0,
        notes: body.notes,
        items: {
          create: await Promise.all(body.items?.map(async (item: PurchaseOrderItemInput) => {
            const product = await prisma.product.findUnique({
              where: { systemId: item.productId },
              select: { systemId: true, id: true, name: true }
            })
            if (!product) throw new Error(`Product ${item.productId} not found`)
            return {
              systemId: `POI${String(Date.now()).slice(-8)}${Math.random().toString(36).slice(2, 6)}`,
              productId: product.systemId,
              productName: product.name,
              productSku: product.id,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount || 0,
              total: item.total || (item.quantity * item.unitPrice - (item.discount || 0)),
            }
          }) || []),
        },
      },
      include: {
        supplier: true,
        items: {
          include: { product: true },
        },
      },
    })

    return apiSuccess(order, 201)
  } catch (error) {
    console.error('Error creating purchase order:', error)
    return apiError('Failed to create purchase order', 500)
  }
}
