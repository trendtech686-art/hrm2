/**
 * Inventory Receipts API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List inventory receipts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (type) {
      where.type = type;
    }

    const [data, total] = await Promise.all([
      prisma.inventoryReceipt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.inventoryReceipt.count({ where }),
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
    console.error('[Inventory Receipts API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory receipts' },
      { status: 500 }
    );
  }
}

// POST - Create new inventory receipt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      systemId,
      id,
      type,
      branchId,
      employeeId,
      referenceType,
      referenceId,
      receiptDate,
      status,
      notes,
      items,
      createdBy,
    } = body;

    const inventoryReceipt = await prisma.inventoryReceipt.create({
      data: {
        systemId,
        id,
        type,
        branchId,
        employeeId: employeeId || null,
        referenceType: referenceType || null,
        referenceId: referenceId || null,
        receiptDate: receiptDate ? new Date(receiptDate) : new Date(),
        status: status || 'DRAFT',
        notes: notes || null,
        createdBy: createdBy || null,
        items: items?.length ? {
          create: items.map((item: any) => ({
            systemId: item.systemId,
            productId: item.productId,
            quantity: item.quantity || 1,
            unitCost: item.unitCost || 0,
            totalCost: item.totalCost || 0,
            notes: item.notes || null,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(inventoryReceipt, { status: 201 });
  } catch (error) {
    console.error('[Inventory Receipts API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory receipt' },
      { status: 500 }
    );
  }
}
