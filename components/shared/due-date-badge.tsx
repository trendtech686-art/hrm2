/**
 * Due Date Badge Component
 * Visual indicator for task due dates with warnings
 */

import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  AlertCircle, 
  Info, 
  Calendar 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getDueDateWarning, type DueDateWarning } from '@/features/warranty/utils/due-date-helpers';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

type DueDateBadgeProps = {
  dueDate?: string | Date;
  variant?: 'default' | 'compact' | 'icon-only';
  showTooltip?: boolean;
  className?: string;
};

const iconMap = {
  AlertTriangle,
  Clock,
  AlertCircle,
  Info,
  Calendar,
};

export function DueDateBadge({
  dueDate,
  variant = 'default',
  showTooltip = true,
  className,
}: DueDateBadgeProps) {
  const warning = getDueDateWarning(dueDate);
  
  // Don't show badge for no due date or future tasks in compact mode
  if (warning.status === 'no-due-date' && variant === 'compact') {
    return null;
  }

  const IconComponent = iconMap[warning.icon as keyof typeof iconMap] || Calendar;

  const badgeContent = (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border-2 transition-all',
        warning.color,
        warning.bgColor,
        {
          'px-2 py-1': variant === 'default',
          'px-1.5 py-0.5 text-xs': variant === 'compact',
          'p-1': variant === 'icon-only',
          'animate-pulse': warning.status === 'overdue' || warning.status === 'due-today',
        },
        className
      )}
    >
      <IconComponent 
        className={cn(
          'shrink-0',
          variant === 'icon-only' ? 'h-3.5 w-3.5' : 'h-3.5 w-3.5 mr-1'
        )} 
      />
      {variant !== 'icon-only' && (
        <span className="truncate">{warning.message}</span>
      )}
    </Badge>
  );

  if (!showTooltip || variant === 'default') {
    return badgeContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-sm">
            <p className="font-semibold">{warning.message}</p>
            {dueDate && (
              <p className="text-muted-foreground">
                Hạn chót: {format(new Date(dueDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </p>
            )}
            {warning.daysRemaining !== 0 && (
              <p className="text-xs">
                {warning.daysRemaining > 0 
                  ? `Còn ${warning.daysRemaining} ngày (${warning.hoursRemaining}h)`
                  : `Quá hạn ${Math.abs(warning.daysRemaining)} ngày`
                }
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Compact due date indicator for lists
 */
export function DueDateIndicator({ 
  dueDate,
  className,
}: { 
  dueDate?: string | Date;
  className?: string;
}) {
  const warning = getDueDateWarning(dueDate);
  
  if (warning.status === 'no-due-date' || warning.status === 'future') {
    return null;
  }

  const IconComponent = iconMap[warning.icon as keyof typeof iconMap] || Clock;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              'inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded',
              warning.color,
              warning.bgColor,
              {
                'animate-pulse': warning.status === 'overdue',
              },
              className
            )}
          >
            <IconComponent className="h-3 w-3" />
            <span>{warning.daysRemaining > 0 ? warning.daysRemaining : Math.abs(warning.daysRemaining)}d</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {warning.message}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Due date warning banner for detail pages
 */
export function DueDateWarningBanner({ 
  dueDate,
  className,
}: { 
  dueDate?: string | Date;
  className?: string;
}) {
  const warning = getDueDateWarning(dueDate);
  
  // Only show for critical warnings
  if (!['overdue', 'due-today', 'due-tomorrow'].includes(warning.status)) {
    return null;
  }

  const IconComponent = iconMap[warning.icon as keyof typeof iconMap] || AlertTriangle;

  return (
    <div 
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border-2',
        warning.bgColor,
        warning.color,
        {
          'border-destructive': warning.status === 'overdue',
          'border-orange-500': warning.status === 'due-today',
          'border-orange-400': warning.status === 'due-tomorrow',
        },
        className
      )}
    >
      <IconComponent className="h-5 w-5 shrink-0" />
      <div className="flex-1">
        <p className="font-semibold">{warning.message}</p>
        {dueDate && (
          <p className="text-sm mt-1 opacity-90">
            Hạn chót: {format(new Date(dueDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
          </p>
        )}
      </div>
    </div>
  );
}
