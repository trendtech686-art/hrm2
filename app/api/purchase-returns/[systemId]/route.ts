/**
 * Purchase Return Detail API Route
 */

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { apiHandler } from '@/lib/api-handler';
import { logError } from '@/lib/logger'
import { syncProductsInventory } from '@/lib/meilisearch-sync';
import { createNotification } from '@/lib/notifications'

// GET - Get single purchase return
export const GET = apiHandler(async (request, { session: _session, params }) => {
  try {
    const { systemId } = params;

    // ✅ FIX: Support both systemId and business ID (e.g., PRETURN000016)
    const purchaseReturn = await prisma.purchaseReturn.findFirst({
      where: {
        OR: [
          { systemId },
          { id: systemId },
        ],
      },
      select: {
        systemId: true,
        id: true,
        supplierId: true,
        purchaseOrderId: true,
        branchId: true,
        employeeId: true,
        status: true,
        reason: true,
        purchaseOrderSystemId: true,
        purchaseOrderBusinessId: true,
        supplierSystemId: true,
        supplierName: true,
        branchSystemId: true,
        branchName: true,
        refundMethod: true,
        accountSystemId: true,
        creatorName: true,
        createdBy: true,
        updatedBy: true,
        subtotal: true,
        total: true,
        totalReturnValue: true,
        refundAmount: true,
        returnDate: true,
        returnItems: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            systemId: true,
            productId: true,
            quantity: true,
            unitPrice: true,
            total: true,
            reason: true,
          },
        },
        suppliers: {
          select: { systemId: true, id: true, name: true, phone: true, email: true, address: true, bankAccount: true, bankName: true },
        },
      },
    });

    if (!purchaseReturn) {
      return apiNotFound('PurchaseReturn');
    }

    // ✅ Phase A5: Parse returnItems JSON (matches list API transform) + add product thumbnails
    interface PurchaseReturnItemData {
      productSystemId?: string;
      productId?: string;
      productSku?: string;
      productName?: string;
      orderedQuantity?: number;
      returnQuantity?: number;
      quantity?: number;
      unitPrice: number;
      note?: string;
      thumbnailImage?: string | null;
    }
    let items: PurchaseReturnItemData[] = [];

    // Handle returnItems stored as JSON array OR JSON string (old Sapo import)
    let parsedReturnItems: unknown = purchaseReturn.returnItems;
    if (typeof parsedReturnItems === 'string') {
      try { parsedReturnItems = JSON.parse(parsedReturnItems); } catch { /* ignore */ }
    }

    if (parsedReturnItems && Array.isArray(parsedReturnItems)) {
      // Convert any Decimal values in JSON items
      items = (parsedReturnItems as unknown as PurchaseReturnItemData[]).map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
      }));
    } else if (purchaseReturn.items.length > 0) {
      items = purchaseReturn.items.map(item => ({
        productSystemId: item.productId || '',
        productId: item.productId || '',
        productName: '',
        orderedQuantity: 0,
        returnQuantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        note: item.reason || '',
      }));
    }

    // Collect all identifiers to lookup products (systemId, id/SKU, productSku, name)
    const productSystemIds = items.map(i => i.productSystemId).filter(Boolean) as string[];
    const productSkus = items.map(i => i.productSku || i.productId).filter(Boolean) as string[];
    // Old data stores product names in productSku field
    const productNames = items
      .filter(i => !i.productName && i.productSku)
      .map(i => i.productSku as string);

    // Lookup products by systemId OR business id (SKU, case-insensitive) OR name
    const orConditions: Prisma.ProductWhereInput[] = [];
    if (productSystemIds.length > 0) orConditions.push({ systemId: { in: productSystemIds } });
    // Use individual equals with mode:'insensitive' since `in` doesn't support it
    for (const sku of Array.from(new Set(productSkus))) {
      orConditions.push({ id: { equals: sku, mode: 'insensitive' } });
    }
    for (const name of Array.from(new Set(productNames))) {
      orConditions.push({ name: { equals: name, mode: 'insensitive' } });
    }

    const products = orConditions.length > 0
      ? await prisma.product.findMany({
          where: { OR: orConditions, isDeleted: false },
          select: { systemId: true, id: true, name: true, thumbnailImage: true, imageUrl: true },
        })
      : [];

    const productBySystemId = new Map(products.map(p => [p.systemId, p]));
    const productById = new Map(products.map(p => [p.id.toLowerCase(), p]));
    const productByName = new Map(products.map(p => [p.name.toLowerCase(), p]));

    // Lookup ordered quantities from the linked purchase order
    const poItemsByProductId = new Map<string, number>();
    if (purchaseReturn.purchaseOrderSystemId) {
      const po = await prisma.purchaseOrder.findUnique({
        where: { systemId: purchaseReturn.purchaseOrderSystemId },
        select: { items: { select: { productId: true, quantity: true } } },
      });
      if (po) {
        for (const poItem of po.items) {
          if (poItem.productId) {
            poItemsByProductId.set(poItem.productId, poItem.quantity);
          }
        }
      }
    }

    const transformedItems = items.map(item => {
      // Match product: try systemId first, then SKU/productId, then name
      const product = productBySystemId.get(item.productSystemId || '')
        || productById.get((item.productSku || '').toLowerCase())
        || productById.get((item.productId || '').toLowerCase())
        || productByName.get((item.productSku || '').toLowerCase());

      // Get orderedQuantity from PO if not set in return items
      const resolvedSystemId = item.productSystemId || product?.systemId || '';
      const orderedQty = item.orderedQuantity || poItemsByProductId.get(resolvedSystemId) || 0;

      return {
        productSystemId: resolvedSystemId,
        productId: item.productId || product?.id || item.productSku || '',
        productName: item.productName || product?.name || item.productSku || '',
        orderedQuantity: orderedQty,
        returnQuantity: item.returnQuantity ?? item.quantity ?? 0,
        unitPrice: Number(item.unitPrice),
        note: item.note || '',
        imageUrl: product?.thumbnailImage || product?.imageUrl || null,
      };
    });

    // Destructure to exclude relational items from spread
    const { items: _relationalItems, ...prBase } = purchaseReturn;
    return apiSuccess({
      ...prBase,
      items: transformedItems,
      // Include supplier from relation for print
      supplier: purchaseReturn.suppliers || undefined,
      subtotal: Number(purchaseReturn.subtotal),
      total: Number(purchaseReturn.total),
      totalReturnValue: Number(purchaseReturn.totalReturnValue),
      refundAmount: Number(purchaseReturn.refundAmount),
    });
  } catch (error) {
    logError('[Purchase Returns API] GET by ID error', error);
    return apiError('Không thể tải phiếu trả hàng nhập', 500);
  }
})

