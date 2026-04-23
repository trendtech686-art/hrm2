'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Plus, Power, PowerOff, RefreshCw, Search, AlignLeft, FileUp, Download, ExternalLink, Unlink, Archive } from "lucide-react";
import { toast } from "sonner";

import { asSystemId, asBusinessId } from "@/lib/id-types";
import { generateTempId } from '@/lib/id-utils';
import { cn } from '@/lib/utils';
import { useColumnVisibility, useColumnOrder, usePinnedColumns } from '@/hooks/use-column-visibility';
import { usePageHeader } from "@/contexts/page-header-context";
import { useBrands, useBrandMutations, useBulkBrandMutations, brandKeys } from "./hooks/use-brands";
import { fetchBrand } from "./api/brands-api";
import type { Brand } from "../settings/inventory/types";
import { getColumns } from "./columns";
import { MobileBrandCard } from "./card";
import { usePkgxBrandSync } from "./hooks/use-pkgx-brand-sync";
import { usePkgxMappings, usePkgxBrandMappingMutations } from "../settings/pkgx/hooks/use-pkgx-settings";
import { usePkgxBulkSync } from "../settings/pkgx/hooks/use-pkgx-bulk-sync";
import { PkgxBulkSyncConfirmDialog } from "../settings/pkgx/components/pkgx-bulk-sync-confirm-dialog";
import { PkgxBrandLinkDialog } from "./components/pkgx-link-dialog";
import { PkgxBrandDetailDialog } from "./components/pkgx-brand-detail-dialog";
import { useAuth } from "@/contexts/auth-context";
import { useMediaQuery } from "@/lib/use-media-query";

import { Button } from "@/components/ui/button";
import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table";
import { useQueryClient } from '@tanstack/react-query';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { PageFilters } from "@/components/layout/page-filters";
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';

const BrandImportDialog = dynamic(() => import("./components/brands-import-export-dialogs").then(mod => ({ default: mod.BrandImportDialog })), { ssr: false });
const BrandExportDialog = dynamic(() => import("./components/brands-import-export-dialogs").then(mod => ({ default: mod.BrandExportDialog })), { ssr: false });

