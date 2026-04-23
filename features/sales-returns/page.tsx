'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { formatDate } from '../../lib/date-utils';
import { cn } from '@/lib/utils';
import { usePageHeader } from '../../contexts/page-header-context';
import { useSalesReturns, salesReturnKeys } from './hooks/use-sales-returns';
import { fetchSalesReturn } from './api/sales-returns-api';
import { useAllSalesReturns } from './hooks/use-all-sales-returns';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { usePrint } from '../../lib/use-print';
import { convertSalesReturnForPrint, mapSalesReturnToPrintData, mapSalesReturnLineItems, createStoreSettingsFromBranch } from '../../lib/print/sales-return-print-helper';
import { getColumns } from './columns';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { asSystemId } from '../../lib/id-types';
import { useQueryClient } from '@tanstack/react-query';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../components/data-table/dynamic-column-customizer';
import { PageToolbar } from '../../components/layout/page-toolbar';
import { PageFilters } from '../../components/layout/page-filters';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { PlusCircle, Undo2, MoreHorizontal, Printer, Download, Settings } from 'lucide-react';
import { TouchButton } from '../../components/mobile/touch-button';
import { MobileCard, MobileCardBody, MobileCardHeader } from '../../components/mobile/mobile-card';
import { useMediaQuery } from '../../lib/use-media-query';
import { useAuth } from '../../contexts/auth-context';
import type { SalesReturn } from '@/lib/types/prisma-extended';
import { ROUTES } from '../../lib/router';
import { useColumnVisibility, useColumnOrder, usePinnedColumns } from '../../hooks/use-column-visibility';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { ListPageShell } from '@/components/layout/page-section';

const SalesReturnExportDialog = dynamic(() => import("./components/sales-returns-import-export-dialogs").then(mod => ({ default: mod.SalesReturnExportDialog })), { ssr: false });

const formatCurrency = (value?: number) => typeof value === 'number' ? new Intl.NumberFormat('vi-VN').format(value) : '0';

