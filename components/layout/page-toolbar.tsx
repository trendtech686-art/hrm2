import * as React from 'react';
import { cn } from '../../lib/utils';
import { Search } from 'lucide-react';

/**
 * Page Toolbar Component
 * Mobile-first toolbar for common actions (Import, Export, Column Toggle).
 *
 * Layout: left actions bên trái, right actions bên phải. Khi có nhiều actions
 * trên mobile, hàng sẽ scroll ngang (ẩn scrollbar) thay vì wrap / bị cắt.
 *
 * Các trang list hiện đang gate bằng `!isMobile && <PageToolbar …/>` để giấu
 * toolbar trên mobile (FAB + dropdown thay thế). Khi nào muốn bật trên mobile
 * thì toolbar tự responsive.
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

  // Search input component for mobile header
  const SearchInput = search ? (
    <div className="px-4 md:hidden">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          placeholder={search.placeholder || 'Tìm kiếm...'}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  ) : null;

  if (!leftActions && !rightActions && !search) return null;

  return (
    <div className={cn('bg-background', className)}>
      {/* Mobile search input - shown in header */}
      {SearchInput}
      
      <div
        className={cn(
          'flex flex-col gap-2 bg-background py-2 md:flex-row md:items-center md:justify-between md:py-3',
          search ? 'px-4' : '',
        )}
      >
        {/* Left: Import, Export — mobile scroll-x, desktop inline sát mép trái */}
        {leftActions ? (
          <div className={cn(scrollRowClass, 'min-w-0', 'max-md:hidden')}>{leftActions}</div>
        ) : null}

        {/* Right: Customize, Column toggle — mobile scroll-x, desktop inline sát mép phải */}
        {rightActions ? (
          <div
            className={cn(
              scrollRowClass,
              'min-w-0 md:justify-end',
              'max-md:hidden'
            )}
          >
            {rightActions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
