import * as React from "react";
import { useNavigate } from 'react-router-dom';
import { useReceiptStore } from "./store";
import { useReceiptTypeStore } from "../settings/receipt-types/store";
import { useCashbookStore } from "../cashbook/store";
import { useBranchStore } from "../settings/branches/store";
import { useCustomerStore } from "../customers/store";
import type { Receipt } from "./types";
import { usePageHeader } from "@/contexts/page-header-context";
import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Fuse from "fuse.js";
import { DataTableColumnCustomizer } from "@/components/data-table/data-table-column-toggle";
import { DataTableExportDialog } from "@/components/data-table/data-table-export-dialog";
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

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const formatDateDisplay = (dateString?: string) => {
  if (!dateString) return '';
  return formatDateCustom(new Date(dateString), "dd/MM/yyyy");
};

export function ReceiptsPage() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const { data: receipts, remove } = useReceiptStore();
    const { accounts } = useCashbookStore();
    const { data: branches } = useBranchStore();
    const { data: receiptTypes } = useReceiptTypeStore();
    const { data: customers } = useCustomerStore();
    
    // ✅ Header Actions
    const headerActions = React.useMemo(() => [
        <Button key="add" className="h-9 bg-black text-white hover:bg-black/90" onClick={() => navigate(ROUTES.FINANCE.RECEIPT_NEW)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo phiếu thu
        </Button>
    ], [navigate]);
    
    usePageHeader({
        title: 'Danh sách Phiếu thu',
        breadcrumb: [
            { label: 'Trang chủ', href: '/', isCurrent: false },
            { label: 'Phiếu thu', href: '/receipts', isCurrent: true }
        ],
        actions: headerActions
    });

    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
    const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);

    const [sorting, setSorting] = React.useState({ id: 'date', desc: true });
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
        navigate(generatePath(ROUTES.FINANCE.RECEIPT_EDIT, { systemId: receipt.systemId }));
    }, [navigate]);
    
    const handleRowClick = React.useCallback((receipt: Receipt) => {
        navigate(generatePath(ROUTES.FINANCE.RECEIPT_VIEW, { systemId: receipt.systemId }));
    }, [navigate]);

    const columns = React.useMemo(() => getColumns(accounts, handleCancel, navigate), [accounts, handleCancel, navigate]);
    
    // ✅ Export config
    const exportConfig = {
        fileName: 'Phieu_thu',
        columns,
    };
    
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
        navigate(ROUTES.FINANCE.RECEIPT_NEW);
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
                            <DataTableExportDialog 
                                allData={receipts} 
                                filteredData={sortedData} 
                                pageData={paginatedData} 
                                config={exportConfig} 
                            />
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
                                    navigate={navigate}
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
                    expanded={{}}
                    setExpanded={() => {}}
                    columnVisibility={columnVisibility}
                    setColumnVisibility={setColumnVisibility}
                    columnOrder={columnOrder}
                    setColumnOrder={setColumnOrder}
                    pinnedColumns={pinnedColumns}
                    setPinnedColumns={setPinnedColumns}
                    onRowClick={(receipt) => navigate(generatePath(ROUTES.FINANCE.RECEIPT_VIEW, { systemId: receipt.systemId }))}
                    renderMobileCard={(receipt) => (
                        <MobileReceiptCard 
                            receipt={receipt}
                            onCancel={handleCancel}
                            navigate={navigate}
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
        </div>
    );
}
