import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Input } from '../../../../components/ui/input.tsx';
import { Badge } from '../../../../components/ui/badge.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog.tsx';
import { Label } from '../../../../components/ui/label.tsx';
import { ScrollArea } from '../../../../components/ui/scroll-area.tsx';
import { Plus, Pencil, Trash2, RefreshCw, Search, Loader2, FolderTree, Link, Unlink, CheckCircle2, MoreHorizontal, ExternalLink, Upload, AlignLeft, FolderEdit, Link2 } from 'lucide-react';
import { Checkbox } from '../../../../components/ui/checkbox.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../../../components/ui/dropdown-menu.tsx';
import { getCategoryById, updateCategory } from '../../../../lib/pkgx/api-service';
import { toast } from 'sonner';
import { usePkgxSettingsStore } from '../store';
import { useProductCategoryStore } from '../../inventory/product-category-store';
import { ResponsiveDataTable } from '../../../../components/data-table/responsive-data-table';
import type { ColumnDef } from '../../../../components/data-table/types';
import type { PkgxCategoryMapping, PkgxCategory, PkgxCategoryFromApi } from '../types';
import { useCategoryMappingValidation, usePkgxEntitySync } from '../hooks';
import type { HrmCategoryData } from '../hooks';
import type { CategoryMappingInput } from '../validation';
import { PkgxMappingDialog } from '../../../../components/shared/pkgx-mapping-dialog';
import { PkgxSyncConfirmDialog } from './pkgx-sync-confirm-dialog';

// Extended type for PKGX categories table
interface PkgxCategoryRow extends PkgxCategory {
  systemId: string;
  mappedToHrm?: string;
}

// Extended type for mappings table
interface MappingRow extends PkgxCategoryMapping {
  systemId: string;
}

