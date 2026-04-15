/**
 * Adjust Customer Debt API
 * 
 * POST /api/customers/[systemId]/adjust-debt
 * 
 * Manually adjust customer currentDebt with a reason.
 * Creates an activity log entry for auditability.
 */

import { prisma } from '@/lib/prisma'
import { validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { logError } from '@/lib/logger'
import { z } from 'zod'

const adjustDebtSchema = z.object({
  amount: z.number({ error: 'Số tiền điều chỉnh là bắt buộc' }),
  reason: z.string().min(1, 'Lý do điều chỉnh là bắt buộc'),
})

export const POST = apiHandler(async (
  request,
  { session, params }
) => {
  const validation = await validateBody(request, adjustDebtSchema)
  if (!validation.success) return apiError(validation.error, 400)

  const { amount, reason } = validation.data

    const { systemId } = await params

    const customer = await prisma.customer.findUnique({
      where: { systemId },
      select: { systemId: true, name: true, currentDebt: true },
    })
    if (!customer) return apiError('Khách hàng không tồn tại', 404)

    const oldDebt = Number(customer.currentDebt ?? 0)
    const newDebt = oldDebt + amount

    const updated = await prisma.customer.update({
      where: { systemId },
      data: { currentDebt: newDebt },
    })

    // Fire-and-forget activity log
    getUserNameFromDb(session!.user.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'customer',
          entityId: systemId,
          action: 'debt_adjusted',
          actionType: 'update',
          changes: { currentDebt: { from: oldDebt, to: newDebt } },
          note: `Điều chỉnh công nợ: ${amount >= 0 ? '+' : ''}${amount.toLocaleString('vi-VN')} đ. Lý do: ${reason}`,
          createdBy: userName,
          metadata: { userName, amount, reason },
        },
      })
    ).catch(e => logError('Activity log failed', e))

    return apiSuccess({
      customer: updated,
      oldDebt,
      newDebt,
      adjustment: amount,
    })
}, { permission: 'edit_customers' })
