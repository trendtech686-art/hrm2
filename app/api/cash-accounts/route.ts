import { prisma } from '@/lib/prisma'
import { Prisma, CashAccountType } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { createCashAccountSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'

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

    // Map to frontend format
    const data = accounts.map(acc => ({
      ...acc,
      type: acc.type.toLowerCase() as 'cash' | 'bank',
      branchSystemId: acc.branchId, // Map DB field to frontend field
      initialBalance: Number(acc.initialBalance) || 0,
      balance: Number(acc.balance) || 0,
      minBalance: acc.minBalance ? Number(acc.minBalance) : undefined,
      maxBalance: acc.maxBalance ? Number(acc.maxBalance) : undefined,
    }))

    return apiSuccess({ data })
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
    const cashType = (body.type?.toUpperCase() === 'BANK' ? 'BANK' : 'CASH') as CashAccountType;
    
    const { systemId, businessId } = await generateNextIds('cash-accounts')
    
    const account = await prisma.cashAccount.create({
      data: {
        systemId,
        id: body.id || businessId,
        name: body.name,
        type: cashType,
        balance: body.initialBalance ?? 0,
        initialBalance: body.initialBalance ?? 0,
        bankName: body.bankName,
        bankAccountNumber: body.bankAccountNumber,
        bankBranch: body.bankBranch,
        bankCode: body.bankCode,
        accountHolder: body.accountHolder,
        branchId: body.branchSystemId,
        minBalance: body.minBalance,
        maxBalance: body.maxBalance,
        isActive: body.isActive ?? true,
        isDefault: body.isDefault ?? false,
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
