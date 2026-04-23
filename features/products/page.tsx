'use client'

import * as React from "react"
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { Package, Settings2, SlidersHorizontal, Columns3, Layers, FileUp, Download, PlusCircle, Settings } from "lucide-react";

import { useProductMutations, useTrashMutations, productKeys, useProductStats, useBulkProductMutations } from "./hooks/use-products"
import { fetchProduct } from "./api/products-api"
import { useProductPageData } from "./hooks/use-product-page-data"
import { usePkgxBulkSync } from "../settings/pkgx/hooks/use-pkgx-bulk-sync"
import { usePkgxLogMutations, usePkgxMappings } from "../settings/pkgx/hooks/use-pkgx-settings"
import type { PkgxProductPayload } from "../settings/pkgx/types"
import { usePkgxSync } from "./hooks/use-pkgx-sync"
import { useAuth } from "@/contexts/auth-context"
import { asSystemId } from '@/lib/id-types';
import { getColumns } from "./columns"
import type { ColumnLookups } from "./columns"
import { usePrint } from '@/lib/use-print';
import { mapProductToLabelPrintData, createStoreSettings } from '@/lib/print/product-print-helper';
import { useProductsQuery } from "./hooks/use-products-query";
import { DEFAULT_PRODUCT_SORT, type ProductQueryParams, type ProductQueryResult } from "./product-service";
import { usePageHeader } from "@/contexts/page-header-context";
import { useColumnLayout } from '@/hooks/use-column-visibility';
import { useMediaQuery } from "@/lib/use-media-query";
import { useTableStateHandlers } from "./hooks/use-table-state-handlers";
import { useUrlTableState } from "./hooks/use-url-table-state";
import { useProductImportHandler } from "./hooks/use-product-import-handler";
import type { Product } from "@/lib/types/prisma-extended"

import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table"
import { PageFilters } from "@/components/layout/page-filters";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MobileProductCard } from "./components/mobile-product-card";
import { ProductFilterControls } from "./components/product-filter-controls";
import { createBulkActions, createPkgxBulkActions } from "./components/product-bulk-actions";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { formatCurrency, formatNumber } from "@/lib/format-utils"
import { cn } from "@/lib/utils"
import type { ProductStats } from "./hooks/use-products"
import { FAB } from '@/components/mobile/fab';
import { ListPageShell } from '@/components/layout/page-section';

const PkgxBulkSyncConfirmDialog = dynamic(() => import("../settings/pkgx/components/pkgx-bulk-sync-confirm-dialog").then(mod => ({ default: mod.PkgxBulkSyncConfirmDialog })), { ssr: false });
const PkgxLinkDialog = dynamic(() => import("./components/pkgx-link-dialog").then(mod => ({ default: mod.PkgxLinkDialog })), { ssr: false });
const ProductImportDialog = dynamic(() => import("./components/product-import-export-dialogs").then(mod => ({ default: mod.ProductImportDialog })), { ssr: false });
const ProductExportDialog = dynamic(() => import("./components/product-import-export-dialogs").then(mod => ({ default: mod.ProductExportDialog })), { ssr: false });

const defaultTableState: ProductQueryParams = { search: '', statusFilter: 'all', typeFilter: 'all', categoryFilter: 'all', brandFilter: 'all', comboFilter: 'all', stockLevelFilter: 'all', pkgxFilter: 'all', dateRange: undefined, pagination: { pageIndex: 0, pageSize: 20 }, sorting: DEFAULT_PRODUCT_SORT };

// Workflow card definitions
const PRODUCT_CARDS = [
  { key: 'all', label: 'Tổng sản phẩm', filter: {} },
  { key: 'sold', label: 'SL hàng bán ra', filter: {} },
  { key: 'netSold', label: 'SL hàng thực bán', filter: {} },
  { key: 'revenue', label: 'Tiền hàng', filter: {} },
  { key: 'returnValue', label: 'Tiền hàng trả lại', filter: {} },
  { key: 'inStock', label: 'Có hàng', filter: { stockLevelFilter: 'in-stock' as const } },
  { key: 'outOfStock', label: 'Hết hàng', filter: { stockLevelFilter: 'out-of-stock' as const } },
  { key: 'warehouseValue', label: 'Giá trị kho', filter: {} },
] as const;

type ProductCardKey = typeof PRODUCT_CARDS[number]['key'];

