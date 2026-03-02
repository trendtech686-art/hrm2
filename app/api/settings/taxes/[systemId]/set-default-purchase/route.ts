import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, requireAuth } from '@/lib/api-utils'

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
      // Unset all default purchase taxes
      await tx.tax.updateMany({
        where: { isDefaultPurchase: true },
        data: { isDefaultPurchase: false },
      })

      // Set this tax as default purchase
      return tx.tax.update({
        where: { systemId },
        data: {
          isDefaultPurchase: true,
          updatedBy: session.user.id,
        },
      })
    })

    return apiSuccess({ data: updated })
  } catch (error) {
    console.error('[taxes] set-default-purchase error:', error)
    return apiError('Không thể đặt thuế mặc định cho nhập hàng', 500)
  }
}
