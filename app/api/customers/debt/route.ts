import { prisma } from '@/lib/prisma'
import { apiSuccess, serializeDecimals } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

export const dynamic = 'force-dynamic'

/**
 * GET /api/customers/debt
 * 
 * Server-side computation of customer debt.
 * Replaces client-side useCustomersWithComputedDebt() which loaded ALL orders + ALL receipts + ALL payments.
 * 
 * Returns: Map<customerSystemId, { currentDebt, debtTransactions }>
 * 
 * Business rules (same as use-computed-debt.ts):
 * - Orders creating debt: status != CANCELLED AND (COMPLETED OR DELIVERED OR FULLY_STOCKED_OUT) → +grandTotal
 * - Receipts reducing debt: status != 'cancelled' AND affectsDebt = true, matched by customerSystemId/payerSystemId/payerName → -amount
 * - Payments: status != 'cancelled' AND affectsDebt = true AND NOT linked to sales return → +/- amount
 * - Payment refund types (Hoàn tiền khách hàng / complaint_refund) → -amount (reduce debt)
 * - Other payments → +amount (increase debt)
 */
export const GET = apiHandler(async (request) => {
    // 1. Load all active customers with paymentTerms
    const customers = await prisma.customer.findMany({
      where: { isDeleted: false },
      select: {
        systemId: true,
        name: true,
        paymentTerms: true,
      },
    })

    // Build customer lookup maps
    const customerBySystemId = new Map(customers.map(c => [c.systemId, c]))
    const customerNameToIds = new Map<string, string[]>()
    for (const c of customers) {
      const existing = customerNameToIds.get(c.name) || []
      existing.push(c.systemId)
      customerNameToIds.set(c.name, existing)
    }

    // 2. Load debt-creating orders (not cancelled, and completed/delivered/stocked-out)
    const orders = await prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
        OR: [
          { status: 'COMPLETED' },
          { deliveryStatus: 'DELIVERED' },
          { stockOutStatus: 'FULLY_STOCKED_OUT' },
        ],
        customerId: { not: null },
      },
      select: {
        systemId: true,
        id: true,
        customerId: true,
        orderDate: true,
        grandTotal: true,
        createdAt: true,
      },
    })

    // 3. Load receipts that affect debt
    const receipts = await prisma.receipt.findMany({
      where: {
        status: { not: 'cancelled' },
        affectsDebt: true,
      },
      select: {
        systemId: true,
        id: true,
        customerSystemId: true,
        payerSystemId: true,
        payerTypeName: true,
        payerName: true,
        amount: true,
        receiptDate: true,
        description: true,
        createdAt: true,
      },
    })

    // 4. Load payments that affect debt (excluding sales return refunds)
    const payments = await prisma.payment.findMany({
      where: {
        status: { not: 'cancelled' },
        affectsDebt: true,
        linkedSalesReturnSystemId: null,
      },
      select: {
        systemId: true,
        id: true,
        customerSystemId: true,
        recipientSystemId: true,
        recipientTypeName: true,
        recipientName: true,
        amount: true,
        paymentDate: true,
        paymentReceiptTypeName: true,
        category: true,
        description: true,
        createdAt: true,
      },
    })

    // 5. Application-level grouping by customer
    // Initialize result map
    type TransactionEntry = {
      _type: 'order' | 'receipt' | 'payment';
      _change: number;
      _createdAt: Date;
      // Order-specific fields for DebtTransaction
      systemId: string;
      orderId: string;
      orderDate: string;
      amount: number;
      dueDate: string;
      notes: string;
    }

    const customerTransactions = new Map<string, TransactionEntry[]>()

    function ensureList(customerId: string): TransactionEntry[] {
      let list = customerTransactions.get(customerId)
      if (!list) {
        list = []
        customerTransactions.set(customerId, list)
      }
      return list
    }

    function parsePaymentTermDays(paymentTerms?: string | null): number {
      if (!paymentTerms) return 0
      const match = paymentTerms.match(/NET(\d+)/i)
      if (match) return parseInt(match[1], 10)
      if (paymentTerms.toUpperCase() === 'COD') return 0
      return 30
    }

    // Group orders by customer
    for (const order of orders) {
      if (!order.customerId) continue
      const customer = customerBySystemId.get(order.customerId)
      if (!customer) continue

      const grandTotal = Number(order.grandTotal)
      const orderDate = order.orderDate
      const paymentTermDays = parsePaymentTermDays(customer.paymentTerms)
      const dueDate = new Date(orderDate)
      dueDate.setDate(dueDate.getDate() + paymentTermDays)

      const list = ensureList(order.customerId)
      list.push({
        _type: 'order',
        _change: grandTotal,
        _createdAt: order.createdAt || order.orderDate,
        systemId: `debt-order-${order.systemId}`,
        orderId: order.id,
        orderDate: orderDate.toISOString().split('T')[0],
        amount: grandTotal,
        dueDate: dueDate.toISOString().split('T')[0],
        notes: `Đơn hàng #${order.id}`,
      })
    }

    // Group receipts by customer (with fuzzy name matching)
    for (const receipt of receipts) {
      const matchedCustomerIds = new Set<string>()

      if (receipt.customerSystemId && customerBySystemId.has(receipt.customerSystemId)) {
        matchedCustomerIds.add(receipt.customerSystemId)
      }
      if (receipt.payerSystemId && customerBySystemId.has(receipt.payerSystemId)) {
        matchedCustomerIds.add(receipt.payerSystemId)
      }
      // Name-based matching
      if (receipt.payerTypeName === 'Khách hàng' && receipt.payerName) {
        const ids = customerNameToIds.get(receipt.payerName)
        if (ids) ids.forEach(id => matchedCustomerIds.add(id))
      }

      const amount = Number(receipt.amount)
      for (const customerId of matchedCustomerIds) {
        const list = ensureList(customerId)
        list.push({
          _type: 'receipt',
          _change: -amount,
          _createdAt: receipt.createdAt || receipt.receiptDate,
          systemId: `debt-receipt-${receipt.systemId}`,
          orderId: receipt.id,
          orderDate: receipt.receiptDate.toISOString().split('T')[0],
          amount,
          dueDate: receipt.receiptDate.toISOString().split('T')[0],
          notes: receipt.description || `Phiếu thu #${receipt.id}`,
        })
      }
    }

    // Group payments by customer (with fuzzy name matching)
    for (const payment of payments) {
      const matchedCustomerIds = new Set<string>()

      if (payment.customerSystemId && customerBySystemId.has(payment.customerSystemId)) {
        matchedCustomerIds.add(payment.customerSystemId)
      }
      if (payment.recipientSystemId && customerBySystemId.has(payment.recipientSystemId)) {
        matchedCustomerIds.add(payment.recipientSystemId)
      }
      // Name-based matching
      if (payment.recipientTypeName === 'Khách hàng' && payment.recipientName) {
        const ids = customerNameToIds.get(payment.recipientName)
        if (ids) ids.forEach(id => matchedCustomerIds.add(id))
      }

      const amount = Number(payment.amount)
      // Tất cả phiếu chi đều tăng công nợ (trả tiền cho khách → từ âm về 0)
      const changeAmount = amount

      for (const customerId of matchedCustomerIds) {
        const list = ensureList(customerId)
        list.push({
          _type: 'payment',
          _change: changeAmount,
          _createdAt: payment.createdAt || payment.paymentDate,
          systemId: `debt-payment-${payment.systemId}`,
          orderId: payment.id,
          orderDate: payment.paymentDate.toISOString().split('T')[0],
          amount,
          dueDate: payment.paymentDate.toISOString().split('T')[0],
          notes: payment.description || `Phiếu chi #${payment.id}`,
        })
      }
    }

    // 6. Compute final debt per customer
    const result: Record<string, {
      currentDebt: number;
      debtTransactions: Array<{
        systemId: string;
        orderId: string;
        orderDate: string;
        amount: number;
        dueDate: string;
        isPaid: boolean;
        remainingAmount: number;
        notes: string;
      }>;
    }> = {}

    for (const [customerId, transactions] of customerTransactions) {
      // Sort by createdAt
      transactions.sort((a, b) => new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime())

      // Calculate running balance
      let runningDebt = 0
      for (const t of transactions) {
        runningDebt += t._change
      }
      const currentDebt = Math.max(0, runningDebt)

      // Extract order transactions as DebtTransaction (matching client-side format)
      const orderTransactions = transactions
        .filter(t => t._type === 'order')
        .map(t => ({
          systemId: t.systemId,
          orderId: t.orderId,
          orderDate: t.orderDate,
          amount: t.amount,
          dueDate: t.dueDate,
          isPaid: currentDebt === 0,
          remainingAmount: currentDebt === 0 ? 0 : t.amount,
          notes: t.notes,
        }))

      // Only include customers that have transactions
      if (transactions.length > 0) {
        result[customerId] = {
          currentDebt,
          debtTransactions: orderTransactions,
        }
      }
    }

    return apiSuccess(serializeDecimals(result))
})