/** Resolve display value for each card */
function getProductCardData(key: ProductCardKey, stats: ProductStats | undefined) {
  switch (key) {
    case 'all':
      return { value: formatNumber(stats?.totalProducts ?? 0) };
    case 'sold':
      return { value: formatNumber(Number(stats?.quantitySold ?? 0)) };
    case 'netSold':
      return { value: formatNumber(Number(stats?.netQuantitySold ?? 0)), variant: 'success' as const };
    case 'revenue':
      return { value: formatCurrency(Number(stats?.revenue ?? 0)), variant: 'success' as const };
    case 'returnValue':
      return { value: formatCurrency(Number(stats?.returnValue ?? 0)), variant: 'danger' as const };
    case 'inStock':
      return { value: formatNumber(stats?.inStock ?? 0), variant: 'success' as const };
    case 'outOfStock':
      return { value: formatNumber(stats?.outOfStock ?? 0), variant: (stats?.outOfStock ?? 0) > 0 ? 'danger' as const : undefined };
    case 'warehouseValue':
      return { value: formatCurrency(Number(stats?.totalValue ?? 0)) };
    default:
      return { value: '0' };
  }
}

// Props from Server Component
export interface ProductsPageProps {
  initialStats?: {
    totalProducts: number;
    inStock: number;
    outOfStock: number;
    totalValue: number;
    deletedCount?: number;
    quantitySold: number;
    quantityReturned: number;
    netQuantitySold: number;
    orderCount: number;
    customerCount: number;
    revenue: number;
    returnValue: number;
  };
}

