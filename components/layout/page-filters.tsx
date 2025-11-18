import * as React from 'react';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

/**
 * Page Filters Component
 * Mobile-first filters bar for search and custom filters
 * Hàng 3 trong layout 3 tầng
 * Layout: Search + leftFilters bên TRÁI | rightFilters bên PHẢI
 */
export interface PageFiltersProps {
  /** Search input props */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Deprecated: Use children for backward compatibility, or use leftFilters + rightFilters for new layout */
  children?: React.ReactNode;
  /** Filters to show next to search (left side) */
  leftFilters?: React.ReactNode;
  /** Filters to show on right side */
  rightFilters?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function PageFilters({ 
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  children,
  leftFilters,
  rightFilters,
  className 
}: PageFiltersProps) {
  // Backward compatibility: if children is provided without leftFilters/rightFilters, use old layout
  const useNewLayout = (leftFilters !== undefined || rightFilters !== undefined);
  
  if (!useNewLayout && children) {
    return (
      <div 
        className={cn(
          "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 bg-muted/20",
          className
        )}
      >
        {/* Search bar - Full width on mobile, auto on desktop */}
        {onSearchChange && (
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full sm:w-[280px] md:w-[360px] lg:w-[420px]"
          />
        )}
        
        {/* Custom filters - Wrap on mobile */}
        <div className="flex flex-wrap items-center gap-2">
          {children}
        </div>
      </div>
    );
  }
  
  // New layout: Search + leftFilters | rightFilters
  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 bg-muted/20",
        className
      )}
    >
      {/* Left side: Search + leftFilters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
        {onSearchChange && (
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full sm:w-[280px] md:w-[360px] lg:w-[420px]"
          />
        )}
        {leftFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {leftFilters}
          </div>
        )}
      </div>
      
      {/* Right side: rightFilters */}
      {rightFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {rightFilters}
        </div>
      )}
    </div>
  );
}
