import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from 'zustand/react/shallow';
import { Plus, Power, PowerOff, Trash2, RefreshCw, Search, AlignLeft, ExternalLink } from "lucide-react";
import { asSystemId, type SystemId } from "@/lib/id-types";
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { useProductCategoryStore } from "../settings/inventory/product-category-store.ts";
import type { ProductCategory } from "../settings/inventory/types.ts";
import { Button } from "../../components/ui/button.tsx";
import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog.tsx";
import { DataTableColumnCustomizer } from "@/components/data-table/data-table-column-toggle.tsx";
import { DataTableExportDialog } from "@/components/data-table/data-table-export-dialog.tsx";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter.tsx";
import { PageToolbar } from "@/components/layout/page-toolbar.tsx";
import { PageFilters } from "@/components/layout/page-filters.tsx";
import { useMediaQuery } from "@/lib/use-media-query.ts";
import { toast } from "sonner";
import Fuse from "fuse.js";
import { getColumns } from "./columns.tsx";
import { MobileCategoryCard } from "./card.tsx";
import { usePkgxCategorySync } from "./hooks/use-pkgx-category-sync.ts";
import { usePkgxSettingsStore } from "../settings/pkgx/store.ts";
import { updateCategory } from "@/lib/pkgx/api-service.ts";

