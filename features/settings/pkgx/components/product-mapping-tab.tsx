'use client'

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu';
import { Search, Link, RefreshCw, Loader2, CheckCircle2, TriangleAlert, Package, ExternalLink, Unlink, Link2, MoreHorizontal, FileText, DollarSign, AlignLeft, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useProductStore } from '../../../products/store';
import { usePkgxSettings, usePkgxLogMutations, usePkgxProductsMutations, usePkgxGetters } from '../hooks/use-pkgx-settings';
import { getProducts as fetchPkgxProducts, updateProduct as updatePkgxProduct, getProductById as fetchPkgxProductById, getProductGallery as fetchPkgxGallery } from '../../../../lib/pkgx/api-service';
import type { PkgxProduct, PkgxGalleryImage } from '../types';
import type { SystemId } from '../../../../lib/id-types';
import { ResponsiveDataTable } from '../../../../components/data-table/responsive-data-table';
import { useAuth } from '../../../../contexts/auth-context';
import { useProductMappingValidation } from '../hooks/use-product-mapping-validation';
import { usePkgxEntitySync } from '../hooks';
import type { HrmProductData } from '../hooks';
import type { ProductMappingInput } from '../validation/product-mapping-validation';
import { PkgxMappingDialog } from '../../../../components/shared/pkgx-mapping-dialog';
import { PkgxSyncConfirmDialog } from './pkgx-sync-confirm-dialog';
import type { ColumnDef } from '../../../../components/data-table/types';

// Import extracted components
import { 
  MobileProductDropdown, 
  ProductDetailDialog, 
  PushSyncDialog, 
  UnlinkDialog, 
  BulkUnlinkDialog,
  PUSH_SYNC_FIELDS,
  type PkgxProductRow,
  type PushSyncFieldKey,
} from './product-mapping';

