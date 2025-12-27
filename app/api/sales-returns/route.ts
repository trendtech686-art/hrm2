/**
 * Sales Returns API Route
 * 
 * GET    /api/sales-returns       - List all sales returns with pagination
 * POST   /api/sales-returns       - Create new sales return
 * 
 * Related: /api/sales-returns/[systemId]/route.ts for single item operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List sales returns with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    
    const skip = (page - 1) * limit;

    const where: any = {};
    
    // Note: SalesReturn table doesn't have isDeleted field
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.salesReturn.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.salesReturn.count({ where }),
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
    console.error('[Sales Returns API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales returns' },
      { status: 500 }
    );
  }
}

// POST - Create new sales return
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      systemId,
      id,
      orderId,
      customerId,
      employeeId,
      branchId,
      returnDate,
      status,
      reason,
      subtotal,
      total,
      refunded,
      items,
      createdBy,
      createdAt,
      updatedAt,
    } = body;

    // Create sales return with items
    const salesReturn = await prisma.salesReturn.create({
      data: {
        systemId,
        id,
        orderId,
        customerId: customerId || null,
        employeeId: employeeId || null,
        branchId: branchId || null,
        returnDate: returnDate ? new Date(returnDate) : new Date(),
        status: status || 'PENDING',
        reason: reason || null,
        subtotal: subtotal || 0,
        total: total || 0,
        refunded: refunded || 0,
        createdBy: createdBy || null,
        // Create items if provided
        items: items?.length ? {
          create: items.map((item: any) => ({
            systemId: item.systemId,
            productId: item.productId || null,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            returnValue: item.returnValue || 0,
            reason: item.reason || null,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(salesReturn, { status: 201 });
  } catch (error) {
    console.error('[Sales Returns API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create sales return' },
      { status: 500 }
    );
  }
}