// PATCH - Update purchase return (approve/reject/update status)
export const PATCH = apiHandler(async (request, { session, params }) => {
  try {
    const { systemId } = params;
    const body = await request.json();

    const { status, reason, approvalNotes, refundAmount, updatedBy } = body;

    // Get existing return
    const existingReturn = await prisma.purchaseReturn.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        supplierId: true,
        purchaseOrderId: true,
        branchId: true,
        branchSystemId: true,
        employeeId: true,
        status: true,
        reason: true,
        purchaseOrderSystemId: true,
        purchaseOrderBusinessId: true,
        supplierSystemId: true,
        supplierName: true,
        branchName: true,
        refundMethod: true,
        accountSystemId: true,
        creatorName: true,
        createdBy: true,
        updatedBy: true,
        subtotal: true,
        total: true,
        totalReturnValue: true,
        refundAmount: true,
        returnDate: true,
        returnItems: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            systemId: true,
            productId: true,
            quantity: true,
            unitPrice: true,
            total: true,
            reason: true,
          },
        },
        suppliers: {
          select: { systemId: true, id: true, name: true, phone: true, email: true, address: true, bankAccount: true, bankName: true },
        },
      },
    });

    if (!existingReturn) {
      return apiNotFound('PurchaseReturn');
    }

    // Validate status transition
    const currentStatus = existingReturn.status;
    const _newStatus = status || currentStatus;

    // Define valid transitions
    const validTransitions: Record<string, string[]> = {
      DRAFT: ['PENDING', 'CANCELLED'],
      PENDING: ['APPROVED', 'CANCELLED'],
      APPROVED: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [], // Cannot transition from completed
      CANCELLED: [], // Cannot transition from cancelled
    };

    if (
      status &&
      status !== currentStatus &&
      !validTransitions[currentStatus]?.includes(status)
    ) {
      return apiError(
        `Invalid status transition from ${currentStatus} to ${status}`,
        400
      );
    }

    // Perform update with transaction if status is changing to APPROVED or CANCELLED
    const purchaseReturn = await prisma.$transaction(async (tx) => {
      // Prepare update data
      const updateData: Prisma.PurchaseReturnUpdateInput = {
        updatedAt: new Date(),
        updatedBy: updatedBy || session!.user?.id || null,
      };

      if (status !== undefined) updateData.status = status as Prisma.PurchaseReturnUpdateInput['status'];
      if (reason !== undefined) updateData.reason = reason;
      if (refundAmount !== undefined) updateData.refundAmount = refundAmount;

      // Handle approval logic
      if (status === 'APPROVED' && currentStatus !== 'APPROVED') {
        // Approval processing already done during creation
        // Just update status and record who approved
        updateData.status = 'APPROVED';
      }

      // Handle cancellation logic
      if (status === 'CANCELLED' && currentStatus !== 'CANCELLED') {
        // Reverse inventory changes
        interface ReturnItem {
          productSystemId: string;
          productName?: string;
          returnQuantity: number;
        }
        const returnItems = (existingReturn.returnItems as ReturnItem[] | null) || [];
        for (const item of returnItems) {
          // Restore inventory
          if (existingReturn.branchSystemId) {
            // ✅ Use upsert to get actual DB value after update
            const updatedInventory = await tx.productInventory.upsert({
              where: {
                productId_branchId: {
                  productId: item.productSystemId,
                  branchId: existingReturn.branchSystemId,
                },
              },
              update: {
                onHand: { increment: item.returnQuantity },
              },
              create: {
                productId: item.productSystemId,
                branchId: existingReturn.branchSystemId,
                onHand: item.returnQuantity,
                committed: 0,
                inTransit: 0,
                inDelivery: 0,
              },
            });
            
            // ✅ Create stock history record with actual DB value
            await tx.stockHistory.create({
              data: {
                productId: item.productSystemId,
                branchId: existingReturn.branchSystemId,
                action: 'Nhập kho hủy trả NCC',
                source: 'Phiếu trả hàng nhập',
                quantityChange: item.returnQuantity,
                newStockLevel: updatedInventory.onHand, // ✅ Use actual DB value
                documentId: existingReturn.id,
                documentType: 'purchase_return',
                employeeId: session!.user?.id,
                employeeName: session!.user?.name || undefined,
                note: `Nhập lại kho do hủy trả NCC - ${item.productName || item.productSystemId}`,
              },
            });
          }

          // Restore general inventory
          const inventory = await tx.inventory.findFirst({
            where: { productId: item.productSystemId },
          });

          if (inventory) {
            await tx.inventory.update({
              where: { systemId: inventory.systemId },
              data: {
                quantity: { increment: item.returnQuantity },
              },
            });
          }
        }

        // Reverse supplier balance
        if (Number(existingReturn.refundAmount) > 0 && existingReturn.supplierId) {
          await tx.supplier.update({
            where: { systemId: existingReturn.supplierId },
            data: {
              currentDebt: { increment: existingReturn.refundAmount },
              totalDebt: { increment: existingReturn.refundAmount },
            },
          });
        }
      }

      // Log activity to centralized ActivityLog table
      await tx.activityLog.create({
        data: {
          entityType: 'purchase_return',
          entityId: systemId,
          action: status ? 'status_changed' : 'updated',
          actionType: status ? 'status' : 'update',
          changes: status ? { status: { from: currentStatus, to: status } } : undefined,
          note: approvalNotes ||
            (status === 'APPROVED'
              ? 'Phê duyệt phiếu trả hàng'
              : status === 'CANCELLED'
              ? 'Hủy phiếu trả hàng'
              : 'Cập nhật phiếu trả hàng'),
          createdBy: session!.user?.employee?.fullName || session!.user?.name || session!.user?.id || null,
          metadata: { userName: session!.user?.name || 'System' },
        },
      });

      // Perform update
      const updated = await tx.purchaseReturn.update({
        where: { systemId },
        data: updateData,
        select: {
          systemId: true,
          id: true,
          supplierId: true,
          purchaseOrderId: true,
          branchId: true,
          branchSystemId: true,
          employeeId: true,
          status: true,
          reason: true,
          purchaseOrderSystemId: true,
          purchaseOrderBusinessId: true,
          supplierSystemId: true,
          supplierName: true,
          branchName: true,
          refundMethod: true,
          accountSystemId: true,
          creatorName: true,
          createdBy: true,
          updatedBy: true,
          subtotal: true,
          total: true,
          totalReturnValue: true,
          refundAmount: true,
          returnDate: true,
          returnItems: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              systemId: true,
              productId: true,
              quantity: true,
              unitPrice: true,
              total: true,
              reason: true,
            },
          },
          suppliers: {
            select: { systemId: true, id: true, name: true, phone: true, email: true, address: true, bankAccount: true, bankName: true },
          },
        },
      });

      return updated;
    });

    // Convert Decimal fields to numbers for serialization
    const serializable = {
      ...purchaseReturn,
      subtotal: Number(purchaseReturn.subtotal),
      total: Number(purchaseReturn.total),
      totalReturnValue: Number(purchaseReturn.totalReturnValue),
      refundAmount: Number(purchaseReturn.refundAmount),
      items: purchaseReturn.items?.map((item: { unitPrice?: unknown; total?: unknown }) => ({
        ...item,
        unitPrice: Number(item.unitPrice ?? 0),
        total: Number(item.total ?? 0),
      })),
    };

    // Sync inventory changes to Meilisearch when cancelled (inventory was restored)
    if (status === 'CANCELLED') {
      interface ReturnItem {
        productSystemId: string;
      }
      const returnItems = (existingReturn.returnItems as ReturnItem[] | null) || [];
      const productSystemIds = returnItems.map(item => item.productSystemId).filter(Boolean);
      if (productSystemIds.length > 0) {
        syncProductsInventory(productSystemIds).catch(err =>
          logError('[Purchase Returns API] Meilisearch sync failed', err)
        );
      }
    }

    // Notify creator about purchase return status change
    if (purchaseReturn.createdBy && purchaseReturn.createdBy !== session!.user?.employeeId) {
      const statusLabel = status === 'APPROVED' ? 'được phê duyệt' : status === 'CANCELLED' ? 'bị hủy' : 'được cập nhật';
      createNotification({
        type: 'purchase_return',
        settingsKey: 'purchase-return:updated',
        title: 'Phiếu trả hàng nhập ' + statusLabel,
        message: `Phiếu trả hàng ${purchaseReturn.id || systemId} đã ${statusLabel}`,
        link: `/purchase-returns/${systemId}`,
        recipientId: purchaseReturn.createdBy,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
      }).catch(e => logError('[Purchase Return PATCH] notification failed', e));
    }

    return apiSuccess(serializable);
  } catch (error) {
    logError('[Purchase Returns API] PATCH error', error);
    return apiError('Không thể cập nhật phiếu trả hàng nhập', 500);
  }
})

