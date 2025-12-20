'use client'

import * as React from 'react';
import { useNavigate } from '@/lib/next-compat';
import { formatDate } from '@/lib/date-utils';
import { usePageHeader } from '../../contexts/page-header-context';
import { useShipmentStore } from './store';
import { useOrderStore } from '../orders/store';
import { useCustomerStore } from '../customers/store';
import { useBranchStore } from '../settings/branches/store';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { usePrint } from '../../lib/use-print';
import { 
  convertShipmentToDeliveryForPrint,
  convertShipmentsToHandoverForPrint,
  mapDeliveryToPrintData,
  mapDeliveryLineItems,
  mapHandoverToPrintData,
  mapHandoverLineItems,
  createStoreSettings,
} from '../../lib/print/shipment-print-helper';
import type { Shipment, ShipmentView } from './types';
import { getColumns } from './columns';
import { ResponsiveDataTable, type BulkAction } from '../../components/data-table/responsive-data-table';
import { GenericExportDialogV2 } from '../../components/shared/generic-export-dialog-v2';
import { shipmentConfig } from '../../lib/import-export/configs/shipment.config';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle';
import { PageToolbar } from '../../components/layout/page-toolbar';
import { PageFilters } from '../../components/layout/page-filters';
import { Card, CardContent, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Truck, MoreHorizontal, Calendar, User, MapPin, Package, Printer, FileText, Download } from 'lucide-react';
import { TouchButton } from '../../components/mobile/touch-button';
import { useMediaQuery } from '../../lib/use-media-query';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';
import { toast } from 'sonner';
import Fuse from 'fuse.js';
import { useAuth } from '../../contexts/auth-context';
import { asSystemId } from '../../lib/id-types';

