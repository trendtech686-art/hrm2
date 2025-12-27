/**
 * Leave Detail API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single leave
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    const leave = await prisma.leave.findUnique({
      where: { systemId },
      include: {
        employee: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
          },
        },
      },
    });

    if (!leave) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(leave);
  } catch (error) {
    console.error('[Leaves API] GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leave request' },
      { status: 500 }
    );
  }
}

// PATCH - Update leave (approve/reject)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;
    const body = await request.json();

    const {
      status,
      approvedBy,
      notes,
      updatedBy,
    } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (updatedBy !== undefined) updateData.updatedBy = updatedBy;
    
    // If approving, set approvedBy and approvedAt
    if (status === 'approved' && approvedBy) {
      updateData.approvedBy = approvedBy;
      updateData.approvedAt = new Date();
    }

    const leave = await prisma.leave.update({
      where: { systemId },
      data: updateData,
      include: {
        employee: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
          },
        },
      },
    });

    return NextResponse.json(leave);
  } catch (error) {
    console.error('[Leaves API] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update leave request' },
      { status: 500 }
    );
  }
}

// DELETE - Soft or hard delete leave
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;
    const body = await request.json().catch(() => ({}));
    const hard = body.hard === true;

    if (hard) {
      await prisma.leave.delete({
        where: { systemId },
      });
    } else {
      // Leave has no soft delete fields, use hard delete
      await prisma.leave.delete({
        where: { systemId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Leaves API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete leave request' },
      { status: 500 }
    );
  }
}
