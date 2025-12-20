'use client'

import * as React from "react"
import * as ReactRouterDOM from '@/lib/next-compat';
import { useSupplierStore } from "./store"
import { getColumns } from "./columns"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table"
import { PageToolbar } from "../../components/layout/page-toolbar"
import { PageFilters } from "../../components/layout/page-filters"
import {
  Card,
  CardContent,
} from "../../components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import type { Supplier } from "./types"
import { Button } from "../../components/ui/button"
import { PlusCircle, Trash2, FileSpreadsheet, Download } from "lucide-react"
import Fuse from "fuse.js"
import { usePageHeader } from "../../contexts/page-header-context";
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle";
import { SupplierCard } from "./supplier-card";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import { toast } from 'sonner';
import { asSystemId, type SystemId } from "@/lib/id-types";
import { GenericImportDialogV2 } from "../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../components/shared/generic-export-dialog-v2";
import { supplierImportExportConfig } from "../../lib/import-export/configs/supplier.config";
import { useBranchStore } from "../settings/branches/store";
import { useAuth } from "../../contexts/auth-context";

export function SuppliersPage() {
  const { data: suppliersRaw, remove, restore, getActive, getDeleted, updateStatus, bulkDelete, add, update } = useSupplierStore();
  const { data: branches } = useBranchStore();
  const { employee: currentUser } = useAuth();
  const navigate = ReactRouterDOM.useNavigate();
  const { isMobile } = useBreakpoint();
  
  // ✅ Import/Export dialogs
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  
  // ✅ Memoize suppliers để tránh unstable reference
  const suppliers = React.useMemo(() => suppliersRaw, [suppliersRaw]);
  
  // Calculate deleted count reactively
  const deletedCount = React.useMemo(() => 
    suppliers.filter((s: any) => s.isDeleted).length, 
    [suppliers]
  );
  
  // ✅ Mobile infinite scroll state
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  
  // ✅ Memoize headerActions để tránh infinite loop
  const headerActions = React.useMemo(() => [
    <Button 
      key="trash"
      variant="outline"
      size="sm"
      className="h-9 gap-2"
      onClick={() => navigate('/suppliers/trash')}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Thùng rác ({deletedCount})
    </Button>,
    <Button
      key="add"
      size="sm"
      className="h-9 gap-2"
      onClick={() => navigate('/suppliers/new')}
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Thêm nhà cung cấp
    </Button>
  ], [navigate, deletedCount]);
  
  usePageHeader({
    title: 'Nhà cung cấp',
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhà cung cấp', href: '/suppliers', isCurrent: true },
    ],
  });

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null)
  
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'suppliers-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns(() => {}, () => {}, () => {}, () => {});
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
    localStorage.setItem('suppliers-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  const handleDelete = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId)
    setIsAlertOpen(true)
  }, []);
  
  // ✅ Handle restore cho soft delete
  const handleRestore = React.useCallback((systemId: SystemId) => {
    const supplier = suppliers.find(s => s.systemId === systemId);
    restore(systemId);
    if (supplier) {
      toast.success(`Đã khôi phục nhà cung cấp "${supplier.name}"`);
    }
  }, [restore, suppliers]);

  const handleEdit = React.useCallback((supplier: Supplier) => {
    navigate(`/suppliers/${supplier.systemId}/edit`);
  }, [navigate]);

  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, handleEdit, navigate), [handleDelete, handleRestore, handleEdit, navigate]);
  
  // ✅ Run once on mount only
  React.useEffect(() => {
    const defaultVisibleColumns = [
      'id', 'name', 'taxCode', 'phone', 'email', 'address', 'website',
      'contactPerson', 'accountManager', 'currentDebt', 'bankAccount',
      'bankName', 'status', 'createdAt', 'updatedAt'
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
  }, []);

  // ✅ Cache active and deleted suppliers
  const activeSuppliers = React.useMemo(() => getActive(), [suppliers]);

  const fuse = React.useMemo(() => new Fuse(activeSuppliers, { keys: ["name", "taxCode", "phone", "email"] }), [activeSuppliers]);

  const confirmDelete = () => {
    if (idToDelete) {
      const supplier = suppliers.find(s => s.systemId === idToDelete);
      remove(idToDelete);
      if (supplier) {
        toast.success(`Đã chuyển nhà cung cấp "${supplier.name}" vào thùng rác`);
      }
    }
    setIsAlertOpen(false)
    setIdToDelete(null)
  }

  const handleAddNew = () => {
    navigate('/suppliers/new');
  };

  const filteredData = React.useMemo(() => {
    if (globalFilter) {
        return fuse.search(globalFilter).map(result => result.item);
    }
    return activeSuppliers;
  }, [activeSuppliers, globalFilter, fuse]);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        // Special handling for date columns
        if (sorting.id === 'createdAt') {
          const aTime = aValue ? new Date(aValue).getTime() : 0;
          const bTime = bValue ? new Date(bValue).getTime() : 0;
          // Nếu thời gian bằng nhau, sort theo systemId (ID mới hơn = số lớn hơn)
          if (aTime === bTime) {
            const aNum = parseInt(a.systemId.replace(/\D/g, '')) || 0;
            const bNum = parseInt(b.systemId.replace(/\D/g, '')) || 0;
            return sorting.desc ? bNum - aNum : aNum - bNum;
          }
          return sorting.desc ? bTime - aTime : aTime - bTime;
        }
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
  
  const allSelectedRows = React.useMemo(() => {
    return activeSuppliers.filter(s => rowSelection[s.systemId]);
  }, [activeSuppliers, rowSelection]);

  const handleRowClick = (supplier: Supplier) => {
    navigate(`/suppliers/${supplier.systemId}`);
  };

  // Bulk actions
  const handleBulkStatusChange = (status: Supplier['status']) => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    if (selectedIds.length === 0) {
      toast.error('Chưa chọn nhà cung cấp', {
        description: 'Vui lòng chọn ít nhất một nhà cung cấp',
      });
      return;
    }
    const systemIds = selectedIds.map(asSystemId);
    updateStatus(systemIds, status);
    setRowSelection({});
    toast.success(`Đã cập nhật trạng thái ${selectedIds.length} nhà cung cấp`);
  };

  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    if (selectedIds.length === 0) {
      toast.error('Chưa chọn nhà cung cấp', {
        description: 'Vui lòng chọn ít nhất một nhà cung cấp',
      });
      return;
    }
    const systemIds = selectedIds.map(asSystemId);
    bulkDelete(systemIds);
    setRowSelection({});
    toast.success(`Đã chuyển ${selectedIds.length} nhà cung cấp vào thùng rác`);
  };

  // ✅ Mobile infinite scroll - Reset khi filter thay đổi
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [globalFilter, sorting]);

  // ✅ Mobile infinite scroll - Load more on scroll
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Load more when 80% scrolled
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        setMobileLoadedCount(prev => {
          if (prev < sortedData.length) {
            return Math.min(prev + 20, sortedData.length);
          }
          return prev;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, sortedData.length]);

  // ✅ Display data - Desktop pagination or Mobile infinite scroll
  const displayData = React.useMemo(() => {
    if (isMobile) {
      return sortedData.slice(0, mobileLoadedCount);
    }
    return paginatedData;
  }, [isMobile, sortedData, mobileLoadedCount, paginatedData]);

  const bulkActions = [
    {
      label: "Đang giao dịch",
      onSelect: () => handleBulkStatusChange('Đang Giao Dịch')
    },
    {
      label: "Tạm ngừng",
      onSelect: () => handleBulkStatusChange('Ngừng Giao Dịch')
    },
    {
      label: "Chuyển vào thùng rác",
      onSelect: handleBulkDelete
    }
  ];

  // ✅ Import handler
  const handleImport = React.useCallback(async (
    importedSuppliers: Partial<Supplier>[], 
    mode: 'insert-only' | 'update-only' | 'upsert',
    _branchId?: string
  ) => {
    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const errors: Array<{ row: number; message: string }> = [];
    
    importedSuppliers.forEach((supplier, index) => {
      try {
        const existing = activeSuppliers.find(s => 
          s.id.toLowerCase() === (supplier.id || '').toLowerCase()
        );
        
        if (existing) {
          if (mode === 'update-only' || mode === 'upsert') {
            update(existing.systemId, { ...supplier, systemId: existing.systemId });
            updatedCount++;
          } else {
            skippedCount++;
          }
        } else {
          if (mode === 'insert-only' || mode === 'upsert') {
            add(supplier as Supplier);
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
      if (addedCount > 0) messages.push(`${addedCount} nhà cung cấp mới`);
      if (updatedCount > 0) messages.push(`${updatedCount} nhà cung cấp cập nhật`);
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
  }, [activeSuppliers, add, update]);

  // Get selected suppliers for export
  const selectedSuppliers = React.useMemo(() => {
    return activeSuppliers.filter(s => rowSelection[s.systemId]);
  }, [activeSuppliers, rowSelection]);

  return (
    <div className="space-y-4">
      {/* PageToolbar - Desktop only */}
      {!isMobile && (
        <PageToolbar
          rightActions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Nhập file
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
              <DataTableColumnCustomizer
                columns={columns}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                pinnedColumns={pinnedColumns}
                setPinnedColumns={setPinnedColumns}
              />
            </div>
          }
        />
      )}
      
      {/* Mobile Import/Export Buttons */}
      {isMobile && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Nhập
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
            <Download className="mr-2 h-4 w-4" />
            Xuất
          </Button>
        </div>
      )}

      {/* PageFilters */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm kiếm nhà cung cấp..."
      />

      <ResponsiveDataTable
        columns={columns}
        data={displayData}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={filteredData.length}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        sorting={sorting}
        setSorting={setSorting}
        onRowClick={handleRowClick}
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
        renderMobileCard={(supplier) => (
          <SupplierCard
            supplier={supplier}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            navigate={navigate}
          />
        )}
      />

      {/* Mobile infinite scroll indicator */}
      {isMobile && mobileLoadedCount < sortedData.length && (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="text-body-sm text-muted-foreground mt-2">Đang tải thêm...</p>
        </div>
      )}
      
      {isMobile && mobileLoadedCount >= sortedData.length && sortedData.length > 20 && (
        <div className="text-center py-4">
          <p className="text-body-sm text-muted-foreground">Đã hiển thị tất cả {sortedData.length} kết quả</p>
        </div>
      )}

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Nhà cung cấp sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog */}
      <GenericImportDialogV2<Supplier>
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        config={supplierImportExportConfig}
        branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))}
        existingData={activeSuppliers}
        onImport={handleImport}
        currentUser={{
          name: currentUser?.fullName || 'Hệ thống',
          systemId: currentUser?.systemId || asSystemId('SYSTEM'),
        }}
      />

      {/* Export Dialog */}
      <GenericExportDialogV2<Supplier>
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        config={supplierImportExportConfig}
        allData={activeSuppliers}
        filteredData={sortedData}
        currentPageData={paginatedData}
        selectedData={selectedSuppliers}
        currentUser={{
          name: currentUser?.fullName || 'Hệ thống',
          systemId: currentUser?.systemId || asSystemId('SYSTEM'),
        }}
      />
    </div>
  )
}
