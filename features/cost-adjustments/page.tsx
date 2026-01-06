'use client'

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, XCircle, CheckCircle, Printer, FileSpreadsheet, Download } from 'lucide-react';

import { useCostAdjustmentStore } from './store';
import { getColumns } from './columns';
import { ROUTES } from '@/lib/router';
import { usePageHeader } from '@/contexts/page-header-context';
import { useAuth } from '@/contexts/auth-context';
import { asSystemId } from '@/lib/id-types';
import { useFuseFilter } from '@/hooks/use-fuse-search';
import { isValidDate, isDateAfter, isDateBefore, isDateSame, isDateBetween, getStartOfDay, getEndOfDay } from '@/lib/date-utils';
import { usePrint } from '@/lib/use-print';
import { useAllBranches, useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { convertCostAdjustmentForPrint, mapCostAdjustmentToPrintData, mapCostAdjustmentLineItems } from '@/lib/print/cost-adjustment-print-helper';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { useColumnLayout } from '@/hooks/use-column-visibility';
import { useMediaQuery } from '@/lib/use-media-query';
import type { CostAdjustment } from '@/lib/types/prisma-extended';

import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { Button } from '@/components/ui/button';
import { PageToolbar } from '@/components/layout/page-toolbar';
import { PageFilters } from '@/components/layout/page-filters';
import { CostAdjustmentCard } from './cost-adjustment-card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from '@/components/shared/simple-print-options-dialog';

const CostAdjustmentImportDialog = dynamic(() => import("./components/cost-adjustments-import-export-dialogs").then(mod => ({ default: mod.CostAdjustmentImportDialog })), { ssr: false });
const CostAdjustmentExportDialog = dynamic(() => import("./components/cost-adjustments-import-export-dialogs").then(mod => ({ default: mod.CostAdjustmentExportDialog })), { ssr: false });

export function CostAdjustmentListPage() {
  const router = useRouter();
  const { data: adjustments, cancel, confirm } = useCostAdjustmentStore();
  const { employee } = useAuth();
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const { print, printMultiple } = usePrint();
  const { data: branches } = useAllBranches();
  const { findById: getBranchById } = useBranchFinder();
  const { info: storeInfo } = useStoreInfoData();

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
  const [dateFilter] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  const columnLayoutDefaults = React.useMemo(() => ({ visibility: {}, order: [] as string[], pinned: [] as string[] }), []);
  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('cost-adjustments', columnLayoutDefaults);

  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  const handleSinglePrint = React.useCallback((adj: CostAdjustment) => {
    const st = { name: storeInfo?.companyName || storeInfo?.brandName || '', address: storeInfo?.headquartersAddress || '', phone: storeInfo?.hotline || '', email: storeInfo?.email || '', website: storeInfo?.website, taxCode: storeInfo?.taxCode, province: storeInfo?.province, logo: storeInfo?.logo };
    const d = convertCostAdjustmentForPrint(adj, { creatorName: adj.createdByName ?? undefined });
    print('cost-adjustment', { data: mapCostAdjustmentToPrintData(d, st), lineItems: mapCostAdjustmentLineItems(d.items) });
  }, [storeInfo, print]);

  const columns = React.useMemo(() => getColumns(router.push, handleSinglePrint), [router, handleSinglePrint]);

  const headerActions = React.useMemo(() => [<Button key="add" className="h-9" onClick={() => router.push('/cost-adjustments/new')}><Plus className="mr-2 h-4 w-4" />Tạo phiếu</Button>], [router]);
  usePageHeader({ title: 'Danh sách điều chỉnh giá vốn', breadcrumb: [{ label: 'Trang chủ', href: ROUTES.ROOT }, { label: 'Điều chỉnh giá vốn', href: '/cost-adjustments', isCurrent: true }], actions: headerActions, showBackButton: false });

  const buildDefaultVisibility = React.useCallback(() => { const def = new Set(['id', 'referenceCode', 'createdDate', 'status', 'itemCount', 'totalOldValue', 'totalNewValue', 'difference', 'createdByName', 'reason']); const v: Record<string, boolean> = {}; columns.forEach(c => { if (!c.id) return; v[c.id] = c.id === 'select' || c.id === 'actions' || def.has(c.id); }); return v; }, [columns]);
  const buildDefaultOrder = React.useCallback(() => columns.map(c => c.id).filter(Boolean) as string[], [columns]);

  const defaultsInitialized = React.useRef(false);
  React.useEffect(() => { if (columns.length === 0 || defaultsInitialized.current) return; defaultsInitialized.current = true; setColumnVisibility(buildDefaultVisibility()); setColumnOrder(buildDefaultOrder()); }, [columns, buildDefaultVisibility, buildDefaultOrder, setColumnVisibility, setColumnOrder]);

  const resetColumnLayout = React.useCallback(() => { setColumnVisibility(buildDefaultVisibility()); setColumnOrder(buildDefaultOrder()); setPinnedColumns([]); toast.success('Đã khôi phục bố cục mặc định'); }, [buildDefaultVisibility, buildDefaultOrder, setColumnVisibility, setColumnOrder, setPinnedColumns]);

  const fuseOptions = React.useMemo(() => ({ keys: ['id', 'createdByName', 'reason', 'referenceCode'], threshold: 0.3, ignoreLocation: true }), []);
  const searchedAdjustments = useFuseFilter(adjustments, debouncedGlobalFilter.trim(), fuseOptions);

  const filteredData = React.useMemo(() => {
    let f = [...adjustments];
    if (statusFilter.size > 0) f = f.filter(a => statusFilter.has(a.status));
    if (debouncedGlobalFilter.trim()) { const ids = new Set(searchedAdjustments.map(a => a.systemId)); f = f.filter(a => ids.has(a.systemId)); }
    if (dateFilter?.[0] || dateFilter?.[1]) { const [s, e] = dateFilter; const sd = s ? getStartOfDay(s) : null, ed = e ? getEndOfDay(e) : null; f = f.filter(a => { if (!a.createdDate) return false; const d = new Date(a.createdDate); if (!isValidDate(d)) return false; if (sd && !ed) return isDateAfter(d, sd) || isDateSame(d, sd); if (!sd && ed) return isDateBefore(d, ed) || isDateSame(d, ed); if (sd && ed) return isDateBetween(d, sd, ed); return true; }); }
    return f;
  }, [adjustments, statusFilter, debouncedGlobalFilter, dateFilter, searchedAdjustments]);

  React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedGlobalFilter, statusFilter, dateFilter]);

  const sortedData = React.useMemo(() => { const s = [...filteredData]; if (sorting.id) s.sort((a, b) => { const aV = (a as Record<string, unknown>)[sorting.id], bV = (b as Record<string, unknown>)[sorting.id]; if (aV == null) return 1; if (bV == null) return -1; if (sorting.id === 'createdAt' || sorting.id === 'createdDate') { const aT = aV ? new Date(aV as string).getTime() : 0, bT = bV ? new Date(bV as string).getTime() : 0; return sorting.desc ? bT - aT : aT - bT; } return aV < bV ? (sorting.desc ? 1 : -1) : aV > bV ? (sorting.desc ? -1 : 1) : 0; }); return s; }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);
  const allSelectedRows = React.useMemo(() => adjustments.filter(a => rowSelection[a.systemId]), [adjustments, rowSelection]);
  const selectedAdjustments = React.useMemo(() => adjustments.filter(a => rowSelection[a.systemId]), [adjustments, rowSelection]);

  const handleImport = React.useCallback(async (importedAdjustments: Partial<CostAdjustment>[], mode: 'insert-only' | 'update-only' | 'upsert') => {
    let addedCount = 0, skippedCount = 0; const errors: Array<{ row: number; message: string }> = [];
    const store = useCostAdjustmentStore.getState(), creatorId = employee?.systemId || asSystemId('SYSTEM'), creatorName = employee?.fullName || 'Hệ thống';
    importedAdjustments.forEach((adj, i) => { try { const ex = store.getByBusinessId(adj.id?.toString() || ''); if (ex) { skippedCount++; } else if (mode !== 'update-only' && adj.items?.length) { store.create(adj.items.map(it => ({ productSystemId: it.productSystemId, productId: it.productId, productName: it.productName, productImage: it.productImage, oldCostPrice: it.oldCostPrice, newCostPrice: it.newCostPrice, reason: it.reason })), adj.type || 'manual', creatorId, creatorName, { customId: adj.id?.toString(), note: adj.note, reason: adj.reason, referenceCode: adj.referenceCode, status: adj.status || 'draft' }); addedCount++; } else { skippedCount++; } } catch (e) { errors.push({ row: i + 1, message: (e as Error).message }); } });
    if (addedCount > 0) toast.success(`Đã import ${addedCount} phiếu`);
    return { success: addedCount, failed: errors.length, inserted: addedCount, updated: 0, skipped: skippedCount, errors };
  }, [employee]);

  const handleBulkCancel = React.useCallback(() => { const drafts = allSelectedRows.filter(a => a.status === 'draft'); if (drafts.length === 0) { toast.info('Không có phiếu nào có thể hủy'); return; } setConfirmDialogState({ type: 'bulk-cancel', items: drafts }); }, [allSelectedRows]);
  const handleBulkConfirm = React.useCallback(() => { const drafts = allSelectedRows.filter(a => a.status === 'draft'); if (drafts.length === 0) { toast.info('Không có phiếu nào có thể xác nhận'); return; } setConfirmDialogState({ type: 'bulk-confirm', items: drafts }); }, [allSelectedRows]);

  const handleConfirmDialogAction = React.useCallback(async () => {
    if (!confirmDialogState || !employee) return; setIsConfirmLoading(true);
    try {
      const uid = asSystemId(employee.systemId), uname = employee.fullName || 'Người dùng'; let c = 0;
      confirmDialogState.items.forEach(it => { if (confirmDialogState.type === 'bulk-cancel' && cancel(asSystemId(it.systemId), uid, uname, 'Hủy hàng loạt')) c++; if (confirmDialogState.type === 'bulk-confirm' && confirm(asSystemId(it.systemId), uid, uname)) c++; });
      if (c > 0) toast.success(`Đã ${confirmDialogState.type === 'bulk-cancel' ? 'hủy' : 'xác nhận'} ${c} phiếu`);
      setRowSelection({});
    } finally { setIsConfirmLoading(false); setConfirmDialogState(null); }
  }, [confirmDialogState, employee, cancel, confirm]);

  const handleBulkPrint = React.useCallback(() => { if (allSelectedRows.length === 0) return; setItemsToPrint(allSelectedRows); setPrintDialogOpen(true); }, [allSelectedRows]);
  const handlePrintConfirm = React.useCallback((r: SimplePrintOptionsResult) => {
    if (itemsToPrint.length === 0) return;
    const branch = r.branchSystemId ? getBranchById(r.branchSystemId) : null;
    const st = { name: storeInfo?.companyName || storeInfo?.brandName || '', address: storeInfo?.headquartersAddress || '', phone: storeInfo?.hotline || '', email: storeInfo?.email || '', website: storeInfo?.website, taxCode: storeInfo?.taxCode, province: storeInfo?.province, logo: storeInfo?.logo };
    const list = itemsToPrint.map(adj => { const d = convertCostAdjustmentForPrint(adj, { branch, creatorName: adj.createdByName ?? undefined }); return { data: mapCostAdjustmentToPrintData(d, st), lineItems: mapCostAdjustmentLineItems(d.items), paperSize: r.paperSize }; });
    printMultiple('cost-adjustment', list); setPrintDialogOpen(false); setItemsToPrint([]); setRowSelection({}); toast.success(`Đang in ${itemsToPrint.length} phiếu`);
  }, [itemsToPrint, getBranchById, storeInfo, printMultiple]);

  const bulkActions = React.useMemo(() => [{ label: 'In phiếu', icon: Printer, onSelect: handleBulkPrint }, { label: 'Xác nhận', icon: CheckCircle, onSelect: handleBulkConfirm }, { label: 'Hủy phiếu', icon: XCircle, onSelect: handleBulkCancel, variant: 'destructive' as const }], [handleBulkPrint, handleBulkConfirm, handleBulkCancel]);
  const confirmDialogCopy = React.useMemo(() => confirmDialogState ? confirmDialogState.type === 'bulk-cancel' ? { title: 'Hủy nhiều phiếu', description: `Hủy ${confirmDialogState.items.length} phiếu?`, confirmLabel: 'Hủy' } : { title: 'Xác nhận nhiều phiếu', description: `Xác nhận ${confirmDialogState.items.length} phiếu?`, confirmLabel: 'Xác nhận' } : null, [confirmDialogState]);
  const statusOptions = React.useMemo(() => [{ value: 'draft', label: 'Nháp' }, { value: 'confirmed', label: 'Đã xác nhận' }, { value: 'cancelled', label: 'Đã hủy' }], []);
  const handleRowClick = (r: CostAdjustment) => router.push(`/cost-adjustments/${r.systemId}`);
  const handleConfirmCard = React.useCallback((id: string) => { router.push(`/cost-adjustments/${id}`); toast.info('Mở chi tiết để xác nhận'); }, [router]);
  const handleCancelCard = React.useCallback((id: string) => { router.push(`/cost-adjustments/${id}`); toast.info('Mở chi tiết để hủy'); }, [router]);

  return (
    <div className="flex flex-col w-full h-full">
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onResetToDefault={resetColumnLayout} />} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm kiếm phiếu điều chỉnh..."><DataTableFacetedFilter title="Trạng thái" options={statusOptions} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} /></PageFilters>
      <div className="w-full py-4"><ResponsiveDataTable columns={columns} data={paginatedData} renderMobileCard={adj => <CostAdjustmentCard adjustment={adj} onConfirm={handleConfirmCard} onCancel={handleCancelCard} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={filteredData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} bulkActions={bulkActions} showBulkDeleteButton={false} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} /></div>
      <AlertDialog open={!!confirmDialogState} onOpenChange={o => { if (!o && !isConfirmLoading) setConfirmDialogState(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{confirmDialogCopy?.title}</AlertDialogTitle><AlertDialogDescription>{confirmDialogCopy?.description}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9" disabled={isConfirmLoading}>Đóng</AlertDialogCancel><AlertDialogAction className="h-9" disabled={isConfirmLoading} onClick={handleConfirmDialogAction}>{isConfirmLoading ? 'Đang xử lý...' : confirmDialogCopy?.confirmLabel}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} selectedCount={itemsToPrint.length} onConfirm={handlePrintConfirm} title="In phiếu điều chỉnh" />
      <CostAdjustmentImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={adjustments} onImport={handleImport} currentUser={{ name: employee?.fullName || 'Hệ thống', systemId: employee?.systemId || asSystemId('SYSTEM') }} />
      <CostAdjustmentExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={adjustments} filteredData={sortedData} currentPageData={paginatedData} selectedData={selectedAdjustments} currentUser={{ name: employee?.fullName || 'Hệ thống', systemId: employee?.systemId || asSystemId('SYSTEM') }} />
    </div>
  );
}
