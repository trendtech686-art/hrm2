import { prisma } from '@/lib/prisma'
import { Prisma, PurchaseOrderStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updatePurchaseOrderSchema } from './validation'

// Interface for purchase order item input
interface PurchaseOrderItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total?: number;
}

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/purchase-orders/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const order = await prisma.purchaseOrder.findUnique({
      where: { systemId },
      include: {
        supplier: true,
        items: {
          include: {
            product: {
              select: {
                systemId: true,
                id: true,
                name: true,
                imageUrl: true,
                unit: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return apiError('Đơn mua hàng không tồn tại', 404)
    }

    return apiSuccess(order)
  } catch (error) {
    console.error('Error fetching purchase order:', error)
    return apiError('Failed to fetch purchase order', 500)
  }
}

// PUT /api/purchase-orders/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updatePurchaseOrderSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    // Delete existing items and recreate if items provided
    if (body.items) {
      await prisma.purchaseOrderItem.deleteMany({
        where: { purchaseOrderId: systemId },
      })
    }

    const order = await prisma.purchaseOrder.update({
      where: { systemId },
      data: {
        supplierId: body.supplierId,
        orderDate: body.orderDate ? new Date(body.orderDate) : undefined,
        expectedDate: body.expectedDate ? new Date(body.expectedDate) : undefined,
        receivedDate: body.receivedDate ? new Date(body.receivedDate) : undefined,
        status: body.status as PurchaseOrderStatus | undefined,
        subtotal: body.subtotal,
        tax: body.tax,
        discount: body.discount,
        total: body.total,
        notes: body.notes,
        items: body.items ? {
          create: await Promise.all(body.items.map(async (item: PurchaseOrderItemInput) => {
            const product = await prisma.product.findUnique({
              where: { systemId: item.productId },
              select: { systemId: true, id: true, name: true }
            })
            if (!product) throw new Error(`Product ${item.productId} not found`)
            return {
              systemId: `POI${String(Date.now()).slice(-6).padStart(6, '0')}${Math.random().toString(36).slice(2, 5)}`,
              productId: product.systemId,
              productName: product.name,
              productSku: product.id,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount || 0,
              total: item.total ?? item.quantity * item.unitPrice,
            }
          })),
        } : undefined,
      },
      include: {
        supplier: true,
        items: {
          include: { product: true },
        },
      },
    })

    return apiSuccess(order)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiError('Đơn mua hàng không tồn tại', 404)
    }
    console.error('Error updating purchase order:', error)
    return apiError('Failed to update purchase order', 500)
  }
}

// DELETE /api/purchase-orders/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.purchaseOrder.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiError('Đơn mua hàng không tồn tại', 404)
    }
    console.error('Error deleting purchase order:', error)
    return apiError('Failed to delete purchase order', 500)
  }
}
