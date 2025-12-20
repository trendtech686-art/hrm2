import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/categories/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const category = await prisma.category.findUnique({
      where: { systemId },
      include: {
        parent: true,
        children: {
          where: { isDeleted: false },
          orderBy: { sortOrder: 'asc' },
        },
        products: {
          where: { product: { isDeleted: false } },
          take: 10,
          include: {
            product: {
              select: {
                systemId: true,
                id: true,
                name: true,
                thumbnailImage: true,
              },
            },
          },
        },
        _count: { select: { products: true, children: true } },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Danh mục không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const category = await prisma.category.update({
      where: { systemId },
      data: {
        name: body.name,
        description: body.description,
        thumbnail: body.thumbnail,
        parentId: body.parentId,
        sortOrder: body.sortOrder,
      },
      include: {
        parent: true,
      },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Danh mục không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.category.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Danh mục không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
