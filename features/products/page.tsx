'use client'

import * as React from "react"
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useProductStore } from "./store"
import { useProductCategoryStore } from "../settings/inventory/product-category-store"
import { useAllBranches } from "../settings/branches/hooks/use-all-branches"
import { useBrandStore } from "../settings/inventory/brand-store"
import { usePricingPolicyStore } from "../settings/pricing/store"
import { usePkgxSettingsStore } from "../settings/pkgx/store"
import { usePkgxBulkSync } from "../settings/pkgx/hooks/use-pkgx-bulk-sync"
import type { PkgxProductPayload } from "../settings/pkgx/types"
import { usePkgxSync } from "./hooks/use-pkgx-sync"
import { useAuth } from "../../contexts/auth-context"
import { asSystemId } from '../../lib/id-types';
import { getColumns } from "./columns"
import { usePrint } from '@/lib/use-print';
import { 
  mapProductToLabelPrintData,
  createStoreSettings,
} from '@/lib/print/product-print-helper';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table"
import { PageFilters } from "../../components/layout/page-filters";
import { PageToolbar } from "../../components/layout/page-toolbar";
import { normalizeFieldKey, type BranchInventoryIdentifier } from "./product-importer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import type { Product } from "@/lib/types/prisma-extended"
import { Button } from "../../components/ui/button"
import { PlusCircle } from "lucide-react"
import { useProductsQuery } from "./hooks/use-products-query";
import { DEFAULT_PRODUCT_SORT, getFilteredProductsSnapshot, type ProductQueryParams, type ProductQueryResult } from "./product-service";
import { usePersistentState } from "../../hooks/use-persistent-state";
import { usePageHeader } from "../../contexts/page-header-context";

// ✅ Dynamic imports for heavy dialog components - loaded only when needed
const PkgxBulkSyncConfirmDialog = dynamic(
  () => import("../settings/pkgx/components/pkgx-bulk-sync-confirm-dialog").then(mod => ({ default: mod.PkgxBulkSyncConfirmDialog })),
  { ssr: false }
);
const PkgxLinkDialog = dynamic(
  () => import("./components/pkgx-link-dialog").then(mod => ({ default: mod.PkgxLinkDialog })),
  { ssr: false }
);

// ✅ Dynamic imports for Import/Export dialogs - lazy loads XLSX library (~500KB) + config (1211 lines)
const ProductImportDialog = dynamic(
  () => import("./components/product-import-export-dialogs").then(mod => ({ default: mod.ProductImportDialog })),
  { ssr: false }
);
const ProductExportDialog = dynamic(
  () => import("./components/product-import-export-dialogs").then(mod => ({ default: mod.ProductExportDialog })),
  { ssr: false }
);

import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle";
import { useMediaQuery } from "../../lib/use-media-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { Package, Settings2, SlidersHorizontal, Columns3, Layers, FileUp, Download } from "lucide-react";
import { useColumnVisibility } from '../../hooks/use-column-visibility';
import { toast } from "sonner";
import { formatDate } from '@/lib/date-utils';

// ✅ Extracted components
import { MobileProductCard } from "./components/mobile-product-card";
import { ProductFilterControls } from "./components/product-filter-controls";
import { createBulkActions, createPkgxBulkActions } from "./components/product-bulk-actions";
import { useTableStateHandlers, TABLE_STATE_STORAGE_KEY, MOBILE_ROW_HEIGHT, MOBILE_LIST_HEIGHT } from "./hooks/use-table-state-handlers";
import { useProductImportHandler } from "./hooks/use-product-import-handler";


const defaultTableState: ProductQueryParams = {
  search: '',
  statusFilter: 'all',
  typeFilter: 'all',
  categoryFilter: 'all',
  comboFilter: 'all',
  stockLevelFilter: 'all',
  pkgxFilter: 'all',
  dateRange: undefined,
  pagination: { pageIndex: 0, pageSize: 20 },
  sorting: DEFAULT_PRODUCT_SORT,
};

