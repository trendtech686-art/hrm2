/**
 * Orders Data Fetcher (Server-side with caching)
 * 
 * Use in Server Components for initial data
 * Supports server-side pagination, filtering, and caching
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { OrderStatus, PaymentStatus, DeliveryStatus } from '@/generated/prisma/client';

// Types
export interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  deliveryStatus?: DeliveryStatus;
  branchId?: string;
  customerId?: string;
  salespersonId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface OrderListItem {
  systemId: string;
  id: string;
  customerName: string;
  branchName: string;
  salespersonName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  grandTotal: number;
  paidAmount: number;
  orderDate: Date;
  createdAt: Date;
  trackingCode: string | null;
}

// Build where clause from filters
function buildOrderWhereClause(filters: OrderFilters) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
      { customerName: { contains: filters.search, mode: 'insensitive' } },
      { trackingCode: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.paymentStatus) {
    where.paymentStatus = filters.paymentStatus;
  }

  if (filters.deliveryStatus) {
    where.deliveryStatus = filters.deliveryStatus;
  }

  if (filters.branchId) {
    where.branchId = filters.branchId;
  }

  if (filters.customerId) {
    where.customerId = filters.customerId;
  }

  if (filters.salespersonId) {
    where.salespersonId = filters.salespersonId;
  }

  if (filters.startDate || filters.endDate) {
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (filters.startDate) {
      dateFilter.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      dateFilter.lte = new Date(filters.endDate);
    }
    where.orderDate = dateFilter;
  }

  return where;
}

/**
 * Get paginated orders list - CACHED
 * Use this in Server Components
 */
