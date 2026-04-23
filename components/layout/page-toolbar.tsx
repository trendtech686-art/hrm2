import * as React from 'react';
import { cn } from '../../lib/utils';

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

export function PageToolbar({ leftActions, rightActions, children, className }: PageToolbarProps) {
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

  if (!leftActions && !rightActions) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-2 bg-background py-2 md:flex-row md:items-center md:justify-between md:py-3',
        className,
      )}
    >
      {/* Left: Import, Export — mobile scroll-x, desktop inline sát mép trái */}
      {leftActions ? (
        <div className={cn(scrollRowClass, 'min-w-0')}>{leftActions}</div>
      ) : null}

      {/* Right: Customize, Column toggle — mobile scroll-x, desktop inline sát mép phải */}
      {rightActions ? (
        <div
          className={cn(
            scrollRowClass,
            'min-w-0 md:justify-end',
          )}
        >
          {rightActions}
        </div>
      ) : null}
    </div>
  );
}
