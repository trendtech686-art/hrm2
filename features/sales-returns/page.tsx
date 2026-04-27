'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { formatDate } from '../../lib/date-utils';
import { cn } from '@/lib/utils';
import { usePageHeader } from '../../contexts/page-header-context';
import { useSalesReturns, salesReturnKeys } from './hooks/use-sales-returns';
import { useDebounce } from '@/hooks/use-debounce';
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
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);
    
    const { data: branches } = useAllBranches();
    // ✅ OPTIMIZED: storeInfo lazy loaded in print handlers
    const {  employee: currentUser, can } = useAuth();
  const canCreate = can('create_sales_returns');
  const canEditSettings = can('edit_settings');
    const { print, printMultiple } = usePrint();
    const isMobile = !useMediaQuery('(min-width: 768px)');

    const [exportDialogOpen, setExportDialogOpen] = useState(false), [printDialogOpen, setPrintDialogOpen] = useState(false);
    const [itemsToPrint, setItemsToPrint] = useState<SalesReturn[]>([]);
    const [sorting, setSorting] = useState({ id: 'createdAt', desc: true });
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 40 });
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({}), [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const [columnOrder, setColumnOrder] = useColumnOrder('sales-returns'), [pinnedColumns, setPinnedColumns] = usePinnedColumns('sales-returns', ['id']);

    // Advanced filter panel
    const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('sales-returns');
    const filterConfigs: FilterConfig[] = useMemo(() => [
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
    const [advancedFilters, setAdvancedFilters] = useState<Record<string, unknown>>({});
    const panelValues = useMemo(() => ({
      branch: advancedFilters.branch ?? null,
      status: advancedFilters.status ?? null,
      isReceived: advancedFilters.isReceived ?? null,
      returnDate: advancedFilters.returnDate ?? null,
    }), [advancedFilters]);
    const handlePanelApply = useCallback((v: Record<string, unknown>) => {
      setAdvancedFilters(v);
      setPagination(p => ({ ...p, pageIndex: 0 }));
    }, []);

    // ✅ Server-side pagination: API handles search, filter, sort, pagination
    const queryParams = useMemo(() => {
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
    const returns = useMemo(() => response?.data ?? [], [response?.data]);
    const totalCount = response?.pagination?.total ?? 0;
    const pageCount = response?.pagination?.totalPages ?? 0;

    // ✅ Lazy-load: only fetch ALL data when export dialog opens
    const { data: allReturnsForExport } = useAllSalesReturns({ enabled: exportDialogOpen });
    const activeExportReturns = useMemo(() => allReturnsForExport.filter(r => (r as unknown as Record<string, unknown>).status !== 'Đã hủy'), [allReturnsForExport]);

    const defaultColumnVisibility = useMemo(() => {
        const initial: Record<string, boolean> = {};
        getColumns(() => {}).forEach(c => { if (c.id) initial[c.id] = true; });
        return initial;
    }, []);
    const [columnVisibility, setColumnVisibility] = useColumnVisibility('sales-returns', defaultColumnVisibility);

    const handleCreateReturn = useCallback(() => router.push(ROUTES.SALES.ORDERS), [router]);
    const headerActions = useMemo(() => [
        canCreate && <Button key="create" size="sm" className="px-4" onClick={handleCreateReturn}><PlusCircle className="mr-2 h-4 w-4" />Tạo phiếu trả</Button>
    ].filter(Boolean), [handleCreateReturn, canCreate]);

    usePageHeader(useMemo(() => ({
        title: 'Phiếu trả hàng',
        breadcrumb: [{ label: 'Trang chủ', href: ROUTES.ROOT }, { label: 'Trả hàng', href: ROUTES.SALES.RETURNS, isCurrent: true }],
        showBackButton: false, actions: headerActions,
    }), [headerActions]));

    // Reset pagination on search change
    useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedSearch, setPagination]);

    const handleBulkPrint = useCallback((rows: SalesReturn[]) => { setItemsToPrint(rows); setPrintDialogOpen(true); }, []);

    const handlePrintConfirm = useCallback(async (options: SimplePrintOptionsResult) => {
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

    const handlePrintReturn = useCallback(async (returnIds: string[]) => {
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

    const handlePrintSingleReturn = useCallback((returnId: string) => handlePrintReturn([returnId]), [handlePrintReturn]);
    const columns = useMemo(() => getColumns(handlePrintSingleReturn), [handlePrintSingleReturn]);

    const columnOrderInitRef = useRef(false);
    useEffect(() => {
      if (columnOrderInitRef.current || !columns.length) return;
      columnOrderInitRef.current = true;
      setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    }, [columns, setColumnOrder]);



    const handleRowClick = (row: SalesReturn) => router.push('/sales-returns/' + row.systemId);

    const handleRowHover = useCallback((row: { systemId: string }) => {
        queryClient.prefetchQuery({
            queryKey: salesReturnKeys.detail(row.systemId),
            queryFn: () => fetchSalesReturn(asSystemId(row.systemId)),
            staleTime: 60_000,
        });
    }, [queryClient]);
    const allSelectedRows = useMemo(() => returns.filter(r => rowSelection[r.systemId]), [returns, rowSelection]);
    const bulkActions = useMemo(() => [{ label: 'In phiếu trả hàng', icon: Printer, onSelect: handleBulkPrint }], [handleBulkPrint]);

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
            <div className={cn('w-full py-4', isFetching && 'opacity-60 pointer-events-none transition-opacity')}>
                <ResponsiveDataTable columns={columns} data={returns} renderMobileCard={(salesReturn) => <MobileSalesReturnCard salesReturn={salesReturn} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalCount} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} bulkActions={bulkActions} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} onRowHover={handleRowHover} mobileInfiniteScroll />
            </div>
            <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} selectedCount={itemsToPrint.length} onConfirm={handlePrintConfirm} title="In phiếu trả hàng" />
            {/* ✅ Only render export dialog when opened to avoid loading pricing-policies API */}
            {exportDialogOpen && <SalesReturnExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} allData={activeExportReturns} filteredData={activeExportReturns} currentPageData={returns} selectedData={allSelectedRows} currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />}
        </ListPageShell>
    );
}
