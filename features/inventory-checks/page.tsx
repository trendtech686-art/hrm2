'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../lib/router';
import { useInventoryCheckStore } from './store';
import { getColumns } from './columns';
import { InventoryCheckCard } from './card';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { DataTableFacetedFilter } from '../../components/data-table/data-table-faceted-filter';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle';
import { DataTableExportDialog } from '../../components/data-table/data-table-export-dialog';
import { PageToolbar } from '../../components/layout/page-toolbar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { usePageHeader } from '../../contexts/page-header-context';
import { useBreakpoint } from '../../contexts/breakpoint-context';
import { useAuth } from '../../contexts/auth-context';
import { Plus, Download, Printer, XCircle, Scale, FileSpreadsheet } from 'lucide-react';
import { GenericImportDialogV2 } from '../../components/shared/generic-import-dialog-v2';
import { GenericExportDialogV2 } from '../../components/shared/generic-export-dialog-v2';
import { inventoryCheckImportExportConfig, flattenInventoryChecksForExport } from '../../lib/import-export/configs/inventory-check.config';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';
import { toast } from 'sonner';
import Fuse from 'fuse.js';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import type { InventoryCheck } from '@/lib/types/prisma-extended';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { usePrint } from '../../lib/use-print';
import { useBranchStore } from '../settings/branches/store';
import { 
  convertInventoryCheckForPrint,
  mapInventoryCheckToPrintData,
  mapInventoryCheckLineItems,
  createStoreSettings,
} from '../../lib/print/inventory-check-print-helper';

type ConfirmState =
  | { type: 'cancel'; item: InventoryCheck }
  | { type: 'balance'; item: InventoryCheck }
  | { type: 'bulk-cancel'; items: InventoryCheck[] }
  | { type: 'bulk-balance'; items: InventoryCheck[] }
  | null;