export function BrandsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isFilterPending] = React.useTransition();
  const {  employee: authEmployee, can } = useAuth();
  const canCreate = can('edit_products');
  const canDelete = can('delete_products');

  // Filter presets
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('brands');
  
  // State for server-side filtering
  const [sorting, setSorting] = React.useState({ id: 'name', desc: false });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = usePaginationWithGlobalDefault();
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});
  
  // Debounce search
  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);
  // Reset pagination khi search thay đổi
  React.useEffect(() => { setPagination(prev => ({ ...prev, pageIndex: 0 })); }, [debouncedGlobalFilter, advancedFilters]);

  // Server-side filtering: API sẽ xử lý search, pagination
  const { data: queryData, isFetching } = useBrands({ 
    search: debouncedGlobalFilter || undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });
  const data = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const _total = queryData?.total ?? 0; // Unused since we use client-side filtering
  
  const { create, update, remove } = useBrandMutations({
    onSuccess: () => toast.success("Thao tác thành công"),
    onError: (err) => toast.error(err.message)
  });
  const { bulkDelete, bulkActivate, bulkDeactivate } = useBulkBrandMutations({
    onSuccess: () => toast.success("Thao tác hàng loạt thành công"),
    onError: (err) => toast.error(err.message)
  });
  
  // Filter client-side cho status (vì API chưa hỗ trợ)
  const filteredData = React.useMemo(() => {
    let result = data.filter(b => !b.isDeleted);
    const statusValues = Array.isArray(advancedFilters.status) ? advancedFilters.status as string[] : [];
    if (statusValues.length > 0) result = result.filter(b => statusValues.includes(b.isActive !== false ? 'active' : 'inactive'));
    return result;
  }, [data, advancedFilters]);
  const activeBrands = filteredData; // alias for compatibility

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [pkgxLinkDialogOpen, setPkgxLinkDialogOpen] = React.useState(false);
  const [brandToLink, setBrandToLink] = React.useState<Brand | null>(null);
  const [pkgxDetailDialogOpen, setPkgxDetailDialogOpen] = React.useState(false);
  const [brandToViewDetail, setBrandToViewDetail] = React.useState<Brand | null>(null);
  const [pkgxBrandIdToView, setPkgxBrandIdToView] = React.useState<number | null>(null);

  const defaultColumnVisibility = React.useMemo(() => { const cols = getColumns(() => {}, () => {}, () => {}); const init: Record<string, boolean> = {}; cols.forEach(c => { if (c.id) init[c.id] = true; }); return init; }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('brands', defaultColumnVisibility);
  const [columnOrder, setColumnOrder] = useColumnOrder('brands');
  const [pinnedColumns, setPinnedColumns] = usePinnedColumns('brands', ['select', 'logo', 'name']);

  const handleDelete = React.useCallback((systemId: string) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleToggleActive = React.useCallback((systemId: string, isActive: boolean) => { update.mutate({ systemId: asSystemId(systemId), data: { isActive } }); toast.success(isActive ? 'Đã kích hoạt' : 'Đã tắt'); }, [update]);
  const handleUpdateName = React.useCallback((systemId: string, name: string) => { update.mutate({ systemId: asSystemId(systemId), data: { name } }); toast.success('Đã cập nhật tên'); }, [update]);
  const handleRowClick = React.useCallback((brand: Brand) => router.push(`/brands/${brand.systemId}`), [router]);

  const handleRowHover = React.useCallback((brand: { systemId: string }) => {
    queryClient.prefetchQuery({
      queryKey: brandKeys.detail(brand.systemId),
      queryFn: () => fetchBrand(brand.systemId),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  const handleBulkActivate = React.useCallback(() => { const ids = Object.keys(rowSelection); bulkActivate.mutate(ids); setRowSelection({}); }, [rowSelection, bulkActivate]);
  const handleBulkDeactivate = React.useCallback(() => { const ids = Object.keys(rowSelection); bulkDeactivate.mutate(ids); setRowSelection({}); }, [rowSelection, bulkDeactivate]);

  const { hasPkgxMapping, getPkgxBrandId } = usePkgxBrandSync();
  const { data: pkgxSettings } = usePkgxMappings();
  const { deleteBrandMapping } = usePkgxBrandMappingMutations({ onSuccess: () => {} });
  
  // Helper to find mapping by HRM brand ID
  const getBrandMappingByHrmId = React.useCallback((hrmBrandId: string) => {
    return pkgxSettings?.brandMappings?.find(m => m.hrmBrandSystemId === hrmBrandId || m.hrmBrandId === hrmBrandId);
  }, [pkgxSettings?.brandMappings]);
  
  // Get all sync handlers from usePkgxBrandSync - unified logic source
  const brandSyncHandlers = usePkgxBrandSync();
  
  // Pass handlers to bulk sync so it uses the same logic
  const { confirmAction: bulkConfirmAction, progress: bulkProgress, triggerBulkSync, executeAction: executeBulkAction, cancelConfirm: cancelBulkConfirm } = usePkgxBulkSync({ 
    entityType: 'brand',
    brandSyncHandlers,
  });

  const handlePkgxLink = React.useCallback((brand: Brand) => { setBrandToLink(brand); setPkgxLinkDialogOpen(true); }, []);
  const handlePkgxUnlink = React.useCallback((brand: Brand) => { const m = getBrandMappingByHrmId(brand.systemId); if (m) { deleteBrandMapping.mutate(m.systemId || m.id || ''); toast.success(`Đã hủy liên kết "${brand.name}"`); } }, [getBrandMappingByHrmId, deleteBrandMapping]);
  const handlePkgxViewDetail = React.useCallback((brand: Brand, pkgxBrandId: number) => { setBrandToViewDetail(brand); setPkgxBrandIdToView(pkgxBrandId); setPkgxDetailDialogOpen(true); }, []);

  const columns = React.useMemo(() => getColumns(handleDelete, handleToggleActive, router.push, handleUpdateName, hasPkgxMapping, getPkgxBrandId, handlePkgxLink, handlePkgxUnlink, handlePkgxViewDetail), [handleDelete, handleToggleActive, router, handleUpdateName, hasPkgxMapping, getPkgxBrandId, handlePkgxLink, handlePkgxUnlink, handlePkgxViewDetail]);

  const bulkActions = React.useMemo(() => [{ label: 'Kích hoạt', icon: Power, onSelect: handleBulkActivate }, { label: 'Tắt', icon: PowerOff, onSelect: handleBulkDeactivate }, { label: 'Chuyển vào thùng rác', icon: Archive, onSelect: () => setIsBulkDeleteAlertOpen(true) }], [handleBulkActivate, handleBulkDeactivate]);

  const pkgxBulkActions = React.useMemo(() => [
    { label: "Đồng bộ tất cả", icon: RefreshCw, onSelect: (rows: Brand[]) => triggerBulkSync(rows, 'sync_all') },
    { label: "SEO", icon: Search, onSelect: (rows: Brand[]) => triggerBulkSync(rows, 'sync_seo') },
    { label: "Mô tả", icon: AlignLeft, onSelect: (rows: Brand[]) => triggerBulkSync(rows, 'sync_description') },
    { label: "Xem PKGX", icon: ExternalLink, onSelect: (rows: Brand[]) => { const linked = rows.filter(b => hasPkgxMapping(b)); if (linked.length === 0) { toast.error('Không có thương hiệu liên kết'); return; } const id = getPkgxBrandId(linked[0]); if (id) window.open(`https://phukiengiaxuong.com.vn/admin/brand.php?act=edit&id=${id}`, '_blank'); } },
    { label: "Hủy liên kết", icon: Unlink, variant: "destructive" as const, onSelect: (rows: Brand[]) => { const linked = rows.filter(b => hasPkgxMapping(b)); if (linked.length === 0 || !confirm(`Hủy liên kết ${linked.length} thương hiệu?`)) return; let c = 0; for (const b of linked) { const m = getBrandMappingByHrmId(b.systemId); if (m) { deleteBrandMapping.mutate(m.systemId || m.id || ''); c++; } } setRowSelection({}); toast.success(`Đã hủy ${c} liên kết`); } },
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
          update.mutate({ systemId: existing.systemId, data: { ...rest, updatedAt: new Date().toISOString() as unknown as Date } }); results.updated++; results.success++;
        } else {
          if (mode === 'update-only') { results.skipped++; continue; }
          create.mutate({ ...item, id: asBusinessId(item.id || generateTempId('BRAND')), name: item.name || '', isActive: item.isActive !== false, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Parameters<typeof create.mutate>[0]);
          results.inserted++; results.success++;
        }
      } catch (e) { results.failed++; results.errors.push({ row: i + 1, message: e instanceof Error ? e.message : 'Lỗi' }); }
    }
    return results;
  }, [activeBrands, create, update]);

  React.useEffect(() => {
    if (Object.keys(columnVisibility).length > 0) return;
    const defaultVisible = ['logo', 'name', 'id', 'productCount', 'website', 'seoPkgx', 'seoTrendtech', 'pkgxStatus', 'pkgx', 'isActive', 'createdAt'];
    const ids = ['select', 'logo', 'name', 'id', 'productCount', 'website', 'seoPkgx', 'seoTrendtech', 'pkgxStatus', 'pkgx', 'isActive', 'createdAt', 'updatedAt', 'actions'];
    const vis: Record<string, boolean> = {};
    ids.forEach(id => { vis[id] = id === 'select' || id === 'actions' || defaultVisible.includes(id); });
    setColumnVisibility(vis); setColumnOrder(ids);
  }, [columnVisibility, setColumnVisibility]);

  // Server-side search already handled by useBrands hook, just filter by status client-side
  const confirmDelete = () => { if (idToDelete) { remove.mutate(asSystemId(idToDelete)); } setIsAlertOpen(false); setIdToDelete(null); };
  const confirmBulkDelete = () => { const ids = Object.keys(rowSelection); bulkDelete.mutate(ids); setRowSelection({}); setIsBulkDeleteAlertOpen(false); };

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

  // Advanced filter configs
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'status', label: 'Trạng thái', type: 'multi-select' as const, options: [{ value: 'active', label: 'Hoạt động' }, { value: 'inactive', label: 'Tạm tắt' }] },
    { id: 'dateRange', label: 'Ngày tạo', type: 'date-range' as const },
  ], []);

  const panelValues = React.useMemo(() => ({
    status: (advancedFilters.status as string[]) ?? [],
    dateRange: advancedFilters.dateRange ?? null,
  }), [advancedFilters]);

  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setAdvancedFilters(v);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [setPagination]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);

  const headerActions = React.useMemo(() => [
    canDelete && <Button key="trash" variant="outline" size="sm" onClick={() => router.push('/brands/trash')}><Archive className="mr-2 h-4 w-4" />Thùng rác</Button>,
    canCreate && <Button key="add" size="sm" onClick={() => router.push('/brands/new')}><Plus className="mr-2 h-4 w-4" />Thêm thương hiệu</Button>
  ].filter(Boolean), [router, canCreate, canDelete]);
  usePageHeader({ actions: headerActions, showBackButton: false });

  return (
    <div className="space-y-4 h-full flex flex-col">
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}><FileUp className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={[<DataTableColumnCustomizer key="c" columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />]} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm theo mã, tên...">
        <AdvancedFilterPanel
          filters={filterConfigs}
          values={panelValues}
          onApply={handlePanelApply}
          presets={presets.map(p => ({ ...p, filters: p.filters }))}
          onSavePreset={(preset) => savePreset(preset.name, panelValues)}
          onDeletePreset={deletePreset}
          onUpdatePreset={updatePreset}
        />
      </PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />
      <div className={cn('w-full py-4', (isFetching || isFilterPending) && 'opacity-60 pointer-events-none transition-opacity')}><ResponsiveDataTable columns={columns} data={paginatedData as unknown as ({ systemId: string } & Brand)[]} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={sortedData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={() => setIsBulkDeleteAlertOpen(true)} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} allSelectedRows={allSelectedRows as unknown as ({ systemId: string } & Brand)[]} bulkActions={bulkActions} pkgxBulkActions={pkgxBulkActions} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick as (row: { systemId: string } & Brand) => void} onRowHover={handleRowHover} renderMobileCard={(b: { systemId: string } & Brand) => <MobileBrandCard brand={b as unknown as Brand} onDelete={handleDelete} onToggleActive={handleToggleActive} navigate={router.push} handleRowClick={handleRowClick as (brand: Brand) => void} />} mobileInfiniteScroll /></div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa thương hiệu?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Đóng</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Chuyển {Object.keys(rowSelection).length} thương hiệu vào thùng rác?</AlertDialogTitle><AlertDialogDescription>Bạn có thể khôi phục lại từ thùng rác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Đóng</AlertDialogCancel><AlertDialogAction onClick={confirmBulkDelete}>Chuyển vào thùng rác</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <PkgxBrandLinkDialog open={pkgxLinkDialogOpen} onOpenChange={setPkgxLinkDialogOpen} brand={brandToLink} onSuccess={() => {}} />
      <PkgxBrandDetailDialog open={pkgxDetailDialogOpen} onOpenChange={setPkgxDetailDialogOpen} brand={brandToViewDetail} pkgxBrandId={pkgxBrandIdToView} />
      <PkgxBulkSyncConfirmDialog confirmAction={bulkConfirmAction} progress={bulkProgress} onConfirm={executeBulkAction} onCancel={cancelBulkConfirm} />
      <BrandImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} existingData={activeBrands as unknown as Brand[]} onImport={handleImport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : undefined} />
      <BrandExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} allData={activeBrands as unknown as Brand[]} filteredData={sortedData as unknown as Brand[]} currentPageData={paginatedData as unknown as Brand[]} selectedData={allSelectedRows as unknown as Brand[]} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : { systemId: asSystemId('SYSTEM'), name: 'System' }} />
    </div>
  );
}
