import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiPaginated } from '@/lib/api-utils'
import { parsePagination } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { API_MAX_PAGE_LIMIT } from '@/lib/pagination-constants'

/**
 * GET /api/attendance/employee-summary?employeeId=X
 * 
 * Returns monthly attendance summaries for a specific employee.
 * Server-side aggregation — groups individual daily records by month
 * and computes workDays, leaveDays, absentDays, etc.
 */
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')

    if (!employeeId) {
      return apiError('employeeId is required', 400)
    }

    const { page, limit, skip } = parsePagination(searchParams)
    const safeLimit = Math.min(limit, API_MAX_PAGE_LIMIT)

    // Use raw SQL for efficient server-side grouping by month
    const monthlyData = await prisma.$queryRaw<Array<{
      month_key: string
      work_days: bigint
      leave_days: bigint
      absent_days: bigint
      late_arrivals: bigint
      early_departures: bigint
      ot_hours: number | null
      record_count: bigint
    }>>`
      SELECT 
        to_char(date, 'YYYY-MM') as month_key,
        COALESCE(SUM(CASE WHEN status IN ('PRESENT', 'HALF_DAY') THEN "workDays" ELSE 0 END), 0) as work_days,
        COALESCE(SUM("leaveDays"), 0) as leave_days,
        COALESCE(SUM("absentDays"), 0) as absent_days,
        COALESCE(SUM("lateArrivals"), 0) as late_arrivals,
        COALESCE(SUM("earlyDepartures"), 0) as early_departures,
        COALESCE(SUM(CAST("otHours" AS DOUBLE PRECISION)), 0) as ot_hours,
        COUNT(*) as record_count
      FROM attendance_records
      WHERE "employeeId" = ${employeeId}
        OR "employeeSystemId" = ${employeeId}
      GROUP BY to_char(date, 'YYYY-MM')
      ORDER BY month_key DESC
      LIMIT ${safeLimit}
      OFFSET ${skip}
    `

    // Get total count for pagination
    const countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(DISTINCT to_char(date, 'YYYY-MM')) as count
      FROM attendance_records
      WHERE "employeeId" = ${employeeId}
        OR "employeeSystemId" = ${employeeId}
    `
    const total = Number(countResult[0]?.count ?? 0)

    const summaries = monthlyData.map(row => ({
      monthKey: row.month_key,
      workDays: Number(row.work_days),
      leaveDays: Number(row.leave_days),
      absentDays: Number(row.absent_days),
      lateArrivals: Number(row.late_arrivals),
      earlyDepartures: Number(row.early_departures),
      otHours: Number(row.ot_hours ?? 0),
      recordCount: Number(row.record_count),
    }))

    return apiPaginated(summaries, { page, limit, total })
  } catch (error) {
    logError('[API] Error fetching employee attendance summary', error)
    return apiError('Failed to fetch attendance summary', 500)
  }
}
