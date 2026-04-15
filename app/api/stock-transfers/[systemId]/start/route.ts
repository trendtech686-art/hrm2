/**
 * Stock Transfer Start/Dispatch Workflow
 * POST /api/stock-transfers/[systemId]/start
 * 
 * Atomically:
 * 1. Update transfer status to 'transferring'
 * 2. Dispatch stock from source branch
 * 3. Create stock history entries
 * 4. Record timestamps and employee
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { syncProductsInventory } from '@/lib/meilisearch-sync'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const now = new Date();

    // Fetch transfer with items
    const transfer = await prisma.stockTransfer.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!transfer) {
      return apiError('Không tìm thấy phiếu chuyển kho', 404);
    }

    if (transfer.status !== 'PENDING') {
      return apiError(`Không thể bắt đầu phiếu chuyển kho với trạng thái: ${transfer.status}`, 400);
    }

    // Get employee info
    const employee = await prisma.employee.findUnique({
      where: { systemId: session.user.id },
    });

    // Atomic transaction: Update transfer, inventory, and stock history
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update transfer status
      const updatedTransfer = await tx.stockTransfer.update({
        where: { systemId },
        data: {
          status: 'IN_TRANSIT',
          transferDate: now,
          transferredDate: now,
          transferredBySystemId: session.user.id,
          transferredByName: employee?.fullName || session.user.name || 'System',
          updatedAt: new Date(),
          updatedBy: session.user.id,
        },
        include: { items: true },
      });

      // 2. Dispatch stock from source branch for each item
      for (const item of transfer.items) {
        if (!item.productId) continue; // Skip items without product (deleted products)
        
        const product = await tx.product.findUnique({
          where: { systemId: item.productId },
        });

        if (!product) {
          throw new Error(`Không tìm thấy sản phẩm: ${item.productId}`);
        }

        // ✅ Use ProductInventory table instead of Product.inventoryByBranch
        const inventory = await tx.productInventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: transfer.fromBranchId,
            },
          },
        });

        const currentStock = inventory?.onHand || 0;
        
        if (currentStock < item.quantity) {
          throw new Error(`Không đủ tồn kho cho ${product.name}. Hiện có: ${currentStock}, Cần: ${item.quantity}`);
        }

        // ✅ Update source branch: -onHand (stock leaves source)
        // Use returned value to ensure stock history matches actual DB state
        const updatedSourceInventory = await tx.productInventory.upsert({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: transfer.fromBranchId,
            },
          },
          update: {
            onHand: { decrement: item.quantity },
            updatedAt: new Date(),
          },
          create: {
            productId: item.productId,
            branchId: transfer.fromBranchId,
            onHand: -item.quantity, // Should not happen normally
          },
        });

        // ✅ Update destination branch: +inTransit (stock in transit TO destination)
        await tx.productInventory.upsert({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: transfer.toBranchId,
            },
          },
          update: {
            inTransit: { increment: item.quantity },
            updatedAt: new Date(),
          },
          create: {
            productId: item.productId,
            branchId: transfer.toBranchId,
            onHand: 0,
            inTransit: item.quantity,
          },
        });

        // ✅ Create stock history entry with actual DB value
        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            branchId: transfer.fromBranchId,
            action: 'Xuất chuyển kho',
            source: 'Chuyển kho',
            quantityChange: -item.quantity,
            newStockLevel: updatedSourceInventory.onHand, // ✅ Use actual DB value
            documentId: transfer.id,
            documentType: 'stock_transfer',
            employeeId: session.user.id,
            employeeName: employee?.fullName || session.user.name || 'System',
            note: `Chuyển kho đến ${transfer.toBranchName || transfer.toBranchId}`,
          },
        });
      }

      return updatedTransfer;
    });

    // ✅ Sync affected products to Meilisearch for real-time inventory data
    if (transfer.items.length > 0) {
      const productSystemIds = transfer.items.map(item => item.productId).filter(Boolean) as string[];
      syncProductsInventory(productSystemIds).catch(err => 
        logError('[Stock Transfer Start] Meilisearch sync failed', err)
      );
    }

    // Transform status to lowercase for frontend compatibility
    const transformedResult = {
      ...result,
      status: result.status.toLowerCase(),
    };

    // ✅ Notify: transfer started (to assigned employee if different)
    if (transfer.employeeId && transfer.employeeId !== session.user?.employeeId) {
      createNotification({
        type: 'stock_transfer',
        settingsKey: 'stock-transfer:updated',
        title: 'Bắt đầu chuyển kho',
        message: `Phiếu chuyển kho ${transfer.id || systemId} đã bắt đầu vận chuyển`,
        link: `/stock-transfers/${systemId}`,
        recipientId: transfer.employeeId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Stock Transfer Start] notification failed', e))
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'stock_transfer',
          entityId: systemId,
          action: 'started',
          actionType: 'update',
          note: `Bắt đầu chuyển kho`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] stock_transfer started failed', e))
    return apiSuccess(transformedResult);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi khi bắt đầu chuyển kho';
    return apiError(message, 500);
  }
}
