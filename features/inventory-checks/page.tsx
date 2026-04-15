/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/router';
import { useInventoryChecks, useInventoryCheckMutations, useInventoryCheckStats, type InventoryCheckStats } from './hooks/use-inventory-checks';
import { useAllInventoryChecks } from './hooks/use-all-inventory-checks';
import { useInventoryCheckImportHandler } from './hooks/use-inventory-check-import-handler';
import { getColumns } from './columns';
import { InventoryCheckCard } from './card';
import type { InventoryCheckStatus } from './types';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { PageToolbar } from '@/components/layout/page-toolbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePageHeader } from '@/contexts/page-header-context';
import dynamic from 'next/dynamic';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import { useAuth } from '@/contexts/auth-context';
import { Plus, Download, Printer, XCircle, Scale, FileSpreadsheet, Settings } from 'lucide-react';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from '@/components/shared/simple-print-options-dialog';
import { toast } from 'sonner';
import { asSystemId } from '@/lib/id-types';
import type { InventoryCheck } from '@/lib/types/prisma-extended';
import { useColumnVisibility, useColumnOrder, usePinnedColumns } from '@/hooks/use-column-visibility';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { usePrint } from '@/lib/use-print';
import { useAllBranches, useBranchFinder } from '../settings/branches/hooks/use-all-branches';

import { convertInventoryCheckForPrint, mapInventoryCheckToPrintData, mapInventoryCheckLineItems, createStoreSettings } from '@/lib/print/inventory-check-print-helper';
import { StatsBar } from '@/components/shared/stats-bar';
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';

const InventoryCheckImportDialog = dynamic(() => import("./components/inventory-checks-import-export-dialogs").then(m => ({ default: m.InventoryCheckImportDialog })), { ssr: false });
const InventoryCheckExportDialog = dynamic(() => import("./components/inventory-checks-import-export-dialogs").then(m => ({ default: m.InventoryCheckExportDialog })), { ssr: false });

type ConfirmState = { type: 'cancel'; item: InventoryCheck } | { type: 'balance'; item: InventoryCheck } | { type: 'bulk-cancel'; items: InventoryCheck[] } | { type: 'bulk-balance'; items: InventoryCheck[] } | null;

export interface InventoryChecksPageProps {
  initialStats?: InventoryCheckStats;
}

