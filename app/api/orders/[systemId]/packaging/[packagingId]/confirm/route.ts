import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// Helper to get sales management settings
async function getSalesSettings() {
  const setting = await prisma.setting.findFirst({
    where: { key: 'sales-management-settings' },
  });
  // Note: setting.value is already a JSON object (Prisma Json type)
  const value = setting?.value as { allowNegativePacking?: boolean } | null;
  return { allowNegativePacking: value?.allowNegativePacking ?? true };
}

// POST /api/orders/[systemId]/packaging/[packagingId]/confirm - Confirm packaging complete
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;
    
    // Get confirming employee info from request body or session
    const body = await request.json().catch(() => ({}));
    const confirmingEmployeeId = body.confirmingEmployeeId || session.user?.employee?.systemId;
    const confirmingEmployeeName = body.confirmingEmployeeName || session.user?.employee?.fullName || session.user?.name;

    // Get the packaging with order info
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: {
        order: {
          include: { lineItems: true }
        }
      }
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    if (packaging.orderId !== systemId) {
      return apiError('Packaging does not belong to this order', 400);
    }

    if (packaging.confirmDate) {
      return apiError('Packaging already completed', 400);
    }

    // ✅ Check allowNegativePacking setting
    const settings = await getSalesSettings();
    if (!settings.allowNegativePacking && packaging.order) {
      const order = packaging.order;
      const branchId = order.branchId;
      
      // Get inventories for all products
      const productIds = order.lineItems.map(item => item.productId).filter(Boolean) as string[];
      const inventories = await prisma.productInventory.findMany({
        where: { productId: { in: productIds }, branchId },
      });
      const inventoryMap = new Map(inventories.map(inv => [inv.productId, inv]));
      
      for (const item of order.lineItems) {
        if (!item.productId) continue;
        const inventory = inventoryMap.get(item.productId);
        const onHand = inventory?.onHand ?? 0;
        const _committed = inventory?.committed ?? 0;
        // Available = onHand - committed (already reserved), but this order's items are already in committed
        // So we need to check if onHand >= item.quantity (the reserved amount for this order)
        // Actually: available for this specific order = onHand (physical stock) >= quantity needed
        if (onHand < item.quantity) {
          return apiError(
            `Không thể đóng gói: Sản phẩm "${item.productName || item.productId}" không đủ tồn kho thực tế. Có: ${onHand}, cần: ${item.quantity}`,
            400
          );
        }
      }
    }

    // Transaction: complete packaging and update order status
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update packaging with confirming employee info
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          status: 'COMPLETED',
          confirmDate: new Date(),
          confirmingEmployeeId,
          confirmingEmployeeName,
        },
      });

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { status: 'PACKED' },
        include: {
          customer: true,
          lineItems: {
            include: { product: true },
          },
          payments: true,
          packagings: {
            include: {
              assignedEmployee: true,
              shipment: true,
            },
          },
        },
      });

      return updated;
    });

    // Log activity
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Xác nhận đóng gói hoàn tất - ${updatedOrder.id || systemId}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[Packaging Confirm] activity log failed', e));

    // Notify salesperson about packaging confirmed
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        title: 'Đóng gói hoàn tất',
        message: `Đơn hàng ${updatedOrder.id || systemId} đã đóng gói xong`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
        settingsKey: 'order:packaging',
      }).catch(e => logError('[Packaging Confirm] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error confirming packaging', error);
    return apiError('Failed to confirm packaging', 500);
  }
}
