import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { LeaveStatus } from '@/generated/prisma/client'

/**
 * GET /api/leaves/quota?employeeId=X&year=2026
 *
 * Returns leave quota for a specific employee:
 *  - total: annual leave entitlement (from employee.annualLeaveBalance, default 12)
 *  - used: approved leave days in the given year
 *  - remaining: total - used
 *  - breakdown: used days grouped by leave type
 */
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))

    if (!employeeId) {
      return apiError('employeeId is required', 400)
    }

    // Get employee's annual leave balance
    const employee = await prisma.employee.findUnique({
      where: { systemId: employeeId },
      select: { annualLeaveBalance: true },
    })

    const totalEntitlement = employee?.annualLeaveBalance ?? 12

    // Count approved leaves in the given year
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year, 11, 31, 23, 59, 59)

    const approvedLeaves = await prisma.leave.findMany({
      where: {
        OR: [
          { employeeId },
          { employeeSystemId: employeeId },
        ],
        status: LeaveStatus.APPROVED,
        startDate: { lte: yearEnd },
        endDate: { gte: yearStart },
      },
      select: {
        totalDays: true,
        numberOfDays: true,
        leaveType: true,
        leaveTypeName: true,
      },
    })

    // Sum used days and build breakdown by leave type
    let usedDays = 0
    const breakdown: Record<string, number> = {}

    for (const leave of approvedLeaves) {
      const days = Number(leave.totalDays) || leave.numberOfDays || 1
      usedDays += days

      const typeName = leave.leaveTypeName || leave.leaveType || 'Khác'
      breakdown[typeName] = (breakdown[typeName] || 0) + days
    }

    return apiSuccess({
      total: totalEntitlement,
      used: usedDays,
      remaining: Math.max(0, totalEntitlement - usedDays),
      breakdown,
    })
  } catch (error) {
    logError('[API] Error fetching leave quota', error)
    return apiError('Failed to fetch leave quota', 500)
  }
}
