import { prisma } from '@/lib/prisma'
import { apiPaginated, apiError } from '@/lib/api-utils'
import { parsePagination } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'
import { API_MAX_PAGE_LIMIT } from '@/lib/pagination-constants'
import { z } from 'zod'

// Query validation schema
const employeeHistoryQuerySchema = z.object({
  employeeId: z.string().min(1, 'employeeId is required'),
})

/**
 * GET /api/payroll/employee-history?employeeId=X
 * 
 * Returns payroll history (payslips + batch info) for a specific employee.
 * Server-side filtered — replaces client-side Zustand store pattern:
 *   ❌ payrollPayslips.filter(slip => slip.employeeSystemId === id)
 *   ✅ GET /api/payroll/employee-history?employeeId=X
 */
export const GET = apiHandler(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)

    const validation = employeeHistoryQuerySchema.safeParse({
      employeeId: searchParams.get('employeeId'),
    })
    if (!validation.success) {
      return apiError(validation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', '), 400)
    }

    const { employeeId } = validation.data

    const { page, limit, skip } = parsePagination(searchParams)
    const safeLimit = Math.min(limit, API_MAX_PAGE_LIMIT)

    const [items, total] = await Promise.all([
      prisma.payrollItem.findMany({
        where: { employeeId },
        orderBy: { payroll: { year: 'desc' } },
        skip,
        take: safeLimit,
        select: {
          systemId: true,
          employeeId: true,
          employeeName: true,
          employeeCode: true,
          baseSalary: true,
          otPay: true,
          allowances: true,
          bonus: true,
          grossSalary: true,
          socialInsurance: true,
          healthInsurance: true,
          unemploymentIns: true,
          tax: true,
          otherDeductions: true,
          totalDeductions: true,
          netSalary: true,
          workDays: true,
          otHours: true,
          leaveDays: true,
          notes: true,
          payrollId: true,
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
      }),
      prisma.payrollItem.count({ where: { employeeId } }),
    ])

    // Transform to a shape compatible with the detail page's PayrollHistoryRow
    const history = items.map((item) => {
      const batch = item.payroll
      const monthKey = `${batch.year}-${String(batch.month).padStart(2, '0')}`
      
      // Map DB status (enum: DRAFT/PROCESSING/COMPLETED/PAID) → frontend status.
      // Đồng bộ với app/api/payroll/[systemId]/route.ts. Không còn 'LOCKED'/'REVIEWED' trong enum DB.
      const statusMap: Record<string, string> = {
        DRAFT: 'draft',
        PROCESSING: 'reviewed',
        COMPLETED: 'locked',
        PAID: 'locked',
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

    return apiPaginated(history, { page, limit, total })
  } catch (error) {
    logError('[API] Error fetching employee payroll history', error)
    return apiError('Failed to fetch payroll history', 500)
  }
}, { auth: true, rateLimit: { max: 120, windowMs: 60_000 } })
