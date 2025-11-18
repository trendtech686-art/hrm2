import * as React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

/**
 * Page Toolbar Component
 * Mobile-first toolbar for common actions (Import, Export, Column Toggle)
 * Hàng 2 trong layout 3 tầng
 * 
 * Layout: Import/Export bên trái, Settings (Column toggle) bên phải
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

export function PageToolbar({ leftActions, rightActions, children, className }: PageToolbarProps) {
  // Backward compatibility: if children is provided, render old way
  if (children && !leftActions && !rightActions) {
    return (
      <div 
        className={cn(
          "flex flex-wrap items-center gap-2 py-3 bg-background",
          className
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
        "flex items-center justify-between py-3 bg-background",
        className
      )}
    >
      {/* Left: Import, Export - SÁT MÉP TRÁI */}
      <div className="flex items-center gap-2">
        {leftActions}
      </div>
      
      {/* Right: Trash & Column Toggle - SÁT MÉP PHẢI */}
      <div className="flex items-center gap-2">
        {rightActions}
      </div>
    </div>
  );
}
