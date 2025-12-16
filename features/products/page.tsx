import * as React from "react"
// FIX: Use named imports for react-router-dom to fix module export errors.
import { useNavigate } from 'react-router-dom';
import { useProductStore } from "./store.ts"
import { useProductCategoryStore } from "../settings/inventory/product-category-store.ts"
import { useBranchStore } from "../settings/branches/store.ts"
import { useBrandStore } from "../settings/inventory/brand-store.ts"
import { usePricingPolicyStore } from "../settings/pricing/store.ts"
import { usePkgxSettingsStore } from "../settings/pkgx/store.ts"
import { createProduct, updateProduct } from "../../lib/pkgx/api-service.ts"
import type { PkgxProductPayload } from "../settings/pkgx/types.ts"
import { usePkgxSync } from "./hooks/use-pkgx-sync.ts"
import { useAuth } from "../../contexts/auth-context.tsx"
import { asSystemId, asBusinessId } from '../../lib/id-types';
import { getColumns } from "./columns.tsx"
import { usePrint } from '@/lib/use-print';
import { 
  convertProductForLabel,
  convertProductsForLabels,
  mapProductToLabelPrintData,
  createStoreSettings,
} from '@/lib/print/product-print-helper';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx"
import { GenericImportDialogV2 } from "../../components/shared/generic-import-dialog-v2.tsx";
import { GenericExportDialogV2 } from "../../components/shared/generic-export-dialog-v2.tsx";
import { productImportExportConfig } from "../../lib/import-export/configs/product.config.ts";
import { DataTableDateFilter } from "../../components/data-table/data-table-date-filter.tsx";
import { PageFilters } from "../../components/layout/page-filters.tsx";
import { PageToolbar } from "../../components/layout/page-toolbar.tsx";
import { transformImportedRows, normalizeFieldKey, type BranchInventoryIdentifier } from "./product-importer.ts";
import { 
  Card, 
  CardContent, 
} from "../../components/ui/card.tsx"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog.tsx"
import type { Product } from "./types.ts"
import { Button } from "../../components/ui/button.tsx"
import { PlusCircle } from "lucide-react"
import { useProductsQuery } from "./hooks/use-products-query.ts";
import { DEFAULT_PRODUCT_SORT, getFilteredProductsSnapshot, type ProductQueryParams } from "./product-service.ts";
import { usePersistentState } from "../../hooks/use-persistent-state.ts";
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.tsx";
import { useMediaQuery } from "../../lib/use-media-query.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet.tsx";
import { MoreVertical, Package, Settings2, SlidersHorizontal, Columns3, Layers } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isDateSame, isDateBetween, isDateAfter, isDateBefore, isValidDate } from '@/lib/date-utils';


const TABLE_STATE_STORAGE_KEY = 'products-table-state';
const MOBILE_ROW_HEIGHT = 190;
const MOBILE_LIST_HEIGHT = 520;

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

