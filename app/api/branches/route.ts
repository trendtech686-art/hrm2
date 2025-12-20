import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/branches - List all branches
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
        { address: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (all) {
      const branches = await prisma.branch.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { employees: true } },
        },
      })
      return NextResponse.json({ data: branches })
    }

    const skip = (page - 1) * limit

    const [branches, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { employees: true } },
        },
      }),
      prisma.branch.count({ where }),
    ])

    return NextResponse.json({
      data: branches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    )
  }
}

// POST /api/branches - Create new branch
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: 'Mã và tên chi nhánh là bắt buộc' },
        { status: 400 }
      )
    }

    const branch = await prisma.branch.create({
      data: {
        id: body.id,
        name: body.name,
        address: body.address,
        phone: body.phone,
        isDefault: body.isDefault ?? false,
      },
    })

    return NextResponse.json(branch, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Mã chi nhánh đã tồn tại' },
        { status: 400 }
      )
    }
    console.error('Error creating branch:', error)
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 }
    )
  }
}
