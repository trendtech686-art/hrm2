/**
 * Shared loading skeletons for route segments.
 * Import the appropriate skeleton in each loading.tsx.
 */

/** Spinner for detail / edit / new pages */
export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted/60 animate-pulse rounded" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-40 bg-muted/40 animate-pulse rounded-lg" />
        <div className="h-40 bg-muted/40 animate-pulse rounded-lg" />
      </div>
      <div className="h-60 bg-muted/30 animate-pulse rounded-lg" />
    </div>
  )
}

/** Skeleton for settings pages */
export function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-6 w-40 bg-muted animate-pulse rounded" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-muted/40 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  )
}
