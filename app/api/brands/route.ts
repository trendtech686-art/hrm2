import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/brands - List all brands
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'

    const where: any = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (all) {
      const brands = await prisma.brand.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      })
      return NextResponse.json({ data: brands })
    }

    const skip = (page - 1) * limit

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      }),
      prisma.brand.count({ where }),
    ])

    return NextResponse.json({
      data: brands,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

// POST /api/brands - Create new brand
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: 'Mã và tên thương hiệu là bắt buộc' },
        { status: 400 }
      )
    }

    const brand = await prisma.brand.create({
      data: {
        systemId: `BRAND${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        description: body.description,
        logoUrl: body.logo || body.logoUrl,
        website: body.website,
      },
    })

    return NextResponse.json(brand, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Mã thương hiệu đã tồn tại' },
        { status: 400 }
      )
    }
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}
