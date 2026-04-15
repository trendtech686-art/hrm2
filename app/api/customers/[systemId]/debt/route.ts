import { prisma } from '@/lib/prisma'
import { apiSuccess, apiNotFound } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

interface DebtTransaction {
  systemId: string
  voucherId: string
  originalSystemId: string
  type: 'order' | 'receipt' | 'payment' | 'sales-return' | 'complaint-payment'
  creator: string
  creatorId: string
  date: string
  createdAt: string
  description: string
  debitAmount: number // Increase debt (positive)
  creditAmount: number // Decrease debt (negative stored as positive)
  balance: number
  displayAmount?: number // For display-only amounts (refunds that don't affect debt)
}

/**
 * GET /api/customers/[systemId]/debt
 * 
 * Fetch paginated debt transactions for a customer
 * Combines orders, receipts, and payments with running balance
 */
export const GET = apiHandler(async (
  request,
  { params: rawParams }
) => {
    const params = await rawParams
    const customerSystemId = params.systemId
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const customerName = searchParams.get('customerName') || undefined

    // Get customer info
    const customer = await prisma.customer.findUnique({
      where: { systemId: customerSystemId },
      select: { systemId: true, name: true },
    })

    if (!customer) {
      return apiNotFound('Khách hàng')
    }

    // Fetch all data needed for debt calculation
    const [orders, receipts, payments, salesReturns] = await Promise.all([
      // Delivered orders (create debt)
      prisma.order.findMany({
        where: {
          customerId: customerSystemId,
          status: { not: 'CANCELLED' },
          OR: [
            { status: 'COMPLETED' },
            { status: 'DELIVERED' },
            { deliveryStatus: 'DELIVERED' },
            { stockOutStatus: 'FULLY_STOCKED_OUT' },
          ],
        },
        select: {
          systemId: true,
          id: true,
          orderDate: true,
          createdAt: true,
          grandTotal: true,
          salespersonName: true,
          salespersonId: true,
        },
        orderBy: { createdAt: 'asc' },
      }),

      // Receipts (reduce debt) - broad match: by customerSystemId or payerSystemId or (payerTypeName='Khách hàng' AND payerName=customerName)
      prisma.receipt.findMany({
        where: {
          status: { not: 'cancelled' },
          affectsDebt: true,
          OR: [
            { customerSystemId },
            { payerSystemId: customerSystemId },
            ...(customerName ? [{
              payerTypeName: 'Khách hàng',
              payerName: customerName,
            }] : []),
          ],
        },
        select: {
          systemId: true,
          id: true,
          receiptDate: true,
          createdAt: true,
          amount: true,
          description: true,
          createdBy: true,
        },
        orderBy: { createdAt: 'asc' },
      }),

      // Payments (may increase or decrease debt)
      prisma.payment.findMany({
        where: {
          status: { not: 'cancelled' },
          OR: [
            { customerSystemId },
            { recipientSystemId: customerSystemId },
            ...(customerName ? [{
              recipientTypeName: 'Khách hàng',
              recipientName: customerName,
            }] : []),
          ],
        },
        select: {
          systemId: true,
          id: true,
          paymentDate: true,
          createdAt: true,
          amount: true,
          description: true,
          createdBy: true,
          affectsDebt: true,
          linkedSalesReturnSystemId: true,
          linkedComplaintSystemId: true,
          paymentReceiptTypeName: true,
          category: true,
        },
        orderBy: { createdAt: 'asc' },
      }),

      // ✅ Sales returns (reduce debt - returned goods)
      prisma.salesReturn.findMany({
        where: {
          customerSystemId,
          isReceived: true,
          status: { not: 'REJECTED' },
        },
        select: {
          systemId: true,
          id: true,
          returnDate: true,
          createdAt: true,
          totalReturnValue: true,
          grandTotalNew: true, // Exchange value
          exchangeOrderSystemId: true, // Link to exchange order
          finalAmount: true, // Net difference
          reason: true,
          creatorName: true,
          creatorSystemId: true,
          orderBusinessId: true,
          orderSystemId: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    // ✅ Resolve employee names for receipt/payment createdBy fields
    const creatorIds = new Set<string>()
    for (const r of receipts) if (r.createdBy) creatorIds.add(r.createdBy)
    for (const p of payments) if (p.createdBy) creatorIds.add(p.createdBy)
    
    const employeeNameMap = new Map<string, string>()
    if (creatorIds.size > 0) {
      const employees = await prisma.employee.findMany({
        where: { systemId: { in: Array.from(creatorIds) } },
        select: { systemId: true, fullName: true },
      })
      for (const e of employees) {
        employeeNameMap.set(e.systemId, e.fullName)
      }
    }

    // Build all transactions
    const allTransactions: (DebtTransaction & { _sortTimestamp: number; change: number })[] = []

    // ✅ Build map of exchangeOrderSystemId → salesReturn for order descriptions
    const exchangeOrderMap = new Map<string, typeof salesReturns[0]>()
    for (const sr of salesReturns) {
      if (sr.exchangeOrderSystemId) {
        exchangeOrderMap.set(sr.exchangeOrderSystemId, sr)
      }
    }

    // Order transactions - ✅ Show ORIGINAL value, returns shown separately
    for (const order of orders) {
      const ts = order.createdAt?.getTime() || new Date(order.orderDate).getTime()
      const originalValue = Number(order.grandTotal || 0)
      
      // Check if this order is an exchange order
      const linkedReturn = exchangeOrderMap.get(order.systemId)
      let description = `Đơn hàng #${order.id}`
      if (linkedReturn) {
        description = `Đơn hàng đổi #${order.id} (từ ${linkedReturn.id})`
      }
      
      allTransactions.push({
        systemId: `order-${order.systemId}`,
        voucherId: order.id,
        originalSystemId: order.systemId,
        type: 'order',
        creator: order.salespersonName || '',
        creatorId: order.salespersonId || '',
        date: order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : '',
        createdAt: order.createdAt?.toISOString() || new Date(order.orderDate).toISOString(),
        description,
        debitAmount: originalValue,
        creditAmount: 0,
        balance: 0, // Will be calculated
        _sortTimestamp: ts,
        change: originalValue,
      })
    }

    // ✅ Sales return transactions - show as credit (reduce debt)
    for (const sr of salesReturns) {
      const ts = sr.createdAt?.getTime() || (sr.returnDate ? new Date(sr.returnDate).getTime() : Date.now())
      const returnValue = Number(sr.totalReturnValue || 0)
      const hasExchange = !!sr.exchangeOrderSystemId && Number(sr.grandTotalNew || 0) > 0
      
      // Build description
      let description = `Trả hàng từ đơn ${sr.orderBusinessId || ''}`
      if (hasExchange) {
        const exchangeValue = Number(sr.grandTotalNew || 0)
        const netDiff = exchangeValue - returnValue
        if (netDiff > 0) {
          description = `Trả ${new Intl.NumberFormat('vi-VN').format(returnValue)}đ, đổi ${new Intl.NumberFormat('vi-VN').format(exchangeValue)}đ (từ ${sr.orderBusinessId})`
        } else if (netDiff < 0) {
          description = `Trả ${new Intl.NumberFormat('vi-VN').format(returnValue)}đ, đổi ${new Intl.NumberFormat('vi-VN').format(exchangeValue)}đ - Hoàn ${new Intl.NumberFormat('vi-VN').format(Math.abs(netDiff))}đ`
        } else {
          description = `Đổi hàng từ đơn ${sr.orderBusinessId} (ngang giá)`
        }
      }
      
      allTransactions.push({
        systemId: `salesreturn-${sr.systemId}`,
        voucherId: sr.id,
        originalSystemId: sr.systemId,
        type: 'sales-return',
        creator: sr.creatorName || '',
        creatorId: sr.creatorSystemId || '',
        date: sr.returnDate ? new Date(sr.returnDate).toISOString().split('T')[0] : '',
        createdAt: sr.createdAt?.toISOString() || (sr.returnDate ? new Date(sr.returnDate).toISOString() : new Date().toISOString()),
        description,
        debitAmount: 0,
        creditAmount: returnValue,
        balance: 0,
        _sortTimestamp: ts,
        change: -returnValue, // Negative = credit (reduce debt)
      })
    }

    // Receipt transactions
    for (const receipt of receipts) {
      const ts = receipt.createdAt?.getTime() || (receipt.receiptDate ? new Date(receipt.receiptDate).getTime() : Date.now())
      const creatorName = receipt.createdBy ? (employeeNameMap.get(receipt.createdBy) || receipt.createdBy) : ''
      allTransactions.push({
        systemId: `receipt-${receipt.systemId}`,
        voucherId: receipt.id,
        originalSystemId: receipt.systemId,
        type: 'receipt',
        creator: creatorName,
        creatorId: receipt.createdBy || '',
        date: receipt.receiptDate ? new Date(receipt.receiptDate).toISOString().split('T')[0] : '',
        createdAt: receipt.createdAt?.toISOString() || (receipt.receiptDate ? new Date(receipt.receiptDate).toISOString() : new Date().toISOString()),
        description: receipt.description || 'Phiếu thu',
        debitAmount: 0,
        creditAmount: Number(receipt.amount || 0),
        balance: 0,
        _sortTimestamp: ts,
        change: -Number(receipt.amount || 0),
      })
    }

    // Payment transactions
    for (const payment of payments) {
      const ts = payment.createdAt?.getTime() || (payment.paymentDate ? new Date(payment.paymentDate).getTime() : Date.now())
      const isRefundFromReturn = !!payment.linkedSalesReturnSystemId
      const isRefundFromComplaint = !!payment.linkedComplaintSystemId && !payment.linkedSalesReturnSystemId

      let change = 0
      let debitAmount = 0
      let creditAmount = 0
      let displayAmount: number | undefined = undefined
      let type: DebtTransaction['type'] = 'payment'
      let originalSystemId = payment.systemId

      if (isRefundFromReturn) {
        // ✅ Refund from sales return - TĂNG công nợ (từ âm về 0)
        // Hàng trả làm công nợ âm (công ty nợ khách), PC hoàn làm công nợ về 0
        change = Number(payment.amount || 0) // Positive = increase debt (from negative to 0)
        debitAmount = Number(payment.amount || 0)
        creditAmount = 0
        displayAmount = -Number(payment.amount || 0) // Display as negative (money out to customer)
      } else if (isRefundFromComplaint) {
        // Complaint refund - display only, no debt effect
        change = 0
        creditAmount = Number(payment.amount || 0)
        displayAmount = -Number(payment.amount || 0) // ✅ Negative to show as refund
        type = 'complaint-payment'
      } else if (payment.affectsDebt) {
        // Phiếu chi → tăng số dư công nợ (từ âm về 0)
        change = Number(payment.amount || 0)
        debitAmount = Number(payment.amount || 0)
      }

      const paymentCreatorName = payment.createdBy ? (employeeNameMap.get(payment.createdBy) || payment.createdBy) : ''
      allTransactions.push({
        systemId: `payment-${payment.systemId}`,
        voucherId: payment.id,
        originalSystemId,
        type,
        creator: paymentCreatorName,
        creatorId: payment.createdBy || '',
        date: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : '',
        createdAt: payment.createdAt?.toISOString() || (payment.paymentDate ? new Date(payment.paymentDate).toISOString() : new Date().toISOString()),
        description: payment.description || 'Phiếu chi',
        debitAmount,
        creditAmount,
        balance: 0,
        _sortTimestamp: ts,
        change,
        displayAmount,
      })
    }

    // Sort by timestamp ascending (oldest first for balance calculation)
    allTransactions.sort((a, b) => a._sortTimestamp - b._sortTimestamp)

    // Calculate running balance (includes ALL transactions for correct debt)
    let runningDebt = 0
    for (const t of allTransactions) {
      runningDebt += t.change
      t.balance = runningDebt
    }

    // Reverse to show newest first
    allTransactions.reverse()

    // Calculate summary
    const totalDebit = allTransactions.reduce((sum, t) => sum + t.debitAmount, 0)
    const totalCredit = allTransactions.reduce((sum, t) => sum + t.creditAmount, 0)
    const currentDebt = runningDebt

    // Paginate transactions
    const total = allTransactions.length
    const totalPages = Math.ceil(total / limit)
    const skip = (page - 1) * limit
    const paginatedTransactions = allTransactions.slice(skip, skip + limit)

    // Clean up internal fields (keep change for display)
    const cleanTransactions = paginatedTransactions.map(({ _sortTimestamp, ...rest }) => rest)

    return apiSuccess({
      data: cleanTransactions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      summary: {
        currentDebt,
        totalDebit,
        totalCredit,
      },
    })
})