export function ProductCategoriesPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // ✅ Use shallow comparison to prevent unnecessary re-renders
  const { data, update, remove } = useProductCategoryStore(
    useShallow((state) => ({
      data: state.data,
      update: state.update,
      remove: state.remove,
    }))
  );

  const activeCategories = React.useMemo(() => data.filter(c => !c.isDeleted), [data]);

  // State
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);

  const [sorting, setSorting] = React.useState({ id: 'path', desc: false });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'categories-column-visibility';
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return {};
  });

  React.useEffect(() => {
    localStorage.setItem('categories-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'thumbnailImage', 'name']);

  // Filters
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [levelFilter, setLevelFilter] = React.useState<Set<string>>(new Set());

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Handlers
  const handleDelete = React.useCallback((systemId: string) => {
    // Check if has children
    const hasChildren = data.some(c => c.parentId === systemId && !c.isDeleted);
    if (hasChildren) {
      toast.error('Không thể xóa danh mục có danh mục con');
      return;
    }
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, [data]);

  const handleToggleActive = React.useCallback((systemId: string, isActive: boolean) => {
    update(asSystemId(systemId), { isActive });
    toast.success(isActive ? 'Đã kích hoạt danh mục' : 'Đã tắt danh mục');
  }, [update]);

  // Inline edit handlers
  const handleUpdateName = React.useCallback((systemId: string, name: string) => {
    update(asSystemId(systemId), { name });
    toast.success('Đã cập nhật tên danh mục');
  }, [update]);

  const handleUpdateSortOrder = React.useCallback((systemId: string, sortOrder: number) => {
    update(asSystemId(systemId), { sortOrder });
    toast.success('Đã cập nhật thứ tự');
  }, [update]);

  // Bulk actions
  const handleBulkActivate = React.useCallback(() => {
    const ids = Object.keys(rowSelection);
    ids.forEach(id => update(asSystemId(id), { isActive: true }));
    toast.success(`Đã kích hoạt ${ids.length} danh mục`);
    setRowSelection({});
  }, [rowSelection, update]);

  const handleBulkDeactivate = React.useCallback(() => {
    const ids = Object.keys(rowSelection);
    ids.forEach(id => update(asSystemId(id), { isActive: false }));
    toast.success(`Đã tắt ${ids.length} danh mục`);
    setRowSelection({});
  }, [rowSelection, update]);

  const handleRowClick = React.useCallback((category: ProductCategory) => {
    navigate(`/categories/${category.systemId}`);
  }, [navigate]);

  // PKGX Sync Hook
  const { handleSyncSeo, handleSyncDescription, handleSyncAll, hasPkgxMapping, getPkgxCatId } = usePkgxCategorySync();
  const pkgxSettings = usePkgxSettingsStore((s) => s.settings);

  const columns = React.useMemo(() => getColumns(
    handleDelete, 
    handleToggleActive, 
    navigate, 
    data,
    handleUpdateName,
    handleUpdateSortOrder,
    // PKGX handlers
    handleSyncSeo,
    handleSyncDescription,
    handleSyncAll,
    hasPkgxMapping,
    getPkgxCatId,
  ), [handleDelete, handleToggleActive, navigate, data, handleUpdateName, handleUpdateSortOrder, handleSyncSeo, handleSyncDescription, handleSyncAll, hasPkgxMapping, getPkgxCatId]);

  // Export config
  const exportConfig = {
    fileName: 'Danh_muc_san_pham',
    columns,
  };

  // Set default column visibility - only on mount
  React.useEffect(() => {
    // Skip if already has stored visibility
    const storageKey = 'categories-column-visibility';
    const stored = localStorage.getItem(storageKey);
    if (stored) return;
    
    const defaultVisibleColumns = ['thumbnailImage', 'id', 'name', 'sortOrder', 'level', 'childCount', 'productCount', 'seoPkgx', 'seoTrendtech', 'pkgx', 'isActive', 'createdAt'];
    const columnIds = ['select', 'thumbnailImage', 'id', 'name', 'sortOrder', 'level', 'childCount', 'productCount', 'seoPkgx', 'seoTrendtech', 'pkgx', 'isActive', 'createdAt', 'actions'];
    const initialVisibility: Record<string, boolean> = {};
    columnIds.forEach(id => {
      if (id === 'select' || id === 'actions') {
        initialVisibility[id] = true;
      } else {
        initialVisibility[id] = defaultVisibleColumns.includes(id);
      }
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columnIds);
  }, []);

  const fuse = React.useMemo(() => new Fuse(activeCategories, {
    keys: ["id", "name", "path", "slug"],
    threshold: 0.3,
    ignoreLocation: true
  }), [activeCategories]);

  const confirmDelete = () => {
    if (idToDelete) {
      remove(asSystemId(idToDelete));
      toast.success("Đã xóa danh mục");
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };

  const confirmBulkDelete = () => {
    const idsToDelete = Object.keys(rowSelection);
    // Check for children
    const hasChildrenIds = idsToDelete.filter(id => 
      data.some(c => c.parentId === id && !c.isDeleted)
    );
    if (hasChildrenIds.length > 0) {
      toast.error('Không thể xóa danh mục có danh mục con');
      return;
    }
    idsToDelete.forEach(id => remove(asSystemId(id)));
    toast.success(`Đã xóa ${idsToDelete.length} danh mục`);
    setRowSelection({});
    setIsBulkDeleteAlertOpen(false);
  };

  // Filter options
  const statusOptions = React.useMemo(() => [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Tạm tắt' }
  ], []);

  const levelOptions = React.useMemo(() => {
    const maxLevel = Math.max(...activeCategories.map(c => c.level ?? 0), 0);
    return Array.from({ length: maxLevel + 1 }, (_, i) => ({
      value: String(i),
      label: `Cấp ${i}`
    }));
  }, [activeCategories]);

  // Apply all filters
  const filteredData = React.useMemo(() => {
    let result = activeCategories;

    // Status filter
    if (statusFilter.size > 0) {
      result = result.filter(c => {
        const status = c.isActive !== false ? 'active' : 'inactive';
        return statusFilter.has(status);
      });
    }

    // Level filter
    if (levelFilter.size > 0) {
      result = result.filter(c => levelFilter.has(String(c.level ?? 0)));
    }

    // Text search (debounced)
    if (debouncedGlobalFilter) {
      const searchResults = fuse.search(debouncedGlobalFilter);
      const searchIds = new Set(searchResults.map(r => r.item.systemId));
      result = result.filter(c => searchIds.has(c.systemId));
    }

    return result;
  }, [activeCategories, statusFilter, levelFilter, debouncedGlobalFilter, fuse]);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        if (sorting.id === 'createdAt') {
          const aTime = aValue ? new Date(aValue).getTime() : 0;
          const bTime = bValue ? new Date(bValue).getTime() : 0;
          return sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (sorting.id === 'level') {
          const aNum = typeof aValue === 'number' ? aValue : 0;
          const bNum = typeof bValue === 'number' ? bValue : 0;
          return sorting.desc ? bNum - aNum : aNum - bNum;
        }
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sorting]);

  const allSelectedRows = React.useMemo(() =>
    activeCategories.filter(c => rowSelection[String(c.systemId)]),
    [activeCategories, rowSelection]);

  // Mobile infinite scroll
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage > 0.8 && mobileLoadedCount < sortedData.length) {
        setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, sortedData.length]);

  // Reset mobile loaded count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [debouncedGlobalFilter, statusFilter, levelFilter]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);

  // Header actions
  const headerActions = React.useMemo(() => [
    <Button key="add" size="sm" className="h-9" onClick={() => navigate('/categories/new')}>
      <Plus className="mr-2 h-4 w-4" />
      Thêm danh mục
    </Button>
  ], [navigate]);

  // Dùng auto-generated title từ PATH_PATTERNS
  usePageHeader({
    actions: headerActions,
    showBackButton: false,
  });

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Desktop-only Toolbar */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <>
              <DataTableExportDialog
                allData={activeCategories}
                filteredData={sortedData}
                pageData={paginatedData}
                config={exportConfig}
              />
            </>
          }
          rightActions={[
            <DataTableColumnCustomizer
              key="customizer"
              columns={columns}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns}
              setPinnedColumns={setPinnedColumns}
            />
          ]}
        />
      )}

      {/* Filters Row */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm theo mã, tên danh mục..."
        rightFilters={
          <>
            <DataTableFacetedFilter
              title="Cấp độ"
              options={levelOptions}
              selectedValues={levelFilter}
              onSelectedValuesChange={setLevelFilter}
            />
            <DataTableFacetedFilter
              title="Trạng thái"
              options={statusOptions}
              selectedValues={statusFilter}
              onSelectedValuesChange={setStatusFilter}
            />
          </>
        }
      />

      {/* Mobile View - Cards */}
      {isMobile ? (
        <div className="space-y-2 flex-1 overflow-y-auto">
          {sortedData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Không tìm thấy danh mục nào
              </CardContent>
            </Card>
          ) : (
            <>
              {sortedData.slice(0, mobileLoadedCount).map(category => (
                <MobileCategoryCard
                  key={String(category.systemId)}
                  category={category}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  navigate={navigate}
                  handleRowClick={handleRowClick}
                  childCount={data.filter(c => c.parentId === category.systemId && !c.isDeleted).length}
                />
              ))}
              {mobileLoadedCount < sortedData.length && (
                <Card>
                  <CardContent className="p-4 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Đang tải thêm...</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              {mobileLoadedCount >= sortedData.length && sortedData.length > 20 && (
                <Card>
                  <CardContent className="p-4 text-center text-muted-foreground text-sm">
                    Đã hiển thị tất cả {sortedData.length} danh mục
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      ) : (
        /* Desktop View - Table */
        <div className="w-full py-4">
          <ResponsiveDataTable
            columns={columns}
            data={paginatedData}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={sortedData.length}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onBulkDelete={() => setIsBulkDeleteAlertOpen(true)}
            sorting={sorting}
            setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>}
            allSelectedRows={allSelectedRows}
            bulkActions={[
              {
                label: 'Kích hoạt',
                icon: Power,
                onSelect: handleBulkActivate,
              },
              {
                label: 'Tắt',
                icon: PowerOff,
                onSelect: handleBulkDeactivate,
              },
              {
                label: 'Xóa',
                icon: Trash2,
                onSelect: () => setIsBulkDeleteAlertOpen(true),
              },
            ]}
            pkgxBulkActions={[
              {
                label: "Đồng bộ tất cả",
                icon: RefreshCw,
                onSelect: async (selectedRows: ProductCategory[]) => {
                  if (!pkgxSettings.enabled) {
                    toast.error('PKGX chưa được bật');
                    return;
                  }
                  
                  const linkedCategories = selectedRows.filter(c => hasPkgxMapping(c));
                  if (linkedCategories.length === 0) {
                    toast.error('Không có danh mục nào đã liên kết PKGX');
                    return;
                  }
                  
                  if (!confirm(`Bạn có chắc muốn đồng bộ tất cả thông tin cho ${linkedCategories.length} danh mục?`)) {
                    return;
                  }
                  
                  toast.info(`Đang đồng bộ ${linkedCategories.length} danh mục...`);
                  
                  let successCount = 0;
                  let errorCount = 0;
                  
                  for (const category of linkedCategories) {
                    try {
                      const pkgxCatId = getPkgxCatId(category);
                      if (!pkgxCatId) continue;
                      
                      const pkgxSeo = category.websiteSeo?.pkgx;
                      const payload = {
                        cat_name: category.name,
                        cat_alias: pkgxSeo?.slug || category.slug || '',
                        keywords: pkgxSeo?.seoKeywords || category.seoKeywords || category.name,
                        meta_title: pkgxSeo?.seoTitle || category.seoTitle || category.name,
                        meta_desc: pkgxSeo?.metaDescription || category.metaDescription || '',
                        short_desc: pkgxSeo?.shortDescription || category.shortDescription || '',
                        cat_desc: pkgxSeo?.longDescription || category.longDescription || '',
                      };
                      
                      const response = await updateCategory(pkgxCatId, payload);
                      if (response.success) successCount++;
                      else errorCount++;
                    } catch {
                      errorCount++;
                    }
                  }
                  
                  setRowSelection({});
                  if (successCount > 0) toast.success(`Đã đồng bộ ${successCount} danh mục`);
                  if (errorCount > 0) toast.error(`Lỗi ${errorCount} danh mục`);
                }
              },
              {
                label: "SEO",
                icon: Search,
                onSelect: async (selectedRows: ProductCategory[]) => {
                  if (!pkgxSettings.enabled) {
                    toast.error('PKGX chưa được bật');
                    return;
                  }
                  
                  const linkedCategories = selectedRows.filter(c => hasPkgxMapping(c));
                  if (linkedCategories.length === 0) {
                    toast.error('Không có danh mục nào đã liên kết PKGX');
                    return;
                  }
                  
                  toast.info(`Đang đồng bộ SEO ${linkedCategories.length} danh mục...`);
                  
                  let successCount = 0;
                  let errorCount = 0;
                  
                  for (const category of linkedCategories) {
                    try {
                      const pkgxCatId = getPkgxCatId(category);
                      if (!pkgxCatId) continue;
                      
                      const pkgxSeo = category.websiteSeo?.pkgx;
                      const payload = {
                        cat_alias: pkgxSeo?.slug || category.slug || '',
                        keywords: pkgxSeo?.seoKeywords || category.seoKeywords || category.name,
                        meta_title: pkgxSeo?.seoTitle || category.seoTitle || category.name,
                        meta_desc: pkgxSeo?.metaDescription || category.metaDescription || '',
                        short_desc: pkgxSeo?.shortDescription || category.shortDescription || '',
                      };
                      
                      const response = await updateCategory(pkgxCatId, payload);
                      if (response.success) successCount++;
                      else errorCount++;
                    } catch {
                      errorCount++;
                    }
                  }
                  
                  setRowSelection({});
                  if (successCount > 0) toast.success(`Đã đồng bộ SEO ${successCount} danh mục`);
                  if (errorCount > 0) toast.error(`Lỗi ${errorCount} danh mục`);
                }
              },
              {
                label: "Mô tả",
                icon: AlignLeft,
                onSelect: async (selectedRows: ProductCategory[]) => {
                  if (!pkgxSettings.enabled) {
                    toast.error('PKGX chưa được bật');
                    return;
                  }
                  
                  const linkedCategories = selectedRows.filter(c => hasPkgxMapping(c));
                  if (linkedCategories.length === 0) {
                    toast.error('Không có danh mục nào đã liên kết PKGX');
                    return;
                  }
                  
                  toast.info(`Đang đồng bộ mô tả ${linkedCategories.length} danh mục...`);
                  
                  let successCount = 0;
                  let errorCount = 0;
                  
                  for (const category of linkedCategories) {
                    try {
                      const pkgxCatId = getPkgxCatId(category);
                      if (!pkgxCatId) continue;
                      
                      const pkgxSeo = category.websiteSeo?.pkgx;
                      const payload = {
                        cat_desc: pkgxSeo?.longDescription || category.longDescription || '',
                        short_desc: pkgxSeo?.shortDescription || category.shortDescription || '',
                      };
                      
                      const response = await updateCategory(pkgxCatId, payload);
                      if (response.success) successCount++;
                      else errorCount++;
                    } catch {
                      errorCount++;
                    }
                  }
                  
                  setRowSelection({});
                  if (successCount > 0) toast.success(`Đã đồng bộ mô tả ${successCount} danh mục`);
                  if (errorCount > 0) toast.error(`Lỗi ${errorCount} danh mục`);
                }
              },
              {
                label: "Xem trên PKGX",
                icon: ExternalLink,
                onSelect: (selectedRows: ProductCategory[]) => {
                  const linkedCategories = selectedRows.filter(c => hasPkgxMapping(c));
                  if (linkedCategories.length === 0) {
                    toast.error('Không có danh mục nào đã liên kết PKGX');
                    return;
                  }
                  const firstCategory = linkedCategories[0];
                  const pkgxId = getPkgxCatId(firstCategory);
                  if (pkgxId) {
                    window.open(`https://phukiengiaxuong.com.vn/admin/category.php?act=edit&cat_id=${pkgxId}`, '_blank');
                  }
                }
              },
            ]}
            expanded={{}}
            setExpanded={() => {}}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
            onRowClick={handleRowClick}
            renderMobileCard={(category) => (
              <MobileCategoryCard
                category={category}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                navigate={navigate}
                handleRowClick={handleRowClick}
                childCount={data.filter(c => c.parentId === category.systemId && !c.isDeleted).length}
              />
            )}
          />
        </div>
      )}

      {/* Delete Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
            <AlertDialogDescription>
              Danh mục sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Alert Dialog */}
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} danh mục?</AlertDialogTitle>
            <AlertDialogDescription>
              Các danh mục sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete}>Xóa tất cả</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