export function CategoryMappingTab() {
  const { 
    settings, 
    addCategoryMapping, 
    updateCategoryMapping, 
    deleteCategoryMapping,
    syncCategoriesFromPkgx,
    addLog,
  } = usePkgxSettingsStore();
  const productCategories = useProductCategoryStore();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('pkgx-categories');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingMapping, setEditingMapping] = React.useState<PkgxCategoryMapping | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);
  
  // Detail dialog state
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const [selectedCategoryForDetail, setSelectedCategoryForDetail] = React.useState<PkgxCategoryFromApi | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false);
  const [isPushing, setIsPushing] = React.useState(false);
  
  // Table state
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'id', desc: false });
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  
  // Form state
  const [selectedHrmCategory, setSelectedHrmCategory] = React.useState('');
  const [selectedPkgxCategory, setSelectedPkgxCategory] = React.useState('');
  const [showWarningConfirm, setShowWarningConfirm] = React.useState(false);
  
  // Use shared PKGX entity sync hook
  const entitySync = usePkgxEntitySync({
    entityType: 'category',
    onLog: addLog,
  });
  
  const hrmCategories = React.useMemo(
    () => productCategories.getActive().sort((a, b) => (a.path || '').localeCompare(b.path || '')),
    [productCategories]
  );
  
  // Validation hook
  const validation = useCategoryMappingValidation({
    existingMappings: settings.categoryMappings,
    hrmCategories: hrmCategories,
    pkgxCategories: settings.categories,
    editingMappingId: editingMapping?.id,
    debounceMs: 300,
  });
  
  // Find if PKGX category is mapped
  const findMapping = React.useCallback((pkgxCatId: number) => {
    return settings.categoryMappings.find(m => m.pkgxCatId === pkgxCatId);
  }, [settings.categoryMappings]);
  
  // PKGX Categories data for table
  const pkgxCategoriesData = React.useMemo((): PkgxCategoryRow[] => {
    let filtered = settings.categories;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = settings.categories.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.id.toString().includes(term)
      );
    }
    return filtered.map(c => ({
      ...c,
      systemId: c.id.toString(),
      mappedToHrm: findMapping(c.id)?.hrmCategoryName,
    }));
  }, [settings.categories, searchTerm, findMapping]);
  
  // Mappings data for table
  const mappingsData = React.useMemo((): MappingRow[] => {
    let filtered = settings.categoryMappings;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = settings.categoryMappings.filter(m =>
        m.hrmCategoryName.toLowerCase().includes(term) ||
        m.pkgxCatName.toLowerCase().includes(term)
      );
    }
    return filtered.map(m => ({
      ...m,
      systemId: m.id,
    }));
  }, [settings.categoryMappings, searchTerm]);
  
  // Paginated data
  const paginatedPkgxData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return pkgxCategoriesData.slice(start, start + pagination.pageSize);
  }, [pkgxCategoriesData, pagination]);
  
  const paginatedMappingsData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return mappingsData.slice(start, start + pagination.pageSize);
  }, [mappingsData, pagination]);
  
  // All selected rows and bulk actions for PKGX categories table
  const allSelectedPkgxRows = React.useMemo(() => 
    paginatedPkgxData.filter(p => rowSelection[p.systemId]),
  [paginatedPkgxData, rowSelection]);
  
  // Get selected PKGX categories that are NOT mapped (for bulk mapping)
  const selectedUnmappedCategories = React.useMemo(() => 
    allSelectedPkgxRows.filter(c => !c.mappedToHrm),
  [allSelectedPkgxRows]);
  
  // Get selected PKGX categories that ARE mapped (for bulk unlink)
  const selectedMappedCategories = React.useMemo(() => 
    allSelectedPkgxRows.filter(c => c.mappedToHrm),
  [allSelectedPkgxRows]);
  
  // Bulk actions for PKGX categories table
  const pkgxBulkActions = React.useMemo(() => [
    {
      label: `Hủy liên kết (${selectedMappedCategories.length})`,
      icon: Unlink,
      variant: 'destructive' as const,
      disabled: selectedMappedCategories.length === 0,
      onSelect: () => {
        if (selectedMappedCategories.length === 0) {
          toast.error('Không có danh mục đã liên kết nào được chọn');
          return;
        }
        // Bulk delete mappings
        selectedMappedCategories.forEach(category => {
          const mapping = findMapping(category.id);
          if (mapping) {
            deleteCategoryMapping(mapping.id);
          }
        });
        toast.success(`Đã hủy liên kết ${selectedMappedCategories.length} danh mục`);
        setRowSelection({});
      },
    },
  ], [selectedMappedCategories, findMapping, deleteCategoryMapping]);
  
  // PKGX Categories columns
  const pkgxColumns: ColumnDef<PkgxCategoryRow>[] = React.useMemo(() => [
    {
      id: 'select',
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? 'indeterminate' : false}
          onCheckedChange={onToggleAll}
          aria-label="Select all"
        />
      ),
      cell: ({ row, isSelected, onToggleSelect }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 48,
      enableSorting: false,
      meta: { sticky: 'left', displayName: '' },
    },
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
      size: 70,
      cell: ({ row }) => <span className="font-mono text-xs">{row.id}</span>,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Danh mục PKGX',
      cell: ({ row }) => {
        // Gộp danh mục cha > danh mục con
        const parent = row.parentId ? settings.categories.find(c => c.id === row.parentId) : null;
        return (
          <div className="flex items-center gap-1">
            {parent && (
              <>
                <span className="text-muted-foreground text-sm">{parent.name}</span>
                <span className="text-muted-foreground">›</span>
              </>
            )}
            <span className="font-medium">{row.name}</span>
          </div>
        );
      },
    },
    {
      id: 'mappedToHrm',
      header: 'Mapping HRM',
      cell: ({ row }) => (
        row.mappedToHrm ? (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {row.mappedToHrm}
          </Badge>
        ) : (
          <Badge variant="secondary">Chưa liên kết</Badge>
        )
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 50,
      cell: ({ row }) => {
        // Get HRM category for sync actions
        const mapping = findMapping(row.id);
        const hrmCategory = mapping ? hrmCategories.find(c => c.systemId === mapping.hrmCategorySystemId) : null;
        
        // Helper to trigger sync with proper HRM data
        const triggerSync = (actionKey: 'sync_all' | 'sync_basic' | 'sync_seo' | 'sync_description') => {
          if (!mapping || !hrmCategory) {
            toast.error('Danh mục chưa được liên kết với HRM');
            return;
          }
          const hrmData: HrmCategoryData = {
            systemId: hrmCategory.systemId,
            name: hrmCategory.name,
            isActive: hrmCategory.isActive,
            seoKeywords: hrmCategory.seoKeywords,
            seoTitle: hrmCategory.seoTitle,
            metaDescription: hrmCategory.metaDescription,
            shortDescription: hrmCategory.shortDescription,
            longDescription: hrmCategory.longDescription,
            websiteSeo: hrmCategory.websiteSeo,
          };
          entitySync.triggerSyncAction(actionKey, row.id, hrmData, row.name);
        };
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {row.mappedToHrm ? (
                <>
                  {/* Sync All */}
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_all')}
                    className="font-medium"
                    title="Đồng bộ: Tên, Keywords, Meta Title, Meta Desc, Mô tả ngắn, Mô tả dài"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Đồng bộ tất cả
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Individual sync actions */}
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_seo')}
                    title="Đồng bộ: Keywords, Meta Title, Meta Desc"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    SEO
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_description')}
                    title="Đồng bộ: Mô tả ngắn (Short Desc), Mô tả dài (Long Desc)"
                  >
                    <AlignLeft className="h-4 w-4 mr-2" />
                    Mô tả
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_basic')}
                    title="Đồng bộ: Tên danh mục, Trạng thái hiển thị"
                  >
                    <FolderEdit className="h-4 w-4 mr-2" />
                    Thông tin cơ bản
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.open(`https://phukiengiaxuong.com.vn/admin/category.php?act=edit&cat_id=${row.id}`, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Xem trên PKGX
                  </DropdownMenuItem>
                  
                  {/* Hủy liên kết */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => entitySync.handleConfirm(
                      'Hủy liên kết PKGX',
                      `Bạn có chắc muốn hủy liên kết danh mục "${row.name}" với PKGX?`,
                      () => handleUnlinkCategory(row.id)
                    )}
                    className="text-destructive focus:text-destructive"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Hủy liên kết
                  </DropdownMenuItem>
                </>
              ) : (
                /* Not linked - show link option */
                <>
                  <DropdownMenuItem onClick={() => handleQuickMap(row)}>
                    <Link2 className="h-4 w-4 mr-2" />
                    Liên kết với HRM
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [settings.categories, hrmCategories, findMapping, entitySync]);
  
  // Mappings columns
  const mappingColumns: ColumnDef<MappingRow>[] = React.useMemo(() => [
    {
      id: 'hrmCategoryName',
      accessorKey: 'hrmCategoryName',
      header: 'Danh mục HRM',
      cell: ({ row }) => <span className="font-medium">{row.hrmCategoryName}</span>,
    },
    {
      id: 'pkgxCatName',
      accessorKey: 'pkgxCatName',
      header: 'Danh mục PKGX',
      cell: ({ row }) => <span>{row.pkgxCatName}</span>,
    },
    {
      id: 'pkgxCatId',
      accessorKey: 'pkgxCatId',
      header: 'ID PKGX',
      size: 80,
      cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.pkgxCatId}</span>,
    },
    {
      id: 'actions',
      header: 'Hành động',
      size: 100,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ], []);
  
  const handleQuickMap = (pkgxCategory: PkgxCategoryRow) => {
    setSelectedPkgxCategory(pkgxCategory.id.toString());
    setSelectedHrmCategory('');
    setEditingMapping(null);
    setIsDialogOpen(true);
  };
  
  const handleUnlinkCategory = (pkgxCatId: number) => {
    const mapping = findMapping(pkgxCatId);
    if (mapping) {
      deleteCategoryMapping(mapping.id);
      addLog({
        action: 'unlink_mapping',
        status: 'success',
        message: `Đã hủy liên kết danh mục: ${mapping.hrmCategoryName} ↔ ${mapping.pkgxCatName}`,
        details: { categoryId: pkgxCatId },
      });
      toast.success('Đã hủy liên kết danh mục');
    }
  };
  
  // Open detail dialog with category info
  const handleViewDetail = async (catId: number) => {
    setIsDetailDialogOpen(true);
    setIsLoadingDetail(true);
    setSelectedCategoryForDetail(null);
    
    try {
      const response = await getCategoryById(catId);
      if (response.success && response.data?.data) {
        setSelectedCategoryForDetail(response.data.data as any);
      } else {
        toast.error(response.error || 'Không thể lấy thông tin danh mục');
      }
    } catch (error) {
      toast.error('Lỗi khi lấy thông tin danh mục');
    } finally {
      setIsLoadingDetail(false);
    }
  };
  
  // Push category info from HRM to PKGX
  const handlePushCategory = async (pkgxCatId: number) => {
    const mapping = findMapping(pkgxCatId);
    if (!mapping) {
      toast.error('Danh mục chưa được mapping với HRM');
      return;
    }
    
    const hrmCategory = hrmCategories.find(c => c.systemId === mapping.hrmCategorySystemId);
    if (!hrmCategory) {
      toast.error('Không tìm thấy danh mục HRM');
      return;
    }
    
    setIsPushing(true);
    try {
      const payload: { cat_name?: string; cat_desc?: string; keywords?: string } = {};
      
      // Push name
      if (hrmCategory.name) payload.cat_name = hrmCategory.name;
      // Push description (nếu HRM category có field này)
      if ((hrmCategory as any).description) payload.cat_desc = (hrmCategory as any).description;
      // Push keywords (nếu HRM category có field này)
      if ((hrmCategory as any).seoKeywords) payload.keywords = (hrmCategory as any).seoKeywords;
      
      const response = await updateCategory(pkgxCatId, payload);
      if (response.success) {
        toast.success('Đã đẩy thông tin danh mục lên PKGX');
        addLog({
          action: 'update_product',
          status: 'success',
          message: `Đã đẩy thông tin danh mục: ${mapping.hrmCategoryName} → ${mapping.pkgxCatName}`,
          details: { categoryId: pkgxCatId },
        });
        // Refresh detail if open
        if (isDetailDialogOpen && selectedCategoryForDetail?.cat_id === pkgxCatId) {
          handleViewDetail(pkgxCatId);
        }
      } else {
        toast.error(response.error || 'Không thể cập nhật danh mục');
      }
    } catch (error) {
      toast.error('Lỗi khi đẩy thông tin danh mục');
    } finally {
      setIsPushing(false);
    }
  };
  
  const handleOpenDialog = (mapping?: PkgxCategoryMapping) => {
    if (mapping) {
      setEditingMapping(mapping);
      setSelectedHrmCategory(mapping.hrmCategorySystemId);
      setSelectedPkgxCategory(mapping.pkgxCatId.toString());
    } else {
      setEditingMapping(null);
      setSelectedHrmCategory('');
      setSelectedPkgxCategory('');
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMapping(null);
    setSelectedHrmCategory('');
    setSelectedPkgxCategory('');
    setShowWarningConfirm(false);
    validation.clearValidation();
  };
  
  // Validate when form values change
  React.useEffect(() => {
    if (isDialogOpen && (selectedHrmCategory || selectedPkgxCategory)) {
      const input: CategoryMappingInput = {
        hrmCategorySystemId: selectedHrmCategory || '',
        hrmCategoryName: hrmCategories.find(c => c.systemId === selectedHrmCategory)?.name || '',
        pkgxCatId: selectedPkgxCategory ? parseInt(selectedPkgxCategory) : '',
        pkgxCatName: settings.categories.find(c => c.id === parseInt(selectedPkgxCategory))?.name || '',
      };
      validation.validateAsync(input);
    }
  }, [selectedHrmCategory, selectedPkgxCategory, isDialogOpen]);
  
  const handleSave = () => {
    // Build input for validation
    const input: CategoryMappingInput = {
      hrmCategorySystemId: selectedHrmCategory || '',
      hrmCategoryName: hrmCategories.find(c => c.systemId === selectedHrmCategory)?.name || '',
      pkgxCatId: selectedPkgxCategory ? parseInt(selectedPkgxCategory) : '',
      pkgxCatName: settings.categories.find(c => c.id === parseInt(selectedPkgxCategory))?.name || '',
    };
    
    // Run final validation
    const result = validation.validate(input);
    
    // Block if there are errors
    if (!result.isValid) {
      toast.error(result.errors[0]?.message || 'Vui lòng kiểm tra lại thông tin');
      return;
    }
    
    // Show warning confirmation if there are warnings and not yet confirmed
    if (result.warnings.length > 0 && !showWarningConfirm) {
      setShowWarningConfirm(true);
      return;
    }
    
    const hrmCategory = hrmCategories.find((c) => c.systemId === selectedHrmCategory);
    const pkgxCategory = settings.categories.find((c) => c.id === parseInt(selectedPkgxCategory));
    
    if (!hrmCategory || !pkgxCategory) {
      toast.error('Không tìm thấy danh mục');
      return;
    }
    
    if (editingMapping) {
      updateCategoryMapping(editingMapping.id, {
        hrmCategorySystemId: hrmCategory.systemId,
        hrmCategoryName: hrmCategory.name,
        pkgxCatId: pkgxCategory.id,
        pkgxCatName: pkgxCategory.name,
      });
      addLog({
        action: 'save_mapping',
        status: 'success',
        message: `Cập nhật mapping danh mục: ${hrmCategory.name} → ${pkgxCategory.name}`,
        details: { categoryId: pkgxCategory.id },
      });
      toast.success('Đã cập nhật mapping danh mục');
    } else {
      addCategoryMapping({
        id: `catmap-${Date.now()}`,
        hrmCategorySystemId: hrmCategory.systemId,
        hrmCategoryName: hrmCategory.name,
        pkgxCatId: pkgxCategory.id,
        pkgxCatName: pkgxCategory.name,
      });
      addLog({
        action: 'save_mapping',
        status: 'success',
        message: `Thêm mapping danh mục: ${hrmCategory.name} → ${pkgxCategory.name}`,
        details: { categoryId: pkgxCategory.id },
      });
      toast.success('Đã thêm mapping danh mục');
    }
    
    handleCloseDialog();
  };
  
  const handleDelete = (id: string) => {
    const mapping = settings.categoryMappings.find(m => m.id === id);
    deleteCategoryMapping(id);
    if (mapping) {
      addLog({
        action: 'save_mapping',
        status: 'info',
        message: `Xóa mapping danh mục: ${mapping.hrmCategoryName}`,
        details: { categoryId: mapping.pkgxCatId },
      });
    }
    toast.success('Đã xóa mapping danh mục');
  };
  
  const handleSyncFromPkgx = async () => {
    setIsSyncing(true);
    try {
      await syncCategoriesFromPkgx();
      toast.success('Đã đồng bộ danh mục từ PKGX');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đồng bộ danh mục');
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Mobile card renderers
  const renderPkgxMobileCard = (row: PkgxCategoryRow) => (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-muted-foreground">ID: {row.id}</div>
        </div>
        {row.mappedToHrm ? (
          <Badge variant="default" className="bg-green-500 shrink-0">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Đã mapping
          </Badge>
        ) : (
          <Badge variant="secondary" className="shrink-0">Chưa mapping</Badge>
        )}
      </div>
      {row.mappedToHrm && (
        <div className="text-sm">
          <span className="text-muted-foreground">HRM: </span>
          <span>{row.mappedToHrm}</span>
        </div>
      )}
      {!row.mappedToHrm && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => handleQuickMap(row)}
        >
          <Link className="h-4 w-4 mr-2" />
          Mapping nhanh
        </Button>
      )}
    </div>
  );
  
  const renderMappingMobileCard = (row: MappingRow) => (
    <div className="p-4 space-y-3">
      <div>
        <div className="font-medium">{row.hrmCategoryName}</div>
        <div className="text-sm text-muted-foreground">
          → {row.pkgxCatName} (ID: {row.pkgxCatId})
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(row)}>
          <Pencil className="h-4 w-4 mr-2" />
          Sửa
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(row.id)}>
          <Trash2 className="h-4 w-4 mr-2 text-destructive" />
          Xóa
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Mapping danh mục sản phẩm</CardTitle>
              <CardDescription>
                Liên kết danh mục HRM với danh mục PKGX để đồng bộ sản phẩm
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSyncFromPkgx} disabled={isSyncing} variant="outline">
                {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Đồng bộ từ PKGX
              </Button>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm mapping
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap text-center sm:text-right">
                {settings.categories.length} danh mục PKGX | {settings.categoryMappings.length} mapping
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pkgx-categories">
                  <FolderTree className="h-4 w-4 mr-2" />
                  Danh mục PKGX ({settings.categories.length})
                </TabsTrigger>
                <TabsTrigger value="mappings">
                  <Link className="h-4 w-4 mr-2" />
                  Mapping ({settings.categoryMappings.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pkgx-categories" className="mt-4">
                {settings.categories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có danh mục từ PKGX.</p>
                    <p className="text-sm mt-1">Bấm "Đồng bộ từ PKGX" để lấy danh sách.</p>
                  </div>
                ) : (
                  <ResponsiveDataTable
                    columns={pkgxColumns}
                    data={paginatedPkgxData}
                    renderMobileCard={renderPkgxMobileCard}
                    pageCount={Math.ceil(pkgxCategoriesData.length / pagination.pageSize)}
                    pagination={pagination}
                    setPagination={setPagination}
                    rowCount={pkgxCategoriesData.length}
                    sorting={sorting}
                    setSorting={setSorting}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    bulkActions={pkgxBulkActions}
                    allSelectedRows={allSelectedPkgxRows}
                    emptyTitle="Không tìm thấy danh mục"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="mappings" className="mt-4">
                {settings.categoryMappings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có mapping nào.</p>
                    <p className="text-sm mt-1">Bấm "Thêm mapping" để bắt đầu.</p>
                  </div>
                ) : (
                  <ResponsiveDataTable
                    columns={mappingColumns}
                    data={paginatedMappingsData}
                    renderMobileCard={renderMappingMobileCard}
                    pageCount={Math.ceil(mappingsData.length / pagination.pageSize)}
                    pagination={pagination}
                    setPagination={setPagination}
                    rowCount={mappingsData.length}
                    sorting={sorting}
                    setSorting={setSorting}
                    emptyTitle="Không tìm thấy mapping"
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      {/* Mapping Dialog - Using shared PkgxMappingDialog component */}
      <PkgxMappingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        type="category"
        isEditing={!!editingMapping}
        hrmItems={hrmCategories.map((c) => ({
          id: c.systemId,
          name: c.path || c.name,
        }))}
        selectedHrmId={selectedHrmCategory}
        onSelectHrmId={setSelectedHrmCategory}
        pkgxItems={settings.categories.map((c) => ({
          id: c.id.toString(),
          name: c.name,
          subText: `ID: ${c.id}`,
        }))}
        selectedPkgxId={selectedPkgxCategory}
        onSelectPkgxId={setSelectedPkgxCategory}
        pkgxSuggestions={validation.suggestions.map(s => ({
          item: { id: s.category.id.toString(), name: s.category.name },
          score: s.score,
        }))}
        validation={validation.validationResult}
        hasErrors={validation.hasErrors}
        isValidating={validation.isValidating}
        showWarningConfirm={showWarningConfirm}
        onConfirm={handleSave}
        onCancel={handleCloseDialog}
      />
      
      {/* Category Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Chi tiết danh mục PKGX
            </DialogTitle>
            <DialogDescription>
              {selectedCategoryForDetail ? `ID: ${selectedCategoryForDetail.cat_id}` : 'Đang tải...'}
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : selectedCategoryForDetail ? (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                {/* Basic info */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tên danh mục</Label>
                  <div className="p-2 border rounded text-sm font-medium">
                    {selectedCategoryForDetail.cat_name}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Parent ID</Label>
                    <div className="p-2 border rounded text-sm">
                      {selectedCategoryForDetail.parent_id || 'Không có (Root)'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Thứ tự</Label>
                    <div className="p-2 border rounded text-sm">
                      {selectedCategoryForDetail.sort_order}
                    </div>
                  </div>
                </div>
                
                {/* SEO Info */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Thông tin SEO</Label>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Alias (Slug)</Label>
                      <div className="p-2 border rounded text-sm">
                        {selectedCategoryForDetail.cat_alias || '-'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Keywords</Label>
                      <div className="p-2 border rounded text-sm">
                        {selectedCategoryForDetail.keywords || '-'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Mô tả danh mục</Label>
                  {selectedCategoryForDetail.cat_desc ? (
                    <div 
                      className="p-3 border rounded text-sm max-h-40 overflow-y-auto bg-muted/30"
                      dangerouslySetInnerHTML={{ __html: selectedCategoryForDetail.cat_desc }}
                    />
                  ) : (
                    <div className="p-2 border rounded text-sm text-muted-foreground">Chưa có mô tả</div>
                  )}
                </div>
                
                {/* Mapping status */}
                {findMapping(selectedCategoryForDetail.cat_id) && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Đã mapping với HRM:</span>
                      <span>{findMapping(selectedCategoryForDetail.cat_id)?.hrmCategoryName}</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : null}
          
          <DialogFooter className="gap-2">
            {selectedCategoryForDetail && (
              <>
                {findMapping(selectedCategoryForDetail.cat_id) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePushCategory(selectedCategoryForDetail.cat_id)}
                    disabled={isPushing}
                  >
                    {isPushing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    Đẩy HRM → PKGX
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`https://phukiengiaxuong.com.vn/admin/category.php?act=edit&cat_id=${selectedCategoryForDetail.cat_id}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Xem trên PKGX
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog for sync actions - using shared component */}
      <PkgxSyncConfirmDialog
        confirmAction={entitySync.confirmAction}
        isSyncing={entitySync.isSyncing}
        onConfirm={entitySync.executeAction}
        onCancel={entitySync.cancelConfirm}
      />
    </div>
  );
}
