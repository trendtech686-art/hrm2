/**
 * Customer Debt API - Server-side calculation of customer debt
 * 
 * GET /api/customer-debt - Get debt for all customers (with pagination)
 * GET /api/customer-debt?customerSystemId=xxx - Get debt for a specific customer
 * 
 * Debt calculation:
 * - Delivered orders (increases debt)
 * - Receipts with affectsDebt=true (decreases debt)
 * - Payments with affectsDebt=true, excluding sales return refunds (can increase/decrease)
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
    const customerSystemId = searchParams.get('customerSystemId')
    const { page, limit, skip } = parsePagination(searchParams)

    // If specific customer requested
    if (customerSystemId) {
      const debt = await calculateCustomerDebt(customerSystemId)
      return apiSuccess({ debt })
    }

    // Get all customers with pagination
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: { isDeleted: false },
        select: { systemId: true, name: true, phone: true, email: true, paymentTerms: true },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.customer.count({ where: { isDeleted: false } }),
    ])

    // Calculate debt for each customer in batch
    const customerSystemIds = customers.map(c => c.systemId)
    const debts = await calculateBatchCustomerDebts(customerSystemIds)

    // Combine customer data with debt
    const customersWithDebt = customers.map(c => ({
      ...c,
      currentDebt: debts.get(c.systemId) || 0,
    }))

    return apiSuccess({
      data: customersWithDebt,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error calculating customer debt:', error)
    return apiError('Failed to calculate customer debt', 500)
  }
}

/**
 * Calculate debt for a single customer
 */
async function calculateCustomerDebt(customerSystemId: string): Promise<number> {
  // Order conditions that create debt
  // Using enum values: COMPLETED, DELIVERED, FULLY_STOCKED_OUT
  const orderWhere: Prisma.OrderWhereInput = {
    customerId: customerSystemId,
    status: { not: 'CANCELLED' },
    OR: [
      { status: 'COMPLETED' },
      { deliveryStatus: 'DELIVERED' },
      { stockOutStatus: 'FULLY_STOCKED_OUT' },
    ],
  }

  // Receipt conditions that reduce debt
  const receiptWhere: Prisma.ReceiptWhereInput = {
    status: { not: 'cancelled' },
    affectsDebt: true,
    OR: [
      { customerSystemId },
      { payerSystemId: customerSystemId },
    ],
  }

  // Payment conditions (excluding sales return refunds)
  const paymentWhere: Prisma.PaymentWhereInput = {
    status: { not: 'cancelled' },
    affectsDebt: true,
    linkedSalesReturnSystemId: null, // Exclude sales return refunds
    OR: [
      { customerSystemId },
      { recipientSystemId: customerSystemId },
    ],
  }

  const [orderSum, receiptSum, paymentSum] = await Promise.all([
    prisma.order.aggregate({
      where: orderWhere,
      _sum: { grandTotal: true },
    }),
    prisma.receipt.aggregate({
      where: receiptWhere,
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: paymentWhere,
      _sum: { amount: true },
    }),
  ])

  const totalOrders = toNumber(orderSum._sum.grandTotal)
  const totalReceipts = toNumber(receiptSum._sum.amount)
  const totalPayments = toNumber(paymentSum._sum.amount)

  // Debt = Orders - Receipts - Payments (refunds to customer reduce debt)
  // Note: For normal payments (vendor payments), this increases debt, but those shouldn't match customerSystemId
  const debt = totalOrders - totalReceipts - totalPayments

  return Math.max(0, debt)
}

/**
 * Calculate debt for multiple customers in batch (optimized)
 */
async function calculateBatchCustomerDebts(customerSystemIds: string[]): Promise<Map<string, number>> {
  if (customerSystemIds.length === 0) {
    return new Map()
  }

  // Batch query for orders grouped by customer
  const orderSums = await prisma.order.groupBy({
    by: ['customerId'],
    where: {
      customerId: { in: customerSystemIds },
      status: { not: 'CANCELLED' },
      OR: [
        { status: 'COMPLETED' },
        { deliveryStatus: 'DELIVERED' },
        { stockOutStatus: 'FULLY_STOCKED_OUT' },
      ],
    },
    _sum: { grandTotal: true },
  })

  // Batch query for receipts grouped by customer
  const receiptSums = await prisma.receipt.groupBy({
    by: ['customerSystemId'],
    where: {
      status: { not: 'cancelled' },
      affectsDebt: true,
      customerSystemId: { in: customerSystemIds },
    },
    _sum: { amount: true },
  })

  // Batch query for payments grouped by customer
  const paymentSums = await prisma.payment.groupBy({
    by: ['customerSystemId'],
    where: {
      status: { not: 'cancelled' },
      affectsDebt: true,
      linkedSalesReturnSystemId: null,
      customerSystemId: { in: customerSystemIds },
    },
    _sum: { amount: true },
  })

  // Build maps for quick lookup
  const orderMap = new Map(orderSums.map(o => [o.customerId, toNumber(o._sum?.grandTotal)]))
  const receiptMap = new Map(receiptSums.map(r => [r.customerSystemId, toNumber(r._sum?.amount)]))
  const paymentMap = new Map(paymentSums.map(p => [p.customerSystemId, toNumber(p._sum?.amount)]))

  // Calculate debt for each customer
  const debtMap = new Map<string, number>()
  for (const systemId of customerSystemIds) {
    const orders = orderMap.get(systemId) || 0
    const receipts = receiptMap.get(systemId) || 0
    const payments = paymentMap.get(systemId) || 0
    const debt = Math.max(0, orders - receipts - payments)
    debtMap.set(systemId, debt)
  }

  return debtMap
}
