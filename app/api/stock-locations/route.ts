import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/stock-locations - List all stock locations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    const where: any = {
      isActive: true,
    }

    if (all) {
      const locations = await prisma.stockLocation.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { inventoryRecords: true } },
        },
      })
      return NextResponse.json({ data: locations })
    }

    const locations = await prisma.stockLocation.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { inventoryRecords: true } },
      },
    })

    return NextResponse.json({ data: locations })
  } catch (error) {
    console.error('Error fetching stock locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock locations' },
      { status: 500 }
    )
  }
}

// POST /api/stock-locations - Create new stock location
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: 'Mã và tên kho là bắt buộc' },
        { status: 400 }
      )
    }

    const location = await prisma.stockLocation.create({
      data: {
        systemId: `SLOC${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        code: body.code || body.id,
        description: body.address || body.description,
        branchId: body.branchId,
        isActive: body.isActive ?? true,
      },
    })

    return NextResponse.json(location, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Mã kho đã tồn tại' },
        { status: 400 }
      )
    }
    console.error('Error creating stock location:', error)
    return NextResponse.json(
      { error: 'Failed to create stock location' },
      { status: 500 }
    )
  }
}
