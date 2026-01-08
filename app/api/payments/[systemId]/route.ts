import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/payments/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const payment = await prisma.payment.findUnique({
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
    })

    if (!payment) {
      return apiNotFound('Payment')
    }

    return apiSuccess(payment)
  } catch (error) {
    console.error('Error fetching payment:', error)
    return apiError('Failed to fetch payment', 500)
  }
}

// PUT /api/payments/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
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

    return apiSuccess(payment)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Payment')
    }
    console.error('Error updating payment:', error)
    return apiError('Failed to update payment', 500)
  }
}

// DELETE /api/payments/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.payment.delete({
      where: { systemId },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Payment')
    }
    console.error('Error deleting payment:', error)
    return apiError('Failed to delete payment', 500)
  }
}
