import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/brands/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const brand = await prisma.brand.findUnique({
      where: { systemId },
      include: {
        products: {
          where: { isDeleted: false },
          take: 10,
          select: {
            systemId: true,
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        _count: { select: { products: true } },
      },
    })

    if (!brand) {
      return NextResponse.json(
        { error: 'Thương hiệu không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  }
}

// PUT /api/brands/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const brand = await prisma.brand.update({
      where: { systemId },
      data: {
        name: body.name,
        description: body.description,
        logoUrl: body.logo || body.logoUrl,
        website: body.website,
      },
    })

    return NextResponse.json(brand)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Thương hiệu không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating brand:', error)
    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 }
    )
  }
}

// DELETE /api/brands/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.brand.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Thương hiệu không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting brand:', error)
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    )
  }
}
