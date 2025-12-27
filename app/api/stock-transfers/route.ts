/**
 * Stock Transfers API Route
 * 
 * GET    /api/stock-transfers       - List all stock transfers with pagination
 * POST   /api/stock-transfers       - Create new stock transfer
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List stock transfers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.stockTransfer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.stockTransfer.count({ where }),
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
    console.error('[Stock Transfers API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock transfers' },
      { status: 500 }
    );
  }
}

// POST - Create new stock transfer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      systemId,
      id,
      fromBranchId,
      toBranchId,
      employeeId,
      transferDate,
      receivedDate,
      status,
      notes,
      items,
      createdBy,
    } = body;

    const stockTransfer = await prisma.stockTransfer.create({
      data: {
        systemId,
        id,
        fromBranchId,
        toBranchId,
        employeeId: employeeId || null,
        transferDate: transferDate ? new Date(transferDate) : new Date(),
        receivedDate: receivedDate ? new Date(receivedDate) : null,
        status: status || 'DRAFT',
        notes: notes || null,
        createdBy: createdBy || null,
        items: items?.length ? {
          create: items.map((item: any) => ({
            systemId: item.systemId,
            productId: item.productId,
            quantity: item.quantity || 1,
            notes: item.notes || null,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(stockTransfer, { status: 201 });
  } catch (error) {
    console.error('[Stock Transfers API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create stock transfer' },
      { status: 500 }
    );
  }
}
