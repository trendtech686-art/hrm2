'use client';
/**
 * Purchase Orders List Page - Thin Page Pattern
 * Target: < 300 lines
 * Logic extracted to: hooks/use-po-page-handlers.ts
 * Components: components/po-statistics.tsx, components/po-dialogs.tsx
 */
import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Download, FileSpreadsheet, Plus, Settings } from 'lucide-react';
import { usePageHeader } from '@/contexts/page-header-context';
import { useAuth } from '@/contexts/auth-context';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import { asSystemId } from '@/lib/id-types';

// UI components
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { PageToolbar } from '@/components/layout/page-toolbar';
import { PageFilters } from '@/components/layout/page-filters';
import { SimplePrintOptionsDialog } from '@/components/shared/simple-print-options-dialog';

// Feature-specific
import { usePurchaseOrders } from './hooks/use-purchase-orders';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { getColumns } from './columns';
import { PurchaseOrderCard } from './purchase-order-card';
import { POStatisticsCards } from './components/po-statistics';
import type { POItemStats } from '@/lib/data/purchase-orders';
import { POCancelDialog, POBulkPayDialog, POReceiveDialog } from './components/po-dialogs';

// Hooks - all handlers extracted
import {
  usePurchaseOrdersPageHandlers,
  usePurchaseOrdersFilters,
  usePurchaseOrdersImportExport,
} from './hooks/use-po-page-handlers';
import { usePurchaseOrderImportHandler } from './hooks/use-po-import-handler';
import { useColumnVisibility } from '@/hooks/use-column-visibility';

// Dynamic imports for heavy dialogs
const PurchaseOrderImportDialog = dynamic(
  () => import('./components/purchase-order-import-export-dialogs').then(mod => ({ default: mod.PurchaseOrderImportDialog })),
  { ssr: false }
);
const PurchaseOrderExportDialog = dynamic(
  () => import('./components/purchase-order-import-export-dialogs').then(mod => ({ default: mod.PurchaseOrderExportDialog })),
  { ssr: false }
);

// Props from Server Component
export interface PurchaseOrdersPageProps {
  initialStats?: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalAmount: number;
  };
  initialItemStats?: POItemStats;
}

