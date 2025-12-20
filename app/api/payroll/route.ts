import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/payroll - List all payroll records
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const status = searchParams.get('status')
    const employeeId = searchParams.get('employeeId')

    const skip = (page - 1) * limit

    const where: any = {}

    if (month) {
      where.month = parseInt(month)
    }

    if (year) {
      where.year = parseInt(year)
    }

    if (status) {
      where.status = status
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    const [payrolls, total] = await Promise.all([
      prisma.payroll.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        include: {
          items: {
            include: {
              employee: {
                select: {
                  id: true,
                  fullName: true,
                  avatar: true,
                  department: true,
                  jobTitle: true,
                },
              },
            },
          },
          _count: { select: { items: true } },
        },
      }),
      prisma.payroll.count({ where }),
    ])

    return NextResponse.json({
      data: payrolls,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching payroll:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payroll' },
      { status: 500 }
    )
  }
}

// POST /api/payroll - Create new payroll record
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID
    if (!body.id) {
      const prefix = `BL${body.year}${String(body.month).padStart(2, '0')}`
      const lastPayroll = await prisma.payroll.findFirst({
        where: { id: { startsWith: prefix } },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastPayroll?.id 
        ? parseInt(lastPayroll.id.replace(prefix, '')) 
        : 0
      body.id = `${prefix}${String(lastNum + 1).padStart(3, '0')}`
    }

    const payroll = await prisma.payroll.create({
      data: {
        systemId: `PAYROLL${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        month: body.month,
        year: body.year,
        periodStart: body.periodStart ? new Date(body.periodStart) : new Date(body.year, body.month - 1, 1),
        periodEnd: body.periodEnd ? new Date(body.periodEnd) : new Date(body.year, body.month, 0),
        status: body.status || 'DRAFT',
        items: {
          create: body.items?.map((item: any) => ({
            systemId: `PAYITEM${String(Date.now()).slice(-8)}${Math.random().toString(36).slice(2, 6)}`,
            id: `BLITEM${String(Date.now()).slice(-6)}`,
            employee: { connect: { systemId: item.employeeId } },
            baseSalary: item.baseSalary || 0,
            netSalary: item.netSalary || 0,
            notes: item.notes,
          })) || [],
        },
      },
      include: {
        items: {
          include: { employee: true },
        },
      },
    })

    return NextResponse.json(payroll, { status: 201 })
  } catch (error) {
    console.error('Error creating payroll:', error)
    return NextResponse.json(
      { error: 'Failed to create payroll' },
      { status: 500 }
    )
  }
}
