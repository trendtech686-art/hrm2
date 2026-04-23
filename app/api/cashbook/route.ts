/**
 * Cashbook API - Aggregated view of receipts + payments (thứ tự theo thời gian xen kẽ thu/chi)
 *
 * GET /api/cashbook — merged pagination bằng SQL UNION, không còn lỗi "toàn bản ghi từ một loại" trên từng trang.
 */

import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { Prisma as PrismaTypes } from '@/generated/prisma/client'
import { apiSuccess, apiError, parsePagination } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'

type Decimal = PrismaTypes.Decimal

const toNumber = (val: Decimal | number | null | undefined): number => {
  if (val == null) return 0
  if (typeof val === 'number') return val
  return Number(val)
}

function buildReceiptWhereSql(params: {
  startDate: string | null
  endDate: string | null
  branchId: string | null
  accountId: string | null
  search: string | null
}): Prisma.Sql {
  const parts: Prisma.Sql[] = [Prisma.sql`r.status <> 'cancelled'`]
  if (params.startDate) {
    parts.push(Prisma.sql`r."receiptDate" >= ${new Date(params.startDate)}::timestamp`)
  }
  if (params.endDate) {
    parts.push(Prisma.sql`r."receiptDate" <= ${new Date(params.endDate)}::timestamp`)
  }
  if (params.branchId) {
    parts.push(Prisma.sql`r."branchSystemId" = ${params.branchId}`)
  }
  if (params.accountId) {
    parts.push(Prisma.sql`r."accountSystemId" = ${params.accountId}`)
  }
  if (params.search?.trim()) {
    const s = `%${params.search.trim().replace(/([%_])/g, '\\$1')}%`
    parts.push(
      Prisma.sql`(r.id ILIKE ${s} OR COALESCE(r.description, '') ILIKE ${s} OR COALESCE(r."payerName", '') ILIKE ${s})`,
    )
  }
  return Prisma.join(parts, ' AND ')
}

function buildPaymentWhereSql(params: {
  startDate: string | null
  endDate: string | null
  branchId: string | null
  accountId: string | null
  search: string | null
}): Prisma.Sql {
  const parts: Prisma.Sql[] = [Prisma.sql`p.status <> 'cancelled'`]
  if (params.startDate) {
    parts.push(Prisma.sql`p."paymentDate" >= ${new Date(params.startDate)}::timestamp`)
  }
  if (params.endDate) {
    parts.push(Prisma.sql`p."paymentDate" <= ${new Date(params.endDate)}::timestamp`)
  }
  if (params.branchId) {
    parts.push(Prisma.sql`p."branchSystemId" = ${params.branchId}`)
  }
  if (params.accountId) {
    parts.push(Prisma.sql`p."accountSystemId" = ${params.accountId}`)
  }
  if (params.search?.trim()) {
    const s = `%${params.search.trim().replace(/([%_])/g, '\\$1')}%`
    parts.push(
      Prisma.sql`(p.id ILIKE ${s} OR COALESCE(p.description, '') ILIKE ${s} OR COALESCE(p."recipientName", '') ILIKE ${s})`,
    )
  }
  return Prisma.join(parts, ' AND ')
}

type MergedRow = {
  systemId: string
  id: string
  d: Date
  amount: unknown
  description: string | null
  targetName: string | null
  accountSystemId: string | null
  branchSystemId: string | null
  branchName: string | null
  status: string
  paymentMethodName: string | null
  paymentReceiptTypeName: string | null
  originalDocumentId: string | null
  createdBy: string | null
  createdAt: Date
  t: 'receipt' | 'payment'
}

