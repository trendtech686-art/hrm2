import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
    const session = await getSessionFromCookie();
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
    logError('Error fetching sales channel', error);
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
    const session = await getSessionFromCookie();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = salesChannelUpdateSchema.parse(body);

    const existing = await prisma.salesChannel.findUnique({ where: { systemId: systemid } });
    if (!existing) {
      return NextResponse.json({ error: 'Sales channel not found' }, { status: 404 });
    }

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

    // Activity log - labels tiếng Việt
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (validatedData.name !== undefined && validatedData.name !== existing.name)
      changes['Tên'] = { from: existing.name, to: validatedData.name }
    if (validatedData.isApplied !== undefined && validatedData.isApplied !== existing.isApplied)
      changes['Áp dụng'] = { from: existing.isApplied ? 'Có' : 'Không', to: validatedData.isApplied ? 'Có' : 'Không' }
    if (validatedData.isDefault !== undefined && validatedData.isDefault !== existing.isDefault)
      changes['Mặc định'] = { from: existing.isDefault ? 'Có' : 'Không', to: validatedData.isDefault ? 'Có' : 'Không' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'sales_channel',
        entityId: systemid,
        action: `Cập nhật kênh bán hàng: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return NextResponse.json(salesChannel);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    logError('Error updating sales channel', error);
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
    const session = await getSessionFromCookie();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.salesChannel.findUnique({ where: { systemId: systemid } });

    await prisma.salesChannel.delete({
      where: { systemId: systemid },
    });

    if (existing) {
      await createActivityLog({
        entityType: 'sales_channel',
        entityId: systemid,
        action: `Xóa kênh bán hàng: ${existing.name}`,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('Error deleting sales channel', error);
    return NextResponse.json(
      { error: 'Failed to delete sales channel' },
      { status: 500 }
    );
  }
}
