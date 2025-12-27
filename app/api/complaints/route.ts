import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/complaints - List all complaints
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const customerId = searchParams.get('customerId')

    const skip = (page - 1) * limit

    const where: any = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    if (customerId) {
      where.customerId = customerId
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { systemId: true, id: true, name: true },
          },
        },
      }),
      prisma.complaint.count({ where }),
    ])

    return NextResponse.json({
      data: complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching complaints:', error)
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    )
  }
}

// POST /api/complaints - Create new complaint
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID
    if (!body.id) {
      const lastComplaint = await prisma.complaint.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastComplaint?.id 
        ? parseInt(lastComplaint.id.replace('KN', '')) 
        : 0
      body.id = `KN${String(lastNum + 1).padStart(6, '0')}`
    }

    const complaint = await prisma.complaint.create({
      data: {
        systemId: `COMP${String(Date.now()).slice(-10).padStart(10, '0')}`,
        id: body.id,
        customerId: body.customerId,
        orderId: body.orderId,
        title: body.title,
        description: body.description,
        category: body.category,
        priority: body.priority || 'MEDIUM',
        status: body.status || 'OPEN',
        assigneeId: body.assigneeId || body.assignedTo,
      },
      include: {
        customer: true,
      },
    })

    return NextResponse.json(complaint, { status: 201 })
  } catch (error) {
    console.error('Error creating complaint:', error)
    return NextResponse.json(
      { error: 'Failed to create complaint' },
      { status: 500 }
    )
  }
}