// DELETE - Delete purchase return (with inventory and supplier balance reversal)
export const DELETE = apiHandler(async (request, { session, params }) => {
  try {
    const { systemId } = params;

    // Get return details for reversal
    const purchaseReturn = await prisma.purchaseReturn.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        supplierId: true,
        purchaseOrderId: true,
        branchId: true,
        branchSystemId: true,
        employeeId: true,
        status: true,
        reason: true,
        purchaseOrderSystemId: true,
        purchaseOrderBusinessId: true,
        supplierSystemId: true,
        supplierName: true,
        branchName: true,
        refundMethod: true,
        accountSystemId: true,
        creatorName: true,
        createdBy: true,
        updatedBy: true,
        subtotal: true,
        total: true,
        totalReturnValue: true,
        refundAmount: true,
        returnDate: true,
        returnItems: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            systemId: true,
            productId: true,
            quantity: true,
            unitPrice: true,
            total: true,
            reason: true,
          },
        },
      },
    });

    if (!purchaseReturn) {
      return apiNotFound('PurchaseReturn');
    }

    // Only allow deletion if status is DRAFT or CANCELLED
    if (!['DRAFT', 'CANCELLED'].includes(purchaseReturn.status)) {
      return apiError(
        'Cannot delete purchase return with status ' + purchaseReturn.status,
        400
      );
    }

    await prisma.$transaction(async (tx) => {
      // If not cancelled, reverse the inventory and supplier balance changes
      if (purchaseReturn.status !== 'CANCELLED') {
        interface ReturnItemRecord {
          productSystemId: string;
          productName?: string;
          returnQuantity: number;
        }
        const returnItems = (purchaseReturn.returnItems as ReturnItemRecord[] | null) || [];

        // Restore inventory
        for (const item of returnItems) {
          if (purchaseReturn.branchSystemId) {
            // ✅ Use upsert to get actual DB value after update
            const updatedInventory = await tx.productInventory.upsert({
              where: {
                productId_branchId: {
                  productId: item.productSystemId,
                  branchId: purchaseReturn.branchSystemId,
                },
              },
              update: {
                onHand: { increment: item.returnQuantity },
              },
              create: {
                productId: item.productSystemId,
                branchId: purchaseReturn.branchSystemId,
                onHand: item.returnQuantity,
                committed: 0,
                inTransit: 0,
                inDelivery: 0,
              },
            });
            
            // ✅ Create stock history record with actual DB value
            await tx.stockHistory.create({
              data: {
                productId: item.productSystemId,
                branchId: purchaseReturn.branchSystemId,
                action: 'Nhập kho xóa trả NCC',
                source: 'Phiếu trả hàng nhập',
                quantityChange: item.returnQuantity,
                newStockLevel: updatedInventory.onHand, // ✅ Use actual DB value
                documentId: purchaseReturn.id,
                documentType: 'purchase_return',
                employeeId: session!.user?.id,
                employeeName: session!.user?.name || undefined,
                note: `Nhập lại kho do xóa phiếu trả NCC - ${item.productName || item.productSystemId}`,
              },
            });
          }

          const inventory = await tx.inventory.findFirst({
            where: { productId: item.productSystemId },
          });

          if (inventory) {
            await tx.inventory.update({
              where: { systemId: inventory.systemId },
              data: {
                quantity: { increment: item.returnQuantity },
              },
            });
          }
        }

        // Restore supplier balance
        if (Number(purchaseReturn.refundAmount) > 0 && purchaseReturn.supplierId) {
          await tx.supplier.update({
            where: { systemId: purchaseReturn.supplierId },
            data: {
              currentDebt: { increment: purchaseReturn.refundAmount },
              totalDebt: { increment: purchaseReturn.refundAmount },
            },
          });
        }
      }

      // Delete items first (cascade should handle this, but being explicit)
      await tx.purchaseReturnItem.deleteMany({
        where: { returnId: systemId },
      });

      // Delete the return
      await tx.purchaseReturn.delete({
        where: { systemId },
      });
    });

    // Sync inventory changes to Meilisearch if inventory was restored (not already cancelled)
    if (purchaseReturn.status !== 'CANCELLED') {
      interface ReturnItemRecord {
        productSystemId: string;
      }
      const returnItems = (purchaseReturn.returnItems as ReturnItemRecord[] | null) || [];
      const productSystemIds = returnItems.map(item => item.productSystemId).filter(Boolean);
      if (productSystemIds.length > 0) {
        syncProductsInventory(productSystemIds).catch(err =>
          logError('[Purchase Returns API] Meilisearch sync failed', err)
        );
      }
    }

    return apiSuccess({ success: true, message: 'Purchase return deleted' });
  } catch (error) {
    logError('[Purchase Returns API] DELETE error', error);
    return apiError('Không thể xóa phiếu trả hàng nhập', 500);
  }
})
