'use client'
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useStockTransferMutations } from './hooks/use-stock-transfers';
import { useAllStockTransfers } from './hooks/use-all-stock-transfers';
import { getColumns } from './columns';
import { ResponsiveDataTable, type BulkAction } from '../../components/data-table/responsive-data-table';
import dynamic from 'next/dynamic';
import { DataTableFacetedFilter } from '../../components/data-table/data-table-faceted-filter';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../components/data-table/dynamic-column-customizer';
import { Button } from '../../components/ui/button';
import { Plus, Printer, FileSpreadsheet, Download } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { asSystemId } from '../../lib/id-types';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { PageToolbar } from '../../components/layout/page-toolbar';
import { PageFilters } from '../../components/layout/page-filters';
import { useMediaQuery } from '../../lib/use-media-query';
import { toast } from 'sonner';
import { useFuseFilter } from '../../hooks/use-fuse-search';
import { StockTransferCard } from './components/stock-transfer-card';
import type { StockTransfer } from '@/lib/types/prisma-extended';
import { isValidDate, isDateAfter, isDateBefore, isDateSame, isDateBetween, getStartOfDay, getEndOfDay } from '../../lib/date-utils';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { usePrint } from '../../lib/use-print';
import { convertStockTransferForPrint, mapStockTransferToPrintData, mapStockTransferLineItems, createStoreSettings } from '../../lib/print/stock-transfer-print-helper';
import { useColumnLayout } from '../../hooks/use-column-visibility';

const StockTransferImportDialog = dynamic(() => import("./components/stock-transfers-import-export-dialogs").then(mod => ({ default: mod.StockTransferImportDialog })), { ssr: false });
const StockTransferExportDialog = dynamic(() => import("./components/stock-transfers-import-export-dialogs").then(mod => ({ default: mod.StockTransferExportDialog })), { ssr: false });

