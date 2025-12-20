import * as React from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SortableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  media?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  muted?: boolean;
}

export const SortableCard = React.forwardRef<HTMLDivElement, SortableCardProps>(
  function SortableCard(
    {
      title,
      description,
      media,
      meta,
      actions,
      dragHandleProps,
      isDragging,
      muted,
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          'group relative rounded-2xl border bg-card/95 p-3 shadow-sm transition-all',
          muted && 'bg-muted/40',
          isDragging && 'border-primary/40 bg-primary/5 ring-2 ring-primary/30 scale-[0.99] opacity-80',
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          {media && <div className="flex-shrink-0 text-lg">{media}</div>}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-5 text-foreground truncate">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground truncate">{description}</p>
            )}
          </div>

          {meta && <div className="flex-shrink-0 text-xs text-muted-foreground">{meta}</div>}

          {actions && (
            <div className="flex flex-shrink-0 items-center gap-1 text-muted-foreground">
              {actions}
            </div>
          )}

          {dragHandleProps && (
            <button
              type="button"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition hover:border-border hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-grab active:cursor-grabbing touch-none"
              aria-label="Kéo để sắp xếp"
              {...dragHandleProps}
            >
              <GripVertical className="h-4 w-4" />
            </button>
          )}
        </div>

        {children}
      </div>
    );
  },
);

SortableCard.displayName = 'SortableCard';
