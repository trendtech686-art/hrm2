import * as React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Skeleton - Base skeleton loading component
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

/**
 * MobileCardSkeleton - Loading placeholder for mobile cards
 */
export function MobileCardSkeleton({ 
  count = 3,
  className 
}: { 
  count?: number | undefined;
  className?: string | undefined;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className={cn("overflow-hidden", className)}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {/* Avatar skeleton */}
              <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
              
              {/* Content skeleton */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="space-y-1.5 pt-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </div>
            
            {/* Footer skeleton */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

/**
 * TableSkeleton - Loading placeholder for tables
 */
export function TableSkeleton({ 
  rows = 5,
  columns = 4 
}: { 
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex}>
              <Skeleton 
                className={cn(
                  "h-9",
                  colIndex === 0 ? "w-1/4" : "flex-1"
                )}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * CardGridSkeleton - Loading placeholder for card grids
 */
export function CardGridSkeleton({
  count = 4,
  columns = 4
}: {
  count?: number;
  columns?: number;
}) {
  return (
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * FormSkeleton - Loading placeholder for forms
 */
export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <div className="flex justify-end space-x-2 pt-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

/**
 * ChartSkeleton - Loading placeholder for charts
 */
export function ChartSkeleton({ height = "300px" }: { height?: string }) {
  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between h-full space-x-2 pb-4">
        {[40, 70, 55, 80, 60, 90, 45].map((h, i) => (
          <div key={i} className="flex-1" style={{ height: `${h}%` }}>
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * PageSkeleton - Loading placeholder for full pages
 */
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      {/* Actions */}
      <div className="flex justify-between">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-32" />
      </div>
      
      {/* Content */}
      <CardGridSkeleton count={6} />
    </div>
  );
}
