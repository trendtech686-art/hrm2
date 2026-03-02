import { prisma } from '@/lib/prisma'
import { Prisma, CashTransactionType } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createCashTransactionSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'

// GET /api/cash-transactions - List all cash transactions
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const accountId = searchParams.get('accountId')
    const type = searchParams.get('type')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    const where: Prisma.CashTransactionWhereInput = {}

    if (accountId) {
      where.accountId = accountId
    }

    if (type) {
      where.type = type as CashTransactionType
    }

    if (fromDate || toDate) {
      where.transactionDate = {}
      if (fromDate) where.transactionDate.gte = new Date(fromDate)
      if (toDate) where.transactionDate.lte = new Date(toDate)
    }

    const [transactions, total] = await Promise.all([
      prisma.cashTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { transactionDate: 'desc' },
        include: {
          cash_accounts: true,
        },
      }),
      prisma.cashTransaction.count({ where }),
    ])

    return apiPaginated(transactions, { page, limit, total })
  } catch (error) {
    console.error('Error fetching cash transactions:', error)
    return apiError('Failed to fetch cash transactions', 500)
  }
}

// POST /api/cash-transactions - Create new transaction
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createCashTransactionSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Generate business ID
    let businessId = body.id
    if (!businessId) {
      const prefix = body.type === 'IN' || body.transactionType === 'IN' ? 'PT' : 'PC'
      const lastTxn = await prisma.cashTransaction.findFirst({
        where: { id: { startsWith: prefix } },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastTxn?.id 
        ? parseInt(lastTxn.id.replace(prefix, '')) 
        : 0
      businessId = `${prefix}${String(lastNum + 1).padStart(6, '0')}`
    }

    // Create transaction and update account balance in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const { systemId } = await generateNextIds('cashbook')
      
      const transaction = await tx.cashTransaction.create({
        data: {
          systemId,
          id: businessId,
          accountId: body.accountId || body.cashAccountId || '',
          type: (body.type || body.transactionType) as CashTransactionType,
          amount: body.amount,
          transactionDate: body.transactionDate ? new Date(body.transactionDate) : new Date(),
          description: body.description,
          referenceId: body.referenceId,
          referenceType: body.referenceType,
        },
        include: { cash_accounts: true },
      })

      // Update account balance
      const balanceChange = (body.type || body.transactionType) === 'IN' ? body.amount : -body.amount
      await tx.cashAccount.update({
        where: { systemId: body.accountId || body.cashAccountId },
        data: {
          balance: { increment: balanceChange },
        },
      })

      return transaction
    })

    return apiSuccess(result, 201)
  } catch (error) {
    console.error('Error creating cash transaction:', error)
    return apiError('Failed to create cash transaction', 500)
  }
}
