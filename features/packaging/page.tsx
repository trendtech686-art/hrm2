import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/date-utils';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useOrderStore } from '../orders/store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import type { PackagingSlip } from './types.ts';
import { getColumns } from './columns.tsx';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table.tsx';
import { GenericExportDialogV2 } from '../../components/shared/generic-export-dialog-v2.tsx';
import { packagingConfig } from '../../lib/import-export/configs/packaging.config.ts';
import { asSystemId } from '../../lib/id-types.ts';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle.tsx';
import { PageToolbar } from '../../components/layout/page-toolbar.tsx';
import { PageFilters } from '../../components/layout/page-filters.tsx';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog.tsx';
import { Card, CardContent, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Avatar, AvatarFallback } from '../../components/ui/avatar.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Label } from '../../components/ui/label.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu.tsx';
import { Package, MoreHorizontal, Calendar, User, Inbox, Printer, Download } from 'lucide-react';
import { TouchButton } from '../../components/mobile/touch-button.tsx';
import { useMediaQuery } from '../../lib/use-media-query.ts';
import { toast } from 'sonner';
import Fuse from 'fuse.js';
import { useAuth } from '../../contexts/auth-context.tsx';
import { useStoreInfoStore } from '../settings/store-info/store-info-store.ts';
import { usePrint } from '../../lib/use-print.ts';
import { 
  convertToPackingForPrint,
  mapPackingToPrintData,
  mapPackingLineItems,
  createStoreSettings,
} from '../../lib/print/order-print-helper.ts';
import { useCustomerStore } from '../customers/store.ts';

