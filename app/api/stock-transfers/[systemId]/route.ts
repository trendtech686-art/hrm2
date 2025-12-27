/**
 * Stock Transfer Detail API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single stock transfer
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    const stockTransfer = await prisma.stockTransfer.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!stockTransfer) {
      return NextResponse.json(
        { error: 'Stock transfer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(stockTransfer);
  } catch (error) {
    console.error('[Stock Transfers API] GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock transfer' },
      { status: 500 }
    );
  }
}

// PATCH - Update stock transfer
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;
    const body = await request.json();

    const {
      status,
      notes,
      updatedBy,
      ...otherFields
    } = body;

    const stockTransfer = await prisma.stockTransfer.update({
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

    return NextResponse.json(stockTransfer);
  } catch (error) {
    console.error('[Stock Transfers API] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update stock transfer' },
      { status: 500 }
    );
  }
}

// DELETE - Soft or hard delete stock transfer
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;
    const body = await request.json().catch(() => ({}));
    const hard = body.hard === true;

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Stock Transfers API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete stock transfer' },
      { status: 500 }
    );
  }
}
