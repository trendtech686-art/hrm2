'use client'
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/date-utils';
import { usePageHeader } from '../../contexts/page-header-context';
import { useShipments, useShipmentStats, type ShipmentStats } from './hooks/use-shipments';
import { useAllShipments, useShipmentCarriers } from './hooks/use-all-shipments';
import { useAllOrders } from '../orders/hooks/use-all-orders';
import { useAllCustomers } from '../customers/hooks/use-all-customers';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { usePrint } from '../../lib/use-print';
import { convertShipmentToDeliveryForPrint, convertShipmentsToHandoverForPrint, mapDeliveryToPrintData, mapDeliveryLineItems, mapHandoverToPrintData, mapHandoverLineItems, createStoreSettings } from '../../lib/print/shipment-print-helper';
import dynamic from 'next/dynamic';
import type { ShipmentView } from '@/lib/types/prisma-extended';
import { getColumns } from './columns';
import { ResponsiveDataTable, type BulkAction } from '../../components/data-table/responsive-data-table';
import { asSystemId } from '../../lib/id-types';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../components/data-table/dynamic-column-customizer';
const ShipmentExportDialog = dynamic(() => import("./components/shipments-import-export-dialogs").then(mod => ({ default: mod.ShipmentExportDialog })), { ssr: false });
import { PageToolbar } from '../../components/layout/page-toolbar';
import { PageFilters } from '../../components/layout/page-filters';
import { StatsCard, StatsCardGrid } from '../../components/shared/stats-card';
import { Card, CardContent, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Truck, MoreHorizontal, Calendar, User, MapPin, Package, Printer, FileText, Download, Clock, CheckCircle2, RotateCcw, Settings } from 'lucide-react';
import { TouchButton } from '../../components/mobile/touch-button';
import { useMediaQuery } from '../../lib/use-media-query';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/auth-context';
import { useColumnVisibility } from '../../hooks/use-column-visibility';

export interface ShipmentsPageProps {
  initialStats?: ShipmentStats;
}

