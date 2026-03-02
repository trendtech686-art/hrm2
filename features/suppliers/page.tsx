'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { useSuppliers, useDeletedSuppliers, useSupplierMutations, useTrashMutations, useSupplierStats } from "./hooks/use-suppliers"
import { useActiveSuppliers } from "./hooks/use-all-suppliers"
import { getColumns } from "./columns"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table"
import { PageToolbar } from "../../components/layout/page-toolbar"
import { PageFilters } from "../../components/layout/page-filters"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog"
import type { Supplier } from '@/lib/types/prisma-extended'
import { Button } from "../../components/ui/button"
import { PlusCircle, Trash2, FileSpreadsheet, Download, Users, UserCheck, CreditCard, TrendingUp, Settings } from "lucide-react"
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
import { StatsCard, StatsCardGrid } from "@/components/shared/stats-card"
import { formatCurrency, formatNumber } from "@/lib/format-utils"

const SupplierImportDialog = dynamic(() => import("./components/suppliers-import-export-dialogs").then(mod => ({ default: mod.SupplierImportDialog })), { ssr: false });
const SupplierExportDialog = dynamic(() => import("./components/suppliers-import-export-dialogs").then(mod => ({ default: mod.SupplierExportDialog })), { ssr: false });

// Props from Server Component
export interface SuppliersPageProps {
  initialStats?: {
    totalSuppliers: number;
    activeSuppliers: number;
    suppliersWithDebt: number;
    totalDebtAmount: number;
  };
}

export function SuppliersPage({ initialStats }: SuppliersPageProps = {}) {
  // Stats from server component
  const { data: stats } = useSupplierStats(initialStats);
  
  // Server-side pagination state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  
  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Server-side paginated query
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useSuppliers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });
  
  const suppliers = React.useMemo(() => suppliersData?.data ?? [], [suppliersData?.data]);
  const totalRows = suppliersData?.pagination?.total ?? 0;
  const pageCount = suppliersData?.pagination?.totalPages ?? 1;
  
  const { data: deletedSuppliersData } = useDeletedSuppliers();
  const deletedCount = deletedSuppliersData?.length ?? 0;
  const { create: createMutation, update: updateMutation, remove: removeMutation } = useSupplierMutations({
    onDeleteSuccess: () => toast.success("Đã chuyển nhà cung cấp vào thùng rác"),
    onUpdateSuccess: () => toast.success("Đã cập nhật nhà cung cấp"),
    onError: (err) => toast.error(err.message || "Thao tác thất bại"),
  });
  const { restore: restoreMutation } = useTrashMutations();
  const [showImportDialog, setShowImportDialog] = React.useState(false), [showExportDialog, setShowExportDialog] = React.useState(false);
  const { data: activeSuppliers } = useActiveSuppliers({ enabled: showImportDialog || showExportDialog });
  const { data: branches } = useAllBranches();
  const { employee: currentUser } = useAuth();
  const router = useRouter();
  const { isMobile } = useBreakpoint();
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

  const defaultColumnVisibility = React.useMemo(() => {
    const defaultVisibleColumns = ['id', 'name', 'taxCode', 'phone', 'email', 'address', 'website', 'contactPerson', 'accountManager', 'currentDebt', 'bankAccount', 'bankName', 'status', 'createdAt', 'updatedAt'];
    const cols = getColumns(() => {}, () => {}, () => {}, null as unknown as ReturnType<typeof useRouter>);
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = c.id === 'select' || c.id === 'actions' ? true : defaultVisibleColumns.includes(c.id); });
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

  // Initialize column order once
  React.useEffect(() => {
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = () => {
    if (idToDelete) {
      const supplier = suppliers.find(s => s.systemId === idToDelete);
      removeMutation.mutate(idToDelete);
      if (supplier) toast.success(`Đã chuyển nhà cung cấp "${supplier.name}" vào thùng rác`);
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };

  // Server-side pagination: data already sorted/filtered by API
  const allSelectedRows = React.useMemo(() => suppliers.filter(s => rowSelection[s.systemId]), [suppliers, rowSelection]);
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

  React.useEffect(() => { setMobileLoadedCount(20); }, [searchQuery, sorting]);

  React.useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight * 0.8) {
        setMobileLoadedCount(prev => prev < suppliers.length ? Math.min(prev + 20, suppliers.length) : prev);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, suppliers.length]);

  const displayData = React.useMemo(() => isMobile ? suppliers.slice(0, mobileLoadedCount) : suppliers, [isMobile, suppliers, mobileLoadedCount]);
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
              createMutation.mutate(supplier as unknown as Parameters<typeof createMutation.mutate>[0], {
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

  const selectedSuppliers = React.useMemo(() => suppliers.filter(s => rowSelection[s.systemId]), [suppliers, rowSelection]);
  const currentUserInfo = React.useMemo(() => ({ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }), [currentUser]);

  return (
    <div className="space-y-4">
      {/* Stats Cards - instant display from Server Component */}
      <StatsCardGrid columns={4} className="mb-2">
        <StatsCard
          title="Tổng NCC"
          value={stats?.totalSuppliers ?? 0}
          icon={Users}
          formatValue={(v) => formatNumber(Number(v))}
        />
        <StatsCard
          title="Đang giao dịch"
          value={stats?.activeSuppliers ?? 0}
          icon={UserCheck}
          formatValue={(v) => formatNumber(Number(v))}
          variant="success"
        />
        <StatsCard
          title="NCC có công nợ"
          value={stats?.suppliersWithDebt ?? 0}
          icon={CreditCard}
          formatValue={(v) => formatNumber(Number(v))}
          variant={stats?.suppliersWithDebt && stats.suppliersWithDebt > 0 ? 'warning' : 'default'}
        />
        <StatsCard
          title="Tổng công nợ"
          value={stats?.totalDebtAmount ?? 0}
          icon={TrendingUp}
          formatValue={(v) => formatCurrency(Number(v))}
          variant={stats?.totalDebtAmount && stats.totalDebtAmount > 0 ? 'danger' : 'default'}
        />
      </StatsCardGrid>

      {!isMobile && (
        <PageToolbar leftActions={
          <Button variant="outline" size="sm" onClick={() => router.push('/settings/inventory')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>
        } rightActions={
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
      <PageFilters searchValue={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Tìm kiếm nhà cung cấp..." />
      <ResponsiveDataTable columns={columns} data={displayData} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} sorting={sorting} setSorting={setSorting} onRowClick={handleRowClick} allSelectedRows={allSelectedRows} bulkActions={bulkActions} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} isLoading={isLoadingSuppliers}
        renderMobileCard={(supplier) => <SupplierCard supplier={supplier} onEdit={handleEdit} onDelete={handleDelete} onRestore={handleRestore} navigate={router.push} />}
      />
      {isMobile && mobileLoadedCount < suppliers.length && (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="text-body-sm text-muted-foreground mt-2">Đang tải thêm...</p>
        </div>
      )}
      {isMobile && mobileLoadedCount >= suppliers.length && suppliers.length > 20 && (
        <div className="text-center py-4"><p className="text-body-sm text-muted-foreground">Đã hiển thị tất cả {suppliers.length} kết quả</p></div>
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
      <SupplierExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={activeSuppliers} filteredData={suppliers} currentPageData={suppliers} selectedData={selectedSuppliers} currentUser={currentUserInfo} />
    </div>
  )
}
