'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '../../lib/date-utils';
import { usePageHeader } from '../../contexts/page-header-context';
import { useSalesReturnStore } from './store';
import { useBranchStore } from '../settings/branches/store';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { usePrint } from '../../lib/use-print';
import { 
  convertSalesReturnForPrint,
  mapSalesReturnToPrintData,
  mapSalesReturnLineItems,
  createStoreSettingsFromBranch,
} from '../../lib/print/sales-return-print-helper';
import { getColumns } from './columns';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { GenericExportDialogV2 } from '../../components/shared/generic-export-dialog-v2';
import { salesReturnConfig } from '../../lib/import-export/configs/sales-return.config';
import { asSystemId } from '../../lib/id-types';
import { DataTableFacetedFilter } from '../../components/data-table/data-table-faceted-filter';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle';
import { PageToolbar } from '../../components/layout/page-toolbar';
import { PageFilters } from '../../components/layout/page-filters';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { PlusCircle, Undo2, MoreHorizontal, Package, Calendar, User, Printer, Download } from 'lucide-react';
import { TouchButton } from '../../components/mobile/touch-button';
import { useMediaQuery } from '../../lib/use-media-query';
import { useAuth } from '../../contexts/auth-context';
import { toast } from 'sonner';
import type { SalesReturn } from '@/lib/types/prisma-extended';
import Fuse from 'fuse.js';
import { ROUTES } from '../../lib/router';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

