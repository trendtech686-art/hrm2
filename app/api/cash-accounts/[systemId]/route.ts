import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/cash-accounts/[systemId]?transactionsLimit=20
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const url = new URL(request.url)
    const transactionsLimit = Math.min(10000, Math.max(1, parseInt(url.searchParams.get('transactionsLimit') || '20', 10)))

    const account = await prisma.cashAccount.findUnique({
      where: { systemId },
      include: {
        cash_transactions: {
          take: transactionsLimit,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!account) {
      return apiNotFound('Quỹ tiền')
    }

    // Map to frontend format
    return apiSuccess({
      ...account,
      type: account.type.toLowerCase() as 'cash' | 'bank',
      branchSystemId: account.branchId, // Map DB field to frontend field
      initialBalance: Number(account.initialBalance) || 0,
      balance: Number(account.balance) || 0,
      minBalance: account.minBalance ? Number(account.minBalance) : undefined,
      maxBalance: account.maxBalance ? Number(account.maxBalance) : undefined,
    })
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

    const cashType = (body.type?.toUpperCase() === 'BANK' ? 'BANK' : 'CASH') as import('@/generated/prisma/client').CashAccountType

    const account = await prisma.cashAccount.update({
      where: { systemId },
      data: {
        id: body.id,
        name: body.name,
        type: cashType,
        bankName: body.bankName,
        bankAccountNumber: body.bankAccountNumber,
        bankBranch: body.bankBranch,
        bankCode: body.bankCode,
        accountHolder: body.accountHolder,
        branchId: body.branchSystemId,
        minBalance: body.minBalance,
        maxBalance: body.maxBalance,
        isActive: body.isActive,
        isDefault: body.isDefault,
      },
    })

    // Map to frontend format
    return apiSuccess({
      ...account,
      type: account.type.toLowerCase() as 'cash' | 'bank',
      branchSystemId: account.branchId, // Map DB field to frontend field
      initialBalance: Number(account.initialBalance) || 0,
      balance: Number(account.balance) || 0,
      minBalance: account.minBalance ? Number(account.minBalance) : undefined,
      maxBalance: account.maxBalance ? Number(account.maxBalance) : undefined,
    })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Quỹ tiền')
    }
    console.error('Error updating cash account:', error)
    return apiError('Failed to update cash account', 500)
  }
}

// PATCH /api/cash-accounts/[systemId] - same as PUT
export { PUT as PATCH }

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