export const GET = apiHandler(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const branchId = searchParams.get('branchId')
    const accountId = searchParams.get('accountId')
    const search = searchParams.get('search')
    const type = searchParams.get('type')

    const fetchReceipts = type !== 'payment'
    const fetchPayments = type !== 'receipt'
    const filterParams = { startDate, endDate, branchId, accountId, search }

    const baseReceiptWhere: PrismaTypes.ReceiptWhereInput = { status: { not: 'cancelled' } }
    const basePaymentWhere: PrismaTypes.PaymentWhereInput = { status: { not: 'cancelled' } }

    const periodReceiptWhere: PrismaTypes.ReceiptWhereInput = { ...baseReceiptWhere }
    const periodPaymentWhere: PrismaTypes.PaymentWhereInput = { ...basePaymentWhere }

    if (startDate || endDate) {
      periodReceiptWhere.receiptDate = {
        ...((typeof periodReceiptWhere.receiptDate === 'object' && periodReceiptWhere.receiptDate) || {}),
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      } as PrismaTypes.DateTimeFilter
      periodPaymentWhere.paymentDate = {
        ...((typeof periodPaymentWhere.paymentDate === 'object' && periodPaymentWhere.paymentDate) || {}),
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      } as PrismaTypes.DateTimeFilter
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

    const accountWhere: PrismaTypes.CashAccountWhereInput = {}
    if (accountId) accountWhere.systemId = accountId
    if (branchId) accountWhere.OR = [{ branchSystemId: branchId }, { branchSystemId: null }]

    const [accounts, totalReceipts, totalPayments, periodReceiptSum, periodPaymentSum, preRga, prePga, perRga, perPga] =
      await Promise.all([
        prisma.cashAccount.findMany({
          where: { isActive: true, ...accountWhere },
          select: { systemId: true, name: true, type: true, initialBalance: true, branchSystemId: true },
          orderBy: { name: 'asc' },
        }),
        fetchReceipts ? prisma.receipt.count({ where: periodReceiptWhere }) : Promise.resolve(0),
        fetchPayments ? prisma.payment.count({ where: periodPaymentWhere }) : Promise.resolve(0),
        prisma.receipt.aggregate({
          where: periodReceiptWhere,
          _sum: { amount: true },
        }),
        prisma.payment.aggregate({
          where: periodPaymentWhere,
          _sum: { amount: true },
        }),
        startDate
          ? prisma.receipt.groupBy({
              by: ['accountSystemId'],
              where: {
                ...baseReceiptWhere,
                receiptDate: { lt: new Date(startDate) },
                ...(branchId && { branchSystemId: branchId }),
                ...(accountId && { accountSystemId: accountId }),
              },
              _sum: { amount: true },
            })
          : Promise.resolve([] as { accountSystemId: string | null; _sum: { amount: unknown } }[]),
        startDate
          ? prisma.payment.groupBy({
              by: ['accountSystemId'],
              where: {
                ...basePaymentWhere,
                paymentDate: { lt: new Date(startDate) },
                ...(branchId && { branchSystemId: branchId }),
                ...(accountId && { accountSystemId: accountId }),
              },
              _sum: { amount: true },
            })
          : Promise.resolve([] as { accountSystemId: string | null; _sum: { amount: unknown } }[]),
        prisma.receipt.groupBy({
          by: ['accountSystemId'],
          where: periodReceiptWhere,
          _sum: { amount: true },
        }),
        prisma.payment.groupBy({
          by: ['accountSystemId'],
          where: periodPaymentWhere,
          _sum: { amount: true },
        }),
      ])

    const totalReceiptsAmount = toNumber(periodReceiptSum._sum.amount)
    const totalPaymentsAmount = toNumber(periodPaymentSum._sum.amount)

    // Opening: tổng số dư ban đầu tài khoản + tích lũy trước kỳ
    let openingBalance = accounts.reduce((s, a) => s + toNumber(a.initialBalance), 0)
    if (startDate) {
      const preR = preRga.reduce((s, r) => s + toNumber(r._sum.amount as Decimal | null), 0)
      const preP = prePga.reduce((s, p) => s + toNumber(p._sum.amount as Decimal | null), 0)
      openingBalance += preR - preP
    }

    const closingBalance = openingBalance + totalReceiptsAmount - totalPaymentsAmount

    const preRMap = new Map<string | null, number>()
    for (const r of preRga) {
      preRMap.set(r.accountSystemId, toNumber(r._sum.amount as Decimal | null))
    }
    const prePMap = new Map<string | null, number>()
    for (const p of prePga) {
      prePMap.set(p.accountSystemId, toNumber(p._sum.amount as Decimal | null))
    }
    const perRMap = new Map<string | null, number>()
    for (const r of perRga) {
      perRMap.set(r.accountSystemId, toNumber(r._sum.amount as Decimal | null))
    }
    const perPMap = new Map<string | null, number>()
    for (const p of perPga) {
      perPMap.set(p.accountSystemId, toNumber(p._sum.amount as Decimal | null))
    }

    const accountBalances = accounts.map((a) => {
      const init = toNumber(a.initialBalance)
      const preR = startDate ? (preRMap.get(a.systemId) ?? 0) : 0
      const preP = startDate ? (prePMap.get(a.systemId) ?? 0) : 0
      const pR = perRMap.get(a.systemId) ?? 0
      const pP = perPMap.get(a.systemId) ?? 0
      const openA = startDate ? init + preR - preP : init
      const closeA = openA + pR - pP
      return { systemId: a.systemId, name: a.name, type: a.type, balance: closeA }
    })

    // --- Merged list (chronological) ---
    let mergedRows: MergedRow[] = []

    if (fetchReceipts && !fetchPayments) {
      const rows = await prisma.receipt.findMany({
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
      })
      mergedRows = rows.map((r) => ({
        systemId: r.systemId,
        id: r.id,
        d: r.receiptDate,
        amount: r.amount,
        description: r.description,
        targetName: r.payerName,
        accountSystemId: r.accountSystemId,
        branchSystemId: r.branchSystemId,
        branchName: r.branchName,
        status: r.status,
        paymentMethodName: r.paymentMethodName,
        paymentReceiptTypeName: r.paymentReceiptTypeName,
        originalDocumentId: r.originalDocumentId,
        createdBy: r.createdBy,
        createdAt: r.createdAt,
        t: 'receipt' as const,
      }))
    } else if (!fetchReceipts && fetchPayments) {
      const rows = await prisma.payment.findMany({
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
      })
      mergedRows = rows.map((p) => ({
        systemId: p.systemId,
        id: p.id,
        d: p.paymentDate,
        amount: p.amount,
        description: p.description,
        targetName: p.recipientName,
        accountSystemId: p.accountSystemId,
        branchSystemId: p.branchSystemId,
        branchName: p.branchName,
        status: p.status,
        paymentMethodName: p.paymentMethodName,
        paymentReceiptTypeName: p.paymentReceiptTypeName,
        originalDocumentId: p.originalDocumentId,
        createdBy: p.createdBy,
        createdAt: p.createdAt,
        t: 'payment' as const,
      }))
    } else if (fetchReceipts && fetchPayments) {
      const rWhere = buildReceiptWhereSql(filterParams)
      const pWhere = buildPaymentWhereSql(filterParams)
      mergedRows = await prisma.$queryRaw<MergedRow[]>`
        SELECT * FROM (
          SELECT
            r."systemId",
            r.id,
            r."receiptDate" AS d,
            r.amount,
            r.description,
            r."payerName" AS "targetName",
            r."accountSystemId",
            r."branchSystemId",
            r."branchName",
            r.status,
            r."paymentMethodName",
            r."paymentReceiptTypeName",
            r."originalDocumentId",
            r."createdBy",
            r."createdAt",
            'receipt'::text AS t
          FROM receipts r
          WHERE ${rWhere}
          UNION ALL
          SELECT
            p."systemId",
            p.id,
            p."paymentDate" AS d,
            p.amount,
            p.description,
            p."recipientName" AS "targetName",
            p."accountSystemId",
            p."branchSystemId",
            p."branchName",
            p.status,
            p."paymentMethodName",
            p."paymentReceiptTypeName",
            p."originalDocumentId",
            p."createdBy",
            p."createdAt",
            'payment'::text AS t
          FROM payments p
          WHERE ${pWhere}
        ) u
        ORDER BY u.d DESC, u.id DESC
        LIMIT ${limit}::int
        OFFSET ${skip}::int
      `
    }

    const transactions = mergedRows.map((row) => ({
      systemId: row.systemId,
      id: row.id,
      date: row.d,
      amount: toNumber(row.amount as unknown as Decimal),
      description: row.description,
      targetName: row.targetName,
      accountSystemId: row.accountSystemId,
      branchSystemId: row.branchSystemId,
      branchName: row.branchName,
      status: row.status,
      paymentMethodName: row.paymentMethodName,
      paymentReceiptTypeName: row.paymentReceiptTypeName,
      originalDocumentId: row.originalDocumentId,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      type: row.t,
    }))

    const creatorIds = [...new Set(transactions.map((t) => t.createdBy).filter(Boolean))] as string[]
    const creators =
      creatorIds.length > 0
        ? await prisma.employee.findMany({
            where: { systemId: { in: creatorIds } },
            select: { systemId: true, fullName: true },
          })
        : []
    const creatorMap = new Map(creators.map((e) => [e.systemId, e.fullName]))
    const transactionsWithNames = transactions.map((t) => ({
      ...t,
      createdByName: t.createdBy ? (creatorMap.get(t.createdBy) || t.createdBy) : null,
    }))

    return apiSuccess({
      transactions: transactionsWithNames,
      summary: {
        openingBalance,
        totalReceipts: totalReceiptsAmount,
        totalPayments: totalPaymentsAmount,
        closingBalance,
        accountBalances,
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
    logError('Error fetching cashbook', error)
    return apiError('Không thể tải dữ liệu sổ quỹ', 500)
  }
})
