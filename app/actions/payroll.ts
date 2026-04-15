'use server'

/**
 * Server Actions for Payroll Management (Bảng lương)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { requireActionPermission, serializeDecimals } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createPayrollSchema, updatePayrollSchema } from '@/features/payroll/validation'
import { logError } from '@/lib/logger'

// Types
type Payroll = NonNullable<Awaited<ReturnType<typeof prisma.payroll.findFirst>>>
type PayrollItem = NonNullable<Awaited<ReturnType<typeof prisma.payrollItem.findFirst>>>

export type CreatePayrollInput = {
  year: number
  month: number
  branchId?: string
  items?: Array<{
    employeeId: string
    employeeSystemId?: string
    employeeName?: string
    baseSalary?: number
    workDays?: number
    actualWorkDays?: number
    overtimeHours?: number
    overtimePay?: number
    allowances?: number
    bonuses?: number
    deductions?: number
    socialInsurance?: number
    healthInsurance?: number
    unemploymentInsurance?: number
    personalIncomeTax?: number
    otherDeductions?: number
    advances?: number
    notes?: string
  }>
  createdBy?: string
}

export type UpdatePayrollInput = {
  systemId: string
  status?: string
  notes?: string
  processedBy?: string
  paidBy?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createPayrollAction(
  input: CreatePayrollInput
): Promise<ActionResult<Payroll & { items: PayrollItem[] }>> {
  const authResult = await requireActionPermission('create_payroll')
  if (!authResult.success) return authResult
  const validated = createPayrollSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const systemId = await generateIdWithPrefix('PRL', tx)

      // Calculate totals
      let totalGross = 0
      let totalDeductions = 0
      let totalNet = 0

      if (input.items?.length) {
        for (const item of input.items) {
          const gross = (item.baseSalary ?? 0) + (item.overtimePay ?? 0) + 
                       (item.allowances ?? 0) + (item.bonuses ?? 0)
          const deductions = (item.deductions ?? 0) + (item.socialInsurance ?? 0) + 
                            (item.healthInsurance ?? 0) + (item.unemploymentInsurance ?? 0) + 
                            (item.personalIncomeTax ?? 0) + (item.otherDeductions ?? 0) + (item.advances ?? 0)
          totalGross += gross
          totalDeductions += deductions
          totalNet += (gross - deductions)
        }
      }

      const _payroll = await tx.payroll.create({
        data: {
          systemId,
          id: systemId,
          year: input.year,
          month: input.month,
          branchId: input.branchId,
          status: 'DRAFT',
          totalEmployees: input.items?.length ?? 0,
          totalGross,
          totalDeductions,
          totalNet,
          createdBy: input.createdBy,
        },
        include: { items: true },
      })

      // Create items if provided
      if (input.items?.length) {
        await tx.payrollItem.createMany({
          data: input.items.map((item, index) => {
            const grossSalary = (item.baseSalary ?? 0) + (item.overtimePay ?? 0) + 
                         (item.allowances ?? 0) + (item.bonuses ?? 0)
            const totalDeductions = (item.deductions ?? 0) + (item.socialInsurance ?? 0) + 
                              (item.healthInsurance ?? 0) + (item.unemploymentInsurance ?? 0) + 
                              (item.personalIncomeTax ?? 0) + (item.otherDeductions ?? 0) + (item.advances ?? 0)
            return {
              systemId: `${systemId}-${index + 1}`,
              payrollId: systemId,
              employeeId: item.employeeId,
              employeeName: item.employeeName ?? 'Unknown',
              employeeCode: item.employeeSystemId ?? item.employeeId,
              baseSalary: item.baseSalary ?? 0,
              workDays: item.workDays ?? 26,
              otHours: item.overtimeHours ?? 0,
              otPay: item.overtimePay ?? 0,
              allowances: item.allowances ?? 0,
              bonus: item.bonuses ?? 0,
              socialInsurance: item.socialInsurance ?? 0,
              healthInsurance: item.healthInsurance ?? 0,
              unemploymentIns: item.unemploymentInsurance ?? 0,
              tax: item.personalIncomeTax ?? 0,
              otherDeductions: item.otherDeductions ?? 0,
              totalDeductions,
              grossSalary,
              netSalary: grossSalary - totalDeductions,
              notes: item.notes,
            }
          }),
        })
      }

      return await tx.payroll.findUnique({
        where: { systemId },
        include: { items: true },
      })
    })

    revalidatePath('/payroll')
    return { success: true, data: serializeDecimals(result!) }
  } catch (error) {
    logError('Error creating payroll', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo bảng lương',
    }
  }
}

export async function updatePayrollAction(
  input: UpdatePayrollInput
): Promise<ActionResult<Payroll>> {
  const authResult = await requireActionPermission('create_payroll')
  if (!authResult.success) return authResult
  const validated = updatePayrollSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const { systemId, ...data } = input

    const existing = await prisma.payroll.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy bảng lương' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.status !== undefined) {
      updateData.status = data.status
      
      if (data.status === 'PROCESSED') {
        updateData.processedAt = new Date()
        updateData.processedBy = data.processedBy
      }
      
      if (data.status === 'PAID') {
        updateData.paidAt = new Date()
        updateData.paidBy = data.paidBy
      }
    }

    const payroll = await prisma.payroll.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/payroll')
    revalidatePath(`/payroll/${systemId}`)
    return { success: true, data: serializeDecimals(payroll) }
  } catch (error) {
    logError('Error updating payroll', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật bảng lương',
    }
  }
}

export async function deletePayrollAction(
  systemId: string
): Promise<ActionResult<Payroll>> {
  const authResult = await requireActionPermission('create_payroll')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.payroll.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy bảng lương' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xóa bảng lương ở trạng thái DRAFT',
      }
    }

    // Delete items first
    await prisma.payrollItem.deleteMany({
      where: { payrollId: systemId },
    })

    // Delete payroll
    const payroll = await prisma.payroll.delete({
      where: { systemId },
    })

    revalidatePath('/payroll')
    return { success: true, data: serializeDecimals(payroll) }
  } catch (error) {
    logError('Error deleting payroll', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa bảng lương',
    }
  }
}

export async function getPayrollAction(
  systemId: string
): Promise<ActionResult<Payroll & { items: PayrollItem[] }>> {
  const authResult = await requireActionPermission('view_payroll')
  if (!authResult.success) return authResult
  try {
    const payroll = await prisma.payroll.findUnique({
      where: { systemId },
      include: { items: true },
    })

    if (!payroll) {
      return { success: false, error: 'Không tìm thấy bảng lương' }
    }

    return { success: true, data: serializeDecimals(payroll) }
  } catch (error) {
    logError('Error getting payroll', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy bảng lương',
    }
  }
}

export async function processPayrollAction(
  systemId: string,
  processedBy?: string
): Promise<ActionResult<Payroll>> {
  const authResult = await requireActionPermission('approve_payroll')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.payroll.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy bảng lương' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xử lý bảng lương ở trạng thái DRAFT',
      }
    }

    const payroll = await prisma.payroll.update({
      where: { systemId },
      data: {
        status: 'PROCESSING',
        processedAt: new Date(),
        processedBy,
      },
    })

    revalidatePath('/payroll')
    revalidatePath(`/payroll/${systemId}`)
    return { success: true, data: serializeDecimals(payroll) }
  } catch (error) {
    logError('Error processing payroll', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xử lý bảng lương',
    }
  }
}

export async function markPayrollPaidAction(
  systemId: string,
  paidBy?: string
): Promise<ActionResult<Payroll>> {
  const authResult = await requireActionPermission('approve_payroll')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.payroll.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy bảng lương' }
    }

    if (existing.status !== 'PROCESSING' && existing.status !== 'COMPLETED') {
      return {
        success: false,
        error: 'Chỉ có thể thanh toán bảng lương ở trạng thái PROCESSING hoặc COMPLETED',
      }
    }

    const payroll = await prisma.payroll.update({
      where: { systemId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paidBy,
      },
    })

    revalidatePath('/payroll')
    revalidatePath(`/payroll/${systemId}`)
    return { success: true, data: serializeDecimals(payroll) }
  } catch (error) {
    logError('Error marking payroll as paid', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể thanh toán bảng lương',
    }
  }
}
