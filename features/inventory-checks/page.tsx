/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/router';
import { useInventoryCheckStore } from './store';
import { getColumns } from './columns';
import { InventoryCheckCard } from './card';
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
import { Plus, Download, Printer, XCircle, Scale, FileSpreadsheet } from 'lucide-react';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from '@/components/shared/simple-print-options-dialog';
import { toast } from 'sonner';
import { useFuseFilter } from '@/hooks/use-fuse-search';
import { asSystemId } from '@/lib/id-types';
import type { InventoryCheck } from '@/lib/types/prisma-extended';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { usePrint } from '@/lib/use-print';
import { useAllBranches, useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { convertInventoryCheckForPrint, mapInventoryCheckToPrintData, mapInventoryCheckLineItems, createStoreSettings } from '@/lib/print/inventory-check-print-helper';

const InventoryCheckImportDialog = dynamic(() => import("./components/inventory-checks-import-export-dialogs").then(m => ({ default: m.InventoryCheckImportDialog })), { ssr: false });
const InventoryCheckExportDialog = dynamic(() => import("./components/inventory-checks-import-export-dialogs").then(m => ({ default: m.InventoryCheckExportDialog })), { ssr: false });

type ConfirmState = { type: 'cancel'; item: InventoryCheck } | { type: 'balance'; item: InventoryCheck } | { type: 'bulk-cancel'; items: InventoryCheck[] } | { type: 'bulk-balance'; items: InventoryCheck[] } | null;

export function InventoryChecksPage() {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const { employee: currentUser } = useAuth();
  const { data, balanceCheck, cancelCheck, update, add } = useInventoryCheckStore();
  const { info: storeInfo } = useStoreInfoData();
  const { data: branches } = useAllBranches();
  const { findById: findBranchById } = useBranchFinder();
  const { print, printMultiple } = usePrint();

  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintItems, setPendingPrintItems] = React.useState<InventoryCheck[]>([]);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState({ id: 'createdAt', desc: true });
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [confirmState, setConfirmState] = React.useState<ConfirmState>(null);
  const [isConfirmLoading, setIsConfirmLoading] = React.useState(false);

  const handleEdit = React.useCallback((item: InventoryCheck) => router.push(ROUTES.INVENTORY.INVENTORY_CHECK_EDIT.replace(':systemId', item.systemId)), [router]);
  const requestCancel = React.useCallback((item: InventoryCheck) => { if (item.status !== 'draft') { toast.info('Chỉ có thể hủy phiếu đang ở trạng thái Nháp'); return; } setConfirmState({ type: 'cancel', item }); }, []);
  const requestBalance = React.useCallback((item: InventoryCheck) => setConfirmState({ type: 'balance', item }), []);
  const handlePrint = React.useCallback((item: InventoryCheck) => { const branch = item.branchSystemId ? findBranchById(item.branchSystemId) : undefined; const ss = branch ? { name: branch.name, address: branch.address || '', phone: branch.phone || '', email: '', province: branch.province || '' } : createStoreSettings(storeInfo); const cd = convertInventoryCheckForPrint(item, { branch }); print('inventory-check', { data: mapInventoryCheckToPrintData(cd, ss), lineItems: mapInventoryCheckLineItems(cd.items) }); }, [findBranchById, storeInfo, print]);

  const handleConfirmAction = React.useCallback(async () => { if (!confirmState) return; setIsConfirmLoading(true); try { if (confirmState.type === 'cancel') { cancelCheck(asSystemId(confirmState.item.systemId), 'Hủy từ danh sách'); toast.success(`Đã hủy phiếu ${confirmState.item.id}`); } else if (confirmState.type === 'balance') { await balanceCheck(asSystemId(confirmState.item.systemId)); toast.success(`Đã cân bằng phiếu ${confirmState.item.id}`); } else if (confirmState.type === 'bulk-cancel') { let ok = 0; confirmState.items.forEach(i => { if (i.status === 'draft') { cancelCheck(asSystemId(i.systemId), 'Hủy hàng loạt'); ok++; } }); setRowSelection({}); ok > 0 ? toast.success(`Đã hủy ${ok} phiếu`) : toast.info('Không có phiếu nào được hủy'); } else if (confirmState.type === 'bulk-balance') { let ok = 0; for (const i of confirmState.items) { if (i.status === 'draft') { await balanceCheck(asSystemId(i.systemId)); ok++; } } setRowSelection({}); ok > 0 ? toast.success(`Đã cân bằng ${ok} phiếu`) : toast.info('Không có phiếu nào được cân bằng'); } } catch { toast.error('Không thể hoàn tất hành động'); } finally { setIsConfirmLoading(false); setConfirmState(null); } }, [balanceCheck, cancelCheck, confirmState]);

  const columns = React.useMemo(() => getColumns(handleEdit, requestCancel, requestBalance, router, handlePrint), [handleEdit, router, requestCancel, requestBalance, handlePrint]);
  const columnDefaultsInitialized = React.useRef(false);
  React.useEffect(() => { if (columnDefaultsInitialized.current || !columns?.length) return; const dv = ['id', 'branch', 'status', 'createdAt', 'createdBy', 'balancedAt', 'itemsCount', 'systemQty', 'actualQty', 'difference', 'itemPreview', 'note']; const iv: Record<string, boolean> = {}; columns.forEach(c => { iv[c.id!] = c.id === 'select' || c.id === 'actions' || dv.includes(c.id!); }); setColumnVisibility(iv); setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); columnDefaultsInitialized.current = true; }, [columns]);

  const fuseOpts = React.useMemo(() => ({ keys: ['id', 'branchName', 'createdBy', 'note'], threshold: 0.3 }), []);
  const searchedData = useFuseFilter(data, searchQuery, fuseOpts);
  const filteredData = React.useMemo(() => { let r = searchedData; if (statusFilter !== 'all') r = r.filter(i => i.status === statusFilter); if (sorting) r = [...r].sort((a, b) => { const av = a[sorting.id as keyof InventoryCheck], bv = b[sorting.id as keyof InventoryCheck]; if (sorting.id === 'createdAt' || sorting.id === 'checkDate') { const at = av ? new Date(av as string | number | Date).getTime() : 0, bt = bv ? new Date(bv as string | number | Date).getTime() : 0; return sorting.desc ? bt - at : at - bt; } if (av == null && bv == null) return 0; if (av == null) return 1; if (bv == null) return -1; if (av < bv) return sorting.desc ? 1 : -1; if (av > bv) return sorting.desc ? -1 : 1; return 0; }); return r; }, [searchedData, statusFilter, sorting]);

  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => filteredData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [filteredData, pagination]);
  React.useEffect(() => { setMobileLoadedCount(20); }, [searchQuery, statusFilter]);
  React.useEffect(() => { if (!isMobile) return; const h = () => { if ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight > 0.8 && mobileLoadedCount < filteredData.length) setMobileLoadedCount(p => Math.min(p + 20, filteredData.length)); }; window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, [isMobile, mobileLoadedCount, filteredData.length]);
  const displayData = isMobile ? filteredData.slice(0, mobileLoadedCount) : paginatedData;
  const allSelectedRows = React.useMemo(() => Object.keys(rowSelection).filter(k => rowSelection[k]).map(s => filteredData.find(i => i.systemId === s)).filter(Boolean) as InventoryCheck[], [rowSelection, filteredData]);
  const selectedChecks = React.useMemo(() => data.filter(c => rowSelection[c.systemId]), [data, rowSelection]);

  const handleImport = React.useCallback(async (checks: Partial<InventoryCheck>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => { let added = 0, updated = 0, skipped = 0; const errors: Array<{ row: number; message: string }> = []; checks.forEach((c, i) => { try { const ex = data.find(x => x.id.toLowerCase() === (c.id || '').toLowerCase()); if (ex) { if (mode === 'update-only' || mode === 'upsert') { update(asSystemId(ex.systemId), { ...ex, ...c, systemId: ex.systemId } as InventoryCheck); updated++; } else skipped++; } else { if (mode === 'insert-only' || mode === 'upsert') { add(c as InventoryCheck); added++; } else skipped++; } } catch (e) { errors.push({ row: i + 1, message: (e as Error).message }); } }); if (added > 0 || updated > 0) toast.success(`Đã import: ${added > 0 ? `${added} mới` : ''}${updated > 0 ? `, ${updated} cập nhật` : ''}`); return { success: added + updated, failed: errors.length, inserted: added, updated, skipped, errors }; }, [data, add, update]);

  const handleBulkPrint = React.useCallback(() => { if (!allSelectedRows.length) return; setPendingPrintItems(allSelectedRows); setIsPrintDialogOpen(true); }, [allSelectedRows]);
  const handlePrintConfirm = React.useCallback((opts: SimplePrintOptionsResult) => { const list = pendingPrintItems.map(i => { const b = opts.branchSystemId ? findBranchById(opts.branchSystemId) : (i.branchSystemId ? findBranchById(i.branchSystemId) : undefined); const ss = b ? { name: b.name, address: b.address || '', phone: b.phone || '', email: '', province: b.province || '' } : createStoreSettings(storeInfo); const cd = convertInventoryCheckForPrint(i, { branch: b }); return { data: mapInventoryCheckToPrintData(cd, ss), lineItems: mapInventoryCheckLineItems(cd.items), paperSize: opts.paperSize }; }); printMultiple('inventory-check', list); toast.success('Đã gửi lệnh in', { description: pendingPrintItems.map(i => i.id).join(', ') }); setRowSelection({}); setPendingPrintItems([]); }, [pendingPrintItems, findBranchById, storeInfo, printMultiple]);
  const handleBulkCancel = React.useCallback(() => { const d = allSelectedRows.filter(i => i.status === 'draft'); if (!d.length) { toast.info('Không có phiếu nào có thể hủy'); return; } setConfirmState({ type: 'bulk-cancel', items: d }); }, [allSelectedRows]);
  const handleBulkBalance = React.useCallback(() => { const d = allSelectedRows.filter(i => i.status === 'draft'); if (!d.length) { toast.info('Không có phiếu nào có thể cân bằng'); return; } setConfirmState({ type: 'bulk-balance', items: d }); }, [allSelectedRows]);

  const bulkActions = React.useMemo(() => [{ label: 'In phiếu kiểm', icon: Printer, onSelect: handleBulkPrint }, { label: 'Cân bằng', icon: Scale, onSelect: handleBulkBalance }, { label: 'Hủy phiếu', icon: XCircle, onSelect: handleBulkCancel, variant: 'destructive' as const }], [handleBulkPrint, handleBulkBalance, handleBulkCancel]);
  const headerActions = React.useMemo(() => [<Button key="add" className="h-9" onClick={() => router.push(ROUTES.INVENTORY.INVENTORY_CHECK_NEW)}><Plus className="mr-2 h-4 w-4" />Tạo phiếu kiểm hàng</Button>], [router]);
  const confirmDialogCopy = React.useMemo(() => { if (!confirmState) return null; if (confirmState.type === 'cancel') return { title: 'Hủy phiếu kiểm hàng', description: `Bạn có chắc muốn hủy phiếu ${confirmState.item?.id}?`, confirmLabel: 'Hủy phiếu' }; if (confirmState.type === 'balance') return { title: 'Cân bằng phiếu kiểm hàng', description: `Sau khi cân bằng, tồn kho sẽ cập nhật theo số thực tế của phiếu ${confirmState.item?.id}.`, confirmLabel: 'Cân bằng ngay' }; if (confirmState.type === 'bulk-cancel') return { title: 'Hủy nhiều phiếu kiểm hàng', description: `Bạn sắp hủy ${confirmState.items?.length ?? 0} phiếu kiểm hàng.`, confirmLabel: `Hủy ${confirmState.items?.length ?? 0} phiếu` }; return { title: 'Cân bằng nhiều phiếu kiểm hàng', description: `Bạn sắp cân bằng ${confirmState.items?.length ?? 0} phiếu kiểm hàng.`, confirmLabel: `Cân bằng ${confirmState.items?.length ?? 0} phiếu` }; }, [confirmState]);
  usePageHeader({ title: 'Danh sách kiểm hàng', breadcrumb: [{ label: 'Trang chủ', href: ROUTES.DASHBOARD, isCurrent: false }, { label: 'Kiểm hàng', href: ROUTES.INVENTORY.INVENTORY_CHECKS, isCurrent: true }], actions: headerActions });

  return (
    <div className="space-y-4">
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={columns?.length ? <DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} /> : null} />}
      <div className="flex flex-col gap-2 md:flex-row md:items-center"><Input placeholder="Tìm kiếm theo mã, chi nhánh, người tạo..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-9 max-w-sm" /><DataTableFacetedFilter title="Trạng thái" selectedValues={new Set(statusFilter === 'all' ? [] : [statusFilter])} onSelectedValuesChange={v => setStatusFilter(v.size === 0 ? 'all' : Array.from(v)[0] as string)} options={[{ label: 'Nháp', value: 'draft' }, { label: 'Đã cân bằng', value: 'balanced' }, { label: 'Đã hủy', value: 'cancelled' }]} /></div>
      <ResponsiveDataTable columns={columns} data={displayData} renderMobileCard={i => <InventoryCheckCard item={i} onEdit={handleEdit} onBalance={requestBalance} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={filteredData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} bulkActions={bulkActions} showBulkDeleteButton={false} sorting={sorting} setSorting={setSorting} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} emptyTitle="Không có phiếu kiểm hàng" emptyDescription="Tạo phiếu kiểm hàng đầu tiên để bắt đầu" />
      {isMobile && mobileLoadedCount < filteredData.length && <div className="py-6 text-center"><div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-body-sm">Đang tải thêm...</span></div></div>}
      {isMobile && mobileLoadedCount >= filteredData.length && filteredData.length > 20 && <div className="py-6 text-center"><p className="text-body-sm text-muted-foreground">Đã hiển thị tất cả {filteredData.length} kết quả</p></div>}
      <AlertDialog open={!!confirmState} onOpenChange={o => { if (!o && !isConfirmLoading) setConfirmState(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{confirmDialogCopy?.title}</AlertDialogTitle><AlertDialogDescription>{confirmDialogCopy?.description}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9" disabled={isConfirmLoading}>Hủy</AlertDialogCancel><AlertDialogAction className="h-9" disabled={isConfirmLoading} onClick={handleConfirmAction}>{isConfirmLoading ? 'Đang xử lý...' : confirmDialogCopy?.confirmLabel ?? 'Đồng ý'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <SimplePrintOptionsDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={pendingPrintItems.length} title="In phiếu kiểm hàng" />
      <InventoryCheckImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={data} onImport={handleImport} currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />
      <InventoryCheckExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={data} filteredData={filteredData} currentPageData={paginatedData} selectedData={selectedChecks} currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />
    </div>
  );
}
