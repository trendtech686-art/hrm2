import { prisma } from '@/lib/prisma'
import { PayrollStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updatePayrollSchema } from './validation'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/payroll/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const payroll = await prisma.payroll.findUnique({
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
    })

    if (!payroll) {
      return apiError('Bảng lương không tồn tại', 404)
    }

    return apiSuccess(payroll)
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
          create: body.items.map((item: { employeeId: string; employeeName?: string; employeeCode?: string; baseSalary?: number; netSalary?: number; notes?: string | null }) => ({
            systemId: `PI${String(Date.now()).slice(-6).padStart(6, '0')}${Math.random().toString(36).slice(2, 5)}`,
            employee: { connect: { systemId: item.employeeId } },
            employeeName: item.employeeName || '',
            employeeCode: item.employeeCode || '',
            baseSalary: item.baseSalary || 0,
            netSalary: item.netSalary || 0,
            notes: item.notes ?? '',
          })),
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
