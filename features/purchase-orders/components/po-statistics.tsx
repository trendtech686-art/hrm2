'use client';

import { StatsBar } from '@/components/shared/stats-bar';
import { formatNumber } from '@/lib/format-utils';
import type { POItemStats } from '@/lib/data/purchase-orders';

interface POStatisticsCardsProps {
  initialStats?: POItemStats;
}

export function POStatisticsCards({ initialStats }: POStatisticsCardsProps) {
  const stats = initialStats ?? {
    totalOrdered: 0,
    totalReceived: 0,
    totalReturned: 0,
    netInStock: 0,
    receivedRate: '0',
    returnedRate: '0',
  };

  return (
    <StatsBar
      items={[
        { key: 'totalOrdered', label: 'Tổng đặt hàng', value: `${formatNumber(stats.totalOrdered)} SP` },
        { key: 'totalReceived', label: 'Đã nhận', value: `${formatNumber(stats.totalReceived)} SP`, description: `${stats.receivedRate}%` },
        { key: 'totalReturned', label: 'Đã trả lại', value: `${formatNumber(stats.totalReturned)} SP`, description: `${stats.returnedRate}%` },
        { key: 'netInStock', label: 'Tồn kho thực', value: `${stats.netInStock > 0 ? '+' : ''}${formatNumber(stats.netInStock)} SP` },
      ]}
    />
  );
}
