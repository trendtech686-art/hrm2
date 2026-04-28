import { prisma } from '@/lib/prisma'
import { Prisma, CashTransactionType } from '@/generated/prisma/client'
import { requireAuth, requirePermission, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createCashTransactionSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
        select: {
          systemId: true,
          id: true,
          accountId: true,
          type: true,
          amount: true,
          referenceType: true,
          referenceId: true,
          description: true,
          transactionDate: true,
          createdAt: true,
          cash_accounts: {
            select: { systemId: true, id: true, name: true, type: true, balance: true },
          },
        },
      }),
      prisma.cashTransaction.count({ where }),
    ])

    return apiPaginated(transactions, { page, limit, total })
  } catch (error) {
    logError('Error fetching cash transactions', error)
    return apiError('Failed to fetch cash transactions', 500)
  }
}

// POST /api/cash-transactions - Create new transaction
export async function POST(request: Request) {
  const result = await requirePermission('create_cash_transaction')
  if (result instanceof Response) return result
  const session = result

  const validation = await validateBody(request, createCashTransactionSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  // Extract account ID for validation
  const accountId = body.accountId || body.cashAccountId || ''

  try {
    // 1. Verify account exists BEFORE starting transaction
    const account = await prisma.cashAccount.findUnique({
      where: { systemId: accountId },
      select: { systemId: true, name: true },
    })
    if (!account) {
      return apiError('Tài khoản tiền mặt không tồn tại', 400)
    }

    // 2. Determine ID prefix
    const prefix = body.type === 'IN' || body.transactionType === 'IN' ? 'PT' : 'PC'

    // 3. Create transaction with serializable isolation to prevent race condition on ID generation
    const result = await prisma.$transaction(async (tx) => {
      // Generate ID inside transaction with serializable isolation to prevent duplicates
      // Use raw query for row-level locking (PostgreSQL)
      let businessId = body.id
      if (!businessId) {
        // Lock the last row for this prefix to prevent concurrent ID generation
        const lastTxn = await tx.$queryRaw<{ id: string }[]>`
          SELECT id FROM "CashTransaction" 
          WHERE id LIKE ${prefix + '%'}
          ORDER BY "createdAt" DESC 
          LIMIT 1
          FOR UPDATE
        `
        const lastNum = lastTxn && lastTxn.length > 0 && lastTxn[0].id
          ? parseInt(lastTxn[0].id.replace(prefix, ''))
          : 0
        businessId = `${prefix}${String(lastNum + 1).padStart(6, '0')}`
      }

      const { systemId } = await generateNextIds('cashbook')

      const transaction = await tx.cashTransaction.create({
        data: {
          systemId,
          id: businessId,
          accountId,
          type: (body.type || body.transactionType) as CashTransactionType,
          amount: body.amount,
          transactionDate: body.transactionDate ? new Date(body.transactionDate) : new Date(),
          description: body.description,
          referenceId: body.referenceId,
          referenceType: body.referenceType,
        },
        select: {
          systemId: true,
          id: true,
          accountId: true,
          type: true,
          amount: true,
          referenceType: true,
          referenceId: true,
          description: true,
          transactionDate: true,
          createdAt: true,
        },
      })

      // Update account balance (account already verified to exist)
      const balanceChange = (body.type || body.transactionType) === 'IN' ? body.amount : -body.amount
      await tx.cashAccount.update({
        where: { systemId: accountId },
        data: {
          balance: { increment: balanceChange },
        },
      })

      return transaction
    }, {
      isolationLevel: 'Serializable',
      timeout: 10000,
    })

    createActivityLog({
      entityType: 'cash_transaction',
      entityId: result.systemId,
      action: 'created',
      actionType: 'create',
      metadata: { type: body.type || body.transactionType, amount: body.amount, businessId: businessId },
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess(result, 201)
  } catch (error) {
    logError('Error creating cash transaction', error)
    return apiError('Failed to create cash transaction', 500)
  }
}
