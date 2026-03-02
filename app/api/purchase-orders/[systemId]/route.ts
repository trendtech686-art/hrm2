import { prisma } from '@/lib/prisma'
import { Prisma, PurchaseOrderStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updatePurchaseOrderSchema } from './validation'
import { generateIdWithPrefix } from '@/lib/id-generator'

// Interface for purchase order item input
interface PurchaseOrderItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total?: number;
}

// Helper to serialize Decimal fields for client
function serializePurchaseOrder<T extends { 
  subtotal?: Prisma.Decimal | number | null;
  discount?: Prisma.Decimal | number | null;
  tax?: Prisma.Decimal | number | null;
  total?: Prisma.Decimal | number | null;
  paid?: Prisma.Decimal | number | null;
  debt?: Prisma.Decimal | number | null;
  shippingFee?: Prisma.Decimal | number | null;
  items?: { unitPrice?: Prisma.Decimal | number | null; discount?: Prisma.Decimal | number | null; total?: Prisma.Decimal | number | null }[];
}>(order: T) {
  return {
    ...order,
    subtotal: order.subtotal !== null && order.subtotal !== undefined ? Number(order.subtotal) : 0,
    discount: order.discount !== null && order.discount !== undefined ? Number(order.discount) : 0,
    tax: order.tax !== null && order.tax !== undefined ? Number(order.tax) : 0,
    total: order.total !== null && order.total !== undefined ? Number(order.total) : 0,
    grandTotal: order.total !== null && order.total !== undefined ? Number(order.total) : 0,
    paid: order.paid !== null && order.paid !== undefined ? Number(order.paid) : 0,
    debt: order.debt !== null && order.debt !== undefined ? Number(order.debt) : 0,
    shippingFee: order.shippingFee !== null && order.shippingFee !== undefined ? Number(order.shippingFee) : 0,
    items: order.items?.map(item => ({
      ...item,
      unitPrice: item.unitPrice !== null && item.unitPrice !== undefined ? Number(item.unitPrice) : 0,
      discount: item.discount !== null && item.discount !== undefined ? Number(item.discount) : 0,
      total: item.total !== null && item.total !== undefined ? Number(item.total) : 0,
    })),
  };
}

// Map Vietnamese status to Prisma enum
function mapStatusToPrismaEnum(status?: string): PurchaseOrderStatus | undefined {
  if (!status) return undefined;
  
  const statusMap: Record<string, PurchaseOrderStatus> = {
    // Vietnamese names
    'Đặt hàng': 'PENDING',
    'Đang giao dịch': 'CONFIRMED',
    'Hoàn thành': 'COMPLETED',
    'Đã hủy': 'CANCELLED',
    'Kết thúc': 'COMPLETED',
    'Đã trả hàng': 'CANCELLED',
    // English names (already valid)
    'DRAFT': 'DRAFT',
    'PENDING': 'PENDING',
    'CONFIRMED': 'CONFIRMED',
    'RECEIVING': 'RECEIVING',
    'COMPLETED': 'COMPLETED',
    'CANCELLED': 'CANCELLED',
    // Lowercase English (from frontend)
    'draft': 'DRAFT',
    'pending': 'PENDING',
    'confirmed': 'CONFIRMED',
    'receiving': 'RECEIVING',
    'completed': 'COMPLETED',
    'cancelled': 'CANCELLED',
  };
  
  return statusMap[status];
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

    // Transform items to lineItems for frontend compatibility
    const transformedOrder = {
      ...order,
      // Map to frontend expected fields
      supplierSystemId: order.supplierId,
      supplierName: order.supplier?.name || order.supplierName || '',
      branchSystemId: order.branchSystemId || '',
      branchName: order.branchName || '',
      buyerSystemId: order.buyerSystemId || '',
      buyer: order.buyer || '',
      creatorSystemId: order.creatorSystemId || '',
      creatorName: order.creatorName || '',
      deliveryDate: order.expectedDate?.toISOString() || order.deliveryDate?.toISOString() || null,
      // Map Prisma status to frontend status
      status: mapPrismaStatusToVietnamese(order.status),
      deliveryStatus: order.deliveryStatus || 'Chưa nhập',
      paymentStatus: order.paymentStatus || 'Chưa thanh toán',
      returnStatus: order.returnStatus || 'Chưa hoàn trả',
      refundStatus: order.refundStatus || 'Chưa hoàn tiền',
      // Transform items to lineItems
      lineItems: order.items.map(item => ({
        systemId: item.systemId,
        productSystemId: item.productId,
        productId: item.product?.id || item.productSku,
        productName: item.productName,
        sku: item.productSku,
        unit: item.product?.unit || 'Cái',
        imageUrl: item.product?.imageUrl || null,
        quantity: item.quantity,
        receivedQuantity: item.receivedQty || 0,
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount) || 0,
        discountType: 'fixed' as const,
        tax: 0,
        total: Number(item.total),
        notes: null,
      })),
      // Financial fields
      subtotal: Number(order.subtotal),
      discount: Number(order.discount) || 0,
      discountType: order.discountType || 'fixed' as const,
      shippingFee: Number(order.shippingFee) || 0,
      tax: Number(order.tax) || 0,
      grandTotal: Number(order.total),
      // Additional fields
      payments: [],
      inventoryReceiptIds: [],
    };

    return apiSuccess(transformedOrder)
  } catch (error) {
    console.error('Error fetching purchase order:', error)
    return apiError('Failed to fetch purchase order', 500)
  }
}

// Helper to map Prisma enum back to Vietnamese
function mapPrismaStatusToVietnamese(status: PurchaseOrderStatus): string {
  const statusMap: Record<PurchaseOrderStatus, string> = {
    'DRAFT': 'Đặt hàng',
    'PENDING': 'Đặt hàng',
    'CONFIRMED': 'Đang giao dịch',
    'RECEIVING': 'Đang giao dịch',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy',
  };
  return statusMap[status] || 'Đặt hàng';
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
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : undefined,
        status: mapStatusToPrismaEnum(body.status),
        deliveryStatus: body.deliveryStatus,
        paymentStatus: body.paymentStatus,
        // Financial
        subtotal: body.subtotal,
        tax: body.tax,
        discount: body.discount,
        shippingFee: body.shippingFee,
        total: body.total,
        grandTotal: body.grandTotal,
        notes: body.notes,
        items: body.items ? {
          create: await Promise.all(body.items.map(async (item: PurchaseOrderItemInput) => {
            const product = await prisma.product.findUnique({
              where: { systemId: item.productId },
              select: { systemId: true, id: true, name: true }
            })
            if (!product) throw new Error(`Product ${item.productId} not found`)
            return {
              systemId: await generateIdWithPrefix('POI', prisma),
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

    return apiSuccess(serializePurchaseOrder(order))
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiError('Đơn mua hàng không tồn tại', 404)
    }
    console.error('Error updating purchase order:', error)
    return apiError('Failed to update purchase order', 500)
  }
}

// PATCH /api/purchase-orders/[systemId] - Same as PUT for partial updates
export async function PATCH(request: Request, { params }: RouteParams) {
  return PUT(request, { params })
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
