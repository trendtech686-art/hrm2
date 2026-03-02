/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client'

import * as React from "react";
import { useRouter } from 'next/navigation';
import { Plus, Power, PowerOff, RefreshCw, Search, AlignLeft, ExternalLink, FolderEdit, FileUp, Download, Archive } from "lucide-react";
import { asSystemId } from "@/lib/id-types";
import { useColumnVisibility } from "../../hooks/use-column-visibility";
import { usePageHeader } from "../../contexts/page-header-context";
import { useCategories, useCategoryMutations, useBulkCategoryMutations } from "./hooks/use-categories";
import type { Category } from "./api/categories-api";
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
import { simpleSearch } from "@/lib/simple-search";
import { getColumns } from "./columns";
import { MobileCategoryCard } from "./card";
import dynamic from 'next/dynamic';
import { usePkgxCategorySync } from "./hooks/use-pkgx-category-sync";
import { usePkgxSettings, usePkgxCategoryMappingMutations } from "../settings/pkgx/hooks/use-pkgx-settings";
import { updateCategory as updatePkgxCategory, updateCategoryBasic } from "@/lib/pkgx/api-service";
import { PkgxCategoryLinkDialog } from "./components/pkgx-link-dialog";
import { useAuth } from "@/contexts/auth-context";

const CategoryImportDialog = dynamic(() => import("./components/categories-import-export-dialogs").then(mod => ({ default: mod.CategoryImportDialog })), { ssr: false });
const CategoryExportDialog = dynamic(() => import("./components/categories-import-export-dialogs").then(mod => ({ default: mod.CategoryExportDialog })), { ssr: false });