export function ProductsPage({ initialStats }: ProductsPageProps = {}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const queryClient = useQueryClient();
  const router = useRouter();
  
  // Stats from server component
  const { data: stats } = useProductStats(initialStats);
  
  // React Query hooks - NO Zustand store
  const { restore: restoreMutation } = useTrashMutations();
  const { update: updateMutation, remove: deleteMutation } = useProductMutations({
    onDeleteSuccess: () => {
      toast.success('Đã chuyển sản phẩm vào thùng rác');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
  // ✅ Inline edit mutation — skip cache invalidation (optimistic update is enough)
  const { update: inlineUpdateMutation } = useProductMutations({
    skipInvalidateOnUpdate: true,
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
  
  // ⚡ CONSOLIDATED: 5 API calls → 1 (categories, brands, suppliers, pricing policies, store info)
  const { activeCategories, findCategoryById, findBrandById, findSupplierById, pricingPolicies, storeInfo, brands: allBrands } = useProductPageData();
  const {  employee: authEmployee, can } = useAuth();
  const canCreate = can('create_products');
  const canDelete = can('delete_products');
  const canEdit = can('edit_products');
  const canEditSettings = can('edit_settings');
  const { print: printSingleLabel, printMultiple } = usePrint();

  // Build lookups for columns (replaces Zustand store .getState() calls)
  const columnLookups: ColumnLookups = React.useMemo(() => ({
    findCategory: findCategoryById,
    findBrand: findBrandById,
    findSupplier: findSupplierById,
    pricingPolicies,
  }), [findCategoryById, findBrandById, findSupplierById, pricingPolicies]);
  
  // PKGX settings - use lightweight hook (no pkgxProducts for better performance)
  const { data: pkgxSettings } = usePkgxMappings();
  const { addLog } = usePkgxLogMutations();
  const addPkgxLog = React.useCallback((log: Parameters<typeof addLog.mutate>[0]) => addLog.mutate(log), [addLog]);
  
  // Get all sync handlers from usePkgxSync (sử dụng chung cho tất cả)
  // ⚡ Pass brand/pricing data from consolidated hook to avoid duplicate API calls
  const pkgxSyncHandlers = usePkgxSync({ addPkgxLog, brandFinder: findBrandById as (id: string) => { systemId: string; name: string } | undefined, pricingPolicies: pricingPolicies as Array<{ systemId: string; name: string; type: string; isActive: boolean; isDefault: boolean }> });
  
  // Pass handlers to bulk sync so it uses the same logic
  const { confirmAction: bulkConfirmAction, progress: bulkProgress, triggerBulkSync, executeAction: executeBulkAction, cancelConfirm: cancelBulkConfirm } = usePkgxBulkSync({ 
    entityType: 'product', 
    productSyncHandlers: pkgxSyncHandlers,
    onLog: addPkgxLog 
  });

  const deletedCount = stats?.deletedCount ?? 0;
  const defaultSellingPolicy = React.useMemo(() => pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault), [pricingPolicies]);
  const storeSettings = React.useMemo(() => createStoreSettings(storeInfo), [storeInfo]);

  const [activeCard, setActiveCard] = React.useState<ProductCardKey | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [isFilterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const [isActionsSheetOpen, setActionsSheetOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [pkgxLinkDialogOpen, setPkgxLinkDialogOpen] = React.useState(false);
  const [productToLink, setProductToLink] = React.useState<Product | null>(null);

  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('products', { visibility: { origin: false, usageGuide: false, importerName: false }, pinned: ['select', 'actions'] });
  const [tableState, setTableState] = useUrlTableState(defaultTableState);

  const headerActions = React.useMemo(() => [
    canDelete && <Button key="trash" variant="outline" size="sm" className="h-9" onClick={() => router.push('/products/trash')}><Package className="mr-2 h-4 w-4" />Thùng rác ({deletedCount})</Button>,
    canCreate && <DropdownMenu key="add-menu"><DropdownMenuTrigger asChild><Button size="sm" className="h-9"><PlusCircle className="mr-2 h-4 w-4" />Thêm sản phẩm</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => router.push('/products/new')}><Package className="mr-2 h-4 w-4" />Thêm sản phẩm đơn</DropdownMenuItem><DropdownMenuItem onClick={() => router.push('/products/new?type=combo')}><Layers className="mr-2 h-4 w-4" />Thêm Combo</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
  ], [deletedCount, router, canDelete, canCreate]);
  usePageHeader({ title: 'Danh sách sản phẩm', breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Sản phẩm', href: '/products', isCurrent: true }], actions: headerActions, showBackButton: false });

  const handleDelete = React.useCallback((systemId: string) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleRestore = React.useCallback((systemId: string) => { 
    restoreMutation.mutate(systemId, { 
      onSuccess: () => toast.success('Đã khôi phục sản phẩm'),
      onError: (error) => toast.error('Lỗi: ' + error.message)
    }); 
  }, [restoreMutation]);

  const handlePrintLabel = React.useCallback((product: Product) => {
    const catName = product.categorySystemId ? findCategoryById(product.categorySystemId)?.name || product.category : product.category;
    const brandName = product.brandSystemId ? findBrandById(product.brandSystemId)?.name || '' : '';
    const defPrice = defaultSellingPolicy ? product.prices?.[defaultSellingPolicy.systemId] : undefined;
    printSingleLabel('product-label', { data: mapProductToLabelPrintData(product, storeSettings, { category: catName, brand: brandName, price: defPrice ?? 0 }) });
  }, [printSingleLabel, storeSettings, defaultSellingPolicy, findBrandById, findCategoryById]);

  const _buildPkgxPayload = React.useCallback((product: Product): PkgxProductPayload => {
    if (!pkgxSettings) {
      throw new Error('PKGX settings not loaded');
    }
    const catMap = pkgxSettings.categoryMappings?.find(m => m.hrmCategorySystemId === product.categorySystemId);
    const brand = product.brandSystemId ? findBrandById(product.brandSystemId) : undefined;
    const brandMap = brand ? pkgxSettings.brandMappings?.find(m => m.hrmBrandSystemId === brand.systemId) : undefined;
    const priceMapping = pkgxSettings.priceMapping ?? {};
    let shopPrice = product.costPrice || 0;
    if (priceMapping.shopPrice && product.prices[priceMapping.shopPrice]) shopPrice = product.prices[priceMapping.shopPrice];
    else if (defaultSellingPolicy) shopPrice = product.prices[defaultSellingPolicy.systemId] || shopPrice;
    const totalInventory = product.inventoryByBranch ? Object.values(product.inventoryByBranch).reduce((s, q) => s + (q || 0), 0) : 0;
    const seo = product.seoPkgx;
    const isActive = product.status?.toString().toUpperCase() === 'ACTIVE';
    return { goods_name: product.name, goods_sn: product.id, cat_id: catMap?.pkgxCatId || 0, brand_id: brandMap?.pkgxBrandId || 0, seller_note: product.sellerNote || '', shop_price: shopPrice, goods_number: totalInventory, goods_desc: seo?.longDescription || product.description || '', goods_brief: seo?.shortDescription || product.shortDescription || '', keywords: seo?.seoKeywords || product.tags?.join(', ') || product.name, meta_title: seo?.seoTitle || product.ktitle || product.name, meta_desc: seo?.metaDescription || product.seoDescription || '', original_img: product.thumbnailImage || product.images?.[0] || '', gallery_images: product.galleryImages || product.images || [], best: product.isFeatured || false, hot: product.isBestSeller || false, new: product.isNewArrival || false, ishome: product.isFeatured || false, is_on_sale: product.isPublished ?? isActive };
  }, [pkgxSettings, defaultSellingPolicy, findBrandById]);

  // handlePkgxLink vẫn cần local vì mở dialog
  const handlePkgxLink = React.useCallback((p: Product) => { setProductToLink(p); setPkgxLinkDialogOpen(true); }, []);
  const handlePkgxLinkSuccess = React.useCallback((pkgxId: number) => { if (productToLink) queryClient.setQueriesData<ProductQueryResult>({ queryKey: ['products'] }, old => old?.items ? { ...old, items: old.items.map(it => it.systemId === productToLink.systemId ? { ...it, pkgxId } : it) } : old); }, [productToLink, queryClient]);

  // ✅ Tạo object chứa tất cả PKGX handlers để truyền cho columns
  const pkgxHandlers = React.useMemo(() => ({
    onPkgxPublish: pkgxSyncHandlers.handlePkgxPublish,
    onPkgxUnlink: pkgxSyncHandlers.handlePkgxUnlink,
    onPkgxSyncImages: pkgxSyncHandlers.handlePkgxSyncImages,
    onPkgxSyncAll: pkgxSyncHandlers.handlePkgxSyncAll,
    onPkgxSyncBasicInfo: pkgxSyncHandlers.handlePkgxSyncBasicInfo,
    onPkgxUpdatePrice: pkgxSyncHandlers.handlePkgxUpdatePrice,
    onPkgxSyncInventory: pkgxSyncHandlers.handlePkgxSyncInventory,
    onPkgxUpdateSeo: pkgxSyncHandlers.handlePkgxUpdateSeo,
    onPkgxSyncDescription: pkgxSyncHandlers.handlePkgxSyncDescription,
    onPkgxSyncFlags: pkgxSyncHandlers.handlePkgxSyncFlags,
    onPkgxLink: handlePkgxLink,
  }), [pkgxSyncHandlers, handlePkgxLink]);

  // ✅ PHASE 2: Optimistic updates với rollback on error
  const handleStatusChange = React.useCallback((p: Product, ns: 'ACTIVE' | 'INACTIVE') => {
    const previousStatus = p.status;
    // Optimistic update
    queryClient.setQueriesData<ProductQueryResult>({ queryKey: ['products'] }, old => old?.items ? { ...old, items: old.items.map(it => it.systemId === p.systemId ? { ...it, status: ns } : it) } : old);
    toast.success(`${p.name}: ${ns === 'ACTIVE' ? 'Đang bán' : 'Ngừng bán'}`);
    // Mutate with rollback — inlineUpdateMutation skips cache invalidation
    inlineUpdateMutation.mutate({ systemId: p.systemId, status: ns }, {
      onError: () => {
        queryClient.setQueriesData<ProductQueryResult>({ queryKey: ['products'] }, old => old?.items ? { ...old, items: old.items.map(it => it.systemId === p.systemId ? { ...it, status: previousStatus } : it) } : old);
        toast.error('Cập nhật thất bại, đã khôi phục');
      }
    });
  }, [inlineUpdateMutation, queryClient]);

  const handleFieldUpdate = React.useCallback((p: Product, field: string, val: string | number | boolean) => {
    let ud: Partial<Product>;
    let previousValue: unknown;
    if (field === 'dimensions') {
      // Parse "L×W×H" string into dimensions object
      const parts = String(val).split(/[×x×]/i).map(s => parseFloat(s.trim()) || 0);
      previousValue = p.dimensions;
      ud = { dimensions: { length: parts[0] || 0, width: parts[1] || 0, height: parts[2] || 0 } } as Partial<Product>;
    } else if (field.startsWith('prices.')) {
      const pid = field.replace('prices.', '');
      previousValue = p.prices?.[pid];
      ud = { prices: { ...p.prices, [pid]: val as number } };
    } else {
      previousValue = (p as Record<string, unknown>)[field];
      ud = { [field]: val } as Partial<Product>;
    }
    // Optimistic update
    queryClient.setQueriesData<ProductQueryResult>({ queryKey: ['products'] }, old => old?.items ? { ...old, items: old.items.map(it => it.systemId === p.systemId ? { ...it, ...ud } : it) } : old);
    const labels: Record<string, string> = { id: 'Mã SP (SKU)', name: 'Tên sản phẩm', weight: 'Khối lượng', dimensions: 'Kích thước', nameVat: 'Tên hàng hóa (VAT)', origin: 'Xuất xứ', usageGuide: 'HDSD', importerName: 'Tem phụ', pkgxId: 'ID PKGX', reorderLevel: 'Mức đặt hàng lại', safetyStock: 'Tồn kho an toàn', maxStock: 'Mức tồn tối đa', sellerNote: 'Ghi chú', isPublished: 'Đăng web', isFeatured: 'Nổi bật', isNewArrival: 'Mới về', isBestSeller: 'Bán chạy' };
    const lbl = field.startsWith('prices.') ? 'Giá' : (labels[field] || field);
    const dv = typeof val === 'boolean' ? (val ? 'Bật' : 'Tắt') : val;
    toast.success(`Đã cập nhật ${lbl}: ${dv}`);
    // Mutate with rollback — inlineUpdateMutation skips cache invalidation
    inlineUpdateMutation.mutate({ systemId: p.systemId, ...ud }, {
      onError: () => {
        let rollback: Partial<Product>;
        if (field.startsWith('prices.')) {
          const pid = field.replace('prices.', '');
          rollback = { prices: { ...p.prices, [pid]: previousValue as number } };
        } else {
          rollback = { [field]: previousValue } as Partial<Product>;
        }
        queryClient.setQueriesData<ProductQueryResult>({ queryKey: ['products'] }, old => old?.items ? { ...old, items: old.items.map(it => it.systemId === p.systemId ? { ...it, ...rollback } : it) } : old);
        toast.error('Cập nhật thất bại, đã khôi phục');
      }
    });
  }, [inlineUpdateMutation, queryClient]);

  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, router, handlePrintLabel, pkgxHandlers, handleStatusChange, undefined, handleFieldUpdate, columnLookups), [handleDelete, handleRestore, router, handlePrintLabel, pkgxHandlers, handleStatusChange, handleFieldUpdate, columnLookups]);

  const [isFilterPending, startFilterTransition] = React.useTransition();
  const updateTableState = React.useCallback((updater: (prev: ProductQueryParams) => ProductQueryParams) => { setTableState(prev => updater(prev)); }, [setTableState]);
  const { handleSearchChange, handleStatusFilterChange, handleTypeFilterChange, handleCategoryFilterChange, handleComboFilterChange, handleStockLevelFilterChange, handlePkgxFilterChange, handleDateRangeChange, handlePaginationChange, handleSortingChange } = useTableStateHandlers({ updateTableState, startFilterTransition });

  // Defer search for query to avoid re-fetching on every keystroke
  const deferredSearch = React.useDeferredValue(tableState.search);
  const queryParams = React.useMemo(() => ({ ...tableState, search: deferredSearch }), [tableState, deferredSearch]);
  const { data: queryResult, isLoading, isFetching } = useProductsQuery(queryParams);
  const pageData = React.useMemo(() => queryResult?.items ?? [], [queryResult?.items]);
  const totalRows = queryResult?.total ?? 0, pageCount = queryResult?.pageCount ?? 1;

  const categoryOptions = React.useMemo(() => activeCategories.map(c => ({ label: c.path || c.name, value: c.systemId })).sort((a, b) => a.label.localeCompare(b.label)), [activeCategories]);
  const stockLevelCounts = React.useMemo(() => { const prods = pageData.filter(p => !p.isDeleted); const c = { outOfStock: 0, lowStock: 0, belowSafety: 0, highStock: 0 }; prods.forEach(p => { const t = Object.values(p.inventoryByBranch || {}).reduce((s, q) => s + q, 0); if (t <= 0) c.outOfStock++; if (t > 0 && p.reorderLevel !== undefined && t <= p.reorderLevel) c.lowStock++; if (p.safetyStock !== undefined && t < p.safetyStock) c.belowSafety++; if (p.maxStock !== undefined && t > p.maxStock) c.highStock++; }); return c; }, [pageData]);

  const brandOptions = React.useMemo(() => allBrands.map(b => ({ label: b.name, value: b.systemId })).sort((a, b) => a.label.localeCompare(b.label)), [allBrands]);

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('products');
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'status', label: 'Trạng thái', type: 'select' as const, options: [{ value: 'active', label: 'Hoạt động' }, { value: 'inactive', label: 'Tạm ngừng' }, { value: 'discontinued', label: 'Ngừng kinh doanh' }] },
    { id: 'type', label: 'Loại sản phẩm', type: 'select' as const, options: [{ value: 'physical', label: 'Hàng hóa' }, { value: 'service', label: 'Dịch vụ' }, { value: 'digital', label: 'Sản phẩm số' }] },
    { id: 'category', label: 'Danh mục', type: 'select' as const, options: categoryOptions },
    { id: 'brand', label: 'Thương hiệu', type: 'select' as const, options: brandOptions },
    { id: 'combo', label: 'Combo', type: 'select' as const, options: [{ value: 'combo', label: 'Chỉ Combo' }, { value: 'non-combo', label: 'Không phải Combo' }] },
    { id: 'stockLevel', label: 'Mức tồn kho', type: 'select' as const, options: [{ value: 'out-of-stock', label: `Hết hàng (${stockLevelCounts.outOfStock})` }, { value: 'low-stock', label: `Sắp hết (${stockLevelCounts.lowStock})` }, { value: 'below-safety', label: `Dưới an toàn (${stockLevelCounts.belowSafety})` }, { value: 'high-stock', label: `Tồn cao (${stockLevelCounts.highStock})` }] },
    { id: 'pkgx', label: 'Trạng thái PKGX', type: 'select' as const, options: [{ value: 'linked', label: 'Đã liên kết PKGX' }, { value: 'not-linked', label: 'Chưa liên kết PKGX' }] },
    { id: 'dateRange', label: 'Ngày tạo', type: 'date-range' as const },
  ], [categoryOptions, brandOptions, stockLevelCounts]);
  const panelValues = React.useMemo(() => ({
    status: tableState.statusFilter !== 'all' ? tableState.statusFilter : null,
    type: tableState.typeFilter !== 'all' ? tableState.typeFilter : null,
    category: tableState.categoryFilter !== 'all' ? tableState.categoryFilter : null,
    brand: tableState.brandFilter !== 'all' ? tableState.brandFilter : null,
    combo: tableState.comboFilter !== 'all' ? tableState.comboFilter : null,
    stockLevel: tableState.stockLevelFilter !== 'all' ? tableState.stockLevelFilter : null,
    pkgx: tableState.pkgxFilter !== 'all' ? tableState.pkgxFilter : null,
    dateRange: tableState.dateRange ? { from: tableState.dateRange[0], to: tableState.dateRange[1] } : null,
  }), [tableState.statusFilter, tableState.typeFilter, tableState.categoryFilter, tableState.brandFilter, tableState.comboFilter, tableState.stockLevelFilter, tableState.pkgxFilter, tableState.dateRange]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    const dr = v.dateRange as { from?: string; to?: string } | null;
    startFilterTransition(() => {
      updateTableState(p => ({
        ...p,
        statusFilter: ((v.status as string) || 'all') as typeof p.statusFilter,
        typeFilter: ((v.type as string) || 'all') as typeof p.typeFilter,
        categoryFilter: (v.category as string) || 'all',
        brandFilter: (v.brand as string) || 'all',
        comboFilter: ((v.combo as string) || 'all') as typeof p.comboFilter,
        stockLevelFilter: ((v.stockLevel as string) || 'all') as typeof p.stockLevelFilter,
        pkgxFilter: ((v.pkgx as string) || 'all') as typeof p.pkgxFilter,
        dateRange: dr ? [dr.from, dr.to] : undefined,
        pagination: { ...p.pagination, pageIndex: 0 },
      }));
    });
  }, [updateTableState, startFilterTransition]);
  // Note: Export dialog will use pageData for export. For full filtered export, fetch on demand in dialog.
  const selectedProducts = React.useMemo(() => pageData.filter(p => rowSelection[p.systemId]), [pageData, rowSelection]);
  const allSelectedRows = selectedProducts;

  const handleImport = useProductImportHandler({ authEmployeeSystemId: authEmployee?.systemId });
  const confirmDelete = () => { 
    if (idToDelete) { 
      deleteMutation.mutate(idToDelete);
    } 
    setIsAlertOpen(false); 
    setIdToDelete(null); 
  };

  const renderFilterControls = () => <ProductFilterControls tableState={tableState} categoryOptions={categoryOptions} stockLevelCounts={stockLevelCounts} onStatusFilterChange={handleStatusFilterChange} onTypeFilterChange={handleTypeFilterChange} onCategoryFilterChange={handleCategoryFilterChange} onComboFilterChange={handleComboFilterChange} onStockLevelFilterChange={handleStockLevelFilterChange} onPkgxFilterChange={handlePkgxFilterChange} onDateRangeChange={handleDateRangeChange} />;

  const handlePrintLabels = React.useCallback((prods: Product[]) => { if (!prods.length) return; const opts = prods.map(p => { const cat = p.categorySystemId ? findCategoryById(p.categorySystemId)?.name || p.category : p.category; const br = p.brandSystemId ? findBrandById(p.brandSystemId)?.name || '' : ''; const pr = defaultSellingPolicy ? p.prices?.[defaultSellingPolicy.systemId] : undefined; return { data: mapProductToLabelPrintData(p, storeSettings, { category: cat, brand: br, price: pr ?? 0 }) }; }); printMultiple('product-label', opts); }, [printMultiple, storeSettings, defaultSellingPolicy, findBrandById, findCategoryById]);
  const { bulkDelete, bulkUpdateStatus } = useBulkProductMutations({
    onSuccess: () => toast.success('Thao tác hàng loạt thành công'),
    onError: (err) => toast.error(err.message || 'Thao tác hàng loạt thất bại'),
  });
  const handleBulkUpdate = React.useCallback((systemId: string, data: Partial<Product>) => { updateMutation.mutate({ systemId, ...data }); }, [updateMutation]);
  const bulkActions = React.useMemo(() => createBulkActions({ handlePrintLabels, bulkDelete: (ids) => bulkDelete.mutate(ids), bulkUpdateStatus: (p) => bulkUpdateStatus.mutate(p), setRowSelection }), [handlePrintLabels, bulkDelete, bulkUpdateStatus]);
  const pkgxBulkActions = React.useMemo(() => createPkgxBulkActions({ triggerBulkSync, update: handleBulkUpdate, setRowSelection }), [triggerBulkSync, handleBulkUpdate]);

  // ✅ PHASE 2: Prefetch product data when hovering row for faster detail page load
  const handleRowHover = React.useCallback((r: Product) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(r.systemId),
      queryFn: () => fetchProduct(r.systemId),
      staleTime: 60_000,
    });
  }, [queryClient]);

  const handleRowClick = React.useCallback((r: Product) => { router.push(`/products/${r.systemId}`); }, [router]);
  const renderMobileCard = React.useCallback((p: Product) => <MobileProductCard product={p} categories={activeCategories as unknown as import("@/features/settings/inventory/types").ProductCategory[]} onRowClick={handleRowClick} onDelete={handleDelete} canEdit={canEdit} canDelete={canDelete} />, [activeCategories, handleRowClick, handleDelete, canEdit, canDelete]);

  return (
    <ListPageShell>
      {/* Workflow Cards */}
      <div className="overflow-x-auto mb-2">
        <ToggleGroup
          type="single"
          value={activeCard ?? ''}
          onValueChange={(val) => {
            const key = val as ProductCardKey | '';
            const card = PRODUCT_CARDS.find(c => c.key === key);
            if (!key || key === activeCard) {
              setActiveCard(null);
              startFilterTransition(() => setTableState(prev => ({ ...prev, stockLevelFilter: 'all', pagination: { ...prev.pagination, pageIndex: 0 } })));
            } else if (card && 'stockLevelFilter' in card.filter) {
              setActiveCard(key);
              const f = card.filter as { stockLevelFilter: string };
              startFilterTransition(() => setTableState(prev => ({ ...prev, stockLevelFilter: f.stockLevelFilter as ProductQueryParams['stockLevelFilter'], pagination: { ...prev.pagination, pageIndex: 0 } })));
            } else {
              setActiveCard(key === activeCard ? null : key);
            }
          }}
          className="justify-start gap-1.5 min-w-max pb-1"
        >
          {PRODUCT_CARDS.map(card => {
            const { value, variant } = getProductCardData(card.key, stats);
            const colorClass = variant === 'danger' ? 'text-red-600' : variant === 'success' ? 'text-green-600' : '';
            return (
              <ToggleGroupItem
                key={card.key}
                value={card.key}
                variant="outline"
                className="h-auto shrink-0 rounded-lg px-3.5 py-2 text-left data-[state=on]:bg-primary/5 data-[state=on]:border-primary data-[state=on]:ring-1 data-[state=on]:ring-primary"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm">{card.label}</span>
                  <span className={`text-sm font-semibold tabular-nums ${colorClass}`}>{value}</span>
                </div>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      {!isMobile ? <PageToolbar className="flex-wrap gap-2" leftActions={<>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/pricing')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}<Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}><FileUp className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />} /> : (<><div className="py-3"><Button type="button" variant="outline" size="sm" className="w-full justify-center gap-2" onClick={() => setActionsSheetOpen(true)}><Settings2 className="h-4 w-4" />Tùy chọn bảng</Button></div><Sheet open={isActionsSheetOpen} onOpenChange={setActionsSheetOpen}><SheetContent side="bottom" className="space-y-4"><SheetHeader><SheetTitle>Hành động nhanh</SheetTitle><SheetDescription>Nhập, xuất và tùy chỉnh cột.</SheetDescription></SheetHeader><div className="space-y-3"><Button className="w-full justify-center" variant="outline" onClick={() => { setActionsSheetOpen(false); setIsImportOpen(true); }}>Nhập sản phẩm</Button><Button className="w-full justify-center" variant="outline" onClick={() => { setActionsSheetOpen(false); setIsExportOpen(true); }}>Xuất danh sách</Button><DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns}><Button className="w-full justify-center gap-2" variant="outline"><Columns3 className="h-4 w-4" />Tuỳ chỉnh cột</Button></DataTableColumnCustomizer></div></SheetContent></Sheet></>)}

      {!isMobile ? <PageFilters searchValue={tableState.search} onSearchChange={handleSearchChange} searchPlaceholder="Tìm kiếm sản phẩm...">{renderFilterControls()}<AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} /></PageFilters> : (<><PageFilters searchValue={tableState.search} onSearchChange={handleSearchChange} searchPlaceholder="Tìm kiếm sản phẩm..."><Button type="button" variant="outline" size="sm" className="w-full sm:w-auto justify-center gap-2" onClick={() => setFilterSheetOpen(true)}><SlidersHorizontal className="h-4 w-4" />Bộ lọc nâng cao</Button></PageFilters><Sheet open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}><SheetContent side="bottom" className="space-y-4"><SheetHeader><SheetTitle>Bộ lọc sản phẩm</SheetTitle><SheetDescription>Lọc theo trạng thái, loại, danh mục.</SheetDescription></SheetHeader><div className="space-y-3">{renderFilterControls()}</div></SheetContent></Sheet></>)}
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />

      <div className={cn("pb-4", (isFilterPending || (isFetching && !isLoading)) && "opacity-60 transition-opacity")}><ResponsiveDataTable columns={columns} data={pageData} renderMobileCard={renderMobileCard} pageCount={pageCount} pagination={tableState.pagination} setPagination={handlePaginationChange} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} onBulkDelete={undefined} bulkActions={bulkActions} pkgxBulkActions={pkgxBulkActions} sorting={tableState.sorting} setSorting={handleSortingChange} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} onRowHover={handleRowHover} emptyTitle="Không có sản phẩm" emptyDescription="Thêm sản phẩm đầu tiên để bắt đầu" isLoading={isLoading} mobileInfiniteScroll /></div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle><AlertDialogDescription>Sản phẩm sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Hủy</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <ProductImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} existingData={pageData} onImport={handleImport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : undefined} />
      <ProductExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} allData={pageData} filteredData={pageData} currentPageData={pageData} selectedData={selectedProducts} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : { systemId: asSystemId('SYSTEM'), name: 'System' }} />
      <PkgxLinkDialog open={pkgxLinkDialogOpen} onOpenChange={setPkgxLinkDialogOpen} product={productToLink} onSuccess={handlePkgxLinkSuccess} />
      <PkgxBulkSyncConfirmDialog confirmAction={bulkConfirmAction} progress={bulkProgress} onConfirm={executeBulkAction} onCancel={cancelBulkConfirm} />
      {isMobile && canCreate && <FAB onClick={() => router.push('/products/new')} />}
    </ListPageShell>
  );
}
