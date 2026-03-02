import { prisma } from '@/lib/prisma'
import { Prisma, PurchaseOrderStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createPurchaseOrderSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { generateIdWithPrefix } from '@/lib/id-generator'

// Interface for purchase order item input
interface PurchaseOrderItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total?: number;
}

// Map Vietnamese status to Prisma enum
function mapStatusToPrismaEnum(status?: string): PurchaseOrderStatus {
  if (!status) return 'DRAFT';
  
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
  };
  
  return statusMap[status] || 'DRAFT';
}

// Map Prisma enum back to Vietnamese for display
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
    const branchId = searchParams.get('branchId')
    const paymentStatus = searchParams.get('paymentStatus')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    const where: Prisma.PurchaseOrderWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status && status !== 'all') {
      where.status = status as PurchaseOrderStatus
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    if (branchId && branchId !== 'all') {
      where.branchSystemId = branchId
    }

    if (paymentStatus && paymentStatus !== 'all') {
      where.paymentStatus = paymentStatus
    }

    // Build orderBy
    const orderBy: Prisma.PurchaseOrderOrderByWithRelationInput = { [sortBy]: sortOrder }

    const [orders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          supplier: true,
          items: {
            include: {
              product: {
                select: { systemId: true, id: true, name: true, imageUrl: true, unit: true },
              },
            },
          },
          _count: { select: { items: true } },
        },
      }),
      prisma.purchaseOrder.count({ where }),
    ])

    // Transform orders for frontend compatibility
    const transformedOrders = orders.map(order => ({
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
      orderDate: order.orderDate?.toISOString() || null,
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
      discountType: order.discountType || 'fixed',
      shippingFee: Number(order.shippingFee) || 0,
      tax: Number(order.tax) || 0,
      grandTotal: Number(order.grandTotal) || Number(order.total),
      // Additional fields
      payments: [],
      inventoryReceiptIds: order.inventoryReceiptIds || [],
    }));

    return apiPaginated(transformedOrders, { page, limit, total })
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
    
    // Debug log để kiểm tra body
    console.log('[API POST] Body received:', {
      branchSystemId: body.branchSystemId,
      branchName: body.branchName,
      buyerSystemId: body.buyerSystemId,
      buyer: body.buyer,
      creatorSystemId: body.creatorSystemId,
      creatorName: body.creatorName,
      supplierId: body.supplierId,
      supplierName: body.supplierName,
    })

    const order = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'purchase-orders',
        body.id?.trim() || undefined
      );

      // Pre-fetch all products để validate và lấy thông tin
      const itemsData: Array<{
        systemId: string;
        productId: string;
        productName: string;
        productSku: string;
        quantity: number;
        unitPrice: number;
        discount: number;
        total: number;
      }> = [];

      if (body.items && body.items.length > 0) {
        for (const item of body.items as PurchaseOrderItemInput[]) {
          const product = await tx.product.findUnique({
            where: { systemId: item.productId },
            select: { systemId: true, id: true, name: true }
          });
          if (!product) throw new Error(`Product ${item.productId} not found`);
          
          itemsData.push({
            systemId: await generateIdWithPrefix('POI', tx as unknown as typeof prisma),
            productId: product.systemId,
            productName: product.name,
            productSku: product.id || '',
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            total: item.total || (item.quantity * item.unitPrice - (item.discount || 0)),
          });
        }
      }

      return tx.purchaseOrder.create({
        data: {
          systemId,
          id: businessId,
          supplier: { connect: { systemId: body.supplierId } },
          // Denormalized supplier info
          supplierSystemId: body.supplierId,
          supplierName: body.supplierName || '',
          // Branch info
          branchSystemId: body.branchSystemId || null,
          branchName: body.branchName || '',
          // Buyer/creator info
          buyerSystemId: body.buyerSystemId || null,
          buyer: body.buyer || '',
          creatorSystemId: body.creatorSystemId || null,
          creatorName: body.creatorName || '',
          // Dates
          orderDate: body.orderDate ? new Date(body.orderDate) : new Date(),
          expectedDate: body.expectedDate ? new Date(body.expectedDate) : null,
          deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
          // Status
          status: mapStatusToPrismaEnum(body.status),
          deliveryStatus: body.deliveryStatus || 'Chưa nhập',
          paymentStatus: body.paymentStatus || 'Chưa thanh toán',
          // Financial
          subtotal: body.subtotal || 0,
          tax: body.tax || 0,
          discount: body.discount || 0,
          discountType: body.discountType || 'fixed',
          shippingFee: body.shippingFee || 0,
          total: body.total || 0,
          grandTotal: body.grandTotal || body.total || 0,
          // Other
          notes: body.notes,
          reference: body.reference || null,
          items: itemsData.length > 0 ? { create: itemsData } : undefined,
        },
        include: {
          supplier: true,
          items: {
            include: { product: true },
          },
        },
      });
    });

    return apiSuccess(order, 201)
  } catch (error) {
    console.error('Error creating purchase order:', error)
    // Return more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return apiError(`Failed to create purchase order: ${errorMessage}`, 500)
  }
}
