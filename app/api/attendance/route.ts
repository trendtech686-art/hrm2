import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/attendance - List attendance records
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const employeeId = searchParams.get('employeeId')
    const date = searchParams.get('date')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where: any = {}

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (date) {
      where.date = new Date(date)
    }

    if (fromDate || toDate) {
      where.date = {}
      if (fromDate) where.date.gte = new Date(fromDate)
      if (toDate) where.date.lte = new Date(toDate)
    }

    if (status) {
      where.status = status
    }

    const [records, total] = await Promise.all([
      prisma.attendanceRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              avatar: true,
              department: true,
            },
          },
        },
      }),
      prisma.attendanceRecord.count({ where }),
    ])

    return NextResponse.json({
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

// POST /api/attendance - Create/Check-in attendance
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if already checked in today
    const existing = await prisma.attendanceRecord.findFirst({
      where: {
        employeeId: body.employeeId,
        date: today,
      },
    })

    if (existing) {
      // Update check-out time
      const attendance = await prisma.attendanceRecord.update({
        where: { systemId: existing.systemId },
        data: {
          checkOut: new Date(),
          status: body.status || 'PRESENT',
          notes: body.notes,
        },
        include: { employee: true },
      })
      return NextResponse.json(attendance)
    }

    // Create new check-in
    const attendance = await prisma.attendanceRecord.create({
      data: {
        systemId: `ATTEND${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: `CC${String(Date.now()).slice(-6).padStart(6, '0')}`,
        employee: { connect: { systemId: body.employeeId } },
        date: today,
        checkIn: new Date(),
        status: body.status || 'PRESENT',
        notes: body.notes,
      },
      include: { employee: true },
    })

    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    console.error('Error creating attendance:', error)
    return NextResponse.json(
      { error: 'Failed to create attendance' },
      { status: 500 }
    )
  }
}
