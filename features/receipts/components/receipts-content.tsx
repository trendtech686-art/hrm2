'use client'

/**
 * ReceiptsContent - Main content component for receipts page
 * Extracted to keep page.tsx thin (<300 lines)
 */

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useReceiptMutations, useReceiptStats, useReceipts, type ReceiptStats } from '../hooks/use-receipts';
import { useAllReceipts } from '../hooks/use-all-receipts';
import { useAllReceiptTypes } from "../../settings/receipt-types/hooks/use-all-receipt-types";
import { useAllBranches } from "../../settings/branches/hooks/use-all-branches";
import { useAllCustomers } from "../../customers/hooks/use-all-customers";
import { useStoreInfoData } from "../../settings/store-info/hooks/use-store-info";
import { useAllCashAccounts } from "../../cashbook/hooks/use-all-cash-accounts";
import type { Receipt } from '@/lib/types/prisma-extended';
import { ResponsiveDataTable, type BulkAction } from "@/components/data-table/responsive-data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet, Download, Receipt as ReceiptIcon, DollarSign, CalendarDays, TrendingUp, Settings } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { PageFilters } from "@/components/layout/page-filters";
import { useMediaQuery } from "@/lib/use-media-query";
import { ROUTES, generatePath } from "@/lib/router";
import { toast } from "sonner";
import { getColumns } from "../columns";
import { MobileReceiptCard } from "../card";
import { asSystemId } from '@/lib/id-types';
import { usePrint } from "@/lib/use-print";
import { 
  convertReceiptForPrint,
  mapReceiptToPrintData,
  createStoreSettings,
} from "@/lib/print/receipt-print-helper";
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from "@/components/shared/simple-print-options-dialog";
import { useColumnVisibility } from '@/hooks/use-column-visibility';
import type { ReceiptStatus } from '@/lib/types/prisma-extended';
import {
  useReceiptFilters,
  useReceiptActions as _useReceiptActions,
  useReceiptImportExport,
} from "../hooks/use-receipts-page-handlers";
import { StatsCard, StatsCardGrid } from "@/components/shared/stats-card"
import { formatCurrency, formatNumber } from "@/lib/format-utils"

// Dynamic imports for import/export dialogs
const ReceiptImportDialog = dynamic(
  () => import('./receipt-import-export-dialogs').then(mod => ({ default: mod.ReceiptImportDialog })),
  { ssr: false }
);
const ReceiptExportDialog = dynamic(
  () => import('./receipt-import-export-dialogs').then(mod => ({ default: mod.ReceiptExportDialog })),
  { ssr: false }
);

// Props interface
interface ReceiptsContentProps {
  initialStats?: ReceiptStats;
}

