import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStockTransferStore } from './store.ts';
import { getColumns } from './columns.tsx';
import { ResponsiveDataTable, type BulkAction } from '../../components/data-table/responsive-data-table.tsx';
import { DataTableFacetedFilter } from '../../components/data-table/data-table-faceted-filter.tsx';
import { DataTableExportDialog } from '../../components/data-table/data-table-export-dialog.tsx';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Plus, Printer } from 'lucide-react';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { ROUTES } from '../../lib/router.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { useBranchStore } from '../settings/branches/store.ts';
import { PageToolbar } from '../../components/layout/page-toolbar.tsx';
import { PageFilters } from '../../components/layout/page-filters.tsx';
import { useMediaQuery } from '../../lib/use-media-query.ts';
import { toast } from 'sonner';
import Fuse from 'fuse.js';
import { StockTransferCard } from './stock-transfer-card.tsx';
import type { StockTransfer, StockTransferStatus } from './types.ts';
import { formatDate, isValidDate, isDateAfter, isDateBefore, isDateSame, isDateBetween, getStartOfDay, getEndOfDay } from '../../lib/date-utils.ts';
import { useStoreInfoStore } from '../settings/store-info/store-info-store.ts';
import { usePrint } from '../../lib/use-print.ts';
import { 
  convertStockTransferForPrint,
  mapStockTransferToPrintData,
  mapStockTransferLineItems,
  createStoreSettings,
} from '../../lib/print/stock-transfer-print-helper.ts';

const COLUMN_LAYOUT_STORAGE_KEY = 'stock-transfers-column-layout';

type StoredColumnLayout = {
  visibility?: Record<string, boolean>;
  order?: string[];
  pinned?: string[];
};

const readStoredColumnLayout = (): StoredColumnLayout | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(COLUMN_LAYOUT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as StoredColumnLayout;
    }
  } catch (error) {
    console.warn('Failed to parse stock-transfers column layout from storage:', error);
  }
  return null;
};

