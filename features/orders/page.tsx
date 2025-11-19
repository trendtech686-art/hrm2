import * as React from "react"
// FIX: Use named imports for react-router-dom to fix module export errors.
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrderStore } from "./store.ts"
import { getColumns } from "./columns.tsx"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx"
import { DataTableFacetedFilter } from "../../components/data-table/data-table-faceted-filter.tsx"
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx"
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog.tsx"
import { DataTableImportDialog } from "../../components/data-table/data-table-import-dialog.tsx"
import type { ImportConfig } from "../../components/data-table/data-table-import-dialog.tsx"
import { 
  Card, 
  CardContent, 
} from "../../components/ui/card.tsx"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog.tsx"
import type { Order, OrderMainStatus, OrderPaymentStatus, OrderDeliveryStatus, OrderPrintStatus, OrderStockOutStatus, OrderReturnStatus } from "./types.ts"
import { Button } from "../../components/ui/button.tsx"
import { PlusCircle, Download, Upload, Trash2 } from "lucide-react"
import Fuse from "fuse.js"
import { usePageHeader } from "../../contexts/page-header-context.tsx"
import { useMediaQuery } from "../../lib/use-media-query.ts"
import { OrderCard } from "./order-card.tsx"
import { PageFilters } from "../../components/layout/page-filters.tsx"
import { PageToolbar } from "../../components/layout/page-toolbar.tsx"
// ✅ REMOVED: import { generateNextId } - not used in this file
// ✅ REMOVED: Unused imports - ProductQuickViewCard and OrderFormDialog (components don't exist and are never used)
import { toast } from "sonner"
import { useAuth } from "../../contexts/auth-context.tsx"
import { asBusinessId, asSystemId, type SystemId } from "../../lib/id-types.ts"


const statusOptions = (Object.keys({
    "Đặt hàng": "", "Đang giao dịch": "", "Hoàn thành": "", "Đã hủy": ""
}) as OrderMainStatus[]).map(status => ({
    value: status,
    label: status,
}));