export function ShipmentsPage() {
    const { data: shipmentsData } = useShipmentStore();
    const { data: allOrders } = useOrderStore();
    const { data: allCustomers } = useCustomerStore();
    const { data: branches } = useBranchStore();
    const { info: storeInfo } = useStoreInfoStore();
    const { employee: currentUser } = useAuth();
    const navigate = useNavigate();
    const { print, printMultiple } = usePrint();

    // Print dialog state
    const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
    const [itemsToPrint, setItemsToPrint] = React.useState<ShipmentView[]>([]);
    const [printType, setPrintType] = React.useState<'delivery' | 'handover'>('delivery');
    
    // Export dialog state
    const [exportDialogOpen, setExportDialogOpen] = React.useState(false);

    const [branchFilter, setBranchFilter] = React.useState('all');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [partnerFilter, setPartnerFilter] = React.useState('all');
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
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

    // Build ShipmentView from Shipment entity + Order/Customer data
    const shipments = React.useMemo((): ShipmentView[] => {
        return shipmentsData.map(shipment => {
            const order = allOrders.find(o => o.systemId === shipment.orderSystemId);
            const customer = order ? allCustomers.find(c => c.systemId === order.customerSystemId) : null;
            const packaging = order?.packagings.find(p => p.systemId === shipment.packagingSystemId);
            
            const totalPaid = order?.payments.reduce((sum, p) => sum + p.amount, 0) || 0;
            const shippingAddress = customer 
                ? [customer.shippingAddress_street, customer.shippingAddress_ward, customer.shippingAddress_province].filter(Boolean).join(', ') 
                : '';
            
            return {
                // Shipment entity fields
                ...shipment,
                
                // Denormalized from Order/Customer
                customerName: order?.customerName || '-',
                customerPhone: customer?.phone || '-',
                customerAddress: shippingAddress,
                customerEmail: customer?.email || '-',
                branchName: order?.branchName || '-',
                
                // From Packaging
                packagingDate: packaging?.confirmDate,
                
                // Calculated
                totalProductQuantity: order?.lineItems.reduce((sum, item) => sum + item.quantity, 0) || 0,
                customerDue: (order?.grandTotal || 0) - totalPaid,
                
                // Employee names from packaging
                creatorEmployeeName: packaging?.requestingEmployeeName || '-',
                dispatchEmployeeName: order?.dispatchedByEmployeeName,
                cancelingEmployeeName: packaging?.cancelingEmployeeName,
            };
        });
    }, [shipmentsData, allOrders, allCustomers]);

    const handlePrintDelivery = React.useCallback((shipmentIds: string[]) => {
        shipmentIds.forEach(id => {
            const shipment = shipments.find(s => s.systemId === id);
            if (!shipment) return;
            
            const order = allOrders.find(o => o.systemId === shipment.orderSystemId);
            if (!order) return;
            
            const customer = allCustomers.find(c => c.systemId === order.customerSystemId);

            // Use helper to prepare print data
            const storeSettings = createStoreSettings(storeInfo);
            const deliveryData = convertShipmentToDeliveryForPrint(shipment, order, { customer });
            
            print('delivery', {
                data: mapDeliveryToPrintData(deliveryData, storeSettings),
                lineItems: mapDeliveryLineItems(deliveryData.items),
            });
        });
    }, [shipments, allOrders, allCustomers, storeInfo, print]);

    const handlePrintHandover = React.useCallback((shipmentIds: string[]) => {
        const selectedShipments = shipments.filter(s => shipmentIds.includes(s.systemId));
        if (selectedShipments.length === 0) return;

        // Use helper to prepare print data
        const storeSettings = createStoreSettings(storeInfo);
        const handoverData = convertShipmentsToHandoverForPrint(selectedShipments);
        
        print('handover', {
            data: mapHandoverToPrintData(handoverData, storeSettings),
            lineItems: mapHandoverLineItems(handoverData.orders),
        });
    }, [shipments, storeInfo, print]);

    const handlePrintSingleDelivery = React.useCallback((shipmentId: string) => {
        handlePrintDelivery([shipmentId]);
    }, [handlePrintDelivery]);

    const handlePrintSingleHandover = React.useCallback((shipmentId: string) => {
        handlePrintHandover([shipmentId]);
    }, [handlePrintHandover]);

    // Bulk print handlers
    const handleBulkPrintDelivery = React.useCallback((rows: ShipmentView[]) => {
        setItemsToPrint(rows);
        setPrintType('delivery');
        setPrintDialogOpen(true);
    }, []);

    const handleBulkPrintHandover = React.useCallback((rows: ShipmentView[]) => {
        setItemsToPrint(rows);
        setPrintType('handover');
        setPrintDialogOpen(true);
    }, []);

    const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
        if (itemsToPrint.length === 0) return;
        
        if (printType === 'delivery') {
            const printItems = itemsToPrint.map(shipment => {
                const order = allOrders.find(o => o.systemId === shipment.orderSystemId);
                const customer = order ? allCustomers.find(c => c.systemId === order.customerSystemId) : null;
                const selectedBranch = options.branchSystemId 
                    ? branches.find(b => b.systemId === options.branchSystemId)
                    : null;
                const storeSettings = selectedBranch 
                    ? createStoreSettings(selectedBranch as any)
                    : createStoreSettings(storeInfo);
                const deliveryData = convertShipmentToDeliveryForPrint(shipment, order!, { customer });
                
                return {
                    data: mapDeliveryToPrintData(deliveryData, storeSettings),
                    lineItems: mapDeliveryLineItems(deliveryData.items),
                    paperSize: options.paperSize,
                };
            }).filter(item => item.data);
            
            printMultiple('delivery', printItems);
            toast.success(`Đang in ${printItems.length} phiếu giao hàng`);
        } else {
            // Handover is a single document containing all selected shipments
            const selectedBranch = options.branchSystemId 
                ? branches.find(b => b.systemId === options.branchSystemId)
                : null;
            const storeSettings = selectedBranch 
                ? createStoreSettings(selectedBranch as any)
                : createStoreSettings(storeInfo);
            const handoverData = convertShipmentsToHandoverForPrint(itemsToPrint);
            
            print('handover', {
                data: mapHandoverToPrintData(handoverData, storeSettings),
                lineItems: mapHandoverLineItems(handoverData.orders),
            });
            toast.success('Đang in phiếu bàn giao');
        }
        
        setItemsToPrint([]);
        setPrintDialogOpen(false);
    }, [itemsToPrint, printType, allOrders, allCustomers, branches, storeInfo, print, printMultiple]);

    // Bulk actions
    const bulkActions: BulkAction<ShipmentView>[] = React.useMemo(() => [
        {
            label: 'In phiếu giao hàng',
            icon: Printer,
            onSelect: handleBulkPrintDelivery,
        },
        {
            label: 'In phiếu bàn giao',
            icon: FileText,
            onSelect: handleBulkPrintHandover,
        },
    ], [handleBulkPrintDelivery, handleBulkPrintHandover]);
    
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
        keys: ['trackingCode', 'customerName', 'customerPhone', 'carrier', 'id', 'orderId', 'customerAddress'], 
        threshold: 0.3,
        ignoreLocation: true
    }), [shipments]);

    const shipmentStats = React.useMemo(() => {
        return shipments.reduce((acc, shipment) => {
            acc.total += 1;
            const status = shipment.deliveryStatus;
            if (status === 'Chờ lấy hàng') acc.pending += 1;
            else if (status === 'Đang giao hàng') acc.shipping += 1;
            else if (status === 'Đã giao hàng') acc.delivered += 1;
            return acc;
        }, { total: 0, pending: 0, shipping: 0, delivered: 0 });
    }, [shipments]);

    usePageHeader({});

    // Get unique shipping partners from data
    const shippingPartners = React.useMemo(() => {
        const partners = new Set<string>();
        shipments.forEach(s => {
            if (s.carrier) partners.add(s.carrier);
        });
        return Array.from(partners).sort();
    }, [shipments]);

    const filteredData = React.useMemo(() => {
        let data = shipments;
        if (branchFilter !== 'all') data = data.filter(s => s.branchName === branches.find(b => b.systemId === branchFilter)?.name);
        if (statusFilter !== 'all') data = data.filter(s => s.deliveryStatus === statusFilter);
        if (partnerFilter !== 'all') data = data.filter(s => s.carrier === partnerFilter);
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
            // Special handling for date columns
            if (sorting.id === 'createdAt' || sorting.id === 'creationDate' || sorting.id === 'estimatedDeliveryDate') {
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

    const handleRowClick = (row: ShipmentView) => navigate('/shipments/' + row.systemId);

    const MobileShipmentCard = ({ shipment }: { shipment: ShipmentView }) => {
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
                            <Avatar className='h-8 w-8 flex-shrink-0 bg-primary/10'>
                                <AvatarFallback className='text-xs text-primary'><Truck className='h-4 w-4' /></AvatarFallback>
                            </Avatar>
                            <div className='flex items-center gap-1.5 min-w-0 flex-1'>
                                <CardTitle className='font-semibold text-sm truncate'>{shipment.trackingCode || shipment.id}</CardTitle>
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
                        <span className='truncate'>{shipment.customerName}</span>
                    </div>
                    <div className='border-t mb-3' />
                    <div className='space-y-2'>
                        <div className='flex items-center text-xs text-muted-foreground'>
                            <Calendar className='h-3 w-3 mr-1.5 flex-shrink-0' />
                            <span>{formatDate(shipment.createdAt)}</span>
                        </div>
                        {shipment.customerAddress && (
                            <div className='flex items-center text-xs text-muted-foreground'>
                                <MapPin className='h-3 w-3 mr-1.5 flex-shrink-0' />
                                <span className='truncate'>{shipment.customerAddress}</span>
                            </div>
                        )}
                        {shipment.carrier && (
                            <div className='flex items-center text-xs text-muted-foreground'>
                                <Package className='h-3 w-3 mr-1.5 flex-shrink-0' />
                                <span>{shipment.carrier}</span>
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
                        <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
                            <Download className="h-4 w-4 mr-2" />
                            Xuất Excel
                        </Button>
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
                onConfirm={handlePrintConfirm}
                selectedCount={itemsToPrint.length}
                title={printType === 'delivery' ? 'In phiếu giao hàng' : 'In phiếu bàn giao'}
            />

            {/* Export Dialog */}
            <GenericExportDialogV2<ShipmentView>
                open={exportDialogOpen}
                onOpenChange={setExportDialogOpen}
                config={shipmentConfig}
                allData={shipments}
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
