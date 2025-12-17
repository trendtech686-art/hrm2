import * as React from "react";
import { Trash2, ChevronDown, ChevronsRight } from "lucide-react";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import { Card, CardContent } from "../ui/card";
import { MobileCardSkeleton } from "../mobile/skeleton";
import { EmptyState } from "../mobile/empty-state";
import { TouchButton } from "../mobile/touch-button";
import { cn } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.tsx";
import { DataTablePagination } from "./data-table-pagination.tsx";
import { Button } from "../ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { StickyScrollbar } from "./sticky-scrollbar.tsx";
import type { ColumnDef } from './types';

export interface BulkAction<TData> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onSelect: (selectedRows: TData[]) => void;
}

interface DesktopDataTableProps<TData extends { systemId: string }> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageCount: number;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (updater: React.SetStateAction<{ pageIndex: number; pageSize: number }>) => void;
  rowCount: number;
  rowSelection: Record<string, boolean>;
  setRowSelection: (updater: React.SetStateAction<Record<string, boolean>>) => void;
  onBulkDelete?: (() => void) | undefined;
  showBulkDeleteButton?: boolean | undefined;
  bulkActions?: BulkAction<TData>[] | undefined;
  pkgxBulkActions?: BulkAction<TData>[] | undefined;
  bulkActionButtons?: React.ReactNode | undefined;
  allSelectedRows: TData[];
  renderSubComponent?: ((row: TData) => React.ReactNode) | undefined;
  expanded: Record<string, boolean>;
  setExpanded: (updater: React.SetStateAction<Record<string, boolean>>) => void;
  sorting: { id: string; desc: boolean };
  setSorting: (updater: React.SetStateAction<{ id: string; desc: boolean }>) => void;
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  columnOrder: string[];
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
  pinnedColumns: string[];
  setPinnedColumns: React.Dispatch<React.SetStateAction<string[]>>;
  onRowClick?: ((row: TData) => void) | undefined;
  getRowStyle?: ((row: TData) => React.CSSProperties) | undefined;
  className?: string | undefined;
}

interface ResponsiveDataTableProps<TData extends { systemId: string }> {
  // Required props
  columns: ColumnDef<TData>[];
  data: TData[];
  
  // Mobile-specific
  renderMobileCard?: ((row: TData, index: number) => React.ReactNode) | undefined;
  mobileCardClassName?: string | undefined;
  autoGenerateMobileCards?: boolean | undefined;
  mobileVirtualized?: boolean | undefined;
  mobileRowHeight?: number | undefined;
  mobileListHeight?: number | undefined;
  
  // States
  isLoading?: boolean | undefined;
  emptyTitle?: string | undefined;
  emptyDescription?: string | undefined;
  emptyAction?: React.ReactNode | undefined;
  
  // Desktop DataTable props
  pageCount: number;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (updater: React.SetStateAction<{ pageIndex: number; pageSize: number }>) => void;
  rowCount: number;
  rowSelection?: Record<string, boolean> | undefined;
  setRowSelection?: ((updater: React.SetStateAction<Record<string, boolean>>) => void) | undefined;
  onBulkDelete?: (() => void) | undefined;
  showBulkDeleteButton?: boolean | undefined;
  bulkActions?: BulkAction<TData>[] | undefined;
  pkgxBulkActions?: BulkAction<TData>[] | undefined;
  bulkActionButtons?: React.ReactNode | undefined;
  allSelectedRows?: TData[] | undefined;
  renderSubComponent?: ((row: TData) => React.ReactNode) | undefined;
  expanded?: Record<string, boolean> | undefined;
  setExpanded?: ((updater: React.SetStateAction<Record<string, boolean>>) => void) | undefined;
  sorting: { id: string; desc: boolean };
  setSorting: (updater: React.SetStateAction<{ id: string; desc: boolean }>) => void;
  columnVisibility?: Record<string, boolean> | undefined;
  setColumnVisibility?: React.Dispatch<React.SetStateAction<Record<string, boolean>>> | undefined;
  columnOrder?: string[] | undefined;
  setColumnOrder?: React.Dispatch<React.SetStateAction<string[]>> | undefined;
  pinnedColumns?: string[] | undefined;
  setPinnedColumns?: React.Dispatch<React.SetStateAction<string[]>> | undefined;
  onRowClick?: ((row: TData) => void) | undefined;
  getRowStyle?: ((row: TData) => React.CSSProperties) | undefined;
  className?: string | undefined;
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
  autoGenerateMobileCards = true,
  mobileCardClassName,
  isLoading = false,
  emptyTitle = "Không có dữ liệu",
  emptyDescription,
  emptyAction,
  mobileVirtualized = false,
  mobileRowHeight = 180,
  mobileListHeight = 600,
  pageCount,
  pagination,
  setPagination,
  rowCount,
  rowSelection = {},
  setRowSelection = () => {},
  onBulkDelete,
  showBulkDeleteButton = true,
  bulkActions,
  pkgxBulkActions,
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
  const autoCardColumns = React.useMemo(() => {
    return columns
      .filter(column => {
        if (!column.id) return false;
        if (['select', 'control', 'actions', 'expander'].includes(column.id)) return false;
        if (columnVisibility && columnVisibility[column.id] === false) return false;
        const meta = column.meta as Record<string, any> | undefined;
        if (meta?.hideOnMobileCard) return false;
        return true;
      })
      .slice(0, 6);
  }, [columns, columnVisibility]);

