import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../lib/date-utils.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useSalesReturnStore } from './store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { getColumns } from './columns.tsx';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table.tsx';
import { DataTableExportDialog } from '../../components/data-table/data-table-export-dialog.tsx';
import { DataTableFacetedFilter } from '../../components/data-table/data-table-faceted-filter.tsx';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle.tsx';
import { PageToolbar } from '../../components/layout/page-toolbar.tsx';
import { PageFilters } from '../../components/layout/page-filters.tsx';
import { Card, CardContent } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Avatar, AvatarFallback } from '../../components/ui/avatar.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu.tsx';
import { PlusCircle, Undo2, MoreHorizontal, Package, Calendar, User } from 'lucide-react';
import { TouchButton } from '../../components/mobile/touch-button.tsx';
import { useMediaQuery } from '../../lib/use-media-query.ts';
import type { SalesReturn } from './types.ts';
import Fuse from 'fuse.js';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

export function SalesReturnsPage() {
    const navigate = useNavigate();
    const { data: returns, getActive } = useSalesReturnStore();
    const { data: branches } = useBranchStore();
    
    const activeReturns = React.useMemo(() => getActive(), [returns]);
    
    usePageHeader({ actions: [] });
    
    const [sorting, setSorting] = React.useState({ id: 'returnDate', desc: true });
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

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300);
        return () => clearTimeout(timer);
    }, [globalFilter]);

    const handlePrintReturn = React.useCallback((returnIds: string[]) => {
        console.log('In Phiếu Trả Hàng:', returnIds);
        // TODO: Implement print logic
    }, []);

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
    const exportConfig = { fileName: 'Danh_sach_Tra_hang', columns };
    const handleRowClick = (row: SalesReturn) => navigate('/returns/' + row.systemId);

    const allSelectedRows = React.useMemo(() => activeReturns.filter(r => rowSelection[r.systemId]), [activeReturns, rowSelection]);

    const MobileSalesReturnCard = ({ salesReturn }: { salesReturn: SalesReturn }) => (
        <Card className='hover:shadow-md transition-shadow cursor-pointer' onClick={() => handleRowClick(salesReturn)}>
            <CardContent className='p-4'>
                <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <Avatar className='h-8 w-8 flex-shrink-0 bg-orange-100'>
                            <AvatarFallback className='text-xs text-orange-700'><Undo2 className='h-4 w-4' /></AvatarFallback>
                        </Avatar>
                        <div className='flex items-center gap-1.5 min-w-0 flex-1'>
                            <h3 className='font-semibold text-sm truncate'>{salesReturn.id}</h3>
                            <span className='text-xs text-muted-foreground'></span>
                            <span className='text-xs text-muted-foreground font-mono'>{salesReturn.orderId}</span>
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
                <div className='text-xs text-muted-foreground mb-3 flex items-center'>
                    <User className='h-3 w-3 mr-1.5 flex-shrink-0' />
                    <span className='truncate'>{salesReturn.customerName}</span>
                </div>
                <div className='border-t mb-3' />
                <div className='space-y-2'>
                    <div className='flex items-center text-xs text-muted-foreground'>
                        <Package className='h-3 w-3 mr-1.5 flex-shrink-0' />
                        <span>{salesReturn.items.reduce((sum, item) => sum + item.returnQuantity, 0)} sản phẩm</span>
                    </div>
                    <div className='flex items-center text-xs text-muted-foreground'>
                        <Calendar className='h-3 w-3 mr-1.5 flex-shrink-0' />
                        <span>{formatDate(salesReturn.returnDate)}</span>
                    </div>
                    <div className='flex items-center justify-between text-xs pt-1'>
                        <span className='font-semibold text-base'>{formatCurrency(salesReturn.totalReturnValue)}</span>
                        <Badge variant={salesReturn.isReceived ? 'default' : 'secondary'} className='text-xs'>
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
                        <DataTableExportDialog allData={activeReturns} filteredData={sortedData} pageData={paginatedData} config={exportConfig} />
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
                                <Card className='border-dashed'><CardContent className='py-6 text-center'><div className='flex items-center justify-center gap-2'><div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' /><span className='text-sm text-muted-foreground'>Đang tải thêm...</span></div></CardContent></Card>
                            )}
                            {mobileLoadedCount >= sortedData.length && sortedData.length > 20 && (
                                <Card className='border-dashed'><CardContent className='py-4 text-center'><span className='text-sm text-muted-foreground'>Đã hiển thị tất cả {sortedData.length} phiếu trả hàng</span></CardContent></Card>
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
                        bulkActionButtons={
                            allSelectedRows.length > 0 ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='outline' size='sm'>
                                            Chọn Hành Động ({allSelectedRows.length})
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='start'>
                                        <DropdownMenuItem onClick={() => handlePrintReturn(allSelectedRows.map(r => r.systemId))}>
                                            In Phiếu Trả Hàng
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : null
                        }
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
        </div>
    );
}
