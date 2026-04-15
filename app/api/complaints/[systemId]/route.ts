import { prisma } from '@/lib/prisma'
import { Prisma, ComplaintPriority, ComplaintStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateComplaintSchema } from './validation'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { notifyComplaintAssigned, notifyComplaintStatusChanged } from '@/lib/complaint-notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/complaints/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

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

    // ⚡ PERFORMANCE: Prepare all lookup IDs upfront, then run ALL queries in parallel
    
    // 1. Order lookup params
    const orderLookup = complaint.orderId 
      ? { systemId: complaint.orderId } 
      : complaint.orderCode 
        ? { id: complaint.orderCode } 
        : null;

    // 2. Product IDs for enrichment
    const productItems = Array.isArray(complaint.affectedProducts) && complaint.affectedProducts.length > 0
      ? complaint.affectedProducts as Array<Record<string, unknown>>
      : [];
    const productIds = [...new Set(productItems.map(p => p.productId as string).filter(Boolean))];
    const productSystemIds = [...new Set(productItems.map(p => p.productSystemId as string).filter(Boolean))];
    const allProductLookupIds = [...new Set([...productIds, ...productSystemIds])];

    // 3. Compensation entity IDs from timeline
    const timelineActions = Array.isArray(complaint.timeline) ? complaint.timeline as Array<Record<string, unknown>> : [];
    const verifiedCorrectActions = timelineActions.filter(a => a.actionType === 'verified-correct');
    const allPaymentIds = new Set<string>();
    const allReceiptIds = new Set<string>();
    const allInventoryCheckIds = new Set<string>();
    const allPenaltyIds = new Set<string>();
    for (const action of verifiedCorrectActions) {
      const meta = action.metadata as Record<string, unknown> | undefined;
      if (!meta) continue;
      if (meta.paymentSystemId) allPaymentIds.add(meta.paymentSystemId as string);
      if (meta.receiptSystemId) allReceiptIds.add(meta.receiptSystemId as string);
      if (meta.inventoryCheckSystemId) allInventoryCheckIds.add(meta.inventoryCheckSystemId as string);
      if (Array.isArray(meta.penaltySystemIds)) {
        for (const id of meta.penaltySystemIds) if (id) allPenaltyIds.add(id as string);
      }
    }

    // ⚡ Run ALL secondary queries in parallel
    const [orderResult, productsResult, assigneeResult, payments, receipts, inventoryChecks, penalties] = await Promise.all([
      // Order
      orderLookup
        ? prisma.order.findUnique({
            where: orderLookup,
            include: {
              customer: true,
              branch: true,
              packagings: { include: { shipment: true }, orderBy: { createdAt: 'desc' } },
            },
          })
        : Promise.resolve(null),
      // Products for enrichment
      allProductLookupIds.length > 0
        ? prisma.product.findMany({
            where: { OR: [{ systemId: { in: allProductLookupIds } }, { id: { in: allProductLookupIds } }] },
            select: { systemId: true, id: true, name: true, thumbnailImage: true, imageUrl: true, galleryImages: true, productTypeSystemId: true },
          })
        : Promise.resolve([]),
      // Assignee
      complaint.assigneeId
        ? prisma.employee.findFirst({ where: { systemId: complaint.assigneeId }, select: { fullName: true } })
        : Promise.resolve(null),
      // Compensation entities
      allPaymentIds.size > 0
        ? prisma.payment.findMany({ where: { systemId: { in: [...allPaymentIds] } }, select: { systemId: true, id: true, amount: true, status: true, cancelledAt: true } })
        : Promise.resolve([]),
      allReceiptIds.size > 0
        ? prisma.receipt.findMany({ where: { systemId: { in: [...allReceiptIds] } }, select: { systemId: true, id: true, amount: true, status: true, cancelledAt: true } })
        : Promise.resolve([]),
      allInventoryCheckIds.size > 0
        ? prisma.inventoryCheck.findMany({ where: { systemId: { in: [...allInventoryCheckIds] } }, include: { items: true } })
        : Promise.resolve([]),
      allPenaltyIds.size > 0
        ? prisma.penalty.findMany({ where: { systemId: { in: [...allPenaltyIds] } } })
        : Promise.resolve([]),
    ]);

    // Process order data
    let relatedOrderData: Record<string, unknown> | null = null;
    if (orderResult) {
      const order = orderResult;
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

    // Process product enrichment
    let enrichedAffectedProducts = complaint.affectedProducts;
    if (productItems.length > 0) {
      const products = productsResult as Array<{ systemId: string; id: string; name: string; thumbnailImage: string | null; imageUrl: string | null; galleryImages: unknown; productTypeSystemId: string | null }>;
      const productBySystemId = new Map(products.map(p => [p.systemId, p]));
      const productByBusinessId = new Map(products.map(p => [p.id, p]));
      enrichedAffectedProducts = productItems.map(item => {
        const prod = productBySystemId.get(item.productId as string) 
          || productBySystemId.get(item.productSystemId as string)
          || productByBusinessId.get(item.productId as string);
        return {
          ...item,
          productSystemId: (prod?.systemId || item.productSystemId || item.productId) as string,
          productBusinessId: prod?.id || null,
          productImage: prod?.thumbnailImage || prod?.imageUrl || null,
          productTypeSystemId: prod?.productTypeSystemId || null,
        };
      });
    }

    // Process assignee
    const assignedToName = assigneeResult?.fullName || null;

    // Helper: normalize penalty status to Vietnamese
    const mapPenaltyStatus = (status: string): string => {
      switch (status) {
        case 'pending': return 'Chưa thanh toán';
        case 'paid': case 'DEDUCTED': return 'Đã thanh toán';
        case 'cancelled': return 'Đã hủy';
        default: return status;
      }
    };

    // Build lookup maps for frontend
    const compensationEntities = {
      payments: Object.fromEntries(payments.map(p => [p.systemId, {
        systemId: p.systemId, id: p.id, amount: Number(p.amount), status: p.status, cancelledAt: p.cancelledAt,
      }])),
      receipts: Object.fromEntries(receipts.map(r => [r.systemId, {
        systemId: r.systemId, id: r.id, amount: Number(r.amount), status: r.status, cancelledAt: r.cancelledAt,
      }])),
      inventoryChecks: Object.fromEntries(inventoryChecks.map(ic => [ic.systemId, {
        systemId: ic.systemId, id: ic.id, status: ic.status?.toLowerCase(),
        cancelledAt: ic.cancelledAt,
        items: ic.items.map(item => ({
          productName: item.productName,
          difference: item.difference,
        })),
      }])),
      penalties: Object.fromEntries(penalties.map(p => [p.systemId, {
        systemId: p.systemId, id: p.id,
        amount: typeof p.amount === 'object' && p.amount !== null && 'toNumber' in (p.amount as object)
          ? (p.amount as { toNumber(): number }).toNumber() : Number(p.amount),
        penaltyTypeName: p.penaltyTypeName,
        employeeName: p.employeeName,
        status: mapPenaltyStatus(String(p.status || 'Chưa thanh toán')),
      }])),
    };

    // ⭐ Map DB fields to TypeScript types + serialize Decimal
    const mappedComplaint = {
      ...complaint,
      status: mapStatusFromPrisma(complaint.status as string),
      assignedTo: complaint.assigneeId, // Map assigneeId -> assignedTo for frontend
      assignedToName,
      orderSystemId: complaint.orderId || (relatedOrderData?.systemId as string) || null, // ✅ Fallback to order's systemId
      customerSystemId: complaint.customerId || (orderResult?.customer?.systemId) || null, // Map customerId -> customerSystemId, fallback to order's customer
      customerPhone: complaint.customerPhone || relatedOrderData?.customerPhone || null, // ✅ Fallback to order's customer phone
      orderCode: complaint.orderCode || (relatedOrderData?.id as string) || null, // ✅ Fallback to order's business ID
      branchName: complaint.branchName || (relatedOrderData?.branchName as string) || null, // ✅ Fallback to order's branch
      orderValue: complaint.orderValue ? Number(complaint.orderValue) : null, // ✅ Serialize Decimal
      timeline: complaint.timeline || [], // ✅ Ensure timeline is always array
      affectedProducts: enrichedAffectedProducts, // ✅ Enriched with product images & business IDs
      relatedOrder: relatedOrderData, // ✅ Include order data inline
      compensationEntities, // ✅ Batch-fetched compensation data (payments, receipts, inventory-checks, penalties)
    };

    return apiSuccess(mappedComplaint)
  } catch (error) {
    logError('Error fetching complaint', error)
    return apiError('Không thể tải chi tiết khiếu nại', 500)
  }
}

