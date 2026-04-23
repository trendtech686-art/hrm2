'use client'
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/date-utils';
import { usePageHeader } from '../../contexts/page-header-context';
import { useShipments, useShipmentStats, type ShipmentStats } from './hooks/use-shipments';
import { useAllShipments, useShipmentCarriers } from './hooks/use-all-shipments';
import { fetchOrder } from '../orders/api/orders-api';
import { useAllCustomers } from '../customers/hooks/use-all-customers';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { fetchPrintData } from '@/lib/lazy-print-data';
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
import { StatsBar } from '../../components/shared/stats-bar';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Truck, MoreHorizontal, Printer, FileText, Download, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDeliveryStatusLabel } from '../../lib/constants/order-status-labels';
import { TouchButton } from '../../components/mobile/touch-button';
import { MobileCard, MobileCardBody, MobileCardHeader } from '../../components/mobile/mobile-card';
import { useMediaQuery } from '../../lib/use-media-query';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/auth-context';
import { useColumnVisibility, useColumnOrder, usePinnedColumns } from '../../hooks/use-column-visibility';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '../../components/shared/advanced-filter-panel';
import { useFilterPresets } from '../../hooks/use-filter-presets';
import { ListPageShell } from '@/components/layout/page-section';

export interface ShipmentsPageProps {
  initialStats?: ShipmentStats;
}

