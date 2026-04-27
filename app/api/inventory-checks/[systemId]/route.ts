/**
 * Inventory Check Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single inventory check
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    const inventoryCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!inventoryCheck) {
      return apiNotFound('Inventory check');
    }

    // Fetch product images for all items in parallel with employee names
    const productIds = inventoryCheck.items
      .map(item => item.productId)
      .filter((id): id is string => !!id);
    
    // Also collect productSku for fallback lookup (old data may have business ID in productId)
    const productSkus = inventoryCheck.items
      .map(item => item.productSku)
      .filter((sku): sku is string => !!sku);

    const empIds = [inventoryCheck.createdBy, inventoryCheck.balancedBy].filter(Boolean) as string[];

    // Define types for parallel queries
    type ProductData = { systemId: string; id: string | null; thumbnailImage: string | null; galleryImages: unknown; unit: string | null };
    type FileData = { entityId: string; filepath: string };
    type EmpData = { systemId: string; fullName: string | null };

    const [products, files, emps] = await Promise.all([
      // ✅ Fetch by both systemId and business ID for backwards compatibility
      (productIds.length > 0 || productSkus.length > 0)
        ? prisma.product.findMany({
            where: { 
              OR: [
                { systemId: { in: productIds } },
                { id: { in: productSkus } },
              ]
            },
            select: { systemId: true, id: true, thumbnailImage: true, galleryImages: true, unit: true },
          }) as Promise<ProductData[]>
        : Promise.resolve([] as ProductData[]),
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
          }) as Promise<FileData[]>
        : Promise.resolve([] as FileData[]),
      empIds.length > 0
        ? prisma.employee.findMany({
            where: { systemId: { in: empIds } },
            select: { systemId: true, fullName: true },
          }) as Promise<EmpData[]>
        : Promise.resolve([] as EmpData[]),
    ]);

    // Build file image map (first image per product)
    const fileImageMap = new Map<string, string>();
    for (const file of files) {
      if (!fileImageMap.has(file.entityId)) {
        fileImageMap.set(file.entityId, file.filepath);
      }
    }

    // ✅ Build product data map with BOTH systemId AND business ID as keys
    // This ensures lookup works for both old data (business ID) and new data (systemId)
    const productDataMap = new Map<string, { systemId: string; thumbnailImage: string | null; unit: string | null; productCode: string | null }>();
    for (const p of products) {
      const data = {
        systemId: p.systemId,
        thumbnailImage: p.thumbnailImage || (p.galleryImages as string[])?.[0] || fileImageMap.get(p.systemId) || null,
        unit: p.unit || null,
        productCode: p.id || null, // Business ID/SKU from Product table
      };
      // Add by systemId
      productDataMap.set(p.systemId, data);
      // Also add by business ID for backwards compatibility
      if (p.id && p.id !== p.systemId) {
        productDataMap.set(p.id, data);
      }
    }

    // For products not in Product table but have files
    for (const [entityId, filepath] of fileImageMap) {
      if (!productDataMap.has(entityId)) {
        productDataMap.set(entityId, { systemId: entityId, thumbnailImage: filepath, unit: null, productCode: null });
      }
    }

    // Map items with product images
    const mappedItems = inventoryCheck.items.map(item => {
      // ✅ Try lookup by productSystemId/productId first, then by productSku
      const productData = (item.productSystemId ? productDataMap.get(item.productSystemId) : null)
        || (item.productId ? productDataMap.get(item.productId) : null) 
        || (item.productSku ? productDataMap.get(item.productSku) : null);
      
      return {
        // ✅ Use resolved systemId from product data, or fall back to stored values
        productSystemId: productData?.systemId || item.productSystemId || item.productId || item.productSku,
        productId: productData?.productCode || item.productSku, // Use Product.id first, fallback to item.productSku
        productName: item.productName,
        productImage: productData?.thumbnailImage || null,
        unit: item.unit || productData?.unit || '',
        systemQuantity: item.systemQty,
        actualQuantity: item.actualQty,
        difference: item.difference,
        reason: item.reason || undefined,
        note: item.notes,
      };
    });

    const empMap = new Map<string, string | null>(emps.map(e => [e.systemId, e.fullName] as const));

    return apiSuccess({
      ...inventoryCheck,
      items: mappedItems,
      createdByName: empMap.get(inventoryCheck.createdBy || '') || null,
      balancedByName: empMap.get(inventoryCheck.balancedBy || '') || null,
    });
  } catch (error) {
    logError('[Inventory Checks API] GET by ID error', error);
    return apiError('Lỗi khi lấy phiếu kiểm kê', 500);
  }
}

// PATCH - Update inventory check
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const {
      status,
      notes,
      updatedBy,
    } = body;

    const inventoryCheck = await prisma.inventoryCheck.update({
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

    // ✅ Notify creator about inventory check status update
    if (status && inventoryCheck.createdBy && inventoryCheck.createdBy !== session.user?.employeeId) {
      createNotification({
        type: 'inventory_check',
        settingsKey: 'inventory-check:updated',
        title: 'Cập nhật kiểm kho',
        message: `Phiếu kiểm kho ${inventoryCheck.id || systemId} đã chuyển sang ${status}`,
        link: `/inventory-checks/${systemId}`,
        recipientId: inventoryCheck.createdBy,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Inventory Checks PATCH] notification failed', e))
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'inventory_check',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật phiếu kiểm kê`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] inventory_check update failed', e))
    return apiSuccess(inventoryCheck);
  } catch (error) {
    logError('[Inventory Checks API] PATCH error', error);
    return apiError('Lỗi khi cập nhật phiếu kiểm kê', 500);
  }
}

// DELETE - Soft or hard delete inventory check
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json().catch(() => ({}));
    const hard = body.hard === true;

    if (hard) {
      await prisma.inventoryCheckItem.deleteMany({
        where: { checkId: systemId },
      });
      
      await prisma.inventoryCheck.delete({
        where: { systemId },
      });
    } else {
      // InventoryCheck has no soft delete fields, use hard delete
      await prisma.inventoryCheckItem.deleteMany({
        where: { checkId: systemId },
      });
      
      await prisma.inventoryCheck.delete({
        where: { systemId },
      });
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'inventory_check',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa phiếu kiểm kê`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] inventory_check delete failed', e))
    return apiSuccess({ success: true });
  } catch (error) {
    logError('[Inventory Checks API] DELETE error', error);
    return apiError('Lỗi khi xóa phiếu kiểm kê', 500);
  }
}
