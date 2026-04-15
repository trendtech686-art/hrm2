import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiError, parsePagination, apiPaginated } from '@/lib/api-utils'

interface DebtTransaction {
  systemId: string;
  documentId: string;
  type: 'po' | 'payment' | 'receipt' | 'return';
  creator: string;
  date: string;
  createdAt: string;
  description: string;
  change: number;
  balance: number;
}

/**
 * GET /api/suppliers/[systemId]/debt-transactions
 * 
 * Returns paginated debt transactions for a supplier with server-calculated running balance.
 * Transactions are sorted by date DESC (newest first).
 * 
 * Running balance is calculated starting from supplier's currentDebt going backwards.
 */
export const GET = apiHandler(async (
  request,
  { params }
) => {
  const { systemId } = params
  const { searchParams } = new URL(request.url)
  const { page, limit, skip } = parsePagination(searchParams)
  const search = searchParams.get('search') || ''

    // Fetch supplier to get currentDebt
    const supplier = await prisma.supplier.findUnique({
      where: { systemId },
      select: { systemId: true, currentDebt: true },
    })

    if (!supplier) {
      return apiError('Supplier not found', 404)
    }

    // First get PO systemIds for this supplier to query returns via PO link (matching stats API)
    const supplierPOs = await prisma.purchaseOrder.findMany({
      where: { 
        OR: [
          { supplierSystemId: systemId },
          { supplierId: systemId },
        ],
        isDeleted: false,
      },
      select: { systemId: true },
    });
    const poSystemIds = supplierPOs.map(po => po.systemId);

    // Fetch all transaction types in parallel - include createdAt for proper chronological sorting
    // Use supplierId (relation field) for consistent querying with purchase-orders API
    // Only include POs that have been received (deliveryStatus = 'Đã nhập')
    const [purchaseOrders, payments, receipts, purchaseReturns] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where: { 
          supplierId: systemId,
          isDeleted: false,
          status: { not: 'CANCELLED' },
          deliveryStatus: 'Đã nhập', // Only show in debt when goods received
        },
        select: {
          systemId: true,
          id: true,
          buyer: true,
          orderDate: true,
          // Get fields to calculate product cost (not grandTotal which includes fees)
          subtotal: true,
          discount: true,
          discountType: true,
          createdAt: true,
        },
        orderBy: { orderDate: 'desc' },
      }),
      prisma.payment.findMany({
        where: { 
          OR: [
            { supplierId: systemId },
            { recipientSystemId: systemId },
          ],
          status: { not: 'cancelled' },
        },
        select: {
          systemId: true,
          id: true,
          createdBy: true,
          paymentDate: true,
          amount: true,
          description: true,
          purchaseOrderBusinessId: true,
          createdAt: true,
        },
        orderBy: { paymentDate: 'desc' },
      }),
      prisma.receipt.findMany({
        where: { 
          payerSystemId: systemId,
          status: { not: 'cancelled' },
        },
        select: {
          systemId: true,
          id: true,
          createdBy: true,
          receiptDate: true,
          amount: true,
          description: true,
          createdAt: true,
        },
        orderBy: { receiptDate: 'desc' },
      }),
      prisma.purchaseReturn.findMany({
        where: { 
          OR: [
            { supplierSystemId: systemId },
            { supplierId: systemId },
            { suppliers: { systemId: systemId } }, // Via relation
            ...(poSystemIds.length > 0 ? [{ purchaseOrderSystemId: { in: poSystemIds } }] : []),
          ],
          status: { not: 'CANCELLED' }, // Include DRAFT returns
        },
        select: {
          systemId: true,
          id: true,
          creatorName: true,
          returnDate: true,
          totalReturnValue: true,
          purchaseOrderId: true,
          createdAt: true,
        },
        orderBy: { returnDate: 'desc' },
      }),
    ])

    // Resolve employee names for payments and receipts
    // createdBy can store Employee systemId OR User systemId — resolve both
    const creatorIds = [
      ...payments.filter(p => p.createdBy).map(p => p.createdBy!),
      ...receipts.filter(r => r.createdBy).map(r => r.createdBy!),
    ]
    const uniqueCreatorIds = [...new Set(creatorIds)]
    
    let employeeNameMap = new Map<string, string>()
    if (uniqueCreatorIds.length > 0) {
      // Try Employee lookup first
      const employees = await prisma.employee.findMany({
        where: { systemId: { in: uniqueCreatorIds } },
        select: { systemId: true, fullName: true },
      })
      employeeNameMap = new Map(employees.map(e => [e.systemId, e.fullName]))
      
      // For unresolved IDs, try User → Employee lookup
      const unresolvedIds = uniqueCreatorIds.filter(id => !employeeNameMap.has(id))
      if (unresolvedIds.length > 0) {
        const users = await prisma.user.findMany({
          where: { systemId: { in: unresolvedIds } },
          select: { systemId: true, employee: { select: { fullName: true } } },
        })
        for (const u of users) {
          if (u.employee?.fullName) {
            employeeNameMap.set(u.systemId, u.employee.fullName)
          }
        }
      }
    }

    // Combine all transactions
    const allTransactions: Omit<DebtTransaction, 'balance'>[] = [
      ...purchaseOrders.map(po => {
        // Calculate product cost only (subtotal - discount), not including shipping/other fees
        const subtotal = Number(po.subtotal ?? 0)
        const discount = Number(po.discount ?? 0)
        const discountValue = po.discountType === 'percentage'
          ? (subtotal * discount / 100)
          : discount
        const productCost = subtotal - discountValue
        
        return {
          systemId: `po-${po.systemId}`,
          documentId: po.id,
          type: 'po' as const,
          creator: po.buyer || '-',
          date: po.orderDate?.toISOString() || '',
          createdAt: po.createdAt?.toISOString() || '',
          description: `Đơn mua hàng #${po.id}`,
          change: productCost,
        }
      }),
      ...payments.map(payment => ({
        systemId: `payment-${payment.systemId}`,
        documentId: payment.id,
        type: 'payment' as const,
        creator: payment.createdBy ? (employeeNameMap.get(payment.createdBy) || payment.createdBy) : '-',
        date: payment.paymentDate?.toISOString() || '',
        createdAt: payment.createdAt?.toISOString() || '',
        description: payment.description || `Thanh toán cho đơn nhập hàng ${payment.purchaseOrderBusinessId || ''}`,
        change: -(Number(payment.amount) || 0), // Phiếu chi = - (trả tiền NCC, giảm nợ)
      })),
      // Phiếu thu = + (tăng công nợ)
      ...receipts.map(receipt => ({
        systemId: `receipt-${receipt.systemId}`,
        documentId: receipt.id,
        type: 'receipt' as const,
        creator: receipt.createdBy ? (employeeNameMap.get(receipt.createdBy) || receipt.createdBy) : '-',
        date: receipt.receiptDate?.toISOString() || '',
        createdAt: receipt.createdAt?.toISOString() || '',
        description: receipt.description || `Nhận tiền từ nhà cung cấp`,
        change: Number(receipt.amount) || 0, // Phiếu thu = + (tăng nợ)
      })),
      ...purchaseReturns.map(pr => ({
        systemId: `return-${pr.systemId}`,
        documentId: pr.id,
        type: 'return' as const,
        creator: pr.creatorName || '-',
        date: pr.returnDate?.toISOString() || '',
        createdAt: pr.createdAt?.toISOString() || '',
        description: `Hoàn trả hàng cho đơn ${pr.purchaseOrderId}`,
        change: -(Number(pr.totalReturnValue) || 0),
      })),
    ]

    // Sort by createdAt ASC (oldest first) for correct balance calculation
    // createdAt is precise timestamp while date might only be the day
    allTransactions.sort((a, b) => {
      const createdAtA = new Date(a.createdAt || a.date || 0).getTime()
      const createdAtB = new Date(b.createdAt || b.date || 0).getTime()
      return createdAtA - createdAtB
    })

    // Apply search filter if provided
    const filteredTransactions = search
      ? allTransactions.filter(t => 
          t.documentId.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
        )
      : allTransactions

    const total = filteredTransactions.length

    // Calculate running balance from 0, going forward through transactions (oldest first)
    // This is the correct accounting calculation - doesn't depend on potentially stale currentDebt
    let runningBalance = 0
    
    const transactionsWithBalance: DebtTransaction[] = filteredTransactions.map(t => {
      runningBalance += t.change // Apply change to get balance AFTER this transaction
      return { ...t, balance: runningBalance }
    })
    
    // Reverse to show newest first (DESC order for display)
    transactionsWithBalance.reverse()

    // Apply pagination
    const paginatedTransactions = transactionsWithBalance.slice(skip, skip + limit)

    return apiPaginated(paginatedTransactions, { page, limit, total })
})
