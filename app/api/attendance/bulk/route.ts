import { prisma } from '@/lib/prisma'
import { AttendanceStatus } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { generateNextIds } from '@/lib/id-system'

interface AttendanceDayRecord {
  status: string;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

interface BulkUpdateItem {
  systemId: string;
  data: {
    action?: string;
    monthKey: string;
    employeeSystemId: string;
    dayKey: string;
    record: AttendanceDayRecord;
  };
}

// PATCH /api/attendance/bulk - Bulk update attendance records
export async function PATCH(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { records } = body as { records: BulkUpdateItem[] }

    if (!records || !Array.isArray(records) || records.length === 0) {
      return apiError('records array is required', 400)
    }

    // Map frontend status to database enum
    const statusMap: Record<string, string> = {
      'present': 'PRESENT',
      'absent': 'ABSENT',
      'leave': 'LEAVE',
      'half-day': 'HALF_DAY',
      'holiday': 'HOLIDAY',
    }

    // Generate all IDs upfront to avoid N sequential DB calls
    const newIds = await Promise.all(
      records.map(() => generateNextIds('attendance'))
    )

    // Build upsert operations for batched transaction
    const operations = records.map((item, idx) => {
      const { monthKey, employeeSystemId, dayKey, record } = item.data

      const [year, month] = monthKey.split('-').map(Number)
      const dayNum = parseInt(dayKey.replace('day_', ''))
      const date = new Date(year, month - 1, dayNum)

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
            employeeId: employeeSystemId,
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
          systemId: newIds[idx].systemId,
          employeeId: employeeSystemId,
          date,
          checkIn,
          checkOut,
          workHours,
          status: status as AttendanceStatus,
          notes: record.notes,
        },
      })
    })

    // Execute all upserts in a single transaction (atomic + batched)
    await prisma.$transaction(operations)

    return apiSuccess({ success: records.length, failed: 0 })
  } catch (error) {
    console.error('Error in bulk attendance PATCH:', error)
    return apiError('Failed to bulk update attendance', 500)
  }
}
