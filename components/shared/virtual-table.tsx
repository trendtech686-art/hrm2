/**
 * Virtual Table Component
 * 
 * High-performance table using virtualization
 * Only renders visible rows for smooth scrolling with 1000+ items
 * 
 * @example
 * <VirtualTable
 *   data={orders}
 *   columns={columns}
 *   estimateSize={52}
 *   onRowClick={(row) => router.push(`/orders/${row.systemId}`)}
 * />
 */

'use client';

import { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';

export interface VirtualColumn<T> {
  /** Unique key for the column */
  key: string;
  /** Header label */
  header: string;
  /** Width (px or %) */
  width?: string | number;
  /** Min width in px */
  minWidth?: number;
  /** Render function */
  render: (row: T, index: number) => React.ReactNode;
  /** Header alignment */
  headerAlign?: 'left' | 'center' | 'right';
  /** Cell alignment */
  align?: 'left' | 'center' | 'right';
  /** Sticky column */
  sticky?: 'left' | 'right';
}

export interface VirtualTableProps<T> {
  /** Data array */
  data: T[];
  /** Column definitions */
  columns: VirtualColumn<T>[];
  /** Estimated row height in px */
  estimateSize?: number;
  /** Table height (default: 600px) */
  height?: number | string;
  /** Extra rows to render outside viewport */
  overscan?: number;
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Row key extractor */
  getRowKey?: (row: T, index: number) => string | number;
  /** Row class name */
  rowClassName?: string | ((row: T, index: number) => string);
  /** Empty state */
  emptyState?: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Show header */
  showHeader?: boolean;
}

export function VirtualTable<T>({
  data,
  columns,
  estimateSize = 52,
  height = 600,
  overscan = 10,
  onRowClick,
  getRowKey,
  rowClassName,
  emptyState,
  isLoading,
  showHeader = true,
}: VirtualTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualizer
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Calculate column widths
  const columnStyles = useMemo(() => {
    return columns.map(col => ({
      width: col.width || 'auto',
      minWidth: col.minWidth || 80,
      textAlign: col.align || 'left',
    }));
  }, [columns]);

  // Get row key
  const getKey = (row: T, index: number) => {
    if (getRowKey) return getRowKey(row, index);
    const rowRecord = row as Record<string, unknown>;
    return (rowRecord.systemId as string | number) || (rowRecord.id as string | number) || index;
  };

  // Get row class
  const getRowClass = (row: T, index: number) => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row, index);
    }
    return rowClassName || '';
  };

  // Empty state
  if (!isLoading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-100 border rounded-lg">
        {emptyState || (
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Không có dữ liệu</p>
            <p className="text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center bg-muted/50 border-b sticky top-0 z-10">
          {columns.map((col, colIdx) => (
            <div
              key={col.key}
              className={cn(
                'px-4 py-3 font-medium text-sm',
                col.headerAlign === 'center' && 'text-center',
                col.headerAlign === 'right' && 'text-right'
              )}
              style={{
                width: columnStyles[colIdx].width,
                minWidth: columnStyles[colIdx].minWidth,
                flex: columnStyles[colIdx].width === 'auto' ? 1 : 'none',
              }}
            >
              {col.header}
            </div>
          ))}
        </div>
      )}

      {/* Virtual List Container */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {/* Total height spacer */}
        <div
          className="relative w-full"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {/* Virtual rows */}
          {virtualItems.map(virtualRow => {
            const row = data[virtualRow.index];
            const key = getKey(row, virtualRow.index);

            return (
              <div
                key={key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={cn(
                  'absolute top-0 left-0 w-full flex items-center border-b',
                  'hover:bg-muted/50 transition-colors',
                  onRowClick && 'cursor-pointer',
                  virtualRow.index % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                  getRowClass(row, virtualRow.index)
                )}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  height: `${estimateSize}px`,
                }}
                onClick={() => onRowClick?.(row, virtualRow.index)}
              >
                {columns.map((col, colIdx) => (
                  <div
                    key={col.key}
                    className="px-4 py-2 truncate"
                    style={{
                      width: columnStyles[colIdx].width,
                      minWidth: columnStyles[colIdx].minWidth,
                      flex: columnStyles[colIdx].width === 'auto' ? 1 : 'none',
                      textAlign: columnStyles[colIdx].textAlign as React.CSSProperties['textAlign'],
                    }}
                  >
                    {col.render(row, virtualRow.index)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Simple Virtual List
 * For non-table virtualized lists
 */
export function VirtualList<T>({
  data,
  renderItem,
  estimateSize = 80,
  height = 600,
  overscan = 5,
  getItemKey,
  className,
}: {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimateSize?: number;
  height?: number | string;
  overscan?: number;
  getItemKey?: (item: T, index: number) => string | number;
  className?: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map(virtualItem => {
          const item = data[virtualItem.index];
          const key = getItemKey?.(item, virtualItem.index) ?? virtualItem.index;

          return (
            <div
              key={key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
