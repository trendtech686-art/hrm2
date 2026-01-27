'use client'

/**
 * ReceiptsContent - Main content component for receipts page
 * Extracted to keep page.tsx thin (<300 lines)
 */

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useReceipts, useReceiptMutations } from '../hooks/use-receipts';
import { useReceiptTypeStore } from "../../settings/receipt-types/store";
import { useAllBranches } from "../../settings/branches/hooks/use-all-branches";
import { useAllCustomers } from "../../customers/hooks/use-all-customers";
import { useStoreInfoData } from "../../settings/store-info/hooks/use-store-info";
import { useCashAccounts } from "../../cashbook/hooks/use-cashbook";
import type { Receipt } from '@/lib/types/prisma-extended';
import { ResponsiveDataTable, type BulkAction } from "@/components/data-table/responsive-data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet, Download } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Fuse from "fuse.js";
import { DataTableColumnCustomizer } from "@/components/data-table/data-table-column-toggle";
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { PageFilters } from "@/components/layout/page-filters";
import { useMediaQuery } from "@/lib/use-media-query";
import { ROUTES, generatePath } from "@/lib/router";
import { toast } from "sonner";
import { isAfter, isBefore, isSameDay, differenceInMilliseconds } from 'date-fns';
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
import {
  useReceiptFilters,
  useReceiptActions as _useReceiptActions,
  useReceiptImportExport,
} from "../hooks/use-receipts-page-handlers";

// Dynamic imports for import/export dialogs
const ReceiptImportDialog = dynamic(
  () => import('./receipt-import-export-dialogs').then(mod => ({ default: mod.ReceiptImportDialog })),
  { ssr: false }
);
const ReceiptExportDialog = dynamic(
  () => import('./receipt-import-export-dialogs').then(mod => ({ default: mod.ReceiptExportDialog })),
  { ssr: false }
);

