import { prisma } from '@/lib/prisma'
import { Prisma, ComplaintPriority, ComplaintStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateComplaintSchema } from './validation'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/complaints/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const complaint = await prisma.complaint.findUnique({
      where: { systemId },
      include: {
        customer: true,
        employees: true,
      },
    })

    if (!complaint) {
      return apiError('Khiếu nại không tồn tại', 404)
    }

    // ⭐ Also fetch the related order (manual join since no Prisma relation)
    let relatedOrderData: Record<string, unknown> | null = null;
    // ✅ Try orderId (systemId) first, then fallback to orderCode (business ID)
    const orderLookup = complaint.orderId 
      ? { systemId: complaint.orderId } 
      : complaint.orderCode 
        ? { id: complaint.orderCode } 
        : null;
    if (orderLookup) {
      const order = await prisma.order.findUnique({
        where: orderLookup,
        include: {
          customer: true,
          branch: true,
          packagings: {
            include: {
              shipment: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      if (order) {
        relatedOrderData = {
          systemId: order.systemId,
          id: order.id,
          customerName: order.customerName,
          customerPhone: order.customer?.phone || null,
          branchSystemId: order.branchId,
          branchName: order.branchName || order.branch?.name || null,
          salesperson: order.salespersonName,
          salespersonSystemId: order.salespersonId,
          orderDate: order.orderDate,
          expectedDeliveryDate: order.expectedDeliveryDate,
          grandTotal: Number(order.grandTotal),
          paidAmount: Number(order.paidAmount),
          shippingAddress: order.shippingAddress,
          status: order.status,
          paymentStatus: order.paymentStatus,
          deliveryStatus: order.deliveryStatus,
          packagings: order.packagings.map(pkg => ({
            systemId: pkg.systemId,
            trackingCode: pkg.trackingCode || pkg.shipment?.trackingCode || null,
            requestDate: pkg.requestDate,
            status: pkg.status,
          })),
        };
      }
    }

    // ⭐ Helper: Map Prisma status back to frontend values
    const mapStatusFromPrisma = (status: string) => {
      switch (status) {
        case 'OPEN': return 'pending';
        case 'IN_PROGRESS': return 'investigating';
        case 'RESOLVED': return 'resolved';
        case 'CLOSED':
          if (complaint.cancelledAt) return 'cancelled';
          if (complaint.endedAt) return 'ended';
          return 'cancelled';
        default: return status;
      }
    };

    // ⭐ Enrich affected products with images and business IDs from product DB
    let enrichedAffectedProducts = complaint.affectedProducts;
    if (Array.isArray(complaint.affectedProducts) && complaint.affectedProducts.length > 0) {
      const productItems = complaint.affectedProducts as Array<Record<string, unknown>>;
      // Collect unique product IDs (stored productId may actually be systemId)
      const productIds = [...new Set(productItems.map(p => p.productId as string).filter(Boolean))];
      const productSystemIds = [...new Set(productItems.map(p => p.productSystemId as string).filter(Boolean))];
      const allLookupIds = [...new Set([...productIds, ...productSystemIds])];
      
      // Batch fetch products by systemId OR business id
      const products = allLookupIds.length > 0 ? await prisma.product.findMany({
        where: {
          OR: [
            { systemId: { in: allLookupIds } },
            { id: { in: allLookupIds } },
          ],
        },
        select: { systemId: true, id: true, name: true, thumbnailImage: true, imageUrl: true, galleryImages: true, productTypeSystemId: true },
      }) : [];

      // Create lookup maps
      const productBySystemId = new Map(products.map(p => [p.systemId, p]));
      const productByBusinessId = new Map(products.map(p => [p.id, p]));

      enrichedAffectedProducts = productItems.map(item => {
        const prod = productBySystemId.get(item.productId as string) 
          || productBySystemId.get(item.productSystemId as string)
          || productByBusinessId.get(item.productId as string);
        return {
          ...item,
          // ✅ Ensure productSystemId is always set
          productSystemId: (prod?.systemId || item.productSystemId || item.productId) as string,
          // ✅ Override productId with actual business ID
          productBusinessId: prod?.id || null,
          // ✅ Include product image
          productImage: prod?.thumbnailImage || prod?.imageUrl || null,
          productTypeSystemId: prod?.productTypeSystemId || null,
        };
      });
    }

    // ⭐ Map DB fields to TypeScript types + serialize Decimal
    const mappedComplaint = {
      ...complaint,
      status: mapStatusFromPrisma(complaint.status as string),
      assignedTo: complaint.assigneeId, // Map assigneeId -> assignedTo for frontend
      orderSystemId: complaint.orderId || (relatedOrderData?.systemId as string) || null, // ✅ Fallback to order's systemId
      customerSystemId: complaint.customerId, // Map customerId -> customerSystemId
      customerPhone: complaint.customerPhone || relatedOrderData?.customerPhone || null, // ✅ Fallback to order's customer phone
      orderCode: complaint.orderCode || (relatedOrderData?.id as string) || null, // ✅ Fallback to order's business ID
      branchName: complaint.branchName || (relatedOrderData?.branchName as string) || null, // ✅ Fallback to order's branch
      orderValue: complaint.orderValue ? Number(complaint.orderValue) : null, // ✅ Serialize Decimal
      timeline: complaint.timeline || [], // ✅ Ensure timeline is always array
      affectedProducts: enrichedAffectedProducts, // ✅ Enriched with product images & business IDs
      relatedOrder: relatedOrderData, // ✅ Include order data inline
    };

    return apiSuccess(mappedComplaint)
  } catch (error) {
    console.error('Error fetching complaint:', error)
    return apiError('Failed to fetch complaint', 500)
  }
}

// PUT /api/complaints/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateComplaintSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const complaint = await prisma.complaint.update({
      where: { systemId },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        priority: body.priority as ComplaintPriority | undefined,
        status: body.status as ComplaintStatus | undefined,
        assigneeId: body.assigneeId || body.assignedTo,
        resolution: body.resolution,
        resolvedAt: body.resolvedAt ? new Date(body.resolvedAt) : undefined,
      },
      include: {
        customer: true,
      },
    })

    return apiSuccess(complaint)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiError('Khiếu nại không tồn tại', 404)
    }
    console.error('Error updating complaint:', error)
    return apiError('Failed to update complaint', 500)
  }
}

// DELETE /api/complaints/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.complaint.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiError('Khiếu nại không tồn tại', 404)
    }
    console.error('Error deleting complaint:', error)
    return apiError('Failed to delete complaint', 500)
  }
}
