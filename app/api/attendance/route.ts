import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { AttendanceStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createAttendanceSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// GET /api/attendance - List attendance records
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const employeeId = searchParams.get('employeeId')
    const date = searchParams.get('date')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: Prisma.AttendanceRecordWhereInput = {}

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
      where.status = status as AttendanceStatus
    }
    
    const employeeSearch = buildSearchWhere<Prisma.EmployeeWhereInput>(search, [
      'fullName',
      'id',
      'department.name',
    ])
    if (employeeSearch) {
      where.employee = employeeSearch
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
              systemId: true,
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

    return apiPaginated(records, { page, limit, total })
  } catch (error) {
    logError('Error fetching attendance', error)
    return apiError('Failed to fetch attendance', 500)
  }
}

// POST /api/attendance - Create/Check-in attendance or bulk save
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createAttendanceSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Handle bulk save from attendance store
    if (body.action === 'save' && body.monthKey) {
      return handleBulkSave({
        monthKey: body.monthKey,
        data: body.data,
        employeeSystemId: body.employeeSystemId,
        dayKey: body.dayKey,
        record: body.record,
      })
    }

    // Handle single record update
    if (body.monthKey && body.employeeSystemId && body.dayKey && body.record) {
      return handleSingleRecordUpdate({
        monthKey: body.monthKey,
        employeeSystemId: body.employeeSystemId,
        dayKey: body.dayKey,
        record: body.record,
      })
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
          status: (body.status as AttendanceStatus) || AttendanceStatus.PRESENT,
          notes: body.notes,
        },
        include: { employee: true },
      })
      // Log activity - check out
      getUserNameFromDb(session.user?.id).then(userName =>
        prisma.activityLog.create({
          data: {
            entityType: 'attendance',
            entityId: existing.systemId,
            action: 'check_out',
            actionType: 'update',
            note: `Check-out chấm công`,
            metadata: { userName },
            createdBy: userName,
          }
        })
      ).catch(e => logError('[ActivityLog] attendance check_out failed', e))
      return apiSuccess(attendance)
    }

    // Create new check-in
    const { systemId: attendSystemId } = await generateNextIds('attendance');
    const attendance = await prisma.attendanceRecord.create({
      data: {
        systemId: attendSystemId,
        employee: { connect: { systemId: body.employeeId } },
        date: today,
        checkIn: new Date(),
        status: (body.status as AttendanceStatus) || AttendanceStatus.PRESENT,
        notes: body.notes,
      },
      include: { employee: true },
    })

    // Log activity - check in
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'attendance',
          entityId: attendSystemId,
          action: 'check_in',
          actionType: 'create',
          note: `Check-in chấm công`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] attendance check_in failed', e))

    return apiSuccess(attendance, 201)
  } catch (error) {
    logError('Error creating attendance', error)
    return apiError('Failed to create attendance', 500)
  }
}

// Interface for attendance day record
interface AttendanceDayRecord {
  status: string;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

// Interface for employee attendance row
interface EmployeeAttendanceRow {
  employeeSystemId: string;
  [key: string]: string | AttendanceDayRecord | undefined;
}

// Handle bulk save of attendance data for a month
async function handleBulkSave(body: { monthKey: string; data?: EmployeeAttendanceRow[]; employeeSystemId?: string; dayKey?: string; record?: AttendanceDayRecord }) {
  try {
    const { monthKey, data, employeeSystemId, dayKey, record } = body
    
    if (!monthKey) {
      return apiError('monthKey is required', 400)
    }

    const [year, month] = monthKey.split('-').map(Number)
    
    // Single record update
    if (employeeSystemId && dayKey && record) {
      const dayNum = parseInt(dayKey.replace('day_', ''))
      const date = new Date(year, month - 1, dayNum)
      
      await upsertAttendanceRecord(employeeSystemId, date, record)
      return apiSuccess({ success: true })
    }

    // Bulk save entire month data
    if (data && Array.isArray(data)) {
      const operations: Promise<unknown>[] = []
      
      for (const employeeRow of data) {
        const daysInMonth = new Date(year, month, 0).getDate()
        
        for (let day = 1; day <= daysInMonth; day++) {
          const dayRecord = employeeRow[`day_${day}`] as AttendanceDayRecord | undefined
          if (!dayRecord || typeof dayRecord === 'string' || dayRecord.status === 'weekend' || dayRecord.status === 'future') {
            continue // Skip weekend/future days
          }
          
          const date = new Date(year, month - 1, day)
          operations.push(
            upsertAttendanceRecord(employeeRow.employeeSystemId, date, dayRecord)
          )
        }
      }

      await Promise.all(operations)
      return apiSuccess({ success: true, count: operations.length })
    }

    return apiError('Invalid data format', 400)
  } catch (error) {
    logError('Error in bulk save', error)
    return apiError('Failed to bulk save attendance', 500)
  }
}

// Handle single record update from store
async function handleSingleRecordUpdate(body: { monthKey: string; employeeSystemId: string; dayKey: string; record: AttendanceDayRecord }) {
  try {
    const { monthKey, employeeSystemId, dayKey, record } = body
    const [year, month] = monthKey.split('-').map(Number)
    const dayNum = parseInt(dayKey.replace('day_', ''))
    const date = new Date(year, month - 1, dayNum)
    
    await upsertAttendanceRecord(employeeSystemId, date, record)
    return apiSuccess({ success: true })
  } catch (error) {
    logError('Error updating single record', error)
    return apiError('Failed to update attendance record', 500)
  }
}

// Helper to upsert a single attendance record
async function upsertAttendanceRecord(employeeId: string, date: Date, record: AttendanceDayRecord) {
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

  const { systemId: newSystemId } = await generateNextIds('attendance');
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
      status: status as AttendanceStatus,
      notes: record.notes,
    },
    create: {
      systemId: newSystemId,
      employeeId,
      date,
      checkIn,
      checkOut,
      workHours,
      status: status as AttendanceStatus,
      notes: record.notes,
    },
  })
}

// PATCH /api/attendance - Lock/Unlock month
export async function PATCH(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { action, monthYear } = body

    if (!action || !monthYear) {
      return apiError('action and monthYear are required', 400)
    }

    // For lock/unlock, we can store in a separate table or as metadata
    // For now, just acknowledge the request (lock state is managed in frontend store)
    // In production, you might want to store this in a MonthLock table
    
    if (action === 'lock' || action === 'unlock') {
      // TODO: Implement actual lock persistence if needed
      // await prisma.attendanceMonthLock.upsert({...})
      return apiSuccess({ 
        success: true, 
        action, 
        monthYear,
        message: `Month ${monthYear} ${action}ed successfully` 
      })
    }

    return apiError('Invalid action. Use "lock" or "unlock"', 400)
  } catch (error) {
    logError('Error in attendance PATCH', error)
    return apiError('Failed to process request', 500)
  }
}