export function ReceiptsContent({ initialStats }: ReceiptsContentProps) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigateTo = React.useCallback((path: string) => router.push(path), [router]);

  // Stats from server component
  const { data: stats } = useReceiptStats(initialStats);

  // Custom hooks for filters and actions
  const filters = useReceiptFilters();
  const importExport = useReceiptImportExport();

  // Debounce search + reset pagination on filter changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { filters.setPagination(prev => ({ ...prev, pageIndex: 0 })); }, [filters.debouncedGlobalFilter, filters.branchFilter, filters.statusFilter, filters.dateRange]);

  // Derive server-side status filter (single value for API)
  const serverStatus = React.useMemo(() => filters.statusFilter.size === 1 ? [...filters.statusFilter][0] : undefined, [filters.statusFilter]);

  // ✅ Server-side paginated data — API handles search, filter, sort, pagination
  const { data: receiptsResponse, isLoading } = useReceipts({
    search: filters.debouncedGlobalFilter || undefined,
    page: filters.pagination.pageIndex + 1,
    limit: filters.pagination.pageSize,
    status: serverStatus as ReceiptStatus | undefined,
    branchId: filters.branchFilter !== 'all' ? filters.branchFilter : undefined,
    startDate: filters.dateRange?.[0],
    endDate: filters.dateRange?.[1],
    sortBy: filters.sorting.id || 'createdAt',
    sortOrder: filters.sorting.desc ? 'desc' : 'asc',
  });
  const receipts = React.useMemo(() => receiptsResponse?.data ?? [], [receiptsResponse?.data]);
  const serverTotal = receiptsResponse?.pagination?.total ?? 0;
  const serverTotalPages = receiptsResponse?.pagination?.totalPages ?? 1;

  // Lazy-load all data only for import/export
  const { data: allReceipts } = useAllReceipts({ enabled: importExport.showImportDialog || importExport.showExportDialog });

  const { cancel: cancelMutation, create: createMutation, update: updateMutation } = useReceiptMutations({
    onCancelSuccess: () => toast.success("Đã hủy phiếu thu"),
    onError: (error) => toast.error(error.message || "Thao tác thất bại"),
  });
  const { accounts } = useAllCashAccounts();
  const { data: branches } = useAllBranches();
  const receiptTypesData = useAllReceiptTypes().data;
  const { data: customers } = useAllCustomers();
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();
  const { employee } = useAuth();
  
  // Print dialog state
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<Receipt[]>([]);
  
  // Alert dialogs
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);

  // Default column visibility
  const defaultColumnVisibility = React.useMemo(() => {
    const cols = getColumns([], () => {}, () => {}, () => {});
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('receipts', defaultColumnVisibility);

  // Handlers
  const handleCancel = React.useCallback((systemId: string) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);

  const handleRowClick = React.useCallback((receipt: Receipt) => {
    router.push(generatePath(ROUTES.FINANCE.RECEIPT_VIEW, { systemId: receipt.systemId }));
  }, [router]);

  const handleSinglePrint = React.useCallback((receipt: Receipt) => {
    const branch = branches.find(b => b.systemId === receipt.branchSystemId);
    const storeSettings = branch 
      ? createStoreSettings(branch)
      : createStoreSettings(storeInfo);
    const receiptData = convertReceiptForPrint(receipt, {});
    
    print('receipt', {
      data: mapReceiptToPrintData(receiptData, storeSettings),
      lineItems: [],
    });
  }, [branches, storeInfo, print]);

  const columns = React.useMemo(
    () => getColumns(accounts, handleCancel, navigateTo, handleSinglePrint),
    [accounts, handleCancel, navigateTo, handleSinglePrint]
  );

  // Set default column visibility once
  const columnDefaultsInitialized = React.useRef(false);
  React.useEffect(() => {
    if (columnDefaultsInitialized.current) return;
    if (columns.length === 0) return;
    
    const defaultVisibleColumns = [
      'id', 'date', 'amount', 'payerName', 'payerTypeName', 'paymentMethodName', 
      'accountSystemId', 'paymentReceiptTypeName', 'status', 'branchName', 
      'description', 'originalDocumentId', 'customerName', 'createdBy', 'createdAt'
    ];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      if (c.id === 'select' || c.id === 'actions') {
        initialVisibility[c.id!] = true;
      } else {
        initialVisibility[c.id!] = defaultVisibleColumns.includes(c.id!);
      }
    });
    setColumnVisibility(initialVisibility);
    filters.setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    columnDefaultsInitialized.current = true;
  }, [columns, setColumnVisibility, filters]);

  // Confirm actions
  const confirmCancel = () => { 
    if (idToDelete) {
      cancelMutation.mutate({ systemId: idToDelete });
    }
    setIsAlertOpen(false); 
  };

  const confirmBulkCancel = () => {
    const idsToCancel = Object.keys(filters.rowSelection);
    idsToCancel.forEach(id => cancelMutation.mutate({ systemId: id }));
    toast.success(`Đã hủy ${idsToCancel.length} phiếu thu`);
    filters.setRowSelection({});
    setIsBulkDeleteAlertOpen(false);
  };

  // Filter options
  const statusOptions = React.useMemo(() => [
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ], []);

  const typeOptions = React.useMemo(() => 
    (receiptTypesData ?? []).map(rt => ({ value: rt.systemId, label: rt.name }))
  , [receiptTypesData]);

  const customerOptions = React.useMemo(() => 
    customers.map(c => ({ value: c.systemId, label: c.name }))
  , [customers]);

  // ✅ Server-side pagination: only apply lightweight client-side facet filters (type, customer) on current page
  const filteredData = React.useMemo(() => {
    let result = receipts;
    if (filters.typeFilter.size > 0) {
      result = result.filter(r => r.paymentReceiptTypeSystemId && filters.typeFilter.has(r.paymentReceiptTypeSystemId));
    }
    if (filters.customerFilter.size > 0) {
      result = result.filter(r => r.customerSystemId && filters.customerFilter.has(r.customerSystemId));
    }
    return result;
  }, [receipts, filters.typeFilter, filters.customerFilter]);

  const allSelectedRows = React.useMemo(() => 
    receipts.filter(v => filters.rowSelection[v.systemId]),
  [receipts, filters.rowSelection]);

  const selectedReceipts = React.useMemo(() => 
    receipts.filter(r => filters.rowSelection[r.systemId]),
  [receipts, filters.rowSelection]);

  // Import handler
  const handleImport = React.useCallback(async (
    importedReceipts: Partial<Receipt>[],
    mode: 'insert-only' | 'update-only' | 'upsert',
  ) => {
    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const errors: Array<{ row: number; message: string }> = [];
    
    for (const [index, receipt] of importedReceipts.entries()) {
      try {
        const existing = allReceipts.find(r => 
          r.id.toLowerCase() === (receipt.id || '').toLowerCase()
        );
        
        if (existing) {
          if (mode === 'update-only' || mode === 'upsert') {
            await updateMutation.mutateAsync({ 
              systemId: existing.systemId, 
              data: { ...existing, ...receipt, systemId: existing.systemId } as Receipt 
            });
            updatedCount++;
          } else {
            skippedCount++;
          }
        } else {
          if (mode === 'insert-only' || mode === 'upsert') {
            await createMutation.mutateAsync(receipt as Receipt);
            addedCount++;
          } else {
            skippedCount++;
          }
        }
      } catch (error) {
        errors.push({ row: index + 1, message: (error as Error).message });
      }
    }
    
    if (addedCount > 0 || updatedCount > 0) {
      const messages: string[] = [];
      if (addedCount > 0) messages.push(`${addedCount} phiếu thu mới`);
      if (updatedCount > 0) messages.push(`${updatedCount} phiếu cập nhật`);
      toast.success(`Đã import: ${messages.join(', ')}`);
    }
    
    return {
      success: addedCount + updatedCount,
      failed: errors.length,
      inserted: addedCount,
      updated: updatedCount,
      skipped: skippedCount,
      errors,
    };
  }, [allReceipts, createMutation, updateMutation]);

  // Bulk print handlers
  const handleBulkPrint = React.useCallback((rows: Receipt[]) => {
    setItemsToPrint(rows);
    setPrintDialogOpen(true);
  }, []);

  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    if (itemsToPrint.length === 0) return;
    
    const printItems = itemsToPrint.map(receipt => {
      const selectedBranch = options.branchSystemId 
        ? branches.find(b => b.systemId === options.branchSystemId)
        : branches.find(b => b.systemId === receipt.branchSystemId);
      const storeSettings = selectedBranch 
        ? createStoreSettings(selectedBranch)
        : createStoreSettings(storeInfo);
      const receiptData = convertReceiptForPrint(receipt, {});
      
      return {
        data: mapReceiptToPrintData(receiptData, storeSettings),
        lineItems: [],
        paperSize: options.paperSize,
      };
    });

    printMultiple('receipt', printItems);
    toast.success(`Đang in ${itemsToPrint.length} phiếu thu`);
    setItemsToPrint([]);
    setPrintDialogOpen(false);
  }, [itemsToPrint, branches, storeInfo, printMultiple]);

  // Bulk actions
  const bulkActions: BulkAction<Receipt>[] = React.useMemo(() => [
    {
      label: 'In phiếu',
      icon: Printer,
      onSelect: handleBulkPrint,
    },
  ], [handleBulkPrint]);

  // Mobile infinite scroll
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage > 0.8 && filters.mobileLoadedCount < filteredData.length) {
        filters.setMobileLoadedCount(prev => Math.min(prev + 20, filteredData.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, filters.mobileLoadedCount, filteredData.length, filters]);

  // Reset mobile loaded count when filters change
  React.useEffect(() => {
    filters.setMobileLoadedCount(20);
  }, [filters.debouncedGlobalFilter, filters.branchFilter, filters.statusFilter, filters.typeFilter, filters.customerFilter, filters.dateRange, filters]);

  const pageCount = serverTotalPages;

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Stats Cards - instant display from Server Component */}
      <StatsCardGrid columns={4} className="mb-2">
        <StatsCard
          title="Tổng phiếu thu"
          value={stats?.total ?? 0}
          icon={ReceiptIcon}
          formatValue={(v) => formatNumber(Number(v))}
        />
        <StatsCard
          title="Tổng thu"
          value={stats?.totalAmount ?? 0}
          icon={TrendingUp}
          formatValue={(v) => formatCurrency(Number(v))}
          variant="success"
        />
        <StatsCard
          title="Đã hoàn thành"
          value={stats?.completed ?? 0}
          icon={CalendarDays}
          formatValue={(v) => formatNumber(Number(v))}
          variant="info"
        />
        <StatsCard
          title="Đã hủy"
          value={stats?.cancelled ?? 0}
          icon={DollarSign}
          formatValue={(v) => formatNumber(Number(v))}
          variant="info"
        />
      </StatsCardGrid>

      {/* Desktop-only Toolbar */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <>
              <Button variant="outline" size="sm" onClick={() => router.push('/settings/payments')}>
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt
              </Button>
              <Button variant="outline" size="sm" onClick={() => importExport.setShowImportDialog(true)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Nhập file
              </Button>
              <Button variant="outline" size="sm" onClick={() => importExport.setShowExportDialog(true)}>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
            </>
          }
          rightActions={[
            <DataTableColumnCustomizer
              key="customizer"
              columns={columns}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={filters.columnOrder}
              setColumnOrder={filters.setColumnOrder}
              pinnedColumns={filters.pinnedColumns}
              setPinnedColumns={filters.setPinnedColumns}
            />
          ]}
        />
      )}

      {/* Filters Row */}
      <PageFilters
        searchValue={filters.globalFilter}
        onSearchChange={filters.setGlobalFilter}
        searchPlaceholder="Tìm theo mã phiếu, người nộp, chứng từ..."
        leftFilters={
          <DataTableDateFilter
            value={filters.dateRange}
            onChange={filters.setDateRange}
          />
        }
        rightFilters={
          <>
            <Select value={filters.branchFilter} onValueChange={filters.setBranchFilter}>
              <SelectTrigger className="h-9 w-37.5">
                <SelectValue placeholder="Chi nhánh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.systemId} value={branch.systemId}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DataTableFacetedFilter
              title="Trạng thái"
              options={statusOptions}
              selectedValues={filters.statusFilter}
              onSelectedValuesChange={filters.setStatusFilter}
            />
            
            <DataTableFacetedFilter
              title="Loại phiếu"
              options={typeOptions}
              selectedValues={filters.typeFilter}
              onSelectedValuesChange={filters.setTypeFilter}
            />
            
            <DataTableFacetedFilter
              title="Khách hàng"
              options={customerOptions}
              selectedValues={filters.customerFilter}
              onSelectedValuesChange={filters.setCustomerFilter}
            />
          </>
        }
      />

      {/* Mobile View - Cards */}
      {isMobile ? (
        <div className="space-y-2 flex-1 overflow-y-auto">
          {filteredData.length === 0 && !isLoading ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Không tìm thấy phiếu thu nào
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredData.slice(0, filters.mobileLoadedCount).map(receipt => (
                <MobileReceiptCard 
                  key={receipt.systemId} 
                  receipt={receipt}
                  onCancel={handleCancel}
                  navigate={navigateTo}
                  handleRowClick={handleRowClick}
                />
              ))}
              {filters.mobileLoadedCount < filteredData.length && (
                <Card>
                  <CardContent className="p-4 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Đang tải thêm...</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      ) : (
        /* Desktop View - Table */
        <div className="w-full py-4">
          <ResponsiveDataTable
            columns={columns}
            data={filteredData}
            pageCount={pageCount}
            pagination={filters.pagination}
            setPagination={filters.setPagination}
            rowCount={serverTotal}
            isLoading={isLoading}
            rowSelection={filters.rowSelection}
            setRowSelection={filters.setRowSelection}
            onBulkDelete={() => setIsBulkDeleteAlertOpen(true)}
            sorting={filters.sorting}
            setSorting={filters.setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>}
            allSelectedRows={allSelectedRows}
            bulkActions={bulkActions}
            expanded={{}}
            setExpanded={() => {}}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={filters.columnOrder}
            setColumnOrder={filters.setColumnOrder}
            pinnedColumns={filters.pinnedColumns}
            setPinnedColumns={filters.setPinnedColumns}
            onRowClick={handleRowClick}
            renderMobileCard={(receipt) => (
              <MobileReceiptCard 
                receipt={receipt}
                onCancel={handleCancel}
                navigate={navigateTo}
                handleRowClick={handleRowClick}
              />
            )}
          />
        </div>
      )}

      {/* Alert Dialogs */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy phiếu thu?</AlertDialogTitle>
            <AlertDialogDescription>
              Phiếu thu sẽ được chuyển sang trạng thái "Đã hủy".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Hủy phiếu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy {Object.keys(filters.rowSelection).length} phiếu thu?</AlertDialogTitle>
            <AlertDialogDescription>
              Các phiếu thu sẽ được chuyển sang trạng thái "Đã hủy".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkCancel}>Hủy tất cả</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Options Dialog */}
      <SimplePrintOptionsDialog
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        onConfirm={handlePrintConfirm}
        selectedCount={itemsToPrint.length}
        title="In phiếu thu"
      />

      {/* Import Dialog */}
      <ReceiptImportDialog
        open={importExport.showImportDialog}
        onOpenChange={importExport.setShowImportDialog}
        branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))}
        existingData={allReceipts}
        onImport={handleImport}
        currentUser={{
          name: employee?.fullName || 'Hệ thống',
          systemId: employee?.systemId || asSystemId('SYSTEM'),
        }}
      />

      {/* Export Dialog */}
      <ReceiptExportDialog
        open={importExport.showExportDialog}
        onOpenChange={importExport.setShowExportDialog}
        allData={allReceipts}
        filteredData={filteredData}
        currentPageData={filteredData}
        selectedData={selectedReceipts}
        currentUser={{
          name: employee?.fullName || 'Hệ thống',
          systemId: employee?.systemId || asSystemId('SYSTEM'),
        }}
      />
    </div>
  );
}
