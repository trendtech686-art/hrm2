import * as React from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/router.ts';
import { formatDate, formatDateCustom, parseDate, isDateAfter, isDateBefore, getDaysDiff } from '../../lib/date-utils.ts';
import { useInventoryReceiptStore } from "./store.ts";
import { usePurchaseOrderStore } from "../purchase-orders/store.ts";
import { useSupplierStore } from "../suppliers/store.ts";
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx";
import { DataTableDateFilter } from "../../components/data-table/data-table-date-filter.tsx";
import { PageFilters } from "../../components/layout/page-filters.tsx";
import { Card, CardContent } from "../../components/ui/card.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.tsx";
import { Button } from "../../components/ui/button.tsx";
import { useMediaQuery } from "../../lib/use-media-query.ts";
import { Package, Calendar as CalendarIcon, Users, FileText, Printer } from "lucide-react";
import Fuse from "fuse.js";
import type { ColumnDef } from "../../components/data-table/types.ts";
import type { InventoryReceipt } from "./types.ts";
import { Checkbox } from "../../components/ui/checkbox.tsx";
import { useBranchStore } from "../settings/branches/store.ts";
import { toast } from "sonner";

const getColumns = (
  handlers: {
    onPrint: (receipt: InventoryReceipt) => void;
  }
): ColumnDef<InventoryReceipt>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ isSelected, onToggleSelect }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Select row"
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
    header: 'Mã phiếu',
    cell: ({ row }) => (
      <span className="font-medium text-primary">{row.id}</span>
    ),
    meta: { displayName: 'Mã phiếu' },
    size: 120,
  },
  {
    id: 'receivedDate',
    accessorKey: 'receivedDate',
    header: 'Ngày nhập',
    cell: ({ row }) => formatDateCustom(parseDate(row.receivedDate)!, 'dd/MM/yyyy HH:mm'),
    meta: { displayName: 'Ngày nhập' },
    size: 150,
  },
  {
    id: 'supplierName',
    accessorKey: 'supplierName',
    header: 'Nhà cung cấp',
    cell: ({ row }) => row.supplierName,
    meta: { displayName: 'Nhà cung cấp' },
  },
  {
    id: 'purchaseOrderId',
    accessorKey: 'purchaseOrderId',
    header: 'Đơn mua hàng',
    cell: ({ row }) => row.purchaseOrderId,
    meta: { displayName: 'Đơn mua hàng' },
    size: 140,
  },
  {
    id: 'totalQuantity',
    header: 'Tổng SL nhập',
    cell: ({ row }) => {
      const total = row.items.reduce((sum, item) => sum + Number(item.receivedQuantity), 0);
      return <span className="font-medium">{total}</span>;
    },
    meta: { displayName: 'Tổng SL nhập' },
    size: 120,
  },
  {
    id: 'receiverName',
    accessorKey: 'receiverName',
    header: 'Người nhận',
    cell: ({ row }) => row.receiverName,
    meta: { displayName: 'Người nhận' },
    size: 150,
  },
  {
    id: 'notes',
    accessorKey: 'notes',
    header: 'Ghi chú',
    cell: ({ row }) => (
      <span className="text-xs max-w-xs line-clamp-2">
        {row.notes || '-'}
      </span>
    ),
    meta: { displayName: 'Ghi chú' },
    size: 200,
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
    id: 'totalValue',
    header: 'Tổng giá trị',
    cell: ({ row }) => {
      const total = row.items.reduce((sum, item) => 
        sum + (item.receivedQuantity * item.unitPrice), 0
      );
      return (
        <span className="font-semibold">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
        </span>
      );
    },
    meta: { displayName: 'Tổng giá trị' },
    size: 150,
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8"
        onClick={(e) => {
          e.stopPropagation();
          handlers.onPrint(row);
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

export function InventoryReceiptsPage() {
  const { data: receipts } = useInventoryReceiptStore();
  const { data: allPurchaseOrders } = usePurchaseOrderStore();
  const { data: suppliers } = useSupplierStore();
  const { data: branches } = useBranchStore();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  usePageHeader({
    title: 'Danh sách phiếu nhập kho',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.DASHBOARD, isCurrent: false },
      { label: 'Phiếu nhập kho', href: ROUTES.PROCUREMENT.INVENTORY_RECEIPTS, isCurrent: true }
    ],
    actions: []
  });

  // Không cần combine nữa, chỉ dùng receipts
  const filteredDataBase = React.useMemo(() => {
    return [...receipts].sort((a, b) => 
      getDaysDiff(parseDate(b.receivedDate), parseDate(a.receivedDate))
    );
  }, [receipts]);

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'receivedDate', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [supplierFilter, setSupplierFilter] = React.useState('all');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const columnVisibilityStorageKey = 'inventory-receipts-column-visibility';
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(columnVisibilityStorageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return {};
  });
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(columnVisibilityStorageKey, JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  const handlePrintReceipt = React.useCallback((receipt: InventoryReceipt) => {
    toast.info('Đang gửi lệnh in', {
      description: `Phiếu ${receipt.id} - ${receipt.supplierName}`
    });
  }, []);

  const columns = React.useMemo(() => getColumns({ onPrint: handlePrintReceipt }), [handlePrintReceipt]);
  
  React.useEffect(() => {
    if (!columns.length) return;
    setColumnVisibility(prev => {
      const next = { ...prev };
      let changed = false;
      columns.forEach(c => {
        if (!c.id) return;
        if (typeof next[c.id] === 'undefined') {
          next[c.id] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    setColumnOrder(prev => {
      if (prev.length) return prev;
      return columns.map(c => c.id).filter(Boolean) as string[];
    });
  }, [columns]);
  
  const fuse = React.useMemo(
    () => new Fuse(filteredDataBase, { 
      keys: ["id", "supplierName", "receiverName", "purchaseOrderId"],
      threshold: 0.3,
      ignoreLocation: true
    }), 
    [filteredDataBase]
  );
  
  const filteredData = React.useMemo(() => {
    let data = filteredDataBase;

    if (supplierFilter !== 'all') {
      data = data.filter(v => v.supplierSystemId === supplierFilter);
    }

    if (branchFilter !== 'all') {
      data = data.filter(v => v.branchSystemId === branchFilter);
    }

    if (dateRange && (dateRange[0] || dateRange[1])) {
      data = data.filter(v => {
        const voucherDate = parseDate(v.receivedDate);
        if (!voucherDate) return false;
        
        const fromDate = dateRange[0] ? new Date(dateRange[0]) : null;
        const toDate = dateRange[1] ? new Date(dateRange[1]) : null;
        
        if (fromDate && isDateBefore(voucherDate, fromDate)) return false;
        if (toDate && isDateAfter(voucherDate, toDate)) return false;
        return true;
      });
    }

    if (debouncedGlobalFilter) {
      const searchResults = fuse.search(debouncedGlobalFilter);
      return searchResults.map(r => r.item);
    }

    return data;
  }, [filteredDataBase, supplierFilter, branchFilter, dateRange, debouncedGlobalFilter, fuse]);

  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [debouncedGlobalFilter, supplierFilter, branchFilter, dateRange]);

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
  }, [isMobile, mobileLoadedCount, filteredData]);
  
  const sortedData = React.useMemo(() => {
    let sorted = [...filteredData];
    if (sorting && sorting.id) {
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

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  const handleRowClick = React.useCallback((row: InventoryReceipt) => {
    navigate(ROUTES.PROCUREMENT.INVENTORY_RECEIPT_VIEW.replace(':systemId', row.systemId));
  }, [navigate]);

  const selectedRows = React.useMemo(() => {
    return sortedData.filter(r => rowSelection[r.systemId]);
  }, [sortedData, rowSelection]);

  // Bulk actions handlers
  const handleBulkPrint = React.useCallback(() => {
    if (selectedRows.length === 0) return;
    toast.success('Đã gửi lệnh in cho phiếu nhập', {
      description: selectedRows.map(r => r.id).join(', ')
    });
    setRowSelection({});
  }, [selectedRows]);

  const bulkActions = [
    {
      label: "In phiếu nhập",
      icon: Printer,
      onSelect: handleBulkPrint
    }
  ];

  const receiptStats = React.useMemo(() => {
    const totalReceipts = filteredData.length;
    const totalQuantity = filteredData.reduce((sum, r) => {
      return sum + r.items.reduce((itemSum, item) => itemSum + item.receivedQuantity, 0);
    }, 0);
    return { totalReceipts, totalQuantity };
  }, [filteredData]);

  const supplierOptions = React.useMemo(() => {
    const supplierMap = new Map<string, string>();
    filteredDataBase.forEach(r => {
      if (r.supplierSystemId) {
        supplierMap.set(r.supplierSystemId, r.supplierName);
      }
    });

    suppliers.forEach(s => {
      if (filteredDataBase.some(r => r.supplierSystemId === s.systemId)) {
        supplierMap.set(s.systemId, s.name);
      }
    });

    return Array.from(supplierMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredDataBase, suppliers]);

  const branchOptions = React.useMemo(() => {
    const branchMap = new Map<string, string>();
    filteredDataBase.forEach(r => {
      if (r.branchSystemId) {
        branchMap.set(r.branchSystemId, r.branchName || branches.find(b => b.systemId === r.branchSystemId)?.name || 'Chưa gắn chi nhánh');
      }
    });

    return Array.from(branchMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredDataBase, branches]);

  const MobileReceiptCard = ({ receipt }: { receipt: InventoryReceipt }) => {
    const totalQuantity = receipt.items.reduce((sum, item) => sum + item.receivedQuantity, 0);
    
    return (
      <Card className="mb-4 cursor-pointer hover:border-primary" onClick={() => handleRowClick(receipt)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <Package className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-base mb-1">{receipt.id}</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{formatDate(receipt.receivedDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{receipt.supplierName}</span>
                  </div>
                  {receipt.purchaseOrderId && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>Đơn: {receipt.purchaseOrderId}</span>
                    </div>
                  )}
                  {receipt.receiverName && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Người nhận: {receipt.receiverName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-base">
                {totalQuantity} SP
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng phiếu nhập</p>
            <p className="text-xl font-semibold text-green-600">{receiptStats.totalReceipts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng số lượng nhập</p>
            <p className="text-xl font-semibold text-blue-600">{receiptStats.totalQuantity} SP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Đang hiển thị</p>
            <p className="text-xl font-semibold">{filteredData.length} / {receipts.length}</p>
          </CardContent>
        </Card>
      </div>

      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm theo mã phiếu, NCC, đơn hàng..."
      >
        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[200px]">
            <SelectValue placeholder="Nhà cung cấp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả NCC</SelectItem>
            {supplierOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[200px]">
            <SelectValue placeholder="Chi nhánh" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả chi nhánh</SelectItem>
            {branchOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DataTableDateFilter
          value={dateRange}
          onChange={setDateRange}
          title="Ngày nhập hàng"
        />
      </PageFilters>

      {isMobile ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {sortedData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Không tìm thấy phiếu nào.
                </CardContent>
              </Card>
            ) : (
              sortedData.slice(0, mobileLoadedCount).map((r) => (
                <MobileReceiptCard key={r.systemId} receipt={r} />
              ))
            )}
          </div>

          {sortedData.length > 0 && (
            <div className="py-6 text-center">
              {mobileLoadedCount < sortedData.length ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-sm">Đang tải thêm...</span>
                </div>
              ) : sortedData.length > 20 ? (
                <p className="text-sm text-muted-foreground">
                  Đã hiển thị tất cả {sortedData.length} phiếu
                </p>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <ResponsiveDataTable
          columns={columns}
          data={paginatedData}
          renderMobileCard={(row) => <MobileReceiptCard receipt={row} />}
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
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
}