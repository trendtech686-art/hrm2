import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TYPE = 'customer-source';

// GET - List all customer sources
export async function GET() {
  try {
    const settings = await prisma.customerSetting.findMany({
      where: { type: TYPE, isDeleted: false },
      orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
    });

    const transformed = settings.map(s => ({
      systemId: s.systemId,
      id: s.id,
      name: s.name,
      type: s.type,
      description: s.description,
      color: s.color,
      isDefault: s.isDefault,
      isActive: s.isActive,
      orderIndex: s.orderIndex,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      createdBy: s.createdBy,
      updatedBy: s.updatedBy,
      ...(s.metadata as Record<string, unknown> || {}),
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('[Customer Sources API] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch customer sources' }, { status: 500 });
  }
}

// POST - Create a new customer source
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color, isDefault, isActive, orderIndex, ...rest } = body;

    const setting = await prisma.customerSetting.create({
      data: {
        id: crypto.randomUUID(),
        name,
        type: TYPE,
        description,
        color,
        isDefault: isDefault ?? false,
        isActive: isActive ?? true,
        orderIndex: orderIndex ?? 0,
        metadata: rest,
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
    }, { status: 201 });
  } catch (error) {
    console.error('[Customer Sources API] POST error:', error);
    return NextResponse.json({ error: 'Failed to create customer source' }, { status: 500 });
  }
}
