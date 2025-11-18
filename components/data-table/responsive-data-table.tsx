import * as React from "react";
import { DataTable } from "./data-table";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import { Card, CardContent } from "../ui/card";
import { MobileCardSkeleton } from "../mobile/skeleton";
import { EmptyState } from "../mobile/empty-state";
import { TouchButton } from "../mobile/touch-button";
import { cn } from "../../lib/utils";
import type { ColumnDef } from './types';

interface ResponsiveDataTableProps<TData extends { systemId: string }> {
  // Required props
  columns: ColumnDef<TData>[];
  data: TData[];
  
  // Mobile-specific
  renderMobileCard: (row: TData, index: number) => React.ReactNode;
  mobileCardClassName?: string;
  
  // States
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  
  // Desktop DataTable props
  pageCount: number;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (updater: React.SetStateAction<{ pageIndex: number; pageSize: number }>) => void;
  rowCount: number;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: (updater: React.SetStateAction<Record<string, boolean>>) => void;
  onBulkDelete?: () => void;
  showBulkDeleteButton?: boolean;
  bulkActions?: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onSelect: (selectedRows: TData[]) => void;
  }>;
  bulkActionButtons?: React.ReactNode;
  allSelectedRows?: TData[];
  renderSubComponent?: (row: TData) => React.ReactNode;
  expanded?: Record<string, boolean>;
  setExpanded?: (updater: React.SetStateAction<Record<string, boolean>>) => void;
  sorting: { id: string; desc: boolean };
  setSorting: (updater: React.SetStateAction<{ id: string; desc: boolean }>) => void;
  columnVisibility?: Record<string, boolean>;
  setColumnVisibility?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  columnOrder?: string[];
  setColumnOrder?: React.Dispatch<React.SetStateAction<string[]>>;
  pinnedColumns?: string[];
  setPinnedColumns?: React.Dispatch<React.SetStateAction<string[]>>;
  onRowClick?: (row: TData) => void;
  getRowStyle?: (row: TData) => React.CSSProperties;
  className?: string;
}

/**
 * ResponsiveDataTable - Auto-adaptive data display component
 * 
 * Desktop (>= 768px): Full-featured DataTable with sorting, filtering, bulk actions
 * Mobile (< 768px): Card-based layout with touch-friendly interactions
 * 
 * Features:
 * - Automatic responsive switching
 * - Loading states (skeleton)
 * - Empty states
 * - Mobile pagination
 * - Preserves functionality across breakpoints
 * 
 * @example
 * <ResponsiveDataTable
 *   columns={columns}
 *   data={employees}
 *   renderMobileCard={(employee) => <EmployeeCard employee={employee} />}
 *   pagination={pagination}
 *   setPagination={setPagination}
 *   // ... other props
 * />
 */
export function ResponsiveDataTable<TData extends { systemId: string }>({
  columns,
  data,
  renderMobileCard,
  mobileCardClassName,
  isLoading = false,
  emptyTitle = "Không có dữ liệu",
  emptyDescription,
  emptyAction,
  pageCount,
  pagination,
  setPagination,
  rowCount,
  rowSelection = {},
  setRowSelection = () => {},
  onBulkDelete,
  showBulkDeleteButton = true,
  bulkActions,
  bulkActionButtons,
  allSelectedRows = [],
  renderSubComponent,
  expanded = {},
  setExpanded = () => {},
  sorting,
  setSorting,
  columnVisibility = {},
  setColumnVisibility = () => {},
  columnOrder = [],
  setColumnOrder = () => {},
  pinnedColumns = [],
  setPinnedColumns = () => {},
  onRowClick,
  getRowStyle,
  className,
}: ResponsiveDataTableProps<TData>) {
  const { isMobile } = useBreakpoint();

  // Loading state
  if (isLoading) {
    return isMobile ? (
      <MobileCardSkeleton count={pagination.pageSize || 10} className={mobileCardClassName} />
    ) : (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: pagination.pageSize || 10 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  // Empty state - only for mobile
  if (data.length === 0 && isMobile) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        className={className}
      />
    );
  }

  // Mobile card layout
  if (isMobile) {
    return (
      <div className={cn("space-y-3 pb-4", className)}>
        {data.map((row, index) => (
          <div key={row.systemId} className={mobileCardClassName}>
            {renderMobileCard(row, index)}
          </div>
        ))}

        {/* Mobile Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <TouchButton
              variant="outline"
              size="sm"
              onClick={() => setPagination(p => ({ ...p, pageIndex: Math.max(0, p.pageIndex - 1) }))}
              disabled={pagination.pageIndex === 0}
            >
              Trước
            </TouchButton>
            
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium">
                Trang {pagination.pageIndex + 1} / {pageCount}
              </span>
              <span className="text-xs text-muted-foreground">
                {rowCount} kết quả
              </span>
            </div>
            
            <TouchButton
              variant="outline"
              size="sm"
              onClick={() => setPagination(p => ({ ...p, pageIndex: Math.min(pageCount - 1, p.pageIndex + 1) }))}
              disabled={pagination.pageIndex >= pageCount - 1}
            >
              Sau
            </TouchButton>
          </div>
        )}
      </div>
    );
  }

  // Desktop table layout
  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      pagination={pagination}
      setPagination={setPagination}
      rowCount={rowCount}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      onBulkDelete={onBulkDelete}
      showBulkDeleteButton={showBulkDeleteButton}
      bulkActions={bulkActions}
      bulkActionButtons={bulkActionButtons}
      allSelectedRows={allSelectedRows}
      renderSubComponent={renderSubComponent}
      expanded={expanded}
      setExpanded={setExpanded}
      sorting={sorting}
      setSorting={setSorting}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
      pinnedColumns={pinnedColumns}
      setPinnedColumns={setPinnedColumns}
      onRowClick={onRowClick}
      getRowStyle={getRowStyle}
      className={className}
    />
  );
}

/**
 * MobileCardWrapper - Helper component for consistent mobile card styling
 */
export function MobileCardWrapper({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}
