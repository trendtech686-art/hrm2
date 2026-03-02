'use client';

import * as React from 'react';
import { ShoppingCart, PackageCheck, RotateCcw, Package } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/shared/stats-card';
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
    <StatsCardGrid columns={4}>
      <StatsCard
        title="Tổng đặt hàng"
        value={stats.totalOrdered}
        icon={ShoppingCart}
        formatValue={(v) => `${formatNumber(Number(v))} SP`}
      />
      <StatsCard
        title="Đã nhận"
        value={stats.totalReceived}
        icon={PackageCheck}
        formatValue={(v) => `${formatNumber(Number(v))} SP`}
        description={`${stats.receivedRate}%`}
        variant="success"
      />
      <StatsCard
        title="Đã trả lại"
        value={stats.totalReturned}
        icon={RotateCcw}
        formatValue={(v) => `${formatNumber(Number(v))} SP`}
        description={`${stats.returnedRate}%`}
        variant={stats.totalReturned > 0 ? 'warning' : 'default'}
      />
      <StatsCard
        title="Tồn kho thực"
        value={stats.netInStock}
        icon={Package}
        formatValue={(v) => `${Number(v) > 0 ? '+' : ''}${formatNumber(Number(v))} SP`}
        variant={stats.netInStock >= 0 ? 'info' : 'danger'}
      />
    </StatsCardGrid>
  );
}