export function ProductsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const queryClient = useQueryClient();
  const { data: productsRaw, remove, restore, getDeleted, addMultiple: _addMultiple, add, update } = useProductStore();
  const categories = useProductCategoryStore(state => state.data);
  const activeCategories = React.useMemo(
    () => categories.filter(category => !category.isDeleted && category.isActive !== false),
    [categories]
  );
  const { data: branches } = useAllBranches();
  const { employee: authEmployee } = useAuth();
  const router = useRouter();

  const _defaultBranchSystemId = React.useMemo(() => {
    return branches.find(branch => branch.isDefault)?.systemId ?? branches[0]?.systemId ?? null;
  }, [branches]);

  const _branchInventoryIdentifiers = React.useMemo<BranchInventoryIdentifier[]>(() => {
    return branches.map(branch => ({
      systemId: branch.systemId,
      identifiers: new Set(
        [branch.systemId, branch.id, branch.name]
          .map(value => normalizeFieldKey(value))
          .filter(Boolean),
      ),
    }));
  }, [branches]);
  
  // ✅ Memoize products để tránh unstable reference
  const products = React.useMemo(() => productsRaw, [productsRaw]);
  
  // ✅ Get deleted count - always recalculate when products change
  const deletedCount = React.useMemo(() => {
    return getDeleted().length;
  }, [getDeleted]);
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null)
  const [isFilterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const [isActionsSheetOpen, setActionsSheetOpen] = React.useState(false);

  // ✅ Memoize headerActions để tránh infinite loop
  const headerActions = React.useMemo(() => {
    const actions = [
      <Button 
        key="trash"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => router.push('/products/trash')}
      >
        <Package className="mr-2 h-4 w-4" />
        Thùng rác ({deletedCount})
      </Button>
    ];

    // Chỉ hiện nút Tùy chọn bảng trên Mobile (vì Desktop đã có toolbar)
    if (isMobile) {
      actions.push(
        <Button
          key="import"
          variant="ghost"
          size="sm"
          className="h-9"
          onClick={() => setActionsSheetOpen(true)}
        >
          <Columns3 className="mr-2 h-4 w-4" />
          Tùy chọn bảng
        </Button>
      );
    }

    actions.push(
      <DropdownMenu key="add-menu">
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="h-9">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push('/products/new')}>
            <Package className="mr-2 h-4 w-4" />
            Thêm sản phẩm đơn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/products/new?type=combo')}>
            <Layers className="mr-2 h-4 w-4" />
            Thêm Combo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    return actions;
  }, [deletedCount, router, setActionsSheetOpen, isMobile]);
  
  usePageHeader({
    title: 'Danh sách sản phẩm',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Sản phẩm', href: '/products', isCurrent: true },
    ],
    actions: headerActions,
    showBackButton: false,
  });
  
  // Table state
  const defaultColumnVisibility = React.useMemo(() => {
    const cols = getColumns(() => {}, () => {}, null as unknown as ReturnType<typeof useRouter>);
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('products', defaultColumnVisibility);

  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [tableState, setTableState] = usePersistentState<ProductQueryParams>(TABLE_STATE_STORAGE_KEY, defaultTableState);

  const handleDelete = React.useCallback((systemId: string) => {
    setIdToDelete(systemId)
    setIsAlertOpen(true)
  }, [])
  
  // ✅ Handle restore cho soft delete
  const handleRestore = React.useCallback((systemId: string) => {
    restore(asSystemId(systemId));
    toast.success('Đã khôi phục sản phẩm');
  }, [restore]);

  // Print hook and store info for single product print action in row dropdown
  const { print: printSingleLabel, printMultiple } = usePrint();
  const storeInfo = useStoreInfoStore(state => state.info);
  const { data: pricingPolicies } = usePricingPolicyStore();
  const defaultSellingPolicy = React.useMemo(
    () => pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault),
    [pricingPolicies]
  );
  const storeSettings = React.useMemo(() => createStoreSettings(storeInfo), [storeInfo]);

  const handlePrintLabel = React.useCallback((product: Product) => {
    const categoryName = product.categorySystemId
      ? useProductCategoryStore.getState().findById(product.categorySystemId)?.name || product.category
      : product.category;
    const brandName = product.brandSystemId
      ? useBrandStore.getState().findById(product.brandSystemId)?.name || ''
      : '';
    const defaultPrice = defaultSellingPolicy
      ? product.prices?.[defaultSellingPolicy.systemId]
      : undefined;
    const printData = mapProductToLabelPrintData(product, storeSettings, {
      category: categoryName,
      brand: brandName,
      price: defaultPrice ?? product.sellingPrice,
    });
    printSingleLabel('product-label', { data: printData });
  }, [printSingleLabel, storeSettings, defaultSellingPolicy]);

  // ===== PKGX Handlers =====
  const { settings: pkgxSettings, addLog: addPkgxLog } = usePkgxSettingsStore();
  
  // Use PKGX sync hook for all sync handlers
  const {
    handlePkgxUpdatePrice: _handlePkgxUpdatePrice,
    handlePkgxSyncInventory: _handlePkgxSyncInventory,
    handlePkgxUpdateSeo: _handlePkgxUpdateSeo,
    handlePkgxSyncDescription: _handlePkgxSyncDescription,
    handlePkgxSyncFlags: _handlePkgxSyncFlags,
    handlePkgxSyncBasicInfo: _handlePkgxSyncBasicInfo,
    handlePkgxSyncImages,
    handlePkgxSyncAll: _handlePkgxSyncAll,
  } = usePkgxSync({ addPkgxLog });
  
  // Bulk sync hook for PKGX operations
  const {
    confirmAction: bulkConfirmAction,
    progress: bulkProgress,
    triggerBulkSync,
    executeAction: executeBulkAction,
    cancelConfirm: cancelBulkConfirm,
  } = usePkgxBulkSync({ entityType: 'product', onLog: addPkgxLog });
  
  // Helper: Build PKGX product payload from HRM product (for Publish)
  const buildPkgxPayload = React.useCallback((product: Product): PkgxProductPayload => {
    // Find mapped category
    const categoryMapping = pkgxSettings.categoryMappings.find(
      m => m.hrmCategorySystemId === product.categorySystemId
    );
    
    // Find mapped brand
    const brand = product.brandSystemId ? useBrandStore.getState().findById(product.brandSystemId) : undefined;
    const brandMapping = brand ? pkgxSettings.brandMappings.find(
      m => m.hrmBrandSystemId === brand.systemId
    ) : undefined;
    
    // Get price from mapping or default
    const { priceMapping } = pkgxSettings;
    
    // Shop price (giá bán)
    let shopPrice = product.costPrice || 0;
    if (priceMapping.shopPrice && product.prices[priceMapping.shopPrice]) {
      shopPrice = product.prices[priceMapping.shopPrice];
    } else if (defaultSellingPolicy) {
      shopPrice = product.prices[defaultSellingPolicy.systemId] || shopPrice;
    }
    
    // Market price (giá thị trường)
    let marketPrice = shopPrice * 1.2; // Default markup
    if (priceMapping.marketPrice && product.prices[priceMapping.marketPrice]) {
      marketPrice = product.prices[priceMapping.marketPrice];
    }
    
    // Partner price (giá đối tác)
    let partnerPrice: number | undefined;
    if (priceMapping.partnerPrice && product.prices[priceMapping.partnerPrice]) {
      partnerPrice = product.prices[priceMapping.partnerPrice];
    }
    
    // ACE price (giá ACE)
    let acePrice: number | undefined;
    if (priceMapping.acePrice && product.prices[priceMapping.acePrice]) {
      acePrice = product.prices[priceMapping.acePrice];
    }
    
    // Deal price (giá khuyến mãi)
    let dealPrice: number | undefined;
    if (priceMapping.dealPrice && product.prices[priceMapping.dealPrice]) {
      dealPrice = product.prices[priceMapping.dealPrice];
    }
    
    // Calculate total inventory
    const totalInventory = product.inventoryByBranch
      ? Object.values(product.inventoryByBranch).reduce((sum, qty) => sum + (qty || 0), 0)
      : 0;
    
    // Get PKGX-specific SEO data (ưu tiên seoPkgx, fallback về field gốc)
    const pkgxSeo = product.seoPkgx;
    
    const payload: PkgxProductPayload = {
      // Thông tin cơ bản (giống handlePkgxSyncBasicInfo)
      goods_name: product.name,
      goods_sn: product.id,
      cat_id: categoryMapping?.pkgxCatId || 0,
      brand_id: brandMapping?.pkgxBrandId || 0,
      seller_note: product.sellerNote || '',
      
      // Giá
      shop_price: shopPrice,
      market_price: marketPrice,
      goods_number: totalInventory,
      
      // Mô tả (giống handlePkgxSyncDescription)
      goods_desc: pkgxSeo?.longDescription || product.description || '',
      goods_brief: pkgxSeo?.shortDescription || product.shortDescription || '',
      
      // SEO (giống handlePkgxUpdateSeo)
      keywords: pkgxSeo?.seoKeywords || product.tags?.join(', ') || product.name,
      meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
      meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
      
      // Hình ảnh
      original_img: product.thumbnailImage || product.images?.[0] || '',
      gallery_images: product.galleryImages || product.images || [],
      
      // Flags - mapping đúng theo HRM fields
      // HRM isPublished (Đăng web) -> PKGX is_on_sale
      // HRM isFeatured (Nổi bật) -> PKGX is_best, ishome
      // HRM isBestSeller (Bán chạy) -> PKGX is_hot
      // HRM isNewArrival (Mới về) -> PKGX is_new
      best: product.isFeatured || false,
      hot: product.isBestSeller || false,
      new: product.isNewArrival || false,
      ishome: product.isFeatured || false,
      is_on_sale: product.isPublished ?? (product.status === 'active'),
    };
    
    // Add optional prices if mapped
    if (partnerPrice !== undefined) payload.partner_price = partnerPrice;
    if (acePrice !== undefined) payload.ace_price = acePrice;
    if (dealPrice !== undefined) payload.deal_price = dealPrice;
    
    return payload;
  }, [pkgxSettings, defaultSellingPolicy]);

  const handlePkgxPublish = React.useCallback(async (product: Product) => {
    if (product.pkgxId) {
      toast.warning('Sản phẩm đã được đăng lên PKGX');
      return;
    }
    
    if (!pkgxSettings.enabled) {
      toast.error('Tích hợp PKGX chưa được bật. Vui lòng bật trong Cài đặt > Tích hợp PKGX');
      return;
    }
    
    toast.loading(`Đang đăng sản phẩm lên PKGX...`, { id: 'pkgx-publish' });
    
    try {
      const payload = buildPkgxPayload(product);
      // ✅ Dynamic import - only load pkgx api-service when actually publishing
      const { createProduct } = await import("../../lib/pkgx/api-service");
      const response = await createProduct(payload);
      
      if (response.success && response.data) {
        const goodsId = response.data.goods_id;
        
        // Save pkgxId to product store - Zustand sẽ trigger re-render tự động
        update(product.systemId, { pkgxId: goodsId });
        
        // Update React Query cache trực tiếp (không cần refetch - realtime!)
        // Tìm tất cả queries có prefix 'products' và update item trong cache
        queryClient.setQueriesData<ProductQueryResult>(
          { queryKey: ['products'] },
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              items: oldData.items.map(item => 
                item.systemId === product.systemId 
                  ? { ...item, pkgxId: goodsId }
                  : item
              ),
            };
          }
        );
        
        toast.success(`Đã đăng sản phẩm lên PKGX! ID: ${goodsId}`, { id: 'pkgx-publish' });
        
        // Add log
        addPkgxLog({
          action: 'create_product',
          status: 'success',
          message: `Đã đăng sản phẩm: ${product.name}`,
          details: { productId: product.systemId, pkgxId: goodsId, productName: product.name },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đăng sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-publish' });
      addPkgxLog({
        action: 'create_product',
        status: 'error',
        message: `Lỗi đăng sản phẩm: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [pkgxSettings, buildPkgxPayload, update, addPkgxLog, queryClient]);

  // ═══════════════════════════════════════════════════════════════
  // PKGX Link Dialog State
  // ═══════════════════════════════════════════════════════════════
  const [pkgxLinkDialogOpen, setPkgxLinkDialogOpen] = React.useState(false);
  const [productToLink, setProductToLink] = React.useState<Product | null>(null);

  const handlePkgxLink = React.useCallback((product: Product) => {
    setProductToLink(product);
    setPkgxLinkDialogOpen(true);
  }, []);

  const handlePkgxLinkSuccess = React.useCallback((pkgxId: number) => {
    // Update React Query cache trực tiếp (realtime)
    if (productToLink) {
      queryClient.setQueriesData<ProductQueryResult>(
        { queryKey: ['products'] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map(item => 
              item.systemId === productToLink.systemId 
                ? { ...item, pkgxId }
                : item
            ),
          };
        }
      );
    }
  }, [productToLink, queryClient]);

  // Handler hủy liên kết PKGX
  const handlePkgxUnlink = React.useCallback((product: Product) => {
    // Update store - xóa pkgxId
    update(product.systemId, { pkgxId: undefined });
    
    // Update React Query cache trực tiếp (realtime)
    queryClient.setQueriesData<ProductQueryResult>(
      { queryKey: ['products'] },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map(item => 
            item.systemId === product.systemId 
              ? { ...item, pkgxId: undefined }
              : item
          ),
        };
      }
    );
    
    toast.success(`Đã hủy liên kết PKGX cho sản phẩm: ${product.name}`);
  }, [update, queryClient]);

  // Handler thay đổi trạng thái sản phẩm (Switch)
  const handleStatusChange = React.useCallback((product: Product, newStatus: 'active' | 'inactive') => {
    update(asSystemId(product.systemId), { status: newStatus });
    
    // Update React Query cache
    queryClient.setQueriesData<ProductQueryResult>(
      { queryKey: ['products'] },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map(item => 
            item.systemId === product.systemId 
              ? { ...item, status: newStatus }
              : item
          ),
        };
      }
    );
    
    toast.success(`${product.name}: ${newStatus === 'active' ? 'Đang bán' : 'Ngừng bán'}`);
  }, [update, queryClient]);

  // Handler thay đổi tồn kho (Inline edit)
  const handleInventoryChange = React.useCallback((product: Product, newQuantity: number) => {
    // Lấy branch mặc định (branch đầu tiên có trong inventoryByBranch)
    const branches = Object.keys(product.inventoryByBranch);
    if (branches.length === 0) {
      toast.error('Không tìm thấy chi nhánh để cập nhật tồn kho');
      return;
    }
    
    const defaultBranch = branches[0];
    const newInventory = { ...product.inventoryByBranch, [defaultBranch]: newQuantity };
    
    update(asSystemId(product.systemId), { inventoryByBranch: newInventory });
    
    // Update React Query cache
    queryClient.setQueriesData<ProductQueryResult>(
      { queryKey: ['products'] },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map(item => 
            item.systemId === product.systemId 
              ? { ...item, inventoryByBranch: newInventory }
              : item
          ),
        };
      }
    );
    
    toast.success(`Đã cập nhật tồn kho ${product.name}: ${newQuantity}`);
  }, [update, queryClient]);

  // Handler cập nhật trường bất kỳ (Inline edit cho text/number/boolean fields)
  const handleFieldUpdate = React.useCallback((product: Product, field: string, value: string | number | boolean) => {
    // Xử lý nested field như prices.systemId
    let updateData: Partial<Product>;
    
    if (field.startsWith('prices.')) {
      const policySystemId = field.replace('prices.', '');
      updateData = { prices: { ...product.prices, [policySystemId]: value as number } };
    } else {
      updateData = { [field]: value } as Partial<Product>;
    }
    
    update(asSystemId(product.systemId), updateData);
    
    // Update React Query cache
    queryClient.setQueriesData<ProductQueryResult>(
      { queryKey: ['products'] },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map(item => 
            item.systemId === product.systemId 
              ? { ...item, ...updateData }
              : item
          ),
        };
      }
    );
    
    // Show success toast
    const fieldLabels: Record<string, string> = {
      pkgxId: 'ID PKGX',
      trendtechId: 'ID Trendtech',
      reorderLevel: 'Mức đặt hàng lại',
      safetyStock: 'Tồn kho an toàn',
      maxStock: 'Mức tồn tối đa',
      sellerNote: 'Ghi chú',
      isPublished: 'Đăng web',
      isFeatured: 'Nổi bật',
      isNewArrival: 'Mới về',
      isBestSeller: 'Bán chạy',
      isOnSale: 'Đang giảm giá',
      isStockTracked: 'Theo dõi kho',
      costPrice: 'Giá vốn',
      sortOrder: 'Thứ tự',
    };
    
    const label = field.startsWith('prices.') ? 'Giá' : (fieldLabels[field] || field);
    const displayValue = typeof value === 'boolean' 
      ? (value ? 'Bật' : 'Tắt') 
      : (typeof value === 'string' && value.includes('T') ? formatDate(new Date(value)) : value);
    toast.success(`Đã cập nhật ${label}: ${displayValue}`);
  }, [update, queryClient]);

  const columns = React.useMemo(
    () => getColumns(
      handleDelete, 
      handleRestore, 
      router, 
      handlePrintLabel,
      handlePkgxPublish,
      handlePkgxLink,
      handlePkgxUnlink,
      handlePkgxSyncImages,
      handleStatusChange,
      handleInventoryChange,
      handleFieldUpdate
    ),
    [handleDelete, handleRestore, router, handlePrintLabel, handlePkgxPublish, handlePkgxLink, handlePkgxUnlink, handlePkgxSyncImages, handleStatusChange, handleInventoryChange, handleFieldUpdate]
  );
  
  // ✅ Run once on mount only
  React.useEffect(() => {
    // Show ALL columns by default for testing
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      initialVisibility[c.id!] = true; // Show all columns
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- columns is stable, only run on mount
  }, []);

  const updateTableState = React.useCallback(
    (updater: (prev: ProductQueryParams) => ProductQueryParams) => {
      setTableState((prev) => updater(prev));
    },
    [setTableState]
  );

  // ✅ Use extracted table state handlers hook
  const {
    handleSearchChange,
    handleStatusFilterChange,
    handleTypeFilterChange,
    handleCategoryFilterChange,
    handleComboFilterChange,
    handleStockLevelFilterChange,
    handlePkgxFilterChange,
    handleDateRangeChange,
    handlePaginationChange,
    handleSortingChange,
  } = useTableStateHandlers({ updateTableState });

  const queryParams = tableState;
  const { data: queryResult, isLoading: queryLoading, isFetching } = useProductsQuery(queryParams);
  const pageData = queryResult?.items ?? [];
  const totalRows = queryResult?.total ?? 0;
  const pageCount = queryResult?.pageCount ?? 1;
  const isTableLoading = queryLoading || isFetching;

  const filteredSnapshot = React.useMemo(() => getFilteredProductsSnapshot(queryParams), [queryParams]);

  const selectedProducts = React.useMemo(
    () => products.filter((product) => rowSelection[product.systemId]),
    [products, rowSelection]
  );

  // Import/Export dialog states
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);

  const confirmDelete = () => {
    if (idToDelete) {
      remove(asSystemId(idToDelete));
      toast.success('Đã chuyển sản phẩm vào thùng rác');
    }
    setIsAlertOpen(false)
    setIdToDelete(null)
  }
  
  const allSelectedRows = selectedProducts;

  // ✅ Use extracted import handler hook
  const handleImport = useProductImportHandler({
    products,
    add,
    update,
    authEmployeeSystemId: authEmployee?.systemId,
  });

  const toolbarLeftActions = (
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
  );

  const toolbarRightActions = (
    <DataTableColumnCustomizer
      columns={columns}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
      pinnedColumns={pinnedColumns}
      setPinnedColumns={setPinnedColumns}
    />
  );

  const handleRowClick = React.useCallback((row: Product) => {
    router.push(`/products/${row.systemId}`);
  }, [router]);

  // Get unique categories for filter - từ settings
  const categoryOptions = React.useMemo(() => {
    return activeCategories
      .map(c => ({
        label: c.path || c.name,
        value: c.systemId
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [activeCategories]);

  // Calculate stock level counts
  const stockLevelCounts = React.useMemo(() => {
    const activeProducts = products.filter(p => !p.isDeleted);
    
    const counts = {
      outOfStock: 0,
      lowStock: 0,
      belowSafety: 0,
      highStock: 0,
    };

    activeProducts.forEach(product => {
      const totalInventory = Object.values(product.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0);
      
      if (totalInventory <= 0) {
        counts.outOfStock++;
      }
      if (totalInventory > 0 && product.reorderLevel !== undefined && totalInventory <= product.reorderLevel) {
        counts.lowStock++;
      }
      if (product.safetyStock !== undefined && totalInventory < product.safetyStock) {
        counts.belowSafety++;
      }
      if (product.maxStock !== undefined && totalInventory > product.maxStock) {
        counts.highStock++;
      }
    });

    return counts;
  }, [products]);

  const renderFilterControls = () => (
    <ProductFilterControls
      tableState={tableState}
      categoryOptions={categoryOptions}
      stockLevelCounts={stockLevelCounts}
      onStatusFilterChange={handleStatusFilterChange}
      onTypeFilterChange={handleTypeFilterChange}
      onCategoryFilterChange={handleCategoryFilterChange}
      onComboFilterChange={handleComboFilterChange}
      onStockLevelFilterChange={handleStockLevelFilterChange}
      onPkgxFilterChange={handlePkgxFilterChange}
      onDateRangeChange={handleDateRangeChange}
    />
  );

  const handlePrintLabels = React.useCallback((products: Product[]) => {
    if (products.length === 0) return;
    const printOptionsList = products.map(product => {
      const categoryName = product.categorySystemId
        ? useProductCategoryStore.getState().findById(product.categorySystemId)?.name || product.category
        : product.category;
      const brandName = product.brandSystemId
        ? useBrandStore.getState().findById(product.brandSystemId)?.name || ''
        : '';
      const defaultPrice = defaultSellingPolicy
        ? product.prices?.[defaultSellingPolicy.systemId]
        : undefined;
      return {
        data: mapProductToLabelPrintData(product, storeSettings, {
          category: categoryName,
          brand: brandName,
          price: defaultPrice ?? product.sellingPrice,
        }),
      };
    });
    printMultiple('product-label', printOptionsList);
  }, [printMultiple, storeSettings, defaultSellingPolicy]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PKGX Bulk Action Helper Functions
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Get total inventory across all branches
  const _getTotalInventory = (product: Product): number => {
    if (!product.inventoryByBranch) return 0;
    return Object.values(product.inventoryByBranch).reduce((sum, qty) => sum + (qty || 0), 0);
  };

  // Create price update payload for PKGX
  const _createPriceUpdatePayload = (product: Product): Partial<PkgxProductPayload> => {
    const pkgxSettingsState = usePkgxSettingsStore.getState();
    const { priceMapping } = pkgxSettingsState.settings;
    
    const payload: Partial<PkgxProductPayload> = {};
    
    // Shop price (giá bán)
    if (priceMapping?.shopPrice && product.prices?.[priceMapping.shopPrice]) {
      payload.shop_price = product.prices[priceMapping.shopPrice];
    } else if (defaultSellingPolicy && product.prices?.[defaultSellingPolicy.systemId]) {
      payload.shop_price = product.prices[defaultSellingPolicy.systemId];
    } else if (product.costPrice) {
      payload.shop_price = product.costPrice;
    }
    
    // Market price (giá thị trường)
    if (priceMapping?.marketPrice && product.prices?.[priceMapping.marketPrice]) {
      payload.market_price = product.prices[priceMapping.marketPrice];
    }
    
    // Partner price
    if (priceMapping?.partnerPrice && product.prices?.[priceMapping.partnerPrice]) {
      payload.partner_price = product.prices[priceMapping.partnerPrice];
    }
    
    // Ace price
    if (priceMapping?.acePrice && product.prices?.[priceMapping.acePrice]) {
      payload.ace_price = product.prices[priceMapping.acePrice];
    }
    
    // Deal price
    if (priceMapping?.dealPrice && product.prices?.[priceMapping.dealPrice]) {
      payload.deal_price = product.prices[priceMapping.dealPrice];
    }
    
    return payload;
  };

  // Create SEO update payload for PKGX (đồng nhất với handlePkgxUpdateSeo)
  const _createSeoUpdatePayload = (product: Product): Partial<PkgxProductPayload> => {
    const pkgxSeo = product.seoPkgx;
    return {
      keywords: pkgxSeo?.seoKeywords || product.tags?.join(', ') || product.name,
      meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
      meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
      goods_brief: pkgxSeo?.shortDescription || product.shortDescription || '',
    };
  };

  // Create flags update payload for PKGX
  // Mapping: HRM isPublished->is_on_sale, isFeatured->best/ishome, isBestSeller->hot, isNewArrival->new
  const _createFlagsUpdatePayload = (product: Product): Partial<PkgxProductPayload> => {
    return {
      best: product.isFeatured || false,
      hot: product.isBestSeller || false,
      new: product.isNewArrival || false,
      ishome: product.isFeatured || false,
      is_on_sale: product.isPublished ?? (product.status === 'active'),
    };
  };

  // ✅ Use factory functions for bulk actions
  const bulkActions = React.useMemo(() => createBulkActions({
    handlePrintLabels,
    remove,
    update,
    setRowSelection,
  }), [handlePrintLabels, remove, update]);

  // ═══════════════════════════════════════════════════════════════
  // PKGX Bulk Actions - Using shared usePkgxBulkSync hook
  // ═══════════════════════════════════════════════════════════════
  const pkgxBulkActions = React.useMemo(() => createPkgxBulkActions({
    triggerBulkSync,
    update,
    setRowSelection,
  }), [triggerBulkSync, update]);

  // ✅ Use extracted MobileProductCard component
  const renderMobileCard = React.useCallback((product: Product) => (
    <MobileProductCard
      product={product}
      categories={categories}
      onRowClick={handleRowClick}
      onDelete={handleDelete}
    />
  ), [categories, handleRowClick, handleDelete]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* ===== HÀNG 2: TOOLBAR - Common Actions ===== */}
      {!isMobile ? (
        <PageToolbar
          className="flex-wrap gap-2"
          leftActions={toolbarLeftActions}
          rightActions={toolbarRightActions}
        />
      ) : (
        <>
          <div className="py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-center gap-2"
              onClick={() => setActionsSheetOpen(true)}
            >
              <Settings2 className="h-4 w-4" />
              Tùy chọn bảng
            </Button>
          </div>
          <Sheet open={isActionsSheetOpen} onOpenChange={setActionsSheetOpen}>
            <SheetContent side="bottom" className="space-y-4">
              <SheetHeader>
                <SheetTitle>Hành động nhanh</SheetTitle>
                <SheetDescription>Nhập, xuất dữ liệu và tùy chỉnh cột hiển thị.</SheetDescription>
              </SheetHeader>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-center" 
                  variant="outline"
                  onClick={() => {
                    setActionsSheetOpen(false);
                    setIsImportOpen(true);
                  }}
                >
                  Nhập sản phẩm
                </Button>
                <Button 
                  className="w-full justify-center" 
                  variant="outline"
                  onClick={() => {
                    setActionsSheetOpen(false);
                    setIsExportOpen(true);
                  }}
                >
                  Xuất danh sách
                </Button>
                <DataTableColumnCustomizer
                  columns={columns}
                  columnVisibility={columnVisibility}
                  setColumnVisibility={setColumnVisibility}
                  columnOrder={columnOrder}
                  setColumnOrder={setColumnOrder}
                  pinnedColumns={pinnedColumns}
                  setPinnedColumns={setPinnedColumns}
                >
                  <Button className="w-full justify-center gap-2" variant="outline">
                    <Columns3 className="h-4 w-4" />
                    Tuỳ chỉnh cột
                  </Button>
                </DataTableColumnCustomizer>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}

      {/* ===== HÀNG 3: FILTERS - Search & Custom Filters (1 hàng) ===== */}
      {!isMobile ? (
        <PageFilters
          searchValue={tableState.search}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Tìm kiếm sản phẩm..."
        >
          {renderFilterControls()}
        </PageFilters>
      ) : (
        <>
          <PageFilters
            searchValue={tableState.search}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Tìm kiếm sản phẩm..."
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto justify-center gap-2"
              onClick={() => setFilterSheetOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Bộ lọc nâng cao
            </Button>
          </PageFilters>
          <Sheet open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
            <SheetContent side="bottom" className="space-y-4">
              <SheetHeader>
                <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                <SheetDescription>Tùy chọn nhanh cho trạng thái, loại, danh mục, combo và tồn kho.</SheetDescription>
              </SheetHeader>
              <div className="space-y-3">
                {renderFilterControls()}
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
      
      {/* ===== DATA TABLE ===== */}
      <div className="pb-4">
        <ResponsiveDataTable
          columns={columns}
          data={pageData}
          renderMobileCard={renderMobileCard}
          pageCount={pageCount}
          pagination={tableState.pagination}
          setPagination={handlePaginationChange}
          rowCount={totalRows}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          allSelectedRows={allSelectedRows}
          onBulkDelete={undefined}
          bulkActions={bulkActions}
          pkgxBulkActions={pkgxBulkActions}
          sorting={tableState.sorting}
          setSorting={handleSortingChange}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          pinnedColumns={pinnedColumns}
          setPinnedColumns={setPinnedColumns}
          onRowClick={handleRowClick}
          emptyTitle="Không có sản phẩm"
          emptyDescription="Thêm sản phẩm đầu tiên để bắt đầu"
          isLoading={isTableLoading}
          mobileVirtualized
          mobileRowHeight={MOBILE_ROW_HEIGHT}
          mobileListHeight={MOBILE_LIST_HEIGHT}
        />
      </div>
      
    
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Sản phẩm sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9">Hủy</AlertDialogCancel>
            <AlertDialogAction className="h-9" onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog V2 - Lazy loaded with config */}
      <ProductImportDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        existingData={products}
        onImport={handleImport}
        currentUser={authEmployee ? {
          systemId: authEmployee.systemId,
          name: authEmployee.fullName || authEmployee.id,
        } : undefined}
      />

      {/* Export Dialog V2 - Lazy loaded with config */}
      <ProductExportDialog
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        allData={products}
        filteredData={filteredSnapshot}
        currentPageData={pageData}
        selectedData={selectedProducts}
        currentUser={authEmployee ? {
          systemId: authEmployee.systemId,
          name: authEmployee.fullName || authEmployee.id,
        } : { systemId: asSystemId('SYSTEM'), name: 'System' }}
      />

      {/* PKGX Link Dialog */}
      <PkgxLinkDialog
        open={pkgxLinkDialogOpen}
        onOpenChange={setPkgxLinkDialogOpen}
        product={productToLink}
        onSuccess={handlePkgxLinkSuccess}
      />

      {/* PKGX Bulk Sync Confirm Dialog */}
      <PkgxBulkSyncConfirmDialog
        confirmAction={bulkConfirmAction}
        progress={bulkProgress}
        onConfirm={executeBulkAction}
        onCancel={cancelBulkConfirm}
      />
    </div>
  )
}
