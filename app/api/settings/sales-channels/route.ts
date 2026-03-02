import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { parsePagination } from '@/lib/api-utils';
import { z } from 'zod';
import { generateNextIds } from '@/lib/id-system';

// Validation schema
const salesChannelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên nguồn bán hàng không được để trống'),
  isApplied: z.boolean().optional().default(false),
  isDefault: z.boolean().optional().default(false),
});

// GET /api/settings/sales-channels
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const isAppliedParam = searchParams.get('isApplied');

    const where: { isApplied?: boolean } = {};
    if (isAppliedParam !== null) {
      where.isApplied = isAppliedParam === 'true';
    }

    const [data, total] = await Promise.all([
      prisma.salesChannel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.salesChannel.count({ where }),
    ]);

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching sales channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales channels' },
      { status: 500 }
    );
  }
}

// POST /api/settings/sales-channels
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = salesChannelSchema.parse(body);

    // If setting as default, unset other defaults
    if (validatedData.isDefault) {
      await prisma.salesChannel.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }
    
    const { systemId, businessId } = await generateNextIds('sales-channels');

    const salesChannel = await prisma.salesChannel.create({
      data: {
        systemId: body.systemId || systemId,
        id: validatedData.id || businessId,
        name: validatedData.name,
        isApplied: validatedData.isApplied,
        isDefault: validatedData.isDefault,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(salesChannel, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error('Error creating sales channel:', error);
    return NextResponse.json(
      { error: 'Failed to create sales channel' },
      { status: 500 }
    );
  }
}
