/**
 * Supplier Stats API - Unified supplier profile + aggregated stats
 *
 * GET /api/suppliers/[systemId]/stats
 * 
 * Returns EVERYTHING needed about a supplier in a single API call:
 * - Full supplier profile
 * - Aggregated stats (PO counts by status)
 * - Server-side debt calculation
 * - Purchase return totals
 * 
 * ⚡ PERFORMANCE: Single API call replaces multiple calls:
 *   - /api/suppliers/[id] (useSupplier)
 *   - /api/purchase-orders?supplierId=... (PO list for debt calc)
 *   - /api/payments?supplierId=... (payments for debt calc)
 *   - /api/purchase-returns?supplierId=... (returns for debt calc)
 */

import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

export const GET = apiHandler(async (
  _request,
  { params }
) => {
  const { systemId } = params

    // First, get all PO systemIds for this supplier (to find returns via PO link)
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

    // Run all aggregations in parallel
    const [
      // Full supplier record
      supplier,
      // PO counts by status
      poTotal,
      poDraft,
      poPending,
      poConfirmed,
      poReceiving,
      poCompleted,
      poCancelled,
      // Last PO date
      lastPO,
      // === DEBT CALCULATION (server-side) ===
      // POs for calculating product cost (subtotal - discount)
      allPOsForDebt,
      // Sum of payments to this supplier
      paymentsSum,
      // Sum of receipts from supplier (refunds to us, reduces debt)
      receiptsFromSupplierSum,
      // Sum of completed/approved purchase returns
      purchaseReturnsSum,
      // Return count
      returnTotal,
      returnPending,
      // Products ordered count (unique products across all POs)
      productsOrderedCount,
      // Products returned count (unique products across all returns)
      productsReturnedCount,
      // Total quantities ordered and returned
      totalQuantityOrdered,
      totalQuantityReturned,
      // === SUPPLIER WARRANTY STATS ===
      warrantyTotal,
      warrantySent,
      warrantyConfirmed,
      warrantyCompleted,
      // Aggregate warranty item stats
      warrantyItemAggregates,
    ] = await Promise.all([
      // === FULL SUPPLIER RECORD ===
      prisma.supplier.findUnique({
        where: { systemId },
      }),

      // === PURCHASE ORDERS ===
      prisma.purchaseOrder.count({
        where: { supplierSystemId: systemId, isDeleted: false },
      }),
      prisma.purchaseOrder.count({
        where: { supplierSystemId: systemId, isDeleted: false, status: 'DRAFT' },
      }),
      prisma.purchaseOrder.count({
        where: { supplierSystemId: systemId, isDeleted: false, status: 'PENDING' },
      }),
      prisma.purchaseOrder.count({
        where: { supplierSystemId: systemId, isDeleted: false, status: 'CONFIRMED' },
      }),
      prisma.purchaseOrder.count({
        where: { supplierSystemId: systemId, isDeleted: false, status: 'RECEIVING' },
      }),
      prisma.purchaseOrder.count({
        where: { supplierSystemId: systemId, isDeleted: false, status: 'COMPLETED' },
      }),
      prisma.purchaseOrder.count({
        where: { supplierSystemId: systemId, isDeleted: false, status: 'CANCELLED' },
      }),
      // Last PO date
      prisma.purchaseOrder.findFirst({
        where: { supplierSystemId: systemId, isDeleted: false },
        orderBy: { orderDate: 'desc' },
        select: { orderDate: true },
      }),

      // === DEBT: Get received POs to calculate product cost (subtotal - discount), not grandTotal ===
      // grandTotal includes shipping and other fees which should be separate expenses
      prisma.purchaseOrder.findMany({
        where: {
          OR: [
            { supplierSystemId: systemId },
            { supplierId: systemId },
          ],
          isDeleted: false,
          status: { not: 'CANCELLED' },
          deliveryStatus: 'Đã nhập', // Only count as debt when goods received
        },
        select: {
          subtotal: true,
          discount: true,
          discountType: true,
        },
      }),

      // === DEBT: Payments to this supplier (reduces debt) ===
      prisma.payment.aggregate({
        where: {
          status: { not: 'cancelled' },
          OR: [
            { supplierId: systemId },
            { recipientSystemId: systemId },
          ],
        },
        _sum: { amount: true },
      }),

      // === DEBT: Receipts from supplier (refunds to us, reduces debt) ===
      prisma.receipt.aggregate({
        where: {
          payerSystemId: systemId, // Supplier is paying us (refund)
          status: { not: 'cancelled' },
        },
        _sum: { amount: true },
      }),

      // === DEBT: Purchase returns (reduces debt) ===
      // Query by supplierSystemId, supplierId, suppliers relation, OR via linked PO
      // Include PENDING, APPROVED, COMPLETED returns (all non-cancelled returns reduce debt)
      prisma.purchaseReturn.aggregate({
        where: {
          OR: [
            { supplierSystemId: systemId },
            { supplierId: systemId },
            { suppliers: { systemId: systemId } }, // Via relation
            ...(poSystemIds.length > 0 ? [{ purchaseOrderSystemId: { in: poSystemIds } }] : []),
          ],
          status: { not: 'CANCELLED' }, // Include DRAFT returns
        },
        _sum: { totalReturnValue: true },
      }),

      // === PURCHASE RETURNS ===
      prisma.purchaseReturn.count({
        where: { 
          OR: [
            { supplierSystemId: systemId },
            { supplierId: systemId },
            { suppliers: { systemId: systemId } }, // Via relation
            ...(poSystemIds.length > 0 ? [{ purchaseOrderSystemId: { in: poSystemIds } }] : []),
          ],
        },
      }),
      prisma.purchaseReturn.count({
        where: {
          OR: [
            { supplierSystemId: systemId },
            { supplierId: systemId },
            { suppliers: { systemId: systemId } }, // Via relation
            ...(poSystemIds.length > 0 ? [{ purchaseOrderSystemId: { in: poSystemIds } }] : []),
          ],
          status: 'PENDING',
        },
      }),

      // === PRODUCTS ORDERED (unique products across all POs) ===
      prisma.purchaseOrderItem.findMany({
        where: {
          purchaseOrder: {
            supplierSystemId: systemId,
            isDeleted: false,
            status: { notIn: ['CANCELLED'] },
          },
        },
        select: { productId: true },
        distinct: ['productId'],
      }),

      // === PRODUCTS RETURNED (unique products across all returns) ===
      prisma.purchaseReturnItem.findMany({
        where: {
          purchaseReturn: {
            OR: [
              { supplierSystemId: systemId },
              { supplierId: systemId },
              { suppliers: { systemId: systemId } },
              ...(poSystemIds.length > 0 ? [{ purchaseOrderSystemId: { in: poSystemIds } }] : []),
            ],
            status: { not: 'CANCELLED' }, // Include DRAFT
          },
        },
        select: { productId: true },
        distinct: ['productId'],
      }),

      // === TOTAL QUANTITY ORDERED (sum of all quantities across all PO items) ===
      prisma.purchaseOrderItem.aggregate({
        where: {
          purchaseOrder: {
            supplierSystemId: systemId,
            isDeleted: false,
            status: { notIn: ['CANCELLED'] },
          },
        },
        _sum: { quantity: true },
      }),

      // === TOTAL QUANTITY RETURNED (sum of all quantities across all return items) ===
      prisma.purchaseReturnItem.aggregate({
        where: {
          purchaseReturn: {
            OR: [
              { supplierSystemId: systemId },
              { supplierId: systemId },
              { suppliers: { systemId: systemId } },
              ...(poSystemIds.length > 0 ? [{ purchaseOrderSystemId: { in: poSystemIds } }] : []),
            ],
            status: { not: 'CANCELLED' }, // Include DRAFT
          },
        },
        _sum: { quantity: true },
      }),

      // === SUPPLIER WARRANTY: Total ===
      prisma.supplierWarranty.count({
        where: { supplierSystemId: systemId, isDeleted: false },
      }),
      // === SUPPLIER WARRANTY: Đã gửi (chưa trả) ===
      prisma.supplierWarranty.count({
        where: { supplierSystemId: systemId, isDeleted: false, status: 'SENT' },
      }),
      // === SUPPLIER WARRANTY: Đã xác nhận ===
      prisma.supplierWarranty.count({
        where: { supplierSystemId: systemId, isDeleted: false, status: 'CONFIRMED' },
      }),
      // === SUPPLIER WARRANTY: Hoàn thành (đã trả) ===
      prisma.supplierWarranty.count({
        where: { supplierSystemId: systemId, isDeleted: false, status: 'COMPLETED' },
      }),
      // === SUPPLIER WARRANTY: Aggregate item stats ===
      prisma.supplierWarrantyItem.aggregate({
        where: {
          warranty: { supplierSystemId: systemId, isDeleted: false, status: { not: 'CANCELLED' } },
        },
        _sum: { sentQuantity: true, approvedQuantity: true, returnedQuantity: true, warrantyCost: true },
      }),
    ])

    if (!supplier) {
      return apiError('Nhà cung cấp không tồn tại', 404)
    }

    // Calculate debt balance
    // Debt = Product cost only (subtotal - discount), NOT including shipping/other fees
    // Shipping and other fees should be recorded as separate expenses
    const totalPurchases = allPOsForDebt.reduce((sum, po) => {
      const subtotal = Number(po.subtotal ?? 0)
      const discount = Number(po.discount ?? 0)
      const discountValue = po.discountType === 'percentage'
        ? (subtotal * discount / 100)
        : discount
      return sum + (subtotal - discountValue)
    }, 0)
    const totalPayments = Number(paymentsSum?._sum?.amount ?? 0)
    const totalReceipts = Number(receiptsFromSupplierSum?._sum?.amount ?? 0)
    const totalReturns = Number(purchaseReturnsSum?._sum?.totalReturnValue ?? 0)
    // Công nợ = Đơn mua(+) + Phiếu thu(+) - Phiếu chi(-) - Trả hàng(-)
    const debtBalance = totalPurchases + totalReceipts - totalPayments - totalReturns

    return apiSuccess({
      // Full supplier profile
      supplier: {
        ...supplier,
        // Convert Decimal fields to numbers for JSON
        totalPurchased: Number(supplier.totalPurchased ?? 0),
        totalDebt: Number(supplier.totalDebt ?? 0),
        currentDebt: supplier.currentDebt ? Number(supplier.currentDebt) : null,
        createdAt: supplier.createdAt?.toISOString() ?? null,
        updatedAt: supplier.updatedAt?.toISOString() ?? null,
        deletedAt: supplier.deletedAt?.toISOString() ?? null,
      },
      purchaseOrders: {
        total: poTotal,
        // Raw status counts
        draft: poDraft,
        pending: poPending,
        confirmed: poConfirmed,
        receiving: poReceiving,
        completed: poCompleted,
        cancelled: poCancelled,
        // Vietnamese-friendly groupings for display
        // "Đặt hàng" = DRAFT + PENDING (chờ xử lý)
        ordered: poDraft + poPending,
        // "Đang giao dịch" = CONFIRMED + RECEIVING (đang xử lý)
        inProgress: poConfirmed + poReceiving,
        lastOrderDate: lastPO?.orderDate?.toISOString() ?? null,
      },
      purchaseReturns: {
        total: returnTotal,
        pending: returnPending,
      },
      products: {
        // Unique products ordered from this supplier
        orderedCount: productsOrderedCount.length,
        // Unique products returned to this supplier
        returnedCount: productsReturnedCount.length,
        // Total quantities
        totalQuantityOrdered: Number(totalQuantityOrdered?._sum?.quantity ?? 0),
        totalQuantityReturned: Number(totalQuantityReturned?._sum?.quantity ?? 0),
      },
      financial: {
        totalPurchases,
        totalPayments,
        totalReturns,
        // Server-calculated debt balance
        debtBalance,
      },
      warranties: {
        total: warrantyTotal,
        sent: warrantySent,           // Đang gửi BH (chưa trả)
        confirmed: warrantyConfirmed,  // Đã xác nhận
        completed: warrantyCompleted,  // Hoàn thành (đã trả)
        totalSentQty: Number(warrantyItemAggregates._sum.sentQuantity ?? 0),
        totalWarrantyProductQty: Number(warrantyItemAggregates._sum.approvedQuantity ?? 0),
        totalWarrantyDeduction: Number(warrantyItemAggregates._sum.warrantyCost ?? 0),
        totalNonWarrantyQty: Number(warrantyItemAggregates._sum.returnedQuantity ?? 0),
      },
    })
})
