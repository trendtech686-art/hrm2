/**
 * Inventory Check Balance API Route
 * 
 * POST /api/inventory-checks/[systemId]/balance - Balance inventory (cập nhật tồn kho theo thực tế)
 * 
 * Cập nhật tồn kho trực tiếp qua Prisma transaction (không dùng HTTP self-call)
 * và cập nhật trạng thái phiếu kiểm kê thành COMPLETED.
 */

import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { logError } from '@/lib/logger'
import { syncProductsInventory } from '@/lib/meilisearch-sync'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// POST - Balance inventory check (cập nhật tồn kho theo số thực tế)
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json().catch(() => ({}));
    const { balancedBy } = body;

    // Get the inventory check with items
    const inventoryCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!inventoryCheck) {
      return apiNotFound('Inventory check');
    }

    // Validate status - only DRAFT or PENDING can be balanced
    const currentStatus = String(inventoryCheck.status).toUpperCase();
    if (currentStatus !== 'DRAFT' && currentStatus !== 'PENDING') {
      return apiError(`Không thể cân bằng phiếu ở trạng thái ${inventoryCheck.status}`, 400);
    }

    if (!inventoryCheck.items || inventoryCheck.items.length === 0) {
      return apiError('Phiếu kiểm không có sản phẩm nào để cân bằng', 400);
    }

    const branchId = inventoryCheck.branchSystemId || inventoryCheck.branchId;
    if (!branchId) {
      return apiError('Không tìm thấy chi nhánh để cân bằng', 400);
    }

    // Resolve employee info
    const userId = balancedBy || session.user?.id || null;
    let employeeSystemId: string | null = null;
    let employeeName = session.user?.name || 'Hệ thống';

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { systemId: userId },
        select: { employee: { select: { systemId: true, fullName: true, id: true } } },
      });
      if (user?.employee) {
        employeeSystemId = user.employee.systemId;
        employeeName = user.employee.fullName || user.employee.id || employeeName;
      } else {
        const employee = await prisma.employee.findUnique({
          where: { systemId: userId },
          select: { systemId: true, fullName: true, id: true },
        });
        if (employee) {
          employeeSystemId = employee.systemId;
          employeeName = employee.fullName || employee.id || employeeName;
        }
      }
    }

    const now = new Date();

    // Filter items with differences
    const itemsToBalance = inventoryCheck.items.filter(
      (item) => (item.difference || 0) !== 0 && (item.productSystemId || item.productId || item.productSku)
    );

    // ✅ Build a map to resolve correct product systemId (old data may have business ID in productId)
    const productIdsOrSkus = itemsToBalance
      .map(item => item.productSystemId || item.productId || item.productSku)
      .filter((id): id is string => !!id);
    
    const productsForResolve = productIdsOrSkus.length > 0 
      ? await prisma.product.findMany({
          where: {
            OR: [
              { systemId: { in: productIdsOrSkus } },
              { id: { in: productIdsOrSkus } },
            ]
          },
          select: { systemId: true, id: true },
        })
      : [];
    
    // Map both systemId and business ID to the actual systemId
    const productIdResolveMap = new Map<string, string>();
    for (const p of productsForResolve) {
      productIdResolveMap.set(p.systemId, p.systemId);
      if (p.id) {
        productIdResolveMap.set(p.id, p.systemId);
      }
    }

    // Process all inventory updates in a single transaction
    const updateResults = await prisma.$transaction(async (tx) => {
      const results: { productId: string; productName: string; success: boolean; error?: string }[] = [];

      for (const item of itemsToBalance) {
        // ✅ Resolve to actual systemId from map - prioritize productSystemId
        const rawProductId = item.productSystemId || item.productId || item.productSku || '';
        const productId = productIdResolveMap.get(rawProductId) || rawProductId;

        try {
          // Get current inventory state
          const existingInventory = await tx.productInventory.findUnique({
            where: { productId_branchId: { productId, branchId } },
          });

          const oldStock = existingInventory ? existingInventory.onHand : 0;
          
          // ✅ FIX: Set inventory to ACTUAL COUNT, not add difference
          // Balance operation means "set inventory to what was actually counted"
          const targetStock = item.actualQty;  // The actual counted quantity
          const quantityChange = targetStock - oldStock;  // Calculate real change for history
          
          // Skip if no actual change needed
          if (quantityChange === 0) {
            results.push({ productId, productName: item.productName || productId, success: true });
            continue;
          }

          // ✅ Use returned value from DB update to ensure stock history matches actual DB state
          let updatedInventory;
          if (existingInventory) {
            updatedInventory = await tx.productInventory.update({
              where: { productId_branchId: { productId, branchId } },
              data: { onHand: targetStock },
            });
          } else {
            updatedInventory = await tx.productInventory.create({
              data: { productId, branchId, onHand: targetStock, inTransit: 0, committed: 0 },
            });
          }

          // Create StockHistory entry - use targetStock directly for accuracy
          await tx.stockHistory.create({
            data: {
              systemId: await generateIdWithPrefix('STH', tx as unknown as typeof prisma),
              productId,
              branchId,
              action: 'Cân bằng kho',
              source: 'inventory_check',
              quantityChange: quantityChange, // ✅ Use actual real change
              newStockLevel: targetStock, // ✅ Use targetStock directly (= item.actualQty)
              documentId: inventoryCheck.id,
              documentType: 'inventory_check',
              employeeId: employeeSystemId,
              employeeName: employeeName,
              note: `Cân bằng từ phiếu kiểm kê ${inventoryCheck.id}. Trước: ${oldStock}, Sau: ${targetStock}`,
              createdAt: now,
            },
          });

          results.push({ productId, productName: item.productName || productId, success: true });
        } catch (err) {
          // Transaction will be rolled back; log for debugging
          logError(`[Balance] Failed to update ${item.productName}`, err);
          throw err; // Re-throw so transaction rolls back entirely
        }
      }

      // Update inventory check status within the same transaction
      await tx.$executeRaw`
        UPDATE inventory_checks
        SET status = 'COMPLETED',
            "balancedAt" = ${now},
            "balancedBy" = ${employeeSystemId},
            "updatedAt" = ${now}
        WHERE "systemId" = ${systemId}
      `;

      return results;
    });

    // ✅ Sync affected products to Meilisearch for real-time inventory data
    if (itemsToBalance.length > 0) {
      // Use resolved systemIds from the map
      const productSystemIds = itemsToBalance
        .map(item => productIdResolveMap.get(item.productId || item.productSku || '') || item.productId!)
        .filter(Boolean);
      syncProductsInventory(productSystemIds).catch(err => 
        logError('[Inventory Checks API] Meilisearch sync failed', err)
      );
    }

    // Fetch the updated record
    const updatedCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: { items: true },
    });

    // Notify the assigned employee about balance completion
    if (inventoryCheck.createdBy && inventoryCheck.createdBy !== session.user?.employeeId) {
      createNotification({
        type: 'inventory_check',
        settingsKey: 'inventory-check:updated',
        title: 'Kiểm kho đã cân bằng',
        message: `Phiếu kiểm kho ${inventoryCheck.id || systemId} đã được cân bằng (${updateResults.length} sản phẩm)`,
        link: `/inventory-checks/${systemId}`,
        recipientId: inventoryCheck.createdBy,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Inventory Check Balance] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'inventory_check',
          entityId: systemId,
          action: 'balanced',
          actionType: 'update',
          note: `Cân bằng kho`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] inventory_check balanced failed', e))

    return apiSuccess({
      ...updatedCheck,
      updateResults,
      failedCount: 0,
      successCount: updateResults.length,
    });
  } catch (error) {
    logError('[Inventory Checks API] Balance error', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return apiError(`Failed to balance inventory check: ${errorMessage}`, 500);
  }
}