export function ProductMappingTab() {
  // Auth
  const { user: _user } = useAuth();
  
  // Stores
  const { data: settings } = usePkgxSettings();
  const { addLog } = usePkgxLogMutations();
  const { setPkgxProducts } = usePkgxProductsMutations();
  const { getPkgxCatIdByHrmCategory, getPkgxBrandIdByHrmBrand } = usePkgxGetters();
  const productStore = useProductStore();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSyncing, setIsSyncing] = React.useState(false);
  
  // Sử dụng pkgxProducts từ store (dùng chung với Link Dialog)
  const pkgxProducts = React.useMemo(() => settings?.pkgxProducts || [], [settings?.pkgxProducts]);
  
  // Auto-fetch khi vào tab nếu chưa có data và PKGX đã được cấu hình
  const _hasAutoFetched = React.useRef(false);
  
  // Helper function để build URL ảnh PKGX
  const buildPkgxImageUrl = React.useCallback((imagePath: string | undefined | null): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // Xóa / ở đầu nếu có và build URL đầy đủ với /cdn/
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `https://phukiengiaxuong.com.vn/cdn/${cleanPath}`;
  }, []);
  
  // Product detail dialog state
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = React.useState<PkgxProductRow | null>(null);
  const [_isLoadingProductDetail, setIsLoadingProductDetail] = React.useState(false);
  
  // Gallery state
  const [galleryImages, setGalleryImages] = React.useState<PkgxGalleryImage[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = React.useState(false);
  
  // Link dialog state
  const [selectedPkgxProduct, setSelectedPkgxProduct] = React.useState<PkgxProduct | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);
  const [selectedHrmProductId, setSelectedHrmProductId] = React.useState('');
  const [showWarningConfirm, setShowWarningConfirm] = React.useState(false);
  
  // Unlink dialog state
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = React.useState(false);
  const [productToUnlink, setProductToUnlink] = React.useState<{ pkgxProduct: PkgxProduct; hrmProduct: { systemId: string; name: string } } | null>(null);
  
  // Row selection state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  
  // Bulk unlink dialog state
  const [isBulkUnlinkDialogOpen, setIsBulkUnlinkDialogOpen] = React.useState(false);
  
  // Use shared PKGX entity sync hook
  const entitySync = usePkgxEntitySync({
    entityType: 'product',
    onLog: (log) => addLog.mutate(log),
    getPkgxCatIdByHrmCategory,
    getPkgxBrandIdByHrmBrand,
  });
  
  // Sync dialog state - Push (HRM to PKGX) - Default basic fields + prices
  const [isPushDialogOpen, setIsPushDialogOpen] = React.useState(false);
  const [productToPush, setProductToPush] = React.useState<PkgxProductRow | null>(null);
  const [selectedPushFields, setSelectedPushFields] = React.useState<PushSyncFieldKey[]>(['goods_name', 'sync_prices', 'goods_number']);
  const [isPushingProduct, setIsPushingProduct] = React.useState(false);
  
  // HRM products - sử dụng productStore.data trực tiếp để đảm bảo reactive
  const hrmProducts = React.useMemo(
    () => productStore.data.filter(p => !p.isDeleted).sort((a, b) => a.name.localeCompare(b.name)),
    [productStore.data]
  );
  
  // Validation hook
  const validation = useProductMappingValidation({
    hrmProducts: hrmProducts.map(p => ({
      systemId: p.systemId,
      name: p.name,
      id: p.id,
      pkgxId: p.pkgxId,
      status: p.status,
    })),
    pkgxProducts: pkgxProducts,
    editingProductId: undefined,
    debounceMs: 300,
  });
  
  // Count of linked HRM products
  const linkedCount = React.useMemo(
    () => hrmProducts.filter((p) => p.pkgxId).length,
    [hrmProducts]
  );
  
  // Find HRM product linked to a PKGX product
  // FIX: Sử dụng == thay vì === để handle cả string và number (localStorage có thể lưu string)
  const findLinkedHrmProduct = React.useCallback((pkgxId: number) => {
    return hrmProducts.find((p) => p.pkgxId == pkgxId);
  }, [hrmProducts]);
  
  // Filter and transform PKGX products
  const tableData = React.useMemo((): PkgxProductRow[] => {
    let filtered = pkgxProducts;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = pkgxProducts.filter(
        (p) =>
          p.goods_name.toLowerCase().includes(term) ||
          p.goods_sn?.toLowerCase().includes(term) ||
          p.goods_id.toString().includes(term)
      );
    }
    
    return filtered.map((p) => {
      const linked = findLinkedHrmProduct(p.goods_id);
      // Calculate total inventory from all branches
      const totalInventory = linked 
        ? Object.values(linked.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0)
        : 0;
      
      return {
        ...p,
        linkedHrmProduct: linked ? {
          systemId: linked.systemId,
          name: linked.name,
          id: linked.id,
          sku: linked.sku,
          // Giá cả
          sellingPrice: linked.sellingPrice,
          costPrice: linked.costPrice,
          partnerPrice: (linked as { partnerPrice?: number }).partnerPrice,
          acePrice: (linked as { acePrice?: number }).acePrice,
          dealPrice: (linked as { dealPrice?: number }).dealPrice,
          // Tồn kho
          quantity: totalInventory,
          // Nội dung
          description: linked.description,
          shortDescription: linked.shortDescription,
          // SEO
          seoDescription: linked.seoDescription,
          seoKeywords: linked.seoKeywords,
          ktitle: linked.ktitle,
          // Phân loại
          categorySystemId: linked.categorySystemId,
          brandSystemId: linked.brandSystemId,
          // Trạng thái
          isBest: (linked as { isBest?: boolean }).isBest,
          isHot: (linked as { isHot?: boolean }).isHot,
          isNew: (linked as { isNew?: boolean }).isNew,
          isHome: (linked as { isHome?: boolean }).isHome,
          // Khác
          sellerNote: linked.sellerNote,
        } : undefined,
        // Required by ResponsiveDataTable
        systemId: p.goods_id.toString(),
      };
    });
  }, [pkgxProducts, searchTerm, findLinkedHrmProduct]);
  
  // Pagination state for ResponsiveDataTable
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'goods_id', desc: true });
  
  // Paginated data for ResponsiveDataTable
  const pageCount = Math.ceil(tableData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return tableData.slice(start, start + pagination.pageSize);
  }, [tableData, pagination]);
  
  // Reset page when search changes
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [searchTerm]);
  
  // Column definitions for ResponsiveDataTable
  const columns = React.useMemo((): ColumnDef<PkgxProductRow>[] => [
    // Checkbox column
    {
      id: 'select',
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ onToggleSelect, isSelected }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Select row"
        />
      ),
      size: 40,
      meta: { displayName: 'Chọn', excludeFromExport: true },
    },
    {
      id: 'goods_id',
      accessorKey: 'goods_id',
      header: 'ID',
      size: 70,
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">{row.goods_id}</span>
      ),
      meta: { displayName: 'ID' },
    },
    {
      id: 'goods_sn',
      accessorKey: 'goods_sn',
      header: 'Mã SP',
      size: 100,
      cell: ({ row }) => (
        <span className="font-mono text-xs truncate block max-w-[90px]" title={row.goods_sn || '-'}>
          {row.goods_sn || '-'}
        </span>
      ),
      meta: { displayName: 'Mã SP' },
    },
    {
      id: 'goods_name',
      accessorKey: 'goods_name',
      header: 'Tên sản phẩm PKGX',
      size: 300,
      cell: ({ row }) => (
        <button
          className="font-medium line-clamp-2 text-left hover:text-primary hover:underline cursor-pointer"
          title={`Click để xem chi tiết: ${row.goods_name}`}
          onClick={() => handleOpenDetailDialog(row)}
        >
          {row.goods_name}
        </button>
      ),
      meta: { displayName: 'Tên sản phẩm PKGX' },
    },
    {
      id: 'linkedHrmProduct',
      header: 'Sản phẩm HRM',
      size: 200,
      cell: ({ row }) => (
        row.linkedHrmProduct ? (
          <button 
            className="text-sm truncate block max-w-[190px] text-left hover:text-primary hover:underline cursor-pointer transition-colors" 
            title={`Click để xem chi tiết: ${row.linkedHrmProduct.name}`}
            onClick={(e) => {
              e.stopPropagation();
              // Mở trang sản phẩm trong tab mới
              window.open(`/products?id=${row.linkedHrmProduct?.id}`, '_blank');
            }}
          >
            {row.linkedHrmProduct.name}
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">Chưa liên kết</span>
        )
      ),
      meta: { displayName: 'Sản phẩm HRM' },
    },
    {
      id: 'status',
      header: 'Trạng thái',
      size: 110,
      cell: ({ row }) => (
        <div className="text-center">
          {row.linkedHrmProduct ? (
            <Badge variant="default" className="bg-green-500 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Đã liên kết
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Chưa liên kết
            </Badge>
          )}
        </div>
      ),
      meta: { displayName: 'Trạng thái' },
    },
    {
      id: 'actions',
      header: '',
      size: 50,
      cell: ({ row }) => {
        // Helper to build HRM product data for sync
        const buildHrmData = (): HrmProductData | null => {
          if (!row.linkedHrmProduct) return null;
          return {
            systemId: row.linkedHrmProduct.systemId,
            name: row.linkedHrmProduct.name,
            sku: row.linkedHrmProduct.sku,
            sellingPrice: row.linkedHrmProduct.sellingPrice,
            costPrice: row.linkedHrmProduct.costPrice,
            dealPrice: row.linkedHrmProduct.dealPrice,
            quantity: row.linkedHrmProduct.quantity,
            seoKeywords: row.linkedHrmProduct.seoKeywords,
            ktitle: row.linkedHrmProduct.ktitle,
            seoDescription: row.linkedHrmProduct.seoDescription,
            shortDescription: row.linkedHrmProduct.shortDescription,
            description: row.linkedHrmProduct.description,
            isBest: row.linkedHrmProduct.isBest,
            isNew: row.linkedHrmProduct.isNew,
            isHot: row.linkedHrmProduct.isHot,
            isHome: row.linkedHrmProduct.isHome,
            categorySystemId: row.linkedHrmProduct.categorySystemId,
            brandSystemId: row.linkedHrmProduct.brandSystemId,
          };
        };
        
        // Helper to trigger sync with proper HRM data
        const triggerSync = (actionKey: 'sync_all' | 'sync_basic' | 'sync_seo' | 'sync_description' | 'sync_price' | 'sync_inventory' | 'sync_flags') => {
          const hrmData = buildHrmData();
          if (!hrmData) {
            toast.error('Sản phẩm chưa được liên kết với HRM');
            return;
          }
          entitySync.triggerSyncAction(actionKey, row.goods_id, hrmData, row.goods_name);
        };
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {row.linkedHrmProduct ? (
                <>
                  {/* Sync All - Most important action */}
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_all')}
                    className="font-medium"
                    title="Đồng bộ tên, SKU, giá, tồn kho, SEO, mô tả, flags"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Đồng bộ tất cả
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Individual sync actions */}
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_basic')}
                    title="Tên sản phẩm, mã SKU, danh mục, thương hiệu"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Thông tin cơ bản
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_price')}
                    title="Giá bán, giá thị trường, giá khuyến mãi"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Giá
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_inventory')}
                    title="Tổng số lượng tồn kho từ tất cả chi nhánh"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Tồn kho
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_seo')}
                    title="Keywords, Meta Title, Meta Description"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    SEO
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_description')}
                    title="Mô tả ngắn (goods_brief), mô tả chi tiết (goods_desc)"
                  >
                    <AlignLeft className="h-4 w-4 mr-2" />
                    Mô tả
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_flags')}
                    title="Nổi bật (best), Hot, Mới (new), Trang chủ"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Flags
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleViewOnPkgx(row.goods_id)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Xem trên PKGX
                  </DropdownMenuItem>
                  
                  {/* Hủy liên kết */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => entitySync.handleConfirm(
                      'Hủy liên kết PKGX',
                      `Bạn có chắc muốn hủy liên kết sản phẩm "${row.goods_name}" với HRM?`,
                      () => handleOpenUnlinkDialog(row)
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
                  <DropdownMenuItem onClick={() => handleOpenLinkDialog(row)}>
                    <Link2 className="h-4 w-4 mr-2" />
                    Liên kết với HRM
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      meta: { displayName: '', excludeFromExport: true },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handler functions are stable, defined after this useMemo
  ], [hrmProducts, getPkgxCatIdByHrmCategory, getPkgxBrandIdByHrmBrand, entitySync]);
  
  // Mobile card renderer
  const renderMobileCard = React.useCallback((row: PkgxProductRow, _index: number) => (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <button 
          className="flex-1 min-w-0 text-left"
          onClick={() => handleOpenDetailDialog(row)}
        >
          <div className="font-medium line-clamp-2 hover:text-primary hover:underline">{row.goods_name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            ID: {row.goods_id} | Mã: {row.goods_sn || '-'}
          </div>
        </button>
        <div className="flex items-center gap-2">
          {row.linkedHrmProduct ? (
            <Badge variant="default" className="bg-green-500 text-xs shrink-0">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Đã liên kết
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs shrink-0">Chưa liên kết</Badge>
          )}
          <MobileProductDropdown 
            row={row} 
            entitySync={entitySync}
            onViewOnPkgx={handleViewOnPkgx}
            onOpenLinkDialog={handleOpenLinkDialog}
            onOpenUnlinkDialog={handleOpenUnlinkDialog}
          />
        </div>
      </div>
      
      {row.linkedHrmProduct && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">HRM:</span>{' '}
          <button
            className="hover:text-primary hover:underline cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/products?id=${row.linkedHrmProduct?.id}`, '_blank');
            }}
          >
            {row.linkedHrmProduct.name}
          </button>
        </div>
      )}
    </div>
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handler functions are stable, defined after this useCallback
  ), [hrmProducts, getPkgxCatIdByHrmCategory, getPkgxBrandIdByHrmBrand]);
  
  // Handlers
  const handleOpenDetailDialog = React.useCallback(async (row: PkgxProductRow) => {
    setSelectedProductForDetail(row);
    setIsDetailDialogOpen(true);
    setGalleryImages([]); // Reset gallery
    
    // Fetch gallery ảnh
    setIsLoadingGallery(true);
    try {
      const result = await fetchPkgxGallery(row.goods_id);
      if (result.success && result.data) {
        setGalleryImages(result.data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setIsLoadingGallery(false);
    }
  }, []);
  
  const handleViewOnPkgx = React.useCallback((goodsId: number) => {
    window.open(`https://phukiengiaxuong.com.vn/admin/goods.php?act=edit&goods_id=${goodsId}`, '_blank');
  }, []);
  
  const handleOpenLinkDialog = React.useCallback((pkgxProduct: PkgxProduct) => {
    setSelectedPkgxProduct(pkgxProduct);
    // Auto-suggest matching products
    validation.updateSuggestions(pkgxProduct);
    // Try to find exact match by SKU first, then by name
    const matchedProduct = hrmProducts.find(
      (p) => p.id === pkgxProduct.goods_sn || p.name === pkgxProduct.goods_name
    );
    setSelectedHrmProductId(matchedProduct?.systemId || '');
    setShowWarningConfirm(false);
    validation.clearValidation();
    setIsLinkDialogOpen(true);
  }, [hrmProducts, validation]);
  
  const handleCloseLinkDialog = React.useCallback(() => {
    setIsLinkDialogOpen(false);
    setSelectedPkgxProduct(null);
    setSelectedHrmProductId('');
    setShowWarningConfirm(false);
    validation.clearValidation();
  }, [validation]);
  
  const handleOpenUnlinkDialog = React.useCallback((pkgxProduct: PkgxProduct) => {
    const hrmProduct = findLinkedHrmProduct(pkgxProduct.goods_id);
    if (hrmProduct) {
      setProductToUnlink({ pkgxProduct, hrmProduct });
      setIsUnlinkDialogOpen(true);
    }
  }, [findLinkedHrmProduct]);
  
  // Get selected products that are linked (for bulk unlink)
  const selectedLinkedProducts = React.useMemo(() => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    return paginatedData.filter(p => selectedIds.includes(p.systemId) && p.linkedHrmProduct);
  }, [rowSelection, paginatedData]);
  
  // All selected rows for bulk actions
  const allSelectedRows = React.useMemo(() => 
    paginatedData.filter(p => rowSelection[p.systemId]),
  [paginatedData, rowSelection]);
  
  // Bulk actions for ResponsiveDataTable
  const bulkActions = React.useMemo(() => [
    {
      label: 'Hủy liên kết',
      icon: Unlink,
      variant: 'destructive' as const,
      disabled: selectedLinkedProducts.length === 0,
      onSelect: () => {
        if (selectedLinkedProducts.length === 0) {
          toast.error('Không có sản phẩm đã liên kết nào được chọn');
          return;
        }
        setIsBulkUnlinkDialogOpen(true);
      },
    },
  ], [selectedLinkedProducts]);
  
  const handleConfirmBulkUnlink = React.useCallback(() => {
    let successCount = 0;
    selectedLinkedProducts.forEach(product => {
      if (product.linkedHrmProduct) {
        productStore.update(product.linkedHrmProduct.systemId as SystemId, { pkgxId: undefined });
        successCount++;
      }
    });
    
    setIsBulkUnlinkDialogOpen(false);
    setRowSelection({});
    toast.success(`Đã hủy liên kết ${successCount} sản phẩm`);
    
    addLog.mutate({
      action: 'batch_unlink',
      status: 'success',
      message: `Đã hủy liên kết ${successCount} sản phẩm`,
      details: { total: successCount },
    });
  }, [selectedLinkedProducts, productStore, addLog]);
  
  const _handleOpenPushDialog = React.useCallback((row: PkgxProductRow) => {
    setProductToPush(row);
    // Reset to default fields when opening dialog
    setSelectedPushFields(['goods_name', 'sync_prices', 'goods_number']);
    setIsPushDialogOpen(true);
  }, []);
  
  const handleTogglePushField = (field: PushSyncFieldKey) => {
    setSelectedPushFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };
  
  const handleSelectAllPushFields = () => {
    if (selectedPushFields.length === PUSH_SYNC_FIELDS.length) {
      setSelectedPushFields([]);
    } else {
      setSelectedPushFields(PUSH_SYNC_FIELDS.map(f => f.key));
    }
  };
  
  // Sync products from PKGX (limit 100 to fit localStorage)
  const handleSyncFromPkgx = async () => {
    setIsSyncing(true);
    const startTime = Date.now();
    try {
      toast.info('Đang tải sản phẩm từ PKGX...');
      const response = await fetchPkgxProducts(1, 100);
      if (response.success && response.data && !response.data.error) {
        // Lưu vào store để dùng chung với Link Dialog
        setPkgxProducts.mutate(response.data.data);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
        
        addLog.mutate({
          action: 'get_products',
          status: 'success',
          message: `Đã lấy ${response.data.data.length}/${response.data.pagination.total_items} sản phẩm từ PKGX`,
          details: { 
            total: response.data.pagination.total_items,
            responseTime: Date.now() - startTime,
          },
        });
        toast.success(`Đã lấy ${response.data.data.length}/${response.data.pagination.total_items} sản phẩm từ PKGX`);
      } else {
        throw new Error(response.error || 'Không thể lấy danh sách sản phẩm');
      }
    } catch (error) {
      addLog.mutate({
        action: 'get_products',
        status: 'error',
        message: 'Lỗi khi lấy sản phẩm từ PKGX',
        details: { 
          error: error instanceof Error ? error.message : String(error),
          responseTime: Date.now() - startTime,
        },
      });
      toast.error(error instanceof Error ? error.message : 'Lỗi khi lấy sản phẩm từ PKGX');
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Refresh single product from PKGX
  const handleRefreshSingleProduct = async (goodsId: number) => {
    setIsLoadingProductDetail(true);
    try {
      const response = await fetchPkgxProductById(goodsId);
      if (response.success && response.data) {
        // Update the product in the list
        const updatedProducts = pkgxProducts.map(p => 
          p.goods_id === goodsId ? response.data! : p
        );
        setPkgxProducts.mutate(updatedProducts);
        
        // Also update the selected product for detail if it's open
        if (selectedProductForDetail?.goods_id === goodsId) {
          const linked = findLinkedHrmProduct(goodsId);
          const totalInventory = linked 
            ? Object.values(linked.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0)
            : 0;
          
          setSelectedProductForDetail({
            ...response.data,
            linkedHrmProduct: linked ? {
              systemId: linked.systemId,
              name: linked.name,
              id: linked.id,
              sku: linked.sku,
              sellingPrice: linked.sellingPrice,
              costPrice: linked.costPrice,
              partnerPrice: (linked as unknown as Record<string, unknown>).partnerPrice as number | undefined,
              acePrice: (linked as unknown as Record<string, unknown>).acePrice as number | undefined,
              dealPrice: (linked as unknown as Record<string, unknown>).dealPrice as number | undefined,
              quantity: totalInventory,
              description: linked.description,
              shortDescription: linked.shortDescription,
              seoDescription: linked.seoDescription,
              seoKeywords: linked.seoKeywords,
              ktitle: linked.ktitle,
              categorySystemId: linked.categorySystemId,
              brandSystemId: linked.brandSystemId,
              isBest: (linked as unknown as Record<string, unknown>).isBest as boolean | undefined,
              isHot: (linked as unknown as Record<string, unknown>).isHot as boolean | undefined,
              isNew: (linked as unknown as Record<string, unknown>).isNew as boolean | undefined,
              isHome: (linked as unknown as Record<string, unknown>).isHome as boolean | undefined,
              sellerNote: linked.sellerNote,
            } : undefined,
            systemId: response.data.goods_id.toString(),
          });
        }
        
        toast.success('Đã cập nhật thông tin sản phẩm');
        return true;
      } else {
        toast.error(response.error || 'Không thể lấy thông tin sản phẩm');
        return false;
      }
    } catch (_error) {
      toast.error('Lỗi khi lấy thông tin sản phẩm');
      return false;
    } finally {
      setIsLoadingProductDetail(false);
    }
  };
  
  // Validate when form values change
  React.useEffect(() => {
    if (isLinkDialogOpen && selectedPkgxProduct && selectedHrmProductId) {
      const hrmProduct = hrmProducts.find(p => p.systemId === selectedHrmProductId);
      const input: ProductMappingInput = {
        hrmProductSystemId: selectedHrmProductId || '',
        hrmProductName: hrmProduct?.name || '',
        hrmProductSku: hrmProduct?.id,
        pkgxProductId: selectedPkgxProduct.goods_id,
        pkgxProductName: selectedPkgxProduct.goods_name,
        pkgxProductSku: selectedPkgxProduct.goods_sn,
      };
      validation.validateAsync(input);
    }
  }, [selectedHrmProductId, selectedPkgxProduct, isLinkDialogOpen, hrmProducts, validation]);
  
  // Confirm link
  const handleConfirmLink = () => {
    if (!selectedPkgxProduct) {
      toast.error('Vui lòng chọn sản phẩm PKGX');
      return;
    }
    
    // Build input for validation
    const hrmProduct = hrmProducts.find(p => p.systemId === selectedHrmProductId);
    const input: ProductMappingInput = {
      hrmProductSystemId: selectedHrmProductId || '',
      hrmProductName: hrmProduct?.name || '',
      hrmProductSku: hrmProduct?.id,
      pkgxProductId: selectedPkgxProduct.goods_id,
      pkgxProductName: selectedPkgxProduct.goods_name,
      pkgxProductSku: selectedPkgxProduct.goods_sn,
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
    
    if (!hrmProduct) {
      toast.error('Không tìm thấy sản phẩm HRM');
      return;
    }
    
    productStore.update(selectedHrmProductId as SystemId, { pkgxId: selectedPkgxProduct.goods_id });
    toast.success(`Đã liên kết "${selectedPkgxProduct.goods_name}" với sản phẩm HRM`);
    
    addLog.mutate({
      action: 'link_product',
      status: 'success',
      message: `Đã liên kết: ${hrmProduct.name} ↔ ${selectedPkgxProduct.goods_name}`,
      details: { 
        pkgxId: selectedPkgxProduct.goods_id, 
        productId: selectedHrmProductId, 
        productName: hrmProduct.name,
      },
    });
    
    handleCloseLinkDialog();
  };
  
  // Confirm unlink
  const handleConfirmUnlink = () => {
    if (productToUnlink?.hrmProduct) {
      productStore.update(productToUnlink.hrmProduct.systemId as SystemId, { pkgxId: undefined });
      toast.success(`Đã hủy liên kết sản phẩm`);
      
      addLog.mutate({
        action: 'unlink_product',
        status: 'success',
        message: `Đã hủy liên kết: ${productToUnlink.hrmProduct.name}`,
        details: { 
          pkgxId: productToUnlink.pkgxProduct.goods_id, 
          productId: productToUnlink.hrmProduct.systemId,
          productName: productToUnlink.hrmProduct.name,
        },
      });
    }
    setIsUnlinkDialogOpen(false);
    setProductToUnlink(null);
  };
  
  // Confirm push (Push: HRM → PKGX)
  const handleConfirmPush = async () => {
    if (!productToPush || !productToPush.linkedHrmProduct || selectedPushFields.length === 0) {
      toast.error('Vui lòng chọn ít nhất một trường để đồng bộ');
      return;
    }
    
    setIsPushingProduct(true);
    
    try {
      const hrm = productToPush.linkedHrmProduct;
      const pushData: Record<string, unknown> = {};
      
      for (const field of selectedPushFields) {
        switch (field) {
          // Thông tin cơ bản
          case 'goods_name':
            pushData.goods_name = hrm.name;
            break;
          case 'goods_sn':
            if (hrm.sku) pushData.goods_sn = hrm.sku;
            break;
          case 'goods_brief':
            pushData.goods_brief = hrm.shortDescription || '';
            break;
          case 'goods_desc':
            pushData.goods_desc = hrm.description || '';
            break;
            
          // Giá cả - CHỈ đồng bộ nếu đã cấu hình mapping giá
          case 'sync_prices': {
            const { priceMapping } = settings ?? {};
            const hasPriceMapping = priceMapping?.shopPrice || priceMapping?.marketPrice || priceMapping?.partnerPrice || priceMapping?.acePrice || priceMapping?.dealPrice;
            
            if (!hasPriceMapping) {
              toast.warning('Chưa cấu hình Mapping giá. Vui lòng vào tab "Mapping giá" để thiết lập trước khi đồng bộ giá.');
            } else {
              // Chỉ push giá nếu có mapping tương ứng
              if (priceMapping?.shopPrice && hrm.sellingPrice) {
                pushData.shop_price = hrm.sellingPrice;
              }
              if (priceMapping?.partnerPrice && hrm.partnerPrice) {
                pushData.partner_price = hrm.partnerPrice;
              }
              if (priceMapping?.acePrice && hrm.acePrice) {
                pushData.ace_price = hrm.acePrice;
              }
              if (priceMapping?.dealPrice && hrm.dealPrice) {
                pushData.deal_price = hrm.dealPrice;
              }
            }
            break;
          }
            
          // Tồn kho
          case 'goods_number':
            pushData.goods_number = hrm.quantity || 0;
            break;
            
          // Phân loại
          case 'cat_id':
            if (hrm.categorySystemId) {
              const pkgxCatId = getPkgxCatIdByHrmCategory(hrm.categorySystemId);
              if (pkgxCatId) {
                pushData.cat_id = pkgxCatId;
              }
            }
            break;
          case 'brand_id':
            if (hrm.brandSystemId) {
              const pkgxBrandId = getPkgxBrandIdByHrmBrand(hrm.brandSystemId);
              if (pkgxBrandId) {
                pushData.brand_id = pkgxBrandId;
              }
            }
            break;
            
          // SEO
          case 'keywords':
            pushData.keywords = hrm.seoKeywords || hrm.seoDescription || '';
            break;
          case 'meta_title':
            pushData.meta_title = hrm.ktitle || hrm.name || '';
            break;
          case 'meta_desc':
            pushData.meta_desc = hrm.seoDescription || '';
            break;
            
          // Trạng thái hiển thị
          case 'best':
            pushData.best = hrm.isBest ? 1 : 0;
            break;
          case 'hot':
            pushData.hot = hrm.isHot ? 1 : 0;
            break;
          case 'new':
            pushData.new = hrm.isNew ? 1 : 0;
            break;
          case 'ishome':
            pushData.ishome = hrm.isHome ? 1 : 0;
            break;
            
          // Ghi chú
          case 'seller_note':
            pushData.seller_note = hrm.sellerNote || '';
            break;
        }
      }
      
      // Call API to update PKGX
      const response = await updatePkgxProduct(productToPush.goods_id, pushData);
      
      if (response.success) {
        addLog.mutate({
          action: 'update_product',
          status: 'success',
          message: `Đã đẩy ${selectedPushFields.length} trường từ HRM → PKGX`,
          details: {
            pkgxId: productToPush.goods_id,
            productId: hrm.systemId,
            productName: hrm.name,
          },
        });
        
        toast.success(`Đã đẩy ${selectedPushFields.length} trường lên PKGX`);
        
        // Only refresh the single product
        await handleRefreshSingleProduct(productToPush.goods_id);
        
        setIsPushDialogOpen(false);
        setProductToPush(null);
      } else {
        throw new Error(response.error || 'Không thể cập nhật sản phẩm trên PKGX');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đẩy dữ liệu lên PKGX');
      addLog.mutate({
        action: 'update_product',
        status: 'error',
        message: 'Lỗi khi đẩy dữ liệu lên PKGX',
        details: { error: error instanceof Error ? error.message : String(error) },
      });
    } finally {
      setIsPushingProduct(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Sản phẩm đã liên kết</CardTitle>
              <CardDescription>
                Đồng bộ và liên kết sản phẩm PKGX với sản phẩm HRM
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSyncFromPkgx} disabled={isSyncing}>
                {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Đồng bộ từ PKGX
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm PKGX..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap text-center sm:text-right">
                {pkgxProducts.length} SP | {linkedCount} đã liên kết
                {settings?.pkgxProductsLastFetch && (
                  <span className="ml-2 text-xs opacity-70">
                    ({new Date(settings.pkgxProductsLastFetch).toLocaleString('vi-VN')})
                  </span>
                )}
              </div>
            </div>
            
            {/* Tabs - PKGX Products and Linked/Mapping */}
            <Tabs defaultValue="pkgx-products" className="w-full">
              <TabsList>
                <TabsTrigger value="pkgx-products">
                  <Package className="h-4 w-4 mr-2" />
                  Sản phẩm PKGX ({pkgxProducts.length})
                </TabsTrigger>
                <TabsTrigger value="linked">
                  <Link className="h-4 w-4 mr-2" />
                  Đã liên kết ({linkedCount})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pkgx-products" className="mt-4">
                {/* Warning if not enabled */}
                {!settings?.enabled && (
                  <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 mb-4">
                    <TriangleAlert className="h-4 w-4 flex-shrink-0" />
                    <p>Tích hợp PKGX chưa được bật. Vui lòng bật trong tab "Cấu hình chung".</p>
                  </div>
                )}
                
                {pkgxProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có sản phẩm từ PKGX.</p>
                    <p className="text-sm mt-1">Bấm "Đồng bộ từ PKGX" để lấy danh sách.</p>
                  </div>
                ) : (
                  <ResponsiveDataTable<PkgxProductRow>
                    columns={columns}
                    data={paginatedData}
                    pageCount={pageCount}
                    pagination={pagination}
                    setPagination={setPagination}
                    rowCount={tableData.length}
                    sorting={sorting}
                    setSorting={setSorting}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    renderMobileCard={renderMobileCard}
                    isLoading={isSyncing}
                    bulkActions={bulkActions}
                    allSelectedRows={allSelectedRows}
                    emptyTitle="Không tìm thấy sản phẩm"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="linked" className="mt-4">
                {linkedCount === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có sản phẩm nào được liên kết.</p>
                    <p className="text-sm mt-1">Chọn sản phẩm trong tab "Sản phẩm PKGX" và liên kết với HRM.</p>
                  </div>
                ) : (
                  <ResponsiveDataTable<PkgxProductRow>
                    columns={columns}
                    data={paginatedData.filter(p => p.linkedHrmProduct)}
                    pageCount={Math.ceil(tableData.filter(p => p.linkedHrmProduct).length / pagination.pageSize)}
                    pagination={pagination}
                    setPagination={setPagination}
                    rowCount={tableData.filter(p => p.linkedHrmProduct).length}
                    sorting={sorting}
                    setSorting={setSorting}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    renderMobileCard={renderMobileCard}
                    isLoading={isSyncing}
                    bulkActions={bulkActions}
                    allSelectedRows={allSelectedRows.filter(p => p.linkedHrmProduct)}
                    emptyTitle="Không tìm thấy sản phẩm đã liên kết"
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      {/* Link Dialog - Using shared PkgxMappingDialog component */}
      <PkgxMappingDialog
        open={isLinkDialogOpen}
        onOpenChange={handleCloseLinkDialog}
        type="product"
        hrmItems={hrmProducts
          .filter((p) => !p.pkgxId || (selectedPkgxProduct && p.pkgxId === selectedPkgxProduct.goods_id))
          .map((p) => ({
            id: p.systemId,
            name: p.name,
            subText: p.id,
          }))}
        selectedHrmId={selectedHrmProductId}
        onSelectHrmId={setSelectedHrmProductId}
        pkgxItems={pkgxProducts.map((p) => ({
          id: p.goods_id.toString(),
          name: p.goods_name,
          subText: `ID: ${p.goods_id}`,
        }))}
        selectedPkgxId={selectedPkgxProduct?.goods_id.toString() || ''}
        onSelectPkgxId={(id) => {
          const pkgx = pkgxProducts.find(p => p.goods_id.toString() === id);
          if (pkgx) {
            setSelectedPkgxProduct(pkgx);
            validation.updateSuggestions(pkgx);
          }
        }}
        pkgxSuggestions={validation.suggestions.map(s => ({
          item: { id: s.product.systemId, name: s.product.name, subText: s.product.id },
          score: s.score,
          matchType: s.matchType,
        }))}
        validation={validation.validationResult}
        hasErrors={validation.hasErrors}
        isValidating={validation.isValidating}
        showWarningConfirm={showWarningConfirm}
        onConfirm={handleConfirmLink}
        onCancel={handleCloseLinkDialog}
      />
      
      {/* Unlink Dialog - Using extracted component */}
      <UnlinkDialog
        open={isUnlinkDialogOpen}
        onOpenChange={setIsUnlinkDialogOpen}
        productToUnlink={productToUnlink}
        onConfirmUnlink={handleConfirmUnlink}
      />
      
      {/* Push Dialog - Using extracted component */}
      <PushSyncDialog
        open={isPushDialogOpen}
        onOpenChange={setIsPushDialogOpen}
        product={productToPush}
        selectedFields={selectedPushFields}
        isPushing={isPushingProduct}
        onToggleField={handleTogglePushField}
        onSelectAll={handleSelectAllPushFields}
        onPush={handleConfirmPush}
      />
      
      {/* Product Detail Dialog - Using extracted component */}
      <ProductDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        product={selectedProductForDetail}
        galleryImages={galleryImages}
        isLoadingGallery={isLoadingGallery}
        onViewOnPkgx={handleViewOnPkgx}
        onOpenUnlinkDialog={handleOpenUnlinkDialog}
        buildPkgxImageUrl={buildPkgxImageUrl}
      />
      
      {/* Bulk Unlink Confirm Dialog - Using extracted component */}
      <BulkUnlinkDialog
        open={isBulkUnlinkDialogOpen}
        onOpenChange={setIsBulkUnlinkDialogOpen}
        selectedCount={selectedLinkedProducts.length}
        onConfirmBulkUnlink={handleConfirmBulkUnlink}
      />
      
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
