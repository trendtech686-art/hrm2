/**
 * Inventory Receipt Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'
import { syncProductsInventory } from '@/lib/meilisearch-sync'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

// GET - Get single inventory receipt
export const GET = apiHandler(async (request, { session: _session, params }) => {
  try {
    const { systemId } = params;

    const inventoryReceipt = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!inventoryReceipt) {
      return apiNotFound('Inventory receipt');
    }


    // Lookup purchase order to get supplier info if not stored
    let purchaseOrder: { id: string; systemId: string; supplier: { name: string } | null } | null = null;
    if (inventoryReceipt.purchaseOrderSystemId) {
      purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { systemId: inventoryReceipt.purchaseOrderSystemId },
        select: { 
          systemId: true, 
          id: true,
          supplier: { select: { name: true } },
        },
      });
    }
    
    // Lookup employee for receiver info
    let employee: { systemId: string; fullName: string } | null = null;
    if (inventoryReceipt.employeeId) {
      employee = await prisma.employee.findUnique({
        where: { systemId: inventoryReceipt.employeeId },
        select: { systemId: true, fullName: true },
      });
    }

    // Lookup branch for branch name
    let branch: { systemId: string; name: string } | null = null;
    if (inventoryReceipt.branchId) {
      branch = await prisma.branch.findUnique({
        where: { systemId: inventoryReceipt.branchId },
        select: { systemId: true, name: true },
      });
    }

    // Lookup products for SKU and images
    const productIds = inventoryReceipt.items.map(item => item.productId).filter((id): id is string => id !== null);
    const products = productIds.length > 0 
      ? await prisma.product.findMany({
          where: { systemId: { in: productIds } },
          select: { systemId: true, id: true, name: true, thumbnailImage: true, galleryImages: true, costPrice: true },
        })
      : [];
    const productMap = new Map(products.map(p => [p.systemId, p]));

    // Lookup supplier for print (id, phone, email)
    let supplier: { systemId: string; id: string; name: string; phone: string | null; email: string | null } | null = null;
    if (inventoryReceipt.supplierSystemId) {
      supplier = await prisma.supplier.findUnique({
        where: { systemId: inventoryReceipt.supplierSystemId },
        select: { systemId: true, id: true, name: true, phone: true, email: true },
      });
    }

    // ✅ Transform data to match frontend expected format
    const transformedData = {
      ...inventoryReceipt,
      // Map receiptDate to receivedDate for frontend compatibility
      receivedDate: inventoryReceipt.receivedDate?.toISOString() || inventoryReceipt.receiptDate?.toISOString() || new Date().toISOString(),
      // Populate missing fields from relations
      purchaseOrderId: inventoryReceipt.purchaseOrderId || purchaseOrder?.id || null,
      supplierName: inventoryReceipt.supplierName || purchaseOrder?.supplier?.name || null,
      receiverName: inventoryReceipt.receiverName || employee?.fullName || null,
      branchSystemId: inventoryReceipt.branchSystemId || inventoryReceipt.branchId || null,
      branchName: inventoryReceipt.branchName || branch?.name || null,
      items: inventoryReceipt.items.map(item => {
        const product = item.productId ? productMap.get(item.productId) : undefined;
        return {
          ...item,
          // Map DB fields to frontend expected names
          productSystemId: item.productId,
          productId: item.productSku || product?.id || item.productId, // Use SKU for display
          productName: item.productName || product?.name || '',
          productImages: product?.galleryImages || (product?.thumbnailImage ? [product.thumbnailImage] : []),
          thumbnailImage: product?.thumbnailImage || null,
          costPrice: product?.costPrice ? Number(product.costPrice) : 0,
          receivedQuantity: item.quantity,
          orderedQuantity: item.quantity,
          unitPrice: Number(item.unitCost) || 0,
          unitCost: Number(item.unitCost) || 0,
          totalCost: Number(item.totalCost) || 0,
        };
      }),
      // ✅ Phase A4: Include supplier data so frontend doesn't need useSupplierFinder
      supplier: supplier || undefined,
    };

    return apiSuccess(transformedData);
  } catch (error) {
    logError('[Inventory Receipts API] GET by ID error', error);
    return apiError('Không thể tải phiếu nhập kho', 500);
  }
})

// PATCH - Update inventory receipt
export const PATCH = apiHandler(async (request, { session, params }) => {
  try {
    const { systemId } = params;
    const body = await request.json();

    const { status, notes, updatedBy } = body;

    const inventoryReceipt = await prisma.inventoryReceipt.update({
      where: { systemId },
      data: {
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
        ...(updatedBy !== undefined && { updatedBy }),
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    // Notify employee about receipt update
    if (inventoryReceipt.employeeId && inventoryReceipt.employeeId !== session!.user?.employeeId) {
      createNotification({
        type: 'inventory_receipt',
        settingsKey: 'inventory-receipt:updated',
        title: 'Phiếu nhập kho cập nhật',
        message: `Phiếu nhập kho ${inventoryReceipt.id || systemId} đã được cập nhật${status ? ` - ${status}` : ''}`,
        link: `/inventory-receipts/${systemId}`,
        recipientId: inventoryReceipt.employeeId,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
      }).catch(e => logError('[Inventory Receipt PATCH] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'inventory_receipt',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật phiếu nhập kho`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] inventory_receipt update failed', e))
    return apiSuccess(inventoryReceipt);
  } catch (error) {
    logError('[Inventory Receipts API] PATCH error', error);
    return apiError('Không thể cập nhật phiếu nhập kho', 500);
  }
})

// DELETE - Delete inventory receipt
export const DELETE = apiHandler(async (request, { session, params }) => {
  try {
    const { systemId } = params;
    const body = await request.json().catch(() => ({}));
    const hard = body.hard === true;

    // Get the receipt with items first to revert stock and supplier debt
    const receipt = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!receipt) {
      return apiNotFound('Inventory receipt');
    }

    await prisma.$transaction(async (tx) => {
      // ✅ Revert ProductInventory stock for each item
      if (receipt.branchId && receipt.status === 'CONFIRMED') {
        for (const item of receipt.items) {
          if (item.productId) {
            await tx.productInventory.update({
              where: {
                productId_branchId: {
                  productId: item.productId,
                  branchId: receipt.branchId,
                },
              },
              data: {
                onHand: { decrement: item.quantity },
                updatedAt: new Date(),
              },
            });
          }
        }

        // ✅ Revert supplier debt
        if (receipt.supplierSystemId) {
          const totalAmount = receipt.items.reduce(
            (sum, item) => sum + Number(item.totalCost || 0),
            0
          );
          if (totalAmount > 0) {
            await tx.supplier.update({
              where: { systemId: receipt.supplierSystemId },
              data: {
                currentDebt: { decrement: totalAmount },
              },
            });
          }
        }
      }

      // Delete items first
      await tx.inventoryReceiptItem.deleteMany({
        where: { receiptId: systemId },
      });

      // Delete the receipt
      await tx.inventoryReceipt.delete({
        where: { systemId },
      });
    });

    // ✅ Sync affected products to Meilisearch for real-time inventory data
    if (receipt.status === 'CONFIRMED' && receipt.items.length > 0) {
      const productSystemIds = receipt.items.map(item => item.productId).filter(Boolean) as string[];
      syncProductsInventory(productSystemIds).catch(err => 
        logError('[Inventory Receipts API] Meilisearch sync failed', err)
      );
    }

    // Log activity
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'inventory_receipt',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa phiếu nhập kho`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] inventory_receipt delete failed', e))
    return apiSuccess({ success: true });
  } catch (error) {
    logError('[Inventory Receipts API] DELETE error', error);
    return apiError('Không thể xóa phiếu nhập kho', 500);
  }
})
