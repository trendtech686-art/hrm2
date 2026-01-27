/**
 * Sales Return Detail API Route
 * 
 * GET    /api/sales-returns/[systemId] - Get single sales return
 * PATCH  /api/sales-returns/[systemId] - Update sales return
 * DELETE /api/sales-returns/[systemId] - Delete sales return (soft/hard)
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SalesReturnStatus } from '@/generated/prisma/enums';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single sales return
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    const salesReturn = await prisma.salesReturn.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!salesReturn) {
      return apiNotFound('SalesReturn');
    }

    return apiSuccess(salesReturn);
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
    const existingReturn = await prisma.salesReturn.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!existingReturn) {
      return apiNotFound('SalesReturn');
    }

    // Build update data - using inferred type
    const updateData: any = {
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
      where: { systemId },
      data: updateData,
      include: {
        items: true,
      },
    });

    return apiSuccess(salesReturn);
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

    if (hard) {
      // First delete items
      await prisma.salesReturnItem.deleteMany({
        where: { returnId: systemId },
      });
      
      // Then delete return
      await prisma.salesReturn.delete({
        where: { systemId },
      });
    } else {
      // SalesReturn has no soft delete fields, use hard delete
      await prisma.salesReturnItem.deleteMany({
        where: { returnId: systemId },
      });
      
      await prisma.salesReturn.delete({
        where: { systemId },
      });
    }

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Sales Returns API] DELETE error:', error);
    return apiError('Failed to delete sales return', 500);
  }
}
