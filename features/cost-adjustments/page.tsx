import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCostAdjustmentStore } from './store.ts';
import { getColumns, getStatusOptions } from './columns.tsx';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table.tsx';
import { DataTableFacetedFilter } from '../../components/data-table/data-table-faceted-filter.tsx';
import { DataTableExportDialog } from '../../components/data-table/data-table-export-dialog.tsx';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { ROUTES } from '../../lib/router.ts';
import { Button } from '../../components/ui/button.tsx';
import { Plus, XCircle, CheckCircle, Printer } from 'lucide-react';
import { PageToolbar } from '../../components/layout/page-toolbar.tsx';
import { PageFilters } from '../../components/layout/page-filters.tsx';
import { useMediaQuery } from '../../lib/use-media-query.ts';
import { toast } from 'sonner';
import Fuse from 'fuse.js';
import { CostAdjustmentCard } from './cost-adjustment-card.tsx';
import type { CostAdjustment, CostAdjustmentStatus } from './types.ts';
import { formatDate, isValidDate, isDateAfter, isDateBefore, isDateSame, isDateBetween, getStartOfDay, getEndOfDay } from '../../lib/date-utils.ts';
import { useAuth } from '../../contexts/auth-context.tsx';
import { asSystemId } from '../../lib/id-types.ts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog.tsx';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog.tsx';
import { usePrint } from '../../lib/use-print.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { convertCostAdjustmentForPrint, mapCostAdjustmentToPrintData, mapCostAdjustmentLineItems } from '../../lib/print/cost-adjustment-print-helper.ts';
import { useStoreInfoStore } from '../settings/store-info/store-info-store.ts';

const COLUMN_LAYOUT_STORAGE_KEY = 'cost-adjustments-column-layout';

type StoredColumnLayout = {
  visibility?: Record<string, boolean>;
  order?: string[];
  pinned?: string[];
};

const readStoredColumnLayout = (): StoredColumnLayout | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(COLUMN_LAYOUT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as StoredColumnLayout;
    }
  } catch (error) {
    console.warn('Failed to parse cost-adjustments column layout from storage:', error);
  }
  return null;
};