// PUT /api/complaints/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  const validation = await validateBody(request, updateComplaintSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    // Fetch existing to detect changes
    const existing = await prisma.complaint.findUnique({
      where: { systemId },
      select: { assigneeId: true, status: true, id: true },
    })

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

    // ✅ Notify assignee on status change or new assignment
    const newAssignee = body.assigneeId || body.assignedTo
    if (existing) {
      if (newAssignee && newAssignee !== existing.assigneeId && newAssignee !== session.user?.employeeId) {
        createNotification({
          type: 'complaint',
          title: 'Giao khiếu nại',
          message: `Bạn được giao xử lý khiếu nại ${existing.id || systemId}`,
          link: `/complaint-tracking/${systemId}`,
          recipientId: newAssignee,
          senderId: session.user?.employeeId,
          senderName: session.user?.name,
          settingsKey: 'complaint:assigned',
        }).catch(e => logError('[Complaints PUT] assignee notification failed', e))

        // Send email notification (non-blocking)
        notifyComplaintAssigned({
          systemId,
          title: complaint.title,
          id: existing.id || systemId,
          assigneeId: newAssignee,
          assignerName: session.user?.name,
        }).catch(e => logError('[Complaints PUT] assignee email failed', e))
      } else if (body.status && body.status !== existing.status && existing.assigneeId && existing.assigneeId !== session.user?.employeeId) {
        createNotification({
          type: 'complaint',
          title: 'Cập nhật khiếu nại',
          message: `Khiếu nại ${existing.id || systemId} đã chuyển trạng thái sang ${body.status}`,
          link: `/complaint-tracking/${systemId}`,
          recipientId: existing.assigneeId,
          senderId: session.user?.employeeId,
          senderName: session.user?.name,
          settingsKey: 'complaint:status',
        }).catch(e => logError('[Complaints PUT] status notification failed', e))

        // Send email notification (non-blocking)
        notifyComplaintStatusChanged({
          systemId,
          title: complaint.title,
          id: existing.id || systemId,
          assigneeId: existing.assigneeId,
          creatorId: null,
          status: body.status,
          oldStatus: existing.status,
        }).catch(e => logError('[Complaints PUT] status email failed', e))
      }
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'complaint',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật khiếu nại`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] complaint update failed', e))
    return apiSuccess(complaint)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiError('Khiếu nại không tồn tại', 404)
    }
    logError('Error updating complaint', error)
    return apiError('Không thể cập nhật khiếu nại', 500)
  }
}

// DELETE /api/complaints/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  try {
    const { systemId } = await params

    await prisma.complaint.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'complaint',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa khiếu nại`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] complaint delete failed', e))
    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiError('Khiếu nại không tồn tại', 404)
    }
    logError('Error deleting complaint', error)
    return apiError('Không thể xóa khiếu nại', 500)
  }
}
