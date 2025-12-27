'use client'

import * as React from "react";
import { useRouter } from 'next/navigation';
import { useReceiptStore } from "./store";
import { useReceiptTypeStore } from "../settings/receipt-types/store";
import { useCashbookStore } from "../cashbook/store";
import { useBranchStore } from "../settings/branches/store";
import { useCustomerStore } from "../customers/store";
import { useStoreInfoStore } from "../settings/store-info/store-info-store";
import type { Receipt } from '@/lib/types/prisma-extended';
import { usePageHeader } from "@/contexts/page-header-context";
import { ResponsiveDataTable, type BulkAction } from "@/components/data-table/responsive-data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Printer, FileSpreadsheet, Download } from "lucide-react";
import { GenericImportDialogV2 } from "../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../components/shared/generic-export-dialog-v2";
import { receiptImportExportConfig } from "../../lib/import-export/configs/receipt.config";
import { useAuth } from "../../contexts/auth-context";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Fuse from "fuse.js";
import { DataTableColumnCustomizer } from "@/components/data-table/data-table-column-toggle";
import { DataTableImportDialog } from "@/components/data-table/data-table-import-dialog";
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { PageFilters } from "@/components/layout/page-filters";
import { useMediaQuery } from "@/lib/use-media-query";
import { ROUTES, generatePath } from "@/lib/router";
import { toast } from "sonner";
import { formatDate, formatDateCustom, toISODate, toISODateTime } from '@/lib/date-utils';
import { isAfter, isBefore, isSameDay, differenceInMilliseconds } from 'date-fns';
import { getColumns } from "./columns";
import { MobileReceiptCard } from "./card";
import { asSystemId } from '@/lib/id-types';
import { usePrint } from "@/lib/use-print";
import { 
  convertReceiptForPrint,
  mapReceiptToPrintData,
  createStoreSettings,
} from "@/lib/print/receipt-print-helper";
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from "@/components/shared/simple-print-options-dialog";

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const formatDateDisplay = (dateString?: string) => {
  if (!dateString) return '';
  return formatDateCustom(new Date(dateString), "dd/MM/yyyy");
};