export function InventoryChecksPage() {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const { employee: currentUser } = useAuth();
  const { data, balanceCheck, cancelCheck } = useInventoryCheckStore();
  const { info: storeInfo } = useStoreInfoStore();
  const { findById: findBranchById, data: branches } = useBranchStore();
  const { print, printMultiple } = usePrint();

  // Print dialog state
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintItems, setPendingPrintItems] = React.useState<InventoryCheck[]>([]);

  // Import/Export dialog state
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  // States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState({ id: 'createdAt', desc: true });
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [confirmState, setConfirmState] = React.useState<ConfirmState>(null);
  const [isConfirmLoading, setIsConfirmLoading] = React.useState(false);

  // Handlers
  const handleEdit = React.useCallback((item: InventoryCheck) => {
    router.push(ROUTES.INVENTORY.INVENTORY_CHECK_EDIT.replace(':systemId', item.systemId));
  }, [router]);

  const requestCancel = React.useCallback((item: InventoryCheck) => {
    if (item.status !== 'draft') {
      toast.info('Chỉ có thể hủy phiếu đang ở trạng thái Nháp');
      return;
    }
    setConfirmState({ type: 'cancel', item });
  }, []);
  const requestBalance = React.useCallback((item: InventoryCheck) => {
    setConfirmState({ type: 'balance', item });
  }, []);

  const handlePrint = React.useCallback((item: InventoryCheck) => {
    // Use helper to prepare print data
    const branch = findBranchById(item.branchSystemId);
    const storeSettings = branch 
      ? {
          name: branch.name,
          address: branch.address || '',
          phone: branch.phone || '',
          email: '',
          province: branch.province || '',
        }
      : createStoreSettings(storeInfo);
    const checkData = convertInventoryCheckForPrint(item, { branch });
    
    print('inventory-check', {
      data: mapInventoryCheckToPrintData(checkData, storeSettings),
      lineItems: mapInventoryCheckLineItems(checkData.items),
    });
  }, [findBranchById, storeInfo, print]);

  const handleConfirmAction = React.useCallback(async () => {
    if (!confirmState) return;
    setIsConfirmLoading(true);
    try {
      if (confirmState.type === 'cancel' && confirmState.item) {
        cancelCheck(asSystemId(confirmState.item.systemId), 'Hủy từ danh sách');
        toast.success(`Đã hủy phiếu ${confirmState.item.id}`);
      }

      if (confirmState.type === 'balance' && confirmState.item) {
        await balanceCheck(asSystemId(confirmState.item.systemId));
        toast.success(`Đã cân bằng phiếu ${confirmState.item.id}`);
      }

      if (confirmState.type === 'bulk-cancel' && confirmState.items) {
        let successCount = 0;
        confirmState.items.forEach(item => {
          if (item.status === 'draft') {
            cancelCheck(asSystemId(item.systemId), 'Hủy hàng loạt');
            successCount++;
          }
        });
        setRowSelection({});
        if (successCount > 0) {
          toast.success(`Đã hủy ${successCount} phiếu kiểm hàng`);
        } else {
          toast.info('Không có phiếu nào được hủy', {
            description: 'Chỉ có thể hủy các phiếu đang ở trạng thái Nháp'
          });
        }
      }

      if (confirmState.type === 'bulk-balance' && confirmState.items) {
        let successCount = 0;
        for (const item of confirmState.items) {
          if (item.status === 'draft') {
            await balanceCheck(asSystemId(item.systemId));
            successCount++;
          }
        }
        setRowSelection({});
        if (successCount > 0) {
          toast.success(`Đã cân bằng ${successCount} phiếu kiểm hàng`);
        } else {
          toast.info('Không có phiếu nào được cân bằng', {
            description: 'Chỉ có thể cân bằng các phiếu đang ở trạng thái Nháp'
          });
        }
      }
    } catch (error) {
      toast.error('Không thể hoàn tất hành động, vui lòng thử lại');
    } finally {
      setIsConfirmLoading(false);
      setConfirmState(null);
    }
  }, [balanceCheck, cancelCheck, confirmState, setRowSelection]);

  // Columns
  const columns = React.useMemo(() => 
    getColumns(handleEdit, requestCancel, requestBalance, router, handlePrint),
    [handleEdit, router, requestCancel, requestBalance, handlePrint]
  );

  // Default column visibility - 15 columns for sticky scrollbar
  React.useEffect(() => {
    if (!columns || columns.length === 0) return;
    
    const defaultVisibleColumns = [
      'id', 'branch', 'status', 'createdAt', 'createdBy', 
      'balancedAt', 'itemsCount', 'systemQty', 'actualQty', 
      'difference', 'itemPreview', 'note'
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

  // Search & Filter with Fuse.js
  const fuse = React.useMemo(() => new Fuse(data, { 
    keys: ['id', 'branchName', 'createdBy', 'note'],
    threshold: 0.3,
  }), [data]);

  const filteredData = React.useMemo(() => {
    let result = data;
    
    // Search
    if (searchQuery) {
      result = fuse.search(searchQuery).map(r => r.item);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Sorting
    if (sorting) {
      result = [...result].sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        // Special handling for date columns
        if (sorting.id === 'createdAt' || sorting.id === 'checkDate') {
          const aTime = aValue ? new Date(aValue).getTime() : 0;
          const bTime = bValue ? new Date(bValue).getTime() : 0;
          return sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    
    return result;
  }, [data, searchQuery, statusFilter, sorting, fuse]);

  // Pagination
  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return filteredData.slice(start, start + pagination.pageSize);
  }, [filteredData, pagination]);

  // Mobile infinite scroll
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [searchQuery, statusFilter]);

  React.useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      const scrollPercentage = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
      if (scrollPercentage > 80 && mobileLoadedCount < filteredData.length) {
        setMobileLoadedCount(prev => Math.min(prev + 20, filteredData.length));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, filteredData.length]);

  const displayData = isMobile ? filteredData.slice(0, mobileLoadedCount) : paginatedData;

  // Selected rows
  const allSelectedRows = React.useMemo(() => 
    Object.keys(rowSelection)
      .filter(key => rowSelection[key])
      .map(systemId => filteredData.find(item => item.systemId === systemId))
      .filter(Boolean) as InventoryCheck[],
    [rowSelection, filteredData]
  );

  // Selected checks for export
  const selectedChecks = React.useMemo(() => {
    return data.filter(c => rowSelection[c.systemId]);
  }, [data, rowSelection]);

  // Import handler
  const handleImport = React.useCallback(async (
    importedChecks: Partial<InventoryCheck>[],
    mode: 'insert-only' | 'update-only' | 'upsert',
    _branchId?: string
  ) => {
    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const errors: Array<{ row: number; message: string }> = [];
    
    const storeState = useInventoryCheckStore.getState();
    
    importedChecks.forEach((check, index) => {
      try {
        const existing = data.find(c => 
          c.id.toLowerCase() === (check.id || '').toLowerCase()
        );
        
        if (existing) {
          if (mode === 'update-only' || mode === 'upsert') {
            storeState.update(asSystemId(existing.systemId), { ...existing, ...check, systemId: existing.systemId } as InventoryCheck);
            updatedCount++;
          } else {
            skippedCount++;
          }
        } else {
          if (mode === 'insert-only' || mode === 'upsert') {
            storeState.add(check as InventoryCheck);
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
      if (addedCount > 0) messages.push(`${addedCount} phiếu kiểm kê mới`);
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
  }, [data]);

  // Bulk print - open dialog
  const handleBulkPrint = React.useCallback(() => {
    if (allSelectedRows.length === 0) return;
    setPendingPrintItems(allSelectedRows);
    setIsPrintDialogOpen(true);
  }, [allSelectedRows]);

  // Handle print confirm from dialog
  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    const { branchSystemId, paperSize } = options;
    
    const printOptionsList = pendingPrintItems.map(item => {
      const branch = branchSystemId 
        ? findBranchById(branchSystemId)
        : findBranchById(item.branchSystemId);
      const storeSettings = branch 
        ? {
            name: branch.name,
            address: branch.address || '',
            phone: branch.phone || '',
            email: '',
            province: branch.province || '',
          }
        : createStoreSettings(storeInfo);
      const checkData = convertInventoryCheckForPrint(item, { branch });
      
      return {
        data: mapInventoryCheckToPrintData(checkData, storeSettings),
        lineItems: mapInventoryCheckLineItems(checkData.items),
        paperSize,
      };
    });
    
    printMultiple('inventory-check', printOptionsList);
    
    toast.success('Đã gửi lệnh in', {
      description: pendingPrintItems.map(i => i.id).join(', ')
    });
    setRowSelection({});
    setPendingPrintItems([]);
  }, [pendingPrintItems, findBranchById, storeInfo, printMultiple]);

  // Bulk cancel
  const handleBulkCancel = React.useCallback(() => {
    if (allSelectedRows.length === 0) return;
    const draftItems = allSelectedRows.filter(item => item.status === 'draft');
    if (draftItems.length === 0) {
      toast.info('Không có phiếu nào có thể hủy', {
        description: 'Chỉ có thể hủy các phiếu đang ở trạng thái Nháp'
      });
      return;
    }
    setConfirmState({ type: 'bulk-cancel', items: draftItems });
  }, [allSelectedRows]);

  // Bulk balance
  const handleBulkBalance = React.useCallback(() => {
    if (allSelectedRows.length === 0) return;
    const draftItems = allSelectedRows.filter(item => item.status === 'draft');
    if (draftItems.length === 0) {
      toast.info('Không có phiếu nào có thể cân bằng', {
        description: 'Chỉ có thể cân bằng các phiếu đang ở trạng thái Nháp'
      });
      return;
    }
    setConfirmState({ type: 'bulk-balance', items: draftItems });
  }, [allSelectedRows]);

  // Bulk actions
  const bulkActions = React.useMemo(() => [
    {
      label: 'In phiếu kiểm',
      icon: Printer,
      onSelect: handleBulkPrint,
    },
    {
      label: 'Cân bằng',
      icon: Scale,
      onSelect: handleBulkBalance,
    },
    {
      label: 'Hủy phiếu',
      icon: XCircle,
      onSelect: handleBulkCancel,
      variant: 'destructive' as const,
    },
  ], [handleBulkPrint, handleBulkBalance, handleBulkCancel]);

  // Header actions - Chỉ giữ action chính
  const headerActions = React.useMemo(() => [
    <Button key="add" className="h-9" onClick={() => router.push(ROUTES.INVENTORY.INVENTORY_CHECK_NEW)}>
      <Plus className="mr-2 h-4 w-4" />
      Tạo phiếu kiểm hàng
    </Button>
  ], [router]);

  const confirmDialogCopy = React.useMemo(() => {
    if (!confirmState) return null;

    switch (confirmState.type) {
      case 'cancel':
        return {
          title: 'Hủy phiếu kiểm hàng',
          description: `Bạn có chắc muốn hủy phiếu ${confirmState.item?.id}? Phiếu sẽ chuyển sang trạng thái Đã hủy.`,
          confirmLabel: 'Hủy phiếu',
        };
      case 'balance':
        return {
          title: 'Cân bằng phiếu kiểm hàng',
          description: `Sau khi cân bằng, tồn kho hệ thống sẽ cập nhật theo số thực tế của phiếu ${confirmState.item?.id}. Tiếp tục?`,
          confirmLabel: 'Cân bằng ngay',
        };
      case 'bulk-cancel':
        return {
          title: 'Hủy nhiều phiếu kiểm hàng',
          description: `Bạn sắp hủy ${confirmState.items?.length ?? 0} phiếu kiểm hàng đã chọn. Chỉ các phiếu đang ở trạng thái Nháp mới được hủy.`,
          confirmLabel: `Hủy ${confirmState.items?.length ?? 0} phiếu`,
        };
      case 'bulk-balance':
        return {
          title: 'Cân bằng nhiều phiếu kiểm hàng',
          description: `Bạn sắp cân bằng ${confirmState.items?.length ?? 0} phiếu kiểm hàng. Tồn kho hệ thống sẽ được cập nhật theo số thực tế.`,
          confirmLabel: `Cân bằng ${confirmState.items?.length ?? 0} phiếu`,
        };
      default:
        return null;
    }
  }, [confirmState]);

  usePageHeader({
    title: 'Danh sách kiểm hàng',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.DASHBOARD, isCurrent: false },
      { label: 'Kiểm hàng', href: ROUTES.INVENTORY.INVENTORY_CHECKS, isCurrent: true }
    ],
    actions: headerActions,
  });

  return (
    <div className="space-y-4">
      {/* Toolbar - Export và Column Customizer */}
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
          rightActions={
            columns && columns.length > 0 ? (
              <DataTableColumnCustomizer 
                columns={columns}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                pinnedColumns={pinnedColumns}
                setPinnedColumns={setPinnedColumns}
              />
            ) : null
          }
        />
      )}

      {/* Search & Filters */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <Input 
          placeholder="Tìm kiếm theo mã, chi nhánh, người tạo..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 max-w-sm"
        />
        <DataTableFacetedFilter
          title="Trạng thái"
          selectedValues={new Set(statusFilter === 'all' ? [] : [statusFilter])}
          onSelectedValuesChange={(values) => setStatusFilter(values.size === 0 ? 'all' : Array.from(values)[0] as string)}
          options={[
            { label: 'Nháp', value: 'draft' },
            { label: 'Đã cân bằng', value: 'balanced' },
            { label: 'Đã hủy', value: 'cancelled' },
          ]}
        />
      </div>

      {/* Data Table */}
      <ResponsiveDataTable
        columns={columns}
        data={displayData}
        renderMobileCard={(item) => (
          <InventoryCheckCard 
            item={item} 
            onEdit={handleEdit}
            onBalance={requestBalance}
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
        sorting={sorting}
        setSorting={setSorting}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
        emptyTitle="Không có phiếu kiểm hàng"
        emptyDescription="Tạo phiếu kiểm hàng đầu tiên để bắt đầu"
      />

      {/* Mobile loading indicator */}
      {isMobile && mobileLoadedCount < filteredData.length && (
        <div className="py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-body-sm">Đang tải thêm...</span>
          </div>
        </div>
      )}
      
      {isMobile && mobileLoadedCount >= filteredData.length && filteredData.length > 20 && (
        <div className="py-6 text-center">
          <p className="text-body-sm text-muted-foreground">
            Đã hiển thị tất cả {filteredData.length} kết quả
          </p>
        </div>
      )}

      <AlertDialog open={!!confirmState} onOpenChange={(open) => {
        if (!open && !isConfirmLoading) {
          setConfirmState(null);
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
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-9"
              disabled={isConfirmLoading}
              onClick={handleConfirmAction}
            >
              {isConfirmLoading ? 'Đang xử lý...' : confirmDialogCopy?.confirmLabel ?? 'Đồng ý'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Options Dialog */}
      <SimplePrintOptionsDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        onConfirm={handlePrintConfirm}
        selectedCount={pendingPrintItems.length}
        title="In phiếu kiểm hàng"
      />

      {/* Import Dialog */}
      <GenericImportDialogV2<InventoryCheck>
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        config={inventoryCheckImportExportConfig}
        branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))}
        existingData={data}
        onImport={handleImport}
        currentUser={{
          name: currentUser?.fullName || 'Hệ thống',
          systemId: currentUser?.systemId || asSystemId('SYSTEM'),
        }}
      />

      {/* Export Dialog */}
      <GenericExportDialogV2<InventoryCheck>
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        config={inventoryCheckImportExportConfig}
        allData={data}
        filteredData={filteredData}
        currentPageData={paginatedData}
        selectedData={selectedChecks}
        currentUser={{
          name: currentUser?.fullName || 'Hệ thống',
          systemId: currentUser?.systemId || asSystemId('SYSTEM'),
        }}
      />
    </div>
  );
}
