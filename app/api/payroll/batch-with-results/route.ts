import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import type { PayrollComponentEntry, PayrollTotals } from '@/lib/payroll-types'
import { logError } from '@/lib/logger'
import { createBulkNotifications } from '@/lib/notifications'
import { toMonthKey } from '@/lib/payroll/lock-guard'

interface GeneratedPayslip {
  employeeSystemId: string;
  employeeId: string;
  departmentSystemId?: string;
  periodMonthKey: string;
  components: PayrollComponentEntry[];
  totals: PayrollTotals;
  attendanceSnapshotSystemId?: string;
  deductedPenaltySystemIds?: string[];
}

interface CreateBatchWithPayslipsInput {
  title: string;
  templateSystemId?: string;
  month: number;
  year: number;
  payrollDate: string;
  referenceAttendanceMonthKeys?: string[];
  notes?: string;
  generatedPayslips: GeneratedPayslip[];
}

// POST /api/payroll/batch-with-results
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body: CreateBatchWithPayslipsInput = await request.json()
    
    const { month, year, generatedPayslips, notes } = body

    // Validate required fields
    if (!month || !year || !generatedPayslips?.length) {
      return apiError('Missing required fields: month, year, generatedPayslips', 400)
    }

    // Pre-check: tháng chấm công PHẢI được khóa trước khi chạy lương.
    // Cho phép bypass bằng header `x-payroll-skip-lock-check: true` (dev/debug only).
    const skipLockCheck = request.headers.get('x-payroll-skip-lock-check') === 'true'
      && process.env.NODE_ENV !== 'production'
    if (!skipLockCheck) {
      const monthKey = toMonthKey(year, month)
      const attendanceLock = await prisma.attendanceLock.findUnique({
        where: { monthKey },
        select: { isLocked: true },
      })
      if (!attendanceLock?.isLocked) {
        return apiError(
          `Tháng chấm công ${monthKey} chưa được khóa. Vui lòng khóa chấm công trước khi chạy bảng lương để bảo đảm số liệu không đổi.`,
          409,
        )
      }

      // Chặn tạo trùng kỳ lương cho cùng (year, month, branch=null).
      const existingBatch = await prisma.payroll.findFirst({
        where: { year, month, branchId: null },
        select: { systemId: true, id: true, status: true },
      })
      if (existingBatch) {
        return apiError(
          `Đã có bảng lương ${existingBatch.id} cho tháng ${monthKey} (trạng thái: ${existingBatch.status}). Muốn chạy lại, hãy huỷ kỳ hiện tại.`,
          409,
        )
      }
    }

    // Generate business ID
    const prefix = `BL${year}${String(month).padStart(2, '0')}`
    const lastPayroll = await prisma.payroll.findFirst({
      where: { id: { startsWith: prefix } },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    })
    const lastNum = lastPayroll?.id 
      ? parseInt(lastPayroll.id.replace(prefix, '')) 
      : 0
    const businessId = `${prefix}${String(lastNum + 1).padStart(3, '0')}`

    // Calculate totals
    const totalGross = generatedPayslips.reduce((sum, p) => sum + (p.totals.grossEarnings || p.totals.earnings || 0), 0)
    const totalDeductions = generatedPayslips.reduce((sum, p) => sum + (p.totals.deductions || 0), 0)
    const totalNet = generatedPayslips.reduce((sum, p) => sum + (p.totals.netPay || 0), 0)

    // Create payroll with items in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Generate sequential systemId (PAYROLL000001)
      const lastPayrollBySystemId = await tx.payroll.findFirst({
        where: { systemId: { startsWith: 'PAYROLL' } },
        orderBy: { systemId: 'desc' },
        select: { systemId: true },
      })
      const lastSystemNum = lastPayrollBySystemId?.systemId 
        ? parseInt(lastPayrollBySystemId.systemId.replace('PAYROLL', '')) 
        : 0
      const payrollSystemId = `PAYROLL${String(lastSystemNum + 1).padStart(6, '0')}`
      
      // Create payroll batch
      const payroll = await tx.payroll.create({
        data: {
          systemId: payrollSystemId,
          id: businessId,
          year,
          month,
          status: 'DRAFT',
          totalEmployees: generatedPayslips.length,
          totalGross,
          totalDeductions,
          totalNet,
          createdBy: session.user?.name || session.user?.email || 'system',
        },
      })

      // Create payroll items
      // Get max payslip counter
      const lastPayslip = await tx.payrollItem.findFirst({
        where: { systemId: { startsWith: 'PAYSLIP' } },
        orderBy: { systemId: 'desc' },
        select: { systemId: true },
      })
      let payslipCounter = lastPayslip?.systemId 
        ? parseInt(lastPayslip.systemId.replace('PAYSLIP', '')) 
        : 0

      const payrollItems = await Promise.all(
        generatedPayslips.map(async (payslip) => {
          const totals = payslip.totals
          const components = payslip.components || []
          
          // Find employee
          const employee = await tx.employee.findUnique({
            where: { systemId: payslip.employeeSystemId },
            select: { systemId: true, id: true, fullName: true, baseSalary: true }
          })
          
          // Calculate component amounts
          const allowances = components
            .filter(c => c.category === 'earning' && c.componentId !== 'baseSalary' && c.componentId !== 'TL001')
            .reduce((sum, c) => sum + (c.amount || 0), 0)
          
          const bonus = components
            .filter(c => c.componentId?.toLowerCase().includes('bonus') || c.label?.toLowerCase().includes('thưởng'))
            .reduce((sum, c) => sum + (c.amount || 0), 0)

          // Tính OT pay từ component nếu có (component có id/label chứa 'ot' hoặc 'tăng ca')
          const otPay = components
            .filter(c => {
              const id = (c.componentId || '').toLowerCase()
              const label = (c.label || '').toLowerCase()
              return id.includes('ot') || id.includes('overtime') || label.includes('tăng ca') || label.includes('làm thêm')
            })
            .reduce((sum, c) => sum + (c.amount || 0), 0)

          payslipCounter++
          return tx.payrollItem.create({
            data: {
              systemId: `PAYSLIP${String(payslipCounter).padStart(6, '0')}`,
              payrollId: payroll.systemId,
              employeeId: employee?.systemId,
              employeeName: employee?.fullName || payslip.employeeId,
              employeeCode: employee?.id || payslip.employeeId,
              workDays: totals.workDays || 0,
              otHours: totals.otHours || 0,
              leaveDays: totals.leaveDays || 0,
              baseSalary: employee?.baseSalary || 0,
              otPay,
              allowances,
              bonus,
              grossSalary: totals.grossEarnings || totals.earnings || 0,
              socialInsurance: totals.employeeSocialInsurance || 0,
              healthInsurance: totals.employeeHealthInsurance || 0,
              unemploymentIns: totals.employeeUnemploymentInsurance || 0,
              tax: totals.personalIncomeTax || 0,
              otherDeductions: (totals.penaltyDeductions || 0) + (totals.otherDeductions || 0),
              totalDeductions: totals.deductions || 0,
              netSalary: totals.netPay || 0,
              personalDeduction: totals.personalDeduction || 0,
              dependentDeduction: totals.dependentDeduction || 0,
              numberOfDependents: totals.numberOfDependents || 0,
              // Snapshot toàn bộ công thức & kết quả tính tại thời điểm chạy để audit sau này.
              calculationSnapshot: JSON.parse(JSON.stringify({
                engineVersion: '1.0',
                snapshotAt: new Date().toISOString(),
                templateSystemId: body.templateSystemId,
                periodMonthKey: payslip.periodMonthKey,
                attendanceSnapshotSystemId: payslip.attendanceSnapshotSystemId,
                deductedPenaltySystemIds: payslip.deductedPenaltySystemIds || [],
                components,
                totals,
              })),
              notes: notes,
            },
          })
        })
      )

      // Mark penalties as deducted
      const allDeductedPenaltyIds = generatedPayslips
        .flatMap(p => p.deductedPenaltySystemIds || [])
        .filter(Boolean)
      
      if (allDeductedPenaltyIds.length > 0) {
        await tx.penalty.updateMany({
          where: { systemId: { in: allDeductedPenaltyIds } },
          data: { 
            status: 'DEDUCTED',
            deductedInPayrollId: payroll.systemId,
            deductedAt: new Date(),
            isApplied: true,
          },
        })
      }

      // Create audit log for batch creation
      const lastAuditLog = await tx.auditLog.findFirst({
        where: { systemId: { startsWith: 'LOG' } },
        orderBy: { systemId: 'desc' },
        select: { systemId: true },
      })
      const auditLogCounter = lastAuditLog?.systemId 
        ? parseInt(lastAuditLog.systemId.replace('LOG', '')) + 1
        : 1
      
      await tx.auditLog.create({
        data: {
          systemId: `LOG${String(auditLogCounter).padStart(10, '0')}`,
          entityType: 'payroll',
          entityId: payroll.systemId,
          action: 'run',
          userId: session.user?.email || 'system',
          userName: session.user?.name || session.user?.email || 'Hệ thống',
          newData: {
            systemId: payroll.systemId,
            id: businessId,
            month,
            year,
            totalEmployees: generatedPayslips.length,
          },
        },
      })

      return { payroll, payrollItems }
    })

    // Notify employees in the payroll batch
    const employeeIds = result.payrollItems?.map(item => item.employeeId).filter((id): id is string => !!id) || [];
    if (employeeIds.length > 0) {
      createBulkNotifications({
        type: 'payroll',
        settingsKey: 'payroll:updated',
        title: 'Bảng lương mới',
        message: `Bảng lương đã được tạo với ${employeeIds.length} nhân viên`,
        link: `/payroll/${result.payroll.systemId}`,
        recipientIds: employeeIds,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Payroll Batch] notification failed', e));
    }

    return apiSuccess({
      batch: result.payroll,
      payslips: result.payrollItems,
      message: `Đã tạo bảng lương ${businessId} với ${result.payrollItems.length} nhân viên`,
    })
  } catch (error) {
    logError('Error creating payroll batch', error)
    return apiError(
      error instanceof Error ? error.message : 'Failed to create payroll batch',
      500
    )
  }
}
