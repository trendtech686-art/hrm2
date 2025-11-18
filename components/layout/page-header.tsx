import * as React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useMediaQuery } from '../../lib/use-media-query';
import { usePageHeaderContext } from '../../contexts/page-header-context';
import type { BreadcrumbItem } from '../../lib/breadcrumb-system';

/**
 * Page Header Component
 * Mobile-first responsive header với Shadcn UI design
 * 
 * Mobile: Back button + Title + Actions stacked
 * Desktop: Breadcrumb + Title/Subtitle + Badge + Actions inline
 */
export function PageHeader() {
  const { pageHeader } = usePageHeaderContext();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const {
    title,
    subtitle,
    badge,
    showBackButton,
    onBack,
    actions = [],
    breadcrumb = [],
  } = pageHeader;

  // Don't render if no content
  if (!title && breadcrumb.length === 0 && actions.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "border-b bg-background backdrop-blur-sm shadow-sm",
      "sticky top-16 z-20"
    )}>
      {/* Mobile Layout */}
      {!isDesktop && (
        <div className="flex flex-col gap-3 py-3">
          {/* Mobile: Back + Title */}
          <div className="flex items-center gap-3">
            {showBackButton && onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-9 w-9 shrink-0"
                aria-label="Quay lại"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            
            <div className="flex-1 min-w-0">
              {title && (
                <h1 className="text-lg font-semibold tracking-tight truncate">
                  {title}
                </h1>
              )}
              {badge && <div className="mt-2">{badge}</div>}
            </div>
          </div>

          {/* Mobile: Actions */}
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.map((action, index) => (
                <React.Fragment key={index}>{action}</React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Desktop Layout */}
      {isDesktop && (
        <div className="flex flex-col gap-3 py-4">
          {/* Desktop: Title + Actions (NO subtitle breadcrumb duplicate) */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {showBackButton && onBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="h-9 w-9 shrink-0"
                  aria-label="Quay lại"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}

              <div className="flex-1 min-w-0">
                {title && (
                  <h1 className="text-2xl font-bold tracking-tight truncate">
                    {title}
                  </h1>
                )}
                {badge && <div className="mt-2">{badge}</div>}
              </div>
            </div>

            {/* Desktop: Actions */}
            {actions.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                {actions.map((action, index) => (
                  <React.Fragment key={index}>{action}</React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Page Header Skeleton
 * Loading state for page header
 */
export function PageHeaderSkeleton() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {!isDesktop && (
        <div className="flex flex-col gap-3 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-muted animate-pulse rounded-md" />
            <div className="flex-1">
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded mt-1" />
            </div>
          </div>
        </div>
      )}
      
      {isDesktop && (
        <div className="flex flex-col gap-3 py-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-2 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-9 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