export function CostAdjustmentListPage() {
  const storedLayoutRef = React.useRef(readStoredColumnLayout());
  const navigate = useNavigate();
  const { data: adjustments, cancel, confirm } = useCostAdjustmentStore();
  const { employee } = useAuth();
  const isMobile = !useMediaQuery("(min-width: 768px)");
  
  // Print
  const { print, printMultiple } = usePrint();
  const { data: branches, findById: getBranchById } = useBranchStore();
  const { info: storeInfo } = useStoreInfoStore();
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<CostAdjustment[]>([]);

  // Single print handler (for dropdown action)
  const handleSinglePrint = React.useCallback((adjustment: CostAdjustment) => {
    const storeSettings = {
      name: storeInfo?.companyName || storeInfo?.brandName || '',
      address: storeInfo?.headquartersAddress || '',
      phone: storeInfo?.hotline || '',
      email: storeInfo?.email || '',
      website: storeInfo?.website,
      taxCode: storeInfo?.taxCode,
      province: storeInfo?.province,
      logo: storeInfo?.logo,
    };
    const printData = convertCostAdjustmentForPrint(adjustment, {
      creatorName: adjustment.createdByName,
    });
    print('cost-adjustment', {
      data: mapCostAdjustmentToPrintData(printData, storeSettings),
      lineItems: mapCostAdjustmentLineItems(printData.items),
    });
  }, [storeInfo, print]);

  // Columns memoized with callbacks
  const columns = React.useMemo(
    () => getColumns(navigate, handleSinglePrint),
    [navigate, handleSinglePrint]
  );
  
  // Confirm dialog state
  const [confirmDialogState, setConfirmDialogState] = React.useState<{
    type: 'bulk-cancel' | 'bulk-confirm';
    items: CostAdjustment[];
  } | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = React.useState(false);
  
  // Table state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  
  // Filters
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [dateFilter, setDateFilter] = React.useState<[string | undefined, string | undefined] | undefined>();

  // Column customization state
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(
    () => storedLayoutRef.current?.visibility ?? {}
  );
  const [columnOrder, setColumnOrder] = React.useState<string[]>(
    () => storedLayoutRef.current?.order ?? []
  );
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(
    () => storedLayoutRef.current?.pinned ?? []
  );

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Save column layout
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = {
      visibility: columnVisibility,
      order: columnOrder,
      pinned: pinnedColumns,
    };
    window.localStorage.setItem(COLUMN_LAYOUT_STORAGE_KEY, JSON.stringify(payload));
  }, [columnVisibility, columnOrder, pinnedColumns]);

  // Page header
  const headerActions = React.useMemo(() => [
    <Button key="add" className="h-9" onClick={() => navigate('/cost-adjustments/new')}>
      <Plus className="mr-2 h-4 w-4" />
      Tạo phiếu điều chỉnh
    </Button>
  ], [navigate]);

  usePageHeader({
    title: 'Danh sách điều chỉnh giá vốn',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT, isCurrent: false },
      { label: 'Điều chỉnh giá vốn', href: '/cost-adjustments', isCurrent: true },
    ],
    actions: headerActions,
    showBackButton: false,
  });

  // Column defaults
  const buildDefaultVisibility = React.useCallback(() => {
    const defaultVisibleColumns = new Set([
      'id', 'referenceCode', 'createdDate', 'status', 'itemCount', 
      'totalOldValue', 'totalNewValue', 'difference', 'createdByName', 'reason'
    ]);
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      if (!c.id) return;
      if (c.id === 'select' || c.id === 'actions') {
        initialVisibility[c.id] = true;
        return;
      }
      initialVisibility[c.id] = defaultVisibleColumns.has(c.id);
    });
    return initialVisibility;
  }, [columns]);

  const buildDefaultOrder = React.useCallback(() => (
    columns.map(c => c.id).filter(Boolean) as string[]
  ), [columns]);

  React.useEffect(() => {
    if (columns.length === 0) return;
    setColumnVisibility(prev => {
      if (Object.keys(prev).length > 0) return prev;
      return buildDefaultVisibility();
    });
    setColumnOrder(prev => {
      if (prev.length > 0) return prev;
      return buildDefaultOrder();
    });
    setPinnedColumns(prev => prev ?? []);
  }, [columns, buildDefaultOrder, buildDefaultVisibility]);

  const resetColumnLayout = React.useCallback(() => {
    setColumnVisibility(buildDefaultVisibility());
    setColumnOrder(buildDefaultOrder());
    setPinnedColumns([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(COLUMN_LAYOUT_STORAGE_KEY);
    }
    toast.success('Đã khôi phục bố cục cột mặc định');
  }, [buildDefaultVisibility, buildDefaultOrder]);

  // Fuse search
  const fuseInstance = React.useMemo(() => {
    return new Fuse(adjustments, {
      keys: ['id', 'createdByName', 'reason', 'referenceCode'],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [adjustments]);

  // Filter data
  const filteredData = React.useMemo(() => {
    let filtered = [...adjustments];

    // Status filter
    if (statusFilter.size > 0) {
      filtered = filtered.filter(a => statusFilter.has(a.status));
    }

    // Search filter
    if (debouncedGlobalFilter.trim()) {
      fuseInstance.setCollection(filtered);
      filtered = fuseInstance.search(debouncedGlobalFilter.trim()).map(r => r.item);
    }

    // Date filter
    if (dateFilter && (dateFilter[0] || dateFilter[1])) {
      const [start, end] = dateFilter;
      const startDate = start ? getStartOfDay(start) : null;
      const endDate = end ? getEndOfDay(end) : null;
      
      filtered = filtered.filter(a => {
        const rowDate = new Date(a.createdDate);
        if (!isValidDate(rowDate)) return false;
        if (startDate && !endDate) return isDateAfter(rowDate, startDate) || isDateSame(rowDate, startDate);
        if (!startDate && endDate) return isDateBefore(rowDate, endDate) || isDateSame(rowDate, endDate);
        if (startDate && endDate) return isDateBetween(rowDate, startDate, endDate);
        return true;
      });
    }

    return filtered;
  }, [adjustments, statusFilter, debouncedGlobalFilter, dateFilter, fuseInstance]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, [debouncedGlobalFilter, statusFilter, dateFilter]);

  // Sorting
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        // Special handling for date columns
        if (sorting.id === 'createdAt' || sorting.id === 'createdDate') {
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
  }, [filteredData, sorting]);

  // Pagination
  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  // Selection
  const allSelectedRows = React.useMemo(() =>
    adjustments.filter(a => rowSelection[a.systemId]),
  [adjustments, rowSelection]);

  // Bulk cancel handler
  const handleBulkCancel = React.useCallback(() => {
    if (allSelectedRows.length === 0) return;
    const draftItems = allSelectedRows.filter(item => item.status === 'draft');
    if (draftItems.length === 0) {
      toast.info('Không có phiếu nào có thể hủy', {
        description: 'Chỉ có thể hủy các phiếu đang ở trạng thái Nháp'
      });
      return;
    }
    setConfirmDialogState({ type: 'bulk-cancel', items: draftItems });
  }, [allSelectedRows]);

  // Bulk confirm handler
  const handleBulkConfirm = React.useCallback(() => {
    if (allSelectedRows.length === 0) return;
    const draftItems = allSelectedRows.filter(item => item.status === 'draft');
    if (draftItems.length === 0) {
      toast.info('Không có phiếu nào có thể xác nhận', {
        description: 'Chỉ có thể xác nhận các phiếu đang ở trạng thái Nháp'
      });
      return;
    }
    setConfirmDialogState({ type: 'bulk-confirm', items: draftItems });
  }, [allSelectedRows]);

  // Handle confirm action
  const handleConfirmDialogAction = React.useCallback(async () => {
    if (!confirmDialogState || !employee) return;
    setIsConfirmLoading(true);
    
    try {
      const userSystemId = asSystemId(employee.systemId);
      const userName = employee.fullName || 'Người dùng';
      
      if (confirmDialogState.type === 'bulk-cancel') {
        let successCount = 0;
        confirmDialogState.items.forEach(item => {
          if (cancel(asSystemId(item.systemId), userSystemId, userName, 'Hủy hàng loạt')) {
            successCount++;
          }
        });
        if (successCount > 0) {
          toast.success(`Đã hủy ${successCount} phiếu điều chỉnh`);
        }
      }
      
      if (confirmDialogState.type === 'bulk-confirm') {
        let successCount = 0;
        confirmDialogState.items.forEach(item => {
          if (confirm(asSystemId(item.systemId), userSystemId, userName)) {
            successCount++;
          }
        });
        if (successCount > 0) {
          toast.success(`Đã xác nhận ${successCount} phiếu điều chỉnh`);
        }
      }
      
      setRowSelection({});
    } catch (error) {
      toast.error('Không thể hoàn tất hành động');
    } finally {
      setIsConfirmLoading(false);
      setConfirmDialogState(null);
    }
  }, [confirmDialogState, employee, cancel, confirm]);

  // Bulk print handler
  const handleBulkPrint = React.useCallback(() => {
    if (allSelectedRows.length === 0) return;
    setItemsToPrint(allSelectedRows);
    setPrintDialogOpen(true);
  }, [allSelectedRows]);

  // Handle print confirm
  const handlePrintConfirm = React.useCallback((result: SimplePrintOptionsResult) => {
    if (itemsToPrint.length === 0) return;
    
    const branch = result.branchSystemId ? getBranchById(result.branchSystemId) : null;
    const storeSettings = {
      name: storeInfo?.companyName || storeInfo?.brandName || '',
      address: storeInfo?.headquartersAddress || '',
      phone: storeInfo?.hotline || '',
      email: storeInfo?.email || '',
      website: storeInfo?.website,
      taxCode: storeInfo?.taxCode,
      province: storeInfo?.province,
      logo: storeInfo?.logo,
    };

    const printOptionsList = itemsToPrint.map(adjustment => {
      const printData = convertCostAdjustmentForPrint(adjustment, { 
        branch,
        creatorName: adjustment.createdByName,
      });
      return {
        data: mapCostAdjustmentToPrintData(printData, storeSettings),
        lineItems: mapCostAdjustmentLineItems(printData.items),
        paperSize: result.paperSize,
      };
    });

    printMultiple('cost-adjustment', printOptionsList);
    setPrintDialogOpen(false);
    setItemsToPrint([]);
    setRowSelection({});
    toast.success(`Đang in ${itemsToPrint.length} phiếu điều chỉnh giá vốn`);
  }, [itemsToPrint, getBranchById, storeInfo, printMultiple]);

  // Bulk actions
  const bulkActions = React.useMemo(() => [
    {
      label: 'In phiếu',
      icon: Printer,
      onSelect: handleBulkPrint,
    },
    {
      label: 'Xác nhận',
      icon: CheckCircle,
      onSelect: handleBulkConfirm,
    },
    {
      label: 'Hủy phiếu',
      icon: XCircle,
      onSelect: handleBulkCancel,
      variant: 'destructive' as const,
    },
  ], [handleBulkPrint, handleBulkConfirm, handleBulkCancel]);

  // Confirm dialog copy
  const confirmDialogCopy = React.useMemo(() => {
    if (!confirmDialogState) return null;
    
    if (confirmDialogState.type === 'bulk-cancel') {
      return {
        title: 'Hủy nhiều phiếu điều chỉnh',
        description: `Bạn sắp hủy ${confirmDialogState.items.length} phiếu điều chỉnh giá vốn. Chỉ các phiếu đang ở trạng thái Nháp mới được hủy.`,
        confirmLabel: `Hủy ${confirmDialogState.items.length} phiếu`,
      };
    }
    
    if (confirmDialogState.type === 'bulk-confirm') {
      return {
        title: 'Xác nhận nhiều phiếu điều chỉnh',
        description: `Bạn sắp xác nhận ${confirmDialogState.items.length} phiếu điều chỉnh giá vốn. Sau khi xác nhận, giá vốn sản phẩm sẽ được cập nhật.`,
        confirmLabel: `Xác nhận ${confirmDialogState.items.length} phiếu`,
      };
    }
    
    return null;
  }, [confirmDialogState]);

  // Filter options
  const statusOptions = React.useMemo(() => [
    { value: 'draft', label: 'Nháp' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'cancelled', label: 'Đã hủy' },
  ], []);

  // Export config
  const exportConfig = {
    fileName: 'Danh_sach_dieu_chinh_gia_von',
    columns,
  };

  // Row click handler
  const handleRowClick = (row: CostAdjustment) => {
    navigate(`/cost-adjustments/${row.systemId}`);
  };

  // Actions for mobile card - navigate to detail page for confirm/cancel
  const handleConfirm = React.useCallback((systemId: string) => {
    navigate(`/cost-adjustments/${systemId}`);
    toast.info('Mở trang chi tiết để xác nhận phiếu');
  }, [navigate]);

  const handleCancel = React.useCallback((systemId: string) => {
    navigate(`/cost-adjustments/${systemId}`);
    toast.info('Mở trang chi tiết để hủy phiếu');
  }, [navigate]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* PageToolbar - Desktop only */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <DataTableExportDialog
              allData={adjustments}
              filteredData={sortedData}
              pageData={paginatedData}
              config={exportConfig}
            />
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
              onResetToDefault={resetColumnLayout}
            />
          }
        />
      )}

      {/* PageFilters */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm kiếm phiếu điều chỉnh..."
      >
        <DataTableFacetedFilter
          title="Trạng thái"
          options={statusOptions}
          selectedValues={statusFilter}
          onSelectedValuesChange={setStatusFilter}
        />
      </PageFilters>

      {/* Data Table */}
      <div className="w-full py-4">
        <ResponsiveDataTable
          columns={columns}
          data={paginatedData}
          renderMobileCard={(adjustment) => (
            <CostAdjustmentCard 
              adjustment={adjustment} 
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          )}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
          rowCount={filteredData.length}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          allSelectedRows={allSelectedRows}
          bulkActions={bulkActions}
          showBulkDeleteButton={false}
          expanded={expanded}
          setExpanded={setExpanded}
          sorting={sorting}
          setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          pinnedColumns={pinnedColumns}
          setPinnedColumns={setPinnedColumns}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={!!confirmDialogState} onOpenChange={(open) => {
        if (!open && !isConfirmLoading) {
          setConfirmDialogState(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialogCopy?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialogCopy?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9" disabled={isConfirmLoading}>
              Đóng
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-9"
              disabled={isConfirmLoading}
              onClick={handleConfirmDialogAction}
            >
              {isConfirmLoading ? 'Đang xử lý...' : confirmDialogCopy?.confirmLabel ?? 'Đồng ý'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Options Dialog */}
      <SimplePrintOptionsDialog
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        selectedCount={itemsToPrint.length}
        onConfirm={handlePrintConfirm}
        title="In phiếu điều chỉnh giá vốn"
      />
    </div>
  );
}
