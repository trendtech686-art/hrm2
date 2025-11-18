// TanStack React Table with Virtual Scrolling (for 10k+ rows)
// File: components/data-table/tanstack-virtual-table.tsx

import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

interface TanStackVirtualTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchable?: boolean;
  searchPlaceholder?: string;
  height?: string; // Height của table container
  rowHeight?: number; // Height mỗi row (px)
  overscan?: number; // Số rows render thêm phía trên/dưới viewport
}

export function TanStackVirtualTable<TData, TValue>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = "Tìm kiếm...",
  height = '600px',
  rowHeight = 53, // Default height của TableRow
  overscan = 10,
}: TanStackVirtualTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  const { rows } = table.getRowModel();

  // Virtual scrolling setup
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {searchable && (
          <div className="flex-1 max-w-sm">
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full"
            />
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          {rows.length.toLocaleString('vi-VN')} kết quả
        </div>
      </div>

      {/* Virtual Table Container */}
      <div className="rounded-md border">
        <div
          ref={parentRef}
          style={{
            height,
            overflow: 'auto',
          }}
        >
          <Table>
            {/* Fixed Header */}
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    const canSort = header.column.getCanSort();
                    const isSorted = header.column.getIsSorted();

                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              'flex items-center gap-2',
                              canSort && 'cursor-pointer select-none hover:text-foreground'
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {canSort && (
                              <span className="text-muted-foreground">
                                {isSorted === 'asc' ? (
                                  <ArrowUp className="h-4 w-4" />
                                ) : isSorted === 'desc' ? (
                                  <ArrowDown className="h-4 w-4" />
                                ) : (
                                  <ChevronsUpDown className="h-4 w-4 opacity-30" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            {/* Virtual Body */}
            <TableBody>
              {paddingTop > 0 && (
                <tr>
                  <td style={{ height: `${paddingTop}px` }} />
                </tr>
              )}
              {virtualRows.map(virtualRow => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    key={row.id}
                    data-index={virtualRow.index}
                    className="hover:bg-muted/50 transition-colors"
                    style={{
                      height: `${virtualRow.size}px`,
                    }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {paddingBottom > 0 && (
                <tr>
                  <td style={{ height: `${paddingBottom}px` }} />
                </tr>
              )}
            </TableBody>
          </Table>

          {/* Empty State */}
          {rows.length === 0 && (
            <div className="flex items-center justify-center h-24 text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>

      {/* Info Bar */}
      <div className="text-xs text-muted-foreground">
        💡 Virtual scrolling: Chỉ render {virtualRows.length} / {rows.length} rows để tối ưu performance
      </div>
    </div>
  );
}

// ===============================================
// USAGE EXAMPLE
// ===============================================

/*
import { TanStackVirtualTable } from '../../components/data-table/tanstack-virtual-table';
import { createEmployeeColumns } from './tanstack-columns';

export function EmployeesPage() {
  const { data: employees } = useQuery(['employees'], fetchEmployees);
  // employees.length = 15,000 rows - no problem! 🚀
  
  const columns = React.useMemo(
    () => createEmployeeColumns(navigate, handleEdit, handleDelete),
    []
  );

  return (
    <TanStackVirtualTable
      data={employees ?? []}
      columns={columns}
      searchable
      searchPlaceholder="Tìm trong 15,000 nhân viên..."
      height="calc(100vh - 200px)" // Full viewport height
      rowHeight={53} // Match với design
      overscan={20} // Render thêm 20 rows buffer
    />
  );
}
*/

// ===============================================
// PERFORMANCE TIPS
// ===============================================

/*
1. **Memoize columns** - Quan trọng!
   const columns = React.useMemo(() => createColumns(), []);

2. **Row height phải chính xác** 
   - Nếu row có dynamic height → dùng `measureElement`
   - Fixed height → tốc độ tối ưu

3. **Overscan sweet spot**
   - Quá ít: Nhìn thấy scroll lag
   - Quá nhiều: Tốn memory
   - Recommend: 10-20 rows

4. **Server-side pagination cho data CỰC lớn**
   - >50k rows → fetch theo page
   - Virtual scrolling + server pagination = 💯

5. **Optimize render**
   - Memoize cell components
   - Avoid inline functions trong columns
   - Use React.memo cho expensive cells
*/
