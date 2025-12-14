import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { StatsCard } from '../../../components/ui/stats-card.tsx';

type SummaryTrend = {
  value: number;
  isPositive: boolean;
};

export type PayrollSummaryCard = {
  id: string;
  title: string;
  value: string | number;
  description?: string | undefined;
  icon?: LucideIcon | undefined;
  trend?: SummaryTrend | undefined;
  className?: string | undefined;
};

type PayrollSummaryCardsProps = {
  items: PayrollSummaryCard[];
};

export function PayrollSummaryCards({ items }: PayrollSummaryCardsProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatsCard
          key={item.id}
          title={item.title}
          value={item.value}
          description={item.description}
          icon={item.icon}
          trend={item.trend}
          className={item.className}
        />
      ))}
    </div>
  );
}
