import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/departments - List all departments
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
      const departments = await prisma.department.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          parent: true,
          _count: { select: { employees: true, children: true } },
        },
      })
      return NextResponse.json({ data: departments })
    }

    const skip = (page - 1) * limit

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          parent: true,
          _count: { select: { employees: true, children: true } },
        },
      }),
      prisma.department.count({ where }),
    ])

    return NextResponse.json({
      data: departments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}

// POST /api/departments - Create new department
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: 'Mã và tên phòng ban là bắt buộc' },
        { status: 400 }
      )
    }

    const department = await prisma.department.create({
      data: {
        systemId: `DEPT${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        description: body.description,
        parent: body.parentId ? { connect: { systemId: body.parentId } } : undefined,
      },
      include: {
        parent: true,
      },
    })

    return NextResponse.json(department, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Mã phòng ban đã tồn tại' },
        { status: 400 }
      )
    }
    console.error('Error creating department:', error)
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    )
  }
}
