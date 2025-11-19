import * as React from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/router.ts';
import { formatDateCustom, parseDate, isDateAfter, isDateBefore } from '../../lib/date-utils.ts';
import { usePurchaseReturnStore } from "./store.ts";
import { usePurchaseOrderStore } from "../purchase-orders/store.ts";
import { useBranchStore } from "../settings/branches/store.ts";
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx";
import { DataTableDateFilter } from "../../components/data-table/data-table-date-filter.tsx";
import { PageFilters } from "../../components/layout/page-filters.tsx";
import { Card, CardContent } from "../../components/ui/card.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.tsx";
import { useMediaQuery } from "../../lib/use-media-query.ts";
import { PackageX, Building2, User, Calendar, FileText, Plus, Printer } from "lucide-react";
import Fuse from "fuse.js";
import type { ColumnDef } from "../../components/data-table/types.ts";
import type { PurchaseReturn } from "./types.ts";
import { Checkbox } from "../../components/ui/checkbox.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog.tsx";
import { ScrollArea } from "../../components/ui/scroll-area.tsx";
import { useToast } from "../../hooks/use-toast.ts";

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getColumns = (onPrint: (purchaseReturn: PurchaseReturn) => void): ColumnDef<PurchaseReturn>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll(!!value)}
          aria-label="Chọn tất cả"
        />
      </div>
    ),
    cell: ({ isSelected, onToggleSelect }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Chọn dòng"
        />
      </div>
    ),
    size: 48,
    meta: {
      displayName: "Chọn",
      sticky: "left",
    },
  },
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Mã phiếu trả',
    cell: ({ row }) => (
      <span className="font-medium text-primary">{row.id}</span>
    ),
    meta: { displayName: 'Mã phiếu trả' },
    size: 120,
  },
  {
    id: 'returnDate',
    accessorKey: 'returnDate',
    header: 'Ngày trả',
    cell: ({ row }) => formatDateCustom(parseDate(row.returnDate)!, 'dd/MM/yyyy'),
    meta: { displayName: 'Ngày trả' },
    size: 120,
  },
  {
    id: 'purchaseOrderId',
    accessorKey: 'purchaseOrderId',
    header: 'Đơn nhập hàng',
    cell: ({ row }) => row.purchaseOrderId,
    meta: { displayName: 'Đơn nhập hàng' },
    size: 140,
  },
  {
    id: 'supplierName',
    accessorKey: 'supplierName',
    header: 'Nhà cung cấp',
    cell: ({ row }) => row.supplierName,
    meta: { displayName: 'Nhà cung cấp' },
  },
  {
    id: 'branchName',
    accessorKey: 'branchName',
    header: 'Chi nhánh',
    cell: ({ row }) => row.branchName,
    meta: { displayName: 'Chi nhánh' },
    size: 150,
  },
  {
    id: 'totalQuantity',
    header: 'Tổng SL',
    cell: ({ row }) => {
      const total = row.items.reduce((sum, item) => sum + item.returnQuantity, 0);
      return <span className="font-medium">{total}</span>;
    },
    meta: { displayName: 'Tổng SL' },
    size: 100,
  },
  {
    id: 'totalReturnValue',
    accessorKey: 'totalReturnValue',
    header: 'Giá trị trả',
    cell: ({ row }) => (
      <span className="font-semibold text-orange-600">
        {formatCurrency(row.totalReturnValue)}
      </span>
    ),
    meta: { displayName: 'Giá trị trả' },
    size: 150,
  },
  {
    id: 'refundAmount',
    accessorKey: 'refundAmount',
    header: 'Tiền hoàn',
    cell: ({ row }) => (
      <span className="font-semibold text-green-600">
        {formatCurrency(row.refundAmount)}
      </span>
    ),
    meta: { displayName: 'Tiền hoàn' },
    size: 150,
  },
  {
    id: 'creatorName',
    accessorKey: 'creatorName',
    header: 'Người tạo',
    cell: ({ row }) => row.creatorName,
    meta: { displayName: 'Người tạo' },
    size: 150,
  },
  {
    id: 'reason',
    accessorKey: 'reason',
    header: 'Lý do',
    cell: ({ row }) => (
      <span className="text-xs max-w-xs line-clamp-2">
        {row.reason || '-'}
      </span>
    ),
    meta: { displayName: 'Lý do' },
    size: 200,
  },
  {
    id: 'refundMethod',
    accessorKey: 'refundMethod',
    header: 'Hình thức hoàn',
    cell: ({ row }) => row.refundMethod || '-',
    meta: { displayName: 'Hình thức hoàn' },
    size: 150,
  },
  {
    id: 'itemsCount',
    header: 'Số mặt hàng',
    cell: ({ row }) => (
      <span className="font-medium">{row.items.length}</span>
    ),
    meta: { displayName: 'Số mặt hàng' },
    size: 120,
  },
  {
    id: 'productNames',
    header: 'Sản phẩm',
    cell: ({ row }) => {
      const firstProduct = row.items[0]?.productName || '';
      const remaining = row.items.length - 1;
      return (
        <span className="text-xs">
          {firstProduct}
          {remaining > 0 && ` +${remaining}`}
        </span>
      );
    },
    meta: { displayName: 'Sản phẩm' },
    size: 200,
  },
  {
    id: 'accountSystemId',
    accessorKey: 'accountSystemId',
    header: 'Tài khoản',
    cell: ({ row }) => row.accountSystemId || '-',
    meta: { displayName: 'Tài khoản' },
    size: 120,
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-9"
        onClick={(e) => {
          e.stopPropagation();
          onPrint(row);
        }}
      >
        <Printer className="h-4 w-4 mr-1" />
        In
      </Button>
    ),
    size: 120,
    meta: {
      displayName: 'Hành động',
      sticky: 'right',
    },
  },
];

