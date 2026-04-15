import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, requireAuth } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Vui lòng đăng nhập', 401)

  const { systemId } = await params

  try {
    // Check if tax exists
    const tax = await prisma.tax.findUnique({
      where: { systemId },
    })

    if (!tax) {
      return apiError('Không tìm thấy thuế', 404)
    }

    // Transaction: unset all defaults, then set new default
    const updated = await prisma.$transaction(async (tx) => {
      // Unset all default sale taxes
      await tx.tax.updateMany({
        where: { isDefaultSale: true },
        data: { isDefaultSale: false },
      })

      // Set this tax as default sale
      return tx.tax.update({
        where: { systemId },
        data: {
          isDefaultSale: true,
          updatedBy: session.user.id,
        },
      })
    })

    createActivityLog({
      entityType: 'tax',
      entityId: systemId,
      action: `Đặt thuế mặc định bán hàng: ${tax.name}`,
      actionType: 'update',
      changes: { 'MĐ bán hàng': { from: 'Không', to: 'Có' } },
      createdBy: session.user?.id,
    }).catch(e => logError('Failed to create activity log', e))

    return apiSuccess({ data: updated })
  } catch (error) {
    logError('[taxes] set-default-sale error', error)
    return apiError('Không thể đặt thuế mặc định cho bán hàng', 500)
  }
}
