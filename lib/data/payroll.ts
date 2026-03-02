/**
 * Payroll Data Fetcher (Server-side with caching)
 * 
 * Schema: Payroll (header) + PayrollItem (per employee)
 * Fields: year, month, branchId, status, totalEmployees, totalGross, totalDeductions, totalNet
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface PayrollFilters {
  page?: number;
  limit?: number;
  branchId?: string;
  month?: number;
  year?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PayrollListItem {
  systemId: string;
  id: string;
  month: number;
  year: number;
  branchId: string | null;
  totalEmployees: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  status: string;
  processedAt: Date | null;
  paidAt: Date | null;
}

function buildPayrollWhereClause(filters: PayrollFilters) {
  const where: Record<string, unknown> = {};

  if (filters.branchId) where.branchId = filters.branchId;
  if (filters.month) where.month = filters.month;
  if (filters.year) where.year = filters.year;
  if (filters.status) where.status = filters.status;

  return where;
}

async function fetchPayroll(filters: PayrollFilters): Promise<PaginatedResult<PayrollListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildPayrollWhereClause(filters);
  
  const orderBy: Record<string, 'asc' | 'desc'>[] = [
    { year: 'desc' },
    { month: 'desc' },
  ];
  if (filters.sortBy) {
    orderBy.unshift({ [filters.sortBy]: filters.sortOrder || 'desc' });
  }

  const [data, total] = await Promise.all([
    prisma.payroll.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        month: true,
        year: true,
        branchId: true,
        totalEmployees: true,
        totalGross: true,
        totalDeductions: true,
        totalNet: true,
        status: true,
        processedAt: true,
        paidAt: true,
      },
    }),
    prisma.payroll.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(p => ({
      systemId: p.systemId,
      id: p.id,
      month: p.month,
      year: p.year,
      branchId: p.branchId,
      totalEmployees: p.totalEmployees,
      totalGross: Number(p.totalGross),
      totalDeductions: Number(p.totalDeductions),
      totalNet: Number(p.totalNet),
      status: p.status,
      processedAt: p.processedAt,
      paidAt: p.paidAt,
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

export const getPayrolls = unstable_cache(
  fetchPayroll,
  ['payrolls'],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.PAYROLL] }
);

export async function getPayrollSummary(year: number, branchId?: string) {
  const where: Record<string, unknown> = { year };
  if (branchId) where.branchId = branchId;

  const result = await prisma.payroll.aggregate({
    where,
    _sum: {
      totalGross: true,
      totalDeductions: true,
      totalNet: true,
      totalEmployees: true,
    },
    _count: true,
  });

  return {
    totalGross: Number(result._sum?.totalGross ?? 0),
    totalDeductions: Number(result._sum?.totalDeductions ?? 0),
    totalNet: Number(result._sum?.totalNet ?? 0),
    totalEmployees: result._sum?.totalEmployees ?? 0,
    periodCount: result._count,
  };
}

// --- Stats ---

export interface PayrollStatsData {
  currentMonthTotal: number;
  draftCount: number;
  reviewedCount: number;
  previousMonthLocked: boolean;
  currentMonthKey: string;
  previousMonthKey: string;
}

export const getPayrollStats = cache(async (): Promise<PayrollStatsData> => {
  return unstable_cache(
    async (): Promise<PayrollStatsData> => {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

      const [currentMonthAgg, draftCount, processingCount, prevMonthBatch] = await Promise.all([
        prisma.payroll.aggregate({
          where: { month: currentMonth, year: currentYear },
          _sum: { totalNet: true },
        }),
        prisma.payroll.count({
          where: { month: currentMonth, year: currentYear, status: 'DRAFT' },
        }),
        prisma.payroll.count({
          where: { month: currentMonth, year: currentYear, status: 'PROCESSING' },
        }),
        prisma.payroll.findFirst({
          where: { month: prevMonth, year: prevYear },
          select: { status: true },
        }),
      ]);

      const pad = (n: number) => n.toString().padStart(2, '0');

      return {
        currentMonthTotal: Number(currentMonthAgg._sum?.totalNet ?? 0),
        draftCount,
        reviewedCount: processingCount,
        previousMonthLocked: prevMonthBatch?.status === 'COMPLETED' || prevMonthBatch?.status === 'PAID',
        currentMonthKey: `${currentYear}-${pad(currentMonth)}`,
        previousMonthKey: `${prevYear}-${pad(prevMonth)}`,
      };
    },
    ['payroll-stats'],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PAYROLL] }
  )();
});
