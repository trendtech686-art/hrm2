import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from 'zustand/react/shallow';
import { Plus, Power, PowerOff, Trash2, RefreshCw, Search, AlignLeft, ExternalLink, Link2, Unlink, FileUp, Download } from "lucide-react";
import { asBusinessId, asSystemId, type SystemId } from "@/lib/id-types";
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { useBrandStore } from "../settings/inventory/brand-store.ts";
import type { Brand } from "../settings/inventory/types.ts";
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
import { MobileBrandCard } from "./card.tsx";
import { usePkgxBrandSync } from "./hooks/use-pkgx-brand-sync.ts";
import { usePkgxSettingsStore } from "../settings/pkgx/store.ts";
import { usePkgxBulkSync } from "../settings/pkgx/hooks/use-pkgx-bulk-sync.ts";
import { PkgxBulkSyncConfirmDialog } from "../settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx";
import { updateBrand } from "@/lib/pkgx/api-service.ts";
import { PkgxBrandLinkDialog } from "./components/pkgx-link-dialog.tsx";
import { PkgxBrandDetailDialog } from "./components/pkgx-brand-detail-dialog.tsx";
import { GenericImportDialogV2 } from "../../components/shared/generic-import-dialog-v2.tsx";
import { GenericExportDialogV2 } from "../../components/shared/generic-export-dialog-v2.tsx";
import { brandImportExportConfig } from "@/lib/import-export/configs/brand.config";
import { useAuth } from "@/contexts/auth-context.tsx";

