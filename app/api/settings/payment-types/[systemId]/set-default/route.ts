import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, requireAuth } from '@/lib/api-utils'

const TYPE = 'payment-type'

export async function PATCH(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const existing = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })
    if (!existing) return apiError('Payment type not found', 404)

    const updated = await prisma.$transaction(async (tx) => {
      await tx.settingsData.updateMany({ where: { type: TYPE }, data: { isDefault: false } })
      return tx.settingsData.update({ where: { systemId }, data: { isDefault: true, updatedBy: session.user.id } })
    })

    return apiSuccess({ data: updated })
  } catch (error) {
    console.error('[payment-types] set-default error:', error)
    return apiError('Failed to set default payment type', 500)
  }
}