function CancelDialog({ isOpen, onOpenChange, onConfirm }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = React.useState('');
  const handleConfirm = () => { onConfirm(reason); setReason(''); };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hủy yêu cầu đóng gói</DialogTitle>
          <DialogDescription>Vui lòng nhập lý do hủy. Hành động này sẽ cập nhật trạng thái của phiếu đóng gói thành 'Hủy đóng gói'.</DialogDescription>
        </DialogHeader>
        <div className='pt-4'>
          <Label htmlFor='cancel-reason'>Lý do hủy</Label>
          <Textarea id='cancel-reason' value={reason} onChange={(e) => setReason(e.target.value)} className='mt-2' placeholder='Nhập lý do...' />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>Thoát</Button>
          <Button variant='destructive' onClick={handleConfirm}>Xác nhận Hủy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PackagingPage() {
    const { data: allOrders, confirmPackaging, cancelPackagingRequest } = useOrderStore();
    const { data: branches, findById: findBranchById } = useBranchStore();
    const { findById: findCustomerById } = useCustomerStore();
    const { employee: authEmployee } = useAuth();
    const { info: storeInfo } = useStoreInfoStore();
    const { print, printMultiple } = usePrint();
    const currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM';
    const navigate = useNavigate();
    
    // Print dialog state
    const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
    const [itemsToPrint, setItemsToPrint] = React.useState<PackagingSlip[]>([]);
    
    // Export dialog state
    const [exportDialogOpen, setExportDialogOpen] = React.useState(false);

    usePageHeader({
        title: 'Phiếu đóng gói',
        breadcrumb: [
            { label: 'Trang chủ', href: '/', isCurrent: false },
            { label: 'Đóng gói', href: '/packaging', isCurrent: true }
        ],
        showBackButton: false,
    });

    const [cancelDialogState, setCancelDialogState] = React.useState<{ orderSystemId: string, packagingSystemId: string } | null>(null);
    const [branchFilter, setBranchFilter] = React.useState('all');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
    const [rowSelection, setRowSelection] = React.useState({});
    const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
    const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
        // Initialize with all columns visible
        const cols = getColumns(
            () => {}, 
            () => {}, 
            () => {}
        );
        const initial: Record<string, boolean> = {};
        cols.forEach(c => { if (c.id) initial[c.id] = true; });
        return initial;
    });
    const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
    const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
    const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);
    const isMobile = !useMediaQuery('(min-width: 768px)');

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300);
        return () => clearTimeout(timer);
    }, [globalFilter]);

    const packagingSlips = React.useMemo(() => {
        const slips: PackagingSlip[] = [];
        allOrders.forEach(order => {
            order.packagings.forEach(pkg => {
                slips.push({
                    systemId: pkg.systemId, id: pkg.id, orderId: order.id, orderSystemId: order.systemId,
                    customerName: order.customerName, requestDate: pkg.requestDate, confirmDate: pkg.confirmDate,
                    cancelDate: pkg.cancelDate, requestingEmployeeName: pkg.requestingEmployeeName,
                    confirmingEmployeeName: pkg.confirmingEmployeeName, cancelingEmployeeName: pkg.cancelingEmployeeName,
                    assignedEmployeeName: pkg.assignedEmployeeName, status: pkg.status, printStatus: pkg.printStatus,
                    branchName: order.branchName, cancelReason: pkg.cancelReason
                });
            });
        });
        return slips;
    }, [allOrders]);
    
    const handleConfirm = React.useCallback((orderSystemId: string, packagingSystemId: string) => {
        confirmPackaging(orderSystemId, packagingSystemId, currentUserSystemId);
    }, [confirmPackaging, currentUserSystemId]);

    const handleCancelRequest = React.useCallback((orderSystemId: string, packagingSystemId: string) => {
        setCancelDialogState({ orderSystemId, packagingSystemId });
    }, []);

    const handleConfirmCancel = (reason: string) => {
        if (cancelDialogState) {
            cancelPackagingRequest(cancelDialogState.orderSystemId, cancelDialogState.packagingSystemId, currentUserSystemId, reason);
            setCancelDialogState(null);
        }
    };

    // Handler để mở dialog in với options
    const handleBulkPrint = React.useCallback((rows: PackagingSlip[]) => {
        setItemsToPrint(rows);
        setPrintDialogOpen(true);
    }, []);

    // Handler khi xác nhận in từ dialog
    const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
        if (itemsToPrint.length === 0) return;

        const { branchSystemId, paperSize } = options;
        const selectedBranch = branchSystemId ? findBranchById(branchSystemId) : null;
        
        const printOptionsList: any[] = [];
        
        itemsToPrint.forEach(pkg => {
            // Find the order for this packaging
            let targetOrder: any = null;
            let targetPkg: any = null;

            for (const order of allOrders) {
                const foundPkg = order.packagings.find(p => p.systemId === pkg.systemId);
                if (foundPkg) {
                    targetOrder = order;
                    targetPkg = foundPkg;
                    break;
                }
            }

            if (!targetOrder || !targetPkg) return;

            const customer = findCustomerById(targetOrder.customerSystemId);
            const branch = selectedBranch || findBranchById(targetOrder.branchSystemId);
            const storeSettings = branch 
                ? createStoreSettings(branch)
                : {
                    name: storeInfo.companyName || storeInfo.brandName || '',
                    address: storeInfo.headquartersAddress || '',
                    phone: storeInfo.hotline || '',
                    email: storeInfo.email || '',
                    province: storeInfo.province || '',
                  };
            const packingData = convertToPackingForPrint(targetOrder, targetPkg, { customer });
            
            printOptionsList.push({
                data: mapPackingToPrintData(packingData, storeSettings),
                lineItems: mapPackingLineItems(packingData.items),
                paperSize,
            });
        });

        if (printOptionsList.length > 0) {
            printMultiple('packing', printOptionsList);
            toast.success(`Đang in ${printOptionsList.length} phiếu đóng gói`);
        }
        
        setPrintDialogOpen(false);
        setItemsToPrint([]);
        setRowSelection({});
    }, [itemsToPrint, allOrders, findCustomerById, findBranchById, storeInfo, printMultiple]);
    
    const handlePrintPackaging = React.useCallback((packagingIds: string[]) => {
        packagingIds.forEach(pkgId => {
            // Find the packaging slip and the order
            let targetOrder: any = null;
            let targetPkg: any = null;

            for (const order of allOrders) {
                const pkg = order.packagings.find(p => p.systemId === pkgId);
                if (pkg) {
                    targetOrder = order;
                    targetPkg = pkg;
                    break;
                }
            }

            if (!targetOrder || !targetPkg) return;

            // Use helper to prepare print data
            const customer = findCustomerById(targetOrder.customerSystemId);
            const branch = findBranchById(targetOrder.branchSystemId);
            const storeSettings = branch 
                ? createStoreSettings(branch)
                : {
                    name: storeInfo.companyName || storeInfo.brandName || '',
                    address: storeInfo.headquartersAddress || '',
                    phone: storeInfo.hotline || '',
                    email: storeInfo.email || '',
                    province: storeInfo.province || '',
                  };
            const packingData = convertToPackingForPrint(targetOrder, targetPkg, { customer });
            
            print('packing', {
                data: mapPackingToPrintData(packingData, storeSettings),
                lineItems: mapPackingLineItems(packingData.items),
            });
        });
    }, [allOrders, findCustomerById, findBranchById, storeInfo, print]);

    const handleBulkCancelPackaging = React.useCallback((packagingIds: string[]) => {
        console.log('Hủy Phiếu Đóng Gói:', packagingIds);
        // TODO: Implement bulk cancel logic
    }, []);

    const handlePrintSinglePackaging = React.useCallback((packagingId: string) => {
        handlePrintPackaging([packagingId]);
    }, [handlePrintPackaging]);
    
    const columns = React.useMemo(() => getColumns(handleConfirm, handleCancelRequest, handlePrintSinglePackaging), [handleConfirm, handleCancelRequest, handlePrintSinglePackaging]);
    
    // Update column order when columns change
    React.useEffect(() => {
        setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    }, [columns]);
    
    const fuseInstance = React.useMemo(() => {
        return new Fuse(packagingSlips, { keys: ['id', 'orderId', 'customerName', 'assignedEmployeeName', 'branchName'], threshold: 0.3, ignoreLocation: true });
    }, [packagingSlips]);

    const filteredData = React.useMemo(() => {
        let data = packagingSlips;
        if (branchFilter !== 'all') data = data.filter(s => s.branchName === branches.find(b => b.systemId === branchFilter)?.name);
        if (statusFilter !== 'all') data = data.filter(s => s.status === statusFilter);
        if (debouncedGlobalFilter && debouncedGlobalFilter.trim()) {
            fuseInstance.setCollection(data);
            data = fuseInstance.search(debouncedGlobalFilter.trim()).map(r => r.item);
        }
        return data;
    }, [packagingSlips, branchFilter, statusFilter, debouncedGlobalFilter, fuseInstance, branches]);
    
    React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedGlobalFilter, branchFilter, statusFilter]);
    
    const sortedData = React.useMemo(() => {
        const sorted = [...filteredData];
        if (sorting.id) {
            sorted.sort((a, b) => {
                const aValue = (a as any)[sorting.id];
                const bValue = (b as any)[sorting.id];
                if (!aValue) return 1;
                if (!bValue) return -1;
                // Special handling for date columns
                if (sorting.id === 'createdAt' || sorting.id === 'requestDate') {
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

    const allSelectedRows = React.useMemo(() => packagingSlips.filter(p => rowSelection[p.systemId]), [packagingSlips, rowSelection]);

    // Bulk actions với SimplePrintOptionsDialog
    const bulkActions = React.useMemo(() => [
        {
            label: 'In phiếu đóng gói',
            icon: Printer,
            onSelect: (rows: PackagingSlip[]) => handleBulkPrint(rows),
        },
    ], [handleBulkPrint]);

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

    const handleRowClick = (row: PackagingSlip) => navigate('/packaging/' + row.systemId);

    const MobilePackagingCard = ({ packaging }: { packaging: PackagingSlip }) => {
        const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
            const map: Record<string, 'default' | 'secondary' | 'destructive'> = {
                'Đã đóng gói': 'default', 'Chờ đóng gói': 'secondary', 'Hủy đóng gói': 'destructive'
            };
            return map[status] || 'secondary';
        };

        return (
            <Card className='hover:shadow-md transition-shadow cursor-pointer' onClick={() => handleRowClick(packaging)}>
                <CardContent className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-2 flex-1 min-w-0'>
                            <Avatar className='h-8 w-8 flex-shrink-0 bg-primary/10'>
                                <AvatarFallback className='text-xs text-primary'><Inbox className='h-4 w-4' /></AvatarFallback>
                            </Avatar>
                            <div className='flex items-center gap-1.5 min-w-0 flex-1'>
                                <CardTitle className='font-semibold text-sm truncate'>{packaging.id}</CardTitle>
                                <span className='text-xs text-muted-foreground'></span>
                                <span className='text-xs text-muted-foreground font-mono'>{packaging.orderId}</span>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <TouchButton variant='ghost' size='sm' className='h-8 w-8 p-0 flex-shrink-0' onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className='h-4 w-4' />
                                </TouchButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate('/packaging/' + packaging.systemId); }}>Xem chi tiết</DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePrintSinglePackaging(packaging.systemId); }}>In Phiếu Đóng Gói</DropdownMenuItem>
                                {packaging.status === 'Chờ đóng gói' && (
                                    <>
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleConfirm(packaging.orderSystemId, packaging.systemId); }}>Xác nhận đóng gói</DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCancelRequest(packaging.orderSystemId, packaging.systemId); }}>Hủy yêu cầu</DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className='text-xs text-muted-foreground mb-3 flex items-center'>
                        <User className='h-3 w-3 mr-1.5 flex-shrink-0' />
                        <span className='truncate'>{packaging.customerName}</span>
                    </div>
                    <div className='border-t mb-3' />
                    <div className='space-y-2'>
                        <div className='flex items-center text-xs text-muted-foreground'>
                            <Calendar className='h-3 w-3 mr-1.5 flex-shrink-0' />
                            <span>{formatDate(packaging.requestDate)}</span>
                        </div>
                        {packaging.assignedEmployeeName && (
                            <div className='flex items-center text-xs text-muted-foreground'>
                                <Package className='h-3 w-3 mr-1.5 flex-shrink-0' />
                                <span>{packaging.assignedEmployeeName}</span>
                            </div>
                        )}
                        <div className='flex items-center justify-between text-xs pt-1'>
                            <span className='text-muted-foreground'>{packaging.branchName}</span>
                            <Badge variant={getStatusVariant(packaging.status)} className='text-xs'>{packaging.status}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

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
            <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder='Tìm kiếm phiếu đóng gói (mã phiếu, mã đơn, khách hàng)...'>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                    <SelectTrigger className='w-full sm:w-[180px]'><SelectValue placeholder='Tất cả chi nhánh' /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>Tất cả chi nhánh</SelectItem>
                        {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className='w-full sm:w-[180px]'><SelectValue placeholder='Tất cả trạng thái' /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                        <SelectItem value='Chờ đóng gói'>Chờ đóng gói</SelectItem>
                        <SelectItem value='Đã đóng gói'>Đã đóng gói</SelectItem>
                        <SelectItem value='Hủy đóng gói'>Hủy đóng gói</SelectItem>
                    </SelectContent>
                </Select>
            </PageFilters>
            {isMobile ? (
                <div ref={mobileScrollRef} className='space-y-3 pb-4'>
                    {sortedData.length === 0 ? (
                        <Card><CardContent className='py-12 text-center'><p className='text-muted-foreground'>Không tìm thấy phiếu đóng gói</p></CardContent></Card>
                    ) : (
                        <>
                            {sortedData.slice(0, mobileLoadedCount).map(packaging => <MobilePackagingCard key={packaging.systemId} packaging={packaging} />)}
                            {mobileLoadedCount < sortedData.length && (
                                <Card className='border-dashed'><CardContent className='py-6 text-center'><div className='flex items-center justify-center gap-2'><div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' /><span className='text-sm text-muted-foreground'>Đang tải thêm...</span></div></CardContent></Card>
                            )}
                            {mobileLoadedCount >= sortedData.length && sortedData.length > 20 && (
                                <Card className='border-dashed'><CardContent className='py-4 text-center'><span className='text-sm text-muted-foreground'>Đã hiển thị tất cả {sortedData.length} phiếu đóng gói</span></CardContent></Card>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className='w-full py-4'>
                    <ResponsiveDataTable 
                        columns={columns} 
                        data={paginatedData} 
                        renderMobileCard={(packaging) => <MobilePackagingCard packaging={packaging} />} 
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
                title="In phiếu đóng gói"
            />
            <CancelDialog isOpen={!!cancelDialogState} onOpenChange={(open) => !open && setCancelDialogState(null)} onConfirm={handleConfirmCancel} />

            {/* Export Dialog */}
            <GenericExportDialogV2<PackagingSlip>
                open={exportDialogOpen}
                onOpenChange={setExportDialogOpen}
                config={packagingConfig}
                allData={packagingSlips}
                filteredData={sortedData}
                currentPageData={paginatedData}
                selectedData={allSelectedRows}
                currentUser={{
                    name: authEmployee?.fullName || 'Hệ thống',
                    systemId: authEmployee?.systemId || asSystemId('SYSTEM'),
                }}
            />
        </div>
    );
}
