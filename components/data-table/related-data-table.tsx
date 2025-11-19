import * as React from 'react';
import Fuse from 'fuse.js';
import { ResponsiveDataTable } from './responsive-data-table.tsx';
import { DataTableToolbar } from './data-table-toolbar.tsx';
import { DataTableExportDialog } from './data-table-export-dialog.tsx';
import type { ColumnDef } from './types.ts';
import { DataTableColumnCustomizer } from './data-table-column-toggle.tsx';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isDateSame, isDateBetween, isDateAfter, isDateBefore, getDaysDiff, getMonthsDiff, addDays, addMonths, subtractDays, subtractMonths, getStartOfDay, getEndOfDay, getStartOfMonth, getEndOfMonth, getStartOfWeek, getEndOfWeek, toISODate, toISODateTime, isValidDate, parseDate } from '../../lib/date-utils.ts';
// FIX: Changed generic constraint from `id` to `systemId` to match application data structure
interface RelatedDataTableProps<TData extends { systemId: string }> {
  data: TData[];
  columns: ColumnDef<TData>[];
  // FIX: Changed from `(keyof TData)[]` to `string[]` to resolve type inference issues.
  searchKeys: string[];
  searchPlaceholder: string;
  // FIX: Changed from `keyof TData` to `string` to resolve type inference issues.
  dateFilterColumn?: string;
  dateFilterTitle?: string;
  exportFileName: string;
  onRowClick?: (row: TData) => void;
  children?: React.ReactNode;
}

export function RelatedDataTable<TData extends { systemId: string }>({
  data,
  columns,
  searchKeys,
  searchPlaceholder,
  dateFilterColumn,
  dateFilterTitle,
  exportFileName,
  onRowClick,
  children,
}: RelatedDataTableProps<TData>) {
  // State
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: '', desc: false });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 5 });
  
  // State for column customization
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    // Only run this on initial mount or when columns fundamentally change.
    // This prevents wiping out user's visibility changes.
    if (!isInitialized && columns.length > 0) {
      const initialVisibility: Record<string, boolean> = {};
      columns.forEach(c => {
        if (c.id) {
          initialVisibility[c.id] = true; // Show all columns by default
        }
      });
      setColumnVisibility(initialVisibility);
      setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
      setIsInitialized(true);
    }
  }, [columns, isInitialized]);


  const fuse = React.useMemo(() => new Fuse(data, { keys: searchKeys as string[] }), [data, searchKeys]);

  const filteredData = React.useMemo(() => {
    let filtered = data;

    if (globalFilter) {
      filtered = fuse.search(globalFilter).map(result => result.item);
    }

    if (dateFilterColumn && dateFilter && (dateFilter[0] || dateFilter[1])) {
      const [start, end] = dateFilter;
      const startDate = start ? getStartOfDay(start) : null;
      const endDate = end ? getEndOfDay(end) : null;

      filtered = filtered.filter(item => {
        const rowDateValue = item[dateFilterColumn as keyof TData] as string | undefined;
        if (!rowDateValue) return false;
        const rowDate = parseDate(rowDateValue);
        if (!isValidDate(rowDate)) return false;

        if (startDate && !endDate) return isDateAfter(rowDate, startDate) || isDateSame(rowDate, startDate);
        if (!startDate && endDate) return isDateBefore(rowDate, endDate) || isDateSame(rowDate, endDate);
        if (startDate && endDate) return isDateBetween(rowDate, startDate, endDate);
        return true;
      });
    }
    return filtered;
  }, [data, globalFilter, dateFilter, fuse, dateFilterColumn]);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  const exportConfig = {
    fileName: exportFileName,
    columns,
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar
        search={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder={searchPlaceholder}
        dateFilter={dateFilterColumn ? dateFilter : undefined}
        onDateFilterChange={dateFilterColumn ? setDateFilter : undefined}
        dateFilterTitle={dateFilterTitle}
        numResults={filteredData.length}
      >
        <div className="flex items-center gap-2">
            {children}
            <DataTableColumnCustomizer
                columns={columns}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                pinnedColumns={pinnedColumns}
                setPinnedColumns={setPinnedColumns}
            />
            <DataTableExportDialog allData={data} filteredData={sortedData} pageData={paginatedData} config={exportConfig} />
        </div>
      </DataTableToolbar>

      <ResponsiveDataTable
        columns={columns}
        data={paginatedData}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={filteredData.length}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        sorting={sorting}
        setSorting={setSorting}
        onRowClick={onRowClick}
        allSelectedRows={[]}
        expanded={{}}
        setExpanded={() => {}}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
        autoGenerateMobileCards
      />
    </div>
  );
}
