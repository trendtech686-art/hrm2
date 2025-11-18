import * as React from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/router.ts';
import { formatDate, formatDateCustom, parseDate, isDateAfter, isDateBefore, getDaysDiff } from '../../lib/date-utils.ts';
import { useInventoryReceiptStore } from "./store.ts";
import { usePurchaseOrderStore } from "../purchase-orders/store.ts";
import { useSupplierStore } from "../suppliers/store.ts";
import { useEmployeeStore } from "../employees/store.ts";
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

const getColumns = (): ColumnDef<InventoryReceipt>[] => [
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
        onClick={(e) => {
          e.stopPropagation();
          alert(`In phiếu nhập: ${row.id}`);
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
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  usePageHeader({
    title: 'Quản lý Phiếu Nhập Kho',
    actions: []
  });

  // Không cần combine nữa, chỉ dùng receipts
  const filteredDataBase = React.useMemo(() => {
    return receipts.sort((a, b) => 
      getDaysDiff(parseDate(b.receivedDate), parseDate(a.receivedDate))
    );
  }, [receipts]);

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'receivedDate', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [supplierFilter, setSupplierFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'inventory-receipts-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns();
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
    localStorage.setItem('inventory-receipts-column-visibility', JSON.stringify(columnVisibility));
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

  const columns = React.useMemo(() => getColumns(), []);
  
  React.useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      initialVisibility[c.id!] = true;
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, []);
  
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
      data = data.filter(v => v.supplierName === supplierFilter);
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
  }, [filteredDataBase, supplierFilter, dateRange, debouncedGlobalFilter, fuse]);

  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [debouncedGlobalFilter, supplierFilter, dateRange]);

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

  const handleRowClick = (row: InventoryReceipt) => {
    console.log('Receipt clicked:', row);
  };

  const selectedRows = React.useMemo(() => {
    return sortedData.filter(r => rowSelection[r.systemId]);
  }, [sortedData, rowSelection]);

  // Bulk actions handlers
  const handleBulkPrint = React.useCallback(() => {
    if (selectedRows.length === 0) return;
    console.log('🖨️ In phiếu nhập kho:', selectedRows.map(r => r.id));
    alert(`Đang in ${selectedRows.length} phiếu nhập kho: ${selectedRows.map(r => r.id).join(', ')}`);
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
    const uniqueSuppliers = new Set<string>();
    filteredDataBase.forEach(r => uniqueSuppliers.add(r.supplierName));
    return Array.from(uniqueSuppliers).map(name => ({ value: name, label: name }));
  }, [filteredDataBase]);

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