function resolveStateAction<T>(current: T, action: React.SetStateAction<T>): T {
  return typeof action === 'function' ? (action as (prev: T) => T)(current) : action;
}
export function ProductsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: productsRaw, remove, restore, getDeleted, addMultiple, add, update } = useProductStore();
  const categories = useProductCategoryStore(state => state.data);
  const activeCategories = React.useMemo(
    () => categories.filter(category => !category.isDeleted && category.isActive !== false),
    [categories]
  );
  const { data: branches } = useBranchStore();
  const { employee: authEmployee } = useAuth();
  const navigate = useNavigate();

  const defaultBranchSystemId = React.useMemo(() => {
    return branches.find(branch => branch.isDefault)?.systemId ?? branches[0]?.systemId ?? null;
  }, [branches]);

  const branchInventoryIdentifiers = React.useMemo<BranchInventoryIdentifier[]>(() => {
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
  }, [getDeleted, products]);
  
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
        onClick={() => navigate('/products/trash')}
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
          <DropdownMenuItem onClick={() => navigate('/products/new')}>
            <Package className="mr-2 h-4 w-4" />
            Thêm sản phẩm đơn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/products/new?type=combo')}>
            <Layers className="mr-2 h-4 w-4" />
            Thêm Combo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    return actions;
  }, [deletedCount, navigate, setActionsSheetOpen, isMobile]);
  
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
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'products-column-visibility';
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null;
    const cols = getColumns(() => {}, () => {}, () => {});
    const allColumnIds = cols.map(c => c.id).filter(Boolean);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (allColumnIds.every(id => id in parsed)) return parsed;
      } catch (error) {
        console.warn('[products-page] Failed to parse column visibility', error);
      }
    }
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('products-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

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
      price: defaultPrice ?? product.sellingPrice ?? product.suggestedRetailPrice,
    });
    printSingleLabel('product-label', { data: printData });
  }, [printSingleLabel, storeSettings, defaultSellingPolicy]);

  // ===== PKGX Handlers =====
  const { settings: pkgxSettings, addLog: addPkgxLog } = usePkgxSettingsStore();
  
  // Use PKGX sync hook for all sync handlers
  const {
    handlePkgxUpdatePrice,
    handlePkgxSyncInventory,
    handlePkgxUpdateSeo,
    handlePkgxSyncDescription,
    handlePkgxSyncFlags,
    handlePkgxSyncBasicInfo,
    handlePkgxSyncImages,
    handlePkgxSyncAll,
  } = usePkgxSync({ addPkgxLog });
  
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
    
    const payload: PkgxProductPayload = {
      goods_name: product.name,
      goods_sn: product.id,
      cat_id: categoryMapping?.pkgxCatId || 0,
      brand_id: brandMapping?.pkgxBrandId || 0,
      shop_price: shopPrice,
      market_price: marketPrice,
      goods_brief: product.shortDescription || '',
      goods_desc: product.description || '',
      goods_number: totalInventory,
      keywords: product.ktitle || product.name,
      meta_title: product.ktitle || product.name,
      meta_desc: product.seoDescription || product.shortDescription || '',
      original_img: product.thumbnailImage || product.images?.[0] || '',
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
      const response = await createProduct(payload);
      
      if (response.success && response.data) {
        const goodsId = response.data.goods_id;
        
        // Save pkgxId to product store
        update(product.systemId as any, { pkgxId: goodsId });
        
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
  }, [pkgxSettings, buildPkgxPayload, update, addPkgxLog]);

  const columns = React.useMemo(
    () => getColumns(
      handleDelete, 
      handleRestore, 
      navigate, 
      handlePrintLabel,
      handlePkgxUpdatePrice,
      handlePkgxPublish,
      handlePkgxUpdateSeo,
      handlePkgxSyncInventory,
      handlePkgxSyncDescription,
      handlePkgxSyncFlags,
      handlePkgxSyncBasicInfo,
      handlePkgxSyncImages,
      handlePkgxSyncAll
    ),
    [handleDelete, handleRestore, navigate, handlePrintLabel, handlePkgxUpdatePrice, handlePkgxPublish, handlePkgxUpdateSeo, handlePkgxSyncInventory, handlePkgxSyncDescription, handlePkgxSyncFlags, handlePkgxSyncBasicInfo, handlePkgxSyncImages, handlePkgxSyncAll]
  );
  
  // ✅ Run once on mount only
  React.useEffect(() => {
    const defaultVisibleColumns = [
      'id', 'name', 'sku', 'categorySystemId', 'type', 
      'status', 'defaultPrice', 'costPrice', 'inventory', 'unit',
      'inventoryWarning', 'weight', 'dimensions', 'brand', 'supplier'
    ];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      if (c.id === 'select' || c.id === 'actions' || c.id === 'pkgxActions') {
        initialVisibility[c.id!] = true;
      } else {
        initialVisibility[c.id!] = defaultVisibleColumns.includes(c.id!);
      }
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, []);

  const updateTableState = React.useCallback(
    (updater: (prev: ProductQueryParams) => ProductQueryParams) => {
      setTableState((prev) => updater(prev));
    },
    [setTableState]
  );

  const handleSearchChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        search: value,
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleStatusFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        statusFilter: value as ProductQueryParams['statusFilter'],
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleTypeFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        typeFilter: value as ProductQueryParams['typeFilter'],
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleCategoryFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        categoryFilter: value,
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleComboFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        comboFilter: value as ProductQueryParams['comboFilter'],
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleStockLevelFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        stockLevelFilter: value as ProductQueryParams['stockLevelFilter'],
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handlePkgxFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        pkgxFilter: value as ProductQueryParams['pkgxFilter'],
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleDateRangeChange = React.useCallback(
    (value: [string | undefined, string | undefined] | undefined) => {
      updateTableState((prev) => ({
        ...prev,
        dateRange: value,
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handlePaginationChange = React.useCallback(
    (action: React.SetStateAction<{ pageIndex: number; pageSize: number }>) => {
      updateTableState((prev) => ({
        ...prev,
        pagination: resolveStateAction(prev.pagination, action),
      }));
    },
    [updateTableState]
  );

  const handleSortingChange = React.useCallback(
    (action: React.SetStateAction<{ id: string; desc: boolean }>) => {
      updateTableState((prev) => {
        const nextSortingSource = resolveStateAction(prev.sorting, action);
        return {
          ...prev,
          sorting: {
            id: (nextSortingSource.id as ProductQueryParams['sorting']['id']) ?? prev.sorting.id,
            desc: nextSortingSource.desc,
          },
        };
      });
    },
    [updateTableState]
  );

  const queryParams = tableState;
  const { data: queryResult, isLoading: queryLoading, isFetching } = useProductsQuery(queryParams);
  const pageData = queryResult?.items ?? [];
  const totalRows = queryResult?.total ?? 0;
  const pageCount = queryResult?.pageCount ?? 1;
  const isTableLoading = queryLoading || isFetching;

  const filteredSnapshot = React.useMemo(() => getFilteredProductsSnapshot(queryParams), [products, queryParams]);

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

  // Import handler - tích hợp với product importer logic
  const handleImport = React.useCallback(async (data: Partial<Product>[], mode: 'insert-only' | 'update-only' | 'upsert', branchId?: string) => {
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
          // Check if product exists (by id or barcode)
          // NOTE: Product uses 'id' (BusinessId) not 'code'
          const existingProduct = products.find(p => 
            (item.id && p.id === item.id) || 
            (item.barcode && p.barcode === item.barcode)
          );
          
          if (existingProduct) {
            // Product exists
            if (mode === 'insert-only') {
              // Skip in insert-only mode
              results.skipped++;
              continue;
            }
            
            // Update existing product
            const updatedFields: Partial<Product> = {
              ...item,
              updatedAt: new Date().toISOString(),
              updatedBy: currentEmployeeSystemId,
            };
            // Remove fields that shouldn't be overwritten
            delete (updatedFields as any).systemId;
            delete (updatedFields as any).createdAt;
            delete (updatedFields as any).createdBy;
            
            update(existingProduct.systemId, updatedFields);
            results.updated++;
            results.success++;
          } else {
            // Product does not exist
            if (mode === 'update-only') {
              // Skip in update-only mode
              results.skipped++;
              continue;
            }
            
            // Insert new product
            const newProduct = {
              ...item,
              inventoryByBranch: item.inventoryByBranch || {},
              committedByBranch: item.committedByBranch || {},
              inTransitByBranch: item.inTransitByBranch || {},
              prices: item.prices || {},
              createdAt: new Date().toISOString(),
              createdBy: currentEmployeeSystemId,
              updatedAt: new Date().toISOString(),
              updatedBy: currentEmployeeSystemId,
            } as Omit<Product, 'systemId'>;
            
            add(newProduct);
            results.inserted++;
            results.success++;
          }
        } catch (rowError) {
          results.failed++;
          results.errors.push({
            row: i + 2, // Excel row (1-indexed + header)
            message: rowError instanceof Error ? rowError.message : 'Lỗi không xác định',
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('[Products Importer] Lỗi nhập sản phẩm', error);
      throw error;
    }
  }, [products, add, update, authEmployee?.systemId]);

  const toolbarLeftActions = (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
        Nhập file
      </Button>
      <Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}>
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

  const handleRowClick = (row: Product) => {
    navigate(`/products/${row.systemId}`);
  };

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
    <>
      <DataTableDateFilter
        value={tableState.dateRange}
        onChange={handleDateRangeChange}
        title="Ngày tạo"
      />

      <Select value={tableState.statusFilter} onValueChange={handleStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] h-9">
          <SelectValue placeholder="Tất cả trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="active">Hoạt động</SelectItem>
          <SelectItem value="inactive">Tạm ngừng</SelectItem>
          <SelectItem value="discontinued">Ngừng kinh doanh</SelectItem>
        </SelectContent>
      </Select>

      <Select value={tableState.typeFilter} onValueChange={handleTypeFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] h-9">
          <SelectValue placeholder="Loại sản phẩm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          <SelectItem value="physical">Hàng hóa</SelectItem>
          <SelectItem value="service">Dịch vụ</SelectItem>
          <SelectItem value="digital">Sản phẩm số</SelectItem>
        </SelectContent>
      </Select>

      <Select value={tableState.categoryFilter} onValueChange={handleCategoryFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] h-9">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {categoryOptions.map(cat => (
            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={tableState.comboFilter} onValueChange={handleComboFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] h-9">
          <SelectValue placeholder="Sản phẩm combo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả sản phẩm</SelectItem>
          <SelectItem value="combo">Chỉ Combo</SelectItem>
          <SelectItem value="non-combo">Không phải Combo</SelectItem>
        </SelectContent>
      </Select>

      <Select value={tableState.stockLevelFilter} onValueChange={handleStockLevelFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] h-9">
          <SelectValue placeholder="Mức tồn kho" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả mức tồn</SelectItem>
          <SelectItem value="out-of-stock">Hết hàng ({stockLevelCounts.outOfStock})</SelectItem>
          <SelectItem value="low-stock">Sắp hết ({stockLevelCounts.lowStock})</SelectItem>
          <SelectItem value="below-safety">Dưới an toàn ({stockLevelCounts.belowSafety})</SelectItem>
          <SelectItem value="high-stock">Tồn cao ({stockLevelCounts.highStock})</SelectItem>
        </SelectContent>
      </Select>

      <Select value={tableState.pkgxFilter} onValueChange={handlePkgxFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] h-9">
          <SelectValue placeholder="Trạng thái PKGX" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả PKGX</SelectItem>
          <SelectItem value="linked">Đã liên kết PKGX</SelectItem>
          <SelectItem value="not-linked">Chưa liên kết PKGX</SelectItem>
        </SelectContent>
      </Select>
    </>  
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
          price: defaultPrice ?? product.sellingPrice ?? product.suggestedRetailPrice,
        }),
      };
    });
    printMultiple('product-label', printOptionsList);
  }, [printMultiple, storeSettings, defaultSellingPolicy]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PKGX Bulk Action Helper Functions
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Get total inventory across all branches
  const getTotalInventory = (product: Product): number => {
    if (!product.inventoryByBranch) return 0;
    return Object.values(product.inventoryByBranch).reduce((sum, qty) => sum + (qty || 0), 0);
  };

  // Create price update payload for PKGX
  const createPriceUpdatePayload = (product: Product): Partial<PkgxProductPayload> => {
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

  // Create SEO update payload for PKGX
  const createSeoUpdatePayload = (product: Product): Partial<PkgxProductPayload> => {
    return {
      meta_title: product.ktitle || product.name,
      meta_desc: product.seoDescription || product.shortDescription || '',
      keywords: product.ktitle || product.name,
      goods_brief: product.shortDescription || '',
    };
  };

  // Create flags update payload for PKGX
  const createFlagsUpdatePayload = (product: Product): Partial<PkgxProductPayload> => {
    return {
      best: product.isBestSeller ?? false,
      hot: product.isFeatured ?? false,
      new: product.isNewArrival ?? false,
      ishome: product.isFeatured ?? false,
      is_on_sale: product.isPublished ?? true,
    };
  };

  const bulkActions = [
    {
      label: "In tem phụ sản phẩm",
      onSelect: (selectedRows: Product[]) => {
        handlePrintLabels(selectedRows);
        toast.success(`Đang in tem cho ${selectedRows.length} sản phẩm`);
      }
    },
    {
      label: "───── PKGX ─────",
      onSelect: () => {},
      disabled: true,
    },
    {
      label: "Đẩy lên PKGX",
      onSelect: async (selectedRows: Product[]) => {
        const pkgxSettings = usePkgxSettingsStore.getState();
        if (!pkgxSettings.settings.enabled) {
          toast.error('PKGX chưa được bật');
          return;
        }
        
        // Filter products that have category mapping
        const validProducts = selectedRows.filter(p => {
          if (!p.categorySystemId) return false;
          return pkgxSettings.getCategoryMappingByHrmId(p.categorySystemId);
        });
        
        if (validProducts.length === 0) {
          toast.error('Không có sản phẩm nào có thể đẩy lên PKGX (chưa mapping danh mục)');
          return;
        }
        
        toast.info(`Đang đẩy ${validProducts.length} sản phẩm lên PKGX...`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const product of validProducts) {
          try {
            const payload = buildPkgxPayload(product);
            
            if (product.pkgxId) {
              const response = await updateProduct(product.pkgxId, payload);
              if (response.success) successCount++;
              else errorCount++;
            } else {
              const response = await createProduct(payload);
              if (response.success && response.data?.goods_id) {
                update(product.systemId, { pkgxId: response.data.goods_id });
                successCount++;
              } else errorCount++;
            }
          } catch {
            errorCount++;
          }
        }
        
        setRowSelection({});
        if (successCount > 0) toast.success(`Đã đẩy ${successCount} sản phẩm lên PKGX`);
        if (errorCount > 0) toast.error(`Lỗi ${errorCount} sản phẩm`);
      }
    },
    {
      label: "Sync giá PKGX",
      onSelect: async (selectedRows: Product[]) => {
        const pkgxSettings = usePkgxSettingsStore.getState();
        if (!pkgxSettings.settings.enabled) {
          toast.error('PKGX chưa được bật');
          return;
        }
        
        const linkedProducts = selectedRows.filter(p => p.pkgxId);
        if (linkedProducts.length === 0) {
          toast.error('Không có sản phẩm nào đã liên kết PKGX');
          return;
        }
        
        toast.info(`Đang sync giá ${linkedProducts.length} sản phẩm...`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const product of linkedProducts) {
          try {
            const pricePayload = createPriceUpdatePayload(product);
            const response = await updateProduct(product.pkgxId!, pricePayload);
            if (response.success) successCount++;
            else errorCount++;
          } catch {
            errorCount++;
          }
        }
        
        setRowSelection({});
        if (successCount > 0) toast.success(`Đã sync giá ${successCount} sản phẩm`);
        if (errorCount > 0) toast.error(`Lỗi sync giá ${errorCount} sản phẩm`);
      }
    },
    {
      label: "Sync tồn kho PKGX",
      onSelect: async (selectedRows: Product[]) => {
        const pkgxSettings = usePkgxSettingsStore.getState();
        if (!pkgxSettings.settings.enabled) {
          toast.error('PKGX chưa được bật');
          return;
        }
        
        const linkedProducts = selectedRows.filter(p => p.pkgxId);
        if (linkedProducts.length === 0) {
          toast.error('Không có sản phẩm nào đã liên kết PKGX');
          return;
        }
        
        toast.info(`Đang sync tồn kho ${linkedProducts.length} sản phẩm...`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const product of linkedProducts) {
          try {
            const totalStock = getTotalInventory(product);
            const response = await updateProduct(product.pkgxId!, { goods_number: totalStock });
            if (response.success) successCount++;
            else errorCount++;
          } catch {
            errorCount++;
          }
        }
        
        setRowSelection({});
        if (successCount > 0) toast.success(`Đã sync tồn kho ${successCount} sản phẩm`);
        if (errorCount > 0) toast.error(`Lỗi sync tồn kho ${errorCount} sản phẩm`);
      }
    },
    {
      label: "Sync SEO PKGX",
      onSelect: async (selectedRows: Product[]) => {
        const pkgxSettings = usePkgxSettingsStore.getState();
        if (!pkgxSettings.settings.enabled) {
          toast.error('PKGX chưa được bật');
          return;
        }
        
        const linkedProducts = selectedRows.filter(p => p.pkgxId);
        if (linkedProducts.length === 0) {
          toast.error('Không có sản phẩm nào đã liên kết PKGX');
          return;
        }
        
        toast.info(`Đang sync SEO ${linkedProducts.length} sản phẩm...`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const product of linkedProducts) {
          try {
            const seoPayload = createSeoUpdatePayload(product);
            const response = await updateProduct(product.pkgxId!, seoPayload);
            if (response.success) successCount++;
            else errorCount++;
          } catch {
            errorCount++;
          }
        }
        
        setRowSelection({});
        if (successCount > 0) toast.success(`Đã sync SEO ${successCount} sản phẩm`);
        if (errorCount > 0) toast.error(`Lỗi sync SEO ${errorCount} sản phẩm`);
      }
    },
    {
      label: "Sync flags PKGX",
      onSelect: async (selectedRows: Product[]) => {
        const pkgxSettings = usePkgxSettingsStore.getState();
        if (!pkgxSettings.settings.enabled) {
          toast.error('PKGX chưa được bật');
          return;
        }
        
        const linkedProducts = selectedRows.filter(p => p.pkgxId);
        if (linkedProducts.length === 0) {
          toast.error('Không có sản phẩm nào đã liên kết PKGX');
          return;
        }
        
        toast.info(`Đang sync flags ${linkedProducts.length} sản phẩm...`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const product of linkedProducts) {
          try {
            const flagsPayload = createFlagsUpdatePayload(product);
            const response = await updateProduct(product.pkgxId!, flagsPayload);
            if (response.success) successCount++;
            else errorCount++;
          } catch {
            errorCount++;
          }
        }
        
        setRowSelection({});
        if (successCount > 0) toast.success(`Đã sync flags ${successCount} sản phẩm`);
        if (errorCount > 0) toast.error(`Lỗi sync flags ${errorCount} sản phẩm`);
      }
    },
    {
      label: "───────────────",
      onSelect: () => {},
      disabled: true,
    },
    {
      label: "Chuyển vào thùng rác",
      onSelect: (selectedRows: Product[]) => {
        const systemIds = selectedRows.map(p => p.systemId);
        systemIds.forEach(id => remove(asSystemId(id)));
        setRowSelection({});
        toast.success(`Đã chuyển ${selectedRows.length} sản phẩm vào thùng rác`);
      }
    },
    {
      label: "Đang hoạt động",
      onSelect: (selectedRows: Product[]) => {
        selectedRows.forEach(product => {
          update(asSystemId(product.systemId), { ...product, status: 'active' });
        });
        setRowSelection({});
        toast.success(`Đã cập nhật ${selectedRows.length} sản phẩm sang trạng thái "Đang hoạt động"`);
      }
    },
    {
      label: "Ngừng kinh doanh",
      onSelect: (selectedRows: Product[]) => {
        selectedRows.forEach(product => {
          update(asSystemId(product.systemId), { ...product, status: 'discontinued' });
        });
        setRowSelection({});
        toast.success(`Đã cập nhật ${selectedRows.length} sản phẩm sang trạng thái "Ngừng kinh doanh"`);
      }
    }
  ];

  const getStatusVariant = (status?: string) => {
    if (!status) return 'secondary';
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'discontinued': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return 'Không xác định';
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Tạm ngừng';
      case 'discontinued': return 'Ngừng kinh doanh';
      default: return status;
    }
  };

  const getTypeLabel = (type?: string) => {
    if (!type) return '';
    switch (type) {
      case 'physical': return 'Hàng hóa';
      case 'service': return 'Dịch vụ';
      case 'digital': return 'Sản phẩm số';
      default: return type;
    }
  };

  const MobileProductCard = ({ product }: { product: Product }) => {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleRowClick(product)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon/Avatar */}
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                <Package className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-body-sm font-medium truncate">{product.name}</h3>
                    {product.pkgxId && (
                      <Badge variant="outline" className="text-body-xs border-blue-500 text-blue-600 flex-shrink-0">
                        PKGX
                      </Badge>
                    )}
                  </div>
                  <p className="text-body-xs text-muted-foreground">{product.id}</p>
                  {product.shortDescription && (
                    <p className="text-body-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {product.shortDescription}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.systemId}/edit`); }}>
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(product.systemId); }}>
                      Chuyển vào thùng rác
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mt-2">
                {product.categorySystemId && (
                  <div className="flex items-center text-body-xs text-muted-foreground">
                    <Package className="h-3 w-3 mr-1.5" />
                    <span className="truncate">
                      {categories.find(c => c.systemId === product.categorySystemId)?.name || product.categorySystemId}
                    </span>
                  </div>
                )}
                {product.type && (
                  <div className="flex items-center text-body-xs text-muted-foreground">
                    <span className="truncate">{getTypeLabel(product.type)}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t">
                <Badge variant={getStatusVariant(product.status) as any} className="text-body-xs">
                  {getStatusLabel(product.status)}
                </Badge>
                {product.unit && (
                  <span className="text-body-xs text-muted-foreground">
                    ĐVT: {product.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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
          renderMobileCard={(product) => <MobileProductCard product={product} />}
          pageCount={pageCount}
          pagination={tableState.pagination}
          setPagination={handlePaginationChange}
          rowCount={totalRows}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          allSelectedRows={allSelectedRows}
          onBulkDelete={undefined}
          bulkActions={bulkActions}
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

      {/* Import Dialog V2 */}
      <GenericImportDialogV2<Product>
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        config={productImportExportConfig}
        existingData={products}
        onImport={handleImport}
        currentUser={authEmployee ? {
          systemId: authEmployee.systemId,
          name: authEmployee.fullName || authEmployee.id,
        } : undefined}
      />

      {/* Export Dialog V2 */}
      <GenericExportDialogV2<Product>
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        config={productImportExportConfig}
        allData={products}
        filteredData={filteredSnapshot}
        currentPageData={pageData}
        selectedData={selectedProducts}
        currentUser={authEmployee ? {
          systemId: authEmployee.systemId,
          name: authEmployee.fullName || authEmployee.id,
        } : { systemId: asSystemId('SYSTEM'), name: 'System' }}
      />
    </div>
  )
}
