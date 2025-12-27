/**
 * Inventory Checks API Route
 * 
 * GET    /api/inventory-checks       - List all inventory checks
 * POST   /api/inventory-checks       - Create new inventory check
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List inventory checks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    
    const skip = (page - 1) * limit;

    const where: any = {};
    
    // Note: InventoryCheck table doesn't have isDeleted field
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.inventoryCheck.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.inventoryCheck.count({ where }),
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
    console.error('[Inventory Checks API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory checks' },
      { status: 500 }
    );
  }
}

// POST - Create new inventory check
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      systemId,
      id,
      branchId,
      employeeId,
      checkDate,
      status,
      notes,
      items,
      createdBy,
    } = body;

    const inventoryCheck = await prisma.inventoryCheck.create({
      data: {
        systemId,
        id,
        branchId,
        employeeId: employeeId || null,
        checkDate: checkDate ? new Date(checkDate) : new Date(),
        status: status || 'DRAFT',
        notes: notes || null,
        createdBy: createdBy || null,
        items: items?.length ? {
          create: items.map((item: any) => ({
            systemId: item.systemId,
            productId: item.productId,
            expectedQuantity: item.expectedQuantity || 0,
            actualQuantity: item.actualQuantity || 0,
            difference: item.difference || 0,
            notes: item.notes || null,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(inventoryCheck, { status: 201 });
  } catch (error) {
    console.error('[Inventory Checks API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory check' },
      { status: 500 }
    );
  }
}
