import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import type { Prisma } from '@/generated/prisma/client'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

type Decimal = Prisma.Decimal;

// Helper to convert Decimal to number
function toNumber(val: Decimal | number | null | undefined): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  return Number(val);
}

// GET /api/payments/[systemId]
export const GET = apiHandler(async (_request, { session, params }) => {
  try {
    const { systemId } = params

    const [payment, auditLogs] = await Promise.all([
      prisma.payment.findUnique({
        where: { systemId },
        include: {
          purchaseOrder: {
            include: {
              items: {
                include: {
                  product: {
                    select: { systemId: true, id: true, name: true },
                  },
                },
              },
            },
          },
          suppliers: true,
        },
      }),
      prisma.auditLog.findMany({
        where: {
          entityType: 'payment',
          entityId: systemId,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    if (!payment) {
      return apiNotFound('Payment')
    }

    // Transform to frontend format
    const transformed = {
      ...payment,
      date: payment.paymentDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      amount: toNumber(payment.amount),
      runningBalance: toNumber(payment.runningBalance),
      createdAt: payment.createdAt?.toISOString(),
      updatedAt: payment.updatedAt?.toISOString(),
      paymentDate: payment.paymentDate?.toISOString(),
      cancelledAt: payment.cancelledAt?.toISOString(),
      recognitionDate: payment.recognitionDate?.toISOString(),
      auditLogs: auditLogs.map(log => ({
        ...log,
        timestamp: log.createdAt?.toISOString(),
      })),
    }

    // Resolve creator name
    let createdByName: string | null = null
    if (payment.createdBy) {
      const creator = await prisma.employee.findFirst({
        where: { OR: [{ systemId: payment.createdBy }, { id: payment.createdBy }] },
        select: { fullName: true },
      })
      createdByName = creator?.fullName || null
    }

    return apiSuccess({ ...transformed, createdByName })
  } catch (error) {
    logError('Error fetching payment', error)
    return apiError('Không thể tải phiếu chi', 500)
  }
})

// PUT /api/payments/[systemId]
export const PUT = apiHandler(async (request, { session, params }) => {
  try {
    const { systemId } = params
    const body = await request.json()

    const payment = await prisma.payment.update({
      where: { systemId },
      data: {
        amount: body.amount,
        paymentMethod: body.method || body.paymentMethod,
        description: body.description,
      },
      include: {
        purchaseOrder: true,
        suppliers: true,
      },
    })

    // Update customer debt if payment affects debt
    if (payment.affectsDebt && !payment.linkedSalesReturnSystemId) {
      const customerSystemId = payment.customerSystemId || payment.recipientSystemId;
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          logError('[Update Payment] Failed to update customer debt', err);
        });
      }
    }

    // Serialize for client
    const serialized = {
      ...payment,
      amount: toNumber(payment.amount),
      runningBalance: toNumber(payment.runningBalance),
    };

    // Notify about payment update
    if (payment.createdBy && payment.createdBy !== session!.user.employeeId) {
      createNotification({
        type: 'payment',
        title: 'Phiếu chi cập nhật',
        message: `Phiếu chi ${payment.id || systemId} đã được cập nhật`,
        link: `/payments/${systemId}`,
        recipientId: payment.createdBy,
        senderId: session!.user.employeeId,
        senderName: session!.user.name,
        settingsKey: 'payment:received',
      }).catch(e => logError('[Payment Update] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session!.user.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'payment',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật phiếu chi`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] payment update failed', e))
    return apiSuccess(serialized)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Payment')
    }
    logError('Error updating payment', error)
    return apiError('Không thể cập nhật phiếu chi', 500)
  }
})

// DELETE /api/payments/[systemId]
export const DELETE = apiHandler(async (_request, { session, params }) => {
  try {
    const { systemId } = params

    // Get payment info before deleting to update customer debt
    const payment = await prisma.payment.findUnique({
      where: { systemId },
      select: {
        affectsDebt: true,
        customerSystemId: true,
        recipientSystemId: true,
        linkedSalesReturnSystemId: true,
        originalDocumentId: true,
        linkedOrderSystemId: true,
        linkedWarrantySystemId: true,
        linkedComplaintSystemId: true,
        purchaseOrderSystemId: true,
        linkedPayrollBatchSystemId: true,
        linkedPayslipSystemId: true,
      },
    });

    if (!payment) {
      return apiNotFound('Payment')
    }

    // Chặn xóa phiếu chi tự động sinh từ giao dịch
    const isAutoGenerated = payment.originalDocumentId || payment.linkedOrderSystemId 
      || payment.linkedSalesReturnSystemId || payment.linkedWarrantySystemId 
      || payment.linkedComplaintSystemId || payment.purchaseOrderSystemId
      || payment.linkedPayrollBatchSystemId || payment.linkedPayslipSystemId;
    if (isAutoGenerated) {
      return apiError('Không thể xóa phiếu chi tự động sinh từ giao dịch. Vui lòng hủy phiếu thay vì xóa.', 400)
    }

    await prisma.payment.delete({
      where: { systemId },
    })

    // Update customer debt if payment affected debt
    if (payment.affectsDebt && !payment.linkedSalesReturnSystemId) {
      const customerSystemId = payment.customerSystemId || payment.recipientSystemId;
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          logError('[Delete Payment] Failed to update customer debt', err);
        });
      }
    }

    // Log activity
    getUserNameFromDb(session!.user.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'payment',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa phiếu chi`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] payment delete failed', e))
    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Payment')
    }
    logError('Error deleting payment', error)
    return apiError('Không thể xóa phiếu chi', 500)
  }
})