export function SalesReturnsPage() {
    const router = useRouter();
    const { data: returns, getActive } = useSalesReturnStore();
    const { data: branches } = useBranchStore();
    const { info: storeInfo } = useStoreInfoStore();
    const { employee: currentUser } = useAuth();
    
    const activeReturns = React.useMemo(() => getActive(), [returns]);
    
    // Export dialog state
    const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
    
    const handleCreateReturn = React.useCallback(() => {
        router.push(ROUTES.SALES.ORDERS);
    }, [router]);

    const totalReturnValue = React.useMemo(() =>
        activeReturns.reduce((sum, item) => sum + (item.totalReturnValue || 0), 0),
    [activeReturns]);
    const pendingCount = React.useMemo(() => activeReturns.filter(item => !item.isReceived).length, [activeReturns]);
    const headerActions = React.useMemo(() => [
        <Button
            key="create"
            size="sm"
            className="h-9 px-4"
            onClick={handleCreateReturn}
        >
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo phiếu trả
        </Button>
    ], [handleCreateReturn]);

    const pageHeaderConfig = React.useMemo(() => ({
        title: 'Phiếu trả hàng',
        breadcrumb: [
            { label: 'Trang chủ', href: ROUTES.ROOT },
            { label: 'Trả hàng', href: ROUTES.SALES.RETURNS, isCurrent: true }
        ],
        showBackButton: false,
        actions: headerActions,
    }), [activeReturns.length, pendingCount, totalReturnValue, headerActions]);

    usePageHeader(pageHeaderConfig);
    
    const [sorting, setSorting] = React.useState({ id: 'createdAt', desc: true });
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
    const [rowSelection, setRowSelection] = React.useState({});
    const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
    const [branchFilter, setBranchFilter] = React.useState('all');
    const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
    const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
        // Try to load from localStorage first
        const storageKey = 'sales-returns-column-visibility';
        const stored = localStorage.getItem(storageKey);
        
        const cols = getColumns(() => {});
        const allColumnIds = cols.map(c => c.id).filter(Boolean);
        
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Validate: ensure all current columns exist in stored config
                const hasAllColumns = allColumnIds.every(id => id in parsed);
                if (hasAllColumns) {
                    return parsed;
                }
                // If columns changed, reset
                console.log('⚠️ Column structure changed, resetting visibility');
            } catch (e) {
                console.warn('Failed to parse stored columnVisibility');
            }
        }
        
        // Fallback: initialize with all columns visible
        const initial: Record<string, boolean> = {};
        cols.forEach(c => { if (c.id) initial[c.id] = true; });
        return initial;
    });
    
    // Save columnVisibility to localStorage whenever it changes
    React.useEffect(() => {
        const storageKey = 'sales-returns-column-visibility';
        localStorage.setItem(storageKey, JSON.stringify(columnVisibility));
    }, [columnVisibility]);
    
    const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
    const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['id']);
    const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);
    const isMobile = !useMediaQuery('(min-width: 768px)');

    // Print dialog state
    const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
    const [itemsToPrint, setItemsToPrint] = React.useState<SalesReturn[]>([]);

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300);
        return () => clearTimeout(timer);
    }, [globalFilter]);

    const { print, printMultiple } = usePrint();

    // Handler để mở dialog in với options
    const handleBulkPrint = React.useCallback((rows: SalesReturn[]) => {
        setItemsToPrint(rows);
        setPrintDialogOpen(true);
    }, []);

    // Handler khi xác nhận in từ dialog
    const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
        if (itemsToPrint.length === 0) return;

        const { branchSystemId, paperSize } = options;
        const selectedBranch = branches.find(b => b.systemId === branchSystemId);
        const storeSettings = createStoreSettingsFromBranch(selectedBranch, storeInfo);

        const printOptionsList = itemsToPrint.map(ret => {
            const returnData = convertSalesReturnForPrint(ret, { branch: selectedBranch });
            return {
                data: mapSalesReturnToPrintData(returnData, storeSettings),
                lineItems: mapSalesReturnLineItems(returnData.returnItems || []),
                paperSize,
            };
        });

        printMultiple('sales-return', printOptionsList);
        setPrintDialogOpen(false);
        setItemsToPrint([]);
        setRowSelection({});
        toast.success(`Đang in ${itemsToPrint.length} phiếu trả hàng`);
    }, [itemsToPrint, branches, storeInfo, printMultiple]);

    const handlePrintReturn = React.useCallback((returnIds: string[]) => {
        returnIds.forEach(id => {
            const ret = activeReturns.find(r => r.systemId === id);
            if (!ret) return;

            // Use helper to prepare print data
            const branch = branches.find(b => b.name === ret.branchName);
            const storeSettings = createStoreSettingsFromBranch(branch, storeInfo);
            const returnData = convertSalesReturnForPrint(ret, { branch });
            
            print('sales-return', {
                data: mapSalesReturnToPrintData(returnData, storeSettings),
                lineItems: mapSalesReturnLineItems(returnData.returnItems || []),
            });
        });
    }, [activeReturns, branches, storeInfo, print]);

    const handlePrintSingleReturn = React.useCallback((returnId: string) => {
        handlePrintReturn([returnId]);
    }, [handlePrintReturn]);
    
    const columns = React.useMemo(() => getColumns(handlePrintSingleReturn), [handlePrintSingleReturn]);

    // Debug: Log columnVisibility whenever it changes
    React.useEffect(() => {
        console.log('📋 Current columnVisibility:', columnVisibility);
        console.log('📋 Total visible columns:', Object.keys(columnVisibility).filter(k => columnVisibility[k]).length);
        console.log('📋 All column IDs:', columns.map(c => c.id));
    }, [columnVisibility, columns]);

    React.useEffect(() => {
        // Only set column order, visibility is already initialized in useState
        setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    }, [columns]);
    
    const fuseInstance = React.useMemo(() => {
        return new Fuse(activeReturns, { keys: ['id', 'orderId', 'customerName', 'creatorName'], threshold: 0.3, ignoreLocation: true });
    }, [activeReturns]);
    
    const filteredData = React.useMemo(() => {
        let filtered = activeReturns;
        if (branchFilter !== 'all') {
            const selectedBranch = branches.find(b => b.systemId === branchFilter);
            if (selectedBranch) filtered = filtered.filter(r => r.branchName === selectedBranch.name);
        }
        if (statusFilter.size > 0) {
            filtered = filtered.filter(r => statusFilter.has(r.isReceived ? 'Đã nhận' : 'Chưa nhận'));
        }
        if (debouncedGlobalFilter && debouncedGlobalFilter.trim()) {
            fuseInstance.setCollection(filtered);
            filtered = fuseInstance.search(debouncedGlobalFilter.trim()).map(result => result.item);
        }
        return filtered;
    }, [activeReturns, debouncedGlobalFilter, fuseInstance, branchFilter, statusFilter, branches]);
    
    React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedGlobalFilter, branchFilter, statusFilter]);
    
    const sortedData = React.useMemo(() => {
        const sorted = [...filteredData];
        if (sorting.id) {
            sorted.sort((a, b) => {
                const aValue = (a as any)[sorting.id];
                const bValue = (b as any)[sorting.id];
                if (aValue == null) return 1;
                if (bValue == null) return -1;
                // Special handling for date columns
                if (sorting.id === 'createdAt' || sorting.id === 'returnDate') {
                  const aTime = aValue ? new Date(aValue).getTime() : 0;
                  const bTime = bValue ? new Date(bValue).getTime() : 0;
                  return sorting.desc ? bTime - aTime : aTime - bTime;
                }
                if (aValue < bValue) return sorting.desc ? 1 : -1;
                if (aValue > bValue) return sorting.desc ? -1 : 1;
                return 0;
            });
        }
        return sorted;
    }, [filteredData, sorting]);

    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = React.useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize;
        return sortedData.slice(start, start + pagination.pageSize);
    }, [sortedData, pagination]);

    React.useEffect(() => {
        if (!isMobile) return;
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            if (scrollTop + clientHeight >= scrollHeight * 0.8 && mobileLoadedCount < sortedData.length) {
                setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile, mobileLoadedCount, sortedData.length]);
    
    React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedGlobalFilter, branchFilter, statusFilter]);

    const statusOptions = React.useMemo(() => [{ label: 'Đã nhận', value: 'Đã nhận' }, { label: 'Chưa nhận', value: 'Chưa nhận' }], []);
    const handleRowClick = (row: SalesReturn) => router.push('/returns/' + row.systemId);

    const allSelectedRows = React.useMemo(() => activeReturns.filter(r => rowSelection[r.systemId]), [activeReturns, rowSelection]);

    // Bulk actions với SimplePrintOptionsDialog
    const bulkActions = React.useMemo(() => [
        {
            label: 'In phiếu trả hàng',
            icon: Printer,
            onSelect: (rows: SalesReturn[]) => handleBulkPrint(rows),
        },
    ], [handleBulkPrint]);

    const MobileSalesReturnCard = ({ salesReturn }: { salesReturn: SalesReturn }) => (
        <Card className='hover:shadow-md transition-shadow cursor-pointer' onClick={() => handleRowClick(salesReturn)}>
            <CardContent className='p-4'>
                <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <Avatar className='h-8 w-8 flex-shrink-0 bg-orange-100'>
                            <AvatarFallback className='text-body-xs text-orange-700'><Undo2 className='h-4 w-4' /></AvatarFallback>
                        </Avatar>
                        <div className='flex items-center gap-1.5 min-w-0 flex-1'>
                            <h3 className='font-medium text-body-sm truncate'>{salesReturn.id}</h3>
                            <span className='text-body-xs text-muted-foreground'></span>
                            <span className='text-body-xs text-muted-foreground font-mono'>{salesReturn.orderId}</span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <TouchButton variant='ghost' size='sm' className='h-8 w-8 p-0 flex-shrink-0' onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className='h-4 w-4' />
                            </TouchButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePrintSingleReturn(salesReturn.systemId); }}>In Phiếu Trả Hàng</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className='text-body-xs text-muted-foreground mb-3 flex items-center'>
                    <User className='h-3 w-3 mr-1.5 flex-shrink-0' />
                    <span className='truncate'>{salesReturn.customerName}</span>
                </div>
                <div className='border-t mb-3' />
                <div className='space-y-2'>
                    <div className='flex items-center text-body-xs text-muted-foreground'>
                        <Package className='h-3 w-3 mr-1.5 flex-shrink-0' />
                        <span>{salesReturn.items.reduce((sum, item) => sum + item.returnQuantity, 0)} sản phẩm</span>
                    </div>
                    <div className='flex items-center text-body-xs text-muted-foreground'>
                        <Calendar className='h-3 w-3 mr-1.5 flex-shrink-0' />
                        <span>{formatDate(salesReturn.returnDate)}</span>
                    </div>
                    <div className='flex items-center justify-between text-body-xs pt-1'>
                        <span className='text-h4'>{formatCurrency(salesReturn.totalReturnValue)}</span>
                        <Badge variant={salesReturn.isReceived ? 'default' : 'secondary'} className='text-body-xs'>
                            {salesReturn.isReceived ? 'Đã nhận' : 'Chưa nhận'}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className='flex flex-col w-full h-full'>
            {!isMobile && (
                <PageToolbar
                    leftActions={
                        <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
                            <Download className="h-4 w-4 mr-2" />
                            Xuất Excel
                        </Button>
                    }
                    rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />}
                />
            )}
            <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder='Tìm kiếm phiếu trả hàng (mã phiếu, mã đơn, khách hàng)...'>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                    <SelectTrigger className='w-full sm:w-[180px]'><SelectValue placeholder='Tất cả chi nhánh' /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>Tất cả chi nhánh</SelectItem>
                        {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <DataTableFacetedFilter title='Trạng thái' options={statusOptions} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} />
            </PageFilters>
            {isMobile ? (
                <div ref={mobileScrollRef} className='space-y-3 pb-4'>
                    {sortedData.length === 0 ? (
                        <Card><CardContent className='py-12 text-center'><p className='text-muted-foreground'>Không tìm thấy phiếu trả hàng</p></CardContent></Card>
                    ) : (
                        <>
                            {sortedData.slice(0, mobileLoadedCount).map(salesReturn => <MobileSalesReturnCard key={salesReturn.systemId} salesReturn={salesReturn} />)}
                            {mobileLoadedCount < sortedData.length && (
                                <Card className='border-dashed'><CardContent className='py-6 text-center'><div className='flex items-center justify-center gap-2'><div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' /><span className='text-body-sm text-muted-foreground'>Đang tải thêm...</span></div></CardContent></Card>
                            )}
                            {mobileLoadedCount >= sortedData.length && sortedData.length > 20 && (
                                <Card className='border-dashed'><CardContent className='py-4 text-center'><span className='text-body-sm text-muted-foreground'>Đã hiển thị tất cả {sortedData.length} phiếu trả hàng</span></CardContent></Card>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className='w-full py-4'>
                    <ResponsiveDataTable 
                        columns={columns} 
                        data={paginatedData} 
                        renderMobileCard={(salesReturn) => <MobileSalesReturnCard salesReturn={salesReturn} />} 
                        pageCount={pageCount} 
                        pagination={pagination} 
                        setPagination={setPagination} 
                        rowCount={filteredData.length} 
                        rowSelection={rowSelection} 
                        setRowSelection={setRowSelection} 
                        allSelectedRows={allSelectedRows}
                        bulkActions={bulkActions}
                        expanded={expanded} 
                        setExpanded={setExpanded} 
                        sorting={sorting} 
                        setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>} 
                        columnVisibility={columnVisibility} 
                        setColumnVisibility={setColumnVisibility} 
                        columnOrder={columnOrder} 
                        setColumnOrder={setColumnOrder} 
                        pinnedColumns={pinnedColumns} 
                        setPinnedColumns={setPinnedColumns} 
                        onRowClick={handleRowClick} 
                    />
                </div>
            )}

            {/* Print Options Dialog */}
            <SimplePrintOptionsDialog
                open={printDialogOpen}
                onOpenChange={setPrintDialogOpen}
                selectedCount={itemsToPrint.length}
                onConfirm={handlePrintConfirm}
                title="In phiếu trả hàng"
            />

            {/* Export Dialog */}
            <GenericExportDialogV2<SalesReturn>
                open={exportDialogOpen}
                onOpenChange={setExportDialogOpen}
                config={salesReturnConfig}
                allData={activeReturns}
                filteredData={sortedData}
                currentPageData={paginatedData}
                selectedData={allSelectedRows}
                currentUser={{
                    name: currentUser?.fullName || 'Hệ thống',
                    systemId: currentUser?.systemId || asSystemId('SYSTEM'),
                }}
            />
        </div>
    );
}
