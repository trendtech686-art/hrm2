/**
 * Adjust Supplier Debt API
 * 
 * POST /api/suppliers/[systemId]/adjust-debt
 * 
 * Manually adjust supplier currentDebt with a reason.
 * Creates an activity log entry for auditability.
 */

import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { z } from 'zod'

const adjustDebtSchema = z.object({
  amount: z.number({ error: 'Số tiền điều chỉnh là bắt buộc' }),
  reason: z.string().min(1, 'Lý do điều chỉnh là bắt buộc'),
})

export const POST = apiHandler(async (
  request,
  { session, params }
) => {
  const { systemId } = params

  const validation = await validateBody(request, adjustDebtSchema)
  if (!validation.success) return apiError(validation.error, 400)

  const { amount, reason } = validation.data

  const supplier = await prisma.supplier.findUnique({
    where: { systemId },
    select: { systemId: true, name: true, currentDebt: true },
  })
  if (!supplier) return apiError('Nhà cung cấp không tồn tại', 404)

  const oldDebt = Number(supplier.currentDebt ?? 0)
  const newDebt = oldDebt + amount

  const updated = await prisma.supplier.update({
    where: { systemId },
    data: { currentDebt: newDebt },
  })

  // Activity log (fire-and-forget)
  getUserNameFromDb(session!.user?.id).then(userName =>
    prisma.activityLog.create({
      data: {
        entityType: 'supplier',
        entityId: systemId,
        action: 'debt_adjusted',
        actionType: 'update',
        changes: { 'Công nợ hiện tại': { from: oldDebt, to: newDebt } },
        note: `Điều chỉnh công nợ NCC ${supplier.name}: ${amount >= 0 ? '+' : ''}${amount.toLocaleString('vi-VN')} đ. Lý do: ${reason}`,
        createdBy: userName,
        metadata: { amount, reason },
      },
    })
  ).catch(e => logError('[ActivityLog] supplier debt adjusted failed', e))

  return apiSuccess({
    supplier: updated,
    oldDebt,
    newDebt,
    adjustment: amount,
  })
})
