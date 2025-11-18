/**
 * Quick Filters Component
 * One-click preset filters for common use cases
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { QUICK_FILTERS, QuickFilter } from '../types-filter';
import {
  User,
  AlertCircle,
  ArrowUp,
  Clock,
  Calendar,
  CalendarDays,
  UserX,
  UserPlus,
} from 'lucide-react';

interface QuickFiltersProps {
  activeFilters: string[];
  onToggleFilter: (filterId: string) => void;
  taskCounts?: Record<string, number>;
}

// Icon mapping
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  AlertCircle,
  ArrowUp,
  Clock,
  Calendar,
  CalendarDays,
  UserX,
  UserPlus,
};

export function QuickFilters({
  activeFilters,
  onToggleFilter,
  taskCounts = {},
}: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_FILTERS.map(filter => {
        const isActive = activeFilters.includes(filter.id);
        const Icon = ICON_MAP[filter.icon];
        const count = taskCounts[filter.id] || 0;

        return (
          <Button
            key={filter.id}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleFilter(filter.id)}
            className={cn(
              'h-8 gap-2',
              isActive && `bg-${filter.color}-500 hover:bg-${filter.color}-600`
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{filter.name}</span>
            {count > 0 && (
              <Badge
                variant={isActive ? 'secondary' : 'outline'}
                className="h-5 px-1.5 text-xs font-medium"
              >
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}

/**
 * Compact Quick Filters for Mobile
 */
export function QuickFiltersCompact({
  activeFilters,
  onToggleFilter,
  taskCounts = {},
}: QuickFiltersProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-2 hide-scrollbar">
      {QUICK_FILTERS.map(filter => {
        const isActive = activeFilters.includes(filter.id);
        const Icon = ICON_MAP[filter.icon];
        const count = taskCounts[filter.id] || 0;

        return (
          <button
            key={filter.id}
            onClick={() => onToggleFilter(filter.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
              isActive
                ? `bg-${filter.color}-500 text-white`
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {Icon && <Icon className="h-3 w-3" />}
            <span>{filter.name}</span>
            {count > 0 && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  isActive ? 'bg-white/20' : 'bg-primary/10 text-primary'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
