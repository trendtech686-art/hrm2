/**
 * Inventory Check Detail API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single inventory check
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    const inventoryCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!inventoryCheck) {
      return NextResponse.json(
        { error: 'Inventory check not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inventoryCheck);
  } catch (error) {
    console.error('[Inventory Checks API] GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory check' },
      { status: 500 }
    );
  }
}

// PATCH - Update inventory check
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    return NextResponse.json(inventoryCheck);
  } catch (error) {
    console.error('[Inventory Checks API] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory check' },
      { status: 500 }
    );
  }
}

// DELETE - Soft or hard delete inventory check
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Inventory Checks API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete inventory check' },
      { status: 500 }
    );
  }
}
