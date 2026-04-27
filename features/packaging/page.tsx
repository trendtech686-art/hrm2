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
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { usePackagingSlips } from './hooks/use-packaging';
import { usePackagingActions } from '../orders/hooks/use-packaging-actions';
import { useAllBranches, useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { useCustomerFinder } from '../customers/hooks/use-all-customers';
import { useDebounce } from '@/hooks/use-debounce';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { getColumns } from './columns';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../components/data-table/dynamic-column-customizer';
import { PageToolbar } from '../../components/layout/page-toolbar';
import { PageFilters } from '../../components/layout/page-filters';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';
import { CardTitle } from '../../components/ui/card';
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
    const { confirmPackaging, cancelPackagingRequest } = usePackagingActions();
    const { data: branches } = useAllBranches();
    const { findById: findBranchById } = useBranchFinder();
    const { findById: findCustomerById } = useCustomerFinder();
    const { employee: authEmployee, can } = useAuth();
    const canEdit = can('edit_packaging');
    const canEditSettings = can('edit_settings');
    
    // State declarations - must be before usage
    const [globalFilter, setGlobalFilter] = React.useState('');
    const debouncedGlobalFilter = useDebounce(globalFilter, 300);
    // Server-side filters
    const [branchFilter, setBranchFilter] = React.useState<string | null>(null);
    const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
    const [pagination, setPagination] = usePaginationWithGlobalDefault();
    
    // ✅ Server-side pagination: only fetch current page
    const { data: packagingResponse, isLoading: isLoadingPackaging } = usePackagingSlips({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedGlobalFilter || undefined,
      status: statusFilter || undefined,
      branchSystemId: branchFilter || undefined,
    });
    
    const packagingSlips = React.useMemo(() => packagingResponse?.data ?? [], [packagingResponse?.data]);
    const pageCount = packagingResponse?.pagination?.totalPages ?? 0;
    const totalRows = packagingResponse?.pagination?.total ?? 0;
    
    // Reset to page 1 when filters change
    const resetPagination = React.useCallback(() => {
      setPagination(p => ({ ...p, pageIndex: 0 }));
    }, [setPagination]);
    React.useEffect(() => { resetPagination(); }, [resetPagination, branchFilter, statusFilter, debouncedGlobalFilter]);
    
    // ⚡ OPTIMIZED: storeInfo lazy loaded in print handlers
    const { print, printMultiple } = usePrint();
    const router = useRouter(), currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM', isMobile = !useMediaQuery('(min-width: 768px)');
    
    const [printDialogOpen, setPrintDialogOpen] = React.useState(false), [itemsToPrint, setItemsToPrint] = React.useState<PackagingSlip[]>([]), [exportDialogOpen, setExportDialogOpen] = React.useState(false);
    const [cancelDialogState, setCancelDialogState] = React.useState<{ orderSystemId: string, packagingSystemId: string } | null>(null);
    const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
    const [assignRows, setAssignRows] = React.useState<PackagingSlip[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = React.useState('');
    const { data: allEmployees } = useAllEmployees({ enabled: assignDialogOpen });
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({}), [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
    const defaultColumnVisibility = React.useMemo(() => {
        const cols = getColumns(() => {}, () => {}, () => {}), initial: Record<string, boolean> = {};
        cols.forEach(c => { if (c.id) initial[c.id] = true; });
        return initial;
    }, []);
    const [columnVisibility, setColumnVisibility] = useColumnVisibility('packaging', defaultColumnVisibility);
    const [columnOrder, setColumnOrder] = useColumnOrder('packaging'), [pinnedColumns, setPinnedColumns] = usePinnedColumns('packaging');
    const columnOrderInitialized = React.useRef(false);

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
      branch: branchFilter,
      status: statusFilter,
      requestDate: advancedFilters.requestDate ?? null,
    }), [branchFilter, statusFilter, advancedFilters]);
    const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
      setAdvancedFilters(v);
      setBranchFilter(v.branch === 'all' ? null : (v.branch as string | null));
      setStatusFilter(v.status === 'all' ? null : (v.status as string | null));
    }, []);

    usePageHeader({ title: 'Phiếu đóng gói', breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Đóng gói', href: '/packaging', isCurrent: true }], showBackButton: false });


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
    
    React.useEffect(() => { 
      if (columnOrderInitialized.current) return; 
      columnOrderInitialized.current = true; 
      setColumnOrder(columns.map((c: { id?: string }) => c.id).filter(Boolean) as string[]); 
    }, [columns, setColumnOrder]);
    
    // Server-side data - no client-side filtering needed
    const allSelectedRows = React.useMemo(() => packagingSlips.filter((p: PackagingSlip) => rowSelection[p.systemId]), [packagingSlips, rowSelection]);

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
            <div className='w-full py-4'>
                <ResponsiveDataTable columns={columns} data={packagingSlips} renderMobileCard={(packaging) => <MobilePackagingCard packaging={packaging} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} bulkActions={bulkActions} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} mobileInfiniteScroll isLoading={isLoadingPackaging} />
            </div>

            <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} selectedCount={itemsToPrint.length} onConfirm={handlePrintConfirm} title="In phiếu đóng gói" />
            <CancelDialog isOpen={!!cancelDialogState} onOpenChange={(open) => !open && setCancelDialogState(null)} onConfirm={handleConfirmCancel} />
            {/* ✅ Export uses current page data from server-side pagination */}
            {exportDialogOpen && <PackagingExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} allData={packagingSlips} filteredData={packagingSlips} currentPageData={packagingSlips} selectedData={allSelectedRows} currentUser={{ name: authEmployee?.fullName || 'Hệ thống', systemId: authEmployee?.systemId || asSystemId('SYSTEM') }} />}

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