export default function PurchaseOrdersPage({ initialStats: _initialStats, initialItemStats }: PurchaseOrdersPageProps = {}) {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const { employee: loggedInUser } = useAuth();
  const { data: branches } = useAllBranches();

  // Page header with add button
  usePageHeader({ 
    title: 'Đơn nhập hàng',
    actions: [
      <Button key="add" size="sm" onClick={() => router.push('/purchase-orders/new')}>
        <Plus className="mr-2 h-4 w-4" />Thêm đơn nhập hàng
      </Button>
    ]
  });

  // All handlers from extracted hook
  const handlers = usePurchaseOrdersPageHandlers();
  const filters = usePurchaseOrdersFilters();
  const importExport = usePurchaseOrdersImportExport();
  
  // Destructure for stable references in useEffect dependencies
  const { globalFilter, setPagination, branchFilter, statusFilter, paymentStatusFilter } = filters;
  
  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilter);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter, setPagination]);
  
  // Reset page when filters change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [branchFilter, statusFilter, paymentStatusFilter, setPagination]);
  
  // Server-side paginated query
  const { data: queryData, isLoading: isLoadingPOs } = usePurchaseOrders({
    page: filters.pagination.pageIndex + 1,
    limit: filters.pagination.pageSize,
    search: debouncedSearch || undefined,
    branchId: filters.branchFilter !== 'all' ? filters.branchFilter : undefined,
    status: filters.statusFilter !== 'all' ? filters.statusFilter : undefined,
    paymentStatus: filters.paymentStatusFilter !== 'all' ? filters.paymentStatusFilter : undefined,
    sortBy: filters.sorting.id,
    sortOrder: filters.sorting.desc ? 'desc' : 'asc',
  });
  
  const queryDataItems = queryData?.data;
  const purchaseOrders = React.useMemo(() => queryDataItems ?? [], [queryDataItems]);
  const totalRows = queryData?.pagination?.total ?? 0;
  const pageCount = queryData?.pagination?.totalPages ?? 1;
  
  // Column visibility (persisted to DB)
  const defaultColumnVisibility = React.useMemo(() => {
    const defaultVisible = ['id', 'supplierName', 'branchName', 'buyer', 'orderDate', 'deliveryDate', 'shippingFee', 'tax', 'discount', 'notes', 'creatorName', 'grandTotal', 'status', 'deliveryStatus', 'paymentStatus', 'returnStatus', 'refundStatus'];
    const cols = getColumns(() => {}, () => {}, () => {}, () => {}, []);
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = c.id === 'select' || c.id === 'actions' ? true : defaultVisible.includes(c.id); });
    return initial;
  }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('purchase-orders', defaultColumnVisibility);
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  // Columns definition
  const columns = React.useMemo(
    () => getColumns(handlers.handleCancelRequest, handlers.handlePrint, handlers.handlePayment, handlers.handleReceiveGoods, branches),
    [handlers.handleCancelRequest, handlers.handlePrint, handlers.handlePayment, handlers.handleReceiveGoods, branches]
  );

  // Initialize column order once
  React.useEffect(() => {
    if (columns.length > 0) {
      setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Server-side: data already filtered/sorted by API
  const displayData = isMobile ? purchaseOrders.slice(0, filters.mobileLoadedCount) : purchaseOrders;

  // Mobile infinite scroll
  React.useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const scrollPercent = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
      if (scrollPercent > 80 && filters.mobileLoadedCount < purchaseOrders.length) {
        filters.setMobileLoadedCount(prev => Math.min(prev + 20, purchaseOrders.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, filters.mobileLoadedCount, purchaseOrders.length, filters]);

  // Bulk actions
  const bulkActions = [
    { label: 'In đơn nhập hàng', onSelect: handlers.handleBulkPrint },
    { label: 'Thanh toán', onSelect: () => handlers.setIsBulkPayAlertOpen(true) },
    { label: 'Nhập hàng', onSelect: handlers.handleBulkReceive },
    { label: 'Hủy đơn', onSelect: handlers.handleBulkCancel },
  ];

  const handleRowClick = (row: typeof purchaseOrders[0]) => router.push(`/purchase-orders/${row.systemId}`);
  const hasValidReceiveQty = handlers.receiveDialogState.items.some(i => i.receiveQuantity > 0);

  // Import handler - using hook for DB persistence
  const handleImport = usePurchaseOrderImportHandler({ authEmployeeSystemId: loggedInUser?.systemId });

  return (
    <div className="space-y-4">
      <POStatisticsCards initialStats={initialItemStats} />

      {!isMobile && (
        <PageToolbar leftActions={
          <Button variant="outline" size="sm" onClick={() => router.push('/settings/inventory')}>
            <Settings className="h-4 w-4 mr-2" />Cài đặt
          </Button>
        } rightActions={
          <>
            <Button variant="outline" size="sm" onClick={() => importExport.setShowImportDialog(true)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file
            </Button>
            <Button variant="outline" size="sm" onClick={() => importExport.setShowExportDialog(true)}>
              <Download className="mr-2 h-4 w-4" />Xuất Excel
            </Button>
            <DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />
          </>
        } />
      )}

      <PageFilters searchValue={filters.globalFilter} onSearchChange={filters.setGlobalFilter} searchPlaceholder="Tìm kiếm đơn nhập hàng...">
        <Select value={filters.branchFilter} onValueChange={filters.setBranchFilter}>
          <SelectTrigger className="h-9 w-full sm:w-45"><SelectValue placeholder="Chi nhánh" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả chi nhánh</SelectItem>
            {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.statusFilter} onValueChange={filters.setStatusFilter}>
          <SelectTrigger className="h-9 w-full sm:w-45"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="Đặt hàng">Đặt hàng</SelectItem>
            <SelectItem value="Đang giao dịch">Đang giao dịch</SelectItem>
            <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
            <SelectItem value="Đã hủy">Đã hủy</SelectItem>
            <SelectItem value="Kết thúc">Kết thúc</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.paymentStatusFilter} onValueChange={filters.setPaymentStatusFilter}>
          <SelectTrigger className="h-9 w-full sm:w-45"><SelectValue placeholder="Thanh toán" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
            <SelectItem value="Thanh toán một phần">Thanh toán một phần</SelectItem>
            <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
          </SelectContent>
        </Select>
      </PageFilters>

      <ResponsiveDataTable
        columns={columns}
        data={displayData}
        renderMobileCard={(po) => <PurchaseOrderCard purchaseOrder={po} onCancel={handlers.handleCancelRequest} onPrint={handlers.handlePrint} onPayment={handlers.handlePayment} onReceiveGoods={handlers.handleReceiveGoods} onClick={handleRowClick} />}
        pageCount={pageCount}
        pagination={filters.pagination}
        setPagination={filters.setPagination}
        rowCount={totalRows}
        rowSelection={handlers.rowSelection}
        setRowSelection={handlers.setRowSelection}
        sorting={filters.sorting}
        setSorting={filters.setSorting}
        onRowClick={handleRowClick}
        showBulkDeleteButton={false}
        bulkActions={bulkActions}
        allSelectedRows={handlers.selectedOrders}
        expanded={{}}
        setExpanded={() => {}}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
        isLoading={isLoadingPOs}
      />

      {isMobile && (
        <div className="py-6 text-center">
          {filters.mobileLoadedCount < purchaseOrders.length ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-body-sm">Đang tải thêm...</span>
            </div>
          ) : purchaseOrders.length > 20 ? (
            <p className="text-body-sm text-muted-foreground">Đã hiển thị tất cả {purchaseOrders.length} kết quả</p>
          ) : null}
        </div>
      )}

      {/* Dialogs */}
      <POCancelDialog state={handlers.cancelDialogState} onOpenChange={(open) => !open && handlers.closeCancelDialog()} onConfirm={handlers.handleConfirmCancel} onClose={handlers.closeCancelDialog} />
      <POBulkPayDialog open={handlers.isBulkPayAlertOpen} onOpenChange={handlers.setIsBulkPayAlertOpen} numSelected={handlers.numSelected} onConfirm={handlers.confirmBulkPay} />
      <POReceiveDialog state={handlers.receiveDialogState} branches={branches} pendingQueueLength={0} isSubmitting={handlers.isSubmittingReceive} hasValidQuantity={hasValidReceiveQty} onClose={handlers.closeReceiveDialog} onFieldChange={handlers.handleReceiveFieldChange} onBranchChange={handlers.handleReceiveBranchChange} onQuantityChange={handlers.handleReceiveQuantityChange} onSubmit={handlers.handleSubmitReceiveDialog} />
      <SimplePrintOptionsDialog open={handlers.isPrintDialogOpen} onOpenChange={handlers.closePrintDialog} onConfirm={handlers.handlePrintConfirm} selectedCount={handlers.pendingPrintPOs.length} title="In đơn nhập hàng" />
      <PurchaseOrderImportDialog open={importExport.showImportDialog} onOpenChange={importExport.setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={purchaseOrders} onImport={handleImport} currentUser={{ name: loggedInUser?.fullName || 'Hệ thống', systemId: loggedInUser?.systemId || asSystemId('SYSTEM') }} />
      <PurchaseOrderExportDialog open={importExport.showExportDialog} onOpenChange={importExport.setShowExportDialog} allData={purchaseOrders} filteredData={purchaseOrders} currentPageData={displayData} selectedData={handlers.selectedOrders} currentUser={{ name: loggedInUser?.fullName || 'Hệ thống', systemId: loggedInUser?.systemId || asSystemId('SYSTEM') }} />
    </div>
  );
}
