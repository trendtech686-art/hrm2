import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, requireAuth } from '@/lib/api-utils'

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

    return apiSuccess({ data: updated })
  } catch (error) {
    console.error('[payment-methods] set-default error:', error)
    return apiError('Failed to set default payment method', 500)
  }
}
