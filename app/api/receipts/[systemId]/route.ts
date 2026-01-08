import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateReceiptSchema } from './validation'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/receipts/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const receipt = await prisma.receipt.findUnique({
      where: { systemId },
      include: {
        order: true,
        customers: true,
      },
    })

    if (!receipt) {
      return apiError('Phiếu thu không tồn tại', 404)
    }

    return apiSuccess(receipt)
  } catch (error) {
    console.error('Error fetching receipt:', error)
    return apiError('Failed to fetch receipt', 500)
  }
}

// PUT /api/receipts/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateReceiptSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const receipt = await prisma.receipt.update({
      where: { systemId },
      data: {
        amount: body.amount,
        paymentMethod: body.method || body.paymentMethod,
        description: body.description,
      },
      include: {
        order: true,
        customers: true,
      },
    })

    return apiSuccess(receipt)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu thu không tồn tại', 404)
    }
    console.error('Error updating receipt:', error)
    return apiError('Failed to update receipt', 500)
  }
}

// DELETE /api/receipts/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.receipt.delete({
      where: { systemId },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu thu không tồn tại', 404)
    }
    console.error('Error deleting receipt:', error)
    return apiError('Failed to delete receipt', 500)
  }
}