export function BrandsPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { employee: authEmployee } = useAuth();
  
  // ✅ Use shallow comparison to prevent unnecessary re-renders
  const { data, add, update, remove } = useBrandStore(
    useShallow((state) => ({
      data: state.data,
      add: state.add,
      update: state.update,
      remove: state.remove,
    }))
  );

  const activeBrands = React.useMemo(() => data.filter(b => !b.isDeleted), [data]);

  // State
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);

  const [sorting, setSorting] = React.useState({ id: 'name', desc: false });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'brands-column-visibility';
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return {};
  });

  React.useEffect(() => {
    localStorage.setItem('brands-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'logo', 'name']);

  // Filters
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Handlers
  const handleDelete = React.useCallback((systemId: string) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);

  const handleToggleActive = React.useCallback((systemId: string, isActive: boolean) => {
    update(asSystemId(systemId), { isActive });
    toast.success(isActive ? 'Đã kích hoạt thương hiệu' : 'Đã tắt thương hiệu');
  }, [update]);

  // Inline edit handlers
  const handleUpdateName = React.useCallback((systemId: string, name: string) => {
    update(asSystemId(systemId), { name });
    toast.success('Đã cập nhật tên thương hiệu');
  }, [update]);

  // Bulk actions
  const handleBulkActivate = React.useCallback(() => {
    const ids = Object.keys(rowSelection);
    ids.forEach(id => update(asSystemId(id), { isActive: true }));
    toast.success(`Đã kích hoạt ${ids.length} thương hiệu`);
    setRowSelection({});
  }, [rowSelection, update]);

  const handleBulkDeactivate = React.useCallback(() => {
    const ids = Object.keys(rowSelection);
    ids.forEach(id => update(asSystemId(id), { isActive: false }));
    toast.success(`Đã tắt ${ids.length} thương hiệu`);
    setRowSelection({});
  }, [rowSelection, update]);

  const handleRowClick = React.useCallback((brand: Brand) => {
    navigate(`/brands/${brand.systemId}`);
  }, [navigate]);

  // PKGX Sync Hook
  const { handleSyncBasicInfo, handleSyncSeo, handleSyncDescription, handleSyncAll, hasPkgxMapping, getPkgxBrandId } = usePkgxBrandSync();
  const pkgxSettings = usePkgxSettingsStore((s) => s.settings);
  const deleteBrandMapping = usePkgxSettingsStore((s) => s.deleteBrandMapping);
  const getBrandMappingByHrmId = usePkgxSettingsStore((s) => s.getBrandMappingByHrmId);
  
  // Bulk sync hook for PKGX brands
  const {
    confirmAction: bulkConfirmAction,
    progress: bulkProgress,
    triggerBulkSync,
    executeAction: executeBulkAction,
    cancelConfirm: cancelBulkConfirm,
    getPkgxBrandId: hookGetPkgxBrandId,
  } = usePkgxBulkSync({ entityType: 'brand' });
  
  // PKGX Link Dialog state
  const [pkgxLinkDialogOpen, setPkgxLinkDialogOpen] = React.useState(false);
  const [brandToLink, setBrandToLink] = React.useState<Brand | null>(null);
  
  // PKGX Detail Dialog state
  const [pkgxDetailDialogOpen, setPkgxDetailDialogOpen] = React.useState(false);
  const [brandToViewDetail, setBrandToViewDetail] = React.useState<Brand | null>(null);
  const [pkgxBrandIdToView, setPkgxBrandIdToView] = React.useState<number | null>(null);
  
  // Import/Export Dialog states
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  
  // PKGX Link handlers
  const handlePkgxLink = React.useCallback((brand: Brand) => {
    setBrandToLink(brand);
    setPkgxLinkDialogOpen(true);
  }, []);
  
  const handlePkgxUnlink = React.useCallback((brand: Brand) => {
    const mapping = getBrandMappingByHrmId(brand.systemId);
    if (mapping) {
      deleteBrandMapping(mapping.id);
      toast.success(`Đã hủy liên kết thương hiệu "${brand.name}" với PKGX`);
    }
  }, [getBrandMappingByHrmId, deleteBrandMapping]);
  
  const handlePkgxLinkSuccess = React.useCallback(() => {
    // Refresh handled by store update
  }, []);
  
  // PKGX View Detail handler
  const handlePkgxViewDetail = React.useCallback((brand: Brand, pkgxBrandId: number) => {
    setBrandToViewDetail(brand);
    setPkgxBrandIdToView(pkgxBrandId);
    setPkgxDetailDialogOpen(true);
  }, []);

  const columns = React.useMemo(() => getColumns(
    handleDelete, 
    handleToggleActive, 
    navigate,
    handleUpdateName,
    // PKGX handlers - used by PkgxBrandActionsCell
    hasPkgxMapping,
    getPkgxBrandId,
    handlePkgxLink,
    handlePkgxUnlink,
    handlePkgxViewDetail,
  ), [handleDelete, handleToggleActive, navigate, handleUpdateName, hasPkgxMapping, getPkgxBrandId, handlePkgxLink, handlePkgxUnlink, handlePkgxViewDetail]);

  // Bulk actions config
  const bulkActions = React.useMemo(() => [
    {
      label: 'Kích hoạt',
      icon: Power,
      onSelect: handleBulkActivate,
    },
    {
      label: 'Tắt hoạt động',
      icon: PowerOff,
      onSelect: handleBulkDeactivate,
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onSelect: () => setIsBulkDeleteAlertOpen(true),
    },
  ], [handleBulkActivate, handleBulkDeactivate]);

  // ═══════════════════════════════════════════════════════════════
  // PKGX Bulk Actions - Using shared usePkgxBulkSync hook
  // ═══════════════════════════════════════════════════════════════
  const pkgxBulkActions = React.useMemo(() => [
    {
      label: "Đồng bộ tất cả",
      icon: RefreshCw,
      onSelect: (selectedRows: Brand[]) => {
        triggerBulkSync(selectedRows, 'sync_all');
      }
    },
    {
      label: "SEO",
      icon: Search,
      onSelect: (selectedRows: Brand[]) => {
        triggerBulkSync(selectedRows, 'sync_seo');
      }
    },
    {
      label: "Mô tả",
      icon: AlignLeft,
      onSelect: (selectedRows: Brand[]) => {
        triggerBulkSync(selectedRows, 'sync_description');
      }
    },
    {
      label: "Xem trên PKGX",
      icon: ExternalLink,
      onSelect: (selectedRows: Brand[]) => {
        const linkedBrands = selectedRows.filter(b => hasPkgxMapping(b));
        if (linkedBrands.length === 0) {
          toast.error('Không có thương hiệu nào đã liên kết PKGX');
          return;
        }
        const firstBrand = linkedBrands[0];
        const pkgxId = getPkgxBrandId(firstBrand);
        if (pkgxId) {
          window.open(`https://phukiengiaxuong.com.vn/admin/brand.php?act=edit&id=${pkgxId}`, '_blank');
        }
      }
    },
    {
      label: "Hủy liên kết",
      icon: Unlink,
      variant: "destructive" as const,
      onSelect: (selectedRows: Brand[]) => {
        const linkedBrands = selectedRows.filter(b => hasPkgxMapping(b));
        if (linkedBrands.length === 0) {
          toast.error('Không có thương hiệu nào đã liên kết PKGX');
          return;
        }
        
        if (!confirm(`Bạn có chắc muốn hủy liên kết ${linkedBrands.length} thương hiệu với PKGX?`)) {
          return;
        }
        
        let count = 0;
        for (const brand of linkedBrands) {
          const mapping = getBrandMappingByHrmId(brand.systemId);
          if (mapping) {
            deleteBrandMapping(mapping.id);
            count++;
          }
        }
        
        setRowSelection({});
        toast.success(`Đã hủy liên kết ${count} thương hiệu`);
      }
    },
  ], [triggerBulkSync, hasPkgxMapping, getPkgxBrandId, getBrandMappingByHrmId, deleteBrandMapping]);

  // Import handler
  const handleImport = React.useCallback(async (data: Partial<Brand>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => {
    const currentEmployeeSystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
    
    const results = {
      success: 0,
      failed: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: [] as Array<{ row: number; message: string }>,
    };
    
    try {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        try {
          // Check if brand exists (by id)
          const existingBrand = activeBrands.find(b => 
            item.id && b.id === item.id
          );
          
          if (existingBrand) {
            // Brand exists
            if (mode === 'insert-only') {
              // Skip in insert-only mode
              results.skipped++;
              continue;
            }
            
            // Update existing brand
            const updatedFields: Partial<Brand> = {
              ...item,
              updatedAt: new Date().toISOString(),
            };
            // Remove fields that shouldn't be overwritten
            delete (updatedFields as any).systemId;
            delete (updatedFields as any).createdAt;
            
            update(existingBrand.systemId, updatedFields);
            results.updated++;
            results.success++;
          } else {
            // Brand does not exist
            if (mode === 'update-only') {
              // Skip in update-only mode
              results.skipped++;
              continue;
            }
            
            // Insert new brand
            const newBrand = {
              ...item,
              id: asBusinessId(item.id || `BRAND-${Date.now()}`),
              name: item.name || '',
              isActive: item.isActive !== false,
              isDeleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as Omit<Brand, 'systemId'>;
            
            add(newBrand);
            results.inserted++;
            results.success++;
          }
        } catch (err) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            message: err instanceof Error ? err.message : 'Lỗi không xác định',
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('[Brands Importer] Lỗi nhập thương hiệu', error);
      throw error;
    }
  }, [activeBrands, add, update, authEmployee?.systemId]);

  // Export config
  const exportConfig = {
    fileName: 'Thuong_hieu',
    columns,
  };

  // Set default column visibility - only on mount
  React.useEffect(() => {
    // Skip if already has stored visibility
    const storageKey = 'brands-column-visibility';
    const stored = localStorage.getItem(storageKey);
    if (stored) return;
    
    const defaultVisibleColumns = ['logo', 'name', 'id', 'productCount', 'website', 'seoPkgx', 'seoTrendtech', 'pkgxStatus', 'pkgx', 'isActive', 'createdAt'];
    const columnIds = ['select', 'logo', 'name', 'id', 'productCount', 'website', 'seoPkgx', 'seoTrendtech', 'pkgxStatus', 'pkgx', 'isActive', 'createdAt', 'updatedAt', 'actions'];
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

  const fuse = React.useMemo(() => new Fuse(activeBrands, {
    keys: ["id", "name", "description", "website"],
    threshold: 0.3,
    ignoreLocation: true
  }), [activeBrands]);

  const confirmDelete = () => {
    if (idToDelete) {
      remove(asSystemId(idToDelete));
      toast.success("Đã xóa thương hiệu");
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };

  const confirmBulkDelete = () => {
    const idsToDelete = Object.keys(rowSelection);
    idsToDelete.forEach(id => remove(asSystemId(id)));
    toast.success(`Đã xóa ${idsToDelete.length} thương hiệu`);
    setRowSelection({});
    setIsBulkDeleteAlertOpen(false);
  };

  // Filter options
  const statusOptions = React.useMemo(() => [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Tạm tắt' }
  ], []);

  // Apply all filters
  const filteredData = React.useMemo(() => {
    let result = activeBrands;

    // Status filter
    if (statusFilter.size > 0) {
      result = result.filter(b => {
        const status = b.isActive !== false ? 'active' : 'inactive';
        return statusFilter.has(status);
      });
    }

    // Text search (debounced)
    if (debouncedGlobalFilter) {
      const searchResults = fuse.search(debouncedGlobalFilter);
      const searchIds = new Set(searchResults.map(r => r.item.systemId));
      result = result.filter(b => searchIds.has(b.systemId));
    }

    return result;
  }, [activeBrands, statusFilter, debouncedGlobalFilter, fuse]);

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
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sorting]);

  const allSelectedRows = React.useMemo(() =>
    activeBrands.filter(b => rowSelection[b.systemId]),
    [activeBrands, rowSelection]);

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
  }, [debouncedGlobalFilter, statusFilter]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);

  // Header actions
  const headerActions = React.useMemo(() => [
    <Button key="add" size="sm" className="h-9" onClick={() => navigate('/brands/new')}>
      <Plus className="mr-2 h-4 w-4" />
      Thêm thương hiệu
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
              <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
                <FileUp className="mr-2 h-4 w-4" />
                Nhập file
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
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
        searchPlaceholder="Tìm theo mã, tên thương hiệu..."
        rightFilters={
          <DataTableFacetedFilter
            title="Trạng thái"
            options={statusOptions}
            selectedValues={statusFilter}
            onSelectedValuesChange={setStatusFilter}
          />
        }
      />

      {/* Mobile View - Cards */}
      {isMobile ? (
        <div className="space-y-2 flex-1 overflow-y-auto">
          {sortedData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Không tìm thấy thương hiệu nào
              </CardContent>
            </Card>
          ) : (
            <>
              {sortedData.slice(0, mobileLoadedCount).map(brand => (
                <MobileBrandCard
                  key={brand.systemId}
                  brand={brand}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  navigate={navigate}
                  handleRowClick={handleRowClick}
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
                    Đã hiển thị tất cả {sortedData.length} thương hiệu
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
            bulkActions={bulkActions}
            pkgxBulkActions={pkgxBulkActions}
            expanded={{}}
            setExpanded={() => {}}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
            onRowClick={handleRowClick}
            renderMobileCard={(brand) => (
              <MobileBrandCard
                brand={brand}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                navigate={navigate}
                handleRowClick={handleRowClick}
              />
            )}
          />
        </div>
      )}

      {/* Delete Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa thương hiệu?</AlertDialogTitle>
            <AlertDialogDescription>
              Thương hiệu sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
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
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} thương hiệu?</AlertDialogTitle>
            <AlertDialogDescription>
              Các thương hiệu sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete}>Xóa tất cả</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* PKGX Link Dialog */}
      <PkgxBrandLinkDialog
        open={pkgxLinkDialogOpen}
        onOpenChange={setPkgxLinkDialogOpen}
        brand={brandToLink}
        onSuccess={handlePkgxLinkSuccess}
      />
      
      {/* PKGX Detail Dialog */}
      <PkgxBrandDetailDialog
        open={pkgxDetailDialogOpen}
        onOpenChange={setPkgxDetailDialogOpen}
        brand={brandToViewDetail}
        pkgxBrandId={pkgxBrandIdToView}
      />

      {/* PKGX Bulk Sync Confirm Dialog */}
      <PkgxBulkSyncConfirmDialog
        confirmAction={bulkConfirmAction}
        progress={bulkProgress}
        onConfirm={executeBulkAction}
        onCancel={cancelBulkConfirm}
      />

      {/* Import Dialog V2 */}
      <GenericImportDialogV2<Brand>
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        config={brandImportExportConfig}
        existingData={activeBrands}
        onImport={handleImport}
        currentUser={authEmployee ? {
          systemId: authEmployee.systemId,
          name: authEmployee.fullName || authEmployee.id,
        } : undefined}
      />

      {/* Export Dialog V2 */}
      <GenericExportDialogV2<Brand>
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        config={brandImportExportConfig}
        allData={activeBrands}
        filteredData={sortedData}
        currentPageData={paginatedData}
        selectedData={allSelectedRows}
        currentUser={authEmployee ? {
          systemId: authEmployee.systemId,
          name: authEmployee.fullName || authEmployee.id,
        } : { systemId: asSystemId('SYSTEM'), name: 'System' }}
      />
    </div>
  );
}
