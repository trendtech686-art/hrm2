/**
 * GET /api/purchase-orders/returnable
 * 
 * Returns purchase orders that can be returned (have received goods).
 * Criteria: (deliveryStatus = 'Đã nhập' OR has linked InventoryReceipts) AND status != CANCELLED
 * 
 * Includes receipt count and total received quantity per PO for display.
 * Replaces client-side: useAllPurchaseOrders + useAllInventoryReceipts in select mode.
 */

import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { apiHandler } from '@/lib/api-handler';
import { logError } from '@/lib/logger';

export const GET = apiHandler(async () => {
  try {
    // Step 1: Find all POs that are not cancelled 
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: {
        isDeleted: false,
        status: { not: 'CANCELLED' },
      },
      select: {
        systemId: true,
        id: true,
        supplierName: true,
        supplier: { select: { name: true } },
        deliveryStatus: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Step 2: Find all inventory receipts linked to purchase orders
    const receipts = await prisma.inventoryReceipt.findMany({
      where: {
        purchaseOrderSystemId: { not: null },
      },
      select: {
        purchaseOrderSystemId: true,
        items: {
          select: { quantity: true },
        },
      },
    });

    // Group receipts by PO systemId
    const receiptsByPO = new Map<string, { count: number; totalReceived: number }>();
    for (const r of receipts) {
      const poId = r.purchaseOrderSystemId!;
      const existing = receiptsByPO.get(poId) || { count: 0, totalReceived: 0 };
      existing.count += 1;
      existing.totalReceived += r.items.reduce((s, i) => s + (i.quantity ?? 0), 0);
      receiptsByPO.set(poId, existing);
    }

    // Step 3: Filter POs that have been received (deliveryStatus or has receipts)
    const result = purchaseOrders
      .filter(po => {
        const hasReceivedStatus = po.deliveryStatus === 'Đã nhập';
        const hasReceipts = receiptsByPO.has(po.systemId);
        return hasReceivedStatus || hasReceipts;
      })
      .map(po => {
        const receiptData = receiptsByPO.get(po.systemId) || { count: 0, totalReceived: 0 };
        return {
          systemId: po.systemId,
          id: po.id,
          supplierName: po.supplier?.name || po.supplierName || '',
          receiptCount: receiptData.count,
          totalReceived: receiptData.totalReceived,
        };
      });

    return apiSuccess(result);
  } catch (error) {
    logError('Error fetching returnable purchase orders', error);
    return apiError('Không thể tải danh sách đơn có thể trả hàng', 500);
  }
})
