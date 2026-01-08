/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client'

import * as React from "react";
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { Plus, Power, PowerOff, Trash2, RefreshCw, Search, AlignLeft, ExternalLink, FolderEdit, FileUp, Download } from "lucide-react";
import { asSystemId, asBusinessId } from "@/lib/id-types";
import { useColumnVisibility } from "../../hooks/use-column-visibility";
import { usePageHeader } from "../../contexts/page-header-context";
import { useProductCategoryStore } from "../settings/inventory/product-category-store";
import type { ProductCategory } from "../settings/inventory/types";
import { Button } from "../../components/ui/button";
import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { PageFilters } from "@/components/layout/page-filters";
import { useMediaQuery } from "@/lib/use-media-query";
import { toast } from "sonner";
import { useFuseFilter } from "../../hooks/use-fuse-search";
import { getColumns } from "./columns";
import { MobileCategoryCard } from "./card";
import dynamic from 'next/dynamic';
import { usePkgxCategorySync } from "./hooks/use-pkgx-category-sync";
import { usePkgxSettingsStore } from "../settings/pkgx/store";
import { updateCategory, updateCategoryBasic } from "@/lib/pkgx/api-service";
import { PkgxCategoryLinkDialog } from "./components/pkgx-link-dialog";
import { useAuth } from "@/contexts/auth-context";

const CategoryImportDialog = dynamic(() => import("./components/categories-import-export-dialogs").then(mod => ({ default: mod.CategoryImportDialog })), { ssr: false });
const CategoryExportDialog = dynamic(() => import("./components/categories-import-export-dialogs").then(mod => ({ default: mod.CategoryExportDialog })), { ssr: false });

