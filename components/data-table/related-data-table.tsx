import * as React from 'react';
import Fuse from 'fuse.js';
import * as XLSX from 'xlsx';
import { Printer, FileSpreadsheet, FileText } from 'lucide-react';
import { ResponsiveDataTable, type BulkAction } from './responsive-data-table';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTableExportDialog } from './data-table-export-dialog';
import type { ColumnDef } from './types';
import { DataTableColumnCustomizer } from './data-table-column-toggle';
import { Checkbox } from '../ui/checkbox';
import { useDefaultPageSize } from '../../features/settings/global-settings-store';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isDateSame, isDateBetween, isDateAfter, isDateBefore, getDaysDiff, getMonthsDiff, addDays, addMonths, subtractDays, subtractMonths, getStartOfDay, getEndOfDay, getStartOfMonth, getEndOfMonth, getStartOfWeek, getEndOfWeek, toISODate, toISODateTime, isValidDate, parseDate } from '../../lib/date-utils';
// FIX: Changed generic constraint from `id` to `systemId` to match application data structure
interface DrilldownSearchState {
  query: string;
  token: string;
}

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
  controlledSearch?: DrilldownSearchState | null;
  onControlledSearchApplied?: () => void;
  // ✅ New props for checkbox and bulk actions
  showCheckbox?: boolean;
  bulkActions?: React.ReactNode;
  onBulkDelete?: () => void;
  showBulkDeleteButton?: boolean;
  // ✅ Default sorting - sort by date column descending (newest first)
  defaultSorting?: { id: string; desc: boolean };
  // ✅ Custom bulk actions to override default print/export behavior
  customBulkActions?: BulkAction<TData>[];
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
  controlledSearch,
  onControlledSearchApplied,
  showCheckbox = false,
  bulkActions,
  onBulkDelete,
  showBulkDeleteButton = false,
  defaultSorting,
  customBulkActions,
}: RelatedDataTableProps<TData>) {
  // Get default page size from global settings
  const defaultPageSize = useDefaultPageSize();
  
  // State
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>(defaultSorting || { id: '', desc: false });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: defaultPageSize });
  const lastAppliedSearchTokenRef = React.useRef<string | null>(null);
  
  // State for column customization
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    if (!controlledSearch) {
      return;
    }

    if (controlledSearch.token === lastAppliedSearchTokenRef.current) {
      return;
    }

    lastAppliedSearchTokenRef.current = controlledSearch.token;
    setGlobalFilter(controlledSearch.query);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    onControlledSearchApplied?.();
  }, [controlledSearch, onControlledSearchApplied]);

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
        // Special handling for date columns - parse as Date for proper comparison
        if (sorting.id === 'createdAt' || sorting.id === 'date' || sorting.id === 'orderDate' || sorting.id.toLowerCase().includes('date')) {
          const aTime = aValue ? new Date(aValue).getTime() : 0;
          const bTime = bValue ? new Date(bValue).getTime() : 0;
          return sorting.desc ? bTime - aTime : aTime - bTime;
        }
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

  // ✅ Calculate all selected rows from filteredData (not just current page)
  const allSelectedRows = React.useMemo(() => {
    return Object.keys(rowSelection)
      .filter(id => rowSelection[id as keyof typeof rowSelection])
      .map(id => filteredData.find(row => row.systemId === id))
      .filter((row): row is TData => row !== undefined);
  }, [rowSelection, filteredData]);

  // ✅ Build display columns with optional checkbox
  const displayColumns = React.useMemo(() => {
    if (!showCheckbox) return columns;

    const selectColumn: ColumnDef<TData> = {
      id: 'select',
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : (isSomePageRowsSelected ? 'indeterminate' : false)}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
          aria-label="Chọn tất cả"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row, isSelected, onToggleSelect }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={(value) => onToggleSelect?.(!!value)}
          aria-label="Chọn dòng"
          className="translate-y-[2px]"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 48,
      meta: { displayName: 'Chọn', sticky: 'left' as const },
    };

    return [selectColumn, ...columns];
  }, [columns, showCheckbox]);

  const exportConfig = {
    fileName: exportFileName,
    columns,
  };

  // ✅ Default bulk actions: In, Xuất Excel, Xuất PDF
  const defaultBulkActions: BulkAction<TData>[] = React.useMemo(() => {
    const exportableColumns = columns.filter(c => 
      c.id !== 'select' && c.id !== 'actions' && c.id !== 'expander' && c.id !== 'settings'
    );

    const handleExportExcel = (rows: TData[]) => {
      const headers = exportableColumns.map(col => col.meta?.displayName ?? col.id);
      const mappedData = rows.map(row => {
        const rowData: Record<string, any> = {};
        exportableColumns.forEach(col => {
          const key = col.accessorKey as keyof TData;
          rowData[col.meta?.displayName ?? col.id] = (row as any)[key as string];
        });
        return rowData;
      });
      const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `${exportFileName}_selected.xlsx`);
    };

    const handlePrint = (rows: TData[]) => {
      const headers = exportableColumns.map(col => col.meta?.displayName ?? col.id);
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${exportFileName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            <h2>${exportFileName}</h2>
            <p>Số lượng: ${rows.length} dòng</p>
            <table>
              <thead>
                <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${rows.map(row => `
                  <tr>
                    ${exportableColumns.map(col => {
                      const key = col.accessorKey as keyof TData;
                      const value = (row as any)[key as string] ?? '';
                      return `<td>${value}</td>`;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      
      // In trực tiếp bằng iframe ẩn thay vì mở tab mới
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'absolute';
      printFrame.style.top = '-10000px';
      printFrame.style.left = '-10000px';
      document.body.appendChild(printFrame);
      
      const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
      if (printDoc) {
        printDoc.write(printContent);
        printDoc.close();
        
        // Đợi load xong rồi in
        setTimeout(() => {
          printFrame.contentWindow?.print();
          // Xóa iframe sau khi in
          setTimeout(() => {
            if (document.body.contains(printFrame)) {
              document.body.removeChild(printFrame);
            }
          }, 1000);
        }, 100);
      }
    };

    return [
      {
        label: 'In danh sách',
        icon: Printer,
        onSelect: handlePrint,
      },
      {
        label: 'Xuất Excel',
        icon: FileSpreadsheet,
        onSelect: handleExportExcel,
      },
    ];
  }, [columns, exportFileName]);

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
        columns={displayColumns}
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
        allSelectedRows={allSelectedRows}
        onBulkDelete={onBulkDelete}
        showBulkDeleteButton={showBulkDeleteButton}
        bulkActions={showCheckbox ? (customBulkActions || defaultBulkActions) : undefined}
        bulkActionButtons={bulkActions}
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
