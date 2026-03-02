import { prisma } from '@/lib/prisma'
import { PayrollStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updatePayrollSchema } from './validation'
import { generateIdWithPrefix } from '@/lib/id-generator'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/payroll/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const [payroll, auditLogs] = await Promise.all([
      prisma.payroll.findUnique({
        where: { systemId },
        include: {
          items: {
            include: {
              employee: {
                include: {
                  department: true,
                  branch: true,
                  jobTitle: true,
                },
              },
            },
          },
        },
      }),
      prisma.auditLog.findMany({
        where: {
          entityType: 'Payroll',
          entityId: systemId,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ])

    if (!payroll) {
      return apiError('Bảng lương không tồn tại', 404)
    }

    // Transform to match frontend PayrollBatch type
    const monthKey = `${payroll.year}-${String(payroll.month).padStart(2, '0')}`
    const lastDay = new Date(payroll.year, payroll.month, 0).getDate()
    
    // Map status from DB enum to frontend type
    const statusMap: Record<string, string> = {
      'DRAFT': 'draft',
      'PROCESSING': 'reviewed',
      'COMPLETED': 'locked',
      'PAID': 'locked',
    }
    
    const result = {
      systemId: payroll.systemId,
      id: payroll.id,
      title: `Bảng lương tháng ${payroll.month}/${payroll.year}`,
      status: statusMap[payroll.status] || 'draft',
      templateSystemId: undefined,
      payPeriod: {
        startDate: `${payroll.year}-${String(payroll.month).padStart(2, '0')}-01`,
        endDate: `${payroll.year}-${String(payroll.month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
      },
      payrollDate: payroll.processedAt?.toISOString() || payroll.createdAt.toISOString(),
      referenceAttendanceMonthKeys: [monthKey],
      payslipSystemIds: payroll.items.map(item => item.systemId),
      totalGross: Number(payroll.totalGross),
      totalDeductions: Number(payroll.totalDeductions),
      totalNet: Number(payroll.totalNet),
      totalEmployees: payroll.totalEmployees,
      reviewedAt: undefined,
      reviewedBy: undefined,
      lockedAt: payroll.processedAt?.toISOString(),
      lockedBy: payroll.processedBy,
      notes: undefined,
      createdAt: payroll.createdAt.toISOString(),
      updatedAt: payroll.updatedAt.toISOString(),
      createdBy: payroll.createdBy,
      // Include items for the detail page
      items: payroll.items.map(item => ({
        systemId: item.systemId,
        employeeSystemId: item.employeeId,
        employeeId: item.employeeCode,
        employeeName: item.employeeName,
        departmentSystemId: item.employee?.department?.systemId,
        departmentName: item.employee?.department?.name || 'N/A',
        periodMonthKey: monthKey,
        workDays: item.workDays,
        otHours: item.otHours,
        leaveDays: item.leaveDays,
        totals: {
          workDays: item.workDays,
          standardWorkDays: 26,
          leaveDays: item.leaveDays,
          absentDays: 0,
          otHours: item.otHours,
          otHoursWeekday: 0,
          otHoursWeekend: 0,
          otHoursHoliday: 0,
          lateArrivals: 0,
          earlyDepartures: 0,
          grossEarnings: Number(item.grossSalary),
          earnings: Number(item.grossSalary),
          employeeSocialInsurance: Number(item.socialInsurance),
          employeeHealthInsurance: Number(item.healthInsurance),
          employeeUnemploymentInsurance: Number(item.unemploymentIns),
          totalEmployeeInsurance: Number(item.socialInsurance) + Number(item.healthInsurance) + Number(item.unemploymentIns),
          employerSocialInsurance: 0,
          employerHealthInsurance: 0,
          employerUnemploymentInsurance: 0,
          totalEmployerInsurance: 0,
          taxableIncome: Number(item.grossSalary) - Number(item.socialInsurance) - Number(item.healthInsurance) - Number(item.unemploymentIns),
          personalIncomeTax: Number(item.tax),
          personalDeduction: 11000000,
          dependentDeduction: 0,
          numberOfDependents: 0,
          penaltyDeductions: Number(item.otherDeductions),
          otherDeductions: 0,
          deductions: Number(item.totalDeductions),
          contributions: 0,
          socialInsuranceBase: Number(item.baseSalary),
          netPay: Number(item.netSalary),
        },
        components: [],
        deductedPenaltySystemIds: [],
        createdAt: payroll.createdAt.toISOString(),
        updatedAt: payroll.updatedAt.toISOString(),
      })),
      // Include audit logs transformed for frontend
      auditLogs: auditLogs.map(log => ({
        systemId: log.systemId,
        batchSystemId: log.entityId,
        action: log.action,
        actorSystemId: log.userId,
        actorDisplayName: log.userName,
        payload: log.newData,
        createdAt: log.createdAt.toISOString(),
      })),
    }

    return apiSuccess(result)
  } catch (error) {
    console.error('Error fetching payroll:', error)
    return apiError('Failed to fetch payroll', 500)
  }
}

// PUT /api/payroll/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updatePayrollSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    // Delete existing items if new items provided
    if (body.items) {
      await prisma.payrollItem.deleteMany({
        where: { payrollId: systemId },
      })
    }

    const payroll = await prisma.payroll.update({
      where: { systemId },
      data: {
        status: body.status?.toUpperCase() as PayrollStatus | undefined,
        paidAt: body.paidAt ? new Date(body.paidAt) : undefined,
        items: body.items ? {
          create: await Promise.all(body.items.map(async (item: { employeeId: string; employeeName?: string; employeeCode?: string; baseSalary?: number; netSalary?: number; notes?: string | null }) => ({
            systemId: await generateIdWithPrefix('PI', prisma),
            employee: { connect: { systemId: item.employeeId } },
            employeeName: item.employeeName || '',
            employeeCode: item.employeeCode || '',
            baseSalary: item.baseSalary || 0,
            netSalary: item.netSalary || 0,
            notes: item.notes ?? '',
          }))),
        } : undefined,
      },
      include: {
        items: {
          include: { employee: true },
        },
      },
    })

    return apiSuccess(payroll)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Bảng lương không tồn tại', 404)
    }
    console.error('Error updating payroll:', error)
    return apiError('Failed to update payroll', 500)
  }
}

// DELETE /api/payroll/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Delete items first, then payroll
    await prisma.payrollItem.deleteMany({
      where: { payrollId: systemId },
    })

    await prisma.payroll.delete({
      where: { systemId },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Bảng lương không tồn tại', 404)
    }
    console.error('Error deleting payroll:', error)
    return apiError('Failed to delete payroll', 500)
  }
}
