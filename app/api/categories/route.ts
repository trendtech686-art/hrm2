import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/categories - List all categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'
    const tree = searchParams.get('tree') === 'true'

    const where: any = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Return tree structure (root categories with children)
    if (tree) {
      where.parentId = null
      const categories = await prisma.category.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        include: {
          children: {
            where: { isDeleted: false },
            orderBy: { sortOrder: 'asc' },
            include: {
              children: {
                where: { isDeleted: false },
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
          _count: { select: { products: true } },
        },
      })
      return NextResponse.json({ data: categories })
    }

    if (all) {
      const categories = await prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          parent: true,
          _count: { select: { products: true, children: true } },
        },
      })
      return NextResponse.json({ data: categories })
    }

    const skip = (page - 1) * limit

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          parent: true,
          _count: { select: { products: true, children: true } },
        },
      }),
      prisma.category.count({ where }),
    ])

    return NextResponse.json({
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new category
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: 'Mã và tên danh mục là bắt buộc' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        systemId: `CAT${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        description: body.description,
        imageUrl: body.thumbnail || body.imageUrl,
        parentId: body.parentId,
        sortOrder: body.sortOrder || 0,
      },
      include: {
        parent: true,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Mã danh mục đã tồn tại' },
        { status: 400 }
      )
    }
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
