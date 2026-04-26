import * as React from 'react';
import { Input } from '../ui/input';
import { Search, X } from 'lucide-react';
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
  /** Icon/button to render inside the search input (right side) */
  searchSuffix?: React.ReactNode;
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
  searchSuffix,
  children,
  leftFilters,
  rightFilters,
  className 
}: PageFiltersProps) {
  // Backward compatibility: if children is provided without leftFilters/rightFilters, use old layout
  const useNewLayout = (leftFilters !== undefined || rightFilters !== undefined);
  
  // Mobile search bar with proper touch targets
  const renderSearchBar = (extraClasses?: string) => (
    <div className={cn("relative w-full sm:w-[280px] md:w-[360px] lg:w-[420px]", extraClasses)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
        className={cn(
          "w-full pl-10",
          searchSuffix ? "pr-10" : "pr-3",
          // Mobile-optimized: larger touch target for search input
          "h-12 md:h-10 text-base md:text-sm"
        )}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
      {/* Clear button for mobile */}
      {searchValue && (
        <button
          type="button"
          onClick={() => onSearchChange?.('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent touch-target-sm"
          aria-label="Xóa tìm kiếm"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      {searchSuffix && !searchValue && (
        <div className="absolute right-0 top-0 h-full flex items-center pr-1">
          {searchSuffix}
        </div>
      )}
    </div>
  );
  
  if (!useNewLayout && children) {
    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 bg-muted/20",
          className
        )}
      >
        {/* Search bar - Full width on mobile, auto on desktop */}
        {onSearchChange && renderSearchBar()}
        
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
        {onSearchChange && renderSearchBar()}
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
