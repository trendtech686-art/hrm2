import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TYPE = 'customer-type';

// GET - Get a single customer type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const { systemId } = await params;
  try {
    const setting = await prisma.customerSetting.findUnique({
      where: { systemId, type: TYPE },
    });

    if (!setting || setting.isDeleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      systemId: setting.systemId,
      id: setting.id,
      name: setting.name,
      type: setting.type,
      description: setting.description,
      color: setting.color,
      isDefault: setting.isDefault,
      isActive: setting.isActive,
      orderIndex: setting.orderIndex,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
      ...(setting.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Customer Types API] GET by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch customer type' }, { status: 500 });
  }
}

// PATCH - Update a customer type
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const { systemId } = await params;
  try {
    const body = await request.json();
    const { name, description, color, isDefault, isActive, orderIndex, ...rest } = body;

    const setting = await prisma.customerSetting.update({
      where: { systemId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(isDefault !== undefined && { isDefault }),
        ...(isActive !== undefined && { isActive }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(Object.keys(rest).length > 0 && { metadata: rest }),
      },
    });

    return NextResponse.json({
      systemId: setting.systemId,
      id: setting.id,
      name: setting.name,
      type: setting.type,
      description: setting.description,
      color: setting.color,
      isDefault: setting.isDefault,
      isActive: setting.isActive,
      orderIndex: setting.orderIndex,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
      ...(setting.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Customer Types API] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update customer type' }, { status: 500 });
  }
}

// DELETE - Soft delete a customer type
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const { systemId } = await params;
  try {
    await prisma.customerSetting.update({
      where: { systemId },
      data: { isDeleted: true },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[Customer Types API] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete customer type' }, { status: 500 });
  }
}
