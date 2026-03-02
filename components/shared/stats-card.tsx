'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

export interface StatsCardProps {
  /** Title of the stat card */
  title: string;
  /** Main value to display */
  value: number | string;
  /** Optional description or subtitle */
  description?: string;
  /** Icon to display */
  icon?: LucideIcon;
  /** Trend percentage (positive = up, negative = down, 0 = neutral) */
  trend?: number;
  /** Trend label (e.g. "vs last month") */
  trendLabel?: string;
  /** Format function for the value */
  formatValue?: (value: number | string) => string;
  /** Whether the card is in loading state */
  isLoading?: boolean;
  /** Additional className */
  className?: string;
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantStyles = {
  default: 'bg-card',
  success: '',  // Clean - no background
  warning: '',
  danger: '',
  info: '',
};

const valueVariantStyles = {
  default: '',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
};

const _iconVariantStyles = {
  default: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
};

/**
 * StatsCard - A card component for displaying statistics
 * 
 * @example
 * ```tsx
 * <StatsCard
 *   title="Tổng khách hàng"
 *   value={1234}
 *   icon={Users}
 *   trend={12.5}
 *   trendLabel="vs tháng trước"
 *   formatValue={(v) => formatNumber(v)}
 * />
 * ```
 */
export function StatsCard({
  title,
  value,
  description,
  icon: _Icon,
  trend,
  trendLabel,
  formatValue,
  isLoading = false,
  className,
  variant = 'default',
}: StatsCardProps) {
  const displayValue = formatValue ? formatValue(value) : value;
  
  const TrendIcon = trend === undefined || trend === 0 
    ? Minus 
    : trend > 0 
      ? TrendingUp 
      : TrendingDown;
  
  const trendColor = trend === undefined || trend === 0
    ? 'text-muted-foreground'
    : trend > 0
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';

  if (isLoading) {
    return <StatsCardSkeleton className={className} />;
  }

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardContent className="p-4">
        <p className="text-body-sm text-muted-foreground">{title}</p>
        <p className={cn("text-h2 font-semibold", valueVariantStyles[variant])}>{displayValue}</p>
        {(description || trend !== undefined) && (
          <div className="flex items-center gap-1 mt-1">
            {trend !== undefined && (
              <>
                <TrendIcon className={cn('h-3 w-3', trendColor)} />
                <span className={cn('text-xs font-medium', trendColor)}>
                  {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                </span>
              </>
            )}
            {(trendLabel || description) && (
              <span className="text-xs text-muted-foreground">
                {trendLabel || description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * StatsCardSkeleton - Loading skeleton for StatsCard
 */
export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('animate-pulse', className)}>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-7 w-20" />
      </CardContent>
    </Card>
  );
}

/**
 * StatsCardGrid - Grid container for multiple StatsCards
 */
export function StatsCardGrid({ 
  children, 
  columns = 4,
  className,
}: { 
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}) {
  const colsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
  };

  return (
    <div className={cn('grid gap-4 grid-cols-2', colsClass[columns], className)}>
      {children}
    </div>
  );
}

/**
 * StatsCardGridSkeleton - Loading skeleton for StatsCardGrid
 */
export function StatsCardGridSkeleton({ 
  count = 4,
  columns = 4,
  className,
}: { 
  count?: number;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}) {
  return (
    <StatsCardGrid columns={columns} className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </StatsCardGrid>
  );
}
