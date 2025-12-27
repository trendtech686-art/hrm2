import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Valid customer setting types
const VALID_TYPES = [
  'customer-group',
  'customer-type', 
  'customer-source',
  'payment-term',
  'credit-rating',
  'lifecycle-stage',
  'sla-setting',
];

// GET - List all customer settings (optionally filter by type)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    const where: { type?: string; isDeleted?: boolean } = { isDeleted: false };
    if (type && VALID_TYPES.includes(type)) {
      where.type = type;
    }

    const settings = await prisma.customerSetting.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { orderIndex: 'asc' },
        { name: 'asc' },
      ],
    });

    // Transform metadata back to flat structure
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
    console.error('[Customer Settings API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer settings' },
      { status: 500 }
    );
  }
}

// POST - Create new customer setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      systemId, 
      id, 
      name, 
      type, 
      description, 
      color, 
      isDefault, 
      isActive,
      orderIndex,
      createdBy,
      ...extraFields 
    } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const created = await prisma.customerSetting.create({
      data: {
        systemId: systemId || undefined, // Let Prisma generate if not provided
        id: id || `${type.toUpperCase()}-${Date.now()}`,
        name,
        type,
        description,
        color,
        isDefault: isDefault ?? false,
        isActive: isActive ?? true,
        orderIndex,
        metadata: Object.keys(extraFields).length > 0 ? extraFields : null,
        createdBy,
        updatedBy: createdBy,
      },
    });

    return NextResponse.json({
      systemId: created.systemId,
      id: created.id,
      name: created.name,
      type: created.type,
      description: created.description,
      color: created.color,
      isDefault: created.isDefault,
      isActive: created.isActive,
      orderIndex: created.orderIndex,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      createdBy: created.createdBy,
      updatedBy: created.updatedBy,
      ...(created.metadata as Record<string, unknown> || {}),
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Customer Settings API] POST error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A setting with this ID already exists for this type' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create customer setting' },
      { status: 500 }
    );
  }
}
