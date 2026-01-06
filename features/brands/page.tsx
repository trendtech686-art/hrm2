'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { Plus, Power, PowerOff, Trash2, RefreshCw, Search, AlignLeft, FileUp, Download, ExternalLink, Unlink } from "lucide-react";
import { toast } from "sonner";

import { asSystemId, asBusinessId } from "@/lib/id-types";
import { useColumnVisibility } from '@/hooks/use-column-visibility';
import { usePageHeader } from "@/contexts/page-header-context";
import { useBrandStore } from "../settings/inventory/brand-store";
import type { Brand } from "../settings/inventory/types";
import { useFuseFilter } from "@/hooks/use-fuse-search";
import { getColumns } from "./columns";
import { MobileBrandCard } from "./card";
import { usePkgxBrandSync } from "./hooks/use-pkgx-brand-sync";
import { usePkgxSettingsStore } from "../settings/pkgx/store";
import { usePkgxBulkSync } from "../settings/pkgx/hooks/use-pkgx-bulk-sync";
import { PkgxBulkSyncConfirmDialog } from "../settings/pkgx/components/pkgx-bulk-sync-confirm-dialog";
import { PkgxBrandLinkDialog } from "./components/pkgx-link-dialog";
import { PkgxBrandDetailDialog } from "./components/pkgx-brand-detail-dialog";
import { useAuth } from "@/contexts/auth-context";
import { useMediaQuery } from "@/lib/use-media-query";

import { Button } from "@/components/ui/button";
import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { PageFilters } from "@/components/layout/page-filters";

const BrandImportDialog = dynamic(() => import("./components/brands-import-export-dialogs").then(mod => ({ default: mod.BrandImportDialog })), { ssr: false });
const BrandExportDialog = dynamic(() => import("./components/brands-import-export-dialogs").then(mod => ({ default: mod.BrandExportDialog })), { ssr: false });

