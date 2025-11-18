import * as React from "react"
import { Trash2, ChevronDown, ChevronsRight } from "lucide-react"
import { cn } from "../../lib/utils.ts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.tsx"
import { DataTablePagination } from "./data-table-pagination.tsx"
import { Button } from "../ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx"
import { StickyScrollbar } from "./sticky-scrollbar.tsx"
import type { ColumnDef } from './types.ts';

interface BulkAction<TData> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onSelect: (selectedRows: TData[]) => void;
}

interface DataTableProps<TData extends { systemId: string }> {
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
  sorting: { id: string, desc: boolean };
  setSorting: (updater: React.SetStateAction<{ id: string, desc: boolean }>) => void;
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

export function DataTable<TData extends { systemId: string }>({
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
}: DataTableProps<TData>) {
  
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
          cell: ({ isExpanded, onToggleExpand }) => {
            return (
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
                  <ChevronsRight
                    className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')}
                  />
                </Button>
              </div>
            );
          },
          size: 60,
          meta: { displayName: 'Mở rộng', sticky: 'left' },
        }
      : null;

    const allConfigurableColumns = expanderColumn ? [expanderColumn, ...columns] : [...columns];

    const visibleMasterCols = allConfigurableColumns.filter(col => {
        if (col.id === 'expander') return true; // always show expander if it exists
        return columnVisibility[col.id];
    });
    
    // Separate columns by sticky type BEFORE applying user pins
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

    // Order body columns
    const orderedBodyCols = [...bodyCols].sort((a, b) => {
        const indexA = columnOrder.indexOf(a.id);
        const indexB = columnOrder.indexOf(b.id);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    // Apply user pinning to body columns
    const userPinnedCols = orderedBodyCols
      .filter(col => pinnedColumns.includes(col.id))
      .map(col => ({
        ...col,
        meta: { ...col.meta, sticky: 'left' }
      }));
    
    const nonPinnedBodyCols = orderedBodyCols.filter(c => !pinnedColumns.includes(c.id));
    
    // Final column order: control columns (select, expander) → static left → user pinned → body → static right
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

  // Refs for table container and header to sync scroll & width
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const headerScrollRef = React.useRef<HTMLDivElement>(null);
  const bodyTableRef = React.useRef<HTMLTableElement>(null);
  const headerTableRef = React.useRef<HTMLTableElement>(null);

  // Sync scroll between header and body
  const syncScroll = (source: 'header' | 'body') => {
    if (!headerScrollRef.current || !tableContainerRef.current) return;
    
    if (source === 'body') {
      headerScrollRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
    } else {
      tableContainerRef.current.scrollLeft = headerScrollRef.current.scrollLeft;
    }
  };

  // Sync column widths from body to header
  React.useEffect(() => {
    if (!bodyTableRef.current || !headerTableRef.current) return;

    const syncWidths = () => {
      const bodyTable = bodyTableRef.current;
      const headerTable = headerTableRef.current;
      if (!bodyTable || !headerTable) return;

      // Get first row cells from body to measure actual widths
      const bodyRow = bodyTable.querySelector('tbody tr:first-child');
      const headerRow = headerTable.querySelector('thead tr:last-child'); // Last row in case of bulk actions
      
      if (!bodyRow || !headerRow) return;

      const bodyCells = Array.from(bodyRow.querySelectorAll('td'));
      const headerCells = Array.from(headerRow.querySelectorAll('th'));

      // Apply body cell widths to header cells
      bodyCells.forEach((bodyCell, index) => {
        if (headerCells[index]) {
          const width = bodyCell.getBoundingClientRect().width;
          headerCells[index].style.width = `${width}px`;
          headerCells[index].style.minWidth = `${width}px`;
          headerCells[index].style.maxWidth = `${width}px`;
        }
      });

      // Sync table total width
      headerTable.style.width = `${bodyTable.getBoundingClientRect().width}px`;
    };

    // Sync on mount and when data changes
    syncWidths();
    
    // Re-sync on window resize
    window.addEventListener('resize', syncWidths);
    
    // Use ResizeObserver to detect body table size changes
    const resizeObserver = new ResizeObserver(syncWidths);
    if (bodyTableRef.current) {
      resizeObserver.observe(bodyTableRef.current);
    }

    return () => {
      window.removeEventListener('resize', syncWidths);
      resizeObserver.disconnect();
    };
  }, [data]); // Re-run when data changes

  return (
     <div className={cn("flex flex-col w-full", className)}>
      {/* Sticky header wrapper - only header, not body */}
      <div 
        ref={headerScrollRef}
        onScroll={() => syncScroll('header')}
        className="sticky top-32 z-30 overflow-x-auto rounded-t-md border border-b-0 bg-muted [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <Table ref={headerTableRef}>
          <TableHeader className="bg-muted shadow-sm">
            {/* Bulk actions overlay - absolute positioned */}
            {/* Bulk actions overlay - absolute positioned */}
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
                                    <React.Fragment key={index}>
                                        <DropdownMenuItem
                                            onSelect={() => action.onSelect(allSelectedRows)}
                                        >
                                            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                                            {action.label}
                                        </DropdownMenuItem>
                                    </React.Fragment>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {bulkActionButtons}
                  </div>
                </th>
              </tr>
            )}
            {/* Normal header row - always rendered */}
            <TableRow className="h-9">
              {displayColumns.map((column, colIndex) => {
                  const stickyMeta = (column.meta as any)?.sticky;
                  const hasFixedSize = column.size !== undefined;
                  const colSize = column.size || 150; // Default for auto columns
                  
                  // Only apply fixed width for columns with explicit size
                  const style: React.CSSProperties = hasFixedSize ? { 
                    width: colSize, 
                    minWidth: colSize,
                    maxWidth: colSize,
                  } : {
                    minWidth: 100, // Minimum width for auto columns
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

      {/* Body table - separate, with scroll */}
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
                        
                        // Only apply fixed width for columns with explicit size
                        const style: React.CSSProperties = hasFixedSize ? {
                          width: colSize,
                          minWidth: colSize,
                          maxWidth: colSize,
                        } : {
                          minWidth: 100, // Minimum width for auto columns
                        };
                        
                        let tdClassName = "";
                        
                        const isLastLeftSticky = stickyMeta === 'left' && colIndex === leftStickyColumns.length - 1;

                        if (stickyMeta === 'left') {
                            const stickyIndex = leftStickyColumns.findIndex(c => c.id === column.id);
                            if (stickyIndex !== -1) {
                                (style as any).position = 'sticky';
                                (style as any).left = `${leftOffsets[stickyIndex]}px`;
                                // Inherit background from row style if present
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
                                // Inherit background from row style if present
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
                                    const newSelection = {...prev};
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
                        )
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
      
      {/* Pagination - Fixed at bottom, outside scroll container */}
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

      {/* Sticky horizontal scrollbar at bottom of viewport */}
      <StickyScrollbar targetRef={tableContainerRef} />
    </div>
  )
}
