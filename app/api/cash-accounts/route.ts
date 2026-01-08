import { prisma } from '@/lib/prisma'
import { Prisma, CashAccountType } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { createCashAccountSchema } from './validation'

// GET /api/cash-accounts - List all cash accounts
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const _all = searchParams.get('all') === 'true'

    const where: Prisma.CashAccountWhereInput = {
      isActive: true,
    }

    const accounts = await prisma.cashAccount.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return apiSuccess({ data: accounts })
  } catch (error) {
    console.error('Error fetching cash accounts:', error)
    return apiError('Failed to fetch cash accounts', 500)
  }
}

// POST /api/cash-accounts - Create new cash account
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createCashAccountSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const account = await prisma.cashAccount.create({
      data: {
        systemId: `CASH${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        type: (body.type || body.accountType || 'CASH') as CashAccountType,
        balance: body.balance || body.currentBalance || 0,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        isActive: body.isActive ?? true,
      },
    })

    return apiSuccess(account, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã quỹ đã tồn tại', 400)
    }
    console.error('Error creating cash account:', error)
    return apiError('Failed to create cash account', 500)
  }
}
