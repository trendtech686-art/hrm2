import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/job-titles - List all job titles
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
      const jobTitles = await prisma.jobTitle.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { employees: true } },
        },
      })
      return NextResponse.json({ data: jobTitles })
    }

    const skip = (page - 1) * limit

    const [jobTitles, total] = await Promise.all([
      prisma.jobTitle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { employees: true } },
        },
      }),
      prisma.jobTitle.count({ where }),
    ])

    return NextResponse.json({
      data: jobTitles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching job titles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job titles' },
      { status: 500 }
    )
  }
}

// POST /api/job-titles - Create new job title
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: 'Mã và tên chức danh là bắt buộc' },
        { status: 400 }
      )
    }

    const jobTitle = await prisma.jobTitle.create({
      data: {
        id: body.id,
        name: body.name,
        description: body.description,
      },
    })

    return NextResponse.json(jobTitle, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Mã chức danh đã tồn tại' },
        { status: 400 }
      )
    }
    console.error('Error creating job title:', error)
    return NextResponse.json(
      { error: 'Failed to create job title' },
      { status: 500 }
    )
  }
}
