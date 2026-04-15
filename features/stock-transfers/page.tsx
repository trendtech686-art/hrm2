'use client'
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useStockTransferMutations, useStockTransfers, useStockTransferStats, type StockTransferStats } from './hooks/use-stock-transfers';
import { useAllStockTransfers } from './hooks/use-all-stock-transfers';
import { getColumns } from './columns';
import { ResponsiveDataTable, type BulkAction } from '../../components/data-table/responsive-data-table';
import dynamic from 'next/dynamic';
import { DataTableFacetedFilter } from '../../components/data-table/data-table-faceted-filter';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../components/data-table/dynamic-column-customizer';
import { Button } from '../../components/ui/button';
import { Plus, Printer, FileSpreadsheet, Download, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { asSystemId } from '../../lib/id-types';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { PageToolbar } from '../../components/layout/page-toolbar';
import { PageFilters } from '../../components/layout/page-filters';
import { StatsBar } from '../../components/shared/stats-bar';
import { useMediaQuery } from '../../lib/use-media-query';
import { toast } from 'sonner';
import { StockTransferCard } from './components/stock-transfer-card';
import type { StockTransfer, StockTransferStatus } from '@/lib/types/prisma-extended';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { usePrint } from '../../lib/use-print';
import { convertStockTransferForPrint, mapStockTransferToPrintData, mapStockTransferLineItems, createStoreSettings } from '../../lib/print/stock-transfer-print-helper';
import { useColumnLayout } from '../../hooks/use-column-visibility';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '../../components/shared/advanced-filter-panel';
import { useFilterPresets } from '../../hooks/use-filter-presets';

const StockTransferImportDialog = dynamic(() => import("./components/stock-transfers-import-export-dialogs").then(mod => ({ default: mod.StockTransferImportDialog })), { ssr: false });
const StockTransferExportDialog = dynamic(() => import("./components/stock-transfers-import-export-dialogs").then(mod => ({ default: mod.StockTransferExportDialog })), { ssr: false });

export interface StockTransfersPageProps {
  initialStats?: StockTransferStats;
}

export function StockTransfersPage({ initialStats }: StockTransfersPageProps = {}) {
  const router = useRouter();
  const { data: branches } = useAllBranches();
  // ⚡ OPTIMIZED: Defer print template loading until print is triggered
  const { print, printMultiple } = usePrint({ enabled: false });
  const {  employee: currentUser, can } = useAuth();
  const canCreate = can('create_stock_transfers');
  const canDelete = can('delete_stock_transfers');
  const canEdit = can('edit_stock_transfers');
  const canEditSettings = can('edit_settings');
  const isMobile = !useMediaQuery("(min-width: 768px)");
  
  // Stats from Server Component (instant, no loading)
  const { data: stats } = useStockTransferStats(initialStats);

  // Server-side pagination state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [fromBranchFilter, setFromBranchFilter] = React.useState<string>('all');
  const [toBranchFilter, setToBranchFilter] = React.useState<string>('all');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('stock-transfers');
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'fromBranch', label: 'CN chuyển', type: 'select', options: branches.map(b => ({ value: b.systemId, label: b.name })) },
    { id: 'toBranch', label: 'CN nhận', type: 'select', options: branches.map(b => ({ value: b.systemId, label: b.name })) },
    { id: 'status', label: 'Trạng thái', type: 'multi-select', options: [
      { value: 'pending', label: 'Chờ chuyển' }, { value: 'transferring', label: 'Đang chuyển' },
      { value: 'completed', label: 'Hoàn thành' }, { value: 'cancelled', label: 'Đã hủy' },
    ] },
  ], [branches]);
  const panelValues = React.useMemo(() => ({
    fromBranch: fromBranchFilter !== 'all' ? fromBranchFilter : null,
    toBranch: toBranchFilter !== 'all' ? toBranchFilter : null,
    status: Array.from(statusFilter),
  }), [fromBranchFilter, toBranchFilter, statusFilter]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setFromBranchFilter((v.fromBranch as string) || 'all');
    setToBranchFilter((v.toBranch as string) || 'all');
    setStatusFilter(new Set((v.status as string[]) ?? []));
  }, []);

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [statusFilter, fromBranchFilter, toBranchFilter]);

  // Server-side query
  const statusValue = statusFilter.size === 1 ? Array.from(statusFilter)[0] as StockTransferStatus : undefined;
  const { data: queryData, isLoading: isLoadingTransfers } = useStockTransfers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: statusValue,
    fromBranchId: fromBranchFilter !== 'all' ? fromBranchFilter : undefined,
    toBranchId: toBranchFilter !== 'all' ? toBranchFilter : undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });
  const transfers = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const totalRows = queryData?.total ?? 0;
  const pageCount = Math.ceil(totalRows / pagination.pageSize);

  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<StockTransfer[]>([]);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  // For export: fetch all data only when dialog is open
  const { data: allTransfers } = useAllStockTransfers({ enabled: showExportDialog || showImportDialog });

  const { update: updateMutation, create: createMutation } = useStockTransferMutations({
    onError: (error) => {
      toast.error('Lỗi', { description: error.message });
    }
  });

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [columnLayout, columnLayoutSetters] = useColumnLayout('stock-transfers', React.useMemo(() => ({ visibility: {}, order: [] as string[], pinned: [] as string[] }), []));
  const { visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns } = columnLayout;
  const { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns } = columnLayoutSetters;
  const defaultsInitialized = React.useRef(false);

  usePageHeader({ title: 'Danh sách chuyển kho', breadcrumb: [{ label: 'Trang chủ', href: ROUTES.ROOT, isCurrent: false }, { label: 'Chuyển kho', href: '/stock-transfers', isCurrent: true }], actions: React.useMemo(() => [canCreate && <Button key="add" onClick={() => router.push(ROUTES.INVENTORY.STOCK_TRANSFER_NEW)} className="h-9"><Plus className="mr-2 h-4 w-4" />Tạo phiếu chuyển kho</Button>].filter(Boolean), [router, canCreate]), showBackButton: false });

  const handlePrint = React.useCallback(async (transfer: StockTransfer) => {
    const fromBranch = branches.find(b => b.name === transfer.fromBranchName), toBranch = branches.find(b => b.name === transfer.toBranchName);
    const { storeInfo } = await fetchPrintData();
    print('stock-transfer', { data: mapStockTransferToPrintData(convertStockTransferForPrint(transfer, { fromBranch, toBranch }), fromBranch ? createStoreSettings(fromBranch) : createStoreSettings(storeInfo)), lineItems: mapStockTransferLineItems(convertStockTransferForPrint(transfer, { fromBranch, toBranch }).items) });
  }, [branches, print]);

  const handlePrintConfirm = React.useCallback(async (options: SimplePrintOptionsResult) => {
    if (itemsToPrint.length === 0) return;
    const { storeInfo } = await fetchPrintData();
    printMultiple('stock-transfer', itemsToPrint.map(transfer => {
      const selectedBranch = options.branchSystemId ? branches.find(b => b.systemId === options.branchSystemId) : branches.find(b => b.name === transfer.fromBranchName);
      const toBranch = branches.find(b => b.name === transfer.toBranchName), transferData = convertStockTransferForPrint(transfer, { fromBranch: selectedBranch, toBranch });
      return { data: mapStockTransferToPrintData(transferData, selectedBranch ? createStoreSettings(selectedBranch) : createStoreSettings(storeInfo)), lineItems: mapStockTransferLineItems(transferData.items), paperSize: options.paperSize };
    }));
    toast.success(`Đang in ${itemsToPrint.length} phiếu chuyển kho`); setItemsToPrint([]); setPrintDialogOpen(false);
  }, [itemsToPrint, branches, printMultiple]);

  const handleImport = React.useCallback(async (importedTransfers: Partial<StockTransfer>[], mode: 'insert-only' | 'update-only' | 'upsert') => {
    let addedCount = 0, updatedCount = 0, skippedCount = 0; const errors: Array<{ row: number; message: string }> = [];
    
    for (const [index, transfer] of importedTransfers.entries()) {
      try {
        const existing = allTransfers.find(t => t.id.toLowerCase() === (transfer.id || '').toLowerCase());
        if (existing) { 
          if (mode === 'update-only' || mode === 'upsert') { 
            await new Promise<void>((resolve, reject) => {
              updateMutation.mutate({ systemId: existing.systemId, data: { ...existing, ...transfer, systemId: existing.systemId } as StockTransfer }, {
                onSuccess: () => { updatedCount++; resolve(); },
                onError: (error) => reject(error)
              });
            });
          } else skippedCount++; 
        }
        else { 
          if (mode === 'insert-only' || mode === 'upsert') { 
            await new Promise<void>((resolve, reject) => {
              createMutation.mutate(transfer as StockTransfer, {
                onSuccess: () => { addedCount++; resolve(); },
                onError: (error) => reject(error)
              });
            });
          } else skippedCount++; 
        }
      } catch (error) { errors.push({ row: index + 1, message: (error as Error).message }); }
    }
    
    if (addedCount > 0 || updatedCount > 0) toast.success(`Đã import: ${[addedCount > 0 && `${addedCount} phiếu chuyển kho mới`, updatedCount > 0 && `${updatedCount} phiếu cập nhật`].filter(Boolean).join(', ')}`);
    return { success: addedCount + updatedCount, failed: errors.length, inserted: addedCount, updated: updatedCount, skipped: skippedCount, errors };
  }, [allTransfers, updateMutation, createMutation]);

  const columns = React.useMemo(() => getColumns(handlePrint), [handlePrint]);
  const buildDefaultVisibility = React.useCallback(() => { const dv = new Set(['id', 'createdDate', 'fromBranchName', 'toBranchName', 'itemCount', 'totalQuantity', 'totalValue', 'status', 'createdByName', 'note']); return Object.fromEntries(columns.map(c => [c.id, c.id === 'select' || c.id === 'actions' || dv.has(c.id!)])); }, [columns]);
  const buildDefaultOrder = React.useCallback(() => columns.map(c => c.id).filter(Boolean) as string[], [columns]);

  React.useEffect(() => {
    if (columns.length === 0 || defaultsInitialized.current) return; defaultsInitialized.current = true;
    const dv = new Set(['id', 'createdDate', 'fromBranchName', 'toBranchName', 'itemCount', 'totalQuantity', 'totalValue', 'status', 'createdByName', 'note']);
    setColumnVisibility(Object.fromEntries(columns.map(c => [c.id, c.id === 'select' || c.id === 'actions' || dv.has(c.id!)]))); setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.length]);

  const resetColumnLayout = React.useCallback(() => { setColumnVisibility(buildDefaultVisibility()); setColumnOrder(buildDefaultOrder()); setPinnedColumns([]); toast.success('Đã khôi phục bố cục cột mặc định'); }, [buildDefaultVisibility, buildDefaultOrder, setColumnVisibility, setColumnOrder, setPinnedColumns]);

  const allSelectedRows = React.useMemo(() => transfers.filter(t => rowSelection[t.systemId]), [transfers, rowSelection]);
  const selectedTransfers = React.useMemo(() => transfers.filter(t => rowSelection[t.systemId]), [transfers, rowSelection]);
  const statusOptions = React.useMemo(() => [{ value: 'pending', label: 'Chờ chuyển' }, { value: 'transferring', label: 'Đang chuyển' }, { value: 'completed', label: 'Hoàn thành' }, { value: 'cancelled', label: 'Đã hủy' }], []);
  const bulkActions: BulkAction<StockTransfer>[] = React.useMemo(() => [{ label: 'In phiếu', icon: Printer, onSelect: (rows) => { setItemsToPrint(rows); setPrintDialogOpen(true); } }], []);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Stats Bar - instant display from Server Component */}
      <StatsBar
        className="mb-4"
        items={[
          { key: 'pending', label: 'Chờ chuyển', value: stats?.pending ?? 0 },
          { key: 'inTransit', label: 'Đang chuyển', value: stats?.inTransit ?? 0 },
          { key: 'completed', label: 'Hoàn thành', value: stats?.completed ?? 0 },
          { key: 'cancelled', label: 'Đã hủy', value: stats?.cancelled ?? 0 },
        ]}
      />

      {!isMobile && <PageToolbar leftActions={<>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/inventory')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}<Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onResetToDefault={resetColumnLayout} />} />}
      <PageFilters searchValue={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Tìm kiếm phiếu chuyển kho...">
        <Select value={fromBranchFilter} onValueChange={setFromBranchFilter}><SelectTrigger className="w-full sm:w-45 h-9"><SelectValue placeholder="Chi nhánh chuyển" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả CN chuyển</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent></Select>
        <Select value={toBranchFilter} onValueChange={setToBranchFilter}><SelectTrigger className="w-full sm:w-45 h-9"><SelectValue placeholder="Chi nhánh nhận" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả CN nhận</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent></Select>
        <DataTableFacetedFilter title="Trạng thái" options={statusOptions} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} />
        <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
      </PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />

      <div className="w-full py-4">
        <ResponsiveDataTable columns={columns} data={transfers} renderMobileCard={(t) => <StockTransferCard transfer={t} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={(row) => router.push(`/stock-transfers/${row.systemId}`)} bulkActions={bulkActions} isLoading={isLoadingTransfers} mobileInfiniteScroll />
      </div>
      <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={itemsToPrint.length} title="In phiếu chuyển kho" />
      <StockTransferImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={allTransfers} onImport={handleImport} currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />
      <StockTransferExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={allTransfers} filteredData={transfers} currentPageData={transfers} selectedData={selectedTransfers} currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />
    </div>
  );
}
