import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, validateBody } from '@/lib/api-utils'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { isPayrollLocked, lockedPayrollMessage } from '@/lib/payroll/lock-guard'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// Schema for updating payslip.
// Hỗ trợ 2 dạng payload:
//   1) Scalar fields (quick edit 1 dòng ở UI) — workDays, baseSalary, tax, netSalary, ...
//   2) Full payload từ UI sau khi admin chỉnh công thức: gồm `components[]` + `totals{}`.
//      Khi có `totals`, server sẽ map sang các cột scalar và cập nhật `calculationSnapshot`.
const payrollComponentEntrySchema = z.object({
  componentSystemId: z.string(),
  componentId: z.string(),
  label: z.string(),
  category: z.enum(['earning', 'deduction', 'contribution']),
  calculationType: z.enum(['fixed', 'formula']),
  amount: z.number(),
  formula: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

const payrollTotalsSchema = z.object({
  workDays: z.number().optional(),
  standardWorkDays: z.number().optional(),
  leaveDays: z.number().optional(),
  absentDays: z.number().optional(),
  otHours: z.number().optional(),
  otHoursWeekday: z.number().optional(),
  otHoursWeekend: z.number().optional(),
  otHoursHoliday: z.number().optional(),
  lateArrivals: z.number().optional(),
  earlyDepartures: z.number().optional(),
  grossEarnings: z.number().optional(),
  earnings: z.number().optional(),
  employeeSocialInsurance: z.number().optional(),
  employeeHealthInsurance: z.number().optional(),
  employeeUnemploymentInsurance: z.number().optional(),
  totalEmployeeInsurance: z.number().optional(),
  employerSocialInsurance: z.number().optional(),
  employerHealthInsurance: z.number().optional(),
  employerUnemploymentInsurance: z.number().optional(),
  totalEmployerInsurance: z.number().optional(),
  taxableIncome: z.number().optional(),
  personalIncomeTax: z.number().optional(),
  penaltyDeductions: z.number().optional(),
  otherDeductions: z.number().optional(),
  deductions: z.number().optional(),
  contributions: z.number().optional(),
  socialInsuranceBase: z.number().optional(),
  netPay: z.number().optional(),
  personalDeduction: z.number().optional(),
  dependentDeduction: z.number().optional(),
  numberOfDependents: z.number().optional(),
}).passthrough()

const updatePayslipSchema = z.object({
  // Scalar quick-edit fields
  workDays: z.number().optional(),
  otHours: z.number().optional(),
  leaveDays: z.number().optional(),
  baseSalary: z.number().optional(),
  otPay: z.number().optional(),
  allowances: z.number().optional(),
  bonus: z.number().optional(),
  grossSalary: z.number().optional(),
  socialInsurance: z.number().optional(),
  healthInsurance: z.number().optional(),
  unemploymentIns: z.number().optional(),
  tax: z.number().optional(),
  otherDeductions: z.number().optional(),
  totalDeductions: z.number().optional(),
  netSalary: z.number().optional(),
  personalDeduction: z.number().optional(),
  dependentDeduction: z.number().optional(),
  numberOfDependents: z.number().int().optional(),
  notes: z.string().optional().nullable(),
  // Full-payload từ UI (optional): nếu có thì server sẽ map totals → cột scalar tương ứng
  // và lưu components + totals vào calculationSnapshot để audit.
  components: z.array(payrollComponentEntrySchema).optional(),
  totals: payrollTotalsSchema.optional(),
})


// GET /api/payroll/payslips/[systemId] - Get single payslip
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const item = await prisma.payrollItem.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        employeeId: true,
        employeeName: true,
        employeeCode: true,
        workDays: true,
        otHours: true,
        leaveDays: true,
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
        personalDeduction: true,
        dependentDeduction: true,
        numberOfDependents: true,
        calculationSnapshot: true,
        notes: true,
        payrollId: true,
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
    })

    if (!item) {
      return apiError('Payslip not found', 404)
    }

    const payslip = {
      systemId: item.systemId,
      id: item.systemId,
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
    }

    return apiSuccess(payslip)
  } catch (error) {
    logError('[API] Error fetching payslip', error)
    return apiError('Failed to fetch payslip', 500)
  }
}

