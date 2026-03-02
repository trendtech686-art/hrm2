import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

/**
 * GET /api/payroll/employee-history?employeeId=X
 * 
 * Returns payroll history (payslips + batch info) for a specific employee.
 * Server-side filtered — replaces client-side Zustand store pattern:
 *   ❌ payrollPayslips.filter(slip => slip.employeeSystemId === id)
 *   ✅ GET /api/payroll/employee-history?employeeId=X
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

    const items = await prisma.payrollItem.findMany({
      where: { employeeId },
      orderBy: { payroll: { year: 'desc' } },
      include: {
        payroll: {
          select: {
            systemId: true,
            id: true,
            year: true,
            month: true,
            status: true,
            processedAt: true,
            paidAt: true,
            createdAt: true,
          },
        },
        employee: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
          },
        },
      },
    })

    // Transform to a shape compatible with the detail page's PayrollHistoryRow
    const history = items.map((item) => {
      const batch = item.payroll
      const monthKey = `${batch.year}-${String(batch.month).padStart(2, '0')}`
      
      // Map DB status to frontend status
      const statusMap: Record<string, string> = {
        'DRAFT': 'draft',
        'REVIEWED': 'reviewed',
        'LOCKED': 'locked',
        'CANCELLED': 'cancelled',
        'PAID': 'locked',
        'PROCESSING': 'draft',
      }

      return {
        systemId: item.systemId,
        batchSystemId: batch.systemId,
        batchId: batch.id,
        monthKey,
        // Date fields
        payrollDate: batch.paidAt?.toISOString() || batch.processedAt?.toISOString() || batch.createdAt.toISOString(),
        // Status
        status: statusMap[batch.status] || 'draft',
        // Financial data
        baseSalary: Number(item.baseSalary),
        otPay: Number(item.otPay),
        allowances: Number(item.allowances),
        bonus: Number(item.bonus),
        grossSalary: Number(item.grossSalary),
        socialInsurance: Number(item.socialInsurance),
        healthInsurance: Number(item.healthInsurance),
        unemploymentIns: Number(item.unemploymentIns),
        tax: Number(item.tax),
        otherDeductions: Number(item.otherDeductions),
        totalDeductions: Number(item.totalDeductions),
        netSalary: Number(item.netSalary),
        // Work data
        workDays: Number(item.workDays),
        otHours: Number(item.otHours),
        leaveDays: Number(item.leaveDays),
        // Metadata
        notes: item.notes,
        employeeName: item.employeeName,
        employeeCode: item.employeeCode,
      }
    })

    // Sort by date descending (newest first)
    history.sort((a, b) => new Date(b.payrollDate).getTime() - new Date(a.payrollDate).getTime())

    return apiSuccess(history)
  } catch (error) {
    console.error('[API] Error fetching employee payroll history:', error)
    return apiError('Failed to fetch payroll history', 500)
  }
}
