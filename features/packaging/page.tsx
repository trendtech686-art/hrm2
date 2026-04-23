'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { formatDate } from '@/lib/date-utils';
import type { PackagingSlip, PaperSize } from '@/lib/types/prisma-extended';
import type { PrintData, PrintLineItem } from '@/lib/print-service';
import { usePageHeader } from '../../contexts/page-header-context';
import { useAuth } from '../../contexts/auth-context';
import { fetchOrder } from '../orders/api/orders-api';
import { useAllPackagingSlips } from './hooks/use-all-packaging-slips';
import { usePackagingActions } from '../orders/hooks/use-packaging-actions';
import { useAllBranches, useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { useCustomerFinder } from '../customers/hooks/use-all-customers';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { getColumns } from './columns';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../components/data-table/dynamic-column-customizer';
import { PageToolbar } from '../../components/layout/page-toolbar';
import { PageFilters } from '../../components/layout/page-filters';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';
import { Card, CardContent, CardTitle } from '../../components/ui/card';
import { MobileCard } from '@/components/mobile/mobile-card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Package, MoreHorizontal, Calendar, User, Inbox, Printer, Download, Settings, UserPlus } from 'lucide-react';
import { TouchButton } from '../../components/mobile/touch-button';
import { useMediaQuery } from '../../lib/use-media-query';
import { simpleSearch } from '@/lib/simple-search';
import { usePrint } from '../../lib/use-print';
import { convertToPackingForPrint, mapPackingToPrintData, mapPackingLineItems, createStoreSettings } from '../../lib/print/order-print-helper';
import { asSystemId } from '../../lib/id-types';
import { useColumnVisibility, useColumnOrder, usePinnedColumns } from '../../hooks/use-column-visibility';
import { useAllEmployees } from '../employees/hooks/use-all-employees';
import { bulkAssignPackagingAction } from '@/app/actions/order-actions';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { ListPageShell } from '@/components/layout/page-section';

const PackagingExportDialog = dynamic(() => import("./components/packaging-import-export-dialogs").then(mod => ({ default: mod.PackagingExportDialog })), { ssr: false });

function CancelDialog({ isOpen, onOpenChange, onConfirm }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = React.useState('');
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Hủy yêu cầu đóng gói</DialogTitle><DialogDescription>Vui lòng nhập lý do hủy. Hành động này sẽ cập nhật trạng thái của phiếu đóng gói thành 'Hủy đóng gói'.</DialogDescription></DialogHeader>
        <div className='pt-4'><Label htmlFor='cancel-reason'>Lý do hủy</Label><Textarea id='cancel-reason' value={reason} onChange={(e) => setReason(e.target.value)} className='mt-2' placeholder='Nhập lý do...' /></div>
        <DialogFooter><Button variant='outline' onClick={() => onOpenChange(false)}>Thoát</Button><Button variant='destructive' onClick={() => { onConfirm(reason); setReason(''); }}>Xác nhận Hủy</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PackagingPage() {
    // ✅ Dedicated packaging API — no longer loads ALL orders for list display
    const { data: packagingSlips } = useAllPackagingSlips();
    const { confirmPackaging, cancelPackagingRequest } = usePackagingActions();
    const { data: branches } = useAllBranches();
    const { findById: findBranchById } = useBranchFinder();
    const { findById: findCustomerById } = useCustomerFinder();
    const {  employee: authEmployee, can } = useAuth();
  const canCreate = can('create_packaging');
  const canEdit = can('edit_packaging');
  const canEditSettings = can('edit_settings');
    // ⚡ OPTIMIZED: storeInfo lazy loaded in print handlers
    const { print, printMultiple } = usePrint();
    const router = useRouter(), currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM', isMobile = !useMediaQuery('(min-width: 768px)');
    
    const [printDialogOpen, setPrintDialogOpen] = React.useState(false), [itemsToPrint, setItemsToPrint] = React.useState<PackagingSlip[]>([]), [exportDialogOpen, setExportDialogOpen] = React.useState(false);
    const [cancelDialogState, setCancelDialogState] = React.useState<{ orderSystemId: string, packagingSystemId: string } | null>(null);
    const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
    const [assignRows, setAssignRows] = React.useState<PackagingSlip[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = React.useState('');
    const { data: allEmployees } = useAllEmployees({ enabled: assignDialogOpen });
    const [globalFilter, setGlobalFilter] = React.useState(''), [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 }), [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
    const [rowSelection, setRowSelection] = React.useState({}), [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
    const defaultColumnVisibility = React.useMemo(() => {
        const cols = getColumns(() => {}, () => {}, () => {}), initial: Record<string, boolean> = {};
        cols.forEach(c => { if (c.id) initial[c.id] = true; });
        return initial;
    }, []);
    const [columnVisibility, setColumnVisibility] = useColumnVisibility('packaging', defaultColumnVisibility);
    const [columnOrder, setColumnOrder] = useColumnOrder('packaging'), [pinnedColumns, setPinnedColumns] = usePinnedColumns('packaging'), [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null), columnOrderInitialized = React.useRef(false);

    // Advanced filter panel
    const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('packaging');
    const filterConfigs: FilterConfig[] = React.useMemo(() => [
      { id: 'branch', label: 'Chi nhánh', type: 'select' as const, options: [{ label: 'Tất cả', value: 'all' }, ...branches.map(b => ({ label: b.name, value: b.systemId }))] },
      { id: 'status', label: 'Trạng thái', type: 'select' as const, options: [
        { label: 'Tất cả', value: 'all' },
        { label: 'Chờ đóng gói', value: 'Chờ đóng gói' },
        { label: 'Đã đóng gói', value: 'Đã đóng gói' },
        { label: 'Hủy đóng gói', value: 'Hủy đóng gói' },
      ] },
      { id: 'requestDate', label: 'Ngày yêu cầu', type: 'date-range' as const },
    ], [branches]);
    const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});
    const panelValues = React.useMemo(() => ({
      branch: advancedFilters.branch ?? null,
      status: advancedFilters.status ?? null,
      requestDate: advancedFilters.requestDate ?? null,
    }), [advancedFilters]);
    const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
      setAdvancedFilters(v);
      setPagination(p => ({ ...p, pageIndex: 0 }));
    }, []);

    usePageHeader({ title: 'Phiếu đóng gói', breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Đóng gói', href: '/packaging', isCurrent: true }], showBackButton: false });

    React.useEffect(() => { const timer = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(timer); }, [globalFilter]);


    const handleConfirm = React.useCallback(async (orderSystemId: string, packagingSystemId: string) => { await confirmPackaging(orderSystemId, packagingSystemId, currentUserSystemId); }, [confirmPackaging, currentUserSystemId]);
    const handleCancelRequest = React.useCallback((orderSystemId: string, packagingSystemId: string) => { setCancelDialogState({ orderSystemId, packagingSystemId }); }, []);
    const handleConfirmCancel = async (reason: string) => { if (cancelDialogState) { await cancelPackagingRequest(cancelDialogState.orderSystemId, cancelDialogState.packagingSystemId, currentUserSystemId, reason); setCancelDialogState(null); } };
    const handleBulkPrint = React.useCallback((rows: PackagingSlip[]) => { setItemsToPrint(rows); setPrintDialogOpen(true); }, []);

    // Handler khi xác nhận in từ dialog
    const getStoreSettings = React.useCallback((branch: ReturnType<typeof findBranchById>, storeInfo: Awaited<ReturnType<typeof fetchPrintData>>['storeInfo']) => branch 
        ? createStoreSettings(branch) 
        : { name: storeInfo?.companyName || storeInfo?.brandName || '', address: storeInfo?.headquartersAddress || '', phone: storeInfo?.hotline || '', email: storeInfo?.email || '', province: storeInfo?.province || '' }, []);

    const findOrderAndPackaging = React.useCallback(async (pkgSystemId: string, orderSystemId: string) => {
        try {
            const order = await fetchOrder(orderSystemId);
            const pkg = order.packagings?.find(p => p.systemId === pkgSystemId);
            if (pkg) return { order, pkg };
        } catch { /* order not found */ }
        return null;
    }, []);

    const handlePrintConfirm = React.useCallback(async (options: SimplePrintOptionsResult) => {
        if (itemsToPrint.length === 0) return;
        const { branchSystemId, paperSize } = options;
        const selectedBranch = branchSystemId ? findBranchById(branchSystemId) : null;
        const { storeInfo } = await fetchPrintData();
        const printOptionsList: Array<{ data: PrintData; lineItems?: PrintLineItem[]; paperSize?: PaperSize }> = [];
        
        const results = await Promise.all(itemsToPrint.map(pkg => findOrderAndPackaging(pkg.systemId, pkg.orderSystemId)));
        results.forEach(found => {
            if (!found) return;
            const customer = findCustomerById(found.order.customerSystemId);
            const branch = selectedBranch || findBranchById(found.order.branchSystemId);
            const packingData = convertToPackingForPrint(found.order, found.pkg, { customer });
            printOptionsList.push({ data: mapPackingToPrintData(packingData, getStoreSettings(branch, storeInfo)), lineItems: mapPackingLineItems(packingData.items), paperSize: paperSize as PaperSize });
        });

        if (printOptionsList.length > 0) { printMultiple('packing', printOptionsList); toast.success(`Đang in ${printOptionsList.length} phiếu đóng gói`); }
        setPrintDialogOpen(false); setItemsToPrint([]); setRowSelection({});
    }, [itemsToPrint, findOrderAndPackaging, findCustomerById, findBranchById, getStoreSettings, printMultiple]);
    
    const handlePrintPackaging = React.useCallback(async (packagingIds: string[]) => {
        const { storeInfo } = await fetchPrintData();
        const slips = packagingIds.map(id => packagingSlips.find(s => s.systemId === id)).filter(Boolean) as PackagingSlip[];
        const results = await Promise.all(slips.map(slip => findOrderAndPackaging(slip.systemId, slip.orderSystemId)));
        results.forEach(found => {
            if (!found) return;
            const customer = findCustomerById(found.order.customerSystemId);
            const branch = findBranchById(found.order.branchSystemId);
            const packingData = convertToPackingForPrint(found.order, found.pkg, { customer });
            print('packing', { data: mapPackingToPrintData(packingData, getStoreSettings(branch, storeInfo)), lineItems: mapPackingLineItems(packingData.items) });
        });
    }, [packagingSlips, findOrderAndPackaging, findCustomerById, findBranchById, getStoreSettings, print]);

    const handlePrintSinglePackaging = React.useCallback((packagingId: string) => handlePrintPackaging([packagingId]), [handlePrintPackaging]);
    
    const columns = React.useMemo(() => getColumns(handleConfirm, handleCancelRequest, handlePrintSinglePackaging), [handleConfirm, handleCancelRequest, handlePrintSinglePackaging]);
    
    React.useEffect(() => { if (columnOrderInitialized.current) return; columnOrderInitialized.current = true; setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); }, [columns]);
    
    const searchedPackagingSlips = React.useMemo(() => 
        simpleSearch(packagingSlips, debouncedGlobalFilter.trim(), { keys: ['id', 'orderId', 'customerName', 'assignedEmployeeName', 'branchName'] }), 
        [packagingSlips, debouncedGlobalFilter]
    );

    const filteredData = React.useMemo(() => {
        let data = packagingSlips;
        const branch = advancedFilters.branch as string | undefined;
        const status = advancedFilters.status as string | undefined;
        if (branch && branch !== 'all') data = data.filter(s => s.branchName === branches.find(b => b.systemId === branch)?.name);
        if (status && status !== 'all') data = data.filter(s => s.status === status);
        if (debouncedGlobalFilter?.trim()) { const searchIds = new Set(searchedPackagingSlips.map(item => item.systemId)); data = data.filter(s => searchIds.has(s.systemId)); }
        return data;
    }, [packagingSlips, advancedFilters, debouncedGlobalFilter, searchedPackagingSlips, branches]);
    
    React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedGlobalFilter, advancedFilters]);
    
    const sortedData = React.useMemo(() => {
        const sorted = [...filteredData];
        if (sorting.id) {
            sorted.sort((a, b) => {
                const aValue = (a as Record<string, unknown>)[sorting.id], bValue = (b as Record<string, unknown>)[sorting.id];
                if (!aValue) return 1; if (!bValue) return -1;
                if (sorting.id === 'createdAt' || sorting.id === 'requestDate') {
                  const aTime = aValue ? new Date(aValue as string | number | Date).getTime() : 0, bTime = bValue ? new Date(bValue as string | number | Date).getTime() : 0;
                  return sorting.desc ? bTime - aTime : aTime - bTime;
                }
                if (aValue < bValue) return sorting.desc ? 1 : -1; if (aValue > bValue) return sorting.desc ? -1 : 1;
                return 0;
            });
        }
        return sorted;
    }, [filteredData, sorting]);

    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = React.useMemo(() => { const start = pagination.pageIndex * pagination.pageSize; return sortedData.slice(start, start + pagination.pageSize); }, [sortedData, pagination]);
    const allSelectedRows = React.useMemo(() => packagingSlips.filter(p => rowSelection[p.systemId]), [packagingSlips, rowSelection]);

    const handleBulkAssign = React.useCallback((rows: PackagingSlip[]) => {
      const pendingRows = rows.filter(r => r.status === 'Chờ đóng gói');
      if (pendingRows.length === 0) { toast.error('Không có phiếu nào ở trạng thái chờ đóng gói'); return; }
      setAssignRows(pendingRows);
      setSelectedEmployeeId('');
      setAssignDialogOpen(true);
    }, []);

    const handleConfirmBulkAssign = React.useCallback(async () => {
      if (!selectedEmployeeId) { toast.error('Vui lòng chọn nhân viên'); return; }
      const emp = allEmployees.find(e => e.systemId === selectedEmployeeId);
      if (!emp) return;
      try {
        const result = await bulkAssignPackagingAction({
          packagingSystemIds: assignRows.map(r => r.systemId),
          assignedEmployeeId: selectedEmployeeId,
          assignedEmployeeName: emp.fullName || emp.id,
        });
        if (result.success) {
          const msgs: string[] = [];
          if (result.data.assigned) msgs.push(`Đã gán ${result.data.assigned} phiếu cho ${emp.fullName || emp.id}`);
          if (result.data.failed?.length) msgs.push(`${result.data.failed.length} phiếu thất bại`);
          toast.success(msgs.join(', ') || 'Đã xử lý');
        } else {
          toast.error(result.error);
        }
      } catch { toast.error('Lỗi khi gán nhân viên'); }
      setAssignDialogOpen(false);
      setRowSelection({});
    }, [selectedEmployeeId, allEmployees, assignRows]);

    const bulkActions = React.useMemo(() => [
      { label: 'In phiếu đóng gói', icon: Printer, onSelect: (rows: PackagingSlip[]) => handleBulkPrint(rows) },
      ...(canEdit ? [{ label: 'Gán NV đóng gói', icon: UserPlus, onSelect: handleBulkAssign }] : []),
    ], [handleBulkPrint, handleBulkAssign, canEdit]);

    React.useEffect(() => {
        if (!isMobile) return;
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop, scrollHeight = document.documentElement.scrollHeight, clientHeight = window.innerHeight;
            if (scrollTop + clientHeight >= scrollHeight * 0.8 && mobileLoadedCount < sortedData.length) setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile, mobileLoadedCount, sortedData.length]);
    
    React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedGlobalFilter, advancedFilters]);

    const handleRowClick = (row: PackagingSlip) => router.push('/packaging/' + row.systemId);
    const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' => ({ 'Đã đóng gói': 'default' as const, 'Chờ đóng gói': 'secondary' as const, 'Hủy đóng gói': 'destructive' as const })[status] || 'secondary';

    const MobilePackagingCard = ({ packaging }: { packaging: PackagingSlip }) => (
        <MobileCard onClick={() => handleRowClick(packaging)}>
            <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2 flex-1 min-w-0'>
                    <Avatar className='h-8 w-8 shrink-0 bg-primary/10'><AvatarFallback className='text-xs text-primary'><Inbox className='h-4 w-4' /></AvatarFallback></Avatar>
                    <div className='flex items-center gap-1.5 min-w-0 flex-1'>
                        <CardTitle className='font-semibold text-sm truncate'>{packaging.id}</CardTitle>
                        <span className='text-xs text-muted-foreground font-mono'>{packaging.orderId}</span>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><TouchButton variant='ghost' size='sm' className='h-8 w-8 p-0 shrink-0' onClick={(e) => e.stopPropagation()}><MoreHorizontal className='h-4 w-4' /></TouchButton></DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push('/packaging/' + packaging.systemId); }}>Xem chi tiết</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePrintSinglePackaging(packaging.systemId); }}>In Phiếu Đóng Gói</DropdownMenuItem>
                        {packaging.status === 'Chờ đóng gói' && (<><DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleConfirm(packaging.orderSystemId, packaging.systemId); }}>Xác nhận đóng gói</DropdownMenuItem><DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCancelRequest(packaging.orderSystemId, packaging.systemId); }}>Hủy yêu cầu</DropdownMenuItem></>)}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className='text-xs text-muted-foreground mb-3 flex items-center'><User className='h-3 w-3 mr-1.5 shrink-0' /><span className='truncate'>{packaging.customerName}</span></div>
            <div className='border-t mb-3' />
            <div className='space-y-2'>
                <div className='flex items-center text-xs text-muted-foreground'><Calendar className='h-3 w-3 mr-1.5 shrink-0' /><span>{formatDate(packaging.requestDate)}</span></div>
                {packaging.assignedEmployeeName && <div className='flex items-center text-xs text-muted-foreground'><Package className='h-3 w-3 mr-1.5 shrink-0' /><span>{packaging.assignedEmployeeName}</span></div>}
                <div className='flex items-center justify-between text-xs pt-1'><span className='text-muted-foreground'>{packaging.branchName}</span><Badge variant={getStatusVariant(packaging.status)} className='text-xs'>{packaging.status}</Badge></div>
            </div>
        </MobileCard>
    );

    return (
        <ListPageShell>
            {!isMobile && (
                <PageToolbar
                    leftActions={<>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/shipping')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}<Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}><Download className="h-4 w-4 mr-2" />Xuất Excel</Button></>}
                    rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />}
                />
            )}
            <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder='Tìm kiếm phiếu đóng gói (mã phiếu, mã đơn, khách hàng)...'>
                <AdvancedFilterPanel
                    filters={filterConfigs}
                    values={panelValues}
                    onApply={handlePanelApply}
                    presets={presets.map(p => ({ ...p, filters: p.filters }))}
                    onSavePreset={(preset) => savePreset(preset.name, panelValues)}
                    onDeletePreset={deletePreset}
                    onUpdatePreset={updatePreset}
                />
            </PageFilters>
            <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />
            {isMobile ? (
                <div ref={mobileScrollRef} className='space-y-3 pb-4'>
                    {sortedData.length === 0 ? <div className='flex flex-col items-center justify-center py-16 text-center'><p className='text-muted-foreground'>Không tìm thấy phiếu đóng gói</p></div> : (<>
                        {sortedData.slice(0, mobileLoadedCount).map(packaging => <MobilePackagingCard key={packaging.systemId} packaging={packaging} />)}
                        {mobileLoadedCount < sortedData.length && <div className='flex items-center justify-center gap-2 py-6'><div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' /><span className='text-sm text-muted-foreground'>Đang tải thêm...</span></div>}
                        {mobileLoadedCount >= sortedData.length && sortedData.length > 20 && <div className='py-4 text-center'><span className='text-sm text-muted-foreground'>Đã hiển thị tất cả {sortedData.length} phiếu đóng gói</span></div>}
                    </>)}
                </div>
            ) : (
                <div className='w-full py-4'>
                    <ResponsiveDataTable columns={columns} data={paginatedData} renderMobileCard={(packaging) => <MobilePackagingCard packaging={packaging} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={filteredData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} bulkActions={bulkActions} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} />
                </div>
            )}

            <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} selectedCount={itemsToPrint.length} onConfirm={handlePrintConfirm} title="In phiếu đóng gói" />
            <CancelDialog isOpen={!!cancelDialogState} onOpenChange={(open) => !open && setCancelDialogState(null)} onConfirm={handleConfirmCancel} />
            {/* ✅ Only render export dialog when opened to avoid loading pricing-policies API */}
            {exportDialogOpen && <PackagingExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} allData={packagingSlips} filteredData={sortedData} currentPageData={paginatedData} selectedData={allSelectedRows} currentUser={{ name: authEmployee?.fullName || 'Hệ thống', systemId: authEmployee?.systemId || asSystemId('SYSTEM') }} />}

            {/* Bulk Assign Employee Dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Gán nhân viên đóng gói</DialogTitle>
                  <DialogDescription>Chọn nhân viên để gán cho {assignRows.length} phiếu đóng gói</DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                  <Label>Nhân viên</Label>
                  <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                    <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn nhân viên..." /></SelectTrigger>
                    <SelectContent>
                      {allEmployees.map(emp => (
                        <SelectItem key={emp.systemId} value={emp.systemId}>{emp.fullName || emp.id}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Hủy</Button>
                  <Button onClick={handleConfirmBulkAssign} disabled={!selectedEmployeeId}>Xác nhận</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </ListPageShell>
    );
}