export async function getOrders(
  filters: OrderFilters = {}
): Promise<PaginatedResult<OrderListItem>> {
  const { page = 1, limit = 50, sortBy = 'orderDate', sortOrder = 'desc' } = filters;
  const skip = (page - 1) * limit;

  const where = buildOrderWhereClause(filters);

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        customerName: true,
        branchName: true,
        salespersonName: true,
        status: true,
        paymentStatus: true,
        deliveryStatus: true,
        grandTotal: true,
        paidAmount: true,
        orderDate: true,
        createdAt: true,
        trackingCode: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map((order): OrderListItem => ({
      systemId: order.systemId,
      id: order.id,
      customerName: order.customerName,
      branchName: order.branchName,
      salespersonName: order.salespersonName,
      status: order.status,
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.deliveryStatus,
      grandTotal: Number(order.grandTotal),
      paidAmount: Number(order.paidAmount),
      orderDate: order.orderDate,
      createdAt: order.createdAt,
      trackingCode: order.trackingCode,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Get order by systemId - Request memoized
 */
export const getOrderById = cache(async (systemId: string) => {
  return prisma.order.findUnique({
    where: { systemId },
    include: {
      lineItems: {
        include: {
          product: {
            select: {
              systemId: true,
              id: true,
              name: true,
              thumbnailImage: true,
            },
          },
        },
      },
      payments: true,
      branch: {
        select: {
          systemId: true,
          name: true,
          address: true,
          phone: true,
        },
      },
      customer: {
        select: {
          systemId: true,
          name: true,
          phone: true,
          address: true,
        },
      },
      salesperson: {
        select: {
          systemId: true,
          fullName: true,
          phone: true,
        },
      },
      shipments: true,
      packagings: true,
    },
  });
});

/**
 * Get orders count by status - CACHED (30s)
 */
export const getOrdersCountByStatus = unstable_cache(
  async (_branchId?: string) => {
    // No longer used - stats API handles this now
    return {} as Record<string, number>;
  },
  ['orders-count-by-status'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.ORDERS] }
);

/**
 * Get recent orders for dashboard - CACHED (30s)
 */
export const getRecentOrders = unstable_cache(
  async (branchId?: string, limit = 10) => {
    return prisma.order.findMany({
      where: branchId ? { branchId } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        systemId: true,
        id: true,
        customerName: true,
        grandTotal: true,
        status: true,
        createdAt: true,
      },
    });
  },
  ['recent-orders'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.ORDERS] }
);

/**
 * Get order statistics - CACHED (30s)
 * Returns workflow card data matching the stats API response
 */
export const getOrderStats = unstable_cache(
  async () => {
    const { OrderStatus, DeliveryStatus, PaymentStatus } = await import('@/generated/prisma/client');

    const activeWhere = {
      status: { notIn: [OrderStatus.CANCELLED, OrderStatus.COMPLETED] },
    };

    const [
      statusCounts,
      pendingApproval,
      pendingPayment,
      pendingPack,
      pendingPickup,
      shipping,
      packed,
      rescheduled,
      pendingReturn,
      pendingCod,
    ] = await Promise.all([
      prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.order.aggregate({ where: { status: OrderStatus.PENDING }, _count: { _all: true }, _sum: { grandTotal: true } }),
      prisma.order.aggregate({ where: { ...activeWhere, paymentStatus: PaymentStatus.UNPAID }, _count: { _all: true }, _sum: { grandTotal: true } }),
      prisma.order.aggregate({ where: { ...activeWhere, status: { notIn: [OrderStatus.CANCELLED, OrderStatus.COMPLETED, OrderStatus.PENDING] }, deliveryStatus: DeliveryStatus.PENDING_PACK }, _count: { _all: true }, _sum: { grandTotal: true } }),
      prisma.order.aggregate({ where: { ...activeWhere, deliveryStatus: DeliveryStatus.PENDING_SHIP }, _count: { _all: true }, _sum: { grandTotal: true } }),
      prisma.order.aggregate({ where: { ...activeWhere, deliveryStatus: DeliveryStatus.SHIPPING }, _count: { _all: true }, _sum: { grandTotal: true } }),
      prisma.order.aggregate({ where: { ...activeWhere, deliveryStatus: DeliveryStatus.PACKED }, _count: { _all: true }, _sum: { grandTotal: true } }),
      prisma.order.aggregate({ where: { ...activeWhere, deliveryStatus: DeliveryStatus.RESCHEDULED }, _count: { _all: true }, _sum: { grandTotal: true } }),
      prisma.order.aggregate({ where: { ...activeWhere, returnStatus: { in: ['PARTIAL_RETURN', 'FULL_RETURN'] } }, _count: { _all: true }, _sum: { grandTotal: true } }),
      prisma.order.aggregate({ where: { deliveryStatus: DeliveryStatus.DELIVERED, codAmount: { gt: 0 }, paymentStatus: { not: PaymentStatus.PAID } }, _count: { _all: true }, _sum: { codAmount: true } }),
    ]);

    const { ORDER_STATUS_LABELS } = await import('@/lib/constants/order-enums');
    const countByStatus: Record<string, number> = {};
    for (const item of statusCounts) {
      const label = ORDER_STATUS_LABELS[item.status] || item.status;
      countByStatus[label] = (countByStatus[label] || 0) + item._count._all;
    }

    return {
      countByStatus,
      workflowCards: {
        pendingApproval:  { count: pendingApproval._count._all,  amount: Number(pendingApproval._sum.grandTotal ?? 0) },
        pendingPayment:   { count: pendingPayment._count._all,   amount: Number(pendingPayment._sum.grandTotal ?? 0) },
        pendingPack:      { count: pendingPack._count._all,      amount: Number(pendingPack._sum.grandTotal ?? 0) },
        pendingPickup:    { count: pendingPickup._count._all,    amount: Number(pendingPickup._sum.grandTotal ?? 0) },
        shipping:         { count: shipping._count._all,         amount: Number(shipping._sum.grandTotal ?? 0) },
        packed:           { count: packed._count._all,           amount: Number(packed._sum.grandTotal ?? 0) },
        rescheduled:      { count: rescheduled._count._all,      amount: Number(rescheduled._sum.grandTotal ?? 0) },
        pendingReturn:    { count: pendingReturn._count._all,    amount: Number(pendingReturn._sum.grandTotal ?? 0) },
        pendingCod:       { count: pendingCod._count._all,       amount: Number(pendingCod._sum.codAmount ?? 0) },
      },
    };
  },
  ['order-stats'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.ORDERS] }
);