export function OrdersPage() {
  const orderStore = useOrderStore();
  const orders: Order[] = orderStore.data ?? [];
  const navigate = useNavigate();
  const location = useLocation();
  const { employee: authEmployee } = useAuth();
  const currentEmployeeName = authEmployee?.fullName ?? 'Hệ thống';
  const currentEmployeeSystemId: SystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isCancelAlertOpen, setIsCancelAlertOpen] = React.useState(false)
  const [idToCancel, setIdToCancel] = React.useState<SystemId | null>(null)
  
  // Table state - Sort by systemId (newer orders have higher systemId)
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'systemId', desc: true });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'orders-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns(() => {}, () => {});
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
    localStorage.setItem('orders-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
  
  // Mobile infinite scroll
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status) {
      setStatusFilter(new Set([status]));
    }
  }, [location.search]);
  
  // Reset mobile count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [searchQuery, statusFilter]);

  const handleCancelRequest = React.useCallback((systemId: SystemId) => {
    setIdToCancel(systemId)
    setIsCancelAlertOpen(true)
  }, [])
  
  const columns = React.useMemo(() => getColumns(handleCancelRequest, navigate), [handleCancelRequest, navigate]);
  
  // Set default visible columns - 15+ để có sticky scrollbar
  React.useEffect(() => {
    const defaultVisibleColumns = [
      'id', 'customerName', 'orderDate', 'branchName', 'salesperson', 
      'grandTotal', 'totalPaid', 'debt', 'codAmount', 'status', 
      'paymentStatus', 'packagingStatus', 'deliveryStatus', 'printStatus', 'stockOutStatus'
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
  }, [columns]);

  const fuse = React.useMemo(() => new Fuse(orders, { 
    keys: ["id", "customerName", "salesperson"],
    threshold: 0.3 
  }), [orders]);
  
  const confirmCancel = () => {
    if (idToCancel) {
      orderStore.cancelOrder(idToCancel, currentEmployeeSystemId);
    }
    setIsCancelAlertOpen(false)
    setIdToCancel(null)
  }
  
  const filteredData = React.useMemo(() => {
    let data = orders;
    
    // Search
    if (searchQuery) {
      data = fuse.search(searchQuery).map(result => result.item);
    }
    
    // Status filter
    if (statusFilter.size > 0) {
      data = data.filter(order => statusFilter.has(order.status));
    }
    
    return data;
  }, [orders, searchQuery, fuse, statusFilter]);
  
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
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
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);
  
  // Mobile: Display data with infinite scroll
  const displayData = isMobile 
    ? sortedData.slice(0, mobileLoadedCount)
    : paginatedData;
  
  const allSelectedRows = React.useMemo(() => 
    sortedData.filter(o => rowSelection[o.systemId]),
  [sortedData, rowSelection]);
  
  // Mobile infinite scroll listener
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / documentHeight) * 100;

      if (scrollPercentage > 80 && mobileLoadedCount < sortedData.length) {
        setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, sortedData.length]);

  const handleRowClick = (row: Order) => {
    navigate(`/orders/${row.systemId}`);
  };
  
  const handleBulkDelete = React.useCallback(() => {
    if (allSelectedRows.length === 0) return;
    
    const confirmMessage = `Bạn có chắc muốn hủy ${allSelectedRows.length} đơn hàng đã chọn?`;
    if (!confirm(confirmMessage)) return;
    
    allSelectedRows.forEach(order => {
      (orderStore as any).cancelOrder(order.systemId, currentEmployeeSystemId);
    });
    
    setRowSelection({});
  }, [allSelectedRows, orderStore, currentEmployeeSystemId]);
  
  // Export config
  const exportConfig = {
    fileName: 'Danh_sach_Don_hang',
    columns,
  };

  // Import config
  const importConfig: ImportConfig<Order> = {
    importer: (items) => {
      const processed = items.map((item: any) => {
        const orderDate = item.orderDate ? new Date(item.orderDate) : new Date();

        if (!item.customerName) {
          throw new Error(`Dòng "${item.id || 'N/A'}": Thiếu tên khách hàng`);
        }

        if (!item.customerSystemId) {
          throw new Error(`Dòng "${item.id || 'N/A'}": Thiếu systemId khách hàng (customerSystemId)`);
        }

        if (!item.branchSystemId) {
          throw new Error(`Dòng "${item.id || 'N/A'}": Thiếu systemId chi nhánh (branchSystemId)`);
        }

        if (isNaN(orderDate.getTime())) {
          throw new Error(`Dòng "${item.id}": Định dạng ngày không hợp lệ`);
        }

        const validStatuses: OrderMainStatus[] = ['Đặt hàng', 'Đang giao dịch', 'Hoàn thành', 'Đã hủy'];
        if (item.status && !validStatuses.includes(item.status as OrderMainStatus)) {
          throw new Error(`Dòng "${item.id}": Trạng thái không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(', ')}`);
        }

        if (item.grandTotal && isNaN(Number(item.grandTotal))) {
          throw new Error(`Dòng "${item.id}": Tổng tiền phải là số`);
        }

        const branchSystemId = asSystemId(item.branchSystemId);
        const customerSystemId = asSystemId(item.customerSystemId);
        const salespersonSystemId = item.salespersonSystemId
          ? asSystemId(item.salespersonSystemId)
          : currentEmployeeSystemId;

        return {
          id: item.id ? asBusinessId(item.id) : asBusinessId(''),
          customerName: item.customerName || '',
          customerSystemId,
          orderDate: orderDate.toISOString(),
          branchName: item.branchName || '',
          branchSystemId,
          salesperson: item.salesperson || currentEmployeeName,
          salespersonSystemId,
          subtotal: Number(item.grandTotal) || 0,
          shippingFee: 0,
          tax: 0,
          grandTotal: Number(item.grandTotal) || 0,
          totalPaid: 0,
          paidAmount: 0,
          debt: Number(item.grandTotal) || 0,
          codAmount: 0,
          status: (item.status as OrderMainStatus) || 'Đặt hàng',
          paymentStatus: 'Chưa thanh toán' as OrderPaymentStatus,
          packagingStatus: 'Chưa đóng gói',
          deliveryStatus: 'Chờ đóng gói' as OrderDeliveryStatus,
          printStatus: 'Chưa in' as OrderPrintStatus,
          stockOutStatus: 'Chưa xuất kho' as OrderStockOutStatus,
          returnStatus: 'Chưa trả hàng' as OrderReturnStatus,
          source: item.source || 'Import',
          notes: item.notes || '',
          lineItems: [],
          deliveryMethod: 'Dịch vụ giao hàng',
          payments: [],
          packagings: [],
          createdAt: new Date().toISOString(),
          createdBy: currentEmployeeSystemId,
          updatedAt: new Date().toISOString(),
          updatedBy: currentEmployeeSystemId,
        };
      });
      
      // Add to store - Dùng addMultiple để auto-generate systemId
      const typedProcessed = processed.map(item => item as Omit<Order, 'systemId'>);
      orderStore.addMultiple(typedProcessed);
      toast.success(`Đã nhập ${processed.length} đơn hàng thành công`);
    },
    fileName: 'Mau_Nhap_Don_hang',
    existingData: orders,
    getUniqueKey: (item: any) => item.id
  };
  
  // Header actions - Chỉ còn nút Tạo đơn hàng
  const actions = React.useMemo(() => [
    <Button key="add" onClick={() => navigate('/orders/new')}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Tạo đơn hàng
    </Button>
  ], [navigate]);
  
  usePageHeader({ actions });

  return (
    <>
      {/* HÀNG 2: TOOLBAR - Export/Import/Column Customizer (Desktop only) */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <>
              <DataTableImportDialog config={importConfig} />
              <DataTableExportDialog 
                allData={orders} 
                filteredData={sortedData} 
                pageData={paginatedData} 
                config={exportConfig} 
              />
            </>
          }
          rightActions={
            <DataTableColumnCustomizer
              columns={columns}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns}
              setPinnedColumns={setPinnedColumns}
            />
          }
        />
      )}

      {/* HÀNG 3: FILTERS - Search & Status Filter */}
      <PageFilters
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm kiếm đơn hàng..."
      >
        <DataTableFacetedFilter
          title="Trạng thái"
          selectedValues={statusFilter}
          onSelectedValuesChange={setStatusFilter}
          options={[
            { label: 'Đặt hàng', value: 'Đặt hàng' },
            { label: 'Đang giao dịch', value: 'Đang giao dịch' },
            { label: 'Hoàn thành', value: 'Hoàn thành' },
            { label: 'Đã hủy', value: 'Đã hủy' },
          ]}
        />
      </PageFilters>

      {/* Data Table - Không có padding wrapper */}
      <div className="pb-4">
        <ResponsiveDataTable
        columns={columns}
        data={displayData}
        renderMobileCard={(order) => (
          <OrderCard 
            order={order} 
            onCancel={handleCancelRequest}
          />
        )}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={sortedData.length}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        allSelectedRows={allSelectedRows}
        onBulkDelete={handleBulkDelete}
        sorting={sorting}
        setSorting={setSorting}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
        onRowClick={handleRowClick}
        emptyTitle="Không có đơn hàng"
        emptyDescription="Tạo đơn hàng đầu tiên để bắt đầu"
      />
      </div>
      
      {/* Mobile loading indicator */}
      {isMobile && (
        <div className="py-6 text-center">
          {mobileLoadedCount < sortedData.length ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm">Đang tải thêm...</span>
            </div>
          ) : sortedData.length > 20 ? (
            <p className="text-sm text-muted-foreground">
              Đã hiển thị tất cả {sortedData.length} kết quả
            </p>
          ) : null}
        </div>
      )}
      
      {/* Cancel Alert Dialog */}
      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn hủy đơn hàng?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ chuyển trạng thái của đơn hàng thành "Đã hủy". Nếu đơn đã được thanh toán, một phiếu chi hoàn tiền sẽ được tạo tự động.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Thoát</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Xác nhận hủy</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
