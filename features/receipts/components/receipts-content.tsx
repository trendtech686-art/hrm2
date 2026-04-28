'use client'

/**
 * ReceiptsContent - Main content component for receipts page
 * Extracted to keep page.tsx thin (<300 lines)
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useReceiptMutations, useReceiptStats, useReceipts, type ReceiptStats } from '../hooks/use-receipts';
import { useAllReceipts } from '../hooks/use-all-receipts';
import { useAllReceiptTypes } from "../../settings/receipt-types/hooks/use-all-receipt-types";
import { useAllBranches } from "../../settings/branches/hooks/use-all-branches";
import { fetchPrintData } from '@/lib/lazy-print-data';
import { useAllCashAccounts } from "../../cashbook/hooks/use-all-cash-accounts";
import type { Receipt } from '@/lib/types/prisma-extended';
import { ResponsiveDataTable, type BulkAction } from "@/components/data-table/responsive-data-table";
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet, Download, Settings, Loader2 } from "lucide-react";
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
  useReceiptImportExport,
} from "../hooks/use-receipts-page-handlers";
import { StatsBar } from "@/components/shared/stats-bar"
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { formatCurrency, formatNumber } from "@/lib/format-utils"
import { cn } from '@/lib/utils'

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
  const navigateTo = useCallback((path: string) => router.push(path), [router]);

  // Stats from server component
  const { data: stats } = useReceiptStats(initialStats);

  // Custom hooks for filters and actions
  const filters = useReceiptFilters();
  const importExport = useReceiptImportExport();

  // Debounce search + reset pagination on filter changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { filters.setPagination(prev => ({ ...prev, pageIndex: 0 })); }, [filters.debouncedGlobalFilter, filters.branchFilter, filters.statusFilter, filters.dateRange]);

  // Derive server-side status filter (single value for API)
  const serverStatus = useMemo(() => filters.statusFilter.size === 1 ? [...filters.statusFilter][0] : undefined, [filters.statusFilter]);

  // ✅ Server-side paginated data — API handles search, filter, sort, pagination
  const { data: receiptsResponse, isLoading, isFetching } = useReceipts({
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
  const receipts = useMemo(() => receiptsResponse?.data ?? [], [receiptsResponse?.data]);
  const serverTotal = receiptsResponse?.pagination?.total ?? 0;
  const serverTotalPages = receiptsResponse?.pagination?.totalPages ?? 1;

  // Lazy-load all data only for import/export
  const dialogsOpen = importExport.showImportDialog || importExport.showExportDialog;
  const { data: allReceipts } = useAllReceipts({ enabled: dialogsOpen });

  const { cancel: cancelMutation, create: createMutation, update: updateMutation } = useReceiptMutations({
    onCancelSuccess: () => toast.success("Đã hủy phiếu thu"),
    onError: (error) => toast.error(error.message || "Thao tác thất bại"),
  });
  const { accounts } = useAllCashAccounts();
  const { data: branches } = useAllBranches();
  const receiptTypesData = useAllReceiptTypes().data;
  // ⚡ OPTIMIZED: storeInfo lazy loaded in print handlers
  const { print, printMultiple } = usePrint();
  const { employee } = useAuth();
  
  // Print dialog state
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [itemsToPrint, setItemsToPrint] = useState<Receipt[]>([]);
  
  // Alert dialogs
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = useState(false);

  // Default column visibility
  const defaultColumnVisibility = useMemo(() => {
    const cols = getColumns([], () => {}, () => {}, () => {});
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('receipts', defaultColumnVisibility);

  // Handlers
  const handleCancel = useCallback((systemId: string) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);

  const handleRowClick = useCallback((receipt: Receipt) => {
    router.push(generatePath(ROUTES.FINANCE.RECEIPT_VIEW, { systemId: receipt.systemId }));
  }, [router]);

  const handleSinglePrint = useCallback(async (receipt: Receipt) => {
    const { storeInfo } = await fetchPrintData();
    const branch = branches.find(b => b.systemId === receipt.branchSystemId);
    const storeSettings = branch 
      ? createStoreSettings(branch)
      : createStoreSettings(storeInfo);
    const receiptData = convertReceiptForPrint(receipt, {});
    
    print('receipt', {
      data: mapReceiptToPrintData(receiptData, storeSettings),
      lineItems: [],
    });
  }, [branches, print]);

  const columns = useMemo(
    () => getColumns(accounts, handleCancel, navigateTo, handleSinglePrint),
    [accounts, handleCancel, navigateTo, handleSinglePrint]
  );

  // Set default column visibility once
  const columnDefaultsInitialized = useRef(false);
  useEffect(() => {
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
  const isCancelling = cancelMutation.isPending;

  const confirmBulkCancel = () => {
    const idsToCancel = Object.keys(filters.rowSelection);
    idsToCancel.forEach(id => cancelMutation.mutate({ systemId: id }));
    toast.success(`Đã hủy ${idsToCancel.length} phiếu thu`);
    filters.setRowSelection({});
    setIsBulkDeleteAlertOpen(false);
  };

  // Filter options
  const statusOptions = useMemo(() => [
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ], []);

  const typeOptions = useMemo(() => 
    (receiptTypesData ?? []).map(rt => ({ value: rt.systemId, label: rt.name }))
  , [receiptTypesData]);

  // Derive customer filter options from current page data (avoid loading all 4500+ customers)
  const customerOptions = useMemo(() => {
    const seen = new Map<string, string>();
    receipts.forEach(r => {
      if (r.customerSystemId && r.customerName && !seen.has(r.customerSystemId)) {
        seen.set(r.customerSystemId, r.customerName);
      }
    });
    return Array.from(seen, ([value, label]) => ({ value, label }));
  }, [receipts]);

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('receipts');
  const filterConfigs: FilterConfig[] = useMemo(() => [
    { id: 'branch', label: 'Chi nhánh', type: 'select', options: branches.map(b => ({ value: b.systemId, label: b.name })) },
    { id: 'status', label: 'Trạng thái', type: 'multi-select', options: statusOptions },
    { id: 'type', label: 'Loại phiếu', type: 'multi-select', options: typeOptions },
    { id: 'customer', label: 'Khách hàng', type: 'multi-select', options: customerOptions },
    { id: 'dateRange', label: 'Khoảng ngày', type: 'date-range' },
  ], [branches, statusOptions, typeOptions, customerOptions]);
  const panelValues = useMemo(() => ({
    branch: filters.branchFilter !== 'all' ? filters.branchFilter : null,
    status: Array.from(filters.statusFilter),
    type: Array.from(filters.typeFilter),
    customer: Array.from(filters.customerFilter),
    dateRange: filters.dateRange ? { from: filters.dateRange[0], to: filters.dateRange[1] } : null,
  }), [filters.branchFilter, filters.statusFilter, filters.typeFilter, filters.customerFilter, filters.dateRange]);
  const handlePanelApply = useCallback((v: Record<string, unknown>) => {
    filters.setBranchFilter((v.branch as string) || 'all');
    filters.setStatusFilter(new Set((v.status as string[]) ?? []));
    filters.setTypeFilter(new Set((v.type as string[]) ?? []));
    filters.setCustomerFilter(new Set((v.customer as string[]) ?? []));
    const dr = v.dateRange as { from?: string; to?: string } | null;
    filters.setDateRange(dr ? [dr.from, dr.to] : undefined);
  }, [filters]);

  // ✅ Server-side pagination: only apply lightweight client-side facet filters (type, customer) on current page
  const filteredData = useMemo(() => {
    let result = receipts;
    if (filters.typeFilter.size > 0) {
      result = result.filter(r => r.paymentReceiptTypeSystemId && filters.typeFilter.has(r.paymentReceiptTypeSystemId));
    }
    if (filters.customerFilter.size > 0) {
      result = result.filter(r => r.customerSystemId && filters.customerFilter.has(r.customerSystemId));
    }
    return result;
  }, [receipts, filters.typeFilter, filters.customerFilter]);

  const allSelectedRows = useMemo(() => 
    receipts.filter(v => filters.rowSelection[v.systemId]),
  [receipts, filters.rowSelection]);

  const selectedReceipts = useMemo(() => 
    receipts.filter(r => filters.rowSelection[r.systemId]),
  [receipts, filters.rowSelection]);

  // Import handler
  const handleImport = useCallback(async (
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
  const handleBulkPrint = useCallback((rows: Receipt[]) => {
    setItemsToPrint(rows);
    setPrintDialogOpen(true);
  }, []);

  const handlePrintConfirm = useCallback(async (options: SimplePrintOptionsResult) => {
    if (itemsToPrint.length === 0) return;
    
    const { storeInfo } = await fetchPrintData();
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
  }, [itemsToPrint, branches, printMultiple]);

  // Bulk actions
  const bulkActions: BulkAction<Receipt>[] = useMemo(() => [
    {
      label: 'In phiếu',
      icon: Printer,
      onSelect: handleBulkPrint,
    },
  ], [handleBulkPrint]);

  const pageCount = serverTotalPages;

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Stats Bar - instant display from Server Component */}
      <StatsBar
        items={[
          { key: 'total', label: 'Tổng phiếu thu', value: formatNumber(stats?.total ?? 0) },
          { key: 'totalAmount', label: 'Tổng thu', value: formatCurrency(stats?.totalAmount ?? 0) },
          { key: 'completed', label: 'Đã hoàn thành', value: formatNumber(stats?.completed ?? 0) },
          { key: 'cancelled', label: 'Đã hủy', value: formatNumber(stats?.cancelled ?? 0) },
        ]}
      />

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
              <SelectTrigger className="w-37.5">
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
            <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
          </>
        }
      />
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />

      <div className={cn('w-full py-4', isFetching && !isLoading && 'opacity-70 transition-opacity')}>
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
          mobileInfiniteScroll
        />
      </div>

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
            <AlertDialogAction disabled={isCancelling} onClick={confirmCancel}>{isCancelling ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang hủy...</> : 'Hủy phiếu'}</AlertDialogAction>
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
            <AlertDialogAction disabled={isCancelling} onClick={confirmBulkCancel}>{isCancelling ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang hủy...</> : 'Hủy tất cả'}</AlertDialogAction>
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
