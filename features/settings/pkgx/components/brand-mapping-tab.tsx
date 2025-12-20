import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Label } from '../../../../components/ui/label';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { Plus, Pencil, Trash2, RefreshCw, Search, Loader2, Award, Link, Unlink, CheckCircle2, MoreHorizontal, ExternalLink, Upload, AlignLeft, Globe, Link2 } from 'lucide-react';
import { Checkbox } from '../../../../components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../../../components/ui/dropdown-menu';
import { getBrandById, updateBrand } from '../../../../lib/pkgx/api-service';
import { toast } from 'sonner';
import { usePkgxSettingsStore } from '../store';
import { useBrandStore } from '../../inventory/brand-store';
import { ResponsiveDataTable } from '../../../../components/data-table/responsive-data-table';
import type { ColumnDef } from '../../../../components/data-table/types';
import type { PkgxBrandMapping, PkgxBrand, PkgxBrandFromApi } from '../types';
import { useBrandMappingValidation, usePkgxEntitySync } from '../hooks';
import type { HrmBrandData } from '../hooks';
import type { BrandMappingInput } from '../validation';
import { PkgxMappingDialog } from '../../../../components/shared/pkgx-mapping-dialog';
import { PkgxSyncConfirmDialog } from './pkgx-sync-confirm-dialog';

// Extended type for PKGX brands table
interface PkgxBrandRow extends PkgxBrand {
  systemId: string;
  mappedToHrm?: string;
}

// Extended type for mappings table
interface MappingRow extends PkgxBrandMapping {
  systemId: string;
}