  const getColumnLabel = React.useCallback((column: ColumnDef<TData>) => {
    if (typeof column.header === 'string') return column.header;
    const meta = column.meta as Record<string, any> | undefined;
    if (meta?.displayName) return meta.displayName;
    return column.id || '';
  }, []);

  const renderColumnValue = React.useCallback((column: ColumnDef<TData>, row: TData) => {
    if (typeof column.cell === 'function') {
      return column.cell({
        row,
        isSelected: false,
        isExpanded: false,
        onToggleSelect: () => {},
        onToggleExpand: () => {},
      } as any);
    }
    if (column.accessorKey) {
      const value = (row as any)[column.accessorKey as string];
      if (value === undefined || value === null) return '—';
      if (React.isValidElement(value)) return value;
      return String(value);
    }
    return '—';
  }, []);

  const autoRenderMobileCard = React.useCallback((row: TData) => (
    <MobileCardWrapper>
      <div className="space-y-3 text-sm">
        {autoCardColumns.map(column => (
          <div key={column.id}>
            <div className="text-xs uppercase text-muted-foreground font-semibold">
              {getColumnLabel(column)}
            </div>
            <div className="text-base font-medium text-foreground">
              {renderColumnValue(column, row)}
            </div>
          </div>
        ))}
      </div>
    </MobileCardWrapper>
  ), [autoCardColumns, getColumnLabel, renderColumnValue]);

  const hasAutoCardSupport = autoGenerateMobileCards !== false && autoCardColumns.length > 0;
  const cardRenderer = renderMobileCard ?? (hasAutoCardSupport ? autoRenderMobileCard : undefined);
  const shouldRenderMobileCards = Boolean(isMobile && cardRenderer);

  const desktopProps: DesktopDataTableProps<TData> = {
    columns,
    data,
    pageCount,
    pagination,
    setPagination,
    rowCount,
    rowSelection,
    setRowSelection,
    onBulkDelete,
    showBulkDeleteButton,
    bulkActions,
    pkgxBulkActions,
    bulkActionButtons,
    allSelectedRows,
    renderSubComponent,
    expanded,
    setExpanded,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
    pinnedColumns,
    setPinnedColumns,
    onRowClick,
    getRowStyle,
    className,
  };

