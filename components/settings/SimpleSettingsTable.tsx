import * as React from "react";
import { Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import type { ColumnDef } from "../data-table/types";
import { cn } from "../../lib/utils";

interface PaginationConfig {
  pageSize?: number;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showInfo?: boolean;
}

interface SimpleSettingsTableProps<TData extends { systemId: string }> {
  data: TData[];
  columns: ColumnDef<TData>[];
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  className?: string;
  // Loading state
  isLoading?: boolean;
  // Selection props
  enableSelection?: boolean;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onBulkDelete?: (selectedItems: TData[]) => void;
  // Pagination props
  enablePagination?: boolean;
  pagination?: PaginationConfig;
}

export function SimpleSettingsTable<TData extends { systemId: string }>(
  props: SimpleSettingsTableProps<TData>
) {
  const { 
    data, 
    columns, 
    emptyTitle, 
    emptyDescription, 
    emptyAction, 
    className,
    isLoading = false,
    enableSelection = false,
    rowSelection: externalRowSelection,
    setRowSelection: externalSetRowSelection,
    onBulkDelete,
    enablePagination = false,
    pagination = {},
  } = props;

  const {
    pageSize: defaultPageSize = 10,
    pageSizeOptions = [10, 20, 30, 50],
    showPageSizeSelector = true,
    showInfo = true,
  } = pagination;

  // Internal selection state (used when external state is not provided)
  const [internalRowSelection, setInternalRowSelection] = React.useState<Record<string, boolean>>({});
  
  // Use external or internal selection state
  const rowSelection = externalRowSelection ?? internalRowSelection;
  const setRowSelection = externalSetRowSelection ?? setInternalRowSelection;

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);

  // Reset to first page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Clear selection when data changes (to avoid stale selections)
  React.useEffect(() => {
    if (!externalSetRowSelection) {
      setInternalRowSelection({});
    }
  }, [data, externalSetRowSelection]);

  // Calculate pagination
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedData = enablePagination ? data.slice(startIndex, endIndex) : data;

  const renderedColumns = React.useMemo(() => columns.filter(Boolean), [columns]);
  
  // Selection state
  const selectedCount = Object.keys(rowSelection).length;
  const isAllSelected = data.length > 0 && data.every(row => rowSelection[row.systemId]);
  const isSomeSelected = !isAllSelected && data.some(row => rowSelection[row.systemId]);
  
  const handleToggleAll = React.useCallback((checked: boolean) => {
    if (!setRowSelection) return;
    if (checked) {
      const newSelection: Record<string, boolean> = {};
      data.forEach(row => {
        newSelection[row.systemId] = true;
      });
      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  }, [data, setRowSelection]);
  
  const handleToggleRow = React.useCallback((systemId: string, checked: boolean) => {
    if (!setRowSelection) return;
    setRowSelection(prev => {
      const newSelection = { ...prev };
      if (checked) {
        newSelection[systemId] = true;
      } else {
        delete newSelection[systemId];
      }
      return newSelection;
    });
  }, [setRowSelection]);
  
  const handleBulkDelete = React.useCallback(() => {
    if (!onBulkDelete) return;
    const selectedItems = data.filter(row => rowSelection[row.systemId]);
    onBulkDelete(selectedItems);
    setRowSelection({});
  }, [data, rowSelection, onBulkDelete, setRowSelection]);

  // Columns with selection checkbox
  const colSpan = enableSelection ? renderedColumns.length + 1 : renderedColumns.length;

  const renderHeader = (column: ColumnDef<TData>) => {
    if (typeof column.header === "function") {
      return column.header({
        isAllPageRowsSelected: isAllSelected,
        isSomePageRowsSelected: isSomeSelected,
        onToggleAll: handleToggleAll,
        setSorting: () => {},
      });
    }
    return column.header;
  };

  const renderCell = (column: ColumnDef<TData>, row: TData, rowIndex: number) =>
    column.cell({
      row,
      rowIndex,
      isSelected: rowSelection[row.systemId] ?? false,
      isExpanded: false,
      onToggleSelect: (checked: boolean) => handleToggleRow(row.systemId, checked),
      onToggleExpand: () => {},
    });

  return (
    <div className={cn("space-y-2", className)}>
      <div className="overflow-x-auto border border-border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {enableSelection && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    // @ts-expect-error - indeterminate is valid
                    indeterminate={isSomeSelected ? true : undefined}
                    onCheckedChange={handleToggleAll}
                    aria-label="Chọn tất cả"
                  />
                </TableHead>
              )}
              {/* Bulk action replaces headers when items are selected */}
              {enableSelection && selectedCount > 0 ? (
                <TableHead colSpan={renderedColumns.length} className="py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      Đã chọn <strong>{selectedCount}</strong> mục
                    </span>
                    {onBulkDelete && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleBulkDelete}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    )}
                  </div>
                </TableHead>
              ) : (
                renderedColumns.map((column) => (
                  <TableHead key={column.id} style={column.size ? { width: column.size } : undefined}>
                    {renderHeader(column)}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {enableSelection && (
                    <TableCell className="w-12">
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                  {renderedColumns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-24 text-center">
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{emptyTitle}</p>
                    {emptyDescription ? (
                      <p className="text-sm text-muted-foreground">{emptyDescription}</p>
                    ) : null}
                    {emptyAction}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow 
                  key={item.systemId}
                  className={cn(rowSelection[item.systemId] && "bg-muted/50")}
                >
                  {enableSelection && (
                    <TableCell className="w-12">
                      <Checkbox
                        checked={rowSelection[item.systemId] ?? false}
                        onCheckedChange={(checked) => handleToggleRow(item.systemId, !!checked)}
                        aria-label={`Chọn dòng ${startIndex + index + 1}`}
                      />
                    </TableCell>
                  )}
                  {renderedColumns.map((column) => (
                    <TableCell key={column.id}>{renderCell(column, item, startIndex + index)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Controls */}
      {enablePagination && totalItems > 0 && (
        <div className="flex items-center justify-between px-2 py-3">
          <div className="flex items-center gap-4">
            {showInfo && (
              <p className="text-sm text-muted-foreground">
                Hiển thị {startIndex + 1}-{endIndex} / {totalItems} mục
              </p>
            )}
            {showPageSizeSelector && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Số dòng:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}