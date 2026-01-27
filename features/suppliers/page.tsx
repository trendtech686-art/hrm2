'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { useSuppliers, useDeletedSuppliers, useSupplierMutations, useTrashMutations } from "./hooks/use-suppliers"
import { useActiveSuppliers } from "./hooks/use-all-suppliers"
import { getColumns } from "./columns"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table"
import { PageToolbar } from "../../components/layout/page-toolbar"
import { PageFilters } from "../../components/layout/page-filters"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog"
import type { Supplier } from '@/lib/types/prisma-extended'
import { Button } from "../../components/ui/button"
import { PlusCircle, Trash2, FileSpreadsheet, Download } from "lucide-react"
import { useFuseFilter } from "../../hooks/use-fuse-search"
import { usePageHeader } from "../../contexts/page-header-context";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "../../components/data-table/dynamic-column-customizer";
import { SupplierCard } from "./supplier-card";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { asSystemId, type SystemId } from "@/lib/id-types";
import { useAllBranches } from "../settings/branches/hooks/use-all-branches";
import { useAuth } from "../../contexts/auth-context";
import { useColumnVisibility } from "../../hooks/use-column-visibility";

const SupplierImportDialog = dynamic(() => import("./components/suppliers-import-export-dialogs").then(mod => ({ default: mod.SupplierImportDialog })), { ssr: false });
const SupplierExportDialog = dynamic(() => import("./components/suppliers-import-export-dialogs").then(mod => ({ default: mod.SupplierExportDialog })), { ssr: false });

