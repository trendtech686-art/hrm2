import * as React from 'react';
import { cn } from '../../lib/utils';
import { Search, X } from 'lucide-react';

/**
 * Page Toolbar Component
 * Mobile-first toolbar for common actions (Import, Export, Column Toggle).
 *
 * Layout: left actions bên trái, right actions bên phải. Khi có nhiều actions
 * trên mobile, hàng sẽ scroll ngang (ẩn scrollbar) thay vì wrap / bị cắt.
 */
export interface PageToolbarProps {
  /** Search input props - shows in header on mobile */
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  /** Left side actions (Import, Export) */
  leftActions?: React.ReactNode;
  /** Right side actions (Column toggle, Settings) */
  rightActions?: React.ReactNode;
  /** Deprecated: Use leftActions and rightActions instead */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// Scroll ngang mobile (ẩn scrollbar), wrap / inline trên desktop
const scrollRowClass =
  'flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:overflow-visible';

export function PageToolbar({ search, leftActions, rightActions, children, className }: PageToolbarProps) {
  // Backward compatibility: if children is provided, render old way
  if (children && !leftActions && !rightActions) {
    return (
      <div
        className={cn(
          'bg-background py-2 md:py-3',
          scrollRowClass,
          'md:flex-wrap',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  // Mobile search input component - full width with clear button
  const SearchInput = search ? (
    <div className="px-4 py-2 md:hidden">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          placeholder={search.placeholder || 'Tìm kiếm...'}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 pl-10 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {search.value && (
          <button
            type="button"
            onClick={() => search.onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  ) : null;

  if (!leftActions && !rightActions && !search) return null;

  return (
    <div className={cn('bg-background', className)}>
      {/* Mobile search input - full width */}
      {SearchInput}

      {/* Desktop toolbar */}
      <div
        className={cn(
          'hidden md:flex md:items-center md:justify-between md:py-3 px-6',
        )}
      >
        {/* Left: Import, Export */}
        {leftActions ? (
          <div className={cn(scrollRowClass, 'min-w-0')}>{leftActions}</div>
        ) : null}

        {/* Right: Customize, Column toggle */}
        {rightActions ? (
          <div className={cn(scrollRowClass, 'min-w-0 justify-end')}>
            {rightActions}
          </div>
        ) : null}
      </div>

      {/* Mobile actions - shown below search */}
      {(leftActions || rightActions) && (
        <div className="flex items-center justify-between gap-2 px-4 py-2 md:hidden overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2 min-w-0">
            {leftActions}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {rightActions}
          </div>
        </div>
      )}
    </div>
  );
}