// PATCH /api/payroll/payslips/[systemId] - Update payslip
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const validation = await validateBody(request, updatePayslipSchema)
    if (!validation.success) return apiError(validation.error, 400)
    const body = validation.data

    // Lock guard: kỳ đã COMPLETED/PAID → chặn
    const existing = await prisma.payrollItem.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        employeeId: true,
        employeeName: true,
        workDays: true,
        otHours: true,
        leaveDays: true,
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
        notes: true,
        payroll: { select: { status: true, systemId: true, id: true } },
        employee: {
          select: { systemId: true },
        },
      },
    })
    if (!existing) return apiError('Payslip not found', 404)
    if (isPayrollLocked(existing.payroll.status)) {
      return apiError(lockedPayrollMessage(existing.payroll.status), 409)
    }

    // Nếu client gửi `totals`, ưu tiên map từ totals → các cột scalar (đồng bộ).
    const t = body.totals
    const resolved: Record<string, unknown> = {
      workDays: t?.workDays ?? body.workDays,
      otHours: t?.otHours ?? body.otHours,
      leaveDays: t?.leaveDays ?? body.leaveDays,
      baseSalary: body.baseSalary,
      otPay: body.otPay,
      allowances: body.allowances,
      bonus: body.bonus,
      grossSalary: t?.grossEarnings ?? t?.earnings ?? body.grossSalary,
      socialInsurance: t?.employeeSocialInsurance ?? body.socialInsurance,
      healthInsurance: t?.employeeHealthInsurance ?? body.healthInsurance,
      unemploymentIns: t?.employeeUnemploymentInsurance ?? body.unemploymentIns,
      tax: t?.personalIncomeTax ?? body.tax,
      otherDeductions: t
        ? (t.penaltyDeductions ?? 0) + (t.otherDeductions ?? 0)
        : body.otherDeductions,
      totalDeductions: t?.deductions ?? body.totalDeductions,
      netSalary: t?.netPay ?? body.netSalary,
      personalDeduction: t?.personalDeduction ?? body.personalDeduction,
      dependentDeduction: t?.dependentDeduction ?? body.dependentDeduction,
      numberOfDependents: t?.numberOfDependents ?? body.numberOfDependents,
      notes: body.notes,
    }
    // Đồng thời update calculationSnapshot khi có components/totals để giữ audit đầy đủ.
    if (body.components || body.totals) {
      resolved.calculationSnapshot = JSON.parse(JSON.stringify({
        engineVersion: '1.0',
        snapshotAt: new Date().toISOString(),
        editedBy: session.user?.id,
        components: body.components ?? [],
        totals: body.totals ?? null,
      }))
    }

    // Loại bỏ key có giá trị undefined để không ghi đè nhầm khi client chỉ gửi 1 field.
    const dataForUpdate = Object.fromEntries(
      Object.entries(resolved).filter(([, v]) => v !== undefined),
    )

    const item = await prisma.payrollItem.update({
      where: { systemId },
      data: dataForUpdate,
    })

    // Activity log: diff field nào đã đổi (so sánh existing vs resolved).
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    const toNum = (v: unknown): unknown =>
      typeof v === 'object' && v !== null && 'toNumber' in v
        ? (v as { toNumber: () => number }).toNumber()
        : v
    const diff = (key: string, oldVal: unknown) => {
      const newVal = resolved[key]
      if (newVal === undefined) return
      const oldNum = toNum(oldVal)
      if (oldNum !== newVal) changes[key] = { from: oldNum, to: newVal }
    }
    diff('workDays', existing.workDays)
    diff('otHours', existing.otHours)
    diff('leaveDays', existing.leaveDays)
    diff('baseSalary', existing.baseSalary)
    diff('otPay', existing.otPay)
    diff('allowances', existing.allowances)
    diff('bonus', existing.bonus)
    diff('grossSalary', existing.grossSalary)
    diff('socialInsurance', existing.socialInsurance)
    diff('healthInsurance', existing.healthInsurance)
    diff('unemploymentIns', existing.unemploymentIns)
    diff('tax', existing.tax)
    diff('otherDeductions', existing.otherDeductions)
    diff('totalDeductions', existing.totalDeductions)
    diff('netSalary', existing.netSalary)
    if (resolved.notes !== undefined && resolved.notes !== existing.notes) {
      changes.notes = { from: existing.notes, to: resolved.notes }
    }
    if (Object.keys(changes).length > 0) {
      createActivityLog({
        entityType: 'payroll',
        entityId: existing.payroll.systemId,
        action: `Cập nhật phiếu lương ${existing.employeeName}`,
        actionType: 'update',
        changes,
        metadata: {
          payslipSystemId: systemId,
          batchId: existing.payroll.id,
          userName: session.user?.name || session.user?.email,
        },
        createdBy: session.user?.id ?? '',
      }).catch(e => logError('[payslip] activity log failed', e))
    }

    // Notify employee about payslip update
    if (item.employeeId && item.employeeId !== session.user?.employeeId) {
      createNotification({
        type: 'payroll',
        settingsKey: 'payroll:updated',
        title: 'Phiếu lương cập nhật',
        message: `Phiếu lương của bạn đã được cập nhật`,
        link: `/payroll/payslips/${systemId}`,
        recipientId: item.employeeId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Payslip Update] notification failed', e));
    }

    return apiSuccess({
      systemId: item.systemId,
      id: item.systemId,
      batchSystemId: item.payrollId,
      employeeName: item.employeeName,
      netSalary: Number(item.netSalary),
    })
  } catch (error) {
    logError('[API] Error updating payslip', error)
    return apiError('Failed to update payslip', 500)
  }
}

// DELETE /api/payroll/payslips/[systemId] - Delete payslip
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const existing = await prisma.payrollItem.findUnique({
      where: { systemId },
      select: {
        employeeName: true,
        payroll: { select: { status: true, systemId: true, id: true } },
      },
    })
    if (!existing) return apiError('Payslip not found', 404)
    if (isPayrollLocked(existing.payroll.status)) {
      return apiError(lockedPayrollMessage(existing.payroll.status), 409)
    }

    await prisma.payrollItem.delete({
      where: { systemId },
    })

    createActivityLog({
      entityType: 'payroll',
      entityId: existing.payroll.systemId,
      action: `Xoá phiếu lương ${existing.employeeName}`,
      actionType: 'delete',
      metadata: {
        payslipSystemId: systemId,
        batchId: existing.payroll.id,
        userName: session.user?.name || session.user?.email,
      },
      createdBy: session.user?.id ?? '',
    }).catch(e => logError('[payslip] activity log failed', e))

    return apiSuccess({ success: true })
  } catch (error) {
    logError('[API] Error deleting payslip', error)
    return apiError('Failed to delete payslip', 500)
  }
}
