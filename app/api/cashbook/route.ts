/**
 * Cashbook API - Aggregated view of receipts + payments for cash accounts
 * 
 * GET /api/cashbook - Get transactions with opening/closing balance
 * Params: startDate, endDate, branchId, accountId, search, page, limit
 */

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, parsePagination } from '@/lib/api-utils'

type Decimal = Prisma.Decimal

// Helper to convert Decimal to number
const toNumber = (val: Decimal | number | null | undefined): number => {
  if (val == null) return 0
  if (typeof val === 'number') return val
  return Number(val)
}

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const branchId = searchParams.get('branchId')
    const accountId = searchParams.get('accountId')
    const search = searchParams.get('search')

    // Build where clauses for receipts and payments
    const baseReceiptWhere: Prisma.ReceiptWhereInput = {
      status: { not: 'cancelled' },
      accountSystemId: { not: null },
    }
    const basePaymentWhere: Prisma.PaymentWhereInput = {
      status: { not: 'cancelled' },
      accountSystemId: { not: null },
    }

    // Date filters for period transactions
    const periodReceiptWhere: Prisma.ReceiptWhereInput = { ...baseReceiptWhere }
    const periodPaymentWhere: Prisma.PaymentWhereInput = { ...basePaymentWhere }
    
    if (startDate) {
      periodReceiptWhere.receiptDate = { 
        ...(periodReceiptWhere.receiptDate as Prisma.DateTimeFilter || {}), 
        gte: new Date(startDate) 
      }
      periodPaymentWhere.paymentDate = { 
        ...(periodPaymentWhere.paymentDate as Prisma.DateTimeFilter || {}), 
        gte: new Date(startDate) 
      }
    }
    if (endDate) {
      periodReceiptWhere.receiptDate = { 
        ...(periodReceiptWhere.receiptDate as Prisma.DateTimeFilter || {}), 
        lte: new Date(endDate) 
      }
      periodPaymentWhere.paymentDate = { 
        ...(periodPaymentWhere.paymentDate as Prisma.DateTimeFilter || {}), 
        lte: new Date(endDate) 
      }
    }
    
    if (branchId) {
      periodReceiptWhere.branchSystemId = branchId
      periodPaymentWhere.branchSystemId = branchId
    }
    
    if (accountId) {
      periodReceiptWhere.accountSystemId = accountId
      periodPaymentWhere.accountSystemId = accountId
    }

    if (search) {
      periodReceiptWhere.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { payerName: { contains: search, mode: 'insensitive' } },
      ]
      periodPaymentWhere.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { recipientName: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get cash accounts for opening balance
    const accountWhere: Prisma.CashAccountWhereInput = {}
    if (accountId) accountWhere.systemId = accountId
    if (branchId) accountWhere.branchSystemId = branchId

    const [accounts, periodReceipts, periodPayments, totalReceipts, totalPayments] = await Promise.all([
      prisma.cashAccount.findMany({
        where: accountWhere,
        select: { systemId: true, initialBalance: true },
      }),
      // Period transactions for display
      prisma.receipt.findMany({
        where: periodReceiptWhere,
        orderBy: { receiptDate: 'desc' },
        skip,
        take: limit,
        select: {
          systemId: true,
          id: true,
          receiptDate: true,
          amount: true,
          description: true,
          payerName: true,
          accountSystemId: true,
          branchSystemId: true,
          branchName: true,
          status: true,
          paymentMethodName: true,
          paymentReceiptTypeName: true,
          originalDocumentId: true,
          createdBy: true,
          createdAt: true,
        },
      }),
      prisma.payment.findMany({
        where: periodPaymentWhere,
        orderBy: { paymentDate: 'desc' },
        skip,
        take: limit,
        select: {
          systemId: true,
          id: true,
          paymentDate: true,
          amount: true,
          description: true,
          recipientName: true,
          accountSystemId: true,
          branchSystemId: true,
          branchName: true,
          status: true,
          paymentMethodName: true,
          paymentReceiptTypeName: true,
          originalDocumentId: true,
          createdBy: true,
          createdAt: true,
        },
      }),
      prisma.receipt.count({ where: periodReceiptWhere }),
      prisma.payment.count({ where: periodPaymentWhere }),
    ])

    // Calculate opening balance (transactions before startDate)
    let openingBalance = accounts.reduce((sum, a) => sum + toNumber(a.initialBalance), 0)

    if (startDate) {
      const preStartReceiptWhere: Prisma.ReceiptWhereInput = {
        ...baseReceiptWhere,
        receiptDate: { lt: new Date(startDate) },
        ...(branchId && { branchSystemId: branchId }),
        ...(accountId && { accountSystemId: accountId }),
      }
      const preStartPaymentWhere: Prisma.PaymentWhereInput = {
        ...basePaymentWhere,
        paymentDate: { lt: new Date(startDate) },
        ...(branchId && { branchSystemId: branchId }),
        ...(accountId && { accountSystemId: accountId }),
      }

      const [preReceipts, prePayments] = await Promise.all([
        prisma.receipt.aggregate({
          where: preStartReceiptWhere,
          _sum: { amount: true },
        }),
        prisma.payment.aggregate({
          where: preStartPaymentWhere,
          _sum: { amount: true },
        }),
      ])

      openingBalance += toNumber(preReceipts._sum.amount) - toNumber(prePayments._sum.amount)
    }

    // Calculate period totals
    const [periodReceiptSum, periodPaymentSum] = await Promise.all([
      prisma.receipt.aggregate({
        where: periodReceiptWhere,
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: periodPaymentWhere,
        _sum: { amount: true },
      }),
    ])

    const totalReceiptsAmount = toNumber(periodReceiptSum._sum.amount)
    const totalPaymentsAmount = toNumber(periodPaymentSum._sum.amount)
    const closingBalance = openingBalance + totalReceiptsAmount - totalPaymentsAmount

    // Combine and format transactions
    const transactions = [
      ...periodReceipts.map(r => ({
        systemId: r.systemId,
        id: r.id,
        date: r.receiptDate,
        amount: toNumber(r.amount),
        description: r.description,
        accountSystemId: r.accountSystemId,
        branchSystemId: r.branchSystemId,
        branchName: r.branchName,
        status: r.status,
        paymentMethodName: r.paymentMethodName,
        paymentReceiptTypeName: r.paymentReceiptTypeName,
        originalDocumentId: r.originalDocumentId,
        createdBy: r.createdBy,
        createdAt: r.createdAt,
        type: 'receipt' as const,
        targetName: r.payerName,
      })),
      ...periodPayments.map(p => ({
        systemId: p.systemId,
        id: p.id,
        date: p.paymentDate,
        amount: toNumber(p.amount),
        description: p.description,
        accountSystemId: p.accountSystemId,
        branchSystemId: p.branchSystemId,
        branchName: p.branchName,
        status: p.status,
        paymentMethodName: p.paymentMethodName,
        paymentReceiptTypeName: p.paymentReceiptTypeName,
        originalDocumentId: p.originalDocumentId,
        createdBy: p.createdBy,
        createdAt: p.createdAt,
        type: 'payment' as const,
        targetName: p.recipientName,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return apiSuccess({
      transactions,
      summary: {
        openingBalance,
        totalReceipts: totalReceiptsAmount,
        totalPayments: totalPaymentsAmount,
        closingBalance,
      },
      pagination: {
        page,
        limit,
        totalReceipts,
        totalPayments,
        total: totalReceipts + totalPayments,
      },
    })
  } catch (error) {
    console.error('Error fetching cashbook:', error)
    return apiError('Failed to fetch cashbook data', 500)
  }
}
