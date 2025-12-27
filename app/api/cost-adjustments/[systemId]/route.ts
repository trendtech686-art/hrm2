/**
 * Cost Adjustment Detail API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single cost adjustment
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    const costAdjustment = await prisma.costAdjustment.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!costAdjustment) {
      return NextResponse.json(
        { error: 'Cost adjustment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(costAdjustment);
  } catch (error) {
    console.error('[Cost Adjustments API] GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cost adjustment' },
      { status: 500 }
    );
  }
}

// PATCH - Update cost adjustment
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;
    const body = await request.json();

    const { status, reason, updatedBy } = body;

    const costAdjustment = await prisma.costAdjustment.update({
      where: { systemId },
      data: {
        ...(status !== undefined && { status }),
        ...(reason !== undefined && { reason }),
        ...(updatedBy !== undefined && { updatedBy }),
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(costAdjustment);
  } catch (error) {
    console.error('[Cost Adjustments API] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update cost adjustment' },
      { status: 500 }
    );
  }
}

// DELETE - Delete cost adjustment
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    await prisma.costAdjustmentItem.deleteMany({
      where: { adjustmentId: systemId },
    });
    
    await prisma.costAdjustment.delete({
      where: { systemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Cost Adjustments API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete cost adjustment' },
      { status: 500 }
    );
  }
}
