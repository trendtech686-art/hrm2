import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, validateBody } from '@/lib/api-utils'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// Schema for updating payslip
const updatePayslipSchema = z.object({
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
  notes: z.string().optional().nullable(),
})

// GET /api/payroll/payslips/[systemId] - Get single payslip
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const item = await prisma.payrollItem.findUnique({
      where: { systemId },
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

    const item = await prisma.payrollItem.update({
      where: { systemId },
      data: {
        workDays: body.workDays,
        otHours: body.otHours,
        leaveDays: body.leaveDays,
        baseSalary: body.baseSalary,
        otPay: body.otPay,
        allowances: body.allowances,
        bonus: body.bonus,
        grossSalary: body.grossSalary,
        socialInsurance: body.socialInsurance,
        healthInsurance: body.healthInsurance,
        unemploymentIns: body.unemploymentIns,
        tax: body.tax,
        otherDeductions: body.otherDeductions,
        totalDeductions: body.totalDeductions,
        netSalary: body.netSalary,
        notes: body.notes,
      },
    })

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

    await prisma.payrollItem.delete({
      where: { systemId },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    logError('[API] Error deleting payslip', error)
    return apiError('Failed to delete payslip', 500)
  }
}
