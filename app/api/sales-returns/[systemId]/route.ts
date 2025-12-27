/**
 * Sales Return Detail API Route
 * 
 * GET    /api/sales-returns/[systemId] - Get single sales return
 * PATCH  /api/sales-returns/[systemId] - Update sales return
 * DELETE /api/sales-returns/[systemId] - Delete sales return (soft/hard)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single sales return
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    const salesReturn = await prisma.salesReturn.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!salesReturn) {
      return NextResponse.json(
        { error: 'Sales return not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(salesReturn);
  } catch (error) {
    console.error('[Sales Returns API] GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales return' },
      { status: 500 }
    );
  }
}

// PATCH - Update sales return
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;
    const body = await request.json();

    const {
      refundMethod,
      refundStatus,
      reason,
      notes,
      updatedBy,
      ...otherFields
    } = body;

    const salesReturn = await prisma.salesReturn.update({
      where: { systemId },
      data: {
        ...(refundMethod !== undefined && { refundMethod }),
        ...(refundStatus !== undefined && { refundStatus }),
        ...(reason !== undefined && { reason }),
        ...(notes !== undefined && { notes }),
        ...(updatedBy !== undefined && { updatedBy }),
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(salesReturn);
  } catch (error) {
    console.error('[Sales Returns API] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update sales return' },
      { status: 500 }
    );
  }
}

// DELETE - Soft or hard delete sales return
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Sales Returns API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete sales return' },
      { status: 500 }
    );
  }
}
