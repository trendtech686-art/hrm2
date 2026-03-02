/**
 * Payments Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface PaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  method?: string;
  branchId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaymentListItem {
  systemId: string;
  id: string;
  type: string;
  method: string | null;
  amount: number;
  referenceId: string | null;
  referenceType: string | null;
  branchName: string;
  customerName: string | null;
  createdByName: string | null;
  paymentDate: Date;
  description: string | null;
}

function buildPaymentWhereClause(filters: PaymentFilters) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
      { referenceId: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.type) where.type = filters.type;
  if (filters.method) where.method = filters.method;
  if (filters.branchId) where.branchId = filters.branchId;

  if (filters.startDate || filters.endDate) {
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
    if (filters.endDate) dateFilter.lte = new Date(filters.endDate);
    where.paymentDate = dateFilter;
  }

  return where;
}

async function fetchPayments(filters: PaymentFilters): Promise<PaginatedResult<PaymentListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildPaymentWhereClause(filters);
  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'paymentDate'] = filters.sortOrder || 'desc';

  const [data, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        type: true,
        method: true,
        amount: true,
        referenceId: true,
        referenceType: true,
        paymentDate: true,
        description: true,
        branchName: true,
        customerName: true,
        createdBy: true,
      },
    }),
    prisma.payment.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(p => ({
      systemId: p.systemId,
      id: p.id,
      type: p.type,
      method: p.method,
      amount: p.amount.toNumber(),
      referenceId: p.referenceId,
      referenceType: p.referenceType,
      branchName: p.branchName || '',
      customerName: p.customerName || null,
      createdByName: p.createdBy || null,
      paymentDate: p.paymentDate,
      description: p.description,
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

export const getPayments = cache(async (filters: PaymentFilters = {}) => {
  const cacheKey = `payments:${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchPayments(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PAYMENTS] }
  )();
});

export const getPaymentSummary = cache(async (branchId?: string, startDate?: Date, endDate?: Date) => {
  return unstable_cache(
    async () => {
      const where: Record<string, unknown> = {};
      if (branchId) where.branchId = branchId;
      if (startDate || endDate) {
        where.paymentDate = {};
        if (startDate) (where.paymentDate as Record<string, unknown>).gte = startDate;
        if (endDate) (where.paymentDate as Record<string, unknown>).lte = endDate;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [total, completed, cancelled, totalAmountResult] = await Promise.all([
        prisma.payment.count({ where }),
        prisma.payment.count({ where: { ...where, status: 'COMPLETED' } }),
        prisma.payment.count({ where: { ...where, status: 'CANCELLED' } }),
        prisma.payment.aggregate({ where, _sum: { amount: true } }),
      ]);

      return {
        total,
        completed,
        cancelled,
        totalAmount: totalAmountResult._sum?.amount?.toNumber() || 0,
      };
    },
    [`payment-summary-${branchId || 'all'}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PAYMENTS] }
  )();
});
