import * as React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { usePageHeaderState } from '../../contexts/page-header-context';

/**
 * Page Header Component
 * Mobile-first responsive header với Shadcn UI design
 *
 * Mobile: Back button + Title + Badge + Actions (3-dot menu)
 * Desktop: Title/Subtitle + Badge + Actions inline
 */
export function PageHeader() {
  const pageHeader = usePageHeaderState();

  const {
    title,
    subtitle,
    badge,
    showBackButton,
    onBack,
    actions: rawActions,
    docLink,
  } = pageHeader;

  // Flatten React Fragments to handle nested components
  const flattenActions = React.useCallback((nodes: React.ReactNode[]): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    nodes.forEach(node => {
      if (React.isValidElement(node)) {
        if ((node as React.ReactElement).type === React.Fragment) {
          // @ts-expect-error - Fragment children handling
          const children = node.props?.children;
          if (Array.isArray(children)) {
            result.push(...flattenActions(children));
          } else if (children) {
            result.push(children);
          }
        } else {
          result.push(node);
        }
      }
    });
    return result;
  }, []);

  const actions = React.useMemo(() => {
    const normalizedActions: React.ReactNode[] = [];

    if (docLink?.href) {
      normalizedActions.push(
        <Button
          key="doc-link"
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 text-muted-foreground shrink-0"
        >
          <a href={docLink.href} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            {docLink.label ?? 'Tài liệu' }
          </a>
        </Button>
      );
    }

    if (rawActions) {
      const actionNodes = Array.isArray(rawActions) ? rawActions : [rawActions];
      const flattened = flattenActions(actionNodes.filter(Boolean) as React.ReactNode[]);
      normalizedActions.push(...flattened);
    }

    return normalizedActions;
  }, [docLink, rawActions, flattenActions]);

  // Don't render if no content
  if (!title && actions.length === 0 && !subtitle && !badge) {
    return null;
  }

  return (
    <div className="sticky top-0 md:top-16 z-20 bg-background border-b border-border">
      {/* Mobile layout - Native app feel with safe areas */}
      <div className="md:hidden -mx-4">
        <div className="px-4 pt-2 pb-2.5">
          {/* Safe area padding for iOS notch devices */}
          <div className="pt-safe">
            <div className="flex items-center gap-2 min-h-[44px]">
              {/* Back button - fixed width container for alignment */}
              <div className="w-10 shrink-0">
                {showBackButton && onBack && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="w-9 h-9 -ml-1 active:scale-95 transition-transform"
                    aria-label="Quay lại"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Title + Badge - flexible, takes remaining space */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <h1 className="text-base font-semibold tracking-tight text-foreground truncate">
                  {title}
                </h1>
                {badge}
              </div>

              {/* Actions - right aligned, auto width */}
              <div className="shrink-0">
                {actions.length > 0 && (
                  <div className="flex items-center gap-0.5">
                    {actions.map((action, index) => (
                      <React.Fragment key={`mobile-action-${index}`}>{action}</React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Subtitle - aligned with title, after back button space */}
            {subtitle && (
              <div className="flex items-center mt-0.5 pl-10">
                <p className="text-xs text-muted-foreground truncate">
                  {subtitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block -mx-6">
        <div className="px-6 py-1.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {showBackButton && onBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="w-9 shrink-0"
                  aria-label="Quay lại"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  {title && (
                    <h1 className="text-lg font-semibold tracking-tight text-foreground truncate">
                      {title}
                    </h1>
                  )}
                  {badge}
                </div>
                {subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {actions.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                {actions.map((action, index) => (
                  <React.Fragment key={`desktop-action-${index}`}>{action}</React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Page Header Skeleton
 * Loading state for page header
 */
export function PageHeaderSkeleton() {
  return (
    <div className="border-b border-border">
      {/* Mobile skeleton */}
      <div className="md:hidden -mx-4">
        <div className="px-4 pt-2 pb-2.5">
          <div className="pt-safe">
            <div className="flex items-center gap-2 min-h-[44px]">
              {/* Back button placeholder */}
              <div className="w-10 shrink-0">
                <div className="h-9 w-9 bg-muted animate-pulse rounded-lg" />
              </div>

              {/* Title + subtitle placeholder */}
              <div className="flex-1 min-w-0">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="h-3 w-48 bg-muted animate-pulse rounded mt-1.5" />
              </div>

              {/* Actions placeholder */}
              <div className="shrink-0">
                <div className="h-9 w-20 bg-muted animate-pulse rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop skeleton */}
      <div className="hidden md:block -mx-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              <div className="h-4 w-2 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-9 w-24 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