export function SuppliersPage() {
  const { data: suppliersData } = useSuppliers({ limit: 1000 });
  const suppliers = React.useMemo(() => suppliersData?.data ?? [], [suppliersData?.data]);
  const { data: deletedSuppliersData } = useDeletedSuppliers();
  const deletedCount = deletedSuppliersData?.length ?? 0;
  const { create: createMutation, update: updateMutation, remove: removeMutation } = useSupplierMutations({
    onDeleteSuccess: () => toast.success("Đã chuyển nhà cung cấp vào thùng rác"),
    onUpdateSuccess: () => toast.success("Đã cập nhật nhà cung cấp"),
    onError: (err) => toast.error(err.message || "Thao tác thất bại"),
  });
  const { restore: restoreMutation } = useTrashMutations();
  const { data: activeSuppliers } = useActiveSuppliers();
  const { data: branches } = useAllBranches();
  const { employee: currentUser } = useAuth();
  const router = useRouter();
  const { isMobile } = useBreakpoint();

  const [showImportDialog, setShowImportDialog] = React.useState(false), [showExportDialog, setShowExportDialog] = React.useState(false);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  const headerActions = React.useMemo(() => [
    <Button key="trash" variant="outline" size="sm" className="h-9 gap-2" onClick={() => router.push('/suppliers/trash')}><Trash2 className="mr-2 h-4 w-4" />Thùng rác ({deletedCount})</Button>,
    <Button key="add" size="sm" className="h-9 gap-2" onClick={() => router.push('/suppliers/new')}><PlusCircle className="mr-2 h-4 w-4" />Thêm nhà cung cấp</Button>
  ], [router, deletedCount]);

  usePageHeader({
    title: 'Nhà cung cấp',
    actions: headerActions,
    breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Nhà cung cấp', href: '/suppliers', isCurrent: true }],
  });

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({}), [isAlertOpen, setIsAlertOpen] = React.useState(false), [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true }), [globalFilter, setGlobalFilter] = React.useState(''), [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const defaultColumnVisibility = React.useMemo(() => {
    const cols = getColumns(() => {}, () => {}, () => {}, null as unknown as ReturnType<typeof useRouter>);
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('suppliers', defaultColumnVisibility);
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]), [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  const handleDelete = React.useCallback((systemId: SystemId) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);

  const handleRestore = React.useCallback((systemId: SystemId) => {
    const supplier = suppliers.find(s => s.systemId === systemId);
    restoreMutation.mutate(systemId);
    if (supplier) toast.success(`Đã khôi phục nhà cung cấp "${supplier.name}"`);
  }, [suppliers, restoreMutation]);

  const handleEdit = React.useCallback((supplier: Supplier) => { router.push(`/suppliers/${supplier.systemId}/edit`); }, [router]);
  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, handleEdit, router), [handleDelete, handleRestore, handleEdit, router]);

  React.useEffect(() => {
    const defaultVisibleColumns = ['id', 'name', 'taxCode', 'phone', 'email', 'address', 'website', 'contactPerson', 'accountManager', 'currentDebt', 'bankAccount', 'bankName', 'status', 'createdAt', 'updatedAt'];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => { initialVisibility[c.id!] = c.id === 'select' || c.id === 'actions' ? true : defaultVisibleColumns.includes(c.id!); });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchedData = useFuseFilter(activeSuppliers, globalFilter, React.useMemo(() => ({ keys: ["name", "taxCode", "phone", "email"] }), []));

  const confirmDelete = () => {
    if (idToDelete) {
      const supplier = suppliers.find(s => s.systemId === idToDelete);
      removeMutation.mutate(idToDelete);
      if (supplier) toast.success(`Đã chuyển nhà cung cấp "${supplier.name}" vào thùng rác`);
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };

  const sortedData = React.useMemo(() => {
    const sorted = [...searchedData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sorting.id] as string | number | null | undefined, bValue = (b as Record<string, unknown>)[sorting.id] as string | number | null | undefined;
        if (sorting.id === 'createdAt') {
          const aTime = aValue ? new Date(aValue as string | number | Date).getTime() : 0, bTime = bValue ? new Date(bValue as string | number | Date).getTime() : 0;
          if (aTime === bTime) {
            const aNum = parseInt(a.systemId.replace(/\D/g, '')) || 0, bNum = parseInt(b.systemId.replace(/\D/g, '')) || 0;
            return sorting.desc ? bNum - aNum : aNum - bNum;
          }
          return sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [searchedData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);
  const allSelectedRows = React.useMemo(() => activeSuppliers.filter(s => rowSelection[s.systemId]), [activeSuppliers, rowSelection]);
  const handleRowClick = (supplier: Supplier) => router.push(`/suppliers/${supplier.systemId}`);

  const handleBulkStatusChange = (status: Supplier['status']) => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    if (selectedIds.length === 0) { toast.error('Chưa chọn nhà cung cấp', { description: 'Vui lòng chọn ít nhất một nhà cung cấp' }); return; }
    selectedIds.forEach(id => updateMutation.mutate({ systemId: asSystemId(id), status }));
    setRowSelection({});
    toast.success(`Đã cập nhật trạng thái ${selectedIds.length} nhà cung cấp`);
  };

  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    if (selectedIds.length === 0) { toast.error('Chưa chọn nhà cung cấp', { description: 'Vui lòng chọn ít nhất một nhà cung cấp' }); return; }
    selectedIds.forEach(id => removeMutation.mutate(asSystemId(id)));
    setRowSelection({});
    toast.success(`Đã chuyển ${selectedIds.length} nhà cung cấp vào thùng rác`);
  };

  React.useEffect(() => { setMobileLoadedCount(20); }, [globalFilter, sorting]);

  React.useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight * 0.8) {
        setMobileLoadedCount(prev => prev < sortedData.length ? Math.min(prev + 20, sortedData.length) : prev);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, sortedData.length]);

  const displayData = React.useMemo(() => isMobile ? sortedData.slice(0, mobileLoadedCount) : paginatedData, [isMobile, sortedData, mobileLoadedCount, paginatedData]);
  const bulkActions = [
    { label: "Đang giao dịch", onSelect: () => handleBulkStatusChange('Đang Giao Dịch') },
    { label: "Tạm ngừng", onSelect: () => handleBulkStatusChange('Ngừng Giao Dịch') },
    { label: "Chuyển vào thùng rác", onSelect: handleBulkDelete }
  ];

  const handleImport = React.useCallback(async (importedSuppliers: Partial<Supplier>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => {
    let addedCount = 0, updatedCount = 0, skippedCount = 0;
    const errors: Array<{ row: number; message: string }> = [];
    
    for (const [index, supplier] of importedSuppliers.entries()) {
      try {
        const existing = activeSuppliers.find(s => s.id.toLowerCase() === (supplier.id || '').toLowerCase());
        if (existing) {
          if (mode === 'update-only' || mode === 'upsert') { 
            await new Promise<void>((resolve, reject) => {
              updateMutation.mutate({ systemId: existing.systemId, ...supplier }, {
                onSuccess: () => { updatedCount++; resolve(); },
                onError: (error) => reject(error)
              });
            });
          } else skippedCount++;
        } else {
          if (mode === 'insert-only' || mode === 'upsert') { 
            await new Promise<void>((resolve, reject) => {
              createMutation.mutate(supplier as Supplier, {
                onSuccess: () => { addedCount++; resolve(); },
                onError: (error) => reject(error)
              });
            });
          } else skippedCount++;
        }
      } catch (error) { errors.push({ row: index + 1, message: (error as Error).message }); }
    }
    
    if (addedCount > 0 || updatedCount > 0) {
      const messages: string[] = [];
      if (addedCount > 0) messages.push(`${addedCount} nhà cung cấp mới`);
      if (updatedCount > 0) messages.push(`${updatedCount} nhà cung cấp cập nhật`);
      toast.success(`Đã import: ${messages.join(', ')}`);
    }
    return { success: addedCount + updatedCount, failed: errors.length, inserted: addedCount, updated: updatedCount, skipped: skippedCount, errors };
  }, [activeSuppliers, createMutation, updateMutation]);

  const selectedSuppliers = React.useMemo(() => activeSuppliers.filter(s => rowSelection[s.systemId]), [activeSuppliers, rowSelection]);
  const currentUserInfo = React.useMemo(() => ({ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }), [currentUser]);

  return (
    <div className="space-y-4">
      {!isMobile && (
        <PageToolbar rightActions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file</Button>
            <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button>
            <DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />
          </div>
        } />
      )}
      {isMobile && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập</Button>
          <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất</Button>
        </div>
      )}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm kiếm nhà cung cấp..." />
      <ResponsiveDataTable columns={columns} data={displayData} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={searchedData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} sorting={sorting} setSorting={setSorting} onRowClick={handleRowClick} allSelectedRows={allSelectedRows} bulkActions={bulkActions} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns}
        renderMobileCard={(supplier) => <SupplierCard supplier={supplier} onEdit={handleEdit} onDelete={handleDelete} onRestore={handleRestore} navigate={router.push} />}
      />
      {isMobile && mobileLoadedCount < sortedData.length && (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="text-body-sm text-muted-foreground mt-2">Đang tải thêm...</p>
        </div>
      )}
      {isMobile && mobileLoadedCount >= sortedData.length && sortedData.length > 20 && (
        <div className="text-center py-4"><p className="text-body-sm text-muted-foreground">Đã hiển thị tất cả {sortedData.length} kết quả</p></div>
      )}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>Nhà cung cấp sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <SupplierImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={activeSuppliers} onImport={handleImport} currentUser={currentUserInfo} />
      <SupplierExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={activeSuppliers} filteredData={sortedData} currentPageData={paginatedData} selectedData={selectedSuppliers} currentUser={currentUserInfo} />
    </div>
  )
}
