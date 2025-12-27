/**
 * Purchase Returns API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List purchase returns
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
      prisma.purchaseReturn.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          suppliers: true,
        },
      }),
      prisma.purchaseReturn.count({ where }),
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
    console.error('[Purchase Returns API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase returns' },
      { status: 500 }
    );
  }
}

// POST - Create new purchase return
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      systemId,
      id,
      supplierId,
      purchaseOrderId,
      branchId,
      employeeId,
      returnDate,
      status,
      reason,
      subtotal,
      total,
      items,
      createdBy,
    } = body;

    const purchaseReturn = await prisma.purchaseReturn.create({
      data: {
        systemId,
        id,
        supplierId,
        purchaseOrderId: purchaseOrderId || null,
        branchId: branchId || null,
        employeeId: employeeId || null,
        returnDate: returnDate ? new Date(returnDate) : new Date(),
        status: status || 'DRAFT',
        reason: reason || null,
        subtotal: subtotal || 0,
        total: total || 0,
        createdBy: createdBy || null,
        items: items?.length ? {
          create: items.map((item: any) => ({
            systemId: item.systemId,
            productId: item.productId,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            returnValue: item.returnValue || 0,
            reason: item.reason || null,
          })),
        } : undefined,
      },
      include: {
        items: true,
        suppliers: true,
      },
    });

    return NextResponse.json(purchaseReturn, { status: 201 });
  } catch (error) {
    console.error('[Purchase Returns API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase return' },
      { status: 500 }
    );
  }
}
