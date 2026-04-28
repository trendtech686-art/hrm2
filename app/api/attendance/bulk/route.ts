import { prisma } from '@/lib/prisma'
import { AttendanceStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { z } from 'zod'

// Attendance record type definition
const attendanceDayRecordSchema = z.object({
  status: z.string(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  notes: z.string().optional(),
})

// Individual bulk update item
const bulkUpdateItemSchema = z.object({
  systemId: z.string().optional(),
  data: z.object({
    action: z.string().optional(),
    monthKey: z.string().regex(/^\d{4}-\d{2}$/, 'monthKey must be YYYY-MM format'),
    employeeSystemId: z.string(),
    dayKey: z.string().regex(/^day_\d+$/, 'dayKey must be day_N format'),
    record: attendanceDayRecordSchema,
  }),
})

// Validation schema for PATCH request
const bulkAttendanceSchema = z.object({
  records: z.array(bulkUpdateItemSchema).min(1, 'At least one record is required'),
})

// PATCH /api/attendance/bulk - Bulk update attendance records
export async function PATCH(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, bulkAttendanceSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const { records } = validation.data

  try {
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

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'attendance',
          entityId: 'bulk',
          action: 'bulk_updated',
          actionType: 'update',
          note: `Cập nhật chấm công hàng loạt`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] attendance bulk_updated failed', e))

    return apiSuccess({ success: records.length, failed: 0 })
  } catch (error) {
    logError('Error in bulk attendance PATCH', error)
    return apiError('Failed to bulk update attendance', 500)
  }
}
