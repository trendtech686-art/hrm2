/**
 * Cashbook Data Fetcher (Server-side with caching)
 * Uses CashTransaction model from finance schema
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface CashbookFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER_IN' | 'TRANSFER_OUT';
  accountId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CashbookListItem {
  systemId: string;
  id: string;
  type: string;
  amount: number;
  description: string | null;
  accountName: string;
  referenceType: string | null;
  referenceId: string | null;
  transactionDate: Date;
  createdAt: Date;
}

function buildCashbookWhereClause(filters: CashbookFilters) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.type) where.type = filters.type;
  if (filters.accountId) where.accountId = filters.accountId;

  if (filters.startDate || filters.endDate) {
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
    if (filters.endDate) dateFilter.lte = new Date(filters.endDate);
    where.transactionDate = dateFilter;
  }

  return where;
}

async function fetchCashbook(filters: CashbookFilters): Promise<PaginatedResult<CashbookListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildCashbookWhereClause(filters);
  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'transactionDate'] = filters.sortOrder || 'desc';

  const [data, total] = await Promise.all([
    prisma.cashTransaction.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        type: true,
        amount: true,
        description: true,
        referenceType: true,
        referenceId: true,
        transactionDate: true,
        createdAt: true,
        cash_accounts: { select: { name: true } },
      },
    }),
    prisma.cashTransaction.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(c => ({
      systemId: c.systemId,
      id: c.id,
      type: c.type,
      amount: c.amount.toNumber(),
      description: c.description,
      accountName: c.cash_accounts?.name || '',
      referenceType: c.referenceType,
      referenceId: c.referenceId,
      transactionDate: c.transactionDate,
      createdAt: c.createdAt,
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

export const getCashbook = cache(async (filters: CashbookFilters = {}) => {
  const cacheKey = `cashbook-${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchCashbook(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.CASHBOOK] }
  )();
});

export const getCashbookSummary = cache(async (accountId?: string, startDate?: Date, endDate?: Date) => {
  return unstable_cache(
    async () => {
      const where: Record<string, unknown> = {};
      if (accountId) where.accountId = accountId;
      if (startDate || endDate) {
        const dateFilter: { gte?: Date; lte?: Date } = {};
        if (startDate) dateFilter.gte = startDate;
        if (endDate) dateFilter.lte = endDate;
        where.transactionDate = dateFilter;
      }

      const [income, expense] = await Promise.all([
        prisma.cashTransaction.aggregate({
          where: { ...where, type: 'INCOME' },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.cashTransaction.aggregate({
          where: { ...where, type: 'EXPENSE' },
          _sum: { amount: true },
          _count: true,
        }),
      ]);

      return {
        income: {
          total: income._sum.amount?.toNumber() || 0,
          count: income._count,
        },
        expense: {
          total: expense._sum.amount?.toNumber() || 0,
          count: expense._count,
        },
        balance: (income._sum.amount?.toNumber() || 0) - (expense._sum.amount?.toNumber() || 0),
      };
    },
    [`cashbook-summary-${accountId || 'all'}-${startDate?.toISOString() || ''}-${endDate?.toISOString() || ''}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.CASHBOOK] }
  )();
});

// --- Stats ---

export interface CashbookStatsData {
  openingBalance: number;
  totalReceipts: number;
  totalPayments: number;
  closingBalance: number;
  transactionCount: number;
}

export const getCashbookStats = cache(async (): Promise<CashbookStatsData> => {
  return unstable_cache(
    async (): Promise<CashbookStatsData> => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get all time balance before this month (opening) and this month's receipts/payments
      const [beforeMonth, receipts, payments, totalCount] = await Promise.all([
        prisma.cashTransaction.aggregate({
          where: { transactionDate: { lt: monthStart } },
          _sum: { amount: true },
        }),
        prisma.cashTransaction.aggregate({
          where: { type: 'INCOME', transactionDate: { gte: monthStart } },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.cashTransaction.aggregate({
          where: { type: 'EXPENSE', transactionDate: { gte: monthStart } },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.cashTransaction.count({ where: { transactionDate: { gte: monthStart } } }),
      ]);

      const openingBalance = beforeMonth._sum.amount?.toNumber() ?? 0;
      const totalReceipts = receipts._sum.amount?.toNumber() ?? 0;
      const totalPayments = payments._sum.amount?.toNumber() ?? 0;

      return {
        openingBalance,
        totalReceipts,
        totalPayments,
        closingBalance: openingBalance + totalReceipts - totalPayments,
        transactionCount: totalCount,
      };
    },
    ['cashbook-stats'],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.CASHBOOK] }
  )();
});
