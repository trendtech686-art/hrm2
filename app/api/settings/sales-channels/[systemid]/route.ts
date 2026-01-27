import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const salesChannelUpdateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).optional(),
  isApplied: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

// GET /api/settings/sales-channels/[systemid]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ systemid: string }> }
) {
  try {
    const { systemid } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const salesChannel = await prisma.salesChannel.findUnique({
      where: { systemId: systemid },
    });

    if (!salesChannel) {
      return NextResponse.json(
        { error: 'Sales channel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(salesChannel);
  } catch (error) {
    console.error('Error fetching sales channel:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales channel' },
      { status: 500 }
    );
  }
}

// PATCH /api/settings/sales-channels/[systemid]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ systemid: string }> }
) {
  try {
    const { systemid } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = salesChannelUpdateSchema.parse(body);

    // If setting as default, unset other defaults
    if (validatedData.isDefault === true) {
      await prisma.salesChannel.updateMany({
        where: { 
          isDefault: true,
          systemId: { not: systemid }
        },
        data: { isDefault: false },
      });
    }

    const salesChannel = await prisma.salesChannel.update({
      where: { systemId: systemid },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(salesChannel);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error('Error updating sales channel:', error);
    return NextResponse.json(
      { error: 'Failed to update sales channel' },
      { status: 500 }
    );
  }
}

// DELETE /api/settings/sales-channels/[systemid]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ systemid: string }> }
) {
  try {
    const { systemid } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.salesChannel.delete({
      where: { systemId: systemid },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sales channel:', error);
    return NextResponse.json(
      { error: 'Failed to delete sales channel' },
      { status: 500 }
    );
  }
}
