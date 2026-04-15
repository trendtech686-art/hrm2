import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { getUserNameFromDb } from '@/lib/get-user-name'

export const POST = apiHandler(async (_req, { session, params }) => {
  const { systemId } = params
  try {
    const existing = await prisma.cashAccount.findUnique({ where: { systemId } })
    if (!existing) return apiError('Không tìm thấy quỹ tiền', 404)

    const updated = await prisma.$transaction(async (tx) => {
      await tx.cashAccount.updateMany({ where: {}, data: { isDefault: false } })
      return tx.cashAccount.update({ where: { systemId }, data: { isDefault: true, updatedBy: session!.user.id } })
    })

    getUserNameFromDb(session!.user.id).then(userName =>
      createActivityLog({
        entityType: 'cash_account',
        entityId: systemId,
        action: `Cập nhật tài khoản quỹ: ${existing.name}: Mặc định`,
        actionType: 'update',
        changes: { 'Mặc định': { from: 'Không', to: 'Có' } },
        createdBy: userName,
      })
    ).catch(e => logError('Failed to create activity log', e))

    return apiSuccess({ data: updated })
  } catch (error) {
    logError('[cash-accounts] set-default error', error)
    return apiError('Không thể đặt quỹ mặc định', 500)
  }
})