export function ReceiptsContent() {
  const router = useRouter();
  const { navigateTo } = useMediaQuery();

  // Data from stores - use React Query for receipts
  const { data: receiptsData, isLoading: _isReceiptsLoading } = useReceipts({ limit: 1000 });
  const receipts = React.useMemo(() => receiptsData?.items ?? [], [receiptsData?.items]);
  const { cancel: cancelMutation, create: createMutation, update: updateMutation } = useReceiptMutations({
    onCancelSuccess: () => toast.success("Đã hủy phiếu thu"),
    onError: (error) => toast.error(error.message || "Thao tác thất bại"),
  });
  const { data: queryData } = useCashAccounts({ limit: 500 });
  const accounts = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const { data: branches } = useAllBranches();
  const receiptTypesData = useReceiptTypeStore(state => state.data);
  const receiptTypes = React.useMemo(() => receiptTypesData ?? [], [receiptTypesData]);
  const { data: customers } = useAllCustomers();
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();
  const { employee } = useAuth();

  // Custom hooks for filters and actions
  const filters = useReceiptFilters();
  const importExport = useReceiptImportExport();
  
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

  // Fuse search
  const fuse = React.useMemo(() => new Fuse(receipts, { 
    keys: ["id", "description", "payerName", "originalDocumentId", "createdBy"],
    threshold: 0.3,
    ignoreLocation: true
  }), [receipts]);

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
    receiptTypes.map(rt => ({ value: rt.systemId, label: rt.name }))
  , [receiptTypes]);

  const customerOptions = React.useMemo(() => 
    customers.map(c => ({ value: c.systemId, label: c.name }))
  , [customers]);

  // Apply all filters
  const filteredData = React.useMemo(() => {
    let result = receipts;
    
    if (filters.branchFilter && filters.branchFilter !== 'all') {
      result = result.filter(r => r.branchSystemId === filters.branchFilter);
    }
    if (filters.statusFilter.size > 0) {
      result = result.filter(r => r.status && filters.statusFilter.has(r.status));
    }
    if (filters.typeFilter.size > 0) {
      result = result.filter(r => r.paymentReceiptTypeSystemId && filters.typeFilter.has(r.paymentReceiptTypeSystemId));
    }
    if (filters.customerFilter.size > 0) {
      result = result.filter(r => r.customerSystemId && filters.customerFilter.has(r.customerSystemId));
    }
    if (filters.dateRange && (filters.dateRange[0] || filters.dateRange[1])) {
      result = result.filter(r => {
        if (!r.date) return false;
        const voucherDate = new Date(r.date);
        const start = filters.dateRange![0] ? new Date(filters.dateRange![0]) : null;
        const end = filters.dateRange![1] ? new Date(filters.dateRange![1]) : null;
        
        if (start && end) {
          return (isAfter(voucherDate, start) || isSameDay(voucherDate, start)) && 
                 (isBefore(voucherDate, end) || isSameDay(voucherDate, end));
        } else if (start) {
          return isAfter(voucherDate, start) || isSameDay(voucherDate, start);
        } else if (end) {
          return isBefore(voucherDate, end) || isSameDay(voucherDate, end);
        }
        return true;
      });
    }
    if (filters.debouncedGlobalFilter) {
      const searchResults = fuse.search(filters.debouncedGlobalFilter);
      const searchIds = new Set(searchResults.map(r => r.item.systemId));
      result = result.filter(r => searchIds.has(r.systemId));
    }
    
    return result;
  }, [receipts, filters.branchFilter, filters.statusFilter, filters.typeFilter, filters.customerFilter, filters.dateRange, filters.debouncedGlobalFilter, fuse]);

  // Calculate running balance
  const dataWithRunningBalance = React.useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return differenceInMilliseconds(dateA, dateB);
    });
    
    let balance = 0;
    return sorted.map(voucher => {
      balance += voucher.amount;
      return { ...voucher, runningBalance: balance };
    });
  }, [filteredData]);

  // Sorting
  const sortedData = React.useMemo(() => {
    const sorted = [...dataWithRunningBalance];
    if (filters.sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[filters.sorting.id] as string | number | null | undefined;
        const bValue = (b as Record<string, unknown>)[filters.sorting.id] as string | number | null | undefined;
        if (filters.sorting.id === 'createdAt' || filters.sorting.id === 'date') {
          const aTime = aValue ? new Date(aValue as string | number | Date).getTime() : 0;
          const bTime = bValue ? new Date(bValue as string | number | Date).getTime() : 0;
          return filters.sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        if (aValue < bValue) return filters.sorting.desc ? 1 : -1;
        if (aValue > bValue) return filters.sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [dataWithRunningBalance, filters.sorting]);

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
        const existing = receipts.find(r => 
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
  }, [receipts, createMutation, updateMutation]);

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

      if (scrollPercentage > 0.8 && filters.mobileLoadedCount < sortedData.length) {
        filters.setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filters.mobileLoadedCount, sortedData.length, filters]);

  // Reset mobile loaded count when filters change
  React.useEffect(() => {
    filters.setMobileLoadedCount(20);
  }, [filters.debouncedGlobalFilter, filters.branchFilter, filters.statusFilter, filters.typeFilter, filters.customerFilter, filters.dateRange, filters]);

  const pageCount = Math.ceil(sortedData.length / filters.pagination.pageSize);
  const paginatedData = React.useMemo(() => 
    sortedData.slice(filters.pagination.pageIndex * filters.pagination.pageSize, (filters.pagination.pageIndex + 1) * filters.pagination.pageSize),
  [sortedData, filters.pagination]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Desktop-only Toolbar */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <>
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
          {sortedData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Không tìm thấy phiếu thu nào
              </CardContent>
            </Card>
          ) : (
            <>
              {sortedData.slice(0, filters.mobileLoadedCount).map(receipt => (
                <MobileReceiptCard 
                  key={receipt.systemId} 
                  receipt={receipt}
                  onCancel={handleCancel}
                  navigate={navigateTo}
                  handleRowClick={handleRowClick}
                />
              ))}
              {filters.mobileLoadedCount < sortedData.length && (
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
            data={paginatedData}
            pageCount={pageCount}
            pagination={filters.pagination}
            setPagination={filters.setPagination}
            rowCount={dataWithRunningBalance.length}
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
        existingData={receipts}
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
        allData={receipts}
        filteredData={sortedData}
        currentPageData={paginatedData}
        selectedData={selectedReceipts}
        currentUser={{
          name: employee?.fullName || 'Hệ thống',
          systemId: employee?.systemId || asSystemId('SYSTEM'),
        }}
      />
    </div>
  );
}