export function ProductCategoriesPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { employee: authEmployee } = useAuth();
  
  // Use React Query instead of Zustand store - use all=true to get all categories
  const { data: queryData, isLoading: _isLoading } = useCategories({ all: true });
  const data = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const { create, update, remove } = useCategoryMutations({
    onCreateSuccess: () => toast.success("Đã thêm danh mục"),
    onUpdateSuccess: () => toast.success("Đã cập nhật danh mục"),
    onDeleteSuccess: () => toast.success("Đã xóa danh mục"),
    onError: (err) => toast.error(err.message)
  });
  const { bulkDelete, bulkActivate, bulkDeactivate } = useBulkCategoryMutations({
    onSuccess: () => toast.success("Thao tác hàng loạt thành công"),
    onError: (err) => toast.error(err.message)
  });
  
  const activeCategories = React.useMemo(() => data.filter((c: Category) => !c.isDeleted), [data]);
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
  const [categoryToLink, setCategoryToLink] = React.useState<Category | null>(null);

  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  const { handleSyncSeo, handleSyncDescription, handleSyncAll, handleSyncBasic, hasPkgxMapping, getPkgxCatId } = usePkgxCategorySync();
  
  const { data: pkgxSettings } = usePkgxSettings();
  const { deleteCategoryMapping } = usePkgxCategoryMappingMutations({ onSuccess: () => {} });
  
  // Helper to find mapping by HRM category ID
  const getCategoryMappingByHrmId = React.useCallback((hrmCatId: string) => {
    return pkgxSettings?.categoryMappings?.find(m => m.hrmCategorySystemId === hrmCatId || m.hrmCategoryId === hrmCatId);
  }, [pkgxSettings?.categoryMappings]);

  const handleDelete = React.useCallback((systemId: string) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleToggleActive = React.useCallback((systemId: string, isActive: boolean) => { update.mutate({ systemId, data: { isActive } }); }, [update]);
  const handleUpdateName = React.useCallback((systemId: string, name: string) => { update.mutate({ systemId, data: { name } }); }, [update]);
  const handleUpdateSortOrder = React.useCallback((systemId: string, sortOrder: number) => { update.mutate({ systemId, data: { sortOrder } }); }, [update]);
  const handleBulkActivate = React.useCallback(() => { const ids = Object.keys(rowSelection); bulkActivate.mutate(ids); setRowSelection({}); }, [rowSelection, bulkActivate]);
  const handleBulkDeactivate = React.useCallback(() => { const ids = Object.keys(rowSelection); bulkDeactivate.mutate(ids); setRowSelection({}); }, [rowSelection, bulkDeactivate]);
  const handleRowClick = React.useCallback((c: Category) => router.push(`/categories/${c.systemId}`), [router]);
  const handlePkgxLink = React.useCallback((c: Category) => { setCategoryToLink(c); setPkgxLinkDialogOpen(true); }, []);
  const handlePkgxUnlink = React.useCallback((c: Category) => { const m = getCategoryMappingByHrmId(c.systemId); if (m) { deleteCategoryMapping.mutate(m.systemId || m.id || ''); toast.success(`Đã hủy liên kết "${c.name}"`); } }, [getCategoryMappingByHrmId, deleteCategoryMapping]);

  const handleImport = React.useCallback(async (importData: Partial<Category>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => {
    const results = { success: 0, failed: 0, inserted: 0, updated: 0, skipped: 0, errors: [] as Array<{ row: number; message: string }> };
    for (let i = 0; i < importData.length; i++) {
      const item = importData[i];
      try {
        const existing = activeCategories.find((c: Category) => item.id && c.id === item.id);
        if (existing) { if (mode === 'insert-only') { results.skipped++; continue; } const upd: Partial<Category> = { ...item, updatedAt: new Date() }; delete (upd as Partial<Category> & { systemId?: unknown }).systemId; delete (upd as Partial<Category> & { createdAt?: unknown }).createdAt; if (item.parentId && item.parentId !== existing.parentId) { const p = data.find((c: Category) => c.systemId === item.parentId); if (p) { upd.path = p.path ? `${p.path} > ${item.name || existing.name}` : (item.name || existing.name); upd.level = (p.level ?? 0) + 1; } } update.mutate({ systemId: existing.systemId, data: upd }); results.updated++; results.success++; }
        else { if (mode === 'update-only') { results.skipped++; continue; } let path = item.name || '', level = 0; if (item.parentId) { const p = data.find((c: Category) => c.systemId === item.parentId); if (p) { path = p.path ? `${p.path} > ${item.name}` : (item.name || ''); level = (p.level ?? 0) + 1; } } create.mutate({ name: item.name || '', path, level, sortOrder: item.sortOrder ?? 0, isActive: item.isActive !== false, slug: undefined, parentId: undefined, seoTitle: undefined, metaDescription: undefined, seoKeywords: undefined, shortDescription: undefined, longDescription: undefined, websiteSeo: undefined, color: undefined, icon: undefined, imageUrl: undefined, thumbnail: undefined, description: undefined, ogImage: undefined }); results.inserted++; results.success++; }
      } catch (err) { results.failed++; results.errors.push({ row: i + 1, message: err instanceof Error ? err.message : 'Lỗi' }); }
    }
    return results;
  }, [activeCategories, data, create, update]);

  const columns = React.useMemo(() => getColumns(handleDelete, handleToggleActive, router.push, data, handleUpdateName, handleUpdateSortOrder, handleSyncSeo, handleSyncDescription, handleSyncAll, handleSyncBasic, hasPkgxMapping, getPkgxCatId, handlePkgxLink, handlePkgxUnlink), [handleDelete, handleToggleActive, router, data, handleUpdateName, handleUpdateSortOrder, handleSyncSeo, handleSyncDescription, handleSyncAll, handleSyncBasic, hasPkgxMapping, getPkgxCatId, handlePkgxLink, handlePkgxUnlink]);

  React.useEffect(() => { if (Object.keys(columnVisibility).length > 0) return; const dv = ['thumbnailImage', 'id', 'name', 'sortOrder', 'level', 'childCount', 'productCount', 'seoPkgx', 'seoTrendtech', 'pkgxStatus', 'pkgx', 'isActive', 'createdAt']; const all = ['select', ...dv, 'actions']; const iv: Record<string, boolean> = {}; all.forEach(id => iv[id] = id === 'select' || id === 'actions' || dv.includes(id)); setColumnVisibility(iv); setColumnOrder(all); }, [columnVisibility, setColumnVisibility]);

  const searchedCategories = React.useMemo(() => 
    simpleSearch(activeCategories, debouncedGlobalFilter, { keys: ['id', 'name', 'path', 'slug'] }), 
    [activeCategories, debouncedGlobalFilter]
  );
  const confirmDelete = () => { if (idToDelete) { remove.mutate(idToDelete); } setIsAlertOpen(false); setIdToDelete(null); };
  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection);
    bulkDelete.mutate(selectedIds);
    setRowSelection({});
    setIsBulkDeleteAlertOpen(false);
  };

  const statusOpts = React.useMemo(() => [{ value: 'active', label: 'Hoạt động' }, { value: 'inactive', label: 'Tạm tắt' }], []);
  const levelOpts = React.useMemo(() => Array.from({ length: Math.max(...activeCategories.map(c => c.level ?? 0), 0) + 1 }, (_, i) => ({ value: String(i), label: `Cấp ${i}` })), [activeCategories]);

  const filteredData = React.useMemo(() => { let r = activeCategories; if (statusFilter.size > 0) r = r.filter(c => statusFilter.has(c.isActive !== false ? 'active' : 'inactive')); if (levelFilter.size > 0) r = r.filter(c => levelFilter.has(String(c.level ?? 0))); if (debouncedGlobalFilter) { const ids = new Set(searchedCategories.map(x => x.systemId)); r = r.filter(c => ids.has(c.systemId)); } return r; }, [activeCategories, statusFilter, levelFilter, debouncedGlobalFilter, searchedCategories]);

  const sortedData = React.useMemo(() => { const s = [...filteredData]; if (sorting.id) s.sort((a, b) => { const av = (a as Record<string, unknown>)[sorting.id], bv = (b as Record<string, unknown>)[sorting.id]; if (sorting.id === 'createdAt') return sorting.desc ? new Date(bv as string).getTime() - new Date(av as string).getTime() : new Date(av as string).getTime() - new Date(bv as string).getTime(); if (sorting.id === 'level') return sorting.desc ? (bv as number || 0) - (av as number || 0) : (av as number || 0) - (bv as number || 0); const as = String(av ?? ''), bs = String(bv ?? ''); return sorting.desc ? bs.localeCompare(as) : as.localeCompare(bs); }); return s; }, [filteredData, sorting]);

  const allSelectedRows = React.useMemo(() => activeCategories.filter(c => rowSelection[String(c.systemId)]), [activeCategories, rowSelection]);
  React.useEffect(() => { if (!isMobile) return; const h = () => { if ((window.pageYOffset + window.innerHeight) / document.documentElement.scrollHeight > 0.8 && mobileLoadedCount < sortedData.length) setMobileLoadedCount(p => Math.min(p + 20, sortedData.length)); }; window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, [isMobile, mobileLoadedCount, sortedData.length]);
  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedGlobalFilter, statusFilter, levelFilter]);
  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);

  usePageHeader({ actions: [
    <Button key="trash" variant="outline" size="sm" className="h-9" onClick={() => router.push('/categories/trash')}><Archive className="mr-2 h-4 w-4" />Thùng rác</Button>,
    <Button key="add" size="sm" className="h-9" onClick={() => router.push('/categories/new')}><Plus className="mr-2 h-4 w-4" />Thêm danh mục</Button>
  ], showBackButton: false });

  const pkgxBulkActions = React.useMemo(() => [
    { label: "Đồng bộ tất cả", icon: RefreshCw, onSelect: async (rows: Category[]) => { if (!pkgxSettings?.enabled) { toast.error('PKGX chưa được bật'); return; } const linked = rows.filter(c => hasPkgxMapping(c)); if (!linked.length) { toast.error('Không có danh mục liên kết PKGX'); return; } if (!confirm(`Đồng bộ tất cả cho ${linked.length} danh mục?`)) return; toast.info(`Đang đồng bộ ${linked.length} danh mục...`); let ok = 0, err = 0; for (const c of linked) { try { const id = getPkgxCatId(c); if (!id) continue; const seo = (c as unknown as { websiteSeo?: { pkgx?: { slug?: string; seoKeywords?: string; seoTitle?: string; metaDescription?: string; shortDescription?: string; longDescription?: string } } }).websiteSeo?.pkgx; const r = await updatePkgxCategory(id, { cat_name: c.name, cat_alias: seo?.slug || (c as unknown as { slug?: string }).slug || '', keywords: seo?.seoKeywords || (c as unknown as { seoKeywords?: string }).seoKeywords || c.name, meta_title: seo?.seoTitle || (c as unknown as { seoTitle?: string }).seoTitle || c.name, meta_desc: seo?.metaDescription || (c as unknown as { metaDescription?: string }).metaDescription || '', short_desc: seo?.shortDescription || (c as unknown as { shortDescription?: string }).shortDescription || '', cat_desc: seo?.longDescription || (c as unknown as { longDescription?: string }).longDescription || '' }, pkgxSettings); r.success ? ok++ : err++; } catch { err++; } } setRowSelection({}); if (ok > 0) toast.success(`Đã đồng bộ ${ok}`); if (err > 0) toast.error(`Lỗi ${err}`); } },
    { label: "SEO", icon: Search, onSelect: async (rows: Category[]) => { if (!pkgxSettings?.enabled) { toast.error('PKGX chưa được bật'); return; } const linked = rows.filter(c => hasPkgxMapping(c)); if (!linked.length) { toast.error('Không có danh mục liên kết PKGX'); return; } toast.info(`Đang đồng bộ SEO ${linked.length}...`); let ok = 0, err = 0; for (const c of linked) { try { const id = getPkgxCatId(c); if (!id) continue; const seo = (c as unknown as { websiteSeo?: { pkgx?: { slug?: string; seoKeywords?: string; seoTitle?: string; metaDescription?: string; shortDescription?: string } } }).websiteSeo?.pkgx; const r = await updatePkgxCategory(id, { cat_alias: seo?.slug || (c as unknown as { slug?: string }).slug || '', keywords: seo?.seoKeywords || (c as unknown as { seoKeywords?: string }).seoKeywords || c.name, meta_title: seo?.seoTitle || (c as unknown as { seoTitle?: string }).seoTitle || c.name, meta_desc: seo?.metaDescription || (c as unknown as { metaDescription?: string }).metaDescription || '', short_desc: seo?.shortDescription || (c as unknown as { shortDescription?: string }).shortDescription || '' }, pkgxSettings); r.success ? ok++ : err++; } catch { err++; } } setRowSelection({}); if (ok > 0) toast.success(`Đã đồng bộ SEO ${ok}`); if (err > 0) toast.error(`Lỗi ${err}`); } },
    { label: "Mô tả", icon: AlignLeft, onSelect: async (rows: Category[]) => { if (!pkgxSettings?.enabled) { toast.error('PKGX chưa được bật'); return; } const linked = rows.filter(c => hasPkgxMapping(c)); if (!linked.length) { toast.error('Không có danh mục liên kết PKGX'); return; } toast.info(`Đang đồng bộ mô tả ${linked.length}...`); let ok = 0, err = 0; for (const c of linked) { try { const id = getPkgxCatId(c); if (!id) continue; const seo = (c as unknown as { websiteSeo?: { pkgx?: { shortDescription?: string; longDescription?: string } } }).websiteSeo?.pkgx; const r = await updatePkgxCategory(id, { cat_desc: seo?.longDescription || (c as unknown as { longDescription?: string }).longDescription || '', short_desc: seo?.shortDescription || (c as unknown as { shortDescription?: string }).shortDescription || '' }, pkgxSettings); r.success ? ok++ : err++; } catch { err++; } } setRowSelection({}); if (ok > 0) toast.success(`Đã đồng bộ mô tả ${ok}`); if (err > 0) toast.error(`Lỗi ${err}`); } },
    { label: "Thông tin cơ bản", icon: FolderEdit, onSelect: async (rows: Category[]) => { if (!pkgxSettings?.enabled) { toast.error('PKGX chưa được bật'); return; } const linked = rows.filter(c => hasPkgxMapping(c)); if (!linked.length) { toast.error('Không có danh mục liên kết PKGX'); return; } if (!confirm(`Đồng bộ thông tin cơ bản cho ${linked.length} danh mục?`)) return; toast.info(`Đang đồng bộ ${linked.length}...`); let ok = 0, err = 0; for (const c of linked) { try { const id = getPkgxCatId(c); if (!id) continue; const r = await updateCategoryBasic(id, { cat_name: c.name, is_show: c.isActive ? 1 : 0 }, pkgxSettings); r.success ? ok++ : err++; } catch { err++; } } setRowSelection({}); if (ok > 0) toast.success(`Đã đồng bộ ${ok}`); if (err > 0) toast.error(`Lỗi ${err}`); } },
    { label: "Xem trên PKGX", icon: ExternalLink, onSelect: (rows: Category[]) => { const linked = rows.filter(c => hasPkgxMapping(c)); if (!linked.length) { toast.error('Không có danh mục liên kết PKGX'); return; } const id = getPkgxCatId(linked[0]); if (id) window.open(`https://phukiengiaxuong.com.vn/admin/category.php?act=edit&cat_id=${id}`, '_blank'); } },
  ], [pkgxSettings, hasPkgxMapping, getPkgxCatId]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}><FileUp className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={[<DataTableColumnCustomizer key="c" columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />]} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm theo mã, tên danh mục..." rightFilters={<><DataTableFacetedFilter title="Cấp độ" options={levelOpts} selectedValues={levelFilter} onSelectedValuesChange={setLevelFilter} /><DataTableFacetedFilter title="Trạng thái" options={statusOpts} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} /></>} />
      {isMobile ? (<div className="space-y-2 flex-1 overflow-y-auto">{sortedData.length === 0 ? <Card><CardContent className="p-8 text-center text-muted-foreground">Không tìm thấy danh mục</CardContent></Card> : <>{sortedData.slice(0, mobileLoadedCount).map(c => <MobileCategoryCard key={String(c.systemId)} category={c} onDelete={handleDelete} onToggleActive={handleToggleActive} navigate={router.push} handleRowClick={handleRowClick} childCount={data.filter(x => x.parentId === c.systemId && !x.isDeleted).length} />)}{mobileLoadedCount < sortedData.length && <Card><CardContent className="p-4 text-center text-muted-foreground"><div className="flex items-center justify-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" /><span>Đang tải...</span></div></CardContent></Card>}{mobileLoadedCount >= sortedData.length && sortedData.length > 20 && <Card><CardContent className="p-4 text-center text-muted-foreground text-sm">Đã hiển thị {sortedData.length} danh mục</CardContent></Card>}</>}</div>) : (<div className="w-full py-4"><ResponsiveDataTable columns={columns} data={paginatedData} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={sortedData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={() => setIsBulkDeleteAlertOpen(true)} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} allSelectedRows={allSelectedRows} bulkActions={[{ label: 'Kích hoạt', icon: Power, onSelect: handleBulkActivate }, { label: 'Tắt', icon: PowerOff, onSelect: handleBulkDeactivate }, { label: 'Chuyển vào thùng rác', icon: Archive, onSelect: () => setIsBulkDeleteAlertOpen(true) }]} pkgxBulkActions={pkgxBulkActions} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} renderMobileCard={c => <MobileCategoryCard category={c} onDelete={handleDelete} onToggleActive={handleToggleActive} navigate={router.push} handleRowClick={handleRowClick} childCount={data.filter(x => x.parentId === c.systemId && !x.isDeleted).length} />} /></div>)}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa danh mục?</AlertDialogTitle><AlertDialogDescription>Danh mục sẽ bị xóa khỏi hệ thống.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Đóng</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Chuyển {Object.keys(rowSelection).length} danh mục vào thùng rác?</AlertDialogTitle><AlertDialogDescription>Bạn có thể khôi phục lại từ thùng rác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Đóng</AlertDialogCancel><AlertDialogAction onClick={confirmBulkDelete}>Chuyển vào thùng rác</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <PkgxCategoryLinkDialog open={pkgxLinkDialogOpen} onOpenChange={setPkgxLinkDialogOpen} category={categoryToLink} onSuccess={() => {}} />
      <CategoryImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} existingData={activeCategories} onImport={handleImport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : undefined} />
      <CategoryExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} allData={activeCategories} filteredData={sortedData} currentPageData={paginatedData} selectedData={allSelectedRows} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : { systemId: asSystemId('SYSTEM'), name: 'System' }} />
    </div>
  );
}
