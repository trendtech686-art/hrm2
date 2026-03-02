import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// POST /api/payroll/[systemId]/cancel
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json().catch(() => ({}))
    const { reason } = body

    // Get payroll with items
    const payroll = await prisma.payroll.findUnique({
      where: { systemId },
      include: {
        items: {
          select: { systemId: true }
        }
      }
    })

    if (!payroll) {
      return apiError('Bảng lương không tồn tại', 404)
    }

    // Check if can be cancelled (only DRAFT or PROCESSING)
    if (!['DRAFT', 'PROCESSING'].includes(payroll.status)) {
      return apiError('Chỉ có thể hủy bảng lương ở trạng thái Nháp hoặc Đang duyệt', 400)
    }

    // Transaction to cancel batch and rollback related data
    const result = await prisma.$transaction(async (tx) => {
      // 1. Cancel linked payments
      const cancelledPayments = await tx.payment.updateMany({
        where: {
          linkedPayrollBatchSystemId: systemId,
          status: { not: 'cancelled' },
        },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
        },
      })

      // 2. Rollback penalties that were deducted in this payroll
      const rolledBackPenalties = await tx.penalty.updateMany({
        where: { deductedInPayrollId: systemId },
        data: {
          status: 'Chưa thanh toán',
          deductedInPayrollId: null,
          deductedAt: null,
          isApplied: false,
        },
      })

      // 3. Delete payroll items
      await tx.payrollItem.deleteMany({
        where: { payrollId: systemId }
      })

      // 4. Delete the payroll batch
      await tx.payroll.delete({
        where: { systemId }
      })

      // 5. Create audit log
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
          entityType: 'Payroll',
          entityId: systemId,
          action: 'cancel',
          userId: session.user?.email || 'system',
          userName: session.user?.name || session.user?.email || 'Hệ thống',
          oldData: { 
            id: payroll.id,
            month: payroll.month,
            year: payroll.year,
            status: payroll.status,
          },
          newData: { 
            cancelled: true,
            reason,
          },
        },
      })

      return {
        cancelledPaymentsCount: cancelledPayments.count,
        rolledBackPenaltiesCount: rolledBackPenalties.count,
      }
    })

    return apiSuccess({
      message: `Đã hủy bảng lương ${payroll.id}`,
      cancelledPayments: result.cancelledPaymentsCount,
      rolledBackPenalties: result.rolledBackPenaltiesCount,
    })
  } catch (error) {
    console.error('Error cancelling payroll:', error)
    return apiError(
      error instanceof Error ? error.message : 'Failed to cancel batch',
      500
    )
  }
}
