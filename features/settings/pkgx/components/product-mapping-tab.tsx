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
import { Search, Link, RefreshCw, Loader2, CheckCircle2, TriangleAlert, Package, ExternalLink, Unlink, Link2, MoreHorizontal, FileText, DollarSign, AlignLeft, Tag, Download, Plus } from 'lucide-react';
import { Progress } from '../../../../components/ui/progress';
import { toast } from 'sonner';
import { useAllProducts } from '../../../products/hooks/use-all-products';
import { useProductMutations } from '../../../products/hooks/use-products';
import { usePkgxSettings, usePkgxLogMutations, usePkgxProductsMutations, usePkgxGetters, usePkgxProductsCache, usePkgxProductsPaginated } from '../hooks/use-pkgx-settings';
import { getProducts as fetchPkgxProducts, updateProduct as updatePkgxProduct, getProductById as fetchPkgxProductById, getProductGallery as fetchPkgxGallery } from '../../../../lib/pkgx/api-service';
import type { PkgxProduct, PkgxGalleryImage } from '../types';
import type { SystemId } from '../../../../lib/id-types';
import { ResponsiveDataTable } from '../../../../components/data-table/responsive-data-table';
import { useAuth } from '../../../../contexts/auth-context';
import { productKeys } from '../../../products/hooks/use-products';
import { useQueryClient, useQuery } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  
  // Stores
  const { data: settings } = usePkgxSettings();
  const { addLog } = usePkgxLogMutations();
  const { setPkgxProducts } = usePkgxProductsMutations();
  const { getPkgxCatIdByHrmCategory, getPkgxBrandIdByHrmBrand, getCategoryMappingByPkgxId: _getCategoryMappingByPkgxId, getBrandMappingByPkgxId: _getBrandMappingByPkgxId } = usePkgxGetters();
  const { data: allProductsData } = useAllProducts();
  const { update: updateProductMutation } = useProductMutations({});
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isSyncPaused, setIsSyncPaused] = React.useState(false);
  const [syncProgress, setSyncProgress] = React.useState({ current: 0, total: 0, saved: 0, phase: '' });
  const syncPauseRef = React.useRef(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [importProgress, setImportProgress] = React.useState({ current: 0, total: 0, currentName: '' });
  const pauseRef = React.useRef(false);
  
  // PKGX products pagination state for server-side pagination
  const [pkgxPagination, setPkgxPagination] = React.useState({ page: 1, limit: 20 });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');
  
  // Debounce search term for API calls
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Reset to page 1 when search changes
      setPkgxPagination(prev => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Use React Query with server-side pagination for display
  const { data: pkgxPaginatedData, isLoading: isLoadingPkgxPaginated } = usePkgxProductsPaginated({
    page: pkgxPagination.page,
    limit: pkgxPagination.limit,
    search: debouncedSearchTerm,
  });
  
  // Full cache is still needed for import/sync operations (needs all products)
  const { data: pkgxProductsCache, isLoading: isLoadingCache, error: cacheError } = usePkgxProductsCache();
  
  // Debug logging
  React.useEffect(() => {
    console.log('[ProductMappingTab] Cache state:', {
      isLoading: isLoadingCache,
      error: cacheError,
      productsCount: pkgxProductsCache?.products?.length || 0,
    });
    console.log('[ProductMappingTab] Paginated state:', {
      isLoading: isLoadingPkgxPaginated,
      productsCount: pkgxPaginatedData?.products?.length || 0,
      total: pkgxPaginatedData?.total || 0,
    });
  }, [pkgxProductsCache, isLoadingCache, cacheError, pkgxPaginatedData, isLoadingPkgxPaginated]);
  
  // Local state for PKGX products (synced from cache or fresh fetch)
  const [pkgxProductsLocal, setPkgxProductsLocal] = React.useState<PkgxProduct[]>([]);
  
  // Sync local state with cache when cache updates
  React.useEffect(() => {
    if (pkgxProductsCache?.products && pkgxProductsCache.products.length > 0) {
      console.log('[ProductMappingTab] Syncing from cache:', pkgxProductsCache.products.length, 'products');
      setPkgxProductsLocal(pkgxProductsCache.products);
    }
  }, [pkgxProductsCache?.products]);
  
  // Use cached products or local state (for import/sync which need full list)
  const pkgxProducts = pkgxProductsLocal;
  
  // For display: use paginated data (memoized to avoid dependency warnings)
  const pkgxProductsForDisplay = React.useMemo(() => 
    pkgxPaginatedData?.products || [], 
    [pkgxPaginatedData?.products]
  );
  const pkgxTotalCount = pkgxPaginatedData?.total ?? pkgxProducts.length;
  
  // Fetch linked products from API with server-side pagination
  const [_linkedSearchTerm, _setLinkedSearchTerm] = React.useState('');
  const [linkedApiPagination, setLinkedApiPagination] = React.useState({ page: 1, limit: 20 });
  
  const { data: linkedProductsData, isLoading: isLoadingLinked, refetch: refetchLinkedProducts } = useQuery({
    queryKey: ['products-linked', linkedApiPagination.page, linkedApiPagination.limit, _linkedSearchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(linkedApiPagination.page),
        limit: String(linkedApiPagination.limit),
      });
      if (_linkedSearchTerm) params.set('search', _linkedSearchTerm);
      
      const response = await fetch(`/api/products/linked?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json() as Promise<{
        data: Array<{
          systemId: string;
          id: string;
          name: string;
          pkgxId: number;
          costPrice: number;
          thumbnailImage: string | null;
          inventoryByBranch: Record<string, number> | null;
          description?: string;
          shortDescription?: string;
          seoDescription?: string;
          seoKeywords?: string;
          ktitle?: string;
          sellerNote?: string;
        }>;
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>;
    },
    staleTime: 30 * 1000,
  });
  
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
  
  // Check price mappings
  const [priceMappingsCount, setPriceMappingsCount] = React.useState(0);
  const [hasPriceMappings, setHasPriceMappings] = React.useState(false);
  
  // Fetch actual product stats from API (accurate count of linked products)
  const { data: productStats, refetch: refetchProductStats } = useQuery({
    queryKey: ['product-stats'],
    queryFn: async () => {
      const response = await fetch('/api/products/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json() as Promise<{ total: number; linked: number; unlinked: number }>;
    },
    staleTime: 0, // Always refetch when invalidated
    refetchOnWindowFocus: false,
  });
  
  // Fetch PKGX mapping data (pkgxId -> HRM product) for ALL linked products
  // This is separate from paginated hrmProducts to ensure correct mapping lookup
  type PkgxMappingData = Record<number, { systemId: string; id: string; name: string; status: string }>;
  const { data: pkgxMappingData, refetch: refetchPkgxMapping } = useQuery({
    queryKey: ['pkgx-mapping'],
    queryFn: async () => {
      const response = await fetch('/api/products/pkgx-mapping');
      if (!response.ok) throw new Error('Failed to fetch PKGX mapping');
      const result = await response.json();
      return result.data as PkgxMappingData;
    },
    staleTime: 0, // Always refetch when invalidated
    refetchOnWindowFocus: false,
  });
  
  // HRM products - sử dụng allProductsData trực tiếp để đảm bảo reactive
  const hrmProducts = React.useMemo(
    () => (allProductsData ?? []).filter(p => !p.isDeleted).sort((a, b) => a.name.localeCompare(b.name)),
    [allProductsData]
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
  
  // Count of linked HRM products - use API stats for accurate count
  // Fallback to local count if API not loaded yet
  const linkedCount = productStats?.linked ?? hrmProducts.filter((p) => p.pkgxId).length;
  
  // Find HRM product linked to a PKGX product - returns full Product from local cache
  // For displaying product info in the table (limited to 500 products in cache)
  const findLinkedHrmProduct = React.useCallback((pkgxId: number) => {
    // First try to find in local hrmProducts (has full Product data)
    const localProduct = hrmProducts.find((p) => p.pkgxId == pkgxId);
    if (localProduct) return localProduct;
    
    // If not in local cache but exists in mapping data, return minimal info
    if (pkgxMappingData && pkgxMappingData[pkgxId]) {
      const mapping = pkgxMappingData[pkgxId];
      return {
        systemId: mapping.systemId,
        id: mapping.id,
        name: mapping.name,
        status: mapping.status,
        pkgxId,
      };
    }
    
    return undefined;
  }, [hrmProducts, pkgxMappingData]);
  
  // Check if a PKGX product is linked - uses API mapping data for accurate check
  // This is used for Import logic where we need to check ALL linked products, not just 500
  const _isProductLinked = React.useCallback((pkgxId: number): boolean => {
    // Primary: Check in API mapping data (contains ALL linked products)
    if (pkgxMappingData && pkgxMappingData[pkgxId]) return true;
    // Fallback: Check in local hrmProducts
    return hrmProducts.some((p) => p.pkgxId == pkgxId);
  }, [pkgxMappingData, hrmProducts]);
  
  // Filter and transform PKGX products for display (server-side pagination)
  // Note: search is already handled by server via debouncedSearchTerm
  const tableData = React.useMemo((): PkgxProductRow[] => {
    // Use server-paginated data for display
    const productsToDisplay = pkgxProductsForDisplay;
    
    return productsToDisplay.map((p) => {
      const linked = findLinkedHrmProduct(p.goods_id);
      // Check if linked is a full Product or minimal mapping info
      const isFullProduct = linked && 'inventoryByBranch' in linked;
      // Calculate total inventory from all branches (only if full product)
      const totalInventory = isFullProduct 
        ? Object.values((linked as { inventoryByBranch?: Record<string, number> }).inventoryByBranch || {}).reduce((sum: number, qty: number) => sum + qty, 0)
        : 0;
      
      return {
        ...p,
        linkedHrmProduct: linked ? {
          systemId: linked.systemId as SystemId,
          name: linked.name,
          id: linked.id,
          // Giá cả - only available for full Product
          costPrice: isFullProduct ? (linked as { costPrice?: number }).costPrice : undefined,
          partnerPrice: isFullProduct ? (linked as { partnerPrice?: number }).partnerPrice : undefined,
          acePrice: isFullProduct ? (linked as { acePrice?: number }).acePrice : undefined,
          dealPrice: isFullProduct ? (linked as { dealPrice?: number }).dealPrice : undefined,
          // Tồn kho
          quantity: totalInventory,
          // Nội dung - only available for full Product
          description: isFullProduct ? (linked as { description?: string }).description : undefined,
          shortDescription: isFullProduct ? (linked as { shortDescription?: string }).shortDescription : undefined,
          // SEO - only available for full Product
          seoDescription: isFullProduct ? (linked as { seoDescription?: string }).seoDescription : undefined,
          seoKeywords: isFullProduct ? (linked as { seoKeywords?: string }).seoKeywords : undefined,
          ktitle: isFullProduct ? (linked as { ktitle?: string }).ktitle : undefined,
          // Phân loại - only available for full Product
          categorySystemId: isFullProduct ? (linked as { categorySystemId?: SystemId }).categorySystemId : undefined,
          brandSystemId: isFullProduct ? (linked as { brandSystemId?: SystemId }).brandSystemId : undefined,
          // Trạng thái - only available for full Product
          isBest: isFullProduct ? (linked as { isBest?: boolean }).isBest : undefined,
          isHot: isFullProduct ? (linked as { isHot?: boolean }).isHot : undefined,
          isNew: isFullProduct ? (linked as { isNew?: boolean }).isNew : undefined,
          isHome: isFullProduct ? (linked as { isHome?: boolean }).isHome : undefined,
          // Khác - only available for full Product
          sellerNote: isFullProduct ? (linked as { sellerNote?: string }).sellerNote : undefined,
        } : undefined,
        // Required by ResponsiveDataTable
        systemId: p.goods_id.toString(),
      };
    });
  }, [pkgxProductsForDisplay, findLinkedHrmProduct]);
  
  // Sorting state for table
  const [linkedPagination, setLinkedPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'goods_id', desc: true });
  
  // Data for linked tab - using API data instead of filtering local data
  // Map HRM products to PkgxProductRow format by finding corresponding PKGX product
  const linkedTableData = React.useMemo((): PkgxProductRow[] => {
    console.log('[LinkedTab] linkedProductsData:', linkedProductsData);
    console.log('[LinkedTab] linkedProductsData?.data:', linkedProductsData?.data);
    console.log('[LinkedTab] linkedProductsData?.data?.length:', linkedProductsData?.data?.length);
    
    if (!linkedProductsData?.data || linkedProductsData.data.length === 0) {
      console.log('[LinkedTab] No data, returning empty array');
      return [];
    }
    
    return linkedProductsData.data.map(hrmProd => {
      // Find corresponding PKGX product
      const pkgxProd = pkgxProducts.find(p => p.goods_id === hrmProd.pkgxId);
      
      // Calculate total inventory
      const totalInventory = hrmProd.inventoryByBranch 
        ? Object.values(hrmProd.inventoryByBranch).reduce((sum, qty) => sum + qty, 0)
        : 0;
      
      // Build row - use PKGX product as base if found, otherwise create minimal
      const baseProduct = pkgxProd || {
        goods_id: hrmProd.pkgxId,
        goods_name: hrmProd.name,
        goods_sn: hrmProd.id,
        goods_number: 0,
        shop_price: 0,
        market_price: 0,
        partner_price: 0,
        ace_price: 0,
        deal_price: 0,
        is_on_sale: true,
        is_alone_sale: true,
        is_delete: false,
        is_best: false,
        is_new: false,
        is_hot: false,
        is_home: false,
        is_promote: false,
        sort_order: 0,
        add_time: 0,
        last_update: 0,
      };
      
      return {
        ...baseProduct,
        // Override with PKGX data if available
        goods_img: pkgxProd?.goods_img,
        cat_id: pkgxProd?.cat_id,
        brand_id: pkgxProd?.brand_id,
        // Linked HRM product
        linkedHrmProduct: {
          systemId: hrmProd.systemId,
          name: hrmProd.name,
          id: hrmProd.id,
          costPrice: hrmProd.costPrice,
          quantity: totalInventory,
          description: hrmProd.description,
          shortDescription: hrmProd.shortDescription,
          seoDescription: hrmProd.seoDescription,
          seoKeywords: hrmProd.seoKeywords,
          ktitle: hrmProd.ktitle,
          sellerNote: hrmProd.sellerNote,
        },
        // Required by ResponsiveDataTable
        systemId: hrmProd.pkgxId.toString(),
      } as PkgxProductRow;
    });
  }, [linkedProductsData, pkgxProducts]);
  
  // PKGX tab - server-side pagination, data already paginated from API
  // pageCount calculated from API total
  const pkgxPageCount = pkgxPaginatedData?.totalPages || 1;
  const paginatedData = tableData; // Already server-paginated data
  
  // Paginated data for Linked tab - data is already paginated from API
  const linkedPageCount = linkedProductsData?.pagination?.totalPages || 1;
  const linkedPaginatedData = linkedTableData; // Already paginated from API
  
  // PKGX pagination adapter - convert from {page, limit} to {pageIndex, pageSize} for ResponsiveDataTable
  const pagination = React.useMemo(() => ({
    pageIndex: pkgxPagination.page - 1, // API is 1-based, table is 0-based
    pageSize: pkgxPagination.limit,
  }), [pkgxPagination]);
  
  const setPagination = React.useCallback((updater: { pageIndex: number; pageSize: number } | ((prev: { pageIndex: number; pageSize: number }) => { pageIndex: number; pageSize: number })) => {
    if (typeof updater === 'function') {
      setPkgxPagination(prev => {
        const newVal = updater({ pageIndex: prev.page - 1, pageSize: prev.limit });
        return { page: newVal.pageIndex + 1, limit: newVal.pageSize };
      });
    } else {
      setPkgxPagination({ page: updater.pageIndex + 1, limit: updater.pageSize });
    }
  }, []);
  
  // Check price mappings from settings (not separate API)
  React.useEffect(() => {
    if (settings?.priceMapping) {
      const pm = settings.priceMapping;
      // Count how many price types are mapped
      const mappedCount = [
        pm.shopPrice,
        pm.marketPrice,
        pm.partnerPrice,
        pm.acePrice,
        pm.dealPrice
      ].filter(Boolean).length;
      
      setPriceMappingsCount(mappedCount);
      // Cần có đủ 5 loại giá mapping
      setHasPriceMappings(mappedCount >= 5);
    }
  }, [settings?.priceMapping]);
  
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
        <span className="text-sm text-muted-foreground">{row.goods_id}</span>
      ),
      meta: { displayName: 'ID' },
    },
    {
      id: 'goods_sn',
      accessorKey: 'goods_sn',
      header: 'Mã SP',
      size: 100,
      cell: ({ row }) => (
        <span className="text-xs truncate block max-w-22.5" title={row.goods_sn || '-'}>
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
            className="text-sm truncate block max-w-47.5 text-left hover:text-primary hover:underline cursor-pointer transition-colors" 
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
  
  const handleOpenLinkDialog = React.useCallback((pkgxProduct?: PkgxProduct) => {
    if (pkgxProduct) {
      setSelectedPkgxProduct(pkgxProduct);
      // Auto-suggest matching products
      validation.updateSuggestions(pkgxProduct);
      // Try to find exact match by SKU first, then by name
      const matchedProduct = hrmProducts.find(
        (p) => p.id === pkgxProduct.goods_sn || p.name === pkgxProduct.goods_name
      );
      setSelectedHrmProductId(matchedProduct?.systemId || '');
    } else {
      // Opening dialog without preselected product
      setSelectedPkgxProduct(null);
      setSelectedHrmProductId('');
      validation.clearValidation(); // Clear suggestions when no product selected
    }
    setShowWarningConfirm(false);
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
        updateProductMutation.mutate({ systemId: product.linkedHrmProduct.systemId as SystemId, pkgxId: undefined });
        successCount++;
      }
    });
    
    setIsBulkUnlinkDialogOpen(false);
    setRowSelection({});
    toast.success(`Đã hủy liên kết ${successCount} sản phẩm`);
    
    // Refresh stats, linked products and mapping cache after bulk unlink
    refetchProductStats();
    refetchLinkedProducts();
    refetchPkgxMapping();
    
    addLog.mutate({
      action: 'batch_unlink',
      status: 'success',
      message: `Đã hủy liên kết ${successCount} sản phẩm`,
      details: { total: successCount },
    });
  }, [selectedLinkedProducts, updateProductMutation, addLog, refetchProductStats, refetchLinkedProducts, refetchPkgxMapping]);
  
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
  
  // Sync products from PKGX (fetch ALL products)
  const handleSyncFromPkgx = async () => {
    if (!settings) {
      toast.error('Không thể tải cấu hình PKGX');
      return;
    }
    
    setIsSyncing(true);
    setIsSyncPaused(false);
    syncPauseRef.current = false;
    setSyncProgress({ current: 0, total: 0, saved: 0, phase: 'Đang kết nối PKGX...' });
    const startTime = Date.now();
    try {
      // Fetch all products with pagination
      const allProducts: typeof pkgxProducts = [];
      let currentPage = 1;
      const pageSize = 500; // Fetch 500 per request for efficiency
      let totalItems = 0;
      
      // First request to get total
      setSyncProgress({ current: 0, total: 0, saved: 0, phase: 'Đang lấy thông tin từ PKGX...' });
      const firstResponse = await fetchPkgxProducts(1, pageSize, settings);
      if (!firstResponse.success || !firstResponse.data || firstResponse.data.error) {
        throw new Error(firstResponse.error || 'Không thể lấy danh sách sản phẩm');
      }
      
      allProducts.push(...firstResponse.data.data);
      totalItems = firstResponse.data.pagination.total_items;
      const totalPages = Math.ceil(totalItems / pageSize);
      
      setSyncProgress({ current: allProducts.length, total: totalItems, saved: 0, phase: `Đang tải (trang 1/${totalPages})...` });
      
      // Fetch remaining pages
      for (currentPage = 2; currentPage <= totalPages; currentPage++) {
        const response = await fetchPkgxProducts(currentPage, pageSize, settings);
        if (response.success && response.data && !response.data.error) {
          allProducts.push(...response.data.data);
          setSyncProgress(prev => ({ 
            ...prev,
            current: allProducts.length, 
            total: totalItems, 
            phase: `Đang tải (trang ${currentPage}/${totalPages})...` 
          }));
        }
      }
      
      // FIX: Dedupe products by goods_id (API có thể trả duplicate giữa các trang)
      setSyncProgress(prev => ({ ...prev, phase: 'Đang xử lý dữ liệu...' }));
      const seenIds = new Set<number>();
      const uniqueProducts = allProducts.filter(p => {
        if (seenIds.has(p.goods_id)) {
          console.warn(`[Sync] Duplicate product from PKGX: ${p.goods_id} - ${p.goods_name}`);
          return false;
        }
        seenIds.add(p.goods_id);
        return true;
      });
      
      if (uniqueProducts.length !== allProducts.length) {
        console.log(`[Sync] Removed ${allProducts.length - uniqueProducts.length} duplicate products`);
      }
      
      // Save products in batches to show progress and allow pause
      const SAVE_BATCH_SIZE = 100;
      const totalBatches = Math.ceil(uniqueProducts.length / SAVE_BATCH_SIZE);
      let savedCount = 0;
      const savedProducts: typeof pkgxProducts = [];
      
      for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
        // Check for pause
        while (syncPauseRef.current) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const batchStart = batchIdx * SAVE_BATCH_SIZE;
        const batchProducts = uniqueProducts.slice(batchStart, batchStart + SAVE_BATCH_SIZE);
        
        setSyncProgress({
          current: uniqueProducts.length,
          total: uniqueProducts.length,
          saved: savedCount,
          phase: `Đang lưu (${batchIdx + 1}/${totalBatches})...`
        });
        
        try {
          // Transform to API format
          const apiProducts = batchProducts.map(p => ({
            id: p.goods_id,
            goodsSn: p.goods_sn,
            goodsNumber: p.goods_number,
            name: p.goods_name || `Product ${p.goods_id}`,
            catId: p.cat_id,
            catName: p.cat_name,
            brandId: p.brand_id,
            brandName: p.brand_name,
            shopPrice: p.shop_price ? parseFloat(String(p.shop_price)) : null,
            marketPrice: p.market_price ? parseFloat(String(p.market_price)) : null,
            partnerPrice: p.partner_price ? parseFloat(String(p.partner_price)) : null,
            acePrice: p.ace_price ? parseFloat(String(p.ace_price)) : null,
            dealPrice: p.deal_price ? parseFloat(String(p.deal_price)) : null,
            goodsNumber2: p.goods_number2,
            goodsWeight: p.goods_weight ? parseFloat(String(p.goods_weight)) : null,
            goodsQuantity: p.goods_quantity,
            warnNumber: p.warn_number,
            goodsThumb: p.goods_thumb,
            originalImg: p.original_img,
            goodsBrief: p.goods_brief,
            goodsDesc: p.goods_desc,
            isBest: p.is_best,
            isNew: p.is_new,
            isHot: p.is_hot,
            isHome: p.is_home,
            isOnsale: p.is_onsale,
            isReal: p.is_real,
            keywords: p.keywords,
            ktitle: p.ktitle,
            goodsAlias: p.goods_alias,
            lastUpdate: p.last_update,
          }));
          
          const res = await fetch('/api/settings/pkgx/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: apiProducts }),
          });
          const json = await res.json();
          
          // API returns { synced, total, message } on success, or { error } on failure
          if (res.ok && json.synced !== undefined) {
            savedCount += batchProducts.length;
            savedProducts.push(...batchProducts);
            
            // Update local state immediately so user sees data
            setPkgxProductsLocal([...savedProducts]);
            
            setSyncProgress({
              current: uniqueProducts.length,
              total: uniqueProducts.length,
              saved: savedCount,
              phase: `Đang lưu (${batchIdx + 1}/${totalBatches})...`
            });
          } else {
            console.error('[Sync] Batch save failed:', json.error || json.message || JSON.stringify(json));
            // Still count as processed to continue with other batches
            savedCount += batchProducts.length;
            savedProducts.push(...batchProducts);
          }
        } catch (batchError) {
          console.error('[Sync] Batch save error:', batchError);
        }
      }
      
      // Invalidate query to refresh from database
      queryClient.invalidateQueries({ queryKey: ['pkgx', 'products'] });
      // Refresh product stats, linked products and mapping cache to update counts
      refetchProductStats();
      refetchLinkedProducts();
      refetchPkgxMapping();
      
      setSyncProgress({
        current: uniqueProducts.length,
        total: uniqueProducts.length,
        saved: savedCount,
        phase: 'Hoàn thành! ✓'
      });
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
      
      addLog.mutate({
        action: 'get_products',
        status: 'success',
        message: `Đã lấy ${uniqueProducts.length}/${totalItems} sản phẩm từ PKGX${uniqueProducts.length !== allProducts.length ? ` (loại ${allProducts.length - uniqueProducts.length} trùng)` : ''}`,
        details: { 
          total: totalItems,
          responseTime: Date.now() - startTime,
        },
      });
      toast.success(`Đã lấy ${uniqueProducts.length}/${totalItems} sản phẩm từ PKGX`);
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
      setIsSyncPaused(false);
      // Reset progress sau 2 giây để user thấy "Hoàn thành!"
      setTimeout(() => setSyncProgress({ current: 0, total: 0, saved: 0, phase: '' }), 2000);
    }
  };
  
  // Pause/Resume sync
  const handlePauseSync = () => {
    syncPauseRef.current = true;
    setIsSyncPaused(true);
  };
  
  const handleResumeSync = () => {
    syncPauseRef.current = false;
    setIsSyncPaused(false);
  };
  
  // Ref to prevent double import
  const importingRef = React.useRef(false);
  // Counter to track invocations
  const importCallIdRef = React.useRef(0);
  
  // Import products from PKGX to HRM and auto-mapping
  const handleImportAndMap = async () => {
    const callId = ++importCallIdRef.current;
    console.log(`[Import #${callId}] handleImportAndMap called, importingRef=${importingRef.current}, isImporting=${isImporting}`);
    
    // Prevent double execution (React StrictMode or double click)
    if (importingRef.current || isImporting) {
      console.log(`[Import #${callId}] Already running, skip duplicate call`);
      return;
    }
    importingRef.current = true;
    console.log(`[Import #${callId}] Starting import...`);
    
    // ✅ Force refetch HRM products từ DB để có data mới nhất
    // Điều này đảm bảo sau khi F5 hoặc pause/resume, ta có danh sách sản phẩm đã link chính xác
    console.log(`[Import #${callId}] Refetching HRM products from DB...`);
    
    // Query key cho useAllProducts: ['products', 'all'] - lấy tất cả sản phẩm
    const allProductsQueryKey = [...productKeys.all, 'all'];
    await queryClient.invalidateQueries({ queryKey: allProductsQueryKey });
    const refetchResult = await queryClient.refetchQueries({ queryKey: allProductsQueryKey });
    console.log(`[Import #${callId}] Refetch completed, result:`, refetchResult);
    
    // Đợi React Query update xong state - tăng lên 1s để đảm bảo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ✅ Lấy lại danh sách HRM products mới nhất từ cache sau refetch
    // Query data trả về PaginatedResponse<Product>, cần lấy .data
    const freshQueryData = queryClient.getQueryData<typeof allProductsData>(allProductsQueryKey);
    const freshHrmProducts = freshQueryData ?? [];
    const freshHrmProductsList = freshHrmProducts.filter(p => !p.isDeleted);
    
    // Log số lượng sản phẩm có pkgxId để debug
    const alreadyMappedCount = freshHrmProductsList.filter(p => p.pkgxId).length;
    console.log(`[Import #${callId}] Fresh HRM products: ${freshHrmProductsList.length}, Mapped in this batch: ${alreadyMappedCount}`);
    
    // ✅ Refetch pkgxMappingData để có mapping data chính xác cho ALL linked products
    await refetchPkgxMapping();
    // Lấy mapping data mới nhất từ cache
    const freshMappingData = queryClient.getQueryData<{ data: PkgxMappingData }>(['pkgx-mapping']);
    const mappingLookup = freshMappingData?.data ?? pkgxMappingData ?? {};
    const totalMappedCount = Object.keys(mappingLookup).length;
    console.log(`[Import #${callId}] Total mapped products from API: ${totalMappedCount}`);
    
    // Hàm check linked product - dùng pkgxMappingData để có TẤT CẢ linked products (không chỉ 500)
    const checkLinkedProduct = (pkgxId: number) => {
      // Primary: Use API mapping data (contains ALL linked products)
      if (mappingLookup[pkgxId]) return true;
      // Fallback: Check in local list
      return freshHrmProductsList.some((p) => p.pkgxId == pkgxId);
    };
    
    // Get unlinked PKGX products (those without a linked HRM product)
    // FIX: Dedupe by goods_id to prevent importing same product twice
    const seenGoodsIds = new Set<number>();
    const unlinkedProducts = pkgxProducts.filter(pkgxProd => {
      // Skip if already linked - dùng checkLinkedProduct với data mới nhất
      if (checkLinkedProduct(pkgxProd.goods_id)) return false;
      // Skip if we've seen this goods_id before (duplicate in list)
      if (seenGoodsIds.has(pkgxProd.goods_id)) {
        console.warn(`[Import] Duplicate goods_id detected: ${pkgxProd.goods_id} - ${pkgxProd.goods_name}`);
        return false;
      }
      seenGoodsIds.add(pkgxProd.goods_id);
      return true;
    });
    
    console.log(`[Import #${callId}] HRM products count: ${freshHrmProductsList.length}, Unlinked PKGX: ${unlinkedProducts.length}`);
    
    if (unlinkedProducts.length === 0) {
      toast.info('Tất cả sản phẩm PKGX đã được mapping');
      importingRef.current = false;
      return;
    }
    
    // ✅ Set importing state ngay sau khi có danh sách unlinked để hiển thị UI
    setIsImporting(true);
    setIsPaused(false);
    pauseRef.current = false;
    setImportProgress({ current: 0, total: unlinkedProducts.length, currentName: 'Đang chuẩn bị...' });
    
    // ✅ Load mappings trực tiếp từ DB
    // Dùng key dạng string để tránh mismatch số/string khi lấy cat_id/brand_id
    interface CategoryMappingData { pkgxCategoryId: string | number; hrmCategoryId: string; hrmCategoryName: string; }
    interface BrandMappingData { pkgxBrandId: string | number; hrmBrandId: string; hrmBrandName: string; }
    const categoryMappingsCache: Map<string, {hrmCategoryId: string; hrmCategoryName: string}> = new Map();
    const brandMappingsCache: Map<string, {hrmBrandId: string; hrmBrandName: string}> = new Map();
    
    try {
      const [catRes, brandRes] = await Promise.all([
        fetch('/api/settings/pkgx/category-mappings'),
        fetch('/api/settings/pkgx/brand-mappings'),
      ]);
      
      if (catRes.ok) {
        const catData = await catRes.json();
        (catData.data || []).forEach((m: CategoryMappingData) => {
          categoryMappingsCache.set(String(m.pkgxCategoryId), {
            hrmCategoryId: m.hrmCategoryId,
            hrmCategoryName: m.hrmCategoryName,
          });
        });
      }
      
      if (brandRes.ok) {
        const brandData = await brandRes.json();
        (brandData.data || []).forEach((m: BrandMappingData) => {
          brandMappingsCache.set(String(m.pkgxBrandId), {
            hrmBrandId: m.hrmBrandId,
            hrmBrandName: m.hrmBrandName,
          });
        });
      }
      
      console.log('[Import] Loaded mappings:', {
        categories: categoryMappingsCache.size,
        brands: brandMappingsCache.size,
      });
    } catch (err) {
      console.error('[Import] Failed to load mappings:', err);
    }
    
    let successCount = 0;
    let errorCount = 0;
    const errorMessages: string[] = [];
    const REFRESH_BATCH_SIZE = 10; // Refresh UI sau mỗi 10 sản phẩm để linkedCount cập nhật nhanh
    
    try {
      for (let i = 0; i < unlinkedProducts.length; i++) {
        const pkgxProd = unlinkedProducts[i];
        
        // Check for pause
        while (pauseRef.current) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        setImportProgress({ current: i + 1, total: unlinkedProducts.length, currentName: pkgxProd.goods_name });
        try {
          // Map PKGX category to HRM category (dùng cache)
          const categoryMapping = pkgxProd.cat_id ? categoryMappingsCache.get(String(pkgxProd.cat_id)) : null;
          
          // Map PKGX brand to HRM brand (dùng cache)
          const brandMapping = pkgxProd.brand_id ? brandMappingsCache.get(String(pkgxProd.brand_id)) : null;
          
          // DEBUG: Log mappings
          if (i === 0) { // Only log first product
            console.log('[DEBUG Import] First product mappings:');
            console.log('  PKGX brand_id:', pkgxProd.brand_id, '=> HRM:', brandMapping);
            console.log('  PKGX cat_id:', pkgxProd.cat_id, '=> HRM:', categoryMapping);
          }
          
          // Create HRM product via API with FULL data from PKGX
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              // Basic info - id (SKU) = goods_sn from PKGX API (required field)
              // goods_sn is the primary SKU from PKGX, never use fallback PKGX-{id}
              id: pkgxProd.goods_sn,
              name: pkgxProd.goods_name,
              pkgxName: pkgxProd.goods_name,
              pkgxId: Number(pkgxProd.goods_id),
              status: 'ACTIVE',
              type: 'PHYSICAL', // Mặc định là hàng hóa
              unit: 'Cái', // Đơn vị tính mặc định
              
              // Description
              description: pkgxProd.goods_desc || pkgxProd.goods_brief || undefined,
              shortDescription: pkgxProd.goods_brief || undefined,
              
              // Prices - Defaults for PKGX import
              // Giá bán hiển thị: để 0, giá sẽ lấy từ ProductPrice mapping
              sellingPrice: 0,
              // Giá vốn = 0 mặc định khi import từ PKGX
              costPrice: 0,
              minPrice: 0,
              // Giá nhập gần nhất = 0 và ngày nhập = ngày hiện tại
              lastPurchasePrice: 0,
              lastPurchaseDate: new Date().toISOString(),
              
              // Inventory - Không import từ PKGX, HRM là nguồn chính cho tồn kho
              reorderLevel: Number(pkgxProd.warn_number) || 10,
              // NOTE: goods_number không được import vì tồn kho phải quản lý từ HRM
              
              // Weight (khối lượng) - Mặc định 5g (PKGX không có field goods_weight)
              weight: 5,
              weightUnit: 'GRAM',
              
              // Category & Brand (if mapped)
              categoryIds: categoryMapping ? [categoryMapping.hrmCategoryId] : undefined,
              brandId: brandMapping ? brandMapping.hrmBrandId : undefined,
              
              // SEO - Tab chung (SEO Chung)
              seoTitle: pkgxProd.meta_title || pkgxProd.goods_name,
              seoDescription: pkgxProd.meta_desc || pkgxProd.goods_brief || undefined,
              seoKeywords: pkgxProd.keywords || undefined,
              ktitle: pkgxProd.meta_title || pkgxProd.goods_name || undefined,
              
              // SEO - Tab PKGX (nested object) - Full mapping from PKGX data
              seoPkgx: {
                seoTitle: pkgxProd.meta_title || pkgxProd.goods_name || undefined,
                metaDescription: pkgxProd.meta_desc || pkgxProd.goods_brief || undefined,
                seoKeywords: pkgxProd.keywords || undefined,
                shortDescription: pkgxProd.goods_brief || undefined,
                longDescription: pkgxProd.goods_desc || undefined,
              },
              
              // Images - Bao gồm gallery
              imageUrl: buildPkgxImageUrl(pkgxProd.original_img || pkgxProd.goods_img),
              thumbnailImage: buildPkgxImageUrl(pkgxProd.goods_thumb),
              galleryImages: pkgxProd.goods_img ? pkgxProd.goods_img.split(',').map((img: string) => buildPkgxImageUrl(img.trim())).filter(Boolean) : [],
              
              // Display flags - Cài đặt hiển thị website (PKGX trả về 0/1, có thể là string hoặc number)
              isBestSeller: Number(pkgxProd.is_best) === 1,
              isOnSale: Number(pkgxProd.is_on_sale) === 1,
              isNewArrival: Number(pkgxProd.is_new) === 1,
              isFeatured: Number(pkgxProd.is_home) === 1,
              isPublished: Number(pkgxProd.is_on_sale) === 1 || Number(pkgxProd.is_home) === 1, // Hiển thị web
              
              // Dates - Ngày ra mắt và ngày đăng web = ngày import
              launchedDate: new Date().toISOString(),
              publishedAt: new Date().toISOString(),
              
              // Notes
              sellerNote: pkgxProd.seller_note || undefined,
              
              // All PKGX prices for ProductPrice records
              pkgxPrices: {
                shop_price: Number(pkgxProd.shop_price) || 0,
                market_price: Number(pkgxProd.market_price) || 0,
                partner_price: Number(pkgxProd.partner_price) || 0,
                ace_price: Number(pkgxProd.ace_price) || 0,
                deal_price: Number(pkgxProd.deal_price) || 0,
              },
            }),
          });
          
          if (!response.ok) {
            const responseText = await response.text();
            let errorMessage = `HTTP ${response.status}`;
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData?.message || errorData?.error || response.statusText;
            } catch {
              errorMessage = responseText || response.statusText;
            }
            console.error(`[Import Product] API Error for "${pkgxProd.goods_name}":`, response.status, errorMessage);
            throw new Error(errorMessage);
          }
          
          const _newProduct = await response.json();
          
          // Product đã được lưu vào database, React Query sẽ tự động refresh sau khi invalidate
          
          successCount++;
          
          // Refresh UI sau mỗi batch để user thấy data realtime
          if (successCount % REFRESH_BATCH_SIZE === 0) {
            console.log(`[Import #${callId}] Batch ${successCount} completed, refreshing HRM products...`);
            // Dùng đúng query key cho useAllProducts
            await queryClient.invalidateQueries({ queryKey: allProductsQueryKey });
            await queryClient.refetchQueries({ queryKey: allProductsQueryKey });
            // Đợi một chút để React Query update xong
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Lỗi không xác định';
          console.error(`Error importing product ${pkgxProd.goods_name}:`, errorMsg);
          errorMessages.push(`${pkgxProd.goods_name}: ${errorMsg}`);
          errorCount++;
        }
      }
      
      // Invalidate và refetch all queries để refresh UI ngay lập tức
      await queryClient.invalidateQueries({ queryKey: allProductsQueryKey });
      await queryClient.refetchQueries({ queryKey: allProductsQueryKey });
      // Refresh product stats, linked products list and mapping cache - invalidate + refetch
      await queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      await queryClient.invalidateQueries({ queryKey: ['linked-products'] });
      await queryClient.invalidateQueries({ queryKey: ['pkgx-mapping'] });
      await Promise.all([
        refetchProductStats(),
        refetchLinkedProducts(),
        refetchPkgxMapping(),
      ]);
      
      addLog.mutate({
        action: 'get_products',
        status: errorCount > 0 ? 'partial' : 'success',
        message: `Import xong: ${successCount} thành công, ${errorCount} lỗi`,
      });
      
      if (successCount > 0) {
        toast.success(`Đã import & mapping ${successCount} sản phẩm từ PKGX`);
      }
      if (errorCount > 0) {
        const errorSummary = errorMessages.slice(0, 3).join('\n');
        const moreCount = errorMessages.length > 3 ? `\n...và ${errorMessages.length - 3} lỗi khác` : '';
        toast.error(`${errorCount} sản phẩm import thất bại:\n${errorSummary}${moreCount}`, { duration: 8000 });
      }
    } catch (error) {
      toast.error('Lỗi khi import sản phẩm');
      addLog.mutate({
        action: 'get_products',
        status: 'error',
        message: error instanceof Error ? error.message : 'Lỗi khi import sản phẩm',
      });
    } finally {
      setIsImporting(false);
      setIsPaused(false);
      pauseRef.current = false;
      importingRef.current = false; // Reset import guard
      setImportProgress({ current: 0, total: 0, currentName: '' });
    }
  };
  
  // Pause/Resume import
  const handlePauseImport = () => {
    pauseRef.current = true;
    setIsPaused(true);
  };
  
  const handleResumeImport = () => {
    pauseRef.current = false;
    setIsPaused(false);
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
        setPkgxProductsLocal(updatedProducts);
        
        // Also update the selected product for detail if it's open
        if (selectedProductForDetail?.goods_id === goodsId) {
          const linked = findLinkedHrmProduct(goodsId);
          const isFullProduct = linked && 'inventoryByBranch' in linked;
          const totalInventory = isFullProduct 
            ? Object.values((linked as { inventoryByBranch?: Record<string, number> }).inventoryByBranch || {}).reduce((sum: number, qty: number) => sum + qty, 0)
            : 0;
          
          setSelectedProductForDetail({
            ...response.data,
            linkedHrmProduct: linked ? {
              systemId: linked.systemId as SystemId,
              name: linked.name,
              id: linked.id,
              costPrice: isFullProduct ? (linked as { costPrice?: number }).costPrice : undefined,
              partnerPrice: isFullProduct ? (linked as { partnerPrice?: number }).partnerPrice : undefined,
              acePrice: isFullProduct ? (linked as { acePrice?: number }).acePrice : undefined,
              dealPrice: isFullProduct ? (linked as { dealPrice?: number }).dealPrice : undefined,
              quantity: totalInventory,
              description: isFullProduct ? (linked as { description?: string }).description : undefined,
              shortDescription: isFullProduct ? (linked as { shortDescription?: string }).shortDescription : undefined,
              seoDescription: isFullProduct ? (linked as { seoDescription?: string }).seoDescription : undefined,
              seoKeywords: isFullProduct ? (linked as { seoKeywords?: string }).seoKeywords : undefined,
              ktitle: isFullProduct ? (linked as { ktitle?: string }).ktitle : undefined,
              categorySystemId: isFullProduct ? (linked as { categorySystemId?: SystemId }).categorySystemId : undefined,
              brandSystemId: isFullProduct ? (linked as { brandSystemId?: SystemId }).brandSystemId : undefined,
              isBest: isFullProduct ? (linked as { isBest?: boolean }).isBest : undefined,
              isHot: isFullProduct ? (linked as { isHot?: boolean }).isHot : undefined,
              isNew: isFullProduct ? (linked as { isNew?: boolean }).isNew : undefined,
              isHome: isFullProduct ? (linked as { isHome?: boolean }).isHome : undefined,
              sellerNote: isFullProduct ? (linked as { sellerNote?: string }).sellerNote : undefined,
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
    
    updateProductMutation.mutate({ systemId: selectedHrmProductId as SystemId, pkgxId: selectedPkgxProduct.goods_id });
    toast.success(`Đã liên kết "${selectedPkgxProduct.goods_name}" với sản phẩm HRM`);
    
    // Refresh stats, linked products and mapping cache after linking
    refetchProductStats();
    refetchLinkedProducts();
    refetchPkgxMapping();
    
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
      updateProductMutation.mutate({ systemId: productToUnlink.hrmProduct.systemId as SystemId, pkgxId: undefined });
      toast.success(`Đã hủy liên kết sản phẩm`);
      
      // Refresh stats, linked products and mapping cache after unlinking
      refetchProductStats();
      refetchLinkedProducts();
      refetchPkgxMapping();
      
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
            pushData.is_best = hrm.isBest ? 1 : 0;
            break;
          case 'hot':
            pushData.is_hot = hrm.isHot ? 1 : 0;
            break;
          case 'new':
            pushData.is_new = hrm.isNew ? 1 : 0;
            break;
          case 'ishome':
            pushData.is_home = hrm.isHome ? 1 : 0;
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
              <CardTitle size="lg">Sản phẩm đã liên kết</CardTitle>
              <CardDescription>
                Đồng bộ và liên kết sản phẩm PKGX với sản phẩm HRM
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => entitySync.handleConfirm(
                'Đồng bộ danh sách sản phẩm',
                'Bạn có chắc muốn tải lại toàn bộ danh sách sản phẩm từ PKGX? Thao tác này có thể mất vài phút.',
                handleSyncFromPkgx
              )} disabled={isSyncing || isImporting} variant="outline">
                {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Đồng bộ từ PKGX
              </Button>
              <Button onClick={() => entitySync.handleConfirm(
                'Import & Mapping tự động',
                `Bạn có chắc muốn import và tự động mapping ${pkgxProducts.length - linkedCount} sản phẩm chưa liên kết từ PKGX vào HRM?`,
                handleImportAndMap
              )} disabled={isImporting || isSyncing || !hasPriceMappings || (pkgxProducts.length - linkedCount) <= 0} variant="outline">
                {isImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                Import & Mapping
              </Button>
              <Button onClick={() => handleOpenLinkDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm mapping
              </Button>
            </div>
          </div>
          
          {/* Sync Progress Bar */}
          {(isSyncing || syncProgress.phase) && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  {isSyncing && !isSyncPaused && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSyncPaused && <span className="text-yellow-500">⏸</span>}
                  {syncProgress.phase.includes('Hoàn thành') && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {isSyncPaused ? 'Đã tạm dừng...' : syncProgress.phase || 'Đang đồng bộ từ PKGX...'}
                </span>
                <div className="flex items-center gap-2">
                  {syncProgress.saved > 0 && (
                    <span className="font-medium">{syncProgress.saved}/{syncProgress.total}</span>
                  )}
                  {isSyncing && syncProgress.phase.includes('Đang lưu') && (
                    isSyncPaused ? (
                      <Button size="sm" variant="outline" onClick={handleResumeSync}>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Tiếp tục
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={handlePauseSync}>
                        Tạm dừng
                      </Button>
                    )
                  )}
                </div>
              </div>
              {syncProgress.total > 0 && (
                <Progress value={(syncProgress.saved / syncProgress.total) * 100} className="h-2" />
              )}
            </div>
          )}
          
          {/* Import Progress Bar */}
          {isImporting && importProgress.total > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isPaused ? 'Đã tạm dừng...' : 'Đang import sản phẩm...'}
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
                {pkgxTotalCount} SP | {linkedCount} đã liên kết
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
                  Sản phẩm PKGX ({pkgxTotalCount})
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
                    <TriangleAlert className="h-4 w-4 shrink-0" />
                    <p>Tích hợp PKGX chưa được bật. Vui lòng bật trong tab "Cấu hình chung".</p>
                  </div>
                )}
                
                {/* Warning if price mappings not complete */}
                {!hasPriceMappings && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 mb-4">
                    <TriangleAlert className="h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-medium">Chưa cấu hình đầy đủ mapping giá</p>
                      <p className="text-xs mt-1">
                        Cần mapping đủ 5 loại giá (shop_price, market_price, partner_price, ace_price, deal_price) trước khi import sản phẩm.
                        Hiện tại: {priceMappingsCount}/5 loại giá. Vui lòng vào tab "Mapping giá" để cấu hình.
                      </p>
                    </div>
                  </div>
                )}
                
                {pkgxTotalCount === 0 && !isLoadingPkgxPaginated ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có sản phẩm từ PKGX.</p>
                    <p className="text-sm mt-1">Bấm "Đồng bộ từ PKGX" để lấy danh sách.</p>
                  </div>
                ) : (
                  <ResponsiveDataTable<PkgxProductRow>
                    columns={columns}
                    data={paginatedData}
                    pageCount={pkgxPageCount}
                    pagination={pagination}
                    setPagination={setPagination}
                    rowCount={pkgxTotalCount}
                    sorting={sorting}
                    setSorting={setSorting}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    renderMobileCard={renderMobileCard}
                    isLoading={isLoadingPkgxPaginated || (isSyncing && pkgxTotalCount === 0)}
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
                    data={linkedPaginatedData}
                    pageCount={linkedPageCount}
                    pagination={linkedPagination}
                    setPagination={(newPaginationOrFn) => {
                      // Handle both function and object
                      const newPagination = typeof newPaginationOrFn === 'function' 
                        ? newPaginationOrFn(linkedPagination)
                        : newPaginationOrFn;
                      setLinkedPagination(newPagination);
                      // Sync with API pagination
                      setLinkedApiPagination(prev => ({
                        ...prev,
                        page: newPagination.pageIndex + 1,
                        limit: newPagination.pageSize,
                      }));
                    }}
                    rowCount={linkedProductsData?.pagination?.total || linkedCount}
                    sorting={sorting}
                    setSorting={setSorting}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    renderMobileCard={renderMobileCard}
                    isLoading={isLoadingLinked || (isSyncing && linkedCount === 0)}
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
        selectedPkgxId={selectedPkgxProduct?.goods_id?.toString() ?? ''}
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