export function BrandMappingTab() {
  const { 
    settings, 
    addBrandMapping, 
    updateBrandMapping, 
    deleteBrandMapping,
    syncBrandsFromPkgx,
    addLog,
  } = usePkgxSettingsStore();
  const brandStore = useBrandStore();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('pkgx-brands');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingMapping, setEditingMapping] = React.useState<PkgxBrandMapping | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);
  
  // Detail dialog state
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const [selectedBrandForDetail, setSelectedBrandForDetail] = React.useState<PkgxBrandFromApi | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false);
  const [isPushing, setIsPushing] = React.useState(false);
  
  // Table state
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'id', desc: false });
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  
  // Form state
  const [selectedHrmBrand, setSelectedHrmBrand] = React.useState('');
  const [selectedPkgxBrand, setSelectedPkgxBrand] = React.useState('');
  const [showWarningConfirm, setShowWarningConfirm] = React.useState(false);
  
  // Use shared PKGX entity sync hook
  const entitySync = usePkgxEntitySync({
    entityType: 'brand',
    onLog: addLog,
  });
  
  const hrmBrands = React.useMemo(
    () => brandStore.getActive().sort((a, b) => a.name.localeCompare(b.name)),
    [brandStore]
  );
  
  // Validation hook
  const validation = useBrandMappingValidation({
    existingMappings: settings.brandMappings,
    hrmBrands: hrmBrands,
    pkgxBrands: settings.brands,
    editingMappingId: editingMapping?.id,
    debounceMs: 300,
  });
  
  // Find if PKGX brand is mapped
  const findMapping = React.useCallback((pkgxBrandId: number) => {
    return settings.brandMappings.find(m => m.pkgxBrandId === pkgxBrandId);
  }, [settings.brandMappings]);
  
  // PKGX Brands data for table
  const pkgxBrandsData = React.useMemo((): PkgxBrandRow[] => {
    let filtered = settings.brands;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = settings.brands.filter(b => 
        b.name.toLowerCase().includes(term) ||
        b.id.toString().includes(term)
      );
    }
    return filtered.map(b => ({
      ...b,
      systemId: b.id.toString(),
      mappedToHrm: findMapping(b.id)?.hrmBrandName,
    }));
  }, [settings.brands, searchTerm, findMapping]);
  
  // Mappings data for table
  const mappingsData = React.useMemo((): MappingRow[] => {
    let filtered = settings.brandMappings;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = settings.brandMappings.filter(m =>
        m.hrmBrandName.toLowerCase().includes(term) ||
        m.pkgxBrandName.toLowerCase().includes(term)
      );
    }
    return filtered.map(m => ({
      ...m,
      systemId: m.id,
    }));
  }, [settings.brandMappings, searchTerm]);
  
  // Paginated data
  const paginatedPkgxData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return pkgxBrandsData.slice(start, start + pagination.pageSize);
  }, [pkgxBrandsData, pagination]);
  
  const paginatedMappingsData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return mappingsData.slice(start, start + pagination.pageSize);
  }, [mappingsData, pagination]);
  
  // All selected rows and bulk actions for PKGX brands table
  const allSelectedPkgxRows = React.useMemo(() => 
    paginatedPkgxData.filter(p => rowSelection[p.systemId]),
  [paginatedPkgxData, rowSelection]);
  
  // Get selected PKGX brands that are NOT mapped (for bulk mapping)
  const selectedUnmappedBrands = React.useMemo(() => 
    allSelectedPkgxRows.filter(b => !b.mappedToHrm),
  [allSelectedPkgxRows]);
  
  // Get selected PKGX brands that ARE mapped (for bulk unlink)
  const selectedMappedBrands = React.useMemo(() => 
    allSelectedPkgxRows.filter(b => b.mappedToHrm),
  [allSelectedPkgxRows]);
  
  // Bulk actions for PKGX brands table
  const pkgxBulkActions = React.useMemo(() => [
    {
      label: `Hủy mapping (${selectedMappedBrands.length})`,
      icon: Unlink,
      variant: 'destructive' as const,
      disabled: selectedMappedBrands.length === 0,
      onSelect: () => {
        if (selectedMappedBrands.length === 0) {
          toast.error('Không có thương hiệu đã mapping nào được chọn');
          return;
        }
        // Bulk delete mappings
        selectedMappedBrands.forEach(brand => {
          const mapping = findMapping(brand.id);
          if (mapping) {
            deleteBrandMapping(mapping.id);
          }
        });
        toast.success(`Đã hủy mapping ${selectedMappedBrands.length} thương hiệu`);
        setRowSelection({});
      },
    },
  ], [selectedMappedBrands, findMapping, deleteBrandMapping]);
  
  // PKGX Brands columns
  const pkgxColumns: ColumnDef<PkgxBrandRow>[] = React.useMemo(() => [
    {
      id: 'select',
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : (isSomePageRowsSelected ? 'indeterminate' : false)}
          onCheckedChange={(checked) => onToggleAll?.(checked === true)}
          aria-label="Select all"
        />
      ),
      cell: ({ row, isSelected, onToggleSelect }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(!isSelected)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 48,
      enableSorting: false,
      meta: { displayName: 'Chọn', sticky: 'left' },
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
      header: 'Thương hiệu PKGX',
      cell: ({ row }) => <span className="font-medium">{row.name}</span>,
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
          <Badge variant="secondary">Chưa mapping</Badge>
        )
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 50,
      cell: ({ row }) => {
        // Get HRM brand for sync actions
        const mapping = findMapping(row.id);
        const hrmBrand = mapping ? hrmBrands.find(b => b.systemId === mapping.hrmBrandSystemId) : null;
        
        // Helper to trigger sync with proper HRM data
        const triggerSync = (actionKey: 'sync_all' | 'sync_basic' | 'sync_seo' | 'sync_description') => {
          if (!mapping || !hrmBrand) {
            toast.error('Thương hiệu chưa được liên kết với HRM');
            return;
          }
          const hrmData: HrmBrandData = {
            systemId: hrmBrand.systemId,
            name: hrmBrand.name,
            website: hrmBrand.website,
            seoKeywords: hrmBrand.seoKeywords,
            seoTitle: hrmBrand.seoTitle,
            metaDescription: hrmBrand.metaDescription,
            shortDescription: hrmBrand.shortDescription,
            longDescription: hrmBrand.longDescription,
            websiteSeo: hrmBrand.websiteSeo,
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
                    title="Đồng bộ: Tên, Website, Keywords, Meta Title, Meta Desc, Mô tả ngắn, Mô tả dài"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Đồng bộ tất cả
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Individual sync actions */}
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_basic')}
                    title="Đồng bộ: Tên thương hiệu, Website URL"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Thông tin cơ bản
                  </DropdownMenuItem>
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
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.open(`https://phukiengiaxuong.com.vn/admin/brand.php?act=edit&brand_id=${row.id}`, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Xem trên PKGX
                  </DropdownMenuItem>
                  
                  {/* Hủy liên kết */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => entitySync.handleConfirm(
                      'Hủy liên kết PKGX',
                      `Bạn có chắc muốn hủy liên kết thương hiệu "${row.name}" với PKGX?`,
                      () => handleUnlinkBrand(row.id)
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
  ], [hrmBrands, findMapping, entitySync]);
  
  // Mappings columns
  const mappingColumns: ColumnDef<MappingRow>[] = React.useMemo(() => [
    {
      id: 'hrmBrandName',
      accessorKey: 'hrmBrandName',
      header: 'Thương hiệu HRM',
      cell: ({ row }) => <span className="font-medium">{row.hrmBrandName}</span>,
    },
    {
      id: 'pkgxBrandName',
      accessorKey: 'pkgxBrandName',
      header: 'Thương hiệu PKGX',
      cell: ({ row }) => <span>{row.pkgxBrandName}</span>,
    },
    {
      id: 'pkgxBrandId',
      accessorKey: 'pkgxBrandId',
      header: 'ID PKGX',
      size: 80,
      cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.pkgxBrandId}</span>,
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
  
  const handleQuickMap = (pkgxBrand: PkgxBrandRow) => {
    setSelectedPkgxBrand(pkgxBrand.id.toString());
    setSelectedHrmBrand('');
    setEditingMapping(null);
    setIsDialogOpen(true);
  };
  
  const handleUnlinkBrand = (pkgxBrandId: number) => {
    const mapping = findMapping(pkgxBrandId);
    if (mapping) {
      deleteBrandMapping(mapping.id);
      addLog({
        action: 'unlink_mapping',
        status: 'success',
        message: `Đã hủy liên kết thương hiệu: ${mapping.hrmBrandName} ↔ ${mapping.pkgxBrandName}`,
        details: { brandId: pkgxBrandId },
      });
      toast.success('Đã hủy liên kết thương hiệu');
    }
  };
  
  const handleOpenDialog = (mapping?: PkgxBrandMapping) => {
    if (mapping) {
      setEditingMapping(mapping);
      setSelectedHrmBrand(mapping.hrmBrandSystemId);
      setSelectedPkgxBrand(mapping.pkgxBrandId.toString());
    } else {
      setEditingMapping(null);
      setSelectedHrmBrand('');
      setSelectedPkgxBrand('');
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMapping(null);
    setSelectedHrmBrand('');
    setSelectedPkgxBrand('');
    setShowWarningConfirm(false);
    validation.clearValidation();
  };
  
  // Validate when form values change
  React.useEffect(() => {
    if (isDialogOpen && (selectedHrmBrand || selectedPkgxBrand)) {
      const input: BrandMappingInput = {
        hrmBrandSystemId: selectedHrmBrand || '',
        hrmBrandName: hrmBrands.find(b => b.systemId === selectedHrmBrand)?.name || '',
        pkgxBrandId: selectedPkgxBrand ? parseInt(selectedPkgxBrand) : '',
        pkgxBrandName: settings.brands.find(b => b.id === parseInt(selectedPkgxBrand))?.name || '',
      };
      validation.validateAsync(input);
    }
  }, [selectedHrmBrand, selectedPkgxBrand, isDialogOpen]);
  
  const handleSave = () => {
    // Build input for validation
    const input: BrandMappingInput = {
      hrmBrandSystemId: selectedHrmBrand || '',
      hrmBrandName: hrmBrands.find(b => b.systemId === selectedHrmBrand)?.name || '',
      pkgxBrandId: selectedPkgxBrand ? parseInt(selectedPkgxBrand) : '',
      pkgxBrandName: settings.brands.find(b => b.id === parseInt(selectedPkgxBrand))?.name || '',
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
    
    const hrmBrand = hrmBrands.find((b) => b.systemId === selectedHrmBrand);
    const pkgxBrand = settings.brands.find((b) => b.id === parseInt(selectedPkgxBrand));
    
    if (!hrmBrand || !pkgxBrand) {
      toast.error('Không tìm thấy thương hiệu');
      return;
    }
    
    if (editingMapping) {
      updateBrandMapping(editingMapping.id, {
        hrmBrandSystemId: hrmBrand.systemId,
        hrmBrandName: hrmBrand.name,
        pkgxBrandId: pkgxBrand.id,
        pkgxBrandName: pkgxBrand.name,
      });
      addLog({
        action: 'save_mapping',
        status: 'success',
        message: `Cập nhật mapping thương hiệu: ${hrmBrand.name} → ${pkgxBrand.name}`,
        details: { brandId: pkgxBrand.id },
      });
      toast.success('Đã cập nhật mapping thương hiệu');
    } else {
      addBrandMapping({
        id: `brandmap-${Date.now()}`,
        hrmBrandSystemId: hrmBrand.systemId,
        hrmBrandName: hrmBrand.name,
        pkgxBrandId: pkgxBrand.id,
        pkgxBrandName: pkgxBrand.name,
      });
      addLog({
        action: 'save_mapping',
        status: 'success',
        message: `Thêm mapping thương hiệu: ${hrmBrand.name} → ${pkgxBrand.name}`,
        details: { brandId: pkgxBrand.id },
      });
      toast.success('Đã thêm mapping thương hiệu');
    }
    
    handleCloseDialog();
  };
  
  const handleDelete = (id: string) => {
    const mapping = settings.brandMappings.find(m => m.id === id);
    deleteBrandMapping(id);
    if (mapping) {
      addLog({
        action: 'save_mapping',
        status: 'info',
        message: `Xóa mapping thương hiệu: ${mapping.hrmBrandName}`,
        details: { brandId: mapping.pkgxBrandId },
      });
    }
    toast.success('Đã xóa mapping thương hiệu');
  };
  
  const handleSyncFromPkgx = async () => {
    setIsSyncing(true);
    try {
      await syncBrandsFromPkgx();
      toast.success('Đã đồng bộ thương hiệu từ PKGX');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đồng bộ thương hiệu');
    } finally {
      setIsSyncing(false);
    }
  };
  
  // View brand detail
  const handleViewDetail = async (pkgxBrandId: number) => {
    setIsLoadingDetail(true);
    setIsDetailDialogOpen(true);
    try {
      const response = await getBrandById(pkgxBrandId);
      if (response.success && response.data) {
        setSelectedBrandForDetail(response.data);
      } else {
        toast.error('Không tìm thấy thương hiệu');
        setIsDetailDialogOpen(false);
      }
    } catch (error) {
      toast.error('Không thể tải thông tin thương hiệu');
      setIsDetailDialogOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };
  
  // Push brand from HRM to PKGX
  const handlePushBrand = async (pkgxBrandId: number) => {
    const mapping = findMapping(pkgxBrandId);
    if (!mapping) {
      toast.error('Thương hiệu chưa được mapping với HRM');
      return;
    }
    
    const hrmBrand = hrmBrands.find(b => b.systemId === mapping.hrmBrandSystemId);
    if (!hrmBrand) {
      toast.error('Không tìm thấy thương hiệu HRM');
      return;
    }
    
    setIsPushing(true);
    try {
      await updateBrand(pkgxBrandId, {
        brand_name: hrmBrand.name,
        brand_desc: hrmBrand.description || '',
        site_url: '',
      });
      
      // Refresh detail
      const response = await getBrandById(pkgxBrandId);
      if (response.success && response.data) {
        setSelectedBrandForDetail(response.data);
      }
      
      addLog({
        action: 'sync_all',
        status: 'success',
        message: `Đẩy thương hiệu từ HRM sang PKGX: ${hrmBrand.name}`,
        details: { brandId: pkgxBrandId },
      });
      toast.success('Đã đẩy thông tin thương hiệu sang PKGX');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đẩy thương hiệu');
    } finally {
      setIsPushing(false);
    }
  };
  
  // Mobile card renderers
  const renderPkgxMobileCard = (row: PkgxBrandRow) => (
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
        <div className="font-medium">{row.hrmBrandName}</div>
        <div className="text-sm text-muted-foreground">
          → {row.pkgxBrandName} (ID: {row.pkgxBrandId})
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
              <CardTitle className="text-lg">Mapping thương hiệu</CardTitle>
              <CardDescription>
                Liên kết thương hiệu HRM với thương hiệu PKGX để đồng bộ sản phẩm
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
                  placeholder="Tìm kiếm thương hiệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap text-center sm:text-right">
                {settings.brands.length} thương hiệu PKGX | {settings.brandMappings.length} mapping
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pkgx-brands">
                  <Award className="h-4 w-4 mr-2" />
                  Thương hiệu PKGX ({settings.brands.length})
                </TabsTrigger>
                <TabsTrigger value="mappings">
                  <Link className="h-4 w-4 mr-2" />
                  Mapping ({settings.brandMappings.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pkgx-brands" className="mt-4">
                {settings.brands.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có thương hiệu từ PKGX.</p>
                    <p className="text-sm mt-1">Bấm "Đồng bộ từ PKGX" để lấy danh sách.</p>
                  </div>
                ) : (
                  <ResponsiveDataTable
                    columns={pkgxColumns}
                    data={paginatedPkgxData}
                    renderMobileCard={renderPkgxMobileCard}
                    pageCount={Math.ceil(pkgxBrandsData.length / pagination.pageSize)}
                    pagination={pagination}
                    setPagination={setPagination}
                    rowCount={pkgxBrandsData.length}
                    sorting={sorting}
                    setSorting={setSorting}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    bulkActions={pkgxBulkActions}
                    allSelectedRows={allSelectedPkgxRows}
                    emptyTitle="Không tìm thấy thương hiệu"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="mappings" className="mt-4">
                {settings.brandMappings.length === 0 ? (
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
        type="brand"
        isEditing={!!editingMapping}
        hrmItems={hrmBrands.map((b) => ({
          id: b.systemId,
          name: b.name,
        }))}
        selectedHrmId={selectedHrmBrand}
        onSelectHrmId={setSelectedHrmBrand}
        pkgxItems={settings.brands.map((b) => ({
          id: b.id.toString(),
          name: b.name,
          subText: `ID: ${b.id}`,
        }))}
        selectedPkgxId={selectedPkgxBrand}
        onSelectPkgxId={setSelectedPkgxBrand}
        pkgxSuggestions={validation.suggestions.map(s => ({
          item: { id: s.brand.id.toString(), name: s.brand.name },
          score: s.score,
        }))}
        validation={validation.validationResult}
        hasErrors={validation.hasErrors}
        isValidating={validation.isValidating}
        showWarningConfirm={showWarningConfirm}
        onConfirm={handleSave}
        onCancel={handleCloseDialog}
      />
      
      {/* Brand Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Chi tiết thương hiệu PKGX
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và SEO của thương hiệu
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedBrandForDetail ? (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                {/* Basic Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Thông tin cơ bản
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">ID:</span>
                      <span className="ml-2 font-mono">{selectedBrandForDetail.brand_id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tên:</span>
                      <span className="ml-2 font-medium">{selectedBrandForDetail.brand_name}</span>
                    </div>
                    {selectedBrandForDetail.brand_logo && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Logo:</span>
                        <img 
                          src={selectedBrandForDetail.brand_logo} 
                          alt={selectedBrandForDetail.brand_name}
                          className="mt-2 h-16 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* SEO Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    SEO & Mô tả
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">Website:</span>
                      {selectedBrandForDetail.site_url ? (
                        <a 
                          href={selectedBrandForDetail.site_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedBrandForDetail.site_url}
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic">Chưa có</span>
                      )}
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Mô tả:</span>
                      {selectedBrandForDetail.brand_desc ? (
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 rounded-md p-3"
                          dangerouslySetInnerHTML={{ __html: selectedBrandForDetail.brand_desc }}
                        />
                      ) : (
                        <span className="text-muted-foreground italic">Chưa có mô tả</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Mapping Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Trạng thái mapping
                  </h4>
                  {findMapping(selectedBrandForDetail.brand_id) ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3">
                      <Badge variant="default" className="bg-green-500 mb-2">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Đã mapping
                      </Badge>
                      <p className="text-sm">
                        HRM: <span className="font-medium">{findMapping(selectedBrandForDetail.brand_id)?.hrmBrandName}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-muted/50 rounded-md p-3">
                      <Badge variant="secondary">Chưa mapping</Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        Thương hiệu này chưa được liên kết với HRM
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          ) : null}
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(`https://phukiengiaxuong.com.vn/admin/brand.php?act=edit&brand_id=${selectedBrandForDetail?.brand_id}`, '_blank')}
              disabled={!selectedBrandForDetail}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Xem trên PKGX
            </Button>
            {selectedBrandForDetail && findMapping(selectedBrandForDetail.brand_id) && (
              <Button
                onClick={() => handlePushBrand(selectedBrandForDetail.brand_id)}
                disabled={isPushing}
              >
                {isPushing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Đẩy HRM → PKGX
              </Button>
            )}
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
