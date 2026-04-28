/**
 * Inventory Receipt Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, apiNotFound, validateBody } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'
import { syncProductsInventory } from '@/lib/meilisearch-sync'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { updateInventoryReceiptSchema } from '../validation'
import { InventoryReceiptStatus } from '@/generated/prisma/client'

// GET - Get single inventory receipt
export const GET = apiHandler(async (request, { session: _session, params }) => {
  try {
    const { systemId } = params;

    const inventoryReceipt = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        type: true,
        branchId: true,
        branchSystemId: true,
        branchName: true,
        employeeId: true,
        receiverSystemId: true,
        receiverName: true,
        purchaseOrderSystemId: true,
        purchaseOrderId: true,
        supplierSystemId: true,
        supplierName: true,
        receiptDate: true,
        receivedDate: true,
        status: true,
        notes: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            systemId: true,
            productId: true,
            productSku: true,
            productName: true,
            quantity: true,
            unitCost: true,
            totalCost: true,
          },
        },
      },
    });

    if (!inventoryReceipt) {
      return apiNotFound('Inventory receipt');
    }

    // Lookup related data in parallel
    const productIds = inventoryReceipt.items.map(item => item.productId).filter((id): id is string => id !== null);
    
    const [purchaseOrder, employee, branch, products, supplier] = await Promise.all([
      inventoryReceipt.purchaseOrderSystemId
        ? prisma.purchaseOrder.findUnique({
            where: { systemId: inventoryReceipt.purchaseOrderSystemId },
            select: { 
              systemId: true, 
              id: true,
              supplier: { select: { name: true } },
            },
          })
        : null,
      inventoryReceipt.employeeId
        ? prisma.employee.findUnique({
            where: { systemId: inventoryReceipt.employeeId },
            select: { systemId: true, fullName: true },
          })
        : null,
      inventoryReceipt.branchId
        ? prisma.branch.findUnique({
            where: { systemId: inventoryReceipt.branchId },
            select: { systemId: true, name: true },
          })
        : null,
      productIds.length > 0 
        ? prisma.product.findMany({
            where: { systemId: { in: productIds } },
            select: { systemId: true, id: true, name: true, thumbnailImage: true, galleryImages: true, costPrice: true },
          })
        : [],
      inventoryReceipt.supplierSystemId
        ? prisma.supplier.findUnique({
            where: { systemId: inventoryReceipt.supplierSystemId },
            select: { systemId: true, id: true, name: true, phone: true, email: true },
          })
        : null,
    ]);
    
    const productMap = new Map(products.map(p => [p.systemId, p]));

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
    
    // Validate request body with Zod schema
    const validation = await validateBody(request, updateInventoryReceiptSchema)
    if (!validation.success) {
      return apiError(validation.error, 400)
    }
    const body = validation.data;

    const { status, notes } = body;

    // Fetch existing data before update for change detection
    const existing = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
      select: {
        status: true,
        notes: true,
        id: true,
      },
    })
    if (!existing) return apiNotFound('Inventory receipt');

    const updateData: { status?: InventoryReceiptStatus; notes?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (status !== undefined) {
      updateData.status = status as InventoryReceiptStatus;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const inventoryReceipt = await prisma.inventoryReceipt.update({
      where: { systemId },
      data: updateData,
      select: {
        systemId: true,
        id: true,
        type: true,
        branchId: true,
        branchSystemId: true,
        branchName: true,
        employeeId: true,
        receiverSystemId: true,
        receiverName: true,
        purchaseOrderSystemId: true,
        purchaseOrderId: true,
        supplierSystemId: true,
        supplierName: true,
        receiptDate: true,
        receivedDate: true,
        status: true,
        notes: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            systemId: true,
            productId: true,
            productSku: true,
            productName: true,
            quantity: true,
            unitCost: true,
            totalCost: true,
          },
        },
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

    // Log activity only if values actually changed
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (status !== undefined && status !== existing.status) changes['Trạng thái'] = { from: existing.status, to: status }
    if (notes !== undefined && notes !== existing.notes) changes['Ghi chú'] = { from: existing.notes ?? '', to: notes ?? '' }

    if (Object.keys(changes).length > 0) {
      getUserNameFromDb(session!.user?.id).then(userName =>
        prisma.activityLog.create({
          data: {
            entityType: 'inventory_receipt',
            entityId: systemId,
            action: `Cập nhật phiếu nhập kho: ${existing.id}`,
            actionType: 'update',
            note: `Cập nhật phiếu nhập kho: ${Object.keys(changes).join(', ')}`,
            metadata: { userName },
            createdBy: userName,
          }
        })
      ).catch(e => logError('[ActivityLog] inventory_receipt update failed', e))
    }
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
    await request.json().catch(() => ({}));

    // Get the receipt with items first to revert stock and supplier debt
    const receipt = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        status: true,
        branchId: true,
        supplierSystemId: true,
        items: {
          select: {
            productId: true,
            quantity: true,
            totalCost: true,
          },
        },
      },
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
    getUserNameFromDb(session?.user?.id).then(userName =>
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