export function ShipmentsPage({ initialStats }: ShipmentsPageProps = {}) {
  const router = useRouter();
  const { print, printMultiple } = usePrint();
  const isMobile = !useMediaQuery('(min-width: 768px)');
  const {  employee: currentUser, can } = useAuth();
  const canCreate = can('create_shipments');
  const canEdit = can('edit_shipments');
  const canEditSettings = can('edit_settings');
  
  // Stats from Server Component (instant, no loading)
  const { data: stats } = useShipmentStats(initialStats);

  // Print state (declared early so isPrintMode can reference them)
  const [printTriggered, setPrintTriggered] = React.useState(false);
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<ShipmentView[]>([]);
  const [printType, setPrintType] = React.useState<'delivery' | 'handover'>('delivery');

  // Data sources for print (lazy-loaded: only fetch when print is needed)
  const isPrintMode = printTriggered || printDialogOpen || itemsToPrint.length > 0;
  const { data: allCustomers } = useAllCustomers({ enabled: isPrintMode });
  const { data: branches } = useAllBranches();
  // ⚡ OPTIMIZED: storeInfo lazy loaded in print handlers

  // Server-side pagination state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [partnerFilter, setPartnerFilter] = React.useState('all');
  const [reconciliationFilter, setReconciliationFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState<{ from?: string; to?: string } | null>(null);
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
  const [columnOrder, setColumnOrder] = useColumnOrder('shipments');
  const [pinnedColumns, setPinnedColumns] = usePinnedColumns('shipments');
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
  }, [branchFilter, statusFilter, partnerFilter, reconciliationFilter, dateRange]);

  // Server-side query
  const { data: shipmentsData, isLoading: isLoadingShipments, isFetching } = useShipments({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    branchId: branchFilter !== 'all' ? branchFilter : undefined,
    deliveryStatus: statusFilter !== 'all' ? statusFilter : undefined,
    carrier: partnerFilter !== 'all' ? partnerFilter : undefined,
    reconciliationStatus: reconciliationFilter !== 'all' ? reconciliationFilter : undefined,
    fromDate: dateRange?.from || undefined,
    toDate: dateRange?.to || undefined,
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

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('shipments');
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'branch', label: 'Chi nhánh', type: 'select' as const, options: [{ value: 'all', label: 'Tất cả' }, ...branches.map(b => ({ value: b.systemId, label: b.name }))] },
    { id: 'partner', label: 'Đối tác vận chuyển', type: 'select' as const, options: [{ value: 'all', label: 'Tất cả' }, ...shippingPartners.map(p => ({ value: p, label: p }))] },
    { id: 'status', label: 'Trạng thái giao hàng', type: 'select' as const, options: [
      { value: 'all', label: 'Tất cả' }, { value: 'Chờ lấy hàng', label: 'Chờ lấy hàng' }, { value: 'Đang giao hàng', label: 'Đang giao hàng' },
      { value: 'Đang vận chuyển', label: 'Đang vận chuyển' }, { value: 'Đã giao hàng', label: 'Đã giao hàng' },
      { value: 'Chờ giao lại', label: 'Chờ giao lại' }, { value: 'Trả hàng', label: 'Trả hàng' },
      { value: 'Hủy vận chuyển', label: 'Hủy vận chuyển' },
    ] },
    { id: 'reconciliation', label: 'Đối soát', type: 'select' as const, options: [
      { value: 'all', label: 'Tất cả' }, { value: 'Chưa đối soát', label: 'Chưa đối soát' },
      { value: 'Đã đối soát', label: 'Đã đối soát' }, { value: 'Đang đối soát', label: 'Đang đối soát' },
    ] },
    { id: 'dateRange', label: 'Ngày tạo', type: 'date-range' as const },
  ], [branches, shippingPartners]);
  const panelValues = React.useMemo(() => ({
    branch: branchFilter !== 'all' ? branchFilter : null,
    partner: partnerFilter !== 'all' ? partnerFilter : null,
    status: statusFilter !== 'all' ? statusFilter : null,
    reconciliation: reconciliationFilter !== 'all' ? reconciliationFilter : null,
    dateRange: dateRange,
  }), [branchFilter, partnerFilter, statusFilter, reconciliationFilter, dateRange]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setBranchFilter((v.branch as string) || 'all');
    setPartnerFilter((v.partner as string) || 'all');
    setStatusFilter((v.status as string) || 'all');
    setReconciliationFilter((v.reconciliation as string) || 'all');
    setDateRange((v.dateRange as { from?: string; to?: string } | null) ?? null);
  }, []);

  const pageHeaderConfig = React.useMemo(() => ({
    title: 'Quản lý vận đơn',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Vận chuyển', href: '/shipments', isCurrent: true },
    ],
    showBackButton: false,
  }), []);
  usePageHeader(pageHeaderConfig);

  // Helper: fetch order for a shipment (try orderSystemId, fallback orderId)
  const fetchOrderForShipment = React.useCallback(async (s: ShipmentView) => {
    try {
      return await fetchOrder(s.orderSystemId);
    } catch {
      if (s.orderId) {
        try { return await fetchOrder(s.orderId); } catch { /* not found */ }
      }
      return null;
    }
  }, []);

  // Print handlers — trigger lazy-load on first use
  const handlePrintDelivery = React.useCallback(async (ids: string[]) => {
    setPrintTriggered(true);
    const { storeInfo } = await fetchPrintData();
    const st = createStoreSettings(storeInfo);
    const selected = shipments.filter(x => ids.includes(x.systemId));
    const results = await Promise.all(selected.map(async s => {
      const o = await fetchOrderForShipment(s);
      if (!o) return null;
      const c = allCustomers.find(x => x.systemId === o.customerSystemId);
      const d = convertShipmentToDeliveryForPrint(s, o, { customer: c });
      return { data: mapDeliveryToPrintData(d, st), lineItems: mapDeliveryLineItems(d.items) };
    }));
    results.forEach(item => { if (item) print('delivery', item); });
  }, [shipments, allCustomers, print, fetchOrderForShipment]);

  const handlePrintHandover = React.useCallback(async (ids: string[]) => {
    const sel = shipments.filter(s => ids.includes(s.systemId));
    if (!sel.length) return;
    const { storeInfo } = await fetchPrintData();
    const st = createStoreSettings(storeInfo);
    const h = convertShipmentsToHandoverForPrint(sel);
    print('handover', { data: mapHandoverToPrintData(h, st), lineItems: mapHandoverLineItems(h.orders) });
  }, [shipments, print]);

  const handlePrintSingleDelivery = React.useCallback((id: string) => handlePrintDelivery([id]), [handlePrintDelivery]);
  const handlePrintSingleHandover = React.useCallback((id: string) => handlePrintHandover([id]), [handlePrintHandover]);
  const handleBulkPrintDelivery = React.useCallback((rows: ShipmentView[]) => { setItemsToPrint(rows); setPrintType('delivery'); setPrintDialogOpen(true); }, []);
  const handleBulkPrintHandover = React.useCallback((rows: ShipmentView[]) => { setItemsToPrint(rows); setPrintType('handover'); setPrintDialogOpen(true); }, []);

  const handlePrintConfirm = React.useCallback(async (options: SimplePrintOptionsResult) => {
    if (!itemsToPrint.length) return;
    const { storeInfo } = await fetchPrintData();
    if (printType === 'delivery') {
      const results = await Promise.all(itemsToPrint.map(async s => {
        const o = await fetchOrderForShipment(s);
        if (!o) return null;
        const c = allCustomers.find(x => x.systemId === o.customerSystemId);
        const br = options.branchSystemId ? branches.find(b => b.systemId === options.branchSystemId) : null;
        const st = br ? createStoreSettings(br) : createStoreSettings(storeInfo);
        const d = convertShipmentToDeliveryForPrint(s, o, { customer: c });
        return { data: mapDeliveryToPrintData(d, st), lineItems: mapDeliveryLineItems(d.items), paperSize: options.paperSize };
      }));
      const items = results.filter(Boolean) as Array<{ data: ReturnType<typeof mapDeliveryToPrintData>; lineItems: ReturnType<typeof mapDeliveryLineItems>; paperSize: string | undefined }>;
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
  }, [itemsToPrint, printType, allCustomers, branches, print, printMultiple, fetchOrderForShipment]);

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

  const handleRowClick = (row: ShipmentView) => router.push('/shipments/' + row.systemId);

  const MobileShipmentCard = ({ shipment }: { shipment: ShipmentView }) => {
    const getStatusVariant = (s?: string): 'default' | 'secondary' | 'destructive' => {
      if (!s) return 'secondary';
      const label = getDeliveryStatusLabel(s);
      return ({ 'Đã giao hàng': 'default', 'Đang giao hàng': 'secondary', 'Đang vận chuyển': 'secondary', 'Chờ lấy hàng': 'secondary', 'Chờ giao lại': 'secondary', 'Chưa gửi': 'secondary', 'Hủy vận chuyển': 'destructive', 'Trả hàng': 'destructive', 'Đã hoàn hàng': 'destructive', 'Đã hủy': 'destructive' } as Record<string, 'default' | 'secondary' | 'destructive'>)[label] || 'secondary';
    };
    const statusLabel = shipment.deliveryStatus ? getDeliveryStatusLabel(shipment.deliveryStatus) : 'Chưa xác định';
    return (
      <MobileCard onClick={() => handleRowClick(shipment)}>
        <MobileCardHeader className='items-start justify-between'>
          <div className='flex items-start gap-2 min-w-0 flex-1'>
            <Avatar className='h-10 w-10 shrink-0 bg-primary/10'><AvatarFallback className='text-xs text-primary'><Truck className='h-4 w-4' /></AvatarFallback></Avatar>
            <div className='min-w-0 flex-1'>
              <div className='text-xs uppercase tracking-wide text-muted-foreground'>Vận đơn</div>
              <div className='mt-0.5 text-sm font-semibold text-foreground truncate font-mono'>{shipment.trackingCode || shipment.id}</div>
              <div className='text-xs text-muted-foreground truncate font-mono'>ĐH: {shipment.orderId}</div>
            </div>
          </div>
          <div className='flex items-start gap-1 shrink-0'>
            <Badge variant={getStatusVariant(shipment.deliveryStatus)} className='text-xs'>{statusLabel}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchButton variant='ghost' size='sm' className='h-8 w-8 p-0 -mr-2 -mt-1' onClick={e => e.stopPropagation()}>
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
        </MobileCardHeader>
        <MobileCardBody>
          <dl className='grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm'>
            <div className='col-span-2'>
              <dt className='text-xs text-muted-foreground'>Khách hàng</dt>
              <dd className='font-medium truncate'>{shipment.customerName}</dd>
            </div>
            <div>
              <dt className='text-xs text-muted-foreground'>Ngày tạo</dt>
              <dd className='font-medium'>{formatDate(shipment.createdAt)}</dd>
            </div>
            {shipment.carrier && (
              <div>
                <dt className='text-xs text-muted-foreground'>Đơn vị vận chuyển</dt>
                <dd className='font-medium truncate'>{shipment.carrier}</dd>
              </div>
            )}
            {shipment.branchName && (
              <div>
                <dt className='text-xs text-muted-foreground'>Chi nhánh</dt>
                <dd className='font-medium truncate'>{shipment.branchName}</dd>
              </div>
            )}
            {shipment.customerAddress && (
              <div className='col-span-2'>
                <dt className='text-xs text-muted-foreground'>Địa chỉ giao</dt>
                <dd className='font-medium line-clamp-2'>{shipment.customerAddress}</dd>
              </div>
            )}
          </dl>
        </MobileCardBody>
      </MobileCard>
    );
  };

  return (
    <ListPageShell>
      {/* Stats Bar - instant display from Server Component */}
      <StatsBar
        className="mb-4"
        items={[
          { key: 'pending', label: 'Chờ lấy hàng', value: stats?.pending ?? 0 },
          { key: 'inTransit', label: 'Đang vận chuyển', value: stats?.inTransit ?? 0 },
          { key: 'delivered', label: 'Đã giao', value: stats?.delivered ?? 0 },
          { key: 'returned', label: 'Hoàn trả', value: stats?.returned ?? 0 },
        ]}
      />

      {!isMobile && (
        <PageToolbar
          leftActions={
            <>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/shipping')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}<Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
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
        <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
      </PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />

      <div className={cn('w-full py-4', isFetching && !isLoadingShipments && 'opacity-70 transition-opacity')}>
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
          mobileInfiniteScroll
        />
      </div>

      {printDialogOpen && (
        <SimplePrintOptionsDialog
          open={printDialogOpen}
          onOpenChange={setPrintDialogOpen}
          onConfirm={handlePrintConfirm}
          selectedCount={itemsToPrint.length}
          title={printType === 'delivery' ? 'In phiếu giao hàng' : 'In phiếu bàn giao'}
        />
      )}
      {exportDialogOpen && (
        <ShipmentExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          allData={allShipments}
          filteredData={shipments}
          currentPageData={shipments}
          selectedData={allSelectedRows}
          currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }}
        />
      )}
    </ListPageShell>
  );
}
