import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

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
          entityType: 'payroll',
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

    // Notify payroll creator about cancellation
    if (payroll.createdBy && payroll.createdBy !== session.user?.email) {
      const creatorEmployee = await prisma.employee.findFirst({
        where: { OR: [{ systemId: payroll.createdBy }, { id: payroll.createdBy }] },
        select: { systemId: true },
      });
      if (creatorEmployee) {
        createNotification({
          type: 'payroll',
          settingsKey: 'payroll:updated',
          title: 'Bảng lương bị hủy',
          message: `Bảng lương ${payroll.id} đã bị hủy${reason ? `: ${reason}` : ''}`,
          link: `/payroll`,
          recipientId: creatorEmployee.systemId,
          senderId: session.user?.employeeId,
          senderName: session.user?.name,
        }).catch(e => logError('[Payroll Cancel] notification failed', e));
      }
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'payroll',
          entityId: systemId,
          action: 'cancelled',
          actionType: 'update',
          note: `Hủy bảng lương`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] payroll cancelled failed', e))

    return apiSuccess({
      message: `Đã hủy bảng lương ${payroll.id}`,
      cancelledPayments: result.cancelledPaymentsCount,
      rolledBackPenalties: result.rolledBackPenaltiesCount,
    })
  } catch (error) {
    logError('Error cancelling payroll', error)
    return apiError(
      error instanceof Error ? error.message : 'Failed to cancel batch',
      500
    )
  }
}
