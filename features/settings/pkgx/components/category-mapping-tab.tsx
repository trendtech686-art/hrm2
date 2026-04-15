import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Label } from '../../../../components/ui/label';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { Plus, Pencil, Trash2, RefreshCw, Search, Loader2, FolderTree, Link, Unlink, CheckCircle2, MoreHorizontal, ExternalLink, Upload, AlignLeft, FolderEdit, Link2, Download } from 'lucide-react';
import { Progress } from '../../../../components/ui/progress';
import { Checkbox } from '../../../../components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../../../components/ui/dropdown-menu';
import { getCategoryById, updateCategory } from '../../../../lib/pkgx/api-service';
import { toast } from 'sonner';
import { usePkgxSettings, usePkgxCategoryMappingMutations, usePkgxLogMutations } from '../hooks/use-pkgx-settings';
import { useSyncPkgxCategories } from '../hooks/use-pkgx';
import { useActiveCategories } from '@/features/categories/hooks/use-all-categories';
import { categoryKeys } from '@/features/categories/hooks/use-categories';
import { useQueryClient } from '@tanstack/react-query';
import { ResponsiveDataTable } from '../../../../components/data-table/responsive-data-table';
import type { ColumnDef } from '../../../../components/data-table/types';
import type { PkgxCategoryMapping, PkgxCategory, PkgxCategoryFromApi } from '../types';
import { useCategoryMappingValidation, usePkgxEntitySync } from '../hooks';
import type { HrmCategoryData } from '../hooks';
import type { CategoryMappingInput } from '../validation';
import { PkgxMappingDialog } from '../../../../components/shared/pkgx-mapping-dialog';
import { PkgxSyncConfirmDialog } from './pkgx-sync-confirm-dialog';
import { asSystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import { logError } from '@/lib/logger'
import { sanitizeHtml } from '@/lib/sanitize'

// Extended type for PKGX categories table
interface PkgxCategoryRow extends PkgxCategory {
  systemId: string;
  mappedToHrm?: string;
}

// Extended type for mappings table - include alias fields for backward compat
interface MappingRow extends PkgxCategoryMapping {
  pkgxCatName?: string; // Alias for pkgxCategoryName
  pkgxCatId?: number; // Alias for pkgxCategoryId
}

export function CategoryMappingTab() {
  // All hooks MUST be called before any conditional returns
  const queryClient = useQueryClient();
  const { data: settings } = usePkgxSettings();
  const { addCategoryMapping, updateCategoryMapping, deleteCategoryMapping } = usePkgxCategoryMappingMutations({ onSuccess: () => {} });
  const syncCategories = useSyncPkgxCategories({ onSuccess: () => toast.success('Đã đồng bộ danh mục từ PKGX') });
  const { addLog } = usePkgxLogMutations();
  const { data: productCategoriesData = [] } = useActiveCategories();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('pkgx-categories');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingMapping, setEditingMapping] = React.useState<PkgxCategoryMapping | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [importProgress, setImportProgress] = React.useState({ current: 0, total: 0, currentName: '' });
  const pauseRef = React.useRef(false);
  
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
    onLog: (log) => addLog.mutate(log),
  });
  
  const hrmCategories = React.useMemo(
    () => [...productCategoriesData].sort((a, b) => (a.path || '').localeCompare(b.path || '')).map(c => ({
      ...c,
      systemId: asSystemId(c.systemId),
      parentId: c.parentId ? asSystemId(c.parentId) : undefined,
    })),
    [productCategoriesData]
  );
  
  // Validation hook
  const validation = useCategoryMappingValidation({
    existingMappings: settings?.categoryMappings || [],
    hrmCategories: hrmCategories,
    pkgxCategories: settings?.categories || [],
    editingMappingId: editingMapping?.id,
    debounceMs: 300,
  });
  
  // Find if PKGX category is mapped
  const findMapping = React.useCallback((pkgxCatId: number) => {
    return settings?.categoryMappings.find(m => m.pkgxCatId === pkgxCatId);
  }, [settings?.categoryMappings]);
  
  // PKGX Categories data for table
  const pkgxCategoriesData = React.useMemo((): PkgxCategoryRow[] => {
    if (!settings) return [];
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
  }, [settings, searchTerm, findMapping]);
  
  // Mappings data for table
  const mappingsData = React.useMemo((): MappingRow[] => {
    if (!settings) return [];
    let filtered = settings.categoryMappings;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = settings.categoryMappings.filter(m =>
        m.hrmCategoryName.toLowerCase().includes(term) ||
        m.pkgxCategoryName.toLowerCase().includes(term)
      );
    }
    return filtered.map(m => ({
      ...m,
      systemId: m.systemId || m.id || '',
      pkgxCatName: m.pkgxCategoryName, // Alias
      pkgxCatId: m.pkgxCategoryId, // Alias
    }));
  }, [settings, searchTerm]);
  
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
            deleteCategoryMapping.mutate(mapping.systemId || mapping.id || '');
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
      cell: ({ row: _row, isSelected, onToggleSelect }) => (
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
      cell: ({ row }) => <span className="text-xs">{row.id}</span>,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Danh mục PKGX',
      cell: ({ row }) => {
        // Gộp danh mục cha > danh mục con
        const parent = row.parentId ? settings?.categories?.find(c => c.id === row.parentId) : null;
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
            seoKeywords: hrmCategory.seoKeywords ?? undefined,
            seoTitle: hrmCategory.seoTitle ?? undefined,
            metaDescription: hrmCategory.metaDescription ?? undefined,
            shortDescription: hrmCategory.shortDescription ?? undefined,
            longDescription: hrmCategory.longDescription ?? undefined,
            websiteSeo: hrmCategory.websiteSeo as HrmCategoryData['websiteSeo'],
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
                  
                  {/* Hủy liên kết */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => entitySync.handleConfirm(
                      'Hủy liên kết PKGX',
                      `Bạn có chắc muốn hủy liên kết danh mục "${row.name}" với PKGX?`,
                      async () => {
                        await handleUnlinkCategory(row.id);
                        await queryClient.invalidateQueries({ queryKey: ['pkgx', 'settings'] });
                      }
                    )}
                    className="text-destructive focus:text-destructive"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Hủy liên kết
                  </DropdownMenuItem>
                </>
              ) : (
                /* Not linked - show import & map option */
                <>
                  <DropdownMenuItem onClick={() => handleImportSingleCategory(row)}>
                    <Download className="h-4 w-4 mr-2" />
                    Import & Mapping
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleUnlinkCategory and handleQuickMap are stable functions defined after
  ], [settings?.categories, hrmCategories, findMapping, entitySync]);
  
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
      cell: ({ row }) => <span className="text-muted-foreground">{row.pkgxCatId}</span>,
    },
    {
      id: 'actions',
      header: '',
      size: 100,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.systemId)}>\n            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleOpenDialog and handleDelete are stable functions
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
      deleteCategoryMapping.mutate(mapping.systemId || mapping.id || '');
      addLog.mutate({
        action: 'unlink_mapping',
        status: 'success',
        message: `Đã hủy liên kết danh mục: ${mapping.hrmCategoryName} ↔ ${mapping.pkgxCategoryName}`,
        details: { categoryId: pkgxCatId },
      });
      toast.success('Đã hủy liên kết danh mục');
    }
  };
  
  // Import single category and auto-map
  const handleImportSingleCategory = async (pkgxCategory: PkgxCategoryRow) => {
    if (!settings) return;
    
    setIsImporting(true);
    try {
      const pkgxCat = settings.categories.find(c => c.id === pkgxCategory.id);
      if (!pkgxCat) {
        toast.error('Không tìm thấy danh mục PKGX');
        return;
      }
      
      // Find parent HRM systemId if PKGX category has parent
      let hrmParentId: string | undefined;
      if (pkgxCat.parentId) {
        const parentMapping = findMapping(pkgxCat.parentId);
        if (parentMapping) {
          hrmParentId = parentMapping.hrmCategorySystemId;
        }
      }
      
      // Build category data
      const categoryData: Record<string, unknown> = {
        id: `PKGX-${pkgxCat.id}`,
        name: pkgxCat.name,
        sortOrder: Number(pkgxCat.sortOrder) || 0,
      };
      
      const sanitize = (str: string | undefined | null): string | undefined => {
        if (!str) return undefined;
        return str.replace(/\0/g, '').trim() || undefined;
      };
      const toSlug = (value: string | undefined | null): string | undefined => {
        const cleaned = sanitize(value);
        if (!cleaned) return undefined;
        return (
          cleaned
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        ) || undefined;
      };
      
      if (hrmParentId) categoryData.parentId = hrmParentId;
      
      type PkgxCatExtended = typeof pkgxCat & Record<string, unknown>;
      const pkgxCatExt = pkgxCat as PkgxCatExtended;
      const shortDesc = sanitize(pkgxCat.cat_desc ?? pkgxCatExt.catDesc as string | undefined);
      const longDesc = sanitize(pkgxCat.long_desc ?? pkgxCatExt.longDesc as string | undefined);
      const keywords = sanitize(pkgxCat.keywords ?? pkgxCatExt.keywords as string | undefined);
      const seoTitle = sanitize(pkgxCat.meta_title ?? pkgxCatExt.metaTitle as string | undefined ?? pkgxCatExt.cat_title as string | undefined ?? pkgxCatExt.catTitle as string | undefined);
      const metaDesc = sanitize(pkgxCat.meta_desc ?? pkgxCatExt.metaDesc as string | undefined);
      const slug = sanitize(pkgxCat.cat_alias ?? pkgxCatExt.catAlias as string | undefined) || toSlug(pkgxCat.name);
      
      if (shortDesc) categoryData.shortDescription = shortDesc;
      if (longDesc) categoryData.longDescription = longDesc;
      if (keywords) categoryData.seoKeywords = keywords;
      if (seoTitle) categoryData.seoTitle = seoTitle;
      if (metaDesc) categoryData.metaDescription = metaDesc;
      if (slug) categoryData.slug = slug;
      
      const pkgxSeo: Record<string, string> = {};
      if (seoTitle) pkgxSeo.seoTitle = seoTitle;
      if (metaDesc) pkgxSeo.metaDescription = metaDesc;
      if (keywords) pkgxSeo.seoKeywords = keywords;
      if (shortDesc) pkgxSeo.shortDescription = shortDesc;
      if (longDesc) pkgxSeo.longDescription = longDesc;
      if (slug) pkgxSeo.slug = slug;
      
      if (Object.keys(pkgxSeo).length > 0) {
        categoryData.websiteSeo = { pkgx: pkgxSeo };
      }
      
      // Create HRM category
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Không thể tạo danh mục');
      }
      
      const result = await response.json();
      const newCategory = result.data || result;
      
      // Create mapping
      const mappingData = {
        hrmCategoryId: newCategory.systemId,
        hrmCategoryName: newCategory.name,
        pkgxCategoryId: Number(pkgxCat.id),
        pkgxCategoryName: pkgxCat.name,
      };
      
      const mappingResponse = await fetch('/api/settings/pkgx/category-mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappingData),
      });
      
      if (!mappingResponse.ok) {
        logError('Mapping error', await mappingResponse.text());
      }
      
      // Invalidate queries
      await queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['pkgx', 'settings'] });
      
      addLog.mutate({
        action: 'sync_categories',
        status: 'success',
        message: `Import & mapping danh mục: ${pkgxCat.name}`,
        details: { categoryId: pkgxCat.id },
      });
      
      toast.success(`Đã import & mapping danh mục: ${pkgxCat.name}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Lỗi không xác định';
      toast.error(`Import thất bại: ${errorMsg}`);
      addLog.mutate({
        action: 'sync_categories',
        status: 'error',
        message: `Lỗi import danh mục: ${errorMsg}`,
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  // Open detail dialog with category info
  const _handleViewDetail = async (catId: number) => {
    setIsDetailDialogOpen(true);
    setIsLoadingDetail(true);
    setSelectedCategoryForDetail(null);
    
    try {
      const response = await getCategoryById(catId);
      if (response.success && response.data?.data) {
        // API returns array, get first element
        const categories = response.data.data;
        if (Array.isArray(categories) && categories.length > 0) {
          setSelectedCategoryForDetail(categories[0]);
        } else {
          toast.error('Không tìm thấy danh mục');
        }
      } else {
        toast.error(response.error || 'Không thể lấy thông tin danh mục');
      }
    } catch (_error) {
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
      if ((hrmCategory as { description?: string }).description) payload.cat_desc = (hrmCategory as { description?: string }).description;
      // Push keywords (nếu HRM category có field này)
      if ((hrmCategory as { seoKeywords?: string }).seoKeywords) payload.keywords = (hrmCategory as { seoKeywords?: string }).seoKeywords;
      
      const response = await updateCategory(pkgxCatId, payload);
      if (response.success) {
        toast.success('Đã đẩy thông tin danh mục lên PKGX');
        addLog.mutate({
          action: 'update_product',
          status: 'success',
          message: `Đã đẩy thông tin danh mục: ${mapping.hrmCategoryName} → ${mapping.pkgxCategoryName}`,
          details: { categoryId: pkgxCatId },
        });
        // Refresh detail if open
        if (isDetailDialogOpen && selectedCategoryForDetail?.cat_id === pkgxCatId) {
          const detailResponse = await getCategoryById(pkgxCatId);
          if (detailResponse.success && detailResponse.data?.data?.[0]) {
            setSelectedCategoryForDetail(detailResponse.data.data[0]);
          }
        }
      } else {
        toast.error(response.error || 'Không thể cập nhật danh mục');
      }
    } catch (_error) {
      toast.error('Lỗi khi đẩy thông tin danh mục');
    } finally {
      setIsPushing(false);
    }
  };
  
  const handleOpenDialog = (mapping?: PkgxCategoryMapping) => {
    if (mapping) {
      setEditingMapping(mapping);
      setSelectedHrmCategory((mapping.hrmCategoryId || mapping.hrmCategorySystemId) as string);
      setSelectedPkgxCategory((mapping.pkgxCategoryId || mapping.pkgxCatId || 0).toString());
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
        pkgxCategoryId: selectedPkgxCategory ? parseInt(selectedPkgxCategory) : 0,
        pkgxCategoryName: settings?.categories?.find(c => c.id === parseInt(selectedPkgxCategory))?.name || '',
      };
      validation.validateAsync(input);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hrmCategories, settings.categories, and validation are used for lookup only when selection changes
  }, [selectedHrmCategory, selectedPkgxCategory, isDialogOpen]);
  
  const handleSave = () => {
    // Build input for validation
    const input: CategoryMappingInput = {
      hrmCategorySystemId: selectedHrmCategory || '',
      hrmCategoryName: hrmCategories.find(c => c.systemId === selectedHrmCategory)?.name || '',
      pkgxCategoryId: selectedPkgxCategory ? parseInt(selectedPkgxCategory) : 0,
      pkgxCategoryName: settings?.categories?.find(c => c.id === parseInt(selectedPkgxCategory))?.name || '',
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
    const pkgxCategory = settings?.categories?.find((c) => c.id === parseInt(selectedPkgxCategory));
    
    if (!hrmCategory || !pkgxCategory) {
      toast.error('Không tìm thấy danh mục');
      return;
    }
    
    if (editingMapping) {
      updateCategoryMapping.mutate({ id: editingMapping.id || editingMapping.systemId, updates: {
        hrmCategoryId: hrmCategory.systemId,
        hrmCategoryName: hrmCategory.name,
        pkgxCategoryId: pkgxCategory.id,
        pkgxCategoryName: pkgxCategory.name,
      }});
      addLog.mutate({
        action: 'save_mapping',
        status: 'success',
        message: `Cập nhật mapping danh mục: ${hrmCategory.name} → ${pkgxCategory.name}`,
        details: { categoryId: pkgxCategory.id },
      });
      toast.success('Đã cập nhật mapping danh mục');
    } else {
      addCategoryMapping.mutate({
        systemId: generateSubEntityId('CATMAP'),
        hrmCategoryId: hrmCategory.systemId,
        hrmCategoryName: hrmCategory.name,
        pkgxCategoryId: pkgxCategory.id,
        pkgxCategoryName: pkgxCategory.name,
      });
      addLog.mutate({
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
    const mapping = settings?.categoryMappings?.find(m => (m.id || m.systemId) === id);
    deleteCategoryMapping.mutate(id);
    if (mapping) {
      addLog.mutate({
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
      await syncCategories.mutateAsync();
      addLog.mutate({
        action: 'sync_categories',
        status: 'success',
        message: 'Đồng bộ danh mục từ PKGX thành công',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đồng bộ danh mục');
      addLog.mutate({
        action: 'sync_categories',
        status: 'error',
        message: error instanceof Error ? error.message : 'Lỗi khi đồng bộ danh mục',
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Import categories from PKGX to HRM and auto-mapping — Batch mode
  const handleImportAndMap = async () => {
    if (!settings) {
      toast.error('Không thể tải cấu hình PKGX');
      return;
    }
    
    const allPkgxCategories = settings.categories;
    
    setIsImporting(true);
    setIsPaused(false);
    pauseRef.current = false;
    setImportProgress({ current: 0, total: allPkgxCategories.length, currentName: 'Đang chuẩn bị...' });
    
    // Create import job in DB
    let jobId: string | null = null;
    try {
      const jobRes = await fetch('/api/pkgx-import-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ entityType: 'categories', totalRecords: allPkgxCategories.length }),
      });
      if (jobRes.ok) {
        const jobData = await jobRes.json();
        jobId = jobData.jobId || null;
      }
    } catch {
      /* non-blocking */
    }
    
    let successCount = 0;
    let errorCount = 0;
    const errorMessages: string[] = [];
    const startTime = Date.now();
    
    // Build a map of PKGX ID to created HRM systemId for parent-child linking
    const pkgxToHrmMap = new Map<number, string>();
    
    // Map existing categories
    hrmCategories.forEach(c => {
      const mapping = settings.categoryMappings.find(m => (m.hrmCategoryId || m.hrmCategorySystemId) === c.systemId);
      if (mapping) {
        pkgxToHrmMap.set(mapping.pkgxCategoryId || mapping.pkgxCatId || 0, c.systemId);
      }
    });
    
    // Sort by parentId to process parents first
    const sortedCategories = [...allPkgxCategories].sort((a, b) => {
      if (a.parentId === null && b.parentId !== null) return -1;
      if (a.parentId !== null && b.parentId === null) return 1;
      return 0;
    });
    
    // Helper to sanitize string
    const sanitize = (str: string | undefined | null): string | undefined => {
      if (!str) return undefined;
      return str.replace(/\0/g, '').trim() || undefined;
    };
    const toSlug = (value: string | undefined | null): string | undefined => {
      const cleaned = sanitize(value);
      if (!cleaned) return undefined;
      return (
        cleaned.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
          .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      ) || undefined;
    };
    
    // Transform all categories to payloads
    type PkgxCatExtended = (typeof sortedCategories)[number] & Record<string, unknown>;
    const allPayloads = sortedCategories.map(pkgxCat => {
      const existingMapping = findMapping(pkgxCat.id);
      const pkgxCatExt = pkgxCat as PkgxCatExtended;
      const shortDesc = sanitize(pkgxCat.cat_desc ?? pkgxCatExt.catDesc as string | undefined);
      const longDesc = sanitize(pkgxCat.long_desc ?? pkgxCatExt.longDesc as string | undefined);
      const keywords = sanitize(pkgxCat.keywords ?? pkgxCatExt.keywords as string | undefined);
      const seoTitle = sanitize(pkgxCat.meta_title ?? pkgxCatExt.metaTitle as string | undefined ?? pkgxCatExt.cat_title as string | undefined ?? pkgxCatExt.catTitle as string | undefined);
      const metaDesc = sanitize(pkgxCat.meta_desc ?? pkgxCatExt.metaDesc as string | undefined);
      const slug = sanitize(pkgxCat.cat_alias ?? pkgxCatExt.catAlias as string | undefined) || toSlug(pkgxCat.name);
      
      const pkgxSeo: Record<string, string> = {};
      if (seoTitle) pkgxSeo.seoTitle = seoTitle;
      if (metaDesc) pkgxSeo.metaDescription = metaDesc;
      if (keywords) pkgxSeo.seoKeywords = keywords;
      if (shortDesc) pkgxSeo.shortDescription = shortDesc;
      if (longDesc) pkgxSeo.longDescription = longDesc;
      if (slug) pkgxSeo.slug = slug;
      
      return {
        pkgxId: pkgxCat.id,
        name: pkgxCat.name,
        parentPkgxId: pkgxCat.parentId,
        sortOrder: Number(pkgxCat.sortOrder) || 0,
        shortDescription: shortDesc,
        longDescription: longDesc,
        seoTitle,
        metaDescription: metaDesc,
        seoKeywords: keywords,
        slug,
        websiteSeo: Object.keys(pkgxSeo).length > 0 ? { pkgx: pkgxSeo } : undefined,
        existingMappingHrmId: existingMapping
          ? (existingMapping.hrmCategoryId || existingMapping.hrmCategorySystemId || null)
          : null,
      };
    });
    
    // Categories must be processed level-by-level (parents first) for parent-child linking
    // Split into: root categories (no parent) and child categories
    const rootPayloads = allPayloads.filter(p => !p.parentPkgxId);
    const childPayloads = allPayloads.filter(p => p.parentPkgxId);
    
    // Process batches and send to API
    const BATCH_SIZE = 30;
    let processedCount = 0;
    
    const sendBatch = async (batch: typeof allPayloads): Promise<void> => {
      while (pauseRef.current) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Resolve hrmParentId from pkgxToHrmMap
      const resolvedBatch = batch.map(item => ({
        ...item,
        hrmParentId: item.parentPkgxId ? (pkgxToHrmMap.get(item.parentPkgxId) || null) : null,
      }));
      
      try {
        const response = await fetch('/api/categories/bulk-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ categories: resolvedBatch }),
        });
        
        if (!response.ok) {
          const text = await response.text();
          let msg = `HTTP ${response.status}`;
          try { const d = JSON.parse(text); msg = d?.message || d?.error || msg; } catch { /* parse error, use default msg */ }
          throw new Error(msg);
        }
        
        const result = await response.json();
        const data = result.data ?? result;
        
        successCount += data.success || 0;
        errorCount += data.errors || 0;
        processedCount += batch.length;
        
        // Update pkgxToHrmMap with new systemIds for child resolution
        if (data.results) {
          for (const r of data.results) {
            if (r.success && r.systemId) {
              pkgxToHrmMap.set(r.pkgxId, r.systemId);
            }
            if (!r.success && r.error) {
              const name = batch.find(b => b.pkgxId === r.pkgxId)?.name || `PKGX#${r.pkgxId}`;
              errorMessages.push(`${name}: ${r.error}`);
            }
          }
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Lỗi không xác định';
        logError(`[Bulk Category] Batch failed (${batch.length})`, error);
        errorCount += batch.length;
        processedCount += batch.length;
        errorMessages.push(`Batch ${batch.length} danh mục: ${msg}`);
      }
      
      const elapsed = (Date.now() - startTime) / 1000;
      const speed = processedCount > 0 ? (processedCount / elapsed).toFixed(1) : '0';
      setImportProgress({
        current: processedCount,
        total: allPkgxCategories.length,
        currentName: `${speed} DM/giây • ${successCount} OK, ${errorCount} lỗi`,
      });
    };
    
    try {
      // Step 1: Process root categories first
      const rootBatches: typeof allPayloads[] = [];
      for (let i = 0; i < rootPayloads.length; i += BATCH_SIZE) {
        rootBatches.push(rootPayloads.slice(i, i + BATCH_SIZE));
      }
      
      for (const batch of rootBatches) {
        while (pauseRef.current) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        await sendBatch(batch);
      }
      
      // Step 2: Process child categories (sequential to ensure parent IDs resolved)
      const childBatches: typeof allPayloads[] = [];
      for (let i = 0; i < childPayloads.length; i += BATCH_SIZE) {
        childBatches.push(childPayloads.slice(i, i + BATCH_SIZE));
      }
      
      for (const batch of childBatches) {
        while (pauseRef.current) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        await sendBatch(batch);
        
        // Update job progress
        if (jobId) {
          fetch(`/api/pkgx-import-jobs/${jobId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              processedRecords: processedCount,
              successCount,
              errorCount,
              insertedCount: successCount,
            }),
          }).catch(err => console.error('[Import Job] Progress update failed:', err));
        }
      }
      
      // Final refresh
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['pkgx', 'settings'] }),
      ]);
      
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // Finalize job in DB
      if (jobId) {
        const finalStatus = errorCount === 0 ? 'completed' : successCount > 0 ? 'partial' : 'failed';
        try {
          await fetch(`/api/pkgx-import-jobs/${jobId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              status: finalStatus,
              processedRecords: processedCount,
              successCount,
              errorCount,
              insertedCount: successCount,
              errors: errorMessages.length > 0 ? JSON.stringify(errorMessages.slice(0, 100)) : undefined,
              notes: `Import ${successCount} DM thành công, ${errorCount} lỗi trong ${elapsed}s`,
            }),
          });
        } catch (err) {
          console.error('[Import Job] Finalize failed:', err);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['import-export-logs-db'] });
      
      if (successCount > 0) {
        toast.success(`Đã import ${successCount} danh mục từ PKGX (${elapsed}s)`);
      }
      if (errorCount > 0) {
        const errorSummary = errorMessages.slice(0, 3).join('\n');
        const moreCount = errorMessages.length > 3 ? `\n...và ${errorMessages.length - 3} lỗi khác` : '';
        toast.error(`${errorCount} danh mục lỗi:\n${errorSummary}${moreCount}`, { duration: 8000 });
      }
    } catch (error) {
      toast.error('Lỗi khi import danh mục');
      if (jobId) {
        try {
          await fetch(`/api/pkgx-import-jobs/${jobId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              status: 'failed',
              processedRecords: processedCount,
              successCount,
              errorCount,
              errors: JSON.stringify([error instanceof Error ? error.message : 'Lỗi không xác định']),
            }),
          });
        } catch (err) {
          console.error('[Import Job] Failed to mark job as failed:', err);
        }
      }
    } finally {
      setIsImporting(false);
      setIsPaused(false);
      pauseRef.current = false;
      setImportProgress({ current: 0, total: 0, currentName: '' });
    }
  };
  
  // Pause/Resume import
  const handlePauseImport = () => {
    pauseRef.current = true;
    setIsPaused(true);
    toast.info('Đã tạm dừng import');
  };
  
  const handleResumeImport = () => {
    pauseRef.current = false;
    setIsPaused(false);
    toast.info('Tiếp tục import...');
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
          → {row.pkgxCategoryName || row.pkgxCatName} (ID: {row.pkgxCategoryId || row.pkgxCatId})
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(row)}>
          <Pencil className="h-4 w-4 mr-2" />
          Sửa
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(row.systemId || row.id || '')}>
          <Trash2 className="h-4 w-4 mr-2 text-destructive" />
          Xóa
        </Button>
      </div>
    </div>
  );
  
  // Guard: return early if settings not loaded (AFTER all hooks)
  if (!settings) {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle size="lg">Mapping danh mục sản phẩm</CardTitle>
              <CardDescription>
                Liên kết danh mục HRM với danh mục PKGX để đồng bộ sản phẩm
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSyncFromPkgx} disabled={isSyncing || isImporting} variant="outline">
                {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Đồng bộ từ PKGX
              </Button>
              <Button onClick={handleImportAndMap} disabled={isImporting || isSyncing} variant="outline">
                {isImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                Import & Mapping
              </Button>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm mapping
              </Button>
            </div>
          </div>
          {isImporting && importProgress.total > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isPaused ? 'Đã tạm dừng...' : 'Đang import danh mục...'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{importProgress.current}/{importProgress.total}</span>
                  {isPaused ? (
                    <Button size="sm" variant="outline" onClick={handleResumeImport}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Tiếp tục
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={handlePauseImport}>
                      <Loader2 className="h-3 w-3 mr-1" />
                      Tạm dừng
                    </Button>
                  )}
                </div>
              </div>
              <Progress value={(importProgress.current / importProgress.total) * 100} className="h-2" />
              {importProgress.currentName && (
                <p className="text-xs text-muted-foreground truncate">Đang xử lý: {importProgress.currentName}</p>
              )}
            </div>
          )}
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
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedCategoryForDetail.cat_desc) }}
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