export function PurchaseReturnsPage() {
  const { data: purchaseReturns } = usePurchaseReturnStore();
  const { data: allPurchaseOrders } = usePurchaseOrderStore();
  const { data: branches } = useBranchStore();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const [printDialogState, setPrintDialogState] = React.useState<{
    mode: 'single' | 'bulk';
    entries: PurchaseReturn[];
  } | null>(null);
  
  const openPrintDialog = React.useCallback((entries: PurchaseReturn[], mode: 'single' | 'bulk') => {
    setPrintDialogState({ mode, entries });
  }, []);

  const handleRowPrint = React.useCallback((entry: PurchaseReturn) => {
    openPrintDialog([entry], 'single');
  }, [openPrintDialog]);
  
  // Set page header
  const headerActions = React.useMemo(() => [
    <Button 
      key="create" 
      size="sm" 
      className="h-9"
      onClick={() => navigate(ROUTES.PROCUREMENT.PURCHASE_RETURN_NEW)}
    >
      <Plus className="mr-2 h-4 w-4" />
      Tạo phiếu trả hàng
    </Button>
  ], [navigate]);

  usePageHeader({
    title: 'Danh sách phiếu trả NCC',
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Trả hàng nhập', href: ROUTES.PROCUREMENT.PURCHASE_RETURNS, isCurrent: true }
    ]
  });

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'returnDate', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [supplierFilter, setSupplierFilter] = React.useState('all');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'purchase-returns-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns((_pr: PurchaseReturn) => undefined);
    const allColumnIds = cols.map(c => c.id).filter(Boolean);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (allColumnIds.every(id => id in parsed)) return parsed;
      } catch (e) {}
    }
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  });
  
  React.useEffect(() => {
    localStorage.setItem('purchase-returns-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  const columns = React.useMemo(() => getColumns(handleRowPrint), [handleRowPrint]);
  
  React.useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      initialVisibility[c.id!] = true;
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, []);
  
  const fuse = React.useMemo(
    () => new Fuse(purchaseReturns, { 
      keys: ["id", "supplierName", "creatorName", "purchaseOrderId", "branchName"],
      threshold: 0.3,
      ignoreLocation: true
    }), 
    [purchaseReturns]
  );
  
  // Reset mobile loaded count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [debouncedGlobalFilter, supplierFilter, branchFilter, dateRange]);

  // Mobile infinite scroll
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const filteredCount = filteredData.length;
      if (scrollTop + clientHeight >= scrollHeight * 0.8 && mobileLoadedCount < filteredCount) {
        setMobileLoadedCount(prev => Math.min(prev + 20, filteredCount));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount]);
  
  const filteredData = React.useMemo(() => {
    let data = purchaseReturns;

    // Apply supplier filter
    if (supplierFilter !== 'all') {
      data = data.filter(pr => pr.supplierSystemId === supplierFilter);
    }

    // Apply branch filter
    if (branchFilter !== 'all') {
      data = data.filter(pr => pr.branchSystemId === branchFilter);
    }

    // Apply date range filter
    if (dateRange && (dateRange[0] || dateRange[1])) {
      data = data.filter(pr => {
        const returnDate = parseDate(pr.returnDate);
        if (!returnDate) return false;
        
        const fromDate = dateRange[0] ? new Date(dateRange[0]) : null;
        const toDate = dateRange[1] ? new Date(dateRange[1]) : null;
        
        if (fromDate && isDateBefore(returnDate, fromDate)) return false;
        if (toDate && isDateAfter(returnDate, toDate)) return false;
        return true;
      });
    }

    // Apply search filter (debounced)
    if (debouncedGlobalFilter) {
      const searchResults = fuse.search(debouncedGlobalFilter);
      return searchResults.map(r => r.item);
    }

    return data;
  }, [purchaseReturns, supplierFilter, branchFilter, dateRange, debouncedGlobalFilter, fuse]);
  
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aVal = (a as any)[sorting.id];
        const bVal = (b as any)[sorting.id];
        if (aVal === bVal) return 0;
        if (aVal < bVal) return sorting.desc ? 1 : -1;
        if (aVal > bVal) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sorting]);

  const handleRowClick = (row: PurchaseReturn) => {
    navigate(`${ROUTES.PROCUREMENT.PURCHASE_RETURNS}/${row.systemId}`);
  };

  const selectedRows = React.useMemo(() => {
    return filteredData.filter(pr => rowSelection[pr.systemId]);
  }, [filteredData, rowSelection]);

  const dialogEntries = printDialogState?.entries ?? [];

  const handleClosePrintDialog = React.useCallback(() => {
    setPrintDialogState(null);
  }, []);

  const handleConfirmPrint = React.useCallback(() => {
    if (!printDialogState) return;
    const ids = printDialogState.entries.map(entry => entry.id).join(', ');
    toast({
      title: 'Đã gửi lệnh in',
      description: printDialogState.mode === 'bulk'
        ? `Đang in ${printDialogState.entries.length} phiếu trả: ${ids}.`
        : `Đang in phiếu trả ${printDialogState.entries[0]?.id}.`
    });
    if (printDialogState.mode === 'bulk') {
      setRowSelection({});
    }
    setPrintDialogState(null);
  }, [printDialogState, toast]);

  // Bulk actions handlers
  const handleBulkPrint = React.useCallback(() => {
    if (selectedRows.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Chưa chọn phiếu trả',
        description: 'Vui lòng chọn ít nhất một phiếu trước khi in.'
      });
      return;
    }
    openPrintDialog(selectedRows, 'bulk');
  }, [openPrintDialog, selectedRows, toast]);

  const bulkActions = [
    {
      label: "In phiếu trả",
      icon: Printer,
      onSelect: handleBulkPrint
    }
  ];

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  const { totalReturnValue, totalRefundAmount, totalQuantity } = React.useMemo(() => {
    const totalReturnValue = filteredData.reduce((sum, pr) => sum + pr.totalReturnValue, 0);
    const totalRefundAmount = filteredData.reduce((sum, pr) => sum + pr.refundAmount, 0);
    const totalQuantity = filteredData.reduce((sum, pr) => {
      return sum + pr.items.reduce((itemSum, item) => itemSum + item.returnQuantity, 0);
    }, 0);
    
    return { totalReturnValue, totalRefundAmount, totalQuantity };
  }, [filteredData]);

  // Supplier options
  const supplierOptions = React.useMemo(() => {
    const uniqueSuppliers = new Map();
    purchaseReturns.forEach(pr => {
      if (!uniqueSuppliers.has(pr.supplierSystemId)) {
        uniqueSuppliers.set(pr.supplierSystemId, pr.supplierName);
      }
    });
    return Array.from(uniqueSuppliers.entries()).map(([id, name]) => ({ id, name }));
  }, [purchaseReturns]);

  // Mobile card component
  const MobileReturnCard = ({ purchaseReturn }: { purchaseReturn: PurchaseReturn }) => {
    const totalQty = purchaseReturn.items.reduce((sum, item) => sum + item.returnQuantity, 0);
    
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleRowClick(purchaseReturn)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                <PackageX className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{purchaseReturn.id}</h3>
                  <p className="text-xs text-muted-foreground">
                    {formatDateCustom(parseDate(purchaseReturn.returnDate)!, 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 mt-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{purchaseReturn.supplierName}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{purchaseReturn.branchName}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                  <span className="truncate">ĐH: {purchaseReturn.purchaseOrderId}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t">
                <div className="text-xs">
                  <span className="text-muted-foreground">SL: </span>
                  <span className="font-semibold">{totalQty}</span>
                </div>
                <div className="text-xs">
                  <span className="text-orange-600 font-semibold">
                    {formatCurrency(purchaseReturn.totalReturnValue)}
                  </span>
                </div>
                {purchaseReturn.refundAmount > 0 && (
                  <div className="text-xs">
                    <span className="text-green-600 font-semibold">
                      Hoàn: {formatCurrency(purchaseReturn.refundAmount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
    <div className="space-y-4 flex flex-col h-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng phiếu trả</p>
            <p className="text-xl font-semibold">{filteredData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng SL trả</p>
            <p className="text-xl font-semibold text-orange-600">{totalQuantity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng giá trị hàng trả</p>
            <p className="text-xl font-semibold text-orange-600">
              {formatCurrency(totalReturnValue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng tiền đã hoàn</p>
            <p className="text-xl font-semibold text-green-600">
              {formatCurrency(totalRefundAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm theo mã phiếu, NCC, đơn hàng..."
      >
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[180px]">
            <SelectValue placeholder="Chi nhánh" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả chi nhánh</SelectItem>
            {branches.map(b => (
              <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[200px]">
            <SelectValue placeholder="Nhà cung cấp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả NCC</SelectItem>
            {supplierOptions.map(s => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DataTableDateFilter
          value={dateRange}
          onChange={setDateRange}
          title="Ngày trả hàng"
        />
      </PageFilters>

      {/* Mobile View - Cards with Infinite Scroll */}
      {isMobile ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {sortedData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Không tìm thấy phiếu trả hàng nào.
                </CardContent>
              </Card>
            ) : (
              sortedData.slice(0, mobileLoadedCount).map((pr) => (
                <MobileReturnCard key={pr.systemId} purchaseReturn={pr} />
              ))
            )}
          </div>

          {/* Loading indicator & End message */}
          {sortedData.length > 0 && (
            <div className="py-6 text-center">
              {mobileLoadedCount < sortedData.length ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-sm">Đang tải thêm...</span>
                </div>
              ) : sortedData.length > 20 ? (
                <p className="text-sm text-muted-foreground">
                  Đã hiển thị tất cả {sortedData.length} phiếu trả hàng
                </p>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        /* Desktop View - ResponsiveDataTable */
        <ResponsiveDataTable
          columns={columns}
          data={paginatedData}
          renderMobileCard={(row) => <MobileReturnCard purchaseReturn={row} />}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
          rowCount={sortedData.length}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          allSelectedRows={selectedRows}
          bulkActions={bulkActions}
          showBulkDeleteButton={false}
          expanded={expanded}
          setExpanded={setExpanded}
          sorting={sorting}
          setSorting={setSorting}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          pinnedColumns={pinnedColumns}
          setPinnedColumns={setPinnedColumns}
        />
      )}
    </div>

    <Dialog open={!!printDialogState} onOpenChange={(open) => {
      if (!open) {
        handleClosePrintDialog();
      }
    }}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {printDialogState?.mode === 'bulk'
              ? `In ${dialogEntries.length} phiếu trả`
              : dialogEntries[0]
                ? `In phiếu trả ${dialogEntries[0].id}`
                : 'Xem trước phiếu trả'}
          </DialogTitle>
          <DialogDescription>
            Kiểm tra nhanh thông tin trước khi in. Nội dung dưới đây chỉ mang tính tham khảo trước khi mở cửa sổ in thực tế.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-1">
          <div className="space-y-4">
            {dialogEntries.map((entry) => (
              <div key={entry.systemId} className="rounded-md border p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-base">{entry.id}</p>
                    <p className="text-xs text-muted-foreground">
                      Ngày trả: {formatDateCustom(parseDate(entry.returnDate)!, 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Giá trị hàng trả</p>
                    <p className="font-semibold text-orange-600">{formatCurrency(entry.totalReturnValue)}</p>
                    {entry.refundAmount > 0 && (
                      <p className="text-xs text-green-600">Hoàn: {formatCurrency(entry.refundAmount)}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <p>Nhà cung cấp: <span className="text-foreground font-medium">{entry.supplierName}</span></p>
                  <p>Chi nhánh: <span className="text-foreground font-medium">{entry.branchName}</span></p>
                  <p>Đơn nhập: <span className="text-foreground font-medium">{entry.purchaseOrderId}</span></p>
                  <p>Người tạo: <span className="text-foreground font-medium">{entry.creatorName}</span></p>
                </div>
                <div className="rounded-md bg-muted/50 p-3 space-y-1 text-sm">
                  {entry.items.slice(0, 3).map((item) => (
                    <div key={`${entry.systemId}-${item.productSystemId}`} className="flex items-center justify-between gap-2">
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-xs text-muted-foreground">{item.returnQuantity} x {formatCurrency(item.unitPrice)}</span>
                    </div>
                  ))}
                  {entry.items.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{entry.items.length - 3} sản phẩm khác...</p>
                  )}
                </div>
              </div>
            ))}
            {dialogEntries.length === 0 && (
              <p className="text-sm text-muted-foreground px-2">Chưa có phiếu nào được chọn.</p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" className="h-9" onClick={handleClosePrintDialog}>Đóng</Button>
          <Button className="h-9" onClick={handleConfirmPrint} disabled={!dialogEntries.length}>
            In ngay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