  // Loading state
  if (isLoading) {
    return shouldRenderMobileCards ? (
      <MobileCardSkeleton count={pagination.pageSize || 10} className={mobileCardClassName} />
    ) : (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: pagination.pageSize || 10 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  // Empty state - only for mobile card mode
  if (data.length === 0 && shouldRenderMobileCards) {
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
  if (shouldRenderMobileCards && cardRenderer) {
    if (mobileVirtualized) {
      return (
        <div
          className={cn('pb-4', className)}
          style={{ maxHeight: mobileListHeight, overflowY: 'auto' }}
        >
          {data.map((row, index) => (
            <div
              key={row.systemId}
              className={mobileCardClassName}
              style={{ minHeight: mobileRowHeight }}
            >
              {cardRenderer(row, index)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={cn("space-y-3 pb-4", className)}>
        {data.map((row, index) => (
          <div key={row.systemId} className={mobileCardClassName}>
            {cardRenderer(row, index)}
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
  return <DesktopDataTable {...desktopProps} />;
}

function DesktopDataTable<TData extends { systemId: string }>({
  columns,
  data,
  pageCount,
  pagination,
  setPagination,
  rowCount,
  rowSelection,
  setRowSelection,
  onBulkDelete,
  showBulkDeleteButton = true,
  bulkActions,
  pkgxBulkActions,
  bulkActionButtons,
  allSelectedRows,
  renderSubComponent,
  expanded,
  setExpanded,
  sorting,
  setSorting,
  columnVisibility,
  setColumnVisibility,
  columnOrder,
  setColumnOrder,
  pinnedColumns,
  setPinnedColumns,
  onRowClick,
  getRowStyle,
  className,
}: DesktopDataTableProps<TData>) {
  const numSelected = Object.keys(rowSelection).length;
  const isAllPageRowsSelected = data.length > 0 && data.every(row => rowSelection[row.systemId]);
  const isSomePageRowsSelected = !isAllPageRowsSelected && data.some(row => rowSelection[row.systemId]);
  const hasData = data?.length > 0;
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const stickyCellBg = 'var(--sticky-column-bg, rgba(255, 255, 255, 1))';
  const stickyHeaderBg = 'var(--sticky-column-header-bg, var(--muted))';

  const handleToggleAllPageRows = (value: boolean) => {
    const newSelection = { ...rowSelection };
    data.forEach(row => {
      if (value) {
        newSelection[row.systemId] = true;
      } else {
        delete newSelection[row.systemId];
      }
    });
    setRowSelection(newSelection);
  };

  const displayColumns = React.useMemo(() => {
    const expanderColumn: ColumnDef<TData> | null = renderSubComponent
      ? {
          id: 'expander',
          header: () => null,
          cell: ({ isExpanded, onToggleExpand }) => (
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand();
                }}
                className="h-8 w-8"
              >
                <ChevronsRight className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')} />
              </Button>
            </div>
          ),
          size: 60,
          meta: { displayName: 'Mở rộng', sticky: 'left' },
        }
      : null;

    const allConfigurableColumns = expanderColumn ? [expanderColumn, ...columns] : [...columns];

    const visibleMasterCols = allConfigurableColumns.filter(col => {
      if (col.id === 'expander') return true;
      const isVisible = columnVisibility[col.id];
      return isVisible !== false;
    });

    const normalizedCols = visibleMasterCols.map(col => {
      if (['select', 'control'].includes(col.id)) {
        return {
          ...col,
          meta: { ...col.meta, sticky: 'left' as const },
        };
      }

      if (col.id === 'actions') {
        return {
          ...col,
          meta: { ...col.meta, sticky: 'right' as const },
        };
      }

      return col;
    });

    const staticLeftCols = normalizedCols.filter(c => {
      const meta = c.meta as any;
      return meta?.sticky === 'left' && !['select', 'control', 'expander'].includes(c.id);
    });
    const staticRightCols = normalizedCols.filter(c => (c.meta as any)?.sticky === 'right');
    const controlCols = normalizedCols.filter(c => ['select', 'control', 'expander'].includes(c.id));
    const bodyCols = normalizedCols.filter(c => {
      const meta = c.meta as any;
      return !meta?.sticky && !['select', 'control', 'expander'].includes(c.id);
    });

    const orderedBodyCols = [...bodyCols].sort((a, b) => {
      const indexA = columnOrder.indexOf(a.id);
      const indexB = columnOrder.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    const userPinnedCols = orderedBodyCols
      .filter(col => pinnedColumns.includes(col.id))
      .map(col => ({
        ...col,
        meta: { ...col.meta, sticky: 'left' as const }
      }));

    const nonPinnedBodyCols = orderedBodyCols.filter(c => !pinnedColumns.includes(c.id));

    return [
      ...controlCols,
      ...staticLeftCols,
      ...userPinnedCols,
      ...nonPinnedBodyCols,
      ...staticRightCols,
    ] as ColumnDef<TData>[];
  }, [columns, columnVisibility, columnOrder, pinnedColumns, renderSubComponent]);

  const leftStickyColumns = React.useMemo(() => displayColumns.filter(c => (c.meta as any)?.sticky === 'left'), [displayColumns]);
  const rightStickyColumns = React.useMemo(() => displayColumns.filter(c => (c.meta as any)?.sticky === 'right'), [displayColumns]);

  const getColumnWidth = React.useCallback((column: ColumnDef<TData>) => {
    return column.size ?? columnWidths[column.id] ?? ((column.meta as any)?.minWidth ?? 140);
  }, [columnWidths]);

  const leftOffsets = React.useMemo(() => {
      let offset = 0;
      return leftStickyColumns.map(c => {
          const width = getColumnWidth(c);
          const currentOffset = offset;
          offset += width;
          return currentOffset;
      });
  }, [leftStickyColumns, getColumnWidth]);

  const rightOffsets = React.useMemo(() => {
      let offset = 0;
      const reversedOffsets = [...rightStickyColumns].reverse().map(c => {
          const width = getColumnWidth(c);
          const currentOffset = offset;
          offset += width;
          return currentOffset;
      });
      return reversedOffsets.reverse();
  }, [rightStickyColumns, getColumnWidth]);

  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const headerScrollRef = React.useRef<HTMLDivElement>(null);
  const bodyTableRef = React.useRef<HTMLTableElement>(null);
  const headerTableRef = React.useRef<HTMLTableElement>(null);
  const fallbackTableRef = React.useCallback((node: HTMLTableElement | null) => {
    headerTableRef.current = node;
    bodyTableRef.current = node;
  }, []);

  const syncScroll = (source: 'header' | 'body') => {
    if (!headerScrollRef.current || !tableContainerRef.current) return;

    if (source === 'body') {
      headerScrollRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
    } else {
      tableContainerRef.current.scrollLeft = headerScrollRef.current.scrollLeft;
    }
  };

  React.useEffect(() => {
    if (!hasData) return;
    if (!headerTableRef.current) return;

    const syncWidths = () => {
      const bodyTable = bodyTableRef.current;
      const headerTable = headerTableRef.current;
      if (!headerTable) return;

      const bodyRow = bodyTable?.querySelector('tbody tr:first-child');
      const headerRow = headerTable.querySelector('thead tr:last-child');
      if (!headerRow) return;

      const bodyCells = bodyRow ? Array.from(bodyRow.querySelectorAll('td')) : [];
      const headerCells = Array.from(headerRow.querySelectorAll('th'));
      const nextWidthMap: Record<string, number> = {};

      displayColumns.forEach((column, index) => {
        const sourceCell = bodyCells[index];
        const fallbackCell = headerCells[index];
        const width = sourceCell?.getBoundingClientRect().width || fallbackCell?.getBoundingClientRect().width;
        if (width && headerCells[index]) {
          headerCells[index].style.width = `${width}px`;
          headerCells[index].style.minWidth = `${width}px`;
          headerCells[index].style.maxWidth = `${width}px`;
          nextWidthMap[column.id] = width;
        }
      });

      if (bodyTable) {
        headerTable.style.width = `${bodyTable.getBoundingClientRect().width}px`;
      }

      setColumnWidths(prev => {
        let changed = false;
        const updated = { ...prev };
        Object.entries(nextWidthMap).forEach(([key, width]) => {
          if (prev[key] !== width) {
            changed = true;
            updated[key] = width;
          }
        });
        return changed ? updated : prev;
      });
    };

    syncWidths();
    window.addEventListener('resize', syncWidths);

    const resizeObserver = new ResizeObserver(syncWidths);
    if (bodyTableRef.current) {
      resizeObserver.observe(bodyTableRef.current);
    }

    return () => {
      window.removeEventListener('resize', syncWidths);
      resizeObserver.disconnect();
    };
  }, [data, displayColumns, hasData]);

  const renderHeaderRow = (isSticky: boolean) => (
    <TableRow className="h-9">
      {displayColumns.map((column, colIndex) => {
        const stickyMeta = isSticky ? (column.meta as any)?.sticky : undefined;
        const hasFixedSize = column.size !== undefined;
        const fallbackMinWidth = (column.meta as any)?.minWidth ?? 140;

        const style: React.CSSProperties = {};

        if (hasFixedSize) {
          style.width = column.size;
          style.minWidth = column.size;
          style.maxWidth = column.size;
        } else {
          style.minWidth = fallbackMinWidth;
        }

        let thClassName = "bg-muted whitespace-nowrap";

        const isLastLeftSticky = stickyMeta === 'left' && colIndex === leftStickyColumns.length - 1;
        const isFirstRightSticky = stickyMeta === 'right' && colIndex === displayColumns.length - rightStickyColumns.length;

        if (isSticky && stickyMeta === 'left') {
          const stickyIndex = leftStickyColumns.findIndex(c => c.id === column.id);
          if (stickyIndex !== -1) {
            (style as any).position = 'sticky';
            (style as any).left = `${leftOffsets[stickyIndex]}px`;
            (style as any).top = 0;
            (style as any).backgroundColor = stickyHeaderBg;
            thClassName = cn(thClassName, "z-30 bg-muted shadow-sm");
          }
        } else if (isSticky && stickyMeta === 'right') {
          const stickyIndex = rightStickyColumns.findIndex(c => c.id === column.id);
          if (stickyIndex !== -1) {
            (style as any).position = 'sticky';
            (style as any).right = `${rightOffsets[stickyIndex]}px`;
            (style as any).top = 0;
            (style as any).backgroundColor = stickyHeaderBg;
            thClassName = cn(thClassName, "z-30 bg-muted shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]");
          }
        }

        if (['control', 'select', 'expander', 'actions'].includes(column.id)) {
          thClassName = cn(thClassName, "px-2 text-center");
        }

        return (
          <TableHead
            key={column.id}
            style={style}
            className={cn(thClassName, {
              "border-r": isSticky && isLastLeftSticky,
            })}
          >
            {typeof column.header === 'function'
              // @ts-ignore
              ? column.header({
                  isAllPageRowsSelected,
                  isSomePageRowsSelected,
                  onToggleAll: handleToggleAllPageRows,
                  sorting,
                  setSorting,
                })
              : column.header}
          </TableHead>
        );
      })}
    </TableRow>
  );

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {hasData ? (
        <>
          <div
            ref={headerScrollRef}
            onScroll={() => syncScroll('header')}
            className="sticky top-32 z-30 overflow-x-auto rounded-t-md border border-b-0 bg-muted [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <Table ref={headerTableRef}>
              <TableHeader className="bg-muted shadow-sm">
                {numSelected > 0 && (
                  <tr className="absolute inset-x-0 top-0 z-50 h-9 bg-muted/95 backdrop-blur-sm border-b shadow-md">
                    <th className="sticky left-0 z-[60] bg-muted/95 backdrop-blur-sm px-3 w-[48px]">
                      {columns.find(c => c.id === 'select') &&
                        typeof columns.find(c => c.id === 'select')!.header === 'function' &&
                        // @ts-ignore
                        columns.find(c => c.id === 'select')!.header({
                          isAllPageRowsSelected,
                          isSomePageRowsSelected,
                          onToggleAll: handleToggleAllPageRows,
                        })
                      }
                    </th>
                    <th className="sticky left-[48px] z-[60] h-9 bg-muted/95 backdrop-blur-sm">
                      <div className="flex items-center gap-3 px-4">
                        <span className="text-sm font-medium">{numSelected} mục đã chọn</span>
                        {bulkActions && bulkActions.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Action
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              {bulkActions.map((action, index) => (
                                <DropdownMenuItem
                                  key={index}
                                  onSelect={() => action.onSelect(allSelectedRows)}
                                  disabled={(action as any).disabled}
                                >
                                  {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        {pkgxBulkActions && pkgxBulkActions.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                PKGX
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              {pkgxBulkActions.map((action, index) => (
                                <DropdownMenuItem
                                  key={index}
                                  onSelect={() => action.onSelect(allSelectedRows)}
                                  disabled={(action as any).disabled}
                                  className={(action as any).variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
                                >
                                  {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        {bulkActionButtons}
                      </div>
                    </th>
                  </tr>
                )}
                {renderHeaderRow(true)}
              </TableHeader>
            </Table>
          </div>

          <div
            ref={tableContainerRef}
            onScroll={() => syncScroll('body')}
            className="rounded-b-md border bg-background overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <Table ref={bodyTableRef}>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <React.Fragment key={`${row.systemId}-${rowIndex}`}>
                    <TableRow
                      data-state={rowSelection[row.systemId] && "selected"}
                      onClick={() => onRowClick?.(row)}
                      className={cn('group', onRowClick && 'cursor-pointer')}
                      style={getRowStyle?.(row)}
                    >
                      {displayColumns.map((column, colIndex) => {
                        const isInteractiveColumn = ['select', 'control', 'actions', 'expander'].includes(column.id);

                        const stickyMeta = (column.meta as any)?.sticky;
                        const hasFixedSize = column.size !== undefined;
                        const fallbackMinWidth = (column.meta as any)?.minWidth ?? 140;

                        const style: React.CSSProperties = {};

                        if (hasFixedSize) {
                          style.width = column.size;
                          style.minWidth = column.size;
                          style.maxWidth = column.size;
                        } else {
                          style.minWidth = fallbackMinWidth;
                        }

                        let tdClassName = "";

                        const isLastLeftSticky = stickyMeta === 'left' && colIndex === leftStickyColumns.length - 1;

                        if (stickyMeta === 'left') {
                          const stickyIndex = leftStickyColumns.findIndex(c => c.id === column.id);
                          if (stickyIndex !== -1) {
                            (style as any).position = 'sticky';
                            (style as any).left = `${leftOffsets[stickyIndex]}px`;
                            const rowBgColor = getRowStyle?.(row)?.backgroundColor;
                            (style as any).backgroundColor = rowBgColor || stickyCellBg;
                            tdClassName = cn(
                              "z-20 shadow-[2px_0_6px_rgba(0,0,0,0.05)]",
                              "bg-muted text-foreground group-hover:bg-muted group-data-[state=selected]:bg-muted"
                            );
                          }
                        } else if (stickyMeta === 'right') {
                          const stickyIndex = rightStickyColumns.findIndex(c => c.id === column.id);
                          if (stickyIndex !== -1) {
                            (style as any).position = 'sticky';
                            (style as any).right = `${rightOffsets[stickyIndex]}px`;
                            const rowBgColor = getRowStyle?.(row)?.backgroundColor;
                            (style as any).backgroundColor = rowBgColor || stickyCellBg;
                            tdClassName = cn(
                              "z-20",
                              "bg-muted text-foreground group-hover:bg-muted group-data-[state=selected]:bg-muted shadow-[-2px_0_6px_rgba(0,0,0,0.08)]"
                            );
                          }
                        }

                        if (['control', 'select', 'expander', 'actions'].includes(column.id)) {
                          tdClassName = cn(tdClassName, "px-2 text-center");
                        }

                        return (
                          <TableCell
                            key={column.id}
                            style={style}
                            className={cn(tdClassName, {
                              "border-r": isLastLeftSticky,
                            })}
                            onClick={isInteractiveColumn ? (e) => e.stopPropagation() : undefined}
                          >
                            {column.cell({
                              row,
                              isSelected: !!rowSelection[row.systemId],
                              isExpanded: !!expanded[row.systemId],
                              onToggleSelect: (value) => {
                                setRowSelection(prev => {
                                  const newSelection = { ...prev };
                                  if (value) {
                                    newSelection[row.systemId] = true;
                                  } else {
                                    delete newSelection[row.systemId];
                                  }
                                  return newSelection;
                                });
                              },
                              onToggleExpand: () => setExpanded(prev => ({ ...prev, [row.systemId]: !prev[row.systemId] })),
                            })}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {expanded[row.systemId] && renderSubComponent && (
                      <TableRow>
                        <TableCell colSpan={displayColumns.length} className="p-0">
                          {renderSubComponent(row)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div
          ref={tableContainerRef}
          className="rounded-md border bg-background overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <Table ref={fallbackTableRef}>
            <TableHeader className="bg-muted shadow-sm">
              {renderHeaderRow(true)}
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={displayColumns.length} className="h-24 text-center">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex-shrink-0 border-t bg-background px-6 py-3">
        <DataTablePagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          pageCount={pageCount}
          setPageIndex={(index) => setPagination(p => ({ ...p, pageIndex: index }))}
          setPageSize={(size) => setPagination({ pageIndex: 0, pageSize: size })}
          canPreviousPage={pagination.pageIndex > 0}
          canNextPage={pagination.pageIndex < pageCount - 1}
          rowCount={rowCount}
          selectedRowCount={numSelected}
        />
      </div>

      <StickyScrollbar targetRef={tableContainerRef} />
    </div>
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
