/**
 * Cashbook Data Fetcher (Server-side with caching)
 * Uses Receipt + Payment models from finance schema
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';

// --- Stats ---

export interface CashbookStatsData {
  openingBalance: number;
  totalReceipts: number;
  totalPayments: number;
  closingBalance: number;
  transactionCount: number;
  accountBalances: Array<{
    systemId: string;
    name: string;
    type: string;
    balance: number;
  }>;
}

export const getCashbookStats = cache(async (): Promise<CashbookStatsData> => {
  return unstable_cache(
    async (): Promise<CashbookStatsData> => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get all accounts with their initial balances
      const accounts = await prisma.cashAccount.findMany({
        where: { isActive: true },
        select: { systemId: true, name: true, type: true, initialBalance: true },
        orderBy: { name: 'asc' },
      });

      // Calculate opening balance (initial balances + all transactions before this month)
      const [preMonthReceipts, preMonthPayments, monthReceipts, monthPayments] = await Promise.all([
        prisma.receipt.aggregate({
          where: { 
            status: { not: 'cancelled' },
            accountSystemId: { not: null },
            receiptDate: { lt: monthStart } 
          },
          _sum: { amount: true },
        }),
        prisma.payment.aggregate({
          where: { 
            status: { not: 'cancelled' },
            accountSystemId: { not: null },
            paymentDate: { lt: monthStart } 
          },
          _sum: { amount: true },
        }),
        prisma.receipt.aggregate({
          where: { 
            status: { not: 'cancelled' },
            accountSystemId: { not: null },
            receiptDate: { gte: monthStart } 
          },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.payment.aggregate({
          where: { 
            status: { not: 'cancelled' },
            accountSystemId: { not: null },
            paymentDate: { gte: monthStart } 
          },
          _sum: { amount: true },
          _count: true,
        }),
      ]);

      const initialBalanceTotal = accounts.reduce((sum, a) => sum + (a.initialBalance?.toNumber() ?? 0), 0);
      const preReceiptsTotal = preMonthReceipts._sum.amount?.toNumber() ?? 0;
      const prePaymentsTotal = preMonthPayments._sum.amount?.toNumber() ?? 0;
      const openingBalance = initialBalanceTotal + preReceiptsTotal - prePaymentsTotal;
      
      const totalReceipts = monthReceipts._sum.amount?.toNumber() ?? 0;
      const totalPayments = monthPayments._sum.amount?.toNumber() ?? 0;

      // Calculate per-account balances
      const accountBalances = await Promise.all(accounts.map(async (account) => {
        const [accReceipts, accPayments] = await Promise.all([
          prisma.receipt.aggregate({
            where: { 
              status: { not: 'cancelled' },
              accountSystemId: account.systemId 
            },
            _sum: { amount: true },
          }),
          prisma.payment.aggregate({
            where: { 
              status: { not: 'cancelled' },
              accountSystemId: account.systemId 
            },
            _sum: { amount: true },
          }),
        ]);
        
        const balance = (account.initialBalance?.toNumber() ?? 0) 
          + (accReceipts._sum.amount?.toNumber() ?? 0) 
          - (accPayments._sum.amount?.toNumber() ?? 0);

        return {
          systemId: account.systemId,
          name: account.name,
          type: account.type,
          balance,
        };
      }));

      return {
        openingBalance,
        totalReceipts,
        totalPayments,
        closingBalance: openingBalance + totalReceipts - totalPayments,
        transactionCount: (monthReceipts._count ?? 0) + (monthPayments._count ?? 0),
        accountBalances,
      };
    },
    ['cashbook-stats'],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.CASHBOOK] }
  )();
});
