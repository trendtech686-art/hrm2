/**
 * Cash Account Balances API - Server-side calculation of account balances
 * 
 * GET /api/cash-accounts/balances - Get balances for all accounts
 * GET /api/cash-accounts/balances?accountSystemId=xxx - Get balance for a specific account
 * 
 * Balance calculation:
 * - Initial balance (from CashAccount.initialBalance)
 * - Plus: all receipts to this account
 * - Minus: all payments from this account
 */

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'

type Decimal = Prisma.Decimal

// Helper to convert Decimal to number
const toNumber = (val: Decimal | number | null | undefined): number => {
  if (val == null) return 0
  if (typeof val === 'number') return val
  return Number(val)
}

export type AccountBalance = {
  systemId: string
  id: string
  name: string
  branchSystemId: string | null
  initialBalance: number
  totalReceipts: number
  totalPayments: number
  currentBalance: number
  minBalance: number | null
  maxBalance: number | null
  isLowBalance: boolean
  isHighBalance: boolean
  isActive: boolean
  isDefault: boolean
}

export const GET = apiHandler(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const accountSystemId = searchParams.get('accountSystemId')
    const branchId = searchParams.get('branchId')

    // Build where clause for accounts
    const accountWhere: Prisma.CashAccountWhereInput = {}
    if (accountSystemId) accountWhere.systemId = accountSystemId
    if (branchId) accountWhere.branchSystemId = branchId

    // Get all accounts
    const accounts = await prisma.cashAccount.findMany({
      where: accountWhere,
      select: {
        systemId: true,
        id: true,
        name: true,
        branchSystemId: true,
        initialBalance: true,
        minBalance: true,
        maxBalance: true,
        isActive: true,
        isDefault: true,
      },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    })

    const accountSystemIds = accounts.map(a => a.systemId)

    // If no accounts, return empty
    if (accountSystemIds.length === 0) {
      return apiSuccess({ data: [] })
    }

    // Batch query for receipts grouped by account
    const receiptSums = await prisma.receipt.groupBy({
      by: ['accountSystemId'],
      where: {
        status: { not: 'cancelled' },
        accountSystemId: { in: accountSystemIds },
      },
      _sum: { amount: true },
    })

    // Batch query for payments grouped by account
    const paymentSums = await prisma.payment.groupBy({
      by: ['accountSystemId'],
      where: {
        status: { not: 'cancelled' },
        accountSystemId: { in: accountSystemIds },
      },
      _sum: { amount: true },
    })

    // Build maps for quick lookup
    const receiptMap = new Map(receiptSums.map(r => [r.accountSystemId, toNumber(r._sum?.amount)]))
    const paymentMap = new Map(paymentSums.map(p => [p.accountSystemId, toNumber(p._sum?.amount)]))

    // Calculate balance for each account
    const accountBalances: AccountBalance[] = accounts.map(account => {
      const initialBalance = toNumber(account.initialBalance)
      const totalReceipts = receiptMap.get(account.systemId) || 0
      const totalPayments = paymentMap.get(account.systemId) || 0
      const currentBalance = initialBalance + totalReceipts - totalPayments

      const minBalance = account.minBalance ? toNumber(account.minBalance) : null
      const maxBalance = account.maxBalance ? toNumber(account.maxBalance) : null

      return {
        systemId: account.systemId,
        id: account.id,
        name: account.name,
        branchSystemId: account.branchSystemId,
        initialBalance,
        totalReceipts,
        totalPayments,
        currentBalance,
        minBalance,
        maxBalance,
        isLowBalance: minBalance !== null && currentBalance < minBalance,
        isHighBalance: maxBalance !== null && currentBalance > maxBalance,
        isActive: account.isActive,
        isDefault: account.isDefault,
      }
    })

    return apiSuccess({ data: accountBalances })
  } catch (error) {
    logError('Error calculating account balances', error)
    return apiError('Không thể tính số dư quỹ tiền', 500)
  }
})
