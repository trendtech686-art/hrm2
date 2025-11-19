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

interface BulkAction<TData> {
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
  onBulkDelete?: () => void;
  showBulkDeleteButton?: boolean;
  bulkActions?: BulkAction<TData>[];
  bulkActionButtons?: React.ReactNode;
  allSelectedRows: TData[];
  renderSubComponent?: (row: TData) => React.ReactNode;
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
  onRowClick?: (row: TData) => void;
  getRowStyle?: (row: TData) => React.CSSProperties;
  className?: string;
}

interface ResponsiveDataTableProps<TData extends { systemId: string }> {
  // Required props
  columns: ColumnDef<TData>[];
  data: TData[];
  
  // Mobile-specific
  renderMobileCard?: (row: TData, index: number) => React.ReactNode;
  mobileCardClassName?: string;
  autoGenerateMobileCards?: boolean;
  
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
  bulkActions?: BulkAction<TData>[];
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
  autoGenerateMobileCards = true,
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
      return columnVisibility[col.id];
    });

    const staticLeftCols = visibleMasterCols.filter(c => {
      const meta = c.meta as any;
      return meta?.sticky === 'left' && !['select', 'control', 'expander'].includes(c.id);
    });
    const staticRightCols = visibleMasterCols.filter(c => (c.meta as any)?.sticky === 'right');
    const controlCols = visibleMasterCols.filter(c => ['select', 'control', 'expander'].includes(c.id));
    const bodyCols = visibleMasterCols.filter(c => {
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
        meta: { ...col.meta, sticky: 'left' }
      }));

    const nonPinnedBodyCols = orderedBodyCols.filter(c => !pinnedColumns.includes(c.id));

    return [
      ...controlCols,
      ...staticLeftCols,
      ...userPinnedCols,
      ...nonPinnedBodyCols,
      ...staticRightCols,
    ];
  }, [columns, columnVisibility, columnOrder, pinnedColumns, renderSubComponent]);

  const leftStickyColumns = React.useMemo(() => displayColumns.filter(c => (c.meta as any)?.sticky === 'left'), [displayColumns]);
  const rightStickyColumns = React.useMemo(() => displayColumns.filter(c => (c.meta as any)?.sticky === 'right'), [displayColumns]);

  const leftOffsets = React.useMemo(() => {
      let offset = 0;
      return leftStickyColumns.map(c => {
          const currentOffset = offset;
          offset += (c.size || 100);
          return currentOffset;
      });
  }, [leftStickyColumns]);

  const rightOffsets = React.useMemo(() => {
      let offset = 0;
      const reversedOffsets = [...rightStickyColumns].reverse().map(c => {
          const currentOffset = offset;
          offset += (c.size || 100);
          return currentOffset;
      });
      return reversedOffsets.reverse();
  }, [rightStickyColumns]);

  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const headerScrollRef = React.useRef<HTMLDivElement>(null);
  const bodyTableRef = React.useRef<HTMLTableElement>(null);
  const headerTableRef = React.useRef<HTMLTableElement>(null);

  const syncScroll = (source: 'header' | 'body') => {
    if (!headerScrollRef.current || !tableContainerRef.current) return;

    if (source === 'body') {
      headerScrollRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
    } else {
      tableContainerRef.current.scrollLeft = headerScrollRef.current.scrollLeft;
    }
  };

  React.useEffect(() => {
    if (!bodyTableRef.current || !headerTableRef.current) return;

    const syncWidths = () => {
      const bodyTable = bodyTableRef.current;
      const headerTable = headerTableRef.current;
      if (!bodyTable || !headerTable) return;

      const bodyRow = bodyTable.querySelector('tbody tr:first-child');
      const headerRow = headerTable.querySelector('thead tr:last-child');

      if (!bodyRow || !headerRow) return;

      const bodyCells = Array.from(bodyRow.querySelectorAll('td'));
      const headerCells = Array.from(headerRow.querySelectorAll('th'));

      bodyCells.forEach((bodyCell, index) => {
        if (headerCells[index]) {
          const width = bodyCell.getBoundingClientRect().width;
          headerCells[index].style.width = `${width}px`;
          headerCells[index].style.minWidth = `${width}px`;
          headerCells[index].style.maxWidth = `${width}px`;
        }
      });

      headerTable.style.width = `${bodyTable.getBoundingClientRect().width}px`;
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
  }, [data]);

  return (
    <div className={cn("flex flex-col w-full", className)}>
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
            <TableRow className="h-9">
              {displayColumns.map((column, colIndex) => {
                const stickyMeta = (column.meta as any)?.sticky;
                const hasFixedSize = column.size !== undefined;
                const colSize = column.size || 150;

                const style: React.CSSProperties = hasFixedSize ? {
                  width: colSize,
                  minWidth: colSize,
                  maxWidth: colSize,
                } : {
                  minWidth: 100,
                };

                let thClassName = "bg-muted whitespace-nowrap";

                const isLastLeftSticky = stickyMeta === 'left' && colIndex === leftStickyColumns.length - 1;
                const isFirstRightSticky = stickyMeta === 'right' && colIndex === displayColumns.length - rightStickyColumns.length;

                if (stickyMeta === 'left') {
                  const stickyIndex = leftStickyColumns.findIndex(c => c.id === column.id);
                  if (stickyIndex !== -1) {
                    (style as any).position = 'sticky';
                    (style as any).left = `${leftOffsets[stickyIndex]}px`;
                    (style as any).top = 0;
                    thClassName = cn(thClassName, "z-30 bg-muted");
                  }
                } else if (stickyMeta === 'right') {
                  const stickyIndex = rightStickyColumns.findIndex(c => c.id === column.id);
                  if (stickyIndex !== -1) {
                    (style as any).position = 'sticky';
                    (style as any).right = `${rightOffsets[stickyIndex]}px`;
                    (style as any).top = 0;
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
                      "border-r": isLastLeftSticky,
                    })}
                  >
                    {typeof column.header === 'function'
                      // @ts-ignore
                      ? column.header({
                          isAllPageRowsSelected,
                          isSomePageRowsSelected,
                          onToggleAll: handleToggleAllPageRows,
                          sorting,
                          setSorting
                        })
                      : column.header}
                  </TableHead>
                );
              })}
            </TableRow>
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
            {data?.length ? (
              data.map((row, rowIndex) => (
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
                      const colSize = column.size || 150;

                      const style: React.CSSProperties = hasFixedSize ? {
                        width: colSize,
                        minWidth: colSize,
                        maxWidth: colSize,
                      } : {
                        minWidth: 100,
                      };

                      let tdClassName = "";

                      const isLastLeftSticky = stickyMeta === 'left' && colIndex === leftStickyColumns.length - 1;

                      if (stickyMeta === 'left') {
                        const stickyIndex = leftStickyColumns.findIndex(c => c.id === column.id);
                        if (stickyIndex !== -1) {
                          (style as any).position = 'sticky';
                          (style as any).left = `${leftOffsets[stickyIndex]}px`;
                          const rowBgColor = getRowStyle?.(row)?.backgroundColor;
                          if (rowBgColor) {
                            (style as any).backgroundColor = rowBgColor;
                          }
                          tdClassName = "z-10 group-hover:bg-muted/50 group-data-[state=selected]:bg-muted transition-colors";
                        }
                      } else if (stickyMeta === 'right') {
                        const stickyIndex = rightStickyColumns.findIndex(c => c.id === column.id);
                        if (stickyIndex !== -1) {
                          (style as any).position = 'sticky';
                          (style as any).right = `${rightOffsets[stickyIndex]}px`;
                          const rowBgColor = getRowStyle?.(row)?.backgroundColor;
                          if (rowBgColor) {
                            (style as any).backgroundColor = rowBgColor;
                          }
                          tdClassName = "z-10 group-hover:bg-muted/50 group-data-[state=selected]:bg-muted transition-colors shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]";
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={displayColumns.length} className="h-24 text-center">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