export function ReceiptsPage() {
    const router = useRouter();
    const navigateTo = React.useCallback((path: string) => router.push(path), [router]);
    const isMobile = useMediaQuery("(max-width: 768px)");

    const { data: receipts, remove } = useReceiptStore();
    const { accounts } = useCashbookStore();
    const { data: branches } = useBranchStore();
    const { data: receiptTypes } = useReceiptTypeStore();
    const { data: customers } = useCustomerStore();
    const { info: storeInfo } = useStoreInfoStore();
    const { print, printMultiple } = usePrint();
    const { employee } = useAuth();

    // Print dialog state
    const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
    const [itemsToPrint, setItemsToPrint] = React.useState<Receipt[]>([]);
    
    // Import/Export dialog state
    const [showImportDialog, setShowImportDialog] = React.useState(false);
    const [showExportDialog, setShowExportDialog] = React.useState(false);
    
    // ✅ Header Actions
    const headerActions = React.useMemo(() => [
        <Button
            key="add"
            size="sm"
            className="h-9"
            onClick={() => router.push(ROUTES.FINANCE.RECEIPT_NEW)}
        >
            <Plus className="mr-2 h-4 w-4" />
            Tạo phiếu thu
        </Button>
    ], [router]);
    
    usePageHeader({
        title: 'Danh sách phiếu thu',
        breadcrumb: [
            { label: 'Trang chủ', href: '/', isCurrent: false },
            { label: 'Phiếu thu', href: ROUTES.FINANCE.RECEIPTS, isCurrent: true }
        ],
        actions: headerActions,
        showBackButton: false
    });

    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
    const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);

    const [sorting, setSorting] = React.useState({ id: 'createdAt', desc: true });
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
    const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
    const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
        const storageKey = 'receipts-column-visibility';
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {}
        }
        return {};
    });
    
    React.useEffect(() => {
        localStorage.setItem('receipts-column-visibility', JSON.stringify(columnVisibility));
    }, [columnVisibility]);
    
    const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
    const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
    
    // ✅ New Filters
    const [branchFilter, setBranchFilter] = React.useState('all');
    const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
    const [typeFilter, setTypeFilter] = React.useState<Set<string>>(new Set());
    const [customerFilter, setCustomerFilter] = React.useState<Set<string>>(new Set());
    const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>();
    
    // ✅ Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedGlobalFilter(globalFilter);
        }, 300);
        return () => clearTimeout(timer);
    }, [globalFilter]);
    
    const handleCancel = React.useCallback((systemId: string) => {
        setIdToDelete(systemId);
        setIsAlertOpen(true);
    }, []);
    
    const handleEdit = React.useCallback((receipt: Receipt) => {
        router.push(generatePath(ROUTES.FINANCE.RECEIPT_EDIT, { systemId: receipt.systemId }));
    }, [router]);
    
    const handleRowClick = React.useCallback((receipt: Receipt) => {
        router.push(generatePath(ROUTES.FINANCE.RECEIPT_VIEW, { systemId: receipt.systemId }));
    }, [router]);

    // Single print handler for dropdown action
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

    const columns = React.useMemo(() => getColumns(accounts, handleCancel, navigateTo, handleSinglePrint), [accounts, handleCancel, navigateTo, handleSinglePrint]);
    
    // ✅ Set default column visibility - Run ONCE on mount
    React.useEffect(() => {
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
      setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    }, [columns]); // ✅ Depends on columns
    
    const fuse = React.useMemo(() => new Fuse(receipts, { 
        keys: ["id", "description", "payerName", "originalDocumentId", "createdBy"],
        threshold: 0.3,
        ignoreLocation: true
    }), [receipts]);
    
    const confirmCancel = () => { 
        if (idToDelete) {
            const { cancel } = useReceiptStore.getState();
            cancel(asSystemId(idToDelete));
            toast.success("Đã hủy phiếu thu");
        }
        setIsAlertOpen(false); 
    };

    const confirmBulkCancel = () => {
        const idsToCancel = Object.keys(rowSelection);
        const { cancel } = useReceiptStore.getState();
        idsToCancel.forEach(id => cancel(asSystemId(id)));
        toast.success(`Đã hủy ${idsToCancel.length} phiếu thu`);
        setRowSelection({});
        setIsBulkDeleteAlertOpen(false);
    };

    const handleAddNew = () => {
        router.push(ROUTES.FINANCE.RECEIPT_NEW);
    };
    
    // ✅ Filter options
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
    
    // ✅ Apply all filters
    const filteredData = React.useMemo(() => {
        let result = receipts;
        
        // Branch filter
        if (branchFilter && branchFilter !== 'all') {
            result = result.filter(r => r.branchSystemId === branchFilter);
        }
        
        // Status filter
        if (statusFilter.size > 0) {
            result = result.filter(r => r.status && statusFilter.has(r.status));
        }
        
        // Type filter
        if (typeFilter.size > 0) {
            result = result.filter(r => r.paymentReceiptTypeSystemId && typeFilter.has(r.paymentReceiptTypeSystemId));
        }
        
        // Customer filter
        if (customerFilter.size > 0) {
            result = result.filter(r => r.customerSystemId && customerFilter.has(r.customerSystemId));
        }
        
        // Date range filter
        if (dateRange && (dateRange[0] || dateRange[1])) {
            result = result.filter(r => {
                if (!r.date) return false;
                const voucherDate = new Date(r.date);
                const start = dateRange[0] ? new Date(dateRange[0]) : null;
                const end = dateRange[1] ? new Date(dateRange[1]) : null;
                
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
        
        // Text search (debounced)
        if (debouncedGlobalFilter) {
            const searchResults = fuse.search(debouncedGlobalFilter);
            const searchIds = new Set(searchResults.map(r => r.item.systemId));
            result = result.filter(r => searchIds.has(r.systemId));
        }
        
        return result;
    }, [receipts, branchFilter, statusFilter, typeFilter, customerFilter, dateRange, debouncedGlobalFilter, fuse]);
    
    // ✅ Calculate running balance
    const dataWithRunningBalance = React.useMemo(() => {
        // Sort by date ascending to calculate balance correctly
        const sorted = [...filteredData].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return differenceInMilliseconds(dateA, dateB);
        });
        
        let balance = 0;
        return sorted.map(voucher => {
            // Receipts always increase balance
            balance += voucher.amount;
            return { ...voucher, runningBalance: balance };
        });
    }, [filteredData]);
    
    // ✅ Status badge variant
    const getStatusVariant = (status?: string): "default" | "destructive" => {
        return status === 'cancelled' ? 'destructive' : 'default';
    };
    
    // ✅ Status label
    const getStatusLabel = (status?: string): string => {
        return status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành';
    };
    

    
    const sortedData = React.useMemo(() => {
      const sorted = [...dataWithRunningBalance];
      if (sorting.id) {
        sorted.sort((a, b) => {
          const aValue = (a as any)[sorting.id];
          const bValue = (b as any)[sorting.id];
          // Special handling for date columns - parse as Date for proper comparison
          if (sorting.id === 'createdAt' || sorting.id === 'date') {
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
    }, [dataWithRunningBalance, sorting]);
    
    const allSelectedRows = React.useMemo(() => 
      receipts.filter(v => rowSelection[v.systemId]),
    [receipts, rowSelection]);

    // Selected receipts for export
    const selectedReceipts = React.useMemo(() => {
      return receipts.filter(r => rowSelection[r.systemId]);
    }, [receipts, rowSelection]);

    // Import handler
    const handleImport = React.useCallback(async (
      importedReceipts: Partial<Receipt>[],
      mode: 'insert-only' | 'update-only' | 'upsert',
      _branchId?: string
    ) => {
      let addedCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;
      const errors: Array<{ row: number; message: string }> = [];
      
      const storeState = useReceiptStore.getState();
      
      importedReceipts.forEach((receipt, index) => {
        try {
          const existing = receipts.find(r => 
            r.id.toLowerCase() === (receipt.id || '').toLowerCase()
          );
          
          if (existing) {
            if (mode === 'update-only' || mode === 'upsert') {
              storeState.update(asSystemId(existing.systemId), { ...existing, ...receipt, systemId: existing.systemId } as Receipt);
              updatedCount++;
            } else {
              skippedCount++;
            }
          } else {
            if (mode === 'insert-only' || mode === 'upsert') {
              storeState.add(receipt as Receipt);
              addedCount++;
            } else {
              skippedCount++;
            }
          }
        } catch (error) {
          errors.push({ row: index + 1, message: (error as Error).message });
        }
      });
      
      if (addedCount > 0 || updatedCount > 0) {
        const messages = [];
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
    }, [receipts]);

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

    // ✅ Mobile infinite scroll
    React.useEffect(() => {
        if (!isMobile) return;

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

            if (scrollPercentage > 0.8 && mobileLoadedCount < sortedData.length) {
                setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile, mobileLoadedCount, sortedData.length]);

    // ✅ Reset mobile loaded count when filters change
    React.useEffect(() => {
        setMobileLoadedCount(20);
    }, [debouncedGlobalFilter, branchFilter, statusFilter, typeFilter, customerFilter, dateRange]);

    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);

    return (
        <div className="space-y-4 h-full flex flex-col">
            {/* Desktop-only Toolbar */}
            {!isMobile && (
                <PageToolbar
                    leftActions={
                        <>
                            <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Nhập file
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
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
                            columnOrder={columnOrder}
                            setColumnOrder={setColumnOrder}
                            pinnedColumns={pinnedColumns}
                            setPinnedColumns={setPinnedColumns}
                        />
                    ]}
                />
            )}

            {/* Filters Row */}
            <PageFilters
                searchValue={globalFilter}
                onSearchChange={setGlobalFilter}
                searchPlaceholder="Tìm theo mã phiếu, người nộp, chứng từ..."
                leftFilters={
                    <DataTableDateFilter
                        value={dateRange}
                        onChange={setDateRange}
                    />
                }
                rightFilters={
                    <>
                        <Select value={branchFilter} onValueChange={setBranchFilter}>
                            <SelectTrigger className="h-9 w-[150px]">
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
                            selectedValues={statusFilter}
                            onSelectedValuesChange={setStatusFilter}
                        />
                        
                        <DataTableFacetedFilter
                            title="Loại phiếu"
                            options={typeOptions}
                            selectedValues={typeFilter}
                            onSelectedValuesChange={setTypeFilter}
                        />
                        
                        <DataTableFacetedFilter
                            title="Khách hàng"
                            options={customerOptions}
                            selectedValues={customerFilter}
                            onSelectedValuesChange={setCustomerFilter}
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
                            {sortedData.slice(0, mobileLoadedCount).map(receipt => (
                                <MobileReceiptCard 
                                    key={receipt.systemId} 
                                    receipt={receipt}
                                    onCancel={handleCancel}
                                    navigate={navigateTo}
                                    handleRowClick={handleRowClick}
                                />
                            ))}
                            {mobileLoadedCount < sortedData.length && (
                                <Card>
                                    <CardContent className="p-4 text-center text-muted-foreground">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                            <span>Đang tải thêm...</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            {mobileLoadedCount >= sortedData.length && sortedData.length > 20 && (
                                <Card>
                                    <CardContent className="p-4 text-center text-muted-foreground text-sm">
                                        Đã hiển thị tất cả {sortedData.length} phiếu thu
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
                        pagination={pagination}
                        setPagination={setPagination}
                        rowCount={dataWithRunningBalance.length}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        onBulkDelete={() => setIsBulkDeleteAlertOpen(true)}
                        sorting={sorting}
                    setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>}
                    allSelectedRows={allSelectedRows}
                    bulkActions={bulkActions}
                    expanded={{}}
                    setExpanded={() => {}}
                    columnVisibility={columnVisibility}
                    setColumnVisibility={setColumnVisibility}
                    columnOrder={columnOrder}
                    setColumnOrder={setColumnOrder}
                    pinnedColumns={pinnedColumns}
                    setPinnedColumns={setPinnedColumns}
                    onRowClick={(receipt) => router.push(generatePath(ROUTES.FINANCE.RECEIPT_VIEW, { systemId: receipt.systemId }))}
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

            {/* Delete Alert Dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hủy phiếu thu?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Phiếu thu sẽ được chuyển sang trạng thái "Đã hủy". Bạn có thể xem lại phiếu đã hủy trong danh sách.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Đóng</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmCancel}>Hủy phiếu</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bulk Delete Alert Dialog */}
            <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hủy {Object.keys(rowSelection).length} phiếu thu?</AlertDialogTitle>
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
            <GenericImportDialogV2<Receipt>
                open={showImportDialog}
                onOpenChange={setShowImportDialog}
                config={receiptImportExportConfig}
                branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))}
                existingData={receipts}
                onImport={handleImport}
                currentUser={{
                    name: employee?.fullName || 'Hệ thống',
                    systemId: employee?.systemId || asSystemId('SYSTEM'),
                }}
            />

            {/* Export Dialog */}
            <GenericExportDialogV2<Receipt>
                open={showExportDialog}
                onOpenChange={setShowExportDialog}
                config={receiptImportExportConfig}
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
