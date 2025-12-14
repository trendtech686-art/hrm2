import * as React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { useMediaQuery } from '../../lib/use-media-query';
import { usePageHeaderState } from '../../contexts/page-header-context';

/**
 * Page Header Component
 * Mobile-first responsive header với Shadcn UI design
 * 
 * Mobile: Back button + Title + Actions stacked
 * Desktop: Title/Subtitle + Badge + Actions inline
 */
export function PageHeader() {
  const pageHeader = usePageHeaderState();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const {
    title,
    subtitle,
    badge,
    showBackButton,
    onBack,
    actions: rawActions,
    docLink,
  } = pageHeader;

  const actions = React.useMemo(() => {
    const normalizedActions: React.ReactNode[] = [];

    if (docLink?.href) {
      normalizedActions.push(
        <Button
          key="doc-link"
          variant="ghost"
          size="sm"
          asChild
          className="h-9 gap-2 text-muted-foreground"
        >
          <a href={docLink.href} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            {docLink.label ?? 'Tài liệu' }
          </a>
        </Button>
      );
    }

    if (rawActions) {
      if (Array.isArray(rawActions)) {
        normalizedActions.push(...rawActions.filter(Boolean));
      } else {
        normalizedActions.push(rawActions);
      }
    }

    return normalizedActions;
  }, [docLink, rawActions]);

  // Don't render if no content
  if (!title && actions.length === 0 && !subtitle && !badge) {
    return null;
  }

  return (
    <div className="bg-background sticky top-16 z-20 border-b">
      {/* Mobile Layout */}
      {!isDesktop && (
        <div className="flex flex-col gap-2 px-4 py-2">
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
              <div className="flex items-center gap-2">
                {title && (
                  <h1 className="text-lg font-semibold tracking-tight truncate">
                    {title}
                  </h1>
                )}
                {badge}
              </div>
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {subtitle}
                </p>
              )}
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
        <div className="px-6 py-3">
          {/* Desktop: Title + Actions */}
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
                <div className="flex items-center gap-3">
                  {title && (
                    <h1 className="text-2xl font-semibold tracking-tight truncate">
                      {title}
                    </h1>
                  )}
                  {badge}
                </div>
                {subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {subtitle}
                  </p>
                )}
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
