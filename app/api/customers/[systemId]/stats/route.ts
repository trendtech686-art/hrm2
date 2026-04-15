/**
 * Customer Stats API - Unified customer profile + aggregated stats
 *
 * GET /api/customers/[systemId]/stats
 * 
 * Returns EVERYTHING needed about a customer in a single API call:
 * - Full customer profile (replaces separate /api/customers/[id] call)
 * - Customer group name resolved server-side (replaces useCustomerGroups settings call)
 * - Aggregated stats (order counts, warranty/complaint counts)
 * - Server-side debt calculation
 * 
 * ⚡ PERFORMANCE: Single API call replaces 3 separate calls:
 *   - /api/customers/[id] (useCustomer)
 *   - /api/settings/customers/groups (useCustomerGroups) 
 *   - Order/receipt/payment fetchAllPages for debt calc
 */

import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

export const dynamic = 'force-dynamic'

export const GET = apiHandler(async (
  _request,
  { params: rawParams }
) => {
    const { systemId } = await rawParams

    // Fetch customer + their order IDs/codes in parallel (needed for warranty/complaint fallback matching)
    const [customer, customerOrders] = await Promise.all([
      prisma.customer.findUnique({ where: { systemId } }),
      prisma.order.findMany({
        where: { customerId: systemId },
        select: { systemId: true, id: true },
      }),
    ])
    const customerOrderSystemIds = customerOrders.map(o => o.systemId)
    const customerOrderCodes = customerOrders.map(o => o.id)

    // Build warranty filter: match by customerId OR by phone when customerId is null/empty
    // Note: Some records may have customerId: '' (empty string) instead of null
    const noCustomerLinked = (extra: Record<string, unknown>) => [
      { customerId: null, ...extra },
      { customerId: '', ...extra },
    ]
    const warrantyWhere: { isDeleted: false; OR: Array<Record<string, unknown>> } = {
      isDeleted: false,
      OR: [
        { customerId: systemId },
        ...(customer?.phone ? noCustomerLinked({ customerPhone: customer.phone }) : []),
      ],
    }

    // Build complaint filter: match by customerId, phone fallback, orderId fallback, OR orderCode fallback
    const complaintOrConditions: Array<Record<string, unknown>> = [
      { customerId: systemId },
      ...(customer?.phone ? noCustomerLinked({ customerPhone: customer.phone }) : []),
      ...(customerOrderSystemIds.length > 0 ? noCustomerLinked({ orderId: { in: customerOrderSystemIds } }) : []),
      ...(customerOrderCodes.length > 0 ? noCustomerLinked({ orderCode: { in: customerOrderCodes } }) : []),
    ]
    const complaintWhere: { isDeleted: false; OR: Array<Record<string, unknown>> } = {
      isDeleted: false,
      OR: complaintOrConditions,
    }

    // Run all aggregations in parallel
    const [
      // Order counts by status
      orderTotal,
      orderPending,
      orderCompleted,
      orderCancelled,
      // Last order date
      lastOrder,
      // Warranty counts
      warrantyTotal,
      warrantyActive,
      // Complaint counts
      complaintTotal,
      complaintActive,
      // === DEBT CALCULATION (server-side) ===
      // Sum of grandTotal from "delivered" orders (creates debt)
      deliveredOrdersSum,
      // Sum of receipt amounts that affect debt (reduces debt)
      debtReceiptSum,
      // Payments that affect debt (will be processed to separate refunds vs regular)
      debtPaymentRegularSum,
      // === TOTAL SPENT CALCULATION ===
      // Sum of return values to subtract from order totals
      salesReturnSum,
      salesReturnSumForDebt,
      // Sum of refunds from sales returns (increase debt from negative to 0)
      salesReturnRefundsSum,
    ] = await Promise.all([
      // === ORDERS ===
      prisma.order.count({
        where: { customerId: systemId },
      }),
      prisma.order.count({
        where: { customerId: systemId, status: 'PENDING' },
      }),
      prisma.order.count({
        where: { customerId: systemId, status: 'COMPLETED' },
      }),
      prisma.order.count({
        where: { customerId: systemId, status: 'CANCELLED' },
      }),
      // Last order date (most recent orderDate)
      prisma.order.findFirst({
        where: { customerId: systemId },
        orderBy: { orderDate: 'desc' },
        select: { orderDate: true },
      }),

      // === WARRANTIES (match by customerId or phone fallback) ===
      prisma.warranty.count({
        where: warrantyWhere,
      }),
      // "Đang xử lý" = all statuses except RETURNED and CANCELLED
      // COMPLETED means repair is done but NOT yet returned to customer
      prisma.warranty.count({
        where: {
          ...warrantyWhere,
          status: { notIn: ['RETURNED', 'CANCELLED'] },
        },
      }),

      // === COMPLAINTS (match by customerId or phone fallback, like warranty) ===
      prisma.complaint.count({
        where: complaintWhere,
      }),
      prisma.complaint.count({
        where: {
          ...complaintWhere,
          status: { in: ['OPEN', 'IN_PROGRESS'] },
        },
      }),

      // === DEBT: Delivered orders sum (status != CANCELLED AND (COMPLETED/DELIVERED OR deliveryStatus=DELIVERED OR stockOutStatus=FULLY_STOCKED_OUT)) ===
      prisma.order.aggregate({
        where: {
          customerId: systemId,
          status: { not: 'CANCELLED' },
          OR: [
            { status: 'COMPLETED' },
            { status: 'DELIVERED' },
            { deliveryStatus: 'DELIVERED' },
            { stockOutStatus: 'FULLY_STOCKED_OUT' },
          ],
        },
        _sum: { grandTotal: true },
      }),

      // === DEBT: Receipts that reduce debt ===
      // Match by systemId fields OR by name (same as debt transactions API)
      prisma.receipt.aggregate({
        where: {
          status: { not: 'cancelled' },
          affectsDebt: true,
          OR: [
            { customerSystemId: systemId },
            { payerSystemId: systemId },
            ...(customer?.name ? [{ payerTypeName: 'Khách hàng', payerName: customer.name }] : []),
          ],
        },
        _sum: { amount: true },
      }),

      // === DEBT: Payments that affect debt (non-refund, non-complaint) ===
      // Match by systemId fields OR by name (same as debt transactions API)
      // Exclude complaint payments (they don't affect debt in the debt API)
      prisma.payment.findMany({
        where: {
          status: { not: 'cancelled' },
          affectsDebt: true,
          linkedSalesReturnSystemId: null,
          linkedComplaintSystemId: null,
          OR: [
            { customerSystemId: systemId },
            { recipientSystemId: systemId },
            ...(customer?.name ? [{ recipientTypeName: 'Khách hàng', recipientName: customer.name }] : []),
          ],
        },
        select: {
          amount: true,
          paymentReceiptTypeName: true,
          category: true,
        },
      }),

      // === SALES RETURNS: Sum of return values (for calculating totalSpent) ===
      // Only completed/approved returns affect spending
      prisma.salesReturn.aggregate({
        where: {
          customerSystemId: systemId,
          status: { in: ['APPROVED', 'COMPLETED'] },
        },
        _sum: { totalReturnValue: true },
      }),

      // === SALES RETURNS FOR DEBT: Sum of return values that reduce debt ===
      // Only received returns (isReceived: true) and not rejected reduce debt
      prisma.salesReturn.aggregate({
        where: {
          customerSystemId: systemId,
          isReceived: true,
          status: { not: 'REJECTED' },
        },
        _sum: { totalReturnValue: true },
      }),

      // === PAYMENTS FROM SALES RETURNS: Sum of refunds to customer (increase debt from negative to 0) ===
      // Match by systemId fields OR by name (same as debt transactions API)
      prisma.payment.aggregate({
        where: {
          status: { not: 'cancelled' },
          linkedSalesReturnSystemId: { not: null },
          OR: [
            { customerSystemId: systemId },
            { recipientSystemId: systemId },
            ...(customer?.name ? [{ recipientTypeName: 'Khách hàng', recipientName: customer.name }] : []),
          ],
        },
        _sum: { amount: true },
      }),
    ])

    // Process payments: tất cả phiếu chi đều tăng công nợ (trả tiền cho khách → từ âm về 0)
    let debtPaymentTotal = 0
    for (const p of debtPaymentRegularSum) {
      debtPaymentTotal += Number(p.amount) || 0
    }

    // === Resolve customer group name (replaces useCustomerGroups settings call) ===
    let customerGroupName: string | null = null
    if (customer?.customerGroup) {
      const group = await prisma.customerSetting.findFirst({
        where: {
          type: 'customer-group',
          isDeleted: false,
          OR: [
            { systemId: customer.customerGroup },
            { id: customer.customerGroup },
          ],
        },
        select: { name: true },
      })
      customerGroupName = group?.name ?? null
    }

    // inProgress = total - pending - completed - cancelled
    const orderInProgress = orderTotal - orderPending - orderCompleted - orderCancelled

    // Công nợ = Đơn hàng - Hàng trả - Phiếu thu + PC (tất cả phiếu chi đều tăng công nợ)
    const debtBalance = 
      Number(deliveredOrdersSum._sum.grandTotal ?? 0) -
      Number(salesReturnSumForDebt._sum.totalReturnValue ?? 0) -
      Number(debtReceiptSum._sum.amount ?? 0) +
      Number(salesReturnRefundsSum._sum.amount ?? 0) +
      debtPaymentTotal

    // Calculate totalSpent = delivered orders total - sales returns total
    const totalSpentCalculated = 
      Number(deliveredOrdersSum._sum.grandTotal ?? 0) -
      Number(salesReturnSum._sum.totalReturnValue ?? 0)

    return apiSuccess({
      // Full customer profile (replaces separate /api/customers/[id] call)
      customer: customer ? {
        ...customer,
        // Convert Decimal fields to numbers for JSON
        currentDebt: Number(customer.currentDebt ?? 0),
        maxDebt: customer.maxDebt ? Number(customer.maxDebt) : null,
        totalSpent: Number(customer.totalSpent ?? 0),
        defaultDiscount: customer.defaultDiscount ? Number(customer.defaultDiscount) : null,
        totalOrders: customer.totalOrders ?? 0,
        totalProductsBought: customer.totalProductsBought ?? 0,
        lastPurchaseDate: customer.lastPurchaseDate?.toISOString() ?? null,
        dateOfBirth: customer.dateOfBirth?.toISOString() ?? null,
        createdAt: customer.createdAt?.toISOString() ?? null,
        updatedAt: customer.updatedAt?.toISOString() ?? null,
        deletedAt: customer.deletedAt?.toISOString() ?? null,
        lastContactDate: customer.lastContactDate?.toISOString() ?? null,
        nextFollowUpDate: customer.nextFollowUpDate?.toISOString() ?? null,
      } : null,
      // Resolved group name (replaces useCustomerGroups settings lookup)
      customerGroupName,
      orders: {
        total: orderTotal,
        pending: orderPending,
        inProgress: orderInProgress,
        completed: orderCompleted,
        cancelled: orderCancelled,
        lastOrderDate: lastOrder?.orderDate?.toISOString() ?? null,
      },
      warranties: {
        total: warrantyTotal,
        active: warrantyActive,
      },
      complaints: {
        total: complaintTotal,
        active: complaintActive,
      },
      financial: {
        totalSpent: totalSpentCalculated,
        currentDebt: debtBalance,
      },
    })
})
