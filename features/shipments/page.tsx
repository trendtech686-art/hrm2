import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/date-utils';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useOrderStore } from '../orders/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import type { Shipment } from './types.ts';
import { getColumns } from './columns.tsx';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table.tsx';
import { DataTableExportDialog } from '../../components/data-table/data-table-export-dialog.tsx';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle.tsx';
import { PageToolbar } from '../../components/layout/page-toolbar.tsx';
import { PageFilters } from '../../components/layout/page-filters.tsx';
import { Card, CardContent } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Avatar, AvatarFallback } from '../../components/ui/avatar.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu.tsx';
import { Truck, MoreHorizontal, Calendar, User, MapPin, Package } from 'lucide-react';
import { TouchButton } from '../../components/mobile/touch-button.tsx';
import { useMediaQuery } from '../../lib/use-media-query.ts';
import Fuse from 'fuse.js';

export function ShipmentsPage() {
    const { data: allOrders } = useOrderStore();
    const { data: allCustomers } = useCustomerStore();
    const { data: branches } = useBranchStore();
    const navigate = useNavigate();
    
    const headerActions = React.useMemo(() => [], []);
    usePageHeader({ actions: headerActions });

    const [branchFilter, setBranchFilter] = React.useState('all');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [partnerFilter, setPartnerFilter] = React.useState('all');
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'creationDate', desc: true });
    const [rowSelection, setRowSelection] = React.useState({});
    const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
    const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
        const cols = getColumns();
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

    const shipments = React.useMemo(() => {
        const slips: Shipment[] = [];
        allOrders.forEach(order => {
            order.packagings.forEach(pkg => {
                if (!pkg.deliveryMethod) return; // Only include packages that are actual shipments

                const customer = allCustomers.find(c => c.systemId === order.customerSystemId);
                const totalPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);
                const shippingAddress = customer ? [customer.shippingAddress_street, customer.shippingAddress_ward, customer.shippingAddress_province].filter(Boolean).join(', ') : '';

                slips.push({
                    systemId: pkg.systemId,
                    trackingCode: pkg.trackingCode,
                    packagingDate: pkg.confirmDate,
                    recipientName: order.customerName,
                    recipientPhone: customer?.phone || '-',
                    shippingPartner: pkg.carrier,
                    deliveryStatus: pkg.deliveryStatus,
                    shippingFeeToPartner: pkg.shippingFeeToPartner,
                    codAmount: pkg.codAmount,
                    reconciliationStatus: pkg.reconciliationStatus,
                    creationDate: pkg.requestDate,
                    cancellationDate: pkg.cancelDate,
                    cancellationReason: pkg.cancelReason,
                    partnerStatus: pkg.partnerStatus,
                    payer: pkg.payer,
                    packagingId: pkg.id,
                    orderId: order.id,
                    orderSystemId: order.systemId,
                    printStatus: pkg.printStatus,
                    dispatchDate: order.dispatchedDate,
                    totalProductQuantity: order.lineItems.reduce((sum, item) => sum + item.quantity, 0),
                    customerDue: order.grandTotal - totalPaid,
                    deliveredDate: pkg.deliveryStatus === 'Đã giao hàng' ? (pkg.confirmDate || pkg.requestDate) : undefined, // Placeholder
                    province: customer?.shippingAddress_province,
                    districtWard: customer?.shippingAddress_ward,
                    recipientAddress: shippingAddress,
                    recipientEmail: customer?.email || '-',
                    deliveryMethod: pkg.deliveryMethod,
                    dispatchEmployeeName: order.dispatchedByEmployeeName,
                    creatorEmployeeName: pkg.requestingEmployeeName,
                    cancelingEmployeeName: pkg.cancelingEmployeeName,
                    branchName: order.branchName,
                    notes: pkg.noteToShipper,
                });
            });
        });
        return slips;
    }, [allOrders, allCustomers]);

    const handlePrintDelivery = React.useCallback((shipmentIds: string[]) => {
        console.log('In Phiếu Giao Hàng:', shipmentIds);
        // TODO: Implement print delivery logic
    }, []);

    const handlePrintHandover = React.useCallback((shipmentIds: string[]) => {
        console.log('In Phiếu Bàn Giao:', shipmentIds);
        // TODO: Implement print handover logic
    }, []);

    const handlePrintSingleDelivery = React.useCallback((shipmentId: string) => {
        handlePrintDelivery([shipmentId]);
    }, [handlePrintDelivery]);

    const handlePrintSingleHandover = React.useCallback((shipmentId: string) => {
        handlePrintHandover([shipmentId]);
    }, [handlePrintHandover]);
    
    const columns = React.useMemo(() => getColumns(handlePrintSingleDelivery, handlePrintSingleHandover, navigate), [handlePrintSingleDelivery, handlePrintSingleHandover, navigate]);

    React.useEffect(() => {
        const defaultVisibleColumns = [
            'select', 'trackingCode', 'packagingDate', 'recipientName', 'recipientPhone',
            'shippingPartner', 'deliveryStatus', 'shippingFeeToPartner', 'codAmount',
            'creationDate', 'packagingId', 'orderId', 'dispatchDate', 'branchName', 'actions'
        ];
        const initialVisibility: Record<string, boolean> = {};
        columns.forEach(c => {
            if (c.id) {
                initialVisibility[c.id] = defaultVisibleColumns.includes(c.id);
            }
        });
        setColumnVisibility(initialVisibility);
        setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    }, [columns]);
    
    const fuseInstance = React.useMemo(() => new Fuse(shipments, { 
        keys: ['trackingCode', 'recipientName', 'recipientPhone', 'shippingPartner', 'packagingId', 'orderId', 'recipientAddress'], 
        threshold: 0.3,
        ignoreLocation: true
    }), [shipments]);

    // Get unique shipping partners from data
    const shippingPartners = React.useMemo(() => {
        const partners = new Set<string>();
        shipments.forEach(s => {
            if (s.shippingPartner) partners.add(s.shippingPartner);
        });
        return Array.from(partners).sort();
    }, [shipments]);

    const filteredData = React.useMemo(() => {
        let data = shipments;
        if (branchFilter !== 'all') data = data.filter(s => s.branchName === branches.find(b => b.systemId === branchFilter)?.name);
        if (statusFilter !== 'all') data = data.filter(s => s.deliveryStatus === statusFilter);
        if (partnerFilter !== 'all') data = data.filter(s => s.shippingPartner === partnerFilter);
        if (debouncedGlobalFilter && debouncedGlobalFilter.trim()) {
            fuseInstance.setCollection(data);
            data = fuseInstance.search(debouncedGlobalFilter.trim()).map(r => r.item);
        }
        return data;
    }, [shipments, branchFilter, statusFilter, partnerFilter, debouncedGlobalFilter, fuseInstance, branches]);
    
    React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedGlobalFilter, branchFilter, statusFilter, partnerFilter]);
    
    const sortedData = React.useMemo(() => {
        const sorted = [...filteredData];
        if (sorting.id) {
          sorted.sort((a, b) => {
            const aValue = (a as any)[sorting.id];
            const bValue = (b as any)[sorting.id];
            if (!aValue) return 1;
            if (!bValue) return -1;
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

    const allSelectedRows = React.useMemo(() => shipments.filter(s => rowSelection[s.systemId]), [shipments, rowSelection]);

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
    
    React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedGlobalFilter, branchFilter, statusFilter, partnerFilter]);

    const exportConfig = { fileName: 'Danh_sach_Van_chuyen', columns };
    const handleRowClick = (row: Shipment) => navigate('/shipments/' + row.systemId);

    const MobileShipmentCard = ({ shipment }: { shipment: Shipment }) => {
        const getStatusVariant = (status?: string): 'default' | 'secondary' | 'destructive' => {
            if (!status) return 'secondary';
            const map: Record<string, 'default' | 'secondary' | 'destructive'> = {
                'Đã giao hàng': 'default', 
                'Đang giao hàng': 'secondary',
                'Đang vận chuyển': 'secondary', 
                'Chờ lấy hàng': 'secondary',
                'Chờ giao lại': 'secondary',
                'Chưa gửi': 'secondary', 
                'Hủy vận chuyển': 'destructive', 
                'Trả hàng': 'destructive'
            };
            return map[status] || 'secondary';
        };

        return (
            <Card className='hover:shadow-md transition-shadow cursor-pointer' onClick={() => handleRowClick(shipment)}>
                <CardContent className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-2 flex-1 min-w-0'>
                            <Avatar className='h-8 w-8 flex-shrink-0 bg-green-100'>
                                <AvatarFallback className='text-xs text-green-700'><Truck className='h-4 w-4' /></AvatarFallback>
                            </Avatar>
                            <div className='flex items-center gap-1.5 min-w-0 flex-1'>
                                <h3 className='font-semibold text-sm truncate'>{shipment.trackingCode || shipment.packagingId}</h3>
                                <span className='text-xs text-muted-foreground'>•</span>
                                <span className='text-xs text-muted-foreground font-mono'>{shipment.orderId}</span>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <TouchButton variant='ghost' size='sm' className='h-8 w-8 p-0 flex-shrink-0' onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className='h-4 w-4' />
                                </TouchButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate('/orders/' + shipment.orderSystemId); }}>Xem đơn hàng</DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePrintSingleDelivery(shipment.systemId); }}>In Phiếu Giao Hàng</DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePrintSingleHandover(shipment.systemId); }}>In Phiếu Bàn Giao</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className='text-xs text-muted-foreground mb-3 flex items-center'>
                        <User className='h-3 w-3 mr-1.5 flex-shrink-0' />
                        <span className='truncate'>{shipment.recipientName}</span>
                    </div>
                    <div className='border-t mb-3' />
                    <div className='space-y-2'>
                        <div className='flex items-center text-xs text-muted-foreground'>
                            <Calendar className='h-3 w-3 mr-1.5 flex-shrink-0' />
                            <span>{formatDate(shipment.creationDate)}</span>
                        </div>
                        {shipment.recipientAddress && (
                            <div className='flex items-center text-xs text-muted-foreground'>
                                <MapPin className='h-3 w-3 mr-1.5 flex-shrink-0' />
                                <span className='truncate'>{shipment.recipientAddress}</span>
                            </div>
                        )}
                        {shipment.shippingPartner && (
                            <div className='flex items-center text-xs text-muted-foreground'>
                                <Package className='h-3 w-3 mr-1.5 flex-shrink-0' />
                                <span>{shipment.shippingPartner}</span>
                            </div>
                        )}
                        <div className='flex items-center justify-between text-xs pt-1'>
                            <span className='text-muted-foreground'>{shipment.branchName}</span>
                            <Badge variant={getStatusVariant(shipment.deliveryStatus)} className='text-xs'>
                                {shipment.deliveryStatus || 'Chưa xác định'}
                            </Badge>
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
                        <DataTableExportDialog allData={shipments} filteredData={sortedData} pageData={paginatedData} config={exportConfig} />
                    }
                    rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />}
                />
            )}
            <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder='Tìm kiếm vận đơn (MVĐ, tên người nhận, SĐT, đối tác, mã phiếu, mã đơn)...'>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                    <SelectTrigger className='w-full sm:w-[180px]'><SelectValue placeholder='Tất cả chi nhánh' /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>Tất cả chi nhánh</SelectItem>
                        {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={partnerFilter} onValueChange={setPartnerFilter}>
                    <SelectTrigger className='w-full sm:w-[180px]'><SelectValue placeholder='Tất cả đối tác' /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>Tất cả đối tác</SelectItem>
                        {shippingPartners.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className='w-full sm:w-[180px]'><SelectValue placeholder='Tất cả trạng thái' /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                        <SelectItem value='Chờ lấy hàng'>Chờ lấy hàng</SelectItem>
                        <SelectItem value='Đang giao hàng'>Đang giao hàng</SelectItem>
                        <SelectItem value='Đang vận chuyển'>Đang vận chuyển</SelectItem>
                        <SelectItem value='Đã giao hàng'>Đã giao hàng</SelectItem>
                        <SelectItem value='Chờ giao lại'>Chờ giao lại</SelectItem>
                        <SelectItem value='Trả hàng'>Trả hàng</SelectItem>
                        <SelectItem value='Hủy vận chuyển'>Hủy vận chuyển</SelectItem>
                    </SelectContent>
                </Select>
            </PageFilters>
            {isMobile ? (
                <div ref={mobileScrollRef} className='space-y-3 pb-4'>
                    {sortedData.length === 0 ? (
                        <Card><CardContent className='py-12 text-center'><p className='text-muted-foreground'>Không tìm thấy vận đơn</p></CardContent></Card>
                    ) : (
                        <>
                            {sortedData.slice(0, mobileLoadedCount).map(shipment => <MobileShipmentCard key={shipment.systemId} shipment={shipment} />)}
                            {mobileLoadedCount < sortedData.length && (
                                <Card className='border-dashed'><CardContent className='py-6 text-center'><div className='flex items-center justify-center gap-2'><div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' /><span className='text-sm text-muted-foreground'>Đang tải thêm...</span></div></CardContent></Card>
                            )}
                            {mobileLoadedCount >= sortedData.length && sortedData.length > 20 && (
                                <Card className='border-dashed'><CardContent className='py-4 text-center'><span className='text-sm text-muted-foreground'>Đã hiển thị tất cả {sortedData.length} vận đơn</span></CardContent></Card>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className='w-full py-4'>
                    <ResponsiveDataTable 
                        columns={columns} 
                        data={paginatedData} 
                        renderMobileCard={(shipment) => <MobileShipmentCard shipment={shipment} />} 
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
                                        <DropdownMenuItem onClick={() => handlePrintDelivery(allSelectedRows.map(s => s.systemId))}>
                                            In Phiếu Giao Hàng
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handlePrintHandover(allSelectedRows.map(s => s.systemId))}>
                                            In Phiếu Bàn Giao
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
