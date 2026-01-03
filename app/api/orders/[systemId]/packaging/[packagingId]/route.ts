import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// GET /api/orders/[systemId]/packaging/[packagingId] - Get packaging details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { packagingId } = await params;

    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: {
        order: true,
        assignedEmployee: true,
        shipment: true,
      },
    });

    if (!packaging) {
      return NextResponse.json({ error: 'Packaging not found' }, { status: 404 });
    }

    return NextResponse.json(packaging);
  } catch (error) {
    console.error('Error fetching packaging:', error);
    return NextResponse.json({ error: 'Failed to fetch packaging' }, { status: 500 });
  }
}

// PATCH /api/orders/[systemId]/packaging/[packagingId] - Update packaging
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { packagingId } = await params;
    const body = await request.json();

    const packaging = await prisma.packaging.update({
      where: { systemId: packagingId },
      data: body,
      include: {
        order: true,
        assignedEmployee: true,
        shipment: true,
      },
    });

    return NextResponse.json(packaging);
  } catch (error) {
    console.error('Error updating packaging:', error);
    return NextResponse.json({ error: 'Failed to update packaging' }, { status: 500 });
  }
}
