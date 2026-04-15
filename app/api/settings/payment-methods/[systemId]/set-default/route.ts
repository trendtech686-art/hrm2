import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, requireAuth } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

export async function PATCH(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const existing = await prisma.paymentMethod.findUnique({ where: { systemId } })
    if (!existing) return apiError('Payment method not found', 404)

    const updated = await prisma.$transaction(async (tx) => {
      await tx.paymentMethod.updateMany({ where: {}, data: { isDefault: false } })
      return tx.paymentMethod.update({ where: { systemId }, data: { isDefault: true, updatedBy: session.user.id } })
    })

    createActivityLog({
      entityType: 'payment_method',
      entityId: systemId,
      action: `Cập nhật phương thức thanh toán: ${existing.name}: Mặc định`,
      actionType: 'update',
      changes: { 'Mặc định': { from: 'Không', to: 'Có' } },
      createdBy: session.user?.id,
    }).catch(e => logError('Failed to create activity log', e))

    return apiSuccess({ data: updated })
  } catch (error) {
    logError('[payment-methods] set-default error', error)
    return apiError('Failed to set default payment method', 500)
  }
}
