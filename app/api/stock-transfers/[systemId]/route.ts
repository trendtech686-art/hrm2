/**
 * Stock Transfer Detail API Route
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StockTransferStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { updateStockTransferSchema, deleteStockTransferSchema } from './validation';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single stock transfer
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    const stockTransfer = await prisma.stockTransfer.findUnique({
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

    if (!stockTransfer) {
      return apiError('Không tìm thấy phiếu chuyển kho', 404);
    }

    // Fetch product images for all items
    const productIds = stockTransfer.items
      .map(item => item.productId)
      .filter((id): id is string => !!id);
    
    // Fetch from Product table and File table in parallel
    const [products, files] = await Promise.all([
      productIds.length > 0 
        ? prisma.product.findMany({
            where: { systemId: { in: productIds } },
            select: { systemId: true, thumbnailImage: true, galleryImages: true },
          })
        : [],
      productIds.length > 0
        ? prisma.file.findMany({
            where: { 
              entityType: 'products', 
              entityId: { in: productIds },
              status: 'permanent',
              mimetype: { startsWith: 'image/' },
            },
            select: { entityId: true, filepath: true },
            orderBy: { uploadedAt: 'desc' },
          })
        : [],
    ]);
    
    // Build file image map (first image per product)
    const fileImageMap = new Map<string, string>();
    for (const file of files) {
      if (!fileImageMap.has(file.entityId)) {
        fileImageMap.set(file.entityId, file.filepath);
      }
    }
    
    // Build product image map: prioritize Product fields, then File table
    const productImageMap = new Map<string, string | null>(
      products.map(p => [
        p.systemId, 
        p.thumbnailImage || (p.galleryImages as string[])?.[0] || fileImageMap.get(p.systemId) || null
      ] as const)
    );
    
    // For products not in Product table but have files
    for (const [entityId, filepath] of fileImageMap) {
      if (!productImageMap.has(entityId)) {
        productImageMap.set(entityId, filepath);
      }
    }

    // Transform items to match frontend expectations
    const transformedItems = stockTransfer.items.map(item => ({
      ...item,
      // Map database fields to frontend expected fields
      productSystemId: item.productId, // DB productId is actually productSystemId
      productId: item.productSku, // DB productSku is actually the business ID
      receivedQuantity: item.receivedQty,
      // Include product image from lookup
      productImage: item.productId ? productImageMap.get(item.productId) || null : null,
    }));

    // Transform status to lowercase and convert dates for frontend compatibility
    const transformedResult = {
      ...stockTransfer,
      status: stockTransfer.status.toLowerCase(),
      items: transformedItems,
      // Ensure dates are ISO strings for JSON serialization
      createdDate: stockTransfer.createdDate?.toISOString() || stockTransfer.createdAt?.toISOString(),
      createdAt: stockTransfer.createdAt?.toISOString(),
      updatedAt: stockTransfer.updatedAt?.toISOString(),
      transferDate: stockTransfer.transferDate?.toISOString(),
      transferredDate: stockTransfer.transferredDate?.toISOString() || null,
      receivedDate: stockTransfer.receivedDate?.toISOString() || null,
      cancelledDate: stockTransfer.cancelledDate?.toISOString() || null,
    };

    return apiSuccess(transformedResult);
  } catch (error) {
    logError('[Stock Transfers API] GET by ID error', error);
    return apiError('Lỗi khi lấy phiếu chuyển kho', 500);
  }
}

// PATCH - Update stock transfer
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, updateStockTransferSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }
  const { status, notes, updatedBy } = validation.data;

  try {
    const { systemId } = await params;

    const stockTransfer = await prisma.stockTransfer.update({
      where: { systemId },
      data: {
        ...(status !== undefined && { status: status.toUpperCase() as StockTransferStatus }),
        ...(notes !== undefined && { notes }),
        ...(updatedBy !== undefined && { updatedBy }),
        updatedAt: new Date(),
      },
      select: {
        systemId: true, id: true, status: true, notes: true, updatedAt: true,
        fromBranchId: true, fromBranchName: true, fromBranchSystemId: true,
        toBranchId: true, toBranchName: true, toBranchSystemId: true,
        employeeId: true, createdBy: true, createdByName: true,
        transferDate: true, transferredDate: true, receivedDate: true,
        cancelledDate: true, cancelReason: true,
        items: {
          select: {
            systemId: true, productId: true, productName: true, productSku: true,
            quantity: true, receivedQty: true,
          },
        },
      },
    });

    // Transform status to lowercase for frontend compatibility
    const transformedResult = {
      ...stockTransfer,
      status: stockTransfer.status.toLowerCase(),
    };

    // Notify creator about stock transfer update
    if (stockTransfer.createdBy && stockTransfer.createdBy !== session.user?.employeeId) {
      createNotification({
        type: 'stock_transfer',
        settingsKey: 'stock-transfer:updated',
        title: 'Chuyển kho cập nhật',
        message: `Phiếu chuyển kho ${stockTransfer.id || systemId} đã được cập nhật${status ? ` - ${status}` : ''}`,
        link: `/stock-transfers/${systemId}`,
        recipientId: stockTransfer.createdBy,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Stock Transfer PATCH] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'stock_transfer',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật phiếu chuyển kho`,
          metadata: { userName, changes: { status, notes } },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] stock_transfer update failed', e))

    return apiSuccess(transformedResult);
  } catch (error) {
    logError('[Stock Transfers API] PATCH error', error);
    return apiError('Lỗi khi cập nhật phiếu chuyển kho', 500);
  }
}

// DELETE - Soft or hard delete stock transfer
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, deleteStockTransferSchema).catch(() => ({ success: true, data: {} as { hard?: boolean } }));
  const hard = validation.success && validation.data?.hard === true;

  try {
    const { systemId } = await params;

    if (hard) {
      await prisma.stockTransferItem.deleteMany({
        where: { transferId: systemId },
      });
      
      await prisma.stockTransfer.delete({
        where: { systemId },
      });
    } else {
      // Stock transfer has no soft delete fields, use hard delete
      await prisma.stockTransferItem.deleteMany({
        where: { transferId: systemId },
      });
      
      await prisma.stockTransfer.delete({
        where: { systemId },
      });
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'stock_transfer',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa phiếu chuyển kho`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] stock_transfer delete failed', e))
    return apiSuccess({ success: true });
  } catch (error) {
    logError('[Stock Transfers API] DELETE error', error);
    return apiError('Lỗi khi xóa phiếu chuyển kho', 500);
  }
}
