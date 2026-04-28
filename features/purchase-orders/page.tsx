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
import { cn } from '@/lib/utils';
import { usePageHeader } from '@/contexts/page-header-context';
import { useAuth } from '@/contexts/auth-context';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import { asSystemId } from '@/lib/id-types';

// UI components
import { Button } from '@/components/ui/button';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { PageToolbar } from '@/components/layout/page-toolbar';
import { PageFilters } from '@/components/layout/page-filters';
import { SimplePrintOptionsDialog } from '@/components/shared/simple-print-options-dialog';

// Feature-specific
import { usePurchaseOrders } from './hooks/use-purchase-orders';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useMeiliSupplierSearch } from '@/hooks/use-meilisearch';
import { useDebounce } from '@/hooks/use-debounce';
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
import { useColumnLayout } from '@/hooks/use-column-visibility';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { FAB } from '@/components/mobile/fab';

// Dynamic imports for heavy dialogs
const PurchaseOrderImportDialog = dynamic(
  () => import('./components/purchase-order-import-export-dialogs').then(mod => ({ default: mod.PurchaseOrderImportDialog })),
  { ssr: false }
);
const PurchaseOrderExportDialog = dynamic(
  () => import('./components/purchase-order-import-export-dialogs').then(mod => ({ default: mod.PurchaseOrderExportDialog })),
  { ssr: false }
);
const SapoPurchaseOrderImportDialog = dynamic(
  () => import('./components/purchase-order-import-export-dialogs').then(mod => ({ default: mod.SapoPurchaseOrderImportDialog })),
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
  const {  employee: loggedInUser, can } = useAuth();
  const canCreate = can('create_purchase_orders');
  const _canDelete = can('delete_purchase_orders');
  const _canEdit = can('edit_purchase_orders');
  const _canEditSettings = can('edit_settings');
  const { data: branches } = useAllBranches();
  const { data: supplierData } = useMeiliSupplierSearch({ query: '', limit: 100 });
  const suppliers = React.useMemo(() => supplierData?.data || [], [supplierData]);

  // Page header with add button
  usePageHeader({ 
    title: 'Đơn nhập hàng',
    actions: [
      canCreate && <Button key="add" size="sm" onClick={() => router.push('/purchase-orders/new')}>
        <Plus className="mr-2 h-4 w-4" />Thêm đơn nhập hàng
      </Button>
    ]
  });

  // Filter state management - must be called first
  const filters = usePurchaseOrdersFilters();
  const importExport = usePurchaseOrdersImportExport();
  
  // Destructure for stable references in useEffect dependencies
  const { globalFilter, setPagination, branchFilter, statusFilter, paymentStatusFilter } = filters;

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('purchase-orders');
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'branch', label: 'Chi nhánh', type: 'select' as const, options: [{ value: 'all', label: 'Tất cả' }, ...branches.map(b => ({ value: b.systemId, label: b.name }))] },
    { id: 'status', label: 'Trạng thái', type: 'select' as const, options: [
      { value: 'all', label: 'Tất cả' }, { value: 'Đặt hàng', label: 'Đặt hàng' }, { value: 'Đang giao dịch', label: 'Đang giao dịch' },
      { value: 'Hoàn thành', label: 'Hoàn thành' }, { value: 'Đã hủy', label: 'Đã hủy' }, { value: 'Kết thúc', label: 'Kết thúc' },
    ] },
    { id: 'paymentStatus', label: 'Thanh toán', type: 'select' as const, options: [
      { value: 'all', label: 'Tất cả' }, { value: 'Chưa thanh toán', label: 'Chưa thanh toán' },
      { value: 'Thanh toán một phần', label: 'Thanh toán một phần' }, { value: 'Đã thanh toán', label: 'Đã thanh toán' },
    ] },
    { id: 'supplier', label: 'Nhà cung cấp', type: 'select' as const, options: [{ value: 'all', label: 'Tất cả' }, ...suppliers.map(s => ({ value: s.systemId, label: s.name }))] },
    { id: 'dateRange', label: 'Ngày đặt hàng', type: 'date-range' as const },
  ], [branches, suppliers]);
  const panelValues = React.useMemo(() => ({
    branch: branchFilter !== 'all' ? branchFilter : null,
    status: statusFilter !== 'all' ? statusFilter : null,
    paymentStatus: paymentStatusFilter !== 'all' ? paymentStatusFilter : null,
    supplier: filters.supplierFilter && filters.supplierFilter !== 'all' ? filters.supplierFilter : null,
    dateRange: filters.dateRange ?? null,
  }), [branchFilter, statusFilter, paymentStatusFilter, filters.supplierFilter, filters.dateRange]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    filters.setBranchFilter((v.branch as string) || 'all');
    filters.setStatusFilter((v.status as string) || 'all');
    filters.setPaymentStatusFilter((v.paymentStatus as string) || 'all');
    filters.setSupplierFilter((v.supplier as string) || 'all');
    filters.setDateRange((v.dateRange as { from?: string; to?: string } | null) ?? null);
  }, [filters]);

  // Debounced search
  const debouncedSearch = useDebounce(globalFilter, 300);

  // Reset page when filters change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch, branchFilter, statusFilter, paymentStatusFilter, filters.supplierFilter, filters.dateRange, setPagination]);

  // Server-side paginated query
  const { data: queryData, isLoading: isLoadingPOs, isFetching } = usePurchaseOrders({
    page: filters.pagination.pageIndex + 1,
    limit: filters.pagination.pageSize,
    search: debouncedSearch || undefined,
    branchId: filters.branchFilter !== 'all' ? filters.branchFilter : undefined,
    status: filters.statusFilter !== 'all' ? filters.statusFilter : undefined,
    paymentStatus: filters.paymentStatusFilter !== 'all' ? filters.paymentStatusFilter : undefined,
    supplierId: filters.supplierFilter && filters.supplierFilter !== 'all' ? filters.supplierFilter : undefined,
    startDate: (filters.dateRange as { from?: string; to?: string } | null)?.from || undefined,
    endDate: (filters.dateRange as { from?: string; to?: string } | null)?.to || undefined,
    sortBy: filters.sorting.id,
    sortOrder: filters.sorting.desc ? 'desc' : 'asc',
  });
  
  const queryDataItems = queryData?.data;
  const purchaseOrders = React.useMemo(() => queryDataItems ?? [], [queryDataItems]);
  const totalRows = queryData?.pagination?.total ?? 0;
  const pageCount = queryData?.pagination?.totalPages ?? 1;

  // ⚡ OPTIMIZED: All handlers use paginated data instead of loading all data
  const handlers = usePurchaseOrdersPageHandlers({ paginatedData: purchaseOrders });
  
  // Column visibility (persisted to DB)
  const defaultColumnVisibility = React.useMemo(() => {
    const defaultVisible = ['id', 'supplierName', 'branchName', 'buyer', 'orderDate', 'deliveryDate', 'shippingFee', 'tax', 'discount', 'notes', 'grandTotal', 'status', 'deliveryStatus', 'paymentStatus', 'returnStatus', 'refundStatus'];
    const cols = getColumns(() => {}, () => {}, () => {}, () => {}, []);
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = c.id === 'select' || c.id === 'actions' ? true : defaultVisible.includes(c.id); });
    return initial;
  }, []);
  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('purchase-orders', { visibility: defaultColumnVisibility, pinned: ['select', 'actions'] });

  // Columns definition
  const columns = React.useMemo(
    () => getColumns(handlers.handleCancelRequest, handlers.handlePrint, handlers.handlePayment, handlers.handleReceiveGoods, branches),
    [handlers.handleCancelRequest, handlers.handlePrint, handlers.handlePayment, handlers.handleReceiveGoods, branches]
  );

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
  const [isSapoImportOpen, setIsSapoImportOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      <POStatisticsCards initialStats={initialItemStats} />

      {!isMobile && (
        <PageToolbar leftActions={
          _canEditSettings ? <Button variant="outline" size="sm" onClick={() => router.push('/settings/inventory')}>
            <Settings className="h-4 w-4 mr-2" />Cài đặt
          </Button> : undefined
        } rightActions={
          <>
            <Button variant="outline" size="sm" onClick={() => importExport.setShowImportDialog(true)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsSapoImportOpen(true)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />Import Sapo
            </Button>
            <Button variant="outline" size="sm" onClick={() => importExport.setShowExportDialog(true)}>
              <Download className="mr-2 h-4 w-4" />Xuất Excel
            </Button>
            <DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />
          </>
        } />
      )}

      <PageFilters searchValue={filters.globalFilter} onSearchChange={filters.setGlobalFilter} searchPlaceholder="Tìm kiếm đơn nhập hàng...">
        <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
      </PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />

      <div className={cn(isFetching && !isLoadingPOs && 'opacity-70 transition-opacity')}>
      <ResponsiveDataTable
        columns={columns}
        data={purchaseOrders}
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
        mobileInfiniteScroll
        isLoading={isLoadingPOs}
      />
      </div>

      {/* Dialogs */}
      <POCancelDialog state={handlers.cancelDialogState} onOpenChange={(open) => !open && handlers.closeCancelDialog()} onConfirm={handlers.handleConfirmCancel} onClose={handlers.closeCancelDialog} />
      <POBulkPayDialog open={handlers.isBulkPayAlertOpen} onOpenChange={handlers.setIsBulkPayAlertOpen} numSelected={handlers.numSelected} onConfirm={handlers.confirmBulkPay} />
      <POReceiveDialog state={handlers.receiveDialogState} branches={branches} pendingQueueLength={0} isSubmitting={handlers.isSubmittingReceive} hasValidQuantity={hasValidReceiveQty} onClose={handlers.closeReceiveDialog} onFieldChange={handlers.handleReceiveFieldChange} onBranchChange={handlers.handleReceiveBranchChange} onQuantityChange={handlers.handleReceiveQuantityChange} onSubmit={handlers.handleSubmitReceiveDialog} />
      <SimplePrintOptionsDialog open={handlers.isPrintDialogOpen} onOpenChange={handlers.closePrintDialog} onConfirm={handlers.handlePrintConfirm} selectedCount={handlers.pendingPrintPOs.length} title="In đơn nhập hàng" />
      <PurchaseOrderImportDialog open={importExport.showImportDialog} onOpenChange={importExport.setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={purchaseOrders} onImport={handleImport} currentUser={{ name: loggedInUser?.fullName || 'Hệ thống', systemId: loggedInUser?.systemId || asSystemId('SYSTEM') }} />
      <PurchaseOrderExportDialog open={importExport.showExportDialog} onOpenChange={importExport.setShowExportDialog} allData={purchaseOrders} filteredData={purchaseOrders} currentPageData={purchaseOrders} selectedData={handlers.selectedOrders} currentUser={{ name: loggedInUser?.fullName || 'Hệ thống', systemId: loggedInUser?.systemId || asSystemId('SYSTEM') }} />
      <SapoPurchaseOrderImportDialog open={isSapoImportOpen} onOpenChange={setIsSapoImportOpen} existingData={purchaseOrders} onImport={handleImport} currentUser={{ name: loggedInUser?.fullName || 'Hệ thống', systemId: loggedInUser?.systemId || asSystemId('SYSTEM') }} />
      {isMobile && canCreate && <FAB onClick={() => router.push('/purchase-orders/new')} />}
    </div>
  );
}
