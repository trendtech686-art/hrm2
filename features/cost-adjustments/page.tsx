'use client'

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, XCircle, CheckCircle, Printer, FileSpreadsheet, Download, Loader2 } from 'lucide-react';

import { useCostAdjustments, useCostAdjustmentMutations } from './hooks/use-cost-adjustments';
import { useAllCostAdjustments } from './hooks/use-all-cost-adjustments';
import { useCostAdjustmentImportHandler } from './hooks/use-cost-adjustment-import-handler';
import { getColumns } from './columns';
import { ROUTES } from '@/lib/router';
import { usePageHeader } from '@/contexts/page-header-context';
import { useAuth } from '@/contexts/auth-context';
import { asSystemId } from '@/lib/id-types';
import { usePrint } from '@/lib/use-print';
import { useAllBranches, useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { convertCostAdjustmentForPrint, mapCostAdjustmentToPrintData, mapCostAdjustmentLineItems } from '@/lib/print/cost-adjustment-print-helper';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { useColumnLayout } from '@/hooks/use-column-visibility';
import { useMediaQuery } from '@/lib/use-media-query';
import { cn } from '@/lib/utils';
import type { CostAdjustment, CostAdjustmentStatus } from '@/lib/types/prisma-extended';

import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { Button } from '@/components/ui/button';
import { PageToolbar } from '@/components/layout/page-toolbar';
import { PageFilters } from '@/components/layout/page-filters';
import { CostAdjustmentCard } from './cost-adjustment-card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from '@/components/shared/simple-print-options-dialog';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { ListPageShell } from '@/components/layout/page-section';

const CostAdjustmentImportDialog = dynamic(() => import("./components/cost-adjustments-import-export-dialogs").then(mod => ({ default: mod.CostAdjustmentImportDialog })), { ssr: false });
const CostAdjustmentExportDialog = dynamic(() => import("./components/cost-adjustments-import-export-dialogs").then(mod => ({ default: mod.CostAdjustmentExportDialog })), { ssr: false });

export function CostAdjustmentListPage() {
  const router = useRouter();
  const { cancel, confirm } = useCostAdjustmentMutations({
    onSuccess: () => toast.success('Cập nhật thành công'),
    onError: (error) => toast.error(error.message),
  });
  const {  employee, can } = useAuth();
  const canCreate = can('create_cost_adjustments');
  const canApprove = can('approve_cost_adjustments');
  const canEditSettings = can('edit_settings');
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const { print, printMultiple } = usePrint();
  const { data: branches } = useAllBranches();
  const { findById: getBranchById } = useBranchFinder();
  // ⚡ OPTIMIZED: storeInfo lazy loaded in print handlers

  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<CostAdjustment[]>([]);
  const [confirmDialogState, setConfirmDialogState] = React.useState<{ type: 'bulk-cancel' | 'bulk-confirm'; items: CostAdjustment[] } | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('cost-adjustments');
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'createdDate', label: 'Ngày tạo', type: 'date-range' as const },
  ], []);
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});
  const panelValues = React.useMemo(() => ({
    createdDate: advancedFilters.createdDate ?? null,
  }), [advancedFilters]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setAdvancedFilters(v);
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, []);

  // Server-side pagination
  const serverFilters = React.useMemo(() => ({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedGlobalFilter || undefined,
    status: statusFilter.size === 1 ? [...statusFilter][0] as CostAdjustmentStatus : undefined,
    sortBy: sorting.id || 'createdAt',
    sortOrder: sorting.desc ? 'desc' as const : 'asc' as const,
  }), [pagination.pageIndex, pagination.pageSize, debouncedGlobalFilter, statusFilter, sorting]);
  const { data: response, isLoading, isFetching } = useCostAdjustments(serverFilters);
  const tableData = React.useMemo(() => (response?.data ?? []) as CostAdjustment[], [response]);
  const serverTotal = response?.pagination?.total ?? 0;
  const serverPageCount = response?.pagination?.totalPages ?? 0;

  // Lazy-load ALL data only for import/export dialogs
  const { data: allAdjustments = [] } = useAllCostAdjustments({ enabled: showImportDialog || showExportDialog });

  const columnLayoutDefaults = React.useMemo(() => ({ visibility: {}, order: [] as string[], pinned: [] as string[] }), []);
  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('cost-adjustments', columnLayoutDefaults);

  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  const handleSinglePrint = React.useCallback(async (adj: CostAdjustment) => {
    const { storeInfo } = await fetchPrintData();
    const st = { name: storeInfo?.companyName || storeInfo?.brandName || '', address: storeInfo?.headquartersAddress || '', phone: storeInfo?.hotline || '', email: storeInfo?.email || '', website: storeInfo?.website, taxCode: storeInfo?.taxCode, province: storeInfo?.province, logo: storeInfo?.logo };
    const d = convertCostAdjustmentForPrint(adj, { creatorName: adj.createdByName ?? undefined });
    print('cost-adjustment', { data: mapCostAdjustmentToPrintData(d, st), lineItems: mapCostAdjustmentLineItems(d.items) });
  }, [print]);

  const columns = React.useMemo(() => getColumns(router.push, handleSinglePrint), [router, handleSinglePrint]);

  const headerActions = React.useMemo(() => [canCreate && <Button key="add" className="h-9" onClick={() => router.push('/cost-adjustments/new')}><Plus className="mr-2 h-4 w-4" />Tạo phiếu</Button>].filter(Boolean), [router, canCreate]);
  usePageHeader({ title: 'Danh sách điều chỉnh giá vốn', breadcrumb: [{ label: 'Trang chủ', href: ROUTES.ROOT }, { label: 'Điều chỉnh giá vốn', href: '/cost-adjustments', isCurrent: true }], actions: headerActions, showBackButton: false });

  const buildDefaultVisibility = React.useCallback(() => { const def = new Set(['id', 'referenceCode', 'createdDate', 'status', 'itemCount', 'totalOldValue', 'totalNewValue', 'difference', 'createdByName', 'reason']); const v: Record<string, boolean> = {}; columns.forEach(c => { if (!c.id) return; v[c.id] = c.id === 'select' || c.id === 'actions' || def.has(c.id); }); return v; }, [columns]);
  const buildDefaultOrder = React.useCallback(() => columns.map(c => c.id).filter(Boolean) as string[], [columns]);

  const defaultsInitialized = React.useRef(false);
  React.useEffect(() => { if (columns.length === 0 || defaultsInitialized.current) return; defaultsInitialized.current = true; setColumnVisibility(buildDefaultVisibility()); setColumnOrder(buildDefaultOrder()); }, [columns, buildDefaultVisibility, buildDefaultOrder, setColumnVisibility, setColumnOrder]);

  const resetColumnLayout = React.useCallback(() => { setColumnVisibility(buildDefaultVisibility()); setColumnOrder(buildDefaultOrder()); setPinnedColumns([]); toast.success('Đã khôi phục bố cục mặc định'); }, [buildDefaultVisibility, buildDefaultOrder, setColumnVisibility, setColumnOrder, setPinnedColumns]);

  React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedGlobalFilter, statusFilter]);

  const allSelectedRows = React.useMemo(() => tableData.filter(a => rowSelection[a.systemId]), [tableData, rowSelection]);

  // Import handler - using hook for DB persistence
  const handleImport = useCostAdjustmentImportHandler({ authEmployeeSystemId: employee?.systemId });

  const handleBulkCancel = React.useCallback(() => { const drafts = allSelectedRows.filter(a => a.status?.toLowerCase() === 'draft'); if (drafts.length === 0) { toast.info('Không có phiếu nào có thể hủy'); return; } setConfirmDialogState({ type: 'bulk-cancel', items: drafts }); }, [allSelectedRows]);
  const handleBulkConfirm = React.useCallback(() => { const drafts = allSelectedRows.filter(a => a.status?.toLowerCase() === 'draft'); if (drafts.length === 0) { toast.info('Không có phiếu nào có thể xác nhận'); return; } setConfirmDialogState({ type: 'bulk-confirm', items: drafts }); }, [allSelectedRows]);

  const handleConfirmDialogAction = React.useCallback(async () => {
    if (!confirmDialogState || !employee) return; setIsConfirmLoading(true);
    try {
      const promises = confirmDialogState.items.map(async (it) => {
        if (confirmDialogState.type === 'bulk-cancel') {
          await cancel.mutateAsync({
            systemId: asSystemId(it.systemId),
            cancelledBy: employee.systemId,
            cancelledByName: employee.fullName,
          });
        } else if (confirmDialogState.type === 'bulk-confirm') {
          await confirm.mutateAsync({
            systemId: asSystemId(it.systemId),
            confirmedBy: employee.systemId,
            confirmedByName: employee.fullName,
          });
        }
      });
      await Promise.all(promises);
      toast.success(`Đã ${confirmDialogState.type === 'bulk-cancel' ? 'hủy' : 'xác nhận'} ${confirmDialogState.items.length} phiếu`);
      setRowSelection({});
    } catch (error) {
      toast.error((error as Error).message);
    } finally { setIsConfirmLoading(false); setConfirmDialogState(null); }
  }, [confirmDialogState, employee, cancel, confirm]);

  const handleBulkPrint = React.useCallback(() => { if (allSelectedRows.length === 0) return; setItemsToPrint(allSelectedRows); setPrintDialogOpen(true); }, [allSelectedRows]);
  const handlePrintConfirm = React.useCallback(async (r: SimplePrintOptionsResult) => {
    if (itemsToPrint.length === 0) return;
    const branch = r.branchSystemId ? getBranchById(r.branchSystemId) : null;
    const { storeInfo } = await fetchPrintData();
    const st = { name: storeInfo?.companyName || storeInfo?.brandName || '', address: storeInfo?.headquartersAddress || '', phone: storeInfo?.hotline || '', email: storeInfo?.email || '', website: storeInfo?.website, taxCode: storeInfo?.taxCode, province: storeInfo?.province, logo: storeInfo?.logo };
    const list = itemsToPrint.map(adj => { const d = convertCostAdjustmentForPrint(adj, { branch, creatorName: adj.createdByName ?? undefined }); return { data: mapCostAdjustmentToPrintData(d, st), lineItems: mapCostAdjustmentLineItems(d.items), paperSize: r.paperSize }; });
    printMultiple('cost-adjustment', list); setPrintDialogOpen(false); setItemsToPrint([]); setRowSelection({}); toast.success(`Đang in ${itemsToPrint.length} phiếu`);
  }, [itemsToPrint, getBranchById, printMultiple]);

  const bulkActions = React.useMemo(() => [{ label: 'In phiếu', icon: Printer, onSelect: handleBulkPrint }, { label: 'Xác nhận', icon: CheckCircle, onSelect: handleBulkConfirm }, { label: 'Hủy phiếu', icon: XCircle, onSelect: handleBulkCancel, variant: 'destructive' as const }], [handleBulkPrint, handleBulkConfirm, handleBulkCancel]);
  const confirmDialogCopy = React.useMemo(() => confirmDialogState ? confirmDialogState.type === 'bulk-cancel' ? { title: 'Hủy nhiều phiếu', description: `Hủy ${confirmDialogState.items.length} phiếu?`, confirmLabel: 'Hủy' } : { title: 'Xác nhận nhiều phiếu', description: `Xác nhận ${confirmDialogState.items.length} phiếu?`, confirmLabel: 'Xác nhận' } : null, [confirmDialogState]);
  const statusOptions = React.useMemo(() => [{ value: 'draft', label: 'Nháp' }, { value: 'confirmed', label: 'Đã xác nhận' }, { value: 'cancelled', label: 'Đã hủy' }], []);
  const handleRowClick = (r: CostAdjustment) => router.push(`/cost-adjustments/${r.systemId}`);
  const handleConfirmCard = React.useCallback((id: string) => { router.push(`/cost-adjustments/${id}`); toast.info('Mở chi tiết để xác nhận'); }, [router]);
  const handleCancelCard = React.useCallback((id: string) => { router.push(`/cost-adjustments/${id}`); toast.info('Mở chi tiết để hủy'); }, [router]);

  return (
    <ListPageShell>
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onResetToDefault={resetColumnLayout} />} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm kiếm phiếu điều chỉnh..."><DataTableFacetedFilter title="Trạng thái" options={statusOptions} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} /><AdvancedFilterPanel
          filters={filterConfigs}
          values={panelValues}
          onApply={handlePanelApply}
          presets={presets.map(p => ({ ...p, filters: p.filters }))}
          onSavePreset={(preset) => savePreset(preset.name, panelValues)}
          onDeletePreset={deletePreset}
          onUpdatePreset={updatePreset}
        /></PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />
      <div className={cn('w-full py-4', isFetching && !isLoading && 'opacity-70 transition-opacity')}><ResponsiveDataTable columns={columns} data={tableData} isLoading={isLoading} renderMobileCard={adj => <CostAdjustmentCard adjustment={adj} onConfirm={handleConfirmCard} onCancel={handleCancelCard} />} pageCount={serverPageCount} pagination={pagination} setPagination={setPagination} rowCount={serverTotal} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} bulkActions={bulkActions} showBulkDeleteButton={false} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} mobileInfiniteScroll /></div>
      <AlertDialog open={!!confirmDialogState} onOpenChange={o => { if (!o && !isConfirmLoading) setConfirmDialogState(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{confirmDialogCopy?.title}</AlertDialogTitle><AlertDialogDescription>{confirmDialogCopy?.description}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9" disabled={isConfirmLoading}>Đóng</AlertDialogCancel><AlertDialogAction className="h-9" disabled={isConfirmLoading} onClick={handleConfirmDialogAction}>{isConfirmLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xử lý...</> : confirmDialogCopy?.confirmLabel}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} selectedCount={itemsToPrint.length} onConfirm={handlePrintConfirm} title="In phiếu điều chỉnh" />
      <CostAdjustmentImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={allAdjustments} onImport={handleImport} currentUser={{ name: employee?.fullName || 'Hệ thống', systemId: employee?.systemId || asSystemId('SYSTEM') }} />
      <CostAdjustmentExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={allAdjustments} filteredData={allAdjustments} currentPageData={tableData} selectedData={allSelectedRows} currentUser={{ name: employee?.fullName || 'Hệ thống', systemId: employee?.systemId || asSystemId('SYSTEM') }} />
    </ListPageShell>
  );
}
