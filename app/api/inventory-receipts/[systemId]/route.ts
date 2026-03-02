/**
 * Inventory Receipt Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single inventory receipt
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;
    console.log('[Inventory Receipt Detail] Fetching systemId:', systemId);

    const inventoryReceipt = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!inventoryReceipt) {
      console.log('[Inventory Receipt Detail] Not found:', systemId);
      return apiNotFound('Inventory receipt');
    }

    console.log('[Inventory Receipt Detail] Found:', inventoryReceipt.id);

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
          select: { systemId: true, id: true, name: true, thumbnailImage: true, galleryImages: true },
        })
      : [];
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
          receivedQuantity: item.quantity,
          orderedQuantity: item.quantity,
          unitPrice: Number(item.unitCost) || 0,
          unitCost: Number(item.unitCost) || 0,
          totalCost: Number(item.totalCost) || 0,
        };
      }),
    };

    return apiSuccess(transformedData);
  } catch (error) {
    console.error('[Inventory Receipts API] GET by ID error:', error);
    return apiError('Failed to fetch inventory receipt', 500);
  }
}

// PATCH - Update inventory receipt
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
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

    return apiSuccess(inventoryReceipt);
  } catch (error) {
    console.error('[Inventory Receipts API] PATCH error:', error);
    return apiError('Failed to update inventory receipt', 500);
  }
}

// DELETE - Delete inventory receipt
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json().catch(() => ({}));
    const hard = body.hard === true;

    if (hard) {
      await prisma.inventoryReceiptItem.deleteMany({
        where: { receiptId: systemId },
      });
      
      await prisma.inventoryReceipt.delete({
        where: { systemId },
      });
    } else {
      // Soft delete not supported in schema, use hard delete
      await prisma.inventoryReceiptItem.deleteMany({
        where: { receiptId: systemId },
      });
      
      await prisma.inventoryReceipt.delete({
        where: { systemId },
      });
    }

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Inventory Receipts API] DELETE error:', error);
    return apiError('Failed to delete inventory receipt', 500);
  }
}
