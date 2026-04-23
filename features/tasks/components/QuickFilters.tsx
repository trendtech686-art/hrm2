/**
 * Quick Filters Component
 * One-click preset filters for common use cases
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { createQuickFilters, type QuickFilter } from '../types-filter';
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
  /** Quick filters to display. If not provided, will use default filters (without user context) */
  filters?: QuickFilter[];
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

// Default filters without user context (for backward compatibility)
const DEFAULT_FILTERS = createQuickFilters();

export function QuickFilters({
  activeFilters,
  onToggleFilter,
  taskCounts = {},
  filters = DEFAULT_FILTERS,
}: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => {
        const isActive = activeFilters.includes(filter.id);
        const Icon = ICON_MAP[filter.icon];
        const count = taskCounts[filter.id] || 0;

        return (
          <Button
            key={filter.id}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleFilter(filter.id)}
            className="h-8 gap-2 shrink-0"
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
  filters = DEFAULT_FILTERS,
}: QuickFiltersProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-2 hide-scrollbar">
      {filters.map(filter => {
        const isActive = activeFilters.includes(filter.id);
        const Icon = ICON_MAP[filter.icon];
        const count = taskCounts[filter.id] || 0;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onToggleFilter(filter.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors border shrink-0 touch-manipulation',
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-muted/80',
            )}
          >
            {Icon && <Icon className="h-3 w-3" />}
            <span>{filter.name}</span>
            {count > 0 && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-xs font-bold',
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
