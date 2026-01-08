import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/cash-accounts/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const account = await prisma.cashAccount.findUnique({
      where: { systemId },
      include: {
        cash_transactions: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!account) {
      return apiNotFound('Quỹ tiền')
    }

    return apiSuccess(account)
  } catch (error) {
    console.error('Error fetching cash account:', error)
    return apiError('Failed to fetch cash account', 500)
  }
}

// PUT /api/cash-accounts/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const account = await prisma.cashAccount.update({
      where: { systemId },
      data: {
        name: body.name,
        type: body.type || body.accountType,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        isActive: body.isActive,
      },
    })

    return apiSuccess(account)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Quỹ tiền')
    }
    console.error('Error updating cash account:', error)
    return apiError('Failed to update cash account', 500)
  }
}

// DELETE /api/cash-accounts/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.cashAccount.update({
      where: { systemId },
      data: { isActive: false },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Quỹ tiền')
    }
    console.error('Error deleting cash account:', error)
    return apiError('Failed to delete cash account', 500)
  }
}
