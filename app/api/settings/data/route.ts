import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Valid settings data types
const VALID_TYPES = [
  'unit',
  'tax',
  'shipping-partner',
  'sales-channel',
  'receipt-type',
  'pricing-policy',
  'penalty',
  'penalty-type',
  'payment-type',
  'target-group',
  'task-template',
  'recurring-task',
  'custom-field',
];

// GET - List all settings data (optionally filter by type)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    const where: { type?: string; isDeleted?: boolean } = { isDeleted: false };
    if (type && VALID_TYPES.includes(type)) {
      where.type = type;
    }

    const settings = await prisma.settingsData.findMany({
      where,
      orderBy: [
        { type: 'asc' },
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
      isActive: s.isActive,
      isDefault: s.isDefault,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      createdBy: s.createdBy,
      updatedBy: s.updatedBy,
      ...(s.metadata as Record<string, unknown> || {}),
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('[Settings Data API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings data' },
      { status: 500 }
    );
  }
}

// POST - Create new settings data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      systemId, 
      id, 
      name, 
      type, 
      description,
      isActive,
      isDefault,
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

    const created = await prisma.settingsData.create({
      data: {
        systemId: systemId || undefined,
        id: id || `${type.toUpperCase()}-${Date.now()}`,
        name,
        type,
        description,
        isActive: isActive ?? true,
        isDefault: isDefault ?? false,
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
      isActive: created.isActive,
      isDefault: created.isDefault,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      createdBy: created.createdBy,
      updatedBy: created.updatedBy,
      ...(created.metadata as Record<string, unknown> || {}),
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Settings Data API] POST error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A setting with this ID already exists for this type' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create settings data' },
      { status: 500 }
    );
  }
}
