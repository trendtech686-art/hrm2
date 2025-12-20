/**
 * Report Summary Cards Component
 * 
 * Các card hiển thị số liệu tổng quan
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ElementType;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  className?: string;
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: SummaryCardProps) {
  const TrendIcon = trend?.isPositive ? TrendingUp : trend?.value === 0 ? Minus : TrendingDown;
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' 
            ? new Intl.NumberFormat('vi-VN').format(value)
            : value
          }
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span className={cn(
                "flex items-center text-xs",
                trend.isPositive ? "text-green-600" : trend.value === 0 ? "text-muted-foreground" : "text-red-600"
              )}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {trend.value > 0 && '+'}{trend.value}%
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ReportSummaryCardsProps {
  cards: SummaryCardProps[];
  columns?: 2 | 3 | 4 | 5 | 6;
}

export function ReportSummaryCards({ cards, columns = 4 }: ReportSummaryCardsProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
  };
  
  return (
    <div className={cn('grid gap-4 grid-cols-2', gridCols[columns])}>
      {cards.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  );
}

export default ReportSummaryCards;
