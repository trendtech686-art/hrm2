import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/cash-transactions - List all cash transactions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const accountId = searchParams.get('accountId')
    const type = searchParams.get('type')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    const skip = (page - 1) * limit

    const where: any = {}

    if (accountId) {
      where.accountId = accountId
    }

    if (type) {
      where.type = type
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
          cashAccount: true,
        },
      }),
      prisma.cashTransaction.count({ where }),
    ])

    return NextResponse.json({
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching cash transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cash transactions' },
      { status: 500 }
    )
  }
}

// POST /api/cash-transactions - Create new transaction
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID
    if (!body.id) {
      const prefix = body.type === 'IN' ? 'PT' : 'PC'
      const lastTxn = await prisma.cashTransaction.findFirst({
        where: { id: { startsWith: prefix } },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastTxn?.id 
        ? parseInt(lastTxn.id.replace(prefix, '')) 
        : 0
      body.id = `${prefix}${String(lastNum + 1).padStart(6, '0')}`
    }

    // Create transaction and update account balance in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.cashTransaction.create({
        data: {
          systemId: `CTRANS${String(Date.now()).slice(-10).padStart(10, '0')}`,
          id: body.id,
          cashAccountId: body.accountId || body.cashAccountId,
          transactionType: body.type || body.transactionType,
          amount: body.amount,
          balanceBefore: 0,
          balanceAfter: body.amount,
          transactionDate: body.transactionDate ? new Date(body.transactionDate) : new Date(),
          description: body.description,
          referenceId: body.referenceId,
          referenceType: body.referenceType,
        },
        include: { cashAccount: true },
      })

      // Update account balance
      const balanceChange = (body.type || body.transactionType) === 'receipt' ? body.amount : -body.amount
      await tx.cashAccount.update({
        where: { systemId: body.accountId || body.cashAccountId },
        data: {
          currentBalance: { increment: balanceChange },
        },
      })

      return transaction
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating cash transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create cash transaction' },
      { status: 500 }
    )
  }
}