export function ShipmentsPage({ initialStats }: ShipmentsPageProps = {}) {
  const router = useRouter();
  const { print, printMultiple } = usePrint();
  const isMobile = !useMediaQuery('(min-width: 768px)');
  const { employee: currentUser } = useAuth();
  
  // Stats from Server Component (instant, no loading)
  const { data: stats } = useShipmentStats(initialStats);

  // Print state (declared early so isPrintMode can reference them)
  const [printTriggered, setPrintTriggered] = React.useState(false);
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<ShipmentView[]>([]);
  const [printType, setPrintType] = React.useState<'delivery' | 'handover'>('delivery');

  // Data sources for print (lazy-loaded: only fetch when print is needed)
  const isPrintMode = printTriggered || printDialogOpen || itemsToPrint.length > 0;
  const { data: allOrders } = useAllOrders({ enabled: isPrintMode });
  const { data: allCustomers } = useAllCustomers({ enabled: isPrintMode });
  const { data: branches } = useAllBranches();
  const { info: storeInfo } = useStoreInfoData();

  // Server-side pagination state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [partnerFilter, setPartnerFilter] = React.useState('all');
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });

  // UI state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  // ✅ Persistent column visibility via useColumnVisibility hook
  const defaultColumnVisibility = React.useMemo(() => {
    const defaultCols = ['select', 'trackingCode', 'packagingDate', 'recipientName', 'recipientPhone', 'shippingPartner', 'deliveryStatus', 'shippingFeeToPartner', 'codAmount', 'creationDate', 'packagingId', 'orderId', 'dispatchDate', 'branchName', 'actions'];
    const cols = getColumns();
    const v: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) v[c.id] = defaultCols.includes(c.id); });
    return v;
  }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('shipments', defaultColumnVisibility);
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [branchFilter, statusFilter, partnerFilter]);

  // Server-side query
  const { data: shipmentsData, isLoading: isLoadingShipments } = useShipments({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    branchId: branchFilter !== 'all' ? branchFilter : undefined,
    deliveryStatus: statusFilter !== 'all' ? statusFilter : undefined,
    carrier: partnerFilter !== 'all' ? partnerFilter : undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });

  const shipments = React.useMemo(() => (shipmentsData?.data ?? []) as ShipmentView[], [shipmentsData?.data]);
  const totalRows = shipmentsData?.pagination?.total ?? 0;
  const pageCount = shipmentsData?.pagination?.totalPages ?? 1;

  // ✅ Lazy-load all shipments — only for export dialog
  const { data: allShipments } = useAllShipments({ enabled: exportDialogOpen });

  // ✅ Lightweight carriers query for filter dropdown
  const { data: shippingPartners = [] } = useShipmentCarriers();

  const pageHeaderConfig = React.useMemo(() => ({}), []);
  usePageHeader(pageHeaderConfig);

  // Print handlers — trigger lazy-load on first use
  const handlePrintDelivery = React.useCallback((ids: string[]) => {
    setPrintTriggered(true);
    if (!allOrders.length) {
      toast.info('Đang tải dữ liệu in, vui lòng thử lại...');
      return;
    }
    ids.forEach(id => {
    const s = shipments.find(x => x.systemId === id);
    if (!s) return;
    // Try orderSystemId first, then fallback to orderId
    // Note: orderId in legacy data may contain systemId (ORDER000004) or business ID (DH000004)
    let o = allOrders.find(x => x.systemId === s.orderSystemId);
    if (!o && s.orderId) {
      // Try matching as systemId first (legacy data stores systemId in orderId)
      o = allOrders.find(x => (x.systemId as string) === (s.orderId as string));
      // Then try as business ID
      if (!o) {
        o = allOrders.find(x => x.id === s.orderId);
      }
    }
    if (!o) return;
    const c = allCustomers.find(x => x.systemId === o.customerSystemId);
    const st = createStoreSettings(storeInfo);
    const d = convertShipmentToDeliveryForPrint(s, o, { customer: c });
    print('delivery', { data: mapDeliveryToPrintData(d, st), lineItems: mapDeliveryLineItems(d.items) });
    });
  }, [shipments, allOrders, allCustomers, storeInfo, print]);

  const handlePrintHandover = React.useCallback((ids: string[]) => {
    const sel = shipments.filter(s => ids.includes(s.systemId));
    if (!sel.length) return;
    const st = createStoreSettings(storeInfo);
    const h = convertShipmentsToHandoverForPrint(sel);
    print('handover', { data: mapHandoverToPrintData(h, st), lineItems: mapHandoverLineItems(h.orders) });
  }, [shipments, storeInfo, print]);

  const handlePrintSingleDelivery = React.useCallback((id: string) => handlePrintDelivery([id]), [handlePrintDelivery]);
  const handlePrintSingleHandover = React.useCallback((id: string) => handlePrintHandover([id]), [handlePrintHandover]);
  const handleBulkPrintDelivery = React.useCallback((rows: ShipmentView[]) => { setItemsToPrint(rows); setPrintType('delivery'); setPrintDialogOpen(true); }, []);
  const handleBulkPrintHandover = React.useCallback((rows: ShipmentView[]) => { setItemsToPrint(rows); setPrintType('handover'); setPrintDialogOpen(true); }, []);

  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    if (!itemsToPrint.length) return;
    if (printType === 'delivery') {
      const items = itemsToPrint.map(s => {
        // Try orderSystemId first, then fallback to orderId
        // Note: orderId in legacy data may contain systemId (ORDER000004) or business ID (DH000004)
        let o = allOrders.find(x => x.systemId === s.orderSystemId);
        if (!o && s.orderId) {
          // Try matching as systemId first (legacy data stores systemId in orderId)
          o = allOrders.find(x => (x.systemId as string) === (s.orderId as string));
          // Then try as business ID
          if (!o) {
            o = allOrders.find(x => x.id === s.orderId);
          }
        }
        const c = o ? allCustomers.find(x => x.systemId === o.customerSystemId) : null;
        const br = options.branchSystemId ? branches.find(b => b.systemId === options.branchSystemId) : null;
        const st = br ? createStoreSettings(br) : createStoreSettings(storeInfo);
        const d = convertShipmentToDeliveryForPrint(s, o!, { customer: c });
        return { data: mapDeliveryToPrintData(d, st), lineItems: mapDeliveryLineItems(d.items), paperSize: options.paperSize };
      }).filter(i => i.data);
      printMultiple('delivery', items);
      toast.success(`Đang in ${items.length} phiếu giao hàng`);
    } else {
      const br = options.branchSystemId ? branches.find(b => b.systemId === options.branchSystemId) : null;
      const st = br ? createStoreSettings(br) : createStoreSettings(storeInfo);
      const h = convertShipmentsToHandoverForPrint(itemsToPrint);
      print('handover', { data: mapHandoverToPrintData(h, st), lineItems: mapHandoverLineItems(h.orders) });
      toast.success('Đang in phiếu bàn giao');
    }
    setItemsToPrint([]);
    setPrintDialogOpen(false);
  }, [itemsToPrint, printType, allOrders, allCustomers, branches, storeInfo, print, printMultiple]);

  const bulkActions: BulkAction<ShipmentView>[] = React.useMemo(() => [
    { label: 'In phiếu giao hàng', icon: Printer, onSelect: handleBulkPrintDelivery },
    { label: 'In phiếu bàn giao', icon: FileText, onSelect: handleBulkPrintHandover },
  ], [handleBulkPrintDelivery, handleBulkPrintHandover]);

  const columns = React.useMemo(() => getColumns(handlePrintSingleDelivery, handlePrintSingleHandover, router), [handlePrintSingleDelivery, handlePrintSingleHandover, router]);

  // Initialize column order (visibility handled by useColumnVisibility)
  const columnDefaultsInitialized = React.useRef(false);
  React.useEffect(() => {
    if (columnDefaultsInitialized.current || !columns.length) return;
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    columnDefaultsInitialized.current = true;
  }, [columns]);

  const allSelectedRows = React.useMemo(() => shipments.filter(s => rowSelection[s.systemId]), [shipments, rowSelection]);

  // Mobile infinite scroll
  React.useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      if (scrollTop + clientHeight >= scrollHeight * 0.8 && mobileLoadedCount < shipments.length) {
        setMobileLoadedCount(prev => Math.min(prev + 20, shipments.length));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, shipments.length]);

  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedSearch, branchFilter, statusFilter, partnerFilter]);

  const handleRowClick = (row: ShipmentView) => router.push('/shipments/' + row.systemId);

  const MobileShipmentCard = ({ shipment }: { shipment: ShipmentView }) => {
    const getStatusVariant = (s?: string): 'default' | 'secondary' | 'destructive' => !s ? 'secondary' : ({ 'Đã giao hàng': 'default', 'Đang giao hàng': 'secondary', 'Đang vận chuyển': 'secondary', 'Chờ lấy hàng': 'secondary', 'Chờ giao lại': 'secondary', 'Chưa gửi': 'secondary', 'Hủy vận chuyển': 'destructive', 'Trả hàng': 'destructive' } as Record<string, 'default' | 'secondary' | 'destructive'>)[s] || 'secondary';
    return (
      <Card className='hover:shadow-md transition-shadow cursor-pointer' onClick={() => handleRowClick(shipment)}>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2 flex-1 min-w-0'>
              <Avatar className='h-8 w-8 shrink-0 bg-primary/10'><AvatarFallback className='text-xs text-primary'><Truck className='h-4 w-4' /></AvatarFallback></Avatar>
              <div className='flex items-center gap-1.5 min-w-0 flex-1'>
                <CardTitle className='font-semibold text-sm truncate'>{shipment.trackingCode || shipment.id}</CardTitle>
                <span className='text-xs text-muted-foreground'>•</span>
                <span className='text-xs text-muted-foreground font-mono'>{shipment.orderId}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchButton variant='ghost' size='sm' className='h-8 w-8 p-0 shrink-0' onClick={e => e.stopPropagation()}>
                  <MoreHorizontal className='h-4 w-4' />
                </TouchButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={e => { e.stopPropagation(); router.push('/orders/' + (shipment.orderSystemId || shipment.orderId)); }}>Xem đơn hàng</DropdownMenuItem>
                <DropdownMenuItem onClick={e => { e.stopPropagation(); handlePrintSingleDelivery(shipment.systemId); }}>In Phiếu Giao Hàng</DropdownMenuItem>
                <DropdownMenuItem onClick={e => { e.stopPropagation(); handlePrintSingleHandover(shipment.systemId); }}>In Phiếu Bàn Giao</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='text-xs text-muted-foreground mb-3 flex items-center'>
            <User className='h-3 w-3 mr-1.5 shrink-0' />
            <span className='truncate'>{shipment.customerName}</span>
          </div>
          <div className='border-t mb-3' />
          <div className='space-y-2'>
            <div className='flex items-center text-xs text-muted-foreground'>
              <Calendar className='h-3 w-3 mr-1.5 shrink-0' />
              <span>{formatDate(shipment.createdAt)}</span>
            </div>
            {shipment.customerAddress && (
              <div className='flex items-center text-xs text-muted-foreground'>
                <MapPin className='h-3 w-3 mr-1.5 shrink-0' />
                <span className='truncate'>{shipment.customerAddress}</span>
              </div>
            )}
            {shipment.carrier && (
              <div className='flex items-center text-xs text-muted-foreground'>
                <Package className='h-3 w-3 mr-1.5 shrink-0' />
                <span>{shipment.carrier}</span>
              </div>
            )}
            <div className='flex items-center justify-between text-xs pt-1'>
              <span className='text-muted-foreground'>{shipment.branchName}</span>
              <Badge variant={getStatusVariant(shipment.deliveryStatus)} className='text-xs'>{shipment.deliveryStatus || 'Chưa xác định'}</Badge>
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
            <><Button variant="outline" size="sm" onClick={() => router.push('/settings/shipping')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button><Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
              <Download className="h-4 w-4 mr-2" />Xuất Excel
            </Button></>
          }
          rightActions={
            <DataTableColumnCustomizer
              columns={columns}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns}
              setPinnedColumns={setPinnedColumns}
            />
          }
        />
      )}
      <PageFilters searchValue={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder='Tìm kiếm vận đơn (MVĐ, tên người nhận, SĐT, đối tác, mã phiếu, mã đơn)...'>
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className='w-full sm:w-45'>
            <SelectValue placeholder='Tất cả chi nhánh' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả chi nhánh</SelectItem>
            {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={partnerFilter} onValueChange={setPartnerFilter}>
          <SelectTrigger className='w-full sm:w-45'>
            <SelectValue placeholder='Tất cả đối tác' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả đối tác</SelectItem>
            {shippingPartners.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-full sm:w-45'>
            <SelectValue placeholder='Tất cả trạng thái' />
          </SelectTrigger>
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

      {/* Stats Cards - instant display from Server Component */}
      <StatsCardGrid columns={4} className="my-4">
        <StatsCard title="Chờ lấy hàng" value={stats?.pending ?? 0} icon={Clock} variant="warning" />
        <StatsCard title="Đang vận chuyển" value={stats?.inTransit ?? 0} icon={Truck} variant="info" />
        <StatsCard title="Đã giao" value={stats?.delivered ?? 0} icon={CheckCircle2} variant="success" />
        <StatsCard title="Hoàn trả" value={stats?.returned ?? 0} icon={RotateCcw} variant="danger" />
      </StatsCardGrid>

      {isMobile ? (
        <div className='space-y-3 pb-4'>
          {shipments.length === 0 ? (
            <Card>
              <CardContent className='py-12 text-center'>
                <p className='text-muted-foreground'>Không tìm thấy vận đơn</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {shipments.slice(0, mobileLoadedCount).map(s => <MobileShipmentCard key={s.systemId} shipment={s} />)}
              {mobileLoadedCount < shipments.length && (
                <Card className='border-dashed'>
                  <CardContent className='py-6 text-center'>
                    <div className='flex items-center justify-center gap-2'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                      <span className='text-sm text-muted-foreground'>Đang tải thêm...</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              {mobileLoadedCount >= shipments.length && shipments.length > 20 && (
                <Card className='border-dashed'>
                  <CardContent className='py-4 text-center'>
                    <span className='text-sm text-muted-foreground'>Đã hiển thị tất cả {shipments.length} vận đơn</span>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      ) : (
        <div className='w-full py-4'>
          <ResponsiveDataTable
            columns={columns}
            data={shipments}
            renderMobileCard={s => <MobileShipmentCard shipment={s} />}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={totalRows}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            allSelectedRows={allSelectedRows}
            bulkActions={bulkActions}
            expanded={expanded}
            setExpanded={setExpanded}
            sorting={sorting}
            setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
            onRowClick={handleRowClick}
            isLoading={isLoadingShipments}
          />
        </div>
      )}

      <SimplePrintOptionsDialog
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        onConfirm={handlePrintConfirm}
        selectedCount={itemsToPrint.length}
        title={printType === 'delivery' ? 'In phiếu giao hàng' : 'In phiếu bàn giao'}
      />
      <ShipmentExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        allData={allShipments}
        filteredData={shipments}
        currentPageData={shipments}
        selectedData={allSelectedRows}
        currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }}
      />
    </div>
  );
}
