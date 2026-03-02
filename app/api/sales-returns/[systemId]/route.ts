/**
 * Sales Return Detail API Route
 * 
 * GET    /api/sales-returns/[systemId] - Get single sales return
 * PATCH  /api/sales-returns/[systemId] - Update sales return
 * DELETE /api/sales-returns/[systemId] - Delete sales return (soft/hard)
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { SalesReturnStatus } from '@/generated/prisma/enums';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { updateCustomerDebt } from '@/lib/services/customer-debt-service';

// Helper to serialize Decimal fields for client
function serializeSalesReturn<T extends { 
  subtotal?: Prisma.Decimal | number | null;
  total?: Prisma.Decimal | number | null;
  refunded?: Prisma.Decimal | number | null;
  totalReturnValue?: Prisma.Decimal | number | null;
  subtotalNew?: Prisma.Decimal | number | null;
  shippingFeeNew?: Prisma.Decimal | number | null;
  discountNew?: Prisma.Decimal | number | null;
  grandTotalNew?: Prisma.Decimal | number | null;
  finalAmount?: Prisma.Decimal | number | null;
  refundAmount?: Prisma.Decimal | number | null;
  items?: { unitPrice?: Prisma.Decimal | number | null; total?: Prisma.Decimal | number | null }[];
}>(sr: T) {
  return {
    ...sr,
    subtotal: sr.subtotal !== null && sr.subtotal !== undefined ? Number(sr.subtotal) : 0,
    total: sr.total !== null && sr.total !== undefined ? Number(sr.total) : 0,
    refunded: sr.refunded !== null && sr.refunded !== undefined ? Number(sr.refunded) : 0,
    totalReturnValue: sr.totalReturnValue !== null && sr.totalReturnValue !== undefined ? Number(sr.totalReturnValue) : 0,
    subtotalNew: sr.subtotalNew !== null && sr.subtotalNew !== undefined ? Number(sr.subtotalNew) : 0,
    shippingFeeNew: sr.shippingFeeNew !== null && sr.shippingFeeNew !== undefined ? Number(sr.shippingFeeNew) : 0,
    discountNew: sr.discountNew !== null && sr.discountNew !== undefined ? Number(sr.discountNew) : 0,
    grandTotalNew: sr.grandTotalNew !== null && sr.grandTotalNew !== undefined ? Number(sr.grandTotalNew) : 0,
    finalAmount: sr.finalAmount !== null && sr.finalAmount !== undefined ? Number(sr.finalAmount) : 0,
    refundAmount: sr.refundAmount !== null && sr.refundAmount !== undefined ? Number(sr.refundAmount) : 0,
    items: sr.items?.map(item => ({
      ...item,
      unitPrice: item.unitPrice !== null && item.unitPrice !== undefined ? Number(item.unitPrice) : 0,
      total: item.total !== null && item.total !== undefined ? Number(item.total) : 0,
    })),
  };
}

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single sales return
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    // ✅ Support lookup by both systemId (UUID) and id (business ID like RETURN000001)
    const salesReturn = await prisma.salesReturn.findFirst({
      where: {
        OR: [
          { systemId },
          { id: systemId },
        ],
      },
      include: {
        items: true, // SalesReturnItem doesn't have product relation
      },
    });

    if (!salesReturn) {
      return apiNotFound('SalesReturn');
    }

    // ✅ Fetch product info separately for each item
    const productIds = salesReturn.items.map(item => item.productId).filter(Boolean) as string[];
    const products = productIds.length > 0 
      ? await prisma.product.findMany({
          where: { systemId: { in: productIds } },
          select: {
            systemId: true,
            id: true,
            name: true,
            thumbnailImage: true,
            imageUrl: true,
          },
        })
      : [];

    // Create a map for quick lookup
    const productMap = new Map(products.map(p => [p.systemId, p]));

    // ✅ Transform items from Prisma schema to match ReturnLineItem type
    const transformedSalesReturn = {
      ...salesReturn,
      // ✅ Convert Date fields to ISO string
      returnDate: salesReturn.returnDate?.toISOString() || salesReturn.createdAt?.toISOString() || null,
      createdAt: salesReturn.createdAt?.toISOString() || null,
      updatedAt: salesReturn.updatedAt?.toISOString() || null,
      // ✅ Convert Decimal fields to Number
      subtotal: Number(salesReturn.subtotal) || 0,
      total: Number(salesReturn.total) || 0,
      refunded: Number(salesReturn.refunded) || 0,
      totalReturnValue: Number(salesReturn.totalReturnValue) || 0,
      subtotalNew: Number(salesReturn.subtotalNew) || 0,
      shippingFeeNew: Number(salesReturn.shippingFeeNew) || 0,
      discountNew: Number(salesReturn.discountNew) || 0,
      grandTotalNew: Number(salesReturn.grandTotalNew) || 0,
      // ✅ Calculate finalAmount if not stored: grandTotalNew - totalReturnValue
      finalAmount: Number(salesReturn.finalAmount) || ((Number(salesReturn.grandTotalNew) || 0) - (Number(salesReturn.totalReturnValue) || 0)),
      refundAmount: Number(salesReturn.refundAmount) || 0,
      items: salesReturn.items.map(item => {
        const product = item.productId ? productMap.get(item.productId) : null;
        return {
          // ReturnLineItem expected fields:
          productSystemId: item.productId || '', // productId in DB = systemId (PROD112654)
          productId: item.productSku || product?.id || item.productId || '', // business ID (ZP8)
          productName: item.productName,
          returnQuantity: item.quantity,
          unitPrice: Number(item.unitPrice) || 0,
          totalValue: Number(item.total) || 0,
          note: item.reason || undefined,
          thumbnailImage: product?.thumbnailImage || product?.imageUrl || undefined,
        };
      }),
    };

    return apiSuccess(transformedSalesReturn);
  } catch (error) {
    console.error('[Sales Returns API] GET by ID error:', error);
    return apiError('Failed to fetch sales return', 500);
  }
}

// PATCH - Update sales return (approve, reject, update status)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const {
      status,
      refundMethod,
      refundAmount,
      reason,
      notes,
      approvalNotes,
      updatedBy,
      ..._otherFields
    } = body;

    // Fetch existing return to validate state transitions
    // ✅ Support lookup by both systemId (UUID) and id (business ID)
    const existingReturn = await prisma.salesReturn.findFirst({
      where: {
        OR: [
          { systemId },
          { id: systemId },
        ],
      },
      include: { items: true },
    });

    if (!existingReturn) {
      return apiNotFound('SalesReturn');
    }

    // Use the actual systemId for updates
    const actualSystemId = existingReturn.systemId;

    // Build update data - using inferred type
    const updateData: {
      updatedAt: Date;
      updatedBy: string | null;
      status?: SalesReturnStatus;
      refundMethod?: string;
      refundAmount?: number;
      refunded?: number;
      reason?: string;
      note?: string;
      notes?: string;
    } = {
      updatedAt: new Date(),
      updatedBy: updatedBy || session.user?.id || null,
    };

    if (status !== undefined) {
      // Validate status transitions
      if (status === 'APPROVED' && existingReturn.status !== 'PENDING') {
        return apiError('Can only approve pending returns', 400);
      }
      if (status === 'REJECTED' && existingReturn.status !== 'PENDING') {
        return apiError('Can only reject pending returns', 400);
      }
      updateData.status = status as SalesReturnStatus;
    }

    if (refundMethod !== undefined) {
      updateData.refundMethod = refundMethod;
    }

    if (refundAmount !== undefined) {
      // Validate refund amount doesn't exceed return total
      if (refundAmount > Number(existingReturn.total)) {
        return apiError('Refund amount exceeds return total', 400);
      }
      updateData.refundAmount = refundAmount;
      updateData.refunded = refundAmount;
    }

    if (reason !== undefined) {
      updateData.reason = reason;
      updateData.note = reason;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (approvalNotes !== undefined) {
      updateData.notes = approvalNotes;
    }

    const salesReturn = await prisma.salesReturn.update({
      where: { systemId: actualSystemId },
      data: updateData,
      include: {
        items: true,
      },
    });

    // Update customer debt if status changed to APPROVED or REJECTED
    if (status !== undefined && salesReturn.customerSystemId) {
      await updateCustomerDebt(salesReturn.customerSystemId).catch(err => {
        console.error('[Update SalesReturn] Failed to update customer debt:', err);
      });
    }

    return apiSuccess(serializeSalesReturn(salesReturn));
  } catch (error) {
    console.error('[Sales Returns API] PATCH error:', error);
    if (error instanceof Error) {
      return apiError(error.message, 500);
    }
    return apiError('Failed to update sales return', 500);
  }
}

// DELETE - Soft or hard delete sales return
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json().catch(() => ({}));
    const hard = body.hard === true;

    // ✅ Support lookup by both systemId (UUID) and id (business ID)
    const existingReturn = await prisma.salesReturn.findFirst({
      where: {
        OR: [
          { systemId },
          { id: systemId },
        ],
      },
      select: {
        systemId: true,
        customerSystemId: true,
      },
    });

    if (!existingReturn) {
      return apiNotFound('SalesReturn');
    }

    const actualSystemId = existingReturn.systemId;
    const customerSystemId = existingReturn.customerSystemId;

    if (hard) {
      // First delete items
      await prisma.salesReturnItem.deleteMany({
        where: { returnId: actualSystemId },
      });
      
      // Then delete return
      await prisma.salesReturn.delete({
        where: { systemId: actualSystemId },
      });
    } else {
      // SalesReturn has no soft delete fields, use hard delete
      await prisma.salesReturnItem.deleteMany({
        where: { returnId: actualSystemId },
      });
      
      await prisma.salesReturn.delete({
        where: { systemId: actualSystemId },
      });
    }

    // Update customer debt after deleting sales return
    if (customerSystemId) {
      await updateCustomerDebt(customerSystemId).catch(err => {
        console.error('[Delete SalesReturn] Failed to update customer debt:', err);
      });
    }

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Sales Returns API] DELETE error:', error);
    return apiError('Failed to delete sales return', 500);
  }
}