export function ProductCategoriesPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { employee: authEmployee } = useAuth();
  const { data, add, update, remove } = useProductCategoryStore(useShallow(s => ({ data: s.data, add: s.add, update: s.update, remove: s.remove })));
  const activeCategories = React.useMemo(() => data.filter(c => !c.isDeleted), [data]);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState({ id: 'path', desc: false });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('categories', {});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'thumbnailImage', 'name']);
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [levelFilter, setLevelFilter] = React.useState<Set<string>>(new Set());
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [pkgxLinkDialogOpen, setPkgxLinkDialogOpen] = React.useState(false);
  const [categoryToLink, setCategoryToLink] = React.useState<ProductCategory | null>(null);

  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  const { handleSyncSeo, handleSyncDescription, handleSyncAll, handleSyncBasic, hasPkgxMapping, getPkgxCatId } = usePkgxCategorySync();
  const pkgxSettings = usePkgxSettingsStore(s => s.settings);
  const deleteCategoryMapping = usePkgxSettingsStore(s => s.deleteCategoryMapping);
  const getCategoryMappingByHrmId = usePkgxSettingsStore(s => s.getCategoryMappingByHrmId);

  const handleDelete = React.useCallback((systemId: string) => { if (data.some(c => c.parentId === systemId && !c.isDeleted)) { toast.error('Không thể xóa danh mục có danh mục con'); return; } setIdToDelete(systemId); setIsAlertOpen(true); }, [data]);
  const handleToggleActive = React.useCallback((systemId: string, isActive: boolean) => { update(asSystemId(systemId), { isActive }); toast.success(isActive ? 'Đã kích hoạt danh mục' : 'Đã tắt danh mục'); }, [update]);
  const handleUpdateName = React.useCallback((systemId: string, name: string) => { update(asSystemId(systemId), { name }); toast.success('Đã cập nhật tên'); }, [update]);
  const handleUpdateSortOrder = React.useCallback((systemId: string, sortOrder: number) => { update(asSystemId(systemId), { sortOrder }); toast.success('Đã cập nhật thứ tự'); }, [update]);
  const handleBulkActivate = React.useCallback(() => { Object.keys(rowSelection).forEach(id => update(asSystemId(id), { isActive: true })); toast.success(`Đã kích hoạt ${Object.keys(rowSelection).length} danh mục`); setRowSelection({}); }, [rowSelection, update]);
  const handleBulkDeactivate = React.useCallback(() => { Object.keys(rowSelection).forEach(id => update(asSystemId(id), { isActive: false })); toast.success(`Đã tắt ${Object.keys(rowSelection).length} danh mục`); setRowSelection({}); }, [rowSelection, update]);
  const handleRowClick = React.useCallback((c: ProductCategory) => router.push(`/categories/${c.systemId}`), [router]);
  const handlePkgxLink = React.useCallback((c: ProductCategory) => { setCategoryToLink(c); setPkgxLinkDialogOpen(true); }, []);
  const handlePkgxUnlink = React.useCallback((c: ProductCategory) => { const m = getCategoryMappingByHrmId(c.systemId); if (m) { deleteCategoryMapping(m.id); toast.success(`Đã hủy liên kết "${c.name}"`); } }, [getCategoryMappingByHrmId, deleteCategoryMapping]);

  const handleImport = React.useCallback(async (importData: Partial<ProductCategory>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => {
    const results = { success: 0, failed: 0, inserted: 0, updated: 0, skipped: 0, errors: [] as Array<{ row: number; message: string }> };
    for (let i = 0; i < importData.length; i++) {
      const item = importData[i];
      try {
        const existing = activeCategories.find(c => item.id && c.id === item.id);
        if (existing) { if (mode === 'insert-only') { results.skipped++; continue; } const upd: Partial<ProductCategory> = { ...item, updatedAt: new Date().toISOString() }; delete (upd as Partial<ProductCategory> & { systemId?: unknown }).systemId; delete (upd as Partial<ProductCategory> & { createdAt?: unknown }).createdAt; if (item.parentId && item.parentId !== existing.parentId) { const p = data.find(c => c.systemId === item.parentId); if (p) { upd.path = p.path ? `${p.path} > ${item.name || existing.name}` : (item.name || existing.name); upd.level = (p.level ?? 0) + 1; } } update(existing.systemId, upd); results.updated++; results.success++; }
        else { if (mode === 'update-only') { results.skipped++; continue; } let path = item.name || '', level = 0; if (item.parentId) { const p = data.find(c => c.systemId === item.parentId); if (p) { path = p.path ? `${p.path} > ${item.name}` : (item.name || ''); level = (p.level ?? 0) + 1; } } add({ ...item, id: asBusinessId(item.id || `CAT-${Date.now()}`), name: item.name || '', path, level, sortOrder: item.sortOrder ?? 0, isActive: item.isActive !== false, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Omit<ProductCategory, 'systemId'>); results.inserted++; results.success++; }
      } catch (err) { results.failed++; results.errors.push({ row: i + 1, message: err instanceof Error ? err.message : 'Lỗi' }); }
    }
    return results;
  }, [activeCategories, data, add, update]);

  const columns = React.useMemo(() => getColumns(handleDelete, handleToggleActive, router.push, data, handleUpdateName, handleUpdateSortOrder, handleSyncSeo, handleSyncDescription, handleSyncAll, handleSyncBasic, hasPkgxMapping, getPkgxCatId, handlePkgxLink, handlePkgxUnlink), [handleDelete, handleToggleActive, router, data, handleUpdateName, handleUpdateSortOrder, handleSyncSeo, handleSyncDescription, handleSyncAll, handleSyncBasic, hasPkgxMapping, getPkgxCatId, handlePkgxLink, handlePkgxUnlink]);

  React.useEffect(() => { if (Object.keys(columnVisibility).length > 0) return; const dv = ['thumbnailImage', 'id', 'name', 'sortOrder', 'level', 'childCount', 'productCount', 'seoPkgx', 'seoTrendtech', 'pkgxStatus', 'pkgx', 'isActive', 'createdAt']; const all = ['select', ...dv, 'actions']; const iv: Record<string, boolean> = {}; all.forEach(id => iv[id] = id === 'select' || id === 'actions' || dv.includes(id)); setColumnVisibility(iv); setColumnOrder(all); }, [columnVisibility, setColumnVisibility]);

  const fuseOpts = React.useMemo(() => ({ keys: ["id", "name", "path", "slug"], threshold: 0.3, ignoreLocation: true }), []);
  const searchedCategories = useFuseFilter(activeCategories, debouncedGlobalFilter, fuseOpts);
  const confirmDelete = () => { if (idToDelete) { remove(asSystemId(idToDelete)); toast.success("Đã xóa danh mục"); } setIsAlertOpen(false); setIdToDelete(null); };
  const confirmBulkDelete = () => { const ids = Object.keys(rowSelection); const hasChildren = ids.filter(id => data.some(c => c.parentId === id && !c.isDeleted)); if (hasChildren.length > 0) { toast.error('Không thể xóa danh mục có danh mục con'); return; } ids.forEach(id => remove(asSystemId(id))); toast.success(`Đã xóa ${ids.length} danh mục`); setRowSelection({}); setIsBulkDeleteAlertOpen(false); };

  const statusOpts = React.useMemo(() => [{ value: 'active', label: 'Hoạt động' }, { value: 'inactive', label: 'Tạm tắt' }], []);
  const levelOpts = React.useMemo(() => Array.from({ length: Math.max(...activeCategories.map(c => c.level ?? 0), 0) + 1 }, (_, i) => ({ value: String(i), label: `Cấp ${i}` })), [activeCategories]);

  const filteredData = React.useMemo(() => { let r = activeCategories; if (statusFilter.size > 0) r = r.filter(c => statusFilter.has(c.isActive !== false ? 'active' : 'inactive')); if (levelFilter.size > 0) r = r.filter(c => levelFilter.has(String(c.level ?? 0))); if (debouncedGlobalFilter) { const ids = new Set(searchedCategories.map(x => x.systemId)); r = r.filter(c => ids.has(c.systemId)); } return r; }, [activeCategories, statusFilter, levelFilter, debouncedGlobalFilter, searchedCategories]);

  const sortedData = React.useMemo(() => { const s = [...filteredData]; if (sorting.id) s.sort((a, b) => { const av = (a as Record<string, unknown>)[sorting.id], bv = (b as Record<string, unknown>)[sorting.id]; if (sorting.id === 'createdAt') return sorting.desc ? new Date(bv as string).getTime() - new Date(av as string).getTime() : new Date(av as string).getTime() - new Date(bv as string).getTime(); if (sorting.id === 'level') return sorting.desc ? (bv as number || 0) - (av as number || 0) : (av as number || 0) - (bv as number || 0); const as = String(av ?? ''), bs = String(bv ?? ''); return sorting.desc ? bs.localeCompare(as) : as.localeCompare(bs); }); return s; }, [filteredData, sorting]);

  const allSelectedRows = React.useMemo(() => activeCategories.filter(c => rowSelection[String(c.systemId)]), [activeCategories, rowSelection]);
  React.useEffect(() => { if (!isMobile) return; const h = () => { if ((window.pageYOffset + window.innerHeight) / document.documentElement.scrollHeight > 0.8 && mobileLoadedCount < sortedData.length) setMobileLoadedCount(p => Math.min(p + 20, sortedData.length)); }; window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, [isMobile, mobileLoadedCount, sortedData.length]);
  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedGlobalFilter, statusFilter, levelFilter]);
  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);

  usePageHeader({ actions: [<Button key="add" size="sm" className="h-9" onClick={() => router.push('/categories/new')}><Plus className="mr-2 h-4 w-4" />Thêm danh mục</Button>], showBackButton: false });

  const pkgxBulkActions = React.useMemo(() => [
    { label: "Đồng bộ tất cả", icon: RefreshCw, onSelect: async (rows: ProductCategory[]) => { if (!pkgxSettings.enabled) { toast.error('PKGX chưa được bật'); return; } const linked = rows.filter(c => hasPkgxMapping(c)); if (!linked.length) { toast.error('Không có danh mục liên kết PKGX'); return; } if (!confirm(`Đồng bộ tất cả cho ${linked.length} danh mục?`)) return; toast.info(`Đang đồng bộ ${linked.length} danh mục...`); let ok = 0, err = 0; for (const c of linked) { try { const id = getPkgxCatId(c); if (!id) continue; const seo = c.websiteSeo?.pkgx; const r = await updateCategory(id, { cat_name: c.name, cat_alias: seo?.slug || c.slug || '', keywords: seo?.seoKeywords || c.seoKeywords || c.name, meta_title: seo?.seoTitle || c.seoTitle || c.name, meta_desc: seo?.metaDescription || c.metaDescription || '', short_desc: seo?.shortDescription || c.shortDescription || '', cat_desc: seo?.longDescription || c.longDescription || '' }); r.success ? ok++ : err++; } catch { err++; } } setRowSelection({}); if (ok > 0) toast.success(`Đã đồng bộ ${ok}`); if (err > 0) toast.error(`Lỗi ${err}`); } },
    { label: "SEO", icon: Search, onSelect: async (rows: ProductCategory[]) => { if (!pkgxSettings.enabled) { toast.error('PKGX chưa được bật'); return; } const linked = rows.filter(c => hasPkgxMapping(c)); if (!linked.length) { toast.error('Không có danh mục liên kết PKGX'); return; } toast.info(`Đang đồng bộ SEO ${linked.length}...`); let ok = 0, err = 0; for (const c of linked) { try { const id = getPkgxCatId(c); if (!id) continue; const seo = c.websiteSeo?.pkgx; const r = await updateCategory(id, { cat_alias: seo?.slug || c.slug || '', keywords: seo?.seoKeywords || c.seoKeywords || c.name, meta_title: seo?.seoTitle || c.seoTitle || c.name, meta_desc: seo?.metaDescription || c.metaDescription || '', short_desc: seo?.shortDescription || c.shortDescription || '' }); r.success ? ok++ : err++; } catch { err++; } } setRowSelection({}); if (ok > 0) toast.success(`Đã đồng bộ SEO ${ok}`); if (err > 0) toast.error(`Lỗi ${err}`); } },
    { label: "Mô tả", icon: AlignLeft, onSelect: async (rows: ProductCategory[]) => { if (!pkgxSettings.enabled) { toast.error('PKGX chưa được bật'); return; } const linked = rows.filter(c => hasPkgxMapping(c)); if (!linked.length) { toast.error('Không có danh mục liên kết PKGX'); return; } toast.info(`Đang đồng bộ mô tả ${linked.length}...`); let ok = 0, err = 0; for (const c of linked) { try { const id = getPkgxCatId(c); if (!id) continue; const seo = c.websiteSeo?.pkgx; const r = await updateCategory(id, { cat_desc: seo?.longDescription || c.longDescription || '', short_desc: seo?.shortDescription || c.shortDescription || '' }); r.success ? ok++ : err++; } catch { err++; } } setRowSelection({}); if (ok > 0) toast.success(`Đã đồng bộ mô tả ${ok}`); if (err > 0) toast.error(`Lỗi ${err}`); } },
    { label: "Thông tin cơ bản", icon: FolderEdit, onSelect: async (rows: ProductCategory[]) => { if (!pkgxSettings.enabled) { toast.error('PKGX chưa được bật'); return; } const linked = rows.filter(c => hasPkgxMapping(c)); if (!linked.length) { toast.error('Không có danh mục liên kết PKGX'); return; } if (!confirm(`Đồng bộ thông tin cơ bản cho ${linked.length} danh mục?`)) return; toast.info(`Đang đồng bộ ${linked.length}...`); let ok = 0, err = 0; for (const c of linked) { try { const id = getPkgxCatId(c); if (!id) continue; const r = await updateCategoryBasic(id, { cat_name: c.name, is_show: c.isActive ? 1 : 0 }); r.success ? ok++ : err++; } catch { err++; } } setRowSelection({}); if (ok > 0) toast.success(`Đã đồng bộ ${ok}`); if (err > 0) toast.error(`Lỗi ${err}`); } },
    { label: "Xem trên PKGX", icon: ExternalLink, onSelect: (rows: ProductCategory[]) => { const linked = rows.filter(c => hasPkgxMapping(c)); if (!linked.length) { toast.error('Không có danh mục liên kết PKGX'); return; } const id = getPkgxCatId(linked[0]); if (id) window.open(`https://phukiengiaxuong.com.vn/admin/category.php?act=edit&cat_id=${id}`, '_blank'); } },
  ], [pkgxSettings.enabled, hasPkgxMapping, getPkgxCatId]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}><FileUp className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={[<DataTableColumnCustomizer key="c" columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />]} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm theo mã, tên danh mục..." rightFilters={<><DataTableFacetedFilter title="Cấp độ" options={levelOpts} selectedValues={levelFilter} onSelectedValuesChange={setLevelFilter} /><DataTableFacetedFilter title="Trạng thái" options={statusOpts} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} /></>} />
      {isMobile ? (<div className="space-y-2 flex-1 overflow-y-auto">{sortedData.length === 0 ? <Card><CardContent className="p-8 text-center text-muted-foreground">Không tìm thấy danh mục</CardContent></Card> : <>{sortedData.slice(0, mobileLoadedCount).map(c => <MobileCategoryCard key={String(c.systemId)} category={c} onDelete={handleDelete} onToggleActive={handleToggleActive} navigate={router.push} handleRowClick={handleRowClick} childCount={data.filter(x => x.parentId === c.systemId && !x.isDeleted).length} />)}{mobileLoadedCount < sortedData.length && <Card><CardContent className="p-4 text-center text-muted-foreground"><div className="flex items-center justify-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" /><span>Đang tải...</span></div></CardContent></Card>}{mobileLoadedCount >= sortedData.length && sortedData.length > 20 && <Card><CardContent className="p-4 text-center text-muted-foreground text-sm">Đã hiển thị {sortedData.length} danh mục</CardContent></Card>}</>}</div>) : (<div className="w-full py-4"><ResponsiveDataTable columns={columns} data={paginatedData} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={sortedData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={() => setIsBulkDeleteAlertOpen(true)} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} allSelectedRows={allSelectedRows} bulkActions={[{ label: 'Kích hoạt', icon: Power, onSelect: handleBulkActivate }, { label: 'Tắt', icon: PowerOff, onSelect: handleBulkDeactivate }, { label: 'Xóa', icon: Trash2, onSelect: () => setIsBulkDeleteAlertOpen(true) }]} pkgxBulkActions={pkgxBulkActions} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} renderMobileCard={c => <MobileCategoryCard category={c} onDelete={handleDelete} onToggleActive={handleToggleActive} navigate={router.push} handleRowClick={handleRowClick} childCount={data.filter(x => x.parentId === c.systemId && !x.isDeleted).length} />} /></div>)}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa danh mục?</AlertDialogTitle><AlertDialogDescription>Danh mục sẽ bị xóa khỏi hệ thống.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Đóng</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa {Object.keys(rowSelection).length} danh mục?</AlertDialogTitle><AlertDialogDescription>Các danh mục sẽ bị xóa khỏi hệ thống.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Đóng</AlertDialogCancel><AlertDialogAction onClick={confirmBulkDelete}>Xóa tất cả</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <PkgxCategoryLinkDialog open={pkgxLinkDialogOpen} onOpenChange={setPkgxLinkDialogOpen} category={categoryToLink} onSuccess={() => {}} />
      <CategoryImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} existingData={activeCategories} onImport={handleImport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : undefined} />
      <CategoryExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} allData={activeCategories} filteredData={sortedData} currentPageData={paginatedData} selectedData={allSelectedRows} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : { systemId: asSystemId('SYSTEM'), name: 'System' }} />
    </div>
  );
}
