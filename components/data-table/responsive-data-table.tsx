import * as React from "react";
import { ChevronDown, ChevronsRight, ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import { MobileCard, MobileCardBody, MobileCardHeader } from "../mobile/mobile-card";
import { MobileCardSkeleton } from "../mobile/skeleton";
import { EmptyState } from "../mobile/empty-state";
import { cn } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { StickyScrollbar } from "./sticky-scrollbar";
import type { ColumnDef } from './types';

// Extended column meta type for internal use
interface ColumnMeta {
  displayName?: string;
  sticky?: 'left' | 'right';
  group?: string;
  excludeFromExport?: boolean;
  hideOnMobileCard?: boolean;
  minWidth?: number;
}

// Inline sortable header cell for columns with enableSorting + string header
function SortableHeaderCell({
  title,
  columnId,
  sorting,
  setSorting,
}: {
  title: string;
  columnId: string;
  sorting: { id: string; desc: boolean };
  setSorting: (updater: React.SetStateAction<{ id: string; desc: boolean }>) => void;
}) {
  const isSorted = sorting.id === columnId;
  const handleClick = () => {
    if (isSorted) {
      setSorting(prev => ({ ...prev, desc: !prev.desc }));
    } else {
      setSorting({ id: columnId, desc: true });
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer select-none"
    >
      <span>{title}</span>
      {isSorted ? (
        sorting.desc ? <ArrowDown className="h-3.5 w-3.5 text-primary" /> : <ArrowUp className="h-3.5 w-3.5 text-primary" />
      ) : (
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/30" />
      )}
    </button>
  );
}

export interface BulkAction<TData> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onSelect: (selectedRows: TData[]) => void;
}

// Extended BulkAction type for additional properties
interface BulkActionExtended<TData> extends BulkAction<TData> {
  disabled?: boolean;
  variant?: 'default' | 'destructive';
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
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>> | ((value: Record<string, boolean>) => void);
  columnOrder: string[];
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>> | ((value: string[]) => void);
  pinnedColumns: string[];
  setPinnedColumns: React.Dispatch<React.SetStateAction<string[]>> | ((value: string[]) => void);
  onRowClick?: ((row: TData) => void) | undefined;
  onRowHover?: ((row: TData) => void) | undefined;
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
  /** Enable mobile infinite scroll — accumulates data across pages, auto-loads on scroll */
  mobileInfiniteScroll?: boolean | undefined;
  
  // Desktop virtualization (for large datasets without server-side pagination)
  /** Enable virtual scrolling for desktop table when data > virtualThreshold */
  desktopVirtualized?: boolean | undefined;
  /** Threshold to auto-enable virtualization (default: 100 rows) */
  virtualThreshold?: number | undefined;
  /** Height of virtual scroll container (default: 600px) */
  virtualHeight?: number | undefined;
  /** Estimated row height for virtualization (default: 53px) */
  virtualRowHeight?: number | undefined;
  
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
  setColumnVisibility?: (React.Dispatch<React.SetStateAction<Record<string, boolean>>> | ((value: Record<string, boolean>) => void)) | undefined;
  columnOrder?: string[] | undefined;
  setColumnOrder?: (React.Dispatch<React.SetStateAction<string[]>> | ((value: string[]) => void)) | undefined;
  pinnedColumns?: string[] | undefined;
  setPinnedColumns?: (React.Dispatch<React.SetStateAction<string[]>> | ((value: string[]) => void)) | undefined;
  onRowClick?: ((row: TData) => void) | undefined;
  onRowHover?: ((row: TData) => void) | undefined;
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

// Stable default values to prevent infinite re-render loops
const EMPTY_SELECTION: Record<string, boolean> = {};
const EMPTY_VISIBILITY: Record<string, boolean> = {};
const EMPTY_EXPANDED: Record<string, boolean> = {};
const EMPTY_COLUMN_ORDER: string[] = [];
const EMPTY_PINNED: string[] = [];
const NOOP = () => {};

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
  mobileInfiniteScroll = false,
  // Desktop virtualization (future use for large client-side datasets)
  desktopVirtualized: _desktopVirtualized = false,
  virtualThreshold: _virtualThreshold = 100,
  virtualHeight: _virtualHeight = 600,
  virtualRowHeight: _virtualRowHeight = 53,
  pageCount,
  pagination,
  setPagination,
  rowCount,
  rowSelection = EMPTY_SELECTION,
  setRowSelection = NOOP,
  onBulkDelete,
  showBulkDeleteButton = true,
  bulkActions,
  pkgxBulkActions,
  bulkActionButtons,
  allSelectedRows = [],
  renderSubComponent,
  expanded = EMPTY_EXPANDED,
  setExpanded = NOOP,
  sorting,
  setSorting,
  columnVisibility = EMPTY_VISIBILITY,
  setColumnVisibility = NOOP,
  columnOrder = EMPTY_COLUMN_ORDER,
  setColumnOrder = NOOP,
  pinnedColumns = EMPTY_PINNED,
  setPinnedColumns = NOOP,
  onRowClick,
  onRowHover,
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
        const meta = column.meta as ColumnMeta | undefined;
        if (meta?.hideOnMobileCard) return false;
        return true;
      })
      .slice(0, 6);
  }, [columns, columnVisibility]);

  const getColumnLabel = React.useCallback((column: ColumnDef<TData>) => {
    if (typeof column.header === 'string') return column.header;
    const meta = column.meta as ColumnMeta | undefined;
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
      });
    }
    if (column.accessorKey) {
      const value = row[column.accessorKey];
      if (value === undefined || value === null) return '—';
      if (React.isValidElement(value)) return value;
      return String(value);
    }
    return '—';
  }, []);

  // Auto-render mobile card — chuẩn hóa theo pattern Tồn kho:
  //  - Cột đầu = header title (label uppercase xs + value font-semibold sm)
  //  - Các cột còn lại = body grid-cols-2 dt/dd, cột cuối col-span-2 nếu lẻ
  //  - Dùng `MobileCard` primitive (rounded-xl border-border/50 p-4)
  const autoRenderMobileCard = React.useCallback((row: TData) => {
    const [firstCol, ...restCols] = autoCardColumns;
    if (!firstCol) return null;
    const clickable = typeof onRowClick === 'function';
    const handleTap = () => { if (clickable) onRowClick?.(row); };
    const rowProps = clickable
      ? {
          role: 'button' as const,
          tabIndex: 0,
          onClick: handleTap,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTap();
            }
          },
        }
      : {};
    return (
      <MobileCard inert={!clickable} {...rowProps}>
        <MobileCardHeader className="items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {getColumnLabel(firstCol)}
            </div>
            <div className="mt-0.5 text-sm font-semibold text-foreground wrap-break-word">
              {renderColumnValue(firstCol, row)}
            </div>
          </div>
        </MobileCardHeader>
        {restCols.length > 0 && (
          <MobileCardBody>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
              {restCols.map((column, idx) => {
                const span2 = idx === restCols.length - 1 && restCols.length % 2 === 1;
                return (
                  <div key={column.id} className={cn('min-w-0', span2 && 'col-span-2')}>
                    <dt className="text-xs text-muted-foreground">{getColumnLabel(column)}</dt>
                    <dd className="font-medium wrap-break-word">{renderColumnValue(column, row)}</dd>
                  </div>
                );
              })}
            </dl>
          </MobileCardBody>
        )}
      </MobileCard>
    );
  }, [autoCardColumns, getColumnLabel, renderColumnValue, onRowClick]);

  const hasAutoCardSupport = autoGenerateMobileCards !== false && autoCardColumns.length > 0;
  const cardRenderer = renderMobileCard ?? (hasAutoCardSupport ? autoRenderMobileCard : undefined);
  const shouldRenderMobileCards = Boolean(isMobile && cardRenderer);

  // --- Infinite scroll for mobile (server-side pagination) ---
  const [accumulatedData, setAccumulatedData] = React.useState<TData[]>(data);
  const lastPageIndexRef = React.useRef(pagination?.pageIndex ?? 0);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  React.useEffect(() => {
    if (!mobileInfiniteScroll || !shouldRenderMobileCards) return;

    const currentPageIndex = pagination?.pageIndex ?? 0;

    if (currentPageIndex === 0) {
      setAccumulatedData(data);
    } else if (currentPageIndex > lastPageIndexRef.current) {
      setAccumulatedData(prev => {
        const existingIds = new Set(prev.map(d => d.systemId));
        const newItems = data.filter(d => !existingIds.has(d.systemId));
        return [...prev, ...newItems];
      });
    }

    lastPageIndexRef.current = currentPageIndex;
    setIsLoadingMore(false);
  }, [data, pagination?.pageIndex, mobileInfiniteScroll, shouldRenderMobileCards]);

  React.useEffect(() => {
    if (!mobileInfiniteScroll || !shouldRenderMobileCards) return;

    const currentPageIndex = pagination?.pageIndex ?? 0;
    const totalPages = pageCount ?? 1;

    const handleScroll = () => {
      if (isLoadingMore) return;
      if (currentPageIndex >= totalPages - 1) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        setIsLoadingMore(true);
        setPagination(p => ({ ...p, pageIndex: p.pageIndex + 1 }));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileInfiniteScroll, shouldRenderMobileCards, pagination?.pageIndex, pageCount, isLoadingMore, setPagination]);

  const mobileData = mobileInfiniteScroll && shouldRenderMobileCards ? accumulatedData : data;
  const _hasMorePages = (pagination?.pageIndex ?? 0) < (pageCount ?? 1) - 1;
  // --- End infinite scroll ---

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
    onRowHover,
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
      // Mobile: cards nằm trong safe padding `px-4` của MainLayout (có breathing room
      // hai bên), gap dọc 12px (space-y-3) chuẩn iOS/Android list. Desktop giữ nguyên.
      <div
        className={cn(
          "space-y-3 px-0 md:px-1 pb-4",
          className,
        )}
      >
        {mobileData.map((row, index) => (
          <div key={row.systemId} className={mobileCardClassName}>
            {cardRenderer(row, index)}
          </div>
        ))}

        {mobileInfiniteScroll && isLoadingMore && (
          <div className="py-4 text-center">
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {rowCount > 0 && (
          <div className="py-3 text-center">
            <span className="text-xs text-muted-foreground">
              Hiển thị {mobileData.length} / {rowCount} kết quả
            </span>
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
  onBulkDelete: _onBulkDelete,
  showBulkDeleteButton: _showBulkDeleteButton = true,
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
  setColumnVisibility: _setColumnVisibility,
  columnOrder,
  setColumnOrder: _setColumnOrder,
  pinnedColumns,
  setPinnedColumns: _setPinnedColumns,
  onRowClick,
  onRowHover,
  getRowStyle,
  className,
}: DesktopDataTableProps<TData>) {
  const numSelected = Object.keys(rowSelection).length;
  const isAllPageRowsSelected = data.length > 0 && data.every(row => rowSelection[row.systemId]);
  const isSomePageRowsSelected = !isAllPageRowsSelected && data.some(row => rowSelection[row.systemId]);
  const hasData = data?.length > 0;
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [columnSizing, setColumnSizing] = React.useState<Record<string, number>>({});
  const columnSizingRef = React.useRef<Record<string, number>>({});
  const isResizingRef = React.useRef(false);
  const stickyCellBg = 'var(--sticky-column-bg, rgba(255, 255, 255, 1))';
  const stickyHeaderBg = 'var(--sticky-column-header-bg, var(--muted))';

  const handleSetPageIndex = React.useCallback((index: number) => {
    setPagination(p => p.pageIndex === index ? p : ({ ...p, pageIndex: index }));
  }, [setPagination]);

  const handleSetPageSize = React.useCallback((size: number) => {
    setPagination(p => p.pageIndex === 0 && p.pageSize === size ? p : { pageIndex: 0, pageSize: size });
  }, [setPagination]);

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
      const meta = c.meta as ColumnMeta | undefined;
      return meta?.sticky === 'left' && !['select', 'control', 'expander'].includes(c.id);
    });
    const staticRightCols = normalizedCols.filter(c => (c.meta as ColumnMeta | undefined)?.sticky === 'right');
    const controlCols = normalizedCols.filter(c => ['select', 'control', 'expander'].includes(c.id));
    const bodyCols = normalizedCols.filter(c => {
      const meta = c.meta as ColumnMeta | undefined;
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

  const leftStickyColumns = React.useMemo(() => displayColumns.filter(c => (c.meta as ColumnMeta | undefined)?.sticky === 'left'), [displayColumns]);
  const rightStickyColumns = React.useMemo(() => displayColumns.filter(c => (c.meta as ColumnMeta | undefined)?.sticky === 'right'), [displayColumns]);

  const getColumnWidth = React.useCallback((column: ColumnDef<TData>) => {
    if (columnSizing[column.id]) return columnSizing[column.id];
    return column.size ?? columnWidths[column.id] ?? ((column.meta as ColumnMeta | undefined)?.minWidth ?? 140);
  }, [columnSizing, columnWidths]);

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

  // Column resize: DOM-direct for zero-lag, commit to state on mouseup
  const applyColumnWidth = React.useCallback((columnId: string, width: number) => {
    // Apply via DOM to both header and body tables
    const allTables = [headerTableRef.current, bodyTableRef.current].filter(Boolean);
    for (const table of allTables) {
      if (!table) continue;
      const cells = table.querySelectorAll(`[data-col-id="${columnId}"]`);
      cells.forEach((cell) => {
        const el = cell as HTMLElement;
        el.style.width = `${width}px`;
        el.style.minWidth = `${width}px`;
        el.style.maxWidth = `${width}px`;
      });
    }
  }, []);

  const handleResizeStart = React.useCallback((e: React.MouseEvent, columnId: string, currentWidth: number) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = currentWidth;
    isResizingRef.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff);
      columnSizingRef.current = { ...columnSizingRef.current, [columnId]: newWidth };
      applyColumnWidth(columnId, newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      isResizingRef.current = false;
      // Commit to state (single re-render)
      setColumnSizing({ ...columnSizingRef.current });
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [applyColumnWidth]);

  // Double-click: auto-fit column to content width
  const handleResizeDoubleClick = React.useCallback((columnId: string) => {
    const bodyTable = bodyTableRef.current;
    if (!bodyTable) return;
    const cells = bodyTable.querySelectorAll(`td[data-col-id="${columnId}"]`);
    let maxWidth = 80; // minimum
    cells.forEach((cell) => {
      const child = cell.firstElementChild as HTMLElement | null;
      if (child) {
        // Temporarily remove width constraints to measure natural width
        const prevOverflow = child.style.overflow;
        const prevWhiteSpace = child.style.whiteSpace;
        child.style.overflow = 'visible';
        child.style.whiteSpace = 'nowrap';
        maxWidth = Math.max(maxWidth, child.scrollWidth + 24); // 24px padding
        child.style.overflow = prevOverflow;
        child.style.whiteSpace = prevWhiteSpace;
      } else {
        maxWidth = Math.max(maxWidth, (cell as HTMLElement).scrollWidth + 16);
      }
    });
    // Also check header text width
    const headerCell = headerTableRef.current?.querySelector(`th[data-col-id="${columnId}"]`);
    if (headerCell) {
      maxWidth = Math.max(maxWidth, (headerCell as HTMLElement).scrollWidth + 24);
    }
    const finalWidth = Math.min(maxWidth, 600); // cap at 600px
    columnSizingRef.current = { ...columnSizingRef.current, [columnId]: finalWidth };
    setColumnSizing({ ...columnSizingRef.current });
  }, []);

  React.useEffect(() => {
    if (!hasData) return;
    if (!headerTableRef.current) return;

    let rafId: number | null = null;

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
        // Skip columns that user has resized
        if (columnSizing[column.id]) return;
        const sourceCell = bodyCells[index];
        const fallbackCell = headerCells[index];
        const rawWidth = sourceCell?.getBoundingClientRect().width || fallbackCell?.getBoundingClientRect().width;
        const width = rawWidth ? Math.round(rawWidth) : 0;
        if (width && headerCells[index]) {
          headerCells[index].style.width = `${width}px`;
          headerCells[index].style.minWidth = `${width}px`;
          headerCells[index].style.maxWidth = `${width}px`;
          nextWidthMap[column.id] = width;
        }
      });

      if (bodyTable) {
        headerTable.style.width = `${Math.round(bodyTable.getBoundingClientRect().width)}px`;
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

    const debouncedSync = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncWidths);
    };

    debouncedSync();
    window.addEventListener('resize', debouncedSync);

    const resizeObserver = new ResizeObserver(debouncedSync);
    if (bodyTableRef.current) {
      resizeObserver.observe(bodyTableRef.current);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', debouncedSync);
      resizeObserver.disconnect();
    };
  }, [data, displayColumns, hasData, columnSizing]);

  const renderHeaderRow = (isSticky: boolean) => (
    <TableRow className="h-9">
      {displayColumns.map((column, colIndex) => {
        const stickyMeta = isSticky ? (column.meta as ColumnMeta | undefined)?.sticky : undefined;
        const hasFixedSize = column.size !== undefined;
        const fallbackMinWidth = (column.meta as ColumnMeta | undefined)?.minWidth ?? 140;
        const userWidth = columnSizing[column.id];
        const isFixedColumn = ['control', 'select', 'expander', 'actions'].includes(column.id);

        const style: React.CSSProperties = {};

        if (userWidth) {
          style.width = userWidth;
          style.minWidth = userWidth;
          style.maxWidth = userWidth;
        } else if (hasFixedSize) {
          style.width = column.size;
          style.minWidth = column.size;
          style.maxWidth = column.size;
        } else {
          style.minWidth = fallbackMinWidth;
        }

        let thClassName = "bg-muted whitespace-nowrap relative";

        const isLastLeftSticky = stickyMeta === 'left' && colIndex === leftStickyColumns.length - 1;
        const _isFirstRightSticky = stickyMeta === 'right' && colIndex === displayColumns.length - rightStickyColumns.length;

        if (isSticky && stickyMeta === 'left') {
          const stickyIndex = leftStickyColumns.findIndex(c => c.id === column.id);
          if (stickyIndex !== -1) {
            style.position = 'sticky';
            style.left = `${leftOffsets[stickyIndex]}px`;
            style.top = 0;
            style.backgroundColor = stickyHeaderBg;
            thClassName = cn(thClassName, "z-30 bg-muted shadow-sm");
          }
        } else if (isSticky && stickyMeta === 'right') {
          const stickyIndex = rightStickyColumns.findIndex(c => c.id === column.id);
          if (stickyIndex !== -1) {
            style.position = 'sticky';
            style.right = `${rightOffsets[stickyIndex]}px`;
            style.top = 0;
            style.backgroundColor = stickyHeaderBg;
            thClassName = cn(thClassName, "z-30 bg-muted shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]");
          }
        }

        if (isFixedColumn) {
          thClassName = cn(thClassName, "px-2 text-center");
        }

        const currentWidth = userWidth || column.size || columnWidths[column.id] || fallbackMinWidth;

        return (
          <TableHead
            key={column.id}
            data-col-id={column.id}
            style={style}
            className={cn(thClassName, {
              "border-r border-border": isSticky && isLastLeftSticky,
            })}
          >
            {typeof column.header === 'function'
              ? column.header({
                  isAllPageRowsSelected,
                  isSomePageRowsSelected,
                  onToggleAll: handleToggleAllPageRows,
                  sorting,
                  setSorting,
                })
              : column.enableSorting && typeof column.header === 'string' && sorting && setSorting
                ? <SortableHeaderCell
                    title={column.header}
                    columnId={column.id}
                    sorting={sorting}
                    setSorting={setSorting}
                  />
                : column.header}
            {/* Resize handle */}
            {!isFixedColumn && (
              <div
                role="separator"
                aria-orientation="vertical"
                onMouseDown={(e) => handleResizeStart(e, column.id, currentWidth)}
                onDoubleClick={() => handleResizeDoubleClick(column.id)}
                className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize group/resize z-40 flex items-center justify-center"
                style={{ touchAction: 'none' }}
              >
                <div className="h-4 w-0.5 rounded-full bg-transparent group-hover/resize:bg-primary/50 transition-colors" />
              </div>
            )}
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
            className="sticky top-28 z-15 overflow-x-auto rounded-t-md border border-border border-b-0 bg-muted shadow-[0_2px_8px_rgba(0,0,0,0.08)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <Table ref={headerTableRef} containerClassName="!overflow-visible" style={Object.keys(columnSizing).length > 0 ? { tableLayout: 'fixed' } : undefined}>
              <TableHeader className="bg-muted">
                {numSelected > 0 && (
                  <tr className="absolute inset-x-0 top-0 z-50 h-9 bg-muted border-b border-border shadow-md">
                    <th className="sticky left-0 z-60 bg-muted px-3 w-12">
                      {columns.find(c => c.id === 'select') &&
                        typeof columns.find(c => c.id === 'select')!.header === 'function' &&
                        // @ts-expect-error - header function type is complex with selection props
                        columns.find(c => c.id === 'select')!.header({
                          isAllPageRowsSelected,
                          isSomePageRowsSelected,
                          onToggleAll: handleToggleAllPageRows,
                        })
                      }
                    </th>
                    <th className="sticky left-12 z-60 h-9 bg-muted">
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
                                  disabled={(action as BulkActionExtended<TData>).disabled}
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
                                  disabled={(action as BulkActionExtended<TData>).disabled}
                                  className={(action as BulkActionExtended<TData>).variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
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
            className="rounded-b-md border border-border bg-background overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <Table ref={bodyTableRef} containerClassName="!overflow-visible" style={Object.keys(columnSizing).length > 0 ? { tableLayout: 'fixed' } : undefined}>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <React.Fragment key={`${row.systemId}-${rowIndex}`}>
                    <TableRow
                      data-state={rowSelection[row.systemId] && "selected"}
                      onClick={() => onRowClick?.(row)}
                      onMouseEnter={() => onRowHover?.(row)}
                      className={cn('group', onRowClick && 'cursor-pointer')}
                      style={getRowStyle?.(row)}
                    >
                      {displayColumns.map((column, colIndex) => {
                        const isInteractiveColumn = ['select', 'control', 'actions', 'expander', 'pkgx', 'pkgxActions'].includes(column.id);

                        const stickyMeta = (column.meta as ColumnMeta | undefined)?.sticky;
                        const hasFixedSize = column.size !== undefined;
                        const fallbackMinWidth = (column.meta as ColumnMeta | undefined)?.minWidth ?? 140;
                        const userWidth = columnSizing[column.id];

                        const style: React.CSSProperties = {};

                        if (userWidth) {
                          style.width = userWidth;
                          style.minWidth = userWidth;
                          style.maxWidth = userWidth;
                        } else if (hasFixedSize) {
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
                            style.position = 'sticky';
                            style.left = `${leftOffsets[stickyIndex]}px`;
                            const rowBgColor = getRowStyle?.(row)?.backgroundColor;
                            style.backgroundColor = rowBgColor || stickyCellBg;
                            tdClassName = cn(
                              "z-10 shadow-[2px_0_6px_rgba(0,0,0,0.05)]",
                              "bg-muted text-foreground group-hover:bg-muted group-data-[state=selected]:bg-muted"
                            );
                          }
                        } else if (stickyMeta === 'right') {
                          const stickyIndex = rightStickyColumns.findIndex(c => c.id === column.id);
                          if (stickyIndex !== -1) {
                            style.position = 'sticky';
                            style.right = `${rightOffsets[stickyIndex]}px`;
                            const rowBgColor = getRowStyle?.(row)?.backgroundColor;
                            style.backgroundColor = rowBgColor || stickyCellBg;
                            tdClassName = cn(
                              "z-10",
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
                            data-col-id={column.id}
                            style={style}
                            className={cn(tdClassName, {
                              "border-r border-border": isLastLeftSticky,
                            })}
                            onClick={isInteractiveColumn ? (e) => e.stopPropagation() : undefined}
                          >
                            <div className={userWidth ? "overflow-hidden text-ellipsis whitespace-nowrap" : undefined}>
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
                            </div>
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
          className="rounded-md border border-border bg-background overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <Table ref={fallbackTableRef} containerClassName="!overflow-visible">
            <TableHeader className="bg-muted shadow-sm">
              {renderHeaderRow(true)}
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={displayColumns.length} className="h-[240px] text-center align-middle text-muted-foreground">
                  <div className="flex min-h-[200px] flex-col items-center justify-center">
                    Không có dữ liệu.
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      <div className="shrink-0 border-t border-border bg-background px-6 py-3">
        <DataTablePagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          pageCount={pageCount}
          setPageIndex={handleSetPageIndex}
          setPageSize={handleSetPageSize}
          canPreviousPage={pagination.pageIndex > 0}
          canNextPage={pagination.pageIndex < pageCount - 1}
          rowCount={rowCount}
          selectedRowCount={numSelected}
        />
      </div>

      <StickyScrollbar targetRef={tableContainerRef} dataLength={data.length} />
    </div>
  );
}

/**
 * MobileCardWrapper - Helper component for consistent mobile card styling.
 *
 * Giữ lại để backward-compat cho các `renderMobileCard` custom đang bọc bằng
 * wrapper này. Nội bộ dùng primitive `MobileCard` (rounded-xl border-border/50 p-4)
 * để mọi card mobile trong app (auto-generated + custom) nhất quán cùng một
 * visual style như tab "Tồn kho" ở trang chi tiết sản phẩm.
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
  const clickable = typeof onClick === 'function';
  const tapProps = clickable
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        },
      }
    : {};
  return (
    <MobileCard inert={!clickable} className={className} {...tapProps}>
      {children}
    </MobileCard>
  );
}
