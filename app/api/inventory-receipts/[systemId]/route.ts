/**
 * Inventory Receipt Detail API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single inventory receipt
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    const inventoryReceipt = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!inventoryReceipt) {
      return NextResponse.json(
        { error: 'Inventory receipt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inventoryReceipt);
  } catch (error) {
    console.error('[Inventory Receipts API] GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory receipt' },
      { status: 500 }
    );
  }
}

// PATCH - Update inventory receipt
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    return NextResponse.json(inventoryReceipt);
  } catch (error) {
    console.error('[Inventory Receipts API] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory receipt' },
      { status: 500 }
    );
  }
}

// DELETE - Delete inventory receipt
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Inventory Receipts API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete inventory receipt' },
      { status: 500 }
    );
  }
}
