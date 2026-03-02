import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, requireAuth } from '@/lib/api-utils'

const TYPE = 'receipt-type'

export async function POST(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const existing = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })
    if (!existing) return apiError('Receipt type not found', 404)

    const updated = await prisma.$transaction(async (tx) => {
      await tx.settingsData.updateMany({ where: { type: TYPE }, data: { isDefault: false } })
      return tx.settingsData.update({ where: { systemId }, data: { isDefault: true, updatedBy: session.user.id } })
    })

    return apiSuccess({ data: updated })
  } catch (error) {
    console.error('[receipt-types] set-default error:', error)
    return apiError('Failed to set default receipt type', 500)
  }
}