export function StockTransfersPage() {
  const router = useRouter();
  const { data: transfers } = useAllStockTransfers();
  const { update: updateMutation, create: createMutation } = useStockTransferMutations({
    onError: (error) => {
      toast.error('Lỗi', { description: error.message });
    }
  });
  const { data: branches } = useAllBranches();
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();
  const { employee: currentUser } = useAuth();
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<StockTransfer[]>([]);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [fromBranchFilter, setFromBranchFilter] = React.useState<string>('all');
  const [toBranchFilter, setToBranchFilter] = React.useState<string>('all');
  const [dateFilter, _setDateFilter] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [columnLayout, columnLayoutSetters] = useColumnLayout('stock-transfers', React.useMemo(() => ({ visibility: {}, order: [] as string[], pinned: [] as string[] }), []));
  const { visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns } = columnLayout;
  const { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns } = columnLayoutSetters;
  const defaultsInitialized = React.useRef(false);

  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);
  usePageHeader({ title: 'Danh sách chuyển kho', breadcrumb: [{ label: 'Trang chủ', href: ROUTES.ROOT, isCurrent: false }, { label: 'Chuyển kho', href: '/stock-transfers', isCurrent: true }], actions: React.useMemo(() => [<Button key="add" onClick={() => router.push(ROUTES.INVENTORY.STOCK_TRANSFER_NEW)} className="h-9"><Plus className="mr-2 h-4 w-4" />Tạo phiếu chuyển kho</Button>], [router]), showBackButton: false });

  const handlePrint = React.useCallback((transfer: StockTransfer) => {
    const fromBranch = branches.find(b => b.name === transfer.fromBranchName), toBranch = branches.find(b => b.name === transfer.toBranchName);
    print('stock-transfer', { data: mapStockTransferToPrintData(convertStockTransferForPrint(transfer, { fromBranch, toBranch }), fromBranch ? createStoreSettings(fromBranch) : createStoreSettings(storeInfo)), lineItems: mapStockTransferLineItems(convertStockTransferForPrint(transfer, { fromBranch, toBranch }).items) });
  }, [branches, storeInfo, print]);

  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    if (itemsToPrint.length === 0) return;
    printMultiple('stock-transfer', itemsToPrint.map(transfer => {
      const selectedBranch = options.branchSystemId ? branches.find(b => b.systemId === options.branchSystemId) : branches.find(b => b.name === transfer.fromBranchName);
      const toBranch = branches.find(b => b.name === transfer.toBranchName), transferData = convertStockTransferForPrint(transfer, { fromBranch: selectedBranch, toBranch });
      return { data: mapStockTransferToPrintData(transferData, selectedBranch ? createStoreSettings(selectedBranch) : createStoreSettings(storeInfo)), lineItems: mapStockTransferLineItems(transferData.items), paperSize: options.paperSize };
    }));
    toast.success(`Đang in ${itemsToPrint.length} phiếu chuyển kho`); setItemsToPrint([]); setPrintDialogOpen(false);
  }, [itemsToPrint, branches, storeInfo, printMultiple]);

  const handleImport = React.useCallback(async (importedTransfers: Partial<StockTransfer>[], mode: 'insert-only' | 'update-only' | 'upsert') => {
    let addedCount = 0, updatedCount = 0, skippedCount = 0; const errors: Array<{ row: number; message: string }> = [];
    
    for (const [index, transfer] of importedTransfers.entries()) {
      try {
        const existing = transfers.find(t => t.id.toLowerCase() === (transfer.id || '').toLowerCase());
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
  }, [transfers, updateMutation, createMutation]);

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
  const searchedData = useFuseFilter(transfers, debouncedGlobalFilter, React.useMemo(() => ({ keys: ['id', 'fromBranchName', 'toBranchName', 'createdByName', 'note', 'referenceCode'], threshold: 0.3, ignoreLocation: true }), []));

  const filteredData = React.useMemo(() => {
    let filtered = [...transfers];
    if (statusFilter.size > 0) filtered = filtered.filter(t => statusFilter.has(t.status));
    if (fromBranchFilter !== 'all') filtered = filtered.filter(t => t.fromBranchSystemId === fromBranchFilter);
    if (toBranchFilter !== 'all') filtered = filtered.filter(t => t.toBranchSystemId === toBranchFilter);
    if (debouncedGlobalFilter.trim()) { const ids = new Set(searchedData.map(s => s.systemId)); filtered = filtered.filter(t => ids.has(t.systemId)); }
    if (dateFilter && (dateFilter[0] || dateFilter[1])) { const [start, end] = dateFilter, startDate = start ? getStartOfDay(start) : null, endDate = end ? getEndOfDay(end) : null; filtered = filtered.filter(t => { const d = new Date(t.createdDate); if (!isValidDate(d)) return false; if (startDate && !endDate) return isDateAfter(d, startDate) || isDateSame(d, startDate); if (!startDate && endDate) return isDateBefore(d, endDate) || isDateSame(d, endDate); if (startDate && endDate) return isDateBetween(d, startDate, endDate); return true; }); }
    return filtered;
  }, [transfers, statusFilter, fromBranchFilter, toBranchFilter, debouncedGlobalFilter, dateFilter, searchedData]);

  React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedGlobalFilter, statusFilter, fromBranchFilter, toBranchFilter, dateFilter]);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData]; if (!sorting.id) return sorted;
    return sorted.sort((a, b) => { const av = (a as Record<string, unknown>)[sorting.id], bv = (b as Record<string, unknown>)[sorting.id]; if (av == null) return 1; if (bv == null) return -1; if (['createdAt', 'createdDate', 'transferDate'].includes(sorting.id)) { const at = av ? new Date(av as string | number | Date).getTime() : 0, bt = bv ? new Date(bv as string | number | Date).getTime() : 0; return sorting.desc ? bt - at : at - bt; } return av < bv ? (sorting.desc ? 1 : -1) : av > bv ? (sorting.desc ? -1 : 1) : 0; });
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);
  const allSelectedRows = React.useMemo(() => transfers.filter(t => rowSelection[t.systemId]), [transfers, rowSelection]);
  const selectedTransfers = React.useMemo(() => transfers.filter(t => rowSelection[t.systemId]), [transfers, rowSelection]);
  const statusOptions = React.useMemo(() => [{ value: 'pending', label: 'Chờ chuyển' }, { value: 'transferring', label: 'Đang chuyển' }, { value: 'completed', label: 'Hoàn thành' }, { value: 'cancelled', label: 'Đã hủy' }], []);
  const bulkActions: BulkAction<StockTransfer>[] = React.useMemo(() => [{ label: 'In phiếu', icon: Printer, onSelect: (rows) => { setItemsToPrint(rows); setPrintDialogOpen(true); } }], []);

  return (
    <div className="flex flex-col w-full h-full">
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onResetToDefault={resetColumnLayout} />} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm kiếm phiếu chuyển kho...">
        <Select value={fromBranchFilter} onValueChange={setFromBranchFilter}><SelectTrigger className="w-full sm:w-[180px] h-9"><SelectValue placeholder="Chi nhánh chuyển" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả CN chuyển</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent></Select>
        <Select value={toBranchFilter} onValueChange={setToBranchFilter}><SelectTrigger className="w-full sm:w-[180px] h-9"><SelectValue placeholder="Chi nhánh nhận" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả CN nhận</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent></Select>
        <DataTableFacetedFilter title="Trạng thái" options={statusOptions} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} />
      </PageFilters>
      <div className="w-full py-4">
        <ResponsiveDataTable columns={columns} data={paginatedData} renderMobileCard={(t) => <StockTransferCard transfer={t} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={filteredData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={(row) => router.push(`/stock-transfers/${row.systemId}`)} bulkActions={bulkActions} />
      </div>
      <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={itemsToPrint.length} title="In phiếu chuyển kho" />
      <StockTransferImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={transfers} onImport={handleImport} currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />
      <StockTransferExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={transfers} filteredData={sortedData} currentPageData={paginatedData} selectedData={selectedTransfers} currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />
    </div>
  );
}
