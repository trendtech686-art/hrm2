import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/stock-locations/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const location = await prisma.stockLocation.findUnique({
      where: { systemId },
      include: {
        inventories: {
          take: 20,
          include: {
            product: {
              select: {
                systemId: true,
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        _count: { select: { inventories: true } },
      },
    })

    if (!location) {
      return NextResponse.json(
        { error: 'Kho không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(location)
  } catch (error) {
    console.error('Error fetching stock location:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock location' },
      { status: 500 }
    )
  }
}

// PUT /api/stock-locations/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const location = await prisma.stockLocation.update({
      where: { systemId },
      data: {
        name: body.name,
        description: body.address || body.description,
        isActive: body.isActive,
      },
    })

    return NextResponse.json(location)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Kho không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating stock location:', error)
    return NextResponse.json(
      { error: 'Failed to update stock location' },
      { status: 500 }
    )
  }
}

// DELETE /api/stock-locations/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.stockLocation.update({
      where: { systemId },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Kho không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting stock location:', error)
    return NextResponse.json(
      { error: 'Failed to delete stock location' },
      { status: 500 }
    )
  }
}
