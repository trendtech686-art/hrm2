import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'

// GET /api/payroll/payslips - List payslips (PayrollItems)
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const batchId = searchParams.get('batchId') // payrollId
    const employeeId = searchParams.get('employeeId')
    const search = searchParams.get('search')

    const where: Prisma.PayrollItemWhereInput = {}

    if (batchId) {
      where.payrollId = batchId
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (search) {
      where.OR = [
        { employeeName: { contains: search, mode: 'insensitive' } },
        { employeeCode: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.payrollItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { employeeName: 'asc' },
        include: {
          employee: {
            select: {
              id: true,
              systemId: true,
              fullName: true,
              avatar: true,
              department: true,
              jobTitle: true,
            },
          },
          payroll: {
            select: {
              id: true,
              systemId: true,
              month: true,
              year: true,
              status: true,
            },
          },
        },
      }),
      prisma.payrollItem.count({ where }),
    ])

    // Transform to frontend payslip format
    const payslips = items.map((item) => ({
      systemId: item.systemId,
      id: item.systemId, // Use systemId as id
      batchSystemId: item.payrollId,
      employeeSystemId: item.employeeId,
      employeeName: item.employeeName,
      employeeCode: item.employeeCode,
      workDays: Number(item.workDays),
      otHours: Number(item.otHours),
      leaveDays: Number(item.leaveDays),
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
      notes: item.notes,
      employee: item.employee,
      batch: item.payroll,
    }))

    return apiPaginated(payslips, {
      page,
      limit,
      total,
    })
  } catch (error) {
    console.error('[API] Error fetching payslips:', error)
    return apiError('Failed to fetch payslips', 500)
  }
}
