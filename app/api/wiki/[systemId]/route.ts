import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/wiki/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    // Try to find by systemId first, then by slug
    let wiki = await prisma.wikiPage.findUnique({
      where: { systemId },
      include: {
        category: {
          select: { systemId: true, name: true },
        },
      },
    })

    if (!wiki) {
      wiki = await prisma.wikiPage.findUnique({
        where: { slug: systemId },
        include: {
          category: {
            select: { systemId: true, name: true },
          },
        },
      })
    }

    if (!wiki) {
      return NextResponse.json(
        { error: 'Bài viết không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(wiki)
  } catch (error) {
    console.error('Error fetching wiki:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wiki' },
      { status: 500 }
    )
  }
}

// PUT /api/wiki/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const wiki = await prisma.wikiPage.update({
      where: { systemId },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        categoryId: body.categoryId || body.category,
        tags: body.tags,
        isPublished: body.isPublished,
        updatedBy: body.updatedBy,
      },
    })

    return NextResponse.json(wiki)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Bài viết không tồn tại' },
        { status: 404 }
      )
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Slug đã tồn tại' },
        { status: 400 }
      )
    }
    console.error('Error updating wiki:', error)
    return NextResponse.json(
      { error: 'Failed to update wiki' },
      { status: 500 }
    )
  }
}

// DELETE /api/wiki/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.wikiPage.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Bài viết không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting wiki:', error)
    return NextResponse.json(
      { error: 'Failed to delete wiki' },
      { status: 500 }
    )
  }
}
