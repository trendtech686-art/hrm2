/**
 * Table Skeleton Component
 * 
 * Loading skeleton for data tables
 * Use with Suspense for streaming
 */

import { Skeleton } from '@/components/ui/skeleton';

export interface TableSkeletonProps {
  /** Number of rows to show */
  rows?: number;
  /** Number of columns */
  columns?: number;
  /** Show header skeleton */
  showHeader?: boolean;
  /** Show pagination skeleton */
  showPagination?: boolean;
}

export function TableSkeleton({
  rows = 10,
  columns = 5,
  showHeader = true,
  showPagination = true,
}: TableSkeletonProps) {
  return (
    <div className="w-full space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-75" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-30" />
          <Skeleton className="h-10 w-25" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <div className="overflow-hidden">
          {/* Header */}
          {showHeader && (
            <div className="flex items-center border-b bg-muted/50 h-12 px-4 gap-4">
              {Array.from({ length: columns }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-4"
                  style={{ width: `${100 / columns}%` }}
                />
              ))}
            </div>
          )}

          {/* Rows */}
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex items-center border-b h-14 px-4 gap-4"
            >
              {Array.from({ length: columns }).map((_, colIdx) => (
                <Skeleton
                  key={colIdx}
                  className="h-4"
                  style={{
                    width: colIdx === 0 ? '40%' : `${60 / (columns - 1)}%`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      {showPagination && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Card Grid Skeleton
 * For card-based layouts
 */
export function CardGridSkeleton({
  cards = 6,
  columns = 3,
}: {
  cards?: number;
  columns?: number;
}) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Detail Page Skeleton
 * For detail/edit pages
 */
export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-6">
          <Skeleton className="h-6 w-[150px]" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-6">
          <Skeleton className="h-6 w-[150px]" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="rounded-lg border p-6 space-y-4">
        <Skeleton className="h-6 w-[200px]" />
        <TableSkeleton rows={5} columns={4} showHeader showPagination={false} />
      </div>
    </div>
  );
}

/**
 * Form Skeleton
 * For forms
 */
export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: Math.ceil(fields / 2) }).map((_, rowIdx) => (
        <div key={rowIdx} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  );
}
