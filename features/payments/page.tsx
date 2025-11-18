import * as React from "react";
import { useNavigate } from 'react-router-dom';
import { usePaymentStore } from "./store.ts";
import { useCashbookStore } from "../cashbook/store.ts";
import { useBranchStore } from "../settings/branches/store.ts";
import { usePaymentTypeStore } from "../settings/payments/types/store.ts";
import { useCustomerStore } from "../customers/store.ts";
import type { Payment } from "./types.ts";
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx";
import { Card, CardContent } from "../../components/ui/card.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Minus, CreditCard, Calendar, User, Building2, FileText, MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog.tsx";
import Fuse from "fuse.js";
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog.tsx";
import { DataTableImportDialog } from "../../components/data-table/data-table-import-dialog.tsx";
import { DataTableDateFilter } from "../../components/data-table/data-table-date-filter.tsx";
import { DataTableFacetedFilter } from "../../components/data-table/data-table-faceted-filter.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.tsx";
import { PageToolbar } from "../../components/layout/page-toolbar.tsx";
import { PageFilters } from "../../components/layout/page-filters.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.tsx";
import { useMediaQuery } from "../../lib/use-media-query.ts";
import { TouchButton } from "../../components/mobile/touch-button.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../components/ui/dropdown-menu.tsx";
import { ROUTES, generatePath } from "../../lib/router.ts";
import { toast } from "sonner";
import { formatDate, formatDateCustom, toISODate, toISODateTime } from '../../lib/date-utils.ts';
import { isAfter, isBefore, isSameDay, differenceInMilliseconds } from 'date-fns';
import { getColumns } from "./columns.tsx";
import { MobilePaymentCard } from "./card.tsx";

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const formatDateDisplay = (dateString?: string) => {
  if (!dateString) return '';
  return formatDateCustom(new Date(dateString), "dd/MM/yyyy");
};

