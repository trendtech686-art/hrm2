/**
 * Cost Adjustments API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List cost adjustments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.costAdjustment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.costAdjustment.count({ where }),
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
    console.error('[Cost Adjustments API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cost adjustments' },
      { status: 500 }
    );
  }
}

// POST - Create new cost adjustment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      systemId,
      id,
      branchId,
      employeeId,
      adjustmentDate,
      status,
      reason,
      items,
      createdBy,
    } = body;

    const costAdjustment = await prisma.costAdjustment.create({
      data: {
        systemId,
        id,
        branchId,
        employeeId: employeeId || null,
        adjustmentDate: adjustmentDate ? new Date(adjustmentDate) : new Date(),
        status: status || 'DRAFT',
        reason: reason || null,
        createdBy: createdBy || null,
        items: items?.length ? {
          create: items.map((item: any) => ({
            systemId: item.systemId,
            productId: item.productId,
            oldCost: item.oldCost || 0,
            newCost: item.newCost || 0,
            notes: item.notes || null,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(costAdjustment, { status: 201 });
  } catch (error) {
    console.error('[Cost Adjustments API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create cost adjustment' },
      { status: 500 }
    );
  }
}
