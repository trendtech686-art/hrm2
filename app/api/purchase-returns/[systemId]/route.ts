/**
 * Purchase Return Detail API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single purchase return
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    const purchaseReturn = await prisma.purchaseReturn.findUnique({
      where: { systemId },
      include: {
        items: true,
        suppliers: true,
      },
    });

    if (!purchaseReturn) {
      return NextResponse.json(
        { error: 'Purchase return not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(purchaseReturn);
  } catch (error) {
    console.error('[Purchase Returns API] GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase return' },
      { status: 500 }
    );
  }
}

// PATCH - Update purchase return
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;
    const body = await request.json();

    const { status, reason, updatedBy } = body;

    const purchaseReturn = await prisma.purchaseReturn.update({
      where: { systemId },
      data: {
        ...(status !== undefined && { status }),
        ...(reason !== undefined && { reason }),
        ...(updatedBy !== undefined && { updatedBy }),
        updatedAt: new Date(),
      },
      include: {
        items: true,
        suppliers: true,
      },
    });

    return NextResponse.json(purchaseReturn);
  } catch (error) {
    console.error('[Purchase Returns API] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update purchase return' },
      { status: 500 }
    );
  }
}

// DELETE - Delete purchase return
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    await prisma.purchaseReturnItem.deleteMany({
      where: { returnId: systemId },
    });
    
    await prisma.purchaseReturn.delete({
      where: { systemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Purchase Returns API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete purchase return' },
      { status: 500 }
    );
  }
}
