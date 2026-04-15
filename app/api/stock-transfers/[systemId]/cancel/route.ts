/**
 * Stock Transfer Cancel Workflow
 * POST /api/stock-transfers/[systemId]/cancel
 * 
 * Atomically:
 * 1. Update transfer status to 'cancelled'
 * 2. Return stock from transit if already transferring
 * 3. Create stock history entries
 * 4. Record cancel reason, timestamps, and employee
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

interface CancelTransferBody {
  reason?: string;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body: CancelTransferBody = await request.json().catch(() => ({}));
    const now = new Date();

    // Fetch transfer with items
    const transfer = await prisma.stockTransfer.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!transfer) {
      return apiError('Không tìm thấy phiếu chuyển kho', 404);
    }

    if (transfer.status === 'COMPLETED' || transfer.status === 'CANCELLED') {
      return apiError(`Không thể hủy phiếu chuyển kho với trạng thái: ${transfer.status}`, 400);
    }

    // Get employee info
    const employee = await prisma.employee.findUnique({
      where: { systemId: session.user.id },
    });

    // Atomic transaction: Update transfer, inventory (if needed), and stock history
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update transfer status
      const updatedTransfer = await tx.stockTransfer.update({
        where: { systemId },
        data: {
          status: 'CANCELLED',
          cancelledDate: now,
          cancelledBySystemId: session.user.id,
          cancelledByName: employee?.fullName || session.user.name || 'System',
          cancelReason: body.reason?.trim() || undefined,
          updatedAt: new Date(),
          updatedBy: session.user.id,
        },
        include: { items: true },
      });

      // 2. If status was IN_TRANSIT, return stock from transit
      if (transfer.status === 'IN_TRANSIT') {
        for (const item of transfer.items) {
          if (!item.productId) continue; // Skip items without product (deleted products)
          
          const product = await tx.product.findUnique({
            where: { systemId: item.productId },
          });

          if (!product) {
            throw new Error(`Không tìm thấy sản phẩm: ${item.productId}`);
          }

          // ✅ Update source branch: +onHand (stock returns to source)
          // Use returned value to ensure stock history matches actual DB state
          const updatedSourceInventory = await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: transfer.fromBranchId,
              },
            },
            update: {
              onHand: { increment: item.quantity },
              updatedAt: new Date(),
            },
            create: {
              productId: item.productId,
              branchId: transfer.fromBranchId,
              onHand: item.quantity,
            },
          });

          // ✅ Update destination branch: -inTransit (clear pending stock)
          await tx.productInventory.update({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: transfer.toBranchId,
              },
            },
            data: {
              inTransit: { decrement: item.quantity },
              updatedAt: new Date(),
            },
          }).catch(() => {
            // Ignore if destination inventory doesn't exist
          });

          // ✅ Create stock history entry with actual DB value
          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              branchId: transfer.fromBranchId,
              action: 'Hủy chuyển kho',
              source: 'Chuyển kho',
              quantityChange: item.quantity,
              newStockLevel: updatedSourceInventory.onHand, // ✅ Use actual DB value
              documentId: transfer.id,
              documentType: 'stock_transfer',
              employeeId: session.user.id,
              employeeName: employee?.fullName || session.user.name || 'System',
              note: `Hủy chuyển kho đến ${transfer.toBranchName || transfer.toBranchId}${body.reason ? ` - Lý do: ${body.reason}` : ''}`,
            },
          });
        }
      }

      return updatedTransfer;
    });

    // ✅ Sync affected products to Meilisearch for real-time inventory data
    if (transfer.status === 'IN_TRANSIT' && transfer.items.length > 0) {
      const productSystemIds = transfer.items.map(item => item.productId).filter(Boolean) as string[];
      syncProductsInventory(productSystemIds).catch(err => 
        logError('[Stock Transfer Cancel] Meilisearch sync failed', err)
      );
    }

    // Transform status to lowercase for frontend compatibility
    const transformedResult = {
      ...result,
      status: result.status.toLowerCase(),
    };

    // ✅ Notify: transfer cancelled (to assigned employee if different)
    if (transfer.employeeId && transfer.employeeId !== session.user?.employeeId) {
      createNotification({
        type: 'stock_transfer',
        settingsKey: 'stock-transfer:updated',
        title: 'Hủy chuyển kho',
        message: `Phiếu chuyển kho ${transfer.id || systemId} đã bị hủy`,
        link: `/stock-transfers/${systemId}`,
        recipientId: transfer.employeeId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Stock Transfer Cancel] notification failed', e))
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'stock_transfer',
          entityId: systemId,
          action: 'cancelled',
          actionType: 'update',
          note: `Hủy phiếu chuyển kho`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] stock_transfer cancelled failed', e))
    return apiSuccess(transformedResult);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi khi hủy chuyển kho';
    return apiError(message, 500);
  }
}