export function InventoryChecksPage({ initialStats }: InventoryChecksPageProps) {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const {  employee: currentUser, can } = useAuth();
  const canCreate = can('create_inventory_checks');
  const canDelete = can('delete_inventory_checks');
  const canEdit = can('edit_inventory_checks');
  const canEditSettings = can('edit_settings');
  
  // Stats for dashboard cards
  const { data: stats } = useInventoryCheckStats(initialStats);
  
  // Server-side pagination state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [pagination, setPagination] = usePaginationWithGlobalDefault();
  const [sorting, setSorting] = React.useState({ id: 'createdAt', desc: true });

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [statusFilter]);

  const { data: queryData, isLoading: isLoadingChecks } = useInventoryChecks({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter as InventoryCheckStatus : undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });
  const data = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const totalRows = queryData?.total ?? 0;
  const pageCount = Math.ceil(totalRows / pagination.pageSize);

  // Lazy-load all data only for import/export dialogs
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const { data: allData } = useAllInventoryChecks({ enabled: showImportDialog || showExportDialog });

  const { balance: balanceMutation, cancel: cancelMutation } = useInventoryCheckMutations({
    onBalanceSuccess: () => toast.success('Đã cập nhật phiếu kiểm kê'),
    onCancelSuccess: () => toast.success('Đã cập nhật phiếu kiểm kê'),
    onError: (err) => toast.error(err.message)
  });
  // ⚡ OPTIMIZED: storeInfo lazy loaded in print handlers
  const { data: branches } = useAllBranches();
  const { findById: findBranchById } = useBranchFinder();

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('inventory-checks');
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'branch', label: 'Chi nhánh', type: 'multi-select' as const, options: branches.map(b => ({ value: b.systemId, label: b.name })) },
    { id: 'createdAt', label: 'Ngày tạo', type: 'date-range' as const },
  ], [branches]);
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});
  const panelValues = React.useMemo(() => ({
    branch: (advancedFilters.branch as string[]) ?? [],
    createdAt: advancedFilters.createdAt ?? null,
  }), [advancedFilters]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setAdvancedFilters(v);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [setPagination]);

  const { print, printMultiple } = usePrint();

  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintItems, setPendingPrintItems] = React.useState<InventoryCheck[]>([]);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = useColumnOrder('inventory-checks');
  const [pinnedColumns, setPinnedColumns] = usePinnedColumns('inventory-checks', ['select', 'id']);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [confirmState, setConfirmState] = React.useState<ConfirmState>(null);
  const [isConfirmLoading, setIsConfirmLoading] = React.useState(false);

  const handleEdit = React.useCallback((item: InventoryCheck) => router.push(ROUTES.INVENTORY.INVENTORY_CHECK_EDIT.replace(':systemId', item.systemId)), [router]);
  const requestCancel = React.useCallback((item: InventoryCheck) => { if (item.status?.toLowerCase() !== 'draft') { toast.info('Chỉ có thể hủy phiếu đang ở trạng thái Nháp'); return; } setConfirmState({ type: 'cancel', item }); }, []);
  const requestBalance = React.useCallback((item: InventoryCheck) => setConfirmState({ type: 'balance', item }), []);
  const handlePrint = React.useCallback(async (item: InventoryCheck) => { const branch = item.branchSystemId ? findBranchById(item.branchSystemId) : undefined; const { storeInfo } = await fetchPrintData(); const ss = branch ? { name: branch.name, address: branch.address || '', phone: branch.phone || '', email: '', province: branch.province || '' } : createStoreSettings(storeInfo); const cd = convertInventoryCheckForPrint(item, { branch }); print('inventory-check', { data: mapInventoryCheckToPrintData(cd, ss), lineItems: mapInventoryCheckLineItems(cd.items) }); }, [findBranchById, print]);

  const handleConfirmAction = React.useCallback(async () => { if (!confirmState) return; setIsConfirmLoading(true); const currentUserName = currentUser?.fullName || currentUser?.workEmail || 'Unknown'; try { if (confirmState.type === 'cancel') { cancelMutation.mutate(confirmState.item.systemId, { onSuccess: () => toast.success(`Đã hủy phiếu ${confirmState.item.id}`) }); } else if (confirmState.type === 'balance') { balanceMutation.mutate({ systemId: confirmState.item.systemId, balancedBy: currentUserName }, { onSuccess: () => toast.success(`Đã cân bằng phiếu ${confirmState.item.id}`) }); } else if (confirmState.type === 'bulk-cancel') { let ok = 0; confirmState.items.forEach(i => { if (i.status?.toLowerCase() === 'draft') { cancelMutation.mutate(i.systemId); ok++; } }); setRowSelection({}); ok > 0 ? toast.success(`Đã hủy ${ok} phiếu`) : toast.info('Không có phiếu nào được hủy'); } else if (confirmState.type === 'bulk-balance') { let ok = 0; for (const i of confirmState.items) { if (i.status?.toLowerCase() === 'draft') { balanceMutation.mutate({ systemId: i.systemId, balancedBy: currentUserName }); ok++; } } setRowSelection({}); ok > 0 ? toast.success(`Đã cân bằng ${ok} phiếu`) : toast.info('Không có phiếu nào được cân bằng'); } } catch { toast.error('Không thể hoàn tất hành động'); } finally { setIsConfirmLoading(false); setConfirmState(null); } }, [balanceMutation, cancelMutation, confirmState, currentUser]);

  const columns = React.useMemo(() => getColumns(handleEdit, requestCancel, requestBalance, router, handlePrint), [handleEdit, router, requestCancel, requestBalance, handlePrint]);

  // Column visibility persisted to DB with proper defaults
  const defaultColumnVisibility = React.useMemo(() => {
    const dv = new Set(['id', 'branch', 'status', 'createdAt', 'createdBy', 'balancedAt', 'itemsCount', 'systemQty', 'actualQty', 'difference', 'itemPreview', 'note']);
    const iv: Record<string, boolean> = {};
    getColumns(() => {}, () => {}, () => {}, router, undefined, undefined).forEach(c => { iv[c.id!] = c.id === 'select' || c.id === 'actions' || dv.has(c.id!); });
    return iv;
  }, [router]);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('inventory-checks', defaultColumnVisibility);

  // Initialize column order once
  React.useEffect(() => {
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => { setMobileLoadedCount(20); }, [searchQuery, statusFilter]);
  React.useEffect(() => { if (!isMobile) return; const h = () => { if ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight > 0.8 && mobileLoadedCount < data.length) setMobileLoadedCount(p => Math.min(p + 20, data.length)); }; window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, [isMobile, mobileLoadedCount, data.length]);
  const displayData = isMobile ? data.slice(0, mobileLoadedCount) : data;
  const allSelectedRows = React.useMemo(() => Object.keys(rowSelection).filter(k => rowSelection[k]).map(s => data.find(i => i.systemId === s)).filter(Boolean) as InventoryCheck[], [rowSelection, data]);
  const selectedChecks = React.useMemo(() => data.filter(c => rowSelection[c.systemId]), [data, rowSelection]);

  // Import handler - using hook for DB persistence
  const handleImport = useInventoryCheckImportHandler({ authEmployeeSystemId: currentUser?.systemId });

  const handleBulkPrint = React.useCallback(() => { if (!allSelectedRows.length) return; setPendingPrintItems(allSelectedRows); setIsPrintDialogOpen(true); }, [allSelectedRows]);
  const handlePrintConfirm = React.useCallback(async (opts: SimplePrintOptionsResult) => { const { storeInfo } = await fetchPrintData(); const list = pendingPrintItems.map(i => { const b = opts.branchSystemId ? findBranchById(opts.branchSystemId) : (i.branchSystemId ? findBranchById(i.branchSystemId) : undefined); const ss = b ? { name: b.name, address: b.address || '', phone: b.phone || '', email: '', province: b.province || '' } : createStoreSettings(storeInfo); const cd = convertInventoryCheckForPrint(i, { branch: b }); return { data: mapInventoryCheckToPrintData(cd, ss), lineItems: mapInventoryCheckLineItems(cd.items), paperSize: opts.paperSize }; }); printMultiple('inventory-check', list); toast.success('Đã gửi lệnh in', { description: pendingPrintItems.map(i => i.id).join(', ') }); setRowSelection({}); setPendingPrintItems([]); }, [pendingPrintItems, findBranchById, printMultiple]);
  const handleBulkCancel = React.useCallback(() => { const d = allSelectedRows.filter(i => i.status?.toLowerCase() === 'draft'); if (!d.length) { toast.info('Không có phiếu nào có thể hủy'); return; } setConfirmState({ type: 'bulk-cancel', items: d }); }, [allSelectedRows]);
  const handleBulkBalance = React.useCallback(() => { const d = allSelectedRows.filter(i => i.status?.toLowerCase() === 'draft'); if (!d.length) { toast.info('Không có phiếu nào có thể cân bằng'); return; } setConfirmState({ type: 'bulk-balance', items: d }); }, [allSelectedRows]);

  const bulkActions = React.useMemo(() => [{ label: 'In phiếu kiểm', icon: Printer, onSelect: handleBulkPrint }, { label: 'Cân bằng', icon: Scale, onSelect: handleBulkBalance }, { label: 'Hủy phiếu', icon: XCircle, onSelect: handleBulkCancel, variant: 'destructive' as const }], [handleBulkPrint, handleBulkBalance, handleBulkCancel]);
  const headerActions = React.useMemo(() => [canCreate && <Button key="add" className="h-9" onClick={() => router.push(ROUTES.INVENTORY.INVENTORY_CHECK_NEW)}><Plus className="mr-2 h-4 w-4" />Tạo phiếu kiểm hàng</Button>].filter(Boolean), [router, canCreate]);
  const confirmDialogCopy = React.useMemo(() => { if (!confirmState) return null; if (confirmState.type === 'cancel') return { title: 'Hủy phiếu kiểm hàng', description: `Bạn có chắc muốn hủy phiếu ${confirmState.item?.id}?`, confirmLabel: 'Hủy phiếu' }; if (confirmState.type === 'balance') return { title: 'Cân bằng phiếu kiểm hàng', description: `Sau khi cân bằng, tồn kho sẽ cập nhật theo số thực tế của phiếu ${confirmState.item?.id}.`, confirmLabel: 'Cân bằng ngay' }; if (confirmState.type === 'bulk-cancel') return { title: 'Hủy nhiều phiếu kiểm hàng', description: `Bạn sắp hủy ${confirmState.items?.length ?? 0} phiếu kiểm hàng.`, confirmLabel: `Hủy ${confirmState.items?.length ?? 0} phiếu` }; return { title: 'Cân bằng nhiều phiếu kiểm hàng', description: `Bạn sắp cân bằng ${confirmState.items?.length ?? 0} phiếu kiểm hàng.`, confirmLabel: `Cân bằng ${confirmState.items?.length ?? 0} phiếu` }; }, [confirmState]);
  usePageHeader({ title: 'Danh sách kiểm hàng', breadcrumb: [{ label: 'Trang chủ', href: ROUTES.DASHBOARD, isCurrent: false }, { label: 'Kiểm hàng', href: ROUTES.INVENTORY.INVENTORY_CHECKS, isCurrent: true }], actions: headerActions });

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <StatsBar
        items={[
          { key: 'draft', label: 'Nháp', value: stats?.draft ?? 0 },
          { key: 'inProgress', label: 'Đang kiểm', value: stats?.inProgress ?? 0 },
          { key: 'completed', label: 'Hoàn thành', value: stats?.completed ?? 0 },
          { key: 'cancelled', label: 'Đã hủy', value: stats?.cancelled ?? 0 },
        ]}
      />

      {!isMobile && <PageToolbar leftActions={<>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/inventory')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}<Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={columns?.length ? <DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} /> : null} />}
      <div className="flex flex-col gap-2 md:flex-row md:items-center"><Input placeholder="Tìm kiếm theo mã, chi nhánh, người tạo..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-9 max-w-sm" /><DataTableFacetedFilter title="Trạng thái" selectedValues={new Set(statusFilter === 'all' ? [] : [statusFilter])} onSelectedValuesChange={v => setStatusFilter(v.size === 0 ? 'all' : Array.from(v)[0] as string)} options={[{ label: 'Nháp', value: 'draft' }, { label: 'Đã cân bằng', value: 'balanced' }, { label: 'Đã hủy', value: 'cancelled' }]} /><AdvancedFilterPanel
          filters={filterConfigs}
          values={panelValues}
          onApply={handlePanelApply}
          presets={presets.map(p => ({ ...p, filters: p.filters }))}
          onSavePreset={(preset) => savePreset(preset.name, panelValues)}
          onDeletePreset={deletePreset}
          onUpdatePreset={updatePreset}
        /></div>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />
      <ResponsiveDataTable columns={columns} data={displayData} renderMobileCard={i => <InventoryCheckCard item={i} onEdit={handleEdit} onBalance={requestBalance} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} bulkActions={bulkActions} showBulkDeleteButton={false} sorting={sorting} setSorting={setSorting} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} emptyTitle="Không có phiếu kiểm hàng" emptyDescription="Tạo phiếu kiểm hàng đầu tiên để bắt đầu" isLoading={isLoadingChecks} />
      {isMobile && mobileLoadedCount < data.length && <div className="py-6 text-center"><div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-sm">Đang tải thêm...</span></div></div>}
      {isMobile && mobileLoadedCount >= data.length && data.length > 20 && <div className="py-6 text-center"><p className="text-sm text-muted-foreground">Đã hiển thị tất cả {data.length} kết quả</p></div>}
      <AlertDialog open={!!confirmState} onOpenChange={o => { if (!o && !isConfirmLoading) setConfirmState(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{confirmDialogCopy?.title}</AlertDialogTitle><AlertDialogDescription>{confirmDialogCopy?.description}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9" disabled={isConfirmLoading}>Hủy</AlertDialogCancel><AlertDialogAction className="h-9" disabled={isConfirmLoading} onClick={handleConfirmAction}>{isConfirmLoading ? 'Đang xử lý...' : confirmDialogCopy?.confirmLabel ?? 'Đồng ý'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <SimplePrintOptionsDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={pendingPrintItems.length} title="In phiếu kiểm hàng" />
      <InventoryCheckImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={allData} onImport={handleImport} currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />
      <InventoryCheckExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={allData} filteredData={data} currentPageData={data} selectedData={selectedChecks} currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />
    </div>
  );
}