export function SalesReturnsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [search, setSearch] = React.useState('');
    const [debouncedSearch, setDebouncedSearch] = React.useState('');
    
    React.useEffect(() => { const t = setTimeout(() => setDebouncedSearch(search), 300); return () => clearTimeout(t); }, [search]);
    
    const { data: branches } = useAllBranches();
    // ✅ OPTIMIZED: storeInfo lazy loaded in print handlers
    const {  employee: currentUser, can } = useAuth();
  const canCreate = can('create_sales_returns');
  const canEditSettings = can('edit_settings');
    const { print, printMultiple } = usePrint();
    const isMobile = !useMediaQuery('(min-width: 768px)');
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);

    const [exportDialogOpen, setExportDialogOpen] = React.useState(false), [printDialogOpen, setPrintDialogOpen] = React.useState(false);
    const [itemsToPrint, setItemsToPrint] = React.useState<SalesReturn[]>([]);
    const [sorting, setSorting] = React.useState({ id: 'createdAt', desc: true });
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
    const [rowSelection, setRowSelection] = React.useState({}), [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

    const [columnOrder, setColumnOrder] = useColumnOrder('sales-returns'), [pinnedColumns, setPinnedColumns] = usePinnedColumns('sales-returns', ['id']);
    const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

    // Advanced filter panel
    const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('sales-returns');
    const filterConfigs: FilterConfig[] = React.useMemo(() => [
      { id: 'branch', label: 'Chi nhánh', type: 'select' as const, options: [{ label: 'Tất cả', value: 'all' }, ...branches.map(b => ({ label: b.name, value: b.systemId }))] },
      { id: 'status', label: 'Trạng thái', type: 'select' as const, options: [
        { label: 'Tất cả', value: 'all' },
        { label: 'Chờ duyệt', value: 'PENDING' },
        { label: 'Đã duyệt', value: 'APPROVED' },
        { label: 'Hoàn thành', value: 'COMPLETED' },
        { label: 'Từ chối', value: 'REJECTED' },
      ] },
      { id: 'isReceived', label: 'Nhận hàng', type: 'select' as const, options: [
        { label: 'Tất cả', value: 'all' },
        { label: 'Đã nhận', value: 'true' },
        { label: 'Chưa nhận', value: 'false' },
      ] },
      { id: 'returnDate', label: 'Ngày trả hàng', type: 'date-range' as const },
    ], [branches]);
    const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});
    const panelValues = React.useMemo(() => ({
      branch: advancedFilters.branch ?? null,
      status: advancedFilters.status ?? null,
      isReceived: advancedFilters.isReceived ?? null,
      returnDate: advancedFilters.returnDate ?? null,
    }), [advancedFilters]);
    const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
      setAdvancedFilters(v);
      setPagination(p => ({ ...p, pageIndex: 0 }));
    }, []);

    // ✅ Server-side pagination: API handles search, filter, sort, pagination
    const queryParams = React.useMemo(() => {
        const dateRange = advancedFilters.returnDate as { from?: string; to?: string } | null;
        const branch = advancedFilters.branch as string | undefined;
        const status = advancedFilters.status as string | undefined;
        const isReceivedVal = advancedFilters.isReceived as string | undefined;
        return {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearch || undefined,
            branchId: branch && branch !== 'all' ? branch : undefined,
            status: status && status !== 'all' ? status : undefined,
            isReceived: isReceivedVal === 'true' ? true : isReceivedVal === 'false' ? false : undefined,
            startDate: dateRange?.from || undefined,
            endDate: dateRange?.to || undefined,
            sortBy: sorting.id || 'createdAt',
            sortOrder: (sorting.desc ? 'desc' : 'asc') as 'asc' | 'desc',
        };
    }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, advancedFilters, sorting]);

    const { data: response, isFetching } = useSalesReturns(queryParams);
    const returns = response?.data ?? [];
    const totalCount = response?.pagination?.total ?? 0;
    const pageCount = response?.pagination?.totalPages ?? 0;

    // ✅ Lazy-load: only fetch ALL data when export dialog opens
    const { data: allReturnsForExport } = useAllSalesReturns({ enabled: exportDialogOpen });
    const activeExportReturns = React.useMemo(() => allReturnsForExport.filter(r => (r as unknown as Record<string, unknown>).status !== 'Đã hủy'), [allReturnsForExport]);

    const defaultColumnVisibility = React.useMemo(() => {
        const initial: Record<string, boolean> = {};
        getColumns(() => {}).forEach(c => { if (c.id) initial[c.id] = true; });
        return initial;
    }, []);
    const [columnVisibility, setColumnVisibility] = useColumnVisibility('sales-returns', defaultColumnVisibility);

    const handleCreateReturn = React.useCallback(() => router.push(ROUTES.SALES.ORDERS), [router]);
    const headerActions = React.useMemo(() => [
        canCreate && <Button key="create" size="sm" className="h-9 px-4" onClick={handleCreateReturn}><PlusCircle className="mr-2 h-4 w-4" />Tạo phiếu trả</Button>
    ].filter(Boolean), [handleCreateReturn, canCreate]);

    usePageHeader(React.useMemo(() => ({
        title: 'Phiếu trả hàng',
        breadcrumb: [{ label: 'Trang chủ', href: ROUTES.ROOT }, { label: 'Trả hàng', href: ROUTES.SALES.RETURNS, isCurrent: true }],
        showBackButton: false, actions: headerActions,
    }), [headerActions]));

    // Reset pagination on search change
    React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedSearch]);

    const handleBulkPrint = React.useCallback((rows: SalesReturn[]) => { setItemsToPrint(rows); setPrintDialogOpen(true); }, []);

    const handlePrintConfirm = React.useCallback(async (options: SimplePrintOptionsResult) => {
        if (itemsToPrint.length === 0) return;
        const { branchSystemId, paperSize } = options;
        const selectedBranch = branches.find(b => b.systemId === branchSystemId);
        const { storeInfo } = await fetchPrintData();
        const storeSettings = createStoreSettingsFromBranch(selectedBranch, storeInfo);
        const printOptionsList = itemsToPrint.map(ret => {
            const returnData = convertSalesReturnForPrint(ret, { branch: selectedBranch });
            return { data: mapSalesReturnToPrintData(returnData, storeSettings), lineItems: mapSalesReturnLineItems(returnData.returnItems || []), paperSize };
        });
        printMultiple('sales-return', printOptionsList);
        setPrintDialogOpen(false); setItemsToPrint([]); setRowSelection({});
        toast.success(`Đang in ${itemsToPrint.length} phiếu trả hàng`);
    }, [itemsToPrint, branches, printMultiple]);

    const handlePrintReturn = React.useCallback(async (returnIds: string[]) => {
        const { storeInfo } = await fetchPrintData();
        returnIds.forEach(id => {
            const ret = returns.find(r => r.systemId === id);
            if (!ret) return;
            const branch = branches.find(b => b.name === ret.branchName);
            const storeSettings = createStoreSettingsFromBranch(branch, storeInfo);
            const returnData = convertSalesReturnForPrint(ret, { branch });
            print('sales-return', { data: mapSalesReturnToPrintData(returnData, storeSettings), lineItems: mapSalesReturnLineItems(returnData.returnItems || []) });
        });
    }, [returns, branches, print]);

    const handlePrintSingleReturn = React.useCallback((returnId: string) => handlePrintReturn([returnId]), [handlePrintReturn]);
    const columns = React.useMemo(() => getColumns(handlePrintSingleReturn), [handlePrintSingleReturn]);

    const columnOrderInitRef = React.useRef(false);
    React.useEffect(() => {
      if (columnOrderInitRef.current || !columns.length) return;
      columnOrderInitRef.current = true;
      setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    }, [columns, setColumnOrder]);



    React.useEffect(() => {
        if (!isMobile) return;
        const handleScroll = () => {
            const { scrollTop, scrollHeight } = document.documentElement;
            if ((window.pageYOffset || scrollTop) + window.innerHeight >= scrollHeight * 0.8 && mobileLoadedCount < returns.length)
                setMobileLoadedCount(prev => Math.min(prev + 20, returns.length));
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile, mobileLoadedCount, returns.length]);

    React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedSearch, advancedFilters]);


    const handleRowClick = (row: SalesReturn) => router.push('/sales-returns/' + row.systemId);

    const handleRowHover = React.useCallback((row: { systemId: string }) => {
        queryClient.prefetchQuery({
            queryKey: salesReturnKeys.detail(row.systemId),
            queryFn: () => fetchSalesReturn(asSystemId(row.systemId)),
            staleTime: 60_000,
        });
    }, [queryClient]);
    const allSelectedRows = React.useMemo(() => returns.filter(r => rowSelection[r.systemId]), [returns, rowSelection]);
    const bulkActions = React.useMemo(() => [{ label: 'In phiếu trả hàng', icon: Printer, onSelect: handleBulkPrint }], [handleBulkPrint]);

    const MobileSalesReturnCard = ({ salesReturn }: { salesReturn: SalesReturn }) => {
        const totalQty = salesReturn.items.reduce((sum, item) => sum + item.returnQuantity, 0);
        return (
            <MobileCard onClick={() => handleRowClick(salesReturn)}>
                <MobileCardHeader className='items-start justify-between'>
                    <div className='flex items-start gap-2 min-w-0 flex-1'>
                        <Avatar className='h-10 w-10 shrink-0 bg-orange-100'><AvatarFallback className='text-xs text-orange-700'><Undo2 className='h-4 w-4' /></AvatarFallback></Avatar>
                        <div className='min-w-0 flex-1'>
                            <div className='text-xs uppercase tracking-wide text-muted-foreground'>Phiếu trả hàng</div>
                            <div className='mt-0.5 text-sm font-semibold text-foreground truncate font-mono'>{salesReturn.id}</div>
                            <div className='text-xs text-muted-foreground font-mono truncate'>ĐH: {salesReturn.orderId}</div>
                        </div>
                    </div>
                    <div className='flex items-start gap-1 shrink-0'>
                        <div className='text-right'>
                            <div className='text-lg font-bold leading-none'>{formatCurrency(salesReturn.totalReturnValue)}</div>
                            <div className='mt-1 text-xs text-muted-foreground'>Giá trị trả</div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><TouchButton variant='ghost' size='sm' className='h-8 w-8 p-0 -mr-2 -mt-1' onClick={(e) => e.stopPropagation()}><MoreHorizontal className='h-4 w-4' /></TouchButton></DropdownMenuTrigger>
                            <DropdownMenuContent align='end'><DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePrintSingleReturn(salesReturn.systemId); }}>In Phiếu Trả Hàng</DropdownMenuItem></DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </MobileCardHeader>
                <MobileCardBody>
                    <dl className='grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm'>
                        <div className='col-span-2'>
                            <dt className='text-xs text-muted-foreground'>Khách hàng</dt>
                            <dd className='font-medium truncate'>{salesReturn.customerName}</dd>
                        </div>
                        <div>
                            <dt className='text-xs text-muted-foreground'>Ngày trả</dt>
                            <dd className='font-medium'>{formatDate(salesReturn.returnDate)}</dd>
                        </div>
                        <div>
                            <dt className='text-xs text-muted-foreground'>Số lượng SP</dt>
                            <dd className='font-medium'>{totalQty}</dd>
                        </div>
                        <div className='col-span-2'>
                            <dt className='text-xs text-muted-foreground'>Trạng thái</dt>
                            <dd>
                                <Badge variant={salesReturn.isReceived ? 'default' : 'secondary'} className='text-xs'>
                                    {salesReturn.isReceived ? 'Đã nhận' : 'Chưa nhận'}
                                </Badge>
                            </dd>
                        </div>
                    </dl>
                </MobileCardBody>
            </MobileCard>
        );
    };

    return (
        <ListPageShell>
            {!isMobile && (
                <PageToolbar
                    leftActions={<>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/sales-config')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}<Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}><Download className="h-4 w-4 mr-2" />Xuất Excel</Button></>}
                    rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />}
                />
            )}
            <PageFilters searchValue={search} onSearchChange={setSearch} searchPlaceholder='Tìm kiếm phiếu trả hàng (mã phiếu, mã đơn, khách hàng)...'>
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
                    {returns.length === 0 ? (
                        <Card><CardContent className='py-12 text-center'><p className='text-muted-foreground'>Không tìm thấy phiếu trả hàng</p></CardContent></Card>
                    ) : (<>
                        {returns.slice(0, mobileLoadedCount).map(salesReturn => <MobileSalesReturnCard key={salesReturn.systemId} salesReturn={salesReturn} />)}
                        {mobileLoadedCount < returns.length && <Card className='border-dashed'><CardContent className='py-6 text-center'><div className='flex items-center justify-center gap-2'><div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' /><span className='text-sm text-muted-foreground'>Đang tải thêm...</span></div></CardContent></Card>}
                        {mobileLoadedCount >= returns.length && returns.length > 20 && <Card className='border-dashed'><CardContent className='py-4 text-center'><span className='text-sm text-muted-foreground'>Đã hiển thị tất cả {returns.length} phiếu trả hàng</span></CardContent></Card>}
                    </>)}
                </div>
            ) : (
                <div className={cn('w-full py-4', isFetching && 'opacity-60 pointer-events-none transition-opacity')}>
                    <ResponsiveDataTable columns={columns} data={returns} renderMobileCard={(salesReturn) => <MobileSalesReturnCard salesReturn={salesReturn} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalCount} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} bulkActions={bulkActions} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} onRowHover={handleRowHover} />
                </div>
            )}
            <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} selectedCount={itemsToPrint.length} onConfirm={handlePrintConfirm} title="In phiếu trả hàng" />
            {/* ✅ Only render export dialog when opened to avoid loading pricing-policies API */}
            {exportDialogOpen && <SalesReturnExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} allData={activeExportReturns} filteredData={activeExportReturns} currentPageData={returns} selectedData={allSelectedRows} currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />}
        </ListPageShell>
    );
}
