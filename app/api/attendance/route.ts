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

// POST /api/attendance - Create/Check-in attendance or bulk save
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Handle bulk save from attendance store
    if (body.action === 'save') {
      return handleBulkSave(body)
    }

    // Handle single record update
    if (body.employeeSystemId && body.dayKey && body.record) {
      return handleSingleRecordUpdate(body)
    }

    // Default: Check-in/Check-out flow
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

// Handle bulk save of attendance data for a month
async function handleBulkSave(body: { monthKey: string; data?: any[]; employeeSystemId?: string; dayKey?: string; record?: any }) {
  try {
    const { monthKey, data, employeeSystemId, dayKey, record } = body
    
    if (!monthKey) {
      return NextResponse.json({ error: 'monthKey is required' }, { status: 400 })
    }

    const [year, month] = monthKey.split('-').map(Number)
    
    // Single record update
    if (employeeSystemId && dayKey && record) {
      const dayNum = parseInt(dayKey.replace('day_', ''))
      const date = new Date(year, month - 1, dayNum)
      
      await upsertAttendanceRecord(employeeSystemId, date, record)
      return NextResponse.json({ success: true })
    }

    // Bulk save entire month data
    if (data && Array.isArray(data)) {
      const operations: Promise<any>[] = []
      
      for (const employeeRow of data) {
        const daysInMonth = new Date(year, month, 0).getDate()
        
        for (let day = 1; day <= daysInMonth; day++) {
          const dayRecord = employeeRow[`day_${day}`]
          if (!dayRecord || dayRecord.status === 'weekend' || dayRecord.status === 'future') {
            continue // Skip weekend/future days
          }
          
          const date = new Date(year, month - 1, day)
          operations.push(
            upsertAttendanceRecord(employeeRow.employeeSystemId, date, dayRecord)
          )
        }
      }

      await Promise.all(operations)
      return NextResponse.json({ success: true, count: operations.length })
    }

    return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
  } catch (error) {
    console.error('Error in bulk save:', error)
    return NextResponse.json({ error: 'Failed to bulk save attendance' }, { status: 500 })
  }
}

// Handle single record update from store
async function handleSingleRecordUpdate(body: { monthKey: string; employeeSystemId: string; dayKey: string; record: any }) {
  try {
    const { monthKey, employeeSystemId, dayKey, record } = body
    const [year, month] = monthKey.split('-').map(Number)
    const dayNum = parseInt(dayKey.replace('day_', ''))
    const date = new Date(year, month - 1, dayNum)
    
    await upsertAttendanceRecord(employeeSystemId, date, record)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating single record:', error)
    return NextResponse.json({ error: 'Failed to update attendance record' }, { status: 500 })
  }
}

// Helper to upsert a single attendance record
async function upsertAttendanceRecord(employeeId: string, date: Date, record: any) {
  // Map frontend status to database enum
  const statusMap: Record<string, string> = {
    'present': 'PRESENT',
    'absent': 'ABSENT',
    'leave': 'LEAVE',
    'half-day': 'HALF_DAY',
    'holiday': 'HOLIDAY',
  }
  
  const status = statusMap[record.status] || 'PRESENT'
  
  // Parse time strings to DateTime
  const dateStr = date.toISOString().split('T')[0]
  const checkIn = record.checkIn ? new Date(`${dateStr}T${record.checkIn}:00`) : null
  const checkOut = record.checkOut ? new Date(`${dateStr}T${record.checkOut}:00`) : null
  
  // Calculate work hours
  let workHours: number | null = null
  if (checkIn && checkOut) {
    workHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
  }

  return prisma.attendanceRecord.upsert({
    where: {
      employeeId_date: {
        employeeId,
        date,
      },
    },
    update: {
      checkIn,
      checkOut,
      workHours,
      status: status as any,
      notes: record.notes,
    },
    create: {
      systemId: `ATT-${employeeId.slice(-4)}-${dateStr.replace(/-/g, '')}`,
      employeeId,
      date,
      checkIn,
      checkOut,
      workHours,
      status: status as any,
      notes: record.notes,
    },
  })
}

// PATCH /api/attendance - Lock/Unlock month
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { action, monthYear } = body

    if (!action || !monthYear) {
      return NextResponse.json(
        { error: 'action and monthYear are required' },
        { status: 400 }
      )
    }

    // For lock/unlock, we can store in a separate table or as metadata
    // For now, just acknowledge the request (lock state is managed in frontend store)
    // In production, you might want to store this in a MonthLock table
    
    if (action === 'lock' || action === 'unlock') {
      // TODO: Implement actual lock persistence if needed
      // await prisma.attendanceMonthLock.upsert({...})
      return NextResponse.json({ 
        success: true, 
        action, 
        monthYear,
        message: `Month ${monthYear} ${action}ed successfully` 
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "lock" or "unlock"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in attendance PATCH:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