export function StockTransfersPage() {
  const storedLayoutRef = React.useRef(readStoredColumnLayout());
  const navigate = useNavigate();
  const { data: transfers } = useStockTransferStore();
  const { data: branches } = useBranchStore();
  const { info: storeInfo } = useStoreInfoStore();
  const { print, printMultiple } = usePrint();
  const isMobile = !useMediaQuery("(min-width: 768px)");
  
  // Print dialog state
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<StockTransfer[]>([]);
  
  // Table state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  
  // Filters
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [fromBranchFilter, setFromBranchFilter] = React.useState<string>('all');
  const [toBranchFilter, setToBranchFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<[string | undefined, string | undefined] | undefined>();

  // Column customization state
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(
    () => storedLayoutRef.current?.visibility ?? {}
  );
  const [columnOrder, setColumnOrder] = React.useState<string[]>(
    () => storedLayoutRef.current?.order ?? []
  );
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(
    () => storedLayoutRef.current?.pinned ?? []
  );

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Save column layout
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = {
      visibility: columnVisibility,
      order: columnOrder,
      pinned: pinnedColumns,
    };
    window.localStorage.setItem(COLUMN_LAYOUT_STORAGE_KEY, JSON.stringify(payload));
  }, [columnVisibility, columnOrder, pinnedColumns]);

  // Page header
  const headerActions = React.useMemo(() => [
    <Button 
      key="add"
      onClick={() => navigate(ROUTES.INVENTORY.STOCK_TRANSFER_NEW)}
      className="h-9"
    >
      <Plus className="mr-2 h-4 w-4" />
      Tạo phiếu chuyển kho
    </Button>
  ], [navigate]);

  usePageHeader({
    title: 'Danh sách chuyển kho',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT, isCurrent: false },
      { label: 'Chuyển kho', href: '/stock-transfers', isCurrent: true },
    ],
    actions: headerActions,
    showBackButton: false,
  });

  const handlePrint = React.useCallback((transfer: StockTransfer) => {
    // Use helper to prepare print data
    const fromBranch = branches.find(b => b.name === transfer.fromBranchName);
    const toBranch = branches.find(b => b.name === transfer.toBranchName);
    const storeSettings = fromBranch 
      ? createStoreSettings(fromBranch)
      : createStoreSettings(storeInfo);
    const transferData = convertStockTransferForPrint(transfer, { fromBranch, toBranch });
    
    print('stock-transfer', {
      data: mapStockTransferToPrintData(transferData, storeSettings),
      lineItems: mapStockTransferLineItems(transferData.items),
    });
  }, [branches, storeInfo, print]);

  // Bulk print handlers
  const handleBulkPrint = React.useCallback((rows: StockTransfer[]) => {
    setItemsToPrint(rows);
    setPrintDialogOpen(true);
  }, []);

  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    if (itemsToPrint.length === 0) return;
    
    const printItems = itemsToPrint.map(transfer => {
      // Use branchSystemId from options if specified, otherwise use transfer's fromBranch
      const selectedBranch = options.branchSystemId 
        ? branches.find(b => b.systemId === options.branchSystemId)
        : branches.find(b => b.name === transfer.fromBranchName);
      const toBranch = branches.find(b => b.name === transfer.toBranchName);
      const storeSettings = selectedBranch 
        ? createStoreSettings(selectedBranch)
        : createStoreSettings(storeInfo);
      const transferData = convertStockTransferForPrint(transfer, { fromBranch: selectedBranch, toBranch });
      
      return {
        data: mapStockTransferToPrintData(transferData, storeSettings),
        lineItems: mapStockTransferLineItems(transferData.items),
        paperSize: options.paperSize,
      };
    });

    printMultiple('stock-transfer', printItems);
    toast.success(`Đang in ${itemsToPrint.length} phiếu chuyển kho`);
    setItemsToPrint([]);
    setPrintDialogOpen(false);
  }, [itemsToPrint, branches, storeInfo, printMultiple]);

  // Bulk actions
  const bulkActions: BulkAction<StockTransfer>[] = React.useMemo(() => [
    {
      label: 'In phiếu',
      icon: Printer,
      onSelect: handleBulkPrint,
    },
  ], [handleBulkPrint]);

  // Columns
  const columns = React.useMemo(() => getColumns(handlePrint), [handlePrint]);

  // Column defaults
  const buildDefaultVisibility = React.useCallback(() => {
    const defaultVisibleColumns = new Set([
      'id', 'createdDate', 'fromBranchName', 'toBranchName', 'itemCount', 
      'totalQuantity', 'totalValue', 'status', 'createdByName', 'note'
    ]);
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      if (!c.id) return;
      if (c.id === 'select' || c.id === 'actions') {
        initialVisibility[c.id] = true;
        return;
      }
      initialVisibility[c.id] = defaultVisibleColumns.has(c.id);
    });
    return initialVisibility;
  }, []);

  const buildDefaultOrder = React.useCallback(() => (
    columns.map(c => c.id).filter(Boolean) as string[]
  ), []);

  React.useEffect(() => {
    if (columns.length === 0) return;
    setColumnVisibility(prev => {
      if (Object.keys(prev).length > 0) return prev;
      return buildDefaultVisibility();
    });
    setColumnOrder(prev => {
      if (prev.length > 0) return prev;
      return buildDefaultOrder();
    });
    setPinnedColumns(prev => prev ?? []);
  }, [buildDefaultOrder, buildDefaultVisibility]);

  const resetColumnLayout = React.useCallback(() => {
    setColumnVisibility(buildDefaultVisibility());
    setColumnOrder(buildDefaultOrder());
    setPinnedColumns([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(COLUMN_LAYOUT_STORAGE_KEY);
    }
    toast.success('Đã khôi phục bố cục cột mặc định');
  }, [buildDefaultVisibility, buildDefaultOrder]);

  // Fuse search
  const fuseInstance = React.useMemo(() => {
    return new Fuse(transfers, {
      keys: ['id', 'fromBranchName', 'toBranchName', 'createdByName', 'note', 'referenceCode'],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [transfers]);

  // Filter data
  const filteredData = React.useMemo(() => {
    let filtered = [...transfers];

    // Status filter
    if (statusFilter.size > 0) {
      filtered = filtered.filter(t => statusFilter.has(t.status));
    }

    // Branch filters
    if (fromBranchFilter !== 'all') {
      filtered = filtered.filter(t => t.fromBranchSystemId === fromBranchFilter);
    }
    if (toBranchFilter !== 'all') {
      filtered = filtered.filter(t => t.toBranchSystemId === toBranchFilter);
    }

    // Search filter
    if (debouncedGlobalFilter.trim()) {
      fuseInstance.setCollection(filtered);
      filtered = fuseInstance.search(debouncedGlobalFilter.trim()).map(r => r.item);
    }

    // Date filter
    if (dateFilter && (dateFilter[0] || dateFilter[1])) {
      const [start, end] = dateFilter;
      const startDate = start ? getStartOfDay(start) : null;
      const endDate = end ? getEndOfDay(end) : null;
      
      filtered = filtered.filter(t => {
        const rowDate = new Date(t.createdDate);
        if (!isValidDate(rowDate)) return false;
        if (startDate && !endDate) return isDateAfter(rowDate, startDate) || isDateSame(rowDate, startDate);
        if (!startDate && endDate) return isDateBefore(rowDate, endDate) || isDateSame(rowDate, endDate);
        if (startDate && endDate) return isDateBetween(rowDate, startDate, endDate);
        return true;
      });
    }

    return filtered;
  }, [transfers, statusFilter, fromBranchFilter, toBranchFilter, debouncedGlobalFilter, dateFilter, fuseInstance]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, [debouncedGlobalFilter, statusFilter, fromBranchFilter, toBranchFilter, dateFilter]);

  // Sorting
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        // Special handling for date columns
        if (sorting.id === 'createdAt' || sorting.id === 'createdDate' || sorting.id === 'transferDate') {
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

  // Pagination
  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  // Selection
  const allSelectedRows = React.useMemo(() =>
    transfers.filter(t => rowSelection[t.systemId]),
  [transfers, rowSelection]);

  // Filter options
  const statusOptions = React.useMemo(() => [
    { value: 'pending', label: 'Chờ chuyển' },
    { value: 'transferring', label: 'Đang chuyển' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ], []);

  // Export config
  const exportConfig = {
    fileName: 'Danh_sach_chuyen_kho',
    columns,
  };

  // Row click handler
  const handleRowClick = (row: StockTransfer) => {
    navigate(`/stock-transfers/${row.systemId}`);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* PageToolbar - Desktop only */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <DataTableExportDialog
              allData={transfers}
              filteredData={sortedData}
              pageData={paginatedData}
              config={exportConfig}
            />
          }
          rightActions={
            <DataTableColumnCustomizer
              columns={columns}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns}
              setPinnedColumns={setPinnedColumns}
              onResetToDefault={resetColumnLayout}
            />
          }
        />
      )}

      {/* PageFilters */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm kiếm phiếu chuyển kho..."
      >
        <Select value={fromBranchFilter} onValueChange={setFromBranchFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-9">
            <SelectValue placeholder="Chi nhánh chuyển" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả CN chuyển</SelectItem>
            {branches.map(b => (
              <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={toBranchFilter} onValueChange={setToBranchFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-9">
            <SelectValue placeholder="Chi nhánh nhận" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả CN nhận</SelectItem>
            {branches.map(b => (
              <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DataTableFacetedFilter
          title="Trạng thái"
          options={statusOptions}
          selectedValues={statusFilter}
          onSelectedValuesChange={setStatusFilter}
        />
      </PageFilters>

      {/* Data Table */}
      <div className="w-full py-4">
        <ResponsiveDataTable
          columns={columns}
          data={paginatedData}
          renderMobileCard={(transfer) => (
            <StockTransferCard transfer={transfer} />
          )}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
          rowCount={filteredData.length}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          allSelectedRows={allSelectedRows}
          expanded={expanded}
          setExpanded={setExpanded}
          sorting={sorting}
          setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          pinnedColumns={pinnedColumns}
          setPinnedColumns={setPinnedColumns}
          onRowClick={handleRowClick}
          bulkActions={bulkActions}
        />
      </div>

      {/* Print Options Dialog */}
      <SimplePrintOptionsDialog
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        onConfirm={handlePrintConfirm}
        selectedCount={itemsToPrint.length}
        title="In phiếu chuyển kho"
      />
    </div>
  );
}
