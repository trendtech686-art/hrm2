import { prisma } from '@/lib/prisma'
import { PayrollStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updatePayrollSchema } from './validation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { createBulkNotifications } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { isPayrollLocked, lockedPayrollMessage } from '@/lib/payroll/lock-guard'

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
        select: {
          systemId: true,
          id: true,
          month: true,
          year: true,
          status: true,
          totalGross: true,
          totalDeductions: true,
          totalNet: true,
          totalEmployees: true,
          processedAt: true,
          processedBy: true,
          paidAt: true,
          createdBy: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              systemId: true,
              employeeId: true,
              employeeName: true,
              employeeCode: true,
              baseSalary: true,
              grossSalary: true,
              workDays: true,
              otHours: true,
              leaveDays: true,
              socialInsurance: true,
              healthInsurance: true,
              unemploymentIns: true,
              tax: true,
              otherDeductions: true,
              totalDeductions: true,
              netSalary: true,
              personalDeduction: true,
              dependentDeduction: true,
              numberOfDependents: true,
              calculationSnapshot: true,
              employee: {
                select: {
                  systemId: true,
                  id: true,
                  fullName: true,
                  department: {
                    select: {
                      systemId: true,
                      id: true,
                      name: true,
                    },
                  },
                  branch: {
                    select: {
                      systemId: true,
                      id: true,
                      name: true,
                    },
                  },
                  jobTitle: {
                    select: {
                      systemId: true,
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.auditLog.findMany({
        where: {
          entityType: 'payroll',
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

    type SnapshotShape = {
      components?: unknown[]
      totals?: Record<string, number>
      templateSystemId?: string
      deductedPenaltySystemIds?: string[]
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
      items: payroll.items.map(item => {
        // Ưu tiên snapshot JSON đã lưu khi chạy lương (đúng chi tiết nhất).
        // Nếu không có (data cũ trước migration) thì dựng lại từ các cột scalar + fields mới.
        const snapshot = (item.calculationSnapshot ?? null) as SnapshotShape | null
        const socialInsurance = Number(item.socialInsurance)
        const healthInsurance = Number(item.healthInsurance)
        const unemploymentIns = Number(item.unemploymentIns)
        const totalEmployeeInsurance = socialInsurance + healthInsurance + unemploymentIns
        const fallbackTotals = {
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
          employeeSocialInsurance: socialInsurance,
          employeeHealthInsurance: healthInsurance,
          employeeUnemploymentInsurance: unemploymentIns,
          totalEmployeeInsurance,
          employerSocialInsurance: 0,
          employerHealthInsurance: 0,
          employerUnemploymentInsurance: 0,
          totalEmployerInsurance: 0,
          taxableIncome: Number(item.grossSalary) - totalEmployeeInsurance,
          personalIncomeTax: Number(item.tax),
          // CHUẨN: đọc từ cột DB (đúng theo hồ sơ/settings tại thời điểm chạy), không hard-code.
          personalDeduction: Number(item.personalDeduction),
          dependentDeduction: Number(item.dependentDeduction),
          numberOfDependents: item.numberOfDependents,
          penaltyDeductions: Number(item.otherDeductions),
          otherDeductions: 0,
          deductions: Number(item.totalDeductions),
          contributions: 0,
          socialInsuranceBase: Number(item.baseSalary),
          netPay: Number(item.netSalary),
        }
        return {
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
          totals: snapshot?.totals ? { ...fallbackTotals, ...snapshot.totals } : fallbackTotals,
          components: Array.isArray(snapshot?.components) ? snapshot.components : [],
          deductedPenaltySystemIds: Array.isArray(snapshot?.deductedPenaltySystemIds) ? snapshot.deductedPenaltySystemIds : [],
          createdAt: payroll.createdAt.toISOString(),
          updatedAt: payroll.updatedAt.toISOString(),
        }
      }),
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
    logError('Error fetching payroll', error)
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

    // Lock guard: kỳ đã COMPLETED/PAID → chặn mọi thay đổi.
    // Nhưng cho phép transition status (VD: COMPLETED → PAID) qua endpoint riêng /status.
    const currentPayroll = await prisma.payroll.findUnique({
      where: { systemId },
      select: { status: true },
    })
    if (!currentPayroll) return apiError('Bảng lương không tồn tại', 404)
    if (isPayrollLocked(currentPayroll.status) && (body.items !== undefined)) {
      return apiError(lockedPayrollMessage(currentPayroll.status), 409)
    }

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
      select: {
        systemId: true,
        id: true,
        month: true,
        year: true,
        status: true,
        totalGross: true,
        totalDeductions: true,
        totalNet: true,
        totalEmployees: true,
        processedAt: true,
        processedBy: true,
        paidAt: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            systemId: true,
            employeeId: true,
            employeeName: true,
            employeeCode: true,
            baseSalary: true,
            netSalary: true,
            grossSalary: true,
            workDays: true,
            otHours: true,
            leaveDays: true,
            payrollId: true,
            employee: {
              select: {
                systemId: true,
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    })

    // Notify employees about payroll update
    const employeeIds = payroll.items?.map(item => item.employee?.systemId || '').filter(Boolean) || [];
    if (employeeIds.length > 0) {
      createBulkNotifications({
        type: 'payroll',
        settingsKey: 'payroll:updated',
        title: 'Cập nhật bảng lương',
        message: `Bảng lương ${payroll.id || systemId} đã được cập nhật`,
        link: `/payroll/${systemId}`,
        recipientIds: employeeIds,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Payroll Update] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'payroll',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật bảng lương`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] payroll updated failed', e))

    return apiSuccess(payroll)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Bảng lương không tồn tại', 404)
    }
    logError('Error updating payroll', error)
    return apiError('Failed to update payroll', 500)
  }
}

// DELETE /api/payroll/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Lock guard: không cho xoá kỳ đã chốt. Dùng endpoint /cancel để huỷ kỳ DRAFT/PROCESSING.
    const currentPayroll = await prisma.payroll.findUnique({
      where: { systemId },
      select: { status: true },
    })
    if (!currentPayroll) return apiError('Bảng lương không tồn tại', 404)
    if (isPayrollLocked(currentPayroll.status)) {
      return apiError(lockedPayrollMessage(currentPayroll.status), 409)
    }

    // Delete items first, then payroll
    await prisma.payrollItem.deleteMany({
      where: { payrollId: systemId },
    })

    await prisma.payroll.delete({
      where: { systemId },
    })

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'payroll',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa bảng lương`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] payroll deleted failed', e))

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Bảng lương không tồn tại', 404)
    }
    logError('Error deleting payroll', error)
    return apiError('Failed to delete payroll', 500)
  }
}