export function BrandsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { employee: authEmployee } = useAuth();
  const { data, add, update, remove } = useBrandStore(useShallow((s) => ({ data: s.data, add: s.add, update: s.update, remove: s.remove })));
  const activeBrands = React.useMemo(() => data.filter(b => !b.isDeleted), [data]);

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState({ id: 'name', desc: false });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [pkgxLinkDialogOpen, setPkgxLinkDialogOpen] = React.useState(false);
  const [brandToLink, setBrandToLink] = React.useState<Brand | null>(null);
  const [pkgxDetailDialogOpen, setPkgxDetailDialogOpen] = React.useState(false);
  const [brandToViewDetail, setBrandToViewDetail] = React.useState<Brand | null>(null);
  const [pkgxBrandIdToView, setPkgxBrandIdToView] = React.useState<number | null>(null);

  const defaultColumnVisibility = React.useMemo(() => { const cols = getColumns(() => {}, () => {}, () => {}); const init: Record<string, boolean> = {}; cols.forEach(c => { if (c.id) init[c.id] = true; }); return init; }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('brands', defaultColumnVisibility);
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'logo', 'name']);

  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  const handleDelete = React.useCallback((systemId: string) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleToggleActive = React.useCallback((systemId: string, isActive: boolean) => { update(asSystemId(systemId), { isActive }); toast.success(isActive ? 'Đã kích hoạt' : 'Đã tắt'); }, [update]);
  const handleUpdateName = React.useCallback((systemId: string, name: string) => { update(asSystemId(systemId), { name }); toast.success('Đã cập nhật tên'); }, [update]);
  const handleRowClick = React.useCallback((brand: Brand) => router.push(`/brands/${brand.systemId}`), [router]);

  const handleBulkActivate = React.useCallback(() => { Object.keys(rowSelection).forEach(id => update(asSystemId(id), { isActive: true })); toast.success(`Đã kích hoạt ${Object.keys(rowSelection).length} thương hiệu`); setRowSelection({}); }, [rowSelection, update]);
  const handleBulkDeactivate = React.useCallback(() => { Object.keys(rowSelection).forEach(id => update(asSystemId(id), { isActive: false })); toast.success(`Đã tắt ${Object.keys(rowSelection).length} thương hiệu`); setRowSelection({}); }, [rowSelection, update]);

  const { hasPkgxMapping, getPkgxBrandId } = usePkgxBrandSync();
  const deleteBrandMapping = usePkgxSettingsStore((s) => s.deleteBrandMapping);
  const getBrandMappingByHrmId = usePkgxSettingsStore((s) => s.getBrandMappingByHrmId);
  const { confirmAction: bulkConfirmAction, progress: bulkProgress, triggerBulkSync, executeAction: executeBulkAction, cancelConfirm: cancelBulkConfirm } = usePkgxBulkSync({ entityType: 'brand' });

  const handlePkgxLink = React.useCallback((brand: Brand) => { setBrandToLink(brand); setPkgxLinkDialogOpen(true); }, []);
  const handlePkgxUnlink = React.useCallback((brand: Brand) => { const m = getBrandMappingByHrmId(brand.systemId); if (m) { deleteBrandMapping(m.id); toast.success(`Đã hủy liên kết "${brand.name}"`); } }, [getBrandMappingByHrmId, deleteBrandMapping]);
  const handlePkgxViewDetail = React.useCallback((brand: Brand, pkgxBrandId: number) => { setBrandToViewDetail(brand); setPkgxBrandIdToView(pkgxBrandId); setPkgxDetailDialogOpen(true); }, []);

  const columns = React.useMemo(() => getColumns(handleDelete, handleToggleActive, router.push, handleUpdateName, hasPkgxMapping, getPkgxBrandId, handlePkgxLink, handlePkgxUnlink, handlePkgxViewDetail), [handleDelete, handleToggleActive, router, handleUpdateName, hasPkgxMapping, getPkgxBrandId, handlePkgxLink, handlePkgxUnlink, handlePkgxViewDetail]);

  const bulkActions = React.useMemo(() => [{ label: 'Kích hoạt', icon: Power, onSelect: handleBulkActivate }, { label: 'Tắt', icon: PowerOff, onSelect: handleBulkDeactivate }, { label: 'Xóa', icon: Trash2, onSelect: () => setIsBulkDeleteAlertOpen(true) }], [handleBulkActivate, handleBulkDeactivate]);

  const pkgxBulkActions = React.useMemo(() => [
    { label: "Đồng bộ tất cả", icon: RefreshCw, onSelect: (rows: Brand[]) => triggerBulkSync(rows, 'sync_all') },
    { label: "SEO", icon: Search, onSelect: (rows: Brand[]) => triggerBulkSync(rows, 'sync_seo') },
    { label: "Mô tả", icon: AlignLeft, onSelect: (rows: Brand[]) => triggerBulkSync(rows, 'sync_description') },
    { label: "Xem PKGX", icon: ExternalLink, onSelect: (rows: Brand[]) => { const linked = rows.filter(b => hasPkgxMapping(b)); if (linked.length === 0) { toast.error('Không có thương hiệu liên kết'); return; } const id = getPkgxBrandId(linked[0]); if (id) window.open(`https://phukiengiaxuong.com.vn/admin/brand.php?act=edit&id=${id}`, '_blank'); } },
    { label: "Hủy liên kết", icon: Unlink, variant: "destructive" as const, onSelect: (rows: Brand[]) => { const linked = rows.filter(b => hasPkgxMapping(b)); if (linked.length === 0 || !confirm(`Hủy liên kết ${linked.length} thương hiệu?`)) return; let c = 0; for (const b of linked) { const m = getBrandMappingByHrmId(b.systemId); if (m) { deleteBrandMapping(m.id); c++; } } setRowSelection({}); toast.success(`Đã hủy ${c} liên kết`); } },
  ], [triggerBulkSync, hasPkgxMapping, getPkgxBrandId, getBrandMappingByHrmId, deleteBrandMapping]);

  const handleImport = React.useCallback(async (importData: Partial<Brand>[], mode: 'insert-only' | 'update-only' | 'upsert') => {
    const results = { success: 0, failed: 0, inserted: 0, updated: 0, skipped: 0, errors: [] as Array<{ row: number; message: string }> };
    for (let i = 0; i < importData.length; i++) {
      const item = importData[i];
      try {
        const existing = activeBrands.find(b => item.id && b.id === item.id);
        if (existing) {
          if (mode === 'insert-only') { results.skipped++; continue; }
          const { systemId: _, createdAt: __, ...rest } = item as Partial<Brand> & { systemId?: string; createdAt?: string };
          update(existing.systemId, { ...rest, updatedAt: new Date().toISOString() }); results.updated++; results.success++;
        } else {
          if (mode === 'update-only') { results.skipped++; continue; }
          add({ ...item, id: asBusinessId(item.id || `BRAND-${Date.now()}`), name: item.name || '', isActive: item.isActive !== false, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Omit<Brand, 'systemId'>);
          results.inserted++; results.success++;
        }
      } catch (e) { results.failed++; results.errors.push({ row: i + 1, message: e instanceof Error ? e.message : 'Lỗi' }); }
    }
    return results;
  }, [activeBrands, add, update]);

  React.useEffect(() => {
    if (Object.keys(columnVisibility).length > 0) return;
    const defaultVisible = ['logo', 'name', 'id', 'productCount', 'website', 'seoPkgx', 'seoTrendtech', 'pkgxStatus', 'pkgx', 'isActive', 'createdAt'];
    const ids = ['select', 'logo', 'name', 'id', 'productCount', 'website', 'seoPkgx', 'seoTrendtech', 'pkgxStatus', 'pkgx', 'isActive', 'createdAt', 'updatedAt', 'actions'];
    const vis: Record<string, boolean> = {};
    ids.forEach(id => { vis[id] = id === 'select' || id === 'actions' || defaultVisible.includes(id); });
    setColumnVisibility(vis); setColumnOrder(ids);
  }, [columnVisibility, setColumnVisibility]);

  const fuseOptions = React.useMemo(() => ({ keys: ["id", "name", "description", "website"], threshold: 0.3, ignoreLocation: true }), []);
  const searchedBrands = useFuseFilter(activeBrands, debouncedGlobalFilter, fuseOptions);

  const confirmDelete = () => { if (idToDelete) { remove(asSystemId(idToDelete)); toast.success("Đã xóa"); } setIsAlertOpen(false); setIdToDelete(null); };
  const confirmBulkDelete = () => { Object.keys(rowSelection).forEach(id => remove(asSystemId(id))); toast.success(`Đã xóa ${Object.keys(rowSelection).length} thương hiệu`); setRowSelection({}); setIsBulkDeleteAlertOpen(false); };

  const statusOptions = React.useMemo(() => [{ value: 'active', label: 'Hoạt động' }, { value: 'inactive', label: 'Tạm tắt' }], []);

  const filteredData = React.useMemo(() => {
    let result = activeBrands;
    if (statusFilter.size > 0) result = result.filter(b => statusFilter.has(b.isActive !== false ? 'active' : 'inactive'));
    if (debouncedGlobalFilter) { const ids = new Set(searchedBrands.map(b => b.systemId)); result = result.filter(b => ids.has(b.systemId)); }
    return result;
  }, [activeBrands, statusFilter, debouncedGlobalFilter, searchedBrands]);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) sorted.sort((a, b) => {
      const aV = (a as Record<string, unknown>)[sorting.id], bV = (b as Record<string, unknown>)[sorting.id];
      if (sorting.id === 'createdAt') { const aT = aV ? new Date(aV as string).getTime() : 0, bT = bV ? new Date(bV as string).getTime() : 0; return sorting.desc ? bT - aT : aT - bT; }
      const aS = String(aV ?? ''), bS = String(bV ?? '');
      return aS < bS ? (sorting.desc ? 1 : -1) : aS > bS ? (sorting.desc ? -1 : 1) : 0;
    });
    return sorted;
  }, [filteredData, sorting]);

  const allSelectedRows = React.useMemo(() => activeBrands.filter(b => rowSelection[b.systemId]), [activeBrands, rowSelection]);

  React.useEffect(() => { if (!isMobile) return; const h = () => { if ((window.pageYOffset + window.innerHeight) / document.documentElement.scrollHeight > 0.8 && mobileLoadedCount < sortedData.length) setMobileLoadedCount(p => Math.min(p + 20, sortedData.length)); }; window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, [isMobile, mobileLoadedCount, sortedData.length]);
  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedGlobalFilter, statusFilter]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);

  const headerActions = React.useMemo(() => [<Button key="add" size="sm" className="h-9" onClick={() => router.push('/brands/new')}><Plus className="mr-2 h-4 w-4" />Thêm thương hiệu</Button>], [router]);
  usePageHeader({ actions: headerActions, showBackButton: false });

  return (
    <div className="space-y-4 h-full flex flex-col">
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}><FileUp className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={[<DataTableColumnCustomizer key="c" columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />]} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm theo mã, tên..." rightFilters={<DataTableFacetedFilter title="Trạng thái" options={statusOptions} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} />} />
      {isMobile ? (
        <div className="space-y-2 flex-1 overflow-y-auto">
          {sortedData.length === 0 ? <Card><CardContent className="p-8 text-center text-muted-foreground">Không tìm thấy thương hiệu</CardContent></Card> : <>
            {sortedData.slice(0, mobileLoadedCount).map(b => <MobileBrandCard key={b.systemId} brand={b} onDelete={handleDelete} onToggleActive={handleToggleActive} navigate={router.push} handleRowClick={handleRowClick} />)}
            {mobileLoadedCount < sortedData.length && <Card><CardContent className="p-4 text-center text-muted-foreground"><div className="flex items-center justify-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" /><span>Đang tải...</span></div></CardContent></Card>}
            {mobileLoadedCount >= sortedData.length && sortedData.length > 20 && <Card><CardContent className="p-4 text-center text-muted-foreground text-sm">Đã hiển thị {sortedData.length} thương hiệu</CardContent></Card>}
          </>}
        </div>
      ) : (
        <div className="w-full py-4"><ResponsiveDataTable columns={columns} data={paginatedData} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={sortedData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={() => setIsBulkDeleteAlertOpen(true)} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} allSelectedRows={allSelectedRows} bulkActions={bulkActions} pkgxBulkActions={pkgxBulkActions} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} renderMobileCard={b => <MobileBrandCard brand={b} onDelete={handleDelete} onToggleActive={handleToggleActive} navigate={router.push} handleRowClick={handleRowClick} />} /></div>
      )}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa thương hiệu?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Đóng</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa {Object.keys(rowSelection).length} thương hiệu?</AlertDialogTitle><AlertDialogDescription>Hành động không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Đóng</AlertDialogCancel><AlertDialogAction onClick={confirmBulkDelete}>Xóa tất cả</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <PkgxBrandLinkDialog open={pkgxLinkDialogOpen} onOpenChange={setPkgxLinkDialogOpen} brand={brandToLink} onSuccess={() => {}} />
      <PkgxBrandDetailDialog open={pkgxDetailDialogOpen} onOpenChange={setPkgxDetailDialogOpen} brand={brandToViewDetail} pkgxBrandId={pkgxBrandIdToView} />
      <PkgxBulkSyncConfirmDialog confirmAction={bulkConfirmAction} progress={bulkProgress} onConfirm={executeBulkAction} onCancel={cancelBulkConfirm} />
      <BrandImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} existingData={activeBrands} onImport={handleImport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : undefined} />
      <BrandExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} allData={activeBrands} filteredData={sortedData} currentPageData={paginatedData} selectedData={allSelectedRows} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : { systemId: asSystemId('SYSTEM'), name: 'System' }} />
    </div>
  );
}
