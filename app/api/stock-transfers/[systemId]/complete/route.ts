/**
 * Stock Transfer Complete/Receive Workflow
 * POST /api/stock-transfers/[systemId]/complete
 * 
 * Atomically:
 * 1. Update transfer status to 'completed'
 * 2. Complete delivery to destination branch
 * 3. Clear inTransit and add to inventory
 * 4. Create stock history entries
 * 5. Record timestamps and employee
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, validateBody } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { syncProductsInventory } from '@/lib/meilisearch-sync'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { completeStockTransferSchema } from '../../validation';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, completeStockTransferSchema);
  if (!validation.success) return apiError(validation.error, 400);

  try {
    const { systemId } = await params;
    const { receivedItems } = validation.data;
    const now = new Date();

    // Fetch transfer with items
    const transfer = await prisma.stockTransfer.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        fromBranchId: true,
        toBranchId: true,
        employeeId: true,
        transferDate: true,
        receivedDate: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        referenceCode: true,
        fromBranchSystemId: true,
        fromBranchName: true,
        toBranchSystemId: true,
        toBranchName: true,
        createdDate: true,
        createdBySystemId: true,
        createdByName: true,
        transferredDate: true,
        transferredBySystemId: true,
        transferredByName: true,
        receivedBySystemId: true,
        receivedByName: true,
        cancelledDate: true,
        cancelledBySystemId: true,
        cancelledByName: true,
        cancelReason: true,
        items: {
          select: {
            systemId: true,
            transferId: true,
            productId: true,
            productName: true,
            productSku: true,
            quantity: true,
            receivedQty: true,
          },
        },
      },
    });

    if (!transfer) {
      return apiError('Không tìm thấy phiếu chuyển kho', 404);
    }

    if (transfer.status !== 'IN_TRANSIT') {
      return apiError(`Không thể hoàn thành phiếu chuyển kho với trạng thái: ${transfer.status}`, 400);
    }

    // Get employee info
    const employee = await prisma.employee.findUnique({
      where: { systemId: session!.user.id },
    });

    // Map received quantities
    const receivedMap = new Map(
      receivedItems?.map(item => [item.productSystemId, item.receivedQuantity]) || []
    );

    // Atomic transaction: Update transfer, inventory, and stock history
    const result = await prisma.$transaction(async (tx) => {
      // Update item received quantities
      const updatedItems = await Promise.all(
        transfer.items.map(async (item) => {
          const receivedQuantity = item.productId ? (receivedMap.get(item.productId) ?? item.quantity) : item.quantity;
          
          return tx.stockTransferItem.update({
            where: { systemId: item.systemId },
            data: { receivedQty: receivedQuantity },
          });
        })
      );

      // 1. Update transfer status
      const updatedTransfer = await tx.stockTransfer.update({
        where: { systemId },
        data: {
          status: 'COMPLETED',
          receivedDate: now,
          receivedBySystemId: session!.user.id,
          receivedByName: employee?.fullName || session!.user.name || 'System',
          updatedAt: new Date(),
          updatedBy: session!.user.id,
        },
        select: {
          systemId: true,
          id: true,
          fromBranchId: true,
          toBranchId: true,
          employeeId: true,
          transferDate: true,
          receivedDate: true,
          status: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
          referenceCode: true,
          fromBranchSystemId: true,
          fromBranchName: true,
          toBranchSystemId: true,
          toBranchName: true,
          createdDate: true,
          createdBySystemId: true,
          createdByName: true,
          transferredDate: true,
          transferredBySystemId: true,
          transferredByName: true,
          receivedBySystemId: true,
          receivedByName: true,
          cancelledDate: true,
          cancelledBySystemId: true,
          cancelledByName: true,
          cancelReason: true,
          items: {
            select: {
              systemId: true,
              transferId: true,
              productId: true,
              productName: true,
              productSku: true,
              quantity: true,
              receivedQty: true,
            },
          },
        },
      });

      // 2. Complete delivery for each item
      for (let i = 0; i < transfer.items.length; i++) {
        const item = transfer.items[i];
        if (!item.productId) continue; // Skip items without product (deleted products)
        
        const updatedItem = updatedItems[i];
        const receivedQty = updatedItem.receivedQty ?? item.quantity;
        
        const product = await tx.product.findUnique({
          where: { systemId: item.productId },
        });

        if (!product) {
          throw new Error(`Không tìm thấy sản phẩm: ${item.productId}`);
        }

        // ✅ Update ProductInventory: +onHand and -inTransit at destination
        // Use returned value to ensure stock history matches actual DB state
        const updatedDestInventory = await tx.productInventory.upsert({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: transfer.toBranchId,
            },
          },
          update: {
            onHand: { increment: receivedQty },
            inTransit: { decrement: item.quantity }, // Clear inTransit at destination
            updatedAt: new Date(),
          },
          create: {
            productId: item.productId,
            branchId: transfer.toBranchId,
            onHand: receivedQty,
            inTransit: 0,
          },
        });

        // ✅ Create stock history entry for destination with actual DB value
        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            branchId: transfer.toBranchId,
            action: 'Nhập chuyển kho',
            source: 'Chuyển kho',
            quantityChange: receivedQty,
            newStockLevel: updatedDestInventory.onHand, // ✅ Use actual DB value
            documentId: transfer.id,
            documentType: 'stock_transfer',
            employeeId: session!.user.id,
            employeeName: employee?.fullName || session!.user.name || 'System',
            note: `Nhận hàng từ ${transfer.fromBranchName || transfer.fromBranchId}`,
          },
        });
      }

      return updatedTransfer;
    });

    // ✅ Sync affected products to Meilisearch for real-time inventory data
    if (transfer.items.length > 0) {
      const productSystemIds = transfer.items.map(item => item.productId).filter(Boolean) as string[];
      syncProductsInventory(productSystemIds).catch(err => 
        logError('[Stock Transfer Complete] Meilisearch sync failed', err)
      );
    }

    // Transform status to lowercase for frontend compatibility
    const transformedResult = {
      ...result,
      status: result.status.toLowerCase(),
    };

    // ✅ Notify: transfer completed (to assigned employee if different)
    if (transfer.employeeId && transfer.employeeId !== session!.user?.employeeId) {
      createNotification({
        type: 'stock_transfer',
        settingsKey: 'stock-transfer:updated',
        title: 'Hoàn thành chuyển kho',
        message: `Phiếu chuyển kho ${transfer.id || systemId} đã hoàn thành nhận hàng`,
        link: `/stock-transfers/${systemId}`,
        recipientId: transfer.employeeId,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
      }).catch(e => logError('[Stock Transfer Complete] notification failed', e))
    }

    // Log activity
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'stock_transfer',
          entityId: systemId,
          action: 'completed',
          actionType: 'update',
          note: `Hoàn thành chuyển kho`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] stock_transfer completed failed', e))
    return apiSuccess(transformedResult);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi khi hoàn thành chuyển kho';
    return apiError(message, 500);
  }
}
