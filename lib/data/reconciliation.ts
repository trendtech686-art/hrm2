/**
 * Reconciliation Data Fetchers
 * 
 * COD reconciliation is handled via Packaging.reconciliationStatus field.
 * See: features/reconciliation/page.tsx
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';

export interface ReconciliationStats {
  pendingCount: number;
  pendingCodTotal: number;
}

/**
 * Get pending COD reconciliation stats from Packaging records
 * deliveryStatus = DELIVERED, codAmount > 0, reconciliationStatus != 'Đã đối soát'
 */
export const getReconciliationStats = cache(async (): Promise<ReconciliationStats> => {
  return unstable_cache(
    async () => {
      const result = await prisma.packaging.aggregate({
        _count: { _all: true },
        _sum: { codAmount: true },
        where: {
          deliveryStatus: 'DELIVERED',
          codAmount: { gt: 0 },
          NOT: { reconciliationStatus: 'Đã đối soát' },
        },
      });

      return {
        pendingCount: result._count._all,
        pendingCodTotal: result._sum.codAmount ? Number(result._sum.codAmount) : 0,
      };
    },
    ['reconciliation-stats'],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.ORDERS] }
  )();
});
