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
import { Download, FileSpreadsheet } from 'lucide-react';
import { usePageHeader } from '@/contexts/page-header-context';
import { useAuth } from '@/contexts/auth-context';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import { useFuseFilter } from '@/hooks/use-fuse-search';
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
import { usePurchaseOrderStore } from './store';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { getColumns } from './columns';
import { PurchaseOrderCard } from './purchase-order-card';
import { POStatisticsCards } from './components/po-statistics';
import { POCancelDialog, POBulkPayDialog, POReceiveDialog } from './components/po-dialogs';

// Hooks - all handlers extracted
import {
  usePurchaseOrdersPageHandlers,
  usePurchaseOrdersFilters,
  usePurchaseOrdersImportExport,
} from './hooks/use-po-page-handlers';

// Dynamic imports for heavy dialogs
const PurchaseOrderImportDialog = dynamic(
  () => import('./components/purchase-order-import-export-dialogs').then(mod => ({ default: mod.PurchaseOrderImportDialog })),
  { ssr: false }
);
const PurchaseOrderExportDialog = dynamic(
  () => import('./components/purchase-order-import-export-dialogs').then(mod => ({ default: mod.PurchaseOrderExportDialog })),
  { ssr: false }
);

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const { employee: loggedInUser } = useAuth();
  const { data: purchaseOrders } = usePurchaseOrderStore();
  const { data: branches } = useAllBranches();

  // Page header
  usePageHeader({ title: 'Đơn nhập hàng' });

  // All handlers from extracted hook
  const handlers = usePurchaseOrdersPageHandlers();
  const filters = usePurchaseOrdersFilters();
  const importExport = usePurchaseOrdersImportExport();

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  // Columns definition
  const columns = React.useMemo(
    () => getColumns(handlers.handleCancelRequest, handlers.handlePrint, handlers.handlePayment, handlers.handleReceiveGoods, branches),
    [handlers.handleCancelRequest, handlers.handlePrint, handlers.handlePayment, handlers.handleReceiveGoods, branches]
  );

  // Initialize column visibility
  const columnDefaultsInitialized = React.useRef(false);
  React.useEffect(() => {
    if (columnDefaultsInitialized.current || columns.length === 0) return;
    const defaultVisible = ['id', 'supplierName', 'branchName', 'buyer', 'orderDate', 'deliveryDate', 'shippingFee', 'tax', 'discount', 'notes', 'creatorName', 'grandTotal', 'status', 'deliveryStatus', 'paymentStatus', 'returnStatus', 'refundStatus'];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      initialVisibility[c.id!] = c.id === 'select' || c.id === 'actions' || defaultVisible.includes(c.id!);
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    columnDefaultsInitialized.current = true;
  }, [columns]);

  // Search & filter
  const fuseOptions = React.useMemo(() => ({ keys: ['id', 'supplierName', 'status'] }), []);
  const searchedData = useFuseFilter(purchaseOrders, filters.globalFilter, fuseOptions);

  const filteredData = React.useMemo(() => {
    let data = purchaseOrders;
    if (filters.branchFilter !== 'all') data = data.filter(po => po.branchSystemId === filters.branchFilter);
    if (filters.statusFilter !== 'all') data = data.filter(po => po.status === filters.statusFilter);
    if (filters.paymentStatusFilter !== 'all') data = data.filter(po => po.paymentStatus === filters.paymentStatusFilter);
    if (filters.globalFilter) {
      const searchIds = new Set(searchedData.map(item => item.systemId));
      data = data.filter(po => searchIds.has(po.systemId));
    }
    return data;
  }, [purchaseOrders, filters.globalFilter, searchedData, filters.branchFilter, filters.statusFilter, filters.paymentStatusFilter]);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (filters.sorting.id) {
      sorted.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[filters.sorting.id];
        const bVal = (b as Record<string, unknown>)[filters.sorting.id];
        if (filters.sorting.id === 'createdAt' || filters.sorting.id === 'orderDate') {
          const aTime = aVal ? new Date(aVal as string).getTime() : 0;
          const bTime = bVal ? new Date(bVal as string).getTime() : 0;
          return filters.sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (aVal < bVal) return filters.sorting.desc ? 1 : -1;
        if (aVal > bVal) return filters.sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, filters.sorting]);

  // Pagination
  const pageCount = Math.ceil(sortedData.length / filters.pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = filters.pagination.pageIndex * filters.pagination.pageSize;
    return sortedData.slice(start, start + filters.pagination.pageSize);
  }, [sortedData, filters.pagination]);

  // Mobile infinite scroll
  React.useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const scrollPercent = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
      if (scrollPercent > 80 && filters.mobileLoadedCount < sortedData.length) {
        filters.setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, filters.mobileLoadedCount, sortedData.length, filters]);

  const displayData = isMobile ? sortedData.slice(0, filters.mobileLoadedCount) : paginatedData;

  // Bulk actions
  const bulkActions = [
    { label: 'In đơn nhập hàng', onSelect: handlers.handleBulkPrint },
    { label: 'Thanh toán', onSelect: () => handlers.setIsBulkPayAlertOpen(true) },
    { label: 'Nhập hàng', onSelect: handlers.handleBulkReceive },
    { label: 'Hủy đơn', onSelect: handlers.handleBulkCancel },
  ];

  const handleRowClick = (row: typeof purchaseOrders[0]) => router.push(`/purchase-orders/${row.systemId}`);
  const hasValidReceiveQty = handlers.receiveDialogState.items.some(i => i.receiveQuantity > 0);

  // Import handler
  const handleImport = React.useCallback(async (
    importedOrders: Partial<typeof purchaseOrders[0]>[],
    mode: 'insert-only' | 'update-only' | 'upsert'
  ) => {
    const store = usePurchaseOrderStore.getState();
    let addedCount = 0, updatedCount = 0, skippedCount = 0;
    const errors: Array<{ row: number; message: string }> = [];

    importedOrders.forEach((order, index) => {
      try {
        const existing = purchaseOrders.find(o => o.id.toLowerCase() === (order.id || '').toLowerCase());
        if (existing) {
          if (mode === 'update-only' || mode === 'upsert') {
            store.update(asSystemId(existing.systemId), { ...existing, ...order, systemId: existing.systemId } as typeof purchaseOrders[0]);
            updatedCount++;
          } else skippedCount++;
        } else {
          if (mode === 'insert-only' || mode === 'upsert') {
            store.add(order as typeof purchaseOrders[0]);
            addedCount++;
          } else skippedCount++;
        }
      } catch (err) {
        errors.push({ row: index + 1, message: (err as Error).message });
      }
    });

    return { success: addedCount + updatedCount, failed: errors.length, inserted: addedCount, updated: updatedCount, skipped: skippedCount, errors };
  }, [purchaseOrders]);

  return (
    <div className="space-y-4">
      <POStatisticsCards />

      {!isMobile && (
        <PageToolbar rightActions={
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
          <SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Chi nhánh" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả chi nhánh</SelectItem>
            {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.statusFilter} onValueChange={filters.setStatusFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
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
          <SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Thanh toán" /></SelectTrigger>
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
        rowCount={filteredData.length}
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
      />

      {isMobile && (
        <div className="py-6 text-center">
          {filters.mobileLoadedCount < sortedData.length ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-body-sm">Đang tải thêm...</span>
            </div>
          ) : sortedData.length > 20 ? (
            <p className="text-body-sm text-muted-foreground">Đã hiển thị tất cả {sortedData.length} kết quả</p>
          ) : null}
        </div>
      )}

      {/* Dialogs */}
      <POCancelDialog state={handlers.cancelDialogState} onOpenChange={(open) => !open && handlers.closeCancelDialog()} onConfirm={handlers.handleConfirmCancel} onClose={handlers.closeCancelDialog} />
      <POBulkPayDialog open={handlers.isBulkPayAlertOpen} onOpenChange={handlers.setIsBulkPayAlertOpen} numSelected={handlers.numSelected} onConfirm={handlers.confirmBulkPay} />
      <POReceiveDialog state={handlers.receiveDialogState} branches={branches} pendingQueueLength={0} isSubmitting={handlers.isSubmittingReceive} hasValidQuantity={hasValidReceiveQty} onClose={handlers.closeReceiveDialog} onFieldChange={handlers.handleReceiveFieldChange} onBranchChange={handlers.handleReceiveBranchChange} onQuantityChange={handlers.handleReceiveQuantityChange} onSubmit={handlers.handleSubmitReceiveDialog} />
      <SimplePrintOptionsDialog open={handlers.isPrintDialogOpen} onOpenChange={handlers.closePrintDialog} onConfirm={handlers.handlePrintConfirm} selectedCount={handlers.pendingPrintPOs.length} title="In đơn nhập hàng" />
      <PurchaseOrderImportDialog open={importExport.showImportDialog} onOpenChange={importExport.setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={purchaseOrders} onImport={handleImport} currentUser={{ name: loggedInUser?.fullName || 'Hệ thống', systemId: loggedInUser?.systemId || asSystemId('SYSTEM') }} />
      <PurchaseOrderExportDialog open={importExport.showExportDialog} onOpenChange={importExport.setShowExportDialog} allData={purchaseOrders} filteredData={sortedData} currentPageData={paginatedData} selectedData={handlers.selectedOrders} currentUser={{ name: loggedInUser?.fullName || 'Hệ thống', systemId: loggedInUser?.systemId || asSystemId('SYSTEM') }} />
    </div>
  );
}