export function PaymentsPage() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const { data: payments, remove } = usePaymentStore();
    const { accounts } = useCashbookStore();
    const { data: branches } = useBranchStore();
    const { data: paymentTypes } = usePaymentTypeStore();
    const { data: customers } = useCustomerStore();
    
    // ✅ Header Actions
    const headerActions = React.useMemo(() => [
        <Button key="add" className="h-9 bg-black text-white hover:bg-black/90" onClick={() => navigate(ROUTES.FINANCE.PAYMENT_NEW)}>
            <Minus className="mr-2 h-4 w-4" />
            Tạo phiếu chi
        </Button>
    ], [navigate]);
    
    usePageHeader({
        title: 'Danh sách phiếu chi',
        breadcrumb: [
            { label: 'Trang chủ', href: '/', isCurrent: false },
            { label: 'Phiếu chi', href: '/payments', isCurrent: true }
        ],
        actions: headerActions
    });

    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
    const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);
    const [isBulkApproveAlertOpen, setIsBulkApproveAlertOpen] = React.useState(false);

    const [sorting, setSorting] = React.useState({ id: 'date', desc: true });
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
    const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
    const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
        const storageKey = 'payments-column-visibility';
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {}
        }
        return {};
    });
    
    React.useEffect(() => {
        localStorage.setItem('payments-column-visibility', JSON.stringify(columnVisibility));
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
    
    const handleApprove = React.useCallback((systemId: string) => {
        // TODO: Implement approve logic
        toast.success("Đã duyệt phiếu chi");
    }, []);

    const handleEdit = React.useCallback((payment: Payment) => {
        navigate(generatePath(ROUTES.FINANCE.PAYMENT_EDIT, { systemId: payment.systemId }));
    }, [navigate]);
    
    const handleRowClick = React.useCallback((payment: Payment) => {
        navigate(generatePath(ROUTES.FINANCE.PAYMENT_VIEW, { systemId: payment.systemId }));
    }, [navigate]);

    const columns = React.useMemo(() => getColumns(accounts, handleCancel, handleApprove, navigate), [accounts, handleCancel, handleApprove, navigate]);
    
    // ✅ Export config
    const exportConfig = {
        fileName: 'Phieu_chi',
        columns,
    };
    
    // ✅ Set default column visibility - Run ONCE on mount
    React.useEffect(() => {
      const defaultVisibleColumns = [
        'id', 'date', 'amount', 'recipientName', 'recipientTypeName', 'paymentMethodName', 
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
    
    const fuse = React.useMemo(() => new Fuse(payments, { 
        keys: ["id", "description", "recipientName", "originalDocumentId", "createdBy"],
        threshold: 0.3,
        ignoreLocation: true
    }), [payments]);
    
    const confirmCancel = () => { 
        if (idToDelete) {
            const { cancel } = usePaymentStore.getState();
            cancel(idToDelete);
            toast.success("Đã hủy phiếu chi");
        }
        setIsAlertOpen(false); 
    };

    const confirmBulkCancel = () => {
        const idsToCancel = Object.keys(rowSelection);
        const { cancel } = usePaymentStore.getState();
        idsToCancel.forEach(id => cancel(id));
        toast.success(`Đã hủy ${idsToCancel.length} phiếu chi`);
        setRowSelection({});
        setIsBulkDeleteAlertOpen(false);
    };

    const confirmBulkApprove = () => {
        const idsToApprove = Object.keys(rowSelection);
        const { update } = usePaymentStore.getState();
        idsToApprove.forEach(id => {
            const payment = payments.find(p => p.systemId === id);
            if (payment) {
                update(id, { ...payment, status: 'approved' });
            }
        });
        toast.success(`Đã duyệt ${idsToApprove.length} phiếu chi`);
        setRowSelection({});
        setIsBulkApproveAlertOpen(false);
    };

    const handleAddNew = () => {
        navigate(ROUTES.FINANCE.PAYMENT_NEW);
    };
    
    // ✅ Filter options
    const statusOptions = React.useMemo(() => [
        { value: 'pending', label: 'Chờ duyệt' },
        { value: 'approved', label: 'Đã duyệt' },
        { value: 'cancelled', label: 'Đã hủy' }
    ], []);
    
    const typeOptions = React.useMemo(() => 
        paymentTypes.map(pt => ({ value: pt.systemId, label: pt.name }))
    , [paymentTypes]);
    
    const customerOptions = React.useMemo(() => 
        customers.map(c => ({ value: c.systemId, label: c.name }))
    , [customers]);
    
    // ✅ Apply all filters
    const filteredData = React.useMemo(() => {
        let result = payments;
        
        // Branch filter
        if (branchFilter && branchFilter !== 'all') {
            result = result.filter(r => r.branchSystemId === branchFilter);
        }
        
        // Status filter
        if (statusFilter.size > 0) {
            result = result.filter(r => statusFilter.has(r.status || 'pending'));
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
    }, [payments, branchFilter, statusFilter, typeFilter, customerFilter, dateRange, debouncedGlobalFilter, fuse]);
    
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
            // Payments always decrease balance
            balance -= voucher.amount;
            return { ...voucher, runningBalance: balance };
        });
    }, [filteredData]);
    
    // ✅ Status badge variant
    const getStatusVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'approved': return 'default';
            case 'pending': return 'secondary';
            case 'cancelled': return 'destructive';
            default: return 'outline';
        }
    };
    
    // ✅ Status label
    const getStatusLabel = (status?: string): string => {
        switch (status) {
            case 'approved': return 'Đã duyệt';
            case 'pending': return 'Chờ duyệt';
            case 'cancelled': return 'Đã hủy';
            default: return 'Chưa rõ';
        }
    };
    
    // ✅ Mobile card component
    const MobilePaymentCard = ({ payment }: { payment: Payment }) => {
        const branch = branches.find(b => b.systemId === payment.branchSystemId);
        const paymentType = paymentTypes.find(pt => pt.systemId === payment.paymentReceiptTypeSystemId);
        
        return (
            <Card 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(generatePath(ROUTES.FINANCE.PAYMENT_VIEW, { systemId: payment.systemId }))}
            >
                <CardContent className="p-4">
                    {/* Header: Icon + ID + Status + Menu */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Avatar className="h-8 w-8 flex-shrink-0 bg-red-100">
                                <AvatarFallback className="bg-red-100 text-red-700">
                                    <CreditCard className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <h3 className="font-semibold text-sm">{payment.id}</h3>
                                <Badge variant={getStatusVariant(payment.status)} className="text-xs">
                                    {getStatusLabel(payment.status)}
                                </Badge>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <TouchButton
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 flex-shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </TouchButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(generatePath(ROUTES.FINANCE.PAYMENT_VIEW, { systemId: payment.systemId })); }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(payment); }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCancel(payment.systemId); }} className="text-red-600">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Hủy phiếu
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Amount + Date */}
                    <div className="mb-3">
                        <div className="text-lg font-bold text-red-600">{formatCurrency(payment.amount)}</div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1.5" />
                            {formatDate(payment.date)}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t mb-3" />

                    {/* Details */}
                    <div className="space-y-2">
                        {payment.recipientName && (
                            <div className="flex items-center text-xs text-muted-foreground">
                                <User className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                <span className="truncate">{payment.recipientName}</span>
                            </div>
                        )}
                        {paymentType && (
                            <div className="flex items-center text-xs text-muted-foreground">
                                <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                <span className="truncate">{paymentType.name}</span>
                            </div>
                        )}
                        {branch && (
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                <span className="truncate">{branch.name}</span>
                            </div>
                        )}
                        {payment.description && (
                            <div className="text-xs text-muted-foreground italic mt-2 line-clamp-2">
                                {payment.description}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
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
      payments.filter(v => rowSelection[v.systemId]),
    [payments, rowSelection]);

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
                                allData={payments} 
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
                searchPlaceholder="Tìm theo mã phiếu, người nhận, chứng từ..."
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
                                Không tìm thấy phiếu chi nào
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {sortedData.slice(0, mobileLoadedCount).map(payment => (
                                <MobilePaymentCard 
                                    key={payment.systemId} 
                                    payment={payment}
                                    onCancel={handleCancel}
                                    onApprove={handleApprove}
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
                                        Đã hiển thị tất cả {sortedData.length} phiếu chi
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
                    bulkActionButtons={
                        Object.keys(rowSelection).length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsBulkApproveAlertOpen(true)}
                                className="border-green-500 text-green-700 hover:bg-green-50"
                            >
                                Duyệt {Object.keys(rowSelection).length} phiếu
                            </Button>
                        )
                    }
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
                    onRowClick={(payment) => navigate(generatePath(ROUTES.FINANCE.PAYMENT_VIEW, { systemId: payment.systemId }))}
                    renderMobileCard={(payment) => (
                        <MobilePaymentCard 
                            payment={payment}
                            onCancel={handleCancel}
                            onApprove={handleApprove}
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
                        <AlertDialogTitle>Hủy phiếu chi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Phiếu chi sẽ được chuyển sang trạng thái "Đã hủy". Bạn có thể xem lại phiếu đã hủy trong danh sách.
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
                        <AlertDialogTitle>Hủy {Object.keys(rowSelection).length} phiếu chi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Các phiếu chi sẽ được chuyển sang trạng thái "Đã hủy".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Đóng</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmBulkCancel}>Hủy tất cả</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bulk Approve Alert Dialog */}
            <AlertDialog open={isBulkApproveAlertOpen} onOpenChange={setIsBulkApproveAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Duyệt {Object.keys(rowSelection).length} phiếu chi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tất cả phiếu chi đã chọn sẽ được duyệt và chuyển sang trạng thái "Hoàn thành".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmBulkApprove} className="bg-green-600 hover:bg-green-700">
                            Duyệt tất cả
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
